// Zevoy state probe. Paste the whole file into javascript_tool on a
// hub.production.zevoy.com/.../my-zevoy/... page once it has loaded (wait 3 s
// after navigating). It reads only what the app has already fetched (its
// Apollo cache) and sends nothing. Re-run after every navigation; edits show
// up only after the page is reloaded.
//
// Settings, put in front of the file in the same call:
//   window.ZEVOY_REQUIRED_TAGS = ['Country', 'Team']; // tag labels from the data folder's profile.md
//   window.ZEVOY_PAGE = 0;  // javascript_tool output is cut near 1,000 chars,
//                           // so rows come 10 at a time; raise for the next 10
//
// Returns JSON:
//   n:      pending expense rows in total
//   rows:   [id, merchant, purchase time (Helsinki), EUR, category, VAT %, missing]
//   claims: [claimID, type, EUR, description start, period]
//   pool:   unmatched receipts
// `missing` lists what a row still needs: receipt, description and any empty
// required tag. Zevoy's own readyToSubmit stays empty even when all of these
// are missing, so do not rely on it. Open /transactions/pending for rows and
// /claims/all for claims.
(() => {
  const REQUIRED_TAGS = window.ZEVOY_REQUIRED_TAGS || [];
  const PAGE = window.ZEVOY_PAGE || 0;
  const c = window.__APOLLO_CLIENT__;
  if (!c) return 'no Apollo client yet: wait for the page to finish loading';
  const qs = [...c.getObservableQueries('all').values()];
  const data = q => (q && q.getCurrentResult() || {}).data;
  const only = (name, status) => qs.find(q => q.queryName === name &&
    (q.variables.status || []).join() === status);
  const local = s => s ? new Date(s).toLocaleString('sv-SE', {timeZone: 'Europe/Helsinki'}).slice(5, 16) : '';
  const tagsOf = x => Object.fromEntries((x.tags || []).map(g => [g.tag && g.tag.name, g.value]));
  const out = {};

  const exp = data(only('getCardholderReviewItems', 'pending'));
  if (exp) {
    const all = exp.userOrganization.listReviewItems.edges.flatMap(({edge: t}) =>
      (t.expenses || []).map(x => {
        const tags = tagsOf(x);
        const missing = [];
        if (!(t.receipts || []).length) missing.push('receipt');
        if (!x.description) missing.push('description');
        REQUIRED_TAGS.forEach(n => { if (!tags[n]) missing.push(n); });
        return [t.id, t.text.replace(/\s+/g, ' ').trim().slice(0, 16), local(t.time),
          x.value && x.value.amount, (x.category && x.category.name || '').slice(0, 20),
          (x.taxRates || []).map(r => +r.percent).join('+'), missing.join(',')];
      }));
    out.n = all.length;
    out.rows = all.slice(PAGE * 10, PAGE * 10 + 10);
  }

  const cl = data(only('getCardholderTravelClaimItems', 'pending'));
  if (cl) out.claims = cl.userOrganization.reviewItems.edges.map(({edge: k}) => {
    const x = k.expense || (k.expenses || [])[0] || {};
    const pd = k.perDiem && (k.perDiem.ratedEntries || [])[0];
    return [k.claimID, k.type, k.convertedAmount && k.convertedAmount.amount,
      (x.description || '').slice(0, 40),
      pd ? local(pd.travelToDestinationStart) + ' > ' + local(pd.travelFromDestinationStop) : ''];
  });

  const pool = data(qs.find(q => q.queryName === 'getCardholderUnmatchedReceipts'));
  if (pool) out.pool = (pool.userOrganization.unmatchedReceiptsPaginated || {}).totalCount;
  if (!exp && !cl) out.hint = 'open my-zevoy/transactions/pending or my-zevoy/claims/all first';
  return JSON.stringify(out);
})()
