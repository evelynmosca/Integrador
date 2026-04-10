import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import api from '../services/api'
import '../styles/layout.css'
import '../styles/table.css'

function Historico() {
  const [historicos, setHistoricos] = useState([])

  useEffect(() => {
    const buscarHistoricos = async () => {
      try {
        const response = await api.get('historicos/')

        const dadosFormatados = response.data
          .map((item) => ({
            ...item,
            id: item.id ?? item.id_historico ?? '-',
            sensor: item.sensor ?? '-',
            valor: item.valor ?? '-',
            data_hora_original: item.data_hora,
            data_hora: item.data_hora
              ? new Date(item.data_hora).toLocaleString('pt-BR')
              : '-'
          }))
          .sort((a, b) => {
            if (!a.data_hora_original || !b.data_hora_original) return 0
            return new Date(b.data_hora_original) - new Date(a.data_hora_original)
          })

        setHistoricos(dadosFormatados)
      } catch (error) {
        console.log('Erro ao buscar históricos:', error)
      }
    }

    buscarHistoricos()
  }, [])

  const totalRegistros = historicos.length

  const ultimoRegistro = useMemo(() => {
    if (historicos.length === 0) return '-'
    return historicos[0].data_hora
  }, [historicos])

  const totalSensoresComDados = useMemo(() => {
    return [...new Set(historicos.map((item) => item.sensor))].length
  }, [historicos])

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <h1>Histórico de Medições</h1>
          <p>Visualização das medições registradas no sistema</p>
        </div>

        <div className="cards-grid">
          <StatCard
            titulo="Total de registros"
            valor={totalRegistros}
            detalhe="medições cadastradas"
          />

          <StatCard
            titulo="Último registro"
            valor={ultimoRegistro}
            detalhe="medição mais recente"
          />

          <StatCard
            titulo="Sensores com dados"
            valor={totalSensoresComDados}
            detalhe="sensores com histórico"
          />
        </div>

        <div className="page-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sensor</th>
                <th>Valor</th>
                <th>Data/Hora</th>
              </tr>
            </thead>

            <tbody>
              {historicos.length > 0 ? (
                historicos.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.sensor}</td>
                    <td>{item.valor}</td>
                    <td>{item.data_hora}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                    Nenhum histórico encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default Historico