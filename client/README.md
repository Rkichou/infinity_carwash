# Infinity Car Wash client

Frontend React/Vite deploye sur Vercel.

## Reservations avec Firebase

Les reservations sont stockees dans Cloud Firestore, collection `reservations`.

1. Cree un projet Firebase.
2. Ajoute une app Web dans Firebase.
3. Active Cloud Firestore.
4. Copie `client/.env.example` vers `client/.env.local` pour le dev local.
5. Renseigne aussi les memes variables dans Vercel, section Project Settings > Environment Variables.

Variables a renseigner :

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_RESERVATION_API_URL=
```

Les regles Firestore de depart sont dans `../firestore.rules`.

## Email de confirmation Brevo

La creation des reservations passe par la fonction Vercel `api/reservations.js`.
Elle enregistre la reservation dans Firestore, puis envoie l'email via le SMTP Brevo.

Variables serveur a renseigner dans Vercel :

```env
SITE_NAME=Infinity Car Wash
WASH_CENTER_ADDRESS=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=
BREVO_SMTP_PASS=
BREVO_SENDER_EMAIL=
```

`FIREBASE_PRIVATE_KEY` doit garder les retours a la ligne sous la forme `\n`.
Pour Brevo SMTP, utilisez le login SMTP et la cle SMTP, pas la cle API Brevo.

## Scripts

```bash
npm install
npm run dev
npm run build
```
