import { useState, useEffect } from 'react'
import './Home.css'
import './Accessibility.css'
import Sobre from './Sobre'

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
  const [accessibilityMode, setAccessibilityMode] = useState(() => {
    return localStorage.getItem('accessibilityMode') === 'true'
  })
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'pt-BR'
  })

  const translations = {
    'pt-BR': {
      greeting: 'Bom dia',
      dashboard: 'Página Inicial',
      agenda: 'Agenda',
      add: 'Adicionar',
      history: 'Histórico',
      pharmacies: 'Farmácias',
      settings: 'Configurações',
      help: 'Ajuda',
      about: 'Sobre Nós',
      nextMeds: 'Próximos Medicamentos',
      daySummary: 'Resumo do Dia',
      lastMeds: 'Últimos Remédios',
      reminders: 'Lembrete',
      nearestPharmacy: 'Farmácia Mais Próxima',
      medsTaken: 'Medicamentos tomados',
      nextMed: 'Próximo medicamento',
      weeklyAdherence: 'Adesão semanal',
      addMed: 'Adicionar Medicamento',
      addReminder: 'Adicionar Lembrete',
      medName: 'Nome do medicamento',
      dosage: 'Dosagem',
      time: 'Horário',
      frequency: 'Frequência',
      daily: 'Diário',
      languageLabel: 'Idioma do aplicativo:',
      notifications: 'Notificações',
      medReminders: 'Lembrete de medicamentos',
      pushNotifications: 'Notificações push',
      darkMode: 'Modo escuro',
      accessibilityMode: 'Modo de Acessibilidade (Letras Grandes)',
      profile: 'Perfil',
      name: 'Nome:',
      password: 'Senha:',
      editProfile: 'Editar Perfil',
      logout: 'Sair da Conta'
    },
    'en-US': {
      greeting: 'Good morning',
      dashboard: 'Dashboard',
      agenda: 'Schedule',
      add: 'Add',
      history: 'History',
      pharmacies: 'Pharmacies',
      settings: 'Settings',
      help: 'Help',
      about: 'About Us',
      nextMeds: 'Next Medications',
      daySummary: 'Day Summary',
      lastMeds: 'Last Medications',
      reminders: 'Reminders',
      nearestPharmacy: 'Nearest Pharmacy',
      medsTaken: 'Medications taken',
      nextMed: 'Next medication',
      weeklyAdherence: 'Weekly adherence',
      addMed: 'Add Medication',
      addReminder: 'Add Reminder',
      medName: 'Medication name',
      dosage: 'Dosage',
      time: 'Time',
      frequency: 'Frequency',
      daily: 'Daily',
      languageLabel: 'App language:',
      notifications: 'Notifications',
      medReminders: 'Medication reminders',
      pushNotifications: 'Push notifications',
      darkMode: 'Dark mode',
      accessibilityMode: 'Accessibility Mode (Large Letters)',
      profile: 'Profile',
      name: 'Name:',
      password: 'Password:',
      editProfile: 'Edit Profile',
      logout: 'Logout'
    },
    'es-ES': {
      greeting: 'Buenos días',
      dashboard: 'Inicio',
      agenda: 'Agenda',
      add: 'Agregar',
      history: 'Historial',
      pharmacies: 'Farmacias',
      settings: 'Configuración',
      help: 'Ayuda',
      about: 'Acerca de',
      nextMeds: 'Próximos Medicamentos',
      daySummary: 'Resumen del Día',
      lastMeds: 'Últimos Medicamentos',
      reminders: 'Recordatorios',
      nearestPharmacy: 'Farmacia Más Cercana',
      medsTaken: 'Medicamentos tomados',
      nextMed: 'Próximo medicamento',
      weeklyAdherence: 'Adherencia semanal',
      addMed: 'Agregar Medicamento',
      addReminder: 'Agregar Recordatorio',
      medName: 'Nombre del medicamento',
      dosage: 'Dosis',
      time: 'Hora',
      frequency: 'Frecuencia',
      daily: 'Diario',
      languageLabel: 'Idioma de la aplicación:',
      notifications: 'Notificaciones',
      medReminders: 'Recordatorios de medicamentos',
      pushNotifications: 'Notificaciones push',
      darkMode: 'Modo oscuro',
      accessibilityMode: 'Modo de Accesibilidad (Letras Grandes)',
      profile: 'Perfil',
      name: 'Nombre:',
      password: 'Contraseña:',
      editProfile: 'Editar Perfil',
      logout: 'Cerrar Sesión'
    }
  }

  const t = translations[language]
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

  const toggleAccessibilityMode = () => {
    const newMode = !accessibilityMode
    setAccessibilityMode(newMode)
    localStorage.setItem('accessibilityMode', newMode.toString())
    if (newMode) {
      showToastMessage('🔍 Modo de Acessibilidade ATIVADO - Letras maiores e interface simplificada')
    } else {
      showToastMessage('Modo de Acessibilidade desativado')
    }
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
      'próximo': { color: '#3b82f6', text: 'Próximo' },
      'aberta': { color: '#10b981', text: 'Aberta' },
      'fechada': { color: '#6b7280', text: 'Fechada' }
    }
    return badges[status] || { color: '#9ca3af', text: 'N/A' }
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
    { id: 1, nome: 'Vitamina D', dosagem: '1000mg', horario: '09:00', frequencia: 'Diário', status: 'próximo', observacao: 'Tomar com alimentos', tipo: 'Suplemento' },
    { id: 2, nome: 'Omeprazol', dosagem: '20mg', horario: '07:00', frequencia: 'Diário', status: 'próximo', observacao: 'Tomar em jejum', tipo: 'Medicamento' }
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
          <h2 className="greeting-text">{t.greeting}{userName ? `, ${userName}` : ''}</h2>
        </div>
        <div className="dashboard">
          <div className="dashboard-main">
            <div className="card urgent-card">
            <div className="card-image">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                <rect x="20" y="30" width="60" height="40" rx="5" fill="#3b82f6" opacity="0.8"/>
                <rect x="25" y="35" width="50" height="30" rx="3" fill="#60a5fa" opacity="0.6"/>
                <circle cx="35" cy="45" r="3" fill="white"/>
                <circle cx="50" cy="45" r="3" fill="white"/>
                <circle cx="65" cy="45" r="3" fill="white"/>
                <circle cx="35" cy="55" r="3" fill="white"/>
                <circle cx="50" cy="55" r="3" fill="white"/>
                <circle cx="65" cy="55" r="3" fill="white"/>
              </svg>
            </div>
            <h3>💊 {t.nextMeds}</h3>
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
            <div className="medication-item">
              <div>
                <div className="item-info">
                  <span className="med-name">Dipirona</span>
                  <span className="badge" style={{backgroundColor: '#f59e0b'}}>Próximo</span>
                </div>
                <div className="item-actions">
                  <span className="time-display">15:00</span>
                  <button className="btn-take" onClick={() => marcarComoTomado(3)}>✓ Tomado</button>
                </div>
              </div>
            </div>
            <div className="medication-item">
              <div>
                <div className="item-info">
                  <span className="med-name">Losartana</span>
                  <span className="badge" style={{backgroundColor: '#3b82f6'}}>Próximo</span>
                </div>
                <div className="item-actions">
                  <span className="time-display">18:00</span>
                  <button className="btn-take" onClick={() => marcarComoTomado(4)}>✓ Tomado</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card urgent-card">
            <div className="card-image">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                <path d="M20 80 L35 60 L50 70 L65 45 L80 50" stroke="#48bb78" stroke-width="3" fill="none" stroke-linecap="round"/>
                <circle cx="35" cy="60" r="4" fill="#3b82f6"/>
                <circle cx="50" cy="70" r="4" fill="#60a5fa"/>
                <circle cx="65" cy="45" r="4" fill="#48bb78"/>
              </svg>
            </div>
            <h3>📊 {t.daySummary}</h3>
            <div className="item">
              <span>{t.medsTaken}</span>
              <span>{medicamentosTomados.length + 2}/4</span>
            </div>
            <div className="item">
              <span>{t.nextMed}</span>
              <span>Vitamina D - 09:00</span>
            </div>
            <div className="item">
              <span>Consultas hoje</span>
              <span>1 agendada</span>
            </div>
            <div className="item">
              <span>Água consumida</span>
              <span>1.2L / 2L</span>
            </div>
            <div className="item">
              <span>Exercícios</span>
              <span>Pendente</span>
            </div>
            <div className="progress-container">
              <span>{t.weeklyAdherence}: {adesao}%</span>
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
            <h3>💊 {t.lastMeds}</h3>
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
                <rect x="25" y="20" width="50" height="60" rx="5" fill="#f59e0b" opacity="0.8"/>
                <rect x="30" y="25" width="40" height="50" rx="3" fill="#fbbf24" opacity="0.6"/>
                <path d="M35 35 L65 35 M35 45 L60 45 M35 55 L55 55" stroke="white" stroke-width="2"/>
              </svg>
            </div>
            <h3>📝 {t.reminders}</h3>
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
              <h3>🏥 {t.nearestPharmacy}</h3>
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

  const handleAddMedicamento = () => {
    if (novoMedicamento.nome && novoMedicamento.dosagem && novoMedicamento.horario) {
      console.log('Novo medicamento:', novoMedicamento)
      showToastMessage('✨ Medicamento adicionado com sucesso!')
      setNovoMedicamento({ nome: '', dosagem: '', horario: '', frequencia: 'Diário', duracao: '1 semana' })
    } else {
      showToastMessage('⚠️ Preencha todos os campos obrigatórios!')
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

  const handleDeleteMedicamento = (medId) => {
    if (window.confirm('Tem certeza que deseja excluir este medicamento?')) {
      try {
        // Aqui você removeria o medicamento
        showToastMessage('Medicamento excluído com sucesso!')
      } catch (error) {
        showToastMessage('Erro ao excluir medicamento')
      }
    }
  }

  const handleDeleteMedicamentoModal = () => {
    try {
      // Aqui você removeria o medicamento
      showToastMessage('Medicamento excluído com sucesso!')
      setShowEditModal(false)
      setEditingMed(null)
    } catch (error) {
      showToastMessage('Erro ao excluir medicamento')
    }
  }

  const [agendaView, setAgendaView] = useState('overview') // 'overview', 'medicamentos', 'lembretes'

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
          <button 
            className="btn-add-med"
            onClick={() => setActiveSection('adicionar')}
          >
            ➕ Adicionar Medicamento
          </button>
        </div>
        <div className="agenda">
          {medicamentosFiltrados.map((med, index) => {
            const badge = getStatusBadge(med.status)
            const jaTomado = medicamentosTomados.includes(med.id)
            return (
              <div key={index} className="card medication-card">
                <div className="card-header">
                  <h4>{med.nome}</h4>
                  <div className="card-actions">
                    <span className="badge" style={{backgroundColor: badge.color}}>{badge.text}</span>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEditMedicamento(med)}
                        title="Editar medicamento"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-delete-small" 
                        onClick={() => handleDeleteMedicamento(med.id)}
                        title="Excluir medicamento"
                      >
                        🗑️
                      </button>
                    </div>
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

  const renderAdicionar = () => (
    <>
      <h2 className="section-title">Adicionar</h2>
      <div className="agenda">
        <div className="card">
          <div className="card-header">
            <h3>💊 {t.addMed}</h3>
            <button 
              className="btn-add-highlight"
              onClick={handleAddMedicamento}
              type="button"
            >
              ➕ Adicionar
            </button>
          </div>
          <form onSubmit={handleAddMedicamento} className="med-form">
            <input
              type="text"
              placeholder={t.medName}
              value={novoMedicamento.nome}
              onChange={(e) => setNovoMedicamento({...novoMedicamento, nome: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder={t.dosage}
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
          </form>
          <button 
            onClick={handleAddMedicamento}
            style={{display: 'block', width: '100%', minHeight: '50px', backgroundColor: '#48bb78', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', marginTop: '1rem'}}
          >
            Adicionar Medicamento
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>📝 {t.addReminder}</h3>
            <button 
              className="btn-add-highlight"
              onClick={handleAddLembrete}
              type="button"
            >
              ➕ Adicionar
            </button>
          </div>
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
            <button type="submit" className="btn-add" style={{display: 'block', width: '100%', minHeight: '50px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', marginTop: '1rem'}}>Adicionar Lembrete</button>
          </form>
        </div>

        {lembretes.map((lembrete, index) => (
          <div key={index} className="card">
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
          <h4>{t.notifications}</h4>
          <label>
            <input type="checkbox" defaultChecked />
            {t.medReminders}
          </label>
          <label>
            <input type="checkbox" defaultChecked />
            {t.pushNotifications}
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            {t.darkMode}
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={accessibilityMode}
              onChange={toggleAccessibilityMode}
            />
            {t.accessibilityMode}
          </label>
          <div className="language-selector">
            <label>{t.languageLabel}</label>
            <select 
              value={language} 
              onChange={(e) => {
                setLanguage(e.target.value)
                localStorage.setItem('language', e.target.value)
                showToastMessage(`Idioma alterado para ${e.target.options[e.target.selectedIndex].text}`)
              }}
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>
        </div>
        <div className="card">
          <div className="card-image">
            <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="35" r="15" fill="#6b7280" opacity="0.8"/>
              <path d="M25 75 C25 60 35 50 50 50 C65 50 75 60 75 75 L25 75 Z" fill="#9ca3af" opacity="0.6"/>
            </svg>
          </div>
          <h4>{t.profile}</h4>
          <div className="perfil-info">
            <div className="item">
              <span>{t.name}</span>
              <span>{perfil.nome}</span>
            </div>
            <div className="item">
              <span>{t.password}</span>
              <span>{perfil.senha}</span>
            </div>

          </div>
          <div style={{textAlign: 'center'}}>
            <button className="btn-config" onClick={() => setShowProfileModal(true)}>{t.editProfile}</button>
            <button className="btn-config" onClick={onLogout}>{t.logout}</button>
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
                <button type="button" className="btn-delete" onClick={handleDeleteMedicamentoModal}>Excluir</button>
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
      <h2 className="section-title">Ajuda</h2>
      <div className="ajuda">
        <div className="card">
          <div className="card-image">
            <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="35" fill="#3b82f6" opacity="0.8"/>
              <path d="M50 30 Q60 30 60 40 Q60 50 50 50 M50 65 L50 70" stroke="white" stroke-width="4" stroke-linecap="round" fill="none"/>
            </svg>
          </div>
          <h3>Como usar o PharmaLife</h3>
          <div className="item">
            <span>Página Inicial:</span>
            <span>Veja seus remédios do dia</span>
          </div>
          <div className="item">
            <span>Agenda:</span>
            <span>Adicione novos medicamentos</span>
          </div>
          <div className="item">
            <span>Histórico:</span>
            <span>Veja remédios anteriores</span>
          </div>
          <div className="item">
            <span>Farmácias:</span>
            <span>Encontre farmácias próximas</span>
          </div>
        </div>

        <div className="card">
          <div className="card-image">
            <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
              <rect x="30" y="40" width="40" height="20" rx="10" fill="#48bb78" opacity="0.8"/>
              <circle cx="50" cy="50" r="6" fill="white"/>
            </svg>
          </div>
          <h3>Adicionar Medicamento</h3>
          <div className="item">
            <span>1. Nome:</span>
            <span>Digite o nome do remédio</span>
          </div>
          <div className="item">
            <span>2. Dosagem:</span>
            <span>Ex: 500mg, 1 comprimido</span>
          </div>
          <div className="item">
            <span>3. Horário:</span>
            <span>Escolha quando tomar</span>
          </div>
          <div className="item">
            <span>4. Frequência:</span>
            <span>Diário, 12h, 8h ou semanal</span>
          </div>
        </div>

        <div className="card">
          <div className="card-image">
            <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="35" fill="#f59e0b" opacity="0.8"/>
              <path d="M35 45 L45 55 L65 35" stroke="white" stroke-width="4" stroke-linecap="round" fill="none"/>
            </svg>
          </div>
          <h3>Marcar como Tomado</h3>
          <div className="item">
            <span>Botão Verde:</span>
            <span>Clique quando tomar o remédio</span>
          </div>
          <div className="item">
            <span>Histórico:</span>
            <span>Fica registrado automaticamente</span>
          </div>
          <div className="item">
            <span>Adesão:</span>
            <span>Acompanhe sua porcentagem</span>
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

        <div className="card help-seniors">
          <h3>👴👵 Guia Especial para Idosos</h3>
          <div className="senior-tip">
            <h4>🔍 Como Ativar Letras Grandes</h4>
            <p>No canto superior direito, clique no botão "🔍 Letras Grandes". Isso vai deixar tudo maior e mais fácil de ler.</p>
          </div>
          <div className="senior-tip">
            <h4>📱 Peça Ajuda de Familiares</h4>
            <p>Se tiver dificuldade, peça para um filho, neto ou vizinho te ajudar a configurar o aplicativo pela primeira vez.</p>
          </div>
          <div className="senior-tip">
            <h4>⏰ Horários Simples</h4>
            <p>Use horários fáceis de lembrar: 8h da manhã, 12h (meio-dia), 18h (6 da tarde). Evite horários complicados.</p>
          </div>
          <div className="senior-tip">
            <h4>📝 Anote no Papel Também</h4>
            <p>Além do aplicativo, mantenha uma lista dos seus remédios anotada no papel, como backup.</p>
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
      case 'adicionar': return renderAdicionar()
      case 'sobre': return <Sobre />
      default: return renderDashboard()
    }
  }

  return (
    <div className={`home-container ${darkMode ? 'dark-mode' : ''} ${accessibilityMode ? 'accessibility-mode' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>PharmaLife</h1>
          <button 
            className="accessibility-toggle"
            onClick={toggleAccessibilityMode}
            title={accessibilityMode ? 'Desativar modo de acessibilidade' : 'Ativar modo de acessibilidade - Letras maiores'}
          >
            {accessibilityMode ? '🔍 Modo Normal' : '🔍 Letras Grandes'}
          </button>
        </div>
        <nav className="nav-buttons">
          <button 
            className={activeSection === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveSection('dashboard')}
          >
            {t.dashboard}
          </button>
          <button 
            className={activeSection === 'agenda' ? 'active' : ''} 
            onClick={() => setActiveSection('agenda')}
          >
            {t.agenda}
          </button>
          <button 
            className={activeSection === 'adicionar' ? 'active' : ''} 
            onClick={() => setActiveSection('adicionar')}
          >
            {t.add}
          </button>
          <button 
            className={activeSection === 'historico' ? 'active' : ''} 
            onClick={() => setActiveSection('historico')}
          >
            {t.history}
          </button>
          <button 
            className={activeSection === 'farmacias' ? 'active' : ''} 
            onClick={() => setActiveSection('farmacias')}
          >
            {t.pharmacies}
          </button>
          <button 
            className={activeSection === 'configuracoes' ? 'active' : ''} 
            onClick={() => setActiveSection('configuracoes')}
          >
            {t.settings}
          </button>
          <button 
            className={activeSection === 'ajuda' ? 'active' : ''} 
            onClick={() => setActiveSection('ajuda')}
          >
            {t.help}
          </button>
          <button 
            className={activeSection === 'sobre' ? 'active' : ''} 
            onClick={() => setActiveSection('sobre')}
          >
            {t.about}
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