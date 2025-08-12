import './Sobre.css'

function Sobre() {
  const integrantes = [
    { nome: 'Maycon', papel: 'Desenvolvedor' },
    { nome: 'Adriel', papel: 'Desenvolvedor' },
    { nome: 'Felipe', papel: 'Desenvolvedor' },
    { nome: 'Caio', papel: 'Desenvolvedor' },
    { nome: 'Murilo', papel: 'Desenvolvedor' }
  ]

  return (
    <div className="sobre-container">
      <div className="sobre-content">
        <div className="sobre-header">
          <h1>Sobre Nós</h1>
          <div className="logo-sobre">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H19V9Z" fill="#1976d2"/>
            </svg>
          </div>
        </div>

        <div className="projeto-info">
          <h2>Sobre o Projeto</h2>
          <p>
            O <strong>PharmaLife</strong> é um projeto desenvolvido como Trabalho de Conclusão de Curso (TCC) 
            com o objetivo de criar uma solução digital inovadora para o gerenciamento de medicamentos.
          </p>
          <p>
            Nossa plataforma foi desenvolvida para auxiliar usuários no controle de seus medicamentos, 
            oferecendo funcionalidades como agenda de horários, histórico de medicamentos, localização 
            de farmácias próximas e lembretes personalizados.
          </p>
          <p>
            O projeto visa melhorar a adesão ao tratamento medicamentoso e proporcionar maior qualidade 
            de vida aos usuários através de uma interface intuitiva e moderna.
          </p>
        </div>

        <div className="equipe-info">
          <h2>Nossa Equipe</h2>
          <div className="integrantes-grid">
            {integrantes.map((integrante, index) => (
              <div key={index} className="integrante-card">
                <div className="integrante-avatar">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#666"/>
                  </svg>
                </div>
                <h3>{integrante.nome}</h3>
                <p>{integrante.papel}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="tecnologias">
          <h2>Tecnologias Utilizadas</h2>
          <div className="tech-list">
            <span className="tech-item">React</span>
            <span className="tech-item">JavaScript</span>
            <span className="tech-item">CSS3</span>
            <span className="tech-item">HTML5</span>
            <span className="tech-item">Vite</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sobre