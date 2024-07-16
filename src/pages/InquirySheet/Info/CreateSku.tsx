/* eslint-disable @typescript-eslint/no-unused-expressions */
import Category from '@/pages/components/Category';
import Country from '@/pages/components/Country';
import DeliveryTerm from '@/pages/components/DeliveryTerm';
import Family from '@/pages/components/Family';
import ProductLine from '@/pages/components/ProductLine';
import Segment from '@/pages/components/Segment';
import SkuInfoEdit from './SkuInfoEdit';
import {
  getCustomerCascadeLevel,
  getLinePrice,
  inqLnInfo,
  inqLnSourcingUpdate,
  validSku,
  RFQgetCalculatePrice,
  RFQsaveCheck,
  // updateSkuImg,
} from '@/services/InquirySheet';
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
import SelectCommon from '../../components/SelectCommon';
import SupplierSelectCom from '@/pages/components/SupplierSelectCom';
import Uom from '../../components/Uom';
import '../Add/add.less';
import DemandBaseInfo from './DemandBaseInfo';
import './info.less';
import { validateTaxNo } from '@/util/index';
import { ProFormSelect } from '@ant-design/pro-form';
import { getByKeys } from '@/services';
const CreateSku: React.FC<{
  id: string;
  backMtd?: Function;
  customerCode: string;
  custPurpose: string;
  onFileChangeTrue?: () => void;
  onFileChangeFalse?: () => void;
  setSaveLoading?: () => void;
  curPath?: any;
}> = (
  {
    id,
    backMtd,
    customerCode,
    custPurpose,
    onFileChangeTrue,
    onFileChangeFalse,
    setSaveLoading,
    curPath,
  }: any,
  ref: any,
) => {
  const location: any = useLocation();
  const pathParams: any = location.state;
  const [productOilFlag, setProductOilFlag] = useState(0);
  const [productLineCode, setProductLineCode] = useState('');
  const [segmentCode, setSegmentCode] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [hasDefaultFamily, setHasDefaultFamily]: any = useState(false);
  const [imgParams, setImgParams] = useState({});
  const [params, setParams]: any = useState({});
  const [supplierName, setSupplierName]: any = useState('');
  const [level, setLevel]: any = useState(2);
  const [isEdit, setIsEdit]: any = useState(false);
  const [isProductNameZhOrigin, setIsProductNameZhOrigin]: any = useState(false);
  const formRef = React.createRef<FormInstance>();
  const [isEnable, setIsEnable] = useState<any>(false);
  const [form] = Form.useForm();
  const [isHidden, setIsHidden]: any = useState(true);
  const [defaultUomCode, setDefaultUomCode]: any = useState('EA_个');
  const [load, setLoad]: any = useState(false);
  const [taxList, setTaxList]: any = useState([]);
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  useEffect(() => {
    if (customerCode) {
      getCustomerCascadeLevel({ list: [customerCode] }).then((res: any) => {
        if (res?.errCode === 200 && res?.data[0]?.cascadeLevel) {
          setLevel(res?.data[0].cascadeLevel);
        }
      });
    }
  }, [customerCode]);
  const handleData = (data: any) => {
    const formInit: any = { ...data, ...data.skuVo, ...data.reqVo };
    if (formInit.pairType || formInit.pairType === 0) formInit.pairType += '';
    if (formInit.dangerType || formInit.dangerType === 0) formInit.dangerType += '';
    if (formInit.transportCondition || formInit.transportCondition === 0)
      formInit.transportCondition += '';
    if (formInit.productOilType) formInit.productOilType += '';
    if (formInit.brandCode || formInit.brandCode === 0) formInit.brandCode += '';
    if (formInit.deliveryType || formInit.deliveryType === 0)
      formInit.deliveryType = formInit.deliveryType.toString();
    setProductOilFlag(formInit.productOilFlag);
    if (formInit.productOilFlag == 1) {
      setDefaultUomCode('L_升');
    } else {
      setDefaultUomCode('EA_个');
    }

    if (formInit.quoteValidDates) {
      const newDate = moment().add(Number(formInit.quoteValidDates), 'day').format('YYYY-MM-DD');
      formInit.quoteValidDate = newDate;
    }

    form.setFieldsValue(formInit);

    if (formInit.supplierNameZh) setSupplierName(formInit.supplierNameZh);
    if (formInit.productLineCode) setProductLineCode(formInit.productLineCode);
    if (formInit.segmentCode) setSegmentCode(formInit.segmentCode);
    if (formInit.familyCode) {
      setFamilyCode(formInit.familyCode);
    }
  };
  useEffect(() => {
    if (id) {
      setLoad(true);
      setIsEdit(false);
      setIsHidden(true);
      console.log(1);
      inqLnInfo(id).then((res: any) => {
        if (res.errCode === 200) {
          const temp: any = res.data;
          if (temp?.skuVo?.productNameZhOrigin) {
            setIsProductNameZhOrigin(true);
          }
          if (res.data?.lineStatus === 140 || curPath === 'allRFQ' || curPath === 'RFQquote') {
            setIsEdit(true);
          }
          // if(!res.data.quoteValidDates)

          // if (res.data?.lineStatus === 140 || res.data?.lineStatus === 150) {
          //   setIsHidden(true);
          // } else {
          //   setIsHidden(false);
          // }
          if (curPath === 'allRFQ' || curPath === 'RFQquote') {
            const allVal: any = res?.data?.skuVo;
            const { purchPrice, listPrice }: any = allVal;
            let code = [
              allVal?.productLineCode,
              allVal?.segmentCode,
              allVal?.familyCode,
              allVal?.categoryCode,
            ];
            code = code.filter((item: any) => item);
            if (purchPrice && listPrice && code) {
              setLoad(true);
              RFQgetCalculatePrice({
                customerCode,
                detailCategoryCode: code.join(),
                purchPrice,
                listPrice,
                purchCurrency: res?.data?.purchCurrency || 'CNY',
                // purchPriceCNY: allVal?.purchPriceCNY || 0,
              }).then((respons: any) => {
                if (respons.errCode === 200) {
                  form.setFieldsValue(respons.data);
                  const dis: any = respons.data;
                  temp.skuVo = {
                    ...allVal,
                    ...dis,
                  };
                } else {
                  message.error(respons.errMsg);
                  setLoad(false);
                }
              });
            }
          }

          setParams({ ...temp, ...temp.reqVo, ...temp.skuVo });
          setIsEnable(temp.skuVo.sku ? true : false);
          handleData(temp);
          if (temp?.skuVo?.familyCode) {
            setHasDefaultFamily(true);
          } else {
            setHasDefaultFamily(false);
          }

          // quote 修改bug 是否成品油 是 特殊运输方式只能是13 认不是一致默认0
          if (res?.data?.skuVo?.productOilFlag == 1) {
            form.setFieldsValue({
              transportCondition: '13', //是油脂类，哎
              // transportConditionStr: '非成品油',
            });
          }

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
  const onChangeCpy = (e: any) => {
    if (e.target.value === 1) {
      form.setFieldsValue({
        transportCondition: '13',
        transportConditionStr: '非成品油',
      });
      if (!isEnable) {
        form.setFieldsValue({
          phyUomCode: 'L_升',
          salesUomCode: 'L_升',
        });
      }
      setDefaultUomCode('L_升');
    } else {
      form.setFieldsValue({ transportCondition: '', transportConditionStr: '' });
      if (!isEnable) {
        form.setFieldsValue({
          phyUomCode: 'EA_个',
          salesUomCode: 'EA_个',
        });
      }
      setDefaultUomCode('EA_个');
    }
    setProductOilFlag(e.target.value);
    form.setFieldsValue({ productOilTypeStr: '', productOilType: '', taxNo: '' });
  };
  const productChange = (val: any) => {
    setProductLineCode(val);
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
  const onQuoteValidDates = (e: any) => {
    if (e) {
      const newDate = moment().add(e, 'day').format('YYYY-MM-DD');
      form.setFieldsValue({ quoteValidDate: newDate });
    }
  };
  const onValuesChange = () => {
    if (setSaveLoading) setSaveLoading(true); //
    const allVal: any = form.getFieldsValue();

    if (curPath === 'allRFQ' || curPath === 'RFQquote') {
      const { purchPrice, listPrice }: any = allVal;
      let code = [
        allVal.productLineCode,
        allVal.segmentCode,
        allVal.familyCode,
        allVal.categoryCode,
      ];
      code = code.filter((item: any) => item);
      if (purchPrice && listPrice && code) {
        onFileChangeTrue && onFileChangeTrue();
        RFQgetCalculatePrice({
          customerCode,
          detailCategoryCode: code.join(),
          purchPrice,
          listPrice,
          purchCurrency: allVal?.purchCurrency || 'CNY',
          // purchPriceCNY: allVal?.purchPriceCNY || 0,
        }).then((res: any) => {
          if (res.errCode === 200) {
            form.setFieldsValue(res.data);
            const dis: any = res.data;
            // if (res.data.discountPerc) {//?线上问题修复，当后端传的是0的时候，就没进入逻辑，折扣更新有误，去掉两个if直接采用后端返回的值
            //   dis.discountPerc = res.data.discountPerc;
            // }
            // if (res.data.discountCode) {
            //   dis.discountCode = res.data.discountCode;
            // }

            setParams({ ...params, ...dis });
            onFileChangeFalse();
            if (setSaveLoading) setSaveLoading(true); //
          } else {
            if (setSaveLoading) setSaveLoading(true); //
            message.error(res.errMsg);
          }
        });
      }
    } else {
      const { purchPrice, salesPrice, inTaxRate }: any = allVal;
      let code = [
        allVal.productLineCode,
        allVal.segmentCode,
        allVal.familyCode,
        allVal.categoryCode,
      ];
      code = code.filter((item: any) => item);
      if (purchPrice && salesPrice && code) {
        onFileChangeTrue && onFileChangeTrue();
        getLinePrice({
          customerCode,
          detailCategoryCode: code.join(),
          purchPrice,
          salesPrice,
          purchCurrency: allVal?.purchCurrency || 'CNY',
          purchPriceCNY: allVal?.purchPriceCNY || 0,
          inTaxRate,
        }).then((res: any) => {
          if (res.errCode === 200) {
            form.setFieldsValue(res.data);
            const dis: any = res.data;
            // if (res.data.discountPerc) {//?线上问题修复，当后端传的是0的时候，就没进入逻辑，折扣更新有误，去掉两个if直接采用后端返回的值
            //   dis.discountPerc = res.data.discountPerc;
            // }
            // if (res.data.discountCode) {
            //   dis.discountCode = res.data.discountCode;
            // }

            setParams({ ...params, ...dis });
            onFileChangeFalse();
            if (setSaveLoading) setSaveLoading(true); //
          } else {
            if (setSaveLoading) setSaveLoading(true); //
            message.error(res.errMsg);
          }
        });
      }
    }
  };
  const getSkuInfo = (e: any): any => {
    setIsEdit(false);
    if (e.target.value && e.target.value.length > 5) {
      const path: any = pathParams?.sorurceType;
      // if (path === 'quote' && e.target.value.indexOf('FA') !== 0) {
      if (['quote', 'RFQquote'].includes(path) && e.target.value.indexOf('FA') !== 0) {
        message.warning('不可填写目录品SKU!');
        form.setFieldsValue({ sku: '' });
        return false;
      }
      validSku(e.target.value, params.reqVo.reqQty, customerCode, custPurpose).then((res: any) => {
        if (res.errCode === 200) {
          const tempData = res.data;
          setIsProductNameZhOrigin(tempData.skuVo?.productNameZh);
          tempData.skuVo = {
            ...params.skuVo,
            ...tempData.skuVo,
            productNameZhOrigin: tempData.skuVo?.productNameZh,
          };
          tempData.reqVo = { ...params.reqVo, ...tempData.reqVo };
          setParams({ ...params, ...tempData });
          handleData(tempData);
          // 匹配到sku信息不能修改
          setIsEnable(true);
          if (tempData.skuVo.sku && tempData.skuVo.sku?.toUpperCase()?.indexOf('FA') === -1)
            setIsEdit(true);
        } else {
          form.setFieldsValue({ sku: '' });
          message.error(res.errMsg);
        }
      });
    } else {
      form.setFieldsValue({ productNameZhOrigin: '' });
    }
  };
  // 暴露组件的方法
  useImperativeHandle(ref, () => ({
    getParams: async () => {
      const res = await formRef?.current?.validateFields();
      // const res = await form.getFieldsValue(true)
      res.inqLineId = params.skuVo.inqLineId;
      res.inquiryId = params.skuVo.inquiryId;
      const temp: any = { sid: params.skuVo.inqLineId };
      temp.sourcingReqType = res.sourcingReqType;
      temp.containInstall = res.containInstall;
      temp.warrantyPeriod = res.warrantyPeriod;
      temp.parts = res.parts;
      temp.supplierReturn = res.supplierReturn;
      temp.supplierExchange = res.supplierExchange;
      temp.dangerType = res.dangerType;
      temp.deliveryType = res.deliveryType;
      temp.deliveryTerm = res.deliveryTerm;
      temp.transportCondition = res.transportCondition;
      temp.transportConditionStr = res.transportConditionStr;
      temp.purchCurrency = res.purchCurrency;
      temp.purchPriceCNY = res.purchPriceCNY || 0;
      temp.quoteValidDates = res.quoteValidDates;
      temp.quoteValidDate = res.quoteValidDate;
      temp.noReturn = res.noReturn;
      temp.reqSkuType = res.reqSkuType;
      temp.skuVo = {
        ...imgParams,
        ...res,
      };
      temp.imageParams = {
        ...imgParams,
        sid: params.sid,
        inqLineId: params.sid,
        inquiryId: params.inquiryId,
      };
      temp.discountPerc = params.discountPerc;
      temp.discountCode = params.discountCode;
      return temp;
    },
    onSave: async (rebackMtd: any) => {
      const path: any = pathParams?.sorurceType;
      const res = await formRef?.current?.validateFields();
      // const res = await form.getFieldsValue(true)
      res.inqLineId = params.skuVo.inqLineId;
      res.inquiryId = params.skuVo.inquiryId;
      const temp: any = { sid: params.skuVo.inqLineId };
      temp.sourcingReqType = res.sourcingReqType;
      temp.containInstall = res.containInstall;
      temp.warrantyPeriod = res.warrantyPeriod;
      temp.parts = res.parts;
      temp.supplierReturn = res.supplierReturn;
      temp.supplierExchange = res.supplierExchange;
      temp.dangerType = res.dangerType;
      temp.deliveryType = res.deliveryType;
      temp.deliveryTerm = res.deliveryTerm;
      temp.transportCondition = res.transportCondition;
      temp.transportConditionStr = res.transportConditionStr;
      temp.purchCurrency = res.purchCurrency;
      temp.purchPriceCNY = res.purchPriceCNY || 0;
      temp.quoteValidDates = res.quoteValidDates;
      temp.quoteValidDate = res.quoteValidDate;
      temp.noReturn = res.noReturn;
      temp.reqSkuType = res.reqSkuType;
      temp.skuVo = {
        ...imgParams,
        ...res,
      };
      // console.log(res)
      temp.discountPerc = params.discountPerc;
      temp.discountCode = params.discountCode;
      Modal.confirm({
        title: '确定进行明细处理?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          if (['allRFQ', 'RFQquote'].includes(curPath)) {
            const allVal: any = temp.skuVo;
            const { purchPrice, listPrice, salesPrice }: any = allVal;
            let code = [
              allVal.productLineCode,
              allVal.segmentCode,
              allVal.familyCode,
              allVal.categoryCode,
            ];
            code = code.filter((item: any) => item);
            if (purchPrice && listPrice && salesPrice && code) {
              const submitData = {
                inquiryId: res?.inquiryId,
                inqLineId: res?.inqLineId,
                rfqQuoteRemark: res?.rfqQuoteRemark,
                ...temp.skuVo,
                detailCategoryCode: code.join(),
                purchPrice,
                listPrice,
                salesPrice,
                purchCurrency: temp?.purchCurrency || 'CNY',
                purchPriceCNY: temp?.purchPriceCNY || 0,
                quoteValidDates: res?.quoteValidDates,
                quoteValidDate: res?.quoteValidDate,
              };
              RFQsaveCheck(submitData).then((resd: any) => {
                if (resd.errCode === 200) {
                  message.success(resd.errMsg);
                  rebackMtd();
                } else {
                  message.error(resd.errMsg);
                }
              });
            } else {
              message.error('出错啦！');
            }
          } else {
            inqLnSourcingUpdate(path, temp).then((resd: any) => {
              if (resd.errCode === 200) {
                message.success(resd.errMsg);
                rebackMtd();
                // updateSkuImg({
                //   ...imgParams,
                //   sid: params.sid,
                //   inqLineId: params.sid,
                //   inquiryId: params.inquiryId,
                // }).then((imgRes: any) => {
                //   if (imgRes.errCode === 200) {
                //     message.success(resd.errMsg);
                //     rebackMtd();
                //   } else {
                //     message.error(imgRes.errMsg);
                //   }
                // });
              } else {
                message.error(resd.errMsg);
              }
            });
          }
        },
      });
    },
  }));

  const [leadTimeList] = useState<any>([
    { key: 3, value: 3 },
    { key: 5, value: 5 },
    { key: 7, value: 7 },
    { key: 10, value: 10 },
    { key: 20, value: 20 },
    { key: 30, value: 30 },
    { key: 60, value: 60 },
    { key: 90, value: 90 },
    { key: 200, value: 200 },
  ]);

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
            title={
              curPath === 'allRFQ' || curPath === 'RFQquote' ? '目录品实时询价信息' : '待建临时物料'
            }
            headStyle={{ fontWeight: 'bold', fontSize: '12px', padding: '0px', minHeight: '22px' }}
          >
            <Form
              {...layout}
              labelWrap
              ref={formRef}
              form={form}
              autoComplete="off"
              onFieldsChange={onValuesChange}
              className={isEdit ? 'disabled' : ''}
              initialValues={{
                haSku: 0,
                productOilFlag: 0,
                purchCurrency: 'CNY',
                reqSkuType: 20,
                noReturn: 1,
                parts: 0,
                containInstall: 0,
                supplierReturn: 0,
                supplierExchange: 0,
                warrantyPeriod: 0,
                phyUomCode: defaultUomCode,
                salesUomCode: defaultUomCode,
                salesPackQty: 1,
                transportCondition: '0',
                deliveryType: '1',
                fixedProduct: 0,
                deliveryTerm: 'DTD',
                salesMoq: 1,
                canImport: 0,
                canExport: 0,
              }}
            >
              <Row>
                <Col span={6}>
                  <Form.Item
                    label="SKU号"
                    name={'sku'}
                    className={params.lineStatus === 140 ? '' : 'form-edit'}
                  >
                    <Input
                      onBlur={getSkuInfo}
                      onChange={(ev) => {
                        if (ev.target.value == '') {
                          setIsEnable(false);
                        }
                      }}
                      bordered={!isEdit}
                      disabled={isEdit}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="产品名称(中文)"
                    className="super-label"
                    name={'productNameZh'}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <Input maxLength={40} bordered={!isEdit} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="brandCode" name={'brandName'} style={{ display: 'none' }}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="品牌名称" name={'brandCode'} rules={[{ required: true }]}>
                    <BrandCom
                      name={params.skuVo?.brandName}
                      isHidden={isHidden}
                      onType={(val: any, valStr: any, name: any) => {
                        form.setFieldsValue({
                          brandType: val,
                          brandTypeStr: valStr,
                          brandName: name,
                        });
                      }}
                      isEdit={isEdit}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name={'brandType'} label="品牌类型" style={{ display: 'none' }}>
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name={'brandTypeStr'} label="品牌类型">
                    <Input disabled bordered={!isEdit} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="" name="productLineName" style={{ display: 'none' }}>
                    <Input readOnly />
                  </Form.Item>
                  <Form.Item
                    label="Product"
                    name={'productLineCode'}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <ProductLine
                      isEdit={isEdit}
                      onChange={productChange}
                      onType={(val: any) =>
                        form.setFieldsValue({
                          productLineName: val,
                          // segmentName: '',
                          // segmentCode: '',
                          // familyCode: '',
                          // familyName: '',
                          // categoryCode: '',
                          // categoryName: '',
                        })
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="" name="segmentName" style={{ display: 'none' }}>
                    <Input readOnly />
                  </Form.Item>
                  <Form.Item
                    label="Segment"
                    name={'segmentCode'}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <Segment
                      isEdit={isEdit}
                      parentId={productLineCode}
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
                        console.log(val);
                        if (!val) {
                          console.log(hasDefaultFamily);
                        }
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item label="" name="familyName" style={{ display: 'none' }}>
                    <Input readOnly />
                  </Form.Item>
                  <Form.Item
                    label="Family"
                    name={'familyCode'}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <Family
                      isEdit={isEdit}
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
                <Col span={6}>
                  {level === 4 && (
                    <React.Fragment>
                      <Form.Item label="" name="categoryName" style={{ display: 'none' }}>
                        <Input readOnly />
                      </Form.Item>
                      <Form.Item
                        label="Category"
                        name={'categoryCode'}
                        rules={[{ required: true }]}
                      >
                        <Category
                          isEdit={isEdit}
                          parentId={familyCode}
                          onType={(val: any, rate: any) =>
                            form.setFieldsValue({
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
                    </React.Fragment>
                  )}
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="制造商型号"
                    name={'mfgSku'}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <Input maxLength={100} showCount={!isEdit} bordered={!isEdit} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="供应商型号" name={'supplierSku'} className="super-label">
                    <Input maxLength={100} showCount={!isEdit} bordered={!isEdit} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="物理单位"
                    name={'phyUomCode'}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <Uom isProductOil={productOilFlag} disabled={isEnable ? true : false} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="销售单位"
                    name={'salesUomCode'}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <Uom isProductOil={'0'} disabled={isEnable ? true : false} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    className="minLabel"
                    label="销售单位含物理单位个数"
                    name={'salesPackQty'}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <InputNumber min={1} disabled={isEnable ? true : false} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="销售最小起订量"
                    className="super-label"
                    name={'salesMoq'}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <InputNumber min={1} maxLength={17} bordered={!isEdit} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="销售增幅" name={'moqIncrement'}>
                    <InputNumber min={1} maxLength={17} bordered={!isEdit} />
                  </Form.Item>
                </Col>
                {/*<Col span={6}>
                <Form.Item label="规格" name={'techSpec'}>
                  <Input bordered={!isEdit} />
                </Form.Item>
              </Col>*/}
              </Row>

              <Row>
                <Col span={24}>
                  <Form.Item
                    label="规格"
                    name={'techSpec'}
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <Input.TextArea
                      style={{ marginRight: 8 }}
                      rows={2}
                      showCount={!isEdit}
                      maxLength={50}
                      bordered={!isEdit}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Divider />
              <Row>
                {pathParams?.sorurceType !== 'otherchannel' && (
                  <React.Fragment>
                    <Col span={6}>
                      <Form.Item
                        label="是否成品油"
                        name={'productOilFlag'}
                        rules={
                          params.lineStatus === 240 || params.lineStatus === 230
                            ? []
                            : [{ required: true }]
                        }
                      >
                        <Radio.Group
                          onChange={onChangeCpy}
                          value={productOilFlag}
                          disabled={isEdit}
                        >
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
                        name={'productOilType'}
                        label="成品油分类"
                        rules={[{ required: !!productOilFlag }]}
                      >
                        <SelectCommon
                          isEdit={isEdit}
                          selectType="productOilType"
                          disabled={!productOilFlag}
                          getName={(val: any) => {
                            form.setFieldsValue({ productOilTypeStr: val });
                          }}
                          getRemark={(val: any) => {
                            form.setFieldsValue({ taxNo: val });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="税收分类编码"
                        name={'taxNo'}
                        rules={
                          params.lineStatus === 240 || params.lineStatus === 230
                            ? []
                            : [
                                {
                                  required: false,
                                  validator: validateTaxNo,
                                  message: '税收分类编码为19位数字',
                                },
                              ]
                        }
                      >
                        <Input disabled={!!productOilFlag} bordered={!isEdit} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="特殊运输方式"
                        name={'transportCondition'}
                        className="super-label"
                        rules={
                          params.lineStatus === 240 || params.lineStatus === 230
                            ? []
                            : [{ required: true }]
                        }
                      >
                        <SelectCommon
                          isEdit={isEdit}
                          disabled={!!productOilFlag}
                          disabledOption={!productOilFlag && ['13']}
                          selectType="transportCondition"
                          getName={(val: string) => {
                            form.setFieldsValue({ transportConditionStr: val });
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        label=""
                        name={'transportConditionStr'}
                        style={{ display: 'none' }}
                      >
                        <Input readOnly />
                      </Form.Item>
                    </Col>
                  </React.Fragment>
                )}
                <Col span={6}>
                  <Form.Item
                    label="产品质保期(天)"
                    name={'warrantyPeriod'}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <InputNumber min={0} maxLength={17} bordered={!isEdit} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="是否配件"
                    name={'parts'}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <Radio.Group disabled={isEdit}>
                      <Radio value={0}>不是配件</Radio>
                      <Radio value={1}>是配件</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="是否含安装"
                    name={'containInstall'}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <Radio.Group disabled={isEdit}>
                      <Radio value={0}>否</Radio>
                      <Radio value={1}>是</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="是否可退货"
                    name={'supplierReturn'}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <Radio.Group disabled={isEdit}>
                      <Radio value={0}>不可退货</Radio>
                      <Radio value={1}>可退货</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="是否可换货"
                    name={'supplierExchange'}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <Radio.Group disabled={isEdit}>
                      <Radio value={0}>不可换货</Radio>
                      <Radio value={1}>可换货</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="产品原产国" name={'madeinCountryCode'}>
                    <Country />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="危险品种类" name={'dangerType'}>
                    <SelectCommon isEdit={isEdit} selectType="dangerType" />
                  </Form.Item>
                </Col>
                {params.lineStatus !== 240 && params.lineStatus !== 230 && (
                  <Col span={6}>
                    <Form.Item label="GPRate(%)" name={'sourcingGpRate'}>
                      <Input disabled bordered={!isEdit} />
                    </Form.Item>
                  </Col>
                )}
              </Row>
              <Divider />
              <Row>
                <Col span={6}>
                  <Form.Item label="供应商" name={'supplierNameZh'} style={{ display: 'none' }}>
                    <Input readOnly />
                  </Form.Item>
                  <Form.Item
                    label="供应商"
                    name={'supplierCode'}
                    className={[140, 230, 240].includes(params.lineStatus) ? 'form-edit' : ''}
                    rules={params.lineStatus === 240 ? [] : [{ required: true }]}
                  >
                    <SupplierSelectCom
                      isEdit={params.lineStatus === 140 ? false : isEdit}
                      filterName={supplierName}
                      getName={(val: any) => {
                        form.setFieldsValue({ supplierNameZh: val });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="备货方式"
                    name={'deliveryType'}
                    className={params.lineStatus === 140 ? 'form-edit' : ''}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <SelectCommon isEdit={isEdit} selectType="deliveryType" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="交付方式"
                    name={'deliveryTerm'}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <DeliveryTerm />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="交付周期(工作日)"
                    name={'leadTime'}
                    className={
                      params.lineStatus === 140 ||
                      params.lineStatus === 240 ||
                      params.lineStatus === 230
                        ? 'form-edit'
                        : ''
                    }
                    rules={[{ required: true }]}
                  >
                    {/* 两种报价选择不同 */}
                    {pathParams?.sorurceType == 'RFQquote' ? (
                      <InputNumber
                        min={1}
                        // max={7} 销售说去掉最大限制
                        precision={0}
                        bordered={
                          params.lineStatus === 140 ||
                          params.lineStatus === 240 ||
                          params.lineStatus === 230
                            ? true
                            : !isEdit
                        }
                      />
                    ) : (
                      <Select
                        placeholder="请选择"
                        bordered={
                          params.lineStatus === 140 ||
                          params.lineStatus === 240 ||
                          params.lineStatus === 230
                            ? true
                            : !isEdit
                        }
                      >
                        {leadTimeList &&
                          leadTimeList.map((item: any) => (
                            <Select.Option value={item.key} key={item.key}>
                              {item.value}
                            </Select.Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  {/* <Form.Item
							    label="采购计价货币"
							    className="super-label"
							    name={'purchCurrency'}
							    rules={[{ required: true }]}
							  >
							    <Currency />
							    <Input disabled />
							  </Form.Item> */}
                  <ProFormSelect
                    allowClear={false}
                    label="采购计价货币"
                    name="purchCurrency"
                    request={async () => {
                      let list = [] as any;
                      await getByKeys({ list: ['exchangeRatesCodeEnum', 'inTaxRateEnum'] }).then(
                        (res: any) => {
                          if (res?.errCode === 200) {
                            list = res?.data?.map((io: any) => {
                              return io?.enums?.map((ic: any) => ({
                                ...ic,
                                value: ic?.code || ic,
                                label: ic?.name || ic,
                              }));
                            });
                          }
                        },
                      );
                      setTaxList(list[1]);
                      return list[0];
                    }}
                  />
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="含税销售成交价"
                    name={'salesPrice'}
                    className={params.lineStatus === 140 ? 'form-edit' : ''}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <InputNumber
                      min={0.01}
                      precision={2}
                      maxLength={15}
                      bordered={params.lineStatus === 140 ? true : !isEdit}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="含税采购价"
                    name={'purchPrice'}
                    rules={[{ required: true }]}
                    className={
                      params.lineStatus === 140 ||
                      params.lineStatus === 240 ||
                      params.lineStatus === 230
                        ? 'form-edit'
                        : ''
                    }
                  >
                    <InputNumber
                      min={0.01}
                      precision={2}
                      maxLength={15}
                      bordered={
                        params.lineStatus === 140 ||
                        params.lineStatus === 240 ||
                        params.lineStatus === 230
                          ? true
                          : !isEdit
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="含税面价"
                    name={'listPrice'}
                    className={
                      params.lineStatus === 240 || params.lineStatus === 230 ? 'form-edit' : ''
                    }
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? [{ required: true }]
                        : []
                    }
                  >
                    <InputNumber
                      min={0.01}
                      precision={2}
                      maxLength={15}
                      disabled={curPath === 'allRFQ' || curPath === 'RFQquote' ? false : true}
                      bordered={
                        params.lineStatus === 240 || params.lineStatus === 230 ? true : !isEdit
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="CNY含税采购价" name={'purchPriceCNY'}>
                    <Input min={0} disabled bordered={!isEdit} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="折扣类型" name={'discountCode'}>
                    <Input min={0} disabled bordered={!isEdit} />
                  </Form.Item>
                </Col>
                {curPath === 'allRFQ' || curPath === 'RFQquote' ? (
                  <>
                    <Col span={6}>
                      <Form.Item label="GP0(%)" name={'gp0'}>
                        <Input disabled bordered={!isEdit} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="GP1(%)" name={'gp1'}>
                        <Input disabled bordered={!isEdit} />
                      </Form.Item>
                    </Col>
                  </>
                ) : (
                  <Col span={6}>
                    <Form.Item label="GP1(%)" name={'gpRate'}>
                      <Input disabled bordered={!isEdit} />
                    </Form.Item>
                  </Col>
                )}
              </Row>
              <Divider />
              <Row>
                <Col span={6}>
                  {/*<Form.Item
                    label="报价有效期(天)"
                    name={'quoteValidDates'}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? [{ required: true }]
                        : []
                    }
                    className={
                      params.lineStatus === 240 || params.lineStatus === 230 ? 'form-edit' : ''
                    }
                  >
                    <InputNumber
                      min={1}
                      max={60}
                      onChange={(value: any) => {
                        onQuoteValidDates(value);
                      }}
                      bordered={
                        params.lineStatus === 240 || params.lineStatus === 230 ? true : !isEdit
                      }
                    />
                  </Form.Item>*/}
                  <Form.Item
                    label="报价有效期(天)"
                    name={'quoteValidDates'}
                    rules={[{ required: true }]}
                    className={'form-edit'}
                  >
                    <InputNumber
                      min={1}
                      max={pathParams?.sorurceType === 'quote' ? 360 : 60}
                      onChange={(value: any) => {
                        onQuoteValidDates(value);
                      }}
                      precision={0}
                    />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item label="报价到期日" name={'quoteValidDate'}>
                    <Input disabled bordered={!isEdit} />
                  </Form.Item>
                </Col>

                {isProductNameZhOrigin &&
                  pathParams?.sorurceType !== 'allRFQ' &&
                  pathParams?.sorurceType !== 'RFQquote' && (
                    <>
                      <Col span={6}>
                        <Form.Item
                          label="当前产品名称"
                          className="super-label"
                          name={'productNameZhOrigin'}
                        >
                          <Input disabled bordered={!isEdit} />
                        </Form.Item>
                      </Col>
                    </>
                  )}
                <Col span={6}>
                  {['quote'].includes(pathParams?.sorurceType) && (
                    <Form.Item label="进项税(%)" className={'form-edit'} name={'inTaxRate'}>
                      <Select>
                        {taxList?.length &&
                          taxList.map((item: any) => (
                            <Select.Option value={item.value}>{item.label}</Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  )}
                </Col>
                {params.lineStatus !== 240 && params.lineStatus !== 230 && (
                  <Col span={6}>
                    <Form.Item
                      label="需求分类"
                      name={'sourcingReqType'}
                      rules={[{ required: true, message: '请选择需求分类!' }]}
                    >
                      <SelectCommon isEdit={isEdit} selectType="sourcingReqType" />
                    </Form.Item>
                  </Col>
                )}
                <Col span={6}>
                  <Form.Item
                    label="需求SKU类型"
                    name={'reqSkuType'}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <Select disabled bordered={!isEdit}>
                      <Select.Option value={20}>sourcing</Select.Option>
                      <Select.Option value={10}>目录品</Select.Option>
                      {/* <Select.Option value={80}>指定渠道</Select.Option> */}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item
                    label="匹配类型"
                    name={'pairType'}
                    rules={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? []
                        : [{ required: true }]
                    }
                  >
                    <SelectCommon isEdit={isEdit} selectType="pairType" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    className={'form-edit'}
                    label="是否定制品"
                    name="fixedProduct"
                    rules={[{ required: true }]}
                  >
                    <Radio.Group>
                      <Radio value={0}>否</Radio>
                      <Radio value={1}>是</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>

                {pathParams?.sorurceType !== 'quote' &&
                  pathParams?.sorurceType !== 'allRFQ' &&
                  pathParams?.sorurceType !== 'RFQquote' && (
                    <React.Fragment>
                      <Col span={6}>
                        <Form.Item label="运输方式" name={'transportType'}>
                          <Select
                            style={{ minWidth: '150px' }}
                            placeholder="请选择..."
                            bordered={!isEdit}
                          >
                            <Select.Option value={10} key={10}>
                              {' '}
                              空运{' '}
                            </Select.Option>
                            <Select.Option value={20} key={20}>
                              {' '}
                              海运{' '}
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="是否可出口" name={'canExport'}>
                          <Radio.Group disabled={isEdit}>
                            <Radio value={1}>否</Radio>
                            <Radio value={0}>是</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="HSCode" name={'hsCode'}>
                          <Input bordered={!isEdit} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="进口运费" name={'importFreight'}>
                          <Input disabled bordered={!isEdit} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="是否可进口" name={'canImport'}>
                          <Radio.Group disabled={isEdit}>
                            <Radio value={1}>否</Radio>
                            <Radio value={0}>是</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="产品尺寸" name={'size'}>
                          <InputNumber min={0} maxLength={17} bordered={!isEdit} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item label="产品重量" name={'weight'}>
                          <InputNumber min={0} maxLength={17} bordered={!isEdit} />
                        </Form.Item>
                      </Col>
                    </React.Fragment>
                  )}

                {/*<Col span={6}>
                <Form.Item
                  label="产品名称(英文)"
                  className="super-label"
                  name={'productNameEn'}
                  rules={[{ required: true }]}
                >
                  <Input maxLength={40} bordered={!isEdit}/>
                </Form.Item>
              </Col>*/}
              </Row>
              <Divider />
              {/*<Row>
              <Col span={6}>
                <Form.Item
                  label="是否可退换货"
                  name={'noReturn'}
                  className="super-label"
                  rules={[{ required: true }]}
                >
                  <Radio.Group disabled={isEdit}>
                    <Radio value={1}>不可退换</Radio>
                    <Radio value={0}>可退换</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  label="销售最小起订量"
                  className="super-label"
                  name={'salesMoq'}
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} maxLength={17} bordered={!isEdit} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="销售增幅" name={'moqIncrement'}>
                  <InputNumber min={1} maxLength={17} bordered={!isEdit} />
                </Form.Item>
              </Col>
            </Row>*/}

              <Row>
                <Col span={24}>
                  <Form.Item
                    label={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? '实时询价备注'
                        : 'Sourcing备注'
                    }
                    name={
                      params.lineStatus === 240 || params.lineStatus === 230
                        ? 'rfqQuoteRemark'
                        : 'skuRemark'
                    }
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 16 }}
                    className={'form-edit'}
                  >
                    <Input.TextArea style={{ marginRight: 8 }} rows={3} showCount maxLength={255} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          {['quote', 'otherchannel', 'RFQquote'].includes(pathParams?.sorurceType) && (
            <Card
              title="商品信息"
              headStyle={{
                fontWeight: 'bold',
                fontSize: '12px',
                padding: '0px',
                minHeight: '22px',
              }}
            >
              <SkuInfoEdit params={params?.skuVo} valueChange={(val: any) => setImgParams(val)} />
            </Card>
          )}
        </div>
      </div>
    </Spin>
  );
};

export default forwardRef(CreateSku);
