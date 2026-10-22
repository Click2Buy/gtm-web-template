// Deferred: cookie banner (CookieConsent, open source CMP), status panel and test buttons

// The banner pushes the consent update and a dataLayer event, like Cookiebot's `cookie_consent_update`
const pushConsent = () => {
  gtag('consent', 'update', {
    analytics_storage: CookieConsent.acceptedCategory('analytics') ? 'granted' : 'denied'
  });
  dataLayer.push({ event: CONSENT_EVENT });
};

CookieConsent.run({
  categories: {
    necessary: { enabled: true, readOnly: true },
    analytics: {}
  },
  onConsent: pushConsent,
  onChange: pushConsent,
  language: {
    default: 'en',
    translations: {
      en: {
        consentModal: {
          title: 'Cookies',
          description: 'Test banner: "Accept all" grants analytics_storage, "Reject all" keeps it denied.',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Manage preferences'
        },
        preferencesModal: {
          title: 'Cookie preferences',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          savePreferencesBtn: 'Save preferences',
          sections: [
            { title: 'Necessary', linkedCategory: 'necessary' },
            { title: 'Audience measurement (analytics_storage)', linkedCategory: 'analytics' }
          ]
        }
      }
    }
  }
});

const getCookie = name => {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
};

const renderStatus = () => {
  const c2b = window.C2B || {};
  const rows = {
    'analytics_storage': CookieConsent.acceptedCategory('analytics') ? 'granted' : 'denied',
    'Click2Buy script loaded (C2B.attribution)': c2b.attribution ? 'yes' : 'no',
    'typeof C2B.validationProcess': typeof c2b.validationProcess,
    'C2B.q entries': Array.isArray(c2b.q) ? c2b.q.length : '—',
    '_c2b_attr cookie': getCookie('_c2b_attr') || '—'
  };

  document.getElementById('status').innerHTML = Object.keys(rows)
    .map(label => '<tr><th>' + label + '</th><td><code>' + rows[label] + '</code></td></tr>')
    .join('');
};

const actions = {
  'view-item': () => testShop.viewItem(),
  'purchase': () => testShop.purchase(),
  'preferences': () => CookieConsent.showPreferences(),
  'reset-consent': () => { CookieConsent.reset(true); location.reload(); },
  'clear-attribution': () => {
    // Host only cookie on localhost, widest domain elsewhere
    document.cookie = '_c2b_attr=; max-age=0; path=/';
    document.cookie = '_c2b_attr=; max-age=0; path=/; domain=' + location.hostname;
  }
};

document.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (button) {
    actions[button.dataset.action]();
    renderStatus();
  }
});

renderStatus();
setInterval(renderStatus, 500);
