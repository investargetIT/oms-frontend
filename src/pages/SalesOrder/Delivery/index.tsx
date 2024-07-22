import React, { useState, useRef, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Space,
  DatePicker,
  Drawer,
  Select,
  message,
  Modal,
  Checkbox,
} from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import moment from 'moment';
import { DownOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';
import { getOrderDateList, getDeliveryList } from '@/services/SalesOrder/index';
import DetailDrawer from './components/DetailDrawer';
import AddCustomerForm from './components/AddCustomerForm';
import { useModel, history } from 'umi';
import { colLimit } from '@/services';
import './index.less';
const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { RangePicker } = DatePicker;
  const ref = useRef<ActionType>();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const [id, setId] = useState('');
  const [tableRowData, setTableRowData] = useState({});
  const [yClient, setYClient] = useState(900);
  const drawerWidth = window.innerWidth - 208;
  // const key = new Date().getTime();
  const [isAddNewModalVisible, setIsAddNewModalVisible] = useState(false);
  const [modalVal, setModalVal] = useState({});
  const [fold, setFold] = useState(false);
  function UpDown() {
    setFold(!fold);
  }
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const detailDrawerClose = () => {
    setIsModalVisible(false);
  };

  const [tplnameDisabled, setTplnameDisabled]: any = useState('');
  const [expCodeDisabled, setExpCodeDisabled]: any = useState(false);
  // const [emptySelect, setEmptySelect]: any = useState([])
  const checkboxOptions: any = [
    { label: '物流商为空', value: '物流商' },
    { label: '快递单号为空', value: '快递号' },
  ];
  const onChange = (checkedValues: CheckboxValueType[]) => {
    if (checkedValues.includes('物流商')) {
      setTplnameDisabled(true);
      form.setFieldsValue({
        tplnameLike: '',
        tplnameIsEmpty: true,
      });
    } else {
      setTplnameDisabled(false);
      form.setFieldsValue({
        tplnameIsEmpty: false,
      });
    }
    if (checkedValues.includes('快递号')) {
      setExpCodeDisabled(true);
      form.setFieldsValue({
        expCodes: '',
        expCodeIsEmpty: true,
      });
    } else {
      setExpCodeDisabled(false);
      form.setFieldsValue({
        expCodeIsEmpty: false,
      });
    }

    // setEmptySelect(checkedValues)
  };
  const [orderTypeList, setOrderTypeList]: any = useState([]);
  useEffect(() => {
    // getOrderDateList({ type: 'orderType' }).then((res: any) => {
    //   if (res.errCode === 200) {
    //     setOrderTypeList(res.data.dataList);
    //   }
    // });

    //设置select初始值
    form.setFieldsValue({
      type: orderTypeList && orderTypeList[0] ? orderTypeList[0].key : '',
    });
  }, []);

  const [choosedCustomerCode, setChoosedCustomerCode]: any = useState('');

  const getSelModal = (val: any) => {
    // if (!val) return;
    // if (JSON.stringify(val) != '{}') {
    //   form.setFieldsValue({
    //     customerName: val.customerName,
    //   });
    //   setChoosedCustomerCode(val.customerCode);
    // }
  };

  const operateMethod = (val: any) => {
    // setModalVal(val);
  };
  const addNewModalClose = () => {
    // setIsAddNewModalVisible(false);
  };
  const modalOK = () => {
  //   setIsAddNewModalVisible(false);
  //   getSelModal(modalVal);
  };

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '操作',
      width: 60,
      render: (_, record) => [
        <Button
          size="small"
          key={'详情'}
          type="link"
          onClick={() => {
            setIsModalVisible(true);
            // setId(record.orderNo);
            setId(record.obdNo);
            setTableRowData(record);
          }}
        >
          详情
        </Button>,
      ],
      fixed: 'left',
    },
    {
      title: '发货单号',
      width: 120,
      dataIndex: 'obdNo',
      fixed: 'left',
    },
    {
      title: '订单号',
      width: 120,
      dataIndex: 'orderNo',
      fixed: 'left',
    },
    {
      title: '销售',
      width: 120,
      dataIndex: 'salesName',
    },
    {
      title: '支付条件',
      dataIndex: 'paymentTermName',
      width: 150,
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethodName',
      width: 180,
    },
    {
      title: '客户代号',
      width: 120,
      dataIndex: 'customerCode',
    },
    {
      title: '客户名称',
      width: 200,
      dataIndex: 'customerName',
    },
    {
      title: '物流商名称',
      width: 150,
      dataIndex: 'tplname',
    },
    {
      title: '快递单号',
      width: 120,
      dataIndex: 'expCode',
    },
    {
      title: '发货时间',
      width: 150,
      dataIndex: 'sendTime',
      valueType: 'dateTime',
    },
    {
      title: '总金额-含税',
      width: 120,
      dataIndex: 'amount',
    },
    {
      title: '发货单创建时间',
      width: 150,
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '收货人',
      width: 120,
      dataIndex: 'consignee',
    },
    {
      title: '收货地址',
      width: 260,
      dataIndex: 'address',
    },
    {
      title: '手机',
      width: 150,
      dataIndex: 'cellphone',
    },
    {
      title: '座机',
      width: 120,
      dataIndex: 'phone',
    },
    {
      title: '同步时间',
      width: 150,
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 350);
  }, [initialState?.windowInnerHeight]);
  return (
    <div className="omsAntStyle DeliveryStyle">
      <div className="form-content-search">
        <Form
          layout="inline"
          form={form}
          className="ant-advanced-form"
          initialValues={{
            createTime: [moment().subtract(1, 'month'), moment()],
            // tplnameIsEmpty: false,
            // expCodeIsEmpty: false,
          }}
        >
          <Form.Item name="obdNo" label="发货单号">
            <Input placeholder="请输入发货单号" />
          </Form.Item>
          <Form.Item name="expCodes" label="快递单号">
            <Input placeholder="请输入快递单号" disabled={expCodeDisabled} />
          </Form.Item>
          <Form.Item name="orderNo" label="订单号">
            <Input placeholder="请输入订单号" />
          </Form.Item>

          <Form.Item
            label="客户名称"
            name="customerName"
            rules={[{ required: true, message: '请选择客户!' }]}
          >
            <Input.Search
              placeholder="请选择客户"
              readOnly={true}
              onSearch={() => {
                setIsAddNewModalVisible(true);
              }}
              onClick={() => {
                setIsAddNewModalVisible(true);
              }}
            />
          </Form.Item>
          {!fold && (
            <>
              <Form.Item name="type" label="订单类型">
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
              <Form.Item name="tplnameLike" label="物流商名称">
                <Input placeholder="请输入物流商名称" disabled={tplnameDisabled} />
              </Form.Item>
              <Form.Item label="只看" name="emptySelect" style={{ width: '315px' }}>
                <Checkbox.Group
                  style={{ marginTop: '5px' }}
                  options={checkboxOptions}
                  onChange={onChange}
                />
              </Form.Item>
              <Form.Item name="createTime" label="发货单创建时间" className={'dataPickerCol'}>
                <RangePicker format="YYYY-MM-DD" allowClear={false} />
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
                  setChoosedCustomerCode('');
                  setTplnameDisabled(false);
                  setExpCodeDisabled(false);
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
        //   console.log(form.getFieldsValue(true), params, sorter, filter, '测试数据=====');
        //   return Promise.resolve(list);
        // }}
        request={async (params) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          // const searchParams = form.getFieldsValue(true);
          // if (startPage) {
          //   params.current = 1;
          //   // params.pageSize = 20;
          // }
          // searchParams.startTime =
          //   moment(searchParams.createTime[0]).format('YYYY-MM-DD') + ' ' + '00:00:00';
          // searchParams.endTime =
          //   moment(searchParams.createTime[1]).format('YYYY-MM-DD') + ' ' + '23:59:59';
          // searchParams.customerCode = choosedCustomerCode;

          // // searchParams.startTime = moment(searchParams.createTime[0]).format('YYYY-MM-DD');
          // // searchParams.endTime = moment(searchParams.createTime[1]).format('YYYY-MM-DD');
          // if (searchParams.expCodes && JSON.stringify(searchParams.expCodes) !== '') {
          //   searchParams.expCode = searchParams.expCodes;
          // } else {
          //   delete searchParams.expCode;
          // }
          // searchParams.pageNumber = params.current;
          // searchParams.pageSize = params.pageSize;
          // console.log(searchParams);
          // const res = await getDeliveryList(searchParams);
          // res.data?.list.forEach((e: any, i: number) => {
          //   //? 在表格数据的每一条里面加一个标识，然后用这个标识找到对应要编辑的那一项
          //   e.index = i;
          // });
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
        rowKey="index"
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          // showTotal: total => `共有 ${total} 条数据`,
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
          showQuickJumper: true,
        }}
        search={false}
        tableAlertRender={false}
        actionRef={ref}
      />
      <Drawer
        className="DrawerWithAnchor"
        width={drawerWidth}
        key={'订单详情查看'}
        title="发货详情"
        placement="right"
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
        destroyOnClose={true}
        extra={
          <Space>
            <Button onClick={detailDrawerClose}>关闭</Button>
          </Space>
        }
        footer={[
          // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
          <Button key="back" onClick={detailDrawerClose}>
            关闭
          </Button>,
        ]}
      >
        <DetailDrawer
          id={id}
          key={id}
          tableRowData={tableRowData}
          detailDrawerClose={detailDrawerClose}
        />
      </Drawer>
      <Modal
        width={910}
        title="选择客户"
        visible={isAddNewModalVisible}
        destroyOnClose={true}
        onOk={modalOK}
        onCancel={addNewModalClose}
      >
        <AddCustomerForm
          addNewModalClose={addNewModalClose}
          operateMethod={operateMethod}
          modalOK={modalOK}
        />
      </Modal>
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
