import { useState, useEffect } from 'react'
import './Login.css'

function Login({ onGoToCadastro, onLogin }) {
  const [formData, setFormData] = useState({
    usuario: '',
    senha: ''
  })
  const [isAdminLogin, setIsAdminLogin] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    document.title = 'PharmaLife - Login'
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Contas de administrador pré-definidas
    const admins = {
      'mayconmoreira': 'rm94602',
      'felipeprestes': 'rm94325', 
      'adrielfelipe': 'rm94608',
      'murilokffiner': 'rm94705'
    }
    
    // Verificar se é login de admin
    if (isAdminLogin) {
      if (admins[formData.usuario] && admins[formData.usuario] === formData.senha) {
        alert('Login de administrador realizado com sucesso!')
        sessionStorage.setItem('isAdmin', 'true')
        sessionStorage.setItem('userName', formData.usuario)
        onLogin()
        return
      } else {
        alert('Credenciais de administrador inválidas!')
        return
      }
    }
    
    // Verificar login de usuário comum
    const usuarios = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]')
    const usuarioEncontrado = usuarios.find(u => 
      (u.nome === formData.usuario || u.email === formData.usuario) && u.senha === formData.senha
    )
    
    if (usuarioEncontrado) {
      // Registrar login no localStorage
      const loginData = {
        usuario: formData.usuario,
        dataLogin: new Date().toISOString(),
        isAdmin: false
      }
      
      const loginsExistentes = JSON.parse(localStorage.getItem('loginsRealizados') || '[]')
      loginsExistentes.push(loginData)
      localStorage.setItem('loginsRealizados', JSON.stringify(loginsExistentes))
      
      // Atualizar último login do usuário
      const usuarioIndex = usuarios.findIndex(u => u.nome === usuarioEncontrado.nome)
      if (usuarioIndex !== -1) {
        usuarios[usuarioIndex].ultimoLogin = new Date().toISOString()
        localStorage.setItem('usuariosCadastrados', JSON.stringify(usuarios))
      }
      
      alert('Login realizado com sucesso! Bem-vindo de volta ao PharmaLife!')
      sessionStorage.setItem('isAdmin', 'false')
      sessionStorage.setItem('userName', formData.usuario)
      onLogin()
    } else {
      alert('Usuário ou senha incorretos!')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
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
        
        <h1 className="login-title">Login</h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#999"/>
              </svg>
            </div>
            <input
              type="text"
              name="usuario"
              placeholder="Nome de usuário"
              value={formData.usuario}
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
          
          <div className="admin-checkbox">
            <label>
              <input
                type="checkbox"
                checked={isAdminLogin}
                onChange={(e) => setIsAdminLogin(e.target.checked)}
              />
              <span>Entrar como administrador</span>
            </label>
          </div>
          
          <button type="submit" className="login-btn">
            {isAdminLogin ? 'Login Admin' : 'Login'}
          </button>
        </form>
        
        <div className="signup-link">
          <span>Não tem conta? </span>
          <button type="button" className="create-account-btn" onClick={onGoToCadastro}>
            Criar uma conta
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login