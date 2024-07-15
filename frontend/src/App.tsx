import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Register from './pages/register/Register'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import SharedLayout from './pages/SharedLayout'
import { useAppContext } from './context/AppContext'

function App() {
  const { userData } = useAppContext()

  const PrivateRoute = () => {
    return userData ? <SharedLayout /> : <Navigate to="/signin" />;
  };


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PrivateRoute />}>
            <Route index element={<Home />} />
          </Route>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
