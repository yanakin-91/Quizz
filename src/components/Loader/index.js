import React from 'react'

const Loader = ({ loadingMsg, style }) => {
    return (
        <>
            <div className="loader"></div>
            <p style={ style } >{ loadingMsg }</p>
        </>
    )
}

export default Loader
