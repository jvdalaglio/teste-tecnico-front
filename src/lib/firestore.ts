import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import app from './firebase';

const db = getFirestore(app);

export const getCollectionDocs = async (colName: string) => {
  const colRef = collection(db, colName);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addDocument = async (colName: string, data: any) => {
  const colRef = collection(db, colName);
  return await addDoc(colRef, data);
};

export default db;