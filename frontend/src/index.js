import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App'
import About from './views/About'
import ClientList from './views/ClientList'
import NotFound from './views/NotFound'
import Register from './views/registration/Register'
import RegistrationSuccess from './views/registration/RegistrationSuccess'
import ResetPassword from './views/resetPassword/ResetPassword'
import ResetPasswordSuccess from './views/resetPassword/ResetPasswordSuccess'
import { Provider } from 'react-redux'
import store from './redux/store'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate replace to="/clients" />} />
          <Route path="/login" element={<Navigate replace to="/clients" />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/about" element={<About />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/registrationSuccess" element={<RegistrationSuccess />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/resetSuccess" element={<ResetPasswordSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </Provider>
)

