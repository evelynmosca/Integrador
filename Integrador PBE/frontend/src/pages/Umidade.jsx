import { useEffect, useMemo, useState } from 'react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import api from '../services/api'
import '../styles/layout.css'
import '../styles/table.css'

function Umidade() {
  const [sensores, setSensores] = useState([])
  const [ambientes, setAmbientes] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [sensorEditando, setSensorEditando] = useState(null)

  const usuario = JSON.parse(localStorage.getItem('usuario'))

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resSensores, resAmbientes] = await Promise.all([
          api.get('sensores/'),
          api.get('ambientes/')
        ])

        const filtrados = resSensores.data.filter(
          (item) => item.sensor?.toLowerCase() === 'umidade'
        )

        setSensores(filtrados)
        setAmbientes(resAmbientes.data)
      } catch (error) {
        console.log(error)
      }
    }

    carregarDados()
  }, [])

  const abrirModal = (sensor) => {
    setSensorEditando({ ...sensor })
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setSensorEditando(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setSensorEditando({
      ...sensorEditando,
      [name]:
        name === 'status'
          ? value === 'true'
          : name === 'ambiente'
            ? Number(value)
            : value
    })
  }

  const salvarEdicao = async () => {
    try {
      const payload = {
        status: sensorEditando.status,
        ambiente: Number(sensorEditando.ambiente)
      }

      const response = await api.patch(`sensores/${sensorEditando.id}/`, payload)

      setSensores(
        sensores.map((sensor) =>
          sensor.id === sensorEditando.id ? response.data : sensor
        )
      )

      alert('Sensor atualizado com sucesso!')
      fecharModal()
    } catch (error) {
      console.log(error)
      console.log(error.response?.data)
      alert('Erro ao editar sensor.')
    }
  }

  const excluirSensor = async (id) => {
    const confirmar = window.confirm('Deseja realmente excluir este sensor?')
    if (!confirmar) return

    try {
      await api.delete(`sensores/${id}/`)
      setSensores(sensores.filter((sensor) => sensor.id !== id))
      alert('Sensor excluído com sucesso!')
    } catch (error) {
      console.log(error)
      alert('Erro ao excluir sensor.')
    }
  }

  const media = useMemo(() => {
    return sensores.length ? `${sensores.length}` : '0'
  }, [sensores])

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <h1>Sensores de Umidade</h1>
          <p>Monitoramento em tempo real</p>
        </div>

        <div className="cards-grid">
          <StatCard titulo="Total" valor={media} detalhe="sensores encontrados" />
          <StatCard titulo="Ativos" valor={sensores.filter(s => s.status).length} />
          <StatCard titulo="Inativos" valor={sensores.filter(s => !s.status).length} />
        </div>

        <div className="page-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sensor</th>
                <th>Identificação</th>
                <th>Unidade</th>
                <th>Ambiente</th>
                <th>Status</th>
                {usuario?.is_staff && <th>Ações</th>}
              </tr>
            </thead>

            <tbody>
              {sensores.map((sensor) => (
                <tr key={sensor.id}>
                  <td>{sensor.id}</td>
                  <td>{sensor.sensor}</td>
                  <td>{sensor.identificacao}</td>
                  <td>{sensor.unidade_med}</td>
                  <td>{sensor.ambiente}</td>
                  <td>
                    <span className={`status-badge ${sensor.status ? 'status-ativo' : 'status-inativo'}`}>
                      {sensor.status ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>

                  {usuario?.is_staff && (
                    <td className="actions-cell">
                      <button type="button" className="action-btn edit-btn" onClick={() => abrirModal(sensor)} title="Editar">
                        <FiEdit2 />
                      </button>

                      <button type="button" className="action-btn delete-btn" onClick={() => excluirSensor(sensor.id)} title="Excluir">
                        <FiTrash2 />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalAberto && sensorEditando && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Editar Sensor</h2>
              <p className="modal-subtitle">
                Atualize as informações do sensor selecionado.
              </p>

              <div className="form-group">
                <label>Identificação</label>
                <input value={sensorEditando.identificacao || ''} disabled />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={String(sensorEditando.status)}
                  onChange={handleChange}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ambiente</label>
                <select
                  name="ambiente"
                  value={sensorEditando.ambiente || ''}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  {ambientes.map((ambiente) => (
                    <option key={ambiente.id} value={ambiente.id}>
                      {ambiente.descricao}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={salvarEdicao}>Salvar</button>
                <button type="button" onClick={fecharModal}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Umidade