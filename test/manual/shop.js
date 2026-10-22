// Loaded synchronously in <head>, before GTM, like a retailer's CMP and dataLayer setup
// GTM_CONTAINER_ID is defined in config.js (not committed, see config.example.js)
const CONSENT_EVENT = 'cookie_consent_update';

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

// Consent Mode defaults: the choice saved by the banner (CookieConsent `cc_cookie`) is restored before GTM,
// so that the tags fired at page load (All Pages, purchase) already see it
(function() {
  let analyticsAccepted = false;
  const match = document.cookie.match(/(?:^|; )cc_cookie=([^;]*)/);
  if (match) {
    try {
      analyticsAccepted = JSON.parse(decodeURIComponent(match[1])).categories.indexOf('analytics') !== -1;
    } catch (e) {}
  }

  gtag('consent', 'default', {
    analytics_storage: analyticsAccepted ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
})();

// GA4 ecommerce pushes, clearing the previous ecommerce object first (GA4 recommendation)
const testShop = (function() {
  const product = { item_id: 'SKU-123', item_name: 'Test product', price: 12.5, quantity: 1 };

  const pushEcommerce = (event, ecommerce) => {
    dataLayer.push({ ecommerce: null });
    dataLayer.push({ event: event, ecommerce: ecommerce });
  };

  return {
    viewItem: () => pushEcommerce('view_item', { currency: 'EUR', value: 12.5, items: [product] }),
    purchase: () => pushEcommerce('purchase', {
      transaction_id: 'TEST-GTM-' + Date.now(),
      currency: 'EUR',
      value: 12.5,
      items: [product]
    })
  };
})();

// Standard GTM container snippet
function loadGtm() {
  if (typeof GTM_CONTAINER_ID === 'undefined') {
    console.error('GTM is not loaded: copy config.example.js to config.js and set your GTM container ID');
    return;
  }

  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer',GTM_CONTAINER_ID);
}
