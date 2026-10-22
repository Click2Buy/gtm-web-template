
[Voir la version française 🇫🇷](INSTALL_GUIDE_FR.md)

---

# Click2Buy GTM Web Tag Installation Guide

Follow these steps to implement the Click2Buy tags in your Google Tag Manager Web container.

The template is used to create **two tags**:
- **Page view**: loads the Click2Buy script on every page, so that the attribution parameter (`c2bm`) is read and stored when the visitor lands on your website from Click2Buy.
- **Conversion**: sends the order data to Click2Buy on your purchase event.

---

## 📋 Prerequisites

Before starting, ensure that:
1. You have a **Google Tag Manager Web Container** installed on your website.
2. Your website pushes purchase data to the `dataLayer` (Standard GA4 Ecommerce schema recommended).
3. You have received your unique **Retailer Key** from Click2Buy.
4. Your website has a **Consent Management Platform (CMP)** connected to **Google Consent Mode**, which sets `analytics_storage`. Both tags require this consent, and the Page view tag is also fired on the consent update event of your CMP ([section 2](#️-2-create-the-click2buy--page-view-tag)). Click2Buy attribution belongs to the **audience measurement** category, not advertising.

---

## 📥 1. Import the Template

1. Download the `template.tpl` file sent as attachment, or from this repository.
2. Open your **Google Tag Manager** web container.
3. In the left sidebar, click on **Templates**.
4. In the **Tag Templates** section, click **New**.
5. Click the **three dots (⋮)** in the top right corner and select **Import**.
6. Select the `template.tpl` file you just downloaded.
7. Click **Save** and close the template editor.

---

## 🏷️ 2. Create the "Click2Buy — Page view" Tag

1. Go to **Tags** and click **New**. Name the tag `Click2Buy — Page view`.
2. Click **Tag Configuration** and look for **Click2Buy tag for retailers** in the list.
3. Enter your **Click2Buy Retailer Key** (provided by Click2Buy).
4. **Tag type:** select **Page view — loads the script only**.
5. Open **Advanced Settings → Consent Settings**, select **Require additional consent for tag to fire** and add `analytics_storage`.
6. Click on the **Triggering** section and add two triggers:
   - **All Pages** (built-in trigger).
   - The **consent update event** of your Consent Management Platform (CMP). This makes the tag fire when the visitor accepts the cookie banner on the landing page, so that the attribution parameter is not lost. If you don't have such a trigger yet, create a **Custom Event** trigger with the event name pushed by your CMP to the `dataLayer` (check your CMP's documentation, e.g. `cookie_consent_update`, `OneTrustGroupsUpdated`, `axeptio_update`).
   
   ⚠️ This event must be pushed **after** your CMP has updated the consent state, otherwise `analytics_storage` is still denied when the tag is evaluated and the tag is blocked. Check it in the test ([section 5](#-5-testing-your-implementation)).
7. Save your tag.

---

## 🛒 3. Create the "Click2Buy — Conversion" Tag

1. Go to **Tags** and click **New**. Name the tag `Click2Buy — Conversion`.
2. Click **Tag Configuration** and look for **Click2Buy tag for retailers** in the list.
3. Enter your **Click2Buy Retailer Key** (provided by Click2Buy).
4. **Tag type:** select **Conversion — sends the order data**.
5. **Data Source:**
   - Keep it as **Standard** if you follow the GA4 `ecommerce` schema.
   - Select a **Custom Variable** if your purchase data is stored in a different Data Layer variable.
6. Open **Advanced Settings → Consent Settings**, select **Require additional consent for tag to fire** and add `analytics_storage`. This tag also needs the consent: it reads the attribution cookie and sends the order data.
7. Click on the **Triggering** section.
8. **If you already have a trigger for your purchase event, select it.** Otherwise, follow these steps to create a new one:
   1. Create a new trigger (click the `+` icon).
   2. Choose **Custom Event** as the trigger type (at the bottom of the list).
   3. **Event Name:** Enter `purchase` (or the specific name of your conversion event).
   4. Name the trigger (e.g., `Event - Purchase`) and click **Save**.
9. Save your tag.

---

## 🛡️ 4. Content Security Policy (CSP)

If your website uses a **Content Security Policy (CSP)**, you must whitelist the following domains to ensure the Click2Buy tag works correctly:

- **Script Loading:** `script-src rs.clic2buy.com`
- **Cookie Access (Iframe):** `frame-src t.clic2buy.com`
- **Data Collection:** `connect-src analytics.clic2buy.com`

Alternatively, you can whitelist our root domain for all directives: `*.clic2buy.com`.

Example CSP header:
```http
Content-Security-Policy: script-src 'self' rs.clic2buy.com; frame-src 'self' t.clic2buy.com; connect-src 'self' analytics.clic2buy.com;
```
or 
```http
Content-Security-Policy: script-src 'self' *.clic2buy.com; frame-src 'self' *.clic2buy.com; connect-src 'self' *.clic2buy.com;
```

---

## ✅ 5. Testing your Implementation

1. Click the **Preview** button in GTM to launch the Tag Assistant.
2. **Page view:**
   1. Open your website with a test parameter, e.g. `https://www.your-website.com/?c2bm=cid:test` (the value must contain `cid:`, otherwise it is ignored), and accept the cookie banner.
   2. In the Tag Assistant window, check that the **Click2Buy — Page view** tag has fired on the consent update event of your CMP. Click this event and open the **Consent** tab: `analytics_storage` must be **Granted**. If it is still **Denied**, the tag is blocked: use an event pushed by your CMP after the consent update.
   3. Open your browser console (F12). In the **Network** tab, verify that the script `rs.clic2buy.com/retailers/YOUR_KEY.js` is successfully loaded (also on a product page).
   4. In the **Application → Cookies** tab, verify that the `_c2b_attr` cookie is set.
3. **Conversion:**
   1. Complete a test purchase on your website.
   2. In the Tag Assistant window, check that the **Click2Buy — Conversion** tag has fired.
   3. In the **Network** tab, verify that a `POST` request is sent to `analytics.clic2buy.com/api/events/from-tracking-param`.
   4. In the console, type `window.C2B.q`. You should see your transaction data in the queue. This only shows that the tag handed the data over to the script: the `POST` request of the previous step is what shows that the conversion was sent.

---

## 🔄 Upgrading from version 1.0.0

If you already installed the Click2Buy tag (a single tag fired on the purchase event):
1. Import the new `template.tpl` in your existing template (**Templates → Click2Buy tag for retailers → ⋮ → Import**) and save it.
2. Open your existing tag, check that **Tag type** is set to **Conversion**, and rename it `Click2Buy — Conversion`.
3. Create the **Click2Buy — Page view** tag ([section 2](#️-2-create-the-click2buy--page-view-tag)).
4. On the **Click2Buy — Conversion** tag, set up the consent settings ([section 3](#-3-create-the-click2buy--conversion-tag), step 6).

---

## 🚀 6. Publish

Once you have verified the tags are working correctly, click **Submit** in GTM to publish your changes to the live site.
