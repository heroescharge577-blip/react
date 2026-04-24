import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import PokemonGame from "./pages/PokemonGame";
import NumberGame from "./pages/NumberGame";
import api from "./services/api";

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    api.get("/auth/user")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  if (user === undefined) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0a0a0f", color: "#fff" }}>
      Cargando...
    </div>
  );

  return (
    <Router>
      {/* Solo mostramos el menú si el usuario está logueado */}
      {user && (
        <nav style={{
          padding: "15px",
          background: "rgba(255,255,255,0.05)",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)"
        }}>
          <Link to="/game" style={linkStyle}>Juego Pokémon</Link>
          <Link to="/number-game" style={linkStyle}>Adivina el Número</Link>
        </nav>
      )}

      <Routes>
        <Route path="/" element={!user ? <Login /> : <Navigate to="/game" />} />
        <Route path="/game" element={user ? <PokemonGame user={user} /> : <Navigate to="/" />} />
        <Route path="/number-game" element={user ? <NumberGame user={user} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

const linkStyle = {
  color: "#4cc9f0",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "0.9rem"
};

export default App;