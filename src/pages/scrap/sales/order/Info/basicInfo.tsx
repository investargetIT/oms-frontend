import { queryRefResource, xlsx } from '@/services/SalesOrder';
import { queryEandoOrderDetail } from '@/services/afterSales';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, message, Spin } from 'antd';
import moment from 'moment';
import { history } from 'umi';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import MyAnchor from './Anchor/index';
import Option from '@/pages/SalesAfter/components/Option';
import './style.less';

const BasicInfo = ({ id, row, detailDrawerClose }: any, Ref: any) => {
  const dateFormat2 = 'YYYY-MM-DD HH:mm:ss';
  const [load, setLoad] = useState(false);
  const [tableRowData, setTableRowData]: any = useState({});
  const [receiveInfo, setReceiveInfo]: any = useState({});
  const [invoiceInfo, setInvoiceInfo]: any = useState({});
  const [showBtn, setShowBtn] = useState(false);
  const [loadXls, setLoadXls] = useState(false);
  const [DetailTableData, setDetailTableData] = useState();
  const [total, setTotal] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const ref = useRef<ActionType>();
  const ref2 = useRef<ActionType>();
  function reloadAllTable() {
    ref?.current?.reload();
    ref2?.current?.reload();
  }
  useEffect(() => {
    const fn = async () => {
      setLoad(true);
      const res = await queryEandoOrderDetail({ sid: row?.sid });
      setTableRowData(res?.data?.eandoOrderVo);
      setReceiveInfo(res?.data?.receiverInfo);
      setInvoiceInfo(res?.data?.invoiceInfo);
      setShowBtn(res?.data?.stationDisplay); //?设置下载直发送单的显示还是隐藏
      setDetailTableData(res?.data?.pageList?.list);
      setTotal(res?.data?.pageList?.total);
      setLoad(false);
      reloadAllTable();
    };
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function inverteData() {
    //   更新用户备注之后数据同步
  }
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
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 120,
      fixed: 'left',
    },
    { title: '数量', dataIndex: 'eandoQty', width: 100 },
    { title: '销售单位', dataIndex: 'salesUomCode', width: 100 },
    { title: '物料码', dataIndex: 'stockSkuCode', width: 100 },
    { title: '销售包装单位数量', dataIndex: 'unitQuantity', width: 150 },
    { title: '面价', dataIndex: 'listPrice', width: 100 },
    { title: '成交价含税', dataIndex: 'applySalesPrice', width: 100 },
    { title: '成交价未税', dataIndex: 'applySalesPriceNet', width: 100 },
    { title: '小计含税', dataIndex: 'applySalesPriceLnTotal', width: 100 },
    { title: '小计未税', dataIndex: 'applySalesPriceLnTotalNet', width: 100 },
    { title: '小计折扣', dataIndex: 'applyDiscountLnTotal', width: 100 },
    { title: '产品名称', dataIndex: 'productName', width: 260 },
    {
      title: '是否JV',
      width: 100,
      render(_, record) {
        return <span>{record.jvFlag ? '是' : '否'}</span>;
      },
    },
    { title: 'JV公司', dataIndex: 'jvCompanyName', width: 260 },
    { title: '品牌', dataIndex: 'brandName', width: 180 },
    { title: '制造商型号', dataIndex: 'manufacturerNo', width: 100 },
    { title: '供应商型号', dataIndex: 'supplierNo', width: 100 },
    // {
    //   title: function () {
    //     return <span style={{ color: '#f1c6cd' }}>物理单位</span>;
    //   },
    //   dataIndex: 'physicsUnit',
    //   width: 100,
    // },
    // {
    //   title: function () {
    //     return <span style={{ color: '#f1c6cd' }}>交货周期（天）</span>;
    //   },
    //   dataIndex: 'leadTime',
    //   width: 100,
    // },
    // {
    //   title: function () {
    //     return <span style={{ color: '#f1c6cd' }}>不可退换</span>;
    //   },
    //   dataIndex: 'noReturn',
    //   width: 100,
    //   render(_, record) {
    //     return (
    //       <span style={{ color: '#f1c6cd' }}>
    //         {record.noReturn == 'true' ? '不可退换' : '可退换'}
    //       </span>
    //     );
    //   },
    // },
    // {
    //   title: function () {
    //     return <span style={{ color: '#f1c6cd' }}>是否直送</span>;
    //   },
    //   dataIndex: 'dropShipFlag',
    //   width: 100,
    //   render(_, record) {
    //     return (
    //       <span style={{ color: '#f1c6cd' }}>{record.dropShipFlag == 'true' ? '是' : '否'}</span>
    //     );
    //   },
    // },
    // {
    //   title: function () {
    //     return <span style={{ color: '#f1c6cd' }}>SKU类型</span>;
    //   },
    //   dataIndex: 'skuTypeStr',
    //   width: 100,
    // },
    // {
    //   title: function () {
    //     return <span style={{ color: '#f1c6cd' }}>产品业务状态</span>;
    //   },
    //   dataIndex: 'businessStatus',
    //   width: 100,
    // },
    // {
    //   title: function () {
    //     return <span style={{ color: '#f1c6cd' }}>备货类型</span>;
    //   },
    //   dataIndex: 'stockType',
    //   width: 100,
    // },
    { title: '运费', dataIndex: 'freightPrice', width: 100 },
    { title: '国际运费', dataIndex: 'intlFreightPrice', width: 100 },
    { title: '关税', dataIndex: 'tariffPrice', width: 100 },
    { title: '发货仓库', dataIndex: 'wareCode', width: 100 },
    { title: '发货仓库名称', dataIndex: 'wareName', width: 100 },
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
  function onShowSizeChange(current: any, pageSize: any) {
    // queryEandoOrderDetail({ sid: row?.sid, pageNumber: current, pageSize: pageSize }).then(
    //   (res: any) => {
    //     if (res?.errCode === 200) {
    //       setDetailTableData(res?.data?.pageList?.list);
    //       setTotal(res?.data?.pageList?.total);
    //     } else {
    //       message.error(res.errMsg);
    //     }
    //   },
    // );
    // setCurrentPage(current);
    // setCurrentPageSize(pageSize);
  }
  useImperativeHandle(Ref, () => ({
    inverteData,
  }));
  return (
    <div>
      <Spin spinning={load}>
        <div
          id="saleOrderDetailInfoDrawer"
          className="innerDrawerTabsContent saleOrderDetailInfoDrawer"
        >
          <section className="drawerTabsContent">
            <MyAnchor>
              <Form className="has-gridForm">
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
                    <span className="form-span">{tableRowData?.contactName}</span>
                  </Form.Item>
                  <Form.Item label="R3联系人代号">
                    <span className="form-span">{tableRowData?.contactCode}</span>
                  </Form.Item>
                  <Form.Item label="所属公司">
                    <span className="form-span">{tableRowData?.companyName}</span>
                  </Form.Item>
                  {/* 111 */}
                  <Form.Item label="E&O销售申请">
                    <span
                      className="form-span"
                      style={{ color: '#67b6ff', cursor: 'pointer' }}
                      onClick={() => {
                        detailDrawerClose();
                        history.push({
                          pathname: `/scrap/sales/apply/detail`,
                          query: {
                            eandoApplyNo: tableRowData?.eandoApplyNo,
                            isRead: '1',
                          },
                        });
                      }}
                    >
                      {tableRowData?.eandoApplyNo}
                    </span>
                  </Form.Item>
                  <Form.Item label="主销售">
                    <span className="form-span">{tableRowData?.salesName}</span>
                  </Form.Item>
                  <Form.Item label="创建人">
                    <span className="form-span">{tableRowData?.createName}</span>
                  </Form.Item>
                  <Form.Item label="渠道">
                    <span className="form-span">{tableRowData?.channelTypeStr}</span>
                  </Form.Item>
                  <Form.Item label="运费总计">
                    <span className="form-span">
                      &yen; {Number(tableRowData?.freightTotalPrice).toFixed(2)}
                    </span>
                  </Form.Item>
                  <Form.Item label="国际运费">
                    <span className="form-span">&yen; {tableRowData?.intlFreightPrice}</span>
                  </Form.Item>
                  <Form.Item label="关税">
                    <span className="form-span">&yen; {tableRowData?.tariffPrice}</span>
                  </Form.Item>
                  <Form.Item label="总计金额含税">
                    <span className="form-span">
                      &yen; {Number(tableRowData?.taxTotalPrice).toFixed(2)}
                    </span>
                  </Form.Item>
                  <Form.Item label="货品金额含税">
                    <span className="form-span">
                      &yen; {Number(tableRowData?.goodsTaxTotalPrice).toFixed(2)}
                    </span>
                  </Form.Item>
                  <Form.Item label="折扣总计含税">
                    <span className="form-span">
                      &yen; {Number(tableRowData?.discountTaxTotalPrice).toFixed(2)}
                    </span>
                  </Form.Item>
                  <Form.Item label="订单创建时间">
                    <span className="form-span">
                      {moment(tableRowData?.createTime).format(dateFormat2)}
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
                    <span className="form-span">{receiveInfo?.district}</span>
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
                  <Form.Item label="收货人固话">
                    <span className="form-span">{receiveInfo?.receiverPhone}</span>
                  </Form.Item>
                  <Form.Item label="收货人邮箱">
                    <span className="form-span">{receiveInfo?.receiverEmail}</span>
                  </Form.Item>
                  {/* <Form.Item label="分机号">
            <span className="form-span">{receiveInfo?.extensionNumber}</span>
          </Form.Item> */}
                  <Form.Item label="是否保税区">
                    <span className="form-span">{receiveInfo?.toBond ? '是' : '否'}</span>
                  </Form.Item>
                  <Form.Item label="特殊编码">
                    <span className="form-span">{receiveInfo?.specialCode}</span>
                  </Form.Item>
                </div>
                <h4 className="formTitle" id="three">
                  配送及支付方式信息
                  <a className="anchor" href="#section-3" />
                </h4>
                <div className="ant-advanced-form four-gridCol">
                  <Form.Item label="交货方式">
                    <span className="form-span">{receiveInfo?.shipTypeStr}</span>
                  </Form.Item>
                  <Form.Item label="支付条件">
                    <span className="form-span">{receiveInfo?.paymentTermsName}</span>
                  </Form.Item>
                  <Form.Item label="支付方式">
                    <span className="form-span">{receiveInfo?.paymentMethodName}</span>
                  </Form.Item>
                </div>

                <h4 className="formTitle" id="four">
                  开票信息
                </h4>
                <div className="ant-advanced-form four-gridCol">
                  <Form.Item label="发票类型">
                    <span className="form-span">{invoiceInfo?.invoiceTypeStr}</span>
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
                    <span className="form-span">{invoiceInfo?.invoiceRegion}</span>
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
                    <span className="form-span">{invoiceInfo?.invoiceEmail}</span>
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
                      onClick={download}
                      style={{ marginBottom: '10px', marginRight: '10px' }}
                    >
                      下载直发送货单
                    </Button>
                  )}
                  <table className="amountTable" cellSpacing="0" data-content="币种：CNY">
                    <tbody>
                      <tr>
                        <th>货品金额总计:</th>
                        <td>{Number(tableRowData?.goodsTaxTotalPrice).toFixed(2)}</td>
                        <th>头运费:</th>
                        <td>{tableRowData?.headFreightPrice}</td>
                        <th>国际运费:</th>
                        <td>{tableRowData?.intlFreightPrice}</td>
                        <th>关税:</th>
                        <td>{tableRowData?.tariffPrice}</td>
                      </tr>
                      <tr>
                        <th>运费总计:</th>
                        <td>{tableRowData?.freightTotalPrice}</td>
                        <th>总计金额含税:</th>
                        <td>{tableRowData?.taxTotalPrice}</td>
                        <th>总计金额未税:</th>
                        <td>{tableRowData?.noTaxTotalPrice}</td>
                        <th>折扣总价含税:</th>
                        <td>{tableRowData?.discountTaxTotalPrice}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="detail_table_mod" style={{ marginTop: '10px' }}>
                    <ProTable<any>
                      columns={infoColumn}
                      rowClassName={(record: any) =>
                        record?.discountInfo?.cspDiscount ? 'red' : 'white'
                      }
                      pagination={{
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        // showTotal: total => `共有 ${total} 条数据`,
                        total: total,
                        showTotal: (_, range) =>
                          `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                        showQuickJumper: true,
                        onShowSizeChange: (current, pageSize) =>
                          onShowSizeChange(current, pageSize),
                      }}
                      dataSource={DetailTableData}
                      rowKey={() => Math.random()}
                      search={false}
                      // toolBarRender={false}
                      tableAlertRender={false}
                      actionRef={ref}
                      defaultSize="small"
                      scroll={{ x: 100 }}
                      options={{ reload: false, density: false }}
                    />
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
                      // const res = await queryRefResource(searchParams);
                      // if (res.errCode === 200) {
                      //   return Promise.resolve({
                      //     data: res.data?.list,
                      //     total: res.data?.total,
                      //     success: true,
                      //   });
                      // } else {
                      //   message.error(res.errMsg);
                      //   return Promise.resolve([]);
                      // }
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
    </div>
  );
};

export default forwardRef(BasicInfo);
