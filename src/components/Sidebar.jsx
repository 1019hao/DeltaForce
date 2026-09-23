export default function Sidebar({ nav, collapsed }) {
  return (
    <aside className={`glass transition-all duration-300 flex flex-col ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        {!collapsed && <span className="font-bold text-lg text-cyan-400">三角洲行动</span>}
        <span className="text-xs text-cyan-400 mono">DELTA</span>
      </div>
      <nav className="flex-1 p-3 overflow-auto scrollbar-thin">
        <ul className="space-y-1">
          {nav.map(item => (
            <li key={item.href}>
              <a href={`#${item.href}`} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition hover:bg-cyan-500/10 ${collapsed ? 'justify-center' : ''}`}>
                <span className="text-xl">{item.icon}</span>
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-3 border-t border-zinc-800">
        <a href="#/logout" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition">
          <span>🚪</span>
          {!collapsed && <span>退出登录</span>}
        </a>
      </div>
    </aside>
  )
}
