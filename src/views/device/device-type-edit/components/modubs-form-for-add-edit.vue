/** @weichuang */
//--------------------------------------------------------------------------
<template>
  <a-form :model="formForObj" @submit="submitForObj" layout="vertical">
    <!--关联属性-->
    <a-row>
      <a-col :span="24">
        <a-form-item
          field="name"
          label="关联属性"
          :rules="[
            {
              required: true,
              message: '请选择关联属性',
            },
          ]"
          :validate-trigger="['change', 'blur']"
        >
          <a-select
            :style="{ width: '320px' }"
            placeholder="Please select ..."
            allow-search
          >
            <a-option>Beijing</a-option>
            <a-option>Shanghai</a-option>
            <a-option>Guangzhou</a-option>
            <a-option>Shenzhen</a-option>
            <a-option>Chengdu</a-option>
            <a-option>Wuhan</a-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <!--从机地址-->
    <a-row>
      <a-col :span="24">
        <a-form-item
          field="name"
          label="从机地址"
          :rules="[
            {
              required: true,
              message: '请输入从机地址',
            },
          ]"
          :validate-trigger="['change', 'blur']"
        >
          <a-input-number
            :style="{ width: '320px' }"
            placeholder="请输入从机地址"
            :default-value="1"
            mode="button"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <!--分割线-->
    <a-divider orientation="left">请确认以上信息填写无误后，</a-divider>
    <!--按钮区域-->
  </a-form>
</template>
//--------------------------------------------------------------------------

<script lang="ts" setup>
  // ============= 三方
  import { ref, reactive, onMounted } from 'vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useRouter } from 'vue-router';
  // ============= 源码
  import { communicationType, protocolFormat } from '@/utils/number-to-string';
  import { opSuccess } from '@/utils';
  import {
    deviceTypeAddForApi,
    ReqDtoAddDeviceTypeAttributeModbus,
  } from '@/api/device';
  import { number } from 'echarts';
  // ============= all
  const editObj = withDefaults(
    defineProps<{
      editObj?: ReqDtoAddDeviceTypeAttributeModbus;
    }>(),
    {
      editObj: undefined,
    }
  );
  // ============= all
  const formForObj = reactive<ReqDtoAddDeviceTypeAttributeModbus>({
    relDeviceTypeId: 0,
    relDeviceTypeAttributeId: 0,
    slaveAddress: 0,
    registerAddress: 0,
    readWriteType: 0,
    dataType: 0,
  });
  const submitForObj = async () => {};
</script>

//--------------------------------------------------------------------------

<script lang="ts">
  export default {
    name: 'ModbusFormForAddEdit',
  };
</script>

//--------------------------------------------------------------------------

<style scoped lang="less"></style>
