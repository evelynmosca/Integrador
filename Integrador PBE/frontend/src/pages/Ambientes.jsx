import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../services/api'
import '../styles/layout.css'
import '../styles/table.css'

function Ambientes() {
  const [ambientes, setAmbientes] = useState([])

  useEffect(() => {
    const buscarAmbientes = async () => {
      try {
        const response = await api.get('ambientes/')
        setAmbientes(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    buscarAmbientes()
  }, [])

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
                <th>Descrição</th>
                <th>Local</th>
                <th>Responsável</th>
              </tr>
            </thead>
            <tbody>
              {ambientes.map((ambiente) => (
                <tr key={ambiente.id}>
                  <td>{ambiente.id}</td>
                  <td>{ambiente.descricao}</td>
                  <td>{ambiente.local}</td>
                  <td>{ambiente.responsavel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default Ambientes