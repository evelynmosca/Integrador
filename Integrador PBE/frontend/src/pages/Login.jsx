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
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password
      })

      localStorage.setItem('access', response.data.access)
      localStorage.setItem('refresh', response.data.refresh)

      navigate('/home')
    } catch (error) {
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
            placeholder="Usuário" // evelyn
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password" // 123
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