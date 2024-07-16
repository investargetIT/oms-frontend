import { Col, Divider, Form, Row } from 'antd';
import React from 'react';
import '../Add/add.less';
const PmsSkuInfo: React.FC<{ params?: any }> = ({ params }: any) => {
  const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
  return (
    <div>
      <Form {...layout} labelWrap size="small">
        <Divider orientation="left">SKU信息</Divider>
        <Row>
          <Col span={6}>
            <Form.Item label="SKU号">
              <span>{params?.skuVo?.sku}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="SKU类型">
              <span>{params?.skuVo?.skuTypeStr}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="品牌名称">
              {/* <span>{params?.skuVo?.brandName}</span> */}
              {params.skuVo?.brandName ? (
                <span>
                  ({params.skuVo?.brandCode}){params.skuVo?.brandName}
                </span>
              ) : (
                <span>{params?.skuVo?.brandName}</span>
              )}
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="品牌类型">
              <span>{params?.skuVo?.brandTypeStr}</span>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Product">
              <span>{params?.skuVo?.productLineName}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Segment">
              <span>{params?.skuVo?.segmentName}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Family">
              <span>{params?.skuVo?.familyName}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Category">
              <span>{params?.skuVo?.categoryName}</span>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="产品名称(中文)" className="super-label">
              <span>{params?.skuVo?.productNameZh}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="产品业务状态" className="super-label">
              <span>{params?.skuVo?.bizStatusStr}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="制造商型号">
              <span>{params?.skuVo?.mfgSku}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="供应商型号" className="super-label">
              <span>{params?.skuVo?.supplierSku}</span>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="物理单位">
              <span>{params?.skuVo?.phyUomCode}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="销售单位">
              <span>{params?.skuVo?.salesUomCode}</span>
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="销售单位含物理单位个数" className="minLabel">
              <span>{params?.skuVo?.salesPackQty}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="销售最小起订量" className="super-label">
              <span>{params?.skuVo?.salesMoq}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="销售增幅">
              <span>{params?.skuVo?.moqIncrement}</span>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="规格" labelCol={{ span: 2 }} wrapperCol={{ span: 16 }}>
              <span>{params.skuVo?.techSpec}</span>
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row style={{ marginTop: 20 }}>
          <Col span={6}>
            <Form.Item label="是否成品油">
              <span>
                {params?.skuVo?.productOilFlag === 1
                  ? '是'
                  : params?.skuVo?.productOilFlag === 0
                  ? '否'
                  : ''}
              </span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="成品油分类">
              <span>{params?.skuVo?.productOilTypeStr}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="税收分类编码">
              <span>{params?.skuVo?.taxNo}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="特殊运输方式" className="super-label">
              <span>{params?.transportConditionStr}</span>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="产品质保期(天)">
              <span>{params?.skuVo?.warrantyPeriod}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="是否配件">
              <span>
                {params?.skuVo?.parts === 1 ? '是配件' : params?.skuVo?.parts === 0 ? '非配件' : ''}
              </span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="是否含安装">
              <span>
                {params?.containInstall === 1 ? '是' : params?.containInstall === 0 ? '否' : ''}
              </span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="危险品种类">
              <span>{params?.dangerTypeStr}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="是否可退货" className="super-label">
              <span>
                {params.supplierReturn == 1
                  ? '可退货'
                  : params.supplierReturn == 0
                  ? '不可退货'
                  : ''}
              </span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="是否可换货" className="super-label">
              <span>
                {params.supplierExchange == 1
                  ? '可换货'
                  : params.supplierExchange == 0
                  ? '不可换货'
                  : ''}
              </span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="GPRate(%)">
              <span>{params?.skuVo?.sourcingGpRate}</span>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="产品原产国">
              <span>{params?.skuVo?.madeinCountryCode}</span>
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row style={{ marginTop: 20 }}>
          <Col span={6}>
            <Form.Item label="供应商名称">
              <span>{params?.skuVo?.supplierNameZh}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="备货方式">
              <span>{params?.deliveryTypeStr}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="交付方式">
              <span>{params?.deliveryTermStr}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="交付周期(工作日)">
              <span>{params?.skuVo?.leadTime}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="采购计价货币" className="super-label">
              <span>{params?.purchCurrency}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="含税采购价">
              <span>{params?.skuVo?.purchPrice}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="CNY含税采购价">
              <span>{params?.skuVo?.purchPriceCNY}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="含税面价">
              <span>{params?.skuVo?.listPrice}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="含税销售成交价" className="super-label">
              <span>{params?.skuVo?.salesPrice}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="折扣类型" className="super-label">
              <span>{params?.discountCode}</span>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="GP0(%)">
              {/*<span>{params?.skuVo?.gp0}</span>*/}
              <span>****</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="GP1(%)">
              <span>{params?.skuVo?.gpRate}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="报价有效期(天)" className="super-label">
              <span>{params?.quoteValidDates}</span>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="报价到期日">
              <span>{params?.quoteValidDate}</span>
            </Form.Item>
          </Col>
        </Row>

        <Divider />
      </Form>
    </div>
  );
};

export default PmsSkuInfo;
