import { queryProcessRecyclePageList } from '@/services/ApprovalFlow';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Input, message, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useModel, history } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './index.less';
import SelectCommon from '@/pages/components/SelectCommon';
import moment from 'moment';
const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const [yClient, setYClient] = useState(900);
  const actRef = useRef<ActionType>();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

  const columns: any = [
    {
      title: '#',
      dataIndex: 'index',
      valueType: 'index',
      fixed: 'left',
      width: 50,
      render(text: any, record: any, index: any) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    { title: '流程ID', dataIndex: 'requestId', width: 80, fixed: true, ellipsis: true },
    { title: '标题', dataIndex: 'requestName', width: 150, ellipsis: true },
    {
      title: '任务类型',
      dataIndex: 'workflowName',
      width: 150,
      ellipsis: true,
      // render: (text: any, render: any) => {
      //   return <span>{render.workflowBaseInfo?.workflowName}</span>;
      // },
    },
    { title: '业务单据编号', dataIndex: 'billNo', width: 150, ellipsis: true },
    { title: '发起人', dataIndex: 'createUser', width: 100, ellipsis: true },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
      ellipsis: true,
      render(text: any, record: any) {
        return <span>{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: '最后操作时间',
      dataIndex: 'updateTime',
      width: 160,
      ellipsis: true,
      render(text: any, record: any) {
        return <span>{moment(record.updateTime).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 280);
  }, [initialState?.windowInnerHeight]);
  return (
    <div className="pageTabs back-log">
      <div className="omsAntStyle">
        <div className="form-content-search">
          <Form layout="inline" form={form} className="ant-advanced-form" autoComplete="off">
            <Form.Item name="billNo" label="业务单据编号">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="requestName" label="标题">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="requestId" label="流程ID">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="workflowId" label="任务类型">
              <SelectCommon isEdit={false} selectType="oaWorkFlowIdType" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  key={'查询'}
                  type="primary"
                  onClick={() => {
                    actRef.current?.reload(true);
                    setStartPage(true);
                  }}
                >
                  查 询
                </Button>
                <Button
                  key={'重置'}
                  onClick={() => {
                    form.resetFields();
                    setStartPage(true);
                  }}
                >
                  重 置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
        <ProTable<any>
          columns={columns}
          bordered
          size="small"
          request={async (params) => {
            const searchParams = form.getFieldsValue(true);
            // if (startPage) {
            //   params.current = 1;
            //   // params.pageSize = 20;
            // }
            // searchParams.pageNumber = params.current;
            // searchParams.pageSize = params.pageSize;
            // const res = await queryProcessRecyclePageList(searchParams);
            // if (res.errCode === 200) {
            //   const list: any = res.data?.list || [];
            //   // const list: any = [{ requestId: 1, currentnodetypeName: '审批退回' }];

            //   return Promise.resolve({ total: res.data.total, data: list, success: true });
            // } else {
            //   message.error(res.errMsg);
            //   return Promise.resolve([]);
            // }
          }}
          options={false}
          rowKey="billNo"
          search={false}
          tableAlertRender={false}
          actionRef={actRef}
          defaultSize="small"
          scroll={{ x: 200, y: yClient }}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            // showTotal: total => `共有 ${total} 条数据`,
            showTotal: (total: any, range: any[]) =>
              `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
            onShowSizeChange: (current: any, pageSize: any) => onShowSizeChange(current, pageSize),
            showQuickJumper: true,
          }}
          headerTitle={
            <div style={{ width: '1684px' }} className="ant-alert ant-alert-warning">
              <span className="anticon anticon-exclamation-circle ant-alert-icon">
                <ExclamationCircleOutlined />
              </span>
              <div>取消的流程在OA里没有记录，故OMS内仅显示流程基本信息，无法查看流程详情</div>
            </div>
          }
        />
      </div>
    </div>
  );
};
// export default Index;
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <Index />
  </KeepAlive>
);
