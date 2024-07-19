/* eslint-disable @typescript-eslint/no-unused-expressions */
import { queryRecAddress } from '@/services/InquirySheet/utils';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message } from 'antd';
import React, { useState } from 'react';
import './index.less';
// const { Search } = Input;
interface SearchAddressProps {
  customerCode?: string;
  rowkey?: any;
  onSelect?: (record: any) => void;
  onDbSave?: (record: any) => void;
}

type TableListItem = Record<string, any>;

const SearchAddress: React.FC<SearchAddressProps> = (props) => {
  const { onSelect, customerCode, onDbSave } = props;
  const [rowKey, setRowKey] = useState<any>([]);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '#',
      width: 50,
      dataIndex: 'index',
      valueType: 'index',
      render: (_) => <a>{_}</a>,
    },
    // {
    //   title: '客户号',
    //   width: 100,
    //   dataIndex: 'customerCode',
    // },
    // {
    //   title: '收货区域代号',
    //   width: 100,
    //   dataIndex: 'regionCode',
    // },
    {
      title: '所在地区',
      width: 80,
      dataIndex: 'region',
      search: false,
      render: (_, record) => {
        return `${record.provinceName}-${record.cityName}-${record.districtName}`;
      },
    },
    {
      title: '收件地址',
      width: 180,
      dataIndex: 'receiptAddress',
    },
    {
      title: '收件人',
      width: 80,
      dataIndex: 'recipientName',
    },
    {
      title: '收件邮编',
      width: 80,
      search: false,
      dataIndex: 'receiptZipCode',
    },
    {
      title: '收件人手机号',
      width: 100,
      dataIndex: 'receiptMobilePhone',
    },
    {
      title: '收件人固话',
      width: 100,
      search: false,
      dataIndex: 'receiptFixPhone',
    },
    {
      title: '收件人邮箱',
      width: 100,
      search: false,
      dataIndex: 'receiptEmail',
    },
  ];

  // useEffect(() => {
  //   queryRecAddress({ customerCode: customerCode }).then((res) => {
  //     const { data, errCode, errMsg } = res;
  //     console.log(data);

  //     if (errCode === 200) {
  //       const newList = data?.dataList?.map((io: any, index: any) => ({
  //         ...io,
  //         index,
  //         shipRegionSapCode: io.sapCode,
  //       })) as any;
  //       newList?.forEach((element: any) => {
  //         delete element?.followMerchandise;
  //       });
  //       setTableListDataSource(newList);
  //     } else {
  //       message.error(errMsg);
  //     }
  //   });
  // }, []);

  return (
    <div>
      <ProTable<TableListItem>
        tableStyle={{ padding: 0 }}
        scroll={{ x: 200, y: 200 }}
        size="small"
        bordered
        columns={columns}
        locale={{
          emptyText: () => (
            <>
              <div style={{ marginBottom: '20px' }}>暂无数据</div>
              <div>请前往CRM系统维护相关客户数据</div>
            </>
          ),
        }}
        request={async (params: any) => {
          const res = await queryRecAddress({ customerCode: customerCode });
          const { data, errCode, errMsg } = res;

          // if (errCode === 200) {
          //   const newList = data?.dataList?.map((io: any, index: any) => ({
          //     ...io,
          //     index,
          //     shipRegionSapCode: io.sapCode,
          //   })) as any;
          //   newList?.forEach((element: any) => {
          //     delete element?.followMerchandise;
          //   });
          //   const arr = newList?.filter((item: any) => {
          //     return (
          //       (!params.receiptAddress || item.receiptAddress?.includes(params.receiptAddress)) &&
          //       (!params.recipientName || item.recipientName?.includes(params.recipientName)) &&
          //       (!params.receiptMobilePhone ||
          //         item.receiptMobilePhone === params.receiptMobilePhone)
          //     );
          //   });
          //   return Promise.resolve({
          //     data: arr,
          //     success: true,
          //   });
          // } else {
          //   message.error(errMsg);
          //   return Promise.resolve([]);
          // }
        }}
        rowSelection={{
          onSelect: (record) => {
            setRowKey([record.index]);
            onSelect && onSelect(record);
          },
          alwaysShowAlert: false,
          selectedRowKeys: rowKey,
          type: 'radio',
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              onSelect && onSelect(record);
              setRowKey([record.index]);
            },
            onDoubleClick: () => {
              onDbSave && onDbSave(record);
              setRowKey([record.index]);
            },
          };
        }}
        tableAlertRender={({}) => {
          // selectedRowKeys, selectedRows, onCleanSelected
          return false;
        }}
        pagination={{
          position: ['bottomLeft'],
        }}
        options={false}
        search={{
          labelWidth: 'auto',
        }}
        rowKey={'index'}
      />
    </div>
  );
};

export default SearchAddress;
