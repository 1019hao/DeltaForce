import { useState, useEffect } from 'react'
import { Store } from './store'
import { Perm } from './store'

const routes = [
  { path: '/', comp: () => import('./pages/HomePage'), auth: true },
  { path: '/dispatch', comp: () => import('./pages/DispatchPage'), auth: true, perm: Perm.canDispatch },
  { path: '/review', comp: () => import('./pages/ReviewPage'), auth: true, perm: Perm.canReview },
  { path: '/profile', comp: () => import('./pages/ProfilePage'), auth: true },
  { path: '/admin', comp: () => import('./pages/AdminPage'), auth: true, perm: Perm.canManageUsers },
  { path: '/login', comp: () => import('./pages/LoginPage'), guest: true }
]

export function Router() {
  const [page, setPage] = useState(null)
  const [user, setUser] = useState(Store.getUser())

  useEffect(() => {
    const unsub = Store.subscribe(s => setUser(s.currentUser))
    window.addEventListener('hashchange', sync)
    sync()
    return () => { unsub(); window.removeEventListener('hashchange', sync) }
  }, [])

  async function sync() {
    const hash = location.hash.slice(1) || '/'
    const route = routes.find(r => r.path === hash) || routes[0]
    if (route.auth && !user) return location.hash = '#/login'
    if (route.perm && !route.perm(user?.role)) return location.hash = '#/'
    if (route.guest && user) return location.hash = '#/'
    const mod = await route.comp()
    setPage(<mod.default key={hash} />)
  }

  return page || <div className="flex h-screen items-center justify-center text-zinc-500">Loading…</div>
}
