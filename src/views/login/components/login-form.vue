<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">{{ $t('login.form.title') }}</div>
    <div class="login-form-sub-title">{{ $t('login.form.subtitle') }}</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
      ref="loginForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        field="username"
        :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.username"
          :placeholder="$t('login.form.userName.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="validateCode"
        :rules="[
          { required: true, message: $t('login.form.validateCode.errMsg') },
        ]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.validateCode"
          :placeholder="$t('login.form.validateCode.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
          <template #append>
            <a-button type="text" long @click="handleValidateCodeButton">{{
              validateCodeText
            }}</a-button>
          </template>
          <template #button-icon> </template>
        </a-input>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-validateCode-actions">
          <a-checkbox
            checked="rememberValidateCode"
            :model-value="loginConfig.rememberValidateCode"
            @change="setRememberValidateCode"
          >
            {{ $t('login.form.30daysNoLoginRequired') }}
          </a-checkbox>
        </div>
        <a-button type="primary" html-type="submit" long :loading="loading">
          {{ $t('login.form.login') + '/' + $t('login.form.register') }}
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useStorage } from '@vueuse/core';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import type { LoginData } from '@/api/user';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const loginConfig = useStorage('login-config', {
    rememberValidateCode: true,
    username: '',
    validateCode: '',
  });
  const userInfo = reactive({
    username: loginConfig.value.username,
    validateCode: loginConfig.value.validateCode,
  });

  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      setLoading(true);
      try {
        await userStore.login(values as LoginData);
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        router.push({
          name: (redirect as string) || 'Workplace',
          query: {
            ...othersQuery,
          },
        });
        Message.success(t('login.form.login.success'));
        const { rememberValidateCode } = loginConfig.value;
        const { username, validateCode } = values;
        // 实际生产环境需要进行加密存储。
        // The actual production environment requires encrypted storage.
        loginConfig.value.username = rememberValidateCode ? username : '';
        loginConfig.value.validateCode = rememberValidateCode
          ? validateCode
          : '';
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);
      }
    }
  };
  const setRememberValidateCode = (value: any) => {
    loginConfig.value.rememberValidateCode = value;
  };

  const validateCodeText = ref('获取验证码');
  let validateCodeInterval: number;
  let validateCodeIntervalTime = 10;
  const handleValidateCodeButton = async () => {
    if (
      (validateCodeText.value === '获取验证码' ||
        validateCodeText.value === '重新获取') &&
      !validateCodeInterval
    ) {
      validateCodeText.value = `${validateCodeIntervalTime} s`;
      validateCodeInterval = setInterval(() => {
        if (validateCodeIntervalTime <= 0) {
          clearInterval(validateCodeInterval);
          validateCodeText.value = '重新获取';
          validateCodeInterval = 0;
          validateCodeIntervalTime = 10;
          return;
        }
        validateCodeIntervalTime -= 1;
        validateCodeText.value = `${validateCodeIntervalTime} s`;
      }, 1000);
    }
  };
</script>

<style lang="less" scoped>
  .login-form {
    &-wrapper {
      width: 320px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-validateCode-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
</style>
