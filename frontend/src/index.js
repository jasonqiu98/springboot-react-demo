import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App'
import Home from './views/Home'
import ClientList from './views/ClientList'
import ClientEdit from './views/ClientEdit'
import NotFound from './views/NotFound'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<App />}>
				<Route path="/" element={<Home />} />
				{/* An alternative way of writing the home (child) route: */}
				{/* <Route index element={<Home />} /> */}
				<Route path="/clients" element={<ClientList />} />
				<Route path="/clients/:id" element={<ClientEdit />} />
			</ Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
)

