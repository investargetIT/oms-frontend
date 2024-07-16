import { financeReleaseOrders, getOrderDateList } from '@/services/SalesOrder/index';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import './index.less';
const Index = function ({ tableReload, orderNos, clearSelect }: any, ref: any) {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [ReleaseReasonData, setReleaseReasonData] = useState('');

  useEffect(() => {
    getOrderDateList({ type: 'releaseOrderReason' }).then((res: any) => {
      if (res.errCode === 200) {
        setReleaseReasonData(res.data.dataList);
      }
    });
  }, []);

  const open = () => {
    setVisible(true);
    form.resetFields();
  };
  const close = () => {
    setVisible(false);
    form.resetFields();
  };
  const handleOk = (): any => {
    setConfirmLoading(true);
    form
      .validateFields(['releaseReason'])
      .then(() => {
        const formData = form.getFieldsValue(true);
        const saveData = {
          orderNos: orderNos,
          releaseReason: formData.releaseReason,
          releaseRemark: formData.releaseRemark,
        };
        console.log(saveData);
        financeReleaseOrders(saveData).then((res: any) => {
          console.log(res);
          if (res.errCode === 200) {
            setConfirmLoading(false);
            message.success('订单放单成功！', 3);
            close();
            tableReload();
            clearSelect();
          } else {
            message.error(res.errMsg);
            setConfirmLoading(false);
          }
        });
      })
      .catch((error) => {
        message.error(error, 3);
        setConfirmLoading(false);
      })
      .finally(() => {
        return;
      });
  };
  const onFinish = (values: any) => {
    setConfirmLoading(true);
    const formData = JSON.parse(JSON.stringify(values));
    const saveData = {
      orderNos: orderNos,
      releaseReason: formData.releaseReason,
      releaseRemark: formData.releaseRemark,
    };
    financeReleaseOrders(saveData)
      .then((res: any) => {
        console.log(res);
        if (res.errCode === 200) {
          setConfirmLoading(false);
          message.success('订单放单成功！', 3);
          close();
          tableReload();
        } else {
          message.error(res.errMsg);
          setConfirmLoading(false);
        }
      })
      .finally(() => {
        return;
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo, 3);
  };

  useImperativeHandle(ref, () => ({
    openModal: open,
    closeModal: close,
  }));
  return (
    <div>
      <Modal
        className="FRAudit"
        title="放单"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={500}
        footer={[
          <Button key="back" loading={confirmLoading} onClick={() => setVisible(false)}>
            取消
          </Button>,
          <Button key="submit" loading={confirmLoading} type="primary" onClick={handleOk}>
            确认放单
          </Button>,
        ]}
      >
        <Form
          name="form"
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 22 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="放单原因"
            name="releaseReason"
            rules={[{ required: true, message: '请选择放单原因' }]}
            style={{ flexDirection: 'column', paddingLeft: '20px' }}
          >
            <Select placeholder="请选择放单原因">
              {ReleaseReasonData &&
                ReleaseReasonData.map((item: any) => (
                  <Select.Option key={item.key} value={item.value}>
                    {item.value}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="放单备注"
            name="releaseRemark"
            style={{ flexDirection: 'column', paddingLeft: '20px' }}
          >
            <Input.TextArea
              maxLength={255}
              placeholder="请输入放单备注"
              allowClear
              style={{ height: 70, width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default forwardRef(Index);
