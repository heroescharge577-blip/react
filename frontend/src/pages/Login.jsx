const Login = () => {
  const handleLogin = () => {
    window.location.href = "https://legendary-space-funicular-x5679vrrvx6x2pppj-3000.app.github.dev/auth/google";
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      background: "linear-gradient(135deg, #0a0a0f, #1a1a2e, #16213e)",
    }}>
      <div style={{
        textAlign: "center",
        padding: "50px 40px",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        maxWidth: "420px",
        width: "100%",
      }}>
        <div style={{ fontSize: "64px", marginBottom: "10px" }}>🎮</div>
        <h1 style={{
          color: "#fff",
          fontSize: "2rem",
          fontWeight: "800",
          marginBottom: "8px",
          fontFamily: "system-ui, sans-serif"
        }}>
          PokéGuess
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.5)",
          marginBottom: "40px",
          fontSize: "0.95rem",
          fontFamily: "system-ui, sans-serif"
        }}>
          Adivina el Pokémon. Demuestra quién es el mejor entrenador.
        </p>
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(135deg, #4285F4, #1a73e8)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            fontFamily: "system-ui, sans-serif",
            transition: "opacity 0.2s ease",
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = "0.85"}
          onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
        >
          🌐 Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
};

export default Login;