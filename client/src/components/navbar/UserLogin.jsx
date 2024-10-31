import login_icon from '../../assets/images/icon_login.svg';
import { useContextUserSession } from '../contexts/ContextUserSession';
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";


const UserLogin = () => {
    const { makecallSignup, makecallSignin, handleSignout, inSession, resourceOwner } = useContextUserSession();
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

    return (
        <div className="user-login">
            <a onClick={() => setOpenLogin(!openLogin)}>
                <img src={login_icon} alt="login" className="login-icon" />
            </a>
            
            {openLogin && <div className="dialog-backdrop" onClick={() => setOpenLogin(false)}></div>}

            <dialog open={openLogin} className="dialog login" ref={dialogRef}>

               
                {!inSession 
                    ? (switchForm ? (loginForm()) : (registerForm())) 
                    : (
                    <>
                        <div>{resourceOwner.email}</div>
                        <button onClick={handleSignout}>Sign-out</button>
                        {console.log("Session state: ", inSession)}
                    </>
                )}
                
            </dialog>
        </div>
    );
}

export default UserLogin;
