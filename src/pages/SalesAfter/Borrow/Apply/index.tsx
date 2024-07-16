import { getByKeys } from '@/services';
// import { pages, updateStatus2 } from '@/services/afterSales';
import { pages } from '@/services/afterSales';
import { SearchOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, DatePicker, Form, Input, message, Select, Space } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import MyDrawer from './components/Drawer/Drawer';
import { colLimit } from '@/services';
// import classNames from 'classnames';

import './style.less';
const Index: React.FC = () => {
  const DrawerRef: any = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const { RangePicker } = DatePicker;
  const ref: any = useRef<ActionType>();
  const [form] = Form.useForm();
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  // const [rowDetail, setRowDetail] = useState('');
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

  const [yClient, setYClient] = useState(900);
  const setDrawerVisible = (record: any) => {
    // console.log(record, 'record');
    history.push({
      //umi文档规定的固定格式
      pathname: '/sales-after/Borrow/Apply/detail', //要跳转的路由
      state: {
        //传递的数据
        data: record.sampleNo,
      },
    });
    // DrawerRef.current.openDrawer(record, false); //?第二个参数传一个空，代表详情
  };
  const colorList = {
    审批中: '#1890FF',
    取消: '#FFADD2',
    审批拒绝: '#FFADD2',
    已完成: '#52C41A',
    审批通过: '#52C41A',
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
    // {
    //   title: 'oa 模拟回调 ',
    //   width: 150,
    //   dataIndex: '12',
    //   render: (_, record: any) => {
    //     return (
    //       <Space>
    //         {record.applyStatusName == '审批中' && (
    //           <Button
    //             size="small"
    //             key={'oa'}
    //             type="link"
    //             onClick={async () => {
    //               const { sampleNo } = record;
    //               await updateStatus2({
    //                 updateStatus: 1212,
    //                 approvalStatus: 80,
    //                 billNo: sampleNo,
    //               });
    //               ref?.current?.reload();
    //             }}
    //           >
    //             去回调
    //           </Button>
    //         )}
    //       </Space>
    //     );
    //   },
    // },
    {
      title: '借样申请编号',
      dataIndex: 'sampleNo',
      width: 170,
      sorter: (a, b) => (a.orderId - b.orderId ? 1 : -1),
      fixed: 'left',
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
      width: 120,
      sorter: (a, b) => (a.orderId - b.orderId ? 1 : -1),
    },
    {
      title: '申请状态',
      dataIndex: 'applyStatusName',
      width: 90,
      // render(_, record) {
      //   return (
      //     <span
      //       className={classNames({
      //         blue: record.applyStatusName === '审批中',
      //         pink: record.applyStatusName !== '取消',
      //         green: record.applyStatusName !== '已完成',
      //       })}
      //     >
      //       {record.applyStatusName}
      //     </span>
      //   );
      // },
      renderText: (text: any, recorder: any) => (
        <span style={{ color: colorList[recorder.applyStatusName] }}>{text}</span>
      ),
      sorter: (a, b) => (a.applyStatusName - b.applyStatusName ? 1 : -1),
    },
    {
      title: '申请标题',
      dataIndex: 'applyTitle',
      width: 200,
      sorter: (a, b) => (a.applyTitle - b.applyTitle ? 1 : -1),
    },
    {
      title: '客户代号',
      dataIndex: 'customerCode',
      width: 90,
      sorter: (a, b) => (a.customerCode - b.customerCode ? 1 : -1),
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 200,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '主销售',
      dataIndex: 'salesName',
      width: 100,
      sorter: (a, b) => (a.salesName - b.salesName ? 1 : -1),
    },
    {
      title: '申请金额',
      dataIndex: 'applyAmount',
      width: 150,
      sorter: (a, b) => (a.applyAmount - b.applyAmount ? 1 : -1),
    },
    {
      title: '成本中心',
      dataIndex: 'costCenterName',
      width: 250,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '联系人',
      dataIndex: 'contactNameR3',
      width: 100,
      sorter: (a, b) => (a.contactNameR3 - b.contactNameR3 ? 1 : -1),
    },
    {
      title: '超额原因',
      dataIndex: 'excessReason',
      width: 150,
      sorter: (a, b) => (a.excessReason - b.excessReason ? 1 : -1),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 100,
      sorter: (a, b) => (a.remark - b.remark ? 1 : -1),
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  // const yClient = window.innerHeight - 350;
  const [orderRequestStatusList, setOrderRequestStatusList]: any = useState([]);
  const reload = () => {
    ref.current.reload();
  };
  useEffect(() => {
    getByKeys({
      list: ['sampleStatusEnum'],
    }).then((res: any) => {
      if (res.errCode === 200) {
        setOrderRequestStatusList(res.data[0].enums);
      }
    });
    //设置select初始值
    form.setFieldsValue({
      applyStatus:
        orderRequestStatusList && orderRequestStatusList[0] ? orderRequestStatusList[0].key : null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 320);
  }, [initialState?.windowInnerHeight]);
  return (
    <div className="omsAntStyle SalesAfter_Borrow">
      <div className="form-content-search">
        <Form
          layout="inline"
          form={form}
          className="ant-advanced-form"
          initialValues={{
            createTime: [moment().subtract(1, 'month'), moment()],
          }}
        >
          <Form.Item name="sampleNo" label="借样申请编号">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item name="applyStatus" label="申请状态" style={{ marginLeft: '-20px' }}>
            <Select placeholder="请选择申请状态">
              <Select.Option value="">全部</Select.Option>
              {orderRequestStatusList &&
                orderRequestStatusList.map((item: any) => (
                  <Select.Option key={item.code} value={item.code}>
                    {item.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name="customerName" label="客户名称" style={{ marginLeft: '-20px' }}>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item
            name="createTime"
            label="创建时间"
            className={'dataPickerCol dataPickerItem'}
            style={{ marginLeft: '-20px' }}
          >
            <RangePicker format="YYYY-MM-DD" allowClear={false} inputReadOnly={true} />
          </Form.Item>
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
            }
            searchParams.startTime = moment(searchParams.createTime[0]).format('YYYY-MM-DD');
            searchParams.endTime = moment(searchParams.createTime[1]).format('YYYY-MM-DD');
            searchParams.pageNumber = params.current;
            searchParams.pageSize = params.pageSize;
            const res = await pages(searchParams);
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
          headerTitle={
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  history.push(`/sales-after/borrow/add`);
                }}
              >
                新增借样申请
              </Button>
            </Space>
          }
        />
      </div>
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
