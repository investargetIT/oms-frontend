import { getPageList } from '@/services/task';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { message } from 'antd';
import React from 'react';

interface RelatedTasksProps {
  id: string | number;
}

const RelatedTasks: React.FC<RelatedTasksProps> = (props) => {
  const { id } = props;
  const columns: ProColumns<ProColumns>[] = [
    {
      title: '任务ID',
      width: 100,
      dataIndex: 'sid',
    },
    {
      title: '任务标题',
      width: 250,
      dataIndex: 'taskInstanceName',
      ellipsis: true,
    },
    {
      title: '任务类型',
      width: 150,
      dataIndex: 'taskTypeStr',
    },
    {
      title: '处理人',
      width: 150,
      dataIndex: 'handlerName',
    },
    {
      title: '任务状态',
      width: 150,
      dataIndex: 'taskInstanceStatusStr',
    },
    {
      title: '紧急度',
      width: 50,
      dataIndex: 'urgencyStr',
    },
    {
      title: '处理部门',
      width: 300,
      dataIndex: 'processDepartment',
    },
    {
      title: '创建时间',
      width: 150,
      dataIndex: 'createTime',
    },
    {
      title: '开始时间',
      width: 150,
      dataIndex: 'startTime',
    },
    {
      title: '完成时间',
      width: 150,
      dataIndex: 'finishTime',
    },
    {
      title: '最新修改时间',
      width: 150,
      dataIndex: 'updateTime',
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  return (
    <div>
      <ProTable<any>
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
            missionId: id || 9,
          } as any;
          const res = await getPageList(par);
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
        search={false}
        rowKey="obdNo"
        pagination={{
          //   pageSize: 20,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          //   onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
          showQuickJumper: true,
        }}
      />
    </div>
  );
};

export default RelatedTasks;
