import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/device',
  name: 'device',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.deviceManage',
    requiresAuth: true,
    icon: 'icon-list',
    order: 1,
  },
  children: [
    {
      path: 'all-device', // The midline path complies with SEO specifications
      name: 'AllDevice',
      component: () => import('@/views/device/all-device/index.vue'),
      meta: {
        locale: 'menu.deviceManage.allDevice',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'device-type', // The midline path complies with SEO specifications
      name: 'DeviceType',
      component: () => import('@/views/device/device-type/index.vue'),
      meta: {
        locale: 'menu.deviceManage.deviceType',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default LIST;
