import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import api from '../services/api'
import '../styles/layout.css'
import '../styles/table.css'

function Umidade() {
    const [sensores, setSensores] = useState([])

    useEffect(() => {
        const buscarSensores = async () => {
            try {
                const response = await api.get('sensores/')
                const filtrados = response.data.filter(
                    (item) => item.sensor?.toLowerCase() === 'umidade'
                )
                setSensores(filtrados)
            } catch (error) {
                console.log(error)
            }
        }

        buscarSensores()
    }, [])

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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    )
}

export default Umidade