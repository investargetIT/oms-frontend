import { updateChannelConfig, updateCustomerConfig } from '@/services/SalesOrder/index';
import { Button, Checkbox, Form, Input, message, Switch } from 'antd';
import React, { useState } from 'react';
import './style.css';
interface closeModal {
  settingModalClose: any;
  tableReload: any;
}
const SettingsForm: React.FC<
  { id: string; staffCode: string; type: string; tableRowData: object },
  closeModal
> = (props: any) => {
  const { id, staffCode, type, tableRowData } = props;
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const optionsList = [
    { label: '标记JV', value: 'markJv' },
    { label: 'MDM赋码', value: 'markMdm' },
    { label: '标记切换供应商', value: 'markChangeSupplier' },
    { label: '标记项目单匹配', value: 'markAppointSupplier' },
  ];
  const [isSalesConfirm, setIsSalesConfirm] = useState<any>(
    tableRowData?.needSalesConfirm ? true : false,
  );
  const [saleConfirmList, setSaleConfirmList] = useState<any>([]);
  const data = tableRowData;
  if (!tableRowData.csrCheck) {
    data.csrCheck = '';
  } else {
    data.csrCheck = 'checked';
  }
  if (!tableRowData.needCreditCheck) {
    data.needCreditCheck = '';
  } else {
    data.needCreditCheck = 'checked';
  }

  function csrCheckChange(checked: any) {
    form.getFieldsValue(true).csrCheck = checked;
    console.log(checked);
    console.log(saleConfirmList);
  }
  function csrCheckChangeOrder(checked: any) {
    form.getFieldsValue(true).csrOrderCheck = checked;
    console.log(checked);
  }
  function supportAfterSalesChange(checked: any) {
    form.getFieldsValue(true).supportAfterSales = checked;
  }

  if (!tableRowData.csrOrderCheck) {
    data.csrOrderCheck = '';
  } else {
    data.csrOrderCheck = 'checked';
  }
  if (!tableRowData.needSalesConfirm) {
    data.needSalesConfirm = '';
  } else {
    data.needSalesConfirm = 'checked';
  }
  function needSalesConfirmChange(checked: any) {
    form.getFieldsValue(true).needSalesConfirm = checked;
    setIsSalesConfirm(checked);
    console.log(checked);
  }
  function needCreditCheckChange(checked: any) {
    form.getFieldsValue(true).needCreditCheck = checked;
  }
  if (!tableRowData.enabled) {
    data.enabled = '';
  } else {
    data.enabled = 'checked';
  }
  const initialValues = {
    csrCheck: tableRowData.csrCheck,
    csrOrderCheck: tableRowData.csrOrderCheck,
    needSalesConfirm: tableRowData.needSalesConfirm,
    needCreditCheck: tableRowData.needCreditCheck,
    enabled: tableRowData.enabled,
    preShip: tableRowData.preShip,
    saleConfirmList: [
      tableRowData?.markJv == 1 ? 'markJv' : '',
      tableRowData?.markMdm == 1 ? 'markMdm' : '',
      tableRowData?.markChangeSupplier == 1 ? 'markChangeSupplier' : '',
      tableRowData?.markAppointSupplier == 1 ? 'markAppointSupplier' : '',
    ],
  };
  if (type == 'byChannel') {
    initialValues.remark = tableRowData.remark;
    initialValues.supportAfterSales = tableRowData.supportAfterSales;
  } else {
    initialValues.checkRemark = tableRowData.checkRemark;
  }

  function enabledChange(checked: any) {
    form.getFieldsValue(true).enabled = checked;
    console.log(checked);
  }
  function preShipChange(checked: any) {
    form.getFieldsValue(true).preShip = checked;
  }

  const onFinish = (values: any) => {
    setConfirmLoading(true);
    console.log(values);

    const formData = JSON.parse(JSON.stringify(values));

    // if(saleConfirmList?.filter((io: any) => io =='标记JV' || io=='MDM赋码' ).length==2 || saleConfirmList?.filter((io: any) => io =='标记JV' || io=='MDM赋码' ).length==0){
    //   //满足条件设置
    // }else{
    //   message.error('标记JV和MDM赋码两个都不选或都选') ;
    //   setConfirmLoading(false)
    //   return
    // }
    const saveData = {
      csrCheck: formData.csrCheck,
      csrOrderCheck: formData.csrOrderCheck,
      needSalesConfirm: formData.needSalesConfirm,
      needCreditCheck: formData.needCreditCheck,
      supportAfterSales: formData.supportAfterSales,
      enabled: formData.enabled,
      preShip: formData.preShip ? 1 : 0,
      // 借口是平铺复选框
      saleConfirmList: formData?.saleConfirmList,
      markJv: formData?.saleConfirmList?.includes('markJv') ? 1 : 0,
      markMdm: formData?.saleConfirmList?.includes('markMdm') ? 1 : 0,
      markChangeSupplier: formData?.saleConfirmList?.includes('markChangeSupplier') ? 1 : 0,
      markAppointSupplier: formData?.saleConfirmList?.includes('markAppointSupplier') ? 1 : 0,
    };

    if (formData.needCreditCheck === 'checked') {
      saveData.needCreditCheck = true;
    } else if (formData.needCreditCheck === '') {
      saveData.needCreditCheck = false;
    }
    if (formData.csrCheck === 'checked') {
      saveData.csrCheck = true;
    } else if (formData.csrCheck === '') {
      saveData.csrCheck = false;
    }
    if (formData.csrOrderCheck === 'checked') {
      saveData.csrOrderCheck = true;
    } else if (formData.csrOrderCheck === '') {
      saveData.csrOrderCheck = false;
    }
    if (formData.needSalesConfirm === 'checked') {
      saveData.needSalesConfirm = true;
    } else if (formData.needSalesConfirm === '') {
      saveData.needSalesConfirm = false;
    }
    if (formData.enabled === 'checked') {
      saveData.enabled = true;
    } else if (formData.enabled === '') {
      saveData.enabled = false;
    }
    if (type == 'byChannel') {
      saveData.channel = id;
      saveData.remark = formData.remark;
      updateChannelConfig(saveData)
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
    } else {
      saveData.customerCode = id;
      saveData.checkRemark = formData.checkRemark;
      saveData.staffCode = staffCode;
      updateCustomerConfig(saveData)
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
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const onReset = () => {
    form.resetFields();
    props.settingModalClose();
  };

  return (
    <div id="csrSetting">
      <div className="form-content-search tabs-detail">
        <Form
          className="has-gridForm"
          name="form"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={initialValues}
        >
          <div className="ant-advanced-form four-gridCol noBgBordCol">
            {type == 'byChannel' && (
              <Form.Item label="审核备注" className="fullLineGrid oneLineLabel" name="remark">
                <Input.TextArea showCount maxLength={255} placeholder="请输入备注" allowClear />
              </Form.Item>
            )}
            {type == 'byCustomer' && (
              <Form.Item label="审核备注" className="fullLineGrid oneLineLabel" name="checkRemark">
                <Input.TextArea showCount maxLength={255} placeholder="请输入备注" allowClear />
              </Form.Item>
            )}

            <Form.Item
              className="fullLineGrid largeLabel"
              label="是否需要审核主数据"
              name="csrCheck"
              valuePropName={data.csrCheck ? data.csrCheck : 'checked'}
            >
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                defaultChecked={tableRowData.csrCheck}
                onChange={csrCheckChange}
              />
            </Form.Item>
            <Form.Item
              className="fullLineGrid largeLabel"
              label="是否需要审核订单"
              name="csrOrderCheck"
              valuePropName={data.csrOrderCheck ? data.csrOrderCheck : 'checked'}
            >
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                defaultChecked={tableRowData.csrOrderCheck}
                onChange={csrCheckChangeOrder}
              />
            </Form.Item>
            <Form.Item
              className="fullLineGrid largeLabel"
              label="是否需要销售确认"
              name="needSalesConfirm"
              valuePropName={data.needSalesConfirm ? data.needSalesConfirm : 'checked'}
            >
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                defaultChecked={tableRowData.needSalesConfirm}
                onChange={needSalesConfirmChange}
              />
            </Form.Item>
            {type !== 'byChannel' && (
              <Form.Item
                className="fullLineGrid largeLabel"
                label="是否需要财务审核"
                name="needCreditCheck"
                valuePropName={data.needCreditCheck ? data.needCreditCheck : 'checked'}
              >
                <Switch
                  checkedChildren="是"
                  unCheckedChildren="否"
                  defaultChecked={tableRowData.needCreditCheck}
                  onChange={needCreditCheckChange}
                />
              </Form.Item>
            )}
            {type == 'byChannel' && (
              <Form.Item
                className="fullLineGrid largeLabel"
                label="是否支持售后"
                name="supportAfterSales"
                valuePropName={data.supportAfterSales ? data.supportAfterSales : 'checked'}
              >
                <Switch
                  checkedChildren="是"
                  unCheckedChildren="否"
                  defaultChecked={tableRowData.supportAfterSales}
                  onChange={supportAfterSalesChange}
                />
              </Form.Item>
            )}
            <Form.Item className="fullLineGrid largeLabel" label="是否需要预发货" name="preShip">
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                defaultChecked={tableRowData.preShip}
              />
            </Form.Item>
            <Form.Item
              className="fullLineGrid largeLabel"
              label="启用状态"
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
            {isSalesConfirm && (
              <Form.Item
                className="fullLineGrid largeLabel"
                label="销售确认操作设置"
                name="saleConfirmList"
              >
                <Checkbox.Group options={optionsList} onChange={(val) => setSaleConfirmList(val)} />
              </Form.Item>
            )}
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
