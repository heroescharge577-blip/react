const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

// Soporte para fetch (necesario si tu Node es inferior a v18)
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = 3000;

// Configuración para entornos con proxy (GitHub Codespaces)
app.set("trust proxy", 1);

// Configuración de CORS
app.use(cors({
  origin: "https://legendary-space-funicular-x5679vrrvx6x2pppj-5173.app.github.dev",
  credentials: true
}));

app.use(express.json());

// Configuración de Sesiones
app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: "none",
    httpOnly: true
  }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Configuración de Estrategia de Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://legendary-space-funicular-x5679vrrvx6x2pppj-3000.app.github.dev/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// ==========================================
// 🔐 RUTAS DE AUTENTICACIÓN (UNIFICADAS /API)
// ==========================================

app.get("/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "https://legendary-space-funicular-x5679vrrvx6x2pppj-5173.app.github.dev/" }),
  (req, res) => {
    // Redirige al juego tras login exitoso
    res.redirect("https://legendary-space-funicular-x5679vrrvx6x2pppj-5173.app.github.dev/game");
  }
);

app.get("/api/auth/user", (req, res) => {
  res.send(req.user || null);
});

app.get("/api/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect("https://legendary-space-funicular-x5679vrrvx6x2pppj-5173.app.github.dev");
  });
});

// ==========================================
// 🎲 JUEGO 1: ADIVINA EL NÚMERO
// ==========================================

let numeroSecreto = Math.floor(Math.random() * 100) + 1;

app.get("/api/start", (req, res) => {
  numeroSecreto = Math.floor(Math.random() * 100) + 1;
  res.json({ mensaje: "Nuevo juego iniciado. Adivina un número entre 1 y 100." });
});

app.post("/api/guess", (req, res) => {
  const intento = req.body.numero;
  if (intento === undefined || intento === null) {
    return res.status(400).json({ mensaje: "Debes enviar un número." });
  }
  if (intento < numeroSecreto) res.json({ mensaje: "El número secreto es mayor 🔼" });
  else if (intento > numeroSecreto) res.json({ mensaje: "El número secreto es menor 🔽" });
  else res.json({ mensaje: "🎉 ¡Correcto! Adivinaste el número." });
});

// ==========================================
// 🧩 JUEGO 2: ADIVINA EL POKÉMON (CON LOGS)
// ==========================================

app.get("/api/pokemon/random", async (req, res) => {
  try {
    const id = Math.floor(Math.random() * 151) + 1;
    console.log(`[Server] Solicitando Pokémon ID: ${id}`);

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) throw new Error("No se pudo conectar con PokeAPI");

    const data = await response.json();
    
    // Obtenemos el color de la especie
    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();

    console.log(`[Server] Pokémon enviado: ${data.name}`);

    res.json({
      id: data.id,
      tipos: data.types.map(t => t.type.name),
      altura: data.height,
      peso: data.weight,
      color: speciesData.color.name,
      ataques: data.moves.slice(0, 4).map(m => m.move.name),
      _nombre: data.name
    });
  } catch (error) {
    console.error("❌ ERROR EN RUTA POKEMON:", error.message);
    res.status(500).json({ mensaje: "Error al obtener datos del Pokémon" });
  }
});

app.post("/api/pokemon/guess", (req, res) => {
  const { intento, nombreReal } = req.body;
  if (!intento || !nombreReal) return res.status(400).json({ mensaje: "Faltan datos." });
  
  const correcto = intento.toLowerCase().trim() === nombreReal.toLowerCase().trim();
  res.json(correcto 
    ? { resultado: "correcto", mensaje: `¡Correcto! Es ${nombreReal} 🎉` }
    : { resultado: "incorrecto", mensaje: `Incorrecto, el Pokémon era ${nombreReal} 😢` }
  );
});

// ==========================================
// 🚀 INICIO
// ==========================================

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🔗 URL: https://legendary-space-funicular-x5679vrrvx6x2pppj-3000.app.github.dev`);
});