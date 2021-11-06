import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "XXXXXXXXXXXXXXXXXX",
    authDomain: "XXXXXXXXXXXXXXXXXX",
    projectId: "XXXXXXXXXXXXXXXXXX",
    storageBucket: "XXXXXXXXXXXXXXXXXX",
    messagingSenderId: "XXXXXXXXXXXXXXXXXX",
    appId: "XXXXXXXXXXXXXXXXXX"
};

class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig)
        this.auth = app.auth()
        this.db = app.firestore()
    }

    // inscription
    register = (email, password) => 
        this.auth.createUserWithEmailAndPassword(email, password)

    // connexion
    login = (email, password) => 
        this.auth.signInWithEmailAndPassword(email, password)
    

    // déconnexion
    logout = () => 
        this.auth.signOut();
    
    // récupération
    passwordReset = email => this.auth.sendPasswordResetEmail(email) 

    // enregistre le pseudo et le mail
    user = uid => this.db.doc(`users/${uid}`)
}

export default Firebase