const admin = require('firebase-admin');
const { cert, getApps, initializeApp } = require('firebase-admin/app');
const nodemailer = require('nodemailer');

const SITE_NAME = process.env.SITE_NAME || 'Infinity Car Wash';
const RESERVATIONS_COLLECTION = 'reservations';

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variable d'environnement manquante: ${name}`);
  }

  return value;
}

function getFirebaseAdminApp() {
  const apps = getApps();

  if (apps.length > 0) {
    return apps[0];
  }

  const projectId = getRequiredEnv('FIREBASE_PROJECT_ID');
  const clientEmail = getRequiredEnv('FIREBASE_CLIENT_EMAIL');
  const privateKey = getRequiredEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n');

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

function getReservationId(date, time) {
  return `${date}_${time}`;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function formatDateFr(dateValue) {
  const [year, month, day] = dateValue.split('-');

  if (!year || !month || !day) {
    return dateValue;
  }

  return `${day}/${month}/${year}`;
}

function formatTime(value) {
  const match = /^([0-2]\d):([0-5]\d)$/.exec(value);

  return match ? `${match[1]}:${match[2]}` : value;
}

function getFirstName(fullName) {
  return fullName.split(/\s+/)[0] || fullName;
}

function validateReservation(payload) {
  const reservation = {
    name: normalizeString(payload.name),
    email: normalizeString(payload.email).toLowerCase(),
    phone: normalizeString(payload.phone),
    formula: normalizeString(payload.formula),
    date: normalizeString(payload.date),
    time: normalizeString(payload.time),
    vehicle: normalizeString(payload.vehicle),
    price: normalizeString(payload.price),
  };

  if (!reservation.name || !reservation.email || !reservation.phone || !reservation.formula || !reservation.date || !reservation.time) {
    return { error: 'Champs obligatoires manquants.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reservation.email)) {
    return { error: 'Adresse email invalide.' };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(reservation.date)) {
    return { error: 'Date invalide.' };
  }

  if (!/^\d{2}:\d{2}$/.test(reservation.time)) {
    return { error: 'Heure invalide.' };
  }

  return { reservation };
}

function getTransporter() {
  const port = Number(process.env.BREVO_SMTP_PORT || 587);

  return nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port,
    secure: port === 465,
    auth: {
      user: getRequiredEnv('BREVO_SMTP_USER'),
      pass: getRequiredEnv('BREVO_SMTP_PASS'),
    },
  });
}

function buildEmail(reservation) {
  const firstName = getFirstName(reservation.name);
  const formattedDate = formatDateFr(reservation.date);
  const formattedTime = formatTime(reservation.time);
  const centerAddress = process.env.WASH_CENTER_ADDRESS || 'Adresse du centre a renseigner';
  const bookingReference = reservation.id;

  const optionalTextLines = [
    reservation.vehicle ? `Vehicule : ${reservation.vehicle}` : null,
    reservation.price ? `Prix : ${reservation.price}` : null,
  ].filter(Boolean);

  const text = [
    `Bonjour ${firstName},`,
    '',
    'Votre rendez-vous de lavage automobile est bien confirme.',
    '',
    `Service : ${reservation.formula}`,
    `Date : ${formattedDate}`,
    `Heure : ${formattedTime}`,
    ...optionalTextLines,
    `Lieu : ${centerAddress}`,
    `Numero de reservation : ${bookingReference}`,
    '',
    'Votre reservation a bien ete enregistree.',
    '',
    'Merci pour votre confiance.',
    SITE_NAME,
  ].join('\n');

  const optionalHtmlRows = [
    reservation.vehicle ? `<tr><td>Vehicule</td><td>${escapeHtml(reservation.vehicle)}</td></tr>` : '',
    reservation.price ? `<tr><td>Prix</td><td>${escapeHtml(reservation.price)}</td></tr>` : '',
  ].join('');

  const html = `
    <div style="font-family:Arial,sans-serif;background:#050505;color:#ffffff;padding:28px">
      <div style="max-width:560px;margin:0 auto;background:#111111;border:1px solid #2a2a2a;border-radius:18px;padding:28px">
        <h1 style="margin:0 0 16px;color:#ffde00">Reservation confirmee</h1>
        <p>Bonjour ${escapeHtml(firstName)},</p>
        <p>Votre rendez-vous de lavage automobile est bien confirme.</p>
        <table style="width:100%;border-collapse:collapse;margin:22px 0">
          <tr><td style="padding:10px;border-bottom:1px solid #2a2a2a;color:#999">Service</td><td style="padding:10px;border-bottom:1px solid #2a2a2a">${escapeHtml(reservation.formula)}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #2a2a2a;color:#999">Date</td><td style="padding:10px;border-bottom:1px solid #2a2a2a">${escapeHtml(formattedDate)}</td></tr>
          <tr><td style="padding:10px;border-bottom:1px solid #2a2a2a;color:#999">Heure</td><td style="padding:10px;border-bottom:1px solid #2a2a2a">${escapeHtml(formattedTime)}</td></tr>
          ${optionalHtmlRows}
          <tr><td style="padding:10px;border-bottom:1px solid #2a2a2a;color:#999">Lieu</td><td style="padding:10px;border-bottom:1px solid #2a2a2a">${escapeHtml(centerAddress)}</td></tr>
          <tr><td style="padding:10px;color:#999">Numero de reservation</td><td style="padding:10px;font-weight:bold;color:#ffde00">${escapeHtml(bookingReference)}</td></tr>
        </table>
        <p>Votre reservation a bien ete enregistree.</p>
        <p style="color:#999">Merci pour votre confiance.<br>${escapeHtml(SITE_NAME)}</p>
      </div>
    </div>
  `;

  return {
    from: `"${SITE_NAME}" <${getRequiredEnv('BREVO_SENDER_EMAIL')}>`,
    to: reservation.email,
    subject: `Confirmation de votre rendez-vous - ${SITE_NAME}`,
    text,
    html,
  };
}

async function sendConfirmationEmail(reservation) {
  const transporter = getTransporter();
  const message = buildEmail(reservation);
  const info = await transporter.sendMail(message);

  return info.messageId;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let payload;

  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  } catch (parseError) {
    return res.status(400).json({ error: 'JSON invalide.' });
  }

  const { reservation, error } = validateReservation(payload);

  if (error) {
    return res.status(400).json({ error });
  }

  try {
    getFirebaseAdminApp();

    const db = admin.firestore();
    const reservationId = getReservationId(reservation.date, reservation.time);
    const reservationRef = db.collection(RESERVATIONS_COLLECTION).doc(reservationId);
    const reservationForDb = {
      ...reservation,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      confirmationEmailSent: false,
      confirmationEmailSentAt: null,
    };

    await db.runTransaction(async (transaction) => {
      const existing = await transaction.get(reservationRef);

      if (existing.exists) {
        const existingData = existing.data();

        if (existingData.confirmationEmailSent) {
          const conflict = new Error('Ce creneau est deja reserve.');
          conflict.statusCode = 409;
          throw conflict;
        }

        const conflict = new Error('Ce creneau est deja en cours de reservation.');
        conflict.statusCode = 409;
        throw conflict;
      }

      transaction.create(reservationRef, reservationForDb);
    });

    const savedReservation = {
      id: reservationId,
      ...reservationForDb,
    };

    try {
      const messageId = await sendConfirmationEmail(savedReservation);

      await reservationRef.update({
        confirmationEmailSent: true,
        confirmationEmailSentAt: admin.firestore.FieldValue.serverTimestamp(),
        confirmationEmailMessageId: messageId,
      });

      console.info(`[reservation:${reservationId}] Email Brevo envoye: ${messageId}`);

      return res.status(201).json({
        id: reservationId,
        emailSent: true,
      });
    } catch (emailError) {
      console.error(`[reservation:${reservationId}] Echec email Brevo`, emailError);

      await reservationRef.update({
        confirmationEmailError: emailError.message || 'Erreur inconnue',
        confirmationEmailFailedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(201).json({
        id: reservationId,
        emailSent: false,
        warning: 'Reservation enregistree, mais email non envoye.',
      });
    }
  } catch (requestError) {
    const statusCode = requestError.statusCode || 500;
    console.error('[reservation] Echec creation reservation', requestError);

    return res.status(statusCode).json({
      error: requestError.message || 'Erreur serveur.',
    });
  }
};
