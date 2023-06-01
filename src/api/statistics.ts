import axios from 'axios';

//
export function statisticsDeviceStatus() {
  return axios.post<number[]>(
    '/webapi/statistics/device/status/statisticsDeviceStatus'
  );
}
//
export function statisticsDeviceStatusb() {
  return axios.post<number[]>(
    '/webapi/statistics/device/status/statisticsDeviceStatus'
  );
}
