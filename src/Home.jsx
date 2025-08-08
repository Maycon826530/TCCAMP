import { useState, useEffect } from 'react'
import './Home.css'

function Home({ onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [novoMedicamento, setNovoMedicamento] = useState({
    nome: '',
    dosagem: '',
    horario: '',
    frequencia: 'Diário',
    duracao: '1 semana'
  })
  const [medicamentosTomados, setMedicamentosTomados] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [perfil, setPerfil] = useState({
    nome: 'Usuário',
    senha: '*****',
    idade: '30'
  })
  const [darkMode, setDarkMode] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingMed, setEditingMed] = useState(null)
  const [editMedicamento, setEditMedicamento] = useState({
    nome: '',
    dosagem: '',
    horario: '',
    frequencia: 'Diário',
    observacao: ''
  })
  const [novoLembrete, setNovoLembrete] = useState({
    titulo: '',
    descricao: '',
    data: '',
    horario: ''
  })
  const [lembretes, setLembretes] = useState([])

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

  const calcularAdesao = () => {
    const totalMedicamentos = agendaMedicamentos.length * 7
    const medicamentosTomadosCount = medicamentosTomados.length + 12
    return Math.round((medicamentosTomadosCount / totalMedicamentos) * 100)
  }

  const ultimosRemedios = [
    { nome: 'Paracetamol', horario: '08:00', data: 'Hoje', status: 'tomado' },
    { nome: 'Ibuprofeno', horario: '14:30', data: 'Hoje', status: 'tomado' },
    { nome: 'Omeprazol', horario: '07:00', data: 'Ontem', status: 'tomado' }
  ]

  const agendaMedicamentos = [
    { id: 1, nome: 'Vitamina D', dosagem: '1000mg', horario: '09:00', frequencia: 'Diário', status: 'pendente', observacao: 'Tomar com alimentos', tipo: 'Suplemento' },
    { id: 2, nome: 'Omeprazol', dosagem: '20mg', horario: '07:00', frequencia: 'Diário', status: 'atrasado', observacao: 'Tomar em jejum', tipo: 'Medicamento' },
    { id: 3, nome: 'Dipirona', dosagem: '500mg', horario: '16:00', frequencia: 'Diário', status: 'pendente', observacao: 'Tomar após as refeições', tipo: 'Medicamento' },
    { id: 4, nome: 'Paracetamol', dosagem: '750mg', horario: '12:00', frequencia: 'Diário', status: 'pendente', observacao: 'Tomar se necessário', tipo: 'Medicamento' }
  ]

  const historicoRemedios = [
    { nome: 'Amoxicilina', data: '10/12/2024', horario: '08:00' },
    { nome: 'Consulta médica', data: '20/12/2024', horario: '14:00' },
    { nome: 'Renovar receita', data: '25/12/2024', horario: '09:00' }
  ]

  const farmacias = [
    { nome: 'Farmácia Popular', endereco: 'Rua A, 123', distancia: '0.5km', status: 'aberta' },
    { nome: 'Drogasil', endereco: 'Av. B, 456', distancia: '1.2km', status: 'fechada' },
    { nome: 'Farmácia 24h', endereco: 'Rua C, 789', distancia: '2.1km', status: 'aberta' }
  ]

  const renderDashboard = () => {
    const adesao = calcularAdesao()
    const agora = new Date()
    const hora = agora.getHours()
    const userName = sessionStorage.getItem('userName') || ''
    let saudacao = 'Bom dia'
    if (hora >= 12 && hora < 18) saudacao = 'Boa tarde'
    else if (hora >= 18) saudacao = 'Boa noite'
    
    if (userName) {
      saudacao += `, ${userName}`
    }
    
    return (
      <>
        <div className="user-greeting">
          <div className="user-avatar">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#2c3e50"/>
            </svg>
          </div>
          <h2 className="greeting-text">{saudacao}</h2>
        </div>
        <div className="dashboard">
          <div className="dashboard-main">
            <div className="card urgent-card">
            <div className="card-image">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="40" stroke="#dc2626" stroke-width="4" fill="none"/>
                <line x1="50" y1="50" x2="50" y2="25" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
                <line x1="50" y1="50" x2="65" y2="50" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
                <circle cx="50" cy="50" r="3" fill="#991b1b"/>
              </svg>
            </div>
            <h3>⏰ Próximos Medicamentos</h3>
            {agendaMedicamentos.slice(0, 3).map((med, index) => {
              const badge = getStatusBadge(med.status)
              const jaTomado = medicamentosTomados.includes(med.id)
              return (
                <div key={index} className="medication-item">
                  <div>
                    <div className="item-info">
                      <span className="med-name">{med.nome}</span>
                      <span className="badge" style={{backgroundColor: badge.color}}>{badge.text}</span>
                    </div>
                    <div className="item-actions">
                      <span className="time-display">{med.horario}</span>
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
                </div>
              )
            })}
          </div>
          
          <div className="card">
            <div className="card-image">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                <path d="M20 80 L35 60 L50 70 L65 45 L80 50" stroke="#48bb78" stroke-width="3" fill="none" stroke-linecap="round"/>
                <circle cx="35" cy="60" r="4" fill="#3b82f6"/>
                <circle cx="50" cy="70" r="4" fill="#60a5fa"/>
                <circle cx="65" cy="45" r="4" fill="#48bb78"/>
              </svg>
            </div>
            <h3>📊 Resumo do Dia</h3>
            <div className="item">
              <span>Medicamentos tomados</span>
              <span>{medicamentosTomados.length + 2}/4</span>
            </div>
            <div className="item">
              <span>Próximo medicamento</span>
              <span>Vitamina D - 09:00</span>
            </div>
            <div className="progress-container">
              <span>Adesão semanal: {adesao}%</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${adesao}%`}}></div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-image">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                <rect x="20" y="35" width="60" height="30" rx="15" fill="#3b82f6" opacity="0.8"/>
                <rect x="30" y="25" width="40" height="50" rx="20" fill="#60a5fa" opacity="0.6"/>
                <circle cx="50" cy="50" r="8" fill="white"/>
              </svg>
            </div>
            <h3>💊 Últimos Remédios</h3>
            {ultimosRemedios.slice(0, 4).map((remedio, index) => {
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
            <div className="card-image">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                <rect x="20" y="25" width="60" height="50" rx="5" fill="#8b5cf6" opacity="0.8"/>
                <rect x="25" y="30" width="50" height="40" rx="3" fill="#a78bfa" opacity="0.6"/>
                <path d="M30 40 L70 40 M30 50 L65 50 M30 60 L60 60" stroke="white" stroke-width="2"/>
                <circle cx="75" cy="35" r="8" fill="#10b981" opacity="0.9"/>
                <path d="M71 35 L74 38 L79 32" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/>
              </svg>
            </div>
            <h3>📈 Resumo da Semana</h3>
            <div className="item">
              <span>Medicamentos tomados</span>
              <span>12/14</span>
            </div>
            <div className="item">
              <span>Taxa de adesão</span>
              <span>86%</span>
            </div>
            <div className="item">
              <span>Dias sem faltas</span>
              <span>5/7</span>
            </div>
            <div className="item">
              <span>Melhor dia</span>
              <span>Segunda-feira</span>
            </div>
            <div className="item">
              <span>Próxima meta</span>
              <span>100% adesão</span>
            </div>

          </div>
          
          <div className="card">
            <div className="card-image">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                <rect x="25" y="20" width="50" height="60" rx="5" fill="#f59e0b" opacity="0.8"/>
                <rect x="30" y="25" width="40" height="50" rx="3" fill="#fbbf24" opacity="0.6"/>
                <path d="M35 35 L65 35 M35 45 L60 45 M35 55 L55 55" stroke="white" stroke-width="2"/>
              </svg>
            </div>
            <h3>📝 Lembrete</h3>
            <div className="item">
              <span>Consulta médica</span>
              <span>Amanhã - 14:00</span>
            </div>
            <div className="item">
              <span>Renovar receita</span>
              <span>25/12 - 09:00</span>
            </div>
            <div className="item">
              <span>Exame de sangue</span>
              <span>30/12 - 08:00</span>
            </div>
            <div className="item">
              <span>Comprar medicamentos</span>
              <span>Hoje - 16:00</span>
            </div>
            <div className="item">
              <span>Exercícios físicos</span>
              <span>Amanhã - 07:00</span>
            </div>
            <div className="item">
              <span>Tomar água</span>
              <span>Todo dia</span>
            </div>
          </div>
          
          </div>
          
          <div className="dashboard-footer">
            <div className="card pharmacy-horizontal">
              <div className="pharmacy-header">
              <div className="card-image">
                <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
                  <rect x="25" y="40" width="50" height="40" rx="5" fill="#3b82f6" opacity="0.8"/>
                  <rect x="30" y="35" width="40" height="30" rx="3" fill="#60a5fa" opacity="0.6"/>
                  <path d="M45 50 L55 50 M50 45 L50 55" stroke="white" stroke-width="3" stroke-linecap="round"/>
                  <rect x="35" y="65" width="8" height="15" fill="#1e40af"/>
                  <rect x="57" y="65" width="8" height="15" fill="#1e40af"/>
                </svg>
              </div>
              <h3>🏥 Farmácia Mais Próxima</h3>
            </div>
            <div className="pharmacy-list">
              {farmacias.slice(0, 3).map((farmacia, index) => {
                const badge = getStatusBadge(farmacia.status)
                return (
                  <div key={index} className="pharmacy-item">
                    <div className="pharmacy-info">
                      <span className="pharmacy-name">{farmacia.nome}</span>
                      <span className="pharmacy-address">{farmacia.endereco}</span>
                    </div>
                    <div className="pharmacy-details">
                      <span className="badge" style={{backgroundColor: badge.color}}>{badge.text}</span>
                      <span className="pharmacy-distance">{farmacia.distancia}</span>
                    </div>
                  </div>
                )
              })}
            </div>
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
      setNovoMedicamento({ nome: '', dosagem: '', horario: '', frequencia: 'Diário', duracao: '1 semana' })
    }
  }

  const handleAddLembrete = (e) => {
    e.preventDefault()
    if (novoLembrete.titulo && novoLembrete.data && novoLembrete.horario) {
      const novoId = lembretes.length + 1
      setLembretes([...lembretes, { ...novoLembrete, id: novoId }])
      showToastMessage('Lembrete adicionado com sucesso!')
      setNovoLembrete({ titulo: '', descricao: '', data: '', horario: '' })
    }
  }

  const handleEditMedicamento = (med) => {
    setEditingMed(med)
    setEditMedicamento({
      nome: med.nome,
      dosagem: med.dosagem,
      horario: med.horario,
      frequencia: med.frequencia,
      observacao: med.observacao
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    try {
      // Aqui você salvaria as alterações
      showToastMessage('Medicamento atualizado com sucesso!')
      setShowEditModal(false)
      setEditingMed(null)
    } catch (error) {
      showToastMessage('Erro ao atualizar medicamento')
    }
  }

  const handleDeleteMedicamento = () => {
    try {
      // Aqui você removeria o medicamento
      showToastMessage('Medicamento excluído com sucesso!')
      setShowEditModal(false)
      setEditingMed(null)
    } catch (error) {
      showToastMessage('Erro ao excluir medicamento')
    }
  }

  const renderAgenda = () => {
    const medicamentosFiltrados = agendaMedicamentos.filter(med => 
      med.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    return (
      <>
        <h2 className="section-title">Agenda de Medicamentos</h2>
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
            <div className="card-image">
              <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="35" fill="#48bb78" opacity="0.8"/>
                <path d="M35 50 L65 50 M50 35 L50 65" stroke="white" stroke-width="4" stroke-linecap="round"/>
              </svg>
            </div>
            <h3>Adicionar Medicamento</h3>
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
              <select
                value={novoMedicamento.duracao}
                onChange={(e) => setNovoMedicamento({...novoMedicamento, duracao: e.target.value})}
              >
                <option value="1 dia">1 dia</option>
                <option value="2 dias">2 dias</option>
                <option value="3 dias">3 dias</option>
                <option value="4 dias">4 dias</option>
                <option value="5 dias">5 dias</option>
                <option value="1 semana">1 semana</option>
                <option value="2 semanas">2 semanas</option>
                <option value="3 semanas">3 semanas</option>
                <option value="1 mês">1 mês</option>
                <option value="2 meses">2 meses</option>
                <option value="3 meses">3 meses</option>
                <option value="6 meses">6 meses</option>
                <option value="1 ano">1 ano</option>
                <option value="Contínuo">Contínuo</option>
              </select>
              <button type="submit" className="btn-add">Adicionar</button>
            </form>
          </div>

          {medicamentosFiltrados.map((med, index) => {
            const badge = getStatusBadge(med.status)
            const jaTomado = medicamentosTomados.includes(med.id)
            return (
              <div key={index} className="card medication-card">
                <div className="card-image">
                  <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
                    <rect x="30" y="40" width="40" height="20" rx="10" fill="#3b82f6" opacity="0.8"/>
                    <rect x="35" y="35" width="30" height="30" rx="15" fill="#60a5fa" opacity="0.6"/>
                    <circle cx="50" cy="50" r="6" fill="white"/>
                  </svg>
                </div>
                <div className="card-header">
                  <h4>{med.nome}</h4>
                  <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                    <span className="badge" style={{backgroundColor: badge.color}}>{badge.text}</span>
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEditMedicamento(med)}
                      title="Editar medicamento"
                    >
                      ✏️
                    </button>
                  </div>
                </div>
                <div className="item">
                  <span>Dosagem:</span>
                  <span>{med.dosagem}</span>
                </div>
                <div className="item">
                  <span>Horário:</span>
                  <span>{med.horario}</span>
                </div>
                <div className="item">
                  <span>Frequência:</span>
                  <span>{med.frequencia}</span>
                </div>
                <div className="item">
                  <span>Tipo:</span>
                  <span>{med.tipo}</span>
                </div>
                <div className="item">
                  <span>Observação:</span>
                  <span>{med.observacao}</span>
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

          <div className="card">
            <div className="card-image">
              <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="35" fill="#f59e0b" opacity="0.8"/>
                <path d="M35 45 L45 55 L65 35" stroke="white" stroke-width="4" stroke-linecap="round" fill="none"/>
              </svg>
            </div>
            <h3>Adicionar Lembrete</h3>
            <form onSubmit={handleAddLembrete} className="med-form">
              <input
                type="text"
                placeholder="Título do lembrete"
                value={novoLembrete.titulo}
                onChange={(e) => setNovoLembrete({...novoLembrete, titulo: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Descrição (opcional)"
                value={novoLembrete.descricao}
                onChange={(e) => setNovoLembrete({...novoLembrete, descricao: e.target.value})}
              />
              <input
                type="date"
                value={novoLembrete.data}
                onChange={(e) => setNovoLembrete({...novoLembrete, data: e.target.value})}
                required
              />
              <input
                type="time"
                value={novoLembrete.horario}
                onChange={(e) => setNovoLembrete({...novoLembrete, horario: e.target.value})}
                required
              />
              <button type="submit" className="btn-add">Adicionar Lembrete</button>
            </form>
          </div>

          {lembretes.map((lembrete, index) => (
            <div key={index} className="card">
              <div className="card-image">
                <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
                  <rect x="25" y="20" width="50" height="60" rx="5" fill="#f59e0b" opacity="0.8"/>
                  <rect x="30" y="25" width="40" height="50" rx="3" fill="#fbbf24" opacity="0.6"/>
                  <path d="M35 35 L65 35 M35 45 L60 45 M35 55 L55 55" stroke="white" stroke-width="2"/>
                </svg>
              </div>
              <div className="card-header">
                <h4>{lembrete.titulo}</h4>
              </div>
              {lembrete.descricao && (
                <div className="item">
                  <span>Descrição:</span>
                  <span>{lembrete.descricao}</span>
                </div>
              )}
              <div className="item">
                <span>Data:</span>
                <span>{new Date(lembrete.data).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="item">
                <span>Horário:</span>
                <span>{lembrete.horario}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  const renderHistorico = () => (
    <>
      <h2 className="section-title">Histórico de Remédios</h2>
      <div className="historico">
        {historicoRemedios.map((remedio, index) => (
          <div key={index} className="card">
            <div className="card-image">
              <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
                <rect x="25" y="20" width="50" height="60" rx="5" fill="#ed8936" opacity="0.8"/>
                <rect x="30" y="25" width="40" height="50" rx="3" fill="#f6ad55" opacity="0.6"/>
                <path d="M35 35 L65 35 M35 45 L60 45 M35 55 L55 55" stroke="white" stroke-width="2"/>
              </svg>
            </div>
            <h4>{remedio.nome}</h4>
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
      <h2 className="section-title">Farmácias Próximas</h2>
      <div className="farmacias">
        {farmacias.map((farmacia, index) => {
          const badge = getStatusBadge(farmacia.status)
          return (
            <div key={index} className="card pharmacy-card">
              <div className="card-image">
                <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
                  <rect x="20" y="35" width="60" height="45" rx="5" fill="#3b82f6" opacity="0.8"/>
                  <rect x="25" y="30" width="50" height="35" rx="3" fill="#60a5fa" opacity="0.6"/>
                  <path d="M45 40 L55 40 M50 35 L50 45" stroke="white" stroke-width="3" stroke-linecap="round"/>
                  <rect x="30" y="65" width="10" height="15" fill="#1e40af"/>
                  <rect x="60" y="65" width="10" height="15" fill="#1e40af"/>
                </svg>
              </div>
              <div className="card-header">
                <h4>{farmacia.nome}</h4>
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

  const handleSavePerfil = (e) => {
    e.preventDefault()
    showToastMessage('✅ Perfil atualizado com sucesso!')
    setShowProfileModal(false)
  }

  const renderConfiguracoes = () => (
    <>
      <h2 className="section-title">Configurações</h2>
      <div className="configuracoes">
        <div className="card">
          <div className="card-image">
            <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
              <path d="M50 20 C40 20 35 30 35 40 C35 50 30 55 30 65 L70 65 C70 55 65 50 65 40 C65 30 60 20 50 20 Z" fill="#6b7280" opacity="0.8"/>
              <rect x="45" y="65" width="10" height="8" rx="2" fill="#9ca3af" opacity="0.6"/>
              <circle cx="50" cy="15" r="3" fill="#f59e0b"/>
            </svg>
          </div>
          <h4>Notificações</h4>
          <label>
            <input type="checkbox" defaultChecked />
            Lembrete de medicamentos
          </label>
          <label>
            <input type="checkbox" defaultChecked />
            Notificações push
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            Modo escuro
          </label>
        </div>
        <div className="card">
          <div className="card-image">
            <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="35" r="15" fill="#6b7280" opacity="0.8"/>
              <path d="M25 75 C25 60 35 50 50 50 C65 50 75 60 75 75 L25 75 Z" fill="#9ca3af" opacity="0.6"/>
            </svg>
          </div>
          <h4>Perfil</h4>
          <div className="perfil-info">
            <div className="item">
              <span>Nome:</span>
              <span>{perfil.nome}</span>
            </div>
            <div className="item">
              <span>Senha:</span>
              <span>{perfil.senha}</span>
            </div>

          </div>
          <div style={{textAlign: 'center'}}>
            <button className="btn-config" onClick={() => setShowProfileModal(true)}>Editar Perfil</button>
            <button className="btn-config" onClick={onLogout}>Sair da Conta</button>
          </div>
        </div>
      </div>
      
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>✏️ Editar Perfil</h3>
            <form onSubmit={handleSavePerfil} className="profile-form">
              <input
                type="text"
                placeholder="Nome completo"
                value={perfil.nome}
                onChange={(e) => setPerfil({...perfil, nome: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={perfil.senha}
                onChange={(e) => setPerfil({...perfil, senha: e.target.value})}
                required
              />

              <input
                type="number"
                placeholder="Idade"
                value={perfil.idade}
                onChange={(e) => setPerfil({...perfil, idade: e.target.value})}
                required
              />
              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={() => setShowProfileModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showEditModal && editingMed && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Editar Medicamento</h3>
            <form onSubmit={handleSaveEdit} className="profile-form">
              <input
                type="text"
                placeholder="Nome do medicamento"
                value={editMedicamento.nome}
                onChange={(e) => setEditMedicamento({...editMedicamento, nome: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Dosagem"
                value={editMedicamento.dosagem}
                onChange={(e) => setEditMedicamento({...editMedicamento, dosagem: e.target.value})}
                required
              />
              <input
                type="time"
                value={editMedicamento.horario}
                onChange={(e) => setEditMedicamento({...editMedicamento, horario: e.target.value})}
                required
              />
              <select
                value={editMedicamento.frequencia}
                onChange={(e) => setEditMedicamento({...editMedicamento, frequencia: e.target.value})}
              >
                <option value="Diário">Diário</option>
                <option value="12h">A cada 12h</option>
                <option value="8h">A cada 8h</option>
                <option value="Semanal">Semanal</option>
              </select>
              <input
                type="text"
                placeholder="Observação"
                value={editMedicamento.observacao}
                onChange={(e) => setEditMedicamento({...editMedicamento, observacao: e.target.value})}
              />
              <div className="modal-buttons">
                <button type="button" className="btn-delete" onClick={handleDeleteMedicamento}>Excluir</button>
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )

  useEffect(() => {
    const titles = {
      'dashboard': 'PharmaLife - Home',
      'agenda': 'PharmaLife - Agenda',
      'historico': 'PharmaLife - Histórico',
      'farmacias': 'PharmaLife - Farmácias',
      'configuracoes': 'PharmaLife - Configurações',
      'ajuda': 'PharmaLife - Ajuda'
    }
    document.title = titles[activeSection] || 'PharmaLife'
  }, [activeSection])

  const renderAjuda = () => (
    <>
      <h2 className="section-title">Central de Ajuda</h2>
      <div className="ajuda">
        <div className="card help-intro">
          <h3>🏥 Bem-vindo ao PharmaLife</h3>
          <p className="help-text">
            O PharmaLife é seu assistente pessoal para cuidar da sua saúde. 
            Este aplicativo foi criado especialmente para ajudar você a nunca mais 
            esquecer de tomar seus remédios e manter sua saúde em dia.
          </p>

        </div>

        <div className="card">
          <h3>🏠 Página Inicial - Seu Painel Principal</h3>
          <div className="help-step">
            <span className="step-number">1</span>
            <div>
              <h4>Últimos Remédios Tomados</h4>
              <p>Aqui você vê quais remédios já tomou hoje. Fica registrado para você acompanhar.</p>
            </div>
          </div>
          <div className="help-step">
            <span className="step-number">2</span>
            <div>
              <h4>Próximos Medicamentos</h4>
              <p>Mostra quais remédios você precisa tomar hoje. Clique no botão "✓ Tomado" quando tomar o remédio.</p>
            </div>
          </div>
          <div className="help-step">
            <span className="step-number">3</span>
            <div>
              <h4>Resumo do Dia</h4>
              <p>Veja quantos remédios você já tomou hoje e sua porcentagem de adesão semanal.</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>💊 Agenda - Gerenciar seus Medicamentos</h3>
          <div className="help-step">
            <span className="step-number">1</span>
            <div>
              <h4>Como Adicionar um Novo Remédio</h4>
              <p>• Digite o nome do remédio (ex: Paracetamol)</p>
              <p>• Coloque a dosagem (ex: 500mg)</p>
              <p>• Escolha o horário (ex: 08:00)</p>
              <p>• Selecione a frequência (Diário, 12h, 8h)</p>
              <p>• Escolha por quanto tempo tomar</p>
              <p>• Clique em "Adicionar"</p>
            </div>
          </div>
          <div className="help-step">
            <span className="step-number">2</span>
            <div>
              <h4>Marcar como Tomado</h4>
              <p>Quando tomar o remédio, clique no botão verde "✓ Marcar como Tomado". Assim você não esquece se já tomou!</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>📋 Histórico - Ver Remédios Anteriores</h3>
          <p className="help-text">
            Aqui você pode ver todos os remédios que já tomou nos dias anteriores. 
            É útil para mostrar ao médico ou para lembrar quando tomou algo.
          </p>
        </div>

        <div className="card">
          <h3>🏪 Farmácias - Encontrar Farmácias Próximas</h3>
          <p className="help-text">
            Veja as farmácias mais próximas de você, com endereço e distância. 
            Também mostra se estão abertas ou fechadas no momento.
          </p>
        </div>

        <div className="card help-tips">
          <h3>💡 Dicas Importantes para Usar Melhor</h3>
          <div className="tip-item">
            <span className="tip-icon">🔔</span>
            <div>
              <h4>Ative as Notificações</h4>
              <p>Vá em Configurações e ative os lembretes. Assim você receberá avisos na hora de tomar os remédios.</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">⏰</span>
            <div>
              <h4>Horários Regulares</h4>
              <p>Tente sempre tomar os remédios nos mesmos horários todos os dias. Isso ajuda o tratamento.</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">👨‍⚕️</span>
            <div>
              <h4>Consulte seu Médico</h4>
              <p>Sempre que tiver dúvidas sobre remédios, consulte seu médico. Não pare de tomar sem orientação.</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">📱</span>
            <div>
              <h4>Peça Ajuda</h4>
              <p>Se tiver dificuldade para usar o aplicativo, peça ajuda a um familiar ou amigo. Eles podem te ensinar.</p>
            </div>
          </div>
        </div>

        <div className="card help-emergency">
          <h3>🚨 Em Caso de Emergência</h3>
          <p className="emergency-text">
            Se você se sentir mal após tomar algum remédio ou esquecer de tomar um remédio importante:
          </p>
          <div className="emergency-actions">
            <div className="emergency-item">
              <span className="emergency-number">192</span>
              <span>SAMU - Emergência Médica</span>
            </div>
            <div className="emergency-item">
              <span className="emergency-number">193</span>
              <span>Bombeiros</span>
            </div>
            <div className="emergency-item">
              <span className="emergency-number">190</span>
              <span>Polícia Militar</span>
            </div>
          </div>
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
      case 'ajuda': return renderAjuda()
      default: return renderDashboard()
    }
  }

  return (
    <div className={`home-container ${darkMode ? 'dark-mode' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>PharmaLife</h1>
        </div>
        <nav className="nav-buttons">
          <button 
            className={activeSection === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveSection('dashboard')}
          >
            Página Inicial
          </button>
          <button 
            className={activeSection === 'agenda' ? 'active' : ''} 
            onClick={() => setActiveSection('agenda')}
          >
            Agenda
          </button>
          <button 
            className={activeSection === 'historico' ? 'active' : ''} 
            onClick={() => setActiveSection('historico')}
          >
            Histórico
          </button>
          <button 
            className={activeSection === 'farmacias' ? 'active' : ''} 
            onClick={() => setActiveSection('farmacias')}
          >
            Farmácias
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