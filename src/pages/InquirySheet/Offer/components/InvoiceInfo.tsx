/* eslint-disable @typescript-eslint/no-unused-expressions */
import { getSelectList } from '@/services/InquirySheet/utils';
import { SearchOutlined } from '@ant-design/icons';
import { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { fieldLabels } from '../const';
import './table.less';

interface InvoiceInfoProps {
  id?: string;
  onModal?: () => void;
  readonly?: boolean;
  type?: string;
  info?: Record<any, any>;
  onCallBack?: (val: any) => void;
  isCsp?: boolean;
}

const InvoiceInfo: React.FC<InvoiceInfoProps> = ({
  onModal,
  readonly,
  info = {} as any,
  onCallBack,
  isCsp,
}) => {
  const {
    invoiceType = '3',
    invoiceTitle = '',
    vatTaxNo = '',
    vatAddress = '',
    // vatTel = '',
    // regeditPhoneExtension = '021', // 去掉了
    vatBankName = '',
    vatBankNo = '',
    // 不一致字段
    vatPhone = '',
  } = info;
  // console.log(invoiceType, 'invoiceType');
  const [invoiceList, setInvoiceList] = useState<any>([]);

  useEffect(() => {
    getSelectList({ type: 'invoice' }).then((res: any) => {
      const {
        errCode,
        data: { dataList },
      } = res;
      if (errCode === 200) {
        setInvoiceList(
          dataList?.map((io: any) => ({
            ...io,
            label: io.value,
            value: io.key,
          })),
        );
      }
    });
  }, []);

  return (
    <>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            allowClear={false}
            label={fieldLabels.invoiceType}
            name="invoiceType"
            readonly={readonly}
            initialValue={invoiceType}
            options={invoiceList}
            placeholder="请选择"
            rules={[{ required: isCsp ? false : true, message: '请选择' }]}
            fieldProps={{
              onChange: (val) => {
                onCallBack && onCallBack(val);
              },
            }}
          />
        </Col>
        <Col lg={6} md={12} sm={24} onClick={onModal} className="canSee">
          <ProFormText
            initialValue={invoiceTitle}
            label={fieldLabels.invoiceTitle}
            name="invoiceTitle"
            placeholder="默认读取当前客户名称对应的开票信息"
            readonly={readonly}
            disabled
            allowClear={false}
            rules={[{ required: invoiceType !== '3' ? true : false, message: '请选择' }]}
            fieldProps={{
              suffix: !readonly && <SearchOutlined />,
            }}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            initialValue={vatTaxNo}
            label={fieldLabels.vatTaxNo}
            name="vatTaxNo"
            placeholder="识别号"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            initialValue={vatAddress}
            label={fieldLabels.vatAddress}
            name="vatAddress"
            placeholder="注册地址"
            readonly={readonly}
            disabled
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            initialValue={vatPhone}
            label={fieldLabels.vatPhone}
            name={'vatPhone'}
            placeholder=""
            readonly={readonly}
            disabled
          />
        </Col>
        {/* {readonly && (
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label={fieldLabels.regeditPhoneExtension}
              name="regeditPhoneExtension"
              readonly={readonly}
              initialValue={regeditPhoneExtension}
            />
          </Col>
        )} */}
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            initialValue={vatBankName}
            label={fieldLabels.vatBankName}
            name="vatBankName"
            placeholder=""
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            initialValue={vatBankNo}
            label={fieldLabels.vatBankNo}
            name={'vatBankNo'}
            placeholder=""
            readonly={readonly}
            disabled
          />
        </Col>
      </Row>
    </>
  );
};

export default InvoiceInfo;
