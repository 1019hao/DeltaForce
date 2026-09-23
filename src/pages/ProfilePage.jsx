import { useState } from 'react'
import { Store } from '../store'

export default function ProfilePage() {
  const user = Store.getUser()
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [msg, setMsg] = useState('')

  async function changePwd(e) {
    e.preventDefault()
    setMsg('')
    if (!oldPwd || !newPwd) return setMsg('请填完整')
    const ok = await Store.updatePassword(user.id, newPwd)
    if (ok) { setMsg('修改成功'); setOldPwd(''); setNewPwd('') }
    else setMsg('修改失败')
  }

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-2xl font-bold">用户中心</h1>
      <div className="card space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
            {user?.username[0].toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-lg">{user?.username}</p>
            <span className="px-2 py-0.5 rounded text-xs bg-cyan-500/20 text-cyan-400">{Store.getState().users.find(u=>u.id===user.id)?.role}</span>
          </div>
        </div>
        <form onSubmit={changePwd} className="space-y-4 border-t border-zinc-800 pt-4">
          <h3 className="font-medium">修改密码</h3>
          <div>
            <label className="block text-sm mb-1">当前密码</label>
            <input type="password" value={oldPwd} onChange={e => setOldPwd(e.target.value)} className="input" required />
          </div>
          <div>
            <label className="block text-sm mb-1">新密码</label>
            <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} className="input" minLength={6} required />
          </div>
          {msg && <p className="text-sm text-cyan-400">{msg}</p>}
          <button type="submit" className="btn-primary w-full">保存修改</button>
        </form>
      </div>
    </div>
  )
}
