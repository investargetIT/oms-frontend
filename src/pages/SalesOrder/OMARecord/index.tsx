import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button, Space, Form, Input, DatePicker, Select, message, Tag, Drawer, Modal } from 'antd';
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
import {
  getOrderDateList,
  getApplyOrderDetail,
  cancelAndReleaseOrder,
} from '@/services/SalesOrder';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import AddNewDrawer from '@/pages/SalesOrder/Order/components/ApplyCancellation/EditDrawer';
// import NewOrderDetail from './components/OrderDetail';
import OldOrderDetail from '@/pages/SalesOrder/OrderModificationApplication/components/OrderDetail';
// import './index.less';

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
    if (dates) {
      console.log('From: ', dates[0], ', to: ', dates[1]);
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    } else {
      console.log('Clear');
      form.getFieldsValue(true).createTime = ['', ''];
    }
  };

  // const [openDrewerType, setOpenDrewerType]:any = useState('view')
  // const [DrawerTitle, setDrawerTitle]:any = useState('订单取消申请详情')

  const SideBar: any = document.getElementsByClassName('ant-layout-sider');
  const [drawerWidth, setDrawerWidth] = useState(window.innerWidth - 208);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const [id, setId]: any = useState('');
  const [orderId, setOrderId]: any = useState('');
  const [tableRowData, setTableRowData]: any = useState({});
  const [status, setStatus] = useState('订单审批中');
  const [type, setType] = useState('订单修改');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [applyType, setApplyType]: any = useState('view');

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
  const releaseOrder = (sid: any) => {
    Modal.confirm({
      title: '您确定要取消本次申请吗？',
      icon: <ExclamationCircleOutlined />,
      // content: '这将把您之前的操作全部还原。',
      onOk() {
        cancelAndReleaseOrder(sid)
          .then((res: any) => {
            if (res?.errCode === 200) {
              tableReload();
              message.success('本次申请已取消');
            } else {
              message.error(res?.errMsg);
            }
          })
          .finally(() => {
            return;
          })
          .catch((errorInfo) => {
            message.error(errorInfo, 3);
          });
      },
      onCancel() {},
    });
  };

  const colorList = {
    草稿: '#faad14',
    审批中: '#1890ff',
    审批通过: '#52c41a',
    审批拒绝: '#FFADD2',
    取消: 'rgb(0 0 0 / 25%)',
    已完成: '#52C41A',
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
      width: 120,
      render: (_, record) => {
        return (
          <>
            <Button
              size="small"
              key={'详情'}
              type="link"
              onClick={() => {
                // const sideWidth = SideBar[0]?.clientWidth || 0;
                // setDrawerWidth(window.innerWidth - sideWidth);
                // setId(record.requestNo);
                // setOrderId(record.orderNo);
                // setType(record.requestTypeName);
                // if (record.requestStatusName != '') {
                //   setStatus(record.requestStatusName);
                // } else {
                //   setStatus('订单审批中');
                // }
                // setTableRowData(record);
                // setIsModalVisible(true);
                const sideWidth = SideBar[0]?.clientWidth || 0;
                setDrawerWidth(window.innerWidth - sideWidth);
                setApplyType('view');
                setId(record.requestNo);
                setOrderId(record.orderNo);
                setType(record.requestTypeName);
                if (record.requestStatusName != '') {
                  setStatus(record.requestStatusName);
                } else {
                  setStatus('订单审批中');
                }
                setTableRowData(record);
                if (record?.newFlow === 1 && record?.requestTypeName !== '订单修改') {
                  addNewDrawerOpen();
                } else {
                  setIsModalVisible(true);
                }
              }}
            >
              {' '}
              详情{' '}
            </Button>
            {record.requestStatusName === '草稿' && (
              <>
                <Button
                  size="small"
                  key={'编辑'}
                  type="link"
                  onClick={() => {
                    const sideWidth = SideBar[0]?.clientWidth || 0;
                    setDrawerWidth(window.innerWidth - sideWidth);
                    setApplyType('edit');
                    setId(record.requestNo);
                    setOrderId(record.orderNo);
                    setType(record.requestTypeName);
                    if (record.requestStatusName != '') {
                      setStatus(record.requestStatusName);
                    } else {
                      setStatus('订单审批中');
                    }
                    setTableRowData(record);
                    addNewDrawerOpen();
                  }}
                >
                  {' '}
                  编辑{' '}
                </Button>
                <Button
                  size="small"
                  key={'取消申请'}
                  type="link"
                  onClick={() => {
                    releaseOrder(record.sid);
                  }}
                >
                  {' '}
                  取消{' '}
                </Button>
              </>
            )}
          </>
        );
      },
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
    item.align = 'center';
  });

  const [colList, setColList] = useState([]);
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();

  const [requestStatusList, setRequestStatusList] = useState([]);
  const [orderChannelList, setOrderChannelList]: any = useState([]);

  useEffect(() => {
    setColList(columns);

    getOrderDateList({ type: 'requestStatus' }).then((res: any) => {
      if (res.errCode === 200) {
        setRequestStatusList(res?.data?.dataList);
      }
    });
    getOrderDateList({ type: 'orderChannel' }).then((res: any) => {
      if (res.errCode === 200) {
        setOrderChannelList(res.data.dataList);
      }
    });
    //设置select初始值
    form.setFieldsValue({
      requestChannel: orderChannelList && orderChannelList[0] ? orderChannelList[0].key : '',
      orderChannel: orderChannelList && orderChannelList[0] ? orderChannelList[0].key : '',
      requestStatus: requestStatusList && requestStatusList[0] ? requestStatusList[0].key : '',
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
      <div className="form-content-search topSearchCol withSelectMod">
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
          <Form.Item name="customerCode" label="客户号">
            <Input placeholder="请输入客户号" allowClear />
          </Form.Item>
          <Form.Item name="customerName" label="客户名称">
            <Input placeholder="请输入客户名称关键字" allowClear />
          </Form.Item>
          <Form.Item name="createName" label="创建人">
            <Input placeholder="请输入员工账号" allowClear />
          </Form.Item>
          <Form.Item name="requestStatus" label="申请状态" className="selectForm">
            <Select placeholder="请选择申请状态">
              <Select.Option value="">全部</Select.Option>
              {requestStatusList &&
                requestStatusList.map((item: any) => (
                  <Select.Option key={item.key} value={item.key}>
                    {item.value}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item name="requestChannel" label="申请渠道" className="selectForm">
            <Select placeholder="请选择申请渠道">
              <Select.Option value="">全部</Select.Option>
              {orderChannelList &&
                orderChannelList.map((item: any) => (
                  <Select.Option key={item.value} value={item.key}>
                    {item.value}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item name="orderChannel" label="原订单渠道" className="selectForm">
            <Select placeholder="请选择原订单渠道">
              <Select.Option value="">全部</Select.Option>
              {orderChannelList &&
                orderChannelList.map((item: any) => (
                  <Select.Option key={item.value} value={item.key}>
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
          if (startPage) {
            params.current = 1;
            // params.pageSize = 20;
          }
          // searchParams.createTimeStart =
          //   moment(searchParams.createTime[0]).format('YYYY-MM-DD') + ' ' + '00:00:00';
          // searchParams.createTimeEnd =
          //   moment(searchParams.createTime[1]).format('YYYY-MM-DD') + ' ' + '23:59:59';

          if (searchParams.createTime[0] !== '' && searchParams.createTime[1] !== '') {
            searchParams.createTimeStart =
              moment(searchParams.createTime[0]).format('YYYY-MM-DD') + ' ' + '00:00:00';
            searchParams.createTimeEnd =
              moment(searchParams.createTime[1]).format('YYYY-MM-DD') + ' ' + '23:59:59';
          } else {
            searchParams.createTimeStart = '';
            searchParams.createTimeEnd = '';
          }
          searchParams.pageNumber = params.current;
          searchParams.pageSize = params.pageSize;
          const res = await getApplyOrderDetail(searchParams);

          if (res.errCode === 200) {
            return Promise.resolve({
              data: res.data?.list,
              total: res.data?.total,
              current: 1,
              pageSize: 20,
              success: true,
            });
            res?.data?.list.forEach((e: any, i: number) => {
              //? 在表格数据的每一条里面加一个标识，然后用这个标识找到对应要编辑的那一项
              e.index = i;
            });
          } else {
            message.error(res.errMsg, 3);
            return Promise.resolve([]);
          }
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
        type={applyType}
        DrawerTitle={'编辑修改取消申请'}
      />
      <Drawer
        className="AnchorWithTopTipDrawer DrawerWithAnchor DrawerContent"
        width={drawerWidth}
        key={'订单详情查看'}
        title={[
          <span key={'修改取消申请编号'}>修改取消申请编号: {id}</span>,
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
