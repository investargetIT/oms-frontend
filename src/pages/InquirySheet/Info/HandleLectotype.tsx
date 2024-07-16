/* eslint-disable @typescript-eslint/no-unused-expressions */
import Category from '@/pages/components/Category';
import Country from '@/pages/components/Country';
import Family from '@/pages/components/Family';
import {
  getCustomerCascadeLevel,
  getLinePrice,
  inqLnInfo,
  validSku,
} from '@/services/InquirySheet';
import { validatePriceBase, validateTaxNo } from '@/util/index';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Spin,
} from 'antd';
import type { FormInstance } from 'antd/es/form';
import moment from 'moment';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useLocation } from 'umi';
import BrandCom from '../../components/BrandCom';
import ProductLine from '../../components/ProductLine';
import Segment from '../../components/Segment';
import SelectCommon from '../../components/SelectCommon';
import SupplierSelectCom from '../../components/SupplierSelectCom';
import Uom from '../../components/Uom';
import '../Add/add.less';
import DemandBaseInfo from './DemandBaseInfo';
import './info.less';
import PmsSkuInfo from './PmsSkuInfo';
const HandleLectotype: React.FC<{
  id?: string;
  backMtd?: Function;
  customerCode: string;
  custPurpose: string;
  curPath?: any;
}> = ({ id, backMtd, customerCode, custPurpose, curPath }: any, ref: any) => {
  const [form] = Form.useForm();
  const location: any = useLocation();
  const pathParams: any = location.state;
  const formRef = React.createRef<FormInstance>();
  const baseRef = React.createRef<FormInstance>();
  const baseRef1 = React.createRef<FormInstance>();
  const [haSku, setHaSku] = useState(0);
  const [productOilFlag, setProductOilFlag]: any = useState(0);
  const [skuParams, setSKuParams]: any = useState([]);
  const [params, setParams]: any = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productCode, setProductCode]: any = useState('');
  const [segmentCode, setSegmentCode] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [hasDefaultFamily, setHasDefaultFamily]: any = useState(false);
  const [title, setTitle]: any = useState('匹配信息');
  const [lastPath, setLastPath]: any = useState('');
  const [supplierName, setSupplierName]: any = useState('');
  const [brandName, setBrandName]: any = useState('');
  const [level, setLevel]: any = useState(2);
  const [pairTypeList, setPairTypeList]: any = useState([]);
  const [load, setLoad]: any = useState(false);
  const [defaultUomCode, setDefaultUomCode]: any = useState('EA_个');
  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 16 },
  };
  useEffect(() => {
    if (customerCode && !['ae', 'te'].includes(lastPath)) {
      getCustomerCascadeLevel({ list: [customerCode] }).then((res: any) => {
        if (res?.errCode === 200 && res?.data[0]?.cascadeLevel) {
          setLevel(res?.data[0].cascadeLevel);
        }
      });
    }
    if (lastPath == '00') {
      console.log(curPath);
    }
  }, [customerCode]);
  const handleData = (data: any) => {
    const formInit: any = { ...data, ...data.skuVo, ...data.reqVo };
    if (formInit.pairType || formInit.pairType === 0) formInit.pairType += '';
    if (formInit.dangerType || formInit.dangerType === 0) formInit.dangerType += '';
    if (formInit.transportCondition || formInit.transportCondition === 0)
      formInit.transportCondition += '';
    if (formInit.brandCode || formInit.brandCode === 0) formInit.brandCode += '';
    if (formInit.deliveryType || formInit.deliveryType === 0)
      formInit.deliveryType = formInit.deliveryType.toString();
    if (!formInit.sku && formInit.reqBrandName) {
      setBrandName(formInit.reqBrandName);
      formInit.brandCode = formInit.reqBrandCode;
      formInit.brandName = formInit.reqBrandName;
    }
    setProductOilFlag(formInit.productOilFlag);
    if (formInit.productOilFlag == 1) {
      setDefaultUomCode('L_升');
    } else {
      setDefaultUomCode('EA_个');
    }
    form.setFieldsValue(formInit);
    if (formInit.supplierNameZh) setSupplierName(formInit.supplierNameZh);
    if (formInit.productLineCode) setProductCode(formInit.productLineCode);
    if (formInit.segmentCode) setSegmentCode(formInit.segmentCode);
    if (formInit.familyCode) setFamilyCode(formInit.familyCode);
  };
  const reqSkuTypeChange = (val: any) => {
    switch (val) {
      case 10:
        setPairTypeList([
          { id: 10, name: '替代' },
          { id: 20, name: '精确匹配' },
        ]);
        baseRef.current?.setFieldsValue({ pairType: '' });
        break;
      case 20:
        setPairTypeList([{ id: 30, name: '需sourcing' }]);
        baseRef.current?.setFieldsValue({ pairType: 30 });
        break;
      case 80:
        setPairTypeList([{ id: 30, name: '需sourcing' }]);
        baseRef.current?.setFieldsValue({ pairType: 30 });
        break;
      default:
        setPairTypeList([]);
        baseRef.current?.setFieldsValue({ pairType: '' });
        break;
    }
  };
  useEffect(() => {
    setLastPath(pathParams?.sorurceType);
    if (id) {
      setLoad(true);
      const tempCur: any = baseRef.current;
      const tempCur1: any = baseRef1.current;
      inqLnInfo(id).then((res: any) => {
        if (res.errCode === 200) {
          const temp: any = res.data;
          setParams(temp);
          const tempParams = { ...res.data, ...res.data.skuVo };
          setBrandName(tempParams.brandName);
          handleData(tempParams);
          if (tempParams?.skuVo?.familyCode) {
            setHasDefaultFamily(true);
          } else {
            setHasDefaultFamily(false);
          }

          let reqSkuType = tempParams.reqSkuType;
          tempCur?.setFieldsValue({
            reqSkuType: tempParams.reqSkuType,
            pairType: tempParams.pairType,
          });
          tempCur1?.setFieldsValue({ productOilType: tempParams?.productOilType?.toString() });
          // 匹配不一致导致的修改，共用接口枚举需注意
          if (tempParams.sku) {
            setSKuParams(tempParams);
            tempCur?.setFieldsValue({ haSku: 1 });
            setHaSku(1);
          }
          if (pathParams?.sorurceType === 'otherchannel') {
            setTitle('指定渠道物料信息');
            tempCur?.setFieldsValue({ reqSkuType: 80 });
            reqSkuType = 80;
            tempCur1?.setFieldsValue({ deliveryTerm: 'EXW', deliveryType: '1' });
          } else if (pathParams?.sorurceType === 'createsku') {
            tempCur?.setFieldsValue({ reqSkuType: 10, haSku: 1 });
            setHaSku(1);
            reqSkuType = 10;
          }
          reqSkuTypeChange(reqSkuType);
          setLoad(false);
        } else {
          message.error(res?.errMsg || '出错了！');
          setLoad(false);
        }
      });
    }
  }, [id]);
  const onLog = () => {
    if (backMtd) {
      backMtd({ id: id });
    }
  };
  const onChange = (e: any) => {
    setHaSku(e.target.value);
    if (e.target.value == 0) {
      if (productOilFlag == 1) {
        baseRef1.current?.setFieldsValue({
          phyUomCode: 'L_升',
          salesUomCode: 'L_升',
        });
      } else {
        baseRef1.current?.setFieldsValue({
          phyUomCode: 'EA_个',
          salesUomCode: 'EA_个',
        });
      }
    }
  };
  const onChangeCpy = (e: any) => {
    if (e.target.value === 1) {
      baseRef1.current?.setFieldsValue({
        transportCondition: '13',
        transportConditionStr: '非成品油',
      });
      if (haSku == 0) {
        baseRef1.current?.setFieldsValue({
          phyUomCode: 'L_升',
          salesUomCode: 'L_升',
        });
      }
      setDefaultUomCode('L_升');
    } else {
      baseRef1.current?.setFieldsValue({ transportCondition: '', transportConditionStr: '' });
      if (haSku == 0) {
        baseRef1.current?.setFieldsValue({
          phyUomCode: 'EA_个',
          salesUomCode: 'EA_个',
        });
      }
      setDefaultUomCode('EA_个');
    }
    setProductOilFlag(e.target.value);
    baseRef1.current?.setFieldsValue({ productOilTypeStr: '', productOilType: '', taxNo: '' });
  };
  const onChangeSku = (e: any) => {
    if (!e.target.value || e.target.value.length < 6) return;
    validSku(e.target.value, params.reqVo.reqQty, customerCode, custPurpose).then((res: any) => {
      if (res.errCode === 200) {
        setSKuParams(res.data);
        if (res.data.discountPerc) {
          params.discountPerc = res.data.discountPerc;
        }
        if (res.data.discountCode) {
          params.discountCode = res.data.discountCode;
        }
      } else {
        setSKuParams({});
        message.error(res.errMsg);
      }
    });
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const productChange = (val: any) => {
    setProductCode(val);
    form.setFieldsValue({
      segmentName: '',
      segmentCode: '',
      familyCode: '',
      familyName: '',
      categoryCode: '',
      categoryName: '',
      skuVo: {
        segmentName: '',
        segmentCode: '',
        familyCode: '',
        familyName: '',
        categoryCode: '',
        categoryName: '',
      },
    });
  };
  const segmentChange = (val: any, option: any) => {
    setSegmentCode(val);
    setHasDefaultFamily(false);
    form.setFieldsValue({
      familyCode: '',
      familyName: '',
      categoryCode: '',
      categoryName: '',
      sourcingGpRate: option.sourcinggprate,
      skuVo: {
        familyCode: '',
        familyName: '',
        categoryCode: '',
        categoryName: '',
        sourcingGpRate: option.sourcinggprate,
      },
    });
  };
  const familyChange = (val: any, option: any) => {
    setFamilyCode(val);
    form.setFieldsValue({
      categoryCode: '',
      categoryName: '',
      sourcingGpRate: option.sourcinggprate,
      skuVo: {
        categoryCode: '',
        categoryName: '',
        sourcingGpRate: option.sourcinggprate,
      },
    });
  };
  // 暴露组件的方法
  useImperativeHandle(ref, () => ({
    getParams: async () => {
      const res = await baseRef?.current?.validateFields();
      if (res.haSku !== 1 && lastPath === 'createsku') {
        message.warning('只能选择有sku时才能提交!');
        return false;
      }
      let temp: any = { skuVo: {} };
      temp.skuVo.pairType = res.pairType;
      temp.reqSkuType = res.reqSkuType;
      temp.skuVo.inqLineId = params.skuVo.inqLineId;
      temp.skuVo.inquiryId = params.skuVo.inquiryId;
      temp.sid = params.sid;
      if (res?.haSku) {
        const resSku = await baseRef1?.current?.validateFields();
        if (!resSku) return false;
        temp = {
          ...skuParams,
          skuVo: { ...skuParams.skuVo, ...temp.skuVo, matchRemark: resSku.matchRemark },
          reqSkuType: res.reqSkuType,
          sid: params.sid,
        };
      } else {
        const resSku = await baseRef1?.current?.validateFields();
        if (resSku) {
          temp.containInstall = resSku.containInstall;
          temp.dangerType = resSku.dangerType;
          temp.deliveryType = resSku.deliveryType;
          temp.deliveryTerm = resSku.deliveryTerm;
          temp.transportCondition = resSku.transportCondition;
          temp.transportConditionStr = resSku.transportConditionStr;
          temp.purchCurrency = resSku.purchCurrency;
          temp.quoteValidDates = resSku.quoteValidDates;
          temp.quoteValidDate = resSku.quoteValidDate;
          temp.noReturn = resSku.noReturn;
          temp.sourcingReqType = resSku.sourcingReqType;
          temp.canExport = resSku.canExport;
          temp.hsCode = resSku.hsCode;
          temp.importFreight = resSku.importFreight;
          temp.canImport = resSku.canImport;
          temp.skuVo = { ...temp.skuVo, ...resSku, sku: '' };
          temp.reqSkuType = res.reqSkuType;
        }
      }
      temp.discountPerc = params.discountPerc;
      temp.discountCode = params.discountCode;
      return temp;
    },
  }));
  const onValuesChange = (changeVal: any, allVal: any) => {
    const { supplierCode, purchCurrency, purchPrice, salesPrice }: any = allVal;
    const detailCategoryCode: any = allVal.segmentCode || allVal.familyCode || allVal.categoryCode;
    if (supplierCode && purchCurrency && purchPrice && salesPrice && detailCategoryCode) {
      getLinePrice({
        customerCode,
        detailCategoryCode,
        supplierCode,
        purchCurrency,
        purchPrice,
        salesPrice,
        discountPerc: params.discountPerc,
      }).then((res: any) => {
        if (res.errCode === 200) {
          form.setFieldsValue(res.data);
          if (res.data.discountPerc) {
            params.discountPerc = res.data.discountPerc;
          }
          if (res.data.discountCode) {
            params.discountCode = res.data.discountCode;
          }
        }
      });
    }
  };
  const getBrandType = (val: any, valStr: any, name: any) => {
    baseRef1.current?.setFieldsValue({ brandName: name, brandType: val, brandTypeStr: valStr });
  };
  const onQuoteValidDates = (e: any) => {
    if (e.target.value) {
      const newDate = moment().add(e.target.value, 'day').format('YYYY-MM-DD');
      baseRef1.current?.setFieldsValue({ quoteValidDate: newDate });
    }
  };
  return (
    <Spin spinning={load}>
      <div
        className="base-info contentSty sku-detail inquirySheetInfo noBorderCard"
        id="quotedPriceForm"
      >
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
        <div className="editContentCol" style={{ backgroundColor: '#fff', padding: '10px' }}>
          <Card
            id="detailInfoCard"
            title="需求信息"
            headStyle={{ fontWeight: 'bold', fontSize: '12px', padding: '0px', minHeight: '22px' }}
          >
            <DemandBaseInfo
              discountPerc={params.discountPerc}
              discountCode={params.discountCode}
              params={{
                ...params,
                ...params.reqVo,
              }}
            />
          </Card>
          <Card
            title={title}
            headStyle={{ fontWeight: 'bold', fontSize: '12px', padding: '0px', minHeight: '22px' }}
          >
            <Form {...layout} ref={baseRef} labelWrap initialValues={{ haSku: 0 }}>
              <Row style={{ marginTop: 20 }}>
                <Col span={6}>
                  <Form.Item label="有无SKU号" rules={[{ required: true }]} name={'haSku'}>
                    <Radio.Group onChange={onChange} value={haSku}>
                      <Radio value={0}>无SKU号</Radio>
                      <Radio value={1}>有SKU号</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="需求SKU类型"
                    className="super-label"
                    rules={[{ required: true }]}
                    name={'reqSkuType'}
                  >
                    <Select
                      disabled={['createsku', 'otherchannel'].includes(lastPath)}
                      onChange={reqSkuTypeChange}
                    >
                      <Select.Option value={20}>sourcing</Select.Option>
                      <Select.Option value={10}>目录品</Select.Option>
                      {/* <Select.Option value={80}>指定渠道</Select.Option> */}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="匹配类型" rules={[{ required: true }]} name={'pairType'}>
                    <Select>
                      <Select.Option value={''}>==请选择==</Select.Option>
                      {pairTypeList.map((item: any) => (
                        <Select.Option value={item.id} key={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Divider />
            <Form
              form={form}
              autoComplete="off"
              ref={baseRef1}
              {...layout}
              labelWrap
              onValuesChange={onValuesChange}
              initialValues={{
                productOilFlag: 0,
                phyUomCode: defaultUomCode,
                salesUomCode: defaultUomCode,
                canExport: 1,
                canImport: 1,
                purchCurrency: 'CNY',
              }}
            >
              {haSku === 0 && (
                <React.Fragment>
                  <h4 style={{ marginTop: '20px' }}>请填写SKU信息</h4>
                  <Row className={pathParams?.sorurceType === 'createsku' ? 'disabled' : ''}>
                    <Col span={6}>
                      <Form.Item label="" name="productLineName" style={{ display: 'none' }}>
                        <Input disabled />
                      </Form.Item>
                      <Form.Item
                        label="Product"
                        name="productLineCode"
                        rules={[{ required: true, message: '请选择' }]}
                      >
                        <ProductLine
                          isEdit={false}
                          onChange={productChange}
                          onType={(val: any) =>
                            baseRef1.current?.setFieldsValue({
                              productLineName: val,
                              segmentName: '',
                              segmentCode: '',
                              familyName: '',
                              familyCode: '',
                              categoryCode: '',
                              categoryName: '',
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="" name="segmentName" style={{ display: 'none' }}>
                        <Input disabled />
                      </Form.Item>
                      <Form.Item label="" name="sourcingGpRate" style={{ display: 'none' }}>
                        <Input disabled />
                      </Form.Item>
                      <Form.Item
                        label="Segment"
                        name="segmentCode"
                        rules={[{ required: true, message: '请选择' }]}
                      >
                        <Segment
                          isEdit={false}
                          parentId={productCode}
                          onChange={segmentChange}
                          onType={(val: any, rate: any) => {
                            form.setFieldsValue({
                              sourcingGpRate: rate,
                              segmentName: val,
                              skuVo: {
                                sourcingGpRate: rate,
                                segmentName: val,
                              },
                            });
                            if (!val) {
                              console.log(hasDefaultFamily);
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {lastPath !== 'ae' && (
                      <React.Fragment>
                        <Col span={6}>
                          <Form.Item label="" name="familyName" style={{ display: 'none' }}>
                            <Input disabled />
                          </Form.Item>
                          <Form.Item
                            label="Family"
                            name={'familyCode'}
                            // rules={[{ required: lastPath === 'otherchannel' }]}
                            rules={[{ required: true, message: '请选择' }]}
                          >
                            <Family
                              parentId={segmentCode}
                              onChange={familyChange}
                              onType={(val: any, rate: any) => {
                                // form.setFieldsValue({
                                //   familyName: val,
                                //   // categoryCode: '',
                                //   // categoryName: '',
                                // })

                                form.setFieldsValue({
                                  sourcingGpRate: rate,
                                  familyName: val,
                                  skuVo: {
                                    sourcingGpRate: rate,
                                    familyName: val,
                                  },
                                });
                                console.log(rate);
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </React.Fragment>
                    )}

                    {level === 4 && (
                      <React.Fragment>
                        <Col span={6}>
                          <Form.Item label="" name="categoryName" style={{ display: 'none' }}>
                            <Input disabled />
                          </Form.Item>
                          <Form.Item
                            label="Category"
                            name={'categoryCode'}
                            rules={[{ required: lastPath === 'otherchannel' }]}
                          >
                            <Category
                              isEdit={false}
                              parentId={familyCode}
                              onType={(val: any, rate: any) =>
                                baseRef1.current?.setFieldsValue({
                                  categoryName: val,
                                  sourcingGpRate: rate,
                                  skuVo: {
                                    categoryName: val,
                                    sourcingGpRate: rate,
                                  },
                                })
                              }
                            />
                          </Form.Item>
                        </Col>
                      </React.Fragment>
                    )}
                    <Col span={6}>
                      <Form.Item
                        label="产品名称(中文)"
                        className="super-label"
                        name={'productNameZh'}
                        rules={[{ required: lastPath === 'otherchannel' }]}
                      >
                        <Input maxLength={40} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="brandCode" name={'brandName'} style={{ display: 'none' }}>
                        <Input />
                      </Form.Item>
                      <Form.Item label="品牌名称" name={'brandCode'}>
                        <BrandCom
                          isHidden={true}
                          name={brandName}
                          onType={getBrandType}
                          isEdit={false}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="品牌类型" name={'brandTypeStr'}>
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col span={8} style={{ display: 'none' }}>
                      <Form.Item label="品牌类型" name={'brandType'}>
                        <Input disabled />
                      </Form.Item>
                    </Col>

                    {/*<Col span={6}>
                    <Form.Item label="产品名称(英文)" name={'productNameEn'}>
                      <Input maxLength={40} />
                    </Form.Item>
                  </Col>*/}
                    <Col span={6}>
                      <Form.Item label="供应商" name={'supplierNameZh'} style={{ display: 'none' }}>
                        <Input disabled />
                      </Form.Item>
                      <Form.Item
                        label="供应商"
                        name={'supplierCode'}
                        rules={[{ required: lastPath === 'otherchannel' }]}
                      >
                        <SupplierSelectCom
                          isEdit={false}
                          filterName={supplierName}
                          getName={(val: any) => {
                            baseRef1.current?.setFieldsValue({ supplierNameZh: val });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="制造商型号"
                        name={'mfgSku'}
                        rules={[{ required: lastPath === 'otherchannel' }]}
                      >
                        <Input maxLength={100} showCount />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="供应商型号"
                        className="super-label"
                        name={'supplierSku'}
                        rules={[{ required: lastPath === 'otherchannel' }]}
                      >
                        <Input maxLength={100} showCount />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="物理单位"
                        name={'phyUomCode'}
                        rules={[{ required: lastPath === 'otherchannel' }]}
                      >
                        <Uom isProductOil={productOilFlag} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="销售单位"
                        name={'salesUomCode'}
                        rules={[{ required: lastPath === 'otherchannel' }]}
                      >
                        <Uom isProductOil={'0'} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="销售单位含物理单位个数"
                        className="minLabel"
                        name={'salesPackQty'}
                        rules={[{ required: lastPath === 'otherchannel' }]}
                      >
                        <InputNumber min={1} max={99999} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    {['ae', 'te', 'createsku'].includes(lastPath) && (
                      <React.Fragment>
                        <Col span={6}>
                          <Form.Item
                            label="是否成品油"
                            name={'productOilFlag'}
                            rules={[{ required: true }]}
                          >
                            <Radio.Group onChange={onChangeCpy} value={productOilFlag}>
                              <Radio value={0}>否</Radio>
                              <Radio value={1}>是</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label="成品油分类"
                            name={'productOilTypeStr'}
                            style={{ display: 'none' }}
                          >
                            <Input disabled />
                          </Form.Item>
                          <Form.Item
                            label="成品油分类"
                            name={'productOilType'}
                            rules={[{ required: !!productOilFlag }]}
                          >
                            <SelectCommon
                              isEdit={false}
                              selectType="productOilType"
                              disabled={!productOilFlag}
                              getName={(val: any) => {
                                baseRef1.current?.setFieldsValue({ productOilTypeStr: val });
                              }}
                              getRemark={(val: any) => {
                                baseRef1.current?.setFieldsValue({ taxNo: val });
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label="税收分类编码"
                            name={'taxNo'}
                            rules={[
                              {
                                required: false,
                                validator: validateTaxNo,
                                message: '税收分类编码为19位数字',
                              },
                            ]}
                          >
                            <Input disabled={!!productOilFlag} />
                          </Form.Item>
                        </Col>
                      </React.Fragment>
                    )}
                    {['otherchannel'].includes(lastPath) && (
                      <React.Fragment>
                        <Col span={6}>
                          <Form.Item
                            label="是否含安装"
                            name={'containInstall'}
                            rules={[{ required: true }]}
                          >
                            <Radio.Group>
                              <Radio value={0}>否</Radio>
                              <Radio value={1}>是</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="危险品种类" name={'dangerType'}>
                            <SelectCommon isEdit={false} selectType="dangerType" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label="交付方式"
                            name={'deliveryTerm'}
                            rules={[{ required: true }]}
                          >
                            <SelectCommon
                              isEdit={false}
                              disabled={lastPath === 'otherchannel'}
                              selectType="deliveryTerm"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label="备货方式"
                            name={'deliveryType'}
                            rules={[{ required: true }]}
                          >
                            <SelectCommon
                              isEdit={false}
                              disabled={lastPath === 'otherchannel'}
                              selectType="deliveryType"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label="特殊运输方式"
                            name={'transportCondition'}
                            rules={[{ required: true }]}
                          >
                            <SelectCommon
                              isEdit={false}
                              disabled={!!productOilFlag}
                              disabledOption={!productOilFlag && ['13']}
                              selectType="transportCondition"
                              getName={(val: string) => {
                                form.setFieldsValue({ transportConditionStr: val });
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label="交付周期(工作日)"
                            name={'leadTime'}
                            rules={[{ required: true }]}
                          >
                            <InputNumber min={1} precision={0} />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="产品原产国" name={'madeinCountryCode'}>
                            <Country />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="是否可出口" name={'canExport'}>
                            <Radio.Group>
                              <Radio value={1}>否</Radio>
                              <Radio value={0}>是</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="HSCode" name={'hsCode'} rules={[{ required: true }]}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="进口运费" name={'importFreight'}>
                            <Input disabled />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="是否可进口" name={'canImport'}>
                            <Radio.Group>
                              <Radio value={1}>否</Radio>
                              <Radio value={0}>是</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="产品尺寸" name={'size'} rules={[{ required: true }]}>
                            <InputNumber min={0} maxLength={17} />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="产品重量" name={'weight'} rules={[{ required: true }]}>
                            <InputNumber min={0} maxLength={17} />
                          </Form.Item>
                        </Col>
                        <Divider />
                        <Col span={6}>
                          <Form.Item
                            label="采购计价货币"
                            className="super-label"
                            name={'purchCurrency'}
                            rules={[{ required: true }]}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label="含税销售成交价"
                            className="super-label"
                            name={'salesPrice'}
                            rules={[
                              {
                                required: true,
                                validator: validatePriceBase,
                                message: '含税销售成交价',
                              },
                            ]}
                          >
                            <InputNumber min={0.01} precision={2} maxLength={17} />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label="含税采购价"
                            name={'purchPrice'}
                            rules={[
                              {
                                required: true,
                                validator: validatePriceBase,
                                message: '请填写合理的含税采购价',
                              },
                            ]}
                          >
                            <InputNumber min={0.01} precision={2} maxLength={17} />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="GP(%)" name={'gpRate'}>
                            <Input disabled />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label="报价有效期(天)"
                            className="super-label"
                            name={'quoteValidDates'}
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              onBlur={onQuoteValidDates}
                              min={1}
                              max={60}
                              precision={0}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="报价到期日" name={'quoteValidDate'}>
                            <Input disabled />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label="销售最小起订量"
                            className="super-label"
                            name={'salesMoq'}
                            rules={[{ required: true }]}
                          >
                            <InputNumber min={1} maxLength={17} />
                          </Form.Item>
                        </Col>
                      </React.Fragment>
                    )}
                  </Row>
                  <Row>
                    {/*<Col span={6}>
                    <Form.Item label="规格" name={'techSpec'}>
                      <Input />
                    </Form.Item>
                  </Col>*/}
                    <Col span={24}>
                      <Form.Item
                        label="规格"
                        name={'techSpec'}
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input.TextArea
                          style={{ marginLeft: '-14px', marginRight: 10 }}
                          rows={3}
                          showCount
                          maxLength={200}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  {/*<Row>
                  <Col span={6}>
                    <Form.Item
                      label="Sourcing需求分类"
                      className="super-label"
                      name={'sourcingReqType'}
                    >
                      <Select>
                        <Select.Option value={'b'} key={'b'}>
                          B-目录品牌延伸产品
                        </Select.Option>
                        <Select.Option value={'c'} key={'c'}>
                          C-代购业务
                        </Select.Option>
                        <Select.Option value={'d'} key={'d'}>
                          D-非目录品牌产品
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  
                </Row>*/}
                  <Divider />
                </React.Fragment>
              )}
              {haSku === 1 && (
                <React.Fragment>
                  {/*<h4>匹配SKU信息</h4>*/}
                  <Row style={{ marginTop: 20 }}>
                    <Col span={6}>
                      <Form.Item label="SKU号" name={'sku'} rules={[{ required: true }]}>
                        <Input onBlur={onChangeSku} />
                      </Form.Item>
                    </Col>
                    <Col span={16} />
                  </Row>
                  <PmsSkuInfo params={skuParams} />
                </React.Fragment>
              )}
              <Row style={{ marginTop: 20 }}>
                <Col span={24}>
                  <Form.Item
                    label="选配备注"
                    name={'matchRemark'}
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input.TextArea
                      style={{ marginLeft: '-14px', marginRight: 10 }}
                      rows={3}
                      showCount
                      maxLength={255}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
        <Modal
          title="添加品牌  (仅支持添加sourcing类型的品牌)"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form ref={formRef} labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
            <Form.Item
              label="品牌名称"
              name="brandName"
              rules={[{ required: true, message: '请选择' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="备注" name="remark">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default forwardRef(HandleLectotype);
