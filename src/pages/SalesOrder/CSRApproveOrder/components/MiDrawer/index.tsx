// import { modifySpecInfoDetail, modifySpecInfo } from '@/services/SalesOrder/Order';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Drawer, message } from 'antd';
import { queryMiDetail } from '@/services/SalesOrder';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import './style.less';

const Index = ({}: any, ref: any) => {
  const [OrderNo, setOrderNo] = useState();
  // const [currentPage, setCurrentPage] = useState(1);
  // const [currentPageSize, setCurrentPageSize] = useState(20);
  // function onShowSizeChange(current: any, pageSize: any) {
  //   setCurrentPage(current);
  //   setCurrentPageSize(pageSize);
  // }
  const infoColumn: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'lineNum',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        // return record.lineNum;
        return <span>{index + 1}</span>;
      },
    },
    { title: 'SKU号', dataIndex: 'skuCode', width: 120 },
    { title: '产品名称', dataIndex: 'skuName', width: 120 },
    {
      title: '本次下单数量',
      dataIndex: 'qty',
      width: 120,
    },
    {
      title: 'MI备货申请号',
      dataIndex: 'miApplyNo',
      width: 120,
    },
    {
      title: 'MI备货数量',
      dataIndex: 'skuStockQuantity',
      width: 100,
    },
    {
      title: '备货剩余数量',
      dataIndex: 'remain',
      width: 100,
    },
  ];
  infoColumn.forEach((item: any) => {
    item.ellipsis = true;
  });
  const drawerWidth = window.innerWidth * 0.8;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const tableRef: any = useRef();
  const open = async (orderNO: any) => {
    setOrderNo(orderNO);
    setIsModalVisible(true);
  };
  useImperativeHandle(ref, () => ({
    open,
  }));
  return (
    <div>
      <Drawer
        width={drawerWidth}
        key={'MI备货信息查询'}
        destroyOnClose={true}
        placement="right"
        title={
          <>
            <span style={{ fontWeight: '800', fontSize: '18px' }}>MI备货信息查询</span>
            <span style={{ color: '#cccccc', marginLeft: '10px', fontSize: '14px' }}>
              仅查询本订单的SKU的相关MI备货信息
            </span>
          </>
        }
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
        className="SpecialModifyDrawer"
        footer={
          [
            // <Button key="apply" className="saveSub" loading={confirmload} onClick={savefn}>
            //   确认
            // </Button>,
            // <Button key="close" className="close" onClick={closeDrawer}>
            //   取消
            // </Button>,
          ]
        }
      >
        <ProTable<any>
          columns={infoColumn}
          bordered
          size="small"
          // dataSource={repArr}
          request={async () => {
            // const searchParams: any = {};
            // searchParams.pageNumber = params.current;
            // searchParams.pageSize = params.pageSize;
            //以上原来就屏蔽
            // const res = await queryMiDetail({ orderNo: OrderNo });
            // if (res.errCode === 200) {
            //   return Promise.resolve({
            //     data: res.data?.dataList,
            //     total: res.data?.total,
            //     success: true,
            //   });
            // } else {
            //   message.error(res.errMsg);
            //   return Promise.resolve([]);
            // }
          }}
          rowKey="lineNum"
          search={false}
          tableAlertRender={false}
          defaultSize="small"
          scroll={{ x: 0, y: 250 }}
          options={{ reload: false, density: false }}
          toolBarRender={false}
          actionRef={tableRef}
          // pagination={{
          //   pageSize: 10,
          //   showSizeChanger: true,
          //   pageSizeOptions: ['10', '20', '50', '100'],
          //   showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          //   onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
          // }}
        />
      </Drawer>
    </div>
  );
};
export default forwardRef(Index);
