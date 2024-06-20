import React from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { SignupAPI } from '../../services/AuthService';

import "./signup.css";


function Signup(props) {

    const navigate = useNavigate();

    React.useEffect(() => {
        if (localStorage.getItem('userData')) return navigate('/home');
    }, []);

    let [userData, setUserData] = React.useState({
        email: "",
        password: "",
        repeat_password: "",
        fullname: "",
        username: "",
    })

    const signup = async () => {
        try {
            let { data } = await SignupAPI(userData);
            if (data.code === 200) {
                return document.getElementById('error').innerText = data.message;
            }
        } catch (error) {
            if (error?.response?.data?.message) return document.getElementById('error').innerText = error?.response?.data?.message;
            else if (error.message) return document.getElementById('error').innerText = error.response.data.message;
        }
    }

    return (
        <div className="container">
            <div className="signup">
                <div className="signup-img">
                    <img src="./img-01.webp" alt="IMG" />
                </div>
                <div className="signup-form">
                    <span className="signup-form-title">Sign Up</span>
                    <p style={{ color: 'red' }} id="error"></p>
                    <input
                        className="input"
                        type="text"
                        name="fullname"
                        placeholder="Full Name"
                        value={userData.fullname}
                        onChange={e => setUserData(p => ({ ...p, fullname: e.target.value }))}
                    />
                    <br /><br />
                    <input
                        className="input"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={userData.username}
                        onChange={e => setUserData(p => ({ ...p, username: e.target.value }))}
                    />
                    <br /><br />
                    <input
                        className="input"
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={userData.email}
                        onChange={e => setUserData(p => ({ ...p, email: e.target.value }))}
                    />
                    <br /><br />
                    <input
                        className="input"
                        type="password"
                        name="pass"
                        placeholder="Password"
                        value={userData.password}
                        onChange={e => setUserData(p => ({ ...p, password: e.target.value }))}
                    />
                    <br /><br />
                    <input
                        className="input"
                        type="password"
                        name="pass"
                        placeholder="Rewrite Password"
                        value={userData.repeat_password}
                        onChange={e => setUserData(p => ({ ...p, repeat_password: e.target.value }))}
                    />
                    <br /><br />
                    <div className="container-login-form-btn">
                        <button className="signup-btn" onClick={signup}>SignUp</button>
                    </div>
                    <div className="signupbox">
                        <Link className="login" to="/login">Have An Account? Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;