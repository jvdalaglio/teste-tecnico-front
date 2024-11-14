import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import app from './firebase';
import { create } from 'domain';

const auth = getAuth(app);

export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const register = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
}

export const logout = () => {
  return signOut(auth);
};


export const observeUserState = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

export default auth;