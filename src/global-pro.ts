// ----------------
import { Message } from '@arco-design/web-vue';
// ----------------
function opSuccess() {
  Message.info({ content: '操作成功' });
}
export default {
  install: (app: any) => {
    app.config.globalProperties.$opSuccess = opSuccess;
  },
};
