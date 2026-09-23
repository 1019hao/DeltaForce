import { useState } from 'react'
import { Store } from '../store'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setErr(''); setLoading(true)
    const res = await Store.login(username, password)
    setLoading(false)
    if (res.ok) location.hash = '#/'
    else setErr(res.msg)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      <div className="card w-full max-w-md animate-in">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🎯</div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">三角洲行动</h1>
          <p className="text-zinc-500 mt-1">接单后台管理系统</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {err && <p className="text-red-400 text-sm text-center">{err}</p>}
          <div>
            <label className="block text-sm mb-1">用户名</label>
            <input value={username} onChange={e => setUsername(e.target.value)} className="input" autoComplete="username" required />
          </div>
          <div>
            <label className="block text-sm mb-1">密码</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" autoComplete="current-password" required />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? '登录中…' : '登录'}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-zinc-500">默认账号：admin / admin</p>
      </div>
    </div>
  )
}
