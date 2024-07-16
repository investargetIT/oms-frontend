/* eslint-disable @typescript-eslint/no-unused-expressions */

import { querySapObd } from '@/services/afterSales';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message } from 'antd';
import React from 'react';

interface FirstDetailProps {
  rowKeys?: string;
  onSelect: (record: any) => void;
  onDbSave?: (record: any) => void;
}

const FirstDetail: React.FC<FirstDetailProps> = ({ onSelect, rowKeys = '', onDbSave }) => {
  const columns: ProColumns<ProColumns>[] = [
    {
      title: '#',
      width: 50,
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      title: '发货单号',
      dataIndex: 'obdNo',
      width: 100,
    },
    {
      title: '发货时间',
      dataIndex: 'sendTime',
      width: 180,
      search: false,
    },
    {
      title: '销售订单号',
      dataIndex: 'orderNo',
      width: 100,
    },
    {
      title: '客户代号',
      dataIndex: 'customerCode',
      width: 100,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 200,
      search: false,
    },
    {
      title: '发货单总金额',
      dataIndex: 'amount',
      search: false,
      width: 100,
    },
    {
      title: '系统发票号',
      dataIndex: 'invoicevf',
      search: false,
      width: 150,
    },
    {
      title: '物理发票号',
      dataIndex: 'invoicevat',
      search: false,
      width: 150,
    },
  ];

  return (
    <>
      <ProTable<any>
        tableStyle={{ padding: 0 }}
        scroll={{ x: 200, y: 400 }}
        columns={columns}
        bordered
        size="small"
        rowSelection={{
          onSelect: (record) => {
            if (record.supportAfterSales == false) {
              message.error('该订单渠道不支持后台发起售后申请，请联系客户在API平台发起售后');
              return false;
            }
            onSelect && onSelect(record);
          },
          selectedRowKeys: [rowKeys],
          type: 'radio',
          getCheckboxProps: (record: any) => ({
            disabled: record?.enabledFlag == 0,
          }),
        }}
        tableAlertRender={({}) => {
          return false;
        }}
        tableAlertOptionRender={() => {
          return false;
        }}
        onRow={(record: any) => {
          return {
            onClick: () => {
              if (record?.enabledFlag == 0) {
                return false;
              }
              if (record?.supportAfterSales == false) {
                message.error('该订单渠道不支持后台发起售后申请，请联系客户在API平台发起售后');
                return false;
              }
              onSelect && onSelect(record);
            },
            onDoubleClick: () => {
              if (record?.enabledFlag == 0) {
                return false;
              }
              if (record?.supportAfterSales == false) {
                message.error('该订单渠道不支持后台发起售后申请，请联系客户在API平台发起售后');
                return false;
              }
              onDbSave && onDbSave(record);
            },
          };
        }}
        request={async (params) => {
          // onSelect && onSelect([]);
          const par = {
            obdNo: params?.obdNo, // params?.obdNo, TODO: 为null 演示数据
            codes: params?.customerCode ? [params?.customerCode] : null,
            orderNo: params?.orderNo,
            pageNumber: params?.current,
            pageSize: params?.pageSize,
          };
          const res = await querySapObd(par);
          if (res.errCode === 200) {
            return Promise.resolve({
              data: res?.data?.list,
              total: res?.data?.total,
              success: true,
            });
          } else {
            message.error(res.errMsg);
            return Promise.resolve([]);
          }
        }}
        pagination={{
          position: ['bottomLeft'],
        }}
        options={false}
        search={{
          labelWidth: 'auto',
          span: 5,
          className: 'searchLabel',
        }}
        rowKey={'obdNo'}
      />
    </>
  );
};

export default FirstDetail;
