const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

const app = express();
const PORT = 3000;

app.set("trust proxy", 1);

app.use(cors({
  origin: "https://legendary-space-funicular-x5679vrrvx6x2pppj-5173.app.github.dev",
  credentials: true
}));

app.use(express.json());

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

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://legendary-space-funicular-x5679vrrvx6x2pppj-3000.app.github.dev/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// Auth routes
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("https://legendary-space-funicular-x5679vrrvx6x2pppj-5173.app.github.dev/game");
  }
);

app.get("/auth/user", (req, res) => {
  res.send(req.user || null);
});

app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect("https://legendary-space-funicular-x5679vrrvx6x2pppj-5173.app.github.dev");
  });
});

// Pokemon routes
app.get("/api/pokemon/random", async (req, res) => {
  try {
    const id = Math.floor(Math.random() * 151) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();
    const pistas = {
      id: data.id,
      tipos: data.types.map(t => t.type.name),
      altura: data.height,
      peso: data.weight,
      color: speciesData.color.name,
      ataques: data.moves.slice(0, 4).map(m => m.move.name),
      _nombre: data.name
    };
    res.json(pistas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el Pokémon" });
  }
});

app.post("/api/pokemon/guess", (req, res) => {
  const { intento, nombreReal } = req.body;
  if (!intento || !nombreReal) {
    return res.status(400).json({ mensaje: "Faltan datos." });
  }
  const correcto = intento.toLowerCase().trim() === nombreReal.toLowerCase().trim();
  if (correcto) {
    res.json({ resultado: "correcto", mensaje: `¡Correcto! Es ${nombreReal} 🎉` });
  } else {
    res.json({ resultado: "incorrecto", mensaje: `Incorrecto, el Pokémon era ${nombreReal} 😢` });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en https://legendary-space-funicular-x5679vrrvx6x2pppj-3000.app.github.dev`);
});