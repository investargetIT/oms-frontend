import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Space, DatePicker, Drawer, Tag, Select, message } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
// import UploadList from './components/UploadList';
import ApproveOrderDetail from './OrderDetail';
import { DownOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';
import { getOrderList, getOrderDateList, saveRefResource } from '@/services/SalesOrder/index';
import UploadForm from '@/pages/SalesOrder/components/UploadForm';
import { colLimit, getByKeys } from '@/services';
import './index.less';

const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { RangePicker } = DatePicker;
  const ref: any = useRef<ActionType>();
  const [form] = Form.useForm();
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const [isApproveDrawerVisible, setIsApproveDrawerVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [id, setId] = useState('');
  const [tableRowData, setTableRowData] = useState({});
  const [type, setType] = useState('');
  const [status, setStatus] = useState('等待CSR审核');
  const [yClient, setYClient] = useState(900);
  const [isUpload, setIsUpload]: any = useState(false); //?控制上传组件的显示隐藏
  const [Record, setRecord]: any = useState(false);
  const [fold, setFold] = useState(false);
  function UpDown() {
    setFold(!fold);
  }
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

  const approveDrawerClose = () => {
    // setConfirmLoading(true);
    // setTimeout(() => {
    //   setConfirmLoading(false);
    //   setIsApproveDrawerVisible(false);
    //   message.success('申请提交成功', 3);
    // }, 2000);
    setIsApproveDrawerVisible(false);
  };
  function tableReload() {
    ref.current.reload();
  }
  const drawerWidth = window.innerWidth;
  // const key = new Date().getTime();

  const loadList = async (val: any) => {
    // console.log(val);
    // if (props.recall) {
    //   props.recall(val);
    // }
    const resourceVOList: any = [];
    val.forEach((e: any) => {
      resourceVOList.push({
        resourceName: e.resourceName,
        resourceUrl: e.resourceUrl,
        fileType: 'po附件',
      });
    });
    const params = {
      sourceId: Record.sid,
      sourceType: 40,
      subType: 20,
      resourceVOList,
    };
    const res = await saveRefResource(params);
    console.log(res);
    setIsUpload(false);
    ref.current.reload();
  };

  const [statusList, setStatusList] = useState<any>([]);
  useEffect(() => {
    // 业务类型list
    getByKeys({ list: ['businessTypeEnum'] }).then((res: any) => {
      if (res?.errCode === 200) {
        if (res?.data[0] == null) return;
        setStatusList(
          res?.data?.map((io: any) => {
            return io.enums.map((ic: any) => ({
              ...ic,
              key: ic.code,
              value: ic.name,
            }));
          }),
        );
      }
    });
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
      width: 160,
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
            setTableRowData(record);
            setType(record.category);
            setIsApproveDrawerVisible(true);
          }}
        >
          审核
        </Button>,
        <Button
          size="small"
          key={'上传PO附件'}
          type="link"
          onClick={() => {
            setId(record.orderNo);
            setIsUpload(true);
            setRecord(record);
          }}
        >
          上传PO附件
        </Button>,
      ],
      fixed: 'left',
    },
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      width: 90,
      fixed: 'left',
      // sorter: (a, b) => (a.orderNo - b.orderNo ? 1 : -1),
      sorter: (a, b) => a.orderNo - b.orderNo,
    },
    {
      title: '业务类型',
      width: 150,
      dataIndex: 'businessTypeStr',
      sorter: (a, b) => (a.businessTypeStr - b.businessTypeStr ? 1 : -1),
    },
    // {
    //   title: '销售人员',
    //   dataIndex: 'salesName',
    //   width: 150,
    //   // fixed: 'left',
    //   // sorter: (a, b) => (a.salesName - b.salesName ? 1 : -1),
    //   sorter: (a, b) => {
    //     const aData = a.salesName || '-';
    //     const bData = b.salesName || '-';
    //     return aData.localeCompare(bData);
    //   },
    // },
    {
      title: '主销售',
      width: 150,
      dataIndex: 'salesName',
      sorter: (a, b) => a.salesName.localeCompare(b.salesName, 'zh'),
    },
    {
      title: 'CSR备注',
      dataIndex: 'csrRemark',
      width: 150,
      // fixed: 'left',
      // sorter: (a, b) => (a.csrRemark - b.csrRemark ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.csrRemark || '-';
        const bData = b.csrRemark || '-';
        return aData.localeCompare(bData);
      },
    },
    {
      title: '订单类型',
      dataIndex: 'category',
      width: 150,
      // fixed: 'left',
      // sorter: (a, b) => (a.category - b.category ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.category || '-';
        const bData = b.category || '-';
        return aData.localeCompare(bData);
      },
    },
    {
      title: '订单渠道',
      dataIndex: 'channel',
      width: 150,
      // sorter: (a, b) => (a.channel - b.channel ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.channel || '-';
        const bData = b.channel || '-';
        return aData.localeCompare(bData);
      },
    },
    {
      title: '有无附件',
      width: 150,
      dataIndex: 'attached',
      render(text, record) {
        if (record.attached) {
          return <span style={{ color: '#52C41A' }}>有</span>;
        } else {
          return <span style={{ color: '#FA541C' }}>无</span>;
        }
      },
      sorter: (a, b) => a.attached - b.attached,
    },
    {
      title: '客户代号',
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
      // sorter:(a,b)=>a.customerName.localeCompare(b.customerName),
      sorter: (a, b) => {
        const aData = a.customerName || '-';
        const bData = b.customerName || '-';
        return aData.localeCompare(bData);
      },
    },
    {
      title: '所属公司',
      dataIndex: 'companyName',
      width: 180,
      // sorter: (a, b) => (a.companyName - b.companyName ? 1 : -1),
      // sorter: (a, b) => a.companyName.localeCompare(b.companyName),
      sorter: (a, b) => {
        const aData = a.companyName || '-';
        const bData = b.companyName || '-';
        return aData.localeCompare(bData);
      },
    },
    {
      title: 'R3联系人',
      dataIndex: 'contactsName',
      width: 120,
      // sorter: (a, b) => (a.contactsName - b.contactsName ? 1 : -1),
      // sorter: (a, b) => a.contactsName.localeCompare(b.contactsName),
      sorter: (a, b) => {
        const aData = a.contactsName || '-';
        const bData = b.contactsName || '-';
        return aData.localeCompare(bData);
      },
    },
    {
      title: '用户邮箱',
      dataIndex: 'contactEmail',
      width: 120,
      // sorter: (a, b) => (a.contactEmail - b.contactEmail ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.contactEmail || '-';
        const bData = b.contactEmail || '-';
        return aData.localeCompare(bData);
      },
    },
    {
      title: '最后修改时间',
      valueType: 'dateTime',
      width: 150,
      dataIndex: 'updateTime',
      // sorter: (a, b) => (a.updateTime - b.updateTime ? 1 : -1),
      sorter: (a, b) => {
        const aTime = a.updateTime || moment();
        const bTime = b.updateTime || moment();
        const aData = new Date(aTime).getTime();
        const bData = new Date(bTime).getTime();
        return aData - bData;
      },
    },
    {
      title: '客户采购单号',
      width: 150,
      dataIndex: 'customerPurchaseNo',
      // sorter: (a, b) => (a.customerPurchaseNo - b.customerPurchaseNo ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.customerPurchaseNo || '-';
        const bData = b.customerPurchaseNo || '-';
        return aData.localeCompare(bData);
      },
    },
    {
      title: '头运费',
      width: 150,
      dataIndex: 'freight',
      render(text, record) {
        if (record.freight >= 0 && record.freight != '') {
          return Number(record.freight).toFixed(2);
        } else {
          return '0.00';
        }
      },
      // sorter: (a, b) => (a.freight - b.freight ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.freight || '0';
        const bData = b.freight || '0';
        return aData - bData;
      },
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
      // sorter: (a, b) => (a.interFreight - b.interFreight ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.interFreight || '0';
        const bData = b.interFreight || '0';
        return aData - bData;
      },
    },
    {
      title: '总运费',
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
      sorter: (a, b) => {
        const aData = a.totalFreight || '0';
        const bData = b.totalFreight || '0';
        return aData - bData;
      },
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
      // sorter: (a, b) => (a.tariff - b.tariff ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.tariff || '0';
        const bData = b.tariff || '0';
        return aData - bData;
      },
    },
    {
      title: '运费是否调整过',
      width: 150,
      dataIndex: 'adjustFreight',
      render(text, record) {
        if (!record.adjustFreight) {
          return '否';
        } else {
          return '是';
        }
      },
      // sorter: (a, b) => (a.adjustFreight - b.adjustFreight),
      sorter: (a, b) => {
        const aData = a.adjustFreight || false;
        const bData = b.adjustFreight || false;
        return aData - bData;
      },
    },
    {
      title: '客户要求发货日期',
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
      // sorter: (a, b) => (a.shipType - b.shipType ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.shipType || '-';
        const bData = b.shipType || '-';
        return aData.localeCompare(bData);
      },
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
      // sorter: (a, b) => (a.paymentTerms - b.paymentTerms ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.paymentTerms || '-';
        const bData = b.paymentTerms || '-';
        return aData.localeCompare(bData);
      },
    },
    {
      title: '支付方式',
      width: 150,
      dataIndex: 'paymentMethod',
      // sorter: (a, b) => (a.paymentMethod - b.paymentMethod ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.paymentMethod || '-';
        const bData = b.paymentMethod || '-';
        return aData.localeCompare(bData);
      },
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
      // sorter: (a, b) => (a.receivingArea - b.receivingArea ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.receivingArea || '-';
        const bData = b.receivingArea || '-';
        return aData.localeCompare(bData);
      },
    },
    {
      title: '收货人姓名',
      width: 150,
      dataIndex: 'receiverName',
      // sorter: (a, b) => (a.receiverName - b.receiverName ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.receiverName || '-';
        const bData = b.receiverName || '-';
        return aData.localeCompare(bData);
      },
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
      // sorter: (a, b) => (a.receiverAddress - b.receiverAddress ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.receiverAddress || '-';
        const bData = b.receiverAddress || '-';
        return aData.localeCompare(bData);
      },
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
      // sorter: (a, b) => (a.invoiceType - b.invoiceType ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.invoiceType || '-';
        const bData = b.invoiceType || '-';
        return aData.localeCompare(bData);
      },
    },
    {
      title: '发票收件人',
      width: 150,
      dataIndex: 'invoiceReceiver',
      // sorter: (a, b) => (a.invoiceReceiver - b.invoiceReceiver ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.invoiceReceiver || '-';
        const bData = b.invoiceReceiver || '-';
        return aData.localeCompare(bData);
      },
    },
    {
      title: '发票收件地址',
      width: 150,
      dataIndex: 'invoiceAddress',
      sorter: (a, b) => {
        const aData = a.invoiceAddress || '-';
        const bData = b.invoiceAddress || '-';
        return aData.localeCompare(bData);
      },
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
        if (!record.followMerchandise || record.followMerchandise == 0) {
          return '否';
        } else if (record.followMerchandise == 1) {
          return <span style={{ color: '#389e0d' }}>是</span>;
        }
      },
      sorter: (a, b) => a.followMerchandise - b.followMerchandise,
      // sorter: (a, b) => {
      //   const aData = a.followMerchandise || 0;
      //   const bData = b.followMerchandise || 0;
      //   return aData.localeCompare(bData);
      // },
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
      // sorter: (a, b) => (a.amount - b.amount ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.amount || '0';
        const bData = b.amount || '0';
        return aData - bData;
      },
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
      // sorter: (a, b) => (a.goodsAmount - b.goodsAmount ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.goodsAmount || '0';
        const bData = b.goodsAmount || '0';
        return aData - bData;
      },
    },
    // {
    //   title: '整单折扣',
    //   width: 150,
    //   dataIndex: 'discountAmount',
    //   render(text, record) {
    //     if (Math.abs(record.goodsAmount) >= 0 && record.discountAmount != '') {
    //       return Number(record.discountAmount).toFixed(2);
    //     } else {
    //       return '0.00';
    //     }
    //   },

    //   // sorter: (a, b) => (a.discountAmount - b.discountAmount ? 1 : -1),
    //   sorter: (a, b) => {
    //     const aData = a.discountAmount || '0';
    //     const bData = b.discountAmount || '0';
    //     return aData - bData;
    //   },
    // },
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
      // sorter: (a, b) => (a.discountAmount - b.discountAmount ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.discountAmount || '0';
        const bData = b.discountAmount || '0';
        return aData - bData;
      },
    },
    {
      title: '创建时间',
      width: 150,
      valueType: 'dateTime',
      dataIndex: 'createTime',
      // sorter: (a, b) => (a.createTime - b.createTime ? 1 : -1),
      sorter: (a, b) => {
        const aTime = a.createTime || moment();
        const bTime = b.createTime || moment();
        const aData = new Date(aTime).getTime();
        const bData = new Date(bTime).getTime();
        return aData - bData;
      },
    },
    {
      title: '创建人',
      width: 150,
      dataIndex: 'createName',
      // sorter: (a, b) => (a.createName - b.createName ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.createName || '-';
        const bData = b.createName || '-';
        return aData.localeCompare(bData);
      },
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
      title: '最后修改人',
      width: 150,
      dataIndex: 'updateName',
      // sorter: (a, b) => (a.updateName - b.updateName ? 1 : -1),
      sorter: (a, b) => {
        const aData = a.updateName || '-';
        const bData = b.updateName || '-';
        return aData.localeCompare(bData);
      },
    },
  ];

  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  // const yClient = window.innerHeight - 350;
  const [orderTypeList, setOrderTypeList]: any = useState([]);
  const [orderChannelList, setOrderChannelList] = useState([]);

  useEffect(() => {
    getOrderDateList({ type: 'orderType' }).then((res: any) => {
      if (res.errCode === 200) {
        setOrderTypeList(res.data.dataList);
      }
    });
    getOrderDateList({ type: 'orderChannel' }).then((res: any) => {
      if (res.errCode === 200) {
        setOrderChannelList(res.data.dataList);
      }
    });

    //设置select初始值
    form.setFieldsValue({
      category: orderTypeList && orderTypeList[0] ? orderTypeList[0].key : '',
      channel: orderChannelList && orderChannelList[0] ? orderChannelList[0].key : '',
    });
  }, []);
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 320);
  }, [initialState?.windowInnerHeight]);

  const [ifHasOilWarning, setIfHasOilWarning]: any = useState(false);
  const [intelDevice, setIntelDevice]: any = useState(false);

  const getIfHasOilWarning = (value: any) => {
    setIfHasOilWarning(value);
  };
  const getIntelDevice = (value: any) => {
    setIntelDevice(value);
  };
  return (
    <div className="omsAntStyle" id="csrAproveOrder">
      <div className="form-content-search topSearchCol">
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
          <Form.Item name="contactEmail" label="用户邮箱">
            <Input placeholder="请输入用户邮箱" allowClear />
          </Form.Item>
          {!fold && (
            <>
              <Form.Item name="salesName" label="主销售">
                <Input placeholder="请输入主销售" allowClear />
              </Form.Item>
              <Form.Item name="category" label="订单类型">
                <Select placeholder="请选择订单类型">
                  <Select.Option value="">全部</Select.Option>
                  {orderTypeList &&
                    orderTypeList.map((item: any) => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item name="channel" label="渠道">
                <Select placeholder="请选择订单渠道">
                  <Select.Option value="">全部</Select.Option>
                  {orderChannelList &&
                    orderChannelList.map((item: any) => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                </Select>
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
              <Form.Item name="createTime" label="OMS创建时间" className={'minLabel dataPickerCol'}>
                <RangePicker format="YYYY-MM-DD" allowClear={false} inputReadOnly={true} />
              </Form.Item>
            </>
          )}
          <Form.Item />
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
              <Button
                key={'展开'}
                icon={fold ? <DownOutlined /> : <UpOutlined />}
                onClick={() => {
                  UpDown();
                }}
              >
                {fold ? '展开' : '收起'}
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
          // searchParams.createTimeStart =
          //   moment(searchParams.createTime[0]).format('YYYY-MM-DD') + ' ' + '00:00:00';
          // searchParams.createTimeEnd =
          //   moment(searchParams.createTime[1]).format('YYYY-MM-DD') + ' ' + '23:59:59';

          searchParams.createTimeStart = moment(searchParams.createTime[0]).format('YYYY-MM-DD');
          searchParams.createTimeEnd = moment(searchParams.createTime[1]).format('YYYY-MM-DD');

          searchParams.orderStatus = [22];
          searchParams.pageNumber = params.current;
          searchParams.pageSize = params.pageSize;
          const res = await getOrderList(searchParams);
          if (res.errCode === 200) {
            return Promise.resolve({
              data: res.data?.list,
              total: res.data?.total,
              current: 1,
              pageSize: 20,
              success: true,
            });
          } else {
            message.error(res.errMsg, 3);
            return Promise.resolve([]);
          }
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
        title={
          <>
            <span key={'订单编号'}>订单编号: {id}</span>
            <Tag key={'订单状态'} color="gold" style={{ marginLeft: 10 }}>
              {status}
            </Tag>
            {intelDevice && isApproveDrawerVisible && (
              <Tag key={'智能柜设备(非物料)'} color="#802A2A" style={{ marginLeft: 5 }}>
                {'智能柜设备(非物料)'}
              </Tag>
            )}
            {ifHasOilWarning && isApproveDrawerVisible && (
              <Tag key={'成品油警告'} color="#f50" style={{ marginLeft: 5 }}>
                {'成品油警告'}
              </Tag>
            )}
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
            </p>
          </>
        }
        visible={isApproveDrawerVisible}
        onClose={approveDrawerClose}
        destroyOnClose={true}
        extra={
          <Space>
            <Button onClick={approveDrawerClose}>关闭</Button>
          </Space>
        }
        footer={[
          // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
          <Button key="back" onClick={approveDrawerClose}>
            关闭
          </Button>,
        ]}
      >
        <ApproveOrderDetail
          id={id}
          key={'order detail'}
          orderTypeList={orderTypeList}
          sourceId={tableRowData?.sid}
          approveDrawerClose={approveDrawerClose}
          tableReload={tableReload}
          getIfHasOilWarning={getIfHasOilWarning}
          getIntelDevice={getIntelDevice}
        />
      </Drawer>
      <UploadForm visible={isUpload} getList={loadList} maxCount={100} />
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
