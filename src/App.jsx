import { useState } from 'react'
import Login from './Login'
import Home from './Home'
import './App.css'
import './Cadastro.css'

function Cadastro({ onGoToLogin }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem!')
      return
    }
    
    console.log('Dados do usuário:', formData)
    alert('Usuário cadastrado com sucesso!')
    
    setFormData({
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: ''
    })
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <div className="user-icon">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
            <path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z" fill="#646cff"/>
          </svg>
        </div>
        
        <h1 className="cadastro-title">Criar Conta</h1>
        
        <form onSubmit={handleSubmit} className="cadastro-form">
          <div className="input-group">
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#999"/>
              </svg>
            </div>
            <input
              type="text"
              name="nome"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" fill="#999"/>
              </svg>
            </div>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" fill="#999"/>
              </svg>
            </div>
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" fill="#999"/>
              </svg>
            </div>
            <input
              type="password"
              name="confirmarSenha"
              placeholder="Confirmar senha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="cadastro-btn">
            Cadastrar
          </button>
        </form>
        
        <div className="login-link">
          <span>Já tem conta? </span>
          <button type="button" className="login-account-btn" onClick={onGoToLogin}>
            Fazer login
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [currentPage, setCurrentPage] = useState('cadastro')
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('isLoggedIn') === 'true'
  })

  const handleLogin = () => {
    setIsLoggedIn(true)
    sessionStorage.setItem('isLoggedIn', 'true')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    sessionStorage.removeItem('isLoggedIn')
  }

  if (isLoggedIn) {
    return <Home onLogout={handleLogout} />
  }

  if (currentPage === 'login') {
    return <Login onGoToCadastro={() => setCurrentPage('cadastro')} onLogin={handleLogin} />
  }

  return <Cadastro onGoToLogin={() => setCurrentPage('login')} />
}

export default App
