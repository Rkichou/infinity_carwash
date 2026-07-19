import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db, missingFirebaseEnvKeys } from '../firebase';

export type ReservationFormData = {
  name: string;
  email: string;
  phone: string;
  formula: string;
  date: string;
  time: string;
  vehicle?: string;
  price?: string;
};

export type Reservation = ReservationFormData & {
  id: string;
  status: 'pending';
  confirmationEmailSent?: boolean;
};

const reservationsCollection = collection(db, 'reservations');

function assertFirebaseConfig() {
  if (missingFirebaseEnvKeys.length > 0) {
    throw new Error(`Configuration Firebase manquante: ${missingFirebaseEnvKeys.join(', ')}`);
  }
}

export async function createReservation(formData: ReservationFormData) {
  const response = await fetch(import.meta.env.VITE_RESERVATION_API_URL || '/api/reservations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || 'Impossible de creer la reservation.');
  }

  if (result.warning) {
    console.warn(result.warning);
  }

  return result as { id: string; emailSent: boolean; warning?: string };
}

export async function getReservationsByDate(date: string): Promise<Reservation[]> {
  assertFirebaseConfig();

  const snapshot = await getDocs(query(reservationsCollection, where('date', '==', date)));

  return snapshot.docs
    .map((document) => {
      const data = document.data() as Omit<Reservation, 'id'>;

      return {
        id: document.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        formula: data.formula,
        date: data.date,
        time: data.time,
        vehicle: data.vehicle,
        price: data.price,
        status: data.status ?? 'pending',
        confirmationEmailSent: data.confirmationEmailSent,
      };
    })
    .sort((left, right) => left.time.localeCompare(right.time));
}

export async function getReservations(): Promise<Reservation[]> {
  assertFirebaseConfig();

  const snapshot = await getDocs(reservationsCollection);

  return snapshot.docs
    .map((document) => {
      const data = document.data() as Omit<Reservation, 'id'>;

      return {
        id: document.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        formula: data.formula,
        date: data.date,
        time: data.time,
        vehicle: data.vehicle,
        price: data.price,
        status: data.status ?? 'pending',
        confirmationEmailSent: data.confirmationEmailSent,
      };
    })
    .sort((left, right) => `${left.date} ${left.time}`.localeCompare(`${right.date} ${right.time}`));
}
