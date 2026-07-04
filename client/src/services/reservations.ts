import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
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

function assertFirebaseConfig() {
  if (missingFirebaseEnvKeys.length > 0) {
    throw new Error(`Configuration Firebase manquante: ${missingFirebaseEnvKeys.join(', ')}`);
  }
}

export async function createReservation(formData: ReservationFormData) {
  assertFirebaseConfig();

  await addDoc(reservationsCollection, {
    ...formData,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
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
