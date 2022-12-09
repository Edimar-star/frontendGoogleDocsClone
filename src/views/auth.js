import { useState } from "react";
import { postRequest } from "../components/requests";
import '../CSS/login.css'
import fondo from '../images/fondo.svg'
import Swal from 'sweetalert2'

export default function Auth({ setAuth }) {
    const [emailRegister, setEmailRegister] = useState('');
    const [passwordRegister, setPasswordRegister] = useState('');
    const [emailLogin, setEmailLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');
    const [toggleTab, setToggleTab] = useState(1);

    const LoginSubmit = async (e) => {
        e.preventDefault();
        const data = await postRequest('login', { email: emailLogin, password: passwordLogin })
        if (typeof data === 'string') {
            Swal.fire(data)
        } else {
            setAuth(data)
            localStorage.setItem('user', JSON.stringify(data))
        }
    }

    const signupSubmit = async (e) => {
        e.preventDefault();
        const data = await postRequest('register', { email: emailRegister, password: passwordRegister });
        if (typeof data === 'string') {
            Swal.fire(data)
        } else {
            setToggleTab(1);
        }
    }

    return (
        <div className="row justify-content-around align-items-center content">
            <img className="col-md-5 col-12 col-sm-5" src={fondo} />
            <div className="col-md-4 col-12 col-sm-7 tab-content">
                <h1>{toggleTab == 1 ? "Sign In" : "Sign Up"}</h1>
                <form autoComplete="off" className={toggleTab == 1 ? "tab-active" : "tab"} onSubmit={LoginSubmit}>
                    <div className="form-floating mb-3">
                        <input required type="email" value={emailLogin} 
                          onChange={e => setEmailLogin(e.target.value)} name='email'
                          className="form-control" id="floatingInput" placeholder="name@example.com" />
                        <label htmlFor="floatingInput">Email</label>
                    </div>
                    <div className="form-floating">
                        <input required type="password" value={passwordLogin} 
                          onChange={e => setPasswordLogin(e.target.value)} name='password'
                          className="form-control" id="floatingPassword" placeholder="Password" />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <div className="d-grid gap-2">
                        <button className="btn btn-primary" type="submit" value="submit">Log In</button>
                    </div>
                    <h6>No Have an account? <span onClick={() => setToggleTab(2)}>Sign Up</span></h6>
                </form>
                <form autoComplete="off" className={toggleTab == 2 ? "tab-active" : "tab"} 
                    id="Signup" onSubmit={signupSubmit}>
                    <div className="form-floating mb-3">
                        <input required type="email" value={emailRegister} 
                          onChange={e => setEmailRegister(e.target.value)} name='email'
                          className="form-control" placeholder="name@example.com" />
                        <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating">
                        <input required type="password" value={passwordRegister} 
                          onChange={e => setPasswordRegister(e.target.value)} name='password'
                          className="form-control" placeholder="Password" />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <div className="d-grid gap-2">
                        <button className="btn btn-primary" type="submit" value="submit">Sign Up</button>
                    </div>
                    <h6>Have an account? <span onClick={() => setToggleTab(1)}>Log In</span></h6>
                </form>
            </div>
        </div>
    );
}