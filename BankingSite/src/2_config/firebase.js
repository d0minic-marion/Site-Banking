import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyBodGJhzuEyspVrz8x9jel_k-YyXK6biOk",
  authDomain: "ex01-ee413.firebaseapp.com",
  projectId: "ex01-ee413",
  storageBucket: "ex01-ee413.firebasestorage.app",
  messagingSenderId: "1076967840090",
  appId: "1:1076967840090:web:8fd00b28d96ed6113abb63",
  measurementId: "G-KGCLG9GV14",
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

isSupported().then((yes) => {
  if (yes) getAnalytics(app);
});

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6Lec6S4sAAAAAICD9c2VksfpB2EKotAgYuX-xjTZ"),
  isTokenAutoRefreshEnabled: true,
});