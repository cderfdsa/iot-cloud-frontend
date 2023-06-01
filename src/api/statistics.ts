import axios from 'axios';

//
export function statisticsDeviceStatus() {
  return axios.post<number[]>('/webapi/user/ns/loginOrRegister');
}
//
export function statisticsDeviceStatusb() {
  return axios.post<number[]>('/webapi/user/ns/loginOrRegister');
}
