/* eslint-disable @typescript-eslint/no-unused-expressions */

import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Spin } from 'antd';
import React, { useState } from 'react';

interface SecondDetailProps {
  secondList: any;
  onSelect: (arr: any) => void;
}

const SecondDetail: React.FC<SecondDetailProps> = ({ secondList, onSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const columns: ProColumns<ProColumns>[] = [
    {
      title: '#',
      width: 50,
      dataIndex: 'index',
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
      fixed: 'left',
    },
    {
      title: '发货单行号',
      dataIndex: 'obdItemNo',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      fixed: 'left',
      width: 80,
    },
    {
      title: '订单数量',
      dataIndex: 'orderQty',
      search: false,
    },
    {
      title: '发货数量',
      dataIndex: 'qty',
    },
    {
      title: '产品描述',
      dataIndex: 'itemName',
      search: false,
    },
    {
      title: '品牌名称',
      dataIndex: 'brandName',
      search: false,
    },
    {
      title: '制造商型号',
      dataIndex: 'mfgSku',
      search: false,
    },
    {
      title: '销售成交价',
      dataIndex: 'salesPrice',
      search: false,
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  const [rowKey, setRowKey] = useState<any>([]);
  const [list, setList] = useState<any>([]);

  return (
    <Spin spinning={secondList?.length > 0 ? false : true}>
      <ProTable<ProColumns>
        tableStyle={{ padding: 0 }}
        columns={columns}
        bordered
        size="small"
        rowSelection={{
          selectedRowKeys: rowKey,
          alwaysShowAlert: false,
          type: 'checkbox',
          onChange: (rowKeys, rowData) => {
            onSelect && onSelect(rowData);
            setRowKey(rowKeys);
          },
          getCheckboxProps: (record: any) => ({
            disabled: record?.enabledFlag == 0,
          }),
        }}
        onRow={(record: any) => {
          return {
            onClick: () => {
              if (record?.enabledFlag == 0) {
                return false;
              }
              const selectedRowKeys = [...rowKey];
              const newList = [...list];
              if (selectedRowKeys.indexOf(record.obdItemNo) >= 0) {
                selectedRowKeys.splice(selectedRowKeys.indexOf(record.obdItemNo), 1);
                newList.forEach((item, index) => {
                  if (item.obdItemNo === record.obdItemNo) {
                    newList.splice(index, 1);
                  }
                });
              } else {
                selectedRowKeys.push(record.obdItemNo);
                newList.push(record);
              }
              setRowKey(selectedRowKeys);
              setList(newList);
              onSelect && onSelect(newList);
            },
          };
        }}
        tableAlertRender={({}) => {
          return false;
        }}
        tableAlertOptionRender={() => {
          return false;
        }}
        dataSource={secondList}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          // showTotal: total => `共有 ${total} 条数据`,
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
          showQuickJumper: true,
        }}
        options={false}
        search={false}
        rowKey={'obdItemNo'}
      />
    </Spin>
  );
};

export default SecondDetail;
