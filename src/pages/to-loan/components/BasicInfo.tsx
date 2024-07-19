import { ProFormDatePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Col, Row } from 'antd';
import React from 'react';
import { history } from 'umi';
import '../../to-loan/index.less';
interface BasicInfoProps {
  id?: string;
  type?: string;
  readonly?: boolean;
  info?: Record<any, any>;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ readonly, info = {} as any }) => {
  const {
    // companyCode = '',
    customerCode = '',
    customerName = '',
    contactNameR3 = '',
    contactCodeR3 = '',
    companyName = '',
    loanApplyNo = '',
    loanApplyTypeName = '',
    billSubject = '',
    taxTotalPrice = '',
    salesName = '',
    purchaseName = '',
    purchaseCode = '',
    loanApplyChannelName = '',
    createName = '',
    createTime = '',
  } = info;
  console.log(info, 'info11');

  return (
    <>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'客户代号'}
            name="customerCode"
            initialValue={customerCode}
            readonly={readonly}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'客户名称'}
            name="customerName"
            initialValue={customerName}
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
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'R3联系人代号'}
            initialValue={contactCodeR3}
            name="contactCodeR3"
            readonly={readonly}
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
          />
        </Col>
        <Col
          lg={6}
          md={12}
          sm={24}
          className="pft-cust-col"
          onClick={() => {
            history.push({
              //umi文档规定的固定格式
              pathname: '/to-loan/apply/detail', //要跳转的路由
              state: {
                //传递的数据
                data: info?.loanApplyNo,
              },
            });
          }}
        >
          <ProFormText
            label={'借贷申请'}
            initialValue={loanApplyNo}
            name="loanApplyNo"
            readonly={readonly}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label={'借贷申请类型'}
            name="loanApplyTypeName"
            initialValue={loanApplyTypeName}
            readonly={readonly}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'开票主体'}
            name="billSubject"
            initialValue={billSubject}
            readonly={readonly}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label={'主销售'}
            name="salesName"
            initialValue={salesName}
            readonly={readonly}
            options={[]}
            placeholder="请选择"
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'采购单位名称'}
            initialValue={purchaseName}
            name="purchaseName"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'客户采购单号'}
            initialValue={purchaseCode}
            name="purchaseCode"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'总计金额含税'}
            initialValue={taxTotalPrice}
            name="taxTotalPrice"
            readonly={readonly}
            disabled
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'创建人'}
            initialValue={createName}
            name="createName"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'渠道'}
            initialValue={loanApplyChannelName}
            name="loanApplyChannelName"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormDatePicker
            initialValue={createTime}
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
