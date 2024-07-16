import { detail } from '@/services/afterSales';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Form, Tabs } from 'antd';
// import Cookies from 'js-cookie';
import Option from '@/pages/SalesAfter/components/Option';
import RelatedProcesses from '@/pages/SalesOrder/components/RelatedProcesses';
import { useEffect, useRef, useState } from 'react';
import './style.less';
const Info = (props: any) => {
  const { TabPane } = Tabs;
  const { id } = props;
  const ref = useRef<ActionType>();
  const ref2 = useRef<ActionType>();
  // const ref3 = useRef<ActionType>();
  const [tableRowData, setTableRowData]: any = useState({});
  const [receiveInfo, setReceiveInfo]: any = useState([]);
  const [fileInfo, setFileInfo]: any = useState([]);
  // const [currentPage1, setCurrentPage1] = useState(1);
  // const [currentPageSize1, setCurrentPageSize1] = useState(10);
  // 附件
  const appendixColumn: ProColumns<any>[] = [
    // { title: '文件名称', dataIndex: 'resourceName', width: 250 },
    {
      title: '文件名称',
      dataIndex: 'resourceName',
      className: 'alignLeft',
      width: 460,
      fixed: 'left',
    },
    {
      title: '操作',
      dataIndex: 'quotCode',
      width: 85,
      // render(_, record) {
      //   return (
      //     <>
      //       <Button
      //         type="link"
      //         onClick={() =>
      //           window.open(`${record.resourceUrl}?token=${Cookies.get('ssoToken')}`)
      //         }
      //       >
      //         下载
      //       </Button>
      //       ,
      //       <Button
      //         type="link"
      //         onClick={() =>
      //           window.open(`${record.resourceUrl}?token=${Cookies.get('ssoToken')}`)
      //         }
      //       >
      //         查看
      //       </Button>
      //     </>
      //   );
      // },
      render: (_, record): any => {
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

  const detailColumn: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        return index + 1;
        // return <span>{(currentPage1 - 1) * currentPageSize1 + index + 1}</span>;
      },
    },
    { title: 'SKU', dataIndex: 'sku', width: 120, fixed: 'left' },
    {
      title: '产品名称',
      dataIndex: 'productName',
      width: 400,
      render: (_, record: any) => {
        return `${record?.brandName || ''} ${record?.productName} ${record?.mfgSku || ''}`;
      },
    },
    { title: '物料码', dataIndex: 'stockSkuCode', width: 100 },
    { title: '销售包装单位数量', dataIndex: 'unitQuantity', width: 150 },
    { title: '数量', dataIndex: 'qty', width: 120 },
    { title: '面价', dataIndex: 'facePrice', width: 120 },
    { title: '成交价含税', dataIndex: 'salesPrice', width: 120 },
    { title: '小计含税', dataIndex: 'subtotalPrice', width: 120 },
    {
      title: '结算价',
      dataIndex: 'settlePrice',
      width: 120,
      render() {
        return <span>0.00</span>;
      },
    },
  ];
  detailColumn.forEach((item: any) => {
    item.ellipsis = true;
  });
  // function onShowSizeChange1(current: any, pageSize: any) {
  //   setCurrentPage1(current);
  //   setCurrentPageSize1(pageSize);
  // }
  useEffect(() => {
    const fn = async () => {
      const res = await detail(id);
      // console.log(res, 'res1');
      const {
        data: { sampleVO, sampleLineVOList, resourceList },
      } = res;
      setTableRowData(sampleVO);
      setReceiveInfo(sampleLineVOList);
      setFileInfo(resourceList);
      await setTimeout(() => {}, 0);
      ref?.current?.reload();
      ref2?.current?.reload();
    };
    fn();
  }, [id]);
  return (
    <div
      id="scroll-content"
      className="form-content-search tabs-detail hasAbsTabs salesAfter-borrow-apply saleOrderDetailInfoDrawer"
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="订单信息" key="1">
          <div className="innerDrawerTabsContent">
            <section className="drawerTabsContent">
              <Form className="has-gridForm">
                <h4 className="formTitle" id="one">
                  申请基本信息
                </h4>
                <div className="ant-advanced-form four-gridCol">
                  <Form.Item label="申请标题">
                    <span className="form-span">{tableRowData?.applyTitle}</span>
                  </Form.Item>
                  <Form.Item label="客户名称">
                    <span className="form-span">{tableRowData?.customerName}</span>
                  </Form.Item>
                  <Form.Item label="客户代号">
                    <span className="form-span">{tableRowData?.customerCode}</span>
                  </Form.Item>
                  <Form.Item label="主销售">
                    <span className="form-span">{tableRowData?.salesName}</span>
                  </Form.Item>
                  <Form.Item label="成本中心">
                    <span className="form-span">{tableRowData?.costCenterName}</span>
                  </Form.Item>
                  <Form.Item label="R3联系人">
                    <span className="form-span">{tableRowData?.contactNameR3}</span>
                  </Form.Item>
                  <Form.Item label="R3联系人代号" className="minLabel">
                    <span className="form-span">{tableRowData?.contactCodeR3}</span>
                  </Form.Item>
                  <Form.Item label="预期后续处理" className="minLabel">
                    <span className="form-span">{tableRowData?.expectHandleTypeName}</span>
                  </Form.Item>
                  <Form.Item label="申请金额">
                    <span className="form-span">{tableRowData?.applyAmount}</span>
                  </Form.Item>
                  <Form.Item label="申请渠道">
                    <span className="form-span">{tableRowData?.channelTypeName}</span>
                  </Form.Item>
                  <Form.Item label="一次性发货">
                    <span className="form-span">{tableRowData?.partialShipment ? '是' : '否'}</span>
                  </Form.Item>
                  <Form.Item label="申请备注" className="fullLineGrid">
                    <span className="form-span wordBreak">{tableRowData?.remark}</span>
                  </Form.Item>
                  <Form.Item label="超额原因" className="fullLineGrid">
                    <span className="form-span wordBreak">{tableRowData?.excessReason}</span>
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
                  <Form.Item label="收货邮编">
                    <span className="form-span">{tableRowData?.shipZip}</span>
                  </Form.Item>
                  <Form.Item label="收货人姓名">
                    <span className="form-span">{tableRowData?.receiverName}</span>
                  </Form.Item>
                  <Form.Item label="收货人手机">
                    <span className="form-span">{tableRowData?.receiverMobile}</span>
                  </Form.Item>
                  <Form.Item label="收货人固电话">
                    <span className="form-span">{tableRowData?.fixedPhone}</span>
                  </Form.Item>
                  <Form.Item label="收货人邮箱">
                    <span className="form-span">{tableRowData?.mailbox}</span>
                  </Form.Item>
                  <Form.Item label="是否保税区">
                    <span className="form-span">
                      {tableRowData?.toBondFlag !== 0 ? '是' : '否'}
                    </span>
                  </Form.Item>
                  <Form.Item label="特殊编码">
                    <span className="form-span">{tableRowData?.specialCode}</span>
                  </Form.Item>
                </div>
                <h4 className="formTitle" id="seven">
                  申请附件
                </h4>
                <div className="detail_table_mod" style={{ marginTop: '10px', width: '70%' }}>
                  <ProTable<any>
                    columns={appendixColumn}
                    dataSource={fileInfo}
                    request={async () => {
                      return Promise.resolve({
                        data: fileInfo,
                        success: true,
                      });
                    }}
                    rowKey="sid"
                    bordered
                    search={false}
                    toolBarRender={false}
                    tableAlertRender={false}
                    actionRef={ref}
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
                <h4 className="formTitle" id="seven">
                  明细信息
                </h4>
                <div className="detail_table_mod2" style={{ marginTop: '10px' }}>
                  <ProTable<any>
                    columns={detailColumn}
                    request={async () => {
                      return Promise.resolve({
                        data: receiveInfo,
                        success: true,
                      });
                    }}
                    rowKey="sampleNo"
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
                      showTotal: (total, range) =>
                        `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                    }}
                  />
                </div>
              </Form>
            </section>
          </div>
        </TabPane>
        <TabPane tab="相关流程" key="2">
          <RelatedProcesses billNo={id} />

          {/*<ProTable<any>
            columns={workColumn}
            request={async () => {
              const res = await processes(id);
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
          />
*/}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Info;
