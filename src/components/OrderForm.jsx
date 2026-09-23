import { useState } from 'react'
import { Store } from '../store'

export default function OrderForm({ open, onClose }) {
  const [req, setReq] = useState('')
  const [cPrice, setCPrice] = useState('')
  const [wPrice, setWPrice] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!req || !cPrice || !wPrice) return alert('请填完整')
    setLoading(true)
    Store.dispatchOrder({ requirement: req, customerPrice: cPrice, workerPrice: wPrice })
    setLoading(false)
    onClose()
  }

  if (!open) return null
  return (
    <Modal open={true} onClose={onClose} title="新建订单">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">订单要求</label>
          <textarea value={req} onChange={e => setReq(e.target.value)} rows={4} className="input" placeholder="详细描述任务要求…" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">客户付款金额</label>
            <input type="number" step="0.01" value={cPrice} onChange={e => setCPrice(e.target.value)} className="input" required />
          </div>
          <div>
            <label className="block text-sm mb-1">打手到手金额</label>
            <input type="number" step="0.01" value={wPrice} onChange={e => setWPrice(e.target.value)} className="input" required />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">取消</button>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? '提交中…' : '确定派单'}</button>
        </div>
      </form>
    </Modal>
  )
}
