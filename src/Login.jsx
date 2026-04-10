import { useState, useEffect } from 'react'
import './Login.css'

function Login({ onGoToCadastro, onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  })

  const [isAdminLogin, setIsAdminLogin] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    document.title = 'PharmaLife - Login'
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          senha: formData.senha,
          admin: isAdminLogin // já deixa preparado pro backend
        })
      })

      if (!response.ok) {
        throw new Error('Credenciais inválidas')
      }

      const data = await response.json()

      // armazenamento mais organizado
      localStorage.setItem('usuario', JSON.stringify(data))
      sessionStorage.setItem('userName', data.nome)
      sessionStorage.setItem('userId', data.id)

      onLogin(data)
    } catch (error) {
      console.error(error)
      alert(error.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="senha"
              placeholder="Digite sua senha"
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

          <button type="submit" className="login-btn" disabled={loading}>
            {loading
              ? 'Entrando...'
              : isAdminLogin
              ? 'Login Admin'
              : 'Login'}
          </button>
        </form>

        <div className="signup-link">
          <span>Não tem conta? </span>
          <button type="button" onClick={onGoToCadastro}>
            Criar uma conta
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login