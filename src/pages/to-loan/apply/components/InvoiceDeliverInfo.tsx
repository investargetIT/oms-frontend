import { SearchOutlined } from '@ant-design/icons';
import { ProFormRadio, ProFormText } from '@ant-design/pro-form';
import { Col, Row } from 'antd';
import React from 'react';
import '../style.less';

interface InvoiceDeliverInfoProps {
  id?: string;
  type?: string;
  onModal?: () => void;
  info?: Record<any, any>;
  formRef?: any;
  allsDisable?: boolean;
}

const InvoiceDeliverInfo: React.FC<InvoiceDeliverInfoProps> = ({
  onModal,
  allsDisable,
  info = {} as any,
}) => {
  const {
    invoiceReceiver = '',
    invoiceEmail = '',
    invoiceFollowGoods = 0,
    invoiceAddress = '',
    invoiceZip = '',
    invoiceTel = '',
    invoiceMobile = '',
    invoiceRegion = '',
  } = info;
  return (
    <>
      <Row gutter={24}>
        <Col lg={12} md={12} sm={24} style={{ float: 'left' }} onClick={onModal} className="canSee">
          <ProFormText
            label="发票收件地址"
            name="invoiceAddress"
            placeholder="请填写地址"
            readonly={allsDisable}
            initialValue={invoiceAddress}
            disabled
            fieldProps={{
              suffix: !allsDisable && <SearchOutlined />,
            }}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label="发票收件地区"
            name="invoiceRegion"
            readonly={allsDisable}
            initialValue={invoiceRegion}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label="发票收件邮编"
            name="invoiceZip"
            placeholder=""
            disabled
            readonly={allsDisable}
            initialValue={invoiceZip}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label="发票收件人"
            name="invoiceReceiver"
            placeholder=""
            readonly={allsDisable}
            initialValue={invoiceReceiver}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label="发票收件手机"
            name="invoiceMobile"
            placeholder=""
            readonly={allsDisable}
            initialValue={invoiceMobile}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label="发票收件固话"
            name="invoiceTel"
            placeholder=""
            readonly={allsDisable}
            initialValue={invoiceTel}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label="发票收件邮箱"
            name="invoiceEmail"
            placeholder=""
            readonly={allsDisable}
            initialValue={invoiceEmail}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormRadio.Group
            name="invoiceFollowGoods"
            label="发票随货"
            initialValue={invoiceFollowGoods}
            readonly={allsDisable}
            disabled
            options={[
              {
                label: '否',
                value: 0,
              },
              {
                label: '是',
                value: 1,
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default InvoiceDeliverInfo;
