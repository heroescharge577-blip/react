import { useState } from "react";
import api from "../services/api"; // Instancia de Axios configurada

const NumberGame = ({ user }) => {
  const [intento, setIntento] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [ultimoIntento, setUltimoIntento] = useState(null);

  const iniciarJuego = async () => {
    setCargando(true);
    try {
      const res = await api.get("/start");
      setMensaje(res.data.mensaje);
      setJuegoIniciado(true);
      setUltimoIntento(null);
      setIntento("");
    } catch (error) {
      setMensaje("Error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  const enviarIntento = async () => {
    if (intento === "") return;

    try {
      const res = await api.post("/guess", { numero: parseInt(intento) });
      setMensaje(res.data.mensaje);
      setUltimoIntento(intento);
      
      // Si adivinó, podemos resetear el estado de "juego iniciado" para mostrar el botón de nuevo
      if (res.data.mensaje.includes("¡Correcto!")) {
        setJuegoIniciado(false);
      }
    } catch (error) {
      setMensaje("Error al procesar tu número.");
    }
  };

  const handleLogout = () => {
    window.location.href = "https://legendary-space-funicular-x5679vrrvx6x2pppj-3000.app.github.dev/api/auth/logout";
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
      {/* Header idéntico a PokemonGame */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "700px",
        margin: "0 auto 30px auto",
      }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "800", margin: 0 }}>
          🔢 GuessNumber
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
            }}
          >
            Salir
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
        <button
          onClick={iniciarJuego}
          disabled={cargando}
          style={{
            padding: "14px 32px",
            background: "linear-gradient(135deg, #4cc9f0, #4361ee)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "700",
            marginBottom: "30px",
          }}
        >
          {juegoIniciado ? "🔄 Reiniciar Juego" : "⚡ ¡Empezar a Jugar!"}
        </button>

        {juegoIniciado && (
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "40px",
            backdropFilter: "blur(10px)",
          }}>
            <p style={{ marginBottom: "20px", color: "rgba(255,255,255,0.6)" }}>
              Introduce un número del 1 al 100
            </p>
            
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <input
                type="number"
                value={intento}
                onChange={(e) => setIntento(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviarIntento()}
                placeholder="?"
                style={{
                  padding: "14px",
                  fontSize: "1.5rem",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.07)",
                  color: "#fff",
                  width: "100px",
                  textAlign: "center",
                  outline: "none",
                }}
              />
              <button
                onClick={enviarIntento}
                style={{
                  padding: "14px 24px",
                  background: "#fff",
                  color: "#1a1a2e",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "700",
                }}
              >
                Adivinar
              </button>
            </div>
          </div>
        )}

        {mensaje && (
          <div style={{
            marginTop: "24px",
            padding: "20px",
            borderRadius: "15px",
            background: mensaje.includes("¡Correcto!") ? "rgba(0, 200, 100, 0.15)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${mensaje.includes("¡Correcto!") ? "#00c864" : "rgba(255,255,255,0.1)"}`,
          }}>
            <h3 style={{ margin: 0, fontWeight: "500" }}>{mensaje}</h3>
            {ultimoIntento && !mensaje.includes("¡Correcto!") && (
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginTop: "8px" }}>
                Tu último número fue: {ultimoIntento}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NumberGame;