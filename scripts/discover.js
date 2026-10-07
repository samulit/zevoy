// Zevoy discovery for the first run. Paste the whole file into javascript_tool
// with one section chosen in the same call, e.g.
//   window.ZEVOY_DISCOVER = 'orgs';
// Like state.js it only reads what the page has already loaded (its Apollo
// cache and the visible form); it fetches nothing and touches no tokens.
// javascript_tool output is cut near 1,000 characters, so each section is
// small; long lists come in pages of 15 (window.ZEVOY_PAGE = 0, 1, ...).
//
// Section   Open this page first                         Returns
// orgs      any my-zevoy page                            user name, organisations with ids and roles
// tags      an expense edit form in that organisation    tag fields and their options
// cats      an expense edit form in that organisation    category groups and categories (paged)
// cards     my-zevoy/cards in that organisation          card name, type, last four, liability
// inbox     click your name (opens "My details")         the RECEIPT EMAIL address
(() => {
  const SECTION = window.ZEVOY_DISCOVER || 'orgs';
  const PAGE = window.ZEVOY_PAGE || 0;
  const c = window.__APOLLO_CLIENT__;
  if (!c) return 'no Apollo client yet: wait for the page to finish loading';
  const qs = [...c.getObservableQueries('all').values()];
  const data = name => {
    const q = qs.find(q => q.queryName === name);
    return q && (q.getCurrentResult() || {}).data;
  };
  const page = list => ({total: list.length, page: PAGE, items: list.slice(PAGE * 15, PAGE * 15 + 15)});
  const org = location.pathname.split('/')[2];

  if (SECTION === 'orgs') {
    const me = (data('me') || {}).me;
    if (!me) return 'open any my-zevoy page first';
    const orgs = {};
    (me.roles || []).forEach(r => {
      const o = r.organization || {};
      (orgs[o.id] = orgs[o.id] || {name: o.name, roles: []}).roles.push(r.role);
    });
    return JSON.stringify({user: me.fullName, current: org,
      orgs: Object.entries(orgs).map(([id, o]) => [o.name, id, o.roles.join('+')])});
  }

  if (SECTION === 'tags') {
    const d = data('getOrganizationTags');
    if (!d) return 'open an expense edit form in this organisation first';
    return JSON.stringify({org, tags: d.organization.tags.filter(t => t.status === 'enabled').map(t => {
      const ch = (t.choices || []).filter(x => x.status === 'enabled').map(x => x.name);
      return [t.name, ch.length, ch.slice(0, 12)];
    })});
  }

  if (SECTION === 'cats') {
    const d = data('getOrganizationCategoryGroups');
    if (!d) return 'open an expense edit form in this organisation first';
    const list = d.organization.categoryGroups.filter(g => g.status === 'enabled')
      .flatMap(g => (g.categories || []).filter(x => x.status !== 'disabled')
        .map(x => [g.name, x.name, x.ledgerAccount && x.ledgerAccount.account]));
    return JSON.stringify({org, ...page(list)});
  }

  if (SECTION === 'cards') {
    const d = data('getUserCards');
    if (!d) return 'open my-zevoy/cards in this organisation first';
    return JSON.stringify({org, cards: d.me.userOrganization.cards.map(k =>
      [k.cardName, k.cardType, k.lastFour, k.liabilityType, k.status])});
  }

  if (SECTION === 'inbox') {
    const inp = [...document.querySelectorAll('input')].find(i => /@receipts\.zevoy\.com$/.test(i.value || ''));
    return inp ? JSON.stringify({receiptInbox: inp.value})
      : 'click your name at the top right to open "My details" first';
  }

  return 'unknown section: use orgs, tags, cats, cards or inbox';
})()
