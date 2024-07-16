import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Cascader, DatePicker, Drawer, Form, Input, message, Space, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import AddNew from './components/AddNew';
import OrderDetail from './components/OrderDetail';
import { colLimit } from '@/services';
import { getOMAList, getOrderDateList } from '@/services/SalesOrder';
import { SearchOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';
import './index.less';
const Index: React.FC = () => {
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const { initialState } = useModel('@@initialState');
  const { RangePicker } = DatePicker;
  const ref: any = useRef<ActionType>();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  // const key = new Date().getTime();
  const [id, setId]: any = useState('');
  const [orderId, setOrderId]: any = useState('');
  const [tableRowData, setTableRowData]: any = useState({});
  const [status, setStatus] = useState('订单审批中');
  const [type, setType] = useState('订单修改');
  const [yClient, setYClient] = useState(900);
  const [requestTypeList, setRequestTypeList]: any = useState([]);
  useEffect(() => {
    const Fn = async () => {
      const res: any = await getOrderDateList({ type: 'orderRequestType' });
      if (res.errCode !== 200) {
        message.error('失败' + res.errMsg);
      }
      const res2: any = await getOrderDateList({ type: 'orderUpdateType' });
      if (res2.errCode !== 200) {
        message.error('失败' + res2.errMsg);
      }
      const res3: any = await getOrderDateList({ type: 'orderRequestCancelType' });
      if (res3.errCode !== 200) {
        message.error('失败' + res3.errMsg);
      }
      res.data.dataList.forEach((ele: any, index: any) => {
        //?先把三组数据处理好，放入级联内部
        if (index < 2) {
          ele.children = res3.data.dataList;
        } else {
          ele.children = res2.data.dataList;
        }
      });
      setRequestTypeList(res.data.dataList);
    };
    Fn();
  }, []);

  const SideBar = document.getElementsByClassName('ant-layout-sider');
  const [drawerWidth, setDrawerWidth] = useState(window.innerWidth - 208);
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
  const addNewDrawerClose = () => {
    setIsDrawerVisible(false);
  };
  function addNewApplication() {
    const sideWidth = SideBar[0]?.clientWidth || 0;
    setDrawerWidth(window.innerWidth - sideWidth);
    setIsDrawerVisible(true);
  }

  const colorList = {
    审批中: '#1890FF',
    取消: '#FFADD2',
    审批拒绝: '#FFADD2',
    已完成: '#52C41A',
    审批通过: '#52C41A',
  };
  // Draft(10,"草稿"),
  // Processing(20,"审批中"),
  // Approved(80,"审批通过"),
  // ApprovalDenied(90,"审批拒绝"),
  // Cancel(99,"取消");
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
          key={'详情'}
          type="link"
          onClick={() => {
            const sideWidth = SideBar[0]?.clientWidth || 0;
            setDrawerWidth(window.innerWidth - sideWidth);
            setId(record.requestNo);
            setOrderId(record.orderNo);
            setType(record.requestTypeName);
            if (record.requestStatusName != '') {
              setStatus(record.requestStatusName);
            } else {
              setStatus('订单审批中');
            }
            setTableRowData(record);
            setIsModalVisible(true);
          }}
        >
          {' '}
          详情{' '}
        </Button>,
      ],
      fixed: 'left',
    },
    {
      title: '修改申请编号',
      dataIndex: 'requestNo',
      width: 180,
      fixed: 'left',
      sorter: (a, b) => (a.requestNo - b.requestNo ? 1 : -1),
    },
    {
      title: '申请订单',
      dataIndex: 'orderNo',
      width: 100,
      sorter: (a, b) => (a.orderNo - b.orderNo ? 1 : -1),
      fixed: 'left',
    },
    {
      title: '创建时间',
      width: 150,
      valueType: 'dateTime',
      dataIndex: 'createTime',
      sorter: (a, b) => (a.createTime - b.createTime ? 1 : -1),
    },
    {
      title: '创建人',
      width: 150,
      dataIndex: 'createName',
      sorter: (a, b) => (a.createName - b.createName ? 1 : -1),
    },

    {
      title: '申请状态',
      dataIndex: 'requestStatusName',
      width: 150,
      renderText: (text: any, recorder: any) => (
        <span style={{ color: colorList[recorder.requestStatusName] }}>{text}</span>
      ),
      sorter: (a, b) => (a.requestStatusName - b.requestStatusName ? 1 : -1),
    },
    {
      title: '申请类型',
      dataIndex: 'requestTypeName',
      width: 100,
      sorter: (a, b) => (a.requestTypeName - b.requestTypeName ? 1 : -1),
    },
    {
      title: '订单渠道',
      dataIndex: 'orderChannelName',
      width: 150,
      render(text, record) {
        if (record.orderChannelName) {
          return record.orderChannelName;
        } else {
          return '-';
        }
      },
      sorter: (a, b) => (a.orderChannelName - b.orderChannelName ? 1 : -1),
    },
    {
      title: '取消类型',
      dataIndex: 'cancelTypeName',
      width: 150,
      sorter: (a, b) => (a.cancelTypeName - b.cancelTypeName ? 1 : -1),
    },
    {
      title: '取消原因',
      dataIndex: 'cancelReasonName',
      width: 150,
      sorter: (a, b) => (a.cancelReasonName - b.cancelReasonName ? 1 : -1),
    },
    {
      title: '修改类型',
      width: 150,
      dataIndex: 'updateTypeName',
      sorter: (a, b) => (a.updateTypeName - b.updateTypeName ? 1 : -1),
    },
    {
      title: '修改原因',
      width: 150,
      dataIndex: 'updateReasonName',
      sorter: (a, b) => (a.updateReasonName - b.updateReasonName ? 1 : -1),
    },
    {
      title: '申请备注描述',
      width: 150,
      dataIndex: 'remark',
      sorter: (a, b) => (a.remark - b.remark ? 1 : -1),
    },
    {
      title: '客户代号',
      dataIndex: 'customerCode',
      width: 150,
      sorter: (a, b) => (a.customerCode - b.customerCode ? 1 : -1),
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 200,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '最后修改人',
      width: 150,
      dataIndex: 'updateName',
      sorter: (a, b) => (a.updateName - b.updateName ? 1 : -1),
    },
    {
      title: '最后修改时间',
      valueType: 'dateTime',
      width: 150,
      dataIndex: 'updateTime',
      sorter: (a, b) => (a.updateTime - b.updateTime ? 1 : -1),
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
    <div className="omsAntStyle OrderModificationApplicationStyle" id="omsAntStyle">
      <div className="form-content-search">
        <Form
          layout="inline"
          form={form}
          className="ant-advanced-form"
          initialValues={{ createTime: [moment().subtract(1, 'month'), moment()] }}
        >
          <Form.Item name="requestNo" label="申请编号">
            <Input placeholder="请输入申请编号" allowClear />
          </Form.Item>
          <Form.Item name="orderNo" label="订单编号">
            <Input placeholder="请输入订单编号" allowClear />
          </Form.Item>
          <Form.Item name="requestTypeArr" label="申请类型" className="requestTypeArr">
            {/* <Select placeholder="请选择申请类型">
              <Select.Option value="">全部</Select.Option>
              {requestTypeList &&
                requestTypeList.map((item: any) => (
                  <Select.Option key={item.key} value={item.key}>
                    {item.value}
                  </Select.Option>
                ))}
            </Select> */}
            <Cascader
              options={requestTypeList}
              fieldNames={{ label: 'value', value: 'key' }}
              changeOnSelect
              placeholder="请选择申请类型"
            />
          </Form.Item>
          <Form.Item name="customerName" label="客户名称">
            <Input placeholder="请输入客户名称" allowClear />
          </Form.Item>
          <Form.Item name="createName" label="创建人">
            <Input placeholder="请输入创建人" allowClear />
          </Form.Item>
          <Form.Item name="createTime" label="创建时间" className={'dataPickerCol'}>
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
          searchParams.startDate = moment(searchParams.createTime[0]).format('YYYY-MM-DD');
          searchParams.endDate = moment(searchParams.createTime[1]).format('YYYY-MM-DD');
          searchParams.pageNumber = params.current;
          searchParams.pageSize = params.pageSize;
          // console.log(searchParams, 'searchParams');
          if (searchParams?.requestTypeArr?.length > 0) {
            searchParams.requestType = searchParams?.requestTypeArr[0];
            if (searchParams?.requestType == '1' || searchParams?.requestType == '2') {
              searchParams.cancelType = searchParams?.requestTypeArr[1];
              searchParams.cancelReason = searchParams?.requestTypeArr[2];
              searchParams.updateType = '';
              searchParams.updateReason = '';
            } else if (searchParams?.requestType == '3') {
              searchParams.updateType = searchParams?.requestTypeArr[1];
              searchParams.updateReason = searchParams?.requestTypeArr[2];
              searchParams.cancelType = '';
              searchParams.cancelReason = '';
            }
          }
          const res = await getOMAList(searchParams);
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
        rowKey="requestNo"
        search={false}
        actionRef={ref}
        headerTitle={
          <Space>
            <Button type="primary" size="small" onClick={addNewApplication}>
              新增申请
            </Button>
          </Space>
        }
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
        <OrderDetail id={id} orderId={orderId} key={'order detail'} tableRowData={tableRowData} />
      </Drawer>
      <Drawer
        className="DrawerContent"
        width={drawerWidth}
        key={'新增订单修改申请Drawer'}
        title={[<span key={'新增订单修改申请'}>新增订单修改申请</span>]}
        visible={isDrawerVisible}
        onClose={() => {
          setIsDrawerVisible(false);
        }}
        extra={
          <Space>
            <Button key="close" onClick={addNewDrawerClose}>
              关闭
            </Button>
          </Space>
        }
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={addNewDrawerClose}>
            关闭
          </Button>,
        ]}
      >
        <AddNew addNewDrawerClose={addNewDrawerClose} tableReload={tableReload} />
      </Drawer>
    </div>
  );
};

// export default Index;
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={location.pathname} saveScrollPosition="screen">
    <Index />
  </KeepAlive>
);
