/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Col, Row } from 'antd';
import React, { useEffect } from 'react';
import '../style.less';
import { SearchOutlined } from '@ant-design/icons';
interface InvoiceInfoProps {
  allsDisable?: boolean;
  invoiceDisabled?: boolean;
  info?: Record<any, any>;
  onModal?: () => void;
  onCallBack?: (val: any) => void;
}

const InvoiceInfo: React.FC<InvoiceInfoProps> = ({
  onModal,
  onCallBack,
  allsDisable,
  invoiceDisabled,
  info = {} as any,
}) => {
  const {
    vatTypeName = '',
    vatCompanyName = '',
    vatTaxNo = '',
    vatAddress = '',
    vatBankName = '',
    vatBankNo = '',
    vatPhone = '',
  } = info;
  useEffect(() => {}, []);
  return (
    <>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            label="发票类型"
            name="vatTypeName"
            readonly={allsDisable}
            disabled={invoiceDisabled}
            initialValue={vatTypeName}
            options={[
              {
                label: '增值税专用发票',
                value: '增值税专用发票',
              },
              {
                label: '普通发票',
                value: '普通发票',
              },
              {
                label: '无需发票',
                value: '无需发票',
              },
            ]}
            placeholder="请选择"
            fieldProps={{
              onChange: (val) => {
                onCallBack && onCallBack(val);
              },
            }}
          />
        </Col>
        <Col lg={6} md={12} sm={24} onClick={onModal} className="canSee">
          <ProFormText
            initialValue={vatCompanyName}
            label="开票抬头"
            name="vatCompanyName"
            placeholder="默认读取当前客户名称对应的开票信息"
            readonly={allsDisable}
            disabled
            allowClear={false}
            //  rules={[{ required: invoiceType !== '3' ? true : false, message: '请选择' }]}
            fieldProps={{
              suffix: !allsDisable && <SearchOutlined />,
            }}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            initialValue={vatTaxNo}
            label="纳税人识别号"
            name="vatTaxNo"
            placeholder="识别号"
            readonly={allsDisable}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            initialValue={vatAddress}
            label="注册地址"
            name="vatAddress"
            placeholder="注册地址"
            readonly={allsDisable}
            disabled
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            initialValue={vatPhone}
            label="注册电话"
            name={'vatPhone'}
            placeholder=""
            readonly={allsDisable}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            initialValue={vatBankName}
            label="开户银行"
            name="vatBankName"
            placeholder=""
            readonly={allsDisable}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            initialValue={vatBankNo}
            label="银行账户"
            name={'vatBankNo'}
            placeholder=""
            readonly={allsDisable}
            disabled
          />
        </Col>
      </Row>
    </>
  );
};

export default InvoiceInfo;
