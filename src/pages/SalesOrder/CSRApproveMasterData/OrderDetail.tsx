import AchangeToB from '@/pages/SalesOrder/components/AchangeToB';
import {
  invoiceAddressCols,
  invoiceInfoCols,
  r3Cols,
  receiverAddressCols,
} from '@/pages/SalesOrder/components/constant';
import ModalList from '@/pages/SalesOrder/components/ModalList';
import {
  approveCsrMasterData,
  getFilesList,
  getInvoiceAddressList,
  getInvoiceInfoList,
  getR3ConList,
  getReceiverAddressList,
  isThirtyRepeat,
  saveCsrMasterData,
  getOrderDateList,
  getCsrOrderDetail,
} from '@/services/SalesOrder/index';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Input, message, Modal, Switch, Tabs, Radio } from 'antd';
import Option from '@/pages/SalesAfter/components/Option';
import moment from 'moment';
import React, { createRef, useEffect, useImperativeHandle, useState } from 'react';
import AnchorBox from './components/Anchor/index';
import './style.css';
interface closeModal {
  approveModalHandleOk?: any;
  tableReload?: any;
  id?: any;
  tableRowData?: any;
}

const MasterDataDetail: React.FC<closeModal> = (props: any) => {
  const { TabPane } = Tabs;
  const { id, tableRowData } = props;
  const sourceId = tableRowData?.sid;
  const formRef: any = React.createRef();
  const [form] = Form.useForm();
  const ref = createRef();
  const dateFormat = 'YYYY-MM-DD';
  const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
  const data = tableRowData;

  data.createTime = moment(tableRowData?.createTime).format(dateTimeFormat);
  data.sendDate = moment(tableRowData?.sendDate).format(dateFormat);
  data.validToDate = moment(tableRowData?.validToDate).format(dateFormat);

  if (tableRowData?.partialShipment) {
    data.partialShipment = '是';
  } else {
    data.partialShipment = '否';
  }
  if (tableRowData?.thirtyRepeat) {
    data.thirtyRepeat = '是';
  } else {
    data.thirtyRepeat = '否';
  }

  const customer_code = tableRowData?.customerCode;
  // const [toBondEditStatus, setToBondEditStatus]: any = useState(false);
  // const [toBondStatus, setToBondStatus]: any = useState(false);
  const [thirtyRepeatStatus, setThirtyRepeatStatus]: any = useState(false);

  const [getReceiverSapCode, setReceiverSapCode]: any = useState(tableRowData?.shipRegionSapCode);
  const [getBillingTitleSapCode, setBillingTitleSapCode]: any = useState(tableRowData?.vatSapCode);
  const [getInvoiceAddressSapCode, setInvoiceAddressSapCode]: any = useState(
    tableRowData?.invoiceSapCode,
  );
  const [InvoiceData, seInvoiceData]: any = useState([]);

  useEffect(() => {
    // getToBondStatus(customer_code).then((res: any) => {
    //   if (res.errCode === 200) {
    //     setToBondEditStatus(!res.data?.edit);
    //     setToBondStatus(res.data?.toBond);
    //   }
    // });
    const isThirtyRepeat_params = {
      orderNo: id,
      customerCode: customer_code,
      amount: tableRowData?.amount,
    };
    isThirtyRepeat(isThirtyRepeat_params).then((res: any) => {
      // if (res.errCode === 200) {
      //   if (JSON.stringify(res.data?.dataList) != '[]') {
      //     setThirtyRepeatStatus(true);
      //   } else {
      //     setThirtyRepeatStatus(false);
      //   }
      // }
    });

    getOrderDateList({ type: 'invoice' }).then((res: any) => {
      // if (res.errCode === 200) {
      //   seInvoiceData(res.data?.dataList);
      // }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!tableRowData?.toBond) {
    data.toBond = '';
  } else {
    data.toBond = 'checked';
  }

  if (!tableRowData?.followMerchandise) {
    data.invoiceWithGoods = '';
  } else {
    data.invoiceWithGoods = 'checked';
  }
  if (tableRowData?.followMerchandise == 0) {
    data.invoiceWithGoods = '';
  } else {
    data.invoiceWithGoods = 'checked';
  }
  function toBondChange(checked: any) {
    form.getFieldsValue(true).toBond = checked;
    console.log(checked);
  }

  function followMerchandiseChange(checked: any) {
    form.getFieldsValue(true).invoiceWithGoods = checked;
    console.log(checked);
  }
  if (
    tableRowData?.invoiceTypeCode == '1' ||
    tableRowData?.invoiceTypeCode == '2' ||
    tableRowData?.invoiceTypeCode == '3'
  ) {
  } else {
    data.invoiceType = '';
    data.invoiceTypeCode = '';
  }
  let flag = false;
  if (data?.invoiceTypeCode == 3) {
    data.invoiceRequired = false;
  } else if (data?.invoiceTypeCode == 2) {
    data.invoiceRequired = true;
    flag = true;
  } else if (data?.invoiceTypeCode == 1) {
    data.invoiceRequired = true;
    flag = true;
  }

  const [getInvoiceType, setInvoiceType]: any = useState(data?.invoiceType);
  const [getInvoiceTypeCode, setInvoiceTypeCode]: any = useState(data?.invoiceTypeCode);
  const [getInvoiceRequired, setInvoiceRequired]: any = useState(data?.invoiceRequired);
  const [isRequire, setIsRequire] = useState(flag);
  function InvoiceTypeOnChange(e: any) {
    setInvoiceType(e.target.label);
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

    console.log(getInvoiceType);
  }

  if (tableRowData?.tariff >= 0 && tableRowData?.tariff != '') {
    data.tariff = tableRowData?.tariff;
  } else {
    data.tariff = '0.00';
  }
  // tableRowData?.orderTags = [
  // 	{ key:1, value:'dafasdfasdf'}
  // ]
  let marginTopClassName = '';
  if (!tableRowData?.orderTags) {
    data.orderTags = [];
  }

  if (JSON.stringify(data.orderTags) != '[]') {
    marginTopClassName = 'hasMarginTop';
  }

  if (!tableRowData?.province || tableRowData?.province == undefined) {
    data.province = '';
  } else {
    // data.province = tableRowData?.province + '-';
    data.province = tableRowData?.province;
  }

  if (!tableRowData?.city || tableRowData?.city == undefined) {
    data.city = '';
  } else {
    data.city = tableRowData?.city;
  }

  if (!tableRowData?.district || tableRowData?.district == undefined) {
    data.district = '';
  } else {
    data.district = tableRowData?.district;
  }

  const [R3Code, setR3Code]: any = useState(tableRowData?.contactsCode);
  const [R3Name, setR3Name]: any = useState(tableRowData?.contactsName);

  const [provinceName, setProvinceName]: any = useState(tableRowData?.province);
  const [cityName, setCityName]: any = useState(tableRowData?.city);
  const [districtName, setDistrictName]: any = useState(tableRowData?.district);

  const [provinceCode, setProvinceCode]: any = useState(tableRowData?.provinceCode);
  const [cityCode, setCityCode]: any = useState(tableRowData?.cityCode);
  const [districtCode, setDistrictCode]: any = useState(tableRowData?.districtCode);

  const [receiverAddress, setReceiverAddress]: any = useState(tableRowData?.receiverAddress);

  const [receiverOtherInfo, setReceiverOtherInfo]: any = useState({
    shipZip: tableRowData?.shipZip,
    receiverName: tableRowData?.receiverName,
    receiverMobile: tableRowData?.receiverMobile,
    receiverPhone: tableRowData?.receiverPhone,
    consigneeEmail: tableRowData?.consigneeEmail,
    // receivingArea: data.province + data.city + data.district,
    receivingArea: tableRowData?.receivingArea,
  });

  const [invoiceTitle, setInvoiceTitle]: any = useState(tableRowData?.invoiceTitle);
  const [invoiceAddress, setInvoiceAddress]: any = useState(tableRowData?.invoiceAddress);
  const [invoiceOtherInfo, setOtherInfo]: any = useState({
    invoiceReceiver: tableRowData?.invoiceReceiver,
    invoiceZip: tableRowData?.invoiceZip,
    invoiceTel: tableRowData?.invoiceTel,
    invoiceMobile: tableRowData?.invoiceMobile,
    invoiceEmail: tableRowData?.invoiceEmail,
    invoiceReceiveRegion: tableRowData?.invoiceReceiveRegion,
  });

  const [vatOtherInfoData, setVatOtherInfoData]: any = useState({
    vatBankName: tableRowData?.vatBankName,
    vatTaxNo: tableRowData?.vatTaxNo,
    vatAddress: tableRowData?.vatAddress,
    vatTel: tableRowData?.vatPhone,
    vatBankAccount: tableRowData?.vatBankNo,
    // vatCompanyName: tableRowData?.vatCompanyName
  });

  const [confirmLoading, setConfirmLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('选择R3联系人');
  const [modalColumn, setModalColumn]: any = useState([]);
  const [modalVal, setModalVal] = useState({});

  const [basicData, setBasicData]: any = useState({});
  const [receiveData, setReceiveData]: any = useState({});
  const [invoiceData, setInvoiceData]: any = useState({});
  const detailData = {
    orderNo: id,
    customerCode: tableRowData?.customerCode,
  };
  const [allData, setAllData]: any = useState({});
  useEffect(() => {
    const fn = async () => {
      // const res = await getCsrOrderDetail(detailData);
      // if (res.errCode === 200) {
      //   const {
      //     data: { salesOrderRespVo, salesOrderReceiverRespVo, salesOrderInvoiceInfoRespVo },
      //   } = res;
      //   const temp: any = res?.data;
      //   const defauleParams: any = {
      //     ...temp,
      //     ...temp.salesOrderRespVo,
      //     ...temp.salesOrderReceiverRespVo,
      //     ...temp.salesOrderInvoiceInfoRespVo,
      //   };
      //   setAllData(defauleParams);
      //   if (salesOrderRespVo) {
      //     setBasicData(salesOrderRespVo);
      //   }
      //   if (salesOrderReceiverRespVo) {
      //     setReceiveData(salesOrderReceiverRespVo);
      //   }
      //   if (salesOrderInvoiceInfoRespVo) {
      //     setInvoiceData(salesOrderInvoiceInfoRespVo);
      //   }
      // }
      // console.log(tableRowData?.invoiceEmail, 'tableRowData?.invoiceEmail')
      // if (tableRowData?.invoiceEmail) {
      //   setInvoiceRequired(false);
      // }
    };
    fn();
  }, [id]);

  const [getShowApiAddress, setShowApiAddress]: any = useState(false);

  const getData = async (params: any, getApiAddressLevel: any) => {
    params.customerCode = tableRowData?.customerCode;
    if (modalTitle === '选择R3联系人') {
      return await getR3ConList(params);
    } else if (modalTitle === '选择地址') {
      if (basicData?.needPurchase && getApiAddressLevel === 2) {
        params.customerCode = basicData?.purchaseCode;
      } else {
        params.customerCode = tableRowData?.customerCode;
      }
      return await getReceiverAddressList(params);
    } else if (modalTitle === '选择开票信息') {
      return await getInvoiceInfoList(params);
    } else if (modalTitle === '选择发票收件信息') {
      return await getInvoiceAddressList(params);
    }
  };
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
        setReceiverSapCode(val[0]?.sapCode || '');
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
          // vatCompanyName: vatOtherInfoData?.vatCompanyName || '',
        });
        setBillingTitleSapCode(val[0]?.sapCode);
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
          invoiceReceiveRegion: newInvoiceReceiveRegion || '',
          invoiceAddressSapCode: val[0]?.sapCode || '',
        });

        setInvoiceAddress(val[0]?.receiptAddress || '');
        setOtherInfo({
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
  const onFinish = (values: any) => {
    if (!values.receiverMobile && !values.receiverPhone) {
      return message.error('请完善收货信息中的收货人手机，或收货人固话');
    }
    if (values.invoiceType == 1 && !values.invoiceMobile && !values.invoiceTel && !values.invoiceEmail) {
      return message.error('请完善发票寄送信息中的收货人手机，邮箱或收货人固话！');
    }
    setConfirmLoading(true);
    const formData = JSON.parse(JSON.stringify(values));
    console.log('Success:', formData);
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
    const saveData = {
      orderNo: formData.orderNo,
      contactCodeName: formData.contactCodeName,
      contactCodeR3: formData.contactCodeR3,
      csrRemark: formData.csrRemark,
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
    };

    saveCsrMasterData(saveData)
      .then((res: any) => {
        console.log(res);
        // if (res.errCode === 200) {
        //   props.approveModalHandleOk();
        //   setConfirmLoading(false);
        //   message.success('保存成功', 3);
        //   form.resetFields();
        //   props.tableReload();
        // } else {
        //   message.error(res.errMsg);
        //   setConfirmLoading(false);
        // }
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
        if (formData.invoiceType == 1 && !formData.invoiceMobile && !formData.invoiceTel && !formData.invoiceEmail) {
          return message.error('请完善发票寄送信息中的收货人手机，邮箱或收货人固话');
        }
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

        const approveData = {
          orderNo: formData.orderNo,
          contactCodeName: formData.contactCodeName,
          contactCodeR3: formData.contactCodeR3,
          csrRemark: formData.csrRemark,
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
        };

        approveCsrMasterData(approveData)
          .then((res: any) => {
            console.log(res);
            // if (res.errCode === 200) {
            //   props.approveModalHandleOk();
            //   setConfirmLoading(false);
            //   message.success('该订单审核通过', 3);
            //   form.resetFields();
            //   props.tableReload();
            // } else {
            //   message.error(res.errMsg);
            //   setConfirmLoading(false);
            // }
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
    // const approveParams = form.getFieldsValue(true);
    // approveCsrMasterData(approveParams).then((res: any) => {
    //   console.log(res);
    //   if (res.errCode === 200) {
    //     props.approveModalHandleOk();
    //     setConfirmLoading(false);
    //     message.success('该订单审核通过成功', 3);
    //     form.resetFields()

    //   } else {
    //     message.error(res.errMsg);
    //     setConfirmLoading(false);
    //   }
    // }).finally(() => {
    // return
    // });
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error('带红色*字段不能为空', 3);
    console.log('Failed:', errorInfo);
  };
  const onReset = () => {
    form.resetFields();
    props.approveModalHandleOk();
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
        console.log('Cancel');
      },
    });
  }

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
      width: 150,
      fixed: 'left',
      sorter: (a, b) => (a.resourceName - b.resourceName ? 1 : -1),
    },
    {
      title: '文件类型',
      dataIndex: 'fileType',
      width: 150,
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

  return (
    <div
      id="scroll-content"
      className="form-content-search tabs-detail hasAbsTabs orderDetail saleOrderDetailInfoDrawer"
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="订单信息" key="1">
          <section className="drawerTabsContent omsAntStyles">
            {JSON.stringify(data.orderTags) != '[]' && (
              <div className="tipsCol">
                <div className="ant-alert ant-alert-warning ant-alert-with-description">
                  <span className="anticon anticon-exclamation-circle ant-alert-icon">
                    <ExclamationCircleOutlined />
                  </span>
                  <div className="ant-alert-content">
                    <div className="ant-alert-message" id="masterDataTopTips">
                      请注意,以下信息需要审核:
                      {data?.orderTags.map((item: any) => (
                        <span key={item.key}>
                          {item.key}. {item.value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Form
              name="form"
              className="has-gridForm"
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              initialValues={{
                orderNo: id,
                contactCodeR3: R3Code,
                contactCodeName: R3Name,
                csrRemark: data.csrRemark,
                province: provinceName,
                city: cityName,
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
                shipZip: receiverOtherInfo?.shipZip,
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
                vatBankName: vatOtherInfoData?.vatBankName,
                vatTaxNo: vatOtherInfoData?.vatTaxNo,
                vatAddress: vatOtherInfoData?.vatAddress,
                vatTel: vatOtherInfoData?.vatTel,
                vatBankAccount: vatOtherInfoData?.vatBankAccount,
                // vatCompanyName: tableRowData?.vatCompanyName,
                receiverSapCode: getReceiverSapCode,
                billingTitleSapCode: getBillingTitleSapCode,
                invoiceAddressSapCode: getInvoiceAddressSapCode,
              }}
            >
              <div className={marginTopClassName}>
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

                      <Form.Item label="所属公司">
                        <span className="form-span">{data?.companyName}</span>
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
                      <Form.Item label="客户采购单号">
                        <span className="form-span">{data?.customerPurchaseNo}</span>
                      </Form.Item>
                      <Form.Item label="要求发货日期">
                        <span className="form-span">{data?.sendDate}</span>
                      </Form.Item>

                      <Form.Item label="一次性发货">
                        <span className="form-span">{allData?.partialShipment ? '是' : '否'}</span>
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
                          &yen; {Number(data.goodsAmount).toFixed(2)}
                        </span>
                      </Form.Item>

                      <Form.Item label="折扣总计含税">
                        <span className="form-span">
                          &yen; {Number(data.discountAmount).toFixed(2)}
                        </span>
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
                      <Form.Item label="客户计价方式">
                        <span className="form-span">
                          {allData?.pricingMethod === 1
                            ? '含税模式'
                            : allData?.pricingMethod === 2
                            ? '未税模式-2位精度'
                            : allData?.pricingMethod === 3
                            ? '未税模式-4位精度'
                            : '--'}
                        </span>
                      </Form.Item>
                      <Form.Item label="用户备注" className="fullLineGrid">
                        <span className="form-span wordBreak">{data?.userRemark}</span>
                      </Form.Item>

                      <Form.Item label="CSR备注" className="fullLineGrid" name="csrRemark">
                        <Input.TextArea
                          showCount
                          maxLength={255}
                          placeholder="请输入CSR备注"
                          allowClear
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="content2 box">
                    <div id="two" className="title">
                      收货信息
                      {receiveData?.receiveHighlight && (
                        <span className="tipsInTitle">
                          （红色高亮字段名表示该数据与原始值不一致)
                        </span>
                      )}
                    </div>
                    <div className="ant-advanced-form four-gridCol">
                      {/*<Form.Item label="收货地区">
												<span className="form-span">
													{provinceName}-{cityName}-{districtName}
												</span>
											</Form.Item>*/}

                      <Form.Item
                        label="收货人地址"
                        className={`twoGrid ${receiveData?.receiveHighlight ? 'highLight' : ''}`}
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
                      <Form.Item
                        label="收货地区"
                        name="receivingArea"
                        className={receiveData?.receiveHighlight ? 'highLight' : ''}
                      >
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

                      <Form.Item
                        label="邮编"
                        name="shipZip"
                        className={receiveData?.receiveHighlight ? 'highLight' : ''}
                      >
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item
                        label="收货人姓名"
                        name="receiverName"
                        className={receiveData?.receiveHighlight ? 'highLight' : ''}
                      >
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item
                        label="收货人手机"
                        name="receiverMobile"
                        className={receiveData?.receiveHighlight ? 'highLight' : ''}
                      >
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item
                        label="收货人固话"
                        name="receiverPhone"
                        className={receiveData?.receiveHighlight ? 'highLight' : ''}
                      >
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item
                        label="收货人邮箱"
                        name="consigneeEmail"
                        className={receiveData?.receiveHighlight ? 'highLight' : ''}
                      >
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>

                      <Form.Item
                        label="是否保税区"
                        name="toBond"
                        valuePropName={data?.toBond ? data.toBond : 'checked'}
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
                      {(basicData?.paymentTermsHighLight || basicData?.paymentMethodHighLight) && (
                        <span className="tipsInTitle">
                          （红色高亮字段名表示该数据与原始值不一致)
                        </span>
                      )}
                    </div>
                    <div className="ant-advanced-form four-gridCol">
                      <Form.Item label="交货方式">
                        <span className="form-span">{data?.shipType}</span>
                      </Form.Item>
                      <Form.Item
                        label="支付条件"
                        className={basicData?.paymentTermsHighLight ? 'highLight' : ''}
                      >
                        <span className="form-span">{data?.paymentTerms}</span>
                      </Form.Item>

                      <Form.Item
                        label="支付方式"
                        className={`twoGrid ${
                          basicData?.paymentMethodHighLight ? 'highLight' : ''
                        }`}
                      >
                        <span className="form-span">{data?.paymentMethod}</span>
                      </Form.Item>
                    </div>
                  </div>
                  <div className="content4 box">
                    <div id="four" className="title">
                      开票信息
                      {(invoiceData?.invoiceTypeHighLight || invoiceData?.billingHighLight) && (
                        <span className="tipsInTitle">
                          （红色高亮字段名表示该数据与原始值不一致)
                        </span>
                      )}
                    </div>
                    <div className="ant-advanced-form four-gridCol eight-gridCol">
                      <Form.Item
                        label="发票类型"
                        value={getInvoiceTypeCode}
                        name="invoiceType"
                        className={`ant-row halfGrid ${
                          invoiceData?.invoiceTypeHighLight ? 'highLight' : ''
                        }`}
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
                        className={`ant-row halfGrid ${
                          invoiceData?.billingHighLight ? 'highLight' : ''
                        }`}
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

                      <Form.Item
                        label="开户银行"
                        name="vatBankName"
                        className={`ant-row halfGrid ${
                          invoiceData?.billingHighLight ? 'highLight' : ''
                        }`}
                      >
                        <Input
                          bordered={false}
                          readOnly={true}
                          placeholder="暂无开户银行信息"
                          allowClear
                        />
                      </Form.Item>

                      <Form.Item
                        label="纳税人识别号"
                        name="vatTaxNo"
                        className={`ant-row halfGrid ${
                          invoiceData?.billingHighLight ? 'highLight' : ''
                        }`}
                      >
                        <Input
                          bordered={false}
                          readOnly={true}
                          placeholder="暂无纳税人识别号信息"
                          allowClear
                        />
                      </Form.Item>

                      <Form.Item
                        label="注册地址"
                        name="vatAddress"
                        className={`ant-row halfGrid ${
                          invoiceData?.billingHighLight ? 'highLight' : ''
                        }`}
                      >
                        <Input
                          bordered={false}
                          readOnly={true}
                          placeholder="暂无注册地址信息"
                          allowClear
                        />
                      </Form.Item>

                      <Form.Item
                        label="注册电话"
                        name="vatTel"
                        className={`ant-row halfGrid ${
                          invoiceData?.billingHighLight ? 'highLight' : ''
                        }`}
                      >
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
                        className={`ant-row halfGrid ${
                          invoiceData?.billingHighLight ? 'highLight' : ''
                        }`}
                      >
                        <Input
                          bordered={false}
                          readOnly={true}
                          placeholder="暂无银行账号信息"
                          allowClear
                        />
                      </Form.Item>
                      {/*<Form.Item
											  label="银行账号"
											  name="vatCompanyName"
											  className={'hide'}
												style={{display: 'none'}}
											>
											  <Input
											    bordered={false}
											    readOnly={true}
											    placeholder="暂无银行账号信息"
											    allowClear
											  />
											</Form.Item>*/}
                    </div>
                  </div>

                  <div className="content5 box">
                    <div id="five" className="title">
                      发票寄送信息
                      {invoiceData?.invoiceHighLight && (
                        <span className="tipsInTitle">
                          （红色高亮字段名表示该数据与原始值不一致)
                        </span>
                      )}
                    </div>
                    <div className="ant-advanced-form four-gridCol">
                      <Form.Item
                        label="发票收件地址"
                        className={`twoGrid minLabel ${
                          invoiceData?.invoiceHighLight ? 'highLight' : ''
                        }`}
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
                      <Form.Item
                        label="发票收件地区"
                        name="invoiceReceiveRegion"
                        className={invoiceData?.invoiceHighLight ? 'highLight' : ''}
                      >
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>

                      <Form.Item
                        label="发票收件邮编"
                        name="invoiceZip"
                        className={`minLabel ${invoiceData?.invoiceHighLight ? 'highLight' : ''}`}
                      >
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item
                        label="发票收件人"
                        name="invoiceReceiver"
                        className={invoiceData?.invoiceHighLight ? 'highLight' : ''}
                      >
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item
                        label="发票收件手机"
                        name="invoiceMobile"
                        className={`minLabel ${invoiceData?.invoiceHighLight ? 'highLight' : ''}`}
                      >
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item
                        label="发票收件固话"
                        name="invoiceTel"
                        className={`minLabel ${invoiceData?.invoiceHighLight ? 'highLight' : ''}`}
                      >
                        <Input bordered={false} readOnly={true} />
                      </Form.Item>
                      <Form.Item
                        label="发票收件邮箱"
                        name="invoiceEmail"
                        className={`minLabel ${invoiceData?.invoiceHighLight ? 'highLight' : ''}`}
                      >
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
                      附件
                    </div>
                    <div className="ant-advanced-form">
                      <div className="detail_table_mod" style={{ width: '70%' }}>
                        <ProTable<any>
                          columns={attachment_columns}
                          bordered
                          request={async (params) => {
                            const searchParams: any = {
                              pageNumber: params.current,
                              pageSize: params.pageSize,
                              sourceId: sourceId,
                              sourceType: 40,
                              subType: 20,
                            };
                            // const res = await getFilesList(searchParams);
                            // if (res.errCode === 200) {
                            //   return Promise.resolve({
                            //     data: res.data?.list,
                            //     total: res.data?.total,
                            //     current: 1,
                            //     pageSize: 10,
                            //     success: true,
                            //   });
                            // } else {
                            //   message.error(res.errMsg, 3);
                            //   return Promise.resolve([]);
                            // }
                          }}
                          rowKey={() => Math.random()}
                          search={false}
                          toolBarRender={false}
                          tableAlertRender={false}
                          defaultSize="small"
                          scroll={{ x: 100 }}
                          pagination={{
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            // showTotal: total => `共有 ${total} 条数据`,
                            showTotal: (total, range) =>
                              `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </AnchorBox>
              </div>
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
                  basicData={basicData}
                />
              </Modal>

              <div className="ant-modal-footer drewerFooterNoBorderButtonAbsCol">
                <Button
                  className="light_blue"
                  type="primary"
                  htmlType="submit"
                  loading={confirmLoading}
                >
                  保 存
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
            </Form>
          </section>
        </TabPane>
        <TabPane tab="MDM赋码信息" key="2">
          <AchangeToB id={id} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MasterDataDetail;
