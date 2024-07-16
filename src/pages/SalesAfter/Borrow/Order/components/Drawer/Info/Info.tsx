import { orderdetail } from '@/services/afterSales';
import { queryObdInfo, queryRefResource } from '@/services/SalesOrder';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Tabs } from 'antd';
// import Cookies from 'js-cookie';
import Option from '@/pages/SalesAfter/components/Option';
import RelatedProcesses from '@/pages/SalesOrder/components/RelatedProcesses';
import { useEffect, useRef, useState } from 'react';
import { history } from 'umi';
import MyDrawer from '../../InnerDrawer';
import MyAnchor from '../Anchor/index';
import './style.less';
const Info = (props: any) => {
  const { TabPane } = Tabs;
  const { id, row } = props;
  const ref = useRef<ActionType>();
  const ref2 = useRef<ActionType>();
  // const ref3 = useRef<ActionType>();
  const ref4 = useRef<ActionType>();
  const DrawerRef: any = useRef<ActionType>();
  const [tableRowData, setTableRowData]: any = useState({});
  const [receiveInfo, setReceiveInfo]: any = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  // const [currentPage1, setCurrentPage1] = useState(1);
  // const [currentPageSize1, setCurrentPageSize1] = useState(10);
  const [currentPage4, setCurrentPage4] = useState(1);
  const [currentPageSize4, setCurrentPageSize4] = useState(10);
  //// 货品金额合计,总计金额未税计算逻辑
  // const [Gmoney, setGmoney] = useState(0);
  // const [Smoney, setSmoney] = useState(0);

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
    { title: 'SKU', dataIndex: 'sku', width: 120, fixed: 'left' },
    { title: '物料码', dataIndex: 'stockSkuCode', width: 100 },
    { title: '销售包装单位数量', dataIndex: 'unitQuantity', width: 150 },
    { title: '借样数量', dataIndex: 'qty', width: 100 },
    { title: '销售单位', dataIndex: 'salesUnit', width: 100 },
    {
      title() {
        return <span style={{ color: '#b88990' }}>面价</span>;
      },
      dataIndex: 'facePrice',
      width: 100,
    },
    {
      title() {
        return <span style={{ color: '#b88990' }}>成交价含税</span>;
      },
      dataIndex: 'dealTaxPrice',
      width: 100,
      render() {
        return <span>0.00</span>;
      },
    },
    {
      title() {
        return <span style={{ color: '#b88990' }}>成交价未税</span>;
      },
      dataIndex: 'noDealTaxPrice',
      width: 100,
      render() {
        return <span>0.00</span>;
      },
    },
    {
      title() {
        return <span style={{ color: '#b88990' }}>小计含税</span>;
      },
      dataIndex: 'taxSubtotalPrice',
      width: 100,
      render() {
        return <span>0.00</span>;
      },
    },
    {
      title() {
        return <span style={{ color: '#b88990' }}>小计未税</span>;
      },
      dataIndex: 'noTaxSubtotalPrice',
      width: 100,
      render() {
        return <span>0.00</span>;
      },
    },
    {
      title() {
        return <span style={{ color: '#b88990' }}>小计折扣</span>;
      },
      dataIndex: 'discountSubtotalPrice',
      width: 100,
      render() {
        return <span>0.00</span>;
      },
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      width: 400,
      render: (_, record: any) => {
        return `${record?.brand || ''} ${record?.productName} ${record?.manufacturerNo || ''}`;
      },
    },
    {
      title: '是否JV',
      dataIndex: 'jvFlagName', // jvFlag
      width: 100,
      // hideInTable: true,
    },
    {
      title: 'JV公司',
      dataIndex: 'jvCompanyName', // jvCompanyCode
      width: 250,
      // hideInTable: true,
    },
    { title: '品牌', dataIndex: 'brand', width: 100 },
    { title: '制造商型号', dataIndex: 'manufacturerNo', width: 100 },
    { title: '供应商型号', dataIndex: 'supplierNo', width: 100 },
    { title: '物理单位', dataIndex: 'physicsUnit', width: 100 },
    {
      title() {
        return <span style={{ color: '#cba6fb' }}>交货周期（天）</span>;
      },
      dataIndex: 'leadTime',
      width: 100,
    },
    // {
    //   title() {
    //     return <span style={{ color: '#cba6fb' }}>是否可退换货</span>;
    //   },
    //   dataIndex: 'returnFlagName',
    //   width: 100,
    //   render(_, record) {
    //     return <span>{record.nonRefundableFlag ? '不可退换' : '可退换'}</span>;
    //   },
    // },
    {
      title() {
        return <span style={{ color: '#cba6fb' }}>是否可退货</span>;
      },
      dataIndex: 'supplierReturn',
      render: (_, record: any) =>
        record?.supplierReturn == 0 ? '不可退货' : record?.supplierReturn == 1 ? '可退货' : '-',
      width: 100,
    },
    {
      title() {
        return <span style={{ color: '#cba6fb' }}>是否可换货</span>;
      },
      dataIndex: 'supplierExchange',
      render: (_, record: any) =>
        record.supplierExchange == 0 ? '不可换货' : record?.supplierExchange == 1 ? '可换货' : '-',
      width: 100,
    },

    {
      title() {
        return <span style={{ color: '#cba6fb' }}>是否直送</span>;
      },
      dataIndex: 'directDeliveryFlag',
      width: 100,
      render(_, record) {
        return <span>{record.directDeliveryFlag ? '是' : '否'}</span>;
      },
    },
    {
      title() {
        return <span style={{ color: '#cba6fb' }}>SKU类型</span>;
      },
      dataIndex: 'skuTypeName',
      width: 100,
    },
    {
      title() {
        return <span style={{ color: '#cba6fb' }}>产品业务状态</span>;
      },
      dataIndex: 'businessStatusName',
      width: 100,
    },
    {
      title() {
        return <span style={{ color: '#cba6fb' }}>备货类型</span>;
      },
      dataIndex: 'stockType',
      width: 100,
    },
    {
      title() {
        return <span style={{ color: '#cba6fb' }}>运费</span>;
      },
      dataIndex: 'freightPrice',
      width: 100,
      render() {
        return <span>0.00</span>;
      },
    },
    {
      title() {
        return <span style={{ color: '#cba6fb' }}>国际运费</span>;
      },
      dataIndex: 'intlFreightPrice',
      width: 100,
      render() {
        return <span>0.00</span>;
      },
    },
    {
      title() {
        return <span style={{ color: '#cba6fb' }}>关税</span>;
      },
      dataIndex: 'tariffPrice',
      width: 100,
      render() {
        return <span>0.00</span>;
      },
    },
    { title: '发货仓库', dataIndex: 'deliveryWarehouse', width: 100 },
    { title: '发货仓库名称', dataIndex: 'deliveryWarehouseName', width: 100 },
    { title: '货物起运点', dataIndex: 'startDot', width: 100 },
    { title: '货物起运点名称', dataIndex: 'startDotName', width: 100 },
    { title: '预计发货日期', dataIndex: 'expectDate', width: 100 },
  ];
  infoColumn.forEach((item: any) => {
    item.ellipsis = true;
  });
  // 附件
  const appendixColumn: ProColumns<any>[] = [
    { title: '文件名称', dataIndex: 'resourceName', width: 250, className: 'alignLeft' },
    { title: '文件类型', dataIndex: 'fileType', width: 120, className: 'alignLeft' },
    { title: '创建者', dataIndex: 'createUser', width: 120, className: 'alignLeft' },
    {
      title: '创建时间',
      valueType: 'dateTime',
      dataIndex: 'createTime',
      width: 150,
      className: 'alignLeft',
    },
    {
      title: '操作',
      dataIndex: 'quotCode',
      width: 85,
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
      fixed: 'right',
    },
  ];
  appendixColumn.forEach((item: any) => {
    item.ellipsis = true;
  });
  // 相关流程
  // const workColumn: ProColumns<any>[] = [
  //   {
  //     title: '序号',
  //     dataIndex: 'index',
  //     valueType: 'index',
  //     width: 50,
  //     fixed: 'left',
  //     render(text, record, index) {
  //       // return index + 1;
  //       return <span>{(currentPage1 - 1) * currentPageSize1 + index + 1}</span>;
  //     },
  //   },
  //   { title: '流程ID', dataIndex: 'workflowId', width: 120 },
  // ];

  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  // function onShowSizeChange1(current: any, pageSize: any) {
  //   setCurrentPage1(current);
  //   setCurrentPageSize1(pageSize);
  // }
  function onShowSizeChange4(current: any, pageSize: any) {
    setCurrentPage4(current);
    setCurrentPageSize4(pageSize);
  }
  useEffect(() => {
    const fn = async () => {
      const res = await orderdetail(id);
      const {
        data: { sampleOrderVO, sampleOrderLineVOList },
      } = res;
      setTableRowData(sampleOrderVO);
      setReceiveInfo(sampleOrderLineVOList);
      await setTimeout(() => {}, 0);
      ref?.current?.reload();
    };
    fn();
  }, [id]);
  infoColumn.forEach((item: any) => (item.ellipsis = true));
  const setDrawerVisible = (record: any) => {
    DrawerRef.current.openDrawer(record);
  };
  const deliveryColumn: ProColumns<any>[] = [
    {
      title: '#',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
      search: false,
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '操作',
      width: 70,
      render: (text, record) => [
        <Button
          size="small"
          key={'详情'}
          type="link"
          onClick={() => {
            setDrawerVisible(record);
          }}
        >
          详情
        </Button>,
      ],
      fixed: 'left',
      search: false,
    },
    { title: '发货单号', dataIndex: 'obdNo', width: 120 },
    { title: '物流商名称', dataIndex: 'tplname', width: 120, search: false },
    { title: '快递单号', dataIndex: 'expCode', width: 120, search: false },
    { title: '发货时间', dataIndex: 'sendTime', width: 120, search: false },
    { title: '总金额-含税', dataIndex: 'amount', width: 120, search: false },
    {
      title: '发货单创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 120,
      search: false,
    },
    { title: '收货人', dataIndex: 'consignee', width: 120, search: false },
    { title: '收货地址', dataIndex: 'address', width: 300, search: false },
    { title: '手机', dataIndex: 'cellphone', width: 120, search: false },
    { title: '座机', dataIndex: 'phone', width: 120, search: false },
    {
      title: '同步时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 120,
      search: false,
    },
  ];
  deliveryColumn.forEach((item: any) => {
    item.ellipsis = true;
  });

  return (
    <div
      id="scroll-content"
      className="form-content-search tabs-detail hasAbsTabs salesAfter-borrow-order saleOrderDetailInfoDrawer"
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="订单信息" key="1">
          <div className="innerDrawerTabsContent">
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
                    <Form.Item label="R3联系人">
                      <span className="form-span">{tableRowData?.contactNameR3}</span>
                    </Form.Item>
                    <Form.Item label="R3联系人代号" className="minLabel">
                      <span className="form-span">{tableRowData?.contactCodeR3}</span>
                    </Form.Item>
                    <Form.Item label="所属公司">
                      <span className="form-span">{tableRowData?.companyName}</span>
                    </Form.Item>
                    <Form.Item label="借样申请">
                      <span
                        className="form-span"
                        style={{ color: '#4daaff', cursor: 'pointer' }}
                        onClick={() => {
                          history.push({
                            //umi文档规定的固定格式
                            pathname: '/sales-after/Borrow/Apply/detail', //要跳转的路由
                            state: {
                              //传递的数据
                              data: tableRowData?.sampleNo,
                            },
                          });
                        }}
                      >
                        {tableRowData?.sampleNo}
                      </span>
                    </Form.Item>
                    <Form.Item label="主销售">
                      <span className="form-span">{tableRowData?.salesName}</span>
                    </Form.Item>
                    <Form.Item label="成本中心">
                      <span className="form-span">{tableRowData?.costCenter}</span>
                    </Form.Item>
                    <Form.Item label="创建人">
                      <span className="form-span">{tableRowData?.createName}</span>
                    </Form.Item>
                    <Form.Item label="渠道">
                      <span className="form-span">{tableRowData?.channelTypeName}</span>
                    </Form.Item>
                    <Form.Item label="一次性发货">
                      <span className="form-span">
                        {tableRowData?.partialShipment ? '是' : '否'}
                      </span>
                    </Form.Item>
                    <Form.Item label="采购单位名称" className="minLabel">
                      <span className="form-span">{tableRowData?.purchaseName}</span>
                    </Form.Item>
                    <Form.Item label="下单人姓名">
                      <span className="form-span">{tableRowData?.buyer}</span>
                    </Form.Item>
                    <Form.Item label="下单人电话">
                      <span className="form-span">{tableRowData?.buyerTel}</span>
                    </Form.Item>
                    <Form.Item label="运费总计">
                      <span className="form-span">{tableRowData?.totalFreightPrice}</span>
                    </Form.Item>
                    <Form.Item label="国际运费">
                      <span className="form-span">&yen; {tableRowData?.intlFreightPrice}</span>
                    </Form.Item>
                    <Form.Item label="关税">
                      <span className="form-span">&yen; {tableRowData?.tariffPrice}</span>
                    </Form.Item>
                    <Form.Item label="总计含税金额" className="minLabel">
                      <span className="form-span">
                        &yen; 0{/* {Number(tableRowData?.taxTotalPrice).toFixed(2)} */}
                      </span>
                    </Form.Item>
                    <Form.Item label="货品金额合计" className="minLabel">
                      <span className="form-span">
                        &yen; 0{/* {Number(tableRowData?.goodsTotalPrice).toFixed(2)} */}
                      </span>
                    </Form.Item>
                    {/* <Form.Item label="关联订单号">
                      <span className="form-span">{tableRowData?.relationOrderNo}</span>
                    </Form.Item> */}
                    <Form.Item label="创建时间">
                      <span className="form-span">{tableRowData?.createTime}</span>
                    </Form.Item>
                    <Form.Item label="预计后续处理">
                      <span className="form-span">{tableRowData?.expectHandleTypeName}</span>
                    </Form.Item>
                  </div>
                  <h4 className="formTitle" id="two">
                    收货信息
                  </h4>
                  <div className="ant-advanced-form four-gridCol">
                    <Form.Item label="收件人地址" className="twoGrid minLabel">
                      <span className="form-span">{tableRowData?.receiverAddress}</span>
                    </Form.Item>
                    <Form.Item label="收货地区">
                      <span className="form-span">{tableRowData?.district}</span>
                    </Form.Item>
                    <Form.Item label="收货人邮编">
                      <span className="form-span">{tableRowData?.shipZip}</span>
                    </Form.Item>
                    <Form.Item label="收货人姓名">
                      <span className="form-span">{tableRowData?.receiverName}</span>
                    </Form.Item>
                    <Form.Item label="收货人手机">
                      <span className="form-span">{tableRowData?.receiverMobile}</span>
                    </Form.Item>
                    <Form.Item label="固定电话">
                      <span className="form-span">{tableRowData?.fixedPhone}</span>
                    </Form.Item>
                    {/* <Form.Item label="分机号">
											<span className="form-span">{tableRowData?.extensionNumber}</span>
										</Form.Item> */}
                    <Form.Item label="是否保税区">
                      <span className="form-span">
                        {tableRowData?.toBondFlag !== 0 ? '是' : '否'}
                      </span>
                    </Form.Item>
                    <Form.Item label="特殊编码">
                      <span className="form-span">{tableRowData?.specialCode}</span>
                    </Form.Item>
                  </div>
                  <h4 className="formTitle" id="three">
                    商品明细
                  </h4>
                  <div className="ant-advanced-form" style={{ marginTop: '20px' }}>
                    <table className="amountTable" cellSpacing="0" data-content="币种：CNY">
                      <tbody>
                        <tr>
                          <th>货品金额总计:</th>
                          {/* <td> &yen; {Number(Gmoney).toFixed(2)}</td> */}
                          <td style={{ color: '#4daaff' }}>0</td>
                          <th>头运费:</th>
                          <td style={{ color: '#4daaff' }}>0</td>
                          <th>国际运费:</th>
                          <td style={{ color: '#4daaff' }}>0</td>
                          <th>关税:</th>
                          <td style={{ color: '#4daaff' }}>0</td>
                          <th>运费总计:</th>
                          <td style={{ color: '#4daaff' }}>0</td>
                        </tr>
                        <tr>
                          <th>总计金额含税:</th>
                          {/* <td>{Number(Gmoney).toFixed(2)}</td> */}
                          <td style={{ color: '#4daaff' }}>0</td>
                          <th>总计金额未税:</th>
                          <td style={{ color: '#4daaff' }}>0</td>
                          {/* <td>{Number(Smoney).toFixed(2)}</td> */}
                          <th>折扣总价含税:</th>
                          <td style={{ color: '#4daaff' }}>0</td>
                          <th>使用返利金额:</th>
                          <td style={{ color: '#4daaff' }}>0</td>
                          <th>{''}</th>
                          <td>{''}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="detail_table_mod" style={{ marginTop: '10px' }}>
                      <ProTable<any>
                        columns={infoColumn}
                        bordered
                        size="small"
                        request={async () => {
                          //// 货品金额合计,总计金额未税计算逻辑
                          // let count = 0,
                          //   num = 0;
                          // receiveInfo.forEach((element: any) => {
                          //   count += Number(element.taxSubtotalPrice);
                          //   num += Number(element.noTaxSubtotalPrice);
                          // });
                          // setGmoney(count);
                          // setSmoney(num);
                          return Promise.resolve({
                            data: receiveInfo,
                            success: true,
                          });
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
                        toolBarRender={false}
                        tableAlertRender={false}
                        actionRef={ref}
                        defaultSize="small"
                        scroll={{ x: 0 }}
                        options={{ reload: false, density: false }}
                      />
                    </div>
                  </div>
                  <h4 className="formTitle" id="four">
                    附件
                  </h4>
                  <div className="detail_table_mod" style={{ marginTop: '10px', width: '70%' }}>
                    <ProTable<any>
                      columns={appendixColumn}
                      request={async (params) => {
                        return Promise.resolve([]);

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
                          Modal.error(res.errMsg);
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
                </Form>
              </MyAnchor>
            </section>
          </div>
        </TabPane>
        <TabPane tab="相关流程" key="2">
          <RelatedProcesses billNo={row.sampleNo} />
          {/*<ProTable<any>
            columns={workColumn}
            request={async () => {
              const res = await processes(row.sampleNo);
              if (res.errCode === 200) {
                res.data?.dataList?.forEach((e: { index: number }, i: number) => {
                  e.index = i;
                });
                return Promise.resolve({
                  data: res.data?.dataList,
                  total: res.data?.total,
                  success: true,
                });
              } else {
                Modal.error(res.errMsg);
                return Promise.resolve([]);
              }
            }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total, range) =>
                `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
              onShowSizeChange: (current, pageSize) => onShowSizeChange1(current, pageSize),
            }}
            rowKey="index"
            search={false}
            toolBarRender={false}
            tableAlertRender={false}
            actionRef={ref3}
            defaultSize="small"
          />*/}
        </TabPane>
        <TabPane tab="相关发货" key="3">
          <ProTable<any>
            columns={deliveryColumn}
            scroll={{ x: 0 }}
            request={async (params) => {
              const searchParams: any = {
                pageNumber: params.current,
                pageSize: params.pageSize,
                obdNo: params.obdNo,
                orderNo: id,
              };
              // const res = await relevantObd(searchParams);
              const res = await queryObdInfo(searchParams);
              res.data?.list?.forEach((e: any, i: number) => {
                e.index = i;
              });
              if (res.errCode === 200) {
                return Promise.resolve({
                  data: res.data?.list,
                  total: res.data?.total,
                  success: true,
                });
              } else {
                Modal.error(res.errMsg);
                return Promise.resolve([]);
              }
            }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              // showTotal: total => `共有 ${total} 条数据`,
              showTotal: (total, range) =>
                `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
              onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
            }}
            rowKey="index"
            search={{
              labelWidth: 'auto',
            }}
            toolBarRender={false}
            tableAlertRender={false}
            actionRef={ref4}
            defaultSize="small"
            bordered
          />
        </TabPane>
      </Tabs>
      <MyDrawer ref={DrawerRef} row={row} />
    </div>
  );
};

export default Info;
