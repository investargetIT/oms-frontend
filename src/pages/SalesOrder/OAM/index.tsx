import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Space, DatePicker, Modal } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { list } from './data';
import MasterDataDetail from './OrderDetail';
import { SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { RangePicker } = DatePicker;
  const ref = useRef<ActionType>();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const approveModalHandleOk = () => {
    setIsModalVisible(false);
  };
  // const drawerWidth = window.innerWidth;
  // const key = new Date().getTime();

  const [id, setId] = useState('');
  const [tableRowData, setTableRowData] = useState();
  const [yClient, setYClient] = useState(900);

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
          key={'运维'}
          type="link"
          onClick={() => {
            setId(record.orderId);
            setTableRowData(record);
            setIsModalVisible(true);
          }}
        >
          {' '}
          运维{' '}
        </Button>,
      ],
      fixed: 'left',
    },
    {
      title: '订单编号',
      dataIndex: 'orderId',
      width: 90,
      fixed: 'left',
      sorter: (a, b) => (a.orderId - b.orderId ? 1 : -1),
    },
    {
      title: '订单创建时间',
      width: 150,
      valueType: 'dateTime',
      dataIndex: 'createdTime',
      sorter: (a, b) => (a.createdTime - b.createdTime ? 1 : -1),
    },
    {
      title: '订单渠道',
      dataIndex: 'channelName',
      width: 150,
      render(text, record) {
        if (record.channelName) {
          return record.channelName;
        } else {
          return '-';
        }
      },
      sorter: (a, b) => (a.channelName - b.channelName ? 1 : -1),
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
      width: 250,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '含税总金额',
      width: 150,
      dataIndex: 'amount',
      render(text, record) {
        if (record.amount >= 0 && record.amount != '') {
          return Number(record.amount).toFixed(2);
        } else {
          return '0.00';
        }
      },
      sorter: (a, b) => (a.amount - b.amount ? 1 : -1),
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
    <div className="omsAntStyle">
      <div className="form-content-search">
        <Form
          layout="inline"
          form={form}
          className="ant-advanced-form"
          initialValues={{ OrderTime: [moment().subtract(1, 'month'), moment()] }}
        >
          <Form.Item name="orderId" label="订单编号">
            <Input placeholder="请输入订单编号" allowClear />
          </Form.Item>
          <Form.Item name="customerName" label="客户名称">
            <Input placeholder="请输入客户名称" allowClear />
          </Form.Item>
          <Form.Item name="customerCode" label="客户编号">
            <Input placeholder="请输入客户编号" allowClear />
          </Form.Item>
          <Form.Item name="SalesName" label="销售人员">
            <Input placeholder="请输入销售人员" allowClear />
          </Form.Item>
          <Form.Item name="OrderTime" label="下单时间" className={'dataPickerCol'}>
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

      <ProTable<any>
        columns={columns}
        scroll={{ x: 100, y: yClient }}
        bordered
        size="small"
        options={{ reload: false, density: false }}
        request={(params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          console.log(form.getFieldsValue(true), params, sorter, filter, '====list testing====');
          return Promise.resolve(list);
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          // showTotal: total => `共有 ${total} 条数据`,
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
          showQuickJumper: true,
        }}
        rowKey="orderId"
        search={false}
        tableAlertRender={false}
        actionRef={ref}
      />
      <Modal
        className="noTopFootBorder"
        width={1000}
        title="订单信息审核"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        destroyOnClose={true}
        footer={[]}
      >
        <MasterDataDetail
          id={id}
          tableRowData={tableRowData}
          approveModalHandleOk={approveModalHandleOk}
        />
      </Modal>
    </div>
  );
};

export default Index;
