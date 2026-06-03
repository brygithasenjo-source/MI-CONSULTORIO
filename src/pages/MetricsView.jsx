import React from "react";

export default function MetricsView({ store }) {
  const patients = store?.patients || [];
  const sessions = store?.sessions || [];
  const payments = store?.payments || [];

  const totalPaid = payments
    .filter((p) => p.status === "pagado")
    .reduce((acc, p) => acc + Number(p.amount || 0), 0);

  const activePatients = patients.filter((p) => p.status === "active").length;
  const completedSessions = sessions.filter((s) => s.status === "realizada").length;

  return (
    <div className="fade page-pad" style={{ padding: "24px 28px", maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Métricas</h1>
      <p style={{ color: "#6B7280", marginBottom: 22, fontSize: 13 }}>
        Análisis general de tu práctica clínica.
      </p>

      <div
        className="metrics-4col"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <MetricCard label="Pacientes" value={patients.length} icon="👥" />
        <MetricCard label="Activos" value={activePatients} icon="✅" />
        <MetricCard label="Sesiones" value={completedSessions} icon="🗒️" />
        <MetricCard label="Ingresos" value={`S/. ${totalPaid}`} icon="💰" />
      </div>

      <div
        style={{
          background: "#EEE9FF",
          border: "1px solid #D8D0FF",
          borderRadius: 14,
          padding: 20,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 14, fontWeight: 800, color: "#5B4FCF" }}>
          ✨ Reportes avanzados con IA
        </p>
        <p style={{ fontSize: 12, color: "#5B4FCF", opacity: 0.8, marginTop: 5 }}>
          Próximamente: análisis de evolución, predicción de cancelaciones y reportes mensuales.
        </p>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E7E2",
        borderRadius: 14,
        padding: "16px 18px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: ".6px",
              marginBottom: 6,
            }}
          >
            {label}
          </p>
          <p style={{ fontSize: 24, fontWeight: 800, color: "#1F3D2B" }}>{value}</p>
        </div>
        <span style={{ fontSize: 22, opacity: 0.5 }}>{icon}</span>
      </div>
    </div>
  );
}
