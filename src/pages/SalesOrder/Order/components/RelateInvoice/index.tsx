import { SearchOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Input, message, Select, Space } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import InvoiceDetail from './InvoiceDetail';
import { invoiceQuery } from '@/services/SalesOrder';

const BasicInfo = ({ id }: any, Ref: any) => {
  const ref = useRef<ActionType>();
  const [yClient, setYClient] = useState(900);
  const { initialState } = useModel('@@initialState');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [form] = Form.useForm();
  const [orderStatusList, setOrderStatusList]: any = useState([]);
  const InvoiceDetailRef: any = useRef();
  useEffect(() => {
    setOrderStatusList([
      { key: '1', value: '正常' },
      { key: '0', value: '作废' },
    ]);
  }, []);
  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 250);
  }, [initialState?.windowInnerHeight]);
  const Column: ProColumns<any>[] = [
    {
      title: '#',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        // return index + 1;#4d9dff
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '系统发票号',
      dataIndex: 'invSysNo',
      width: 120,
    },
    { title: '系统发票金额（含税）', dataIndex: 'invSysAmount', width: 120 },
    { title: '物理发票号', dataIndex: 'invPhyNo', width: 120 },
    { title: '物理发票状态', dataIndex: 'invPhyValidStr', width: 120 },
    {
      title: '发票快递单号',
      dataIndex: 'invLogisticNo',
      width: 150,
      render(text, record) {
        return (
          <div
            style={{ color: '#4d9dff', cursor: 'pointer' }}
            onClick={() => InvoiceDetailRef?.current?.openDrawer(record)}
          >
            {record.invLogisticNo}
          </div>
        );
      },
    },
    { title: '发票邮寄日期', dataIndex: 'invMailDate', valueType: 'dateTime', width: 120 },
    { title: '发票寄送物流商', dataIndex: 'tplName', width: 120 },
    { title: '发票物流更新时间', dataIndex: 'invLogiUpdateTime', width: 300 },
  ];
  Column.forEach((item: any) => {
    item.ellipsis = true;
  });
  function clearData() {}
  useImperativeHandle(Ref, () => ({
    clearData,
  }));
  return (
    <div>
      <div className="form-content-search">
        <Form layout="inline" form={form} className="ant-advanced-form" initialValues={{}}>
          <Form.Item name="invSysNo" label="系统发票号">
            <Input placeholder="请输入订单编号" />
          </Form.Item>
          <Form.Item name="invPhyNo" label="物理发票号">
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          <Form.Item name="invPhyValid" label="物理发票状态">
            <Select placeholder="请选择订单状态">
              <Select.Option key="" value="">
                全部
              </Select.Option>
              {orderStatusList &&
                orderStatusList.map((item: any) => (
                  <Select.Option key={item.key} value={item.key}>
                    {item.value}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item className="btn-search">
            <Space>
              <Button
                key={'查询'}
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => {
                  ref.current?.reload(true);
                }}
              >
                查 询
              </Button>
              <Button
                key={'重置'}
                onClick={() => {
                  form.resetFields();
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
        columns={Column}
        scroll={{ x: 100, y: yClient }}
        request={async (params) => {
          const searchParams: any = {
            ...form.getFieldsValue(true),
            pageNumber: params.current,
            pageSize: params.pageSize,
            orderNo: id,
          };
          const res = await invoiceQuery(searchParams);
          res.data?.list?.forEach((e: any, i: number) => {
            e.index = i;
          });
          if (res.errCode === 200) {
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
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          // showTotal: total => `共有 ${total} 条数据`,
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
        }}
        rowKey="index"
        search={false}
        toolBarRender={false}
        tableAlertRender={false}
        actionRef={ref}
        defaultSize="small"
        bordered
      />
      <InvoiceDetail ref={InvoiceDetailRef} />
    </div>
  );
};

export default forwardRef(BasicInfo);
