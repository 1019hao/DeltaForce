import { useEffect, useRef } from 'react'

export default function Modal({ open, onClose, title, children, footer }) {
  const overlayRef = useRef(null)
  useEffect(() => {
    const handleKey = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = '' }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in" onClick={onClose} ref={overlayRef}>
      <div className="card w-full max-w-lg max-h-[90vh] overflow-auto animate-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="btn-ghost p-1">✕</button>
        </div>
        {children}
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}
