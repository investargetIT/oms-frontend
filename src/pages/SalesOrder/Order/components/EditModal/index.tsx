import { updateRemark } from '@/services/SalesOrder';
import { Button, Form, Input, message, Modal } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useModel } from 'umi';
import './index.less';

const Index = function ({}: any, ref: any) {
  const [visible, setVisible] = useState(false);
  const [confirmload, setConfirmload]: any = useState(false);
  const [orderNo, setOrderNo] = useState();
  const { setInitialState, initialState }: any = useModel('@@initialState');
  const [userRemark, setUserRemark]: any = useState();
  const [csrRemark, setCsrRemark]: any = useState();

  const open = async (e: any) => {
    console.log(e, 'e');
    setVisible(true);
    setOrderNo(e);
    if (!initialState?.userRemark || !initialState?.csrRemark) {
      setUserRemark('');
      setCsrRemark('');
    }
    setUserRemark(initialState?.userRemark);
    setCsrRemark(initialState?.csrRemark);
  };
  const close = () => {
    setVisible(false);
  };
  const handleOk = async (): Promise<any> => {
    // ? 弹框点击下一步
    setConfirmload(true);
    // const res = await updateRemark({ userRemark, csrRemark, orderNo });
    // if (res.errCode == 200) {
    //   message.success('更新成功');
    //   // ? 直接返现更改的两个修改后的值
    //   // inverted()
    //   setInitialState((s: any) => ({
    //     ...s,
    //     userRemark,
    //     csrRemark,
    //   }));
    // } else {
    //   message.error('更新失败' + res.errMsg);
    // }
    setVisible(false);
    setConfirmload(false);
  };
  const changeRemark = (e: any) => {
    setUserRemark(e.target.value);
  };
  const changeCRemark = (e: any) => {
    setCsrRemark(e.target.value);
  };
  const afterClose = () => {};
  useImperativeHandle(ref, () => ({
    open,
    close,
  }));
  return (
    <div>
      <Modal
        className="EditMyModal"
        title="编辑备注"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={700}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            取消
          </Button>,
          <Button key="submit" loading={confirmload} type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
        zIndex={1001}
        afterClose={afterClose}
        destroyOnClose={true}
      >
        <Form layout={'horizontal'} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
          <Form.Item label="客户备注">
            <Input.TextArea showCount maxLength={255} value={userRemark} onChange={changeRemark} />
          </Form.Item>
          <Form.Item label="CSR备注">
            <Input.TextArea showCount maxLength={255} value={csrRemark} onChange={changeCRemark} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default forwardRef(Index);
