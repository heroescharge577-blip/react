import { useState } from "react";

function PokemonGame() {
  const [pistas, setPistas] = useState(null);
  const [intento, setIntento] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [imagen, setImagen] = useState("");
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Obtener un Pokémon aleatorio del backend
  const obtenerPokemon = async () => {
    setCargando(true);
    setMensaje("");
    setImagen("");
    setIntento("");
    setJuegoTerminado(false);

    const res = await fetch("/api/pokemon/random");
    const data = await res.json();
    setPistas(data);
    setCargando(false);
  };

  // Enviar intento al backend
  const enviarIntento = async () => {
    if (!intento || !pistas) return;

    const res = await fetch("/api/pokemon/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intento, nombreReal: pistas._nombre }),
    });

    const data = await res.json();
    setMensaje(data.mensaje);
    setJuegoTerminado(true);

    // Mostrar imagen del Pokémon al terminar
    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pistas.id}.svg`;
    setImagen(imgUrl);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "20px", color: "#fff" }}>
      <h1>🎮 Adivina el Pokémon</h1>

      {/* Botón para iniciar */}
      <button
        onClick={obtenerPokemon}
        style={{ padding: "10px 20px", backgroundColor: "#e63946", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem" }}
      >
        {pistas ? "Nuevo Pokémon" : "¡Iniciar Juego!"}
      </button>

      {/* Pistas */}
      {cargando && <p>Cargando Pokémon...</p>}

      {pistas && !cargando && (
        <div style={{ marginTop: "20px", backgroundColor: "#1e1e2e", padding: "20px", borderRadius: "12px", display: "inline-block", textAlign: "left" }}>
          <h2>🔍 Pistas</h2>
          <p>🆔 <strong>ID:</strong> {pistas.id}</p>
          <p>🌀 <strong>Tipo(s):</strong> {pistas.tipos.join(", ")}</p>
          <p>🎨 <strong>Color:</strong> {pistas.color}</p>
          <p>📏 <strong>Altura:</strong> {pistas.altura / 10} m</p>
          <p>⚖️ <strong>Peso:</strong> {pistas.peso / 10} kg</p>
          <p>⚔️ <strong>Ataques:</strong> {pistas.ataques.join(", ")}</p>
        </div>
      )}

      {/* Input y botón de intento */}
      {pistas && !juegoTerminado && (
        <div style={{ marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Escribe el nombre del Pokémon"
            value={intento}
            onChange={(e) => setIntento(e.target.value)}
            style={{ padding: "10px", fontSize: "1rem", borderRadius: "8px", border: "2px solid #e63946", width: "250px", backgroundColor: "#1e1e2e", color: "#fff" }}
          />
          <br /><br />
          <button
            onClick={enviarIntento}
            style={{ padding: "10px 20px", backgroundColor: "#00b4d8", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem" }}
          >
            Intentar
          </button>
        </div>
      )}

      {/* Resultado */}
      {mensaje && (
        <div style={{ marginTop: "20px" }}>
          <h2>{mensaje}</h2>
          {imagen && (
            <img
              src={imagen}
              alt="Pokemon"
              style={{ width: "200px", marginTop: "10px" }}
              onError={(e) => { e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pistas.id}.png`; }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default PokemonGame;