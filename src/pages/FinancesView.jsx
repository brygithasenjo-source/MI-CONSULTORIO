/**
 * FinancesView.jsx
 */
import Card     from '@/components/ui/Card.jsx'
import Avatar   from '@/components/ui/Avatar.jsx'
import Badge    from '@/components/ui/Badge.jsx'
import StatCard from '@/components/ui/StatCard.jsx'

const STATUS_COLOR = { pagado: 'green', pendiente: 'orange', cancelado: 'red' }

export default function FinancesView({ store }) {
  const { payments, patients } = store

  const totalPaid = payments.filter((p) => p.status === 'pagado').reduce((a, p) => a + Number(p.amount), 0)
  const pending   = payments.filter((p) => p.status === 'pendiente').reduce((a, p) => a + Number(p.amount), 0)
  const thisMonth = payments.filter((p) => p.payment_date?.startsWith('2026-05')).length

  const byPatient = patients
    .map((pat) => ({
      ...pat,
      total: payments.filter((p) => p.patient_id === pat.id && p.status === 'pagado').reduce((a, p) => a + Number(p.amount), 0),
    }))
    .filter((p) => p.total > 0)
    .sort((a, b) => b.total - a.total)

  return (
    <div className="fade-in page-pad" style={{ padding: '24px 28px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>Finanzas</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '22px', fontSize: '13px' }}>Resumen financiero de tu práctica clínica</p>

      <div className="finances-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <StatCard dark label="Total cobrado" value={`S/. ${totalPaid}`} />
        <StatCard label="Pendiente de cobro" value={`S/. ${pending}`}  color="var(--orange)" icon="⏳" />
        <StatCard label="Pagos este mes"      value={thisMonth}         sub="Mayo 2026"       icon="📊" />
      </div>

      {/* By patient */}
      <Card style={{ padding: '18px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '14px' }}>Ingresos por paciente</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {byPatient.map((p) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Avatar name={p.full_name} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>{p.full_name}</p>
                <div style={{ background: 'var(--border)', borderRadius: '99px', height: '5px', marginTop: '3px' }}>
                  <div style={{ width: `${totalPaid > 0 ? Math.min((p.total / totalPaid) * 100, 100) : 0}%`, background: 'var(--green)', borderRadius: '99px', height: '5px' }} />
                </div>
              </div>
              <p style={{ fontSize: '13px', fontWeight: 800, color: 'var(--green-dark)', flexShrink: 0 }}>S/. {p.total}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Full table */}
      <Card style={{ overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700 }}>Todos los pagos</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '400px' }}>
            <thead>
              <tr style={{ background: 'var(--bg)' }}>
                {['Paciente', 'Fecha', 'Monto', 'Método', 'Estado'].map((h) => (
                  <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const pat = patients.find((x) => x.id === p.patient_id)
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <Avatar name={pat?.full_name} size={26} />
                        <span style={{ fontWeight: 600 }}>{pat?.full_name ?? '—'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 14px', color: 'var(--text-muted)' }}>{p.payment_date ?? '—'}</td>
                    <td style={{ padding: '11px 14px', fontWeight: 700 }}>S/. {p.amount}</td>
                    <td style={{ padding: '11px 14px', color: 'var(--text-muted)' }}>{p.payment_method ?? '—'}</td>
                    <td style={{ padding: '11px 14px' }}><Badge color={STATUS_COLOR[p.status] ?? 'gray'}>{p.status}</Badge></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
