import { Link } from 'react-router-dom'
import { FiThermometer, FiDroplet, FiSun, FiHash, FiActivity, FiCpu } from 'react-icons/fi'
import Sidebar from '../components/Sidebar'
import '../styles/layout.css'
import '../styles/home.css'

function Home() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header home-header">
          <div>
            <span className="home-badge">Sistema Inteligente</span>
            <h1>Painel Smart City</h1>
            <p>Monitoramento centralizado dos sensores da escola em um ambiente moderno e organizado.</p>
          </div>

          <div className="home-header-box">
            <FiActivity />
            <div>
              <strong>Monitoramento Ativo</strong>
              <span>Visualize os dados por categoria de sensor</span>
            </div>
          </div>
        </div>

        <section className="home-summary">
          <div className="summary-card">
            <div className="summary-icon cyan">
              <FiCpu />
            </div>
            <div>
              <span>Sistema</span>
              <h3>Online</h3>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon blue">
              <FiActivity />
            </div>
            <div>
              <span>Status</span>
              <h3>Em operação</h3>
            </div>
          </div>
        </section>

        <div className="home-grid">
          <Link to="/temperatura" className="home-card temperatura">
            <div className="home-card-top">
              <div className="home-card-icon">
                <FiThermometer />
              </div>
              <span className="home-card-tag">Sensor</span>
            </div>

            <h3>Temperatura</h3>
            <p>Visualize sensores e medições relacionadas ao monitoramento térmico dos ambientes.</p>

            <div className="home-card-footer">
              <span>Acessar dados</span>
            </div>
          </Link>

          <Link to="/umidade" className="home-card umidade">
            <div className="home-card-top">
              <div className="home-card-icon">
                <FiDroplet />
              </div>
              <span className="home-card-tag">Sensor</span>
            </div>

            <h3>Umidade</h3>
            <p>Consulte a umidade e acompanhe o comportamento dos sensores cadastrados.</p>

            <div className="home-card-footer">
              <span>Acessar dados</span>
            </div>
          </Link>

          <Link to="/luminosidade" className="home-card luminosidade">
            <div className="home-card-top">
              <div className="home-card-icon">
                <FiSun />
              </div>
              <span className="home-card-tag">Sensor</span>
            </div>

            <h3>Luminosidade</h3>
            <p>Veja dados de incidência luminosa e monitore os pontos de leitura distribuídos na escola.</p>

            <div className="home-card-footer">
              <span>Acessar dados</span>
            </div>
          </Link>

          <Link to="/contador" className="home-card contador">
            <div className="home-card-top">
              <div className="home-card-icon">
                <FiHash />
              </div>
              <span className="home-card-tag">Sensor</span>
            </div>

            <h3>Contador</h3>
            <p>Acompanhe os registros do sensor contador e verifique a movimentação monitorada.</p>

            <div className="home-card-footer">
              <span>Acessar dados</span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home