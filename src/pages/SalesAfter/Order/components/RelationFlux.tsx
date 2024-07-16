import { queryProcesses } from '@/services/afterSales';
import ProTable from '@ant-design/pro-table';
import { message } from 'antd';
import React from 'react';
import { relationFluxColumns } from '../../contants';

interface RelationFluxProps {
  workflowId: string | number;
}

const RelationFlux: React.FC<RelationFluxProps> = ({ workflowId = '' }) => {
  return (
    <ProTable<any>
      columns={relationFluxColumns}
      bordered
      size="small"
      rowKey="workflowId"
      options={false}
      search={false}
      dateFormatter="string"
      request={async () => {
        const { data, errCode, errMsg } = (await queryProcesses({ billNo: workflowId })) as any;
        if (errCode === 200) {
          return Promise.resolve({
            data: data?.dataList,
            success: true,
          });
        } else {
          return message.error(errMsg);
        }
      }}
      tableAlertRender={false}
      rowSelection={false}
      pagination={{
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        // showTotal: total => `共有 ${total} 条数据`,
        showTotal: (totalPage, range) =>
          `共有 ${totalPage} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
        // onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
        showQuickJumper: true,
      }}
    />
  );
};

export default RelationFlux;
