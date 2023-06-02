//---------
const TOKEN_KEY = 'token';
const isLogin = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};
const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};
const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};
const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
//---------
const USER_INFO = 'user-info';
export interface UserInfo {
  account: string;
  email: string;
  secret: string;
}
const getUserInfo = () => {
  const userInfoStr = localStorage.getItem(USER_INFO);
  if (userInfoStr) {
    return JSON.parse(userInfoStr);
  }
  return undefined;
};
const setUserInfo = (userInfo: any) => {
  localStorage.setItem(USER_INFO, JSON.stringify(userInfo));
};
const clearUserInfo = () => {
  localStorage.removeItem(USER_INFO);
};
//---------
const LOGIN_CONFIG = 'login-config';
export interface LoginConfig {
  email: string;
  validateCode: string;
  day30: boolean;
}
const getLoginConfig = () => {
  const loginConfigStr = localStorage.getItem(LOGIN_CONFIG);
  if (loginConfigStr) {
    return JSON.parse(loginConfigStr);
  }
  return {};
};
const setLoginConfig = (loginConfig: any) => {
  loginConfig.validateCode = '';
  localStorage.setItem(LOGIN_CONFIG, JSON.stringify(loginConfig));
};
//---------
export {
  isLogin,
  getToken,
  setToken,
  clearToken,
  getUserInfo,
  setUserInfo,
  clearUserInfo,
  getLoginConfig,
  setLoginConfig,
};
