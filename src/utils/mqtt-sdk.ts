import * as MQTT from 'precompiled-mqtt';

export function mqttInit(brokerUrl: string, account: string, secret: string) {
  //
  // console.log(`brokerUrl=${brokerUrl}`);
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
    console.log(`mqtt broker ${brokerUrl} connected`);
    client.subscribe(`/account/${account}/online/d`);
  });
  //
  client.on('message', (topic: any, message: { toString: () => any }) => {
    console.log(
      `mqtt broker ${brokerUrl} topic = ${topic} message = ${message}`
    );
  });
}

export default null;
