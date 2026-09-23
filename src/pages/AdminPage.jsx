import { useState, useEffect } from 'react'
import { Store, ROLES } from '../store'
import UserForm from '../components/UserForm'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    const unsub = Store.subscribe(s => setUsers(Store.listUsers()))
    return unsub
  }, [])

  async function del(id) {
    if (confirm('确定删除该用户？')) {
      await Store.deleteUser(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-primary">+ 添加用户</button>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900/50 border-b border-zinc-800">
            <tr className="text-left text-zinc-400">
              <th className="p-3">用户名</th><th className="p-3">角色</th><th className="p-3">创建时间</th><th className="p-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-zinc-900/50">
                <td className="p-3 font-mono">{u.username}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-xs bg-cyan-500/20 text-cyan-400">{ROLES[u.role] || u.role}</span>
                </td>
                <td className="p-3 text-zinc-500 mono">{new Date(u.createdAt).toLocaleString()}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {u.id !== 'u0' && (
                      <>
                        <button onClick={() => { setEditing(u); setShowForm(true) }} className="btn-ghost text-xs px-2 py-1">编辑</button>
                        <button onClick={() => del(u.id)} className="btn-danger text-xs px-2 py-1">删除</button>
                      </>
                    )}
                    {u.id === 'u0' && <span className="text-xs text-zinc-500">超管</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UserForm open={showForm} onClose={() => { setShowForm(false); setEditing(null) }} initial={editing} />
    </div>
  )
}
