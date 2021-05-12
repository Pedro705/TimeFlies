import styles from './register.module.css';
import axios from 'axios';
import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function Register() {

    //const url = 'https://localhost:5000/registerpersona';

    /*const registervalidate = (requestOptions) =>{
    
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
    }*/

    useEffect(() => {
        getAPI();
      }, []);
    
      const getAPI = () => {
        const url = 'http://localhost:5000/hello';

        var credentials = {
            name: "zadiki",
            contact: "0705578809",
            email: "zadiki",
            message: "test",
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then(data => console.log(data));
      };
    

    const handleSubmit = (event) => {

        /*const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: event.target[0].value, password: event.target[1].value, repassword: event.target[2].value})
        };*/
        
        const url = 'http://localhost:5000/hello';

        var data = {
            name: "zadiki",
            contact: "0705578809",
            email: "zadiki",
            message: "test",
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ title: 'React POST Request Example' })
        };

        fetch(url, requestOptions)
            .then((response) => console.log(response));
        /*fetch(url, {
            method: 'POST',
            headers : { 
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({name: "zadiki"})
        })
            /*.then(function (response) {
                
                return response.json();})
            
            .then(function (myJson) {
                console.log(myJson);
            });*/
        
    }

    return (
        <div className={styles.body}>
            <div className={styles.main}>
                <p className={styles.sign} align="center">Register</p>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input id="username" className={styles.un} type="text" align="center" placeholder="Username" />
                    <input id="password" className={styles.pass} type="password" align="center" placeholder="Password" />
                    <input id="repassword" className={styles.pass} type="password" align="center" placeholder="Re-Password" />
                    <input className={styles.submit} align="center" type="submit"  value="Register"/>
                </form>
            </div>
        </div>
    );
}

//<p class="forgot" align="center"><a href="login.html"/>Sign in</p>
export default Register;