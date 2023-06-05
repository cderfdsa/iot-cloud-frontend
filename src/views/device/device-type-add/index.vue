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
        <DeviceTypeFormForAddEdit />
      </a-space>
    </a-card>
  </div>
</template>
//--------------------------------------------------------------------------
<script lang="ts" setup>
  // =============

  // =============

  import DeviceTypeFormForAddEdit from './components/device-type-form-for-add-edit.vue';
  // =============

  // ============= ref reactive

  // ============= @event

  // ============= step
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
