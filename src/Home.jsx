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

          <h2 className="greeting-text">{saudacao}</h2>
        </div>
        <div className="dashboard">
          <div className="dashboard-main">
            <div className="card urgent-card">

            <h3>💊 Próximos Medicamentos</h3>
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
                  <span className="badge" style={{backgroundColor: '#3b82f6'}}>Próximo</span>
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

            <h3>📝 Lembretes</h3>
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

  const renderContent = () => {
    switch(activeSection) {
      case 'agenda': return renderAgenda()
      case 'historico': return renderHistorico()

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