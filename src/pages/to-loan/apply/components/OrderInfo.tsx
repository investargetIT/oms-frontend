import '../../index.less';
import { ProFormText } from '@ant-design/pro-form';
import { Col, Row } from 'antd';
import classNames from 'classnames';
import React, { useEffect } from 'react';
interface BasicInfoProps {
  id?: string;
  type?: string;
  readonly?: boolean;
  info?: Record<any, any>;
  formRef?: any;
}

const OrderInfo: React.FC<BasicInfoProps> = ({ info = {} as any, type }) => {
  const {
    orderNo = '', //销售订单号
    obdNo = '', //obd号
    customerCode = '', //客户编号
    customerName = '', //客户名称
    // companyCode = '', //所属公司CODE
    companyName = '', //所属公司
    deptName = '', //所属部门
    // deptCode	='',//所属部门Code
    groupCode = '', //所属集团公司号
    groupName = '', //所属集团公司名称
    salesName = '', //主销售
    contactNameR3 = '', //R3联系人
    contactCodeR3 = '', //R3联系人代号
    originalChannelName = '', //原订单渠道
    purchaseName = '', //采购单位名称
  } = info;
  useEffect(() => {}, []);
  return (
    <>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24} className={classNames(type === 'add' && 'canSee')}>
          <ProFormText label={'销售订单号'} initialValue={orderNo} name="orderNo" readonly={true} />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText label={'OBD号'} initialValue={obdNo} name="obdNo" readonly={true} />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'客户编号'}
            initialValue={customerCode}
            name="customerCode"
            readonly={true}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'客户名称'}
            initialValue={customerName}
            name="customerName"
            readonly={true}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'所属公司'}
            initialValue={companyName}
            name="companyName"
            readonly={true}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText label={'所属部门'} initialValue={deptName} name="deptName" readonly={true} />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'所属集团'}
            initialValue={groupName}
            name="groupName"
            readonly={true}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'集团公司号'}
            initialValue={groupCode}
            name="groupCode"
            readonly={true}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText label={'主销售'} initialValue={salesName} name="salesName" readonly={true} />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'R3联系人'}
            initialValue={contactNameR3}
            name="contactNameR3"
            readonly={true}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'R3联系人代号'}
            initialValue={contactCodeR3}
            name="contactCodeR3"
            readonly={true}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'原订单渠道'}
            initialValue={originalChannelName}
            name="originalChannelName"
            readonly={true}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'采购单位名称'}
            initialValue={purchaseName}
            name="purchaseName"
            readonly={true}
          />
        </Col>
      </Row>
    </>
  );
};

export default OrderInfo;
