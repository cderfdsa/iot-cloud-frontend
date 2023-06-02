import * as MQTT from 'precompiled-mqtt';

export function mqttInit(brokerUrl: string, account: string, secret: string) {
  //
  console.log(`brokerUrl=${brokerUrl}`);
  //
  const client = MQTT.connect(brokerUrl, {
    clientId: `account:${account}`,
    username: account,
    password: secret,
    port: 8000,
    host: '127.0.0.1',
  });
  //
  client.on('connect', () => {
    console.log('connected');
  });
  //
  client.on('message', (topic: any, message: { toString: () => any }) => {
    console.log(topic);
    // message is Buffer
    console.log(message.toString());
  });
}

export default null;
