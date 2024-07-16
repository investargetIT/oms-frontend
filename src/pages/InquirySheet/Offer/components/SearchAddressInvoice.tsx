/* eslint-disable @typescript-eslint/no-unused-expressions */
import { queryInvoiceAddress } from '@/services/InquirySheet/utils';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.less';
// const { Search } = Input;
interface SearchAddressInvoiceProps {
  customerCode: string;
  onSelect?: (record: any) => void;
  onDbSave?: (record: any) => void;
}

type TableListItem = Record<string, any>;

const SearchAddressInvoice: React.FC<SearchAddressInvoiceProps> = (props) => {
  const { onSelect, customerCode, onDbSave } = props;
  const [tableListDataSource, setTableListDataSource] = useState<any>([]);
  const [rowKey, setRowKey] = useState<any>([]);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '#',
      width: 50,
      dataIndex: 'index',
      valueType: 'index',
      render: (_) => <a>{_}</a>,
    },
    {
      title: '所在地区',
      width: 80,
      dataIndex: 'region',
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
      dataIndex: 'receiptZipCode',
    },
    {
      title: '收件人手机',
      width: 100,
      dataIndex: 'receiptMobilePhone',
    },
    {
      title: '收件人固话',
      width: 100,
      dataIndex: 'receiptFixPhone',
    },
    {
      title: '收件人邮箱',
      width: 100,
      dataIndex: 'receiptEmail',
    },
  ];

  // const onSearch = (val: any) => {
  //   console.log(val);
  // };

  useEffect(() => {
    queryInvoiceAddress({ customerCode: customerCode }).then((res) => {
      const { data, errCode, errMsg } = res;
      console.log(data);
      if (errCode === 200) {
        //mock
        // const data1 = [
        //   {
        //     customerCode: '0600300021',
        //     customerName: '鲜花',
        //     province: '1451',
        //     city: '1502',
        //     district: '0',
        //     provinceName: '上海市',
        //     cityName: '宝山',
        //     districtName: '',
        //     recipientName: '哈哈invoice132',
        //     receiptAddress: '淞南镇',
        //     receiptZipCode: '356821',
        //     receiptFixPhone: '021-9284378',
        //     receiptMobilePhone: '13209873456',
        //     receiptEmail: '4567@qq.com',
        //     followMerchandise: 1,
        //   },
        //   {
        //     customerCode: '0600300021',
        //     customerName: '鲜花',
        //     province: '1451',
        //     city: '1502',
        //     district: '0',
        //     provinceName: '上海市',
        //     cityName: '松江',
        //     districtName: '',
        //     recipientName: '哈哈invoice000',
        //     receiptAddress: '广富林路',
        //     receiptZipCode: '356821',
        //     receiptFixPhone: '021-9284378',
        //     receiptMobilePhone: '13209873456',
        //     receiptEmail: '1212@qq.com',
        //     followMerchandise: 0,
        //   },
        // ];
        setTableListDataSource(
          data?.dataList?.map((io: any, index: any) => ({
            ...io,
            index,
            invoiceSapCode: io.sapCode,
          })),
        );
      } else {
        message.error(errMsg);
      }
    });
  }, []);

  return (
    <div>
      {/* <Space className="search-wrap">
        <Search
          placeholder="请输入收货人名称关键字"
          onSearch={(val) => onSearch(val)}
          style={{ width: 200 }}
        />
      </Space> */}
      <ProTable<TableListItem>
        tableStyle={{ padding: 0 }}
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
        rowSelection={{
          onSelect: (record) => {
            onSelect && onSelect(record);
            setRowKey([record.index]);
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
        dataSource={tableListDataSource}
        pagination={{
          position: ['bottomLeft'],
        }}
        options={false}
        search={false}
        rowKey={'index'}
      />
    </div>
  );
};

export default SearchAddressInvoice;
