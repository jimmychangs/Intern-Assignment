import { useState } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link 
} from "react-router-dom";
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { ToDoWrapper } from './components/ToDoWrapper';
import { AuthProvider } from './contexts/authContext';

function App() {

  return (
    <AuthProvider>

    <Router>
    {/* <div className="App"> */}
        <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/Login" element={<Login/>}/>

        <Route path="/Signup" element={<Signup/>}/>

        <Route path="/todos" element={<ToDoWrapper/>}/>
        </Routes>
       {/* <ToDoWrapper /> */}
    {/* </div> */}
    </Router>
    </AuthProvider>
  )
}

export default App
