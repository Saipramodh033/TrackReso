import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// ReactDOM.createRoot(document.getElementById('root')).render(
//   <h1>Hello, React is working!</h1>
// );
