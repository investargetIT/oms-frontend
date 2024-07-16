import { updateStorageLocation, updateWareHouseCustomer } from '@/services/SalesOrder';
import { Button, Input, message, Modal } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
const Index = function ({ houseInfo, fn, fn2 }: any, ref: any) {
  const [visible, setVisible] = useState(false);
  const [location, setLocation] = useState();
  const [Record, setRecord]: any = useState();
  const [tableNo, setNumber]: any = useState();

  const open = async (record: any, tableno: number, sCode?: any) => {
    setRecord(record);
    setVisible(true);
    setNumber(tableno); //?记录是第几个表格进来的关闭的时候刷新对应的表格
    setLocation(sCode); //?回显原来的装运点code
  };
  const close = () => {
    setVisible(false);
  };
  const handleOk = async () => {
    // ? 弹框点击下一步
    if (tableNo == 2) {
      const res = await updateWareHouseCustomer({
        wareCode: houseInfo.wareCode,
        storageLocation: location,
        customerCode: Record.customerCode,
      });
      if (res.errCode === 200) {
        message.success('编辑成功');
        setVisible(false);
        fn2(); //?刷新表格2
      } else {
        message.error(res.errMsg);
        setVisible(false);
      }
    } else {
      const res = await updateStorageLocation({
        storageLocation: location,
        sid: houseInfo.sid,
      });
      if (res.errCode === 200) {
        message.success('编辑成功');
        setVisible(false);
        fn(); //?刷新表格1
      } else {
        message.error(res.errMsg);
        setVisible(false);
      }
    }
  };
  const changeInput = (e: any) => {
    setLocation(e.target.value);
  };
  useImperativeHandle(ref, () => ({
    openModal: open,
    closeModal: close,
  }));
  return (
    <div>
      <Modal
        title="编辑客户装运点"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={500}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        <div>请填写装运点代码：</div>
        <Input value={location} onChange={changeInput} />
      </Modal>
    </div>
  );
};
export default forwardRef(Index);
