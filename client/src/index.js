import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import App from './App'
import store from './views/dashboard/store'
import { BrowserRouter } from 'react-router-dom'
// import store from './store'

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
 
 <Provider store={store}>
    <App />
  </Provider>
 </BrowserRouter>
)
