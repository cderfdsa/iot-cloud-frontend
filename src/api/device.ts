import axios from 'axios';

//
export interface ReqDtoPageDeviceInfo {
  searchKey: string;
  offset: number;
  rows: number;
  relDeviceTypeId?: number;
}
export interface ResDtoPageDeviceInfo {
  id: number;
  relDeviceTypeId: number;
  relDeviceTypeName: string;
  relUserInfoId: number;
  relUserInfoName: string;
  name: string;
  code: string;
  onlineStatus: number;
  activeStatus: number;
  activeStatusStr?: string;
  alarmStatus: number;
  alarmStatusStr?: string;
}
export interface ResDtoPageDeviceInfoPageInfo {
  total: number;
  offset: number;
  rows: number;
  list: ResDtoPageDeviceInfo[];
}

export function devicePageForApi(data: ReqDtoPageDeviceInfo) {
  return axios.post<ResDtoPageDeviceInfoPageInfo>('/webapi/device/page', data);
}

//
export interface ReqDtoPageDeviceType {
  searchKey: string;
  offset: number;
  rows: number;
}
export interface ResDtoPageDeviceType {
  id: number;
  relUserInfoId: number;
  relUserInfoName?: string;
  name: string;
  type: number;
  typeStr: string;
  communicationType: number;
  communicationTypeStr: string;
  protocolType: number;
  protocolTypeStr: string;
  protocolFormat: number;
  protocolFormatStr: string;
  busTimeValue: number;
  busTimeUnit: string;
  busTimeStr: string;
}
export interface ResDtoPageDeviceTypePageInfo {
  total: number;
  offset: number;
  rows: number;
  list: ResDtoPageDeviceType[];
}

export function deviceTypePageForApi(data: ReqDtoPageDeviceType) {
  return axios.post<ResDtoPageDeviceTypePageInfo>(
    '/webapi/device/type/page',
    data
  );
}
//
export interface ReqDtoAddDeviceType {
  name: string;
  type: number;
  communicationType: number;
  protocolType: number;
  protocolFormat: number;
  busTimeValue: number;
  busTimeUnit: string;
}
export interface ResDtoAdd {
  id: number;
}

export function deviceTypeAddForApi(data: ReqDtoAddDeviceType) {
  return axios.post<ResDtoAdd>('/webapi/device/type/add', data);
}
//
export interface ReqDtoEditDeviceType {
  id: number;
  name: string;
  type: number;
  communicationType: number;
  protocolType: number;
  protocolFormat: number;
  busTimeValue: number;
  busTimeUnit: string;
}
export interface ResDtoEdit {
  id: number;
}

export function deviceTypeEditForApi(data: ReqDtoEditDeviceType) {
  return axios.post<ResDtoEdit>('/webapi/device/type/edit', data);
}
//
export interface ReqDtoCanRemove {
  id: number;
}
export interface ResDtoCanRemove {
  id: number;
  ok: number;
}

export function deviceTypeCanRemoveForApi(data: ReqDtoCanRemove) {
  return axios.post<ResDtoCanRemove>('/webapi/device/type/canRemove', data);
}
//
export interface ReqDtoRemove {
  id: number;
}
export interface ResDtoRemove {
  id: number;
}

export function deviceTypeRemoveForApi(data: ReqDtoRemove) {
  return axios.post<ResDtoRemove>('/webapi/device/type/remove', data);
}
//
export interface ReqDtoGetDeviceType {
  id: number;
}
export interface ResDtoGetDeviceType {
  id: number;
  name: string;
  type: number;
  communicationType: number;
  protocolType: number;
  protocolFormat: number;
  busTimeValue: number;
  busTimeUnit: string;
}

export function deviceTypeGetForApi(data: ReqDtoGetDeviceType) {
  return axios.post<ResDtoGetDeviceType>('/webapi/device/type/get', data);
}
//
export interface ReqDtoPageDeviceTypeAttribute {
  searchKey: string;
  offset: number;
  rows: number;
  relDeviceTypeId: number;
}
export interface ResDtoPageDeviceTypeAttribute {
  id: number;
  relDeviceTypeId: number;
  relDeviceTypeName: string;
  name: string;
  code: string;
  type: number;
  typeStr: string;
  dataType: number;
  dataTypeStr: string;
}
export interface ResDtoPageDeviceTypeAttributePageInfo {
  total: number;
  offset: number;
  rows: number;
  list: ResDtoPageDeviceTypeAttribute[];
}

export function deviceTypeAttributePageForApi(
  data: ReqDtoPageDeviceTypeAttribute
) {
  return axios.post<ResDtoPageDeviceTypeAttributePageInfo>(
    '/webapi/device/type/attribute/page',
    data
  );
}
// modbus
export interface ReqDtoPageDeviceTypeAttributeModbus {
  searchKey: string;
  offset: number;
  rows: number;
  relDeviceTypeId: number;
}
export interface ResDtoPageDeviceTypeAttributeModbus {
  id: number;
  relDeviceTypeId: number;
  relDeviceTypeName: string;
  relDeviceTypeAttributeId: number;
  relDeviceTypeAttributeName: string;
  slaveAddress: number;
  registerAddress: number;
  readWriteType: number;
  readWriteTypeStr: string;
  dataType: number;
  dataTypeStr: string;
}
export interface ResDtoPageDeviceTypeAttributeModbusPageInfo {
  total: number;
  offset: number;
  rows: number;
  list: ResDtoPageDeviceTypeAttributeModbus[];
}

export function deviceTypeAttributeModbusPageForApi(
  data: ReqDtoPageDeviceTypeAttributeModbus
) {
  return axios.post<ResDtoPageDeviceTypeAttributeModbusPageInfo>(
    '/webapi/device/type/attribute/modbus/page',
    data
  );
}
// modbus
export interface ReqDtoAddDeviceTypeAttributeModbus {
  relDeviceTypeId: number;
  relDeviceTypeAttributeId: number;
  slaveAddress: number;
  registerAddress: number;
  readWriteType: number;
  dataType: number;
}

export function deviceTypeAttributeModbusAddForApi(
  data: ReqDtoAddDeviceTypeAttributeModbus
) {
  return axios.post<ResDtoAdd>(
    '/webapi/device/type/attribute/modbus/add',
    data
  );
}
