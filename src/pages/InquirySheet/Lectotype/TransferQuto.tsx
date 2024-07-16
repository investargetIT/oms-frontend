import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Space, message } from 'antd';
import { getToQuoteList } from '@/services/InquirySheet';
import type { ActionType } from '@ant-design/pro-table';
import VirtualTable from '@/components/VirtualTable';
import moment from 'moment';
const TransferQuto: React.FC<{ sidList: any }> = ({ sidList }: any, ref: any) => {
  const actRef = useRef<ActionType>();
  const [selectedRow, setSelectedRow]: any = useState([]);
  const [selectedRowKeys, setSelectedRowKeys]: any = useState([]);
  const [total, setTotal]: any = useState({});
  const rowSelection: any = {
    type: 'checkbox',
    selectedRowKeys,
    onChange: (keys: React.Key[], row: any) => {
      setSelectedRowKeys(keys);
      setSelectedRow(row);
    },
    getCheckboxProps: (record: any) => ({
      disabled:
        !(record.canQuoteQty > 0) ||
        ![190, 200].includes(record.lineStatus) ||
        !record.quoteValidDate ||
        moment().subtract(1, 'day').isAfter(record.quoteValidDate),
    }),
  };
  // 暴露组件的方法
  useImperativeHandle(ref, () => ({
    getParams: async () => {
      return selectedRow;
    },
  }));
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      fixed: 'left',
      width: 50,
      render(text: any, record: any, index: number) {
        return index + 1;
      },
    },
    { title: 'SKU号', dataIndex: 'sku', width: 150, ellipsis: true, fixed: 'left' },
    { title: '产品名称(中文)', dataIndex: 'productNameZh', width: 150, ellipsis: true },
    { title: '询价单位', dataIndex: 'reqUom', width: 150, ellipsis: true },
    { title: '销售单位', dataIndex: 'salesUomCode', width: 200, ellipsis: true },
    { title: '行项目状态', dataIndex: 'lineStatusStr', width: 200, ellipsis: true },
    { title: '需求数量', dataIndex: 'reqQty', width: 220, ellipsis: true },
    { title: '可转数量', dataIndex: 'canQuoteQty', width: 200, ellipsis: true },
    { title: '已转数量', dataIndex: 'quoteQty', width: 200, ellipsis: true },
    { title: '报价到期日', dataIndex: 'quoteValidDate', width: 150, ellipsis: true },
  ];

  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  return (
    <div className="base-info">
      <div>
        数据统计：
        <Space>
          <div>已选{total.inquiryNumber}个需求单</div>
          <div>{total.inquiryLineNumber} 行需求，</div>
          <div>其中 {total.canQuoteNumber} 行可报价，</div>
          <div>{total.quoteNumber} 行已报价；</div>
          <div>当前已选明细 {selectedRow.length} 行</div>
        </Space>
      </div>
      <VirtualTable
        columns={columns}
        request={async () => {
          const searchParams: any = {};
          searchParams.sidList = sidList;
          const res = await getToQuoteList(searchParams);
          if (res.errCode === 200) {
            setSelectedRow([]);
            setTotal(res.data);
            const list: any = res.data?.itemList || [];
            return Promise.resolve({ data: list, success: true });
          } else {
            message.error(res.errMsg);
            return Promise.resolve([]);
          }
        }}
        rowSelection={rowSelection}
        onRow={(record: any) => {
          return {
            onClick: () => {
              if (
                !(record.canQuoteQty > 0) ||
                ![190, 200].includes(record.lineStatus) ||
                !record.quoteValidDate ||
                moment().subtract(1, 'day').isAfter(record.quoteValidDate)
              )
                return;
              if (selectedRowKeys.includes(record.sid)) {
                const newKeys = selectedRowKeys.filter((item: any) => item !== record.sid);
                setSelectedRowKeys(newKeys);
                const newRows = selectedRow.filter((item: any) => item.sid !== record.sid);
                setSelectedRow(newRows);
              } else {
                setSelectedRowKeys(selectedRowKeys.concat([record.sid]));
                setSelectedRow(selectedRow.concat([record]));
              }
            },
          };
        }}
        options={false}
        rowKey="sid"
        search={false}
        tableAlertRender={false}
        actionRef={actRef}
        defaultSize="small"
        scroll={{ x: 200, y: 500 }}
        pagination={false}
      />
    </div>
  );
};
export default forwardRef(TransferQuto);
