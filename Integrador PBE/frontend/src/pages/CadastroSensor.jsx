import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../services/api'
import '../styles/layout.css'
import '../styles/form.css'

function CadastroSensor() {
  const [ambientes, setAmbientes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  const identificacoesPorTipo = {
    temperatura: [
      '06:45:32:76:CC:E9_temperatura',
      '7D:12:ED:30:53:43_temperatura',
      '3F:A3:48:33:64:0E_temperatura',
      '68:F3:13:A5:31:42_temperatura',
      '6E:3D:9E:BD:B5:3B_temperatura',
      '63:18:F3:31:47:3A_temperatura',
      '2C:AD:00:8C:58:3F_temperatura',
      '3A:E0:DE:71:99:88_temperatura',
      '90:7D:40:D8:34:45_temperatura'
    ],
    umidade: [
      '06:45:32:76:CC:E9_umidade',
      '7D:12:ED:30:53:43_umidade',
      '3F:A3:48:33:64:0E_umidade',
      '68:F3:13:A5:31:42_umidade',
      '6E:3D:9E:BD:B5:3B_umidade',
      '63:18:F3:31:47:3A_umidade',
      '2C:AD:00:8C:58:3F_umidade',
      '3A:E0:DE:71:99:88_umidade',
      '90:7D:40:D8:34:45_umidade'
    ],
    luminosidade: [
      '06:45:32:76:CC:E9_luminosidade',
      '7D:12:ED:30:53:43_luminosidade',
      '3F:A3:48:33:64:0E_luminosidade',
      '68:F3:13:A5:31:42_luminosidade',
      '6E:3D:9E:BD:B5:3B_luminosidade',
      '63:18:F3:31:47:3A_luminosidade',
      '2C:AD:00:8C:58:3F_luminosidade',
      '3A:E0:DE:71:99:88_luminosidade',
      '90:7D:40:D8:34:45_luminosidade'
    ],
    contador: [
      '06:45:32:76:CC:E9_contador',
      '7D:12:ED:30:53:43_contador',
      '3F:A3:48:33:64:0E_contador',
      '68:F3:13:A5:31:42_contador',
      '6E:3D:9E:BD:B5:3B_contador',
      '63:18:F3:31:47:3A_contador',
      '2C:AD:00:8C:58:3F_contador',
      '3A:E0:DE:71:99:88_contador',
      '90:7D:40:D8:34:45_contador',
      'AF:42:D0:A5:50:7D_contador',
      'EF:31:26:A6:60:24_contador',
      '0F:1B:6C:6D:A6:BD_contador',
      'F7:A8:60:D0:9B:14_contador',
      '63:DD:51:C0:9F:CE_contador',
      '44:FA:9E:54:90:1F_contador',
      '21:BB:84:0B:96:99_contador',
      'C3:93:A5:CF:A7:29_contador'
    ]
  }

  const [form, setForm] = useState({
    sensor: '',
    identificacao: '',
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

  const identificacoesDisponiveis = useMemo(() => {
    if (!form.sensor) return []
    return identificacoesPorTipo[form.sensor] || []
  }, [form.sensor])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'sensor') {
      setForm((prev) => ({
        ...prev,
        sensor: value,
        identificacao: ''
      }))
      return
    }

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

    if (!form.sensor || !form.identificacao || !form.unidade_med || !form.ambiente) {
      alert('Preencha todos os campos.')
      return
    }

    try {
      await api.post('http://127.0.0.1:8000/api/sensores/', {
        ...form,
        latitude: '0.00000000',
        longitude: '0.00000000'
      })

      alert('Sensor cadastrado com sucesso!')

      setForm({
        sensor: '',
        identificacao: '',
        status: true,
        unidade_med: '',
        ambiente: ''
      })
    } catch (error) {
      console.log(error)
      console.log(error.response?.data)

      if (error.response?.data?.identificacao) {
        alert('Essa identificação já está em uso. Escolha outra.')
      } else {
        alert('Erro ao cadastrar sensor.')
      }
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

            <select
              name="identificacao"
              value={form.identificacao}
              onChange={handleChange}
              disabled={!form.sensor}
            >
              <option value="">
                {form.sensor ? 'Selecione a identificação' : 'Escolha primeiro o tipo'}
              </option>

              {identificacoesDisponiveis.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
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