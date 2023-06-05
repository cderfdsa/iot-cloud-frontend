<template>
  <div class="container">
    <Breadcrumb
      :items="['menu.deviceManage', 'menu.deviceManage.deviceType']"
    />
    <a-card class="general-card" :title="$t('menu.deviceManage.deviceType')">
      <!-- 查询区域-->
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="searchKey" label="模糊搜索">
                  <a-input
                    v-model="formModel.searchKey"
                    placeholder="请输入类型名称"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 40px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
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
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            {{ $t('searchTable.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
        </a-col>
      </a-row>
      <!-- 列表区域-->
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + pagination.offset }}
        </template>
        <template #name="{ record }">
          <router-link
            :to="{ name: 'DeviceTypeEdit', query: { id: record.id } }"
            >{{ record.name }}</router-link
          >
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick, inject } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import useLoading from '@/hooks/loading';
  import {
    deviceTypePageForApi,
    ReqDtoPageDeviceType,
    ResDtoPageDeviceType,
    deviceTypeRemoveForApi,
    ReqDtoRemove,
  } from '@/api/device';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import {
    deviceType,
    communicationType,
    protocolType,
    protocolFormat,
  } from '@/utils/number-to-string';
  import { opSuccess } from '@/utils';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const router = useRouter();

  const generateFormModel = () => {
    return {
      searchKey: '',
      status: '',
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<ResDtoPageDeviceType[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    offset: 0,
    rows: 10,
    total: 0,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const densityList = computed(() => [
    {
      name: t('searchTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('searchTable.size.small'),
      value: 'small',
    },
    {
      name: t('searchTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('searchTable.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: '类型名称',
      dataIndex: 'name',
      slotName: 'name',
    },
    {
      title: '核心类型',
      dataIndex: 'typeStr',
    },
    {
      title: '通信方式',
      dataIndex: 'communicationTypeStr',
    },
    {
      title: '协议类型',
      dataIndex: 'protocolTypeStr',
    },
    {
      title: '协议格式',
      dataIndex: 'protocolFormatStr',
    },
    {
      title: '轮询时间',
      dataIndex: 'busTimeStr',
    },
  ]);
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: '在线',
      value: 1,
    },
    {
      label: '离线',
      value: 2,
    },
  ]);
  //
  const fetchData = async (
    params: ReqDtoPageDeviceType = { offset: 0, rows: 10, searchKey: '' }
  ) => {
    setLoading(true);
    try {
      const { data } = await deviceTypePageForApi(params);
      data.list.forEach((item) => {
        item.typeStr = deviceType(item.type);
        item.communicationTypeStr = communicationType(item.communicationType);
        item.protocolTypeStr = protocolType(item.protocolType);
        item.protocolFormatStr = protocolFormat(item.protocolFormat);
        if (item.busTimeValue) {
          item.busTimeStr = item.busTimeValue + item.busTimeUnit;
        } else {
          item.busTimeStr = '--';
        }
      });
      renderData.value = data.list;
      pagination.offset = data.offset;
      pagination.rows = data.rows;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as ReqDtoPageDeviceType);
  };
  const onPageChange = (current: number) => {
    fetchData({
      ...basePagination,
      offset: (current - 1) * 10,
      searchKey: formModel.value.searchKey,
    });
  };

  fetchData();

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    size.value = val as SizeProps;
  };

  const handleChange = (
    checked: boolean | (string | boolean | number)[],
    column: Column,
    index: number
  ) => {
    if (!checked) {
      cloneColumns.value = showColumns.value.filter(
        (item) => item.dataIndex !== column.dataIndex
      );
    } else {
      cloneColumns.value.splice(index, 0, column);
    }
  };

  const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
  ): T => {
    const newArray = isDeep ? cloneDeep(array) : array;
    if (beforeIdx > -1 && newIdx > -1) {
      // 先替换后面的，然后拿到替换的结果替换前面的
      newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
      );
    }
    return newArray;
  };

  const popupVisibleChange = (val: boolean) => {
    if (val) {
      nextTick(() => {
        const el = document.getElementById('tableSetting') as HTMLElement;
        const sortable = new Sortable(el, {
          onEnd(e: any) {
            const { oldIndex, newIndex } = e;
            exchangeArray(cloneColumns.value, oldIndex, newIndex);
            exchangeArray(showColumns.value, oldIndex, newIndex);
          },
        });
      });
    }
  };

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );

  //----------------------------------------
  const clickForAdd = () => {
    router.push({ name: 'DeviceTypeAdd' });
  };
  const clickForEdit = (record: any) => {
    router.push({
      name: 'DeviceTypeEdit',
      query: {
        id: record.id,
      },
    });
  };
  const clickForDelete = async (record: any) => {
    await deviceTypeRemoveForApi({ id: record.id } as ReqDtoRemove);
    opSuccess();
    fetchData();
  };
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

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
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }
  .setting {
    display: flex;
    align-items: center;
    width: 200px;
    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
