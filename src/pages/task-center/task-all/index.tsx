import { DownOutlined, UpOutlined } from '@ant-design/icons';
import ProForm, {
  ProFormCheckbox,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Form, message, Space, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useModel, history } from 'umi';
import '../index.less';
import moment from 'moment';
import { colorEnum } from '@/pages/SalesAfter/contants';
import TaskDetail from './TaskDetail';
import { getByKeys } from '@/services/utils';
import {
  getPageList,
  getSalePageList,
  getTodoPageList,
  pageListExport,
  salePageListExport,
  todoPageListExport,
} from '@/services/task';

const TaskAll: React.FC<any> = () => {
  const [form] = Form.useForm();
  const [drawerDetailForm] = Form.useForm();
  const [fold, setFold] = useState(false);
  const [yClient, setYClient] = useState(900);
  const { initialState } = useModel('@@initialState');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState<any>(false);
  const actionRef = useRef<ActionType>();
  const [rowData, setRowData] = useState<any>({});
  const [statusList, setStatusList] = useState<any>([]);
  const [taskTypeListData, setTaskTypeListData]: any = useState([]);
  const [isEdit, setIsEdit] = useState<any>(false);
  const [headTitle, setHeadTitle] = useState<any>('');

  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const initialValues = {
    sid: null,
    taskInstanceName: '',
    taskInstanceStatus: '',
    urgency: '',
    handlerName: '',
    processDepartment: '',
    taskType: '',
    missionName: '',
    createTimeStart: '',
    createTimeEnd: '',
    startTimeStart: '',
    startTimeEnd: '',
    finishTimeStart: '',
    finishTimeEnd: '',
    timeoutState: '',
    commitBO: '',
    requestBO: '',
    customerCode: '',
    customerName: '',
    groupName: '',
    pageNumber: 1,
    pageSize: 20,
    createTime: [null, null],
    startTime: [null, null],
    finishTime: [null, null],
  };

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      render: (_, record: any) => {
        return (
          <Space>
            {/* <Button size="small" key={'编辑'} type="link" onClick={() => {}}>
              编辑
            </Button> */}
            <Button
              size="small"
              key={'详情'}
              type="link"
              onClick={() => {
                setRowData(record);
                setDrawerVisible(true);
                drawerDetailForm?.setFieldsValue({
                  headTitle: record?.taskInstanceName,
                });
              }}
            >
              详情
            </Button>
          </Space>
        );
      },
      fixed: 'left',
    },
    { title: '任务ID', width: 120, dataIndex: 'sid', fixed: 'left' },
    { title: '任务标题', width: 150, dataIndex: 'taskInstanceName' },
    { title: '所属项目任务', width: 300, dataIndex: 'missionName' },
    { title: '处理人', width: 120, dataIndex: 'handlerName' },
    {
      title: '任务状态',
      width: 120,
      dataIndex: 'taskInstanceStatus',
      render: (_, record: any) => (
        <span style={{ color: colorEnum[record?.taskInstanceStatusStr] }}>
          {record?.taskInstanceStatusStr}
        </span>
      ),
    },
    { title: '任务类型', width: 200, dataIndex: 'taskTypeStr' },
    { title: '紧急度', width: 120, dataIndex: 'urgencyStr' },
    {
      title: '超时状态',
      width: 120,
      dataIndex: 'timeoutState',
      render: (_, record: any) => {
        // if (record.timeoutState == '已超时') {
        //   return <span style={{ color: '#f00' }}>{record.timeoutState}</span>;
        // } else {
        //   return record.timeoutState;
        // }
      },
    },
    { title: '超时时长', width: 200, dataIndex: 'timeoutTime' },
    { title: '发起人', width: 120, dataIndex: 'createName' },
    { title: '处理部门', width: 120, dataIndex: 'processDepartment' },
    { title: '任务创建时间', width: 200, dataIndex: 'createTime' },
    { title: '任务开始时间', width: 200, dataIndex: 'startTime' },
    { title: '预计完成时间', width: 200, dataIndex: 'expectedFinishTime' },
    { title: '任务完成时间', width: 200, dataIndex: 'finishTime' },
    { title: '最新修改时间', width: 200, dataIndex: 'updateTime' },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 360);
  }, [initialState?.windowInnerHeight]);

  useEffect(() => {
    // 紧急度list
    const par = {
      list: [
        'openSoUrgencyEnum',
        'taskInstanceStatusEnum',
        'taskTypeEnum',
        'timeOutEnum',
        'missionBackOrderEnum',
      ],
    };
    // getByKeys(par).then((res: any) => {
    //   if (res?.errCode === 200) {
    //     setStatusList(
    //       res?.data?.map((io: any) => {
    //         if (io?.key !== 'timeOutEnum') {
    //           io?.enums?.unshift({
    //             code: '',
    //             name: '全部',
    //           });
    //         }
    //         return io.enums.map((ic: any) => ({
    //           ...ic,
    //           value: ic.code,
    //           label: ic.name,
    //         }));
    //       }),
    //     );
    //   }
    // });
    setTaskTypeListData([{ value: '', label: '销售' }]);
  }, []);

  const [pageParams, setPageParams] = useState({});
  const [loadExport, setLoadExport] = useState<any>(false);
  const exportReporter = async () => {
    setLoadExport(true);
    const searchParams = { ...form.getFieldsValue(true), ...pageParams };
    searchParams.createTimeStart = searchParams?.createTime[0]
      ? moment(searchParams?.createTime[0]).format('YYYY-MM-DD')
      : null;
    searchParams.createTimeEnd = searchParams?.createTime[1]
      ? moment(searchParams?.createTime[1]).format('YYYY-MM-DD')
      : null;
    searchParams.startTimeStart = searchParams?.startTime[0]
      ? moment(searchParams?.startTime[0]).format('YYYY-MM-DD')
      : null;
    searchParams.startTimeEnd = searchParams?.startTime[1]
      ? moment(searchParams?.startTime[1]).format('YYYY-MM-DD')
      : null;
    searchParams.finishTimeStart = searchParams?.finishTime[0]
      ? moment(searchParams?.finishTime[0]).format('YYYY-MM-DD')
      : null;
    searchParams.finishTimeEnd = searchParams?.finishTime[1]
      ? moment(searchParams?.finishTime[1]).format('YYYY-MM-DD')
      : null;
    let url = {} as any; // 分为三个接口了
    if (location?.pathname === '/task-center/task-me/index') {
      url = todoPageListExport(searchParams);
    }
    if (location?.pathname === '/task-center/task-all/index') {
      url = pageListExport(searchParams);
    }
    if (location?.pathname === '/task-center/task-sale/index') {
      url = salePageListExport(searchParams);
    }
    const { data } = await url;
    const reader = new FileReader();
    reader.onload = function () {
      // try {
      //   const resContent = reader.result ? JSON.parse(reader.result.toString()) : '';
      //   if (resContent.statusCode) {
      //     message.error(resContent.errMsg);
      //     setLoadExport(false);
      //   }
      // } catch {
      //   const el = document.createElement('a');
      //   el.style.display = 'none';
      //   el.href = URL.createObjectURL(data);
      //   el.download = '导出任务信息.xlsx';
      //   document.body.append(el);
      //   el.click();
      //   window.URL.revokeObjectURL(el.href);
      //   document.body.removeChild(el);
      //   setLoadExport(false);
      // }
    };
    reader.readAsText(data);
    setLoadExport(false);
  };

  return (
    <div className="omsAntStyle">
      <div className="form-content-search">
        <ProForm
          layout="inline"
          form={form}
          initialValues={initialValues}
          className="ant-advanced-form"
          submitter={{
            render: false,
          }}
        >
          <ProFormText label="任务ID" name="sid" placeholder={'请输入'} />
          <ProFormText label="任务标题" name="taskInstanceName" placeholder={'请输入'} />
          <ProFormSelect
            showSearch
            allowClear={false}
            label="任务状态"
            name="taskInstanceStatus"
            options={statusList[1]}
            placeholder="请选择"
          />
          <ProFormSelect
            showSearch
            allowClear={false}
            label="紧急程度"
            name="urgency"
            options={statusList[0]}
            placeholder="请选择"
          />
          {!fold && (
            <>
              <ProFormText label="处理人" name="handlerName" placeholder={'请输入'} />
              <ProFormText label="处理部门" name="processDepartment" placeholder={'请输入'} />
              {location?.pathname === '/task-center/task-sale/index' && (
                <ProFormSelect
                  allowClear={false}
                  label="任务类型"
                  name="taskType"
                  options={taskTypeListData}
                  placeholder="请选择"
                />
              )}
              {location?.pathname !== '/task-center/task-sale/index' && (
                <ProFormSelect
                  showSearch
                  allowClear={false}
                  label="任务类型"
                  name="taskType"
                  options={statusList[2]}
                  placeholder="请选择"
                />
              )}
              <ProFormText
                label="所属项目任务"
                name="missionName"
                placeholder={'请输入任务标题关键字'}
              />
              <ProFormSelect
                showSearch
                allowClear={false}
                label="承诺交期B/O"
                name="commitBO"
                options={statusList[4]}
                placeholder="请选择"
              />
              <ProFormSelect
                showSearch
                allowClear={false}
                label="要求交期B/O"
                name="requestBO"
                options={statusList[4]}
                placeholder="请选择"
              />
              <ProFormText label="客户号" name="customerCode" placeholder={'请输入客户号'} />
              <ProFormText
                label="客户名称"
                name="customerName"
                placeholder={'请输入客户名称关键字'}
              />
              <ProFormText label="集团名称" name="groupName" placeholder={'请输入集团名称关键字'} />
              <div className="dataPickerItem">
                <ProFormDateRangePicker
                  name="createTime"
                  label="创建时间"
                  allowClear={false}
                  className={'dataPickerCol'}
                />
              </div>
              <div className="dataPickerItem" style={{ marginLeft: '50px', marginRight: '50px' }}>
                <ProFormDateRangePicker
                  name="startTime"
                  label="开始时间"
                  allowClear={false}
                  className={'dataPickerCol'}
                />
              </div>
              <div className="dataPickerItem" style={{ marginRight: '50px' }}>
                <ProFormDateRangePicker
                  name="finishTime"
                  label="完成时间"
                  allowClear={false}
                  className={'dataPickerCol'}
                />
              </div>
              <ProFormCheckbox.Group
                name="timeoutState"
                layout="horizontal"
                label="超时状态"
                options={statusList[3]}
              />
            </>
          )}
          <Form.Item className="btn-search" style={{ marginLeft: '40px' }}>
            <Space>
              <Button
                key={'查询'}
                type="primary"
                htmlType="submit"
                onClick={() => {
                  setStartPage(true);
                  actionRef?.current?.reload();
                }}
              >
                查 询
              </Button>
              <Button
                key={'重置'}
                onClick={() => {
                  form.resetFields();
                }}
              >
                重 置
              </Button>
              <Button
                key={'展开'}
                icon={fold ? <DownOutlined /> : <UpOutlined />}
                onClick={() => {
                  setFold(!fold);
                }}
              >
                {fold ? '展开' : '收起'}
              </Button>
            </Space>
          </Form.Item>
        </ProForm>
        <ProTable<any>
          columns={columns}
          bordered
          size="small"
          scroll={{ x: 200, y: yClient }}
          className="cust-table"
          tableStyle={{ paddingLeft: '10px', paddingRight: '10px' }}
          request={async (params) => {
            // if (startPage) {
            //   params.current = 1;
            // }
            let newTime = '';
            // if (form.getFieldsValue(true).timeoutState?.length > 1) {
            //   newTime = '';
            // } else {
            //   newTime = form.getFieldsValue(true).timeoutState[0];
            // }
            
            const paramsCust: any = {
              ...form.getFieldsValue(true),
              createTimeStart: form.getFieldsValue(true).createTime[0] ? moment(form.getFieldsValue(true).createTime[0]).format('YYYY-MM-DD') : '',
              createTimeEnd: form.getFieldsValue(true).createTime[0] ? moment(form.getFieldsValue(true).createTime[1]).format('YYYY-MM-DD') : '',
              startTimeStart: form.getFieldsValue(true).startTime[0] ? moment(form.getFieldsValue(true).startTime[0]).format('YYYY-MM-DD') : '',
              startTimeEnd: form.getFieldsValue(true).startTime[1] ? moment(form.getFieldsValue(true).startTime[1]).format('YYYY-MM-DD') : '',
              finishTimeStart:form.getFieldsValue(true).finishTime[0] ? moment(form.getFieldsValue(true).finishTime[0]).format('YYYY-MM-DD') : '',
              finishTimeEnd: form.getFieldsValue(true).finishTime[0] ? moment(form.getFieldsValue(true).finishTime[1]).format('YYYY-MM-DD') : '',
              timeoutState: newTime,
              // startTime: form.getFieldsValue(true).startCreateTime[0]
              //   ? moment(form.getFieldsValue(true).startCreateTime[0]).format('YYYY-MM-DD')
              //   : '',
              // endTime: form.getFieldsValue(true).startCreateTime[1]
              //   ? moment(form.getFieldsValue(true).startCreateTime[1]).format('YYYY-MM-DD')
              //   : '',
              pageNumber: params?.current,
              pageSize: params?.pageSize,
            };
            setPageParams(params);
            let url = null; // 分为三个接口了
            // if (location?.pathname === '/task-center/task-me/index') {
            //   url = getTodoPageList(paramsCust);
            // }
            // if (location?.pathname === '/task-center/task-all/index') {
            //   url = getPageList(paramsCust);
            // }
            // if (location?.pathname === '/task-center/task-sale/index') {
            //   url = getSalePageList(paramsCust);
            // }
            // const {
            //   data: { list, total },
            //   errCode,
            //   errMsg,
            // } = await url;
            // if (errCode === 200) {
            //   return Promise.resolve({
            //     data: list,
            //     total: total,
            //     success: true,
            //   });
            // } else {
            //   message.error(errMsg);
            //   return Promise.resolve([]);
            // }
          }}
          options={{ reload: false, density: false }}
          rowKey="sid"
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
            onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
            showQuickJumper: true,
          }}
          search={false}
          tableAlertRender={false}
          defaultSize="small"
          actionRef={actionRef}
          headerTitle={
            <Button style={{ marginLeft: '10px' }} onClick={exportReporter} loading={loadExport}>
              导出
            </Button>
          }
        />
      </div>
      {/* 详情 */}
      <Drawer
        width={window.innerWidth}
        className={'openSo_taskAll_detailDrawer'}
        key={'detail'}
        title={[
          <Tag key={'tag'} color="gold">
            {rowData?.taskInstanceStatusStr}
          </Tag>,
          <div className="headTitle" key={'headtitle'}>
            <Form form={drawerDetailForm}>
              <ProFormText
                readonly={isEdit ? false : true}
                name="headTitle"
                fieldProps={{
                  onChange: (e) => {
                    setHeadTitle(e.target.value);
                  },
                }}
              />
            </Form>
          </div>,
          <p key={'sid'}> 任务ID： {rowData?.sid}</p>,
        ]}
        visible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          actionRef?.current?.reload();
        }}
        destroyOnClose={true}
        // extra={
        //   <Space>
        //     <Button
        //       onClick={() => {
        //         setDrawerVisible(false);
        //         actionRef?.current?.reload()
        //       }}
        //     >
        //       关闭
        //     </Button>
        //   </Space>
        // }
      >
        <TaskDetail id={rowData?.sid} headTitle={headTitle} onEdit={(bo: any) => setIsEdit(bo)} />
      </Drawer>
    </div>
  );
};

import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <TaskAll />
  </KeepAlive>
);
