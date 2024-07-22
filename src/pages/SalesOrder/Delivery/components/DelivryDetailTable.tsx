import React, { useState, useRef, useEffect } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message } from 'antd';
import { useModel } from 'umi';
import { getDeliverySkuList } from '@/services/SalesOrder';
import moment from 'moment';

const DelivryDetailTable: React.FC<{ id: string; tableRowData: object }> = (props: any) => {
  const { id, tableRowData } = props;
  const { initialState } = useModel('@@initialState');
  const ref = useRef<ActionType>();
  const [yClient, setYClient] = useState(900);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

  const data = tableRowData;
  if (tableRowData.createTime) {
    data.createTime = moment(tableRowData.createTime).format('YYYY-MM-DD HH:mm:ss');
  }

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '发货单行号',
      width: 120,
      dataIndex: 'obdLineNo',
      fixed: 'left',
    },
    {
      title: 'ERP订单行号',
      width: 120,
      dataIndex: 'orderLineNo',
      fixed: 'left',
    },
    {
      title: 'SKU',
      width: 120,
      dataIndex: 'skuCode',
      fixed: 'left',
    },
    {
      title: '订单数量',
      width: 120,
      dataIndex: 'orderCount',
    },
    {
      title: '发货数量',
      width: 120,
      dataIndex: 'sendCount',
    },
    {
      title: '产品描述',
      width: 260,
      dataIndex: 'productNameConcatStr',
    },
    {
      title: '品牌名称',
      width: 150,
      dataIndex: 'brandName',
    },
    {
      title: '制造商型号',
      width: 180,
      dataIndex: 'mfrpn',
    },
    {
      title: '销售单位',
      width: 120,
      dataIndex: 'vrkme',
    },
    {
      title: '物理单位',
      width: 120,
      dataIndex: 'punit',
    },
    {
      title: '销售成交价含税',
      width: 120,
      dataIndex: 'price',
    },
    {
      title: '同步时间',
      width: 150,
      valueType: 'dateTime',
      render() {
        return data.createTime;
      },
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 350);
  }, [initialState?.windowInnerHeight]);

  return (
    <div className="noPaddingTable">
      <ProTable<any>
        columns={columns}
        scroll={{ x: 100, y: yClient }}
        bordered
        size="small"
        options={{ reload: false, density: false }}
        request={async (params) => {
          if (startPage) {
            params.current = 1;
            // params.pageSize = 20;
          }
          // 表单搜索项会从 params 传入，传递给后端接口。
          // const searchParams = {
          //   // orderNo: id,
          //   obdNo: id,
          //   pageNumber: params.current,
          //   pageSize: params.pageSize,
          // };
          // const res = await getDeliverySkuList(searchParams);
          // res.data?.list.forEach((e: any, i: number) => {
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
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          // showTotal: total => `共有 ${total} 条数据`,
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
        }}
        search={false}
        tableAlertRender={false}
        actionRef={ref}
      />
    </div>
  );
};
export default DelivryDetailTable;
