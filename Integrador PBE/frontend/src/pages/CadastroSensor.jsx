import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../services/api'
import '../styles/layout.css'
import '../styles/form.css'

function CadastroSensor() {
  const [ambientes, setAmbientes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    sensor: '',
    status: true,
    unidade_med: '',
    ambiente: ''
  })

  useEffect(() => {
    const usuarioSalvo = JSON.parse(localStorage.getItem('usuario'))

    if (!usuarioSalvo || !usuarioSalvo.is_staff) {
      navigate('/home')
      return
    }

    const carregarDados = async () => {
      try {
        const resAmbientes = await api.get('ambientes/')
        setAmbientes(resAmbientes.data)
      } catch (error) {
        console.log(error)
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'status'
          ? value === 'true'
          : name === 'ambiente'
            ? Number(value)
            : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.sensor || !form.unidade_med || !form.ambiente) {
      alert('Preencha todos os campos.')
      return
    }

    try {
      await api.post('sensores/', {
        sensor: form.sensor,
        status: form.status,
        unidade_med: form.unidade_med,
        ambiente: form.ambiente,
        latitude: '0.00000000',
        longitude: '0.00000000'
      })

      alert('Sensor cadastrado com sucesso!')

      setForm({
        sensor: '',
        status: true,
        unidade_med: '',
        ambiente: ''
      })
    } catch (error) {
      console.log(error)
      console.log(error.response?.data)
      alert('Erro ao cadastrar sensor.')
    }
  }

  if (carregando) {
    return <p>Carregando...</p>
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