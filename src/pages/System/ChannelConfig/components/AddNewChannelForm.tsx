import { getOrderDateList } from '@/services/SalesOrder';
import { createChannel } from '@/services/System/index';
import { Button, Form, Input, InputNumber, message, Select, Switch, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import './style.css';
interface closeModal {
  addNewModalClose: any;
  tableReload: any;
}
const AddNewChannelForm: React.FC<closeModal> = (props: any) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [sourceChannelList, setSourceChannelList]: any = useState([]);
  const [getSourceChannel, setGetSourceChannel]: any = useState('');
  useEffect(() => {
    getOrderDateList({ type: 'channelType' }).then((res: any) => {
      if (res.errCode === 200) {
        setSourceChannelList(res.data.dataList);
      }
    });
  }, []);
  function enabledChange(checked: any) {
    form.getFieldsValue(true).enabled = checked;
    console.log(checked);
  }
  const sourceChannelCodeSelect = (value, Option) => {
    console.log(Option.label);
    setGetSourceChannel(Option.label);
  };
  const onFinish = (values: any) => {
    setConfirmLoading(true);
    const formData = JSON.parse(JSON.stringify(values));

    const saveData = {
      remark: formData.remark,
      channel: formData.channel,
      channelName: formData.channelName,
      enabled: formData.enabled,
      sapChannel: formData.sapChannel,
      sourceChannel: getSourceChannel,
      sourceChannelCode: formData.sourceChannelCode,
      consumptionEnabled: formData.consumptionEnabled,
    };

    if (formData.enabled === 'checked') {
      saveData.enabled = true;
    } else if (formData.enabled === '') {
      saveData.enabled = false;
    }
    console.log(saveData);
    createChannel(saveData)
      .then((res: any) => {
        console.log(res);
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
  const limitDecimals: any = (value: string) => {
    if (value == null) {
      return '0';
    } else {
      return value
        .replace(/[^\d.]/g, '')
        .replace(/^\./g, '')
        .replace(/\.{2,}/g, '.')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
      // .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      // .replace(/\$\s?|(,*)/g, '');
    }
  };

  return (
    <div className=" tabs-detail">
      <Form
        className="has-gridForm"
        name="form"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        labelWrap
        initialValues={{
          enabled: true,
          consumptionEnabled: 1,
        }}
      >
        <div className="ant-advanced-form four-gridCol noBgBordCol">
          <Form.Item
            label="渠道号(数字)"
            className="fullLineGrid"
            name="channel"
            rules={[{ required: true, message: '渠道号不能为空!' }]}
          >
            <InputNumber
              precision={0}
              formatter={limitDecimals}
              parser={limitDecimals}
              style={{ width: '100%' }}
              min={1}
              placeholder="请输入渠道号"
            />
          </Form.Item>
          <Form.Item
            label="渠道名称"
            className="fullLineGrid"
            name="channelName"
            rules={[{ required: true, message: '渠道名称不能为空!' }]}
          >
            <Input showCount maxLength={50} placeholder="请输入渠道名称" allowClear />
          </Form.Item>
          <Form.Item
            label="映射SAP渠道号"
            className="fullLineGrid"
            name="sapChannel"
            rules={[{ required: true, message: '映射SAP渠道号不能为空!' }]}
          >
            <Input showCount maxLength={50} placeholder="请输入映射SAP渠道号" allowClear />
          </Form.Item>
          <Form.Item
            label="外围渠道类型"
            className="fullLineGrid"
            name="sourceChannelCode"
            rules={[{ required: true, message: '请选择外围渠道类型!' }]}
          >
            <Select placeholder="请选择外围渠道类型" onSelect={sourceChannelCodeSelect}>
              {sourceChannelList &&
                sourceChannelList.map((item: any) => (
                  <Select.Option key={item.key} value={item.key} label={item.value}>
                    {item.value}
                  </Select.Option>
                ))}
            </Select>
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
          <Form.Item
            className="fullLineGrid"
            label="报备消耗是否启用二级采购单位"
            name="consumptionEnabled"
            rules={[{ required: true, message: '不能为空!' }]}
          >
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
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
