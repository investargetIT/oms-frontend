import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button, Space, Form, Input, DatePicker, Select, message, Drawer, Tag, Modal } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import moment from 'moment';
import { rangesOption } from '@/pages/components/DataRangePicker';
import { SearchOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ResizableTitle from '@/pages/components/TableCom/ResizableTitle';
import cloneDeep from 'lodash/cloneDeep';
import { colLimit } from '@/services';
import { getOrderDateList } from '@/services/SalesOrder';
import { getOrderModificationMonitoring, retry } from '@/services/System';
// import './index.less';
// import NewOrderDetail from '@/pages/SalesOrder/OMARecord/components/OrderDetail';
import OldOrderDetail from '@/pages/SalesOrder/OrderModificationApplication/components/OrderDetail';
import AddNewDrawer from '@/pages/SalesOrder/Order/components/ApplyCancellation/EditDrawer';

const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { RangePicker } = DatePicker;
  const ref: any = useRef<ActionType>();
  const [form] = Form.useForm();

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [yClient, setYClient] = useState(900);

  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const dataPickerOnChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
    // if (dates) {
    //   console.log('From: ', dates[0], ', to: ', dates[1]);
    //   console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    // } else {
    //   console.log('Clear');
    //   form.getFieldsValue(true).createTime = ['', ''];
    // }
  };

  const retryOption = (sid: any) => {
    // Modal.confirm({
      // title: '您确定要重试吗？',
      // onOk() {
      //   retry(sid)
      //     .then((res: any) => {
      //       if (res?.errCode === 200) {
      //         tableReload();
      //         message.success('您已成功发起重试操作!');
      //       } else {
      //         message.error(res?.errMsg);
      //       }
      //     })
      //     .finally(() => {
      //       return;
      //     })
      //     .catch((errorInfo: any) => {
      //       message.error(errorInfo, 3);
      //     });
      // },
      // onCancel() {},
    // });
  };

  const SideBar: any = document.getElementsByClassName('ant-layout-sider');
  const [drawerWidth, setDrawerWidth] = useState(window.innerWidth - 208);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const [id, setId]: any = useState('');
  const [orderId, setOrderId]: any = useState('');
  const [tableRowData, setTableRowData]: any = useState({});
  const [status, setStatus] = useState('订单审批中');
  const [type, setType] = useState('订单修改');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const approveModalHandleOk = () => {
    setIsModalVisible(false);
  };
  function tableReload() {
    ref?.current?.reload();
  }
  const addNewDrawerClose = () => {
    setIsDrawerVisible(false);
  };
  const addNewDrawerOpen = () => {
    setIsDrawerVisible(true);
  };

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      fixed: 'left',
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'requestNo',
      width: 80,
      render: (_, record) => {
        // return (
        //   <>
        //     {record?.opStateStr === '失败' && (
        //       <>
        //         <Button
        //           size="small"
        //           key={'重试'}
        //           type="link"
        //           onClick={() => {
        //             retryOption(record.sid);
        //           }}
        //         >
        //           {' '}
        //           重试{' '}
        //         </Button>
        //       </>
        //     )}
        //   </>
        // );
      },
      fixed: 'left',
    },
    {
      title: '修改申请编号',
      dataIndex: 'requestNo',
      width: 200,
      render: (_, record) => {
        return (
          <Button
            size="small"
            key={'详情'}
            type="link"
            onClick={() => {
              // const sideWidth = SideBar[0]?.clientWidth || 0;
              // setDrawerWidth(window.innerWidth - sideWidth);
              // setId(record.requestNo);
              // setOrderId(record.orderNo);
              // if (record.requestType == 1) {
              //   setType('整单取消');
              // } else if (record.requestType == 2) {
              //   setType('部分取消');
              // } else if (record.requestType == 3) {
              //   setType('订单修改');
              // }
              // if (record.orderStatusStr != '') {
              //   setStatus(record.orderStatusStr);
              // } else {
              //   setStatus('订单审批中');
              // }
              // setTableRowData(record);
              // setIsModalVisible(true);

              //上面的原来就已被注释，下面的是为了显示页面而注释
              record.orderStatus = record.orderStatusStr || '等待发货';
              const sideWidth = SideBar[0]?.clientWidth || 0;
              setDrawerWidth(window.innerWidth - sideWidth);
              setId(record.requestNo);
              setOrderId(record.orderNo);
              // if (record.requestType == 1) {
              //   setType('整单取消');
              //   record.requestTypeName = '整单取消';
              // } else if (record.requestType == 2) {
              //   setType('部分取消');
              //   record.requestTypeName = '部分取消';
              // } else if (record.requestType == 3) {
              //   setType('订单修改');
              //   record.requestTypeName = '订单修改';
              // }

              // record.requestStatusName = '申请' + record.opStateStr;
              // if (record.orderStatusStr != '') {
              //   setStatus(record.orderStatusStr);
              // } else {
              //   setStatus('订单审批中');
              // }
              // setTableRowData(record);
              // if (record?.requestTypeName !== '订单修改') {
              //   addNewDrawerOpen();
              // } else {
              //   setIsModalVisible(true);
              // }
            }}
          >
            {record?.requestNo}
          </Button>
        );
      },
      fixed: 'left',
    },
    { title: '申请订单', width: 150, dataIndex: 'orderNo' },
    { title: '创建人', width: 150, dataIndex: 'createName' },
    { title: '客户代号', width: 150, dataIndex: 'customerCode' },
    { title: '客户名称', width: 250, dataIndex: 'customerName' },
    {
      title: '取消类型',
      dataIndex: 'cancelTypeStr',
      width: 150,
    },
    {
      title: '取消原因',
      dataIndex: 'cancelReasonStr',
      width: 150,
    },
    {
      title: '修改类型',
      width: 150,
      dataIndex: 'updateTypeStr',
    },
    {
      title: '修改原因',
      width: 150,
      dataIndex: 'updateReasonStr',
    },

    { title: '申请时订单状态', width: 150, dataIndex: 'orderStatusStr' },
    {
      title: '修改状态',
      width: 150,
      dataIndex: 'opStateStr',
      render(_, record: any) {
        // if (record.opStateStr == '失败') {
        //   return <strong style={{ color: '#fa0f1b' }}>失败</strong>;
        // } else if (record.opStateStr == '成功') {
        //   // return <strong style={{ color: '#11f702' }}>成功</strong>;
        //   return '成功';
        // }
      },
    },
    { title: '失败原因', width: 200, dataIndex: 'respJson' },
  ];

  columns.forEach((item: any) => {
    item.ellipsis = true;
    item.align = 'center';
  });

  const [colList, setColList] = useState([]);
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();

  const [requestTypeList, setRequestTypeList]: any = useState([]);
  const [opStateStatusList, setOpStateStatusList]: any = useState([]);

  useEffect(() => {
    setColList(columns);

    // getOrderDateList({ type: 'orderRequestType' }).then((res: any) => {
      // if (res.errCode === 200) {
      //   setRequestTypeList(res?.data?.dataList);
      // }
    // });
    setOpStateStatusList([
      {
        key: '1',
        value: '失败',
      },
      {
        key: '2',
        value: '成功',
      },
    ]);

    //设置select初始值
    form.setFieldsValue({
      requestType: requestTypeList && requestTypeList[0] ? requestTypeList[0].key : '',
      opState: opStateStatusList && opStateStatusList[0] ? opStateStatusList[0].key : '1',
    });
  }, []);

  const columnsList = useMemo(() => {
    return colList?.map((col: any, index: number) => {
      return {
        ...col,
        onHeaderCell: (column: any) => ({
          width: column.width,
          onResize: (e: any, { size }: any) => {
            const copyData: any = cloneDeep(colList);
            copyData[index] = { ...copyData[index], width: size.width };
            setColList(copyData);
          },
        }),
      };
    });
  }, [colList]);

  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 300);
  }, [initialState?.windowInnerHeight]);

  return (
    <div className="omsAntStyle" id="openSoStyle">
      <div className="form-content-search topSearchCol">
        <Form
          layout="inline"
          form={form}
          className="ant-advanced-form"
          initialValues={{ createTime: [moment().subtract(1, 'month'), moment()] }}
        >
          <Form.Item name="requestNo" label="修改申请编号">
            <Input placeholder="请输入订单修改申请编号" allowClear />
          </Form.Item>
          <Form.Item name="orderNo" label="申请订单">
            <Input placeholder="请输入订单号" allowClear />
          </Form.Item>

          <Form.Item name="createName" label="创建人">
            <Input placeholder="请输入员工账号" allowClear />
          </Form.Item>
          <Form.Item name="customerCode" label="客户代号">
            <Input placeholder="请输入客户代号" allowClear />
          </Form.Item>
          <Form.Item name="requestType" label="申请类型" className="selectForm">
            <Select placeholder="请选择申请类型">
              <Select.Option value="">全部</Select.Option>
              {requestTypeList &&
                requestTypeList.map((item: any) => (
                  <Select.Option key={item.value} value={item.key}>
                    {item.value}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name="opState" label="修改状态" className="selectForm">
            <Select placeholder="请选择修改状态">
              <Select.Option value="">全部</Select.Option>
              {opStateStatusList &&
                opStateStatusList.map((item: any) => (
                  <Select.Option key={item.key} value={item.key}>
                    {item.value}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name="createTime" label="创建日期" className={'minLabel dataPickerCol'}>
            <RangePicker
              format="YYYY-MM-DD"
              allowClear={false}
              inputReadOnly={true}
              ranges={rangesOption}
              onChange={dataPickerOnChange}
            />
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
        columns={columnsList}
        scroll={{ x: 100, y: yClient }}
        bordered
        size="small"
        columnsState={{
          value: columnsStateMap,
          onChange: (val: any) => {
            colLimit(val, setColumnsStateMap);
          },
          // persistenceKey: 'history.location.pathname',
          persistenceType: 'localStorage',
        }}
        components={{
          header: {
            cell: ResizableTitle,
          },
        }}
        options={{ reload: false, density: false }}
        request={async (params: any) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const searchParams = form.getFieldsValue(true);
          // if (startPage) {
          //   params.current = 1;
          //   // params.pageSize = 20;
          // }
          //下面四行原来就已被注释
          // searchParams.createTimeStart =
          //   moment(searchParams.createTime[0]).format('YYYY-MM-DD') + ' ' + '00:00:00';
          // searchParams.createTimeEnd =
          //   moment(searchParams.createTime[1]).format('YYYY-MM-DD') + ' ' + '23:59:59';


          //下面的为了显示页面注释
          // if (searchParams.createTime[0] !== '' && searchParams.createTime[1] !== '') {
          //   searchParams.createTimeStart =
          //     moment(searchParams.createTime[0]).format('YYYY-MM-DD') + ' ' + '00:00:00';
          //   searchParams.createTimeEnd =
          //     moment(searchParams.createTime[1]).format('YYYY-MM-DD') + ' ' + '23:59:59';
          // } else {
          //   searchParams.createTimeStart = '';
          //   searchParams.createTimeEnd = '';
          // }
          // searchParams.pageNumber = params.current;
          // searchParams.pageSize = params.pageSize;
          // const res = await getOrderModificationMonitoring(searchParams);

          // if (res.errCode === 200) {
          //   return Promise.resolve({
          //     data: res.data?.list,
          //     total: res.data?.total,
          //     current: 1,
          //     pageSize: 20,
          //     success: true,
          //   });
          //   res?.data?.list.forEach((e: any, i: number) => {
          //     //? 在表格数据的每一条里面加一个标识，然后用这个标识找到对应要编辑的那一项
          //     e.index = i;
          //   });
          // } else {
          //   message.error(res.errMsg, 3);
          //   return Promise.resolve([]);
          // }
        }}
        pagination={{
          // pageSize: 20,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          // showTotal: total => `共有 ${total} 条数据`,
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
          showQuickJumper: true,
        }}
        rowKey="sid"
        search={false}
        actionRef={ref}
      />
      <AddNewDrawer
        getSid={tableRowData?.sid}
        record={tableRowData}
        tableReload={tableReload}
        orderNo={tableRowData?.orderNo}
        drawerWidth={drawerWidth}
        defaultData={tableRowData}
        isDrawerVisible={isDrawerVisible}
        addNewDrawerClose={addNewDrawerClose}
        addNewDrawerOpen={addNewDrawerOpen}
        type={'view'}
        DrawerTitle={'编辑修改取消申请'}
      />

      <Drawer
        className="AnchorWithTopTipDrawer DrawerWithAnchor DrawerContent"
        width={drawerWidth}
        key={'订单详情查看'}
        title={[
          <span key={'订单编号'}>订单编号: {id}</span>,
          <Tag key={'订单状态'} color="gold" style={{ marginLeft: 10 }}>
            {status}
          </Tag>,
          <p
            key={'申请类型'}
            className="tipsP"
            style={{ marginBottom: '-10px', marginTop: 5, color: '#777' }}
            ref={(node) => {
              if (node) {
                node.style.setProperty('font-size', '12px', 'important');
              }
            }}
          >
            申请类型: <strong>{type}</strong>
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
        <OldOrderDetail
          id={id}
          orderId={orderId}
          key={'order detail'}
          tableRowData={tableRowData}
        />
        {/*tableRowData?.requestTypeName !== '订单修改' ? (
          <NewOrderDetail
            orderNo={orderId}
            key={'order detail'}
            defaultData={tableRowData}
            addNewDrawerClose={approveModalHandleOk}
            tableReload={tableReload}
            getSid={tableRowData?.sid}
            type={'view'}
          />
        ) : (
          <OldOrderDetail
            id={id}
            orderId={orderId}
            key={'order detail'}
            tableRowData={tableRowData}
          />
        )*/}
      </Drawer>
    </div>
  );
};
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <Index />
  </KeepAlive>
);
