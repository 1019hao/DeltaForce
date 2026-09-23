import { useState } from 'react'
import { Store, Perm } from '../store'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const user = Store.getUser()
  const nav = [
    { href: '/', label: '接单大厅', icon: '📋' },
    { href: '/dispatch', label: '派单', icon: '📤', show: Perm.canDispatch(user?.role) },
    { href: '/review', label: '审核', icon: '✅', show: Perm.canReview(user?.role) },
    { href: '/profile', label: '用户中心', icon: '👤' },
    { href: '/admin', label: '用户管理', icon: '👥', show: Perm.canManageUsers(user?.role) }
  ].filter(i => i.show !== false)

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar nav={nav} collapsed={collapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar user={user} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
