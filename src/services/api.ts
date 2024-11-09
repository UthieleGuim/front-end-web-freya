import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8989'
});

export default api;