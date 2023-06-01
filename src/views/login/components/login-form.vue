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
        field="email"
        :rules="[
          { required: true, message: '邮箱不能为空' },
          {
            match: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/,
            message: '请输入邮箱',
          },
        ]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input v-model="userInfo.email" placeholder="邮箱：" allow-clear>
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
            checked="day30"
            :model-value="loginConfig.day30"
            @change="setDay30"
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
  import type { ReqDtoLoginOrRegister } from '@/api/user';
  import { sendEmailForApi } from '@/api/user';
  import { regexEmail } from '@/utils';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const loginConfig = useStorage('login-config', {
    email: '',
    validateCode: '',
    day30: false,
  });

  const userInfo = reactive({
    email: loginConfig.value.email,
    validateCode: loginConfig.value.validateCode,
    day30: loginConfig.value.day30,
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
        await userStore.loginOrRegisterForAction(
          values as ReqDtoLoginOrRegister
        );
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        router.push({
          name: (redirect as string) || 'Workplace',
          query: {
            ...othersQuery,
          },
        });
        Message.success(t('login.form.login.success'));
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);
      }
    }
  };
  const setDay30 = (value: any) => {
    loginConfig.value.day30 = value;
  };

  const validateCodeText = ref('获取验证码');
  let validateCodeInterval: number;
  let validateCodeIntervalTime = 120;
  const handleValidateCodeButton = async () => {
    if (!regexEmail.test(userInfo.email)) {
      return;
    }
    if (
      (validateCodeText.value === '获取验证码' ||
        validateCodeText.value === '重新获取') &&
      !validateCodeInterval
    ) {
      //
      await sendEmailForApi({ email: userInfo.email });
      //
      validateCodeText.value = `${validateCodeIntervalTime} s`;
      validateCodeInterval = window.setInterval(() => {
        if (validateCodeIntervalTime <= 0) {
          clearInterval(validateCodeInterval);
          validateCodeText.value = '重新获取';
          validateCodeInterval = 0;
          validateCodeIntervalTime = 120;
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
