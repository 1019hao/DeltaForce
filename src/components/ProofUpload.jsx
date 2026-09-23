import { useState } from 'react'
import { Store } from '../store'

export default function ProofUpload({ orderId, onSuccess }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!file) return alert('请选择图片')
    setLoading(true)
    const reader = new FileReader()
    reader.onload = async e => {
      await Store.submitProof(orderId, e.target.result)
      setLoading(false)
      onSuccess()
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" className="input" onChange={e => {
        const f = e.target.files[0]
        if (f) { setFile(f); setPreview(URL.createObjectURL(f)) }
      }} />
      {preview && <img src={preview} className="rounded-lg max-h-64 mx-auto" alt="预览" />}
      <div className="flex justify-end gap-3">
        <button onClick={onSuccess} className="btn-ghost" disabled={loading}>取消</button>
        <button onClick={submit} className="btn-primary" disabled={loading}>{loading ? '上传中…' : '确认上传'}</button>
      </div>
    </div>
  )
}
