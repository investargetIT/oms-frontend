import { DownOutlined, UpOutlined } from '@ant-design/icons';
import ProForm, { ProFormDateRangePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Drawer, Form, message, Space, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useModel, history } from 'umi';
import '../index.less';
import moment from 'moment';
import { colorEnum } from '@/pages/SalesAfter/contants';
import ItemTaskDetail from './ItemTaskDetail';
import { getByKeys } from '@/services/utils';
import { exportReporterData, missionList } from '@/services/task';

const ItemTask: React.FC<any> = () => {
  const [form] = Form.useForm();
  const [fold, setFold] = useState(false);
  const [yClient, setYClient] = useState(900);
  const { initialState } = useModel('@@initialState');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState<any>(false);
  const actionRef = useRef<ActionType>();
  const [rowData, setRowData] = useState<any>({});

  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const initialValues = {
    sid: '',
    missionTitle: '',
    missionTaskType: '',
    missionStatus: '',
    startTime: '',
    endTime: '',
    createTime: [moment().subtract(1, 'month'), moment().endOf('day')],
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
            <Button
              size="small"
              key={'详情'}
              type="link"
              onClick={() => {
                setRowData(record);
                setDrawerVisible(true);
              }}
            >
              详情
            </Button>
          </Space>
        );
      },
      fixed: 'left',
    },
    { title: '项目任务ID', width: 120, dataIndex: 'sid', fixed: 'left' },
    { title: '项目任务标题', width: 250, dataIndex: 'missionTitle' },
    { title: '项目任务类型', width: 120, dataIndex: 'missionTaskTypeName' },
    // { title: '当前责任部门', width: 120, dataIndex: 'dutyDept' },
    // { title: '处理人', width: 120, dataIndex: 'createName' },
    {
      title: '项目任务状态',
      width: 120,
      dataIndex: 'missionStatus',
      render: (_, record: any) => (
        <span style={{ color: colorEnum[record.missionStatusName] }}>
          {record?.missionStatusName}
        </span>
      ),
    },
    { title: '项目任务创建时间', width: 200, dataIndex: 'createTime' },
    { title: '项目任务关闭时间', width: 200, dataIndex: 'closeTime' },
    { title: '项目最新修改时间', width: 200, dataIndex: 'updateTime' },
  ];

  columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 360);
  }, [initialState?.windowInnerHeight]);

  const [statusList, setStatusList] = useState<any>([]);
  useEffect(() => {
    // list枚举
    const par = { list: ['missionTypeEnum', 'missionStatusEnum'] };
    // getByKeys(par).then((res: any) => {
      // if (res?.errCode === 200) {
      //   setStatusList(
      //     res?.data?.map((io: any) => {
      //       io?.enums?.unshift({
      //         code: '',
      //         name: '全部',
      //       });

      //       return io.enums.map((ic: any) => ({
      //         ...ic,
      //         value: ic.code,
      //         label: ic.name,
      //       }));
      //     }),
      //   );
      // }
    // });
  }, []);

  const [loadExport, setLoadExport] = useState<any>(false);
  const [pageParams, setPageParams] = useState({});

  const exportReporter = async () => {
    setLoadExport(true);
    const searchParams = { ...form.getFieldsValue(true) };
    searchParams.startTime = moment(searchParams?.createTime[0]).format('YYYY-MM-DD');
    searchParams.endTime = moment(searchParams?.createTime[1]).format('YYYY-MM-DD');

    exportReporterData(JSON.parse(JSON.stringify({ ...pageParams, ...searchParams }))).then(
      (res: any) => {
        const { data } = res;
        const reader = new FileReader();
        // reader.onload = function () {
        //   try {
        //     const resContent = reader.result ? JSON.parse(reader.result.toString()) : '';
        //     if (resContent.statusCode) {
        //       message.error(resContent.errMsg);
        //       setLoadExport(false);
        //     }
        //   } catch {
        //     const el = document.createElement('a');
        //     el.style.display = 'none';
        //     el.href = URL.createObjectURL(data);
        //     el.download = '导出信息.xlsx';
        //     document.body.append(el);
        //     el.click();
        //     window.URL.revokeObjectURL(el.href);
        //     document.body.removeChild(el);
        //     setLoadExport(false);
        //   }
        // };
        reader.readAsText(data);
        setLoadExport(false);
      },
    );
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
          <ProFormText label="项目任务ID" name="sid" placeholder={'请输入任务ID'} />
          <ProFormText
            label="项目任务标题"
            name="missionTitle"
            placeholder={'请输入任务标题关键字'}
          />
          <ProFormSelect
            showSearch
            allowClear={false}
            label="项目任务类型"
            name="missionTaskType"
            options={statusList[0]}
            placeholder="请选择"
          />
          <ProFormSelect
            showSearch
            allowClear={false}
            label="项目任务状态"
            name="missionStatus"
            options={statusList[1]}
            placeholder="请选择"
          />
          {!fold && (
            <>
              <ProFormDateRangePicker
                name="createTime"
                label="创建时间"
                allowClear={false}
                className={'dataPickerCol'}
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
            // const paramsCust: any = {
            //   ...form.getFieldsValue(true),
            //   startTime: moment(form.getFieldsValue(true).createTime[0]).format('YYYY-MM-DD'),
            //   endTime: moment(form.getFieldsValue(true).createTime[1]).format('YYYY-MM-DD'),
            //   pageNumber: params?.current,
            //   pageSize: params?.pageSize,
            // };
            // setPageParams(params);
            // const {
            //   data: { list, total },
            //   errCode,
            //   errMsg,
            // } = await missionList(paramsCust);
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
        className="DrawerForm"
        width={window.innerWidth}
        key={'detail'}
        title={[
          <span key={'项目任务编号'}>{rowData?.missionTitle}</span>,
          <Tag key={'tag'} color="gold" style={{ marginLeft: 10 }}>
            {rowData?.missionStatusName}
          </Tag>,
          <p
            key={'任务id'}
            className="tipsP"
            style={{ marginBottom: '-10px', marginTop: 5, color: '#777' }}
            ref={(node) => {
              if (node) {
                node.style.setProperty('font-size', '12px', 'important');
              }
            }}
          >
            项目任务ID:
            <strong>{rowData?.sid}</strong>
          </p>,
        ]}
        visible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
        }}
        destroyOnClose={true}
        extra={
          <Space>
            <Button
              onClick={() => {
                setDrawerVisible(false);
              }}
            >
              关闭
            </Button>
          </Space>
        }
      >
        <ItemTaskDetail id={rowData?.sid} />
      </Drawer>
    </div>
  );
};

import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <ItemTask />
  </KeepAlive>
);
