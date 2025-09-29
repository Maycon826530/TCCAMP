import { useState, useEffect } from 'react'
import './Home.css'
import './Accessibility.css'
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

  const marcarComoTomado = async (medicamentoId) => {
    try {
      const usuarioId = sessionStorage.getItem('userId') || 1
      const response = await fetch('http://localhost:8080/medicamentos/marcar-tomado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicamentoId, usuarioId })
      })
      
      if (response.ok) {
        setMedicamentosTomados([...medicamentosTomados, medicamentoId])
        showToastMessage('✅ Medicamento marcado como tomado!')
        carregarHistoricoCompleto()
        carregarEstatisticas()
        carregarHistoricoRecente()
      }
    } catch (error) {
      // Fallback para localStorage
      const medicamentosTomadosLocal = JSON.parse(localStorage.getItem('medicamentosTomados') || '[]')
      const novoTomado = {
        medicamentoId,
        dataHora: new Date().toISOString(),
        usuario: sessionStorage.getItem('userName')
      }
      medicamentosTomadosLocal.push(novoTomado)
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
          nome: medicamento ? `${medicamento.nome} ${medicamento.dosagem}` : 'Medicamento',
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
      if (!usuarioId) {
        usuarioId = 1 // ID padrão para testes
        sessionStorage.setItem('userId', usuarioId)
      }
      
      const response = await fetch(`http://localhost:8080/medicamentos/usuario/${usuarioId}`)
      if (response.ok) {
        const medicamentosBackend = await response.json()
        setMedicamentos(medicamentosBackend)
        // Sincronizar com localStorage
        localStorage.setItem('medicamentos', JSON.stringify(medicamentosBackend))
      } else {
        throw new Error('Backend não disponível')
      }
    } catch (error) {
      console.log('Usando localStorage como fallback')
      // Fallback para localStorage
      const medicamentosExistentes = JSON.parse(localStorage.getItem('medicamentos') || '[]')
      const medicamentosUsuario = medicamentosExistentes.filter(med => med.usuario === userName)
      setMedicamentos(medicamentosUsuario)
    }
    setLoading(false)
  }
  
  useEffect(() => {
    carregarMedicamentos()
  }, [])
  
  const agendaMedicamentos = medicamentos.map(med => ({
    ...med,
    horario: med.horario,
    status: 'próximo'
  }))

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
        <div className="dashboard-grid">
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
                          onClick={() => marcarComoTomado(med.id)}
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
        if (!usuarioId) {
          usuarioId = 1
          sessionStorage.setItem('userId', usuarioId)
        }
        
        const response = await fetch('http://localhost:8080/medicamentos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...novoMedicamento, usuarioId: parseInt(usuarioId) })
        })
        
        if (response.ok) {
          showToastMessage('✨ Medicamento adicionado com sucesso!')
          setNovoMedicamento({ nome: '', dosagem: '', horario: '', frequencia: 'Diário', duracao: '1 semana' })
          await carregarMedicamentos()
          carregarHistoricoCompleto()
        } else {
          throw new Error('Erro no backend')
        }
      } catch (error) {
        console.log('Usando localStorage para adição')
        // Fallback para localStorage
        const medicamentosExistentes = JSON.parse(localStorage.getItem('medicamentos') || '[]')
        const novoMed = {
          id: Date.now(),
          ...novoMedicamento,
          usuario: sessionStorage.getItem('userName')
        }
        medicamentosExistentes.push(novoMed)
        localStorage.setItem('medicamentos', JSON.stringify(medicamentosExistentes))
        
        showToastMessage('✨ Medicamento adicionado com sucesso!')
        setNovoMedicamento({ nome: '', dosagem: '', horario: '', frequencia: 'Diário', duracao: '1 semana' })
        await carregarMedicamentos()
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
      if (!usuarioId) {
        usuarioId = 1
        sessionStorage.setItem('userId', usuarioId)
      }
      
      const response = await fetch(`http://localhost:8080/historico/usuario/${usuarioId}`)
      if (response.ok) {
        const historico = await response.json()
        setHistoricoCompleto(historico)
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
      const historicoLocal = [...historicoTomados, ...historicoExcluidos]
        .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
      
      setHistoricoCompleto(historicoLocal)
    }
  }
  
  const carregarPerfilUsuario = async () => {
    try {
      const userId = sessionStorage.getItem('userId')
      if (userId) {
        const response = await fetch(`http://localhost:8080/usuarios/${userId}`)
        if (response.ok) {
          const usuario = await response.json()
          setPerfil({
            nome: usuario.nome,
            senha: '******',
            email: usuario.email,
            idade: usuario.idade || '',
            comorbidade: usuario.comorbidade || ''
          })
          return
        }
      }
    } catch (error) {
      console.log('Usando dados do sessionStorage')
    }
    
    // Fallback para sessionStorage
    const userName = sessionStorage.getItem('userName')
    const userEmail = sessionStorage.getItem('userEmail')
    
    if (userName) {
      setPerfil({
        nome: userName,
        senha: '******',
        email: userEmail || '',
        idade: '',
        comorbidade: ''
      })
    }
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
      dosagem: med.dosagem,
      horario: med.horario,
      frequencia: med.frequencia,
      observacao: med.observacao
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:8080/medicamentos/${editingMed.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editMedicamento)
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
        const response = await fetch(`http://localhost:8080/medicamentos/${medId}`, {
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
        // Fallback para localStorage
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
        const response = await fetch(`http://localhost:8080/medicamentos/${editingMed.id}`, {
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
            <h3>💊 Adicionar Medicamento</h3>
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
            <h3>📝 Adicionar Lembrete</h3>
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


      </div>
    </>
  )

  const renderHistorico = () => {
    const getAcaoIcon = (acao) => {
      switch(acao) {
        case 'ADICIONADO': return '➕'
        case 'EDITADO': return '✏️'
        case 'EXCLUIDO': return '🗑️'
        case 'TOMADO': return '✅'
        default: return '📋'
      }
    }
    
    const getAcaoColor = (acao) => {
      switch(acao) {
        case 'ADICIONADO': return '#10b981'
        case 'EDITADO': return '#f59e0b'
        case 'EXCLUIDO': return '#ef4444'
        case 'TOMADO': return '#3b82f6'
        default: return '#6b7280'
      }
    }
    
    return (
      <>
        <h2 className="section-title">Histórico de Medicamentos</h2>
        <div className="historico">
          {historicoCompleto.length === 0 ? (
            <div className="card" style={{textAlign: 'center', padding: '40px', color: '#666'}}>
              <h3>📋 Nenhum histórico ainda</h3>
              <p>Quando você adicionar, editar, excluir ou tomar medicamentos, o histórico aparecerá aqui.</p>
            </div>
          ) : (
            historicoCompleto.map((item, index) => {
              const dataHora = new Date(item.dataHora)
              const hoje = new Date()
              const ontem = new Date(hoje)
              ontem.setDate(hoje.getDate() - 1)
              
              let dataTexto = dataHora.toLocaleDateString('pt-BR')
              if (dataHora.toDateString() === hoje.toDateString()) {
                dataTexto = 'Hoje'
              } else if (dataHora.toDateString() === ontem.toDateString()) {
                dataTexto = 'Ontem'
              }
              
              return (
                <div key={index} className="card historico-item">
                  <div className="historico-header">
                    <div className="historico-icon" style={{backgroundColor: getAcaoColor(item.acao)}}>
                      {getAcaoIcon(item.acao)}
                    </div>
                    <div className="historico-info">
                      <h4>{item.nomeMedicamento} {item.dosagem}</h4>
                      <span className="historico-acao">{item.acao}</span>
                    </div>
                    <div className="historico-time">
                      <span>{dataTexto}</span>
                      <span>{dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  {item.detalhes && (
                    <div className="historico-detalhes">
                      <p>{item.detalhes}</p>
                    </div>
                  )}
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
      const response = await fetch(`http://localhost:8080/usuarios/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: perfil.nome,
          senha: perfil.senha,
          email: perfil.email,
          idade: perfil.idade,
          comorbidade: perfil.comorbidade
        })
      })
      
      if (response.ok) {
        sessionStorage.setItem('userName', perfil.nome)
        sessionStorage.setItem('userEmail', perfil.email)
        showToastMessage('✅ Perfil atualizado com sucesso!')
        setShowProfileModal(false)
      } else {
        throw new Error('Erro no backend')
      }
    } catch (error) {
      // Fallback para localStorage
      sessionStorage.setItem('userName', perfil.nome)
      sessionStorage.setItem('userEmail', perfil.email)
      showToastMessage('✅ Perfil atualizado com sucesso!')
      setShowProfileModal(false)
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
      case 'ajuda': return renderAjuda()
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
          <button 
            className="accessibility-toggle"
            onClick={toggleAccessibilityMode}
            title={accessibilityMode ? 'Desativar modo de acessibilidade' : 'Ativar modo de acessibilidade - Letras maiores'}
          >
            {accessibilityMode ? '🔍 Normal' : '🔍 Grande'}
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
      </main>
    </div>
  )
}

export default Home