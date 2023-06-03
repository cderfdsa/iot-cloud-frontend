/** @weichuang */
//--------------------------------------------------------------------------
<template>
  <div class="container">
    <Breadcrumb
      :items="['menu.deviceManage', 'menu.deviceManage.deviceType']"
    />
    <a-page-header
      :style="{ background: 'var(--color-bg-2)' }"
      :title="$t('menu.deviceManage.deviceType.add')"
      @back="$router.push({ name: 'DeviceType' })"
    >
    </a-page-header>
    <a-card class="general-card">
      <a-space direction="vertical" :size="16" style="display: block">
        <a-row>
          <a-col :span="24">
            <a-alert title="提示"
              >设备类型是对同一种设备的相同点的描述。</a-alert
            >
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-typography-title :heading="6">类型名称：</a-typography-title>
            <a-typography-paragraph type="secondary" spacing="close">
              类型名称可以尽量参考：设备型号、产品型号、设备种类等
            </a-typography-paragraph>
            <a-input
              :style="{ width: '320px' }"
              placeholder="请输入类型名称"
              allow-clear
            />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-typography-title :heading="6">设备接入类型：</a-typography-title>
            <a-typography-paragraph type="secondary" spacing="close">
              直连设备和网关都可以直接连接云平台，网关子设备需要借助网关才能连接云平台。也因此，直连设备和网关的区别就是是否可以下挂子设备。
            </a-typography-paragraph>
            <a-typography-paragraph type="secondary" spacing="close">
              实际上，从另一个角度去考虑，如果关心的物联网设备属性较少，都可以直接使用直连设备。
            </a-typography-paragraph>
            <a-space direction="vertical" size="large">
              <a-radio-group
                v-model="formForDeviceType.type"
                :options="optionsFortype"
              />
            </a-space>
          </a-col>
        </a-row>
      </a-space>
    </a-card>
  </div>
</template>
//--------------------------------------------------------------------------
<script lang="ts" setup>
  // =============
  import { reactive } from 'vue';
  // =============
  const optionsFortype = [
    { label: '直连设备', value: 1 },
    { label: '网关', value: 2 },
    { label: '网关子设备', value: 3, disabled: true },
  ];
  // =============
  const formForDeviceType = reactive({
    name: '',
    type: 1,
  });
</script>
//--------------------------------------------------------------------------
<script lang="ts">
  export default {
    name: 'DeviceTypeAdd',
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
