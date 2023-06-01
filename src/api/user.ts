import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';

//
export interface ReqDtoLoginOrRegister {
  email: string;
  validateCode: string;
  day30: number;
}
export interface ResDtoLoginOrRegister {
  token: string;
  email: string;
  account: string;
  user_id: number;
}
export function loginOrRegisterForApi(data: ReqDtoLoginOrRegister) {
  return axios.post<ResDtoLoginOrRegister>(
    '/webapi/user/ns/loginOrRegister',
    data
  );
}
//
export interface ReqDtoValidateCode {
  email: string;
}
export interface ResDtoValidateCode {
  email: string;
}
export function sendEmailForApi(data: ReqDtoValidateCode) {
  return axios.post<ResDtoValidateCode>('/webapi/vc/ns/sendEmail', data);
}
//
export interface ResDtoGetUser {
  email: string;
  account: string;
  user_id: number;
}
export function getUserForApi() {
  return axios.post<ResDtoGetUser>('/webapi/user/getUser');
}

export function logout() {
  return axios.post<ResDtoLoginOrRegister>('/api/user/logout');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}
