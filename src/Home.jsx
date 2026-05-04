import { useState, useEffect } from 'react'
import './Home.css'
import './Accessibility.css'
import './Adicionar.css'
import Sobre from './Sobre'

function Home({ onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isAdmin] = useState(() => sessionStorage.getItem('isAdmin') === 'true')
  const [usuarios, setUsuarios] = useState([])
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
  const [medicamentos, setMedicamentos] = useState([])
  const [loading, setLoading] = useState(false)
  const [estatisticas, setEstatisticas] = useState({ adesao: 0, tomados: 0, total: 0 })
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [perfil, setPerfil] = useState({
    nome: '',
    senha: '',
    email: '',
    idade: '',
    comorbidade: ''
  })
  const [darkMode, setDarkMode] = useState(false)
  const [accessibilityMode, setAccessibilityMode] = useState(() => {
    return localStorage.getItem('accessibilityMode') === 'true'
  })

  const [showEditModal, setShowEditModal] = useState(false)
  const [editingMed, setEditingMed] = useState(null)
  const [editMedicamento, setEditMedicamento] = useState({
    nome: '',
    dosagem: '',
    horario: '',
    frequencia: 'Diário',
    observacao: ''
  })
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [editProfile, setEditProfile] = useState({
    nome: '',
    senhaAtual: '',
    novaSenha: ''
  })
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)
  const [deleteAccountData, setDeleteAccountData] = useState({
    senhaAtual: ''
  })
  const [novoLembrete, setNovoLembrete] = useState({
    titulo: '',
    descricao: '',
    data: '',
    horario: ''
  })
  const [lembretes, setLembretes] = useState([])
  const [historicoCompleto, setHistoricoCompleto] = useState([])

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

  const marcarComoTomado = async (med) => {
    const agendaId = med.agenda?.id
    const medicamentoId = med.id
    try {
      const now = new Date()
      const response = await fetch(`http://localhost:8080/api/agenda/${agendaId}/medicamentos/${medicamentoId}/historico`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: med.nome,
          dosagem: med.descricao || '',
          observacoes: med.complemento || '',
          horario: now.toTimeString().slice(0, 5),
          status: 'PENDENTE'
        })
      })
      if (response.ok) {
        setMedicamentosTomados([...medicamentosTomados, medicamentoId])
        showToastMessage('✅ Medicamento marcado como tomado!')
        carregarHistoricoCompleto()
        carregarEstatisticas()
        carregarHistoricoRecente()
      } else {
        throw new Error('Erro no backend')
      }
    } catch (error) {
      const medicamentosTomadosLocal = JSON.parse(localStorage.getItem('medicamentosTomados') || '[]')
      medicamentosTomadosLocal.push({ medicamentoId, dataHora: new Date().toISOString(), usuario: sessionStorage.getItem('userName') })
      localStorage.setItem('medicamentosTomados', JSON.stringify(medicamentosTomadosLocal))
      setMedicamentosTomados([...medicamentosTomados, medicamentoId])
      showToastMessage('✅ Medicamento marcado como tomado!')
      carregarEstatisticas()
      carregarHistoricoRecente()
    }
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

  const carregarEstatisticas = () => {
    const userName = sessionStorage.getItem('userName')
    const medicamentosTomadosLocal = JSON.parse(localStorage.getItem('medicamentosTomados') || '[]')
    const medicamentosUsuario = medicamentosTomadosLocal.filter(mt => mt.usuario === userName)
    
    const totalMedicamentos = medicamentos.length * 7 // 7 dias
    const tomados = medicamentosUsuario.length
    const adesao = totalMedicamentos > 0 ? Math.round((tomados / totalMedicamentos) * 100) : 0
    
    setEstatisticas({ adesao, tomados, total: totalMedicamentos })
  }
  
  useEffect(() => {
    carregarEstatisticas()
  }, [medicamentos])

  const [historicoRecente, setHistoricoRecente] = useState([])
  
  const carregarHistoricoRecente = () => {
    const userName = sessionStorage.getItem('userName')
    const medicamentosTomadosLocal = JSON.parse(localStorage.getItem('medicamentosTomados') || '[]')
    const medicamentosLocal = JSON.parse(localStorage.getItem('medicamentos') || '[]')
    
    const historicoUsuario = medicamentosTomadosLocal
      .filter(mt => mt.usuario === userName)
      .map(mt => {
        const medicamento = medicamentosLocal.find(m => m.id === mt.medicamentoId)
        const dataHora = new Date(mt.dataHora)
        const hoje = new Date()
        const ontem = new Date(hoje)
        ontem.setDate(hoje.getDate() - 1)
        
        let dataTexto = 'Hoje'
        if (dataHora.toDateString() === ontem.toDateString()) {
          dataTexto = 'Ontem'
        } else if (dataHora.toDateString() !== hoje.toDateString()) {
          dataTexto = dataHora.toLocaleDateString('pt-BR')
        }
        
        return {
          nome: medicamento ? `${medicamento.nome} ${medicamento.descricao || medicamento.dosagem || ''}` : 'Medicamento',
          horario: dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          data: dataTexto,
          status: 'tomado'
        }
      })
      .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
      .slice(0, 3)
    
    setHistoricoRecente(historicoUsuario)
  }
  
  useEffect(() => {
    carregarHistoricoRecente()
  }, [medicamentos])
  
  const ultimosRemedios = historicoRecente

  const carregarMedicamentos = async () => {
    const userName = sessionStorage.getItem('userName')
    if (!userName) return
    setLoading(true)
    try {
      let usuarioId = sessionStorage.getItem('userId')
      if (!usuarioId) { usuarioId = 1; sessionStorage.setItem('userId', usuarioId) }

      // 1. Busca agendas do usuário
      const agendaResp = await fetch(`http://localhost:8080/api/usuarios/${usuarioId}/agenda`)
      if (!agendaResp.ok) throw new Error('Erro ao buscar agendas')
      const agendas = await agendaResp.json()
      const agendasArray = Array.isArray(agendas) ? agendas : []

      // 2. Para cada agenda, busca medicamentos
      const todasPromises = agendasArray.map(ag =>
        fetch(`http://localhost:8080/api/agenda/${ag.id}/medicamentos`)
          .then(r => r.ok ? r.json() : [])
          .then(meds => (Array.isArray(meds) ? meds : []).map(m => ({ ...m, agenda: ag })))
      )
      const resultados = await Promise.all(todasPromises)
      const todosMedicamentos = resultados.flat()
      setMedicamentos(todosMedicamentos)
      localStorage.setItem('medicamentos', JSON.stringify(todosMedicamentos))
    } catch (error) {
      console.log('Usando localStorage como fallback')
      const medicamentosExistentes = JSON.parse(localStorage.getItem('medicamentos') || '[]')
      const medicamentosUsuario = Array.isArray(medicamentosExistentes)
        ? medicamentosExistentes.filter(med => med.usuario === userName)
        : []
      setMedicamentos(medicamentosUsuario)
    }
    setLoading(false)
  }
  
  useEffect(() => {
    carregarMedicamentos()
  }, [])
  
  // Medicamento do backend: { id, nome, descricao (dosagem), tipo (frequencia), complemento, agenda: { horario } }
  const agendaMedicamentos = Array.isArray(medicamentos) ? medicamentos.map(med => ({
    ...med,
    dosagem: med.descricao || med.dosagem || '',
    horario: med.agenda?.horario || med.horario || '',
    frequencia: med.tipo || med.frequencia || '',
    status: med.statusMedicamento || 'próximo'
  })) : []

  const historicoRemedios = [
    { nome: 'Paracetamol 750mg', data: '15/12/2024', horario: '16:00' },
    { nome: 'Amoxicilina 500mg', data: '10/12/2024', horario: '08:00' },
    { nome: 'Dipirona 500mg', data: '08/12/2024', horario: '14:00' }
  ]



  const renderDashboard = () => {
    const adesao = estatisticas.adesao
    const agora = new Date()
    const hora = agora.getHours()
    const userName = sessionStorage.getItem('userName') || 'Usuário'
    let saudacao = 'Bom dia'
    if (hora >= 12 && hora < 18) saudacao = 'Boa tarde'
    else if (hora >= 18) saudacao = 'Boa noite'
    
    return (
      <div className="dashboard-container">
        {/* Header com saudação e estatísticas rápidas */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1 className="welcome-title">{saudacao}, {userName}!</h1>
            <p className="welcome-subtitle">Gerencie seus medicamentos de forma inteligente</p>
          </div>
          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-icon">💊</div>
              <div className="stat-info">
                <span className="stat-number">{estatisticas.tomados}</span>
                <span className="stat-label">Tomados hoje</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏰</div>
              <div className="stat-info">
                <span className="stat-number">{medicamentos.length - medicamentosTomados.length}</span>
                <span className="stat-label">Pendentes</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-info">
                <span className="stat-number">{adesao}%</span>
                <span className="stat-label">Adesão</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid principal */}
        <div className="dashboard-grid" style={{alignItems: 'stretch'}}>
          {/* Próximos medicamentos */}
          <div className="dashboard-card priority-card">
            <div className="card-header-modern">
              <h3><span className="card-icon">🎯</span>Próximos Medicamentos</h3>
              <span className="card-badge urgent">Urgente</span>
            </div>
            <div className="medication-timeline">
              {loading ? (
                <div style={{textAlign: 'center', padding: '20px'}}>Carregando...</div>
              ) : agendaMedicamentos.length === 0 ? (
                <div style={{textAlign: 'center', padding: '20px', color: '#666'}}>
                  Nenhum medicamento cadastrado ainda.
                  <br />
                  <button 
                    onClick={() => setActiveSection('adicionar')}
                    style={{marginTop: '10px', padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}
                  >
                    Adicionar Primeiro Medicamento
                  </button>
                </div>
              ) : agendaMedicamentos.slice(0, 3).map((med, index) => {
                const jaTomado = medicamentosTomados.includes(med.id)
                return (
                  <div key={index} className="timeline-item">
                    <div className="timeline-time">{med.horario}</div>
                    <div className="timeline-content">
                      <div className="med-info">
                        <h4>{med.nome}</h4>
                        <span className="med-dosage">{med.dosagem}</span>
                      </div>
                      {!jaTomado && (
                        <button 
                          className="btn-check" 
                          onClick={() => marcarComoTomado(med)}
                        >
                          ✓
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Resumo de adesão */}
          <div className="dashboard-card">
            <div className="card-header-modern">
              <h3><span className="card-icon">📊</span>Adesão ao Tratamento</h3>
            </div>
            <div className="adherence-chart">
              <div className="chart-circle">
                <svg viewBox="0 0 100 100" className="circular-chart">
                  <path
                    className="circle-bg"
                    d="M 50,50 m 0,-40 a 40,40 0 1 1 0,80 a 40,40 0 1 1 0,-80"
                  />
                  <path
                    className="circle"
                    strokeDasharray={`${adesao * 2.51}, 251`}
                    d="M 50,50 m 0,-40 a 40,40 0 1 1 0,80 a 40,40 0 1 1 0,-80"
                  />
                  <text x="50" y="50" className="percentage">{adesao}%</text>
                </svg>
              </div>
              <div className="adherence-info">
                <div className="adherence-item">
                  <span className="dot success"></span>
                  <span>Tomados: {estatisticas.tomados}</span>
                </div>
                <div className="adherence-item">
                  <span className="dot warning"></span>
                  <span>Perdidos: 0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Histórico recente */}
          <div className="dashboard-card">
            <div className="card-header-modern">
              <h3><span className="card-icon">📋</span>Histórico Recente</h3>
              <button className="btn-link" onClick={() => setActiveSection('historico')}>Ver tudo</button>
            </div>
            <div className="recent-history">
              {ultimosRemedios.length === 0 ? (
                <div style={{textAlign: 'center', color: '#666', padding: '20px'}}>
                  Nenhum medicamento tomado ainda.
                  <br />
                  Marque medicamentos como tomados para ver o histórico.
                </div>
              ) : (
                ultimosRemedios.map((remedio, index) => (
                  <div key={index} className="history-item">
                    <div className="history-icon">✅</div>
                    <div className="history-info">
                      <span className="history-med">{remedio.nome}</span>
                      <span className="history-time">{remedio.data} às {remedio.horario}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Lembretes importantes */}
          <div className="dashboard-card">
            <div className="card-header-modern">
              <h3><span className="card-icon">🔔</span>Lembretes</h3>
              <button className="btn-link" onClick={() => setActiveSection('adicionar')}>Adicionar</button>
            </div>
            <div className="reminders-list">
              {lembretes.length === 0 ? (
                <div style={{textAlign: 'center', color: '#666', padding: '20px'}}>
                  Nenhum lembrete cadastrado ainda.
                  <br />
                  <button 
                    onClick={() => setActiveSection('adicionar')}
                    style={{marginTop: '10px', padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}
                  >
                    Adicionar Lembrete
                  </button>
                </div>
              ) : (
                lembretes.slice(0, 3).map((lembrete, index) => {
                  const dataLembrete = new Date(lembrete.data)
                  const hoje = new Date()
                  const amanha = new Date(hoje)
                  amanha.setDate(hoje.getDate() + 1)
                  
                  let dataTexto = dataLembrete.toLocaleDateString('pt-BR')
                  if (dataLembrete.toDateString() === hoje.toDateString()) {
                    dataTexto = 'Hoje'
                  } else if (dataLembrete.toDateString() === amanha.toDateString()) {
                    dataTexto = 'Amanhã'
                  }
                  
                  const isPriority = dataLembrete <= amanha
                  
                  return (
                    <div key={index} className={`reminder-item ${isPriority ? 'priority' : ''}`}>
                      <div className="reminder-icon">🔔</div>
                      <div className="reminder-content">
                        <span className="reminder-title">{lembrete.titulo}</span>
                        <span className="reminder-time">{dataTexto} às {lembrete.horario}</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleAddMedicamento = async () => {
    if (novoMedicamento.nome && novoMedicamento.dosagem && novoMedicamento.horario) {
      try {
        let usuarioId = sessionStorage.getItem('userId')
        if (!usuarioId) { usuarioId = 1; sessionStorage.setItem('userId', usuarioId) }

        // 1. Cria ou reutiliza agenda do usuário
        let agendaId = sessionStorage.getItem('agendaId')
        if (!agendaId) {
          const agendaResp = await fetch(`http://localhost:8080/api/usuarios/${usuarioId}/agenda`)
          const agendas = agendaResp.ok ? await agendaResp.json() : []
          if (Array.isArray(agendas) && agendas.length > 0) {
            agendaId = agendas[0].id
            sessionStorage.setItem('agendaId', agendaId)
          } else {
            // Cria agenda padrão
            const toLocalISO = (d) => d.toISOString().slice(0, 19) // remove o 'Z' final
            const novaAgendaResp = await fetch(`http://localhost:8080/api/usuarios/${usuarioId}/agenda`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                nome: 'Agenda Principal',
                dosagem: '-',
                horario: (novoMedicamento.horario || '08:00') + ':00',
                dataInicio: toLocalISO(new Date()),
                dataFim: toLocalISO(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
                observacoes: ''
              })
            })
            if (!novaAgendaResp.ok) {
              const errText = await novaAgendaResp.text()
              console.error('Erro ao criar agenda:', errText)
              throw new Error(`Erro ao criar agenda: ${errText}`)
            }
            const novaAgenda = await novaAgendaResp.json()
            agendaId = novaAgenda.id
            sessionStorage.setItem('agendaId', agendaId)
          }
        }

        // 2. Cria medicamento vinculado à agenda
        const response = await fetch(`http://localhost:8080/api/agenda/${agendaId}/medicamentos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: novoMedicamento.nome,
            descricao: novoMedicamento.dosagem,
            tipo: novoMedicamento.frequencia || 'Diário',
            complemento: novoMedicamento.duracao || ''
          })
        })
        if (response.ok) {
          showToastMessage('✨ Medicamento adicionado com sucesso!')
          setNovoMedicamento({ nome: '', dosagem: '', horario: '', frequencia: 'Diário', duracao: '1 semana' })
          await carregarMedicamentos()
          carregarHistoricoCompleto()
        } else {
          const errText = await response.text()
          console.error('Erro ao salvar medicamento:', errText)
          showToastMessage(`⚠️ Erro ao salvar: ${errText}`)
        }
      } catch (error) {
        console.error('Erro de conexão ao salvar medicamento:', error)
        showToastMessage(`⚠️ Erro de conexão: ${error.message}`)
      }
    } else {
      showToastMessage('⚠️ Preencha todos os campos obrigatórios!')
    }
  }

  const handleAddLembrete = (e) => {
    e.preventDefault()
    if (novoLembrete.titulo && novoLembrete.data && novoLembrete.horario) {
      const lembretesExistentes = JSON.parse(localStorage.getItem('lembretes') || '[]')
      const novoLembreteObj = {
        id: Date.now(),
        ...novoLembrete,
        usuario: sessionStorage.getItem('userName')
      }
      lembretesExistentes.push(novoLembreteObj)
      localStorage.setItem('lembretes', JSON.stringify(lembretesExistentes))
      
      showToastMessage('Lembrete adicionado com sucesso!')
      setNovoLembrete({ titulo: '', descricao: '', data: '', horario: '' })
      carregarLembretes()
    }
  }
  
  const carregarLembretes = () => {
    const userName = sessionStorage.getItem('userName')
    if (!userName) return
    
    const lembretesExistentes = JSON.parse(localStorage.getItem('lembretes') || '[]')
    const lembretesUsuario = lembretesExistentes.filter(l => l.usuario === userName)
    setLembretes(lembretesUsuario)
  }
  
  const carregarHistoricoCompleto = async () => {
    try {
      let usuarioId = sessionStorage.getItem('userId')
      if (!usuarioId) { usuarioId = 1; sessionStorage.setItem('userId', usuarioId) }

      const response = await fetch(`http://localhost:8080/api/usuarios/${usuarioId}/historico`)
      if (response.ok) {
        const historico = await response.json()
        const historicoArray = Array.isArray(historico) ? historico : []
        setHistoricoCompleto(historicoArray)
      } else {
        throw new Error('Backend não disponível')
      }
    } catch (error) {
      // Fallback para localStorage
      const userName = sessionStorage.getItem('userName')
      const medicamentosTomadosLocal = JSON.parse(localStorage.getItem('medicamentosTomados') || '[]')
      const historicoExclusoes = JSON.parse(localStorage.getItem('historicoExclusoes') || '[]')
      const medicamentosLocal = JSON.parse(localStorage.getItem('medicamentos') || '[]')
      
      // Histórico de medicamentos tomados
      const historicoTomados = medicamentosTomadosLocal
        .filter(mt => mt.usuario === userName)
        .map(mt => {
          const medicamento = medicamentosLocal.find(m => m.id === mt.medicamentoId)
          return {
            nomeMedicamento: medicamento ? medicamento.nome : 'Medicamento',
            dosagem: medicamento ? medicamento.dosagem : '',
            acao: 'TOMADO',
            dataHora: mt.dataHora,
            detalhes: `Medicamento tomado conforme programado`
          }
        })
      
      // Histórico de exclusões
      const historicoExcluidos = historicoExclusoes
        .filter(he => he.usuario === userName)
        .map(he => ({
          nomeMedicamento: he.nomeMedicamento,
          dosagem: he.dosagem,
          acao: 'EXCLUIDO',
          dataHora: he.dataHora,
          detalhes: `Medicamento removido da agenda`
        }))
      
      // Combinar e ordenar todos os históricos
      const historicoLocal = [...(Array.isArray(historicoTomados) ? historicoTomados : []), ...(Array.isArray(historicoExcluidos) ? historicoExcluidos : [])]
        .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
      
      setHistoricoCompleto(Array.isArray(historicoLocal) ? historicoLocal : [])
    }
  }
  
  const carregarPerfilUsuario = async () => {
    try {
      const userId = sessionStorage.getItem('userId')
      if (userId) {
        const response = await fetch(`http://localhost:8080/api/usuarios/${userId}`)
        if (response.ok) {
          const usuario = await response.json()
          setPerfil({
            nome: usuario.nome,
            senha: '******',
            email: usuario.email,
            idade: usuario.idade || '',
            comorbidade: usuario.comorbidade || ''
          })
          // Atualizar sessionStorage com dados do backend
          sessionStorage.setItem('userName', usuario.nome)
          sessionStorage.setItem('userEmail', usuario.email)
          return
        }
      }
    } catch (error) {
      console.log('Usando dados do sessionStorage')
    }
    
    // Fallback para sessionStorage e localStorage
    const userName = sessionStorage.getItem('userName')
    let userEmail = sessionStorage.getItem('userEmail')
    let userIdade = ''
    let userComorbidade = ''
    
    // Buscar dados completos do localStorage
    const usuariosCadastrados = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]')
    const usuarioEncontrado = usuariosCadastrados.find(u => u.nome === userName || u.email === userEmail)
    
    if (usuarioEncontrado) {
      userEmail = usuarioEncontrado.email
      userIdade = usuarioEncontrado.idade || ''
      userComorbidade = usuarioEncontrado.comorbidade || ''
      sessionStorage.setItem('userEmail', userEmail)
    }
    
    // Também verificar se há dados salvos no perfil local
    const perfilLocal = JSON.parse(localStorage.getItem('perfilUsuario') || '{}')
    if (perfilLocal.nome === userName) {
      userIdade = perfilLocal.idade || userIdade
      userComorbidade = perfilLocal.comorbidade || userComorbidade
    }
    
    setPerfil({
      nome: userName || 'Usuário',
      senha: '******',
      email: userEmail || 'Não informado',
      idade: userIdade || '',
      comorbidade: userComorbidade || ''
    })
  }
  
  useEffect(() => {
    carregarLembretes()
    carregarHistoricoCompleto()
    carregarPerfilUsuario()
  }, [])

  const handleEditMedicamento = (med) => {
    setEditingMed(med)
    setEditMedicamento({
      nome: med.nome,
      dosagem: med.descricao || med.dosagem || '',
      horario: med.agenda?.horario || med.horario || '',
      frequencia: med.tipo || med.frequencia || 'Diário',
      observacao: med.complemento || med.observacao || ''
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:8080/api/medicamentos/${editingMed.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: editMedicamento.nome,
          descricao: editMedicamento.dosagem,
          tipo: editMedicamento.frequencia,
          complemento: editMedicamento.observacao || ''
        })
      })
      
      if (response.ok) {
        showToastMessage('Medicamento atualizado com sucesso!')
        setShowEditModal(false)
        setEditingMed(null)
        await carregarMedicamentos()
        carregarHistoricoCompleto()
      } else {
        const errorData = await response.json()
        showToastMessage(errorData.erro || 'Erro ao atualizar medicamento')
      }
    } catch (error) {
      console.log('Usando localStorage para edição')
      // Fallback para localStorage se backend não disponível
      const medicamentosExistentes = JSON.parse(localStorage.getItem('medicamentos') || '[]')
      const medicamentosAtualizados = medicamentosExistentes.map(med => 
        med.id === editingMed.id ? { ...med, ...editMedicamento } : med
      )
      localStorage.setItem('medicamentos', JSON.stringify(medicamentosAtualizados))
      
      showToastMessage('Medicamento atualizado com sucesso!')
      setShowEditModal(false)
      setEditingMed(null)
      await carregarMedicamentos()
    }
  }

  const handleDeleteMedicamento = async (medId) => {
    if (window.confirm('Tem certeza que deseja excluir este medicamento?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/medicamentos/${medId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          showToastMessage('Medicamento excluído com sucesso!')
          await carregarMedicamentos()
          setTimeout(() => carregarHistoricoCompleto(), 500)
        } else {
          const errorData = await response.json()
          showToastMessage(errorData.erro || 'Erro ao excluir medicamento')
        }
      } catch (error) {
        const medicamentosExistentes = JSON.parse(localStorage.getItem('medicamentos') || '[]')
        const medicamento = medicamentosExistentes.find(med => med.id === medId)
        
        // Registrar exclusão no histórico
        if (medicamento) {
          const historicoExclusao = JSON.parse(localStorage.getItem('historicoExclusoes') || '[]')
          historicoExclusao.push({
            medicamentoId: medId,
            nomeMedicamento: medicamento.nome,
            dosagem: medicamento.dosagem,
            acao: 'EXCLUIDO',
            dataHora: new Date().toISOString(),
            usuario: sessionStorage.getItem('userName')
          })
          localStorage.setItem('historicoExclusoes', JSON.stringify(historicoExclusao))
        }
        
        const medicamentosAtualizados = medicamentosExistentes.filter(med => med.id !== medId)
        localStorage.setItem('medicamentos', JSON.stringify(medicamentosAtualizados))
        
        showToastMessage('Medicamento excluído com sucesso!')
        await carregarMedicamentos()
        await carregarHistoricoCompleto()
      }
    }
  }

  const handleDeleteMedicamentoModal = async () => {
    if (window.confirm('Tem certeza que deseja excluir este medicamento?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/medicamentos/${editingMed.id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          showToastMessage('Medicamento excluído com sucesso!')
          setShowEditModal(false)
          setEditingMed(null)
          await carregarMedicamentos()
          setTimeout(() => carregarHistoricoCompleto(), 500)
        } else {
          const errorData = await response.json()
          showToastMessage(errorData.erro || 'Erro ao excluir medicamento')
        }
      } catch (error) {
        // Registrar exclusão no histórico
        const historicoExclusao = JSON.parse(localStorage.getItem('historicoExclusoes') || '[]')
        historicoExclusao.push({
          medicamentoId: editingMed.id,
          nomeMedicamento: editingMed.nome,
          dosagem: editingMed.dosagem,
          acao: 'EXCLUIDO',
          dataHora: new Date().toISOString(),
          usuario: sessionStorage.getItem('userName')
        })
        localStorage.setItem('historicoExclusoes', JSON.stringify(historicoExclusao))
        
        const medicamentosExistentes = JSON.parse(localStorage.getItem('medicamentos') || '[]')
        const medicamentosAtualizados = medicamentosExistentes.filter(med => med.id !== editingMed.id)
        localStorage.setItem('medicamentos', JSON.stringify(medicamentosAtualizados))
        
        showToastMessage('Medicamento excluído com sucesso!')
        setShowEditModal(false)
        setEditingMed(null)
        await carregarMedicamentos()
        await carregarHistoricoCompleto()
      }
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
          <button 
            className="btn-add-med"
            onClick={() => setActiveSection('adicionar')}
          >
            ➕ Adicionar Medicamento
          </button>
        </div>
        <div className="agenda">
          {loading ? (
            <div style={{textAlign: 'center', padding: '40px'}}>Carregando medicamentos...</div>
          ) : medicamentosFiltrados.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
              {searchTerm ? 'Nenhum medicamento encontrado com esse nome.' : 'Nenhum medicamento cadastrado ainda.'}
              <br />
              <button 
                onClick={() => setActiveSection('adicionar')}
                style={{marginTop: '15px', padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}
              >
                Adicionar Medicamento
              </button>
            </div>
          ) : medicamentosFiltrados.map((med, index) => {
            const badge = getStatusBadge(med.status)
            const jaTomado = medicamentosTomados.includes(med.id)
            return (
              <div key={index} className={`med-row ${jaTomado ? 'med-row--taken' : ''}`}>
                <div className="med-row__icon">💊</div>
                <div className="med-row__info">
                  <span className="med-row__name">{med.nome}</span>
                  <span className="med-row__meta">{med.dosagem} · {med.horario} · {med.frequencia}</span>
                </div>
                <span className="badge" style={{backgroundColor: badge.color, flexShrink: 0}}>{badge.text}</span>
                <div className="med-row__actions">
                  {!jaTomado && med.status !== 'tomado' && (
                    <button className="btn-take" onClick={() => marcarComoTomado(med)}>✓ Tomado</button>
                  )}
                  <button className="btn-edit" onClick={() => handleEditMedicamento(med)} title="Editar">✏️</button>
                  <button className="btn-delete-small" onClick={() => handleDeleteMedicamento(med.id)} title="Excluir">🗑️</button>
                </div>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  const renderAdicionar = () => (
    <div className="adicionar-container">
      <div className="adicionar-header">
        <div className="header-content">
          <h1 className="page-title">✨ Adicionar Novo</h1>
          <p className="page-subtitle">Cadastre medicamentos e lembretes para manter sua saúde em dia</p>
        </div>
        <div className="header-stats">
          <div className="stat-mini">
            <span className="stat-number">{medicamentos.length}</span>
            <span className="stat-label">Medicamentos</span>
          </div>
          <div className="stat-mini">
            <span className="stat-number">{lembretes.length}</span>
            <span className="stat-label">Lembretes</span>
          </div>
        </div>
      </div>

      <div className="adicionar-grid">
        <div className="add-card medicamento-card">
          <div className="card-header-modern">
            <div className="card-icon-large">💊</div>
            <div className="card-title-section">
              <h3>Novo Medicamento</h3>
              <p>Adicione um medicamento à sua agenda</p>
            </div>
          </div>
          
          <div className="form-modern">
            <div className="input-group">
              <label>Nome do Medicamento</label>
              <input
                type="text"
                placeholder="Ex: Paracetamol, Dipirona..."
                value={novoMedicamento.nome}
                onChange={(e) => setNovoMedicamento({...novoMedicamento, nome: e.target.value})}
                className="input-modern"
                required
              />
            </div>
            
            <div className="input-row">
              <div className="input-group">
                <label>Dosagem</label>
                <input
                  type="text"
                  placeholder="Ex: 500mg, 1 comprimido"
                  value={novoMedicamento.dosagem}
                  onChange={(e) => setNovoMedicamento({...novoMedicamento, dosagem: e.target.value})}
                  className="input-modern"
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Horário</label>
                <input
                  type="time"
                  value={novoMedicamento.horario}
                  onChange={(e) => setNovoMedicamento({...novoMedicamento, horario: e.target.value})}
                  className="input-modern"
                  required
                />
              </div>
            </div>
            
            <div className="input-row">
              <div className="input-group">
                <label>Frequência</label>
                <select
                  value={novoMedicamento.frequencia}
                  onChange={(e) => setNovoMedicamento({...novoMedicamento, frequencia: e.target.value})}
                  className="select-modern"
                >
                  <option value="Diário">📅 Diário</option>
                  <option value="12h">🕐 A cada 12h</option>
                  <option value="8h">⏰ A cada 8h</option>
                  <option value="Semanal">📆 Semanal</option>
                </select>
              </div>
              
              <div className="input-group">
                <label>Duração do Tratamento</label>
                <select
                  value={novoMedicamento.duracao}
                  onChange={(e) => setNovoMedicamento({...novoMedicamento, duracao: e.target.value})}
                  className="select-modern"
                >
                  <option value="1 dia">1 dia</option>
                  <option value="3 dias">3 dias</option>
                  <option value="5 dias">5 dias</option>
                  <option value="1 semana">1 semana</option>
                  <option value="2 semanas">2 semanas</option>
                  <option value="1 mês">1 mês</option>
                  <option value="3 meses">3 meses</option>
                  <option value="6 meses">6 meses</option>
                  <option value="Contínuo">Contínuo</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={handleAddMedicamento}
              className="btn-add-modern medicamento"
              type="button"
            >
              <span className="btn-icon">💊</span>
              Adicionar Medicamento
            </button>
          </div>
        </div>

        <div className="add-card lembrete-card">
          <div className="card-header-modern">
            <div className="card-icon-large">🔔</div>
            <div className="card-title-section">
              <h3>Novo Lembrete</h3>
              <p>Crie lembretes importantes para sua saúde</p>
            </div>
          </div>
          
          <div className="form-modern">
            <div className="input-group">
              <label>Título do Lembrete</label>
              <input
                type="text"
                placeholder="Ex: Consulta médica, Exame de sangue..."
                value={novoLembrete.titulo}
                onChange={(e) => setNovoLembrete({...novoLembrete, titulo: e.target.value})}
                className="input-modern"
                required
              />
            </div>
            
            <div className="input-group">
              <label>Descrição (Opcional)</label>
              <textarea
                placeholder="Adicione detalhes sobre o lembrete..."
                value={novoLembrete.descricao}
                onChange={(e) => setNovoLembrete({...novoLembrete, descricao: e.target.value})}
                className="textarea-modern"
                rows="3"
              />
            </div>
            
            <div className="input-row">
              <div className="input-group">
                <label>Data</label>
                <input
                  type="date"
                  value={novoLembrete.data}
                  onChange={(e) => setNovoLembrete({...novoLembrete, data: e.target.value})}
                  className="input-modern"
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Horário</label>
                <input
                  type="time"
                  value={novoLembrete.horario}
                  onChange={(e) => setNovoLembrete({...novoLembrete, horario: e.target.value})}
                  className="input-modern"
                  required
                />
              </div>
            </div>
            
            <button 
              onClick={handleAddLembrete}
              className="btn-add-modern lembrete"
              type="button"
            >
              <span className="btn-icon">🔔</span>
              Adicionar Lembrete
            </button>
          </div>
        </div>
      </div>
      
      <div className="tips-section">
        <h3>💡 Dicas Importantes</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">⏰</span>
            <div>
              <h4>Horários Regulares</h4>
              <p>Mantenha sempre os mesmos horários para melhor eficácia</p>
            </div>
          </div>
          <div className="tip-card">
            <span className="tip-icon">📋</span>
            <div>
              <h4>Informações Completas</h4>
              <p>Preencha todos os campos para um controle mais preciso</p>
            </div>
          </div>
          <div className="tip-card">
            <span className="tip-icon">👨‍⚕️</span>
            <div>
              <h4>Orientação Médica</h4>
              <p>Sempre siga as orientações do seu médico</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const confirmarHistorico = async (id) => {
    try {
      const resp = await fetch(`http://localhost:8080/api/historico/${id}/confirmar`, { method: 'PATCH' })
      if (resp.ok) { showToastMessage('✅ Uso confirmado!'); carregarHistoricoCompleto() }
    } catch { showToastMessage('Erro ao confirmar') }
  }

  const ignorarHistorico = async (id) => {
    try {
      const resp = await fetch(`http://localhost:8080/api/historico/${id}/ignorar`, { method: 'PATCH' })
      if (resp.ok) { showToastMessage('Registro ignorado.'); carregarHistoricoCompleto() }
    } catch { showToastMessage('Erro ao ignorar') }
  }

  const renderHistorico = () => {
    const getStatusIcon = (status) => {
      switch(status) {
        case 'CONFIRMADO': return '✅'
        case 'IGNORADO': return '❌'
        case 'PENDENTE': return '⏳'
        default: return '📋'
      }
    }
    const getStatusColor = (status) => {
      switch(status) {
        case 'CONFIRMADO': return '#10b981'
        case 'IGNORADO': return '#ef4444'
        case 'PENDENTE': return '#f59e0b'
        default: return '#6b7280'
      }
    }
    return (
      <>
        <h2 className="section-title">Histórico de Medicamentos</h2>
        <div className="historico">
          {!Array.isArray(historicoCompleto) || historicoCompleto.length === 0 ? (
            <div className="card" style={{textAlign: 'center', padding: '40px', color: '#666'}}>
              <h3>📋 Nenhum histórico ainda</h3>
              <p>Marque medicamentos como tomados para ver o histórico aqui.</p>
            </div>
          ) : (
            historicoCompleto.map((item, index) => {
              const dataConfirmacao = item.dataConfirmacao ? new Date(item.dataConfirmacao) : null
              const hoje = new Date()
              const ontem = new Date(hoje); ontem.setDate(hoje.getDate() - 1)
              let dataTexto = dataConfirmacao ? dataConfirmacao.toLocaleDateString('pt-BR') : '—'
              if (dataConfirmacao) {
                if (dataConfirmacao.toDateString() === hoje.toDateString()) dataTexto = 'Hoje'
                else if (dataConfirmacao.toDateString() === ontem.toDateString()) dataTexto = 'Ontem'
              }
              return (
                <div key={index} className="card historico-item">
                  <div className="historico-header">
                    <div className="historico-icon" style={{backgroundColor: getStatusColor(item.status)}}>
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="historico-info">
                      <h4>{item.nome} {item.dosagem}</h4>
                      <span className="historico-acao">{item.status}</span>
                    </div>
                    <div className="historico-time">
                      <span>{dataTexto}</span>
                      {dataConfirmacao && <span>{dataConfirmacao.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>}
                    </div>
                  </div>
                  {item.status === 'PENDENTE' && (
                    <div style={{display: 'flex', gap: '8px', marginTop: '10px'}}>
                      <button onClick={() => confirmarHistorico(item.id)} style={{flex: 1, padding: '8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>✅ Confirmar</button>
                      <button onClick={() => ignorarHistorico(item.id)} style={{flex: 1, padding: '8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>❌ Ignorar</button>
                    </div>
                  )}
                  {item.observacoes && <div className="historico-detalhes"><p>{item.observacoes}</p></div>}
                </div>
              )
            })
          )}
        </div>
      </>
    )
  }



  const handleSavePerfil = async (e) => {
    e.preventDefault()
    
    try {
      const userId = sessionStorage.getItem('userId')
      const response = await fetch(`http://localhost:8080/api/usuarios/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: perfil.nome,
          senha: perfil.senha === '******' ? undefined : perfil.senha,
          email: perfil.email,
          idade: perfil.idade,
          comorbidade: perfil.comorbidade
        })
      })
      
      if (response.ok) {
        sessionStorage.setItem('userName', perfil.nome)
        sessionStorage.setItem('userEmail', perfil.email)
        
        // Salvar no localStorage como backup
        localStorage.setItem('perfilUsuario', JSON.stringify({
          nome: perfil.nome,
          email: perfil.email,
          idade: perfil.idade,
          comorbidade: perfil.comorbidade
        }))
        
        showToastMessage('✅ Perfil atualizado com sucesso!')
        setShowProfileModal(false)
      } else {
        throw new Error('Erro no backend')
      }
    } catch (error) {
      // Fallback para localStorage
      sessionStorage.setItem('userName', perfil.nome)
      sessionStorage.setItem('userEmail', perfil.email)
      
      // Salvar todos os dados no localStorage
      localStorage.setItem('perfilUsuario', JSON.stringify({
        nome: perfil.nome,
        email: perfil.email,
        idade: perfil.idade,
        comorbidade: perfil.comorbidade
      }))
      
      // Atualizar também o array de usuários cadastrados
      const usuariosCadastrados = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]')
      const index = usuariosCadastrados.findIndex(u => u.nome === perfil.nome || u.email === perfil.email)
      if (index !== -1) {
        usuariosCadastrados[index] = {
          ...usuariosCadastrados[index],
          nome: perfil.nome,
          email: perfil.email,
          idade: perfil.idade,
          comorbidade: perfil.comorbidade
        }
        localStorage.setItem('usuariosCadastrados', JSON.stringify(usuariosCadastrados))
      }
      
      showToastMessage('✅ Perfil atualizado com sucesso!')
      setShowProfileModal(false)
    }
  }

  const hashSenha = async (senha) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(senha)
    const hash = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hash))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const handleSaveProfileEdit = async (e) => {
    e.preventDefault()
    
    if (!editProfile.nome || !editProfile.senhaAtual || !editProfile.novaSenha) {
      showToastMessage('⚠️ Preencha todos os campos!')
      return
    }
    
    try {
      const userId = sessionStorage.getItem('userId')
      const response = await fetch(`http://localhost:8080/api/usuarios/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          nome: editProfile.nome,
          senhaAtual: editProfile.senhaAtual,
          novaSenha: editProfile.novaSenha
        })
      })
      
      if (response.ok) {
        sessionStorage.setItem('userName', editProfile.nome)
        setPerfil({...perfil, nome: editProfile.nome})
        showToastMessage('✅ Nome e senha atualizados com sucesso!')
        setShowEditProfileModal(false)
        setEditProfile({ nome: '', senhaAtual: '', novaSenha: '' })
      } else {
        const errorData = await response.json()
        showToastMessage(errorData.erro || 'Senha atual incorreta')
      }
    } catch (error) {
      // Fallback para localStorage
      const usuariosCadastrados = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]')
      const currentUser = sessionStorage.getItem('userName')
      const userIndex = usuariosCadastrados.findIndex(u => u.nome === currentUser)
      
      if (userIndex !== -1) {
        const user = usuariosCadastrados[userIndex]
        const senhaAtualHash = await hashSenha(editProfile.senhaAtual)
        const novaSenhaHash = await hashSenha(editProfile.novaSenha)
        
        if (user.senha === senhaAtualHash || user.senha === editProfile.senhaAtual) {
          usuariosCadastrados[userIndex] = {
            ...user,
            nome: editProfile.nome,
            senha: novaSenhaHash
          }
          localStorage.setItem('usuariosCadastrados', JSON.stringify(usuariosCadastrados))
          sessionStorage.setItem('userName', editProfile.nome)
          setPerfil({...perfil, nome: editProfile.nome})
          showToastMessage('✅ Nome e senha atualizados com sucesso!')
          setShowEditProfileModal(false)
          setEditProfile({ nome: '', senhaAtual: '', novaSenha: '' })
        } else {
          showToastMessage('⚠️ Senha atual incorreta!')
        }
      } else {
        showToastMessage('⚠️ Usuário não encontrado!')
      }
    }
  }

  const handleDeleteAccount = async (e) => {
    e.preventDefault()
    
    if (!deleteAccountData.senhaAtual) {
      showToastMessage('⚠️ Digite sua senha para confirmar!')
      return
    }
    
    if (!window.confirm('⚠️ ATENÇÃO: Esta ação é irreversível! Todos os seus dados serão perdidos permanentemente. Tem certeza que deseja excluir sua conta?')) {
      return
    }
    
    try {
      const userId = sessionStorage.getItem('userId')
      console.log("userId:", userId)
      const response = await fetch(`http://localhost:8080/api/usuarios/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          senhaAtual: deleteAccountData.senhaAtual
        })
      })
      
      if (response.ok) {
        showToastMessage('✅ Conta excluída com sucesso!')
        setTimeout(() => {
          sessionStorage.clear()
          localStorage.removeItem('medicamentos')
          localStorage.removeItem('medicamentosTomados')
          localStorage.removeItem('lembretes')
          localStorage.removeItem('perfilUsuario')
          onLogout()
           window.location.href = '/cadastro'
        }, 2000)
      } else {
        const errorData = await response.json()
        showToastMessage(errorData.erro || 'Senha incorreta')
      }
    } catch (error) {
      // Fallback para localStorage
      const usuariosCadastrados = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]')
      const currentUser = sessionStorage.getItem('userName')
      const userIndex = usuariosCadastrados.findIndex(u => u.nome === currentUser)
      
      if (userIndex !== -1) {
        const user = usuariosCadastrados[userIndex]
        const senhaAtualHash = await hashSenha(deleteAccountData.senhaAtual)
        
        if (user.senha === senhaAtualHash || user.senha === deleteAccountData.senhaAtual) {
          // Remover usuário do localStorage
          usuariosCadastrados.splice(userIndex, 1)
          localStorage.setItem('usuariosCadastrados', JSON.stringify(usuariosCadastrados))
          
          showToastMessage('✅ Conta excluída com sucesso!')
          setTimeout(() => {
            sessionStorage.clear()
            localStorage.removeItem('medicamentos')
            localStorage.removeItem('medicamentosTomados')
            localStorage.removeItem('lembretes')
            localStorage.removeItem('perfilUsuario')
            onLogout()
          }, 2000)
        } else {
          showToastMessage('⚠️ Senha incorreta!')
        }
      } else {
        showToastMessage('⚠️ Usuário não encontrado!')
      }
    }
  }

  const renderConfiguracoes = () => (
    <>
      <h2 className="section-title">Configurações</h2>
      <div className="configuracoes">
        <div className="card">

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
          <label>
            <input 
              type="checkbox" 
              checked={accessibilityMode}
              onChange={toggleAccessibilityMode}
            />
            Modo de Acessibilidade (Letras Grandes)
          </label>

        </div>
        <div className="card">
          <h4>Perfil</h4>
          <div className="perfil-info">
            <div className="item">
              <span>Nome:</span>
              <span>{perfil.nome || 'Carregando...'}</span>
            </div>
            <div className="item">
              <span>Email:</span>
              <span>{perfil.email || 'Não informado'}</span>
            </div>
            <div className="item">
              <span>Idade:</span>
              <span>{perfil.idade || 'Não informado'}</span>
            </div>
            <div className="item">
              <span>Comorbidade:</span>
              <span>{perfil.comorbidade || 'Nenhuma'}</span>
            </div>
            <div className="item">
              <span>Senha:</span>
              <span>******</span>
            </div>
          </div>
          <button 
            onClick={() => {
              setEditProfile({
                nome: perfil.nome,
                senhaAtual: '',
                novaSenha: ''
              })
              setShowEditProfileModal(true)
            }}
            style={{
              width: '100%',
              marginTop: '15px',
              padding: '12px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            ✏️ Editar Senha e Nome
          </button>
          <button 
            onClick={() => {
              setDeleteAccountData({ senhaAtual: '' })
              setShowDeleteAccountModal(true)
            }}
            style={{
              width: '100%',
              marginTop: '10px',
              padding: '12px 20px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            🗑️ Excluir Conta
          </button>
          

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
                type="email"
                placeholder="Email"
                value={perfil.email}
                onChange={(e) => setPerfil({...perfil, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Nova senha (deixe vazio para manter atual)"
                value={perfil.senha === '******' ? '' : perfil.senha}
                onChange={(e) => setPerfil({...perfil, senha: e.target.value})}
              />
              <input
                type="number"
                placeholder="Idade"
                value={perfil.idade}
                onChange={(e) => setPerfil({...perfil, idade: e.target.value})}
              />
              <input
                type="text"
                placeholder="Comorbidade (opcional)"
                value={perfil.comorbidade}
                onChange={(e) => setPerfil({...perfil, comorbidade: e.target.value})}
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
                value={editMedicamento.observacao || ''}
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
      
      {showEditProfileModal && (
        <div className="modal-overlay" onClick={() => setShowEditProfileModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>✏️ Editar Senha e Nome</h3>
            <form onSubmit={handleSaveProfileEdit} className="profile-form">
              <input
                type="text"
                placeholder="Novo nome"
                value={editProfile.nome}
                onChange={(e) => setEditProfile({...editProfile, nome: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Senha atual"
                value={editProfile.senhaAtual}
                onChange={(e) => setEditProfile({...editProfile, senhaAtual: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Nova senha"
                value={editProfile.novaSenha}
                onChange={(e) => setEditProfile({...editProfile, novaSenha: e.target.value})}
                required
              />
              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={() => setShowEditProfileModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Atualizar</button>
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

      'configuracoes': 'PharmaLife - Configurações',
      'ajuda': 'PharmaLife - Ajuda'
    }
    document.title = titles[activeSection] || 'PharmaLife'
  }, [activeSection])

  const [adminData, setAdminData] = useState({ usuarios: [], estatisticas: {} })

  const carregarDadosAdmin = async () => {
    try {
      const response = await fetch('http://localhost:8080/admin/usuarios')
      if (response.ok) {
        const usuarios = await response.json()
        const agora = new Date()
        const novos = usuarios.filter(u => {
          const cadastro = new Date(u.dataCadastro || u.createdAt)
          const diasDiff = (agora - cadastro) / (1000 * 60 * 60 * 24)
          return diasDiff <= 7
        }).length
        
        setAdminData({
          usuarios,
          estatisticas: {
            total: usuarios.length,
            novos,
            comSenha: usuarios.filter(u => u.senha && u.senha !== '').length
          }
        })
      } else {
        throw new Error('Backend não disponível')
      }
    } catch (error) {
      // Fallback para localStorage
      const usuariosCadastrados = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]')
      setAdminData({
        usuarios: usuariosCadastrados,
        estatisticas: {
          total: usuariosCadastrados.length,
          novos: 0,
          comSenha: usuariosCadastrados.filter(u => u.senha).length
        }
      })
    }
  }

  useEffect(() => {
    if (activeSection === 'admin') {
      carregarDadosAdmin()
    }
  }, [activeSection])

  const renderAdmin = () => (
    <>
      <h2 className="section-title">Painel Administrativo</h2>
        <div className="admin-panel">
          <div className="card">
            <h3>👥 Usuários Cadastrados ({adminData.usuarios.length})</h3>
            <div className="usuarios-list">
              <div className="usuario-item header">
                <span>Nome</span>
                <span>Email</span>
                <span>Data Cadastro</span>
                <span>Senha</span>
              </div>
              {adminData.usuarios.length === 0 ? (
                <div className="usuario-item">
                  <span colSpan="4" style={{textAlign: 'center', color: '#666'}}>Nenhum usuário cadastrado ainda</span>
                </div>
              ) : (
                adminData.usuarios.map((usuario, index) => (
                  <div key={index} className="usuario-item">
                    <span>{usuario.nome}</span>
                    <span>{usuario.email}</span>
                    <span>{new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')}</span>
                    <span>{usuario.senha || '******'}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="card">
            <h3>📊 Estatísticas</h3>
            <div className="item">
              <span>Total de usuários:</span>
              <span>{adminData.estatisticas.total || 0}</span>
            </div>
            <div className="item">
              <span>Novos cadastros (7 dias):</span>
              <span>{adminData.estatisticas.novos || 0}</span>
            </div>
            <div className="item">
              <span>Usuários com senha definida:</span>
              <span>{adminData.estatisticas.comSenha || 0}</span>
            </div>
          </div>
        </div>
      </>
    )

  const renderContent = () => {
    switch(activeSection) {
      case 'agenda': return renderAgenda()
      case 'historico': return renderHistorico()
      case 'configuracoes': return renderConfiguracoes()
      case 'adicionar': return renderAdicionar()
      case 'sobre': return <Sobre />
      case 'admin': return renderAdmin()
      default: return renderDashboard()
    }
  }

  return (
    <div className={`home-container ${darkMode ? 'dark-mode' : ''} ${accessibilityMode ? 'accessibility-mode' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">💊</div>
            <h1>PharmaLife</h1>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <button 
              className="accessibility-toggle"
              onClick={toggleAccessibilityMode}
              title={accessibilityMode ? 'Desativar modo de acessibilidade' : 'Ativar modo de acessibilidade - Letras maiores'}
            >
              {accessibilityMode ? '🔍 Normal' : '🔍 Grande'}
            </button>
            <button 
              onClick={() => {
                setEditProfile({
                  nome: perfil.nome,
                  senhaAtual: '',
                  novaSenha: ''
                })
                setShowEditProfileModal(true)
              }}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: 'white',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}
            >
              ✏️ Editar
            </button>
            <button 
              onClick={() => {
                setDeleteAccountData({ senhaAtual: '' })
                setShowDeleteAccountModal(true)
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: 'white',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}
            >
              🗑️ Excluir
            </button>
            <button 
              onClick={onLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: 'white',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}
            >
              🚪 Sair
            </button>
          </div>
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
            className={activeSection === 'adicionar' ? 'active' : ''} 
            onClick={() => setActiveSection('adicionar')}
          >
            Adicionar
          </button>
          <button 
            className={activeSection === 'historico' ? 'active' : ''} 
            onClick={() => setActiveSection('historico')}
          >
            Histórico
          </button>

          <button 
            className={activeSection === 'configuracoes' ? 'active' : ''} 
            onClick={() => setActiveSection('configuracoes')}
          >
            Configurações
          </button>
          <button 
            className={activeSection === 'sobre' ? 'active' : ''} 
            onClick={() => setActiveSection('sobre')}
          >
            Sobre Nós
          </button>
          {isAdmin && (
            <button 
              className={activeSection === 'admin' ? 'active' : ''} 
              onClick={() => setActiveSection('admin')}
            >
              Admin
            </button>
          )}
        </nav>
      </aside>
      
      <main className="main-content">
        {renderContent()}
        {showToast && (
          <div className="toast">
            {toastMessage}
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
                  value={editMedicamento.observacao || ''}
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
        
        {showEditProfileModal && (
          <div className="modal-overlay" onClick={() => setShowEditProfileModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>✏️ Editar Senha e Nome</h3>
              <form onSubmit={handleSaveProfileEdit} className="profile-form">
                <input
                  type="text"
                  placeholder="Novo nome"
                  value={editProfile.nome}
                  onChange={(e) => setEditProfile({...editProfile, nome: e.target.value})}
                  required
                />
                <input
                  type="password"
                  placeholder="Senha atual"
                  value={editProfile.senhaAtual}
                  onChange={(e) => setEditProfile({...editProfile, senhaAtual: e.target.value})}
                  required
                />
                <input
                  type="password"
                  placeholder="Nova senha"
                  value={editProfile.novaSenha}
                  onChange={(e) => setEditProfile({...editProfile, novaSenha: e.target.value})}
                  required
                />
                <div className="modal-buttons">
                  <button type="button" className="btn-cancel" onClick={() => setShowEditProfileModal(false)}>Cancelar</button>
                  <button type="submit" className="btn-save">Atualizar</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {showDeleteAccountModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteAccountModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3 style={{color: '#ef4444'}}>🗑️ Excluir Conta</h3>
              <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px'}}>
                <p style={{color: '#dc2626', fontWeight: '600', margin: '0 0 10px 0'}}>⚠️ ATENÇÃO:</p>
                <p style={{color: '#7f1d1d', margin: '0', fontSize: '14px'}}>Esta ação é irreversível! Todos os seus medicamentos, histórico e dados pessoais serão perdidos permanentemente.</p>
              </div>
              <form onSubmit={handleDeleteAccount} className="profile-form">
                <input
                  type="password"
                  placeholder="Digite sua senha atual para confirmar"
                  value={deleteAccountData.senhaAtual}
                  onChange={(e) => setDeleteAccountData({...deleteAccountData, senhaAtual: e.target.value})}
                  required
                  style={{borderColor: '#ef4444'}}
                />
                <div className="modal-buttons">
                  <button type="button" className="btn-cancel" onClick={() => setShowDeleteAccountModal(false)}>Cancelar</button>
                  <button type="submit" className="btn-delete" style={{backgroundColor: '#ef4444'}}>Excluir Conta</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Home