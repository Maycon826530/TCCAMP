import { useState } from 'react'
import Login from './Login'
import Cadastro from './Cadastro'
import Home from './Home'
import './App.css'
import './Accessibility.css'

function App() {
  const [currentPage, setCurrentPage] = useState('cadastro')
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('isLoggedIn') === 'true'
  })
  const [accessibilityMode, setAccessibilityMode] = useState(() => {
    return localStorage.getItem('accessibilityMode') === 'true'
  })

  const handleLogin = (userData) => {
    setIsLoggedIn(true)
    sessionStorage.setItem('isLoggedIn', 'true')
    if (userData && userData.nome) {
      sessionStorage.setItem('userName', userData.nome)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    sessionStorage.removeItem('isLoggedIn')
  }

  const toggleAccessibilityMode = () => {
    const newMode = !accessibilityMode
    setAccessibilityMode(newMode)
    localStorage.setItem('accessibilityMode', newMode.toString())
  }

  if (isLoggedIn) {
    return <Home onLogout={handleLogout} />
  }

  if (currentPage === 'login') {
    return (
      <div className={accessibilityMode ? 'accessibility-mode' : ''}>
        <div className="accessibility-header">
          <button 
            className="accessibility-toggle-login"
            onClick={toggleAccessibilityMode}
            title={accessibilityMode ? 'Desativar modo de acessibilidade' : 'Ativar modo de acessibilidade - Letras maiores'}
          >
            {accessibilityMode ? '🔍 Modo Normal' : '🔍 Letras Grandes'}
          </button>
        </div>
        <Login onGoToCadastro={() => setCurrentPage('cadastro')} onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div className={accessibilityMode ? 'accessibility-mode' : ''}>
      <div className="accessibility-header">
        <button 
          className="accessibility-toggle-login"
          onClick={toggleAccessibilityMode}
          title={accessibilityMode ? 'Desativar modo de acessibilidade' : 'Ativar modo de acessibilidade - Letras maiores'}
        >
          {accessibilityMode ? '🔍 Modo Normal' : '🔍 Letras Grandes'}
        </button>
      </div>
      <Cadastro onGoToLogin={() => setCurrentPage('login')} onLogin={handleLogin} />
    </div>
  )
}

export default App
