import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../services/api'
import '../styles/layout.css'
import '../styles/form.css'

function CadastroSensor() {
  const [ambientes, setAmbientes] = useState([])
  const [form, setForm] = useState({
    sensor: '',
    identificacao: '',
    latitude: '',
    longitude: '',
    status: true,
    unidade_med: '',
    ambiente: ''
  })

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

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]:
        name === 'status'
          ? value === 'true'
          : name === 'ambiente'
            ? Number(value)
            : value
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await api.post('sensores/', form)
      alert('Sensor cadastrado com sucesso!')
      setForm({
        sensor: '',
        identificacao: '',
        latitude: '',
        longitude: '',
        status: true,
        unidade_med: '',
        ambiente: ''
      })
    } catch (error) {
      console.log(error)
      alert('Erro ao cadastrar sensor.')
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <h1>Cadastro de Sensor</h1>
          <p>Adicionar novo sensor ao sistema</p>
        </div>

        <div className="form-card">
          <form className="sensor-form" onSubmit={handleSubmit}>
            <select name="sensor" value={form.sensor} onChange={handleChange}>
              <option value="">Selecione o tipo</option>
              <option value="temperatura">Temperatura</option>
              <option value="umidade">Umidade</option>
              <option value="luminosidade">Luminosidade</option>
              <option value="contador">Contador</option>
            </select>

            <input name="identificacao" placeholder="Identificação" value={form.identificacao} onChange={handleChange} />
            <input name="latitude" placeholder="Latitude" value={form.latitude} onChange={handleChange} />
            <input name="longitude" placeholder="Longitude" value={form.longitude} onChange={handleChange} />

            <select name="status" value={String(form.status)} onChange={handleChange}>
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>

            <select name="unidade_med" value={form.unidade_med} onChange={handleChange}>
              <option value="">Selecione a unidade</option>
              <option value="°C">°C</option>
              <option value="%">%</option>
              <option value="lux">lux</option>
              <option value="uni">uni</option>
            </select>

            <select name="ambiente" value={form.ambiente} onChange={handleChange}>
              <option value="">Selecione o ambiente</option>
              {ambientes.map((ambiente) => (
                <option key={ambiente.id} value={ambiente.id}>
                  {ambiente.descricao}
                </option>
              ))}
            </select>

            <button type="submit">Cadastrar Sensor</button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default CadastroSensor