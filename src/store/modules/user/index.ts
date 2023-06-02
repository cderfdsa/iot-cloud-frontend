import { defineStore } from 'pinia';
import {
  loginOrRegisterForApi,
  getUserForApi,
  ReqDtoLoginOrRegister,
} from '@/api/user';
import { setToken, clearToken, setUserInfo, clearUserInfo } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { mqttInit } from '@/utils/mqtt-sdk';
import { UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    account: undefined,
    email: undefined,
    secret: undefined,
    role: '',
    avatar: new URL('@/assets/logo.png', import.meta.url).href,
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      if (!this.account) {
        const res = await getUserForApi();
        setUserInfo(res.data);
        this.setInfo(res.data);
      }
    },

    // Login
    async loginOrRegisterForAction(loginForm: ReqDtoLoginOrRegister) {
      try {
        const res = await loginOrRegisterForApi(loginForm);
        setToken(res.data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      clearUserInfo();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      this.logoutCallBack();
    },
    // init mqtt
    initMqtt() {
      if (import.meta.env.VITE_MQTT_BROKER_URL && this.account && this.secret) {
        mqttInit(
          import.meta.env.VITE_MQTT_BROKER_URL,
          this.account,
          this.secret
        );
      }
    },
  },
});

export default useUserStore;
