import React, { Component } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QuizMarvel } from '../quizMarvel'
import Levels from '../Levels'
import ProgressBar from '../ProgressBar'
import QuizOver from '../QuizOver'
import { FaChevronRight } from 'react-icons/fa'

toast.configure()

const initialState = {
    
    quizLevel: 0,
    maxQuestions: 10,
    storedQuestions: [],
    question: null,
    options: [],
    idQuestion: 0,
    btnDisabled: true,
    userAnswer: null,
    score: 0,
    showWelcomeMsg: false,
    quizEnd: false,
    gradePercent: 0
}

const levelNames = ["debutant", "confirme", "expert"]

class Quiz extends Component {

    constructor(props) {
        super(props)

        this.state = initialState

        this.storedDataRef = React.createRef()
    }

    // Charge les questions
    loadQuestions = level => {
        const fetchArray =  QuizMarvel[0].quiz[level]
        if (fetchArray.length >= this.state.maxQuestions) {
            // On stocke les question et les réponses
            this.storedDataRef.current = fetchArray
            // Enléve les réponses des questions
            const newArray = fetchArray.map(({ answer, ...keepRest}) => keepRest)
            this.setState({ storedQuestions: newArray })
        } 
        else { console.log('Pas assez de question') }
    }

    componentDidMount() {
        this.loadQuestions(levelNames[this.state.quizLevel])
    }

    componentDidUpdate(prevProps, prevState) {
        if ((this.state.storedQuestions !== prevState.storedQuestions) && this.state.storedQuestions.length) {
            this.setState({
                question: this.state.storedQuestions[this.state.idQuestion].question, // question courante
                options: this.state.storedQuestions[this.state.idQuestion].options // réponses
            })
        }
        // on passe la question suivante si le state de la question courante change
        if ((this.state.idQuestion !== prevState.idQuestion) && this.state.storedQuestions.length) {
            this.setState({
                question: this.state.storedQuestions[this.state.idQuestion].question,
                options: this.state.storedQuestions[this.state.idQuestion].options,
                userAnswer: null,
                btnDisabled: true
            })
        }
        // Affiche un message lorsque le pseudo est renseigné
        if (this.props.userData.pseudo !== prevProps.userData.pseudo) {
            this.showWelcomeMsg(this.props.userData.pseudo)
        }
        // Arrive en fin de quiz, calcul le pourcentage de reussite et applique la méthode quizOver
        if (this.state.quizEnd !== prevState.quizEnd) {
            // Calcul le % de reussite 
            const gradePercent = this.getPercentage(this.state.maxQuestions, this.state.score)
            this.gameOver(gradePercent)
        }
    }

    // Affiche un message de bienvenue
    showWelcomeMsg = pseudo => {
        if (!this.state.showWelcomeMsg) {
            this.setState({ showWelcomeMsg: true})
            toast.warn(`Bienvenue ${pseudo}, et bonne chance !`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false
            })
        }
    }

    // Affiche la prochaine question
    nextQuestion = () => {
        // fin
        if (this.state.idQuestion === this.state.maxQuestions - 1) {
            this.setState({ quizEnd: true })
        }
        else {
            this.setState(prevState => ({ idQuestion: prevState.idQuestion + 1 }))
        }

        // Modifie le score
        const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer
        // Si bonne réponse
        if (goodAnswer === this.state.userAnswer) {
            this.setState( prevState => ({ score: prevState.score + 1 }))
            // Affiche message
            toast.success(`Bravo +1`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false
            })
        } 
        // Mauvaise réponse
        else {
            toast.error('Raté 0', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false
            })
        }
    }

    submitAnswer = option => {
        this.setState({ 
            userAnswer: option,
            btnDisabled: false
        })
    }
    
    getPercentage = (maxQuest, score) => (score / maxQuest) * 100

    // Arrive à la fin du questionnaire
    gameOver = percent => {
        // Si > 50, on passe au niveau sup
        if (percent >= 50) {
            this.setState({ 
                quizLevel: this.state.quizLevel + 1,
                gradePercent: percent,
            })
        } 
        else {
            this.setState({ gradePercent: percent })
        }
    }

    // Charge les questions du niveau suivant
    loadLevelQuestions = param => {
        this.setState({...initialState, quizLevel: param})
        this.loadQuestions(levelNames[this.state.quizLevel])
    }

    render() {
        const {
            quizLevel,
            maxQuestions,
            question,
            options,
            idQuestion,
            btnDisabled,
            userAnswer,
            score,
            quizEnd,
            gradePercent
        } = this.state
    

        return quizEnd ? (
            <QuizOver ref={ this.storedDataRef } levelNames={ levelNames } score={ score } maxQuestions={ maxQuestions } quizLevel={ quizLevel } percent={ gradePercent } loadLevelQuestions={ this.loadLevelQuestions } />
        ) : (
            <>
                <Levels levelNames={ levelNames } quizLevel={ quizLevel } />
                <ProgressBar idQuestion={ idQuestion } maxQuestions={ maxQuestions } />
                <h2>{ question }</h2>
                { options.map((option, index) => {
                    return (
                        <p key={ index } className={`answerOptions ${userAnswer === option ? 'selected' : null}`} onClick={ () => this.submitAnswer(option) }>
                            <FaChevronRight />
                            { option }
                        </p>
                    )
                })}
                <button onClick={ this.nextQuestion } disabled={ btnDisabled} className="btnSubmit">{ idQuestion < maxQuestions - 1 ? 'Suivant' : 'Terminer' }</button>
            </>
        )
    }
} 

export default Quiz
