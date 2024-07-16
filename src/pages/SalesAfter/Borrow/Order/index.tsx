import { DownOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, DatePicker, Form, Input, message, Select, Space } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useModel, history } from 'umi';
import MyDrawer from './components/Drawer/Drawer';
import { colLimit, getByKeys } from '@/services';
import { orderpage } from '@/services/afterSales';
import './style.less';
import { getOrderDateList } from '@/services/SalesOrder';
const Index: React.FC = () => {
  const DrawerRef: any = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const { RangePicker } = DatePicker;
  const ref: any = useRef<ActionType>();
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [pageParams, setParams] = useState(); //?把当前搜索参数传递给订单详情弹框
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const [orderStatusList, setOrderStatusList]: any = useState([]);
  const [fold, setFold] = useState(false);
  function UpDown() {
    setFold(!fold);
  }
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

  const [yClient, setYClient] = useState(900);
  const setDrawerVisible = (record: any) => {
    DrawerRef.current.openDrawer(record, false); //?第二个参数传一个空，代表详情
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
      width: 70,
      render: (_, record) => [
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
      title: '订单编号',
      dataIndex: 'sampleOrderNo',
      width: 120,
      sorter: (a, b) => (a.orderId - b.orderId ? 1 : -1),
      fixed: 'left',
    },
    {
      title: '业务类型',
      width: 150,
      dataIndex: 'businessTypeName',
      sorter: (a, b) => (a.businessTypeName - b.businessTypeName ? 1 : -1),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 150,
      valueType: 'dateTime',
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '订单状态',
      dataIndex: 'sampleOrderStautsName',
      width: 120,
      sorter: (a, b) => (a.orderId - b.orderId ? 1 : -1),
    },

    {
      title: '所属公司',
      dataIndex: 'companyName',
      width: 150,
      sorter: (a, b) => (a.orderId - b.orderId ? 1 : -1),
    },
    {
      title: '客户代号',
      dataIndex: 'customerCode',
      width: 120,
      sorter: (a, b) => (a.orderId - b.orderId ? 1 : -1),
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 200,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: 'R3联系人名称',
      dataIndex: 'contactNameR3',
      width: 100,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '主销售',
      dataIndex: 'salesName',
      width: 150,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '成本中心',
      dataIndex: 'costCenterName',
      width: 150,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '创建人',
      dataIndex: 'createName',
      width: 150,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  const reload = () => {
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

    // 新的
    // 订单状态 新系统订单状态
    getOrderDateList({ type: 'orderStatus' }).then((res: any) => {
      if (res.errCode === 200) {
        res?.data?.dataList?.unshift({
          key: '',
          value: '全部',
        });
        setOrderStatusList(
          res?.data?.dataList?.map((io: any) => ({
            ...io,
            label: io.value,
            value: io.key,
          })),
        );
      }
    });
  }, []);

  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 320);
  }, [initialState?.windowInnerHeight]);
  return (
    <div className="omsAntStyle SalesAfter_Order">
      <div className="form-content-search">
        <Form
          layout="inline"
          form={form}
          className="ant-advanced-form"
          initialValues={{
            createTime: [moment().subtract(1, 'month'), moment()],
            businessType: '',
            jvCompanyName: '',
          }}
        >
          <Form.Item name="sampleOrderNo" label="订单编号">
            <Input placeholder="请输入订单编号" />
          </Form.Item>
          <Form.Item name="customerCode" label="客户代号">
            <Input placeholder="请输入客户代号" />
          </Form.Item>
          <Form.Item name="customerName" label="客户名称">
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          <Form.Item name="sampleNo" label="借样申请">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          {!fold && (
            <>
              <Form.Item name="salesName" label="销售人员">
                <Input placeholder="请输入销售人员" />
              </Form.Item>
              <Form.Item name="costCenter" label="成本中心">
                <Input placeholder="请输入成本中心" />
              </Form.Item>
              <Form.Item name="sampleOrderStauts" label="订单状态">
                <Select placeholder="请选择订单状态">
                  {orderStatusList?.length > 0 &&
                    orderStatusList.map((item: any) => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                </Select>
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
              <Form.Item name="createTime" label="创建时间" className={'dataPickerCol'}>
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
                  ref.current?.reload();
                  setStartPage(true);
                }}
              >
                查 询
              </Button>
              <Button
                key={'重置'}
                onClick={() => {
                  form.resetFields();
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
            setParams(searchParams);
            const res = await orderpage(searchParams);
            if (res.errCode === 200) {
              res.data?.list?.forEach((e: any, i: any) => {
                e.index = i;
              });
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
        />
      </div>

      <MyDrawer pageParams={pageParams} ref={DrawerRef} reload={reload} />
    </div>
  );
};

export default Index;
