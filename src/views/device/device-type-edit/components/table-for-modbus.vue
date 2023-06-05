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
  </a-table>
</template>
//--------------------------------------------------------------------------
<script lang="ts" setup>
  // ============= 三方依赖
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useRouter, useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  // ============= 源码依赖
  import {
    ReqDtoPageDeviceTypeAttributeModbus,
    ResDtoPageDeviceTypeAttributeModbus,
    deviceTypeAttributeModbusPageForApi,
  } from '@/api/device';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import * as NumberToString from '@/utils/number-to-string';
  import { number } from 'echarts';
  // ============= types

  // =============
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const columnsForObjects = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: '属性名称',
      dataIndex: 'relDeviceTypeAttributeName',
    },
    {
      title: '从机地址',
      dataIndex: 'slaveAddress',
    },
    {
      title: '寄存器地址',
      dataIndex: 'registerAddress',
    },
    {
      title: '读写类型',
      dataIndex: 'readWriteTypeStr',
    },
    {
      title: '数据类型',
      dataIndex: 'dataTypeStr',
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
  const renderDataForObjects = ref<ResDtoPageDeviceTypeAttributeModbus[]>([]);
  // --- table devices end
  // ============= @event

  // ============= step functions
  const fetchDataForObjects = async (
    params: ReqDtoPageDeviceTypeAttributeModbus = {
      offset: 0,
      rows: 10,
      searchKey: '',
      relDeviceTypeId: props.relDeviceTypeId,
    }
  ) => {
    loadingForObjects.setLoading(true);
    try {
      const { data } = await deviceTypeAttributeModbusPageForApi(params);
      data.list.forEach((item) => {
        item.readWriteTypeStr = NumberToString.readWriteType(
          item.readWriteType
        );
        item.dataTypeStr = NumberToString.modbusDataType(item.dataType);
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
</script>
//--------------------------------------------------------------------------
<script lang="ts">
  export default {
    name: 'TableForModbus',
  };
</script>
//--------------------------------------------------------------------------
<style scoped lang="less"></style>
