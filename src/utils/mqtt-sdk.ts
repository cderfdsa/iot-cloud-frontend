import mqtt from 'mqtt/dist/mqtt';

export function mqttInit(brokerUrl: string, account: string, secret: string) {
  //
  const client = mqtt.connect(brokerUrl, {
    clientId: `account:${account}`,
    username: account,
    password: secret,
  });
  //
  client.on('connect', function () {
    console.log('connected');
  });
  //
  client.on('message', function (topic: any, message: { toString: () => any }) {
    console.log(topic);
    // message is Buffer
    console.log(message.toString());
  });
}

export default null;
