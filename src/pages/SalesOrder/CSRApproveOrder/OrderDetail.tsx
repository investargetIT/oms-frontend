import {
  invoiceAddressCols,
  invoiceInfoCols,
  r3Cols,
  receiverAddressCols,
} from '@/pages/SalesOrder/components/constant';
import {
  approveCsrOrder,
  cancelOrder,
  getFilesList,
  getInvoiceAddressList,
  getInvoiceInfoList,
  getOrderDateList,
  getOrderDetail,
  getR3ConList,
  getReceiverAddressList,
  goodsDetails,
  isThirtyRepeat,
  saveCsrOrder,
  saveRefResource,
  getCompanyList,
} from '@/services/SalesOrder';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Space,
  Switch,
  Tabs,
  Spin,
} from 'antd';
// import Cookies from 'js-cookie';
import React, { createRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import AchangeToB from '@/pages/SalesOrder/components/AchangeToB';
import ModalList from '@/pages/SalesOrder/components/ModalList';
import UploadForm from '@/pages/SalesOrder/components/UploadForm';
import MiDrawer from './components/MiDrawer';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { useModel } from 'umi';
import AnchorBox from './components/Anchor/index';
import ApplyForm from './components/ApplyForm';
import PricingMethodForm from './components/PricingMethodForm';
import Option from '@/pages/SalesAfter/components/Option';
import './style.css';
import { calculationAmount } from '@/services/InquirySheet/utils';

interface closeDrawer {
  approveDrawerClose?: any;
  tableReload?: any;
  id?: any;
  // tableRowData?: any;
  getIfHasOilWarning?: any;
  getIntelDevice?: any;
  sourceId?: any;
  orderTypeList?: any;
}
const ApproveOrderDetail: React.FC<closeDrawer> = (props: any) => {
  const [orderCompanyList, setOrderCompanyList]: any = useState([]);
  const { TabPane } = Tabs;
  // const { id, tableRowData } = props;
  const { id, sourceId, orderTypeList } = props;
  // const sourceId = tableRowData?.sid;
  const formRef: any = React.createRef();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [csrRemarkOption, setCsrRemarkOption]: any = useState({});
  const [load, setLoad]: any = useState(false);
  const [tableRowData, setTableRowData]: any = useState({});
  // const data = tableRowData;
  const [data, setData]: any = useState({});
  const [form] = Form.useForm();

  const dateFormat = 'YYYY-MM-DD';

  const [isRejectReasonModalVisible, setIsRejectReasonModalVisible] = useState(false);
  const [getRejectReason, setRejectReason] = useState('');
  // sku明细表格数据
  const [getSku] = useState('');
  const [getLineData] = useState({});
  const [isApplyModalVisible, setIsApplyModalVisible]: any = useState(false);
  const [pricingMethodModalVisible, setPricingMethodModalVisible]: any = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('选择R3联系人');
  const [modalColumn, setModalColumn]: any = useState([]);
  const [modalVal, setModalVal] = useState({});
  const [basicData, setBasicData]: any = useState({});
  const [receiveData, setReceiveData]: any = useState({});
  const [invoiceData, setInvoiceData]: any = useState({});

  const [isUpload, setIsUpload]: any = useState(false);
  const [tableData, setTableData]: any = useState([]);
  const actionRef: any = useRef<ActionType>();
  const MiDrawerRef: any = useRef<ActionType>();

  const [getFreight, setFreight]: any = useState(0);
  const [getInterFreight, setInterFreight]: any = useState(0);
  const [getTotalFreight, setTotalFreight]: any = useState(0);
  const [getAmount, setAmount]: any = useState(0);
  const [getAmountNoVat, setAmountNoVat]: any = useState(0);
  const [getReceiverSapCode, setReceiverSapCode]: any = useState('');
  const [getBillingTitleSapCode, setBillingTitleSapCode]: any = useState('');
  const [getInvoiceAddressSapCode, setInvoiceAddressSapCode]: any = useState('');

  const [showdiscountAmount, setShowdiscountAmount]: any = useState(0); //?总计折扣，会根据商品明细的数据变化而变化
  const [showgoodsAmount, setShowgoodsAmount]: any = useState(0); //?货品金额合计，会根据商品明细的数据变化而变化
  const [showtariff, setShowtariff]: any = useState(0); //?货品金额合计，会根据商品明细的数据变化而变化

  const [changeArr, setChageArr]: any = useState([]); //?这个数组用来存所有的改过的行信息

  const [R3Code, setR3Code]: any = useState('');
  const [R3Name, setR3Name]: any = useState('');

  const [provinceName, setProvinceName]: any = useState('');
  const [cityName, setCityName]: any = useState('');
  const [districtName, setDistrictName]: any = useState('');

  const [provinceCode, setProvinceCode]: any = useState('');
  const [cityCode, setCityCode]: any = useState('');
  const [districtCode, setDistrictCode]: any = useState('');

  const [receiverAddress, setReceiverAddress]: any = useState('');
  const [orderLine, setOrderLine]: any = useState([]); //?收集参数提供给审核通过和保存修改的接口
  const [resourceVOList, setResourceVOList]: any = useState([]); //?收集参数提供给审核通过和保存修改的接口
  // tableRowData.receiverMobile = ''; //todo ! 收货信息手机设置成自己的值
  // tableRowData.receiverPhone = ''; //todo ! 收货信息固话设置成自己的值
  const [receiverOtherInfo, setReceiverOtherInfo]: any = useState({});

  const [invoiceTitle, setInvoiceTitle]: any = useState('');
  const [invoiceAddress, setInvoiceAddress]: any = useState('');
  // tableRowData.invoiceMobile = ''; //todo ! 发票信息手机设置成自己的值
  // tableRowData.invoiceTel = ''; //todo ! 发票信息固话设置成自己的值
  const [invoiceOtherInfo, setInvoiceOtherInfo]: any = useState({});

  const [vatOtherInfoData, setVatOtherInfoData]: any = useState({});

  const [InvoiceData, seInvoiceData]: any = useState([]);
  const [ShipTypeData, setShipTypeData]: any = useState([]);
  const [PaymentTermData, setPaymentTermData]: any = useState([]);
  const [PaymentMethodData, setPaymentMethodData]: any = useState([]);

  // const [getPaymentTermCode, setPaymentTermCode] = useState(tableRowData?.paymentTermsCode);
  // const [getPaymentMethodCode, setPaymentMethodCode] = useState(tableRowData?.paymentMethodCode);
  const [getPaymentTermCode, setPaymentTermCode]: any = useState({
    value: '',
    label: '',
  });
  const [getPaymentMethodCode, setPaymentMethodCode]: any = useState({
    value: '',
    label: '',
  });
  const [getPaymentTermsName, setPaymentTermsName]: any = useState('');
  const [getPaymentMethodName, setPaymentMethodName]: any = useState('');

  const [getPaymentTerms, setPaymentTerms]: any = useState({});
  const [getPaymentMethod, setPaymentMethod]: any = useState('');

  // const [getPaymentTermCode, setPaymentTermCode] = useState('04');
  // const [getPaymentMethodCode, setPaymentMethodCode] = useState('0402');
  const [RejectReasonData, setRejectReasonData]: any = useState([]);

  // const [toBondEditStatus, setToBondEditStatus]: any = useState(false);
  // const [toBondStatus, setToBondStatus]: any = useState(false);
  const [thirtyRepeatStatus, setThirtyRepeatStatus]: any = useState(false);
  const [totalSkuFreigt, setTotalSkuFreigt]: any = useState(0); // 所有行运费总计

  // const [getInvoiceType, setInvoiceType]: any = useState(data?.invoiceType);
  const [getInvoiceTypeCode, setInvoiceTypeCode]: any = useState('');
  const [getInvoiceRequired, setInvoiceRequired]: any = useState(false);
  // const [flag, setFlag]: any = useState(false);
  const [isRequire, setIsRequire]: any = useState(false);

  const loadList = async (val: any) => {
    console.log(val);
    // if (props.recall) {
    //   props.recall(val);
    // }
    // 确认的请求收集参数
    const resourceVOList1: any = [];
    val.forEach((e: any) => {
      resourceVOList1.push({
        resourceName: e.resourceName,
        resourceUrl: e.resourceUrl,
        fileType: 'po附件',
      });
    });
    const params = {
      // sourceId: tableRowData?.sid,
      sourceId: sourceId,
      sourceType: 40,
      subType: 20,
      resourceVOList: resourceVOList1,
    };
    const res = await saveRefResource(params);
    console.log(res);
    // ?收集附件参数
    const arr: any = [];
    val.forEach((e: any) => {
      arr.push({
        resourceUrl: e.resourceUrl,
        resourceName: e.resourceName,
        fileType: e.type,
      });
    });
    setResourceVOList(arr);
    setIsUpload(false);
    console.log(actionRef.current);

    actionRef.current?.reload(true);
  };

  const [hideInTable, setHideInTable]: any = useState(false);

  const [total, setTotal] = useState();
  //?获取表格数据
  const getTableData = async (pageNo?: any, pageS?: any, arr?: any[]) => {
    const searchParams: any = {};
    searchParams.pageNumber = pageNo || 1;
    searchParams.pageSize = pageS || 10;
    searchParams.orderNo = id;
    const res = await goodsDetails(searchParams);
    if (res.errCode == 200) {
      setTotal(res?.data?.total);
      res.data?.list.forEach((e: any, i: number) => {
        //? 在表格数据的每一条里面加一个标识，然后用这个标识找到对应要编辑的那一项
        e.index = i;
      });
      console.log(changeArr, 'changeArr', arr);
      if (!arr) {
        for (let i = 0; i < changeArr.length; i++) {
          const element = changeArr[i];
          for (let j = 0; j < res?.data?.list?.length; j++) {
            const ele = res?.data?.list[j];
            if (element.sid === ele.sid) {
              res.data.list[j] = element;
            }
          }
        }
      }

      // const oilFlagNum = res.data?.list.find((item) => {
      //   return item.productOilFlagBool;
      // });
      // console.log(oilFlagNum);
      // if (oilFlagNum) {
      //   setHideInTable(false);
      // } else {
      //   setHideInTable(true);
      // }

      setTableData(res.data?.list);
    } else {
      message.error('失败' + res.errMsg);
    }
  };
  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
    getTableData(current, pageSize);
  }

  const handleData = (defauleParams: any) => {
    setOrderLine([]);
    setLoad(true);
    setTableRowData(defauleParams);
    const params: any = defauleParams;

    if (!['1', '2', '3'].includes(defauleParams?.invoiceTypeCode)) {
      params.invoiceType = '';
      params.invoiceTypeCode = '';
    }

    if (params?.invoiceTypeCode == 3) {
      params.invoiceRequired = false;
      // setFlag(false);
      setIsRequire(false);
    } else if (params?.invoiceTypeCode == 2) {
      params.invoiceRequired = false;
      // setFlag(true);
      setIsRequire(true);
    } else if (params?.invoiceTypeCode == 1) {
      params.invoiceRequired = true;
      // setFlag(true);
      setIsRequire(true);
    }
    params.createTime = moment(defauleParams?.createTime).format('YYYY-MM-DD HH:mm:ss');
    params.sendDate = moment(defauleParams?.sendDate).format(dateFormat);
    params.validToDate = moment(defauleParams?.validToDate).format(dateFormat);

    if (!defauleParams?.followMerchandise) {
      params.invoiceWithGoods = '';
    } else {
      params.invoiceWithGoods = 'checked';
    }

    if (defauleParams?.followMerchandise == 0) {
      params.invoiceWithGoods = '';
    } else {
      params.invoiceWithGoods = 'checked';
    }

    if (defauleParams?.tariff >= 0 && defauleParams?.tariff != '') {
      params.tariff = defauleParams?.tariff;
    } else {
      params.tariff = '0.00';
    }
    if (defauleParams?.goodsAmount >= 0 && defauleParams?.goodsAmount != '') {
      params.goodsAmount = defauleParams?.goodsAmount;
    } else {
      params.goodsAmount = '0.00';
    }
    if (defauleParams?.freight >= 0 && defauleParams?.freight != '') {
      params.freight = defauleParams?.freight;
    } else {
      params.freight = '0.00';
    }
    if (defauleParams?.interFreight >= 0 && defauleParams?.interFreight != '') {
      params.interFreight = defauleParams?.interFreight;
    } else {
      params.interFreight = '0.00';
    }
    if (defauleParams?.totalFreight >= 0 && defauleParams?.totalFreight != '') {
      params.totalFreight = defauleParams?.totalFreight;
    } else {
      params.totalFreight = '0.00';
    }
    if (defauleParams?.amount >= 0 && defauleParams?.amount != '') {
      params.amount = defauleParams?.amount;
    } else {
      params.amount = '0.00';
    }
    if (defauleParams?.netPrice >= 0 && defauleParams?.netPrice != '') {
      params.netPrice = defauleParams?.netPrice;
    } else {
      params.netPrice = '0.00';
    }
    if (!defauleParams?.province || defauleParams?.province == undefined) {
      params.province = '';
    } else {
      params.province = defauleParams?.province;
    }

    if (!defauleParams?.city || defauleParams?.city == undefined) {
      params.city = '';
    } else {
      params.city = defauleParams?.city;
    }

    if (!defauleParams?.district || defauleParams?.district == undefined) {
      params.district = '';
    } else {
      params.district = defauleParams?.district;
    }

    if (!defauleParams?.toBond) {
      params.toBond = '';
    } else {
      params.toBond = 'checked';
    }
    if (defauleParams?.tariff >= 0 && defauleParams?.tariff != '') {
      params.tariff = defauleParams?.tariff;
    } else {
      params.tariff = '0.00';
    }
    if (!defauleParams?.intelDevice) {
      form.getFieldsValue(true).intelDeviceHighLight = '';
    } else {
      form.getFieldsValue(true).intelDeviceHighLight = 'checked';
    }
    setData(params);
    setFreight(Number(params?.freight || 0).toFixed(2));
    setInterFreight(Number(params?.interFreight || 0).toFixed(2));
    setTotalFreight(Number(params?.totalFreight || 0).toFixed(2));
    setAmount(Number(params?.amount || 0).toFixed(2));
    setAmountNoVat(Number(params?.netPrice || 0).toFixed(2));
    setReceiverSapCode(params?.shipRegionSapCode);
    setBillingTitleSapCode(params?.vatSapCode);
    setInvoiceAddressSapCode(params?.invoiceSapCode);

    setShowdiscountAmount(Number(params?.discountAmount || 0).toFixed(2));
    setShowgoodsAmount(Number(params?.goodsAmount || 0).toFixed(2));
    setShowtariff(Number(params?.tariff || 0).toFixed(2));

    setR3Code(params?.contactsCode);
    setR3Name(params?.contactsName);

    setProvinceName(params?.province);
    setCityName(params?.city);
    setDistrictName(params?.district);

    setProvinceCode(params?.provinceCode);
    setCityCode(params?.cityCode);
    setDistrictCode(params?.districtCode);
    setReceiverAddress(params?.receiverAddress);

    setReceiverOtherInfo({
      shipZip: params?.shipZip,
      receiverName: params?.receiverName,
      receiverMobile: params?.receiverMobile,
      receiverPhone: params?.receiverPhone,
      consigneeEmail: params?.consigneeEmail,
      receivingArea: params?.receivingArea,
    });

    setInvoiceTitle(params?.invoiceTitle);
    setInvoiceAddress(params?.invoiceAddress);
    setInvoiceOtherInfo({
      invoiceReceiver: params?.invoiceReceiver,
      invoiceZip: params?.invoiceZip,
      invoiceTel: params?.invoiceTel,
      invoiceMobile: params?.invoiceMobile,
      invoiceEmail: params?.invoiceEmail,
      invoiceReceiveRegion: params?.invoiceReceiveRegion,
    });
    setVatOtherInfoData({
      vatBankName: params?.vatBankName,
      vatTaxNo: params?.vatTaxNo,
      vatAddress: params?.vatAddress,
      vatTel: params?.vatPhone,
      vatBankAccount: params?.vatBankNo,
    });
    setPaymentTermCode({
      value: params?.paymentTermsCode,
      label: params?.paymentTerms,
    });
    setPaymentMethodCode({
      value: params?.paymentMethodCode,
      label: params?.paymentMethod,
    });

    setPaymentTermsName(params?.paymentTerms);
    setPaymentMethodName(params?.paymentMethod);
    setPaymentTerms(params?.paymentTermsCode);
    setPaymentMethod(params?.paymentMethodCode);

    setTotalSkuFreigt(
      Number(
        Number(params?.totalFreight) - Number(params?.freight) - Number(params?.interFreight),
      ).toFixed(2),
    );

    setInvoiceTypeCode(params?.invoiceTypeCode);
    setInvoiceRequired(params?.invoiceRequired);
    form.setFieldsValue({
      companyCode: params?.companyCode,
      contactCodeR3: params?.contactsCode,
      contactCodeName: params?.contactsName,
      category: String(params?.categoryStatus),
      customerPurchaseNo: params?.customerPurchaseNo,
      reqDeliveDate: moment(params?.sendDate),
      customerRemark: params?.userRemark,
      csrRemark: params?.csrRemark,
      province: params?.province,
      city: params?.city,
      district: params?.district,
      provinceCode: params?.provinceCode,
      cityCode: params?.cityCode,
      districtCode: params?.districtCode,
      receiverAddress: params?.receiverAddress,
      specialCode: params?.specialCode,
      toBond: defauleParams?.toBond,
      invoiceTitle: params?.invoiceTitle,
      invoiceWithGoods: defauleParams?.followMerchandise,
      invoiceAddress: params?.invoiceAddress,
      shipZip: params.shipZip,
      receiverName: params?.receiverName,
      receiverMobile: params?.receiverMobile,
      receiverPhone: params?.receiverPhone,
      consigneeEmail: params?.consigneeEmail,
      receivingArea: params?.receivingArea,
      invoiceReceiver: params?.invoiceReceiver,
      invoiceZip: params?.invoiceZip,
      invoiceTel: params?.invoiceTel,
      invoiceMobile: params?.invoiceMobile,
      invoiceEmail: params?.invoiceEmail,
      invoiceReceiveRegion: params?.invoiceReceiveRegion,
      invoiceType: params?.invoiceTypeCode,
      shipTypeCode: params?.shipTypeCode,
      paymentTermsCode: {
        value: params?.paymentTermsCode,
        label: params?.paymentTerms,
      },
      paymentMethodCode: {
        value: params?.paymentMethodCode,
        label: params?.paymentMethod,
      },
      paymentTermsName: params?.paymentTerms,
      paymentMethodName: params?.paymentMethod,
      vatBankName: params?.vatBankName,
      vatTaxNo: params?.vatTaxNo,
      vatAddress: params?.vatAddress,
      vatTel: params?.vatPhone,
      vatBankAccount: params?.vatBankNo,
      freight: Number(params?.freight || 0).toFixed(2),
      interFreight: Number(params?.interFreight || 0).toFixed(2),
      cancelReason: getRejectReason,
      receiverSapCode: params?.shipRegionSapCode,
      billingTitleSapCode: params?.vatSapCode,
      invoiceAddressSapCode: params?.invoiceSapCode,
      partialShipment: defauleParams?.partialShipment,
      intelDeviceHighLight: params?.intelDeviceHighLight,
      intelDevice: params?.intelDevice,
    });

    setLoad(false);
  };
  const clearChageArr = () => {
    setChageArr([]); //?将分页记忆的数组清空一下
  };
  useEffect(() => {
    const fn = async () => {
      setLoad(true);
      const res = await getOrderDetail(id);
      if (res?.errCode === 200) {
        if (res?.data?.hasOilWarning !== undefined) {
          setHideInTable(false);
        } else {
          setHideInTable(true);
        }
        props.getIfHasOilWarning(res?.data?.hasOilWarning || false);
        const {
          data: { salesOrderRespVo, salesOrderReceiverRespVo, salesOrderInvoiceInfoRespVo },
        } = res;
        const temp: any = res?.data;
        const defauleParams: any = {
          ...temp,
          ...temp.salesOrderRespVo,
          ...temp.salesOrderReceiverRespVo,
          ...temp.salesOrderInvoiceInfoRespVo,
        };

        handleData(defauleParams);
        // setInvoiceRequired
        if (defauleParams?.invoiceEmail) {
          setInvoiceRequired(false);
        }
        if (salesOrderRespVo) {
          setBasicData(salesOrderRespVo);
        }
        props.getIntelDevice(salesOrderRespVo?.intelDeviceHighLight);
        if (salesOrderReceiverRespVo) {
          setReceiveData(salesOrderReceiverRespVo);
        }
        if (salesOrderInvoiceInfoRespVo) {
          setInvoiceData(salesOrderInvoiceInfoRespVo);
        }

        setLoad(false);
      } else {
        message.error(res?.errMsg || '数据获取出错!');
        setLoad(true);
      }
      if (data == 0) {
        console.log(basicData, receiveData, invoiceData);
      }
    };
    setChageArr([]); //?将分页记忆的数组清空一下
    // console.log('页面打来了，啊');
    getTableData();
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    getOrderDateList({ type: 'ship' }).then((res: any) => {
      if (res.errCode === 200) {
        setShipTypeData(res.data?.dataList?.filter((io: any) => io.key != '20'));
      }
    });
    getOrderDateList({ type: 'paymentTerm' }).then((res: any) => {
      if (res.errCode === 200) {
        setPaymentTermData(res.data?.dataList);
      }
    });

    getOrderDateList({ type: 'invoice' }).then((res: any) => {
      if (res.errCode === 200) {
        seInvoiceData(res.data?.dataList);
      }
    });

    getOrderDateList({ type: 'cancelReason' }).then((res: any) => {
      if (res.errCode === 200) {
        setRejectReasonData(res.data?.dataList);
      }
    });

    // getToBondStatus(customer_code).then((res: any) => {
    //   if (res.errCode === 200) {
    //     setToBondEditStatus(!res.data?.edit);
    //     setToBondStatus(res.data?.toBond);
    //   }
    // });

    //设置select初始值
    form.setFieldsValue({
      shipTypeCode: ShipTypeData && ShipTypeData[0] ? ShipTypeData[0].key : data?.shipTypeCode,
      // paymentTerms: PaymentTermData && PaymentTermData[0] ? PaymentTermData[0].key: tableRowData?.paymentTermsCode,
      // paymentMethodCode: PaymentMethodData && PaymentMethodData[0] ? PaymentMethodData[0].key: tableRowData?.paymentMethodCode,
      // paymentTermsCode: getPaymentTermCode,
      // paymentMethodCode: getPaymentMethodCode,
      cancelReason: RejectReasonData && RejectReasonData[0] ? RejectReasonData[0].key : '1',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getCompanyList().then((res: any) => {
      if (res.errCode === 200) {
        setOrderCompanyList(res.data.dataList);
      }
    });
  }, []);

  useEffect(() => {
    getOrderDateList({ type: 'paymentTerm', code: data?.paymentTermsCode }).then((res: any) => {
      if (res.errCode === 200) {
        setPaymentMethodData(res.data?.dataList[0]?.children);
      }
    });
    const isThirtyRepeat_params = {
      orderNo: id,
      customerCode: data?.customerCode,
      amount: data?.amount,
    };
    isThirtyRepeat(isThirtyRepeat_params).then((res: any) => {
      if (res.errCode === 200) {
        if (JSON.stringify(res.data?.dataList) != '[]') {
          setThirtyRepeatStatus(true);
        } else {
          setThirtyRepeatStatus(false);
        }
      }
    });
    form.setFieldsValue({
      shipTypeCode: ShipTypeData && ShipTypeData[0] ? ShipTypeData[0].key : data?.shipTypeCode,
      paymentTermsCode: getPaymentTermCode,
      paymentMethodCode: getPaymentMethodCode,
    });
  }, [data]);

  const handlePaymentTermChange = (e: any) => {
    console.log(e);
    const paymentMethod_code = '' + e.value + '';
    setPaymentTermCode(e);
    setPaymentTerms(e.value);
    getOrderDateList({ type: 'paymentTerm', code: paymentMethod_code }).then((res: any) => {
      if (res.errCode === 200) {
        setPaymentMethodData(res.data?.dataList[0]?.children);
        // setPaymentMethodCode(res.data?.dataList[0]?.children[0].key);
        setPaymentMethodCode({
          value: res.data?.dataList[0]?.children[0].key,
          label: res.data?.dataList[0]?.children[0].value,
        });
        setPaymentMethod(res.data?.dataList[0]?.children[0].key);
        setPaymentMethodName(res.data?.dataList[0]?.children[0].value);
        form.setFieldsValue({
          paymentMethodCode: {
            value: res.data?.dataList[0]?.children[0].key,
            label: res.data?.dataList[0]?.children[0].value,
          },
        });
      }
    });
    setPaymentTermsName(e.label);
  };

  const handlePaymentMethodChange = (e: any) => {
    setPaymentMethodName(e.label);
    setPaymentMethod(e.value);
  };
  const [getShowApiAddress, setShowApiAddress]: any = useState(false);

  const getData = async (params: any, getApiAddressLevel: any) => {
    params.customerCode = data?.customerCode;
    if (modalTitle === '选择R3联系人') {
      return await getR3ConList(params);
    } else if (modalTitle === '选择地址') {
      if (basicData?.needPurchase && getApiAddressLevel === 2) {
        params.customerCode = basicData?.purchaseCode;
      } else {
        params.customerCode = data?.customerCode;
      }
      return await getReceiverAddressList(params);
    } else if (modalTitle === '选择开票信息') {
      return await getInvoiceInfoList(params);
    } else if (modalTitle === '选择发票收件信息') {
      return await getInvoiceAddressList(params);
    }
  };

  const ref = createRef();
  // 暴露组件的方法
  useImperativeHandle(ref, () => ({
    getBaseForm: async () => {
      return await formRef?.current?.validateFields();
    },
  }));

  const onSearch = (val: number) => {
    if (val === 1) {
      setModalTitle('选择R3联系人');
      setShowApiAddress(false);
      setModalColumn(r3Cols);
    } else if (val === 2) {
      setModalTitle('选择地址');
      if (basicData?.needPurchase) {
        setShowApiAddress(true);
      } else {
        setShowApiAddress(false);
      }
      setModalColumn(receiverAddressCols);
    } else if (val === 3) {
      setModalTitle('选择开票信息');
      setShowApiAddress(false);
      setModalColumn(invoiceInfoCols);
    } else if (val === 4) {
      setModalTitle('选择发票收件信息');
      setShowApiAddress(false);
      setModalColumn(invoiceAddressCols);
    }
    setIsModalVisible(true);
  };
  const getSelModal = (val: any) => {
    if (!val) return;
    if (JSON.stringify(val) != '{}') {
      if (modalTitle === '选择R3联系人') {
        formRef.current?.setFieldsValue({
          contactCodeName: val[0]?.contactName || '',
          // contactCodeR3: val[0]?.contactCodeR3,
          contactCodeR3: val[0]?.contactCode || '',
        });
        form.setFieldsValue({
          contactCodeName: val[0]?.contactName || '',
          contactCodeR3: val[0]?.contactCode || '',
        });
        setR3Code(val[0]?.contactCode || '');
        setR3Name(val[0]?.contactName || '');
      } else if (modalTitle === '选择地址') {
        // let newReceivingArea =
        //   val[0]?.provinceName + '-' + val[0]?.cityName + '-' + val[0]?.districtName;
        // if (val[0]?.district === '0') {
        //   newReceivingArea = val[0]?.provinceName + '-' + val[0]?.cityName;
        // }
        let newReceivingArea = val[0]?.provinceName + val[0]?.cityName + val[0]?.districtName;
        if (val[0]?.district === '0') {
          newReceivingArea = val[0]?.provinceName + val[0]?.cityName;
        }
        form.setFieldsValue({
          province: val[0]?.provinceName || '',
          city: val[0]?.cityName || '',
          district: val[0]?.districtName || '',
          provinceCode: val[0]?.province || '',
          cityCode: val[0]?.city || '',
          districtCode: val[0]?.district || '',
          receiverAddress: val[0]?.receiptAddress || '',
          shipZip: val[0]?.receiptZipCode || '',
          receiverName: val[0]?.recipientName || '',
          receiverMobile: val[0]?.receiptMobilePhone || '',
          receiverPhone: val[0]?.receiptFixPhone || '',
          consigneeEmail: val[0]?.receiptEmail || '',
          receivingArea: newReceivingArea || '',
          receiverSapCode: val[0]?.sapCode || '',
        });

        setProvinceName(val[0]?.provinceName || '');
        setCityName(val[0]?.cityName || '');
        setDistrictName(val[0]?.districtName || '');

        setProvinceCode(val[0]?.province || '');
        setCityCode(val[0]?.city || '');
        setDistrictCode(val[0]?.district || '');

        setReceiverAddress(val[0]?.receiptAddress || '');

        setReceiverOtherInfo({
          shipZip: val[0]?.receiptZipCode || '',
          receiverName: val[0]?.recipientName || '',
          receiverMobile: val[0]?.receiptMobilePhone || '',
          receiverPhone: val[0]?.receiptFixPhone || '',
          consigneeEmail: val[0]?.receiptEmail || '',
          receivingArea: newReceivingArea,
        });
        setReceiverSapCode(val[0]?.sapCode);
      } else if (modalTitle === '选择开票信息') {
        form.setFieldsValue({
          invoiceTitle: val[0]?.customerName || '',
          vatTaxNo: val[0]?.taxNumber || '',
          vatAddress: val[0]?.registerAddress || '',
          vatTel: val[0]?.registerTelephone || '',
          vatBankName: val[0]?.bankName || '',
          vatBankAccount: val[0]?.bankAccount || '',
          billingTitleSapCode: val[0]?.sapCode || '',
        });
        setInvoiceTitle(val[0]?.customerName || '');
        setVatOtherInfoData({
          vatTaxNo: val[0]?.taxNumber || '',
          vatAddress: val[0]?.registerAddress || '',
          vatTel: val[0]?.registerTelephone || '',
          vatBankName: val[0]?.bankName || '',
          vatBankAccount: val[0]?.bankAccount || '',
        });
        setBillingTitleSapCode(val[0]?.sapCode || '');
      } else if (modalTitle === '选择发票收件信息') {
        // let newInvoiceReceiveRegion =
        //   val[0]?.provinceName + '-' + val[0]?.cityName + '-' + val[0]?.districtName;
        // if (val[0]?.district === '0') {
        //   newInvoiceReceiveRegion = val[0]?.provinceName + '-' + val[0]?.cityName;
        // }
        let newInvoiceReceiveRegion =
          val[0]?.provinceName + val[0]?.cityName + val[0]?.districtName;
        if (val[0]?.district === '0') {
          newInvoiceReceiveRegion = val[0]?.provinceName + val[0]?.cityName;
        }
        form.setFieldsValue({
          invoiceAddress: val[0]?.receiptAddress || '',
          invoiceReceiver: val[0]?.recipientName || '',
          invoiceZip: val[0]?.receiptZipCode || '',
          invoiceTel: val[0]?.receiptFixPhone || '',
          invoiceMobile: val[0]?.receiptMobilePhone || '',
          invoiceEmail: val[0]?.receiptEmail || '',
          invoiceReceiveRegion: newInvoiceReceiveRegion,
          invoiceAddressSapCode: val[0]?.sapCode || '',
        });

        setInvoiceAddress(val[0]?.receiptAddress || '');
        setInvoiceOtherInfo({
          invoiceReceiver: val[0]?.recipientName || '',
          invoiceZip: val[0]?.receiptZipCode || '',
          invoiceTel: val[0]?.receiptFixPhone || '',
          invoiceMobile: val[0]?.receiptMobilePhone || '',
          invoiceEmail: val[0]?.receiptEmail || '',
          invoiceReceiveRegion: newInvoiceReceiveRegion,
        });
        setInvoiceAddressSapCode(val[0]?.sapCode || '');
      }
    }
  };

  const operateMethod = (val: any) => {
    setModalVal(val);
  };

  const modalOK = () => {
    setIsModalVisible(false);
    getSelModal(modalVal);
  };
  const pricingMethodModalOpen = () => {
    setPricingMethodModalVisible(true);
  };

  const applyModalHandleOk = () => {
    setIsApplyModalVisible(false);
  };

  function RejectReasonModalClose() {
    setRejectReason('');
    setIsRejectReasonModalVisible(false);
    form.setFieldsValue({
      cancelReason: '',
    });
  }
  const pricingMethodModalClose = () => {
    setPricingMethodModalVisible(false);
  };

  const { initialState } = useModel('@@initialState');
  const [yClient, setYClient] = useState(900);
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 350);
  }, [initialState?.windowInnerHeight]);

  function toBondChange(checked: any) {
    form.getFieldsValue(true).toBond = checked;
    console.log(checked);
  }

  function followMerchandiseChange(checked: any) {
    form.getFieldsValue(true).invoiceWithGoods = checked;
    console.log(checked);
  }

  function partialShipmentChange(checked: any) {
    form.getFieldsValue(true).partialShipment = checked;
  }
  function intelDeviceHighLightChange(checked: any) {
    form.getFieldsValue(true).intelDeviceHighLight = checked;
    basicData.intelDeviceHighLight = checked;
  }

  function InvoiceTypeOnChange(e: any) {
    console.log(e.target.value);
    // setInvoiceType(e.target.label);
    setInvoiceTypeCode(e.target.value);
    if (form.getFieldValue('invoiceEmail')) {
      setIsRequire(true);
      setInvoiceRequired(false);
    } else if (e.target.value == 1) {
      setInvoiceRequired(true);
      setIsRequire(true);
    } else if (e.target.value == 2) {
      setIsRequire(true);
      setInvoiceRequired(false);
    } else if (e.target.value == 3) {
      setIsRequire(false);
      setInvoiceRequired(false);
    }
    // console.log(getInvoiceType);
  }

  // const [getRefreshFreight, setRefreshFreight] = useState(0);

  // function doCount(value: any, record: any) {
  //   //?设置金额联动函数
  //   //! 期待的效果1：当前的值改变的额时候，顺带着其他的同一行的输入框的值也发生改变
  //   //! 期待的效果2: 切换到第二页，再切换回来，之前联动之后的值不会发生改变
  //   //? 1、首先获取到当前的下标是record.index  然后根据这个index可以获取到当前行的dom结构
  //   const rowDom = document.querySelectorAll('.selectedTable .ant-table-row')[record.index];
  //   // console.log(rowDom, '选中的dom');
  //   //? 2、然后在当前行内的dom结构中通过子代选择器，一个一个的选中需要同步变更的那几项
  //   const setSalesPrice: any = rowDom.querySelector('.setSalesPrice');
  //   setSalesPrice.innerHTML = Number(Number(value) / Number(record.qty)).toFixed(2); //*设置单价含税
  //   // *修改当前的row的第页码项的单价含税
  //   setRow(() => {
  //     row[currentPage - 1][record.index].salesPrice = setSalesPrice.innerHTML;
  //     return row;
  //   });
  //   const setSalesPriceNet: any = rowDom.querySelector('.setSalesPriceNet');
  //   setSalesPriceNet.innerHTML = Number(Number(value) / Number(record.qty) / 1.13).toFixed(2); //*设置单价未税
  //   setRow(() => {
  //     row[currentPage - 1][record.index].salesPriceNet = setSalesPriceNet.innerHTML;
  //     return row;
  //   });
  //   const setTotalAmountNet: any = rowDom.querySelector('.setTotalAmountNet');
  //   setTotalAmountNet.innerHTML = Number(Number(value) / 1.13).toFixed(2); //*设置小计未税
  //   setRow(() => {
  //     row[currentPage - 1][record.index].totalAmountNet = setTotalAmountNet.innerHTML;
  //     return row;
  //   });
  //   const res = orderLine.some((e: any) => {
  //     //?先看看参数的数组里面有没有重复的
  //     return e.lineId == record.orderLineId;
  //   });
  //   if (!res) {
  //     //?如果有就合并一下新的
  //     const params = orderLine.concat({
  //       lineId: record.orderLineId,
  //       totalAmount: value,
  //     });
  //     setOrderLine(params);
  //   } else {
  //     //?如果没有就更新当前项
  //     const newArr = orderLine.map((e: any) => {
  //       if (e.lineId == record.orderLineId) {
  //         e.totalAmount = value;
  //         return e;
  //       } else {
  //         return e;
  //       }
  //     });
  //     setOrderLine(newArr);
  //   }
  // }

  // function onblur(record: any) {
  //   //?在输入框失去焦点的时候恢复成黑色
  //   const rowDom = document.querySelectorAll('.selectedTable .ant-table-row')[record.index];
  //   const setSalesPrice: any = rowDom.querySelector('.totalAmount');
  //   // console.log(setSalesPrice);

  //   setSalesPrice.style.color = '#000'; //*设置小计含税颜色
  // }
  // function FreightOnChange(value: string, record?: any) {
  //   console.log(value, record,'触发了不必要的函数');
  //   //? 小计含税更改
  //   const rowDom = document.querySelectorAll('.selectedTable .ant-table-row')[record.index];
  //   const setSalesPrice: any = rowDom.querySelector('.totalAmount');
  //   if (Number(value) > Number(record.totalAmountMax.toFixed(2))) {
  //     // console.log(1, value);
  //     // setSalesPrice.style.color = 'red'; //*设置小计含税颜色
  //     message.warning('超出可调范围');
  //   } else if (Number(value) < Number(record.totalAmountMin.toFixed(2))) {
  //     // console.log(2, value);
  //     // setSalesPrice.style.color = 'red'; //*设置小计含税颜色
  //     message.warning('超出可调范围');
  //   } else if (value == null) {
  //     setSalesPrice.style.color = '#000'; //*设置小计含税颜色
  //     // console.log(3, value);
  //   } else {
  //     if (Number(value) == Number(record.totalAmountMax.toFixed(2))) {
  //       message.warning('已到可调范围上限');
  //     } else if (Number(value) == Number(record.totalAmountMin.toFixed(2))) {
  //       message.warning('已到可调范围下限');
  //     }
  //     doCount(value, record);
  //     // console.log(setSalesPrice, '89999');
  //     setSalesPrice.style.color = '#000'; //*设置小计含税颜色
  //     setRow(() => {
  //       //?改动当前的页面的对应的那一行的totalAmount，并在换页的时候维持不变
  //       row[currentPage - 1][record.index].totalAmount = value;
  //       // console.log(row, '这是我改过的数据');
  //       return row;
  //     });
  //   }
  //   //?联动函数
  // }

  // 所有行运费总计
  // const totalSkuFreigt = Number(
  //   Number(data?.totalFreight) - Number(data?.freight) - Number(data?.interFreight),
  // ).toFixed(2);
  //? 头运费更改
  function FreightOnChangetable(value: any) {
    setFreight(Number(value).toFixed(2)); // ?存储当前头运费值
    setTotalFreight(
      Number(Number(value) + Number(totalSkuFreigt) + Number(getInterFreight)).toFixed(2),
    ); // ?计算运费总计
    const FreightTotleAmount = Number(
      Number(value) + Number(totalSkuFreigt) + Number(getInterFreight),
    ).toFixed(2); // ?计算运费总计
    setAmount(
      Number(Number(FreightTotleAmount) + Number(data?.goodsAmount) + Number(data?.tariff)).toFixed(
        2,
      ),
    ); // ?计算总计金额含税
    setAmountNoVat(
      Number(
        (Number(FreightTotleAmount) + Number(data?.goodsAmount) + Number(data?.tariff)) / 1.13,
      ).toFixed(2),
    ); //?计算总计金额  未税
    if (value == null || value == '') {
      form.setFieldsValue({
        freight: 0.0,
      });
      setFreight(Number(0).toFixed(2));
      setTotalFreight(Number(Number(totalSkuFreigt) + Number(getInterFreight)).toFixed(2));
      setAmount(
        Number(
          Number(totalSkuFreigt) +
            Number(getInterFreight) +
            Number(data?.goodsAmount) +
            Number(data?.tariff),
        ).toFixed(2),
      );
      setAmountNoVat(
        Number(
          (Number(totalSkuFreigt) +
            Number(getInterFreight) +
            Number(data?.goodsAmount) +
            Number(data?.tariff)) /
            1.13,
        ).toFixed(2),
      );
    }
    // console.log(value);
  }
  function InterFreightOnChange(value: string) {
    //?国际运费改变
    setInterFreight(Number(value).toFixed(2)); //?存储国际运费
    setTotalFreight(Number(Number(value) + Number(totalSkuFreigt) + Number(getFreight)).toFixed(2));
    const FreightTotleAmount = Number(
      Number(value) + Number(totalSkuFreigt) + Number(getFreight),
    ).toFixed(2); // ?计算运费总计
    setAmount(
      Number(Number(FreightTotleAmount) + Number(data?.goodsAmount) + Number(data?.tariff)).toFixed(
        2,
      ),
    ); // ?计算总计金额  含税
    setAmountNoVat(
      Number(
        (Number(FreightTotleAmount) + Number(data?.goodsAmount) + Number(data?.tariff)) / 1.13,
      ).toFixed(2),
    ); //?计算总计金额  未税
    if (value == null || value == '') {
      form.setFieldsValue({
        interFreight: 0.0,
      });
      setInterFreight(Number(0).toFixed(2));
      setTotalFreight(Number(Number(totalSkuFreigt) + Number(getFreight)).toFixed(2));
      setAmount(
        Number(
          Number(totalSkuFreigt) +
            Number(getFreight) +
            Number(data?.goodsAmount) +
            Number(data?.tariff),
        ).toFixed(2),
      );
      setAmountNoVat(
        Number(
          (Number(totalSkuFreigt) +
            Number(getFreight) +
            Number(data?.goodsAmount) +
            Number(data?.tariff)) /
            1.13,
        ).toFixed(2),
      );
    }
  }

  const limitDecimals: any = (value: string) => {
    if (value == null) {
      return '0';
    } else {
      return value
        .replace(/[^\d.]/g, '')
        .replace(/^\./g, '')
        .replace(/\.{2,}/g, '.')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
      // .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      // .replace(/\$\s?|(,*)/g, '');
    }
  };
  // const limitDecimalsThree: any = (value: string) => {
  //   if (value == null) {
  //     return '0';
  //   } else {
  //     return value
  //       .replace(/[^\d.]/g, '')
  //       .replace(/^\./g, '')
  //       .replace(/\.{3,}/g, '.')
  //       .replace('.', '$#$')
  //       .replace(/\./g, '')
  //       .replace('$#$', '.')
  //       .replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3');
  //     // .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  //     // .replace(/\$\s?|(,*)/g, '');
  //   }
  // };
  // function RefreshFreightClick() {
  //   setRefreshFreight(100);
  //   message.success('运费已刷新', 3);
  // }

  // function cancelRefreshFreight(e: any) {
  //   console.log(e);
  //   // message.error('Click on No');
  // }
  // function filesTableReload() {
  //   actionRef.current.reload();
  // }

  const detailRef: any = useRef<ActionType>();
  function detailTableReload() {
    // setReloadStatus(true);
    setChageArr([]);
    setChageArr((prevFoo: any[]) => {
      console.log('page===========', prevFoo); //page=========== 2
      detailRef.current?.reload(true);
      getTableData('', '', []);
      return prevFoo;
    });

    // message.success('reload success',3)
  }

  // ? 小计未税和一些调用这个函数的计算与联动
  const reTotalAmountNet = async (record: any, val: any, type: number) => {
    // console.log(record, 'record', val);
    const params = {
      //?参数
      sourceType: 2, //?请求类型 1. 转订单 2 csr
      freight: getFreight, //?头运费（客户可输入）
      interFreight: getInterFreight, //?国际运费（客户可输入）
      discountAmount: showdiscountAmount, //?折扣总计(改成根据行内信息变化之后，取后端返回的折扣)
      goodsAmount: showgoodsAmount, //?货品总计(可根据行内信息变化之后，取后端返回的货品金额合计)（页面上显示的是货品金额合计）
      tariff: showtariff, //?关税（可根据行内信息变化之后，取后端返回的关税）
      totalFreight: getTotalFreight, //?总运费（会根据头运费输入改变）
      orderNo: id, //? CSR审核订单的时候需要订单号
      pricingMethod: data?.oPricingMethod, //计价方式
      //?行信息
      line: {
        qty: record?.qty, //?本次转订单数量
        // quotationLineId: record?.quotationLineId, //?单据行id
        // quotationNo: record?.quotationNo, //?报价单号
        orderSid: record.sid, //?订单行id
        listTotalAmount: record.csrTotalAmount, //?把上一次的小计含税给后端
        type: type, //?请求计算字段类型 1.单价含税 2.单价未税,3.小计含税,小计未税
        price: val, //?请求字段类型对应的价格
        totalDiscount: record?.totalDiscount, //?行里面的申请折扣
      },
    };
    const res = await calculationAmount(params); //?联动接口
    if (res.errCode === 200) {
      // 找到要联动的三项（成交价含税成交价未税小计含税）并修改自己（小计未税）
      setTableData(
        tableData.map((item: any) => {
          if (item.sid === record.sid) {
            return {
              ...item,
              csrSalesPrice: res?.data?.lines?.amountVO?.salesPrice, //?单价含税
              csrSalesPriceNet: res?.data?.lines?.amountVO?.salesPriceNet, //?单价未税
              csrTotalAmount: res?.data?.lines?.amountVO?.totalAmount, //?小计含税
              csrTotalAmountNet: res?.data?.lines?.amountVO?.totalAmountNet, //?小计未税
              totalDiscount: res?.data?.lines?.amountVO?.totalDiscount, //?小计折扣
            };
          } else {
            return item;
          }
        }),
      );
      const isRepeat = changeArr.some((item: any) => {
        //?检测当前的改变数组内部是否有
        return item.sid == record.sid;
      });
      if (isRepeat) {
        //?如果有就修改
        setChageArr(
          changeArr.map((item: any) => {
            if (item.sid === record.sid) {
              //?找到那一项改一下当前
              return {
                ...record,
                csrSalesPrice: res?.data?.lines?.amountVO?.salesPrice, //?单价含税
                csrSalesPriceNet: res?.data?.lines?.amountVO?.salesPriceNet, //?单价未税
                csrTotalAmount: res?.data?.lines?.amountVO?.totalAmount, //?小计含税
                csrTotalAmountNet: res?.data?.lines?.amountVO?.totalAmountNet, //?小计未税
                totalDiscount: res?.data?.lines?.amountVO?.totalDiscount, //?小计折扣
              };
            } else {
              return item;
            }
          }),
        );
      } else {
        //?如果没有就添加
        setChageArr([
          ...changeArr,
          {
            ...record,
            csrSalesPrice: res?.data?.lines?.amountVO?.salesPrice, //?单价含税
            csrSalesPriceNet: res?.data?.lines?.amountVO?.salesPriceNet, //?单价未税
            csrTotalAmount: res?.data?.lines?.amountVO?.totalAmount, //?小计含税
            csrTotalAmountNet: res?.data?.lines?.amountVO?.totalAmountNet, //?小计未税
            totalDiscount: res?.data?.lines?.amountVO?.totalDiscount, //?小计折扣
          },
        ]);
      }
      setShowdiscountAmount(res?.data?.discountAmount); //?联动折扣总计
      setShowgoodsAmount(res?.data?.goodsAmount); //?联动货品金额合计含税
      setFreight(res?.data?.calcFreightRespVo?.headFreight); //?联动头运费
      setInterFreight(res?.data?.calcFreightRespVo?.interFreight); //?联动国际运费
      setShowtariff(res?.data?.calcFreightRespVo?.tariff); //?联动关税
      setTotalFreight(res?.data?.calcFreightRespVo?.totalFreight); //?联动运费总计
      setAmount(res?.data?.amount); //?联动总计金额含税
      setAmountNoVat(res?.data?.amountNet); //?联动总计金额未税

      const Flag = orderLine.some((e: any) => {
        //?先看看参数的数组里面有没有重复的
        return e.lineId == record.orderLineId;
      });
      // //每当有数据改动的时候，都设置一下需要提交给后端的参数
      if (!Flag) {
        //?如果有就合并一下新的
        const param = orderLine.concat({
          lineId: record.orderLineId,
          totalAmount: res?.data?.lines?.amountVO?.totalAmount, //?小计含税
          totalAmountNet: res?.data?.lines?.amountVO?.totalAmountNet, //?小计未税
          salesPrice: res?.data?.lines?.amountVO?.salesPrice, //?单价含税
          salesPriceNet: res?.data?.lines?.amountVO?.salesPriceNet, //?单价未税
        });
        setOrderLine(param);
      } else {
        //?如果有就合并一下新的
        //?如果没有就更新当前项
        const newArr = orderLine.map((e: any) => {
          if (e.lineId == record.orderLineId) {
            return {
              lineId: record.orderLineId,
              totalAmount: res?.data?.lines?.amountVO?.totalAmount, //?小计含税
              totalAmountNet: res?.data?.lines?.amountVO?.totalAmountNet, //?小计未税
              salesPrice: res?.data?.lines?.amountVO?.salesPrice, //?单价含税
              salesPriceNet: res?.data?.lines?.amountVO?.salesPriceNet, //?单价未税
            };
          } else {
            return e;
          }
        });
        setOrderLine(newArr);
      }
    } else {
      message.error(res.errMsg);
    }
  };
  useEffect(() => {}, [id]);
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      // valueType: 'index',
      width: 40,
      fixed: 'left',
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    // {
    //   title: '操作',
    //   width: 135,
    //   render: (_, record) => {
    //     return (
    //       <Space>
    //         <Button
    //           disabled={record.lineProjectStatus == 'YSF' ? true : false}
    //           size="small"
    //           key={'特殊需求申请'}
    //           type="link"
    //           onClick={() => {
    //             setSku(record.sku);
    //             setLineData(record);
    //             setIsApplyModalVisible(true);
    //           }}
    //         >
    //           特殊需求申请
    //         </Button>
    //         {record.lineProjectStatus == 'YSF' && (
    //           <span style={{ color: '#999', fontSize: '12px', paddingBottom: '2px' }}>
    //             特殊需求申请已提交
    //           </span>
    //         )}
    //       </Space>
    //     );
    //   },
    //   fixed: 'left',
    // },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 80,
      fixed: 'left',
      sorter: (a, b) => (a.sku - b.sku ? 1 : -1),
    },
    {
      title: '是否成品油',
      dataIndex: 'productOilFlagBool',
      width: 120,
      render(_, record) {
        if (record.productOilFlagBool) {
          return <span style={{ color: '#f50' }}>是</span>;
        } else if (record.productOilFlagBool == false) {
          return '否';
        }
      },
      sorter: (a, b) => (a.productOilFlagBool - b.productOilFlagBool ? 1 : -1),
      hideInTable: hideInTable,
    },
    {
      title: 'SKU详情（中文描述）',
      dataIndex: 'productNameConcatStr',
      width: 350,
      sorter: (a, b) => (a.productNameConcatStr - b.productNameConcatStr ? 1 : -1),
    },
    {
      title: '物料码',
      dataIndex: 'stockSkuCode',
      width: 100,
      sorter: (a, b) => (a.stockSkuCode - b.stockSkuCode ? 1 : -1),
    },
    {
      title: '销售包装单位数量',
      dataIndex: 'unitQuantity',
      width: 150,
      sorter: (a, b) => (a.unitQuantity - b.unitQuantity ? 1 : -1),
    },
    // {
    //   title: '过账标记',
    //   dataIndex: 'btoBFlag',
    //   width: 100,
    //   render(text, record) {
    //     if (!record.btoBFlag) {
    //       return '否';
    //     } else {
    //       return '是';
    //     }
    //   },
    //   sorter: (a, b) => (a.btoBFlag - b.btoBFlag ? 1 : -1),
    // },
    {
      title: '面价',
      dataIndex: 'listPrice',
      width: 80,
      render(text, record) {
        if (record.listPrice >= 0 && record.listPrice != '') {
          return Number(record.listPrice).toFixed(2);
        } else {
          return '0.00';
        }
      },
      sorter: (a, b) => (a.listPrice - b.listPrice ? 1 : -1),
    },

    {
      title: '单价含税',
      dataIndex: 'csrSalesPrice',
      width: 160,
      render: (_, record) => {
        return (
          <InputNumber
            style={{ width: '140px' }}
            step={0.01}
            value={record.csrSalesPrice}
            // defaultValue={record.salesPrice}
            onChange={(val: any) => {
              reTotalAmountNet(record, val, 1);
            }}
            onPressEnter={(e) => {
              e.preventDefault();
            }}
          />
        );
      },
      // render(text, record) {
      //   if (record.salesPrice >= 0 && record.salesPrice != '') {
      //     return <span className="setSalesPrice">{Number(record.salesPrice).toFixed(2)}</span>; //?添加类名方便计算的时候设置
      //   } else {
      //     return <span className="setSalesPrice">0.00;</span>;
      //   }
      // },
      sorter: (a, b) => (a.salesPrice - b.salesPrice ? 1 : -1),
    },
    {
      title: '单价未税',
      dataIndex: 'csrSalesPriceNet',
      width: 160,
      render: (_, record) => {
        return (
          <InputNumber
            style={{ width: '140px' }}
            step={0.01}
            value={record.csrSalesPriceNet}
            // defaultValue={record.salesPrice}
            onChange={(val: any) => {
              reTotalAmountNet(record, val, 2);
            }}
            onPressEnter={(e) => {
              e.preventDefault();
            }}
          />
        );
      },
      // render(text, record) {
      //   if (record.salesPriceNet >= 0 && record.salesPriceNet != '') {
      //     return (
      //       <span className="setSalesPriceNet">{Number(record.salesPriceNet).toFixed(2)}</span> //?添加类名方便计算的时候设置
      //     );
      //   } else {
      //     return <span className="setSalesPriceNet">0.00</span>;
      //   }
      // },
      sorter: (a, b) => (a.salesPriceNet - b.salesPriceNet ? 1 : -1),
    },
    {
      title: '数量',
      dataIndex: 'qty',
      width: 60,
      sorter: (a, b) => (a.qty - b.qty ? 1 : -1),
    },
    {
      title: '小计含税',
      dataIndex: 'csrTotalAmount',
      width: 160,
      render: (_, record) => {
        return (
          <InputNumber
            style={{ width: '140px' }}
            step={0.01}
            value={record.csrTotalAmount}
            // defaultValue={record.salesPrice}
            onChange={(val: any) => {
              reTotalAmountNet(record, val, 3);
            }}
            onPressEnter={(e) => {
              e.preventDefault();
            }}
          />
        );
      },
      // render(text, record) {
      //   return (
      //     <InputNumber
      //       className="totalAmount"
      //       type="text"
      //       precision={3}
      //       size="small"
      //       style={{ width: '100%' }}
      //       min={Number(record.totalAmountMin.toFixed(2))}
      //       max={Number(record.totalAmountMax.toFixed(2))}
      //       // min={Number(record.totalAmountMin)}
      //       // max={Number(record.totalAmountMax)}
      //       onChange={(value: any) => {
      //         FreightOnChange(value, record);
      //       }}
      //       step="0.01"
      //       onBlur={() => onblur(record)}
      //       onInput={(value) => FreightOnChange(value, record)}
      //       formatter={limitDecimals}
      //       parser={limitDecimals}
      //       value={record.totalAmount}
      //       defaultValue={record.totalAmount}
      //     />
      //   );
      // },
      sorter: (a, b) => (a.totalAmount - b.totalAmount ? 1 : -1),
    },
    {
      title: '小计未税',
      dataIndex: 'csrTotalAmountNet',
      width: 160,
      // render(_, record) {
      //   if (record.totalAmountNet >= 0 && record.totalAmountNet != '') {
      //     return (
      //       <span className="setTotalAmountNet">{Number(record.totalAmountNet).toFixed(2)}</span> //?添加类名方便计算的时候设置
      //     );
      //   } else {
      //     return <span className="setTotalAmountNet">0.00</span>;
      //   }
      // },
      render: (_, record) => {
        return (
          <InputNumber
            style={{ width: '140px' }}
            step={0.01}
            value={record.csrTotalAmountNet}
            // defaultValue={record.salesPrice}
            onChange={(val: any) => {
              reTotalAmountNet(record, val, 4);
            }}
            onPressEnter={(e) => {
              e.preventDefault();
            }}
          />
        );
      },
      sorter: (a, b) => (a.totalAmountNet - b.totalAmountNet ? 1 : -1),
    },
    {
      title: '是否JV',
      width: 100,
      render(_, record) {
        return <span>{record.jv ? '是' : '否'}</span>;
      },
    },
    { title: 'JV公司', dataIndex: 'jvCompanyName', width: 260 },

    {
      title: '预计发货日期',
      valueType: 'date',
      width: 150,
      dataIndex: 'deliveryDate',
      sorter: (a, b) => (a.deliveryDate - b.deliveryDate ? 1 : -1),
    },
    {
      title: '客户物料号',
      dataIndex: 'customerSku',
      width: 120,
      sorter: (a, b) => (a.customerSku - b.customerSku ? 1 : -1),
    },
    {
      title: '客户行号',
      dataIndex: 'poItemNo',
      width: 120,
      sorter: (a, b) => (a.poItemNo - b.poItemNo ? 1 : -1),
    },
    {
      title: '制造商型号',
      dataIndex: 'mfgSku',
      width: 150,
      sorter: (a, b) => (a.mfgSku - b.mfgSku ? 1 : -1),
    },
    {
      title: '供应商型号',
      dataIndex: 'supplierSku',
      width: 180,
      sorter: (a, b) => (a.supplierSku - b.supplierSku ? 1 : -1),
    },
    {
      title: '运费',
      dataIndex: 'freight',
      width: 120,
      render(text, record) {
        if (record.freight >= 0 && record.freight != '') {
          return Number(record.freight).toFixed(2);
        } else {
          return '0.00';
        }
      },
      sorter: (a, b) => (a.freight - b.freight ? 1 : -1),
    },
    {
      title: '国际运费',
      dataIndex: 'interFreight',
      width: 120,
      render(text, record) {
        if (record.interFreight >= 0 && record.interFreight != '') {
          return Number(record.interFreight).toFixed(2);
        } else {
          return '0.00';
        }
      },
      sorter: (a, b) => (a.interFreight - b.interFreight ? 1 : -1),
    },
    {
      title: '关税',
      dataIndex: 'tariff',
      width: 120,
      render(text, record) {
        if (record.tariff >= 0 && record.tariff != '') {
          return Number(record.tariff).toFixed(2);
        } else {
          return '0.00';
        }
      },
      sorter: (a, b) => (a.tariff - b.tariff ? 1 : -1),
    },
    {
      title: '交付周期(工作日)',
      dataIndex: 'leadTime',
      width: 120,
      sorter: (a, b) => (a.leadTime - b.leadTime ? 1 : -1),
    },
    {
      title: '特殊产品备注',
      dataIndex: 'spercialRemark',
      width: 150,
      sorter: (a, b) => (a.spercialRemark - b.spercialRemark ? 1 : -1),
    },
    {
      title: '特殊需求状态',
      dataIndex: 'lineProjectStatus',
      width: 120,
      sorter: (a, b) => (a.lineProjectStatus - b.lineProjectStatus ? 1 : -1),
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  const uploadFile = () => {
    setIsUpload(true);
  };
  const fileNameRowWidth = (100 % -40) - 90 - 350;
  const attachment_columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 40,
      fixed: 'left',
      // render(text, record, index) {
      //   // return index + 1;
      //   return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      // },
    },
    {
      title: '操作',
      width: 85,
      // render: (_, record) => [
      //   <Button
      //     size="small"
      //     key={'下载'}
      //     type="link"
      //     onClick={() => window.open(`${record.resourceUrl}?token=${Cookies.get('ssoToken')}`)}
      //   >
      //     下载
      //   </Button>,
      // ],
      render: (_, record) => {
        if (record.resourceUrl != '') {
          return <Option record={record} key={record.resourceUrl} />;
        }
      },
      fixed: 'right',
    },
    {
      title: '文件名称',
      dataIndex: 'resourceName',
      className: 'alignLeft',
      width: fileNameRowWidth,
      fixed: 'left',
      sorter: (a, b) => (a.resourceName - b.resourceName ? 1 : -1),
    },
    {
      title: '文件类型',
      dataIndex: 'fileType',
      width: 100,
      sorter: (a, b) => (a.fileType - b.fileType ? 1 : -1),
    },
    {
      title: '创建者',
      dataIndex: 'createUser',
      width: 100,
      sorter: (a, b) => (a.createUser - b.createUser ? 1 : -1),
    },
    {
      title: '创建时间',
      width: 150,
      valueType: 'dateTime',
      dataIndex: 'createTime',
      sorter: (a, b) => (a.createTime - b.createTime ? 1 : -1),
    },
  ];

  attachment_columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  const onFinish = (values: any) => {
    if (!values.receiverMobile && !values.receiverPhone) {
      return message.error('请完善收货信息中的收货人手机，或收货人固话');
    }
    if (
      values.invoiceType == 1 &&
      !values.invoiceMobile &&
      !values.invoiceTel &&
      !values.invoiceEmail
    ) {
      return message.error('请完善发票寄送信息中的收货人手机，邮箱或收货人固话');
    }
    setConfirmLoading(true);
    const formData = JSON.parse(JSON.stringify(values));
    if (values.invoiceWithGoods == 'checked' || values.invoiceWithGoods) {
      formData.invoiceWithGoods = 1;
    }
    if (values.invoiceWithGoods == '' || !values.invoiceWithGoods) {
      formData.invoiceWithGoods = 0;
    }

    if (values.toBond == 'checked') {
      formData.toBond = true;
    }
    if (values.toBond == '') {
      formData.toBond = false;
    }

    if (values.partialShipment == 'checked') {
      formData.partialShipment = true;
    }
    if (values.partialShipment == '') {
      formData.partialShipment = false;
    }

    if (values.intelDeviceHighLight == 'checked') {
      formData.intelDeviceHighLight = true;
    }
    if (values.intelDeviceHighLight == '') {
      formData.intelDeviceHighLight = false;
    }

    // if (form.getFieldsValue(true).invoiceTyp == '增值税专用发票') {
    //   formData.invoiceTyp = '1';
    // } else if (form.getFieldsValue(true).invoiceTyp == '普通发票') {
    //   formData.invoiceTyp = '2';
    // } else if (form.getFieldsValue(true).invoiceTyp == '无需发票') {
    //   formData.invoiceTyp = '3';
    // }
    const saveData = {
      companyCode: formData.companyCode,
      orderNo: formData.orderNo,
      category: formData.category,
      contactCodeName: formData.contactCodeName,
      contactCodeR3: formData.contactCodeR3,
      customerRemark: formData.customerRemark,
      csrRemark: formData.csrRemark,
      customerPurchaseNo: formData.customerPurchaseNo,
      completeDeliv: formData.completeDeliv,
      reqDeliveDate: moment(formData.reqDeliveDate).format(dateFormat),
      partialShipment: formData.partialShipment,
      intelDeviceHighLight: formData.intelDeviceHighLight,
      intelDevice: formData.intelDeviceHighLight ? 1 : 0,
      oPricingMethod: data?.oPricingMethod,
      paymentTerm: {
        shipType: formData.shipTypeCode,
        // paymentMethod: formData.paymentMethodCode,
        // paymentTerm: formData.paymentTermsCode,
        paymentTerm: getPaymentTerms,
        paymentMethod: getPaymentMethod,
        paymentTermsName: getPaymentTermsName,
        paymentMethodName: getPaymentMethodName,
      },
      orderReceiver: {
        province: formData.province,
        city: formData.city,
        district: formData.district,
        provinceCode: formData.provinceCode,
        cityCode: formData.cityCode,
        districtCode: formData.districtCode,
        receiverAddress: formData.receiverAddress,
        shipZip: formData.shipZip,
        receiverName: formData.receiverName,
        receiverMobile: formData.receiverMobile,
        receiverPhone: formData.receiverPhone,
        consigneeEmail: formData.consigneeEmail,
        toBond: formData.toBond,
        specialCode: formData.specialCode,
        sapCode: formData.receiverSapCode,
      },
      invoiceInfo: {
        invoiceType: formData.invoiceType,
        invoiceTitle: formData.invoiceTitle,
        // vatCompanyName: formData.vatCompanyName,
        vatTaxNo: formData.vatTaxNo,
        vatAddress: formData.vatAddress,
        vatTel: formData.vatTel,
        vatTelExt: formData.vatTelExt,
        vatBankName: formData.vatBankName,
        vatBankAccount: formData.vatBankAccount,
        invoiceReceiver: formData.invoiceReceiver,
        invoiceAddress: formData.invoiceAddress,
        invoiceZip: formData.invoiceZip,
        invoiceTel: formData.invoiceTel,
        invoiceMobile: formData.invoiceMobile,
        invoiceEmail: formData.invoiceEmail,
        invoiceWithGoods: formData.invoiceWithGoods,
        invoiceReceiveRegion: formData.invoiceReceiveRegion,
        sapCode: formData.billingTitleSapCode,
        invoiceSapCode: formData.invoiceAddressSapCode,
      },
      goodsInfo: {
        amount: getAmount,
        freight: formData.freight,
        interFreight: formData.interFreight,
        totalFreight: getTotalFreight,
        tariff: data.tariff,
        goodsAmount: data.goodsAmount,
        untaxedAmount: getAmountNoVat,
      },
      orderLine,
      resourceVOList,
      // orderLine: [
      //   {
      //     lineId: formData.lineId,
      //     totalAmount: 112.01
      //   }
      // ],
      // resourceVOList: [
      // 	{
      // 		resourceUrl: formData.resourceUrl,
      // 		resourceName: formData.resourceName,
      // 		fileType: "png"
      // 	}
      // ]
    };

    saveCsrOrder(saveData)
      .then((res: any) => {
        // console.log(res);
        if (res.errCode === 200) {
          props.approveDrawerClose();
          setConfirmLoading(false);
          message.success('保存成功', 3);
          form.resetFields();
          props.tableReload();
        } else {
          message.error(res.errMsg);
          setConfirmLoading(false);
        }
      })
      .finally(() => {
        return;
      });
  };

  const onSubmit = () => {
    let validateFields_data = [
      'contactCodeR3',
      'receiverAddress',
      'invoiceTitle',
      'invoiceAddress',
      'invoiceType',
    ];
    if (getInvoiceTypeCode == 3) {
      validateFields_data = ['contactCodeR3', 'receiverAddress', 'invoiceType'];
    }
    form
      .validateFields(validateFields_data)
      .then((values) => {
        console.log(values);
        const formData = form.getFieldsValue(true);
        if (!formData.receiverMobile && !formData.receiverPhone) {
          return message.error('请完善收货信息中的收货人手机，或收货人固话');
        }
        if (
          formData.invoiceType == 1 &&
          !formData.invoiceMobile &&
          !formData.invoiceTel &&
          !formData.invoiceEmail
        ) {
          return message.error('请完善发票寄送信息中的收货人手机，邮箱或收货人固话');
        }
        // console.log(666, '666');
        // return;
        setConfirmLoading(true);
        if (
          form.getFieldsValue(true).invoiceWithGoods == 'checked' ||
          form.getFieldsValue(true).invoiceWithGoods
        ) {
          formData.invoiceWithGoods = 1;
        }
        if (
          form.getFieldsValue(true).invoiceWithGoods == '' ||
          !form.getFieldsValue(true).invoiceWithGoods
        ) {
          formData.invoiceWithGoods = 0;
        }

        if (form.getFieldsValue(true).toBond == 'checked') {
          formData.toBond = true;
        }
        if (form.getFieldsValue(true).toBond == '') {
          formData.toBond = false;
        }

        if (form.getFieldsValue(true).partialShipment == 'checked') {
          formData.partialShipment = true;
        }
        if (form.getFieldsValue(true).partialShipment == '') {
          formData.partialShipment = false;
        }

        // if (form.getFieldsValue(true).intelDeviceHighLight == 'checked') {
        //   formData.intelDeviceHighLight = true;
        // }
        // if (form.getFieldsValue(true).intelDeviceHighLight == '') {
        //   formData.intelDeviceHighLight = false;
        // }

        // if (form.getFieldsValue(true).invoiceTyp == '增值税专用发票') {
        //   formData.invoiceTyp = '1';
        // } else if (form.getFieldsValue(true).invoiceTyp == '普通发票') {
        //   formData.invoiceTyp = '2';
        // } else if (form.getFieldsValue(true).invoiceTyp == '无需发票') {
        //   formData.invoiceTyp = '3';
        // }
        const approveData = {
          companyCode: formData.companyCode,
          orderNo: formData.orderNo,
          category: formData?.category,
          contactCodeName: formData.contactCodeName,
          contactCodeR3: formData.contactCodeR3,
          customerRemark: formData.customerRemark,
          csrRemark: formData.csrRemark,
          customerPurchaseNo: formData.customerPurchaseNo,
          completeDeliv: formData.completeDeliv,
          reqDeliveDate: moment(formData.reqDeliveDate).format(dateFormat),
          partialShipment: formData.partialShipment,
          intelDeviceHighLight: basicData.intelDeviceHighLight,
          intelDevice: basicData.intelDeviceHighLight ? 1 : 0,
          oPricingMethod: data?.oPricingMethod,
          paymentTerm: {
            shipType: formData.shipTypeCode,
            // paymentMethod: formData.paymentMethodCode,
            // paymentTerm: formData.paymentTermsCode,
            paymentTerm: getPaymentTerms,
            paymentMethod: getPaymentMethod,
            paymentTermsName: getPaymentTermsName,
            paymentMethodName: getPaymentMethodName,
          },
          orderReceiver: {
            province: formData.province,
            city: formData.city,
            district: formData.district,
            provinceCode: formData.provinceCode,
            cityCode: formData.cityCode,
            districtCode: formData.districtCode,
            receiverAddress: formData.receiverAddress,
            shipZip: formData.shipZip,
            receiverName: formData.receiverName,
            receiverMobile: formData.receiverMobile,
            receiverPhone: formData.receiverPhone,
            consigneeEmail: formData.consigneeEmail,
            toBond: formData.toBond,
            specialCode: formData.specialCode,
            sapCode: formData.receiverSapCode,
          },
          invoiceInfo: {
            invoiceType: formData.invoiceType,
            invoiceTitle: formData.invoiceTitle,
            // vatCompanyName: formData.vatCompanyName,
            vatTaxNo: formData.vatTaxNo,
            vatAddress: formData.vatAddress,
            vatTel: formData.vatTel,
            vatTelExt: formData.vatTelExt,
            vatBankName: formData.vatBankName,
            vatBankAccount: formData.vatBankAccount,
            invoiceReceiver: formData.invoiceReceiver,
            invoiceAddress: formData.invoiceAddress,
            invoiceZip: formData.invoiceZip,
            invoiceTel: formData.invoiceTel,
            invoiceMobile: formData.invoiceMobile,
            invoiceEmail: formData.invoiceEmail,
            invoiceWithGoods: formData.invoiceWithGoods,
            invoiceReceiveRegion: formData.invoiceReceiveRegion,
            sapCode: formData.billingTitleSapCode,
            invoiceSapCode: formData.invoiceAddressSapCode,
          },
          goodsInfo: {
            amount: getAmount,
            freight: formData.freight,
            interFreight: formData.interFreight,
            totalFreight: getTotalFreight,
            tariff: data.tariff,
            goodsAmount: data.goodsAmount,
            untaxedAmount: getAmountNoVat,
          },
          orderLine,
          resourceVOList,
          // resourceVOList: [
          // 	{
          // 		resourceUrl: formData.resourceUrl,
          // 		resourceName: formData.resourceName,
          // 		fileType: "png"
          // 	}
          // ]
        };
        // console.log(approveData);

        approveCsrOrder(approveData)
          .then((res: any) => {
            // console.log(res);
            if (res.errCode === 200) {
              props.approveDrawerClose();
              setConfirmLoading(false);
              message.success('该订单审核通过', 3);
              form.resetFields();
              props.tableReload();
            } else {
              message.error(res.errMsg);
              setConfirmLoading(false);
            }
          })
          .finally(() => {
            return;
          });
      })
      .catch((error) => {
        message.error('带红色*字段不能为空');
        form.scrollToField(error.errorFields[0].name);
        // console.log(error.errorFields[0].name)
        setConfirmLoading(false);
      })
      .finally(() => {
        return;
      });
  };
  const onReject = () => {
    setConfirmLoading(true);
    const formData = form.getFieldsValue(true);
    const cancelData = {
      orderNo: formData.orderNo,
      cancelReason: formData.cancelReason,
      csrRemark: formData.csrRemark,
    };
    cancelOrder(cancelData)
      .then((res: any) => {
        // console.log(res);
        if (res.errCode === 200) {
          setIsRejectReasonModalVisible(false);
          props.approveDrawerClose();
          setConfirmLoading(false);
          message.success('订单已被取消', 3);
          props.tableReload();
        } else {
          message.error(res.errMsg);
          setConfirmLoading(false);
        }
      })
      .finally(() => {
        return;
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error('带红色*字段不能为空', 3);
    console.log('Failed:', errorInfo);
  };

  const { confirm } = Modal;
  function showConfirm() {
    confirm({
      wrapClassName: 'confirmModal',
      title: '您确认审核通过该订单?',
      okText: '确认',
      cancelText: '取消',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        onSubmit();
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }

  function showRejectReasonModal() {
    setConfirmLoading(true);
    if (
      !form.getFieldsValue(true).csrRemark ||
      form.getFieldsValue(true).csrRemark == '' ||
      form.getFieldsValue(true).csrRemark == undefined
    ) {
      message.error('取消订单时CSR备注为必填！');
      setCsrRemarkOption({
        validateStatus: 'error',
        help: '取消订单时CSR备注为必填',
        hasFeedback: true,
      });
      setConfirmLoading(false);
    } else {
      setCsrRemarkOption({
        validateStatus: 'success',
        hasFeedback: true,
      });
      setConfirmLoading(false);
      setRejectReason('1');
      setIsRejectReasonModalVisible(true);
      form.setFieldsValue({
        cancelReason: RejectReasonData && RejectReasonData[0] ? RejectReasonData[0].key : '1',
      });
    }
  }

  function csrRemarkOnChange(values: string) {
    if (values != '') {
      setCsrRemarkOption({});
    } else {
      setCsrRemarkOption({});
    }
    setCsrRemarkOption({});
  }

  const onReset = () => {
    form.resetFields();
    props.approveDrawerClose();
  };
  return (
    <div
      id="scroll-content"
      className="form-content-search tabs-detail hasAbsTabs orderDetail saleOrderDetailInfoDrawer"
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="订单信息" key="1">
          <Spin spinning={load}>
            <section className="drawerTabsContent omsAntStyles">
              <Form
                name="form"
                labelWrap
                className="has-gridForm"
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                initialValues={{
                  orderNo: id,
                  contactCodeR3: R3Code,
                  contactCodeName: R3Name,
                  customerPurchaseNo: data?.customerPurchaseNo,
                  reqDeliveDate: moment(data?.sendDate),
                  customerRemark: data?.userRemark,
                  csrRemark: data?.csrRemark,
                  province: provinceName,
                  city: cityName,
                  category: basicData?.categoryStatus,
                  district: districtName,
                  provinceCode: provinceCode,
                  cityCode: cityCode,
                  districtCode: districtCode,
                  receiverAddress: receiverAddress,
                  specialCode: data?.specialCode,
                  toBond: tableRowData?.toBond,
                  invoiceTitle: invoiceTitle,
                  invoiceWithGoods: tableRowData?.followMerchandise,
                  invoiceAddress: invoiceAddress,
                  shipZip: receiverOtherInfo.shipZip,
                  receiverName: receiverOtherInfo?.receiverName,
                  receiverMobile: receiverOtherInfo?.receiverMobile,
                  receiverPhone: receiverOtherInfo?.receiverPhone,
                  consigneeEmail: receiverOtherInfo?.consigneeEmail,
                  receivingArea: receiverOtherInfo?.receivingArea,
                  invoiceReceiver: invoiceOtherInfo?.invoiceReceiver,
                  invoiceZip: invoiceOtherInfo?.invoiceZip,
                  invoiceTel: invoiceOtherInfo?.invoiceTel,
                  invoiceMobile: invoiceOtherInfo?.invoiceMobile,
                  invoiceEmail: invoiceOtherInfo?.invoiceEmail,
                  invoiceReceiveRegion: invoiceOtherInfo?.invoiceReceiveRegion,
                  invoiceType: getInvoiceTypeCode,
                  shipTypeCode: data?.shipTypeCode,
                  paymentTermsCode: getPaymentTermCode,
                  paymentMethodCode: getPaymentMethodCode,
                  paymentTermsName: getPaymentTermsName,
                  paymentMethodName: getPaymentMethodName,
                  vatBankName: vatOtherInfoData?.vatBankName,
                  vatTaxNo: vatOtherInfoData?.vatTaxNo,
                  vatAddress: vatOtherInfoData?.vatAddress,
                  vatTel: vatOtherInfoData?.vatTel,
                  vatBankAccount: vatOtherInfoData?.vatBankAccount,
                  freight: getFreight,
                  interFreight: getInterFreight,
                  cancelReason: getRejectReason,
                  receiverSapCode: getReceiverSapCode,
                  billingTitleSapCode: getBillingTitleSapCode,
                  invoiceAddressSapCode: getInvoiceAddressSapCode,
                  partialShipment: tableRowData?.partialShipment,
                  intelDeviceHighLight: basicData?.intelDeviceHighLight,
                  intelDevice: basicData?.intelDevice,
                }}
              >
                <AnchorBox>
                  <div className="content1 box">
                    <div id="one" className="title">
                      基本信息
                    </div>
                    <div className="ant-advanced-form four-gridCol">
                      <Form.Item label="订单编号" name="orderNo" style={{ display: 'none' }}>
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item label="客户代号">
                        <span className="form-span">{data?.customerCode}</span>
                      </Form.Item>

                      <Form.Item label="客户名称">
                        <span className="form-span">{data?.customerName}</span>
                      </Form.Item>
                      <Form.Item
                        label="R3联系人"
                        name="contactCodeName"
                        rules={[{ required: true, message: '请选择R3联系人!' }]}
                      >
                        <Input.Search
                          placeholder="请选择R3联系人"
                          readOnly={true}
                          onSearch={() => {
                            onSearch(1);
                          }}
                          onClick={() => {
                            onSearch(1);
                          }}
                        />
                      </Form.Item>

                      <Form.Item label="R3联系人代号" name="contactCodeR3">
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>

                      <Form.Item label="所属公司" name="companyCode">
                        <Select placeholder="请选择所属公司">
                          {orderCompanyList &&
                            orderCompanyList.map((item: any) => (
                              <Select.Option
                                key={item.key}
                                value={item.key}
                                disabled={!['1037', '1010'].includes(item.key)}
                              >
                                {item.value}
                              </Select.Option>
                            ))}
                        </Select>
                        {/* <span className="form-span">{data?.companyName}</span> */}
                      </Form.Item>
                      <Form.Item label="商机信息">
                        <span className="form-span">{data?.oppoValue}</span>
                      </Form.Item>
                      <Form.Item label="主销售">
                        <span className="form-span">{data?.salesName}</span>
                      </Form.Item>
                      <Form.Item label="创建人">
                        <span className="form-span">{data?.createName}</span>
                      </Form.Item>

                      <Form.Item label="渠道">
                        <span className="form-span">{data?.channel}</span>
                      </Form.Item>
                      <Form.Item label="客户采购单号" name="customerPurchaseNo">
                        <Input placeholder="请输入客户采购单号" allowClear />
                      </Form.Item>

                      <Form.Item
                        label="要求发货日"
                        name="reqDeliveDate"
                        className="minLabel"
                        rules={[{ required: true, message: '请选择客户要求发货日!' }]}
                      >
                        <DatePicker format={dateFormat} allowClear={false} inputReadOnly={true} />
                      </Form.Item>

                      <Form.Item
                        label="一次性发货"
                        name="partialShipment"
                        valuePropName={tableRowData?.partialShipment ? 'checked' : ''}
                      >
                        <Switch
                          checkedChildren="是"
                          unCheckedChildren="否"
                          defaultChecked={tableRowData?.partialShipment}
                          onChange={partialShipmentChange}
                        />
                      </Form.Item>

                      <Form.Item label="采购单位名称">
                        <span className="form-span">{data?.purchaseName}</span>
                      </Form.Item>

                      <Form.Item label="采购单位客户号">
                        <span className="form-span">{tableRowData?.purchaseCode}</span>
                      </Form.Item>
                      <Form.Item label="采购单位主销售">
                        <span className="form-span">{tableRowData?.purchaseSalesName}</span>
                      </Form.Item>

                      <Form.Item label="下单人姓名">
                        <span className="form-span">{data?.purchaseAccount}</span>
                      </Form.Item>
                      <Form.Item label="下单人电话">
                        <span className="form-span">{data?.purchaseTel}</span>
                      </Form.Item>
                      <Form.Item label="30天内重复">
                        <span className="form-span">{thirtyRepeatStatus ? '是' : '否'}</span>
                      </Form.Item>

                      <Form.Item label="运费合计">
                        <span className="form-span">
                          &yen; {Number(data?.totalFreight).toFixed(2)}
                        </span>
                      </Form.Item>

                      <Form.Item label="国际运费">
                        <span className="form-span">
                          &yen; {Number(data?.interFreight).toFixed(2)}
                        </span>
                      </Form.Item>

                      <Form.Item label="关税">
                        <span className="form-span">&yen; {Number(data?.tariff).toFixed(2)}</span>
                      </Form.Item>

                      <Form.Item label="含税总金额">
                        <span className="form-span">&yen; {Number(data?.amount).toFixed(2)}</span>
                      </Form.Item>

                      <Form.Item label="货品总计含税">
                        <span className="form-span">
                          &yen; {Number(data?.goodsAmount).toFixed(2)}
                        </span>
                      </Form.Item>

                      <Form.Item label="折扣总计含税">
                        <span className="form-span">&yen; {showdiscountAmount}</span>
                      </Form.Item>

                      <Form.Item label="关联订单号">
                        <span className="form-span">{data?.relationOrderNo}</span>
                      </Form.Item>
                      <Form.Item label="网站优惠券号">
                        <span className="form-span">{data?.couponCode}</span>
                      </Form.Item>
                      <Form.Item label="订单创建时间">
                        <span className="form-span">{data?.createTime}</span>
                      </Form.Item>
                      <Form.Item label="订单有效期至">
                        <span className="form-span">{data?.validToDate}</span>
                      </Form.Item>

                      <Form.Item label="VIP级别">
                        <span className="form-span">{data?.isVip}</span>
                      </Form.Item>
                      <Form.Item label="外部订单号">
                        <span className="form-span">{basicData?.ouOrderNo}</span>
                      </Form.Item>
                      <Form.Item label="所属集团">
                        <span className="form-span">{basicData?.groupCustomerName}</span>
                      </Form.Item>
                      <Form.Item label="集团客户号">
                        <span className="form-span">{basicData?.groupCustomerAccount}</span>
                      </Form.Item>
                      <Form.Item
                        label="智能柜设备(非物料)"
                        name="intelDeviceHighLight"
                        valuePropName={basicData?.intelDeviceHighLight ? 'checked' : ''}
                      >
                        <Switch
                          checkedChildren="是"
                          unCheckedChildren="否"
                          defaultChecked={basicData?.intelDeviceHighLight}
                          onChange={intelDeviceHighLightChange}
                        />
                      </Form.Item>
                      <Form.Item label="客户计价方式">
                        <span className="form-span">
                          {data?.pricingMethod === 1
                            ? '含税模式'
                            : data?.pricingMethod === 2
                            ? '未税模式-2位精度'
                            : data?.pricingMethod === 3
                            ? '未税模式-4位精度'
                            : '--'}
                        </span>
                      </Form.Item>
                      <Form.Item label="订单类型" name="category" rules={[{ required: true }]}>
                        <Select
                          placeholder="请选择"
                          disabled={
                            basicData?.categoryStatus == '30' || basicData?.categoryStatus == '40'
                          }
                        >
                          {orderTypeList &&
                            orderTypeList.map((item: any) => (
                              <Select.Option
                                key={item.key}
                                value={item.key}
                                disabled={
                                  (basicData?.categoryStatus == '10' ||
                                    basicData?.categoryStatus == '20') &&
                                  (item.key === '30' || item.key === '40')
                                }
                              >
                                {item.value}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>

                      <Form.Item label="客户备注" className="fullLineGrid" name="customerRemark">
                        <Input.TextArea
                          showCount
                          maxLength={255}
                          placeholder="请输入客户备注"
                          allowClear
                        />
                      </Form.Item>

                      <Form.Item
                        style={{ marginTop: '8px' }}
                        label="CSR备注"
                        className="fullLineGrid"
                        name="csrRemark"
                        {...csrRemarkOption}
                      >
                        <Input.TextArea
                          showCount
                          maxLength={255}
                          placeholder="请输入CSR备注"
                          allowClear
                          onChange={csrRemarkOnChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="content2 box">
                    <div id="two" className="title">
                      收货信息
                    </div>
                    <div className="ant-advanced-form four-gridCol">
                      <Form.Item
                        label="收货人地址"
                        className="twoGrid"
                        name="receiverAddress"
                        rules={[{ required: true, message: '请选择详细地址!' }]}
                      >
                        <Input.Search
                          placeholder="请选择详细地址"
                          readOnly={true}
                          onSearch={() => {
                            onSearch(2);
                          }}
                          onClick={() => {
                            onSearch(2);
                          }}
                        />
                      </Form.Item>
                      <Form.Item label="收货地区" name="receivingArea">
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <div style={{ display: 'none' }}>
                        <Form.Item name="province">
                          <Input readOnly={true} />
                        </Form.Item>
                        <Form.Item name="city">
                          <Input readOnly={true} />
                        </Form.Item>
                        <Form.Item name="district">
                          <Input readOnly={true} />
                        </Form.Item>
                        <Form.Item name="provinceCode">
                          <Input readOnly={true} />
                        </Form.Item>
                        <Form.Item name="cityCode">
                          <Input readOnly={true} />
                        </Form.Item>
                        <Form.Item name="districtCode">
                          <Input readOnly={true} />
                        </Form.Item>
                      </div>
                      <Form.Item label="邮编" name="shipZip">
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item label="收货人姓名" name="receiverName">
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item label="收货人手机" name="receiverMobile">
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item label="收货人固话" name="receiverPhone">
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item label="收货人邮箱" name="consigneeEmail">
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>

                      <Form.Item
                        label="是否保税区"
                        name="toBond"
                        valuePropName={tableRowData?.toBond ? 'checked' : ''}
                      >
                        <Switch
                          checkedChildren="是"
                          unCheckedChildren="否"
                          defaultChecked={tableRowData?.toBond}
                          onChange={toBondChange}
                        />
                      </Form.Item>

                      <Form.Item label="特殊编码" name="specialCode">
                        <Input placeholder="e.g QR Code" allowClear />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="content3 box">
                    <div id="three" className="title">
                      配送和支付方式信息
                    </div>
                    <div className="ant-advanced-form four-gridCol">
                      <Form.Item
                        label="交货方式"
                        name="shipTypeCode"
                        hasFeedback
                        rules={[{ required: true, message: '请选择交货方式!' }]}
                      >
                        <Select placeholder="请选择交货方式">
                          {ShipTypeData &&
                            ShipTypeData.map((item: any) => (
                              <Select.Option
                                key={item.key}
                                value={item.key}
                                optionlabelprop={item.value}
                              >
                                {item.value}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="支付条件"
                        name="paymentTermsCode"
                        hasFeedback
                        rules={[{ required: true, message: '请选择支付条件!' }]}
                      >
                        <Select
                          placeholder="请选择支付条件"
                          onChange={handlePaymentTermChange}
                          labelInValue={true}
                        >
                          {PaymentTermData &&
                            PaymentTermData.map((item: any) => (
                              <Select.Option
                                key={item.key}
                                value={item.key}
                                label={item.value}
                                optionlabelprop="label"
                              >
                                {item.value}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        className="twoGrid"
                        label="支付方式"
                        name="paymentMethodCode"
                        hasFeedback
                        rules={[{ required: true, message: '请选择支付方式!' }]}
                      >
                        <Select
                          placeholder="请选择支付方式"
                          onChange={handlePaymentMethodChange}
                          labelInValue={true}
                        >
                          {PaymentMethodData &&
                            PaymentMethodData.map((item: any) => (
                              <Select.Option
                                key={item.key}
                                value={item.key}
                                label={item.value}
                                optionlabelprop="label"
                              >
                                {item.value}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                  <div className="content4 box">
                    <div id="four" className="title">
                      开票信息
                    </div>
                    <div className="ant-advanced-form four-gridCol eight-gridCol">
                      <Form.Item
                        label="发票类型"
                        value={getInvoiceTypeCode}
                        name="invoiceType"
                        className="ant-row halfGrid"
                        onChange={InvoiceTypeOnChange}
                        rules={[{ required: true, message: '请选择发票类型!' }]}
                      >
                        <Radio.Group>
                          {InvoiceData &&
                            InvoiceData.map((item: any) => (
                              <Radio key={item.key} value={item.key} label={item.value}>
                                {item.value}
                              </Radio>
                            ))}
                        </Radio.Group>
                      </Form.Item>

                      <Form.Item
                        label="开票抬头"
                        className="ant-row halfGrid"
                        name="invoiceTitle"
                        rules={[{ required: isRequire, message: '请选择发票单位名称!' }]}
                      >
                        <Input.Search
                          placeholder="请选择发票单位名称"
                          readOnly={true}
                          onSearch={() => {
                            onSearch(3);
                          }}
                          onClick={() => {
                            onSearch(3);
                          }}
                        />
                      </Form.Item>

                      <Form.Item label="开户银行" name="vatBankName" className="ant-row halfGrid">
                        <Input
                          bordered={false}
                          readOnly={true}
                          placeholder="暂无开户银行信息"
                          allowClear
                        />
                      </Form.Item>

                      <Form.Item label="纳税人识别号" name="vatTaxNo" className="ant-row halfGrid">
                        <Input
                          bordered={false}
                          readOnly={true}
                          placeholder="暂无纳税人识别号信息"
                          allowClear
                        />
                      </Form.Item>

                      <Form.Item label="注册地址" name="vatAddress" className="ant-row halfGrid">
                        <Input
                          bordered={false}
                          readOnly={true}
                          placeholder="暂无注册地址信息"
                          allowClear
                        />
                      </Form.Item>

                      <Form.Item label="注册电话" name="vatTel" className="ant-row halfGrid">
                        <Input
                          bordered={false}
                          readOnly={true}
                          placeholder="暂无注册电话信息"
                          allowClear
                        />
                      </Form.Item>

                      <Form.Item
                        label="银行账号"
                        name="vatBankAccount"
                        className="ant-row halfGrid"
                      >
                        <Input
                          bordered={false}
                          readOnly={true}
                          placeholder="暂无银行账号信息"
                          allowClear
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="content5 box">
                    <div id="five" className="title">
                      发票寄送信息
                    </div>

                    <div className="ant-advanced-form four-gridCol">
                      <Form.Item
                        label="发票收件地址"
                        className="twoGrid minLabel"
                        name="invoiceAddress"
                        rules={[{ required: getInvoiceRequired, message: '请选择发票寄送地址!' }]}
                      >
                        <Input.Search
                          placeholder="请选择发票寄送地址"
                          readOnly={true}
                          onSearch={() => {
                            onSearch(4);
                          }}
                          onClick={() => {
                            onSearch(4);
                          }}
                        />
                      </Form.Item>
                      <Form.Item label="发票收件地区" name="invoiceReceiveRegion">
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item label="发票收件邮编" name="invoiceZip" className="minLabel">
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item label="发票收件人" name="invoiceReceiver">
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item label="发票收件手机" className="minLabel" name="invoiceMobile">
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item label="发票收件固话" className="minLabel" name="invoiceTel">
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item label="发票收件邮箱" className="minLabel" name="invoiceEmail">
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item
                        label="发票是否随货"
                        name="invoiceWithGoods"
                        valuePropName={data?.invoiceWithGoods ? data.invoiceWithGoods : 'checked'}
                      >
                        <Switch
                          checkedChildren="是"
                          unCheckedChildren="否"
                          defaultChecked={tableRowData?.followMerchandise}
                          onChange={followMerchandiseChange}
                        />
                      </Form.Item>
                      <div style={{ display: 'none' }}>
                        <Form.Item name="receiverSapCode">
                          <Input readOnly={true} />
                        </Form.Item>
                        <Form.Item name="billingTitleSapCode">
                          <Input readOnly={true} />
                        </Form.Item>
                        <Form.Item name="invoiceAddressSapCode">
                          <Input readOnly={true} />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                  <div className="content6 box">
                    <div id="six" className="title">
                      商品明细及运费信息
                      <span className="tipsInTitle">（金额输入仅支持数字和小数点后2位)</span>
                    </div>
                    <Button
                      style={{ margin: '10px 0px 0px 8px' }}
                      key="查询备货信息"
                      htmlType="button"
                      size="small"
                      className="light_blue"
                      onClick={() => {
                        MiDrawerRef?.current?.open(id);
                      }}
                    >
                      查询备货信息
                    </Button>
                    <Button
                      style={{ margin: '10px 0px 0px 8px' }}
                      key="修改计价方式"
                      htmlType="button"
                      size="small"
                      className="light_danger"
                      onClick={() => {
                        pricingMethodModalOpen();
                      }}
                    >
                      修改计价方式
                    </Button>
                    <div className="ant-advanced-form">
                      <table className="amountTable" cellSpacing="0" data-content="币种：CNY">
                        <tbody>
                          <tr>
                            <th>货品金额合计:</th>
                            <td>{showgoodsAmount}</td>
                            <th>头运费:</th>
                            <td>
                              <Form.Item name="freight">
                                <InputNumber
                                  style={{ width: '100%' }}
                                  min={'0'}
                                  size="small"
                                  value={getFreight}
                                  onChange={FreightOnChangetable}
                                  formatter={limitDecimals}
                                  parser={limitDecimals}
                                />
                              </Form.Item>
                            </td>
                            <th>国际运费:</th>
                            <td>
                              <Form.Item name="interFreight">
                                <InputNumber
                                  min={'0'}
                                  style={{ width: '100%' }}
                                  size="small"
                                  value={getInterFreight}
                                  onChange={InterFreightOnChange}
                                  formatter={limitDecimals}
                                  parser={limitDecimals}
                                />
                              </Form.Item>
                            </td>
                            <th>关税:</th>
                            <td>{showtariff}</td>
                          </tr>
                          <tr>
                            <th>运费总计:</th>
                            <td>{getTotalFreight}</td>
                            <th>总计金额含税:</th>
                            <td>{getAmount}</td>
                            <th>总计金额未税:</th>
                            <td>{getAmountNoVat}</td>
                            <th>使用返利金额:</th>
                            <td>{Number(data.rebate).toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="detail_table_mod">
                        <ProTable<any>
                          columns={columns}
                          rowClassName={(record: any) =>
                            record?.discountInfo?.cspDiscount ? 'red' : 'white'
                          }
                          // request={async (params: any) => {
                          //   const searchParams: any = {};
                          //   searchParams.pageNumber = params.current;
                          //   searchParams.pageSize = params.pageSize;
                          //   searchParams.orderNo = id;
                          //   const res = await goodsDetails(searchParams);
                          //   res.data?.list.forEach((e: any, i: number) => {
                          //     //? 在表格数据的每一条里面加一个标识，然后用这个标识找到对应要编辑的那一项
                          //     e.index = i;
                          //   });
                          //   // 1、将当前页面的列表数据存一下，存到数组的第${页码项}
                          //   // 要先有一个数组，这个数组每一项是每一页的列表信息（数组），长度是当前所有页数的总和

                          //   // 先算长度：
                          //   const length = Math.ceil(res.data?.total / params?.pageSize);
                          //   console.log(length);
                          //   // 然后建数组
                          //   for (let i = 0; i < length; i++) {
                          //     if (row.length !== length && params.pageSize == size) row.push([]); //?如果row已经在第一次push过了，就不用再加了
                          //   }
                          //   setSize(params.pageSize); //这里把当前的页数存一下，然后在改变页数的时候，那这个页数去跟当前的params页数比较，一样的话，就表示没有点换页数，不一样的话就代表换了页数
                          //   // 然后把这一页的数据存一存,存储到当前的页码-1那一项上面
                          //   if (
                          //     params.pageSize === size && //?当换回来之后还是一样的页数，那么就不用改变，如果页数变页数了要刷新当前页的所有数据
                          //     row[params.current - 1].length == 0
                          //   ) {
                          //     //? 换页过去发现没有数据再添加
                          //     row[params.current - 1] = res.data?.list;
                          //   } else if (params.pageSize === size && reloadStatus) {
                          //     //?是否是从特殊需求申请弹框过来的状态，判断表格是否要刷新并顶掉原来的数据
                          //     row[params.current - 1] = res.data?.list;
                          //   } else if (params.pageSize !== size) {
                          //     //?当换回来之后还是一样的页数，那么就不用改变，如果页数变了要刷新当前页的所有数据
                          //     row[params.current - 1] = res.data?.list;
                          //     const Arr = row.slice(0, 1);
                          //     setRow(Arr);
                          //   }
                          //   setReloadStatus(false);
                          //   // 存完之后挂载到全局，让小计含税的输入框进行修改
                          //   if (params.pageSize == size) {
                          //     //?只有在没有换页数的时候去设置row
                          //     setRow(row);
                          //   }

                          //   // 2、然后在切换回来的时候，可以获取到当前的页码，也就是params.current

                          //   // 3、根据页码，找到之前的本页的数据，

                          //   // 4、然后将本页的数据替换掉自动更新的数据
                          //   if (res.errCode === 200) {
                          //     // console.log(row, '到底刷新没呢？看下这里');
                          //     return Promise.resolve({
                          //       data: row[params.current - 1],
                          //       total: res.data?.total,
                          //       current: 1,
                          //       pageSize: 10,
                          //       success: true,
                          //     });
                          //   } else {
                          //     message.error(res.errMsg);
                          //     return Promise.resolve([]);
                          //   }
                          // }}
                          dataSource={tableData}
                          rowKey="index"
                          search={false}
                          options={false}
                          tableAlertRender={false}
                          defaultSize="small"
                          scroll={{ x: 100, y: yClient }}
                          bordered
                          actionRef={detailRef}
                          size="small"
                          pagination={{
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            total: total,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            showTotal: (_, range) =>
                              `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                            onChange: (current, pageSize) => onShowSizeChange(current, pageSize),
                          }}
                          className="selectedTable"
                        />
                        <span
                          style={{
                            width: '500px',
                            color: '#3f3c3cae',
                            display: 'block',
                            transform: 'translateY(-42px)',
                          }}
                        >
                          红色表示该行SKU当前正使用CSP价格
                        </span>
                        <Modal
                          className="noTopFootBorder"
                          width={680}
                          title="特殊需求申请"
                          visible={isApplyModalVisible}
                          destroyOnClose={true}
                          footer={[]}
                          onCancel={applyModalHandleOk}
                        >
                          <ApplyForm
                            sku={getSku}
                            lineData={getLineData}
                            tableRowData={tableRowData}
                            applyModalHandleOk={applyModalHandleOk}
                            detailTableReload={detailTableReload}
                          />
                        </Modal>
                        <Modal
                          className="noTopFootBorder"
                          width={500}
                          title="修改计价方式"
                          visible={pricingMethodModalVisible}
                          destroyOnClose={true}
                          footer={[]}
                          onCancel={pricingMethodModalClose}
                        >
                          <PricingMethodForm
                            orderNo={data?.orderNo}
                            customerCode={data?.customerCode}
                            oPricingMethod={data?.oPricingMethod || 0}
                            close={pricingMethodModalClose}
                            handleData={handleData}
                            clearChageArr={clearChageArr}
                            detailTableReload={detailTableReload}
                          />
                        </Modal>
                      </div>
                    </div>
                  </div>
                  <div className="content7 box">
                    <div id="seven" className="title">
                      附件
                    </div>

                    <div className="detail_table_mod" style={{ width: '70%' }}>
                      <ProTable<any>
                        columns={attachment_columns}
                        bordered
                        size="small"
                        style={{ marginTop: '-10px' }}
                        request={async (params) => {
                          const searchParams: any = {
                            pageNumber: params.current,
                            pageSize: params.pageSize,
                            sourceId: sourceId,
                            sourceType: 40,
                            subType: 20,
                          };
                          const res = await getFilesList(searchParams);
                          if (res.errCode === 200) {
                            return Promise.resolve({
                              data: res.data?.list,
                              total: res.data?.total,
                              current: 1,
                              pageSize: 10,
                              success: true,
                            });
                          } else {
                            message.error(res.errMsg, 3);
                            return Promise.resolve([]);
                          }
                        }}
                        rowKey={() => Math.random()}
                        search={false}
                        options={false}
                        tableAlertRender={false}
                        actionRef={actionRef}
                        defaultSize="small"
                        scroll={{ x: 100, y: 250 }}
                        pagination={{
                          defaultPageSize: 10,
                          showSizeChanger: true,
                          pageSizeOptions: ['10', '20', '50', '100'],
                          // showTotal: total => `共有 ${total} 条数据1`,
                          showTotal: (total1, range) =>
                            `共有 ${total1} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                        }}
                        headerTitle={
                          <Space>
                            <Button
                              key="上传PO附件"
                              type="primary"
                              htmlType="button"
                              size="small"
                              onClick={uploadFile}
                              style={{ marginBottom: '10px' }}
                            >
                              上传PO附件
                            </Button>
                          </Space>
                        }
                      />
                    </div>
                  </div>
                </AnchorBox>
                <Modal
                  title={modalTitle}
                  visible={isModalVisible}
                  width={'76%'}
                  destroyOnClose={true}
                  onOk={modalOK}
                  onCancel={() => {
                    setIsModalVisible(false);
                  }}
                >
                  <ModalList
                    modalTitle={modalTitle}
                    modalColumn={modalColumn}
                    getData={getData}
                    operateMethod={operateMethod}
                    modalOK={modalOK}
                    showApiAddress={getShowApiAddress}
                    basicData={data}
                  />
                </Modal>

                <div
                  style={{ position: 'fixed' }}
                  className="ant-modal-footer drewerFooterNoBorderButtonAbsCol"
                >
                  <Button
                    danger
                    className="light_danger"
                    onClick={showRejectReasonModal}
                    loading={confirmLoading}
                  >
                    取消订单
                  </Button>
                  <Button
                    className="light_blue"
                    type="primary"
                    htmlType="submit"
                    loading={confirmLoading}
                  >
                    保存修改
                  </Button>
                  <Button
                    type="primary"
                    htmlType="button"
                    loading={confirmLoading}
                    onClick={showConfirm}
                  >
                    审核通过
                  </Button>
                  <Button htmlType="button" onClick={onReset}>
                    关 闭
                  </Button>
                </div>
                <Modal
                  className="noTopFootBorder"
                  width={500}
                  title="选择订单取消理由"
                  visible={isRejectReasonModalVisible}
                  destroyOnClose={true}
                  onCancel={RejectReasonModalClose}
                  onOk={onReject}
                  footer={[]}
                >
                  <div className="" style={{ margin: 40, marginTop: 20 }}>
                    <Form.Item
                      label="取消理由"
                      name="cancelReason"
                      hasFeedback
                      rules={[{ required: true, message: '请选择取消理由!' }]}
                    >
                      <Select placeholder="请选择取消理由">
                        {RejectReasonData &&
                          RejectReasonData.map((item: any) => (
                            <Select.Option key={item.key} value={item.key}>
                              {item.value}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                    <p style={{ color: '#999' }}>
                      注: 取消订单时,仅保存CSR备注和取消理由,其余修改不保存
                    </p>
                  </div>
                  <div className="ant-modal-footer">
                    <Button htmlType="button" onClick={RejectReasonModalClose}>
                      关 闭
                    </Button>
                    <Button
                      type="primary"
                      htmlType="button"
                      loading={confirmLoading}
                      onClick={onReject}
                    >
                      确认取消
                    </Button>
                  </div>
                </Modal>
              </Form>
              <UploadForm visible={isUpload} getList={loadList} maxCount={100} />
            </section>
          </Spin>
        </TabPane>
        <TabPane tab="MDM赋码信息" key="2">
          <AchangeToB id={id} />
        </TabPane>
      </Tabs>
      <MiDrawer ref={MiDrawerRef} />
    </div>
  );
};
export default ApproveOrderDetail;
