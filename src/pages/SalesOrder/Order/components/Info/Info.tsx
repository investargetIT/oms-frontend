import { queryObdInfo, quotation } from '@/services/SalesOrder';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Modal, Tabs } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import MyDrawer from '../InnerDrawer';
import BasicInfo from './basicInfo';
import RelateInvoice from '../RelateInvoice';
import AchangeToB from '@/pages/SalesOrder/components/AchangeToB';
import RelatedProcessesOrder from '@/pages/SalesOrder/components/RelatedProcessesOrder';
import './style.less';

const Info = (props: any, Ref: any) => {
  const { TabPane } = Tabs;
  const { id, row } = props;
  const ref3 = useRef<ActionType>();
  const ref5 = useRef<ActionType>();
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
  const [currentPage3, setCurrentPage3] = useState(1);
  const [currentPageSize3, setCurrentPageSize3] = useState(10);
  const inverteData = () => {
    setInitialState((s) => ({
      ...s,
      userRemark: '',
      csrRemark: '',
    }));
    //   更新用户备注之后数据同步
    Inforef?.current?.inverteData();
  };
  // 相关报价
  const quotColumn: ProColumns<any>[] = [
    {
      title: '#',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage3 - 1) * currentPageSize3 + index + 1}</span>;
      },
    },
    { title: '报价单编号', dataIndex: 'quotCode', width: 120 },
    { title: '报价单类型', dataIndex: 'quotType', width: 120 },
  ];
  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  function onShowSizeChange3(current: any, pageSize: any) {
    setCurrentPage3(current);
    setCurrentPageSize3(pageSize);
  }
  useImperativeHandle(Ref, () => ({
    inverteData,
    addUpload: () => {
      Inforef?.current?.addUpload();
    },
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
      <Tabs defaultActiveKey="1">
        <TabPane tab="订单信息" key="1">
          <BasicInfo ref={Inforef} id={id} row={row} />
        </TabPane>
        <TabPane tab="相关报价" key="2">
          <ProTable<any>
            columns={quotColumn}
            request={async (params) => {
              // 表单搜索项会从 params 传入，传递给后端接口。
              const searchParams: any = {
                pageNumber: params.current,
                pageSize: params.pageSize,
                orderNo: id,
              };
              const res = await quotation(searchParams);
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
              showTotal: (total, range) =>
                `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
              onShowSizeChange: (current, pageSize) => onShowSizeChange3(current, pageSize),
            }}
            rowKey={() => Math.random()}
            search={false}
            toolBarRender={false}
            tableAlertRender={false}
            actionRef={ref3}
            defaultSize="small"
            scroll={{ x: 100, y: yClient }}
          />
        </TabPane>
        <TabPane tab="相关流程" key="3">
          <RelatedProcessesOrder billNo={id} />
        </TabPane>
        <TabPane tab="相关发货" key="4">
          <ProTable<any>
            columns={deliveryColumn}
            scroll={{ x: 100, y: yClient }}
            request={async (params) => {
              const searchParams: any = {
                pageNumber: params.current,
                pageSize: params.pageSize,
                orderNo: id,
                // startTime: moment(pageParams.createTime[0]).format('YYYY-MM-DD HH:mm:ss'),
                // endTime: moment(pageParams.createTime[1]).format('YYYY-MM-DD HH:mm:ss'),
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
        <TabPane tab="相关发票" key="5">
          <RelateInvoice id={id} />
        </TabPane>
        <TabPane tab="MDM赋码信息" key="6">
          <AchangeToB id={id} />
        </TabPane>
      </Tabs>
      <MyDrawer ref={DrawerRef} />
    </div>
  );
};

export default forwardRef(Info);
