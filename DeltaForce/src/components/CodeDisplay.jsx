export default function CodeDisplay({ code }) {
  return (
    <div className="space-y-4 text-center">
      <div className="mono text-3xl font-bold tracking-widest bg-black/50 px-4 py-6 rounded-lg border border-cyan-500/30 text-cyan-400 select-all">
        {code}
      </div>
      <p className="text-sm text-zinc-500">复制后通过其他聊天软件发给付款方</p>
      <button onClick={() => { navigator.clipboard.writeText(code); alert('已复制') }} className="btn-primary w-full">
        复制兑换码
      </button>
    </div>
  )
}
