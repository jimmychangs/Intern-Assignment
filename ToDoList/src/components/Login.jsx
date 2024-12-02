import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doSignInWithGoogle} from './firebase/auth';
import { useAuth } from '../contexts/authContext';

export const Login = () => {
    const { userLoggedIn, setUserLoggedIn } = useAuth(false)

    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const[isSigningIn, setIsSigningIn] = useState(false)
    const[errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const onSubmit = async (e) => {
        e.preventDefault();
        if(!isSigningIn) {
            setIsSigningIn(true);
            await doSignInWithEmailAndPassword(email, password)
            navigate('/todos')
        }
        
    }

    const onGoogleSignIn = (e) => {
        e.preventDefault()
        if(!isSigningIn) {
            setIsSigningIn(true)
            doSignInWithGoogle().catch(err => {
                setIsSigningIn(false)
            })
            setIsSigningIn(false)
        }
    }
    return (
      <div>
        {/* {userLoggedIn &&  (<Link to={"./todos"}/>)} */}
        <div className="signup-header">
            <h1>Login</h1>
        </div>
      <form className="signup-form" onSubmit={onSubmit}>
      <input type="text" className="email-input" value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)}></input>
      <input type="password" className="password-input" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}></input>
      <button type="submit" className="signup-btn">Submit</button>
      <button className="signup-btn">
          <Link to={'/signup'}>
          Sign Up
          </Link>
        </button>
  </form>
      </div>
    )
  }