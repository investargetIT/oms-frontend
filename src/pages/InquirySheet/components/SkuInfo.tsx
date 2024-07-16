import React, { useState } from 'react';
import { Space, Button } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import { history } from 'umi';
import ProTable from '@ant-design/pro-table';
import { colLimit } from '@/services';
const SkuInfo: React.FC = () => {
  const list: any = [];
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
    },
    {
      title: '操作',
      width: 150,
      render: () => [
        <Button key={'详情'} type="link">
          详情
        </Button>,
        <Button key={'编辑'} type="link">
          编辑
        </Button>,
      ],
      fixed: 'left',
    },
    {
      title: '询价单号',
      dataIndex: 'containers',
      width: 150,
      fixed: 'left',
    },
    {
      title: '询价单状态',
      dataIndex: 'containers1',
      width: 150,
      fixed: 'left',
    },
    {
      title: '询价单类型',
      dataIndex: 'containers2',
      width: 150,
      fixed: 'left',
    },
    {
      title: '需求类型',
      dataIndex: 'containers3',
      width: 150,
      fixed: 'left',
    },
    {
      title: '所属公司',
      dataIndex: 'containers4',
      width: 150,
      fixed: 'left',
    },
    {
      title: '客户号',
      dataIndex: 'containers5',
      width: 150,
      fixed: 'left',
    },
    {
      title: '客户名称',
      width: 150,
      dataIndex: 'containers6',
    },
    {
      title: '客户级别',
      width: 150,
      dataIndex: 'containers7',
    },
    {
      title: '商机名称',
      width: 150,
      dataIndex: 'containers8',
    },
    {
      title: '项目名称',
      width: 150,
      dataIndex: 'containers9',
    },
    {
      title: 'R3联系人',
      width: 150,
      dataIndex: 'containers10',
    },
    {
      title: '评分',
      width: 150,
      dataIndex: 'containers11',
    },
    {
      title: '统计用时',
      width: 150,
      dataIndex: 'containers12',
      sorter: true,
    },
    {
      title: '创建人',
      width: 150,
      dataIndex: 'containers13',
    },
    {
      title: '创建修改时间',
      width: 150,
      dataIndex: 'containers14',
    },
    {
      title: '最后修改人',
      width: 150,
      dataIndex: 'containers15',
    },
    {
      title: '最后修改时间',
      width: 150,
      dataIndex: 'containers16',
    },
    {
      title: '全部已清时间',
      width: 150,
      dataIndex: 'containers17',
    },
    {
      title: '创建者',
      width: 150,
      dataIndex: 'creator',
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };
  return (
    <div>
      <ProTable<any>
        columns={columns}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columnsState={{
          value: columnsStateMap,
          onChange: (val: any) => {
            colLimit(val, setColumnsStateMap);
          },
          persistenceKey: history.location.pathname,
          persistenceType: 'localStorage',
        }}
        scroll={{ x: 100 }}
        options={{ reload: false, density: false }}
        request={(params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          console.log(params, sorter, filter, '测试数据=====');
          return Promise.resolve({
            data: list,
            success: true,
          });
        }}
        headerTitle={
          <Space>
            <Button key="编辑" type="primary" onClick={() => {}}>
              编 辑
            </Button>
            <Button
              key="导出"
              type="primary"
              onClick={() => {
                alert('add');
              }}
            >
              {' '}
              导 出{' '}
            </Button>
            <Button
              key="导入"
              type="primary"
              onClick={() => {
                alert('add');
              }}
            >
              {' '}
              导入{' '}
            </Button>
          </Space>
        }
        rowKey="key"
        search={false}
        tableAlertRender={false}
      />
    </div>
  );
};

export default SkuInfo;
