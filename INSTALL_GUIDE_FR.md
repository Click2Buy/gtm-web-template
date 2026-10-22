[View the English version 🇬🇧](INSTALL_GUIDE.md)

---

# Guide d'installation du Tag Web GTM Click2Buy

Suivez ces étapes pour implémenter les balises Click2Buy dans votre conteneur Google Tag Manager (Web).

Le modèle permet de créer **deux balises** :
- **Page vue** : charge le script Click2Buy sur toutes les pages, pour que le paramètre d'attribution (`c2bm`) soit lu et enregistré quand le visiteur arrive sur votre site depuis Click2Buy.
- **Conversion** : envoie les données de commande à Click2Buy lors de votre événement d'achat.

---

## 📋 Prérequis

Avant de commencer, assurez-vous que :
1. Vous avez un **conteneur Google Tag Manager Web** installé sur votre site.
2. Votre site envoie les données d'achat vers le `dataLayer` (le schéma e-commerce standard GA4 est recommandé).
3. Vous avez reçu votre **Clé Retailer Click2Buy** unique.
4. Votre site a une **plateforme de gestion du consentement (CMP)** connectée au **mode Consentement de Google** (Google Consent Mode), qui définit `analytics_storage`. Les deux balises exigent ce consentement, et la balise Page vue est aussi déclenchée sur l'événement de mise à jour du consentement de votre CMP ([section 2](#️-2-créer-la-balise--click2buy--page-vue-)). L'attribution Click2Buy relève de la catégorie **mesure d'audience**, et non de la publicité.

---

## 📥 1. Importer le modèle (Template)

1. Téléchargez le fichier `template.tpl` fourni en pièce-jointe, ou bien depuis ce dépôt GitHub.
2. Ouvrez votre conteneur **Google Tag Manager** (Web).
3. Dans la barre latérale gauche, cliquez sur **Modèles**.
4. Dans la section **Modèles de balises**, cliquez sur **Nouveau**.
5. Cliquez sur les **trois points (⋮)** en haut à droite et sélectionnez **Importer**.
6. Sélectionnez le fichier `template.tpl` que vous venez de télécharger.
7. Cliquez sur **Enregistrer** et fermez l'éditeur de modèle.

---

## 🏷️ 2. Créer la balise « Click2Buy — Page vue »

