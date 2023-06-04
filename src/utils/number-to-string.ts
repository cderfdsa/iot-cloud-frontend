//
export function communicationType(value: number) {
  if (value === 101) {
    return 'WIFI';
  }
  if (value === 102) {
    return '以太网';
  }
  if (value === 103) {
    return '蜂窝网络2G';
  }
  if (value === 104) {
    return '蜂窝网络3G';
  }
  if (value === 105) {
    return '蜂窝网络4G';
  }
  if (value === 106) {
    return '蜂窝网络5G';
  }
  if (value === 107) {
    return 'NB-IOT';
  }
  if (value === 199) {
    return '其他';
  }
  if (value === 201) {
    return 'WIFI';
  }
  if (value === 202) {
    return '以太网';
  }
  if (value === 203) {
    return '蜂窝网络2G';
  }
  if (value === 204) {
    return '蜂窝网络3G';
  }
  if (value === 205) {
    return '蜂窝网络4G';
  }
  if (value === 206) {
    return '蜂窝网络5G';
  }
  if (value === 207) {
    return 'NB-IOT';
  }
  if (value === 299) {
    return '其他';
  }
  if (value === 301) {
    return 'WIFI';
  }
  if (value === 302) {
    return '以太网';
  }
  if (value === 303) {
    return 'RS485';
  }
  if (value === 304) {
    return 'RS232';
  }
  if (value === 305) {
    return 'RS422';
  }
  if (value === 306) {
    return 'LoRa';
  }
  if (value === 307) {
    return 'Zigbee';
  }
  if (value === 308) {
    return '蓝牙/BLE';
  }
  if (value === 399) {
    return '其他';
  }
  return '';
}
//
export function deviceType(value: number) {
  if (value === 1) {
    return '直连设备';
  }
  if (value === 2) {
    return '网关';
  }
  if (value === 3) {
    return '网关子设备';
  }
  return '';
}
//
export function protocolType(value: number) {
  if (value === 1) {
    return 'MQTT';
  }
  if (value === 2) {
    return 'TCP';
  }
  if (value === 3) {
    return 'HTTP';
  }
  return '';
}
//
export function protocolFormat(value: number) {
  if (value === 101) {
    return 'JSON';
  }
  if (value === 201) {
    return 'Modbus RTU';
  }
  if (value === 202) {
    return '二进制';
  }
  if (value === 203) {
    return '普通文本';
  }
  if (value === 301) {
    return 'JSON';
  }
  if (value === 302) {
    return '普通文本';
  }
  return '';
}
//
export function attributeType(value: number) {
  if (value === 1) {
    return '设备上报';
  }
  if (value === 2) {
    return '云端下发';
  }
  if (value === 3) {
    return '设备云端共享';
  }
  if (value === 4) {
    return '云端私有';
  }
  return '';
}
//
export function attributeDataType(value: number) {
  if (value === 1) {
    return '数值';
  }
  if (value === 2) {
    return '开关';
  }
  if (value === 3) {
    return '文本';
  }
  return '';
}
