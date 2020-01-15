import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { getFromStorage, getToken } from './utils/storage';
import GameCanvas from './components/GameCanvas';
import LoginMenu from './components/LoginMenu';

export default function App() {
  const [isLoading, setIsLoading] = useState(1);
  const [loggedIn, setLoggedIn] = useState(0);

  useEffect(() => {
    const handleLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      // On mount, if has code in query, use it to get a token 
      const code = params.get('code');
      if (code){
        await getToken('code', code);
        window.history.replaceState({}, document.title, "/"); // Remove code from query
      }

      // On mount, refresh token if expired
      const today = new Date();
      const expiry = JSON.parse(getFromStorage('expires'));
      const refresh = getFromStorage('refresh');
      if (refresh && expiry && expiry < today) await getToken('refresh_token', refresh);
      
      // Now try to login with (possibly) updated token
      const token = getFromStorage('token');
      if(token){
        try{
          const login = await axios.post('/api/login', { token });
          const { data } = login;
          if(data.success){
            // Logged in successfully, can now render Canvas with player info
            console.log("Logged in successfully");
            setLoggedIn(data.user);
          }
          else console.log(data.message);
        }
        catch(err) {
          console.log('Error: Error when logging in')
        }
      }
      setIsLoading(false);
    };
    handleLogin();
  }, []);

  if(isLoading){
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }

  if (loggedIn){
    return (
      <div>
        <GameCanvas user={loggedIn}/>
      </div>
    )
  }

  return (
    <div>
      <LoginMenu/>
    </div>
  )
}