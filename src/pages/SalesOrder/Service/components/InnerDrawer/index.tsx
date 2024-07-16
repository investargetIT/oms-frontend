import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Drawer, Form, Modal, Tabs } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import './style.less';
// import { getLogistics } from '@/services/afterSales';
import { getDeliveryLogistics } from '@/services/SalesOrder';
import { queryObdItem } from '@/services/SalesOrder/Order';
import { useModel } from 'umi';
import Logistics from '../../../Delivery/components/Logistics';
const { TabPane } = Tabs;
const MyDrawer = ({}, ref: any) => {
  const drawerWidth = window.innerWidth * 0.8;
  const { initialState } = useModel('@@initialState');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rowDetail, setRowDetail]: any = useState({}); //?存储上一个页面的行信息
  const [yClient, setYClient] = useState(900);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [receiptDetail, setReceiptDetail] = useState([]);
  const [logisticsDetail, setLogisticsDetail] = useState([]);
  const [logisticsError, setLogisticsError] = useState('');
  const [logData, setLogData] = useState({});
  // const [currentPage1, setCurrentPage1] = useState(1);
  // const [currentPageSize1, setCurrentPageSize1] = useState(10);
  const logRef: any = useRef<ActionType>();
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
    { title: '发货单行号', dataIndex: 'obdLineNo', width: 120, fixed: 'left' },
    { title: 'ERP订单行号', dataIndex: 'orderLineNo', width: 100, fixed: 'left' },
    { title: 'SKU', dataIndex: 'skuCode', width: 120, fixed: 'left' },
    { title: '订单数量', dataIndex: 'orderCount', width: 100 },
    { title: '发货数量', dataIndex: 'sendCount', width: 100 },
    { title: '产品描述', dataIndex: 'skuName', width: 260 },
    { title: '品牌名称', dataIndex: 'brandName', width: 100 },
    { title: '制造商型号', dataIndex: 'mfrpn', width: 150 },
    { title: '销售单位', dataIndex: 'vrkme', width: 100 },
    { title: '物理单位', dataIndex: 'punit', width: 100 },
    { title: '销售成交价含税', dataIndex: 'price', width: 150 },
    {
      title: '同步时间',
      dataIndex: 'price',
      width: 150,
      valueType: 'dateTime',
      render() {
        return <span>{rowDetail?.createTime}</span>;
      },
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
    await setTimeout(() => {}, 0); //?打开抽屉之后重新刷新表格
    tableRef?.current?.reload(true);
  };
  const close = () => {
    setIsModalVisible(false);
  };
  useImperativeHandle(ref, () => ({
    openDrawer: open,
    closeDrawer: close,
  }));

  // const logData = {
  //   // obd_no_list: ['0402429067'],
  //   obd_no_list: [rowDetail?.obdNo],
  //   sys_user: 'OMS',
  // };

  useEffect(() => {
    if (rowDetail?.obdNo)
      setLogData({
        obd_no_list: [rowDetail?.obdNo],
        sys_user: 'OMS',
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowDetail]);

  function changeTab(e: any) {
    if (e !== '2') return; //?避免不必要的请求
    getDeliveryLogistics(logData).then((res: any) => {
      if (res.errCode === 200) {
        if (res.data[0] && JSON.stringify(res.data[0]) != '{}') {
          if (res.data[0].image_urlList && JSON.stringify(res.data[0].image_urlList) != '[]') {
            const detail_data: any = {
              data: res.data[0].image_urlList,
              total: res.data[0].image_urlList.length,
              current: 1,
              pageSize: 20,
              success: true,
            };
            setReceiptDetail(detail_data);
          }
          if (res.data[0].tran_data_list && JSON.stringify(res.data[0].tran_data_list) != '[]') {
            const detail_data: any = {
              data: res.data[0].tran_data_list,
              total: res.data[0].tran_data_list.length,
              current: 1,
              pageSize: 20,
              success: true,
            };
            setLogisticsDetail(detail_data);
          }
        }
        logRef?.current?.reloadtable(true);
        setLogisticsError('');
      } else {
        setLogisticsError(res.errMsg);
        setReceiptDetail([]);
        setLogisticsDetail([]);
      }
    });
  }
  return (
    <div>
      <Drawer
        width={drawerWidth}
        key={'modal'}
        destroyOnClose={true}
        placement="right"
        title={[<span key={'发货详情'}>发货详情</span>]}
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
        className="InnerOrderDrawer"
      >
        <Form>
          <h3 className="formTitle" id="one">
            订单信息
          </h3>
          <div className="ant-advanced-form four-gridCol">
            <Form.Item label="发货单号">
              <span className="form-span">{rowDetail?.obdNo}</span>
            </Form.Item>
            <Form.Item label="销售">
              <span className="form-span">{rowDetail?.salesName}</span>
            </Form.Item>
            <Form.Item label="物流商名称">
              <span className="form-span">{rowDetail?.tplname}</span>
            </Form.Item>
            <Form.Item label="快递单号">
              <span className="form-span">{rowDetail?.expCode}</span>
            </Form.Item>
            <Form.Item label="收货人">
              <span className="form-span">{rowDetail?.consignee}</span>
            </Form.Item>
            <Form.Item label="手机">
              <span className="form-span">{rowDetail?.cellphone}</span>
            </Form.Item>
            <Form.Item label="发货日期">
              <span className="form-span">{rowDetail?.sendTime}</span>
            </Form.Item>
          </div>
        </Form>
        <Tabs onChange={changeTab} defaultActiveKey="1">
          <TabPane tab="发货明细" key="1">
            <ProTable<any>
              columns={infoColumn}
              scroll={{ x: 100, y: yClient }}
              bordered
              size="small"
              request={async (params) => {
                const searchParams: any = {
                  pageNumber: params.current,
                  pageSize: params.pageSize,
                  // orderNo: id,
                  // codes: [rowDetail?.obdNo],
                  obdNo: rowDetail?.obdNo,
                  // startTime:row.
                };
                const res = await queryObdItem(searchParams);
                res.data?.list.forEach((e: { index: number }, i: number) => {
                  e.index = i;
                });
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
              rowKey="index"
              search={false}
              tableAlertRender={false}
              defaultSize="small"
              options={{ reload: false, density: false }}
              toolBarRender={false}
              actionRef={tableRef}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total, range) =>
                  `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
              }}
            />
          </TabPane>
          <TabPane tab="物流信息" key="2" forceRender={false}>
            <Logistics
              ref={logRef}
              receiptDetail={receiptDetail}
              logisticsDetail={logisticsDetail}
              logisticsError={logisticsError}
            />
          </TabPane>
        </Tabs>
      </Drawer>
    </div>
  );
};
export default forwardRef(MyDrawer);
