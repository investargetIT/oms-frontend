import React, { useState, useRef, useEffect } from 'react';
import { message, Button } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getRelatedProcessesListOrder } from '@/services/SalesOrder';
import { useModel } from 'umi';
import { getOAEnv } from '@/services/utils';

const RelatedProcesses: React.FC<{ billNo: string }> = (props: any) => {
  const { billNo } = props;
  const { initialState } = useModel('@@initialState');
  const ref = useRef<ActionType>();
  const [yClient, setYClient] = useState(900);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  // console.log(billNo);

  const columns: ProColumns<any>[] = [
    {
      title: '#',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '流程ID',
      dataIndex: 'workflowId',
      width: 80,
      render(text, record) {
        return (
          <Button
            type="link"
            target="_blank"
            href={`${getOAEnv()}/common/chatResource/view.html?resourcetype=0&resourceid=${
              record.workflowId
            }&isFormMsg=1&ssoinfoFlow=1`}
          >
            {text}
          </Button>
        );
      },
    },
    { title: '流程标题', dataIndex: 'workflowName', width: 200 },
    { title: '流程类型', dataIndex: 'flowName', width: 200 },
    // { title: '工作流类型', dataIndex: 'workflowType', width: 120 },
    // { title: '任务状态', dataIndex: 'taskStatus', width: 120 },
    { title: '发起时间', dataIndex: 'seedTime', valueType: 'dateTime', width: 150 },
    { title: '发起人', dataIndex: 'applicant', width: 150 },
  ];
  // columns.forEach((item: any) => {
  //   item.ellipsis = true;
  // });
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 320);
  }, [initialState?.windowInnerHeight]);

  return (
    <ProTable<any>
      columns={columns}
      scroll={{ x: 100, y: yClient }}
      bordered
      size="small"
      options={{ reload: false, density: false }}
      request={async (params) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        console.log(params);
        // const searchParams: any = {
        //   pageNumber: params.current,
        //   pageSize: params.pageSize,
        //   billNo: billNo,
        // };
        const res = await getRelatedProcessesListOrder(billNo);
        if (res.errCode === 200) {
          return Promise.resolve({
            data: res.data?.dataList,
            total: res.data?.dataList.length,
            current: 1,
            pageSize: 20,
            success: true,
          });
        } else {
          message.error(res.errMsg, 3);
          return Promise.resolve([]);
        }
      }}
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        // showTotal: total => `共有 ${total} 条数据`,
        showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
        onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
      }}
      rowKey={() => Math.random()}
      search={false}
      toolBarRender={false}
      tableAlertRender={false}
      actionRef={ref}
      defaultSize="small"
    />
  );
};

export default RelatedProcesses;
