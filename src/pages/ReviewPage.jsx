import { useState, useEffect } from 'react'
import { Store } from '../store'
import OrderCard from '../components/OrderCard'

export default function ReviewPage() {
  const [orders, setOrders] = useState([])
  useEffect(() => {
    const unsub = Store.subscribe(s => setOrders(Store.listOrders({ status: 'review' })))
    return unsub
  }, [])
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">待审核订单</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.length === 0 ? (
          <div className="col-span-full card text-center py-12 text-zinc-500">暂无待审核订单</div>
        ) : orders.map(o => <OrderCard key={o.id} order={o} />)}
      </div>
    </div>
  )
}
