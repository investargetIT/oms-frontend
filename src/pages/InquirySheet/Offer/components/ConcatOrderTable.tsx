/* eslint-disable @typescript-eslint/no-unused-expressions */
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Space } from 'antd';
import React, { useState } from 'react';
import { NumStatus } from '../../contants';

interface ConcatOrderTableProps {
  ids: any;
  dataList?: Record<any, any>;
  onSelect?: (ids: any, data: any) => void;
}

const ConcatOrderTable: React.FC<ConcatOrderTableProps> = ({
  dataList = [] as any,
  onSelect,
  ids = [] as any,
}) => {
  const columns: ProColumns<any>[] = [
    {
      title: '#',
      width: 50,
      dataIndex: 'index',
      valueType: 'index',
      render: (_) => <a>{_}</a>,
      fixed: 'left',
    },
    {
      title: 'SKU号',
      width: 100,
      dataIndex: 'sku',
      fixed: 'left',
    },
    {
      title: '产品名称（中文）',
      width: 300,
      dataIndex: 'productNameZh',
      render: (_, record: any) => {
        return `${record?.brandName} ${record?.productNameZh} ${record?.mfgSku}`;
      },
    },
    {
      title: '转订单状态',
      width: 80,
      dataIndex: 'lineStatus',
      render: (_, record: any) => NumStatus[record.lineStatus],
    },
    {
      title: '成交价含税',
      width: 120,
      dataIndex: 'salesPrice',
    },
    {
      title: '成交价未税',
      width: 120,
      dataIndex: 'salesPriceNet',
    },
    {
      title: '报价单数量',
      width: 80,
      dataIndex: 'qty',
    },
    {
      title: '销售单位',
      width: 80,
      dataIndex: 'salesUomCode',
    },
    {
      title: '已清数量',
      width: 80,
      dataIndex: 'closeQty',
    },
    {
      title: '行运费',
      width: 100,
      dataIndex: 'freight',
    },
    {
      title: '客户物料号',
      width: 100,
      dataIndex: 'customerSku',
    },
    {
      title: 'SKU类型',
      width: 100,
      dataIndex: 'skuTypeName',
    },
    {
      title: '需求数量',
      width: 100,
      dataIndex: 'reqQty',
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  const [rowKey, setRowKey] = useState<any>([]);

  const canTransLength = dataList?.filter(
    (ic: any) => ic.lineStatus == 80 || ic.lineStatus == 81 || ic.lineStatus == 100,
  ).length;

  columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  return (
    <ProTable<any>
      bordered
      size="small"
      scroll={{ x: 100, y: 300 }}
      columns={columns}
      rowSelection={{
        alwaysShowAlert: true,
        selectedRowKeys: rowKey,
        type: 'checkbox',
        onChange: (rowKeys, rowData) => {
          onSelect && onSelect(rowKeys, rowData);
          setRowKey(rowKeys);
        },
      }}
      onRow={(record: any) => {
        return {
          onClick: () => {
            if (record?.enabledFlag == 0) {
              return false;
            }
            const selectedRowKeys = [...rowKey];
            let newList: any = [];
            if (selectedRowKeys.indexOf(record.quotLineId) >= 0) {
              selectedRowKeys.splice(selectedRowKeys.indexOf(record.quotLineId), 1);
              // newList.forEach((item, index) => {
              //   if (item.quotLineId === record.quotLineId) {
              //     newList.splice(index, 1);
              //   }
              // });
            } else {
              selectedRowKeys.push(record.quotLineId);
            }
            newList = dataList.filter((io: any) => selectedRowKeys.includes(io.quotLineId));
            setRowKey(selectedRowKeys);
            onSelect && onSelect(selectedRowKeys, newList);
          },
        };
      }}
      tableAlertRender={({ selectedRowKeys }) => (
        <Space size={24}>
          <span>
            数据统计：已选 {ids.length}个报价单，{dataList.length}行需求， 其中
            {canTransLength} 行可合并报价；当前已选明细{selectedRowKeys.length}行
          </span>
        </Space>
      )}
      tableAlertOptionRender={() => {
        return false;
      }}
      dataSource={dataList}
      pagination={false}
      options={false}
      search={false}
      rowKey="quotLineId"
    />
  );
};

export default ConcatOrderTable;
