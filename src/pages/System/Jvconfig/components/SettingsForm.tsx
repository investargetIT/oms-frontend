import { updateMasterJV } from '@/services/System/index';
import { Button, Form, Input, message, Switch } from 'antd';
import React, { useState } from 'react';
import './style.css';
interface closeModal {
  settingModalClose: any;
  tableReload: any;
}
const SettingsForm: React.FC<{ id: string; tableRowData: object }, closeModal> = (props: any) => {
  const { tableRowData } = props;
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const data = tableRowData;

  if (!tableRowData.enabled) {
    data.enabled = '';
  } else {
    data.enabled = 'checked';
  }
  function enabledChange(checked: any) {
    form.getFieldsValue(true).enabled = checked;
    console.log(checked);
  }

  const onFinish = (values: any) => {
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

    updateMasterJV(saveData)
      .then((res: any) => {
        // console.log(res);
        if (res.errCode === 200) {
          props.settingModalClose();
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
    props.settingModalClose();
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
          remark: tableRowData.remarks,
          jvCompanyCode: tableRowData.jvCompanyCode,
          jvCompanyName: tableRowData.jvCompanyName,
          enabled: tableRowData.disable,
        }}
      >
        <div className="ant-advanced-form four-gridCol noBgBordCol">
          <Form.Item
            label="JV Code"
            className="fullLineGrid"
            name="jvCompanyCode"
            rules={[{ required: true, message: 'JV Code不能为空!' }]}
          >
            <Input disabled placeholder="请输入JV Code" allowClear />
          </Form.Item>
          <Form.Item
            label="JV公司名称"
            className="fullLineGrid"
            name="jvCompanyName"
            rules={[{ required: true, message: 'JV公司名称不能为空!' }]}
          >
            <Input placeholder="请输入JV公司名称" allowClear />
          </Form.Item>
          <Form.Item label="审核备注" className="fullLineGrid" name="remark">
            <Input.TextArea showCount maxLength={255} placeholder="请输入备注" allowClear />
          </Form.Item>
          <Form.Item
            className="fullLineGrid"
            label="是否启用"
            name="enabled"
            valuePropName={data.enabled ? data.enabled : 'checked'}
          >
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
              defaultChecked={tableRowData.enabled}
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
export default SettingsForm;
