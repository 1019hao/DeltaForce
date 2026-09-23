import { Store } from './store'
import { Router } from './router'
import Layout from './components/Layout'

function App() {
  const user = Store.getUser()
  return user ? <Layout><Router /></Layout> : <Router />
}

export default App

