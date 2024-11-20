import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Unavailable = ({setUnavailable}) => {
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

export const NavigateHome = ({setUnavailable, message = null}) => {
    const navigate = useNavigate();
    const handleClose = () => {
        setUnavailable(false);
        navigate('/');
    };

    return(
        <>
        <dialog className="oops" open>
            <div className="oops-content">
                <div className="oops-title">
                    <h4>Confirmation.</h4>
                    <div className="close_dialog" onClick={handleClose}>close <b>&#x2716;</b></div>
                </div>
                <div className="oops-detail">
                    <p>{message}</p>
                </div>
            </div>
        </dialog>
        <div className="dialog-backdrop-dark" onClick={handleClose}></div>
        </>
    );
}