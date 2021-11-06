import React, { useEffect, useState } from 'react'
import { GiTrophyCup } from 'react-icons/gi'
import Loader from '../Loader'
import Modal from '../Modal'
import axios from 'axios'

const QuizOver = React.forwardRef((props, ref) => {

    const {levelNames, score, maxQuestions, quizLevel, percent, loadLevelQuestions} = props
    const [asked, setAsked] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [characterDatas, setCharacterDatas] = useState([])
    const [modalLoading, setModalLoading] = useState(true)

    const API_PUBLIC_KEY = process.env.REACT_APP_MARVEL_API_KEY
    const hash = 'e05950f985bf1b1d8104fb058fc342a5'
    
    useEffect(() => {
        setAsked(ref.current)
        // On vérifie s'il y a des données dans le localStorage
        if (localStorage.getItem('MarvelStorageDate')) {
            const date = localStorage.getItem('MarvelStorageDate')
            checkDataDate(date)
        }
    }, [ref])

    // On vérifie si le dernier enregistrement remontre à plus de 15j par rapport à la date courante
    const checkDataDate = date => {
        const today = Date.now()
        const timeDiff = today - date
        // nbre de jours de différence entre la date présente dans le localStorage et la date courante
        const daysDiff = timeDiff / (1000 * 3600 * 24) // 1000ms * 3600s * 24h
        // Si la date est > ou = à 15j, alors on efface l'ensemble des données pour aller récupérer des données "fraiches"
        if (daysDiff >= 15) {
            localStorage.clear()
            localStorage.setItem('MarvelStorageDate', Date.now())
        }
    }

    // Affiche la modal
    const showModal = id => { 
        setOpenModal(true) 
        // Si les données relatives au personnage sont déjà présentes dans le LocalStorage
        if (localStorage.getItem(id)) {
            setCharacterDatas(JSON.parse(localStorage.getItem(id)))
            setModalLoading(false)
        } 
        // Sinon, on fait un appel à l'API
        else {
            axios
            .get(`https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=${API_PUBLIC_KEY}&hash=${hash}`)
            .then(response => {
                setCharacterDatas(response.data)
                setModalLoading(false)
                // On stocke les données dans le localStorage
                localStorage.setItem(id, JSON.stringify(response.data))
                // Si la clé 'MarvelStorage' n'existe pas 
                if (!localStorage.getItem('MarvelStorageDate')) {
                    localStorage.setItem('MarvelStorageDate', Date.now())
                }
            })
            .catch(error => {
                console.log(error)
            })
        } 
    }

    // Ferme la modal 
    const hideModal = () => { 
        setOpenModal(false) 
        setModalLoading(true)
    }

    // Moyenne de référence
    const average = maxQuestions / 2

    // Si pas la moyenne
    if (score < average) {
        setTimeout(() => loadLevelQuestions(quizLevel), 3000) // Recharge le niveau
    } 

    // Affiche les options selon les résultats 
    const decison = score >= average ? ( // Résultat > à la moyenne
        <>
        <div className="stepsBtnContainer">
        {
            quizLevel < levelNames.length ? ( // S'il y a encore un niveau à passer
                <>
                    <p className="successMsg">Bravo passez au niveau suivant !</p>
                    <button onClick={ () => loadLevelQuestions(quizLevel) } className="btnResult success">Niveau Suivant</button>
                </>
            ) : ( //  Il n'y a pas plus de niveau
                <>
                    <p className="successMsg"><GiTrophyCup size="50px" />Bravo vous êtes un expert !</p>
                    <button onClick={() => loadLevelQuestions(0)} className="btnResult gameOver">Accueil</button>
                </>
            )
        }
        </div>
        <div className="percentage">
            <div className="progressPercent">Reussite { percent }%</div>
            <div className="progressPercent">Note: { score }/{ maxQuestions }</div>
        </div>
        </>
    ) : ( // Résultat < à la moyenne
        <>
            <div className="stepsBtnContainer">
                <p className="failureMsg">Vous avez echoué !</p>
            </div>
            <div className="percentage">
                <div className="progressPercent">Reussite { percent }%</div>
                <div className="progressPercent">Note: { score }/{ maxQuestions }</div>
            </div>
        </>
    )

    const html = score >= average ? (
        asked.map(question => {
            return (
                <tr key={ question.id }>
                    <td>{ question.question }</td>
                    <td>{ question.answer }</td>
                    <td><button className="btnInfo" onClick={ () => showModal(question.heroId) }>Infos</button></td>
                </tr>
            )
        })
    ) : (
        <tr>
            <td colSpan="3">
                <Loader loadingMsg={ "Pas de réponses ! " } style={ {textAlign: 'center', color: 'red' } } />
            </td>
        </tr>
    )

    const resultInModal = !modalLoading ? (
        <>
            <div className="modalHeader">
                <h2>{ characterDatas.data.results[0].name }</h2>
            </div>
            <div className="modalBody">
                <div className="comicImage">
                    <img src={ characterDatas.data.results[0].thumbnail.path + '.' + characterDatas.data.results[0].thumbnail.extension } alt={ characterDatas.data.results[0].name }/>
                    { characterDatas.attributionText }
                </div>
                <div className="comicDetails">
                    <h3>Description</h3>
                    {
                        characterDatas.data.results[0].description ? <p>{ characterDatas.data.results[0].description }</p> : <p>Description indisponible ...</p>
                    }
                    <h3>Plus d'infos</h3>
                    {
                        characterDatas.data.results[0].urls && characterDatas.data.results[0].urls.map((url, index) => { // S'il y a un array avec les urls
                            return <a key={ index } href={ url.url } target="_blank" rel="noopener noreferrer">{ url.type }</a>
                        })
                    }

                </div>
            </div>
            <div className="modalFooter">
                <button className="modalBtn" onClick={ hideModal }>Fermer</button>
            </div>
        </>
    ) : (
        <>
            <div className="modalHeader">
                <h2>Réponse de Marvel</h2>
            </div>
            <div className="modalBody">
                <Loader />
            </div>
        </>
    )

    return (
        <>
            { decison }
            <hr/>
            <p>Les réponses aux questions posées:</p>

            <div className="answerContainer">
                <table className="answers">
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Réponse</th>
                            <th>Infos</th>
                        </tr>
                    </thead>
                    <tbody>
                        { html }
                    </tbody>
                </table>
            </div>

            <Modal showModal={ openModal } hideModal={ hideModal }>
                { resultInModal }
            </Modal>
        </>
    )
})



export default React.memo(QuizOver)
