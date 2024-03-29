import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';

import { Message } from '@arco-design/web-vue';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    if (isLogin()) {
      try {
        if (!userStore.userInfo.account) {
          console.log('----2');
          await userStore.info();
          await userStore.initMqtt();
        }
        if (to.name === 'login') {
          next({
            name: 'Workplace',
            query: {} as LocationQueryRaw,
          });
        } else {
          next();
        }
      } catch (error) {
        // console.error(error);
        Message.error({
          content: `${error}`,
        });
        // await userStore.logout();
        // next({
        //   name: 'login',
        //   query: {
        //     redirect: to.name,
        //     ...to.query,
        //   } as LocationQueryRaw,
        // });
      }
    } else {
      if (to.name === 'login') {
        next();
        return;
      }
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}
