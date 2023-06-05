/** @weichuang */
//--------------------------------------------------------------------------
<template>
  <div class="container">
    <Breadcrumb
      :items="['menu.deviceManage', 'menu.deviceManage.deviceType']"
    />
    <div :style="{ background: 'var(--color-bg-2)' }">
      <a-page-header
        title="设备类型详情"
        @back="$router.push({ name: 'DeviceType' })"
      >
      </a-page-header>
      <div style="padding-left: 20px">
        <div>
          <span style="font-size: 20px">{{ infoForDeviceType.name }}</span>
          <span style="margin-left: 20px">
            <a-button>编辑</a-button>
          </span>
        </div>
        <a-space wrap style="margin-top: 20px">
          <a-tag
            color="arcoblue"
            bordered
            v-for="item in dataForInfo"
            v-bind:key="item.label"
            >{{ item.value }}</a-tag
          >
        </a-space>
      </div>
      <a-tabs default-active-key="1">
        <a-tab-pane
          key="1"
          title="关联设备"
          style="padding-left: 20px; padding-right: 20px"
        >
          <!-- 列表区域-->
          <TableForDevices :rel-device-type-id="deviceTypeId" />
        </a-tab-pane>
        <a-tab-pane
          key="2"
          title="属性列表"
          style="padding-left: 20px; padding-right: 20px"
        >
          <!-- 列表区域-->
          <TableForAttributes :rel-device-type-id="deviceTypeId" />
        </a-tab-pane>
        <a-tab-pane
          key="3"
          v-if="
            infoForDeviceType.protocolType === 2 &&
            infoForDeviceType.protocolFormat === 201
          "
          title="Modbus配置"
          style="padding-left: 20px; padding-right: 20px"
        >
          <TableForModbus :rel-device-type-id="deviceTypeId" />
        </a-tab-pane>
        <a-tab-pane
          key="4"
          title="设置"
          style="padding-left: 20px; padding-right: 20px"
        >
          <DeviceTypeFormForAddEdit
            :edit="true"
            :edit-obj="infoForDeviceType"
            v-if="infoForDeviceType.id !== 0"
          />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
//--------------------------------------------------------------------------
<script lang="ts" setup>
  // ============= 三方依赖
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useRouter, useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  // ============= 源码依赖
  import {
    communicationType,
    deviceType,
    protocolType,
    protocolFormat,
  } from '@/utils/number-to-string';
  import { deviceTypeGetForApi, ReqDtoGetDeviceType } from '@/api/device';

  import TableForDevices from './components/table-for-devices.vue';
  import TableForAttributes from './components/table-for-attributes.vue';
  import TableForModbus from './components/table-for-modbus.vue';
  import DeviceTypeFormForAddEdit from '../device-type-add/components/device-type-form-for-add-edit.vue';
  // ============= types
  // ============= const
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const deviceTypeId: number = route.query.id
    ? parseInt(route.query.id as string, 10)
    : 0;

  // ============= ref reactive
  const infoForDeviceType = reactive({
    id: 0,
    name: 'aaa',
    type: 1,
    typeStr: '',
    communicationType: 101,
    communicationTypeStr: '',
    protocolType: 1,
    protocolTypeStr: '',
    protocolFormat: 101,
    protocolFormatStr: '',
    busTimeUnit: 's',
    busTimeValue: 10,
    busTime: '',
  });
  const dataForInfo = reactive([
    { label: '接入类型', value: '' },
    { label: '通信方式', value: '' },
    { label: '接入协议', value: '' },
    { label: '协议格式', value: '' },
  ]);

  // ============= @event

  // ============= step functions
  const init = async () => {
    const deviceTypeGetForApiForResult = await deviceTypeGetForApi({
      id: route.query.id as unknown,
    } as ReqDtoGetDeviceType);
    infoForDeviceType.id = deviceTypeGetForApiForResult.data.id;
    infoForDeviceType.name = deviceTypeGetForApiForResult.data.name;
    //
    infoForDeviceType.type = deviceTypeGetForApiForResult.data.type;
    infoForDeviceType.typeStr = deviceType(
      deviceTypeGetForApiForResult.data.type
    );
    dataForInfo[0].value = infoForDeviceType.typeStr;
    //
    infoForDeviceType.communicationType =
      deviceTypeGetForApiForResult.data.communicationType;
    infoForDeviceType.communicationTypeStr = communicationType(
      deviceTypeGetForApiForResult.data.communicationType
    );
    dataForInfo[1].value = infoForDeviceType.communicationTypeStr;
    //
    infoForDeviceType.protocolType =
      deviceTypeGetForApiForResult.data.protocolType;
    infoForDeviceType.protocolTypeStr = protocolType(
      deviceTypeGetForApiForResult.data.protocolType
    );
    dataForInfo[2].value = infoForDeviceType.protocolTypeStr;
    //
    infoForDeviceType.protocolFormat =
      deviceTypeGetForApiForResult.data.protocolFormat;
    infoForDeviceType.protocolFormatStr = protocolFormat(
      deviceTypeGetForApiForResult.data.protocolFormat
    );
    dataForInfo[3].value = infoForDeviceType.protocolFormatStr;
    //
    if (
      infoForDeviceType.protocolType === 2 &&
      infoForDeviceType.protocolFormat === 201
    ) {
      infoForDeviceType.busTime =
        deviceTypeGetForApiForResult.data.busTimeValue +
        deviceTypeGetForApiForResult.data.busTimeUnit;
      dataForInfo.push({ label: '轮询时间', value: infoForDeviceType.busTime });
    }
  };

  // ============= step
  init();
</script>
//--------------------------------------------------------------------------
<script lang="ts">
  export default {
    name: 'DeviceTypeEdit',
  };
</script>
//--------------------------------------------------------------------------
<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
  :deep(.arco-page-header-title) {
    font-size: 14px;
  }
  :deep(h6.arco-typography) {
    font-weight: bolder;
  }
  :deep(.arco-typography-secondary) {
    font-size: 12px;
  }
</style>
