import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FirebaseContext } from '../Firebase'

function Signup(props) {

    const firebase = useContext(FirebaseContext)

    const data = {
        pseudo : '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    const [loginData, setLoginData] = useState(data)
    const [error, setError] = useState('')

    const handleChange = e => {
        setLoginData({...loginData, [e.target.id] : e.target.value })
    }

    const handleSubmit = e => {
        e.preventDefault()
        const { email, password, pseudo } = loginData
        firebase.register(email, password)
        .then(auth => {
            firebase.user(auth.user.uid).set({
                pseudo,
                email
            })
        })
        .then((user) => {
            setLoginData({...data})
            props.history.push('/welcome')
        }).catch(error => {
            setError(error)
            setLoginData({ ...data})
        })
    }

    const displayPassword = e => {
        const target = e.target.previousSibling.previousSibling
        const type = target.getAttribute('type')
        e.target.classList.toggle('open')
        type === 'password' ? target.setAttribute('type', 'text') : target.setAttribute('type', 'password')
    }

    const { pseudo, email, password, confirmPassword } = loginData

    const btn = pseudo === '' || email === '' || password === '' || password !== confirmPassword ? <button disabled>Inscription</button> : <button>Inscription</button>

    //gestion des erreurs
    const errorMsg = error !== '' && <span>{error.message}</span>

    return (
        <div className="signUpLoginBox">
            <div className="slContainer">
                <div className="formBoxLeftSignup"></div> 
                <div className="formBoxRight">
                    <div className="formContent">
                        {errorMsg}
                         <h2>Inscription</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                                <input onChange={handleChange} value={pseudo} type="text" id="pseudo" autoComplete="off" required />
                                <label htmlFor="pseudo">Pseudo</label>
                            </div>
                            <div className="inputBox">
                                <input onChange={handleChange} value={email} type="email" id="email" autoComplete="off" required />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="inputBox">
                                <input onChange={handleChange} value={password} type="password" id="password" autoComplete="off" required />
                                <label htmlFor="passwword">Mot de passe</label>
                                <span className="eyePassword" onClick={displayPassword}></span>
                            </div>
                            <div className="inputBox">
                                <input onChange={handleChange} value={confirmPassword} type="password" id="confirmPassword" autoComplete="off" required />
                                <label htmlFor="confirmPpassword">Confirmer le mot de passe</label>
                                <span className="eyePassword" onClick={displayPassword}></span>
                            </div>
                            {btn}
                        </form>
                        <div className="linkContainer">
                            <Link className="simpleLink" to="/login">Déja inscrit ? Connectez-vous</Link>
                        </div>
                    </div>
                </div>  
            </div>
        </div>
    )
}

export default Signup
