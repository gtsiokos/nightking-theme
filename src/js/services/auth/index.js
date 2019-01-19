import axios from 'axios';
import store from '../../store'

const auth = axios.create({
  baseURL: process.env.API_AUTH_URL
});

auth.interceptors.request.use(function(config){
  config.headers['Content-Type'] = 'application/json';

  let token = store.state.auth.session.token;

  if(token){
    config.headers['Authorization'] = 'Token '+token;
  }

  return config;
});

export default auth;
