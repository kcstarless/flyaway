import login_icon from '../../assets/images/icon_login.svg';
import { useContextUserSession } from '../contexts/ContextUserSession';
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";   
import { getDateDayDDMMYYYY, isoDateToHHMM24 } from '../helpers/general';

const UserLogin = () => {
    const { makecallSignup, makecallSignin, handleSignout, inSession, errorMessage, upcoming } = useContextUserSession();
    const [openLogin, setOpenLogin] = useState(false);
    const [switchForm, setSwitchForm] = useState(true);
    const dialogRef = useRef(null);

    // Separate useForm instances for sign-in and sign-up
    const { register: registerSignin, handleSubmit: handleSigninSubmit, formState: { errors: signinErrors } } = useForm();
    const { register: registerSignup, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors } } = useForm();

    const submitSignup = async (data) => {
        const email = data.signupEmail;
        const password = data.signupPassword;
        const passwordConfirm = data.signupConfirmPassword;

        if (password !== passwordConfirm) {
            console.log("Password do not match");
            return;
        }

        makecallSignup(email, password);
    }

    const submitSignin = (data) => {
        const email = data.signinEmail;
        const password = data.signinPassword;

        makecallSignin(email, password);
    }

    function loginForm() {
        return (
            <>
            <form className="signin_form" onSubmit={handleSigninSubmit(submitSignin)}>
                <fieldset className="signin">
                    <div className="legend-header">
                        <div className="legend-header-title">Sign-in</div> 
                        {errorMessage && <p className="error">{errorMessage}</p>}                 
                        <div className="close_dialog" onClick={() => setOpenLogin(!openLogin)}>close <b>&#x2716;</b></div>
                    </div>
                    <div className="item">
                        <div className="item-title">
                            Email {signinErrors?.signinEmail && <span className="validation">{signinErrors.signinEmail.message}</span>}
                        </div>
                        <div className="item-input">    
                            <input {...registerSignin('signinEmail', { required: " is required." })} type="text" placeholder='email' />
                        </div>
                    </div>
                    <div className="item">
                        <div className="item-title">
                            Password {signinErrors?.signinPassword && <span className="validation">{signinErrors.signinPassword.message}</span>}
                        </div>
                        <div className="item-input">    
                            <input {...registerSignin('signinPassword', { required: " is required." })} type="password" placeholder='password' />
                        </div>
                    </div>
                    <div className="item">
                        <div className="item-button">
                            <button className="btn btn--primary" type="submit">Sign-in</button>
                        </div>
                    </div>
                </fieldset>
            </form>
            <hr />
            <div className="signin-options">
                <div>Forgot your password? <a>reset password</a></div>
                <div>Register an <a onClick={() => setSwitchForm(!switchForm)}>account</a></div>
            </div>
            </>
        )
    }

    function registerForm() {
        return (
            <>
            <form className="signup_form" onSubmit={handleSignupSubmit(submitSignup)}>
                <fieldset className="signup">
                    <div className="legend-header">
                        <div className="legend-header-title">Registration</div>                  
                        <div className="close_dialog" onClick={() => setOpenLogin(!openLogin)}>close <b>&#x2716;</b></div>
                    </div>

                    <div className="item">
                        <div className="item-title">
                            Email {signupErrors?.signupEmail && <span className="validation">{signupErrors.signupEmail.message}</span>}
                        </div>
                        <div className="item-input">    
                            <input {...registerSignup('signupEmail', { required: " is required." })} type="text" placeholder='email' />
                        </div>
                    </div>
                    <div className="item">
                        <div className="item-title">
                            Password {signupErrors?.signupPassword && <span className="validation">{signupErrors.signupPassword.message}</span>}
                        </div>
                        <div className="item-input">    
                            <input {...registerSignup('signupPassword', { required: " is required." })} type="password" placeholder='password' />
                        </div>
                    </div>
                    <div className="item">
                        <div className="item-title">
                            Confirm password {signupErrors?.signupConfirmPassword && <span className="validation">{signupErrors.signupConfirmPassword.message}</span>}
                        </div>
                        <div className="item-input">    
                            <input {...registerSignup('signupConfirmPassword', { required: " is required." })} type="password" placeholder='confirm_password' />
                        </div>
                    </div>
                    <div className="item">
                        <div className="item-button"> 
                            <button type="submit" className="btn btn--primary">Register</button>
                        </div>
                    </div>
                </fieldset>
                
            </form>
            <hr />
            <div className="signin-options">
                <div>Already have an account? <a onClick={() => setSwitchForm(!switchForm)}>sign-in</a></div>
            </div>
            </>
        )
    }

    function signedIn() {
        return (
            <>
            <form className="signup_form">
            <fieldset className="signup">
                    <div className="legend-header">
                        <div className="legend-header-title">Upcoming Flights</div>                  
                        <div className="close_dialog" onClick={() => setOpenLogin(!openLogin)}>close <b>&#x2716;</b></div>
                    </div>

                    {/* Loop through all upcoming flights */}
                    {upcoming.length > 0 ? (
                        upcoming.map((flight, index) => (
                            <div key={index} className="item">
                                <div className="item-title">
                                    {/* You can display specific information here about each flight */}
                                    <p>{getDateDayDDMMYYYY(flight.time_of_departure)}</p>
                                    Flight to <b>{flight.destination}</b> at {isoDateToHHMM24(flight.time_of_departure)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No upcoming flights</p>  // Handle case where there are no upcoming flights
                    )}
                    <div className="item">
                        <div className="item-button"> 
                            <button type="submit" className="btn btn--primary" onClick={handleSignout}>Sign-out</button>
                        </div>
                    </div>
                </fieldset>
                </form>
            </>
        )
    }

    function upcomingFlight() {
        if (upcoming.length === 0) return
        return (
            <div className="upcoming-flights" onClick={() => setOpenLogin(!openLogin)} >
            <p>Upcoming flight to <b>{upcoming[0].destination}</b></p>
            </div>
        )
    }

    return (
        <div className="user-login">
            
            {inSession && upcomingFlight()}

            <img src={login_icon} alt="login" className="login-icon"  onClick={() => setOpenLogin(!openLogin)} />
            
            {openLogin && <div className="dialog-backdrop" onClick={() => setOpenLogin(false)}></div>}

            <dialog open={openLogin} className="dialog login" ref={dialogRef}>
               
                {!inSession 
                    ? (switchForm ? (loginForm()) : (registerForm())) 
                    : (
                    <div className="signin_form">
                        {signedIn()}
                        {/* <div>Welcome back! {resourceOwner.email}</div>
                        <button onClick={handleSignout}>Sign-out</button> */}
                        {/* {console.log("Session state: ", inSession)}
                        {console.log("User details: ", resourceOwner)} */}
                    </div>
                )}
                
            </dialog>
        </div>
    );
}

export default UserLogin;
