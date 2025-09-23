import { useState, useEffect } from 'react'
import Login from './Login'
import Home from './Home'
import './App.css'
import './Cadastro.css'
import './Accessibility.css'

function Cadastro({ onGoToLogin, onLogin }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    idade: '',
    comorbidade: ''
  })

  useEffect(() => {
    document.title = 'PharmaLife - Cadastro'
  }, [])

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
    
    // Verificar se usuário já existe
    const usuariosExistentes = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]')
    const nomeExiste = usuariosExistentes.find(u => u.nome.toLowerCase() === formData.nome.toLowerCase())
    const emailExiste = usuariosExistentes.find(u => u.email.toLowerCase() === formData.email.toLowerCase())
    
    if (nomeExiste) {
      alert('Nome de usuário já cadastrado!')
      return
    }
    
    if (emailExiste) {
      alert('Email já cadastrado!')
      return
    }
    
    // Salvar usuário no localStorage para o admin visualizar
    const novoUsuario = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      idade: formData.idade,
      comorbidade: formData.comorbidade,
      dataCadastro: new Date().toISOString(),
      ultimoLogin: null
    }
    
    usuariosExistentes.push(novoUsuario)
    localStorage.setItem('usuariosCadastrados', JSON.stringify(usuariosExistentes))
    
    console.log('Dados do usuário:', formData)
    alert('Conta criada com sucesso! Bem-vindo ao PharmaLife!')
    onLogin(formData)
    
    setFormData({
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      idade: '',
      comorbidade: ''
    })
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">

        
        <div className="hospital-icon">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
            <rect x="20" y="30" width="60" height="50" rx="3" fill="#3b82f6" opacity="0.9"/>
            <rect x="25" y="25" width="50" height="40" rx="2" fill="#60a5fa" opacity="0.7"/>
            <path d="M45 35 L55 35 M50 30 L50 40" stroke="white" stroke-width="3" stroke-linecap="round"/>
            <rect x="30" y="65" width="8" height="15" fill="#1e40af"/>
            <rect x="62" y="65" width="8" height="15" fill="#1e40af"/>
            <rect x="35" y="45" width="6" height="4" fill="white" opacity="0.8"/>
            <rect x="59" y="45" width="6" height="4" fill="white" opacity="0.8"/>
            <rect x="35" y="52" width="6" height="4" fill="white" opacity="0.8"/>
            <rect x="59" y="52" width="6" height="4" fill="white" opacity="0.8"/>
            <path d="M20 30 L50 15 L80 30" stroke="#1e40af" stroke-width="2" fill="none"/>
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
              placeholder="Nome de usuário"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" fill="#999"/>
              </svg>
            </div>
            <input
              type="number"
              name="idade"
              placeholder="Idade"
              value={formData.idade}
              onChange={handleChange}
              min="1"
              max="120"
              required
            />
          </div>
          
          <div className="input-group">
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" fill="#999"/>
              </svg>
            </div>
            <input
              type="text"
              name="comorbidade"
              placeholder="Comorbidade (opcional)"
              value={formData.comorbidade}
              onChange={handleChange}
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
