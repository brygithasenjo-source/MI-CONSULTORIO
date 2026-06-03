import React from "react";

export default function SettingsView({ user }) {
  return (
    <div className="fade page-pad" style={{ padding: "24px 28px", maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Configuración</h1>
      <p style={{ color: "#6B7280", marginBottom: 22, fontSize: 13 }}>
        Personaliza tu perfil profesional y la integración con tu portal.
      </p>

      <section style={cardStyle}>
        <h3 style={titleStyle}>👤 Perfil profesional</h3>

        <Field label="Nombre" value={user?.name || "Psicóloga"} />
        <Field label="Email" value={user?.email || "demo@tuconsultorio.com"} />
        <Field label="Especialidad" placeholder="Ej. Psicología clínica, TCC, ACT..." />
        <Field label="Número de colegiatura" placeholder="Ej. CPP-12345" />

        <button style={buttonStyle}>Guardar cambios</button>
      </section>

      <section style={cardStyle}>
        <h3 style={titleStyle}>🔗 Integrar en tu portal</h3>

        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
          Puedes colocar este botón dentro de tu portal principal para abrir la app “Tu Consultorio”.
        </p>

        <pre
          style={{
            background: "#1F3D2B",
            color: "#86EFAC",
            padding: 16,
            borderRadius: 12,
            overflowX: "auto",
            fontSize: 11,
            lineHeight: 1.6,
          }}
        >
{`<a href="https://tuconsultorio.vercel.app"
   target="_blank"
   rel="noopener noreferrer">
  🧠 Abrir Tu Consultorio
</a>`}
        </pre>
      </section>
    </div>
  );
}

function Field({ label, value = "", placeholder = "" }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 700,
          color: "#6B7280",
          marginBottom: 5,
          textTransform: "uppercase",
          letterSpacing: ".5px",
        }}
      >
        {label}
      </label>
      <input
        defaultValue={value}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "9px 12px",
          borderRadius: 10,
          border: "1px solid #E5E7E2",
          fontSize: 13,
          color: "#1F3D2B",
          background: "#FFFFFF",
          outline: "none",
        }}
      />
    </div>
  );
}

const cardStyle = {
  background: "#FFFFFF",
  border: "1px solid #E5E7E2",
  borderRadius: 14,
  padding: 20,
  marginBottom: 16,
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
};

const titleStyle = {
  fontSize: 14,
  fontWeight: 800,
  marginBottom: 16,
  paddingBottom: 10,
  borderBottom: "1px solid #E5E7E2",
};

const buttonStyle = {
  background: "#1F3D2B",
  color: "#FFFFFF",
  border: "none",
  borderRadius: 10,
  padding: "9px 16px",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};
