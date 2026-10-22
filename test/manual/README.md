# Manual test website

Static pages to test the GTM web template in a real browser, with a GTM test container, a cookie banner (CMP) and the Click2Buy retailer script. They reproduce a retailer's setup: Consent Mode defaults before GTM, a CMP that pushes a consent event, and GA4 ecommerce pushes.

Checks are done in the browser DevTools (**Network**, **Application → Cookies**, **Console**), in GTM **Preview** mode (Tag Assistant), and in the status panel at the top of each page (consent, script loaded, `C2B.q`, `_c2b_attr`).

| File | Role |
|---|---|
| `config.example.js` | Template of `config.js` (not committed), which sets the ID of your GTM test container |
| `shop.js` | Loaded before GTM: Consent Mode defaults (restored from the banner cookie), GA4 ecommerce pushes (`testShop.viewItem()`, `testShop.purchase()`) and the GTM snippet |
| `page.js` | Cookie banner ([CookieConsent v3](https://github.com/orestbida/cookieconsent), open source), which pushes `gtag('consent', 'update', …)` and a `cookie_consent_update` event, like Cookiebot. Also the status panel and the test buttons |
| `shop.css` | Look of the test pages |
| `landing.html` | Landing page, linked with `?c2bm=m%3Awidget%3Bcid%3Atest-gtm` (the script ignores a `c2bm` without `cid`) |
| `product.html` | Pushes a `view_item` with an `ecommerce` object at page load |
| `confirmation.html` | "Push purchase" button (script already loaded). With `?early=1`, the purchase is pushed before GTM (script not loaded yet) |

## 1. Prepare the GTM test container

1. **Template**: import `template.tpl` in the container (**Templates → New → ⋮ → Import**) and run its tests.
2. **Tags**, as in the installation guide, with the key of a test retailer:
   - "Click2Buy — Page view": tag type Page view, triggers **All Pages** and a **Custom Event** `cookie_consent_update`;
   - "Click2Buy — Conversion": tag type Conversion, data source Standard, **Custom Event** `purchase` trigger;
   - on both tags, additional consent `analytics_storage`.
3. **Retailer settings**: the first party attribution must be active for the retailer (`tracking_param_active` and `first_party_cookie_active`), otherwise no `_c2b_attr` cookie is set.
4. Publish the container, or use **Preview** mode.

## 2. Run

```bash
cp test/manual/config.example.js test/manual/config.js   # then set your GTM container ID
cd test/manual && python3 -m http.server 8000
```

Open `http://localhost:8000/landing.html?c2bm=m%3Awidget%3Bcid%3Atest-gtm`.

## 3. Scenarios

| # | Steps | Expected |
|---|---|---|
| 1 | Landing page, banner not answered | Page view tag blocked by consent, script not loaded, no `_c2b_attr` |
| 2 | Click "Accept all" | Page view tag fired on `cookie_consent_update`, script loaded, `_c2b_attr` set |
| 3 | "Reset consent and reload", "Reject all", then accept analytics in "Cookie preferences" | Same as 2, without reloading the page |
| 4 | Product page | Script loaded, `C2B.q` stays empty, no request to `analytics…clic2buy.com` |
| 5 | Confirmation page, wait for "script loaded: yes", click "Push purchase" | `typeof C2B.validationProcess` is still `function`, `POST …/events/from-tracking-param` sent |
| 6 | `confirmation.html?early=1` | The purchase is queued in `C2B.q` before the script loads, then sent when it starts |

## Notes

- **Dedup**: after a sale sent with the first party attribution, the script sets a `_c2b_sent_<hash>` cookie for 30 minutes, per page URL (path and query string). Another sale from the same URL is not sent: delete the `_c2b_sent_…` cookies to repeat scenarios 5 and 6.
- **Debug mode** of the retailer script: `c2b_debug=1` in the URL (`c2b_debug=0` to turn it off). Every sale is then a `validation_test`, and the dedup is not used.
- The sales are sent to Click2Buy for the retailer key set in the tags: use a test retailer, or the debug mode.
