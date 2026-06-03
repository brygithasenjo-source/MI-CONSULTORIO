/**
 * PaymentsTab.jsx
 * Payment history + add payment modal for a single patient.
 */
import { useState } from 'react'
import Card       from '@/components/ui/Card.jsx'
import Button     from '@/components/ui/Button.jsx'
import Input      from '@/components/ui/Input.jsx'
import Badge      from '@/components/ui/Badge.jsx'
import Modal      from '@/components/ui/Modal.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'

const STATUS_COLOR = { pagado: 'green', pendiente: 'orange', cancelado: 'red' }

const EMPTY = {
  amount: '', payment_date: new Date().toISOString().split('T')[0],
  payment_method: 'Transferencia', status: 'pagado', notes: '',
}

export default function PaymentsTab({ patient, payments, sessions, setPayments }) {
  const [showModal, setShowModal] = useState(false)
  const [form,      setForm]      = useState({ ...EMPTY, amount: patient.session_price ?? '' })

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const totalPaid = payments.filter((p) => p.status === 'pagado').reduce((a, p) => a + Number(p.amount), 0)
  const pending   = payments.filter((p) => p.status === 'pendiente').reduce((a, p) => a + Number(p.amount), 0)

  const handleAdd = () => {
    if (!form.amount) { alert('Ingresa el monto.'); return }
    setPayments((prev) => [
      {
        ...form,
        id: `pay${Date.now()}`,
        patient_id: patient.id,
        user_id: 'demo-user',
        session_id: null,
        amount: Number(form.amount),
        created_at: new Date().toISOString(),
      },
      ...prev,
    ])
    setForm({ ...EMPTY, amount: patient.session_price ?? '' })
    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar este pago?')) {
      setPayments((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return (
    <div>
      {/* Summary cards */}
      <div className="pay-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <Card style={{ padding: '18px 20px', background: 'var(--green-dark)' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase' }}>
            Total abonado
          </p>
          <p style={{ fontSize: '30px', fontWeight: 800, color: '#fff', marginTop: '5px' }}>
            S/. {totalPaid}
          </p>
        </Card>
        <Card style={{ padding: '18px 20px' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Pendiente
          </p>
          <p style={{ fontSize: '30px', fontWeight: 800, color: 'var(--orange)', marginTop: '5px' }}>
            S/. {pending}
          </p>
        </Card>
      </div>

      {/* Table header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700 }}>Historial de Pagos</h3>
        <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>+ Añadir Pago</Button>
      </div>

      {payments.length === 0 ? (
        <EmptyState icon="💳" title="Sin pagos registrados" description="Registra el primer pago." />
      ) : (
        <Card style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '400px' }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['Fecha', 'Monto', 'Método', 'Estado', ''].map((h) => (
                    <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const sess = sessions.find((s) => s.id === p.session_id)
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '11px 12px' }}>{p.payment_date ?? '—'}</td>
                      <td style={{ padding: '11px 12px', fontWeight: 700 }}>S/. {p.amount}</td>
                      <td style={{ padding: '11px 12px', color: 'var(--text-muted)' }}>{p.payment_method ?? '—'}</td>
                      <td style={{ padding: '11px 12px' }}>
                        <Badge color={STATUS_COLOR[p.status] ?? 'gray'}>{p.status}</Badge>
                      </td>
                      <td style={{ padding: '11px 12px' }}>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>🗑</Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add payment modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Registrar Pago" maxWidth={400}>
        <Input label="Monto (S/.)"   type="number" value={form.amount}         onChange={set('amount')} />
        <Input label="Fecha de pago" type="date"   value={form.payment_date}   onChange={set('payment_date')} />
        <Input label="Método de pago" as="select"  value={form.payment_method} onChange={set('payment_method')}
          options={['Transferencia', 'Efectivo', 'Yape', 'Plin', 'Tarjeta', 'Otro']} />
        <Input label="Estado" as="select" value={form.status} onChange={set('status')}
          options={[{ value: 'pagado', label: 'Pagado' }, { value: 'pendiente', label: 'Pendiente' }, { value: 'cancelado', label: 'Cancelado' }]} />
        <Input label="Notas" as="textarea" rows={2} value={form.notes} onChange={set('notes')} placeholder="Observaciones..." />

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
          <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="dark"    onClick={handleAdd}>Guardar</Button>
        </div>
      </Modal>
    </div>
  )
}
