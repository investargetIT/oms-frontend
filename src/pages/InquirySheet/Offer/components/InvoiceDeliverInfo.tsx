import { SearchOutlined } from '@ant-design/icons';
import { ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Col, Row } from 'antd';
import React from 'react';
import { fieldLabels } from '../const';
import './table.less';

interface InvoiceDeliverInfoProps {
  id?: string;
  onModal?: () => void;
  type?: string;
  readonly?: boolean;
  info?: Record<any, any>;
  isCsp?: boolean;
}

const InvoiceDeliverInfo: React.FC<InvoiceDeliverInfoProps> = ({
  onModal,
  readonly,
  info = {} as any,
  type = '',
}) => {
  const {
    invoiceType = 3,
    invoiceReceiver = '',
    invoiceAddress = '',
    invoiceZip = '',
    invoiceTel = '',
    invoiceMobile = '',
    invoiceEmail = '',
    followMerchandise = 0,
    invoiceReceiveRegion = '',
  } = info;
  return (
    <>
      <Row gutter={24}>
        <Col lg={12} md={12} sm={24} style={{ float: 'left' }} onClick={onModal} className="canSee">
          <ProFormText
            allowClear={false}
            label={fieldLabels.invoiceAddress}
            name="invoiceAddress"
            placeholder="请填写地址"
            readonly={readonly}
            initialValue={invoiceAddress}
            disabled
            rules={[{ required: invoiceType == 1 ? true : false, message: '请填写地址' }]}
            fieldProps={{
              suffix: !readonly && <SearchOutlined />,
            }}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label={'发票收件地区'}
            name="invoiceReceiveRegion"
            placeholder=""
            readonly={readonly}
            initialValue={invoiceReceiveRegion}
            // rules={[{ required: true, message: '请选择' }]}
            options={[]}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={fieldLabels.invoiceZip}
            name="invoiceZip"
            placeholder=""
            readonly={readonly}
            initialValue={invoiceZip}
            disabled
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={fieldLabels.invoiceReceiver}
            name="invoiceReceiver"
            placeholder=""
            readonly={readonly}
            initialValue={invoiceReceiver}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={fieldLabels.invoiceMobile}
            name="invoiceMobile"
            placeholder=""
            readonly={readonly}
            initialValue={invoiceMobile}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={fieldLabels.invoiceTel}
            name="invoiceTel"
            placeholder=""
            readonly={readonly}
            initialValue={invoiceTel}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={fieldLabels.invoiceEmail}
            name="invoiceEmail"
            placeholder=""
            readonly={readonly}
            initialValue={invoiceEmail}
            disabled
          />
        </Col>
        {/* TODO:这个原型没了 ---> afterOrder || scrapDetail  */}
        {['afterOrder', 'scrapDetail', 'scrapApply', 'addOrder'].includes(type) && (
          <Col lg={6} md={12} sm={24}>
            <ProFormRadio.Group
              name="followMerchandise"
              label={fieldLabels.invoiceGoods}
              initialValue={followMerchandise}
              readonly={readonly}
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
        )}
      </Row>
    </>
  );
};

export default InvoiceDeliverInfo;
