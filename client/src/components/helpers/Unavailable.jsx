import React from 'react';

const Unavailable = ({setUnavailable}) => {
    const handleClose = () => {
        setUnavailable(false);
    };

    return(
        <>
        <dialog className="oops" open>
            <div className="oops-content">
                <div className="oops-title">
                    <h4>Oops!</h4>
                    <div className="close_dialog" onClick={handleClose}>close <b>&#x2716;</b></div>
                </div>
                <div className="oops-detail">
                    <p>Sorry, this feature is not available yet.</p>
                </div>
            </div>
        </dialog>
        <div className="dialog-backdrop-dark" onClick={handleClose}></div>
        </>
    );
}

export default Unavailable;