1. Allez dans la section **Balises** et cliquez sur **Nouvelle**. Nommez la balise `Click2Buy — Page vue`.
2. Cliquez sur **Configuration de la balise** et cherchez **Click2Buy tag for retailers** dans la liste.
3. Entrez votre **Clé Retailer Click2Buy** (fournie par Click2Buy).
4. **Tag type :** sélectionnez **Page view — loads the script only**.
5. Ouvrez **Paramètres avancés → Paramètres de consentement**, sélectionnez **Le déclenchement de la balise nécessite un consentement supplémentaire** et ajoutez `analytics_storage`.
6. Cliquez sur la section **Déclenchement** et ajoutez deux déclencheurs :
   - **All Pages** (déclencheur intégré).
   - L'**événement de mise à jour du consentement** de votre plateforme de gestion du consentement (CMP). La balise se déclenche ainsi quand le visiteur accepte la bannière cookies sur la page d'arrivée, et le paramètre d'attribution n'est pas perdu. Si vous n'avez pas encore ce déclencheur, créez un déclencheur **Événement personnalisé** avec le nom de l'événement envoyé par votre CMP dans le `dataLayer` (consultez la documentation de votre CMP, par exemple `cookie_consent_update`, `OneTrustGroupsUpdated`, `axeptio_update`).
   
   ⚠️ Cet événement doit être envoyé **après** la mise à jour du consentement par votre CMP, sinon `analytics_storage` est encore refusé au moment où la balise est évaluée et la balise est bloquée. Vérifiez-le lors du test ([section 5](#-5-tester-votre-implémentation)).
7. Enregistrez la balise.

---

## 🛒 3. Créer la balise « Click2Buy — Conversion »

1. Allez dans la section **Balises** et cliquez sur **Nouvelle**. Nommez la balise `Click2Buy — Conversion`.
2. Cliquez sur **Configuration de la balise** et cherchez **Click2Buy tag for retailers** dans la liste.
3. Entrez votre **Clé Retailer Click2Buy** (fournie par Click2Buy).
4. **Tag type :** sélectionnez **Conversion — sends the order data**.
5. **Data Source :**
   - Laissez sur **Standard** si vous suivez le schéma e-commerce GA4 (`ecommerce`).
   - Sélectionnez **Variable personnalisée** si vos données d'achat sont stockées dans une variable différente du data layer.
6. Ouvrez **Paramètres avancés → Paramètres de consentement**, sélectionnez **Le déclenchement de la balise nécessite un consentement supplémentaire** et ajoutez `analytics_storage`. Cette balise a aussi besoin du consentement : elle lit le cookie d'attribution et envoie les données de commande.
7. Cliquez sur la section **Déclenchement**.
8. **Si vous avez déjà un déclencheur pour votre événement d'achat, sélectionnez-le.** Sinon, suivez ces étapes pour en créer un nouveau :
   1. Créez un nouveau déclencheur (cliquez sur l'icône `+`).
   2. Choisissez **Événement personnalisé** comme type de déclencheur (en bas de la liste).
   3. **Nom de l'événement :** Entrez `purchase` (ou le nom spécifique de votre événement de conversion).
   4. Nommez le déclencheur (ex: `Event - Purchase`) et cliquez sur **Enregistrer**.
9. Enregistrez la balise.

---

## 🛡️ 4. Politique de sécurité du contenu (CSP)

Si votre site web utilise une **Politique de sécurité du contenu (CSP)**, vous devez ajouter les domaines suivants à votre liste blanche pour garantir le bon fonctionnement de la balise Click2Buy :

- **Chargement du script :** `script-src rs.clic2buy.com`
- **Accès aux cookies (Iframe) :** `frame-src t.clic2buy.com`
- **Collecte de données :** `connect-src analytics.clic2buy.com`

Alternativement, vous pouvez autoriser notre domaine racine pour toutes les directives : `*.clic2buy.com`.

Exemple d'en-tête CSP :
```http
Content-Security-Policy: script-src 'self' rs.clic2buy.com; frame-src 'self' t.clic2buy.com; connect-src 'self' analytics.clic2buy.com;
```
ou 
```http
Content-Security-Policy: script-src 'self' *.clic2buy.com; frame-src 'self' *.clic2buy.com; connect-src 'self' *.clic2buy.com;
```

---

## ✅ 5. Tester votre implémentation

1. Cliquez sur le bouton **Prévisualiser** dans GTM pour lancer le Tag Assistant.
2. **Page vue :**
   1. Ouvrez votre site avec un paramètre de test, par exemple `https://www.votre-site.com/?c2bm=cid:test` (la valeur doit contenir `cid:`, sinon elle est ignorée), et acceptez la bannière cookies.
   2. Dans la fenêtre du Tag Assistant, vérifiez que la balise **Click2Buy — Page vue** s'est bien déclenchée ("Fired") sur l'événement de mise à jour du consentement de votre CMP. Cliquez sur cet événement et ouvrez l'onglet **Consentement** (Consent) : `analytics_storage` doit être **Accordé** (Granted). S'il est encore **Refusé** (Denied), la balise est bloquée : utilisez un événement envoyé par votre CMP après la mise à jour du consentement.
   3. Ouvrez la console de votre navigateur (F12). Dans l'onglet **Réseau** (Network), vérifiez que le script `rs.clic2buy.com/retailers/VOTRE_CLE.js` est correctement chargé (Statut 200), y compris sur une page produit.
   4. Dans l'onglet **Application → Cookies**, vérifiez que le cookie `_c2b_attr` est bien posé.
3. **Conversion :**
   1. Effectuez un achat de test sur votre site.
   2. Dans la fenêtre du Tag Assistant, vérifiez que la balise **Click2Buy — Conversion** s'est bien déclenchée.
   3. Dans l'onglet **Réseau**, vérifiez qu'une requête `POST` part vers `analytics.clic2buy.com/api/events/from-tracking-param`.
   4. Dans la console, tapez `window.C2B.q`. Vous devriez y voir vos données de transaction. Cela montre seulement que la balise a transmis les données au script : c'est la requête `POST` de l'étape précédente qui montre que la conversion a été envoyée.

---

## 🔄 Mise à jour depuis la version 1.0.0

Si vous avez déjà installé la balise Click2Buy (une seule balise déclenchée sur l'événement d'achat) :
1. Importez le nouveau `template.tpl` dans votre modèle existant (**Modèles → Click2Buy tag for retailers → ⋮ → Importer**) et enregistrez-le.
2. Ouvrez votre balise existante, vérifiez que **Tag type** est sur **Conversion**, et renommez-la `Click2Buy — Conversion`.
3. Créez la balise **Click2Buy — Page vue** ([section 2](#️-2-créer-la-balise--click2buy--page-vue-)).
4. Sur la balise **Click2Buy — Conversion**, configurez le consentement ([section 3](#-3-créer-la-balise--click2buy--conversion-), étape 6).

---

## 🚀 6. Publier

Une fois que vous avez vérifié que les balises fonctionnent correctement, cliquez sur **Envoyer** dans GTM pour publier vos modifications sur votre site en production.
