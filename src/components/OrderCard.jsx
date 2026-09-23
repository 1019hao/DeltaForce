import { useState } from 'react'
import { Store, Perm } from '../store'
import { formatTime, formatMoney } from '../utils/helpers'
import Modal from './Modal'
import ProofUpload from './ProofUpload'
import CodeDisplay from './CodeDisplay'

export default function OrderCard({ order }) {
  const user = Store.getUser()
  const [showProof, setShowProof] = useState(false)
  const [showCode, setShowCode] = useState(false)

  const isWorker = order.workerId === user?.id
  const canTake = Perm.canTake(user?.role) && order.status === 'pending'
  const canReview = Perm.canReview(user?.role) && order.status === 'review'
  const canSeeCode = Perm.canViewAll(user?.role) && order.code

  async function handleTake() {
    await Store.takeOrder(order.id)
  }
  async function handleReview(pass) {
    const res = await Store.reviewOrder(order.id, pass)
    if (res.code) setShowCode(true)
  }

  return (
    <article className="card relative overflow-hidden hover:border-cyan-500/30 transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
              order.status === 'doing' ? 'bg-blue-500/20 text-blue-400' :
              order.status === 'review' ? 'bg-purple-500/20 text-purple-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {order.status}
            </span>
            <span className="text-xs text-zinc-500 mono">#{order.id.slice(-6)}</span>
            <span className="text-xs text-zinc-500">{formatTime(order.createdAt)}</span>
          </div>
          <p className="text-zinc-300 mb-4 whitespace-pre-wrap">{order.requirement}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-zinc-500">客户付款：</span><span className="font-mono text-green-400">{formatMoney(order.customerPrice)}</span></div>
            <div><span className="text-zinc-500">打手到手：</span><span className="font-mono text-cyan-400">{formatMoney(order.workerPrice)}</span></div>
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          {canTake && <button onClick={handleTake} className="btn-primary w-full">接单</button>}
          {isWorker && order.status === 'doing' && (
            <button onClick={() => setShowProof(true)} className="btn w-full">上传截图</button>
          )}
          {isWorker && order.status === 'review' && <span className="text-center text-sm text-yellow-400 py-2">待审核</span>}
          {canReview && (
            <div className="flex gap-2">
              <button onClick={() => handleReview(true)} className="btn ok flex-1">通过</button>
              <button onClick={() => handleReview(false)} className="btn-danger flex-1">驳回</button>
            </div>
          )}
          {canSeeCode && (
            <button onClick={() => setShowCode(true)} className="btn-ghost w-full text-xs">查看兑换码</button>
          )}
        </div>
      </div>

      <Modal open={showProof} onClose={() => setShowProof(false)} title="上传完成截图">
        <ProofUpload orderId={order.id} onSuccess={() => setShowProof(false)} />
      </Modal>
      <Modal open={showCode} onClose={() => setShowCode(false)} title="兑换码">
        <CodeDisplay code={order.code} />
      </Modal>
    </article>
  )
}
