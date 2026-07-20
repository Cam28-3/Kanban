// App root. Deliberately thin — all real logic lives in Board and below.
import { Board } from './components/Board/Board'

function App() {
  return (
    <div className="min-h-screen bg-canvas">
      <Board />
    </div>
  )
}

export default App
