/* ==================== 常量 ==================== */
const ROLES = {
  SUPER: 'super',   // 最高权限
  ADMIN: 'admin',   // 管理
  WORKER: 'worker', // 打手
  SERVICE: 'service'// 客服
}
const ROLE_LABEL = {
  [ROLES.SUPER]: '最高权限',
  [ROLES.ADMIN]: '管理',
  [ROLES.WORKER]: '打手',
  [ROLES.SERVICE]: '客服'
}
const STORAGE_KEY = 'delta_orders_v2'

/* ==================== Crypto ==================== */
export async function hashPwd(pwd) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pwd))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}
export async function verifyPwd(pwd, hashHex) {
  return (await hashPwd(pwd)) === hashHex
}
export function genCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  return Array.from(crypto.getRandomValues(new Uint8Array(10)))
    .map(b => chars[b % chars.length]).join('')
}

/* ==================== 状态单例 ==================== */
function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) } catch { return null }
}
function save(s) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) }

function initState() {
  const data = load()
  if (data) return data
  const now = Date.now()
  const superAdmin = {
    id: 'u0', username: 'admin',
    passwordHash: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', // hash('admin')
    role: ROLES.SUPER, createdAt: now
  }
  const state = { users: [superAdmin], orders: [], currentUser: null }
  save(state)
  return state
}

const state = initState()
const listeners = new Set()
const emit = () => listeners.forEach(fn => fn(state))
export const Store = {
  getState: () => state,
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn) },

  /* ---- 认证 ---- */
  async login(username, password) {
    const u = state.users.find(x => x.username === username)
    if (!u || !(await verifyPwd(password, u.passwordHash))) return { ok: false, msg: '账号或密码错误' }
    state.currentUser = { id: u.id, username: u.username, role: u.role }
    save(state); emit()
    return { ok: true }
  },
  logout() { state.currentUser = null; save(state); emit() },
  getUser() { return state.currentUser },

  /* ---- 用户管理 (SUPER/ADMIN) ---- */
  async addUser(username, password, role) {
    if (state.users.some(u => u.username === username)) return { ok: false, msg: '用户名已存在' }
    state.users.push({ id: 'u' + Date.now(), username, passwordHash: await hashPwd(password), role, createdAt: Date.now() })
    save(state); emit(); return { ok: true }
  },
  async updatePassword(userId, newPwd) {
    const u = state.users.find(x => x.id === userId)
    if (!u) return { ok: false }
    u.passwordHash = await hashPwd(newPwd)
    save(state); emit(); return { ok: true }
  },
  deleteUser(userId) {
    if (userId === 'u0') return { ok: false, msg: '不可删除超管' }
    state.users = state.users.filter(u => u.id !== userId)
    save(state); emit(); return { ok: true }
  },
  listUsers() { return [...state.users].sort((a, b) => a.createdAt - b.createdAt) },

  /* ---- 订单流程 ---- */
  dispatchOrder({ requirement, customerPrice, workerPrice }) {
    const order = {
      id: 'o' + Date.now(),
      requirement,
      customerPrice: Number(customerPrice),
      workerPrice: Number(workerPrice),
      status: 'pending',      // pending / doing / review / done
      workerId: null,
      proofImg: null,
      code: null,
      createdAt: Date.now(),
      finishedAt: null
    }
    state.orders.unshift(order)
    save(state); emit()
    return order
  },
  takeOrder(orderId) {
    const o = state.orders.find(x => x.id === orderId)
    if (!o || o.status !== 'pending') return { ok: false }
    const me = state.currentUser
    if (![ROLES.WORKER, ROLES.SERVICE, ROLES.ADMIN, ROLES.SUPER].includes(me.role)) return { ok: false }
    o.status = 'doing'; o.workerId = me.id; o.startedAt = Date.now()
    save(state); emit(); return { ok: true }
  },
  submitProof(orderId, dataUrl) {
    const o = state.orders.find(x => x.id === orderId)
    if (!o || o.status !== 'doing') return { ok: false }
    if (o.workerId !== state.currentUser.id) return { ok: false, msg: '非接单人' }
    o.proofImg = dataUrl; o.status = 'review'; o.submittedAt = Date.now()
    save(state); emit(); return { ok: true }
  },
  reviewOrder(orderId, pass) {
    const o = state.orders.find(x => x.id === orderId)
    if (!o || o.status !== 'review') return { ok: false }
    if (pass) {
      o.status = 'done'; o.code = genCode(); o.finishedAt = Date.now()
    } else {
      o.status = 'doing'; o.proofImg = null
    }
    save(state); emit(); return { ok: true, code: o.code }
  },
  listOrders(filter = {}) {
    let arr = [...state.orders].sort((a, b) => b.createdAt - a.createdAt)
    if (filter.status) arr = arr.filter(o => o.status === filter.status)
    if (filter.workerId) arr = arr.filter(o => o.workerId === filter.workerId)
    return arr
  },
  getOrder(id) { return state.orders.find(o => o.id === id) }
}

/* ==================== 权限助手 ==================== */
export const Perm = {
  canDispatch: (r) => [ROLES.SUPER, ROLES.ADMIN, ROLES.SERVICE].includes(r),
  canTake: (r) => [ROLES.SUPER, ROLES.ADMIN, ROLES.SERVICE, ROLES.WORKER].includes(r),
  canReview: (r) => [ROLES.SUPER, ROLES.ADMIN].includes(r),
  canManageUsers: (r) => [ROLES.SUPER, ROLES.ADMIN].includes(r),
  canViewAll: (r) => [ROLES.SUPER, ROLES.ADMIN].includes(r),
  label: (r) => ROLE_LABEL[r] || r
}
export { ROLES }
