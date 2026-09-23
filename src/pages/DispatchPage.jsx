import { useState } from 'react'
import OrderForm from '../components/OrderForm'

export default function DispatchPage() {
  const [show, setShow] = useState(false)
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">派单</h1>
      <button onClick={() => setShow(true)} className="btn-primary">+ 新建订单</button>
      <OrderForm open={show} onClose={() => setShow(false)} />
    </div>
  )
}
