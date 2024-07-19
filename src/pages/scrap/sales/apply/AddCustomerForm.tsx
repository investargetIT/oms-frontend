import { queryMyCustomer, queryRecAddress } from '@/services/afterSales';
// import { queryCustomerPage,queryRecAddress } from '@/services/afterSales';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message } from 'antd';
import React, { useRef, useState } from 'react';
const AddNewForm: React.FC = (props: any) => {
  // const { onDbSave } = props;
  const ref: any = useRef<ActionType>();
  const yClient = 250;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [startPage, setStartPage] = useState(false);
  const [selectedRows, setSelectedRows]: any = useState([]);
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
    props.onSelect(selectedRowss[0]);
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
      title: '客户中文名称',
      dataIndex: 'customerName',
      width: 220,
      search: false,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '客户号',
      dataIndex: 'customerCode',
      width: 100,
      sorter: (a, b) => (a.customerCode - b.customerCode ? 1 : -1),
      // search: false,
    },
    {
      title: '所在地区',
      dataIndex: 'provinceName',
      width: 180,
      render(_, record) {
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
  const AreaColumns: ProColumns<any>[] = [
    {
      title: '#',
      dataIndex: 'index',
      // valueType: 'index',
      width: 60,
      fixed: 'left',
      render(text, record, index) {
        return index + 1;
      },
      search: false,
    },
    {
      title: '区名称',
      dataIndex: 'districtName',
      width: 100,
      sorter: (a, b) => (a.customerCode - b.customerCode ? 1 : -1),
      search: false,
    },
    {
      title: '收件地址',
      dataIndex: 'receiptAddress',
      width: 180,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '客户号',
      dataIndex: 'customerCode',
      width: 180,
      sorter: (a, b) => (a.provinceName - b.provinceName ? 1 : -1),
      search: false,
    },
    {
      title: '省份名称',
      dataIndex: 'provinceName',
      width: 180,
      sorter: (a, b) => (a.street - b.street ? 1 : -1),
      search: false,
    },
    {
      title: '市名称',
      dataIndex: 'cityName',
      width: 180,
      sorter: (a, b) => (a.officeName - b.officeName ? 1 : -1),
      search: false,
    },
    {
      title: '收件人邮箱',
      dataIndex: 'receiptEmail',
      width: 180,
      sorter: (a, b) => (a.ownerDepartmentName - b.ownerDepartmentName ? 1 : -1),
      search: false,
    },
    {
      title: '收件人',
      dataIndex: 'recipientName',
      width: 120,
      sorter: (a, b) => (a.ownerTeam - b.ownerTeam ? 1 : -1),
    },
    {
      title: '收件人手机',
      dataIndex: 'receiptMobilePhone',
      width: 120,
      sorter: (a, b) => (a.ownerTeam - b.ownerTeam ? 1 : -1),
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
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
        columns={props.Code ? AreaColumns : columns}
        scroll={{ x: 100, y: yClient }}
        bordered
        locale={{
          emptyText: () => (
            <>
              <div>暂无数据</div>
              <div>请前往CRM系统维护相关客户数据</div>
            </>
          ),
        }}
        size="small"
        // request={async (params) => {
        //   let customerCode: any;
        //   if (params.customerName) {
        //     //?如果用户输入了客户名字
        //     customerCode = params.customerCode;
        //   } else if (params.customerCode) {
        //     //?如果用户输入了客户号
        //     customerCode = params.customerCode;
        //   } else {
        //     //?客户俩都没输
        //     customerCode = 1234678900;
        //   }
        //   const searchParams: any = {
        //     pageNumber: params.current,
        //     pageSize: params.pageSize,
        //     customerName: params.customerName,
        //     customerCode: customerCode,
        //   };
        //   if (props.Code) {
        //     //?如果传了Code就是查地址，否则差客户信息
        //     const res = await queryRecAddress({ customerCode: props.Code });
        //     // console.log(res, 'resArea');
        //     if (startPage) {
        //       params.current = 1;
        //       params.pageSize = 10;
        //     }
        //     res.data?.dataList.forEach((e: any, i: number) => {
        //       e.index = i;
        //     });
        //     // 前端自己的精确匹配功能
        //     const arr = res.data?.dataList?.filter((item: any) => {
        //       return (
        //         (!params.receiptAddress || item.receiptAddress?.includes(params.receiptAddress)) &&
        //         (!params.recipientName || item.recipientName?.includes(params.recipientName)) &&
        //         (!params.receiptMobilePhone ||
        //           item.receiptMobilePhone === params.receiptMobilePhone)
        //       );
        //     });
        //     console.log(arr, 'arr');
        //     if (res.errCode === 200) {
        //       return Promise.resolve({
        //         data: arr,
        //         total: res.data?.total,
        //         current: 1,
        //         pageSize: 10,
        //         success: true,
        //       });
        //     } else {
        //       message.error(res.errMsg, 3);
        //       return Promise.resolve([]);
        //     }
        //   } else {
        //     const res = await queryMyCustomer(searchParams);
        //     if (startPage) {
        //       params.current = 1;
        //       params.pageSize = 10;
        //     }
        //     res.data?.list.forEach((e: any, i: number) => {
        //       e.index = i;
        //     });
        //     if (res.errCode === 200) {
        //       return Promise.resolve({
        //         data: res.data?.list,
        //         total: res.data?.total,
        //         current: 1,
        //         pageSize: 10,
        //         success: true,
        //       });
        //     } else {
        //       message.error(res.errMsg, 3);
        //       return Promise.resolve([]);
        //     }
        //   }
        // }}
        onRow={(record) => {
          return {
            onClick: () => {
              setSelectedRowKeys([record.index]);
              setSelectedRows([record]);
              // props.operateMethod(record);
              props.onSelect(record);
            }, // 点击行
            onDoubleClick: () => {
              setSelectedRowKeys([record.index]);
              setSelectedRows([record]);
              props.operateMethod(record);
              // onDbSave(record);
              // props.getSelModal(record);
              props.addNewModalClose();
            },
          };
        }}
        rowKey="index"
        search={{
          labelWidth: 'auto',
          span: 5,
          defaultCollapsed: false,
          collapseRender: false,
          className: 'search-form',
        }}
        rowSelection={{ type: 'radio', fixed: 'left', ...rowSelection }}
        options={false}
        tableAlertRender={false}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          // showTotal: total => `共有 ${total} 条数据`,
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
        }}
        actionRef={ref}
      />
    </div>
  );
};
export default AddNewForm;
