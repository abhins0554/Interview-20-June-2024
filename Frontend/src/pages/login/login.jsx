import React from "react";

import { Link, useNavigate } from "react-router-dom";

import { LoginAPI } from '../../services/AuthService';

import "./login.css"

function Login(props) {

  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('userData')) return navigate('/home');
  });

  let [userData, setUserData] = React.useState({
    email: "",
    password: ""
  })


  const login = async () => {
    try {
      let { data } = await LoginAPI(userData);
      if (data.code === 200) {
        localStorage.setItem('userData', JSON.stringify(data.data));
        return navigate('/home');
      }
    } catch (error) {

      if (error?.response?.data?.message) return document.getElementById('error').innerText = error.response.data.message;
      else if (error.message) return document.getElementById('error').innerText = error.response.data.message;
    }
  }

  return (
    <div className="container">
      <div className="login">
        <div className="login-img">
          <img src="./img-01.webp" alt="IMG" />
        </div>
        <div className="login-form">
          <span className="login-form-title">Login</span>
          <p style={{ color: 'red' }} id="error"></p>
          <input
            className="input"
            type="text"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={e => setUserData(p => ({ ...p, email: e.target.value }))}
          />
          <br />
          <br />
          <input
            className="input"
            type="password"
            name="pass"
            placeholder="Password"
            value={userData.password}
            onChange={e => setUserData(p => ({ ...p, password: e.target.value }))}
          />
          <br />
          <br />
          <div className="container-login-form-btn">
            <button type="button" className="login-btn" onClick={login}>Login</button>
          </div>
          <div className="signupbox">
            <Link className="signup" to="/signup">
              Don't Have An Account? Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
