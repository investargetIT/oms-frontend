import { getOrderDateList, queryProduct } from '@/services/SalesOrder';
import { DownOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, DatePicker, Form, Input, message, Modal, Select, Space } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useModel, history } from 'umi';
import MyDrawer from './components/Drawer/Drawer';
import MyModal from './components/Modal/Modal';
import { colLimit } from '@/services';
import './style.less';
const Index: React.FC = () => {
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const ModalRef: any = useRef<ActionType>();
  const DrawerRef: any = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const { RangePicker } = DatePicker;
  const ref: any = useRef<ActionType>();
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [fold, setFold] = useState(false);
  function UpDown() {
    setFold(!fold);
  }
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  // const cancelReplace = async (record: { sid: any }) => {
  //   const res = await cancelProduct(record.sid);
  //   if (res.errCode == 200) {
  //     message.success('取消成功');
  //   } else {
  //     message.error('取消失败' + res.errMsg);
  //   }
  // };
  const [yClient, setYClient] = useState(900);
  const addOrder = () => {
    // ? 打开弹框
    ModalRef.current.openModal();
  };
  const setDrawerVisible = (record: any): any => {
    // console.log(record, '查看订单号');
    if (!record) return message.error('该订单无订单号');
    DrawerRef?.current?.openDrawer(record.orderNo, false, record); //?第二个参数传一个空，代表详情
  };
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
      width: 100,
      render: (_, record) => [
        // <Button
        //   size="small"
        //   key={'取消'}
        //   type="link"
        //   onClick={() => {
        //     cancelReplace(record);
        //   }}
        // >
        //   取消
        // </Button>,
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
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 90,
      sorter: (a, b) => (a.orderId - b.orderId ? 1 : -1),
      fixed: 'left',
    },
    {
      title: '申请编号',
      dataIndex: 'sid',
      width: 90,
      sorter: (a, b) => (a.orderId - b.orderId ? 1 : -1),
      fixed: 'left',
    },
    {
      title: '状态',
      dataIndex: 'statusName',
      width: 90,
      sorter: (a, b) => (a.orderId - b.orderId ? 1 : -1),
    },
    {
      title: '负责销售',
      dataIndex: 'salesName',
      width: 90,
      sorter: (a, b) => (a.orderId - b.orderId ? 1 : -1),
    },
    {
      title: '渠道',
      dataIndex: 'channelName',
      width: 90,
      sorter: (a, b) => (a.orderId - b.orderId ? 1 : -1),
    },
    {
      title: '申请替换总金额',
      dataIndex: 'replaceAmount',
      width: 120,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '替代品总金额',
      dataIndex: 'substituteAmount',
      width: 100,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '客户代号',
      dataIndex: 'customerCode',
      width: 150,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 250,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 150,
      valueType: 'dateTime',
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '创建人',
      dataIndex: 'createName',
      width: 100,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '最后修改时间',
      valueType: 'dateTime',
      dataIndex: 'updateTime',
      width: 150,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '最后修改人',
      dataIndex: 'updateName',
      width: 100,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  // const yClient = window.innerHeight - 350;
  const [orderRequestStatusList, setOrderRequestStatusList]: any = useState([]);
  const [orderChannelList, setOrderChannelList]: any = useState([]);
  const reload = () => {
    ref?.current?.reload(true);
  };
  useEffect(() => {
    // getOrderDateList({ type: 'workflow' }).then((res: any) => {
    //   if (res.errCode === 200) {
    //     setOrderRequestStatusList(res.data.dataList);
    //   }
    // });
    // getOrderDateList({ type: 'orderChannel' }).then((res: any) => {
    //   if (res.errCode === 200) {
    //     setOrderChannelList(res.data.dataList);
    //   }
    // });
    //设置select初始值
    form.setFieldsValue({
      requestStatus:
        orderRequestStatusList && orderRequestStatusList[0] ? orderRequestStatusList[0].key : '',
      channel: orderChannelList && orderChannelList[0] ? orderChannelList[0].key : '',
    });
  }, []);

  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 320);
  }, [initialState?.windowInnerHeight]);
  return (
    <div className="omsAntStyle ODModificationStyle">
      <div className="form-content-search">
        <Form
          layout="inline"
          form={form}
          className="ant-advanced-form"
          initialValues={{
            createTime: [moment().subtract(1, 'month'), moment()],
            channel: '',
            requestStatus: '',
          }}
        >
          <Form.Item name="orderNo" label="订单编号">
            <Input placeholder="请输入订单编号" allowClear />
          </Form.Item>
          <Form.Item name="customerCode" label="客户编号">
            <Input placeholder="请输入客户编号" allowClear />
          </Form.Item>
          <Form.Item name="customerName" label="客户名称">
            <Input placeholder="请输入" allowClear />
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
          {!fold && (
            <>
              <Form.Item name="requestStatus" label="申请状态">
                <Select placeholder="请选择申请状态">
                  <Select.Option value="">全部</Select.Option>
                  {orderRequestStatusList &&
                    orderRequestStatusList.map((item: any) => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item name="createTime" label="创建时间" className="dateTimeItem">
                <RangePicker format="YYYY-MM-DD" allowClear={false} inputReadOnly={true} />
              </Form.Item>
            </>
          )}
          <Form.Item className="btn-search">
            <Space>
              <Button
                key={'查询'}
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => {
                  ref?.current?.reload(true);
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
      <div className="TableBox">
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
          request={async (params) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            const searchParams = form.getFieldsValue(true);
            if (startPage) {
              params.current = 1;
              // params.pageSize = 20;
            }
            searchParams.startTime = moment(searchParams.createTime[0]).format('YYYY-MM-DD');
            searchParams.endTime = moment(searchParams.createTime[1]).format('YYYY-MM-DD');
            searchParams.pageNumber = params.current;
            searchParams.pageSize = params.pageSize;
            // const res = await queryProduct(searchParams);
            // res?.data?.list.forEach((e: any, i: any) => {
            //   e.index = i;
            // });
            // if (res.errCode === 200) {
            //   return Promise.resolve({
            //     data: res.data?.list,
            //     total: res.data?.total,
            //     success: true,
            //   });
            // } else {
            //   Modal.error(res.errMsg);
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
          rowKey="index"
          search={false}
          tableAlertRender={false}
          actionRef={ref}
          className="Mytable"
          headerTitle={
            <Space>
              <Button type="primary" size="small" onClick={addOrder}>
                新增
              </Button>
            </Space>
          }
        />
      </div>
      <MyModal ref={ModalRef} reload={reload} />
      <MyDrawer ref={DrawerRef} reload={reload} />
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
