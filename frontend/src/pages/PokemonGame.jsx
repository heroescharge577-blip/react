import { useState } from "react";
import api from "../services/api";

const PokemonGame = ({ user }) => {
  const [pistas, setPistas] = useState(null);
  const [intento, setIntento] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [imagen, setImagen] = useState("");
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const obtenerPokemon = async () => {
    setCargando(true);
    setMensaje("");
    setImagen("");
    setIntento("");
    setJuegoTerminado(false);
    setResultado(null);
    const res = await fetch("/api/pokemon/random");
    const data = await res.json();
    setPistas(data);
    setCargando(false);
  };

  const enviarIntento = async () => {
    if (!intento || !pistas) return;
    const res = await fetch("/api/pokemon/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intento, nombreReal: pistas._nombre }),
    });
    const data = await res.json();
    setMensaje(data.mensaje);
    setResultado(data.resultado);
    setJuegoTerminado(true);
    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pistas.id}.svg`;
    setImagen(imgUrl);
  };

  const handleLogout = () => {
    window.location.href = "https://legendary-space-funicular-x5679vrrvx6x2pppj-3000.app.github.dev/auth/logout";
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "linear-gradient(135deg, #0a0a0f, #1a1a2e, #16213e)",
      fontFamily: "system-ui, sans-serif",
      color: "#fff",
      padding: "20px",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "700px",
        margin: "0 auto 30px auto",
      }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "800", margin: 0 }}>
          🎮 PokéGuess
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user?.photos?.[0]?.value && (
            <img
              src={user.photos[0].value}
              alt="avatar"
              style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)" }}
            />
          )}
          <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>
            {user?.displayName}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: "6px 14px",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Salir
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
        <button
          onClick={obtenerPokemon}
          style={{
            padding: "14px 32px",
            background: "linear-gradient(135deg, #e63946, #c1121f)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "700",
            marginBottom: "30px",
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = "0.85"}
          onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
        >
          {pistas ? "🔄 Nuevo Pokémon" : "⚡ ¡Iniciar Juego!"}
        </button>

        {cargando && (
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Cargando Pokémon...</p>
        )}

        {pistas && !cargando && (
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "30px",
            textAlign: "left",
            marginBottom: "24px",
            backdropFilter: "blur(10px)",
          }}>
            <h2 style={{ marginTop: 0, marginBottom: "20px", fontSize: "1.1rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "2px" }}>
              🔍 Pistas
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { label: "ID", value: `#${pistas.id}`, icon: "🆔" },
                { label: "Tipo(s)", value: pistas.tipos.join(", "), icon: "🌀" },
                { label: "Color", value: pistas.color, icon: "🎨" },
                { label: "Altura", value: `${pistas.altura / 10} m`, icon: "📏" },
                { label: "Peso", value: `${pistas.peso / 10} kg`, icon: "⚖️" },
                { label: "Ataques", value: pistas.ataques.join(", "), icon: "⚔️" },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                  padding: "14px",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: "4px", textTransform: "uppercase" }}>
                    {icon} {label}
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: "600" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pistas && !juegoTerminado && (
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <input
              type="text"
              placeholder="Nombre del Pokémon..."
              value={intento}
              onChange={(e) => setIntento(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviarIntento()}
              style={{
                padding: "14px 18px",
                fontSize: "1rem",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.07)",
                color: "#fff",
                width: "260px",
                outline: "none",
              }}
            />
            <button
              onClick={enviarIntento}
              style={{
                padding: "14px 24px",
                background: "linear-gradient(135deg, #00b4d8, #0077b6)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "700",
              }}
            >
              Intentar
            </button>
          </div>
        )}

        {mensaje && (
          <div style={{
            marginTop: "24px",
            padding: "24px",
            borderRadius: "20px",
            background: resultado === "correcto"
              ? "rgba(0, 200, 100, 0.1)"
              : "rgba(230, 57, 70, 0.1)",
            border: `1px solid ${resultado === "correcto" ? "rgba(0,200,100,0.3)" : "rgba(230,57,70,0.3)"}`,
          }}>
            <h2 style={{ margin: "0 0 16px 0" }}>{mensaje}</h2>
            {imagen && (
              <img
                src={imagen}
                alt="Pokemon"
                style={{ width: "160px", marginTop: "10px", filter: "drop-shadow(0 0 20px rgba(255,255,255,0.2))" }}
                onError={(e) => { e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pistas.id}.png`; }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonGame;