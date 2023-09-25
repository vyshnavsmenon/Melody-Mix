import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA7jeK4l7IJIbnuR9cgGk4IQlIYjJCy7_g",
  authDomain: "melody-mix-30fc2.firebaseapp.com",
  projectId: "melody-mix-30fc2",
  storageBucket: "melody-mix-30fc2.appspot.com",
  messagingSenderId: "922453544704",
  appId: "1:922453544704:web:e66c5b623829d207d9ede5",
  measurementId: "G-P0GESK2L7Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const database = getFirestore(app);
export const auth = getAuth(app);
export default app;