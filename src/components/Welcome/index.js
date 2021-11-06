import React, { useState, useEffect,  useContext } from 'react'
import Logout from '../Logout'
import Quiz from '../Quiz'
import { FirebaseContext } from '../Firebase'
import Loader from '../Loader'

const Welcome = (props) => {

    const firebase = useContext(FirebaseContext)

    const [session, setSession] = useState(null)
    const [userData, setUserData] = useState({})

    useEffect(() => {
        let listener = firebase.auth.onAuthStateChanged(user => {
            user ? setSession(user) : props.history.push('/')
        })

        if (session !== null) {
            firebase.user(session.uid)
            .get()
            .then(doc => {
                if (doc && doc.exists) {
                    const myData = doc.data()
                    setUserData(myData)
                }
            })
            .catch(error => {
                console.log(error)
            })
        }
        
        return () => {
            listener()
        }
    }, [session])

    return session === null ? (
        <>
            <Loader loadingMsg={ "Veuillez patienter" } style={ {textAlign: 'center', color: 'white' } } />
        </>
    ) : (
        <div className="quiz-bg">
            <div className="container">
                <Logout />
                <Quiz userData={userData} />
            </div>   
        </div>
    )
}

export default Welcome
