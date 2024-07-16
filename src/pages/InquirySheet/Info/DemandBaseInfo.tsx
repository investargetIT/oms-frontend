import React from 'react';
import { Form, Row, Col, Divider } from 'antd';
import './info.less';
import { useLocation } from 'umi';
const DemandBaseInfo: React.FC<{ params: any; discountPerc?: any; discountCode?: any }> = ({
  params,
  discountPerc,
}: any) => {
  const location: any = useLocation();
  const pathParams: any = location.state;
  return (
    <React.Fragment>
      {params && (
        <Form size="small" className="sku-detail inquirySheetInfo">
          <Row>
            <Col span={6}>
              <Form.Item label="需求SKU号">
                <span>{params.reqSku}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="需求类型">
                <span>{params.reqTypeStr}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="需求产品名称">
                <span>{params.reqProductName}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="需求品牌名称">
                <span>{params.reqBrandName}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="制造商型号">
                <span>{params.reqMfgSku}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="需求采购单位">
                <span>{params.reqUom}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="需求数量">
                <span>{params.reqQty}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="需求产品线">
                <span>{params.reqProductLineName}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="需求Segment">
                <span>{params.reqSegmentName}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="技术参数/规格">
                <span>{params.reqTechSpec}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="是否可替换">
                <span>{params.reqReplaceable ? '是' : '否'}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="客户期望单价">
                <span>{params.reqPrice}</span>
              </Form.Item>
            </Col>
            <Divider />
            <Col span={6}>
              <Form.Item label="询价类型">
                <span>{params.inqTypeStr}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="客户物料号">
                <span>{params.reqCustomerSku}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="客户行号">
                <span>{params.reqPoItemNo}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="是否长期采购">
                <span>{params.reqIsLongRequest ? '否' : '是'}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="长期采购数量">
                <span>{params.reqLongRequestNum}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="销售期望成交价-含税" className="minLabel">
                <span>{params.salesExpectPrice}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="销售期望成交价-未税" className="minLabel">
                <span>{params.salesExpectPriceNet}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="FA期望有效期">
                <span>
                  {params?.faExpectValidDays}
                  {params?.faExpectValidDays >= 0 && '天'}
                </span>
              </Form.Item>
            </Col>
            <Col span={6} style={{ display: 'none' }}>
              <Form.Item label="客户返利折扣" style={{ display: 'none' }}>
                {['ae', 'te', 'aepcm', 'tepcm'].includes(pathParams?.sorurceType) && (
                  <span>***</span>
                )}
                {!['ae', 'te', 'aepcm', 'tepcm'].includes(pathParams?.sorurceType) && (
                  <span>{discountPerc}%</span>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="需求描述">
            <span>{params.reqRemark}</span>
          </Form.Item>
          {!['ae', 'te', 'aepcm', 'tepcm'].includes(pathParams?.sorurceType) && (
            <Form.Item label="选配备注">
              <span>{params.skuVo?.matchRemark}</span>
            </Form.Item>
          )}
        </Form>
      )}
    </React.Fragment>
  );
};

export default DemandBaseInfo;
