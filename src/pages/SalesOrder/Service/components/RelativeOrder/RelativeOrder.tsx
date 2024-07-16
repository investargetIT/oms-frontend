import React, { useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Modal } from 'antd';
import { relation } from '@/services/SalesOrder';
const RelativeOrder: React.FC<{ id: string }> = (props) => {
  const { id } = props;
  const ref = useRef<ActionType>();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    { title: '订单编号', width: 120, dataIndex: 'orderNo', fixed: 'left' },
    {
      title: '订单创建时间',
      width: 150,
      valueType: 'dateTime',
      dataIndex: 'createTime',
    },
    // { title: 'ERP订单号', width: 120, dataIndex: 'erpOrderNo' },
    { title: '状态', width: 120, dataIndex: 'orderStatus' },
    { title: '订单渠道', width: 120, dataIndex: 'channel' },
    { title: '所属公司', width: 120, dataIndex: 'companyName' },
    { title: '客户代号', width: 120, dataIndex: 'customerCode' },
    { title: '客户名称', width: 120, dataIndex: 'customerName' },
    { title: 'R3联系人', width: 120, dataIndex: 'contactsCode' },
    { title: '创建人', width: 120, dataIndex: 'createName' },
    { title: '客户采购单号', width: 120, dataIndex: 'customerPurchaseNo' },
    { title: '运费', width: 120, dataIndex: 'totalFreight' },
    { title: '含税总金额', width: 120, dataIndex: 'amount' },
    { title: '货品总计-含税', width: 120, dataIndex: 'goodsAmount' },
    { title: '网站促销活动代号', width: 120, dataIndex: 'discountCode' },
    { title: 'CSR审单时间', width: 120, dataIndex: 'csrReviewTime' },
    { title: 'CSR审单人', width: 120, dataIndex: 'csrReviewUser' },
    { title: '折扣总计', width: 120, dataIndex: 'discountAmount' },
    { title: '放单备注', width: 120, dataIndex: 'releaseRemark' },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  return (
    <div className="contentSty">
      <ProTable<any>
        columns={columns}
        scroll={{ x: 200 }}
        request={async (params) => {
          const searchParams: any = {
            pageNumber: params.current,
            pageSize: params.pageSize,
            orderNo: id,
          };
          const res = await relation(searchParams);
          console.log(res, '这里是关联订单的数据');
          if (res.errCode === 200) {
            return Promise.resolve({
              data: res.data?.list,
              total: res.data?.total,
              success: true,
            });
          } else {
            Modal.error(res.errMsg);
            return Promise.resolve([]);
          }
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
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
    </div>
  );
};

export default RelativeOrder;
