import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBp26yWsIoyYH7vfvcU1Ztkl-ApfOg8J30",
  authDomain: "shoppy-8c801.firebaseapp.com",
  databaseURL: "https://shoppy-8c801-default-rtdb.firebaseio.com",
  projectId: "shoppy-8c801",
  storageBucket: "shoppy-8c801.appspot.com",
  messagingSenderId: "857841340326",
  appId: "1:857841340326:web:8d5da85b0cb170105e4967"
};


const app = initializeApp(firebaseConfig);
export const imagedDb=getStorage(app);