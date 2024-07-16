import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Drawer, Modal } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
// import { getLogistics } from '@/services/afterSales';
import { getInvoiceLogistics } from '@/services/SalesOrder/Order';
import { useModel } from 'umi';
const MyDrawer = ({}, ref: any) => {
  const drawerWidth = window.innerWidth * 0.8;
  const { initialState } = useModel('@@initialState');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rowDetail, setRowDetail]: any = useState(false); //?存储上一个页面的行信息
  const [deliveryDetail, setDeliveryDetail]: any = useState();
  const [yClient, setYClient] = useState(900);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const infoColumn: ProColumns<any>[] = [
    {
      title: '#',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '固安捷物流状态',
      width: 150,
      dataIndex: 'code',
      render: (_, record) => {
        if (record.code === '1') {
          return '已揽收';
        } else if (record.code === '2') {
          return '准备发出';
        } else if (record.code === '3') {
          return '已发出';
        } else if (record.code === '4') {
          return '到达';
        } else if (record.code === '5') {
          return '派送';
        } else if (record.code === '6') {
          return '签收';
        } else if (record.code === '7') {
          return '拒收';
        }
      },
    },
    {
      title: '在途时间',
      width: 150,
      dataIndex: 'date',
      valueType: 'dateTime',
    },
    {
      title: '在途详细',
      width: 280,
      dataIndex: 'details',
    },
    {
      title: '在途城市',
      width: 180,
      dataIndex: 'place',
    },
  ];

  infoColumn.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 350);
  }, [initialState?.windowInnerHeight]);
  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const tableRef: any = useRef();
  const open = async (e: any) => {
    setIsModalVisible(true);
    setRowDetail(e); //?存储上一个页面的行信息
    await setTimeout(() => {});
    tableRef.current.reload();
  };
  const close = () => {
    setIsModalVisible(false);
  };
  useImperativeHandle(ref, () => ({
    openDrawer: open,
    closeDrawer: close,
  }));

  return (
    <div>
      <Drawer
        width={drawerWidth}
        key={'modal'}
        destroyOnClose={true}
        placement="right"
        title={[<span key={'发货详情'}>发票物流明细</span>]}
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
        className="InnerInvoiceDrawer"
      >
        <div className="specialTitle" style={{ marginBottom: '18px' }}>
          <span>物流单号:</span>
          <span style={{ margin: '0 20px' }}>{deliveryDetail?.express_no}</span>
          <span>物流商:</span>
          <span style={{ margin: '0 20px' }}>{deliveryDetail?.logistics_name}</span>
        </div>
        <ProTable<any>
          columns={infoColumn}
          scroll={{ x: 100, y: yClient }}
          bordered
          size="small"
          request={async (params) => {
            const searchParams: any = {
              pageNumber: params.current,
              pageSize: params.pageSize,
              expressNo: [rowDetail.invLogisticNo],
              // expressNo: ['312178890271679'],
              // orderNo: id,
              // codes: [rowDetail.obdNo],
              // obdNo: rowDetail.obdNo,
              // startTime:row.
            };
            const res = await getInvoiceLogistics(searchParams);
            if (res.errCode === 200) {
              setDeliveryDetail(res.data[0]);
              res.data.forEach((e: { index: number }, i: number) => {
                e.index = i;
              });
              return Promise.resolve({
                data: res.data[0].tran_data_list,
                total: res.data?.total,
                success: true,
              });
            } else {
              Modal.error(res.errMsg);
              return Promise.resolve([]);
            }
          }}
          rowKey="index"
          search={false}
          tableAlertRender={false}
          defaultSize="small"
          options={{ reload: false, density: false }}
          toolBarRender={false}
          actionRef={tableRef}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
            onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
          }}
          headerTitle={
            <div className="specialTitle">
              <span style={{ marginRight: '100px' }}>物流单号</span>
              <span>物流商</span>
            </div>
          }
        />
      </Drawer>
    </div>
  );
};
export default forwardRef(MyDrawer);
