import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Row, Col, Space, Button, Divider, Modal, message, Spin, Input } from 'antd';
import '../Add/add.less';
// import './info.less';
import { inqLnInfo, updateSkuImg, editMatchRemark } from '@/services/InquirySheet';
import { useLocation, history } from 'umi';
import SkuInfoEdit from './SkuInfoEdit';
const SkuDetail: React.FC<{
  params?: any;
  type?: any;
  id: string;
  backMtd?: Function;
  curPath?: any;
}> = (props: any, ref: any) => {
  const [params, setParams]: any = useState({});
  const location: any = useLocation();
  const pathParams: any = location.state;
  const [imgParams, setImgParams] = useState({});
  const [lastPath, setLastPath] = useState('');
  const [load, setLoad] = useState(false);
  const [RemarkDesc, setRemarkDesc] = useState('');
  const RemarkParams = (val?: any) => {
    if (val?.target) setRemarkDesc(val.target.value);
  };
  useEffect(() => {
    const newPath: any = history.location.pathname.split('/').pop();
    setLastPath(newPath);
    if (props.id) {
      inqLnInfo(props.id).then((res: any) => {
        if (res.errCode === 200) {
          setParams(res.data);
          setRemarkDesc(res.data.skuVo?.matchRemark);
        }
      });
    }
  }, [props.id]);
  const onLog = () => {
    if (props.backMtd) {
      props.backMtd({ id: props.id });
    }
  };
  // 暴露组件的方法
  useImperativeHandle(ref, () => ({
    onSave: async (rebackMtd: any) => {
      Modal.confirm({
        title: '确定保存?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          setLoad(true);
          updateSkuImg({
            ...imgParams,
            sid: params.sid,
            inqLineId: params.sid,
            inquiryId: params.inquiryId,
          }).then((imgRes: any) => {
            if (imgRes.errCode === 200) {
              message.success('保存成功!');
              rebackMtd();
              setLoad(false);
            } else {
              message.error(imgRes.errMsg);
              setLoad(false);
            }
          });
        },
      });
    },
    onRemark: async (rebackMtd: any) => {
      const path: any = pathParams?.sorurceType;
      Modal.confirm({
        title: '确定保存?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          setLoad(true);
          editMatchRemark(path, {
            matchRemark: RemarkDesc,
            inqLnId: params.sid,
            inquiryId: params.inquiryId,
          }).then((res: any) => {
            if (res.errCode === 200) {
              message.success('保存成功!');
              rebackMtd();
              setLoad(false);
            } else {
              message.error(res.errMsg);
              setLoad(false);
            }
          });
        },
      });
    },
  }));

  return (
    <Spin spinning={load}>
      <div className="base-info contentSty sku-detail inquirySheetInfo" id="lineDetailSkuInfoForm">
        <Space className="info-padding" style={{ fontSize: '16px' }}>
          <div>行项目编号：{params.skuVo?.inqLineId}</div>
          <div>需求单号：{params.inquiryCode}</div>
        </Space>
        <div
          className="info-padding"
          style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(0,0,0,0.5)' }}
        >
          <Space>
            <p>行项目状态：{params.lineStatusStr}</p>
            <p>行项目创建时间：{params.createTime}</p>
            <p>最后修改时间：{params.updateTime}</p>
          </Space>
          <Button type="link" onClick={onLog}>
            查看行日志
          </Button>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '10px' }}>
          <h3>需求信息</h3>
          <Divider />
          <Form size="small">
            <Row>
              <Col span={6}>
                <Form.Item label="需求SKU号">
                  <span>{params.reqVo?.reqSku}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="需求类型">
                  <span>{params.reqTypeStr}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="需求产品名称">
                  <span>{params.reqVo?.reqProductName}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="需求品牌名称">
                  <span>{params.reqVo?.reqBrandName}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="需求采购单位">
                  <span>{params.reqVo?.reqUom}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="需求数量">
                  <span>{params.reqVo?.reqQty}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="技术参数/规格">
                  <span>{params.reqVo?.reqTechSpec}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="是否可替换">
                  <span>{params.reqVo?.reqReplaceable == 1 ? '是' : '否'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="客户期望单价">
                  <span>{params.reqVo?.reqPrice}</span>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="需求产品线">
                  <span>{params.reqVo?.reqProductLineName}</span>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="需求Segment">
                  <span>{params.reqVo?.reqSegmentName}</span>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="需求制造商型号" className="minLabel">
                  <span>{params.reqVo?.reqMfgSku}</span>
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
                  <span>{params.reqVo?.reqCustomerSku}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="客户行号">
                  <span>{params.reqVo?.reqPoItemNo}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="是否长期采购">
                  <span>{params?.reqVo?.reqIsLongRequest == 0 ? '否' : '是'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="长期采购数量">
                  <span>{params.reqVo?.reqLongRequestNum}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="销售期望成交价-含税" className="minLabel">
                  <span>{params.reqVo?.salesExpectPrice}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="销售期望成交价-未税" className="minLabel">
                  <span>{params.reqVo?.salesExpectPriceNet}</span>
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
                <Form.Item label="客户返利折扣">
                  {['ae', 'te', 'aepcm', 'tepcm'].includes(pathParams?.sorurceType) && (
                    <span>***</span>
                  )}
                  {!['ae', 'te', 'aepcm', 'tepcm'].includes(pathParams?.sorurceType) && (
                    <span>{params.discountPerc}%</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="需求描述">
              <span>
                {params.reqVo?.reqRemark
                  ? params.reqVo?.reqRemark.split('\n').map((io: any) => <div key={io}>{io}</div>)
                  : ''}
              </span>
            </Form.Item>
            {/*sessionStorage.getItem('remark') && (
              <Form.Item label="选配备注">
                <span>{params.skuVo?.matchRemark}</span>
              </Form.Item>
            )*/}
          </Form>
          <h3 style={{ marginTop: '20px' }}>匹配信息</h3>
          <Divider />
          <Form size="small">
            <Row>
              <Col span={6}>
                <Form.Item label="SKU类型">
                  <span>{params.skuVo?.skuTypeStr}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="SKU号">
                  <span>{params.skuVo?.sku}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="品牌名称">
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
                  <span>{params.skuVo?.brandTypeStr}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Product">
                  <span>{params.skuVo?.productLineName}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Segment">
                  <span>{params.skuVo?.segmentName}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Family">
                  <span>{params.skuVo?.familyName}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Category">
                  <span>{params.skuVo?.categoryName}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="产品名称(中文)">
                  <span>{params.skuVo?.productNameZh}</span>
                </Form.Item>
              </Col>
              {/*<Col span={6}>
                <Form.Item label="产品名称(英文)">
                  <span>{params.skuVo?.productNameEn}</span>
                </Form.Item>
              </Col>*/}
              <Col span={6}>
                <Form.Item label="产品业务状态">
                  <span>{params.skuVo?.bizStatusStr}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                {/*制造厂商产品型号*/}
                <Form.Item label="制造商型号">
                  <span>{params.skuVo?.mfgSku}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                {/*供应商产品型号*/}
                <Form.Item label="供应商型号">
                  <span>{params.skuVo?.supplierSku}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="销售单位">
                  <span>{params.skuVo?.salesUomCode}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="物理单位">
                  <span>{params.skuVo?.phyUomCode}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="销售单位含物理单位个数" className="minLabel">
                  <span>{params.skuVo?.salesPackQty}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="销售最小起订量" className="minLabel">
                  <span>{params.skuVo?.salesMoq}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="销售增幅">
                  <span>{params.skuVo?.moqIncrement}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="需求SKU号">
                  <span>{params.reqSkuTypeStr}</span>
                </Form.Item>
              </Col>
              {/*{['quote', 'otherchannel', 'all'].includes(pathParams?.sorurceType) && (
							  <Col span={6}>
							    <Form.Item label="需求分类">
							      <span>{params.sourcingReqTypeStr}</span>
							    </Form.Item>
							  </Col>
							)}*/}
              <Col span={6}>
                <Form.Item label="需求分类">
                  <span>{params?.sourcingReqTypeStr}</span>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="匹配类型">
                  <span>{params.skuVo?.pairTypeStr}</span>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="规格">
                  <span>{params.skuVo?.techSpec}</span>
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={6}>
                <Form.Item label="是否成品油">
                  <span>{params.skuVo?.productOilFlag == 0 ? '否' : '是'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="成品油分类">
                  <span>{params.skuVo?.productOilTypeStr}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="税收分类编码">
                  <span>{params.skuVo?.taxNo}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="特殊运输方式">
                  <span>{params.transportConditionStr}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="产品质保期(天)">
                  <span>{params.skuVo?.warrantyPeriod}</span>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="是否配件">
                  <span>{params.skuVo?.parts == 1 ? '是配件' : '不是配件'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="是否含安装">
                  <span>{params.containInstall == 1 ? '是' : '否'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="危险品种类">
                  <span>{params.dangerTypeStr}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="是否可退货">
                  <span>{params.skuVo?.supplierReturn == 1 ? '可退货' : '不可退货'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="是否可换货">
                  <span>{params.skuVo?.supplierExchange == 1 ? '可换货' : '不可换货'}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="GPRate(%)">
                  {['info', 'ae', 'te', 'aepcm', 'tepcm'].includes(pathParams?.sorurceType) && (
                    <span>***</span>
                  )}
                  {!['info', 'ae', 'te', 'aepcm', 'tepcm'].includes(pathParams?.sorurceType) && (
                    <span>{params.skuVo?.sourcingGpRate}</span>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="产品原产国">
                  <span>{params.skuVo?.madeinCountryCode}</span>
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={6}>
                <Form.Item label="供应商名称">
                  <span>
                    {['info'].includes(pathParams?.sorurceType)
                      ? '***'
                      : '(' +
                        (params?.skuVo?.supplierCode || '--') +
                        ') ' +
                        (params?.skuVo?.supplierNameZh || '--')}
                  </span>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="备货方式">
                  <span>{params.deliveryTypeStr}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="交付方式">
                  <span>{params.deliveryTermStr}</span>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="交付周期(工作日)">
                  <span>{params.skuVo?.leadTime}</span>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="采购计价货币">
                  <span>{params.skuVo?.purchCurrency || params.purchCurrency}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="含税采购价">
                  {pathParams?.sorurceType === 'info' && <span>***</span>}
                  {pathParams?.sorurceType !== 'info' && <span>{params.skuVo?.purchPrice}</span>}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="CNY含税采购价">
                  {pathParams?.sorurceType === 'info' && <span>***</span>}
                  {pathParams?.sorurceType !== 'info' && <span>{params.skuVo?.purchPriceCNY}</span>}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="含税面价">
                  <span>{params.skuVo?.listPrice}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="含税销售成交价">
                  <span>{params.skuVo?.salesPrice}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="折扣类型">
                  <span>{params.discountCode}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="GP0(%)">
                  {['info', 'ae', 'te', 'aepcm', 'tepcm'].includes(pathParams?.sorurceType) && (
                    <span>***</span>
                  )}
                  {!['info', 'ae', 'te', 'aepcm', 'tepcm'].includes(pathParams?.sorurceType) && (
                    <span>{params.skuVo?.gp0}</span>
                  )}
                  {/*{pathParams?.sorurceType === 'info' && <span>***</span>}
                  {pathParams?.sorurceType !== 'info' && <span>{params.skuVo?.gp0}</span>}*/}
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="GP1(%)">
                  {pathParams?.sorurceType === 'info' && <span>***</span>}
                  {pathParams?.sorurceType !== 'info' && <span>{params.skuVo?.gpRate}</span>}
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="报价有效期(天)">
                  <span>{params.quoteValidDates}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="报价到期日">
                  <span>{params.quoteValidDate}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                {(['quote', 'sourcing-pcm'].includes(pathParams?.sorurceType) ||
                  location?.pathname?.indexOf('sourcing/all') > 0) && (
                  <Form.Item label="进项税(%)">
                    <span>{params?.skuVo?.inTaxRateStr}</span>
                  </Form.Item>
                )}
              </Col>
              <Col span={6}>
                <Form.Item label="是否定制品">
                  <span>{params?.skuVo?.fixedProduct ? '是' : '否'}</span>
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            {(params.lineStatus === 120 || params.lineStatus === 130) &&
              sessionStorage.getItem('remark') && (
                <Row>
                  <Col span={24}>
                    <Form.Item label="选配备注" labelCol={{ span: 2 }} wrapperCol={{ span: 16 }}>
                      <Input.TextArea
                        style={{ marginRight: 8 }}
                        rows={3}
                        showCount
                        maxLength={255}
                        value={RemarkDesc}
                        onChange={RemarkParams}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}

            {/*<Row>	
							<Col span={16}>
							  <Form.Item label="选配备注">
							    <Input.TextArea
							      rows={3}
							      showCount
							      maxLength={255}
							      value={RemarkDesc}
							      onChange={RemarkParams}
							    />
							     {['aepcm'].includes(pathParams?.sorurceType) && (
							      <Input.TextArea
							        rows={3}
							        showCount
							        maxLength={255}
							        value={RemarkDesc||params.skuVo?.matchRemark}
							        onChange={RemarkParams}
							      />
							    )} 
							  </Form.Item>
							</Col>
            </Row>*/}
            {!sessionStorage.getItem('remark') && (
              <Form.Item label="选配备注">
                <span>{params.skuVo?.matchRemark}</span>
              </Form.Item>
            )}
            <Row>
              <Form.Item label="Sourcing备注">
                <span className="wordBreak">{params.skuVo?.skuRemark}</span>
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label="实时询价备注">
                <span className="wordBreak">{params.rfqQuoteRemark}</span>
              </Form.Item>
            </Row>
            {lastPath !== 'all' ? (
              <Row>
                <Form.Item label="定制品图纸">
                  <span className="wordBreak">{params.skuVo?.fixedProductUrl} </span>
                </Form.Item>
              </Row>
            ) : null}
          </Form>
          {(['quote', 'otherchannel', 'all', 'info'].includes(pathParams?.sorurceType) ||
            lastPath === 'all') && (
            <div className="productDetailInfo">
              <h3 style={{ marginTop: '20px' }}>商品信息</h3>
              <Divider />
              <SkuInfoEdit
                params={params?.skuVo}
                disabled={true}
                pathType={pathParams?.sorurceType}
                valueChange={(val: any) => setImgParams(val)}
              />
            </div>
          )}
          {!['allRFQ', 'RFQquote'].includes(pathParams?.sorurceType) && (
            <React.Fragment>
              <h3 style={{ marginTop: '20px' }}>退回信息</h3>
              <Divider />
              <Form size="small">
                <Row>
                  <Col span={6}>
                    <Form.Item label="退回类型">
                      <span>{params?.returnVo?.returnType}</span>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="退回原因类型">
                      <span>{params?.returnVo?.returnReason}</span>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="退回原因描述">
                  <span>{params?.returnVo?.returnReasonDesc}</span>
                </Form.Item>
              </Form>
            </React.Fragment>
          )}

          {/*{params.returnVo && (
            <React.Fragment>
              <h3 style={{ marginTop: '20px' }}>退回信息</h3>
              <Divider />
              <Form size="small">
                <Row>
                  <Col span={6}>
                    <Form.Item label="退回类型">
                      <span>{params.returnVo.returnType}</span>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="退回原因类型">
                      <span>{params.returnVo.returnReason}</span>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="退回原因描述">
                  <span>{params.returnVo.returnReasonDesc}</span>
                </Form.Item>
              </Form>
            </React.Fragment>
          )}*/}
          {params.cancelReason && (
            <React.Fragment>
              <h3 style={{ marginTop: '20px' }}>取消选配型信息</h3>
              <Divider />
              <Form size="small">
                <Form.Item label="取消原因">
                  <span>{params.cancelReason}</span>
                </Form.Item>
                <Form.Item label="取消备注">
                  <span>{params.cancelReasonDesc}</span>
                </Form.Item>
              </Form>
            </React.Fragment>
          )}
        </div>
      </div>
    </Spin>
  );
};

export default forwardRef(SkuDetail);
