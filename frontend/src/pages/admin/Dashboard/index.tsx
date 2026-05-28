import { useEffect, useState } from 'react'
import { Users, BookOpen, TrendingUp, CheckCircle } from 'lucide-react'
import { api } from '@/services/api'
import { Tag } from '@/components/ui/Tag'

interface Stats {
  totalUsers: number
  totalTrails: number
  totalCompleted: number
  avgProgress: number
}

interface UserProgress {
  uid: string
  name: string
  email: string
  team: string
  trails: { trailId: string; trailTitle: string; status: string; percentComplete: number }[]
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: typeof Users; label: string; value: string | number; color: string
}) {
  return (
    <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-5 shadow-[var(--shadow-elevation)] flex items-center gap-4">
      <div className={`w-12 h-12 rounded-[var(--radius-sm)] flex items-center justify-center ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-[12px] text-[var(--color-text-secondary)]">{label}</p>
        <p className="text-[24px] font-bold text-[var(--color-text-primary)]">{value}</p>
      </div>
    </div>
  )
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[var(--color-surface-muted)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-green-500)] rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[12px] text-[var(--color-text-secondary)] min-w-[32px] text-right">
        {value}%
      </span>
    </div>
  )
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [usersRes, trailsRes] = await Promise.all([
          api.get('/users?limit=100'),
          api.get('/trails?status=published&limit=100'),
        ])

        const userList = usersRes.data.data
        const trailCount = trailsRes.data.total

        const progressList: UserProgress[] = await Promise.all(
          userList
            .filter((u: any) => u.role === 'collaborator')
            .map(async (u: any) => {
              try {
                const res = await api.get(`/progress/admin/users/${u.uid}`)
                return res.data.data
              } catch {
                return { uid: u.uid, name: u.name, email: u.email, team: u.team, trails: [] }
              }
            }),
        )

        const completed = progressList.reduce(
          (acc, u) => acc + u.trails.filter((t) => t.status === 'completed').length,
          0,
        )
        const avgProgress =
          progressList.length > 0
            ? Math.round(
                progressList.reduce((acc, u) => {
                  const avg = u.trails.length > 0
                    ? u.trails.reduce((s, t) => s + t.percentComplete, 0) / u.trails.length
                    : 0
                  return acc + avg
                }, 0) / progressList.length,
              )
            : 0

        setStats({
          totalUsers: userList.length,
          totalTrails: trailCount,
          totalCompleted: completed,
          avgProgress,
        })
        setUsers(progressList)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-green-500)] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-[28px] font-bold text-[var(--color-text-primary)]">Dashboard</h1>
        <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">
          Visão geral do progresso dos colaboradores
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users}      label="Total de usuários"    value={stats?.totalUsers ?? 0}     color="bg-[var(--color-blue-100)] text-[var(--color-blue-700)]" />
        <StatCard icon={BookOpen}   label="Trilhas publicadas"   value={stats?.totalTrails ?? 0}    color="bg-[var(--color-green-100)] text-[var(--color-green-500)]" />
        <StatCard icon={CheckCircle} label="Trilhas concluídas"  value={stats?.totalCompleted ?? 0} color="bg-[var(--color-feedback-success-bg)] text-[var(--color-feedback-success-text)]" />
        <StatCard icon={TrendingUp} label="Progresso médio"      value={`${stats?.avgProgress ?? 0}%`} color="bg-[var(--color-yellow-100)] text-[var(--color-yellow-900)]" />
      </div>

      {/* Tabela de progresso */}
      <div className="bg-[var(--color-surface-default)] rounded-[var(--radius-md)] shadow-[var(--shadow-elevation)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="text-[18px] font-bold text-[var(--color-text-primary)]">
            Progresso individual
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-surface-muted)]">
              <tr>
                {['Colaborador', 'Time', 'Trilhas', 'Progresso geral', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[12px] font-bold text-[var(--color-text-secondary)] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {users.map((u) => {
                const avg = u.trails.length > 0
                  ? Math.round(u.trails.reduce((s, t) => s + t.percentComplete, 0) / u.trails.length)
                  : 0
                const allDone = u.trails.length > 0 && u.trails.every((t) => t.status === 'completed')
                return (
                  <tr key={u.uid} className="hover:bg-[var(--color-surface-subtle)] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-[14px] font-bold text-[var(--color-text-primary)]">{u.name}</p>
                      <p className="text-[12px] text-[var(--color-text-secondary)]">{u.email}</p>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[var(--color-text-secondary)]">{u.team}</td>
                    <td className="px-6 py-4 text-[14px] text-[var(--color-text-primary)]">{u.trails.length}</td>
                    <td className="px-6 py-4 min-w-[160px]">
                      <ProgressBar value={avg} />
                    </td>
                    <td className="px-6 py-4">
                      {allDone
                        ? <Tag theme="green" size="small">Concluído</Tag>
                        : u.trails.length > 0
                        ? <Tag theme="yellow" size="small">Em andamento</Tag>
                        : <Tag theme="ghost" size="small">Não iniciado</Tag>
                      }
                    </td>
                  </tr>
                )
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[14px] text-[var(--color-text-secondary)]">
                    Nenhum colaborador encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
