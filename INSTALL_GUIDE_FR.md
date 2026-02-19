[View the English version 🇬🇧](INSTALL_GUIDE.md)

---

# Guide d'installation du Tag Web GTM Click2Buy

Suivez ces étapes pour implémenter la balise de conversion Click2Buy dans votre conteneur Google Tag Manager (Web).

---

## 📋 Prérequis

Avant de commencer, assurez-vous que :
1. Vous avez un **conteneur Google Tag Manager Web** installé sur votre site.
2. Votre site envoie les données d'achat vers le `dataLayer` (le schéma e-commerce standard GA4 est recommandé).
3. Vous avez reçu votre **Clé Retailer Click2Buy** unique.

---

## 📥 1. Importer le modèle (Template)

1. Téléchargez le fichier `template.tpl` depuis ce dépôt GitHub.
2. Ouvrez votre conteneur **Google Tag Manager** (Web).
3. Dans la barre latérale gauche, cliquez sur **Modèles**.
4. Dans la section **Modèles de balises**, cliquez sur **Nouveau**.
5. Cliquez sur les **trois points (⋮)** en haut à droite et sélectionnez **Importer**.
6. Sélectionnez le fichier `template.tpl` que vous venez de télécharger.
7. Cliquez sur **Enregistrer** et fermez l'éditeur de modèle.

---

## 🏷️ 2. Créer la balise

1. Allez dans la section **Balises** et cliquez sur **Nouvelle**.
2. Cliquez sur **Configuration de la balise** et cherchez **Click2Buy tag for retailers** dans la liste.
4. Entrez votre **Clé Retailer Click2Buy** (fournie par Click2Buy).
5. **Data Source :**
   - Laissez sur **Standard** si vous suivez le schéma e-commerce GA4 (`ecommerce`).
   - Sélectionnez **Variable personnalisée** si vos données d'achat sont stockées dans une variable différente de la couche de données.

---

## ⚡ 3. Configurer le déclencheur

1. Cliquez sur la section **Déclenchement** située sous la configuration de la balise.
2. **Si vous avez déjà un déclencheur pour votre événement d'achat, sélectionnez-le.** Sinon, suivez ces étapes pour en créer un nouveau :
3. Créez un nouveau déclencheur (cliquez sur l'icône `+`).
4. Choisissez **Événement personnalisé** comme type de déclencheur (en bas de la liste).
5. **Nom de l'événement :** Entrez `purchase` (ou le nom spécifique de votre événement de conversion).
6. Nommez le déclencheur (ex: `Event - Purchase`) et cliquez sur **Enregistrer**.
7. Enregistrez votre balise.

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
2. Effectuez un achat de test sur votre site.
3. Dans la fenêtre du Tag Assistant, vérifiez que la balise **Click2Buy GTM Web Tag** s'est bien déclenchée ("Fired").
4. Ouvrez la console de votre navigateur (F12) et tapez `window.C2B.q`. Vous devriez y voir vos données de transaction en attente.
5. Dans l'onglet **Réseau** (Network) de votre navigateur, vérifiez que le script `rs.clic2buy.com/retailers/VOTRE_CLE.js` est correctement chargé (Statut 200).

---

## 🚀 6. Publier

Une fois que vous avez vérifié que la balise fonctionne correctement, cliquez sur **Envoyer** dans GTM pour publier vos modifications sur votre site en production.