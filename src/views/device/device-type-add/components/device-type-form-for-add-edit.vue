/** @weichuang */
//--------------------------------------------------------------------------
<template>
  <a-form :model="formForDeviceType" @submit="submitForDeviceType">
    <a-row v-if="!editObj">
      <a-col :span="24">
        <a-alert title="提示">设备类型是对同一种设备的相同点的描述。</a-alert>
      </a-col>
    </a-row>
    <!--类型名称-->
    <a-row>
      <a-col :span="24">
        <a-typography-title :heading="6">类型名称：</a-typography-title>
        <a-typography-paragraph type="secondary" spacing="close">
          类型名称可以尽量参考：设备型号、产品型号、设备种类等
        </a-typography-paragraph>
        <a-form-item
          field="name"
          hide-label
          :rules="[
            {
              required: true,
              message: '请输入类型名称,2-20个字符',
              minLength: 2,
              maxLength: 20,
            },
          ]"
          :validate-trigger="['change', 'blur']"
        >
          <a-input
            v-model="formForDeviceType.name"
            :style="{ width: '320px' }"
            placeholder="请输入类型名称"
            allow-clear
          />
        </a-form-item>
      </a-col>
    </a-row>
    <!--设备接入类型-->
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
            :options="optionsForType"
            @change="changeForType"
          />
        </a-space>
      </a-col>
    </a-row>
    <!--设备通信方式-->
    <a-row>
      <a-col :span="24">
        <a-typography-title :heading="6">设备通信方式：</a-typography-title>
        <a-typography-paragraph type="secondary" spacing="close">
          设备的通信方式受到设备接入类型的影响。
        </a-typography-paragraph>
        <a-space direction="vertical" size="large">
          <a-radio-group
            v-model="formForDeviceType.communicationType"
            :options="optionsForCommunicationType"
          />
        </a-space>
      </a-col>
    </a-row>
    <!--设备接入协议-->
    <a-row>
      <a-col :span="12">
        <a-typography-title :heading="6">设备接入协议：</a-typography-title>
        <a-typography-paragraph type="secondary" spacing="close">
          MQTT和HTTP是主动上报（边缘计算）的方式。TCP是云端轮询的方式。
        </a-typography-paragraph>
        <a-space direction="vertical" size="large">
          <a-radio-group
            v-model="formForDeviceType.protocolType"
            :options="optionsForProtocolType"
            @change="changeForProtocolType"
          />
        </a-space>
      </a-col>
      <a-col v-if="formForDeviceType.protocolType === 2" :span="12">
        <a-typography-title :heading="6">云端轮询频率：</a-typography-title>
        <a-typography-paragraph type="secondary" spacing="close">
          最快支持10秒。
        </a-typography-paragraph>
        <a-space direction="horizontal" size="large">
          <a-select
            v-model="formForDeviceType.busTimeValue"
            :default-value="formForDeviceType.busTimeValue"
            :options="
              formForDeviceType.busTimeUnit === 's'
                ? dataForBus.s
                : dataForBus.m || []
            "
          >
          </a-select>
          <a-select
            v-model="formForDeviceType.busTimeUnit"
            :default-value="formForDeviceType.busTimeUnit"
            @change="changeForBusTimeUnit"
          >
            <a-option
              v-for="item of Object.keys(dataForBus)"
              :key="item"
              :value="item"
              :label="item"
              >{{ item }}</a-option
            >
          </a-select>
        </a-space>
      </a-col>
    </a-row>
    <!--协议格式-->
    <a-row>
      <a-col :span="24">
        <a-typography-title :heading="6">协议格式：</a-typography-title>
        <a-typography-paragraph type="secondary" spacing="close">
          直连设备和网关都可以直接连接云平台，网关子设备需要借助网关才能连接云平台。也因此，直连设备和网关的区别就是是否可以下挂子设备。
        </a-typography-paragraph>
        <a-space direction="vertical" size="large">
          <a-radio-group
            v-model="formForDeviceType.protocolFormat"
            :options="optionsForProtocolFormat"
          />
        </a-space>
      </a-col>
    </a-row>
    <!--分割线-->
    <a-divider orientation="left">请确认以上信息填写无误后，</a-divider>
    <!--按钮区域-->
    <a-row>
      <a-col :span="24">
        <a-space direction="vertical" size="large">
          <a-form-item>
            <a-space>
              <template #split>
                <a-divider direction="vertical" />
              </template>
              <a-button html-type="submit" type="primary">保存&提交</a-button>
              <a-tooltip
                v-if="editObj && !canRemoveOk"
                content="存在关联的设备，禁止删除。"
              >
                <a-button
                  type="primary"
                  status="danger"
                  @click="handleForRemove"
                  >删除</a-button
                >
              </a-tooltip>
              <a-popconfirm
                v-if="editObj && canRemoveOk"
                content="删除后不能恢复，请谨慎操作。"
                type="warning"
                @ok="handleForRemove"
              >
                <a-button type="primary" status="danger">删除</a-button>
              </a-popconfirm>
            </a-space>
          </a-form-item>
        </a-space>
      </a-col>
    </a-row>
  </a-form>
