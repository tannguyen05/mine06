// This import loads the firebase namespace along with all its type information.
import { firebase } from '@firebase/app';

// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/database';

class FirebaseConfig {
  constructor() {
    // Initialize Firebase
    const config = {
      apiKey: "AIzaSyAT8U8s0gqm1mmI7V1PhBc_QCKPGTbbh6A",
      authDomain: "fir-chat-ec6e8.firebaseapp.com",
      databaseURL: "https://fir-chat-ec6e8.firebaseio.com",
      projectId: "fir-chat-ec6e8",
      storageBucket: "fir-chat-ec6e8.appspot.com",
      messagingSenderId: "708580210207"
    };
    firebase.initializeApp(config);
  }
}



const fire = new FirebaseConfig();
export default fire;
