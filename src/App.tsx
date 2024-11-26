import { usePrivy } from '@privy-io/react-auth'

function App() {
  const { ready, authenticated, login } = usePrivy()

  const disableLogin = !ready || (ready && authenticated);

  return (
    <>
      <button onClick={login} disabled={disableLogin}>Login</button>
    </>
  )
}

export default App
