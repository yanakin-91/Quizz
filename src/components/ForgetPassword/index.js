import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FirebaseContext } from '../Firebase'

const successBox = {
    border: "1px solid green",
    background: "green",
    color: '#FFFFFF'
}

const errorBox = {
    border: "1px solid red",
    background: "red",
    color: "#FFFFFF"
}

const ForgetPassword = () => {

    const firebase = useContext(FirebaseContext)

    console.log(firebase)

    const [email, setEmail] = useState('')
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState()

    const handleSubmit = e => {
        e.preventDefault()
        firebase.passwordReset(email).then(() => {
            setError(null)
            setSuccess('Un message a été bien envoyé sur votre email. Veuillez le consulter')
        }).catch(error => {
            setError(error)
            setEmail('')
        })
    }

    const disabled = email === ''

    return (
        <div className="signUpLoginBox">
            <div className="slContainer">
                <div className="formBoxLeftForget"></div> 
                <div className="formBoxRight">
                    <div className="formContent">
                        {success && <span style={successBox}>{success}</span>}
                        {error && <span style={errorBox}>{error.message}</span>}
                        <h2>Mot de passe oublié ?</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                                <input onChange={e => setEmail(e.target.value)} value={email} type="email" id="email" autoComplete="off" required />
                                <label htmlFor="email">Email</label>
                            </div>
                            <button disabled={disabled}>Récupérer</button>
                        </form>
                        <div className="linkContainer">
                            <Link className="simpleLink" to="/login">Déjà inscrit ? Connectez-vous</Link>
                        </div>
                    </div>
                </div>  
            </div>
        </div>
    )
}

export default ForgetPassword
