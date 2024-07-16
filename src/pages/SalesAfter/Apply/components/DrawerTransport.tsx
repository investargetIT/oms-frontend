import { getLogistics } from '@/services/afterSales';
// import { getLogList } from '@/services/InquirySheet/utils';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Card, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { transportColumns } from '../../contants';
import '../../index.less';
import Cookies from 'js-cookie';
interface IProps {
  info?: any;
  ids?: any[];
}
const DrawerTransport: React.FC<IProps> = ({ info = {}, ids = [] }) => {
  const [logisticsList, setLogisticsList] = useState<any>([]);
  const [transList, setTransList] = useState<any>([]);

  useEffect(() => {
    const par = {
      // obd_no_list: ['0402429067'], 演示数据
      obd_no_list: ids,
      sys_user: 'OMS',
    };
    getLogistics(par).then((res) => {
      const tran_data_list = [];
      for (let i = 0; i < res?.data?.length; i++) {
        tran_data_list.push(res?.data[i]?.tran_data_list);
      }
      setLogisticsList(res?.data[0]?.image_urlList);
      setTransList(tran_data_list?.flat());
    });
  }, [ids]);

  return (
    <>
      <Card title="订单信息" bordered={false}>
        <ProDescriptions
          className="pr-desc-cust"
          title={<div style={{ fontSize: '14px' }}>报价单运费信息</div>}
          dataSource={{ ...info, cellPhone: info.cellphone }}
        >
          <ProDescriptions.Item dataIndex="obdNo" label="发货单号" />
          {/* <ProDescriptions.Item dataIndex="erpNo" label="ERP订单号" /> */}
          <ProDescriptions.Item dataIndex="salesName" label="销售" />
          <ProDescriptions.Item dataIndex="tplname" label="物流商名称" />
          <ProDescriptions.Item dataIndex="expNo" label="快递单号" />
          <ProDescriptions.Item dataIndex="consignee" label="收货人" />
          <ProDescriptions.Item dataIndex="cellPhone" label="手机" />
          <ProDescriptions.Item dataIndex="sendTime" label="发货日期" />
        </ProDescriptions>
      </Card>
      <Card title="物流签收单明细" bordered={false}>
        <ProTable<ProColumns>
          className="cust-table"
          columns={[
            {
              title: '签收单',
              dataIndex: 'url',
              align: 'left',
            },
            {
              title: '操作',
              dataIndex: 'option',
              valueType: 'option',
              align: 'left',
              width: 200,
              render: (_, record: any) => (
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
            },
          ]}
          scroll={{ x: 200, y: 500 }}
          size="small"
          bordered
          rowKey="obd_no"
          options={false}
          search={false}
          pagination={{
            position: ['bottomLeft'],
            pageSize: 5,
            showQuickJumper: true,
          }}
          dateFormatter="string"
          dataSource={logisticsList}
        />
      </Card>
      <Card title="物流明细" bordered={false}>
        <ProTable<ProColumns>
          className="cust-table"
          columns={transportColumns}
          scroll={{ x: 200, y: 500 }}
          size="small"
          bordered
          rowKey="code"
          options={false}
          search={false}
          pagination={{
            position: ['bottomLeft'],
            pageSize: 5,
            showQuickJumper: true,
          }}
          dateFormatter="string"
          dataSource={transList}
        />
      </Card>
    </>
  );
};

export default DrawerTransport;
