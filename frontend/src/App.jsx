import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import PokemonGame from "./pages/PokemonGame";
import api from "./services/api";

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    api.get("/auth/user")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  if (user === undefined) return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #0a0a0f, #1a1a2e, #16213e)",
      color: "#fff",
      fontFamily: "system-ui, sans-serif",
      fontSize: "1.2rem"
    }}>
      Cargando...
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Navigate to="/game" />} />
        <Route path="/game" element={user ? <PokemonGame user={user} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;