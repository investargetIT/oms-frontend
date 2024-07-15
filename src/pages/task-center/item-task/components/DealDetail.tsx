// import { getConList } from '@/services/InquirySheet/offerOrder';
import { ProFormText } from '@ant-design/pro-form';
import { Col, Row } from 'antd';
import React from 'react';
import '../../index.less';

interface DealDetailProps {
  readonly?: boolean;
  info?: Record<any, any>;
}

const DealDetail: React.FC<DealDetailProps> = ({ readonly, info = {} as any }) => {
  const {
    // ppsStaff = '',
    // ppsUpdateTime = '',
    // goodsStaff = '',
    ppsFeedback = '',
    // goodsFeedbackTime = '',
    goodsFeedback = '',
    // salesStaff = '',
    // salesFeedbackTime = '',
    salesFeedback = '',
    // whStaff = '',
    // whFeedbackTime = '',
    whFeedback = '',
  } = info;

  return (
    <>
      {/* 处理信息 cp1 pps人员 */}
      <Row gutter={24}>
        {/* <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label="PPS人员"
            initialValue={ppsStaff}
            name="ppsStaff"
            readonly={readonly}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormDatePicker
            initialValue={ppsUpdateTime}
            label="pps更新日期"
            name="ppsUpdateTime"
            readonly={readonly}
          />
        </Col> */}
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label="PPS备注"
            initialValue={ppsFeedback}
            name="ppsRemark"
            readonly={readonly}
          />
        </Col>
      </Row>
      <Row gutter={24} />
      {/* 商品人员 */}
      <Row
        gutter={24}
        style={{ paddingTop: '24px', marginTop: '12px', borderTop: '1px solid #eee' }}
      >
        {/* <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label="商品人员"
            initialValue={goodsStaff}
            name="goodsStaff"
            readonly={readonly}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormDatePicker
            initialValue={goodsFeedbackTime}
            label="商品反馈日期"
            name="goodsFeedbackTime"
            readonly={readonly}
          />
        </Col> */}
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label="商品反馈"
            initialValue={goodsFeedback}
            name="goodsFeedback"
            readonly={readonly}
          />
        </Col>
      </Row>
      <Row gutter={24} />

      {/* 销售人员 */}
      <Row
        gutter={24}
        style={{ paddingTop: '24px', marginTop: '12px', borderTop: '1px solid #eee' }}
      >
        {/* <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label="销售人员"
            initialValue={salesStaff}
            name="salesStaff"
            readonly={readonly}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormDatePicker
            initialValue={salesFeedbackTime}
            label="销售反馈日期"
            name="salesFeedbackTime"
            readonly={readonly}
          />
        </Col> */}
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label="销售反馈"
            initialValue={salesFeedback}
            name="salesFeedback"
            readonly={readonly}
          />
        </Col>
      </Row>
      <Row gutter={24} />

      {/* 仓库人员 */}
      <Row
        gutter={24}
        style={{ paddingTop: '24px', marginTop: '12px', borderTop: '1px solid #eee' }}
      >
        {/* <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label="仓库人员"
            initialValue={whStaff}
            name="whStaff"
            readonly={readonly}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormDatePicker
            initialValue={whFeedbackTime}
            label="仓库反馈日期"
            name="whFeedbackTime"
            readonly={readonly}
          />
        </Col> */}
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label="仓库反馈"
            initialValue={whFeedback}
            name="whFeedback"
            readonly={readonly}
          />
        </Col>
      </Row>
      <Row gutter={24} />
    </>
  );
};

export default DealDetail;
