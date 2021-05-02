import {handleUserStatus} from './actions/user';
var firebase = require("firebase/app");
require('firebase/database');
require('firebase/auth');


var firebaseConfig = {
    apiKey: "AIzaSyBsiEtVMLYwx6MqsxmWfiNvqwvH7nSE8hQ",
    authDomain: "pops-52019.firebaseapp.com",
    databaseURL: "https://pops-52019-default-rtdb.firebaseio.com",
    projectId: "pops-52019",
    storageBucket: "pops-52019.appspot.com",
    messagingSenderId: "784106056776",
    appId: "1:784106056776:web:d1cfe27366128ff9733c7d",
    measurementId: "G-BE7YYQPX4S"
};

firebase.initializeApp(firebaseConfig);

export const databaseRef = firebase.database().ref();

let temp = null;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    temp = firebase.auth().currentUser.uid;
    handleUserStatus(true);
  } else {
    temp = null;
  }
});

export const userId = temp;
