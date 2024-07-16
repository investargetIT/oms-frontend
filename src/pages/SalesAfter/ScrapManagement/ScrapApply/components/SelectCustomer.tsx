/* eslint-disable @typescript-eslint/no-unused-expressions */
import ProTable from '@ant-design/pro-table';
import React, { useState } from 'react';

interface SelectCustomerProps {
  column: any;
  getData: (params: any) => void;
  onSelect: (rows: any) => void;
  onDbSave?: (record: any) => void;
}

const SelectCustomer: React.FC<SelectCustomerProps> = ({ onSelect, column, getData, onDbSave }) => {
  const [rowKey, setRowKey] = useState<any>([]);
  return (
    <>
      <ProTable<any>
        columns={column}
        request={async (params: any) => {
          params.pageNumber = params.current;
          params.pageSize = params.pageSize || 10;
          const result = getData && ((await getData(params)) as any);
          if (result?.data) {
            const list = result.data.list.map((item: any, index: number) => {
              item.index = index;
              return item;
            });
            return Promise.resolve({
              data: list,
              total: result?.data?.total,
              success: true,
            });
          } else {
            return Promise.resolve({});
          }
        }}
        search={{
          labelWidth: 'auto',
          span: 8,
          defaultCollapsed: false,
          collapseRender: false,
          className: 'search-form',
        }}
        rowSelection={{
          selectedRowKeys: rowKey,
          type: 'radio',
          onChange: (keys: any, rows: any) => {
            onSelect(rows);
            setRowKey(keys);
          },
        }}
        onRow={(record: any) => {
          return {
            onClick: () => {
              onSelect([record]);
              setRowKey([record.index]);
            },
            onDoubleClick: () => {
              onDbSave && onDbSave(record);
              setRowKey([record.index]);
            },
          };
        }}
        options={false}
        rowKey="index"
        tableAlertRender={false}
        bordered
        size="small"
        style={{ height: '400px', overflowY: 'auto' }}
        scroll={{ x: 200, y: 600 }}
      />
    </>
  );
};

export default SelectCustomer;
