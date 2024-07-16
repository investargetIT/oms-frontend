import AchangeToB from '@/pages/SalesOrder/components/AchangeToB';
import {
  financeRefuseOrder,
  financeReleaseOrders,
  financeSaveReleaseRemark,
  getOrderDateList,
  getOrderDetail,
  goodsDetails,
  isThirtyRepeat,
  queryRefResource,
} from '@/services/SalesOrder';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Input, message, Modal, Select, Tabs } from 'antd';
import moment from 'moment';
import { forwardRef, useEffect, useRef, useState } from 'react';
import AnchorBox from './Anchor/index';
import Option from '@/pages/SalesAfter/components/Option';
import './style.css';
const OrderDetail = ({ tableRowData, id, tableReload, approveModalHandleOk }: any, ref: any) => {
  const { TabPane } = Tabs;
  const yClient = 300;
  const [form] = Form.useForm();
  const detailRef: any = useRef<ActionType>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const [basicData, setBasicData]: any = useState({});
  const [receiveData, setReceiveData]: any = useState({});
  const [invoiceData, setInvoiceData]: any = useState({});
  const [allData, setAllData]: any = useState({});
  useEffect(() => {
    const fn = async () => {
      const res = await getOrderDetail(id);
      if (res.errCode === 200) {
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
        setAllData(defauleParams);
        if (salesOrderRespVo) {
          setBasicData(salesOrderRespVo);
        }
        if (salesOrderReceiverRespVo) {
          setReceiveData(salesOrderReceiverRespVo);
        }
        if (salesOrderInvoiceInfoRespVo) {
          setInvoiceData(salesOrderInvoiceInfoRespVo);
        }
      }
      console.log(basicData, receiveData, invoiceData);
    };
    fn();
  }, [id]);
  const data = tableRowData;
  const dateFormat = 'YYYY-MM-DD';
  const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

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

  if (invoiceData.followMerchandise == 1) {
    data.invoiceWithGoods = '是';
  } else {
    data.invoiceWithGoods = '否';
  }

  if (tableRowData?.tariff >= 0 && tableRowData?.tariff != '') {
    data.tariff = tableRowData?.tariff;
  } else {
    data.tariff = '0.00';
  }
  if (tableRowData?.goodsAmount >= 0 && tableRowData?.goodsAmount != '') {
    data.goodsAmount = tableRowData?.goodsAmount;
  } else {
    data.goodsAmount = '0.00';
  }
  if (tableRowData?.freight >= 0 && tableRowData?.freight != '') {
    data.freight = tableRowData?.freight;
  } else {
    data.freight = '0.00';
  }
  if (tableRowData?.interFreight >= 0 && tableRowData?.interFreight != '') {
    data.interFreight = tableRowData?.interFreight;
  } else {
    data.interFreight = '0.00';
  }
  if (tableRowData?.totalFreight >= 0 && tableRowData?.totalFreight != '') {
    data.totalFreight = tableRowData?.totalFreight;
  } else {
    data.totalFreight = '0.00';
  }
  if (tableRowData?.amount >= 0 && tableRowData?.amount != '') {
    data.amount = tableRowData?.amount;
  } else {
    data.amount = '0.00';
  }
  if (tableRowData?.netPrice >= 0 && tableRowData?.netPrice != '') {
    data.netPrice = tableRowData?.netPrice;
  } else {
    data.netPrice = '0.00';
  }
  if (!tableRowData?.province || tableRowData?.province == undefined) {
    data.province = '';
  } else {
    data.province = tableRowData?.province + '-';
  }

  if (!tableRowData?.city || tableRowData?.city == undefined) {
    data.city = '';
  } else {
    data.city = tableRowData?.city + '-';
  }

  if (!tableRowData?.district || tableRowData?.district == undefined) {
    data.district = '';
  } else {
    data.district = tableRowData?.district;
  }
  data.receivingArea = data.province + data.city + data.district;

  const [isReleaseOrderModalVisible, setIsReleaseOrderModalVisible] = useState(false);
  const [ReleaseReasonData, setReleaseReasonData] = useState('');

  function showReleaseOrderModal() {
    setIsReleaseOrderModalVisible(true);
  }

  function ReleaseOrderModalClose() {
    setIsReleaseOrderModalVisible(false);
  }
  const [PaymentTermData, setPaymentTermData]: any = useState([]);
  const [PaymentMethodData, setPaymentMethodData]: any = useState([]);
  const [getPaymentTermCode, setPaymentTermCode]: any = useState({
    value: tableRowData?.paymentTermsCode,
    label: tableRowData?.paymentTerms,
  });
  const [getPaymentMethodCode, setPaymentMethodCode]: any = useState({
    value: tableRowData?.paymentMethodCode,
    label: tableRowData?.paymentMethod,
  });
  const [getPaymentTermsName, setPaymentTermsName] = useState(tableRowData?.paymentTerms);
  const [getPaymentMethodName, setPaymentMethodName] = useState(tableRowData?.paymentMethod);

  const [getPaymentTerms, setPaymentTerms] = useState(tableRowData?.paymentTermsCode);
  const [getPaymentMethod, setPaymentMethod] = useState(tableRowData?.paymentMethodCode);

  const customer_code = tableRowData?.customerCode;
  const [thirtyRepeatStatus, setThirtyRepeatStatus]: any = useState(false);
  useEffect(() => {
    getOrderDateList({ type: 'releaseOrderReason' }).then((res: any) => {
      if (res.errCode === 200) {
        setReleaseReasonData(res.data.dataList);
      }
    });

    getOrderDateList({ type: 'paymentTerm' }).then((res: any) => {
      if (res.errCode === 200) {
        setPaymentTermData(res.data?.dataList);
      }
    });

    getOrderDateList({ type: 'paymentTerm', code: getPaymentTerms }).then((res: any) => {
      if (res.errCode === 200) {
        setPaymentMethodData(res.data?.dataList[0]?.children);
      }
    });

    const isThirtyRepeat_params = {
      orderNo: id,
      customerCode: customer_code,
      amount: tableRowData?.amount,
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
      paymentTermsCode: getPaymentTermCode,
      paymentMethodCode: getPaymentMethodCode,
    });
  }, []);
  // 附件
  const appendixColumn: ProColumns<any>[] = [
    { title: '文件名称', dataIndex: 'resourceName', width: 250 },
    { title: '文件类型', dataIndex: 'fileType', width: 120 },
    { title: '创建者', dataIndex: 'createUser', width: 120 },
    { title: '创建时间', valueType: 'dateTime', dataIndex: 'createTime', width: 120 },
    {
      title: '操作',
      dataIndex: 'quotCode',
      width: 120,
      render: (_, record) => {
        if (record.resourceUrl != '') {
          return <Option record={record} key={record.resourceUrl} />;
        }
      },
    },
  ];
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

  const onReject = () => {
    setConfirmLoading(true);
    financeRefuseOrder(id)
      .then((res: any) => {
        console.log(res);
        if (res.errCode === 200) {
          setConfirmLoading(false);
          message.success('该订单拒绝放单操作成功！', 3);
          approveModalHandleOk();
          tableReload();
        } else {
          message.error(res.errMsg);
          setConfirmLoading(false);
        }
      })
      .finally(() => {
        return;
      });
    console.log(ref);
  };

  const onSaveRemark = () => {
    setConfirmLoading(true);
    const formData = form.getFieldsValue(true);
    const saveData = {
      orderNo: id,
      releaseRemark: formData.releaseRemark,
      paymentTerm: {
        paymentTerm: getPaymentTerms,
        paymentMethod: getPaymentMethod,
        paymentTermsName: getPaymentTermsName,
        paymentMethodName: getPaymentMethodName,
      },
    };
    financeSaveReleaseRemark(saveData)
      .then((res: any) => {
        console.log(res);
        if (res.errCode === 200) {
          setConfirmLoading(false);
          message.success('保存成功', 3);
          approveModalHandleOk();
          tableReload();
        } else {
          message.error(res.errMsg);
          setConfirmLoading(false);
        }
      })
      .finally(() => {
        return;
      });
  };

  const onReleaseOrder = () => {
    setConfirmLoading(true);
    form
      .validateFields(['releaseReason'])
      .then(() => {
        const formData = form.getFieldsValue(true);
        const saveData = {
          orderNos: [id],
          releaseReason: formData.releaseReason,
          releaseRemark: formData.releaseRemark,
          paymentTerm: {
            paymentTerm: getPaymentTerms,
            paymentMethod: getPaymentMethod,
            paymentTermsName: getPaymentTermsName,
            paymentMethodName: getPaymentMethodName,
          },
        };
        console.log(saveData);
        financeReleaseOrders(saveData).then((res: any) => {
          console.log(res);
          if (res.errCode === 200) {
            setConfirmLoading(false);
            message.success('订单放单成功！', 3);
            ReleaseOrderModalClose();
            approveModalHandleOk();
            tableReload();
          } else {
            message.error(res.errMsg);
            setConfirmLoading(false);
          }
        });
      })
      .catch((error) => {
        message.error(error, 3);
        setConfirmLoading(false);
      })
      .finally(() => {
        return;
      });
  };

  const { confirm } = Modal;
  function showConfirm() {
    confirm({
      wrapClassName: 'confirmModal',
      title: '您确认拒绝放单该订单?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        onReject();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

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
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 80,
      fixed: 'left',
    },
    {
      title: '产品名称',
      dataIndex: 'productNameConcatStr',
      width: 350,
    },

    {
      title: '预计发货日期',
      dataIndex: 'deliveryDate',
      valueType: 'date',
      width: 150,
    },
    { title: '物料码', dataIndex: 'stockSkuCode', width: 100 },
    { title: '销售包装单位数量', dataIndex: 'unitQuantity', width: 150 },
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
    },
    {
      title: '成交价含税',
      dataIndex: 'salesPrice',
      width: 100,
      render(text, record) {
        if (record.salesPrice >= 0 && record.salesPrice != '') {
          return Number(record.salesPrice).toFixed(2);
        } else {
          return '0.00';
        }
      },
    },
    {
      title: '成交价未税',
      dataIndex: 'salesPriceNet',
      width: 100,
      render(text, record) {
        if (record.salesPriceNet >= 0 && record.salesPriceNet != '') {
          return Number(record.salesPriceNet).toFixed(2);
        } else {
          return '0.00';
        }
      },
    },
    { title: '数量', dataIndex: 'qty', width: 80 },

    {
      title: '小计含税',
      dataIndex: 'totalAmount',
      width: 100,
      render(text, record) {
        if (record.totalAmount >= 0 && record.totalAmount != '') {
          return Number(record.totalAmount).toFixed(2);
        } else {
          return '0.00';
        }
      },
    },
    {
      title: '小计未税',
      dataIndex: 'totalAmountNet',
      width: 100,
      render(text, record) {
        if (record.totalAmountNet >= 0 && record.totalAmountNet != '') {
          return Number(record.totalAmountNet).toFixed(2);
        } else {
          return '0.00';
        }
      },
    },
    {
      title: '是否JV',
      width: 100,
      render(_, record) {
        return <span>{record.jv ? '是' : '否'}</span>;
      },
    },
    { title: 'JV公司', dataIndex: 'jvCompanyName', width: 260 },
    { title: '客户物料号', dataIndex: 'customerSku', width: 100 },
    { title: '客户需求行号', dataIndex: 'poItemNo', width: 100 },
  ];
  columns.forEach((item: any) => {
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
            <Form
              className="has-gridForm"
              name="form"
              labelWrap
              form={form}
              autoComplete="off"
              initialValues={{
                releaseRemark: data.releaseRemark,
                paymentTermsCode: getPaymentTermCode,
                paymentMethodCode: getPaymentMethodCode,
                paymentTermsName: getPaymentTermsName,
                paymentMethodName: getPaymentMethodName,
              }}
            >
              <AnchorBox>
                <div className="content1 box">
                  <div id="one" className="title">
                    基本信息
                  </div>
                  <div className="ant-advanced-form four-gridCol">
                    <Form.Item label="客户代号">
                      <span className="form-span">{data?.customerCode}</span>
                    </Form.Item>
                    <Form.Item label="客户名称">
                      <span className="form-span">{data?.customerName}</span>
                    </Form.Item>
                    <Form.Item label="R3联系人名称">
                      <span className="form-span">{data?.contactsName}</span>
                    </Form.Item>
                    <Form.Item label="R3联系人代号">
                      <span className="form-span">{data?.contactsCode}</span>
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
                    <Form.Item label="订单渠道">
                      <span className="form-span">{data?.channel}</span>
                    </Form.Item>
                    <Form.Item label="客户采购单号">
                      <span className="form-span">{data?.customerPurchaseNo}</span>
                    </Form.Item>
                    <Form.Item label="要求发货日期">
                      <span className="form-span">
                        {moment(tableRowData?.sendDate).format(dateFormat)}
                      </span>
                    </Form.Item>
                    <Form.Item label="一次性发货">
                      <span className="form-span">{data?.partialShipment}</span>
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
                        &yen; {Number(tableRowData?.freight).toFixed(2)}
                      </span>
                    </Form.Item>
                    <Form.Item label="国际运费">
                      <span className="form-span">
                        &yen; {Number(tableRowData?.interFreight).toFixed(2)}
                      </span>
                    </Form.Item>
                    <Form.Item label="关税">
                      <span className="form-span">
                        &yen; {Number(tableRowData?.tariff).toFixed(2)}
                      </span>
                    </Form.Item>
                    <Form.Item label="含税总金额">
                      <span className="form-span">
                        &yen; {Number(tableRowData?.amount).toFixed(2)}
                      </span>
                    </Form.Item>
                    <Form.Item label="货品总计含税">
                      <span className="form-span">
                        &yen; {Number(tableRowData?.goodsAmount).toFixed(2)}
                      </span>
                    </Form.Item>
                    <Form.Item label="折扣总计含税">
                      <span className="form-span">
                        &yen; {Number(tableRowData?.discountAmount).toFixed(2)}
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
                      {basicData?.validToDate && (
                        <span className="form-span">
                          {moment(basicData?.validToDate).format(dateFormat)}
                        </span>
                      )}
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
                    <Form.Item label="智能柜设备(非物料)">
                      <span className="form-span">
                        {basicData?.intelDevice === 0 ? '否' : '是'}
                      </span>
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

                    <Form.Item label="CSR备注" className="fullLineGrid">
                      <span className="form-span wordBreak">{data?.csrRemark}</span>
                    </Form.Item>
                    {basicData?.arOverdue && (
                      <Form.Item label="客户超期说明" className="fullLineGrid lableRed">
                        {/* <span style={{color: 'red'}}>客户超期说明:</span> */}
                        <span className="form-span wordBreak">{basicData?.arOverdue}</span>
                      </Form.Item>
                    )}
                  </div>
                </div>
                <div className="content2 box">
                  <div id="two" className="title">
                    收货信息
                  </div>
                  <div className="ant-advanced-form four-gridCol">
                    <Form.Item label="收货人地址" className="twoGrid">
                      <span className="form-span">{receiveData?.receiverAddress}</span>
                    </Form.Item>
                    <Form.Item label="收货地区">
                      <span className="form-span">{receiveData?.receivingArea}</span>
                    </Form.Item>
                    <Form.Item label="邮编">
                      <span className="form-span">{receiveData?.shipZip}</span>
                    </Form.Item>
                    <Form.Item label="收货人姓名">
                      <span className="form-span">{receiveData?.receiverName}</span>
                    </Form.Item>
                    <Form.Item label="收货人手机">
                      <span className="form-span">{receiveData?.receiverMobile}</span>
                    </Form.Item>
                    <Form.Item label="收货人固话">
                      <span className="form-span">{receiveData?.receiverPhone}</span>
                    </Form.Item>
                    <Form.Item label="收货人邮箱">
                      <span className="form-span">{receiveData?.consigneeEmail}</span>
                    </Form.Item>
                    <Form.Item label="是否保税区">
                      <span className="form-span">{receiveData?.toBond ? '是' : '否'}</span>
                    </Form.Item>
                    <Form.Item label="特殊编码">
                      <span className="form-span">{basicData?.specialCode}</span>
                    </Form.Item>
                  </div>
                </div>
                <div className="content3 box">
                  <div id="three" className="title">
                    配送及支付
                  </div>
                  <div className="ant-advanced-form four-gridCol">
                    <Form.Item label="交货方式">
                      <span className="form-span">{data?.shipType}</span>
                    </Form.Item>
                    {/*<Form.Item label="支付条件">
                      <span className="form-span">{data?.paymentTerms}</span>
                    </Form.Item>

                    <Form.Item label="支付方式" className="twoGrid">
                      <span className="form-span">{data?.paymentMethod}</span>
                    </Form.Item>*/}
                    <Form.Item
                      className={getPaymentTermCode?.value === '1' ? 'highLight' : ''}
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
                  <div className="ant-advanced-form four-gridCol">
                    <Form.Item label="发票类型">
                      <span className="form-span">{invoiceData?.invoiceType}</span>
                    </Form.Item>
                    <Form.Item label="开票抬头" className="twoGrid">
                      <span className="form-span">{invoiceData?.invoiceTitle}</span>
                    </Form.Item>
                    <Form.Item label="纳税人识别号" className="minLabel" name="vatTaxNo">
                      <span className="form-span">{invoiceData?.vatTaxNo}</span>
                    </Form.Item>

                    <Form.Item label="注册地址">
                      <span className="form-span">{invoiceData?.vatAddress}</span>
                    </Form.Item>

                    <Form.Item label="注册电话">
                      <span className="form-span">{invoiceData?.vatPhone}</span>
                    </Form.Item>

                    <Form.Item label="开户银行">
                      <span className="form-span">{invoiceData?.vatBankName}</span>
                    </Form.Item>

                    <Form.Item label="银行账户">
                      <span className="form-span">{invoiceData?.vatBankNo}</span>
                    </Form.Item>
                  </div>
                </div>
                <div className="content5 box">
                  <div id="five" className="title">
                    发票寄送信息
                  </div>
                  <div className="ant-advanced-form four-gridCol">
                    <Form.Item label="发票收件地址" className="twoGrid minLabel">
                      <span className="form-span">{invoiceData?.invoiceAddress}</span>
                    </Form.Item>
                    <Form.Item label="发票收件地区">
                      <span className="form-span">{invoiceData?.invoiceReceiveRegion}</span>
                    </Form.Item>
                    <Form.Item label="发票收件邮编" className="minLabel">
                      <span className="form-span">{invoiceData?.invoiceZip}</span>
                    </Form.Item>
                    <Form.Item label="发票收件人">
                      <span className="form-span">{invoiceData?.invoiceReceiver}</span>
                    </Form.Item>
                    <Form.Item label="发票收件手机" className="minLabel">
                      <span className="form-span">{invoiceData?.invoiceMobile}</span>
                    </Form.Item>
                    <Form.Item label="发票收件固话" className="minLabel">
                      <span className="form-span">{invoiceData?.invoiceTel}</span>
                    </Form.Item>

                    <Form.Item label="发票收件邮箱" className="minLabel">
                      <span className="form-span">{invoiceData?.invoiceEmail}</span>
                    </Form.Item>
                    <Form.Item label="发票随货" className="minLabel">
                      <span className="form-span">
                        {invoiceData?.followMerchandise ? '是' : '否'}
                      </span>
                    </Form.Item>
                  </div>
                </div>
                <div className="content6 box">
                  <div id="six" className="title">
                    商品明细
                  </div>
                  <div className="ant-advanced-form" style={{ marginTop: '20px' }}>
                    <table className="amountTable" cellSpacing="0" data-content="币种：CNY">
                      <tbody>
                        <tr>
                          <th>货品金额合计:</th>
                          <td>{Number(tableRowData?.goodsAmount).toFixed(2)}</td>
                          <th>头运费:</th>
                          <td>{Number(tableRowData?.freight).toFixed(2)}</td>
                          <th>国际运费:</th>
                          <td>{Number(tableRowData?.interFreight).toFixed(2)}</td>
                          <th>关税:</th>
                          <td>{Number(data?.tariff).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <th>运费总计:</th>
                          <td>{Number(data?.totalFreight).toFixed(2)}</td>
                          <th>总计金额含税:</th>
                          <td>{Number(data?.amount).toFixed(2)}</td>
                          <th>总计金额未税:</th>
                          <td>{Number(data?.netPrice).toFixed(2)}</td>
                          <th>使用返利金额:</th>
                          <td>{Number(data?.rebate).toFixed(2)}</td>
                          {/*<th>优惠券金额:</th>
												<td>0.00</td>*/}
                        </tr>
                      </tbody>
                    </table>

                    <div className="detail_table_mod">
                      <ProTable<any>
                        columns={columns}
                        request={async (params: any) => {
                          const searchParams: any = {};
                          searchParams.pageNumber = params.current;
                          searchParams.pageSize = params.pageSize;
                          searchParams.orderNo = id;
                          const res = await goodsDetails(searchParams);
                          res.data?.list.forEach((e: any, i: number) => {
                            //? 在表格数据的每一条里面加一个标识，然后用这个标识找到对应要编辑的那一项
                            e.index = i;
                          });

                          if (res.errCode === 200) {
                            return Promise.resolve({
                              data: res.data?.list,
                              total: res.data?.total,
                              current: 1,
                              pageSize: 10,
                              success: true,
                            });
                          } else {
                            message.error(res.errMsg);
                            return Promise.resolve([]);
                          }
                        }}
                        rowKey="index"
                        search={false}
                        toolBarRender={false}
                        tableAlertRender={false}
                        defaultSize="small"
                        scroll={{ x: 100, y: yClient }}
                        bordered
                        actionRef={detailRef}
                        size="small"
                        pagination={{
                          defaultPageSize: 10,
                          showSizeChanger: true,
                          pageSizeOptions: ['10', '20', '50', '100'],
                          showTotal: (total, range) =>
                            `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                          onShowSizeChange: (current, pageSize) =>
                            onShowSizeChange(current, pageSize),
                        }}
                        className="selectedTable"
                      />
                    </div>
                  </div>
                </div>
                <div className="content7 box">
                  <div id="seven" className="title">
                    放单备注
                  </div>
                  <div style={{ display: 'flex', width: '98%' }}>
                    <span
                      style={{
                        fontSize: '13px',
                        display: 'inline-block',
                        width: '100px',
                        marginLeft: '10px',
                      }}
                    >
                      放单备注：
                    </span>
                    <Form.Item name="releaseRemark" style={{ width: '100%' }}>
                      <Input.TextArea
                        showCount
                        maxLength={255}
                        placeholder="请输入放单备注"
                        allowClear
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="content8 box">
                  <div id="eight" className="title">
                    附件
                  </div>
                  <div style={{ display: 'flex', width: '98%' }}>
                    <div className="detail_table_mod" style={{ marginTop: '10px', width: '70%' }}>
                      <ProTable<any>
                        columns={appendixColumn}
                        request={async (params) => {
                          const searchParams: any = {
                            pageNumber: params.current,
                            pageSize: params.pageSize,
                            sourceId: data.sid,
                            sourceType: 40,
                          };
                          const res = await queryRefResource(searchParams);
                          if (res.errCode === 200) {
                            return Promise.resolve({
                              data: res.data?.list,
                              total: res.data?.total,
                              success: true,
                            });
                          } else {
                            message.error(res.errMsg);
                            return Promise.resolve([]);
                          }
                        }}
                        rowKey={() => Math.random()}
                        bordered
                        search={false}
                        toolBarRender={false}
                        tableAlertRender={false}
                        defaultSize="small"
                        scroll={{ x: 0 }}
                        options={{ reload: false, density: false }}
                      />
                    </div>
                  </div>
                </div>
              </AnchorBox>

              <div className="ant-modal-footer drewerFooterNoBorderButtonAbsCol">
                <Button
                  danger
                  className="light_danger"
                  key="back"
                  loading={confirmLoading}
                  onClick={showConfirm}
                >
                  拒绝
                </Button>
                <Button
                  className="light_blue"
                  type="primary"
                  htmlType="submit"
                  key="save"
                  loading={confirmLoading}
                  onClick={onSaveRemark}
                >
                  保存备注
                </Button>
                <Button
                  type="primary"
                  htmlType="button"
                  key="letgo"
                  loading={confirmLoading}
                  onClick={showReleaseOrderModal}
                >
                  放单
                </Button>
                <Button className="specialBtn close" key="close" onClick={approveModalHandleOk}>
                  关闭
                </Button>
              </div>
              <Modal
                className="noTopFootBorder"
                forceRender
                width={500}
                zIndex={1001}
                title="放单"
                visible={isReleaseOrderModalVisible}
                destroyOnClose={true}
                onCancel={ReleaseOrderModalClose}
                onOk={onReject}
                footer={[]}
              >
                <div className="releaseReasonModal" style={{ margin: 40, marginTop: 20 }}>
                  <Form.Item
                    label="放单原因"
                    name="releaseReason"
                    hasFeedback
                    rules={[{ required: true, message: '请选择放单原因!' }]}
                  >
                    <Select placeholder="请选择放单原因">
                      {ReleaseReasonData &&
                        ReleaseReasonData.map((item: any) => (
                          <Select.Option key={item.key} value={item.value}>
                            {item.value}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>

                  <Form.Item label="放单备注" name="releaseRemark">
                    <Input.TextArea
                      showCount
                      maxLength={255}
                      placeholder="请输入放单备注"
                      allowClear
                    />
                  </Form.Item>
                </div>
                <div className="ant-modal-footer">
                  <Button htmlType="button" onClick={ReleaseOrderModalClose}>
                    关 闭
                  </Button>
                  <Button
                    type="primary"
                    htmlType="button"
                    loading={confirmLoading}
                    onClick={onReleaseOrder}
                  >
                    确认放单
                  </Button>
                </div>
              </Modal>
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
export default forwardRef(OrderDetail);
