import React, { useState, useRef, useEffect } from 'react';
import { message } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getAChangeToBList } from '@/services/SalesOrder';
import { useModel } from 'umi';
const AchangeToB: React.FC<{ id: string }> = (props: any) => {
  const { id } = props;
  const { initialState } = useModel('@@initialState');
  const ref = useRef<ActionType>();
  const [yClient, setYClient] = useState(900);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

  const columns: ProColumns<any>[] = [
    {
      title: '#',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    { title: '原SKU', dataIndex: 'originalSku', width: 120, fixed: 'left' },
    { title: '原数量', dataIndex: 'originalQty', width: 120 },
    { title: '原含税成交价', dataIndex: 'originalSalesPrice', width: 120 },
    { title: '原SKU产品名称', dataIndex: 'originalProductNameConcatStr', width: 260 },
    { title: '小计含税', dataIndex: 'totalAmount', width: 120 },
    { title: '替换SKU', dataIndex: 'replaceSku', width: 120 },
    { title: '替换数量', dataIndex: 'replaceQty', width: 120 },
    { title: '替换单价含税', dataIndex: 'replaceSalesPrice', width: 120 },
    { title: '替换物料原面价含税', dataIndex: 'replaceOriginalPrice', width: 150 },
    {
      title: '替换成本价含税',
      dataIndex: 'replaceCost',
      width: 120,
      render() {
        return '***';
      },
    },
    {
      title: '替换毛利率',
      dataIndex: 'replaceGp',
      width: 120,
      render() {
        return '***';
      },
    },
    { title: '替换SKU产品名称', dataIndex: 'replaceProductNameConcatStr', width: 260 },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 320);
  }, [initialState?.windowInnerHeight]);

  return (
    <ProTable<any>
      columns={columns}
      scroll={{ x: 100, y: yClient }}
      bordered
      size="small"
      options={{ reload: false, density: false }}
      request={async (params) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        console.log(params);
        const searchParams: any = {
          pageNumber: params.current,
          pageSize: params.pageSize,
          orderNo: id,
        };
        // const res = await getAChangeToBList(searchParams);
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
      pagination={{
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        // showTotal: total => `共有 ${total} 条数据`,
        showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
        onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
      }}
      rowKey={() => Math.random()}
      search={false}
      toolBarRender={false}
      tableAlertRender={false}
      actionRef={ref}
      defaultSize="small"
    />
  );
};

export default AchangeToB;
