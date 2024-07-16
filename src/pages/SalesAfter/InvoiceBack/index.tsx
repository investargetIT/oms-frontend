import { queryBackList } from '@/services/afterSales';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, DatePicker, Form, Input, Modal, Space } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import { colLimit } from '@/services';
import './style.less';
const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { RangePicker } = DatePicker;
  const ref = useRef<ActionType>();
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const [form] = Form.useForm();
  const [yClient, setYClient] = useState(900);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const colorList = {
    '4': '#1890FF',
    '3': '#FFADD2',
    '2': '#52C41A',
    '1': '#FAAD14',
  };
  const btnCol = (record: any) => {
    const temp: any = [];
    temp.push(
      <Button
        size="small"
        key={'详情'}
        type="link"
        onClick={() => {
          history.push({
            pathname: `/sales-after/invoiceinfo/${record.sid}`,
          });
        }}
      >
        {' '}
        详情{' '}
      </Button>,
    );
    return temp;
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
      render: (record: any, text: any) => btnCol(text),
      fixed: 'left',
    },
    { title: '任务编号', width: 160, dataIndex: 'invoiceBackNo' },
    {
      title: '任务状态',
      width: 120,
      dataIndex: 'invoiceBackStatusDesc',
      // renderText: (text: any, recorder: any) => (
      //   <Tag
      //     style={{ width: '80px', display: 'inline-block' }}
      //     color={colorList[recorder.invoiceBackStatusCode]}
      //   >
      //     {text}
      //   </Tag>
      // ),
      renderText: (text: any, recorder: any) => (
        <span style={{ color: colorList[recorder.invoiceBackStatusCode] }}>{text}</span>
      ),
    },
    { title: '任务创建时间', width: 150, dataIndex: 'createTime' },
    { title: '关联售后申请', width: 120, dataIndex: 'afterSalesNo' },
    { title: '关联销售订单', width: 150, dataIndex: 'sapSoNo' },
    { title: '系统发票号', width: 120, dataIndex: 'systemInvoiceNo' },
    { title: '物理发票号', width: 120, dataIndex: 'physicsInvoiceNo' },
    { title: '发票接收日期', width: 150, dataIndex: 'invoiceReceiptDate' },
    { title: '客户代号', width: 120, dataIndex: 'customerCode' },
    { title: '客户名称', width: 150, dataIndex: 'customerName' },
    { title: '最近更新人', width: 120, dataIndex: 'updateName' },
    { title: '最后更新时间', width: 150, dataIndex: 'updateTime' },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 370);
  }, [initialState?.windowInnerHeight]);
  return (
    <div className="omsAntStyle InvoiceBack">
      <div className="form-content-search">
        <Form
          layout="inline"
          form={form}
          className="ant-advanced-form"
          initialValues={{ createTime: [moment().subtract(1, 'month'), moment()] }}
        >
          <Form.Item name="invoiceBackNo" label="任务编号">
            <Input placeholder="请输入任务编号" />
          </Form.Item>
          <Form.Item name="afterSalesNo" label="售后申请编号">
            <Input placeholder="请输入售后申请编号" />
          </Form.Item>
          <Form.Item name="sapSoNo" label="销售订单编号">
            <Input placeholder="请输入销售订单编号" />
          </Form.Item>
          <Form.Item name="customerName" label="客户名称">
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          <Form.Item name="createTime" label="创建时间" className={'dataPickerCol'}>
            <RangePicker format="YYYY-MM-DD" allowClear={false} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                size="small"
                key={'查询'}
                type="primary"
                onClick={() => {
                  ref.current?.reload(true);
                  setStartPage(true);
                }}
              >
                查 询
              </Button>
              <Button
                size="small"
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
        columnsState={{
          value: columnsStateMap,
          onChange: (val: any) => {
            colLimit(val, setColumnsStateMap);
          },
          persistenceKey: history.location.pathname,
          persistenceType: 'localStorage',
        }}
        scroll={{ x: 200, y: yClient }}
        bordered
        size="small"
        request={async (params) => {
          const searchParams = form.getFieldsValue(true);
          if (startPage) {
            params.current = 1;
            // params.pageSize = 20;
          }
          searchParams.createTimeStart =
            moment(searchParams.createTime[0]).format('YYYY-MM-DD') + ' 00:00:00';
          searchParams.createTimeEnd =
            moment(searchParams.createTime[1]).format('YYYY-MM-DD') + ' 23:59:59';
          searchParams.pageNumber = params.current;
          searchParams.pageSize = params.pageSize;
          const res = await queryBackList(searchParams);
          if (res.errCode === 200) {
            return Promise.resolve({ data: res.data?.list, total: res.data?.total, success: true });
          } else {
            Modal.error({ title: res.errMsg });
            return Promise.resolve([]);
          }
        }}
        options={{ reload: false, density: false }}
        rowKey="sid"
        search={false}
        tableAlertRender={false}
        actionRef={ref}
        defaultSize="small"
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          // showTotal: total => `共有 ${total} 条数据`,
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
          showQuickJumper: true,
        }}
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
