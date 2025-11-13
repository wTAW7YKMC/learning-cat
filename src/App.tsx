import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import Timer from './pages/Timer'
import Cards from './pages/Cards'
import Analytics from './pages/Analytics'
import Login from './pages/Login'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-learning-blue/10 to-learning-orange/10">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="timer" element={<Timer />} />
          <Route path="cards" element={<Cards />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App