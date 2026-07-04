import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db, missingFirebaseEnvKeys } from '../firebase';

export type ReservationFormData = {
  name: string;
  phone: string;
  formula: string;
  date: string;
  time: string;
};

export type Reservation = ReservationFormData & {
  id: string;
  status: 'pending';
};

const reservationsCollection = collection(db, 'reservations');

function getReservationId(date: string, time: string) {
  return `${date}_${time}`;
}

function assertFirebaseConfig() {
  if (missingFirebaseEnvKeys.length > 0) {
    throw new Error(`Configuration Firebase manquante: ${missingFirebaseEnvKeys.join(', ')}`);
  }
}

export async function createReservation(formData: ReservationFormData) {
  assertFirebaseConfig();

  await setDoc(doc(reservationsCollection, getReservationId(formData.date, formData.time)), {
    ...formData,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
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
        phone: data.phone,
        formula: data.formula,
        date: data.date,
        time: data.time,
        status: data.status ?? 'pending',
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
        phone: data.phone,
        formula: data.formula,
        date: data.date,
        time: data.time,
        status: data.status ?? 'pending',
      };
    })
    .sort((left, right) => `${left.date} ${left.time}`.localeCompare(`${right.date} ${right.time}`));
}
