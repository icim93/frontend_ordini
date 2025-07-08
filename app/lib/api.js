import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: false // puoi anche rimuoverlo se preferisci
});