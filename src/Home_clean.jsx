import { useState, useEffect } from 'react'
import './Home.css'
import './Accessibility.css'
import Sobre from './Sobre'

function Home({ onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [medicamentosTomados, setMedicamentosTomados] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [accessibilityMode, setAccessibilityMode] = useState(() => 
    localStorage.getItem('accessibilityMode') === 'true'
  )

  const showToastMessage = (message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const toggleAccessibilityMode = () => {
    const newMode = !accessibilityMode
    setAccessibilityMode(newMode)
    localStorage.setItem('accessibilityMode', newMode.toString())
    showToastMessage(newMode ? '🔍 Modo Acessível ATIVADO' : 'Modo Normal ativado')
  }

  const marcarComoTomado = (medicamentoId) => {
    setMedicamentosTomados([...medicamentosTomados, medicamentoId])
    showToastMessage('✅ Medicamento marcado como tomado!')
  }

  const getStatusBadge = (status) => {
    const badges = {
      'tomado': { color: '#10b981', text: 'Tomado' },
      'pendente': { color: '#f59e0b', text: 'Pendente' },
      'atrasado': { color: '#ef4444', text: 'Atrasado' },
      'aberta': { color: '#10b981', text: 'Aberta' },
      'fechada': { color: '#6b7280', text: 'Fechada' }
    }
    return badges[status] || { color: '#9ca3af', text: 'N/A' }
  }

  // Dados mockados simplificados
  const agendaMedicamentos = [
    { id: 1, nome: 'Vitamina D', dosagem: '1000mg', horario: '09:00', status: 'pendente' },
    { id: 2, nome: 'Omeprazol', dosagem: '20mg', horario: '07:00', status: 'atrasado' }
  ]

  const ultimosRemedios = [
    { nome: 'Paracetamol', horario: '08:00', data: 'Hoje', status: 'tomado' },
    { nome: 'Ibuprofeno', horario: '14:30', data: 'Hoje', status: 'tomado' }
  ]

  const farmacias = [
    { nome: 'Farmácia Popular', endereco: 'Rua A, 123', distancia: '0.5km', status: 'aberta' },
    { nome: 'Drogasil', endereco: 'Av. B, 456', distancia: '1.2km', status: 'fechada' }
  ]

  const renderDashboard = () => {
    const userName = sessionStorage.getItem('userName') || ''
    const hora = new Date().getHours()
    let saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'
    if (userName) saudacao += `, ${userName}`
    
    return (
      <>
        <div className="user-greeting">
          <h2 className="greeting-text">{saudacao}</h2>
        </div>
        <div className="dashboard">
          <div className="card urgent-card">
            <h3>💊 Próximos Medicamentos</h3>
            {agendaMedicamentos.map((med) => {
              const badge = getStatusBadge(med.status)
              const jaTomado = medicamentosTomados.includes(med.id)
              return (
                <div key={med.id} className="medication-item">
                  <div>
                    <div className="item-info">
                      <span className="med-name">{med.nome}</span>
                      <span className="badge" style={{backgroundColor: badge.color}}>{badge.text}</span>
                    </div>
                    <div className="item-actions">
                      <span className="time-display">{med.horario}</span>
                      {!jaTomado && med.status !== 'tomado' && (
                        <button className="btn-take" onClick={() => marcarComoTomado(med.id)}>
                          ✓ Tomado
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="card">
            <h3>💊 Últimos Remédios</h3>
            {ultimosRemedios.map((remedio, index) => {
              const badge = getStatusBadge(remedio.status)
              return (
                <div key={index} className="item">
                  <span className="med-name">{remedio.nome}</span>
                  <div className="item-right">
                    <span className="badge" style={{backgroundColor: badge.color}}>{badge.text}</span>
                    <span className="item-date">{remedio.data} - {remedio.horario}</span>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="card">
            <h3>🏥 Farmácias Próximas</h3>
            {farmacias.map((farmacia, index) => {
              const badge = getStatusBadge(farmacia.status)
              return (
                <div key={index} className="item">
                  <div>
                    <div className="pharmacy-name">{farmacia.nome}</div>
                    <div className="pharmacy-address">{farmacia.endereco}</div>
                  </div>
                  <div className="item-right">
                    <span className="badge" style={{backgroundColor: badge.color}}>{badge.text}</span>
                    <span className="pharmacy-distance">{farmacia.distancia}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </>
    )
  }

  const renderAjuda = () => (
    <>
      <h2 className="section-title">Ajuda</h2>
      <div className="ajuda">
        <div className="card help-seniors">
          <h3>👴👵 Guia para Idosos</h3>
          <div className="senior-tip">
            <h4>🔍 Letras Grandes</h4>
            <p>Clique no botão "🔍 Letras Grandes" para deixar tudo maior e mais fácil de ler.</p>
          </div>
          <div className="senior-tip">
            <h4>📱 Peça Ajuda</h4>
            <p>Se tiver dificuldade, peça para um familiar te ajudar a usar o aplicativo.</p>
          </div>
        </div>

        <div className="card help-emergency">
          <h3>🚨 Emergência</h3>
          <div className="emergency-actions">
            <div className="emergency-item">
              <span className="emergency-number">192</span>
              <span>SAMU - Emergência Médica</span>
            </div>
            <div className="emergency-item">
              <span className="emergency-number">193</span>
              <span>Bombeiros</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  const renderConfiguracoes = () => (
    <>
      <h2 className="section-title">Configurações</h2>
      <div className="configuracoes">
        <div className="card">
          <h4>Acessibilidade</h4>
          <label>
            <input 
              type="checkbox" 
              checked={accessibilityMode}
              onChange={toggleAccessibilityMode}
            />
            Modo de Acessibilidade (Letras Grandes)
          </label>
          <div style={{textAlign: 'center', marginTop: '2rem'}}>
            <button className="btn-config" onClick={onLogout}>Sair da Conta</button>
          </div>
        </div>
      </div>
    </>
  )

  const renderContent = () => {
    switch(activeSection) {
      case 'configuracoes': return renderConfiguracoes()
      case 'ajuda': return renderAjuda()
      case 'sobre': return <Sobre />
      default: return renderDashboard()
    }
  }

  useEffect(() => {
    document.title = `PharmaLife - ${activeSection === 'dashboard' ? 'Home' : activeSection}`
  }, [activeSection])

  return (
    <div className={`home-container ${accessibilityMode ? 'accessibility-mode' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>PharmaLife</h1>
          <button 
            className="accessibility-toggle"
            onClick={toggleAccessibilityMode}
            title={accessibilityMode ? 'Desativar modo de acessibilidade' : 'Ativar modo de acessibilidade'}
          >
            {accessibilityMode ? '🔍 Modo Normal' : '🔍 Letras Grandes'}
          </button>
        </div>
        <nav className="nav-buttons">
          <button 
            className={activeSection === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveSection('dashboard')}
          >
            Página Inicial
          </button>
          <button 
            className={activeSection === 'configuracoes' ? 'active' : ''} 
            onClick={() => setActiveSection('configuracoes')}
          >
            Configurações
          </button>
          <button 
            className={activeSection === 'ajuda' ? 'active' : ''} 
            onClick={() => setActiveSection('ajuda')}
          >
            Ajuda
          </button>
          <button 
            className={activeSection === 'sobre' ? 'active' : ''} 
            onClick={() => setActiveSection('sobre')}
          >
            Sobre Nós
          </button>
        </nav>
      </aside>
      
      <main className="main-content">
        {renderContent()}
        {showToast && (
          <div className="toast">
            {toastMessage}
          </div>
        )}
      </main>
    </div>
  )
}

export default Home