import { queryObdInfo } from '@/services/SalesOrder';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
// import { Button, Drawer, Modal, Space, Tabs, Tag } from 'antd';
import { Button, Modal, Tabs } from 'antd';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import MyDrawer from './InnerDrawer';
import BasicInfo from './basicInfo';
import './style.less';
import RelatedProcesses from '@/pages/SalesOrder/components/RelatedProcesses';

const Info = (props: any, Ref: any) => {
  const { TabPane } = Tabs;
  // const drawerWidth = window.innerWidth;
  const { id, row } = props;
  const ref5 = useRef<ActionType>();
  // const [drawerVisible, setdrawerVisible] = useState<any>(false);

  // const ref6 = useRef<ActionType>();
  const Inforef: any = useRef<ActionType>();
  const DrawerRef: any = useRef<ActionType>();
  const [yClient, setYClient] = useState(900);
  const { initialState, setInitialState } = useModel('@@initialState');

  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 250);
  }, [initialState?.windowInnerHeight]);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const inverteData = () => {
    setInitialState((s) => ({
      ...s,
      userRemark: '',
      csrRemark: '',
    }));
    //   更新用户备注之后数据同步
    Inforef?.current?.inverteData();
  };
  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  useImperativeHandle(Ref, () => ({
    inverteData,
  }));
  const setDrawerVisible = (record: any) => {
    DrawerRef.current.openDrawer(record);
  };
  const deliveryColumn: ProColumns<any>[] = [
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
      title: '操作',
      width: 70,
      render: (text, record) => [
        <Button
          size="small"
          key={'详情'}
          type="link"
          onClick={() => {
            setDrawerVisible(record);
          }}
        >
          详情
        </Button>,
      ],
      fixed: 'left',
    },
    { title: '发货单号', dataIndex: 'obdNo', width: 120 },
    { title: '物流商名称', dataIndex: 'tplname', width: 120 },
    { title: '快递单号', dataIndex: 'expCode', width: 120 },
    { title: '发货时间', dataIndex: 'sendTime', width: 120 },
    { title: '总金额-含税', dataIndex: 'amount', width: 120 },
    { title: '发货单创建时间', dataIndex: 'createTime', valueType: 'dateTime', width: 120 },
    { title: '收货人', dataIndex: 'consignee', width: 120 },
    { title: '收货地址', dataIndex: 'address', width: 300 },
    { title: '手机', dataIndex: 'cellphone', width: 120 },
    { title: '座机', dataIndex: 'phone', width: 120 },
    { title: '同步时间', dataIndex: 'createTime', valueType: 'dateTime', width: 120 },
  ];
  deliveryColumn.forEach((item: any) => {
    item.ellipsis = true;
  });
  return (
    <div
      id="scroll-content"
      className="form-content-search tabs-detail hasAbsTabs saleOrderDetailInfoContent"
    >
      {/* <Drawer
        className="withAnchorDrawer DrawerContent OrderDrawer"
        width={drawerWidth}
        placement="right"
        key={'Detailskey'}
        destroyOnClose={true}
        title={[
          <span key={'订单编号'}>订单编号: {row.eandoOrderNo}</span>,
          <Tag key={'订单状态'} color="gold" style={{ marginLeft: 10 }}>
            {row.eandoOrderStatusStr}
          </Tag>,
          <p
            key={'订单类型'}
            className="tipsP"
            style={{ marginBottom: '-10px', marginTop: 5, color: '#777' }}
            ref={(node) => {
              if (node) {
                node.style.setProperty('font-size', '12px', 'important');
              }
            }}
          >
            订单类型:
            <strong>{row.eandoOrderType}</strong>
          </p>,
        ]}
        visible={drawerVisible}
        onClose={() => setdrawerVisible(false)}
        extra={
          <>
            <Space>
              <Button type="link" onClick={openLog}>
                查看操作日志
              </Button>
            </Space>
          </>
        }
        footer={[
          // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
          // {btnStatus=='通过'}
          <Button key="back" onClick={detailDrawerClose}>
            关闭
          </Button>,
        ]}
      >
      </Drawer> */}

      <Tabs defaultActiveKey="1">
        <TabPane tab="订单信息" key="1">
          <BasicInfo detailDrawerClose={props.detailDrawerClose} ref={Inforef} id={id} row={row} />
        </TabPane>
        <TabPane tab="相关流程" key="2">
          <RelatedProcesses billNo={id} />
        </TabPane>
        <TabPane tab="相关发货" key="3">
          <ProTable<any>
            columns={deliveryColumn}
            scroll={{ x: 100, y: yClient }}
            request={async (params) => {
              const searchParams: any = {
                pageNumber: params.current,
                pageSize: params.pageSize,
                orderNo: id,
                // startTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                // endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
              };
              const res = await queryObdInfo(searchParams);
              res.data?.list?.forEach((e: any, i: number) => {
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
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              // showTotal: total => `共有 ${total} 条数据`,
              showTotal: (total, range) =>
                `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
              onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
            }}
            rowKey="index"
            search={false}
            toolBarRender={false}
            tableAlertRender={false}
            actionRef={ref5}
            defaultSize="small"
            bordered
          />
        </TabPane>
      </Tabs>

      <MyDrawer ref={DrawerRef} />
    </div>
  );
};

export default forwardRef(Info);
