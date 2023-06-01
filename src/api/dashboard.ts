import axios from 'axios';
import type { TableData } from '@arco-design/web-vue/es/table/interface';

export interface ResDtoDayCount {
  day: string;
  count: number;
}

export function statisticsDayForCountForApi() {
  return axios.post<ResDtoDayCount[]>(
    '/webapi/statistics/attributes/statisticsDayForCount'
  );
}

export interface PopularRecord {
  key: number;
  clickNumber: string;
  title: string;
  increases: number;
}

export function queryPopularList(params: { type: string }) {
  return axios.get<TableData[]>('/api/popular/list', { params });
}
