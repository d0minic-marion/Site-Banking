import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../2_config/firebase.js";

const txCol = (uid) => collection(db, "users", uid, "transactions");

// CREATE
export async function createTransaction(uid, data) {
  return addDoc(txCol(uid), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// READ
export async function getTransactions(uid) {
  const q = query(txCol(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// UPDATE
export async function updateTransaction(uid, txId, patch) {
  const ref = doc(db, "users", uid, "transactions", txId);
  return updateDoc(ref, {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

// DELETE
export async function deleteTransaction(uid, txId) {
  const ref = doc(db, "users", uid, "transactions", txId);
  return deleteDoc(ref);
}