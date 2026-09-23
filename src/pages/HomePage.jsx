import { useState, useEffect } from 'react'
import { Store, Perm } from '../store'
import OrderCard from '../components/OrderCard'
import OrderForm from '../components/OrderForm'

export default function HomePage() {
  const [orders, setOrders] = useState([])
  const [showForm, setShowForm] = useState(false)
  const user = Store.getUser()

  useEffect(() => {
    const unsub = Store.subscribe(s => setOrders(Store.listOrders()))
    return unsub
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">接单大厅</h1>
        {Perm.canDispatch(user?.role) && (
          <button onClick={() => setShowForm(true)} className="btn-primary">+ 派单</button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.length === 0 ? (
          <div className="col-span-full card text-center py-12 text-zinc-500">暂无订单</div>
        ) : orders.map(o => <OrderCard key={o.id} order={o} />)}
      </div>
      <OrderForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  )
}
