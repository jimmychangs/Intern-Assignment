import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from './firebase/auth';

export const Signup = () => {
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const[isRegistering, setIsRegistering] =useState(false)
    const navigate = useNavigate()
    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!isRegistering){
          setIsRegistering(true)
          await doCreateUserWithEmailAndPassword(email, password)
          setIsRegistering(false)
          navigate('/todos')
        }
    }
    return (
      <div>
        <div className="signup-header">
            <h1>Sign up</h1>
        </div>
      <form className="login-form" onSubmit={handleSubmit}>
      <input type="text" className="email-input" value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)}></input>
      <input type="text" className="password-input" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}></input>
      <button type="submit" className="login-btn">Submit</button>
      <button className="login-btn">
          <Link to={'/Login'}>
          Login
          </Link>
        </button>
  </form>
      </div>
    )
  }