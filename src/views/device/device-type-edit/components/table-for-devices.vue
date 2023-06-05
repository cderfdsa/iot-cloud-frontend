/** @weichuang */
//--------------------------------------------------------------------------
<template>
  <!-- 列表区域-->
  <a-table
    row-key="id"
    :loading="loadingForObjects.loading"
    :pagination="paginationForObjects"
    :columns="(columnsForObjects as TableColumnData[])"
    :data="renderDataForObjects"
    :bordered="false"
    @page-change="onPageChangeForObjects"
  >
    <template #index="{ rowIndex }">
      {{ rowIndex + 1 + paginationForObjects.offset }}
    </template>
    <template #onlineStatus="{ record }">
      <span v-if="record.onlineStatus === 1" class="circle pass"></span>
      <span v-else class="circle"></span>
      {{ record.onlineStatus === 1 ? '在线' : '离线' }}
    </template>
    <template #activeStatus="{ record }">
      <span v-if="record.activeStatus === 0" class="circle"></span>
      <span v-else class="circle pass"></span>
      {{ record.activeStatusStr }}
    </template>
    <template #alarmStatus="{ record }">
      <span v-if="record.alarmStatus === 1" class="circle"></span>
      <span v-else class="circle alarm"></span>
      {{ record.alarmStatusStr }}
    </template>
  </a-table>
</template>
//--------------------------------------------------------------------------
<script lang="ts" setup>
  // ============= 三方依赖
  import { computed, ref, reactive, watch, onMounted } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useRouter, useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  // ============= 源码依赖
  import {
    ResDtoPageDeviceInfo,
    ReqDtoPageDeviceInfo,
    devicePageForApi,
  } from '@/api/device';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import { useUserStore } from '@/store';
  import { OnlineMessage } from '@/utils/mqtt-sdk';
  // ============= types

  // =============
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const userStore = useUserStore();
  const columnsForObjects = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
    },
    {
      title: '设备标识符',
      dataIndex: 'code',
    },
    {
      title: '在线状态',
      dataIndex: 'onlineStatus',
      slotName: 'onlineStatus',
    },
    {
      title: '活跃状态',
      dataIndex: 'activeStatus',
      slotName: 'activeStatus',
    },
    {
      title: '报警状态',
      dataIndex: 'alarmStatus',
      slotName: 'alarmStatus',
    },
  ]);
  // ============= props
  const props = defineProps({
    relDeviceTypeId: {
      type: Number,
      default: 0,
    },
  });
  // ============= ref reactive
  // --- table devices begin
  const loadingForObjects = useLoading(true);
  const basePaginationForObjects: Pagination = {
    offset: 0,
    rows: 10,
    total: 0,
  };
  const paginationForObjects = reactive({
    ...basePaginationForObjects,
  });
  const renderDataForObjects = ref<ResDtoPageDeviceInfo[]>([]);
  // --- table devices end
  // ============= @event

  // ============= step functions
  const fetchDataForObjects = async (
    params: ReqDtoPageDeviceInfo = {
      offset: 0,
      rows: 10,
      searchKey: '',
      relDeviceTypeId: props.relDeviceTypeId,
    }
  ) => {
    loadingForObjects.setLoading(true);
    try {
      const { data } = await devicePageForApi(params);
      data.list.forEach((item) => {
        if (item.activeStatus === 0) {
          item.activeStatusStr = '从未活跃';
        } else if (item.activeStatus === 1) {
          item.activeStatusStr = '5分钟内活跃';
        } else if (item.activeStatus === 2) {
          item.activeStatusStr = '1小时内活跃';
        } else if (item.activeStatus === 3) {
          item.activeStatusStr = '1天内活跃';
        } else if (item.activeStatus === 4) {
          item.activeStatusStr = '1天以上活跃';
        }
        if (item.alarmStatus === 1) {
          item.alarmStatusStr = '正常';
        } else if (item.alarmStatus === 2) {
          item.alarmStatusStr = '普通报警';
        } else if (item.alarmStatus === 3) {
          item.alarmStatusStr = '重要报警';
        } else if (item.alarmStatus === 4) {
          item.alarmStatusStr = '紧急报警';
        }
      });
      renderDataForObjects.value = data.list;
      paginationForObjects.offset = data.offset;
      paginationForObjects.rows = data.rows;
      paginationForObjects.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      loadingForObjects.setLoading(false);
    }
  };
  const onPageChangeForObjects = (current: number) => {
    fetchDataForObjects({
      ...basePaginationForObjects,
      offset: (current - 1) * 10,
      searchKey: '',
      relDeviceTypeId: props.relDeviceTypeId,
    });
  };
  // ============= step
  fetchDataForObjects({
    offset: 0,
    rows: 10,
    searchKey: '',
    relDeviceTypeId: props.relDeviceTypeId,
  });
  // ============= on
  onMounted(() => {
    if (userStore.mqttInstance) {
      userStore.mqttInstance.addCallbackForDeviceOnline({
        key: 'onlineForDeviceTypeRelDevices',
        callback: (payloads: OnlineMessage[]) => {
          payloads.forEach((item) => {
            const oneItem = renderDataForObjects.value.find(
              (innerItem) => item.deviceCode === innerItem.code
            );
            if (oneItem) {
              oneItem.onlineStatus = item.onOrOff;
            }
          });
        },
      });
    } else {
      console.error(`addCallbackForDeviceOnline error`);
    }
  });
</script>
//--------------------------------------------------------------------------
<script lang="ts">
  export default {
    name: 'TableForDevices',
  };
</script>
//--------------------------------------------------------------------------
<style scoped lang="less"></style>
