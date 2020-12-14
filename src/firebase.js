import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBCSstcip7WyghcEIQqxG5i838xkCmTrCY",
  authDomain: "crud-udemy-react-4414f.firebaseapp.com",
  databaseURL: "https://crud-udemy-react-4414f.firebaseio.com",
  projectId: "crud-udemy-react-4414f",
  storageBucket: "crud-udemy-react-4414f.appspot.com",
  messagingSenderId: "757724588670",
  appId: "1:757724588670:web:ce570b8a5dce59ba12862f"
};

firebase.initializeApp(firebaseConfig);

export  {firebase}