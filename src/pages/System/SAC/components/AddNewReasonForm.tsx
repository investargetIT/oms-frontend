import { saveAfterSalesReason } from '@/services/System/index';
import { getByKeys } from '@/services/utils';
import { ProFormRadio } from '@ant-design/pro-form';
import { Button, Form, Input, InputNumber, message, Row, Switch } from 'antd';
import React, { useState } from 'react';
import './style.css';
interface closeModal {
  addNewModalClose: any;
  tableReload: any;
}
const AddNewReasonForm: React.FC<closeModal> = (props: any) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [costCenterTypeOnly, setCostCenterTypeOnly] = useState<any>(10);

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
      sapReasonCode: formData.sapReasonCode,
      level: 1,
      parentId: null,
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

    console.log(saveData);
    saveAfterSalesReason(saveData)
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

  return (
    <div className="has-gridForm">
      <div className="form-content-search tabs-detail labelAlignRight">
        <Form
          className="has-gridForm"
          name="form"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{
            enabledFlag: true,
          }}
        >
          <div className="ant-advanced-form four-gridCol noBgBordCol">
            <Form.Item
              label="名称"
              className="fullLineGrid"
              name="name"
              rules={[{ required: true, message: '售后原因名称不能为空!' }]}
            >
              <Input showCount maxLength={50} placeholder="请输入售后原因名称" allowClear />
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
    </div>
  );
};
export default AddNewReasonForm;
