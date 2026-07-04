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
```

Les regles Firestore de depart sont dans `../firestore.rules`.

## Scripts

```bash
npm install
npm run dev
npm run build
```
