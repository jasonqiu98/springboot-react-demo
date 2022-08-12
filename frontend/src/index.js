import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App'
import About from './views/About'
import ClientList from './views/ClientList'
import Login from './views/Login'
import NotFound from './views/NotFound'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Navigate replace to="/clients" />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/about" element={<About />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)

