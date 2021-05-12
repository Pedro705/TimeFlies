import './login.css';
import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function Login() {
    return (
      <div className="main">
          <p className="sign" align="center">Sign in</p>
          <form className="form1">
            <input id="username" className="un " type="text" align="center" placeholder="Username"></input>
            <input id="password" className="pass" type="password" align="center" placeholder="Password"></input>
            <input className="submit" align="center" type="button" onclick="validate()" value="Sign in"></input>
          </form>
      </div>
    );
  }

//<p class="forgot" align="center"><a href="register.html">Register</p>
//<Link to="/Menu">About</Link>
export default Login;