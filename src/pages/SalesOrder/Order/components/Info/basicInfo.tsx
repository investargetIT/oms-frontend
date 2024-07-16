import {
  goodsDetails,
  orderDetail,
  updateCustomerPo,
  queryRefResource,
  xlsx,
  saveRefResource,
} from '@/services/SalesOrder';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Input, message, Spin } from 'antd';
import moment from 'moment';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import MyAnchor from '../Anchor/index';
import Option from '@/pages/SalesAfter/components/Option';
import './style.less';
import UploadForm from '@/pages/SalesOrder/components/UploadForm';
import SkuDeliveryView from '@/pages/SalesOrder/components/SkuDeliveryView';
import TableCom from '@/pages/components/TableCom/Index';

const BasicInfo = ({ id, row }: any, Ref: any) => {
  const { setInitialState } = useModel('@@initialState');
  const dateFormat = 'YYYY-MM-DD';
  const dateFormat2 = 'YYYY-MM-DD HH:mm:ss';
  const [load, setLoad] = useState(false);
  const [currentPage4, setCurrentPage4] = useState(1);
  const [currentPageSize4, setCurrentPageSize4] = useState(10);
  const [tableRowData, setTableRowData]: any = useState({});
  const [receiveInfo, setReceiveInfo]: any = useState({});
  const [invoiceInfo, setInvoiceInfo]: any = useState({});
  const [showBtn, setShowBtn] = useState(false);
  const [loadXls, setLoadXls] = useState(false);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [isUpload, setIsUpload] = useState<any>(false); //追加附件
  const ref = useRef<ActionType>();
  const ref2 = useRef<ActionType>();
  const { initialState }: any = useModel('@@initialState');
  const { userRemark, csrRemark } = initialState;
  function reloadAllTable() {
    ref?.current?.reload();
    ref2?.current?.reload();
  }
  useEffect(() => {
    const fn = async () => {
      setLoad(true);
      const res = await orderDetail(id);
      const {
        data: {
          salesOrderRespVo,
          salesOrderReceiverRespVo,
          salesOrderInvoiceInfoRespVo,
          stationDisplay,
          customerPo,
        },
      } = res;
      setInitialState((s) => ({
        //?进入页面的时候清空一下反显的备注
        ...s,
        userRemark: salesOrderRespVo?.userRemark,
        csrRemark: salesOrderRespVo?.csrRemark,
      }));
      setTableRowData(salesOrderRespVo);
      setReceiveInfo(salesOrderReceiverRespVo);
      setInvoiceInfo(salesOrderInvoiceInfoRespVo);
      setShowBtn(stationDisplay); //?设置下载直发送单的显示还是隐藏
      setLoad(false);
      setIsShowEdit(customerPo);
      reloadAllTable();
    };
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  function onShowSizeChange4(current: any, pageSize: any) {
    setCurrentPage4(current);
    setCurrentPageSize4(pageSize);
  }
  function inverteData() {
    //   更新用户备注之后数据同步
  }
  const loadList = async (val: any) => {
    const resourceVOList: any = [];
    val.forEach((e: any) => {
      resourceVOList.push({
        resourceName: e.resourceName,
        resourceUrl: e.resourceUrl,
        fileType: '追加附件',
      });
    });
    const params = {
      sourceId: tableRowData?.sid,
      sourceType: 40, //待定
      resourceVOList,
    };
    const resSave = await saveRefResource(params);
    // 刷接口
    if (resSave.errCode === 200) {
      ref2?.current?.reload();
      setIsUpload(false);
    }
  };
  const download = () => {
    setLoadXls(true);
    xlsx(id)
      .then((res) => {
        setLoadXls(false);
        const blob = new Blob([res], { type: 'application/xls;chartset=UTF-8;' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${id}.xls`;
        link.click();
        message.success('下载订单成功');
      })
      .catch((err) => {
        setLoadXls(false);
        console.log(err, 'err');
      });
  };
  const changeCustomerSku = async (customerSku: any, record: any, poItemNo: any) => {
    const params = {
      orderNo: id,
      orderLineId: record.orderLineId,
      customerSku,
      poItemNo,
    };
    const res = await updateCustomerPo([params]);
    if (res.errCode == 200) {
      message.success('修改成功');
      ref?.current?.reload();
    } else {
      message.error('失败' + res.errMsg);
    }
  };

  // 商品明细
  const infoColumn: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage4 - 1) * currentPageSize4 + index + 1}</span>;
      },
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 120,
      fixed: 'left',
    },
    { title: '数量', dataIndex: 'qty', width: 100 },
    { title: '销售单位', dataIndex: 'salesUomCode', width: 100 },
    {
      title: '需求数量',
      dataIndex: 'reqQty',
      width: 100,
      render: (_, record: any) => {
        return tableRowData?.channel?.includes('API') ? record?.reqQty || '-' : '-';
      },
    },
    { title: '客户单位', dataIndex: 'customerUnit', width: 100 },
    { title: '物料码', dataIndex: 'stockSkuCode', width: 100 },
    { title: '销售包装单位数量', dataIndex: 'unitQuantity', width: 150 },
    { title: '面价', dataIndex: 'listPrice', width: 100 },
    { title: '成交价含税', dataIndex: 'salesPrice', width: 100 },
    { title: '成交价未税', dataIndex: 'salesPriceNet', width: 100 },
    { title: '小计含税', dataIndex: 'totalAmount', width: 100 },
    { title: '小计未税', dataIndex: 'totalAmountNet', width: 100 },
    { title: '小计折扣', dataIndex: 'totalDiscount', width: 100 },
    { title: '产品名称', dataIndex: 'productNameConcatStr', width: 260 },
    {
      title: '是否JV',
      width: 100,
      render(_, record) {
        return <span>{record.jv ? '是' : '否'}</span>;
      },
    },
    { title: 'JV公司', dataIndex: 'jvCompanyName', width: 260 },
    { title: '品牌', dataIndex: 'brandName', width: 180 },
    { title: '制造商型号', dataIndex: 'mfgSku', width: 100 },
    { title: '供应商型号', dataIndex: 'supplierSku', width: 100 },
    { title: '物理单位', dataIndex: 'phyUomCode', width: 100 },
    { title: '交货周期（天）', dataIndex: 'leadTime', width: 100 },
    // {
    //   title: '是否可退换货',
    //   dataIndex: 'noReturn',
    //   width: 100,
    //   render(_, record) {
    //     return <span>{record.noReturn ? '不可退换' : '可退换'}</span>;
    //   },
    // },
    // {
    //   title: '是否可退货',
    //   dataIndex: 'supplierReturn',
    //   render: (_, record: any) =>
    //     record?.supplierReturn == 0 ? '不可退货' : record?.supplierReturn == 1 ? '可退货' : '-',
    //   width: 100,
    // },
    // {
    //   title: '是否可换货',
    //   dataIndex: 'supplierExchange',
    //   render: (_, record: any) =>
    //     record.supplierExchange == 0 ? '不可换货' : record?.supplierExchange == 1 ? '可换货' : '-',
    //   width: 100,
    // },
    {
      title: '是否直送',
      dataIndex: 'dropShipFlag',
      width: 100,
      render(_, record) {
        return <span>{record.dropShipFlag == 'true' ? '是' : '否'}</span>;
      },
    },
    { title: 'SKU类型', dataIndex: 'skuType', width: 100 },
    { title: '运费', dataIndex: 'freight', width: 100 },
    { title: '国际运费', dataIndex: 'interFreight', width: 100 },
    { title: '关税', dataIndex: 'tariff', width: 100 },
    {
      title: '客户物料号',
      dataIndex: 'customerSku',
      width: 100,
      render(_, record) {
        if (isShowEdit) {
          return (
            <Input
              defaultValue={record.customerSku}
              onBlur={(e: any) => changeCustomerSku(e.target.value, record, record.poItemNo)}
            />
          );
        } else {
          return <span>{record.customerSku}</span>;
        }
      },
    },
    {
      title: '客户需求行号',
      dataIndex: 'poItemNo',
      width: 100,
      render(_, record) {
        if (isShowEdit) {
          return (
            <Input
              defaultValue={record.poItemNo}
              onBlur={(e: any) => changeCustomerSku(record.customerSku, record, e.target.value)}
            />
          );
        } else {
          return <span>{record.poItemNo}</span>;
        }
      },
    },
    { title: '发货仓库', dataIndex: 'wareCode', width: 100 },
    { title: '发货仓库名称', dataIndex: 'wareName', width: 100 },
    // { title: '货物起运点', dataIndex: 'storageLocation', width: 100 },
    // { title: '货物起运点名称', dataIndex: 'storageLocationName', width: 100 },
    { title: '预计发货日期', dataIndex: 'deliveryDate', width: 100 },
    { title: '客户期望交期', dataIndex: 'expectedDate', width: 100 },
    {
      title: '上海仓',
      dataIndex: 'markAppointSupplier',
      width: 120,
      render: (_, record: any) => {
        return record.markAppointSupplier ? 'Y' : 'N';
      },
    },
  ];
  infoColumn.forEach((item: any) => (item.ellipsis = true));
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
      // render(_, record) {
      //   return (
      //     <Button
      //       type="link"
      //       onClick={() => window.open(`${record.resourceUrl}?token=${Cookies.get('ssoToken')}`)}
      //     >
      //       下载
      //     </Button>
      //   );
      // },
      render: (_, record) => {
        if (record.resourceUrl != '') {
          return <Option record={record} key={record.resourceUrl} />;
        }
      },
    },
  ];

  useImperativeHandle(Ref, () => ({
    inverteData,
    addUpload: () => {
      setIsUpload(true);
    },
  }));

  const getPageLoad = (val: any) => {
    setLoad(val);
  };
  
  return (
    <div>
      <Spin spinning={load}>
        <div
          id="saleOrderDetailInfoDrawer"
          className="innerDrawerTabsContent saleOrderDetailInfoDrawer"
        >
          {/* <Button
        style={{ zIndex: 9999999, right: '100px', top: '16px', position: 'absolute' }}
        type="primary"
       onClick={() => setIsUpload(true)}
      >
        追加附件{' '}
      </Button> */}
          <section className="drawerTabsContent">
            <MyAnchor>
              <Form className="has-gridForm" labelWrap>
                <h4 className="formTitle" id="one">
                  基本信息
                </h4>
                <div className="ant-advanced-form four-gridCol">
                  <Form.Item label="客户代号">
                    <span className="form-span">{tableRowData?.customerCode}</span>
                  </Form.Item>
                  <Form.Item label="客户名称">
                    <span className="form-span">{tableRowData?.customerName}</span>
                  </Form.Item>
                  <Form.Item label="R3联系人名称">
                    <span className="form-span">{tableRowData?.contactsName}</span>
                  </Form.Item>
                  <Form.Item label="R3联系人代号">
                    <span className="form-span">{tableRowData?.contactsCode}</span>
                  </Form.Item>
                  <Form.Item label="所属公司">
                    <span className="form-span">{tableRowData?.companyName}</span>
                  </Form.Item>
                  <Form.Item label="商机信息">
                    <span className="form-span">{tableRowData?.oppoValue}</span>
                  </Form.Item>
                  <Form.Item label="主销售">
                    <span className="form-span">{tableRowData?.salesName}</span>
                  </Form.Item>
                  <Form.Item label="创建人">
                    <span className="form-span">{tableRowData?.createName}</span>
                  </Form.Item>
                  <Form.Item label="渠道">
                    <span className="form-span">{tableRowData?.channel}</span>
                  </Form.Item>
                  <Form.Item label="客户采购单号">
                    <span className="form-span">{tableRowData?.customerPurchaseNo}</span>
                  </Form.Item>
                  <Form.Item label="要求发货日期">
                    <span className="form-span">{tableRowData?.sendDate}</span>
                  </Form.Item>
                  <Form.Item label="一次性发货">
                    <span className="form-span">{tableRowData?.partialShipment ? '是' : '否'}</span>
                  </Form.Item>
                  <Form.Item label="采购单位名称">
                    <span className="form-span">{tableRowData?.purchaseName}</span>
                  </Form.Item>
                  <Form.Item label="采购单位客户号">
                    <span className="form-span">{tableRowData?.purchaseCode}</span>
                  </Form.Item>
                  <Form.Item label="采购单位主销售">
                    <span className="form-span">{tableRowData?.purchaseSalesName}</span>
                  </Form.Item>
                  <Form.Item label="下单人姓名">
                    <span className="form-span">{tableRowData?.purchaseAccount}</span>
                  </Form.Item>
                  <Form.Item label="下单人电话">
                    <span className="form-span">{tableRowData?.purchaseTel}</span>
                  </Form.Item>
                  <Form.Item label="运费总计">
                    <span className="form-span">
                      &yen; {Number(tableRowData?.totalFreight).toFixed(2)}
                    </span>
                  </Form.Item>
                  <Form.Item label="国际运费">
                    <span className="form-span">&yen; {tableRowData?.interFreight}</span>
                  </Form.Item>
                  <Form.Item label="关税">
                    <span className="form-span">&yen; {tableRowData?.tariff}</span>
                  </Form.Item>
                  <Form.Item label="总计金额含税">
                    <span className="form-span">
                      &yen; {Number(tableRowData?.amount).toFixed(2)}
                    </span>
                  </Form.Item>
                  <Form.Item label="货品金额含税">
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
                    <span className="form-span">{tableRowData?.relationOrderNo}</span>
                  </Form.Item>
                  <Form.Item label="网站优惠券号">
                    <span className="form-span">{tableRowData?.couponCode}</span>
                  </Form.Item>
                  <Form.Item label="订单创建时间">
                    <span className="form-span">
                      {moment(tableRowData?.createTime).format(dateFormat2)}
                    </span>
                  </Form.Item>
                  <Form.Item label="订单有效期至">
                    <span className="form-span">
                      {moment(tableRowData?.validToDate).format(dateFormat)}
                    </span>
                  </Form.Item>
                  <Form.Item label="VIP级别">
                    <span className="form-span">{tableRowData?.isVip}</span>
                  </Form.Item>
                  <Form.Item label="外部订单号">
                    <span className="form-span">{tableRowData?.ouOrderNo}</span>
                  </Form.Item>
                  <Form.Item label="所属集团">
                    <span className="form-span">{tableRowData?.groupCustomerName}</span>
                  </Form.Item>
                  <Form.Item label="集团客户号">
                    <span className="form-span">{tableRowData?.groupCustomerAccount}</span>
                  </Form.Item>
                  <Form.Item label="智能柜设备(非物料)">
                    <span className="form-span">
                      {tableRowData?.intelDevice === 0 ? '否' : '是'}
                    </span>
                  </Form.Item>
                  <Form.Item label="客户计价方式">
                    <span className="form-span">
                      {tableRowData?.pricingMethod === 1
                        ? '含税模式'
                        : tableRowData?.pricingMethod === 2
                        ? '未税模式-2位精度'
                        : tableRowData?.pricingMethod === 3
                        ? '未税模式-4位精度'
                        : '--'}
                    </span>
                  </Form.Item>
                  <Form.Item label="用户备注" className="fullLineGrid">
                    <span className="form-span">{userRemark || tableRowData?.userRemark}</span>
                  </Form.Item>
                  <Form.Item label="付款状态">
                    <span className="form-span">{tableRowData?.payStatus}</span>
                  </Form.Item>
                  <Form.Item label="付款时间">
                    <span className="form-span">{tableRowData?.payTime}</span>
                  </Form.Item>
                  <Form.Item label="客户期望交期">
                    <span className="form-span">{tableRowData?.expectedDate}</span>
                  </Form.Item>
                  <Form.Item label="CSR备注" className="fullLineGrid">
                    <span className="form-span wordBreak">
                      {csrRemark || tableRowData?.csrRemark}
                    </span>
                  </Form.Item>
                </div>
                <h4 className="formTitle" id="two">
                  收货信息
                </h4>
                <div className="ant-advanced-form four-gridCol">
                  <Form.Item label="收件人地址" className="twoGrid minLabel">
                    <span className="form-span">{receiveInfo?.receiverAddress}</span>
                  </Form.Item>
                  <Form.Item label="收货地区">
                    <span className="form-span">{receiveInfo?.receivingArea}</span>
                  </Form.Item>
                  <Form.Item label="收货人邮编">
                    <span className="form-span">{receiveInfo?.shipZip}</span>
                  </Form.Item>
                  <Form.Item label="收货人姓名">
                    <span className="form-span">{receiveInfo?.receiverName}</span>
                  </Form.Item>
                  <Form.Item label="收货人手机">
                    <span className="form-span">{receiveInfo?.receiverMobile}</span>
                  </Form.Item>
                  <Form.Item label="固定电话">
                    <span className="form-span">{receiveInfo?.receiverPhone}</span>
                  </Form.Item>
                  {/* <Form.Item label="分机号">
            <span className="form-span">{receiveInfo?.extensionNumber}</span>
          </Form.Item> */}
                  <Form.Item label="是否保税区">
                    <span className="form-span">{receiveInfo?.toBond ? '是' : '否'}</span>
                  </Form.Item>
                  <Form.Item label="特殊编码">
                    <span className="form-span">{tableRowData?.specialCode}</span>
                  </Form.Item>
                </div>
                <h4 className="formTitle" id="three">
                  配送及支付方式信息
                  <a className="anchor" href="#section-3" />
                </h4>
                <div className="ant-advanced-form four-gridCol">
                  <Form.Item label="交货方式">
                    <span className="form-span">{tableRowData?.shipType}</span>
                  </Form.Item>
                  <Form.Item label="支付条件">
                    <span className="form-span">{tableRowData?.paymentTerms}</span>
                  </Form.Item>
                  <Form.Item label="支付方式">
                    <span className="form-span">{tableRowData?.paymentMethod}</span>
                  </Form.Item>
                </div>

                <h4 className="formTitle" id="four">
                  开票信息
                </h4>
                <div className="ant-advanced-form four-gridCol">
                  <Form.Item label="发票类型">
                    <span className="form-span">{invoiceInfo?.invoiceType}</span>
                  </Form.Item>
                  <Form.Item label="开票抬头">
                    <span className="form-span">{invoiceInfo?.invoiceTitle}</span>
                  </Form.Item>
                  <Form.Item label="纳税人识别号">
                    <span className="form-span">{invoiceInfo?.vatTaxNo}</span>
                  </Form.Item>
                  <Form.Item label="注册地址">
                    <span className="form-span">{invoiceInfo?.vatAddress}</span>
                  </Form.Item>
                  <Form.Item label="注册电话">
                    <span className="form-span">{invoiceInfo?.vatPhone}</span>
                  </Form.Item>
                  {/* <Form.Item label="注册电话分机">
            <span className="form-span">{invoiceInfo?.vatTelExt}</span>
          </Form.Item> */}
                  <Form.Item label="开户银行">
                    <span className="form-span">{invoiceInfo?.vatBankName}</span>
                  </Form.Item>
                  <Form.Item label="银行账号">
                    <span className="form-span">{invoiceInfo?.vatBankNo}</span>
                  </Form.Item>
                </div>
                <h4 className="formTitle" id="five">
                  发票寄送信息
                </h4>
                <div className="ant-advanced-form four-gridCol">
                  <Form.Item label="发票收件地址" className="twoGrid minLabel">
                    <span className="form-span">{invoiceInfo?.invoiceAddress}</span>
                  </Form.Item>
                  <Form.Item label="发票收件地区" className="minLabel">
                    <span className="form-span">{invoiceInfo?.invoiceReceiveRegion}</span>
                  </Form.Item>
                  <Form.Item label="发票收件邮编" className="minLabel">
                    <span className="form-span">{invoiceInfo?.invoiceZip}</span>
                  </Form.Item>
                  <Form.Item label="发票收件人">
                    <span className="form-span">{invoiceInfo?.invoiceReceiver}</span>
                  </Form.Item>
                  <Form.Item label="发票收件手机" className="minLabel">
                    <span className="form-span">{invoiceInfo?.invoiceMobile}</span>
                  </Form.Item>
                  <Form.Item label="发票收件固话" className="minLabel">
                    <span className="form-span">{invoiceInfo?.invoiceTel}</span>
                  </Form.Item>
                  <Form.Item label="发票收件邮箱" className="minLabel">
                    <span className="form-span" title={invoiceInfo?.invoiceEmail}>
                      {invoiceInfo?.invoiceEmail}
                    </span>
                  </Form.Item>
                  <Form.Item label="发票随货">
                    <span className="form-span">
                      {invoiceInfo?.followMerchandise ? '是' : '否'}
                    </span>
                  </Form.Item>
                </div>
                <h4 className="formTitle" id="six">
                  商品明细
                </h4>

                <div className="ant-advanced-form" style={{ marginTop: '10px' }}>
                  {showBtn && (
                    <Button
                      style={{ marginBottom: '10px', marginRight: '10px' }}
                      onClick={download}
                    >
                      下载直发送货单
                    </Button>
                  )}
                  <SkuDeliveryView orderNo={id} getPageLoad={getPageLoad} />
                  <table className="amountTable" cellSpacing="0" data-content="币种：CNY">
                    <tbody>
                      <tr>
                        <th>货品金额总计:</th>
                        <td>{Number(tableRowData?.goodsAmount).toFixed(2)}</td>
                        <th>头运费:</th>
                        <td>{tableRowData?.freight}</td>
                        <th>国际运费:</th>
                        <td>{tableRowData?.interFreight}</td>
                        <th>关税:</th>
                        <td>{tableRowData?.tariff}</td>
                        <th>运费总计:</th>
                        <td>{tableRowData?.totalFreight}</td>
                      </tr>
                      <tr>
                        <th>总计金额含税:</th>
                        <td>{tableRowData?.amount}</td>
                        <th>总计金额未税:</th>
                        <td>{tableRowData?.netPrice}</td>
                        <th>折扣总价含税:</th>
                        <td>{tableRowData?.discountAmount}</td>
                        <th>使用返利金额:</th>
                        <td>{tableRowData?.rebate}</td>
                        <th>{''}</th>
                        <td>{''}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="detail_table_mod" style={{ marginTop: '10px' }}>
                    <TableCom
                      columnsState={{
                        defaultValue: {
                          markAppointSupplier: {
                            show: false,
                          },
                        },
                      }}
                      columns={infoColumn}
                      rowClassName={(record: any) =>
                        record?.discountInfo?.cspDiscount ? 'red' : 'white'
                      }
                      request={async (params) => {
                        const searchParams: any = {};
                        searchParams.pageNumber = params.current;
                        searchParams.pageSize = params.pageSize;
                        searchParams.orderNo = id;
                        const res = await goodsDetails(searchParams);
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
                      pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showTotal: (total, range) =>
                          `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                        onShowSizeChange: (current, pageSize) =>
                          onShowSizeChange4(current, pageSize),
                      }}
                      rowKey={() => Math.random()}
                      search={false}
                      // toolBarRender={false}
                      tableAlertRender={false}
                      actionRef={ref}
                      defaultSize="small"
                      scroll={{ x: 100 }}
                      options={{ reload: false, density: false }}
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
                  </div>
                </div>
                <h4 className="formTitle" id="seven">
                  附件
                </h4>
                <div className="detail_table_mod" style={{ marginTop: '10px', width: '70%' }}>
                  <ProTable<any>
                    columns={appendixColumn}
                    request={async (params) => {
                      const searchParams: any = {
                        pageNumber: params.current,
                        pageSize: params.pageSize,
                        sourceId: row.sid,
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
                    actionRef={ref2}
                    defaultSize="small"
                    scroll={{ x: 0 }}
                    options={{ reload: false, density: false }}
                  />
                </div>
              </Form>
            </MyAnchor>
          </section>
        </div>
      </Spin>
      {loadXls && (
        <div className="loader-inner ball-pulse">
          <div />
          <div />
          <div />
        </div>
      )}
      <UploadForm visible={isUpload} getList={loadList} maxCount={100} />
    </div>
  );
};

export default forwardRef(BasicInfo);
