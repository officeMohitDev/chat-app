import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import Register from './pages/register/Register'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import SharedLayout from './pages/SharedLayout'
import { useAppContext } from './context/AppContext'

function App() {
  const { userData } = useAppContext()

  const PrivateRoute = () => {
    return userData ? <Outlet /> : <Navigate to="/login" />;
  };

  const IfLoggedIn = () => {
    return userData ? <Navigate to="/" /> : <Outlet />;

  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PrivateRoute />}>
            <Route index element={<SharedLayout />} />
          </Route>
          <Route path='/' element={<IfLoggedIn />}>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
