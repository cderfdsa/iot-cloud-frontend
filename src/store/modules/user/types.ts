import { MqttIns } from '@/utils/mqtt-sdk';
export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  account?: string;
  email?: string;
  secret?: string;
  role?: string;
  avatar?: string;
  mqttInstance?: MqttIns;
}
