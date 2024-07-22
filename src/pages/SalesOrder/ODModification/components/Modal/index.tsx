import { goodsDetails } from '@/services/SalesOrder';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

const Index = function ({ getInfo }: any, ref: any) {
  //?新增小弹框的组件
  interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
  }
  const [visible, setVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys]: any = useState<DataType[]>([]);
  const [rowDetail, setRowDetail]: any = useState({}); //?存储上上一个页面的全部订单选中行信息
  const tableRef: any = useRef();
  const open = (e: any) => {
    setRowDetail(e);
    setVisible(true);
    const timerID = setInterval(() => {
      //?轮询并刷新
      //?当表格的dom刷新出来之后
      if (tableRef?.current !== undefined) {
        tableRef?.current.reload();
        clearInterval(timerID);
      }
    }, 500);
    setSelectedRows([]);
    setSelectedRowKeys([]);
  };
  const close = () => {
    setVisible(false);
  };
  const handleOk = () => {
    if (selectedRows.length > 0) {
      getInfo(selectedRows[0]);
      setVisible(false);
    } else {
      message.warning('请选择要替换的Sku');
    }
    // ? 弹框点击下一步
  };
  useImperativeHandle(ref, () => ({
    openModal: open,
    closeModal: close,
  }));
  const infoColumn2: ProColumns<any>[] = [
    { title: '#', dataIndex: 'index', valueType: 'index', width: 50, fixed: 'left' },
    { title: 'SKU', dataIndex: 'sku', width: 100 },
    { title: '数量', dataIndex: 'qty', width: 120 },
    { title: '成交含税价', dataIndex: 'salesPrice', width: 100 },
    { title: '产品名称', dataIndex: 'productNameConcatStr', width: 100 },
    { title: '小计含税', dataIndex: 'totalAmount', width: 100 },
  ];
  infoColumn2.forEach((item: any) => {
    item.ellipsis = true;
  });
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
  return (
    <div>
      <Modal
        title="选择原SKU"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={700}
        style={{ height: '600px' }}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        <ProTable<any>
          columns={infoColumn2}
          request={async (params) => {
            const searchParams: any = {
              pageNumber: params.current,
              pageSize: params.pageSize,
              orderNo: rowDetail,
            };
            // const res = await goodsDetails(searchParams);
            // if (res.errCode === 200) {
            //   res.data?.list.forEach((e: any, i: any) => {
            //     e.index = i;
            //   });
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
          onRow={(record) => {
            return {
              onClick: () => {
                setSelectedRowKeys([record.index]);
                setSelectedRows([record]);
              }, // 点击行
              onDoubleClick: () => {
                setSelectedRowKeys([record.index]);
                setSelectedRows([record]);
                getInfo(selectedRows[0]);
                setVisible(false);
              },
            };
          }}
          rowKey="index"
          search={false}
          tableAlertRender={false}
          actionRef={tableRef}
          defaultSize="small"
          scroll={{ x: 0 }}
          options={{ reload: false, density: false }}
          toolBarRender={false}
          rowSelection={{ type: 'radio', ...rowSelection }}
        />
      </Modal>
    </div>
  );
};
export default forwardRef(Index);
