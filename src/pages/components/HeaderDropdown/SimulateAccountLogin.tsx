import React, { useState } from 'react';
import { Form, message, Spin, Button } from 'antd';
import WorkerCommon from './WorkerCommon';
import { toggleLogin, currentUser as queryCurrentUser } from '@/services/login';
import { history } from 'umi';
import Cookies from 'js-cookie';
interface detailInfo {
  modalClose: any;
}
const Index: React.FC<detailInfo> = (props: any) => {
  // const { initialState, setInitialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const [load, setLoad]: any = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // const fetchUserInfo = async () => {
  //   const userInfo = await initialState?.fetchUserInfo?.();
  //   const authMenus = await initialState?.fetchLoadAuthMenus?.();
  //   if (userInfo && authMenus) {
  //     await setInitialState((s) => ({
  //       ...s,
  //       currentUser: userInfo,
  //       authMenus: authMenus,
  //     }));
  //     /** 此方法会跳转到 redirect 参数所在的位置 */
  //     if (!history) return;
  //     const { query } = history.location;
  //     const { redirect } = query as { redirect: string };
  //     // message.success('模拟账号切换成功', 3);
  //     window.location.href = redirect || '/home';
  //   }
  // };
  const onReset = () => {
    form.resetFields();
    props.modalClose();
  };

  const onFinish = async (values: any) => {
    setConfirmLoading(true);
    setLoad(true);
    try {
      const formData = {
        jobNumber: values.workcode,
      };
      // const res = await toggleLogin(formData);
      // if (res && res.errCode === 200) {
      //   Cookies.remove('ssoToken', '');
      //   if (res?.data?.token) Cookies.set('ssoToken', res.data.token);
      //   const msg = await queryCurrentUser();
      //   if (msg && msg.errCode === 200) {
      //     setTimeout(() => {
      //       onReset();
      //       setLoad(false);
      //       setConfirmLoading(false);
      //       message.success('模拟账号切换成功', 3);
      //       if (!history) return;
      //       const { query } = history.location;
      //       const { redirect } = query as { redirect: string };
      //       window.location.href = redirect || '/home';
      //     }, 1000);
      //     // await fetchUserInfo();
      //   } else {
      //     message.error(msg?.errMsg + '!该账户暂无法登录！');
      //     const newCookies = localStorage.getItem('default_token');
      //     Cookies.set('ssoToken', newCookies);
      //     setTimeout(() => {
      //       onReset();
      //       setLoad(false);
      //       setConfirmLoading(false);
      //     }, 1000);
      //     // await fetchUserInfo();
      //   }
      //   return;
      // } else {
      //   message.error(res?.errMsg || '该模拟账号切换失败！');
      //   setLoad(false);
      //   setConfirmLoading(false);
      // }
    } catch (errorInfo) {
      message.error('该模拟账号切换失败！', 3);
      setLoad(false);
      setConfirmLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo, 3);
    setConfirmLoading(false);
  };

  return (
    <Spin spinning={load}>
      <Form
        name="form"
        form={form}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        initialValues={{}}
        style={{ paddingTop: '20px' }}
      >
        <Form.Item
          name="workcode"
          label="模拟账号"
          rules={[{ required: true, message: '模拟账号为必填!' }]}
        >
          <WorkerCommon />
        </Form.Item>

        <div className="ant-modal-footer" style={{ marginTop: '40px' }}>
          <Button htmlType="button" onClick={onReset}>
            取 消
          </Button>
          <Button type="primary" htmlType="submit" loading={confirmLoading}>
            确认提交
          </Button>
        </div>
      </Form>
    </Spin>
  );
};
export default Index;
