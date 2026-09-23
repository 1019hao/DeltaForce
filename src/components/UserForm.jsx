import { useState } from 'react'
import { Store, ROLES } from '../store'

export default function UserForm({ open, onClose, initial }) {
  const [username, setUsername] = useState(initial?.username || '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(initial?.role || ROLES.WORKER)
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!username || (!initial && !password)) return alert('必填项不能为空')
    setLoading(true)
    if (initial) {
      if (password) await Store.updatePassword(initial.id, password)
    } else {
      await Store.addUser(username, password, role)
    }
    setLoading(false)
    onClose()
  }

  if (!open) return null
  return (
    <Modal open={true} onClose={onClose} title={initial ? '编辑用户' : '添加用户'}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">用户名</label>
          <input value={username} onChange={e => setUsername(e.target.value)} className="input" disabled={!!initial} placeholder="英文数字" required />
        </div>
        <div>
          <label className="block text-sm mb-1">{initial ? '新密码 (留空不改)' : '密码'}</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="至少 6 位" required={!initial} />
        </div>
        <div>
          <label className="block text-sm mb-1">角色</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="input">
            <option value={ROLES.SUPER}>最高权限</option>
            <option value={ROLES.ADMIN}>管理</option>
            <option value={ROLES.SERVICE}>客服</option>
            <option value={ROLES.WORKER}>打手</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">取消</button>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? '保存中…' : '确定'}</button>
        </div>
      </form>
    </Modal>
  )
}
