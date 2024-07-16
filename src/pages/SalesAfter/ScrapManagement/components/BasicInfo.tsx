// import { getConList } from '@/services/InquirySheet/offerOrder';
import { ProFormDatePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Col, Row } from 'antd';
import React from 'react';
import '../../index.less';
import { history } from 'umi';
interface BasicInfoProps {
  id?: string;
  type?: string;
  readonly?: boolean;
  info?: Record<any, any>;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ readonly, info = {} as any }) => {
  const {
    // companyCode = '',
    companyName = '',
    scrapApplyNo = '',
    createName = '',
    supplierName = '',
    supplierCode = '',
    contactNameR3 = '',
    contactCodeR3 = '',
    salesName = '',
    tariffPrice = '',
    channelTypeDesc = '',
    freightTotalPrice = '',
    intlFreightPrice = '',
    taxTotalPrice = '',
    goodsTaxTotalPrice = '',
    createTime = '',
    scrapApplyId = '',
  } = info;

  return (
    <>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'供应商代号'}
            name="supplierCode"
            initialValue={supplierCode}
            placeholder="请输入"
            readonly={readonly}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'供应商名称'}
            name="supplierName"
            initialValue={supplierName}
            placeholder="请输入"
            readonly={readonly}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            label={'R3联系人'}
            name="contactNameR3"
            initialValue={contactNameR3}
            readonly={readonly}
            options={[]}
            placeholder="请选择"
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'R3联系人代号'}
            initialValue={contactCodeR3}
            name="contactCodeR3"
            readonly={readonly}
            disabled
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label={'所属公司'}
            initialValue={companyName}
            name="companyName"
            readonly={readonly}
            options={[]}
            placeholder="请选择"
            rules={[{ required: true, message: '' }]}
          />
        </Col>
        <Col
          lg={6}
          md={12}
          sm={24}
          className="pft-cust-col"
          onClick={() => {
            history.push(
              `/sales-after/scrap-management/scrap-apply/add/?sid=${scrapApplyId}&&isRead=true`,
            );
          }}
        >
          <ProFormText
            style={{ color: 'red' }}
            label={'报废申请'}
            initialValue={scrapApplyNo}
            name="scrapApplyNo"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label={'主销售'}
            name="salesName"
            initialValue={salesName}
            readonly={readonly}
            options={[]}
            placeholder="请选择"
            rules={[{ required: true, message: '' }]}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label={'创建人'}
            name="createName"
            initialValue={createName}
            readonly={readonly}
            options={[
              {
                label: 'oms',
                value: '0',
              },
            ]}
            placeholder="请选择"
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label={'渠道'}
            name="channelTypeDesc"
            initialValue={channelTypeDesc}
            readonly={readonly}
            options={[]}
            placeholder="请选择"
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'运费合计'}
            initialValue={freightTotalPrice}
            name="freightTotalPrice"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'国际运费'}
            initialValue={intlFreightPrice}
            name="intlFreightPrice"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'关税'}
            initialValue={tariffPrice}
            name="tariffPrice"
            readonly={readonly}
            disabled
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'总计金额含税'}
            initialValue={taxTotalPrice}
            name="taxTotalPrice"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'货品金额含税'}
            initialValue={goodsTaxTotalPrice}
            name="goodsTaxTotalPrice"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormDatePicker
            initialValue={createTime}
            rules={[{ required: true, message: '请选择', type: 'date' }]}
            label={'订单创建时间'}
            name="createTime"
            readonly={readonly}
            fieldProps={{
              style: {
                width: '100%',
              },
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default BasicInfo;
