import React, { useState } from 'react';
import { Button, Form, message, Radio, Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { RadioChangeEvent } from 'antd';
import { updatePricingMethod } from '@/services/SalesOrder/index';
import './style.less';

interface modalData {
  orderNo?: any;
  customerCode?: any;
  oPricingMethod?: any;
  close?: any;
  handleData?: any;
  clearChageArr?: any;
  detailTableReload?: any;
}
const ApplyForm: React.FC<modalData> = (props) => {
  const { customerCode, oPricingMethod, orderNo } = props;
  const [applyForm] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onCRMChange = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const onMethodChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
  };

  const onFinish = (values: any) => {
    setConfirmLoading(true);
    const formData = JSON.parse(JSON.stringify(values));
    if (values.isToCrm) {
      formData.isToCrm = 1;
    } else {
      formData.isToCrm = 0;
    }
    const saveData = {
      orderNo: orderNo,
      customerCode: customerCode,
      oPricingMethod: formData.oPricingMethod,
      isToCrm: formData.isToCrm,
    };

    updatePricingMethod(saveData)
      .then((res: any) => {
        if (res.errCode === 200) {
          const temp: any = res?.data?.salesOrderSnapshotRespVo;
          const defauleParams: any = {
            ...temp,
            ...temp.salesOrderRespVo,
            ...temp.salesOrderReceiverRespVo,
            ...temp.salesOrderInvoiceInfoRespVo,
          };

          props.handleData(defauleParams);
          props.clearChageArr();
          props.detailTableReload();
          props.close();
          setConfirmLoading(false);
          message.success('计价方式修改成功', 3);
          applyForm.resetFields();
        } else {
          message.error(res.errMsg);
          setConfirmLoading(false);
        }
      })
      .finally(() => {
        return;
      });

    // const formData = new FormData();
    // if (values.UploadApplyField && values.UploadApplyField.length > 0) {
    //   values.UploadApplyField.forEach((file) => {
    //     formData.append('files', file);
    //   });
    // }

    // console.log('Success:', values);

    //  setTimeout(() => {
    //    props.close();
    // props.detailTableReload();
    //    setConfirmLoading(false);
    //    message.success('特殊需求申请提交成功', 3);
    //    applyForm.resetFields();
    //  }, 2000);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const onReset = () => {
    applyForm.resetFields();
    props.close();
  };

  return (
    <div id="pricingMethodForm">
      <div className="form-content-search tabs-detail">
        <Form
          name="applyForm"
          form={applyForm}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{
            oPricingMethod: oPricingMethod,
            isToCrm: 1,
          }}
        >
          <div className="" style={{ margin: '0 20px' }}>
            <Form.Item
              label="选择计价方式"
              name="oPricingMethod"
              value={oPricingMethod}
              rules={[{ required: true, message: '请选择计价方式!' }]}
            >
              <Radio.Group onChange={onMethodChange}>
                <Radio key={1} value={1}>
                  {' '}
                  含税模式{' '}
                </Radio>
                <Radio key={2} value={2}>
                  {' '}
                  未税模式 - 2位精度{' '}
                </Radio>
                <Radio key={3} value={3}>
                  {' '}
                  未税模式 - 4位精度{' '}
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="isToCrm" valuePropName="checked">
              <Checkbox onChange={onCRMChange}>保存修改结果到CRM客户主数据</Checkbox>
            </Form.Item>
            <p style={{ color: '#bbb' }}>
              注：
              <br />
              1.
              计算精度指计算过程中按指定位数计算，计算结果仍然会保留到2位小数（包括成交价、小计、折扣）
              <br />
              2.
              不勾选“保存修改结果到CRM客户主数据”时，仅对本次审核订单重新计算价格，不影响客户后续订单价格计算
              <br />
            </p>
          </div>

          <div className="ant-modal-footer">
            <Button htmlType="button" onClick={onReset}>
              取 消
            </Button>
            <Button type="primary" htmlType="submit" loading={confirmLoading}>
              确定并更新价格
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default ApplyForm;
