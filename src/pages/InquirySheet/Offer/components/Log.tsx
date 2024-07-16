import { getLogList } from '@/services/InquirySheet/utils';
import type { ProFormProps } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import React from 'react';
import { logColumns } from '../const';
interface IProps {
  title?: string;
  sourceId?: string | number;
  sourceType?: string | number;
  quotCode?: string;
}
const Log: React.FC<IProps> = ({ sourceId = 1, sourceType = 20, quotCode = '', title = '' }) => {
  return (
    <ProTable<ProFormProps>
      className="table-cust"
      columns={logColumns}
      tableStyle={{ paddingTop: '10px' }}
      // scroll={{ x: 200, y: 500 }}
      size="small"
      bordered
      rowKey="sourceId"
      options={false}
      search={false}
      pagination={{
        position: ['bottomLeft'],
        pageSize: 20,
        showQuickJumper: true,
      }}
      dateFormatter="string"
      request={async () => {
        // params, sorter, filter
        const { data = [] as any } = (await getLogList({ sourceId, sourceType })) as any;
        return Promise.resolve({
          data,
          success: true,
        });
      }}
      headerTitle={title ? `${title}:${quotCode}` : `报价单号:${quotCode}`}
    />
  );
};

export default Log;
