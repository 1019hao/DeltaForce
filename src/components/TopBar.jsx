export default function TopBar({ user, collapsed, onToggle }) {
  return (
    <header className="glass border-b border-zinc-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <button onClick={onToggle} className="btn-ghost md:hidden" aria-label="Toggle sidebar">☰</button>
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {collapsed ? 'Δ' : '三角洲行动 · 接单后台'}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden sm:block text-xs text-zinc-400 mono">{user?.username}</span>
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/20 text-cyan-400">
          {user?.role}
        </span>
      </div>
    </header>
  )
}
