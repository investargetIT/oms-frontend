import { saveAfterSalesReason } from '@/services/System/index';
import { getByKeys } from '@/services/utils';
import { ProFormRadio } from '@ant-design/pro-form';
import { Button, Form, Input, InputNumber, message, Row, Switch } from 'antd';
import React, { useState } from 'react';
import './style.css';
interface closeModal {
  settingModalClose: any;
  tableReload: any;
}
const SettingsForm: React.FC<
  {
    id: string;
    tableRowData: object;
    editType: string;
    getParent: string;
    switchDisabled: boolean;
  },
  closeModal
> = (props: any) => {
  const { id, tableRowData, editType, getParent, switchDisabled } = props;
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading]: any = useState(false);
  const [costCenterTypeOnly, setCostCenterTypeOnly] = useState<any>(
    tableRowData?.costCenterType || 10,
  );
  const parentData = getParent;
  const settingData = tableRowData;

  if (tableRowData.enabledFlag === 0) {
    settingData.enabledFlag = '';
  } else if (tableRowData.enabledFlag === 1) {
    settingData.enabledFlag = 'checked';
  }

  if (editType === 'add') {
    settingData.name = '';
    settingData.remark = '';
    settingData.sapReasonCode = '';
  } else {
    settingData.name = tableRowData.name;
    settingData.remark = tableRowData.remark;
    settingData.sapReasonCode = tableRowData.sapReasonCode;
    settingData.oaCode = tableRowData.oaCode;
    settingData.costCenter = tableRowData.costCenter;
    settingData.costCenterType = tableRowData.costCenterType;

    if (tableRowData.level === 1) {
      settingData.parentId = null;
    }
  }

  function enabledChange(checked: any) {
    form.getFieldsValue(true).enabledFlag = checked;
    console.log(checked);
  }

  const onFinish = (values: any) => {
    setConfirmLoading(true);
    const formData = JSON.parse(JSON.stringify(values));
    const saveData = {
      name: formData.name,
      remark: formData.remark,
      enabledFlag: formData.enabledFlag,
      level: formData.level,
      parentId: formData.parentId,
      sapReasonCode: formData.sapReasonCode,
      oaCode: formData.oaCode,
      costCenter: formData.costCenter,
      costCenterType: formData.costCenterType,
    };

    if (formData.enabledFlag) {
      saveData.enabledFlag = 1;
    } else if (!formData.enabledFlag) {
      saveData.enabledFlag = 0;
    }
    if (formData.enabledFlag === 'checked') {
      saveData.enabledFlag = 1;
    } else if (formData.enabledFlag === '') {
      saveData.enabledFlag = 0;
    }
    if (editType === 'edit') {
      saveData.sid = id;
      if (formData.level === 1) {
        saveData.parentId = null;
      }
    } else if (editType === 'add') {
      saveData.parentId = id;
      saveData.level = Number(formData.level) + 1;
    }
    console.log(saveData);
    saveAfterSalesReason(saveData)
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
    <div className="has-gridForm">
      <div className="form-content-search tabs-detail labelAlignRight j">
        <Form
          className="has-gridForm"
          name="form"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{
            sid: settingData.sid,
            name: settingData.name,
            remark: settingData.remark,
            enabledFlag: settingData.enabledFlag,
            level: settingData.level,
            parentId: settingData.parentId,
            parentName: parentData,
            sapReasonCode: settingData.sapReasonCode,
            oaCode: settingData.oaCode,
            costCenter: settingData.costCenter,
            costCenterType: settingData.costCenterType,
          }}
        >
          <div className="ant-advanced-form four-gridCol noBgBordCol">
            {/* {editType === 'edit' && (
              <Form.Item label="原因Code" className="fullLineGrid" name="sid">
                <Input bordered={false} readOnly={true} style={{ color: '#1890FF' }} />
              </Form.Item>
            )} */}
            <Form.Item
              label="名称"
              className="fullLineGrid"
              name="name"
              rules={[{ required: true, message: '售后原因名称不能为空!' }]}
            >
              <Input showCount maxLength={50} placeholder="请输入售后原因名称" allowClear />
            </Form.Item>
            {((settingData.level != 1 && editType == 'edit') || editType === 'add') && (
              <Form.Item label="父级节点" className="fullLineGrid" name="parentName">
                <Input bordered={false} readOnly={true} style={{ color: '#1890FF' }} />
              </Form.Item>
            )}
            <Form.Item name="level" className="no" style={{ display: 'none' }}>
              <Input />
            </Form.Item>
            <Form.Item name="parentId" className="no" style={{ display: 'none' }}>
              <Input />
            </Form.Item>

            <Form.Item label="SAP订单原因" className="fullLineGrid" name="sapReasonCode">
              <Input showCount maxLength={50} placeholder="请输入SAP订单原因" allowClear />
            </Form.Item>

            <Form.Item label="备注说明" className="fullLineGrid" name="remark">
              <Input.TextArea showCount maxLength={255} placeholder="请输入备注" allowClear />
            </Form.Item>

            <Form.Item label="OA流程code" className="fullLineGrid" name="oaCode">
              <InputNumber min={0} maxLength={10} placeholder="请输入" style={{ width: '410px' }} />
            </Form.Item>

            <Row className="rowRadioCost fullLineGrid">
              <ProFormRadio.Group
                label="成本中心"
                name="costCenterType"
                initialValue={10}
                fieldProps={{
                  onChange: (ev: any) => {
                    setCostCenterTypeOnly(ev.target.value);
                    if (ev.target.value != 10) {
                      form.setFieldsValue({
                        costCenter: '',
                      });
                    }
                  },
                }}
                request={async () => {
                  let list = [] as any;
                  await getByKeys({ list: ['costCenterEnum'] }).then((res: any) => {
                    if (res?.errCode === 200) {
                      list = res?.data[0]?.enums.map((ic: any) => ({
                        ...ic,
                        value: ic.code,
                        label: ic.name,
                      }));
                    }
                  });
                  return list;
                }}
              />
            </Row>

            <Form.Item name="costCenter" className="fullLineGrid" style={{ paddingLeft: '110px' }}>
              <Input
                showCount
                maxLength={20}
                placeholder="请输入"
                allowClear
                required={costCenterTypeOnly == 10 ? true : false}
                disabled={costCenterTypeOnly == 10 ? false : true}
              />
            </Form.Item>
            <Form.Item
              className="fullLineGrid"
              label="是否启用"
              name="enabledFlag"
              valuePropName={'checked'}
            >
              <Switch
                disabled={switchDisabled}
                checkedChildren="启用"
                unCheckedChildren="禁用"
                defaultChecked={settingData.enabledFlag}
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
    </div>
  );
};
export default SettingsForm;
