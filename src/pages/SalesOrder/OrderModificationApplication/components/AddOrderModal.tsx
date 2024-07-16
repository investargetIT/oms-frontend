import React, { useState, useRef } from 'react';
import { Input, message } from 'antd';
import { getOrderList, queryOrderInfoPageList } from '@/services/SalesOrder';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { orderpage, queryAfterOrder } from '@/services/afterSales';
interface closeModal {
  addNewModalClose: any;
  operateMethod: any;
  modalOK: any;
  getRequestType: any;
  orderType: any;
}
const AddNewForm: React.FC<closeModal> = (props) => {
  const ref: any = useRef<ActionType>();
  const yClient = 250;
  const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
    setSelectedRows([]);
    setSelectedRowKeys([]);
    props.operateMethod('');
    console.log(selectedRows);
  }
  // const [rowSelection, setRowSelection] = {
  // 	selectedRowKeyss,
  // 	onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
  // 	  props.operateMethod(selectedRows[0]);
  // 		setSelectedRowss(selectedRows);
  // 		setSelectedRowKeyss(selectedRowKeys);
  // 	},
  // }
  const onSelectChange = (selectedRowKeyss: React.Key[], selectedRowss: any[]) => {
    props.operateMethod(selectedRowss[0]);
    setSelectedRows(selectedRowss);
    setSelectedRowKeys(selectedRowKeyss);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    //  onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
    //    props.operateMethod(selectedRows[0]);
    // setSelectedRowss(selectedRows);
    // setSelectedRowKeyss(selectedRowKeys);
    //  },
  };
  const columns: ProColumns<any>[] = [
    {
      title: '#',
      dataIndex: 'index',
      // valueType: 'index',
      width: 60,
      fixed: 'left',
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
      search: false,
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 100,
      sorter: (a, b) => (a.orderNo - b.orderNo ? 1 : -1),
      renderFormItem: () => {
        return <Input allowClear placeholder="请输入完整订单号" />;
      },
    },

    {
      title: '渠道',
      dataIndex: 'channel',
      width: 100,
      sorter: (a, b) => (a.channel - b.channel ? 1 : -1),
      search: false,
    },
    {
      title: '客户号',
      dataIndex: 'customerCode',
      width: 120,
      sorter: (a, b) => (a.customerCode - b.customerCode ? 1 : -1),
      search: false,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 180,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
      search: false,
    },
    {
      title: 'R3联系人',
      dataIndex: 'contactsName',
      width: 180,
      sorter: (a, b) => (a.contactsName - b.contactsName ? 1 : -1),
      search: false,
    },
    {
      title: 'R3联系人代号',
      dataIndex: 'contactsCode',
      width: 120,
      sorter: (a, b) => (a.contactsCode - b.contactsCode ? 1 : -1),
      search: false,
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  return (
    <div className="base-style">
      <ProTable<any>
        columns={columns}
        scroll={{ x: 100, y: yClient }}
        bordered
        size="small"
        request={async (params) => {
          const searchParams: any = {
            pageNumber: params.current,
            pageSize: params.pageSize,
            orderNo: params.orderNo,
            querySign: 2,
            orderType: props?.orderType,
          };
          if (props.getRequestType == 2 || props.getRequestType == 3) {
            searchParams.syncSap = true;
          }
          // add 需要区分url  常规单1  售后单2 揭阳单3
          // const url = props?.orderType == 1 ? getOrderList(searchParams) : props?.orderType == 2 ? queryAfterOrder(searchParams) : props?.orderType == 3 ? orderpage(searchParams) : ''
          // 注意：url 统一
          const res = await queryOrderInfoPageList(searchParams);
          if (startPage) {
            params.current = 1;
            // params.pageSize = 20;
          }
          res.data?.list?.forEach((e: any, i: number) => {
            //? 在表格数据的每一条里面加一个标识，然后用这个标识找到对应要编辑的那一项
            e.index = i;
          });
          if (res.errCode === 200) {
            return Promise.resolve({
              data: res.data?.list,
              total: res.data?.total,
              current: 1,
              pageSize: 20,
              success: true,
            });
          } else {
            message.error(res.errMsg, 3);
            return Promise.resolve([]);
          }
        }}
        rowKey="index"
        search={{
          labelWidth: 'auto',
          span: 12,
          defaultCollapsed: false,
          collapseRender: false,
          className: 'search-form',
        }}
        rowSelection={{ type: 'radio', fixed: 'left', ...rowSelection }}
        options={false}
        tableAlertRender={false}
        onRow={(record) => {
          return {
            onClick: () => {
              props.operateMethod([record][0]);
              setSelectedRows([record]);
              setSelectedRowKeys([record.index]);
            }, // 点击行
            onDoubleClick: () => {
              props.operateMethod([record][0]);
              setSelectedRows([record]);
              setSelectedRowKeys([record.index]);
              if (props.modalOK) {
                props.modalOK();
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
        actionRef={ref}
      />
    </div>
  );
};
export default AddNewForm;
