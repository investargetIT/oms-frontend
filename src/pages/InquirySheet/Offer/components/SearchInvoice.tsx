/* eslint-disable @typescript-eslint/no-unused-expressions */
import { queryBillingInfo } from '@/services/InquirySheet/utils';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.less';
// const { Search } = Input;
interface SearchInvoiceProps {
  customerCode?: string;
  onSelect?: (record: any) => void;
  onDbSave?: (record: any) => void;
}

type TableListItem = Record<string, any>;

const SearchInvoice: React.FC<SearchInvoiceProps> = (props) => {
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
      title: '开票抬头',
      width: 100,
      dataIndex: 'invoiceTitle',
    },
    {
      title: '纳税人识别号',
      width: 100,
      dataIndex: 'vatTaxNo',
    },
    {
      title: '开户银行',
      width: 80,
      dataIndex: 'vatBankName',
    },
    {
      title: '开户账号',
      width: 180,
      dataIndex: 'vatBankNo',
    },
    {
      title: '注册地址',
      width: 80,
      dataIndex: 'vatAddress',
    },
    {
      title: '注册电话',
      width: 80,
      dataIndex: 'vatPhone',
    },
  ];

  useEffect(() => {
    queryBillingInfo({ customerCode: customerCode }).then((res) => {
      const { data, errCode, errMsg } = res as any;
      console.log(data);
      if (errCode === 200) {
        //mock
        // const data1 = [
        //   {
        //     invoiceTitle: '开票台头',
        //     vatTaxNo: '1122222',
        //     vatBankName: '工商银行',
        //     vatBankNo: '71731987363171975',
        //     vatAddress: '上海市宝山区淞南',
        //     vatTel: '13721317855',
        //   },
        // ];
        // 映射字段
        const newList = data?.dataList?.map((io: any, index: any) => ({
          invoiceTitle: io.customerName,
          vatTaxNo: io.taxNumber,
          vatBankName: io.bankName,
          vatBankNo: io.bankAccount,
          vatAddress: io.registerAddress,
          vatPhone: io.registerTelephone,
          index,
          payerCustomerAccount: io.payerCustomerAccount,
        }));
        setTableListDataSource(newList);
      } else {
        message.error(errMsg);
      }
    });
  }, []);
  // console.log(tableListDataSource);

  // const onSearch = (val: any) => {
  //   console.log(val);
  // };

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
          alwaysShowAlert: false,
          selectedRowKeys: rowKey,
          type: 'radio',
          onSelect: (record) => {
            setRowKey([record.index]);
            onSelect && onSelect(record);
          },
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
        tableAlertOptionRender={() => {
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

export default SearchInvoice;
