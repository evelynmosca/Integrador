import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Home from './pages/Home'
import Temperatura from './pages/Temperatura'
import Umidade from './pages/Umidade'
import Luminosidade from './pages/Luminosidade'
import Contador from './pages/Contador'
import Ambientes from './pages/Ambientes'
import CadastroSensor from './pages/CadastroSensor'
import Historico from './pages/Historico'

import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/temperatura"
        element={
          <ProtectedRoute>
            <Temperatura />
          </ProtectedRoute>
        }
      />

      <Route
        path="/umidade"
        element={
          <ProtectedRoute>
            <Umidade />
          </ProtectedRoute>
        }
      />

      <Route
        path="/luminosidade"
        element={
          <ProtectedRoute>
            <Luminosidade />
          </ProtectedRoute>
        }
      />

      <Route
        path="/contador"
        element={
          <ProtectedRoute>
            <Contador />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ambientes"
        element={
          <ProtectedRoute>
            <Ambientes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cadastro-sensor"
        element={
          <ProtectedRoute>
            <CadastroSensor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/historico"
        element={
          <ProtectedRoute>
            <Historico />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App