import React, { useEffect, useState, useContext } from 'react'
import { FirebaseContext } from '../Firebase'
import ReactTooltip from 'react-tooltip'

const Logout = () => {

    const firebase = useContext(FirebaseContext)

    const [checked, setChecked] = useState(false)

    useEffect(() => {
        if (checked) {
            firebase.logout()
        }
    }, [checked, firebase])
    return (
        <div className="logoutContainer">
            <label className="switch">
                <input type="checkbox" checked={ checked } onChange={ e => setChecked(e.target.checked) }/>
                <span className="slider round" data-tip="Déconnexion"></span>
            </label>
            <ReactTooltip place="left" effect="solid"/>
        </div>
    )
}

export default Logout
