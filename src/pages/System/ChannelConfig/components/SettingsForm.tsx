import { getOrderDateList } from '@/services/SalesOrder';
import { updateChannel } from '@/services/System/index';
import { Button, Form, Input, message, Select, Switch, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import './style.css';
interface closeModal {
  settingModalClose: any;
  tableReload: any;
}
const SettingsForm: React.FC<{ id: string; tableRowData: object }, closeModal> = (props: any) => {
  const { id, tableRowData } = props;
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [sourceChannelList, setSourceChannelList]: any = useState([]);
  const [getSourceChannel, setGetSourceChannel]: any = useState(tableRowData.sourceChannel);
  useEffect(() => {
    getOrderDateList({ type: 'channelType' }).then((res: any) => {
      if (res.errCode === 200) {
        setSourceChannelList(res.data.dataList);
      }
    });
    //设置select初始值
    // form.setFieldsValue({
    //   sourceChannel: sourceChannelList && sourceChannelList[0] ? sourceChannelList[0].key : '',
    // });
  }, []);
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

    updateChannel(saveData)
      .then((res: any) => {
        console.log(res);
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
    <div className=" tabs-detail">
      <Form
        className="has-gridForm"
        name="form"
        form={form}
        onFinish={onFinish}
        labelWrap
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        initialValues={{
          remark: tableRowData.remark,
          channel: id,
          channelName: tableRowData.channelName,
          enabled: tableRowData.enabled,
          sapChannel: tableRowData.sapChannel,
          sourceChannelCode: tableRowData.sourceChannelCode,
          consumptionEnabled: tableRowData.consumptionEnabled,
        }}
      >
        <div className="ant-advanced-form four-gridCol noBgBordCol">
          <Form.Item
            label="渠道号"
            className="fullLineGrid"
            name="channel"
            rules={[{ required: true, message: '渠道号不能为空!' }]}
          >
            <Input bordered={false} readOnly={true} style={{ color: '#1890FF' }} />
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
            valuePropName={data.enabled ? data.enabled : 'checked'}
          >
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
              defaultChecked={tableRowData.enabled}
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
export default SettingsForm;
