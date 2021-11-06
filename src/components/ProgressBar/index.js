import React from 'react'

const ProgressBar = ({ idQuestion, maxQuestions }) => {

    const getPercent = (totalQuestions, questionId) => {
        return (100 / totalQuestions) * questionId
    }

    const actualQuestion = idQuestion + 1
    const actualPercent = getPercent(maxQuestions, actualQuestion)
    return (
        <>
            <div className="percentage">
                <div className="progressPercent">{`Question ${actualQuestion}/${maxQuestions}`}</div>
                <div className="progressPercent">Progression: {actualPercent}%</div>
            </div>
            <div className="progressBar">
                <div className="progressBarChange" style={{width: `${actualPercent}%`}}></div>
            </div>
        </>
    )
}

export default React.memo(ProgressBar)
