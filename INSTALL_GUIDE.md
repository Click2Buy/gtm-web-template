
[Voir la version française 🇫🇷](INSTALL_GUIDE_FR.md)

---

# Click2Buy GTM Web Tag Installation Guide

Follow these steps to implement the Click2Buy conversion tag in your Google Tag Manager Web container.

---

## 📋 Prerequisites

Before starting, ensure that:
1. You have a **Google Tag Manager Web Container** installed on your website.
2. Your website pushes purchase data to the `dataLayer` (Standard GA4 Ecommerce schema recommended).
3. You have received your unique **Retailer Key** from Click2Buy.

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

## 🏷️ 2. Create the Tag

1. Go to **Tags** and click **New**.
2. Click **Tag Configuration** and look for **Click2Buy tag for retailers** in the list.
4. Enter your **Click2Buy Retailer Key** (provided by Click2Buy).
5. **Data Source:**
   - Keep it as **Standard** if you follow the GA4 `ecommerce` schema.
   - Select a **Custom Variable** if your purchase data is stored in a different Data Layer variable.

---

## ⚡ 3. Set up the Trigger

1. Click on the **Triggering** section below the Tag Configuration.
2. **If you already have a trigger for your purchase event, select it.** Otherwise, follow these steps to create a new one:
3. Create a new trigger (click the `+` icon).
4. Choose **Custom Event** as the trigger type (at the bottom of the list).
5. **Event Name:** Enter `purchase` (or the specific name of your conversion event).
6. Name the trigger (e.g., `Event - Purchase`) and click **Save**.
7. Save your Tag.

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
2. Complete a test purchase on your website.
3. In the Tag Assistant window, check that the **Click2Buy GTM Web Tag** has fired.
4. Open your browser console (F12) and type `window.C2B.q`. You should see your transaction data in the queue.
5. In the **Network** tab of your browser, verify that the script `rs.clic2buy.com/retailers/YOUR_KEY.js` is successfully loaded.

---

## 🚀 6. Publish

Once you have verified the tag is working correctly, click **Submit** in GTM to publish your changes to the live site.