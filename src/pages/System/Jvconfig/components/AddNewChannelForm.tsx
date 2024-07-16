import { saveMasterJV } from '@/services/System/index';
import { Button, Form, Input, message, Switch } from 'antd';
import React, { useState } from 'react';
import './style.css';
interface closeModal {
  addNewModalClose: any;
  tableReload: any;
}
const AddNewChannelForm: React.FC<closeModal> = (props: any) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  function enabledChange(checked: any) {
    form.getFieldsValue(true).enabled = checked;
    // console.log(checked);
  }
  const onFinish = (values: any) => {
    // console.log(values, 'values');
    setConfirmLoading(true);
    const formData = JSON.parse(JSON.stringify(values));
    const saveData: any = {
      jvCompanyCode: formData.jvCompanyCode,
      jvCompanyName: formData.jvCompanyName,
      remarks: formData.remark,
      disable: formData.enabled,
    };
    if (formData.enabled === 'checked') {
      saveData.enabled = true;
    } else if (formData.enabled === '') {
      saveData.enabled = false;
    }
    // console.log(saveData);
    saveMasterJV(saveData)
      .then((res: any) => {
        // console.log(res);
        if (res.errCode === 200) {
          props.addNewModalClose();
          setConfirmLoading(false);
          message.success('设置成功', 3);
          form.resetFields();
          props.tableReload();
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
    console.log('Failed:', errorInfo);
  };
  const onReset = () => {
    form.resetFields();
    props.addNewModalClose();
  };
  return (
    <div className="form-content-search tabs-detail labelAlignRight">
      <Form
        className="has-gridForm"
        name="form"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        initialValues={{
          enabled: true,
        }}
      >
        <div className="ant-advanced-form four-gridCol noBgBordCol">
          <Form.Item
            label="JV Code"
            className="fullLineGrid"
            name="jvCompanyCode"
            rules={[{ required: true, message: 'JV Code不能为空!' }]}
          >
            <Input style={{ width: '100%' }} min={1} placeholder="请输入JV Code" />
          </Form.Item>
          <Form.Item
            label="JV公司名称"
            className="fullLineGrid"
            name="jvCompanyName"
            rules={[{ required: true, message: 'JV公司名称不能为空!' }]}
          >
            <Input style={{ width: '100%' }} placeholder="请输入JV公司名称" allowClear />
          </Form.Item>
          <Form.Item label="审核备注" className="fullLineGrid" name="remark">
            <Input.TextArea showCount maxLength={255} placeholder="请输入备注" allowClear />
          </Form.Item>
          <Form.Item
            className="fullLineGrid"
            label="是否启用"
            name="enabled"
            valuePropName={'checked'}
          >
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
              defaultChecked={true}
              onChange={enabledChange}
            />
          </Form.Item>
        </div>

        <div className="ant-modal-footer">
          <Button htmlType="button" key="cancel" onClick={onReset}>
            取 消
          </Button>
          <Button type="primary" key="submit" htmlType="submit" loading={confirmLoading}>
            确 定
          </Button>
        </div>
      </Form>
    </div>
  );
};
export default AddNewChannelForm;
