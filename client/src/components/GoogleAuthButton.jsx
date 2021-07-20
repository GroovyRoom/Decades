import React, {useEffect, useState} from 'react'
import {GoogleLogin} from 'react-google-login';
import axios from 'axios'

const handleLogin = async googleData => {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({token: googleData.tokenId}),
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  
  function GoogleLog(props) {
    return <GoogleLogin
            clientId="244554015002-dq6ervkiinn5ocu3c0bkngrgnmtalfok.apps.googleusercontent.com"
            buttonText="Log in with Google"
            onSuccess={handleLogin}
            onFailure={handleLogin}
            cookiePolicy={'single_host_origin'}
    />;
  }
  
  const authCheck = async auth => {
    const res = await fetch("/api/auth/test", {
      method: "POST",
      body: "",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include'
     });
  
    const data = await res.json();
    console.log(data);
  
    if (data === true) {
      return <button onClick="handleLogout()">Log out</button>;
    }
    else {
      return <GoogleLog />;
    }
  }
  
  function GoogleAuthButton() {
    useEffect(() => {

      axios.get('/api/auth/test').then(res => {
        console.log(res.data)
        if (res.data === true) {
          setAuth(<button onClick="handleLogout()">Log out</button>)
        }
        else {
          setAuth(<GoogleLog/>);
        }
      }) 
      }, [])
  
    const [auth, setAuth] = useState('');
    const [state, setState] = useState('')
    
  
  
    return (
      <div>
          <p>{auth}</p>
          <p>Server call (v.6): {state}</p>
      </div>
    );
  }
  
  export default GoogleAuthButton;
  