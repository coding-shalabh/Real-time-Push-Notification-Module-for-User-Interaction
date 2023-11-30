import React, { useState } from 'react'
import Signup from './Signup';
import Login from './Login';

const Home = () => {


    const [showSignup, setSignup] = useState(false);

    const handleLogin = () => {
        // Handle form submission logic here
        setSignup(true);
    }


    const handleSignup = ()=> {
        setSignup(false);
    }

  return (
    <>
        {
            showSignup ? <Signup handleSignup={handleSignup}/> : <Login handleLogin={handleLogin}/>
        }
    </>
  )
}

export default Home