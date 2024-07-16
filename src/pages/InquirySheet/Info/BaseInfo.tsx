import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Spin } from 'antd';
import '../Add/add.less';
// import './info.less';
const BaseInfo: React.FC<{ params?: any }> = (props: any) => {
  const [infoParams, setInfoParams]: any = useState({});
  const [load, setLoad] = useState(true);
  useEffect(() => {
    if (props.params) {
      setInfoParams(props.params);
      setTimeout(function () {
        setLoad(false);
      }, 800);
    }
  }, [props.params]);
  return (
    <div className="base-info sku-detail inquirySheetInfo">
      <Spin spinning={load}>
        <Form size="small" labelWrap>
          <Row>
            <Col span={6}>
              <Form.Item label="客户名称">
                <span>{infoParams.customerName}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="客户级别">
                <span>{infoParams.customerLevelName}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="询价类型">
                <span>{infoParams.inqTypeStr}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="需求类型">
                <span>{infoParams.reqTypeStr}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="成单情况预估">
                <span>{infoParams.toOrderEstimationStr}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="客户目的">
                <span>{infoParams.custPurposeStr}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="所属公司">
                <span>{infoParams.branchCompanyName}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="期望回复时间">
                <span>{infoParams.expectedReplyTime}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="客户所属部门">
                <span>{infoParams.deptName}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="R3联系人">
                <span>{infoParams.contactName}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="商机名称">
                <span>{infoParams.oppoValue}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="主销售">
                <span>{infoParams.salesName}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="创建人">
                <span>{infoParams.createName}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="来源渠道">
                <span>{infoParams.channelStr}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="是否免运费">
                <span>{infoParams.freeShippingStr}</span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="FA期望有效期">
                <span>
                  {infoParams?.faExpectValidDays}
                  {infoParams?.faExpectValidDays >= 0 && '天'}
                </span>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="需求创建时间">
                <span>{infoParams.createTime}</span>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="项目名称">
            <span>{infoParams.projectName}</span>
          </Form.Item>
          <Form.Item label="描述">
            <span className="wordBreak">
              {infoParams.remark
                ? infoParams.remark.split('\n').map((io: any) => <div key={io}>{io}</div>)
                : ''}
            </span>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default BaseInfo;
