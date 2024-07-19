import { colLimit, getByKeys } from '@/services';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import ProForm, { ProFormDateRangePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, message, Modal, Space } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useModel, history, useLocation } from 'umi';
import { queryeandoApplyPageList, cancelorder } from '@/services/afterSales';
import ScrapDetail from './ScrapDetail';
const Index: React.FC = () => {
  const [form] = Form.useForm();
  const [fold, setFold] = useState<any>(false);
  const [statusList, setStatusList] = useState<any>([]);
  const actionRef = useRef<any>({});
  const ScrapDetailRef = useRef<any>();
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const location = useLocation() as any;
  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const { initialState } = useModel('@@initialState');
  const [yClient, setYClient] = useState(900);
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 360);
  }, [initialState?.windowInnerHeight]);
  useEffect(() => {
    actionRef?.current?.reload();
  }, [location.state]);
  useEffect(() => {
    setTimeout(() => {
      if (location.query.isRead === '1') {
        ScrapDetailRef?.current?.open(location.query.eandoApplyNo);
      }
    }, 500);
  }, [location.query]);
  const initialValues = {
    createTime: [moment().subtract(1, 'month'), moment()],
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
      width: 200,
      render: (_, record: any) => {
        return (
          <Space>
            {record.eandoStatusStr == '草稿' && (
              <Button
                size="small"
                key={'编辑'}
                type="link"
                onClick={() => {
                  // history.push(`/scrap/sales/apply/add/${record.sid}&isRead=true`);
                  history.push({
                    pathname: `/scrap/sales/apply/add`,
                    query: {
                      eandoApplyNo: record.eandoApplyNo,
                      isRead: '1',
                      sid: record.sid,
                    },
                  });
                }}
              >
                编辑
              </Button>
            )}
            <Button
              size="small"
              key={'详情'}
              type="link"
              onClick={() => {
                history.push({
                  pathname: `/scrap/sales/apply/detail`,
                  query: {
                    eandoApplyNo: record.eandoApplyNo,
                    isRead: '1',
                    sid: record.sid,
                  },
                });
                // ScrapDetailRef?.current?.open(record.eandoApplyNo);
              }}
            >
              详情
            </Button>
            {record.eandoStatusStr == '草稿' && (
              <Button
                size="small"
                key={'取消'}
                type="link"
                onClick={() => {
                  Modal.confirm({
                    title: '是否确认取消？',
                    content: '',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: async () => {
                      // const { errMsg, errCode } = await cancelorder({
                      //   sid: record?.sid,
                      // });
                      // if (errCode === 200) {
                      //   message.success('取消成功');
                      //   actionRef.current?.reload();
                      // } else {
                      //   message.error(errMsg);
                      // }
                    },
                  });
                }}
              >
                取消
              </Button>
            )}
          </Space>
        );
      },
      fixed: 'left',
    },
    { title: 'E&O销售申请编号', width: 150, dataIndex: 'eandoApplyNo', fixed: 'left' },
    { title: '创建人', width: 120, dataIndex: 'createName' },
    {
      title: '申请状态',
      width: 120,
      dataIndex: 'eandoStatusStr',
    },
    { title: '申请标题', width: 120, dataIndex: 'applyTitle' },
    { title: '客户代号', width: 120, dataIndex: 'customerCode' },
    { title: '客户名称', width: 200, dataIndex: 'customerName' },
    { title: '申请总计未税', width: 120, dataIndex: 'applySalesPriceNetTotal' },
    { title: '申请总计含税', width: 120, dataIndex: 'applySalesPriceTotal' },
    { title: '申请原因', width: 120, dataIndex: 'applyReason' },
    { title: '最后修改人', width: 120, dataIndex: 'updateName' },
    { title: '创建时间', width: 150, dataIndex: 'createTime' },
    { title: '最后修改时间', width: 150, dataIndex: 'updateTime' },
  ];

  columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  useEffect(() => {
    // getByKeys({ list: ['eandoApplyStatusEnum'] }).then((res: any) => {
    //   if (res?.errCode === 200) {
    //     setStatusList(
    //       res?.data?.map((io: any) => {
    //         io?.enums?.unshift({
    //           code: '',
    //           name: '全部',
    //         });
    //         return io.enums.map((ic: any) => ({
    //           ...ic,
    //           value: ic.code,
    //           label: ic.name,
    //         }));
    //       }),
    //     );
    //   }
    // });
  }, []);

  return (
    <div className=" omsAntStyle sales-after">
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
          <ProFormText label="申请编号" name="eandoApplyNo" placeholder={'请输入'} />
          <ProFormText label="申请标题" name="applyTitle" placeholder={'请输入'} />
          <ProFormText label="客户号" name="customerCode" placeholder={'请输入'} />
          <ProFormText label="客户名称" name="customerName" placeholder={'请输入'} />
          {!fold && (
            <>
              <ProFormSelect
                showSearch
                allowClear={false}
                label="申请状态"
                name="eandoStatus"
                options={statusList[0]}
                placeholder="请选择"
              />
              <ProFormText label="创建人" name="createName" placeholder={'请输入'} />
              <div className="dataPickerItem">
                <ProFormDateRangePicker
                  name="createTime"
                  label="创建时间"
                  allowClear={false}
                  className={'dataPickerCol'}
                />
              </div>
            </>
          )}
          <Form.Item className="btn-search" style={{ marginLeft: '40px' }}>
            <Space>
              <Button
                key={'查询'}
                type="primary"
                htmlType="submit"
                onClick={() => {
                  actionRef.current?.reload();
                }}
              >
                查 询
              </Button>
              <Button
                key={'重置'}
                onClick={() => {
                  form.resetFields();
                  actionRef.current?.reload();
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
          columnsState={{
            value: columnsStateMap,
            onChange: (val: any) => {
              colLimit(val, setColumnsStateMap);
            },
            persistenceKey: history.location.pathname,
            persistenceType: 'localStorage',
          }}
          bordered
          size="small"
          scroll={{ x: 200, y: yClient }}
          className="cust-table"
          tableStyle={{ paddingLeft: '10px', paddingRight: '10px' }}          
          request={async (params) => {
            const paramsCust: any = {
              ...form.getFieldsValue(true),
              createTimeStart: form.getFieldsValue(true).createTime[0]
                ? moment(form.getFieldsValue(true).createTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
                : '',
              createTimeEnd: form.getFieldsValue(true).createTime[1]
                ? moment(form.getFieldsValue(true).createTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
                : '',
              pageNumber: params?.current,
              pageSize: params?.pageSize,
            };
            // const {
            //   data: { list, total },
            //   errCode,
            //   errMsg,
            // } = await queryeandoApplyPageList(paramsCust);
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
            // showTotal: total => `共有 ${total} 条数据`,
            showTotal: (total: any, range: any[]) =>
              `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
            onShowSizeChange: (current: any, pageSize: any) => onShowSizeChange(current, pageSize),
            showQuickJumper: true,
          }}
          search={false}
          tableAlertRender={false}
          defaultSize="small"
          actionRef={actionRef}
          headerTitle={
            <Button
              type="primary"
              style={{ marginLeft: '10px' }}
              onClick={() => {
                history.push(`/scrap/sales/apply/add/`);
              }}
            >
              {`新增E&O销售申请`}
            </Button>
          }
        />
      </div>
      {/* 详情------- */}
      <ScrapDetail ref={ScrapDetailRef} />
    </div>
  );
};
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <Index />
  </KeepAlive>
);
