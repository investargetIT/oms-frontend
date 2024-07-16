/* eslint-disable @typescript-eslint/no-unused-expressions */

import { delayDate } from '@/services/InquirySheet';
import ProForm, {
  ProFormDatePicker,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { Button, Form, message } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import './index.less';

interface ApplyDateProps {
  info: Record<any, any>;
  onClose: (status: any) => void;
}

const ApplyDate: React.FC<ApplyDateProps> = ({ info, onClose }) => {
  const [form] = Form.useForm();
  const [extendDays] = useState<any>(30);
  const [applyQuotValidDate] = useState<any>(moment(info.quotValidDate).add(30, 'days'));

  const submit = async (values: any) => {
    console.log(values);
    const par = {
      sid: info.sid,
      ...values,
    };
    const { errCode, errMsg } = await delayDate(par);
    if (errCode === 200) {
      message.success('申请成功');
      onClose && onClose(false);
    } else {
      message.error(errMsg);
    }
  };

  return (
    <div id="quotationAskForExtensionOfValidity">
      <div className="form-content-search">
        <ProForm
          className="has-gridForm"
          form={form}
          layout="horizontal"
          onFinish={(values) => submit(values)}
          onFinishFailed={() => {
            message.warning('您有未完善的信息，请填写正确的信息');
          }}
          submitter={{
            render: () => {
              return (
                <div className="ant-modal-footer">
                  <Button onClick={() => onClose(false)}>取消</Button>
                  <Button type="primary" htmlType="submit">
                    提交申请
                  </Button>
                </div>
              );
            },
          }}
        >
          <ProFormText
            labelCol={{ span: 5 }}
            labelAlign="left"
            label="当前有效期"
            name="quotValidDate"
            initialValue={moment(info.quotValidDate).format('YYYY-MM-DD')}
            readonly
          />
          <ProFormDigit
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 11 }}
            labelAlign="left"
            label="申请延长天数"
            rules={[{ required: true, message: '请输入' }]}
            name="extendDays"
            width="sm"
            min={1}
            max={info?.quotType == 2 ? 60 : 180}
            initialValue={extendDays}
            fieldProps={{
              onChange: (val) => {
                form.setFieldsValue({
                  applyQuotValidDate: moment(info.quotValidDate)
                    .add(val, 'days')
                    .format('YYYY-MM-DD'),
                });
                return val;
              },
            }}
          />
          <ProFormDatePicker
            label="申请有效期至"
            name="applyQuotValidDate"
            initialValue={applyQuotValidDate}
            width="sm"
            fieldProps={{
              // style: {
              // 	width: '100%',
              // },
              onChange: (val) => {
                form.setFieldsValue({
                  extendDays: moment(val).diff(info.quotValidDate, 'day'),
                });
                return val;
              },
              disabledDate: (current: any) => {
                return (
                  current > moment(info.quotValidDate).add(info?.quotType == 2 ? 60 : 180, 'days')
                );
              },
            }}
            rules={[{ required: true, message: '请选择' }]}
            labelAlign="left"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 11 }}
          />
          <ProFormTextArea
            labelCol={{ span: 5 }}
            labelAlign="left"
            name="applyReason"
            label="申请原因"
            required
            placeholder={'请输入，最多255字'}
            rules={[{ required: true, message: '请选择' }]}
            fieldProps={{ maxLength: 255, showCount: true }}
          />
        </ProForm>
      </div>
    </div>
  );
};

export default ApplyDate;
