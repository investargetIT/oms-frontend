import Dtitle from '@/pages/components/Dtitle';
import { getRecentlyItem } from '@/services/InquirySheet/offerOrder';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Col, message, Modal, Row } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

interface HistoryListProps {
  sku: string;
  customerCode: string;
}

const HistoryList = (props: HistoryListProps, ref: any) => {
  const [modalVisible, setModalVisible] = useState<any>(false);
  const columns: ProColumns<ProColumns>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
    },
    {
      title: '历史成交价(含税)',
      width: 100,
      dataIndex: 'salesPrice',
    },
    {
      title: '折扣类型',
      width: 100,
      dataIndex: 'discountTypeDesc',
    },
    {
      title: 'GP%',
      width: 70,
      dataIndex: 'gp',
      render: () => {
        return '***';
      },
    },
    {
      title: '订单号',
      width: 150,
      dataIndex: 'orderNo',
    },
    {
      title: '订单创建时间',
      width: 150,
      dataIndex: 'createTime',
    },
  ];
  useImperativeHandle(ref, () => ({
    open: () => {
      setModalVisible(true);
    },
    close: () => {
      setModalVisible(false);
    },
  }));

  return (
    <Modal
      width={'80%'}
      title={<Dtitle title="历史成交价明细" subTitle="最近五次成交记录" />}
      visible={modalVisible}
      destroyOnClose={true}
      footer={[]}
      onOk={() => {
        setModalVisible(false);
      }}
      onCancel={() => setModalVisible(false)}
    >
      <Row gutter={24} style={{ paddingLeft: '24px', fontSize: '16px' }}>
        <Col span={6}>
          查看SKU: <span style={{ color: '#1890ff' }}>{props?.sku}</span>
        </Col>
        <Col span={6}>
          客户号: <span style={{ color: '#1890ff' }}>{props?.customerCode}</span>
        </Col>
      </Row>
      <ProTable<any>
        columns={columns}
        scroll={{ x: 100, y: 400 }}
        bordered
        size="small"
        options={{ reload: false, density: false }}
        request={async () => {
          const par = {
            sku: props?.sku,
            customerCode: props?.customerCode,
          };
          const { data, errCode, errMsg } = await getRecentlyItem(par);
          if (errCode === 200) {
            return Promise.resolve({
              data: data?.dataList,
              success: true,
            });
          } else {
            return message.error(errMsg);
          }
        }}
        rowKey="orderNo"
        search={false}
        tableAlertRender={false}
        pagination={false}
      />
    </Modal>
  );
};

export default forwardRef(HistoryList);
