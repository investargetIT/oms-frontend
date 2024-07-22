import React, { useState, useRef, useEffect, createRef } from 'react';
import { Form, Input, Button, Space, DatePicker, Select, Drawer, message, Tag } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { ProFormSelect } from '@ant-design/pro-form';
// import MyDrawer from './components/Drawer/Drawer';
import OrderDetail from './components/OrderDetail';
import { DownOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';
import Mymodal from './components/Modal';
import { getOrderList, getOrderDateList } from '@/services/SalesOrder/index';
import './style.css';
import { colLimit, getByKeys } from '@/services';
import { queryBySaffName } from '@/services/ApprovalFlow';

const Index: React.FC = () => {
  const ChildRef: any = createRef();
  const ModalRef: any = useRef();
  const { initialState } = useModel('@@initialState');
  const { RangePicker } = DatePicker;
  const ref = useRef<ActionType>();
  const [form] = Form.useForm();
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [yClient, setYClient] = useState(900);
  const drawerWidth = window.innerWidth;
  // const key = new Date().getTime();
  const [tableRowData, setTableRowData] = useState({});
  const [id, setId] = useState('');
  const [orderTypeList, setOrderTypeList]: any = useState([]);
  const [orderChannelList, setOrderChannelList] = useState([]);
  const [payment, setPayment]: any = useState([]);
  const [selectOrderNo, setSelectOrderNo]: any = useState([]);
  // const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [fold, setFold] = useState(false);
  function UpDown() {
    setFold(!fold);
  }
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

  useEffect(() => {
    // getOrderDateList({ type: 'orderType' }).then((res: any) => {
    //   if (res.errCode === 200) {
    //     setOrderTypeList(res.data.dataList);
    //   }
    // });
    // getOrderDateList({ type: 'orderChannel' }).then((res: any) => {
    //   if (res.errCode === 200) {
    //     setOrderChannelList(res.data.dataList);
    //   }
    // });
    // getOrderDateList({ type: 'paymentTerm', code: 'all' }).then((res: any) => {
    //   if (res.errCode === 200) {
    //     // const arr = [];
    //     // for (let i = 0; i < res?.data?.dataList?.length; i++) {
    //     //   const element = res?.data?.dataList[i];
    //     //   for (let j = 0; j < element.children.length; j++) {
    //     //     const ele = element.children[j];
    //     //     arr.push(ele);
    //     //   }
    //     // }
    //     setPayment(res?.data?.dataList);
    //   }
    // });

    //设置select初始值
    form.setFieldsValue({
      category: orderTypeList && orderTypeList[0] ? orderTypeList[0].key : '',
      channel: orderChannelList && orderChannelList[0] ? orderChannelList[0].key : '',
    });
  }, []);

  // const rowSelection = {
  //   onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
  //     //左侧单选框触发的时候会执行的函数
  //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  //     setSelectOrderNo(selectedRowKeys);
  //   },
  //   getCheckboxProps: (record: any) => {
  //     return {
  //       disabled: record.name === 'Disabled User', // Column configuration not to be checked
  //       name: record.name,
  //     };
  //   },
  // };
  // const onSelectChange = (selectedRowKeyss: React.Key[], selectedRowss: any[]) => {
  //   // setSelectedRows(selectedRowss);
  //   setSelectedRowKeys(selectedRowKeyss);
  //   setSelectOrderNo(selectedRowKeyss);
  // console.log(selectedRowKeyss);
  // };

  const rowSelection = {
    selectedRowKeys,
    // onChange: onSelectChange,
    onSelect: (record, selected) => {
      // console.log("record:", record)
      let keys = [...selectedRowKeys];
      if (selected) {
        keys = [...selectedRowKeys, record.orderNo];
      } else {
        keys = selectedRowKeys.filter((item) => item !== record.orderNo);
      }
      setSelectedRowKeys(keys);
      setSelectOrderNo(keys);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      if (selected) {
        const addCheckedKeys = changeRows.map((item) => {
          return item.orderNo;
        });
        setSelectedRowKeys([...selectedRowKeys, ...addCheckedKeys]);
        setSelectOrderNo([...selectedRowKeys, ...addCheckedKeys]);
      } else {
        const subCheckedKeys = selectedRowKeys.filter((orderNo) => {
          return !changeRows.some((item) => {
            return item.orderNo === orderNo;
          });
        });
        setSelectedRowKeys(subCheckedKeys);
        setSelectOrderNo(subCheckedKeys);
      }
    },
  };

  const releaseOrder = () => {
    console.log(ModalRef);
    console.log(selectOrderNo);
    if (JSON.stringify(selectOrderNo) == '[]') {
      message.error('请至少选择一个订单！', 3);
    } else {
      ModalRef.current.openModal();
    }
  };

  function clearSelect() {
    setSelectOrderNo([]);
    setSelectedRowKeys([]);
  }
  const [isModalVisible, setIsModalVisible] = useState(false);
  const approveModalHandleOk = () => {
    setIsModalVisible(false);
    console.log(ChildRef.current);
  };
  function tableReload() {
    ref.current?.reload();
  }

  const [statusList, setStatusList] = useState<any>([]);
  useEffect(() => {
    // 业务类型list
    // getByKeys({ list: ['businessTypeEnum'] }).then((res: any) => {
    //   if (res?.errCode === 200) {
    //     if (res?.data[0] == null) return;
    //     setStatusList(
    //       res?.data?.map((io: any) => {
    //         return io.enums.map((ic: any) => ({
    //           ...ic,
    //           key: ic.code,
    //           value: ic.name,
    //         }));
    //       }),
    //     );
    //   }
    // });
  }, []);

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
          key={'修改'}
          type="link"
          onClick={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            setTableRowData(record);
            setId(record.orderNo);
            // setDrawerVisible();
            setIsModalVisible(true);
          }}
        >
          {' '}
          修改{' '}
        </Button>,
      ],
      fixed: 'left',
    },
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      width: 90,
      sorter: (a, b) => (a.orderNo - b.orderNo ? 1 : -1),
      fixed: 'left',
    },
    {
      title: '业务类型',
      width: 150,
      dataIndex: 'businessTypeStr',
      sorter: (a, b) => (a.businessTypeStr - b.businessTypeStr ? 1 : -1),
    },

    {
      title: '放单备注',
      dataIndex: 'releaseRemark',
      width: 90,
      sorter: (a, b) => (a.releaseRemark - b.releaseRemark ? 1 : -1),
    },
    {
      title: '支付条件',
      dataIndex: 'paymentTerms',
      width: 90,
      sorter: (a, b) => (a.paymentTerms - b.paymentTerms ? 1 : -1),
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      width: 200,
      sorter: (a, b) => (a.paymentMethod - b.paymentMethod ? 1 : -1),
    },
    {
      title: '主销售',
      dataIndex: 'salesName',
      width: 90,
      sorter: (a, b) => (a.salesName - b.salesName ? 1 : -1),
    },
    {
      title: '客户号',
      dataIndex: 'customerCode',
      width: 90,
      sorter: (a, b) => (a.customerCode - b.customerCode ? 1 : -1),
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 250,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '所属公司',
      dataIndex: 'companyName',
      width: 250,
      sorter: (a, b) => (a.companyName - b.companyName ? 1 : -1),
    },
    {
      title: '销售主管',
      dataIndex: 'salesSupervisor',
      width: 100,
      sorter: (a, b) => (a.salesSupervisor - b.salesSupervisor ? 1 : -1),
    },
    {
      title: '总计金额含税',
      dataIndex: 'amount',
      width: 150,
      sorter: (a, b) => (a.amount - b.amount ? 1 : -1),
    },
    {
      title: '创建人',
      dataIndex: 'createName',
      width: 100,
      sorter: (a, b) => (a.createName - b.createName ? 1 : -1),
    },
    {
      title: '采购单位客户号',
      width: 150,
      dataIndex: 'purchaseCode',
      sorter: (a, b) => a.purchaseCode.localeCompare(b.purchaseCode, 'zh'),
    },
    {
      title: '采购单位名称',
      width: 150,
      dataIndex: 'purchaseName',
      sorter: (a, b) => a.purchaseName.localeCompare(b.purchaseName, 'zh'),
    },
    {
      title: '采购单位主销售',
      width: 150,
      dataIndex: 'purchaseSalesName',
      sorter: (a, b) => a.purchaseSalesName.localeCompare(b.purchaseSalesName, 'zh'),
    },
    {
      title: '创建时间',
      valueType: 'dateTime',
      dataIndex: 'createTime',
      width: 150,
      sorter: (a, b) => (a.createTime - b.createTime ? 1 : -1),
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      width: 150,
      sorter: (a, b) => (a.updateTime - b.updateTime ? 1 : -1),
    },
    {
      title: '发票类型',
      dataIndex: 'invoiceType',
      width: 100,
      sorter: (a, b) => (a.invoiceType - b.invoiceType ? 1 : -1),
    },
    {
      title: '有效期至',
      dataIndex: 'validToDate',
      width: 150,
      sorter: (a, b) => (a.validToDate - b.validToDate ? 1 : -1),
    },
    {
      title: '最后修改人',
      dataIndex: 'updateName',
      width: 100,
      sorter: (a, b) => (a.updateName - b.updateName ? 1 : -1),
    },
    {
      title: '用户备注',
      dataIndex: 'userRemark',
      width: 100,
      sorter: (a, b) => (a.userRemark - b.userRemark ? 1 : -1),
    },
    {
      title: 'CSR备注',
      dataIndex: 'csrRemark',
      width: 100,
      sorter: (a, b) => (a.csrRemark - b.csrRemark ? 1 : -1),
    },
    {
      title: '订单类型',
      dataIndex: 'category',
      width: 90,
      sorter: (a, b) => (a.category - b.category ? 1 : -1),
    },
    {
      title: '订单渠道',
      dataIndex: 'channel',
      width: 90,
      sorter: (a, b) => (a.channel - b.channel ? 1 : -1),
    },
    {
      title: 'R3联系人',
      dataIndex: 'contactsName',
      width: 100,
      sorter: (a, b) => (a.contactsName - b.contactsName ? 1 : -1),
    },
    {
      title: '客户采购单号',
      dataIndex: 'customerPurchaseNo',
      width: 120,
      sorter: (a, b) => (a.customerPurchaseNo - b.customerPurchaseNo ? 1 : -1),
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
    <div className="omsAntStyle FRAuditStyle">
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
          <Form.Item name="orderNo" label="订单编号">
            <Input placeholder="请输入订单编号" allowClear />
          </Form.Item>
          <Form.Item name="customerName" label="客户名称">
            <Input placeholder="请输入客户名称" allowClear />
          </Form.Item>
          <Form.Item name="customerCode" label="客户编号">
            <Input placeholder="请输入客户编号" allowClear />
          </Form.Item>
          <Form.Item name="salesName" label="主销售">
            <Input placeholder="请输入主销售" allowClear />
          </Form.Item>
          <ProFormSelect
            label="销售领导"
            showSearch
            name="salesSupervisor"
            fieldProps={{
              fieldNames: { label: 'staffName', value: 'staffCode' },
            }}
            placeholder="请输入"
            request={async (val) => {
              let list = [] as any;
              if (val?.keyWords?.trim()) {
                await queryBySaffName({ staffName: val.keyWords }).then((res: any) => {
                  if (res.errCode === 200) {
                    list = res?.data?.dataList;
                    if (list.length == 0) {
                      list = [{ staffName: val.keyWords, staffCode: val.keyWords }];
                    }
                  }
                });
              }
              return list;
            }}
          />
          {!fold && (
            <>
              <Form.Item name="category" label="订单类型">
                <Select placeholder="请选择订单类型">
                  <Select.Option value="">全部</Select.Option>
                  {orderTypeList &&
                    orderTypeList.map((item: any) => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                </Select>
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

              <Form.Item name="ouOrderNo" label="外部订单号">
                <Input placeholder="请输入订单编号" />
              </Form.Item>
              <Form.Item name="groupCustomerName" label="集团名称">
                <Input placeholder="请输入集团名称" />
              </Form.Item>

              <Form.Item name="purchaseSalesName" label="采购单位主销售">
                <Input placeholder="请输入采购单位主销售" />
              </Form.Item>
              <Form.Item name="purchaseCode" label="采购单位客户号">
                <Input placeholder="请输入采购单位客户号" />
              </Form.Item>
              <Form.Item name="purchaseName" label="采购单位名称">
                <Input placeholder="请输入采购单位名称" />
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
              <Form.Item name="jvCompanyName" label="jv公司">
                <Input placeholder="请输入jv公司" />
              </Form.Item>
              <Form.Item name="paymentTermsList" label="支付条件" className="paymentMethods">
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="请选择支付条件，可多选"
                  maxTagCount="responsive"
                  // onChange={handleChange}
                >
                  {payment &&
                    payment.map((item: any) => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item name="createTime" label="OMS创建时间" className={'dataPickerCol'}>
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
          searchParams.createTimeStart =
            moment(searchParams.createTime[0]).format('YYYY-MM-DD') + ' ' + '00:00:00';
          searchParams.createTimeEnd =
            moment(searchParams.createTime[1]).format('YYYY-MM-DD') + ' ' + '23:59:59';

          // searchParams.createTimeStart = moment(searchParams.createTime[0]).format('YYYY-MM-DD');
          // searchParams.createTimeEnd = moment(searchParams.createTime[1]).format('YYYY-MM-DD');

          searchParams.orderStatus = [34];
          searchParams.pageNumber = params.current;
          searchParams.pageSize = params.pageSize;
          // const res = await getOrderList(searchParams);
          // if (res.errCode === 200) {
          //   return Promise.resolve({
          //     data: res.data?.list,
          //     total: res.data?.total,
          //     current: 1,
          //     pageSize: 20,
          //     success: true,
          //   });
          // } else {
          //   message.error(res.errMsg, 3);
          //   return Promise.resolve([]);
          // }
        }}
        onRow={(record: any) => {
          return {
            onClick: () => {
              if (selectedRowKeys.includes(record.orderNo)) {
                const newKeys = selectedRowKeys.filter((item: any) => item !== record.orderNo);
                setSelectedRowKeys(newKeys);
                setSelectOrderNo(newKeys);
              } else {
                setSelectedRowKeys(selectedRowKeys.concat([record.orderNo]));
                setSelectOrderNo(selectedRowKeys.concat([record.orderNo]));
              }
            },
          };
        }}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          // showTotal: total => `共有 ${total} 条数据`,
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
          showQuickJumper: true,
        }}
        rowKey="orderNo"
        search={false}
        tableAlertRender={false}
        actionRef={ref}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        headerTitle={
          <Space>
            <Button type="primary" size="small" onClick={releaseOrder}>
              批量放单
            </Button>
          </Space>
        }
      />
      <Drawer
        className="AnchorWithTopTipDrawer DrawerWithAnchor withAnchorDrawer DrawerContent"
        width={drawerWidth}
        key={'订单详情查看'}
        title={[
          <span key={'订单编号'}>订单编号: {id}</span>,
          <Tag key={'订单状态'} color="gold" style={{ marginLeft: 10 }}>
            {tableRowData.orderStatus}
          </Tag>,
          <p
            key={'订单类型'}
            className="tipsP"
            style={{ marginBottom: '-10px', marginTop: 5, color: '#777' }}
            ref={(node) => {
              if (node) {
                node.style.setProperty('font-size', '12px', 'important');
              }
            }}
          >
            订单类型: <strong>{tableRowData.category}</strong>
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
        <OrderDetail
          id={id}
          key={'order detail'}
          tableRowData={tableRowData}
          approveModalHandleOk={approveModalHandleOk}
          tableReload={tableReload}
        />
      </Drawer>

      {/*<MyDrawer tableRowData={tableRowData} id={id} ref={ChildRef} tableReload={tableReload } />*/}
      <Mymodal
        tableReload={tableReload}
        orderNos={selectOrderNo}
        ref={ModalRef}
        clearSelect={clearSelect}
      />
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
