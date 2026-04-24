import axios from "axios";

const api = axios.create({
  baseURL: "https://legendary-space-funicular-x5679vrrvx6x2pppj-3000.app.github.dev",
  withCredentials: true
});

export default api;