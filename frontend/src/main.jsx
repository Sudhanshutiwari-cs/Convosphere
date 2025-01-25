import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from './components/ui/sonner.jsx'
import { Provider } from 'react-redux'

import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import store from './redux/store'
let persistor = persistStore(store)
createRoot(document.getElementById('root')).render(
    <>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
                <Toaster />
            </PersistGate>
        </Provider>
    </>


)
