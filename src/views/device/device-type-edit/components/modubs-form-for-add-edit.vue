/** @weichuang */
//--------------------------------------------------------------------------
<template>
  <a-form
    ref="formForRef"
    :model="formForObj"
    @submit="submitForObj"
    layout="vertical"
  >
    <!--关联属性-->
    <a-row>
      <a-col :span="24">
        <a-form-item
          field="relDeviceTypeAttributeId"
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
            placeholder="请选择关联属性"
            v-model="formForObj.relDeviceTypeAttributeId"
            allow-search
          >
            <a-option
              v-for="item in attributes"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</a-option
            >
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <!--从机地址-->
    <a-row>
      <a-col :span="24">
        <a-form-item
          field="slaveAddress"
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
            v-model="formForObj.slaveAddress"
            mode="button"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <!--寄存器地址-->
    <a-row>
      <a-col :span="24">
        <a-form-item
          field="registerAddress"
          label="寄存器地址"
          :rules="[
            {
              required: true,
              message: '请输入寄存器地址',
            },
          ]"
          :validate-trigger="['change', 'blur']"
        >
          <a-input-number
            :style="{ width: '320px' }"
            placeholder="请输入寄存器地址"
            :default-value="1"
            v-model="formForObj.registerAddress"
            mode="button"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <!--读写类型-->
    <a-row>
      <a-col :span="24">
        <a-form-item
          field="readWriteType"
          label="读写类型"
          :rules="[
            {
              required: true,
              message: '请输入读写类型',
            },
          ]"
          :validate-trigger="['change', 'blur']"
        >
          <a-radio-group
            v-model="formForObj.readWriteType"
            :options="[
              { label: '只读', value: 1 },
              { label: '读写', value: 2 },
            ]"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <!--数据格式-->
    <a-row>
      <a-col :span="24">
        <a-form-item
          field="dataType"
          label="数据格式"
          :rules="[
            {
              required: true,
              message: '请输入数据格式',
            },
          ]"
          :validate-trigger="['change', 'blur']"
        >
          <a-select v-model="formForObj.dataType" :style="{ width: '320px' }">
            <a-option :value="0">位</a-option>
            <a-option :value="1">16位无符号整数</a-option>
            <a-option :value="2">16位有符号整数</a-option>
            <a-option :value="3">32位无符号整数</a-option>
            <a-option :value="4">32位有符号整数</a-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <!--分割线-->
    <a-divider orientation="left"
      >请确认以上信息填写无误后，可点击确定保存。</a-divider
    >
    <!--按钮区域-->
    <a-row style="margin-top: 20px">
      <a-col :span="12" style="text-align: left"> </a-col>
      <a-col :span="12" style="text-align: right">
        <a-space>
          <a-button @click="clickForCancel">取消</a-button>
          <a-button type="primary" html-type="submit">确定</a-button>
        </a-space>
      </a-col>
    </a-row>
    <!--分割线-->
    <a-divider v-if="editObj" orientation="left"
      >如不再使用，可删除。</a-divider
    >
    <!--按钮区域-->
    <a-row v-if="editObj" style="margin-top: 20px">
      <a-col :span="12" style="text-align: left">
        <a-button type="primary" status="danger">删除</a-button>
      </a-col>
    </a-row>
  </a-form>
</template>
//--------------------------------------------------------------------------

<script lang="ts" setup>
  // ============= 三方
  import { ref, reactive, onMounted, onUpdated } from 'vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useRouter, useRoute } from 'vue-router';
  // ============= 源码
  import { communicationType, protocolFormat } from '@/utils/number-to-string';
  import { opSuccess } from '@/utils';
  import {
    ReqDtoAddDeviceTypeAttributeModbus,
    deviceTypeAttributePageForApi,
    deviceTypeAttributeModbusAddForApi,
  } from '@/api/device';
  // ============= props
  const emit = defineEmits(['submitComplete']);
  const props = withDefaults(
    defineProps<{
      submit: boolean;
      editObj?: ReqDtoAddDeviceTypeAttributeModbus;
    }>(),
    {
      submit: false,
      editObj: undefined,
    }
  );
  const route = useRoute();
  const idForQuery: number = route.query.id
    ? parseInt(route.query.id as string, 10)
    : 0;
  const formForRef = ref();
  // ============= reactive
  const formForObj = reactive<ReqDtoAddDeviceTypeAttributeModbus>({
    relDeviceTypeId: idForQuery,
    relDeviceTypeAttributeId: undefined,
    slaveAddress: 1,
    registerAddress: 1,
    readWriteType: 1,
    dataType: 1,
  });
  const attributes = reactive<{ label: string; value: number }[]>([]);
  // ============= functions
  const submitForObj = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (!errors) {
      if (values.id) {
        await deviceTypeAttributeModbusAddForApi(
          values as ReqDtoAddDeviceTypeAttributeModbus
        );
      } else {
        await deviceTypeAttributeModbusAddForApi(
          values as ReqDtoAddDeviceTypeAttributeModbus
        );
      }
      opSuccess('操作成功，可继续操作并确定。');
      emit('submitComplete', 1);
    } else {
      emit('submitComplete', 0);
    }
  };
  const init = async () => {
    const { data } = await deviceTypeAttributePageForApi({
      relDeviceTypeId: idForQuery,
      offset: 0,
      rows: 100,
      searchKey: '',
    });
    data.list.forEach((item) => {
      attributes.push({ label: `${item.name}(${item.code})`, value: item.id });
    });
  };
  const clickForCancel = async () => {
    emit('submitComplete', 2);
  };
  // ============= step
  init();
  // ============= on
</script>

//--------------------------------------------------------------------------

<script lang="ts">
  export default {
    name: 'ModbusFormForAddEdit',
  };
</script>

//--------------------------------------------------------------------------

<style scoped lang="less"></style>
