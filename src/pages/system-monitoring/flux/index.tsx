import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button, Space, Form, Input, DatePicker, Select, message } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import moment from 'moment';
import { rangesOption } from '@/pages/components/DataRangePicker';
import { SearchOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ResizableTitle from '@/pages/components/TableCom/ResizableTitle';
import cloneDeep from 'lodash/cloneDeep';
import { colLimit } from '@/services';
import { getOrderDateList } from '@/services/SalesOrder';
import { getProcessMonitoring } from '@/services/System';
// import './index.less';

const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { RangePicker } = DatePicker;
  const ref: any = useRef<ActionType>();
  const [form] = Form.useForm();

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [yClient, setYClient] = useState(900);

  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const dataPickerOnChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
    // if (dates) {
    //   console.log('From: ', dates[0], ', to: ', dates[1]);
    //   console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    // } else {
    //   console.log('Clear');
    //   form.getFieldsValue(true).createTime = ['', ''];
    // }
  };

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      fixed: 'left',
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    { title: '提交编号', width: 120, fixed: 'left', dataIndex: 'sid' },
    { title: '业务单据编号', width: 220, fixed: 'left', dataIndex: 'billNo' },
    { title: '流程类型', width: 120, dataIndex: 'workflowName' },
    { title: 'workflowIds', width: 150, dataIndex: 'workflowId' },
    { title: '发起人', width: 180, dataIndex: 'createUser' },
    { title: '发起人工号', width: 150, dataIndex: 'createUserJobNum' },
    { title: '流程ID', width: 150, dataIndex: 'requestId' },
    {
      title: '回调状态',
      width: 150,
      dataIndex: 'callBackStatus',
      render(text, record: any) {
        // if (record.callBackStatus == 0) {
        //   return <strong style={{ color: '#fa0f1b' }}>回调失败</strong>;
        // } else if (record.callBackStatus == 1) {
        //   return <strong style={{ color: '#11f702' }}>回调成功</strong>;
        // }
      },
    },
    { title: '重试次数', width: 80, dataIndex: 'syncCount' },
    { title: '提交时间', width: 150, valueType: 'dateTime', dataIndex: 'submitTime' },
    { title: '回调时间', width: 150, valueType: 'dateTime', dataIndex: 'callBackTime' },
    { title: '错误信息', width: 150, dataIndex: 'remark' },
  ];

  columns.forEach((item: any) => {
    item.ellipsis = true;
    item.align = 'center';
  });

  const [colList, setColList] = useState([]);
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const [workflowNameList, setWorkflowNameList] = useState([]);
  const [callBackStatusList, setCallBackStatusList] = useState([]);

  useEffect(() => {
    setColList(columns);

    // getOrderDateList({ type: 'oaWorkFlowIdType' }).then((res: any) => {
    //   if (res.errCode === 200) {
    //     setWorkflowNameList(res?.data?.dataList);
    //     setCallBackStatusList([
    //       {
    //         key: '0',
    //         value: '回调失败',
    //       },
    //       {
    //         key: '1',
    //         value: '回调成功',
    //       },
    //     ]);
    //   }
    // });

    //设置select初始值
    form.setFieldsValue({
      callBackStatus: callBackStatusList && callBackStatusList[0] ? callBackStatusList[0].key : '',
      workflowId: workflowNameList && workflowNameList[0] ? workflowNameList[0].key : '',
    });
  }, []);

  const columnsList = useMemo(() => {
    return colList?.map((col: any, index: number) => {
      return {
        ...col,
        onHeaderCell: (column: any) => ({
          width: column.width,
          onResize: (e: any, { size }: any) => {
            const copyData: any = cloneDeep(colList);
            copyData[index] = { ...copyData[index], width: size.width };
            setColList(copyData);
          },
        }),
      };
    });
  }, [colList]);

  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 300);
  }, [initialState?.windowInnerHeight]);

  return (
    <div className="omsAntStyle" id="openSoStyle">
      <div className="form-content-search topSearchCol">
        <Form
          layout="inline"
          form={form}
          className="ant-advanced-form"
          initialValues={{ createTime: [moment().subtract(1, 'month'), moment()] }}
        >
          <Form.Item name="billNo" label="业务单据编号">
            <Input placeholder="请输入业务单据编号" allowClear />
          </Form.Item>
          <Form.Item name="workflowId" label="流程类型" className="selectForm">
            <Select placeholder="请选择流程类型">
              <Select.Option value="">全部</Select.Option>
              {workflowNameList &&
                workflowNameList.map((item: any) => (
                  <Select.Option key={item.key} value={item.key}>
                    {item.value}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name="createUser" label="发起人">
            <Input placeholder="请输入发起人姓名" allowClear />
          </Form.Item>
          <Form.Item name="callBackStatus" label="回调状态" className="selectForm">
            <Select placeholder="请选择回调状态">
              <Select.Option value="">全部</Select.Option>
              {callBackStatusList &&
                callBackStatusList.map((item: any) => (
                  <Select.Option key={item.value} value={item.key}>
                    {item.value}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="createTime"
            label="创建日期"
            style={{ width: '290px' }}
            className={'minLabel dataPickerCol'}
          >
            <RangePicker
              format="YYYY-MM-DD"
              allowClear={false}
              inputReadOnly={true}
              ranges={rangesOption}
              onChange={dataPickerOnChange}
            />
          </Form.Item>
          <Form.Item className="btn-search">
            <Space>
              <Button
                key={'查询'}
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => {
                  ref.current?.reload(true);
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
                  ref.current?.reload(true);
                }}
              >
                重 置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <ProTable<any>
        columns={columnsList}
        scroll={{ x: 100, y: yClient }}
        bordered
        size="small"
        columnsState={{
          value: columnsStateMap,
          onChange: (val: any) => {
            colLimit(val, setColumnsStateMap);
          },
          // persistenceKey: 'history.location.pathname',
          persistenceType: 'localStorage',
        }}
        components={{
          header: {
            cell: ResizableTitle,
          },
        }}
        options={{ reload: false, density: false }}
        request={async (params: any) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const searchParams = form.getFieldsValue(true);
          // if (startPage) {
          //   params.current = 1;
          //   // params.pageSize = 20;
          // }
          // searchParams.createTimeStart =
          //   moment(searchParams.createTime[0]).format('YYYY-MM-DD') + ' ' + '00:00:00';
          // searchParams.createTimeEnd =
          //   moment(searchParams.createTime[1]).format('YYYY-MM-DD') + ' ' + '23:59:59';

          // if (searchParams.createTime[0] !== '' && searchParams.createTime[1] !== '') {
          //   searchParams.createTimeStart =
          //     moment(searchParams.createTime[0]).format('YYYY-MM-DD') + ' ' + '00:00:00';
          //   searchParams.createTimeEnd =
          //     moment(searchParams.createTime[1]).format('YYYY-MM-DD') + ' ' + '23:59:59';
          // } else {
          //   searchParams.createTimeStart = '';
          //   searchParams.createTimeEnd = '';
          // }
          // searchParams.pageNumber = params.current;
          // searchParams.pageSize = params.pageSize;
          // const res = await getProcessMonitoring(searchParams);

          // if (res.errCode === 200) {
          //   return Promise.resolve({
          //     data: res.data?.list,
          //     total: res.data?.total,
          //     current: 1,
          //     pageSize: 20,
          //     success: true,
          //   });
          //   res?.data?.list.forEach((e: any, i: number) => {
          //     //? 在表格数据的每一条里面加一个标识，然后用这个标识找到对应要编辑的那一项
          //     e.index = i;
          //   });
          // } else {
          //   message.error(res.errMsg, 3);
          //   return Promise.resolve([]);
          // }
        }}
        pagination={{
          // pageSize: 20,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          // showTotal: total => `共有 ${total} 条数据`,
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
          showQuickJumper: true,
        }}
        rowKey="sid"
        search={false}
        actionRef={ref}
      />
    </div>
  );
};
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <Index />
  </KeepAlive>
);
