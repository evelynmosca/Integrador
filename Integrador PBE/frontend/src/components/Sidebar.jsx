import { NavLink, useNavigate } from 'react-router-dom'
import {
  FiHome,
  FiThermometer,
  FiDroplet,
  FiSun,
  FiHash,
  FiMapPin,
  FiPlusCircle,
  FiLogOut,
  FiClock
} from 'react-icons/fi'

function Sidebar() {
  const navigate = useNavigate()

  const usuario = JSON.parse(localStorage.getItem('usuario'))

  const sair = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>SmartCity</h2>
        <span>Sensor Manager</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/home"><FiHome /> Home</NavLink>
        <NavLink to="/temperatura"><FiThermometer /> Temperatura</NavLink>
        <NavLink to="/umidade"><FiDroplet /> Umidade</NavLink>
        <NavLink to="/luminosidade"><FiSun /> Luminosidade</NavLink>
        <NavLink to="/contador"><FiHash /> Contador</NavLink>
        <NavLink to="/ambientes"><FiMapPin /> Ambientes</NavLink>

        {usuario?.is_staff && (
          <NavLink to="/cadastro-sensor">
            <FiPlusCircle /> Cadastro de Sensor
          </NavLink>
        )}

        <NavLink to="/historico"><FiClock /> Histórico</NavLink>
      </nav>

      <button className="logout-btn" onClick={sair}>
        <FiLogOut /> Sair
      </button>
    </aside>
  )
}

export default Sidebar