import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/login.css'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const fazerLogin = async (e) => {
    e.preventDefault()
    setErro('')

    try {
      const usuarioLimpo = username.trim()
      const senhaLimpa = password.trim()

      console.log('Enviando login:', {
        username: usuarioLimpo,
        password: senhaLimpa
      })

      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: usuarioLimpo,
        password: senhaLimpa
      })

      localStorage.setItem('access', response.data.access)
      localStorage.setItem('refresh', response.data.refresh)

      const meResponse = await axios.get('http://127.0.0.1:8000/api/me/', {
        headers: {
          Authorization: `Bearer ${response.data.access}`
        }
      })

      localStorage.setItem('usuario', JSON.stringify(meResponse.data))

      navigate('/home')
    } catch (error) {
      console.log('Erro completo:', error)
      console.log('Resposta do servidor:', error.response?.data)
      setErro('Usuário ou senha inválidos.')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>SmartCity</h1>
        <p>Sensor Manager</p>

        <form onSubmit={fazerLogin}>
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Entrar</button>
        </form>

        {erro && <span className="login-error">{erro}</span>}
      </div>
    </div>
  )
}

export default Login