</template>
//--------------------------------------------------------------------------

<script lang="ts" setup>
  // =============
  import { ref, reactive, onMounted } from 'vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useRouter } from 'vue-router';
  // =============
  import { communicationType, protocolFormat } from '@/utils/number-to-string';
  import { opSuccess } from '@/utils';
  import {
    deviceTypeAddForApi,
    ReqDtoAddDeviceType,
    ResDtoGetDeviceType,
    deviceTypeEditForApi,
    ReqDtoEditDeviceType,
    deviceTypeCanRemoveForApi,
    ReqDtoCanRemove,
    deviceTypeRemoveForApi,
    ReqDtoRemove,
  } from '@/api/device';
  // =============
  const router = useRouter();
  const optionsForType = [
    { label: '直连设备', value: 1 },
    { label: '网关', value: 2 },
    { label: '网关子设备', value: 3 },
  ];
  const optionsForCommunicationType1 = [
    101, 102, 103, 104, 105, 106, 107, 199,
  ].map((item) => {
    return { value: item, label: communicationType(item) };
  });
  const optionsForCommunicationType2 = [
    201, 202, 203, 204, 205, 206, 207, 299,
  ].map((item) => {
    return { value: item, label: communicationType(item) };
  });
  const optionsForCommunicationType3 = [
    301, 302, 303, 304, 305, 306, 307, 308, 399,
  ].map((item) => {
    return { value: item, label: communicationType(item) };
  });
  const optionsForProtocolType = [
    { label: 'MQTT', value: 1 },
    { label: 'TCP', value: 2 },
    { label: 'HTTP', value: 3 },
  ];
  const optionsForProtocolFormat1 = [101].map((item) => {
    return { value: item, label: protocolFormat(item) };
  });
  const optionsForProtocolFormat2 = [201, 202, 203].map((item) => {
    return { value: item, label: protocolFormat(item) };
  });
  const optionsForProtocolFormat3 = [301, 302].map((item) => {
    return { value: item, label: protocolFormat(item) };
  });
  const dataForBus = {
    s: [10, 20, 30, 40, 50],
    m: [1, 5, 10, 20, 30, 40, 50, 60],
  };
  // ============= props

  const props = withDefaults(
    defineProps<{
      editObj?: ResDtoGetDeviceType;
    }>(),
    { edit: false, editObj: undefined }
  );
  // ============= ref reactive
  const formForDeviceType = reactive({
    id: props.editObj ? props.editObj.id : undefined,
    name: props.editObj ? props.editObj.name : '',
    type: props.editObj ? props.editObj.type : 1,
    communicationType: props.editObj ? props.editObj.communicationType : 101,
    protocolType: props.editObj ? props.editObj.protocolType : 1,
    protocolFormat: props.editObj ? props.editObj.protocolFormat : 101,
    busTimeUnit: props.editObj ? props.editObj.busTimeUnit : 's',
    busTimeValue: props.editObj ? props.editObj.busTimeValue : 10,
  });
  const optionsForCommunicationType = reactive<any>([]);
  const optionsForProtocolFormat = reactive<any>([]);
  // ============= @event
  const changeForType = (val: any) => {
    if (val === 1) {
      optionsForCommunicationType.splice(0, optionsForCommunicationType.length);
      optionsForCommunicationType1.forEach((item) => {
        optionsForCommunicationType.push(item);
      });
      formForDeviceType.communicationType = 101;
    } else if (val === 2) {
      optionsForCommunicationType.splice(0, optionsForCommunicationType.length);
      optionsForCommunicationType2.forEach((item) => {
        optionsForCommunicationType.push(item);
      });
      formForDeviceType.communicationType = 201;
    } else if (val === 3) {
      optionsForCommunicationType.splice(0, optionsForCommunicationType.length);
      optionsForCommunicationType3.forEach((item) => {
        optionsForCommunicationType.push(item);
      });
      formForDeviceType.communicationType = 301;
    }
  };
  const changeForProtocolType = (val: any) => {
    if (val === 1) {
      optionsForProtocolFormat.splice(0, optionsForProtocolFormat.length);
      optionsForProtocolFormat1.forEach((item) => {
        optionsForProtocolFormat.push(item);
      });
      formForDeviceType.protocolFormat = 101;
    } else if (val === 2) {
      optionsForProtocolFormat.splice(0, optionsForProtocolFormat.length);
      optionsForProtocolFormat2.forEach((item) => {
        optionsForProtocolFormat.push(item);
      });
      formForDeviceType.protocolFormat = 201;
    } else if (val === 3) {
      optionsForProtocolFormat.splice(0, optionsForProtocolFormat.length);
      optionsForProtocolFormat3.forEach((item) => {
        optionsForProtocolFormat.push(item);
      });
      formForDeviceType.protocolFormat = 301;
    }
  };
  const changeForBusTimeUnit = (val: any) => {
    formForDeviceType.busTimeValue = 10;
  };
  const submitForDeviceType = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (!errors) {
      if (values.id) {
        await deviceTypeEditForApi(values as ReqDtoEditDeviceType);
        opSuccess();
      } else {
        await deviceTypeAddForApi(values as ReqDtoAddDeviceType);
        opSuccess();
        router.push({ name: 'DeviceType' });
      }
    }
  };
  const canRemoveOk = ref(false);
  const canRemove = async () => {
    if (formForDeviceType.id) {
      const canRemoveObj = await deviceTypeCanRemoveForApi({
        id: formForDeviceType.id,
      });
      if (canRemoveObj.data.ok === 1) {
        canRemoveOk.value = true;
      }
    }
  };
  const handleForRemove = async () => {
    if (canRemoveOk.value && formForDeviceType.id) {
      await deviceTypeRemoveForApi({ id: formForDeviceType.id });
      opSuccess();
      router.push({ name: 'DeviceType' });
    }
  };

  // ============= step
  changeForType(props.editObj ? props.editObj.type : 1);
  formForDeviceType.communicationType = props.editObj
    ? props.editObj?.communicationType
    : 101;
  changeForProtocolType(props.editObj ? props.editObj.protocolType : 1);
  formForDeviceType.protocolFormat = props.editObj
    ? props.editObj?.protocolFormat
    : 101;
  formForDeviceType.busTimeUnit = props.editObj
    ? props.editObj?.busTimeUnit
    : 's';
  //
  canRemove();
  //
  onMounted(() => {});
</script>

//--------------------------------------------------------------------------

<script lang="ts">
  export default {
    name: 'DeviceTypeFormForAddEdit',
  };
</script>

//--------------------------------------------------------------------------

<style scoped lang="less"></style>
