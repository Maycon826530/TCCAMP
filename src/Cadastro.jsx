import { useState, useEffect } from 'react'
import './Cadastro.css'

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem!')
      return
    }
    
    try {
      const response = await fetch('http://localhost:8080/api/cadastros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          idade: parseInt(formData.idade) || null,
          comorbidade: formData.comorbidade || null
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        alert('Conta criada com sucesso! Bem-vindo ao PharmaLife!')
       
        console.log(data);  // Aqui você tem o objeto retornado pela API
       // localStorage.setItem('token', data.token)
       localStorage.setItem('usuario', JSON.stringify(data));
        onLogin(data)
      } else {
        alert(data.erro || 'Erro ao criar conta')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro de conexão. Verifique se o servidor está rodando.')
    }
    
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
            <path d="M45 35 L55 35 M50 30 L50 40" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <rect x="30" y="65" width="8" height="15" fill="#1e40af"/>
            <rect x="62" y="65" width="8" height="15" fill="#1e40af"/>
            <rect x="35" y="45" width="6" height="4" fill="white" opacity="0.8"/>
            <rect x="59" y="45" width="6" height="4" fill="white" opacity="0.8"/>
            <rect x="35" y="52" width="6" height="4" fill="white" opacity="0.8"/>
            <rect x="59" y="52" width="6" height="4" fill="white" opacity="0.8"/>
            <path d="M20 30 L50 15 L80 30" stroke="#1e40af" strokeWidth="2" fill="none"/>
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

export default Cadastro