import React, { useState, forwardRef, useEffect } from 'react';
import { Form, message, Tabs, Spin, Button } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import RelatedProcesses from '@/pages/SalesOrder/components/RelatedProcesses';
import OrderInfoContent from './OrderInfoContent';
import './style.css';
import moment from 'moment';
import { getRequesOrderDetail, getFilesList, saveRefResource } from '@/services/SalesOrder/index';
import Option from '@/pages/SalesAfter/components/Option';
import UploadForm from '../../components/UploadForm';
import ReceptionDrawer from './ReceptionDrawer';

const OrderDetail = ({ tableRowData, id, orderId }: any, ref: any) => {
  const { TabPane } = Tabs;
  // const sourceId = tableRowData.sid;
  const [load, setLoad] = useState(false);
  // const [status, setStatus] = useState();
  // const yClient = 300;
  const [form] = Form.useForm();
  // const detailRef: any = useRef<ActionType>();

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [isUpload, setIsUpload] = useState<any>(false);

  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

  // const dateFormat = 'YYYY-MM-DD';
  const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
  // const data = tableRowData;
  const [foundationData, setFoundationData]: any = useState({});
  const [fileDataList, setFileDataList] = useState<any>([]);
  // const [total, setTotal] = useState<any>();

  const getFileDataList = async (sid: any) => {
    const searchParams: any = {
      pageNumber: currentPage,
      pageSize: currentPageSize,
      sourceId: sid,
      sourceType: 40,
      subType: 30,
    };
    // const res = await getFilesList(searchParams);
    // if (res.errCode === 200) {
    //   setFileDataList(res.data?.list);
    //   // setTotal(res.data?.total)
    // } else {
    //   message.error(res.errMsg, 3);
    // }
  };

  useEffect(() => {
    // const Fn = async () => {
    //   const res = await getOrderDetail(orderId);
    //   if (res.errCode == 200) {
    //     console.log(res, 'res');
    //     setStatus(res?.data?.salesOrderRespVo?.orderStatus);
    //   } else {
    //     message.error(res?.errMsg);
    //   }
    // };
    const fn = async () => {
      setLoad(true);
      // const res = await getRequesOrderDetail(id);
      // if (res.errCode == 200) {
      //   setFoundationData(res.data);
      //   // 获取fileListData接口
      //   getFileDataList(res?.data?.sid);
      //   setLoad(false);
      // }
    };
    fn();
    // Fn();
    console.log(ref);
  }, [id]);

  const fileNameRowWidth = (100 % -40) - 85;
  const attachment_columns: ProColumns<any>[] = [
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
    // {
    //   title: '文件类型',
    //   dataIndex: 'fileType',
    //   width: 150,
    //   sorter: (a, b) => (a.fileType - b.fileType ? 1 : -1),
    // },
    // {
    //   title: '创建者',
    //   dataIndex: 'createUser',
    //   width: 100,
    //   sorter: (a, b) => (a.createUser - b.createUser ? 1 : -1),
    // },
    // {
    //   title: '创建时间',
    //   width: 150,
    //   valueType: 'dateTime',
    //   dataIndex: 'createTime',
    //   sorter: (a, b) => (a.createTime - b.createTime ? 1 : -1),
    // },
  ];

  attachment_columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  const loadList = async (val: any) => {
    const resourceVOList: any = [];
    val.forEach((e: any) => {
      resourceVOList.push({
        resourceName: e.resourceName,
        resourceUrl: e.resourceUrl,
        fileType: 'po附件',
      });
    });
    const params = {
      sourceId: foundationData?.sid,
      sourceType: 40,
      subType: 30,
      resourceVOList,
    };
    // const resSave = await saveRefResource(params);
    // // 刷接口
    // if (resSave.errCode === 200) {
    //   getFileDataList(foundationData?.sid);
    //   setIsUpload(false);
    // }
  };

  return (
    <div id="scroll-content" className="form-content-search tabs-detail hasAbsTabs requestDetail">
      <Button
        style={{ zIndex: 9999999, top: '21px', right: '90px', position: 'absolute' }}
        type="primary"
        onClick={() => setIsUpload(true)}
      >
        追加附件{' '}
      </Button>
      <Tabs defaultActiveKey="1">
        <TabPane tab="订单信息" key="1">
          <Spin spinning={load}>
            <section className="drawerTabsContent omsAntStyles">
              <Form
                className="has-gridForm"
                name="form"
                form={form}
                autoComplete="off"
                initialValues={{}}
              >
                <div className="content">
                  <div className="content1 box">
                    <div id="one" className="title">
                      基本申请信息
                    </div>
                    <div className="ant-advanced-form three-gridCol" id="requestDetailTopCol">
                      <Form.Item label="申请类型">
                        <span className="form-span">{foundationData?.requestTypeName}</span>
                      </Form.Item>
                      <Form.Item label="申请订单">
                        <span className="form-span">{foundationData?.orderNo}</span>
                      </Form.Item>
                      <Form.Item label="申请渠道">
                        <span className="form-span">{foundationData?.requestChannelName}</span>
                      </Form.Item>

                      {foundationData?.requestTypeName != '订单修改' && (
                        <Form.Item label="取消类型">
                          <span className="form-span">{foundationData?.cancelTypeName}</span>
                        </Form.Item>
                      )}
                      {foundationData?.requestTypeName != '订单修改' && (
                        <Form.Item label="取消原因">
                          <span className="form-span">{foundationData?.cancelReasonName}</span>
                        </Form.Item>
                      )}
                      {foundationData?.requestTypeName == '订单修改' && (
                        <Form.Item label="修改类型">
                          <span className="form-span">{foundationData?.updateTypeName}</span>
                        </Form.Item>
                      )}
                      {foundationData?.requestTypeName == '订单修改' && (
                        <Form.Item label="修改原因">
                          <span className="form-span">{foundationData?.updateReasonName}</span>
                        </Form.Item>
                      )}

                      <Form.Item label="创建人">
                        <span className="form-span">{foundationData?.createName}</span>
                      </Form.Item>
                      <Form.Item label="创建时间">
                        <span className="form-span">
                          {moment(foundationData?.createTime).format(dateTimeFormat)}
                        </span>
                      </Form.Item>

                      <Form.Item label="最近更新时间">
                        {foundationData?.updateTime && (
                          <span className="form-span">
                            {moment(foundationData?.updateTime).format(dateTimeFormat)}
                          </span>
                        )}
                      </Form.Item>
                      <Form.Item label="重复关联订单">
                        {foundationData?.repeatOrderNo && (
                          <span className="form-span">{foundationData?.repeatOrderNo}</span>
                        )}
                      </Form.Item>
                      <Form.Item label="订单状态">
                        <span className="form-span wordBreak">{tableRowData?.orderStatus}</span>
                      </Form.Item>
                      <Form.Item label="接待单号">
                        {/*<ReceptionDrawer
                          receptionCode={foundationData?.receptionCode || '1457689'}
                        />*/}
                        {foundationData?.receptionCode && (
                          <ReceptionDrawer receptionCode={foundationData?.receptionCode} />
                        )}
                      </Form.Item>
                      <Form.Item label="申请备注描述" className="fullLineGrid">
                        <span className="form-span wordBreak">{foundationData?.remark}</span>
                      </Form.Item>
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
                        dataSource={fileDataList}
                        // request={async (params) => {
                        //   const searchParams: any = {
                        //     pageNumber: params.current,
                        //     pageSize: params.pageSize,
                        //     sourceId: sourceId,
                        //     sourceType: 40,
                        //     subType: 30,
                        //   };
                        //   const res = await getFilesList(searchParams);
                        //   if (res.errCode === 200) {
                        //     return Promise.resolve({
                        //       data: res.data?.list,
                        //       total: res.data?.total,
                        //       current: 1,
                        //       pageSize: 10,
                        //       success: true,
                        //     });
                        //   } else {
                        //     message.error(res.errMsg, 3);
                        //     return Promise.resolve([]);
                        //   }
                        // }}
                        rowKey={() => Math.random()}
                        search={false}
                        options={false}
                        tableAlertRender={false}
                        defaultSize="small"
                        scroll={{ x: 100, y: 250 }}
                        pagination={{
                          defaultPageSize: 10,
                          showSizeChanger: true,
                          pageSizeOptions: ['10', '20', '50', '100'],
                          showTotal: (total, range) =>
                            `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                          onShowSizeChange: (current, pageSize) =>
                            onShowSizeChange(current, pageSize),
                        }}
                      />
                    </div>
                  </div>

                  <div id="one" className="title">
                    订单详情
                  </div>
                  <OrderInfoContent
                    tableRowData={tableRowData}
                    orderId={orderId}
                    orderType={tableRowData?.orderTypeCode}
                  />
                </div>
              </Form>
            </section>
          </Spin>
        </TabPane>
        <TabPane tab="相关流程" key="2">
          <RelatedProcesses billNo={orderId} />
        </TabPane>
      </Tabs>
      <UploadForm visible={isUpload} getList={loadList} maxCount={100} />
    </div>
  );
};
export default forwardRef(OrderDetail);
