import * as MQTT from 'precompiled-mqtt';
import type { InjectionKey } from 'vue';
//
export declare type OnlineMessage = {
  deviceCode: string;
  onOrOff: number;
};
export declare type OnMessageCallbackForDeviceOnline = {
  key: any;
  callback: (payloads: OnlineMessage[]) => void;
};
//
export function mqttInit(brokerUrl: string, account: string, secret: string) {
  //
  // console.log(`brokerUrl=${brokerUrl}`);
  //
  const callbackForDeviceOnline: OnMessageCallbackForDeviceOnline[] = [];
  const deviceOnlineMessages: OnlineMessage[] = [];
  //
  const mqttClient = MQTT.connect(brokerUrl, {
    clientId: `account:${account}:${new Date().getTime()}`,
    // clientId: `account:${account}`,
    username: account,
    password: secret,
  });
  //
  mqttClient.on('connect', () => {
    console.log(`mqtt broker ${brokerUrl} connected account = ${account}`);
    mqttClient.subscribe(`/account/${account}/online/d`);
    mqttClient.subscribe(`/account/${account}/alarm/d`);
  });
  //
  mqttClient.on('message', (topic: any, message: { toString: () => any }) => {
    console.log(
      `mqtt broker ${brokerUrl} topic = ${topic} message = ${message}`
    );
    if (topic === `/account/${account}/online/d`) {
      // console.log(callbackForDeviceOnline);
      deviceOnlineMessages.push(JSON.parse(message.toString()));
      setTimeout(() => {
        callbackForDeviceOnline.forEach((item) =>
          item.callback(deviceOnlineMessages)
        );
        deviceOnlineMessages.splice(0, deviceOnlineMessages.length);
      }, 1000);
    }
  });

  //
  return {
    //
    mqttSubscribeDeviceAttributesDown(deviceCode: string) {
      mqttClient.subscribe(`/account/${account}/${deviceCode}/attributes/d`);
    },
    //
    mqttUnsubscribeDeviceAttributesDown(deviceCode: string) {
      mqttClient.unsubscribe(`/account/${account}/${deviceCode}/attributes/d`);
    },
    //
    mqttPublishDeviceAttributesUp(deviceCode: string, message: string) {
      mqttClient.publish(
        `/account/${account}/${deviceCode}/attributes/u`,
        message
      );
    },
    //
    mqttSubscribeDeviceAttributesResDown(deviceCode: string) {
      mqttClient.subscribe(
        `/account/${account}/${deviceCode}/attributes/res/d`
      );
    },
    //
    mqttUnsubscribeDeviceAttributesResDown(deviceCode: string) {
      mqttClient.unsubscribe(
        `/account/${account}/${deviceCode}/attributes/res/d`
      );
    },
    //
    mqttPublishDeviceAttributesReqUp(deviceCode: string, message: string) {
      mqttClient.publish(
        `/account/${account}/${deviceCode}/attributes/req/u`,
        message
      );
    },
    //
    addCallbackForDeviceOnline(callbackItem: OnMessageCallbackForDeviceOnline) {
      console.log('addCallbackForDeviceOnline');
      const index = callbackForDeviceOnline.findIndex(
        (item) => item.key === callbackItem.key
      );
      if (index === -1) {
        callbackForDeviceOnline.push(callbackItem);
      }
    },
  };
}
export declare type MqttIns = {
  addCallbackForDeviceOnline: (
    callbackItem: OnMessageCallbackForDeviceOnline
  ) => void;
};
export default null;
