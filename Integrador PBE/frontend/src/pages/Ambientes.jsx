import { useEffect, useState } from 'react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import Sidebar from '../components/Sidebar'
import api from '../services/api'
import '../styles/layout.css'
import '../styles/table.css'

function Ambientes() {
  const [ambientes, setAmbientes] = useState([])
  const [locais, setLocais] = useState([])
  const [responsaveis, setResponsaveis] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [ambienteEditando, setAmbienteEditando] = useState(null)

  const usuario = JSON.parse(localStorage.getItem('usuario'))

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resAmbientes, resLocais, resResponsaveis] = await Promise.all([
          api.get('ambientes/'),
          api.get('locais/'),
          api.get('responsaveis/')
        ])

        setAmbientes(resAmbientes.data)
        setLocais(resLocais.data)
        setResponsaveis(resResponsaveis.data)
      } catch (error) {
        console.log(error)
      }
    }

    carregarDados()
  }, [])

  const abrirModal = (ambiente) => {
    setAmbienteEditando({ ...ambiente })
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setAmbienteEditando(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setAmbienteEditando({
      ...ambienteEditando,
      [name]:
        name === 'local' || name === 'responsavel'
          ? Number(value)
          : value
    })
  }

  const salvarEdicao = async () => {
    try {
      const response = await api.put(`ambientes/${ambienteEditando.id}/`, ambienteEditando)

      setAmbientes(
        ambientes.map((ambiente) =>
          ambiente.id === ambienteEditando.id ? response.data : ambiente
        )
      )

      alert('Ambiente atualizado com sucesso!')
      fecharModal()
    } catch (error) {
      console.log(error)
      alert('Erro ao editar ambiente.')
    }
  }

  const excluirAmbiente = async (id) => {
    const confirmar = window.confirm('Deseja realmente excluir este ambiente?')
    if (!confirmar) return

    try {
      await api.delete(`ambientes/${id}/`)
      setAmbientes(ambientes.filter((ambiente) => ambiente.id !== id))
      alert('Ambiente excluído com sucesso!')
    } catch (error) {
      console.log(error)
      alert('Erro ao excluir ambiente.')
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <h1>Ambientes</h1>
          <p>Lista de ambientes cadastrados na escola</p>
        </div>

        <div className="page-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Local</th>
                <th>Responsável</th>
                {usuario?.is_staff && <th>Ações</th>}
              </tr>
            </thead>

            <tbody>
              {ambientes.map((ambiente) => (
                <tr key={ambiente.id}>
                  <td>{ambiente.id}</td>
                  <td>{ambiente.local}</td>
                  <td>{ambiente.responsavel}</td>

                  {usuario?.is_staff && (
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="action-btn edit-btn"
                        onClick={() => abrirModal(ambiente)}
                        title="Editar"
                      >
                        <FiEdit2 />
                      </button>

                      <button
                        type="button"
                        className="action-btn delete-btn"
                        onClick={() => excluirAmbiente(ambiente.id)}
                        title="Excluir"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalAberto && ambienteEditando && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Editar Ambiente</h2>
              <p className="modal-subtitle">
                Atualize as informações do ambiente selecionado.
              </p>

              <div className="form-group">
                <label>Local</label>
                <select
                  name="local"
                  value={ambienteEditando.local || ''}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  {locais.map((local) => (
                    <option key={local.id} value={local.id}>
                      {local.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Responsável</label>
                <select
                  name="responsavel"
                  value={ambienteEditando.responsavel || ''}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  {responsaveis.map((responsavel) => (
                    <option key={responsavel.id} value={responsavel.id}>
                      {responsavel.nome}
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

export default Ambientes