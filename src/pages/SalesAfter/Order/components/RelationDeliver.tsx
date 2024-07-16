// import { getLogistics, queryObdItem, querySapObd, relevantObd } from '@/services/afterSales';
import { getLogistics, queryObdItem } from '@/services/afterSales';

import ProDescriptions from '@ant-design/pro-descriptions';
import { DrawerForm } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Space, Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import { transportColumns } from '../../contants';
const { TabPane } = Tabs;
import Cookies from 'js-cookie';
import { queryObdInfo } from '@/services/SalesOrder';
interface RelationDeliverProps {
  info: any;
  type?: string;
}

const RelationDeliver: React.FC<RelationDeliverProps> = ({ info = {} }) => {
  const [modalVisibleAddress, setModalVisibleAddress] = useState<boolean>(false);
  const [logisticsList, setLogisticsList] = useState<any>([]);
  const [transList, setTransList] = useState<any>([]);
  const [sendInfo, setSendInfo] = useState<any>({});
  const [logData, setLogData] = useState({});

  const columns: ProColumns<ProColumns>[] = [
    {
      title: '#',
      width: 50,
      dataIndex: 'index',
      valueType: 'index',
      render: (_) => <a>{_}</a>,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (_, record) => (
        <Button
          size="small"
          type="link"
          key={'详情'}
          onClick={() => {
            setSendInfo({
              ...record,
              salesName: info?.salesOrderVO?.salesName || info?.scrapOrderResVO?.salesName,
            });
            setModalVisibleAddress(true);
          }}
        >
          详情
        </Button>
      ),
      dataIndex: 'option',
    },
    {
      title: '发货单号',
      width: 150,
      dataIndex: 'obdNo',
    },
    {
      title: '物流商名称',
      dataIndex: 'tplname',
      width: 150,
      ellipsis: true,
      search: false,
    },
    {
      title: '快递单号',
      dataIndex: 'expCode',
      width: 150,
      search: false,
    },
    {
      title: '发货时间',
      dataIndex: 'sendTime',
      valueType: 'date',
      width: 150,
      search: false,
    },
    {
      title: '总金额含税',
      dataIndex: 'amount',
      width: 150,
      search: false,
    },
    {
      title: '发货单创建时间',
      dataIndex: 'createTime',
      width: 150,
      valueType: 'date',
      search: false,
    },
    {
      title: '收货人',
      width: 150,
      dataIndex: 'consignee',
      search: false,
    },
    {
      title: '收货地址',
      dataIndex: 'address',
      ellipsis: true,
      width: 250,
      search: false,
    },
    {
      title: '手机',
      dataIndex: 'cellphone',
      width: 150,
      search: false,
    },
    {
      title: '座机',
      dataIndex: 'phone',
      width: 150,
      search: false,
    },
    {
      title: '同步时间',
      dataIndex: 'sendTime',
      width: 150,
      valueType: 'date',
      search: false,
    },
  ];
  const signOrderColumns: ProColumns<any>[] = [
    {
      title: '签收单',
      dataIndex: 'url',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            target="_blank"
            href={`${record.url}?token=${Cookies.get('ssoToken')}`}
            key={'down'}
          >
            下载
          </Button>
          <Button
            type="link"
            target="_blank"
            href={`${record.url}?token=${Cookies.get('ssoToken')}`}
            key={'look'}
          >
            查看
          </Button>
        </Space>
      ),
      dataIndex: 'option',
    },
  ];

  const deliverColumns: ProColumns<any>[] = [
    {
      title: '#',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
    },
    { title: '发货单行号', dataIndex: 'obdLineNo', width: 120, fixed: 'left' },
    { title: 'ERP订单行号', dataIndex: 'orderLineNo', width: 100, fixed: 'left' },
    { title: 'SKU', dataIndex: 'skuCode', width: 120, fixed: 'left' },
    { title: '订单数量', dataIndex: 'orderCount', width: 100 },
    { title: '发货数量', dataIndex: 'sendCount', width: 100 },
    { title: '产品描述', dataIndex: 'skuName', width: 100 },
    { title: '品牌名称', dataIndex: 'brandName', width: 100 },
    { title: '制造商型号', dataIndex: 'mfrpn', width: 150 },
    { title: '销售单位', dataIndex: 'vrkme', width: 100 },
    { title: '物理单位', dataIndex: 'punit', width: 100 },
    { title: '销售成交价含税', dataIndex: 'price', width: 150 },
    {
      title: '同步时间',
      dataIndex: 'price',
      width: 150,
      render() {
        return <span>{info?.salesOrderVO?.createTime || info?.scrapOrderResVO?.createTime}</span>;
      },
    },
  ];
  deliverColumns.forEach((item: any) => {
    item.ellipsis = true;
  });

  useEffect(() => {
    if (sendInfo?.obdNo)
      setLogData({
        obd_no_list: [sendInfo?.obdNo],
        sys_user: 'OMS',
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendInfo]);
  const tabChange = (values: any) => {
    if (values == 22) {
      // const par = {
      //   // obd_no_list: ['0402429067'],演示数据
      //   obd_no_list: [sendInfo?.obdNo],
      //   sys_user: 'OMS',
      // };
      getLogistics(logData).then((res) => {
        const tran_data_list = [];
        if (res?.errCode === 200) {
          for (let i = 0; i < res?.data?.length; i++) {
            tran_data_list.push(res?.data[i].tran_data_list);
          }
          setLogisticsList(res?.data[0]?.image_urlList);
          setTransList(tran_data_list.flat().map((io: any, index) => ({ ...io, index })));
        } else {
          message.error(res?.errMsg);
        }
      });
    }
  };

  return (
    <div>
      <ProTable<any>
        tableStyle={{ padding: 0 }}
        size="small"
        bordered
        columns={columns}
        rowSelection={false}
        scroll={{ x: 100, y: 500 }}
        tableAlertRender={({}) => {
          return false;
        }}
        tableAlertOptionRender={() => {
          return false;
        }}
        request={async (params) => {
          const par = {
            pageNumber: params?.current,
            pageSize: params?.pageSize,
            obdNo: params?.obdNo,
            orderNo: info?.salesOrderVO?.afterSalesOrderNo || info?.scrapOrderResVO?.scrapOrderNo,
          } as any;
          // const url = type == 'orderSap' ? relevantObd(par) : querySapObd(par);
          const url = await queryObdInfo(par);
          const res = await url;
          if (res.errCode === 200) {
            return Promise.resolve({
              data: res.data.list,
              total: res.data.total,
              success: true,
              current: 1,
              pageSize: 20,
            });
          } else {
            return message.error(res.errMsg);
          }
        }}
        options={false}
        search={{
          labelWidth: 'auto',
          className: 'searchLabel',
        }}
        rowKey="obdNo"
      />
      <DrawerForm<any>
        title="发货详情"
        visible={modalVisibleAddress}
        onVisibleChange={setModalVisibleAddress}
        drawerProps={{
          destroyOnClose: true,
          extra: (
            <Space>
              <Button
                onClick={() => {
                  setModalVisibleAddress(false);
                }}
              >
                关闭
              </Button>
            </Space>
          ),
        }}
        submitter={false}
        onFinish={async (values) => {
          console.log(values.name);
          // 不返回不会关闭弹框
          setModalVisibleAddress(false);
          return true;
        }}
      >
        <ProDescriptions
          title="订单信息"
          bordered={false}
          column={3}
          size="small"
          dataSource={sendInfo}
          className="pr-desc-cust"
        >
          <ProDescriptions.Item dataIndex="obdNo" label="发货单号" />
          <ProDescriptions.Item dataIndex="orderNo" label="订单号" />
          <ProDescriptions.Item dataIndex="salesName" label="销售" />
          {/* <ProDescriptions.Item dataIndex="tplname" label="物流商名称" /> */}
          <ProDescriptions.Item dataIndex="expNo" label="快递单号" />
          <ProDescriptions.Item dataIndex="consignee" label="收货人" />
          <ProDescriptions.Item dataIndex="cellphone" label="手机" />
          {/* <ProDescriptions.Item dataIndex="sendTime" label="发货日期" /> */}
        </ProDescriptions>
        <Tabs defaultActiveKey="11" size="large" onChange={tabChange}>
          <TabPane tab="发货明细" key="11" className="cust-table">
            <ProTable<any>
              bordered
              size="small"
              tableStyle={{ padding: 0 }}
              columns={deliverColumns}
              rowSelection={false}
              scroll={{ x: 200, y: 300 }}
              request={async (params) => {
                const par = {
                  pageNumber: params?.current,
                  pageSize: params?.pageSize,
                  codes: [sendInfo.obdNo],
                  orderNo: sendInfo.orderNo,
                } as any;
                const res = await queryObdItem(par);
                if (res.errCode === 200) {
                  return Promise.resolve({
                    data: res?.data?.list,
                    success: true,
                  });
                } else {
                  return message.error(res?.errMsg);
                }
              }}
              pagination={{
                position: ['bottomLeft'],
              }}
              options={false}
              search={false}
              rowKey="obdLineNo"
            />
          </TabPane>
          <TabPane tab="物流信息" key="22" className="cust-table">
            <ProTable<any>
              headerTitle="物流签收订单明细"
              style={{ paddingTop: '18px' }}
              tableStyle={{ paddingTop: '20px' }}
              bordered
              size="small"
              columns={signOrderColumns}
              rowSelection={false}
              scroll={{ x: 200, y: 300 }}
              dataSource={logisticsList}
              pagination={{
                position: ['bottomLeft'],
              }}
              options={false}
              search={false}
              rowKey="obd_no"
            />
            <ProTable<any>
              headerTitle="物流明细"
              style={{ paddingTop: '18px' }}
              bordered
              size="small"
              tableStyle={{ paddingTop: '20px' }}
              columns={transportColumns}
              rowSelection={false}
              scroll={{ x: 200, y: 300 }}
              dataSource={transList}
              pagination={false}
              options={false}
              search={false}
              rowKey="date"
            />
          </TabPane>
        </Tabs>
      </DrawerForm>
    </div>
  );
};

export default RelationDeliver;
