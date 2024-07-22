import React, { useState, useRef } from 'react';
import { Input } from 'antd';
import { getAdminCustomerList } from '@/services/SalesOrder';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
interface closeModal {
  addNewModalClose: any;
  operateMethod: any;
  modalOK: any;
}
const AddNewForm: React.FC<closeModal> = (props) => {
  const ref: any = useRef<ActionType>();
  const yClient = 300;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [startPage, setStartPage] = useState(false);
  const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
    setSelectedRows([]);
    setSelectedRowKeys([]);
    props.operateMethod('');
    console.log(selectedRows);
  }
  const onSelectChange = (selectedRowKeyss: React.Key[], selectedRowss: any[]) => {
    props.operateMethod(selectedRowss[0]);
    setSelectedRows(selectedRowss);
    setSelectedRowKeys(selectedRowKeyss);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
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
      title: '客户号',
      dataIndex: 'customerCode',
      width: 100,
      sorter: (a, b) => (a.customerCode - b.customerCode ? 1 : -1),
      renderFormItem: () => {
        return <Input allowClear placeholder="请输入完整客户号" />;
      },
    },
    {
      title: '客户中文名称',
      dataIndex: 'customerName',
      width: 180,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
      renderFormItem: () => {
        return <Input allowClear placeholder="请输入客户名称关键字" />;
      },
    },
    {
      title: '所在地区',
      dataIndex: 'provinceName',
      width: 180,
      render(text, record) {
        if (!record.provinceName && !record.cityName) {
          return '-';
        } else {
          if (!record.districtName || record.district == 0) {
            if (record.cityName) {
              return record.provinceName + record.cityName;
            } else {
              return record.provinceName;
            }
          } else {
            return record.provinceName + record.cityName + record.districtName;
          }
        }
      },
      sorter: (a, b) => (a.provinceName - b.provinceName ? 1 : -1),
      search: false,
    },
    {
      title: '详细地址',
      dataIndex: 'street',
      width: 180,
      sorter: (a, b) => (a.street - b.street ? 1 : -1),
      search: false,
    },
    {
      title: '所属公司',
      dataIndex: 'officeName',
      width: 180,
      sorter: (a, b) => (a.officeName - b.officeName ? 1 : -1),
      search: false,
    },
    {
      title: '所属事业部',
      dataIndex: 'ownerDepartmentName',
      width: 180,
      sorter: (a, b) => (a.ownerDepartmentName - b.ownerDepartmentName ? 1 : -1),
      search: false,
    },
    {
      title: '所属团队',
      dataIndex: 'ownerTeam',
      width: 120,
      sorter: (a, b) => (a.ownerTeam - b.ownerTeam ? 1 : -1),
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
        locale={{
          emptyText: () => (
            <>
              <div style={{ marginBottom: '20px' }}>暂无数据</div>
              <div>请前往CRM系统维护相关客户数据</div>
            </>
          ),
        }}
        request={async (params) => {
          // const searchParams: any = {
          //   pageNumber: params.current,
          //   pageSize: params.pageSize,
          //   customerCode: params.customerCode,
          //   customerName: params.customerName,
          // };
          // const res = await getAdminCustomerList(searchParams);
          // if (startPage) {
          //   params.current = 1;
          //   params.pageSize = 20;
          // }
          // res.data?.list?.forEach((e: any, i: number) => {
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
        search={{
          labelWidth: 'auto',
          span: 8,
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
