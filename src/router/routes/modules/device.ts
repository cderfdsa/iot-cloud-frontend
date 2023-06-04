import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/device',
  name: 'device',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.deviceManage',
    requiresAuth: true,
    icon: 'icon-wifi',
    order: 1,
  },
  children: [
    {
      path: 'all-device',
      name: 'AllDevice',
      component: () => import('@/views/device/all-device/index.vue'),
      meta: {
        locale: 'menu.deviceManage.allDevice',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'device-type',
      name: 'DeviceType',
      component: () => import('@/views/device/device-type/index.vue'),
      meta: {
        locale: 'menu.deviceManage.deviceType',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'device-type-add',
      name: 'DeviceTypeAdd',
      component: () => import('@/views/device/device-type-add/index.vue'),
      meta: {
        locale: 'menu.deviceManage.deviceType',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'device-type-edit',
      name: 'DeviceTypeEdit',
      component: () => import('@/views/device/device-type-edit/index.vue'),
      meta: {
        locale: 'menu.deviceManage.deviceType',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
  ],
};

export default LIST;
