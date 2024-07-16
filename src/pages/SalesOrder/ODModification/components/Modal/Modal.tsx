import { orderList } from '@/services/SalesOrder';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Input, message, Modal } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';

import type { ActionType, ProColumns } from '@ant-design/pro-table';
import Drawer from '../Drawer/Drawer';
const MyModal = ({ reload }: any, ref: any) => {
  //?内部明细组件
  const [visible, setVisible] = useState(false);
  const [yClient, setYClient] = useState(900);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  // const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows]: any = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { initialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const drawerRef: any = useRef<ActionType>();
  const tableRef: any = useRef<ActionType>();
  const [startPage, setStartPage] = useState(false);

  interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
  }
  const columns: ProColumns<any>[] = [
    {
      title: '#',
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
      title: '渠道',
      dataIndex: 'channel',
      width: 90,
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 250,
    },
    {
      title: '客户号',
      dataIndex: 'customerCode',
      width: 250,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 250,
    },
    {
      title: 'R3联系人',
      dataIndex: 'contactsName',
      width: 250,
    },
    {
      title: 'R3联系人代号',
      dataIndex: 'contactsCode',
      width: 250,
    },
  ];
  const open = () => {
    setVisible(true);
    setSelectedRowKeys([]); //?清空单选框
  };
  const close = () => {
    setTimeout(() => {
      setSelectedRows([]);
      setVisible(false);
    }, 1000);
  };
  useImperativeHandle(ref, () => ({
    openModal: open,
    closeModal: close,
  }));
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeyss: React.Key[], selectedRows_: DataType[]) => {
      // console.log(`selectedRowKeys: ${selectedRowKeyss}`, 'selectedRows_: ', selectedRows_);
      setSelectedRows(selectedRows_);
      setSelectedRowKeys(selectedRowKeyss);
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };
  const handleOk = (): any => {
    // ? 弹框点击下一步
    if (selectedRows.length == 0) return message.warning('请选择订单');
    // setLoading(true);
    drawerRef.current.openDrawer(selectedRows[0].orderNo, 'nextStep', selectedRows[0]);
    setVisible(false);
  };
  const onSearch = () => {
    setSelectedRows([]);
    // console.log(selectedRows, 'selectedRows');
    setStartPage(true);
    tableRef.current.reload();
  };
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 320);
  }, [initialState?.windowInnerHeight]);

  return (
    <div>
      <Modal
        title="选择订单"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={1500}
        style={{ height: '600px' }}
        footer={[
          <Button key="back" onClick={() => close()}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            下一步
          </Button>,
        ]}
      >
        <Form layout="inline" form={form} className="ant-advanced-form">
          <Form.Item name="orderNo" label="">
            <Input.Search
              style={{ marginBottom: '9px' }}
              placeholder="请输入订单号"
              onSearch={onSearch}
            />
          </Form.Item>
        </Form>
        <ProTable<any>
          columns={columns}
          scroll={{ x: 100, y: yClient }}
          bordered
          size="small"
          options={{ reload: false, density: false }}
          request={async (params) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            const searchParams = form.getFieldsValue(true);
            if (startPage) {
              params.current = 1;
              params.pageSize = 10;
            }
            searchParams.pageNumber = params.current;
            searchParams.pageSize = params.pageSize;
            searchParams.syncSap = true;
            const res = await orderList(searchParams);
            if (res.errCode === 200) {
              res.data?.list.forEach((e: any, i: number) => {
                e.index = i;
              });
              return Promise.resolve({
                data: res.data?.list,
                total: res.data?.total,
                success: true,
              });
            } else {
              Modal.error(res.errMsg);
              return Promise.resolve([]);
            }
          }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `共有 ${total} 条`,
            onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
            responsive: true,
          }}
          onRow={(record) => {
            return {
              onClick: () => {
                setSelectedRowKeys([record.index]);
                setSelectedRows([record]);
              }, // 点击行
              onDoubleClick: () => {
                setSelectedRowKeys([record.index]);
                setSelectedRows([record]);
                drawerRef.current.openDrawer(selectedRows[0].orderNo, 'nextStep', selectedRows[0]);
                setVisible(false);
              },
            };
          }}
          rowKey="index"
          search={false}
          rowSelection={{ type: 'radio', ...rowSelection }}
          tableAlertRender={false}
          actionRef={tableRef}
          toolBarRender={false}
          className="ModalTable"
        />
      </Modal>
      <Drawer ref={drawerRef} reload={reload} />
    </div>
  );
};
export default forwardRef(MyModal);
