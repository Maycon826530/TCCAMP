import { useState } from 'react'
import './Home.css'

function Home({ onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [novoMedicamento, setNovoMedicamento] = useState({
    nome: '',
    dosagem: '',
    horario: '',
    frequencia: 'Diário'
  })
  const [medicamentosTomados, setMedicamentosTomados] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleKeyNavigation = (e, section) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setActiveSection(section)
    }
  }

  const showToastMessage = (message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const marcarComoTomado = (medicamentoId) => {
    setMedicamentosTomados([...medicamentosTomados, medicamentoId])
    showToastMessage('✅ Medicamento marcado como tomado!')
  }

  const getStatusBadge = (status) => {
    const badges = {
      'tomado': { color: '#27ae60', text: 'Tomado' },
      'pendente': { color: '#f39c12', text: 'Pendente' },
      'atrasado': { color: '#e74c3c', text: 'Atrasado' },
      'próximo': { color: '#3498db', text: 'Próximo' },
      'aberta': { color: '#27ae60', text: 'Aberta' },
      'fechada': { color: '#e74c3c', text: 'Fechada' }
    }
    return badges[status] || { color: '#95a5a6', text: 'N/A' }
  }

  const getProximoMedicamento = () => {
    const agora = new Date()
    const hoje = agora.toTimeString().slice(0, 5)
    return agendaMedicamentos.find(med => med.horario > hoje)
  }

  const calcularAdesao = () => {
    const totalMedicamentos = agendaMedicamentos.length * 7
    const medicamentosTomadosCount = medicamentosTomados.length + 12
    return Math.round((medicamentosTomadosCount / totalMedicamentos) * 100)
  }

  const ultimosRemedios = [
    { nome: 'Paracetamol', horario: '08:00', data: 'Hoje', status: 'tomado' },
    { nome: 'Ibuprofeno', horario: '14:30', data: 'Ontem', status: 'tomado' }
  ]

  const agendaMedicamentos = [
    { id: 1, nome: 'Vitamina D', horario: '09:00', frequencia: 'Diário', status: 'pendente' },
    { id: 2, nome: 'Omeprazol', horario: '07:00', frequencia: 'Diário', status: 'atrasado' },
    { id: 3, nome: 'Aspirina', horario: '20:00', frequencia: 'Diário', status: 'próximo' }
  ]

  const historicoRemedios = [
    { nome: 'Dipirona', data: '15/12/2024', horario: '16:00' },
    { nome: 'Amoxicilina', data: '10/12/2024', horario: '08:00' }
  ]

  const farmacias = [
    { nome: 'Farmácia Popular', endereco: 'Rua A, 123', distancia: '0.5km', status: 'aberta' },
    { nome: 'Drogasil', endereco: 'Av. B, 456', distancia: '1.2km', status: 'fechada' },
    { nome: 'Farmácia 24h', endereco: 'Rua C, 789', distancia: '2.1km', status: 'aberta' }
  ]

  const renderDashboard = () => {
    const proximoMed = getProximoMedicamento()
    const adesao = calcularAdesao()
    const agora = new Date()
    const hora = agora.getHours()
    let saudacao = 'Bom dia'
    if (hora >= 12 && hora < 18) saudacao = 'Boa tarde'
    else if (hora >= 18) saudacao = 'Boa noite'
    
    return (
      <>
        <div className="user-greeting">
          <div className="user-avatar">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#2c3e50"/>
            </svg>
          </div>
          <h2 className="greeting-text">{saudacao}, Maycon</h2>
        </div>
        <div className="dashboard">
          <div className="card">
            <h3>💊 Últimos Remédios Tomados</h3>
            {ultimosRemedios.map((remedio, index) => {
              const badge = getStatusBadge(remedio.status)
              return (
                <div key={index} className="item">
                  <span>{remedio.nome}</span>
                  <div className="item-right">
                    <span className="badge" style={{backgroundColor: badge.color}}>{badge.text}</span>
                    <span>{remedio.data} - {remedio.horario}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="card">
            <h3>⏰ Próximos Medicamentos</h3>
            {agendaMedicamentos.slice(0, 3).map((med, index) => {
              const badge = getStatusBadge(med.status)
              const jaTomado = medicamentosTomados.includes(med.id)
              return (
                <div key={index} className="item medication-item">
                  <div>
                    <span>{med.nome}</span>
                    <span className="badge" style={{backgroundColor: badge.color}}>{badge.text}</span>
                  </div>
                  <div className="item-actions">
                    <span>{med.horario}</span>
                    {!jaTomado && med.status !== 'tomado' && (
                      <button 
                        className="btn-take" 
                        onClick={() => marcarComoTomado(med.id)}
                      >
                        ✓ Tomado
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="card">
            <h3>📈 Resumo do Dia</h3>
            <div className="item">
              <span>Medicamentos tomados</span>
              <span>{medicamentosTomados.length + 2}/4</span>
            </div>
            <div className="item">
              <span>Próximo medicamento</span>
              <span>{proximoMed ? proximoMed.nome + ' - ' + proximoMed.horario : 'Nenhum pendente'}</span>
            </div>
            <div className="progress-container">
              <span>Adesão semanal: {adesao}%</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${adesao}%`}}></div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>🏥 Farmácias Próximas</h3>
            {farmacias.slice(0, 2).map((farmacia, index) => {
              const badge = getStatusBadge(farmacia.status)
              return (
                <div key={index} className="item">
                  <div>
                    <span>{farmacia.nome}</span>
                    <span className="badge" style={{backgroundColor: badge.color}}>{badge.text}</span>
                  </div>
                  <span>{farmacia.distancia}</span>
                </div>
              )
            })}
          </div>

          <div className="card weather-card">
            <div className="weather-header">
              <h3>☁️ Clima & Lembretes</h3>
              <img src="https://cdn-icons-png.flaticon.com/512/1163/1163661.png" alt="Clima" className="weather-icon" />
            </div>
            <div className="item">
              <span>🌡️ Temperatura</span>
              <span>24°C - Ideal para medicamentos</span>
            </div>
            <div className="item">
              <span>Consulta médica</span>
              <span>Amanhã 14:00</span>
            </div>
            <div className="item">
              <span>Renovar receita</span>
              <span>Em 5 dias</span>
            </div>
          </div>

          <div className="card stats-card">
            <div className="stats-header">
              <h3>📊 Estatísticas</h3>
              <img src="https://cdn-icons-png.flaticon.com/512/2920/2920277.png" alt="Estatísticas" className="stats-icon" />
            </div>
            <div className="item">
              <span>Medicamentos ativos</span>
              <span>{agendaMedicamentos.length}</span>
            </div>
            <div className="item">
              <span>Média diária</span>
              <span>3.2 medicamentos</span>
            </div>
            <div className="item">
              <span>Sequência atual</span>
              <span>7 dias</span>
            </div>

          </div>
        </div>
      </>
    )
  }

  const handleAddMedicamento = (e) => {
    e.preventDefault()
    if (novoMedicamento.nome && novoMedicamento.dosagem && novoMedicamento.horario) {
      console.log('Novo medicamento:', novoMedicamento)
      showToastMessage('✨ Medicamento adicionado com sucesso!')
      setNovoMedicamento({ nome: '', dosagem: '', horario: '', frequencia: 'Diário' })
    }
  }

  const renderAgenda = () => {
    const medicamentosFiltrados = agendaMedicamentos.filter(med => 
      med.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    return (
      <>
        <h2 className="section-title">📅 Agenda de Medicamentos</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Buscar medicamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="agenda">
          <div className="card">
            <h3>➕ Adicionar Medicamento</h3>
            <form onSubmit={handleAddMedicamento} className="med-form">
              <input
                type="text"
                placeholder="Nome do medicamento"
                value={novoMedicamento.nome}
                onChange={(e) => setNovoMedicamento({...novoMedicamento, nome: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Dosagem (ex: 50mg)"
                value={novoMedicamento.dosagem}
                onChange={(e) => setNovoMedicamento({...novoMedicamento, dosagem: e.target.value})}
                required
              />
              <input
                type="time"
                value={novoMedicamento.horario}
                onChange={(e) => setNovoMedicamento({...novoMedicamento, horario: e.target.value})}
                required
              />
              <select
                value={novoMedicamento.frequencia}
                onChange={(e) => setNovoMedicamento({...novoMedicamento, frequencia: e.target.value})}
              >
                <option value="Diário">Diário</option>
                <option value="12h">A cada 12h</option>
                <option value="8h">A cada 8h</option>
                <option value="Semanal">Semanal</option>
              </select>
              <button type="submit" className="btn-add">Adicionar</button>
            </form>
          </div>

          {medicamentosFiltrados.map((med, index) => {
            const badge = getStatusBadge(med.status)
            const jaTomado = medicamentosTomados.includes(med.id)
            return (
              <div key={index} className="card medication-card">
                <div className="card-header">
                  <h4>💊 {med.nome}</h4>
                  <span className="badge" style={{backgroundColor: badge.color}}>{badge.text}</span>
                </div>
                <div className="item">
                  <span>Horário:</span>
                  <span>{med.horario}</span>
                </div>
                <div className="item">
                  <span>Frequência:</span>
                  <span>{med.frequencia}</span>
                </div>
                {!jaTomado && med.status !== 'tomado' && (
                  <button 
                    className="btn-take full-width" 
                    onClick={() => marcarComoTomado(med.id)}
                  >
                    ✓ Marcar como Tomado
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </>
    )
  }

  const renderHistorico = () => (
    <>
      <h2 className="section-title">📊 Histórico de Remédios</h2>
      <div className="historico">
        {historicoRemedios.map((remedio, index) => (
          <div key={index} className="card">
            <h4>💊 {remedio.nome}</h4>
            <div className="item">
              <span>Data:</span>
              <span>{remedio.data}</span>
            </div>
            <div className="item">
              <span>Horário:</span>
              <span>{remedio.horario}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )

  const renderFarmacias = () => (
    <>
      <div className="section-header">
        <h2 className="section-title">🏥 Farmácias Próximas</h2>
        <img src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png" alt="Farmácia" className="section-icon" />
      </div>
      <div className="farmacias">
        {farmacias.map((farmacia, index) => {
          const badge = getStatusBadge(farmacia.status)
          return (
            <div key={index} className="card pharmacy-card">
              <div className="card-header">
                <h4>🏥 {farmacia.nome}</h4>
                <span className="badge" style={{backgroundColor: badge.color}}>{badge.text}</span>
              </div>
              <div className="item">
                <span>Endereço:</span>
                <span>{farmacia.endereco}</span>
              </div>
              <div className="item">
                <span>Distância:</span>
                <span>{farmacia.distancia}</span>
              </div>

            </div>
          )
        })}
      </div>
    </>
  )

  const renderConfiguracoes = () => (
    <>
      <h2 className="section-title">⚙️ Configurações</h2>
      <div className="configuracoes">
        <div className="card">
          <h4>🔔 Notificações</h4>
          <label>
            <input type="checkbox" defaultChecked />
            Lembrete de medicamentos
          </label>
          <label>
            <input type="checkbox" defaultChecked />
            Notificações push
          </label>
        </div>
        <div className="card">
          <h4>👤 Perfil</h4>
          <button className="btn-config">Editar Perfil</button>
          <button className="btn-config" onClick={onLogout}>Sair da Conta</button>
        </div>
      </div>
    </>
  )

  const renderContent = () => {
    switch(activeSection) {
      case 'agenda': return renderAgenda()
      case 'historico': return renderHistorico()
      case 'farmacias': return renderFarmacias()
      case 'configuracoes': return renderConfiguracoes()
      default: return renderDashboard()
    }
  }

  return (
    <div className="home-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <img src="https://cdn-icons-png.flaticon.com/512/883/883356.png" alt="PharmaLife" className="logo" />
            <h1>PharmaLife</h1>
          </div>
        </div>
        <nav className="nav-buttons">
          <button 
            className={activeSection === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveSection('dashboard')}
            onKeyDown={(e) => handleKeyNavigation(e, 'dashboard')}
          >
            🏠 Página Inicial
          </button>
          <button 
            className={activeSection === 'agenda' ? 'active' : ''} 
            onClick={() => setActiveSection('agenda')}
            onKeyDown={(e) => handleKeyNavigation(e, 'agenda')}
          >
            📅 Agenda
          </button>
          <button 
            className={activeSection === 'historico' ? 'active' : ''} 
            onClick={() => setActiveSection('historico')}
            onKeyDown={(e) => handleKeyNavigation(e, 'historico')}
          >
            📊 Histórico
          </button>
          <button 
            className={activeSection === 'farmacias' ? 'active' : ''} 
            onClick={() => setActiveSection('farmacias')}
            onKeyDown={(e) => handleKeyNavigation(e, 'farmacias')}
          >
            🏥 Farmácias
          </button>
          <button 
            className={activeSection === 'configuracoes' ? 'active' : ''} 
            onClick={() => setActiveSection('configuracoes')}
            onKeyDown={(e) => handleKeyNavigation(e, 'configuracoes')}
          >
            ⚙️ Configurações
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