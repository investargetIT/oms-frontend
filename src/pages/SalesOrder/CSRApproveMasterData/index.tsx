import { getOrderList } from '@/services/SalesOrder/index';
import { SearchOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, DatePicker, Drawer, Form, Input, message, Select, Space, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useModel, history } from 'umi';
import MasterDataDetail from './OrderDetail';
import { colLimit, getByKeys } from '@/services';
import './index.less';
const Index: React.FC = () => {
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const { initialState } = useModel('@@initialState');
  const { RangePicker } = DatePicker;
  const ref: any = useRef<ActionType>();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);

  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const approveModalHandleOk = () => {
    setIsModalVisible(false);
  };
  function tableReload() {
    ref.current.reload();
  }

  const drawerWidth = window.innerWidth;
  // const key = new Date().getTime();

  const [id, setId] = useState('');
  const [tableRowData, setTableRowData] = useState();
  const [type, setType] = useState('');
  const [status, setStatus] = useState('等待CSR审核');
  const [yClient, setYClient] = useState(900);

  const [statusList, setStatusList] = useState<any>([]);
  useEffect(() => {
    // 业务类型list
    // getByKeys({ list: ['businessTypeEnum'] }).then((res: any) => {
    //   if (res?.errCode === 200) {
    //     if (res?.data[0] == null) return;
    //     setStatusList(
    //       res?.data?.map((io: any) => {
    //         return io.enums.map((ic: any) => ({
    //           ...ic,
    //           key: ic.code,
    //           value: ic.name,
    //         }));
    //       }),
    //     );
    //   }
    // });
  }, []);

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
      title: '操作',
      width: 70,
      render: (_, record) => [
        <Button
          size="small"
          key={'审核'}
          type="link"
          onClick={() => {
            setId(record.orderNo);
            if (record.orderStatus != '') {
              setStatus(record.orderStatus);
            } else {
              setStatus('等待CSR审核');
            }
            // setStatus(record.orderStatus)
            setType(record.category);
            setTableRowData(record);
            setIsModalVisible(true);
          }}
        >
          {' '}
          审核{' '}
        </Button>,
      ],
      fixed: 'left',
    },
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      width: 90,
      fixed: 'left',
      sorter: (a, b) => a.orderNo - b.orderNo,
      // sorter: (a, b) => (a.orderNo - b.orderNo ? 1 : -1),
    },
    {
      title: '业务类型',
      width: 150,
      dataIndex: 'businessTypeStr',
      sorter: (a, b) => (a.businessTypeStr - b.businessTypeStr ? 1 : -1),
    },
    {
      title: 'CSR备注',
      dataIndex: 'csrRemark',
      width: 150,
      // fixed: 'left',
      sorter: (a, b) => (a.csrRemark - b.csrRemark ? 1 : -1),
    },
    {
      title: '订单类型',
      dataIndex: 'category',
      width: 150,
      // sorter: (a, b) => (a.category - b.category ? 1 : -1),
      sorter: (a, b) => a.category.localeCompare(b.category, 'zh'),
    },
    {
      title: '订单渠道',
      dataIndex: 'channel',
      width: 150,
      render(text, record) {
        if (record.channel) {
          return record.channel;
        } else {
          return '-';
        }
      },
      // sorter: (a, b) => (a.channel - b.channel ? 1 : -1),
      sorter: (a, b) => a.channel.localeCompare(b.channel, 'zh'),
    },
    {
      title: '客户号',
      dataIndex: 'customerCode',
      width: 150,
      // sorter: (a, b) => (a.customerCode - b.customerCode ? 1 : -1),
      sorter: (a, b) => a.customerCode - b.customerCode,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 200,
      // sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
      sorter: (a, b) => a.customerName.localeCompare(b.customerName, 'zh'),
    },
    {
      title: 'R3联系人',
      dataIndex: 'contactsName',
      width: 120,
      sorter: (a, b) => (a.contactsName - b.contactsName ? 1 : -1),
      // sorter: (a, b) => a.contactsName.localeCompare(b.contactsName, 'zh'),
    },
    {
      title: '创建人',
      width: 150,
      dataIndex: 'createName',
      // sorter: (a, b) => (a.createName - b.createName ? 1 : -1),
      sorter: (a, b) => a.createName.localeCompare(b.createName, 'zh'),
    },
    {
      title: '主销售',
      width: 150,
      dataIndex: 'salesName',
      sorter: (a, b) => a.salesName.localeCompare(b.salesName, 'zh'),
    },
    {
      title: '采购单位客户号',
      width: 150,
      dataIndex: 'purchaseCode',
      sorter: (a, b) => a.purchaseCode.localeCompare(b.purchaseCode, 'zh'),
    },
    {
      title: '采购单位名称',
      width: 150,
      dataIndex: 'purchaseName',
      sorter: (a, b) => a.purchaseName.localeCompare(b.purchaseName, 'zh'),
    },
    {
      title: '采购单位主销售',
      width: 150,
      dataIndex: 'purchaseSalesName',
      sorter: (a, b) => a.purchaseSalesName.localeCompare(b.purchaseSalesName, 'zh'),
    },

    {
      title: '最后修改时间',
      valueType: 'dateTime',
      width: 150,
      dataIndex: 'updateTime',
      // sorter: (a, b) => (a.updateTime - b.updateTime ? 1 : -1),
    },
    {
      title: '最后修改人',
      width: 150,
      dataIndex: 'updateName',
      // sorter: (a, b) => (a.updateName - b.updateName ? 1 : -1),
    },
    {
      title: '客户采购单号',
      width: 150,
      dataIndex: 'customerPurchaseNo',
      sorter: (a, b) => (a.customerPurchaseNo - b.customerPurchaseNo ? 1 : -1),
    },
    {
      title: '运费',
      width: 150,
      dataIndex: 'totalFreight',
      render(text, record) {
        if (record.totalFreight >= 0 && record.totalFreight != '') {
          return Number(record.totalFreight).toFixed(2);
        } else {
          return '0.00';
        }
      },
      // sorter: (a, b) => (a.totalFreight - b.totalFreight ? 1 : -1),
      sorter: (a, b) => a.totalFreight - b.totalFreight,
    },
    {
      title: '是否调整过运费',
      width: 150,
      dataIndex: 'adjustFreight',
      render(text, record) {
        if (!record.adjustFreight) {
          return '否';
        } else {
          return '是';
        }
      },
      sorter: (a, b) => (a.adjustFreight - b.adjustFreight ? 1 : -1),
    },
    {
      title: '国际运费',
      width: 150,
      dataIndex: 'interFreight',
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
      width: 150,
      dataIndex: 'tariff',
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
      title: '客户要求发货日',
      valueType: 'date',
      width: 150,
      dataIndex: 'sendDate',
      sorter: (a, b) => (a.sendDate - b.sendDate ? 1 : -1),
    },
    {
      title: '交货方式',
      width: 150,
      dataIndex: 'shipType',
      //   render(text, record) {
      //     if (record.shipType == 10) {
      //       return '送货上门';
      //     } else if (record.shipType == 20) {
      //       return '自提';
      //     } else if (record.shipType == 30) {
      //       return '昆山门店自提';
      //     }
      //   },
      sorter: (a, b) => (a.shipType - b.shipType ? 1 : -1),
    },
    {
      title: '支付条件',
      width: 150,
      dataIndex: 'paymentTerms',
      //   render(text, record) {
      //     if (record.paymentTerms == '01') {
      //       return '在线支付';
      //     } else if (record.paymentTerms == '02') {
      //       return '快钱';
      //     } else if (record.paymentTerms == '03') {
      //       return '货到付款';
      //     } else if (record.paymentTerms == '04') {
      //       return '信用支付';
      //     } else if (record.paymentTerms == '05') {
      //       return '支付宝';
      //     } else if (record.paymentTerms == '06') {
      //       return '预付款';
      //     }
      //   },
      sorter: (a, b) => (a.paymentTerms - b.paymentTerms ? 1 : -1),
    },
    {
      title: '支付方式',
      width: 150,
      dataIndex: 'paymentMethod',
      //   render(text, record) {
      //     if (record.paymentMethod == '0101') {
      //       return '在线支付宝';
      //     } else if (record.paymentMethod == '0102') {
      //       return '在线快钱';
      //     } else if (record.paymentMethod == '0103') {
      //       return '快钱银行直连';
      //     } else if (record.paymentMethod == '0104') {
      //       return '微信支付';
      //     } else if (record.paymentMethod == '0201') {
      //       return '银行转账快钱';
      //     } else if (record.paymentMethod == '0501') {
      //       return 'T-MallApliay';
      //     } else if (record.paymentMethod == '0601') {
      //       return '预付款';
      //     }
      //   },
      sorter: (a, b) => (a.paymentMethod - b.paymentMethod ? 1 : -1),
    },
    {
      title: '收货地区',
      width: 150,
      dataIndex: 'receivingArea',
      render(text, record) {
        let province_html = '',
          city_html = '',
          district_html = '';
        if (record.province) {
          province_html = record.province;
        }
        if (record.city) {
          city_html = record.city;
        }
        if (record.district) {
          district_html = record.district;
        }
        return province_html + ' ' + city_html + ' ' + district_html;
      },
      sorter: (a, b) => (a.receivingArea - b.receivingArea ? 1 : -1),
    },
    {
      title: '收货人姓名',
      width: 150,
      dataIndex: 'receiverName',
      sorter: (a, b) => (a.receiverName - b.receiverName ? 1 : -1),
    },
    {
      title: '收货人手机',
      width: 150,
      dataIndex: 'receiverMobile',
      sorter: (a, b) => (a.receiverMobile - b.receiverMobile ? 1 : -1),
    },
    {
      title: '固话号',
      width: 150,
      dataIndex: 'receiverPhone',
      sorter: (a, b) => (a.receiverPhone - b.receiverPhone ? 1 : -1),
    },
    {
      title: '分机号',
      width: 150,
      dataIndex: 'extensionNumber',
      sorter: (a, b) => (a.extensionNumber - b.extensionNumber ? 1 : -1),
    },
    {
      title: '收货地址',
      width: 150,
      dataIndex: 'receiverAddress',
      sorter: (a, b) => (a.receiverAddress - b.receiverAddress ? 1 : -1),
    },
    {
      title: '收货人邮编',
      width: 150,
      dataIndex: 'shipZip',
      sorter: (a, b) => (a.shipZip - b.shipZip ? 1 : -1),
    },
    {
      title: '发票类型',
      width: 150,
      dataIndex: 'invoiceType',
      //   render(text, record) {
      //     if (record.invoiceType == '01') {
      //       return '增值税专用发票';
      //     } else if (record.invoiceType == '02') {
      //       return '普票';
      //     } else if (record.invoiceType == '04') {
      //       return '不开票';
      //     }
      //   },
      sorter: (a, b) => (a.invoiceType - b.invoiceType ? 1 : -1),
    },
    {
      title: '发票抬头类型',
      width: 150,
      dataIndex: 'invoiceTitleType',
      //   render(text, record) {
      //     if (record.invoiceTitleType == 0) {
      //       return '无Title';
      //     } else if (record.invoiceTitleType == 1) {
      //       return '个人';
      //     } else if (record.invoiceTitleType == 2) {
      //       return '单位';
      //     }
      //   },
      sorter: (a, b) => (a.invoiceTitleType - b.invoiceTitleType ? 1 : -1),
    },
    {
      title: '发票抬头',
      width: 150,
      dataIndex: 'invoiceTitle',
      sorter: (a, b) => (a.invoiceTitle - b.invoiceTitle ? 1 : -1),
    },
    {
      title: '发票-单位名称',
      width: 150,
      dataIndex: 'vatCompanyName',
      sorter: (a, b) => (a.vatCompanyName - b.vatCompanyName ? 1 : -1),
    },
    {
      title: '发票-纳税人识别号',
      width: 180,
      dataIndex: 'vatTaxNo',
      sorter: (a, b) => (a.vatTaxNo - b.vatTaxNo ? 1 : -1),
    },
    {
      title: '发票-注册地址',
      width: 180,
      dataIndex: 'vatAddress',
      sorter: (a, b) => (a.vatAddress - b.vatAddress ? 1 : -1),
    },
    {
      title: '发票-注册电话',
      width: 150,
      dataIndex: 'vatPhone',
      sorter: (a, b) => (a.vatPhone - b.vatPhone ? 1 : -1),
    },
    {
      title: '发票-注册电话分机',
      width: 150,
      dataIndex: 'vatTelExt',
      sorter: (a, b) => (a.vatTelExt - b.vatTelExt ? 1 : -1),
    },
    {
      title: '发票-开户银行',
      width: 150,
      dataIndex: 'vatBankName',
      sorter: (a, b) => (a.vatBankName - b.vatBankName ? 1 : -1),
    },
    {
      title: '发票-银行账户',
      width: 150,
      dataIndex: 'vatBankNo',
      sorter: (a, b) => (a.vatBankNo - b.vatBankNo ? 1 : -1),
    },
    {
      title: '发票收件人',
      width: 150,
      dataIndex: 'invoiceReceiver',
      sorter: (a, b) => (a.invoiceReceiver - b.invoiceReceiver ? 1 : -1),
    },
    {
      title: '发票收件地址',
      width: 150,
      dataIndex: 'invoiceAddress',
      sorter: (a, b) => (a.invoiceAddress - b.invoiceAddress ? 1 : -1),
    },
    {
      title: '发票收件邮编',
      width: 150,
      dataIndex: 'invoiceZip',
      sorter: (a, b) => (a.invoiceZip - b.invoiceZip ? 1 : -1),
    },
    {
      title: '发票收件人-固话',
      width: 150,
      dataIndex: 'invoiceTel',
      sorter: (a, b) => (a.invoiceTel - b.invoiceTel ? 1 : -1),
    },
    {
      title: '发票收件人-手机',
      width: 150,
      dataIndex: 'invoiceMobile',
      sorter: (a, b) => (a.invoiceMobile - b.invoiceMobile ? 1 : -1),
    },
    {
      title: '发票是否随货',
      width: 130,
      dataIndex: 'followMerchandise',
      render(text, record) {
        if (!record.followMerchandise) {
          return '否';
        } else {
          return <span style={{ color: '#52C41A' }}>是</span>;
        }
      },
      sorter: (a, b) => (a.followMerchandise - b.followMerchandise ? 1 : -1),
    },
    {
      title: '是否一次性发货',
      width: 130,
      dataIndex: 'partialShipment',
      render(text, record) {
        if (!record.partialShipment) {
          return '否';
        } else {
          return <span style={{ color: '#52C41A' }}>是</span>;
        }
      },
      sorter: (a, b) => (a.partialShipment - b.partialShipment ? 1 : -1),
    },
    {
      title: '用户备注',
      width: 150,
      dataIndex: 'userRemark',
      sorter: (a, b) => (a.userRemark - b.userRemark ? 1 : -1),
    },
    {
      title: '总计金额含税',
      width: 150,
      dataIndex: 'amount',
      render(text, record) {
        if (record.amount >= 0 && record.amount != '') {
          return Number(record.amount).toFixed(2);
        } else {
          return '0.00';
        }
      },
      sorter: (a, b) => (a.amount - b.amount ? 1 : -1),
    },
    {
      title: '货品总计-含税',
      width: 150,
      dataIndex: 'goodsAmount',
      render(text, record) {
        if (Number(record.goodsAmount) >= 0 && record.goodsAmount != '') {
          return Number(record.goodsAmount).toFixed(2);
        } else {
          return '0.00';
        }
      },
      sorter: (a, b) => (a.goodsAmount - b.goodsAmount ? 1 : -1),
    },
    {
      title: '折扣总计-含税',
      width: 150,
      dataIndex: 'discountAmount',
      render(text, record) {
        if (Math.abs(record.goodsAmount) >= 0 && record.discountAmount != '') {
          return Number(record.discountAmount).toFixed(2);
        } else {
          return '0.00';
        }
      },

      sorter: (a, b) => (a.discountAmount - b.discountAmount ? 1 : -1),
    },
    // {
    //   title: '已用Rebate Pool金额',
    //   width: 150,
    //   dataIndex: 'rebate',
    //   render(text, record) {
    //     if (Number(record.rebate) >= 0 && record.rebate != '') {
    //       return Number(record.rebate).toFixed(2);
    //     } else {
    //       return '0.00';
    //     }
    //   },
    //   sorter: (a, b) => (a.rebate - b.rebate ? 1 : -1),
    // },
    {
      title: '网站促销活动代号',
      width: 150,
      dataIndex: 'discountCode',
      sorter: (a, b) => (a.discountCode - b.discountCode ? 1 : -1),
    },
    {
      title: '网站优惠券代号',
      width: 150,
      dataIndex: 'couponCode',
      sorter: (a, b) => (a.couponCode - b.couponCode ? 1 : -1),
    },
    // {
    //   title: '同步时间',
    //   width: 150,
    //   valueType: 'dateTime',
    //   dataIndex: 'syncTime',
    //   sorter: (a, b) => (a.syncTime - b.syncTime ? 1 : -1),
    // },
    // {
    //   title: 'sap回复时间',
    //   width: 150,
    //   valueType: 'dateTime',
    //   dataIndex: 'sapConfirmTime',
    //   sorter: (a, b) => (a.sapConfirmTime - b.sapConfirmTime ? 1 : -1),
    // },
    // {
    //   title: 'SAP销售订单号',
    //   width: 150,
    //   dataIndex: 'erpOrderNo',
    //   sorter: (a, b) => (a.erpOrderNo - b.erpOrderNo ? 1 : -1),
    // },
    // {
    //   title: '回写源系统订单号时间',
    //   width: 150,
    //   valueType: 'dateTime',
    //   dataIndex: 'notifiedTime',
    //   sorter: (a, b) => (a.notifiedTime - b.notifiedTime ? 1 : -1),
    // },
    {
      title: '承运商代号',
      width: 150,
      dataIndex: 'tplCode',
      sorter: (a, b) => (a.tplCode - b.tplCode ? 1 : -1),
    },
    // {
    //   title: 'SAP信用状态',
    //   width: 150,
    //   dataIndex: 'sapCreditStatus',
    //   sorter: (a, b) => (a.sapCreditStatus - b.sapCreditStatus ? 1 : -1),
    // },
    // {
    //   title: '信用状态',
    //   width: 150,
    //   dataIndex: 'creditStatus',
    //   //   render(text, record) {
    //   //     if (record.creditStatus == 0) {
    //   //       return '';
    //   //     } else if (record.creditStatus == 2) {
    //   //       return '待批准';
    //   //     }
    //   //   },
    //   sorter: (a, b) => (a.creditStatus - b.creditStatus ? 1 : -1),
    // },
    // {
    //   title: '有效期至',
    //   width: 150,
    //   valueType: 'date',
    //   dataIndex: 'quoteValidDate',
    //   sorter: (a, b) => (a.quoteValidDate - b.quoteValidDate ? 1 : -1),
    // },
    {
      title: '创建时间',
      width: 150,
      valueType: 'dateTime',
      dataIndex: 'createTime',
      sorter: (a, b) => (a.createTime - b.createTime ? 1 : -1),
    },
    {
      title: '渠道下单时间',
      width: 150,
      valueType: 'dateTime',
      dataIndex: 'orderTime',
      sorter: (a, b) => (a.orderTime - b.orderTime ? 1 : -1),
    },
  ];

  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  // const yClient = window.innerHeight - 350;
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 320);
  }, [initialState?.windowInnerHeight]);

  return (
    <div className="omsAntStyle CSRApproveStyle" id="omsAntStyle">
      <div className="form-content-search">
        <Form
          layout="inline"
          form={form}
          className="ant-advanced-form"
          initialValues={{
            createTime: [moment().subtract(12, 'month'), moment()],
            businessType: '',
            jvCompanyName: '',
          }}
        >
          <Form.Item name="orderNo" label="订单编号">
            <Input placeholder="请输入订单编号" allowClear />
          </Form.Item>
          <Form.Item name="customerName" label="客户名称">
            <Input placeholder="请输入客户名称" allowClear />
          </Form.Item>
          <Form.Item name="customerCode" label="客户编号">
            <Input placeholder="请输入客户编号" allowClear />
          </Form.Item>
          <Form.Item name="salesName" label="主销售">
            <Input placeholder="请输入主销售" allowClear />
          </Form.Item>

          <Form.Item name="ouOrderNo" label="外部订单号">
            <Input placeholder="请输入订单编号" />
          </Form.Item>
          <Form.Item name="groupCustomerName" label="集团名称">
            <Input placeholder="请输入集团名称" />
          </Form.Item>

          <Form.Item name="purchaseSalesName" label="采购单位主销售">
            <Input placeholder="请输入采购单位主销售" />
          </Form.Item>
          <Form.Item name="purchaseCode" label="采购单位客户号">
            <Input placeholder="请输入采购单位客户号" />
          </Form.Item>
          <Form.Item name="purchaseName" label="采购单位名称">
            <Input placeholder="请输入采购单位名称" />
          </Form.Item>

          <Form.Item name="jvCompanyName" label="jv公司">
            <Input placeholder="请输入jv公司" />
          </Form.Item>
          <Form.Item name="businessType" label="业务类型">
            <Select placeholder="请选择业务类型">
              <Select.Option value="">全部</Select.Option>
              {statusList[0]?.map((item: any) => (
                <Select.Option key={item.key} value={item.key}>
                  {item.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="createTime" label="OMS创建时间" className={'dataPickerCol'}>
            <RangePicker format="YYYY-MM-DD" allowClear={false} inputReadOnly={true} />
          </Form.Item>
          <Form.Item className="btn-search">
            <Space>
              <Button
                key={'查询'}
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => {
                  ref.current?.reload(true);
                  setStartPage(true);
                }}
              >
                查 询
              </Button>
              <Button
                key={'重置'}
                onClick={() => {
                  form.resetFields();
                  setStartPage(true);
                  ref.current?.reload(true);
                }}
              >
                重 置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      <ProTable<any>
        columns={columns}
        columnsState={{
          value: columnsStateMap,
          onChange: (val: any) => {
            colLimit(val, setColumnsStateMap);
          },
          persistenceKey: history.location.pathname,
          persistenceType: 'localStorage',
        }}
        scroll={{ x: 100, y: yClient }}
        bordered
        size="small"
        options={{ reload: false, density: false }}
        // request={(params, sorter, filter) => {
        //   // 表单搜索项会从 params 传入，传递给后端接口。
        //   console.log(form.getFieldsValue(true), params, sorter, filter, '====list testing====');
        //   return Promise.resolve(list);
        // }}
        request={async (params) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const searchParams = form.getFieldsValue(true);
          if (startPage) {
            params.current = 1;
            // params.pageSize = 20;
          }
          console.log(params);
          // searchParams.orderTimeStart =
          //   moment(searchParams.orderTime[0]).format('YYYY-MM-DD') + ' ' + '00:00:00';
          // searchParams.orderTimeEnd =
          //   moment(searchParams.orderTime[1]).format('YYYY-MM-DD') + ' ' + '23:59:59';
          // searchParams.orderTimeStart = moment(searchParams.orderTime[0]).format('YYYY-MM-DD');
          // searchParams.orderTimeEnd = moment(searchParams.orderTime[1]).format('YYYY-MM-DD');
          searchParams.createTimeStart = moment(searchParams.createTime[0]).format('YYYY-MM-DD');
          searchParams.createTimeEnd = moment(searchParams.createTime[1]).format('YYYY-MM-DD');
          searchParams.orderStatus = [20];
          searchParams.pageNumber = params.current;
          searchParams.pageSize = params.pageSize;
          // const res = await getOrderList(searchParams);
          // if (res.errCode === 200) {
          //   return Promise.resolve({
          //     data: res.data?.list,
          //     total: res.data?.total,
          //     current: 1,
          //     pageSize: 20,
          //     success: true,
          //   });
          // } else {
          //   message.error(res.errMsg, 3);
          //   return Promise.resolve([]);
          // }
        }}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          // showTotal: total => `共有 ${total} 条数据`,
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
          showQuickJumper: true,
        }}
        rowKey="orderNo"
        search={false}
        actionRef={ref}
      />
      <Drawer
        className="AnchorWithTopTipDrawer DrawerWithAnchor withAnchorDrawer DrawerContent"
        width={drawerWidth}
        key={'订单详情查看'}
        title={[
          <span key={'订单编号'}>订单编号: {id}</span>,
          <Tag key={'订单状态'} color="gold" style={{ marginLeft: 10 }}>
            {status}
          </Tag>,
          <p
            key={'订单类型'}
            className="tipsP"
            style={{ marginBottom: '-10px', marginTop: 5, color: '#777' }}
            ref={(node) => {
              if (node) {
                node.style.setProperty('font-size', '12px', 'important');
              }
            }}
          >
            订单类型: <strong>{type}</strong>
          </p>,
        ]}
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
        extra={
          <Space>
            <Button key="close" onClick={approveModalHandleOk}>
              关闭
            </Button>
          </Space>
        }
        destroyOnClose={true}
        footer={[
          // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
          <Button key="back" onClick={approveModalHandleOk}>
            关闭
          </Button>,
        ]}
      >
        <MasterDataDetail
          id={id}
          key={'order detail'}
          tableRowData={tableRowData}
          approveModalHandleOk={approveModalHandleOk}
          tableReload={tableReload}
        />
      </Drawer>
    </div>
  );
};
// export default Index;
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <Index />
  </KeepAlive>
);
