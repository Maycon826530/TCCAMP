import { useState, useEffect } from 'react'
import './Cadastro.css'

function Cadastro({ onGoToLogin, onCadastro }) {
  const [formData, setFormData] = useState({
    usuario: '',
    senha: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    document.title = 'PharmaLife - Cadastro'
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Cadastro:', formData)
    alert('Cadastro realizado com sucesso!')
    onCadastro()
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <div className="user-icon">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#646cff"/>
          </svg>
        </div>
        
        <h1 className="cadastro-title">Cadastro</h1>
        
        <form onSubmit={handleSubmit} className="cadastro-form">
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
          
          <button type="submit" className="cadastro-btn">
            Cadastro
          </button>
        </form>
        
        <div className="signup-link">
          <button type="button" className="create-account-btn" onClick={onGoToLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cadastro