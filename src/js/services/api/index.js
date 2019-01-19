import axios from 'axios';
import store from '../../store'

const api = axios.create({
  baseURL: process.env.API_URL
});
/*
api.interceptors.request.use(function(config){
  config.headers['Content-Type'] = 'application/json';

  let token = store.state.auth.session.token;
  let channel = store.state.auth.session.channel;

  if(token){
    config.headers['Authorization'] = 'Token '+token;
  }

  if(channel){
    config.headers['x-channel'] = channel;
    //config.headers['x-vendor'] = '6ea9d1b1-bd2c-4e9b-8d13-4be9cdf7bf4d';
  }

  //config.headers['Timestamp'] = Date.now()+'';
  return config;
});
*/

export default api;
