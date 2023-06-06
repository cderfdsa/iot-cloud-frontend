/** @weichuang */
//--------------------------------------------------------------------------
<template>
  <!-- 按钮区域-->
  <a-row style="margin-bottom: 16px">
    <a-col :span="12">
      <a-space>
        <a-button type="primary" @click="clickForAdd">
          <template #icon>
            <icon-plus />
          </template>
          {{ $t('searchTable.operation.create') }}
        </a-button>
      </a-space>
    </a-col>
    <a-col
      :span="12"
      style="display: flex; align-items: center; justify-content: end"
    >
    </a-col>
  </a-row>
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
    <template #name="{ record }">
      <a-link @click="() => clickForName(record)">{{
        record.relDeviceTypeAttributeName
      }}</a-link>
    </template>
  </a-table>
  <a-drawer
    :width="440"
    :visible="visibleForDrawer"
    @ok="handleOkForDrawer"
    @cancel="handleCancelForDrawer"
    unmountOnClose
  >
    <template #title> {{ currentRecord.id !== 0 ? '编辑' : '添加' }} </template>
    <div><ModbusFormForAddEdit /> </div>
  </a-drawer>
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
  import ModbusFormForAddEdit from './modubs-form-for-add-edit.vue';
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
      slotName: 'name',
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
  // 添加编辑逻辑--- start
  const defaultRecord = {
    id: 0,
    relDeviceTypeId: 0,
    relDeviceTypeName: '',
    relDeviceTypeAttributeId: 0,
    relDeviceTypeAttributeName: '',
    slaveAddress: 0,
    registerAddress: 0,
    readWriteType: 0,
    readWriteTypeStr: '',
    dataType: 0,
    dataTypeStr: '',
  };
  let currentRecord =
    reactive<ResDtoPageDeviceTypeAttributeModbus>(defaultRecord);
  const clickForName = async (record: ResDtoPageDeviceTypeAttributeModbus) => {
    visibleForDrawer.value = true;
    currentRecord = record;
  };
  const visibleForDrawer = ref(false);
  const handleOkForDrawer = async () => {};
  const handleCancelForDrawer = async () => {
    visibleForDrawer.value = false;
  };
  const clickForAdd = async () => {
    visibleForDrawer.value = true;
  };
  // 添加编辑逻辑--- end
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
