import React, { useState, useEffect, useRef } from 'react';
import { Button, Space, Modal, Form, message } from 'antd';
import { useModel, history, useLocation } from 'umi';
import { colLimit, getByKeys } from '@/services';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { cancelLoan, getLoanList } from '@/services/loan';
import moment from 'moment';
import ProForm, { ProFormDateRangePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [yClient, setYClient] = useState(900);
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [form] = Form.useForm();
  const location = useLocation() as any;
  const actionRef = useRef<ActionType>();

  const initialValues = {
    loanApplyNo: null,
    systemInvoiceNo: null,
    obdNo: null,
    orderNo: null,
    customerCode: null,
    customerName: null,
    loanApplyStatus: null,
    loanApplyType: null,
    changeHeaderFlag: null,
    createName: null,
    startTime: moment().subtract(1, 'month'),
    endTime: moment().endOf('day'),
    // startCreateTime: [moment().endOf('day'),new Date().getTime()],
    startCreateTime: [null, null],
  };

  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  // 状态颜色
  const colorEnum = {
    草稿: '#fadb14',
    取消: '#eb2f96',
    审批中: '#1890ff',
    进行中: '#1890ff',
    已完成: '#52c41a',
  };
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      fixed: 'left',
      render(text, record, index: any) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 200,
      render: (_, record: any) => {
        const { loanApplyStatus } = record;
        return (
          <Space>
            <Button
              size="small"
              key={'详情'}
              type="link"
              onClick={() => {
                //   history.push(`/to-loan/apply/detail?type=detail&&LoanApplyNo=${record?.loanApplyNo}`);
                history.push({
                  //umi文档规定的固定格式
                  pathname: '/to-loan/apply/detail', //要跳转的路由
                  state: {
                    //传递的数据
                    data: record?.loanApplyNo,
                  },
                });
              }}
            >
              详情
            </Button>
            {loanApplyStatus == 10 && (
              <Button
                size="small"
                key={'编辑'}
                type="link"
                onClick={() => {
                  history.push(`/to-loan/apply/edit?type=edit&&LoanApplyNo=${record?.loanApplyNo}`);
                }}
              >
                编辑
              </Button>
            )}
            {loanApplyStatus == 10 && (
              <Button
                size="small"
                key={'取消'}
                type="link"
                onClick={() => {
                  Modal.confirm({
                    title: '是否确认取消该借贷申请？',
                    content: '取消后该申请不可恢复，如需重新发起，请新建借贷申请。',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: async () => {
                      // const { errMsg, errCode } = await cancelLoan(record?.sid);
                      // if (errCode === 200) {
                      //   message.success('取消成功');
                      //   actionRef?.current?.reload();
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
    { title: '借贷申请编号', width: 150, dataIndex: 'loanApplyNo' },
    { title: '创建时间', width: 150, dataIndex: 'createTime' },
    { title: '创建人', width: 120, dataIndex: 'createName' },
    {
      title: '申请状态',
      width: 120,
      dataIndex: 'loanApplyStatusName',
      render: (_, record: any) => (
        <span style={{ color: colorEnum[record?.loanApplyStatusName] }}>
          {record?.loanApplyStatusName}
        </span>
      ),
    },
    {
      title: '借贷类型',
      width: 150,
      dataIndex: 'loanApplyTypeName',
      render: (_, record: any) => (
        <span style={{ color: colorEnum[record?.loanApplyTypeName] }}>
          {record?.loanApplyTypeName}
        </span>
      ),
    },
    // { title: '申请标题', width: 120, dataIndex: 'applyTitle' },
    { title: '原订单渠道', width: 120, dataIndex: 'originalChannelName' },
    { title: '申请渠道', width: 150, dataIndex: 'loanApplyChannelName' },
    { title: '客户代号', width: 150, dataIndex: 'customerCode' },
    { title: '客户名称', width: 150, dataIndex: 'customerName' },
    { title: '发货单号', width: 150, dataIndex: 'obdNo' },
    { title: '销售订单编号', width: 120, dataIndex: 'orderNo' },
    { title: '系统发票号', width: 150, dataIndex: 'systemInvoiceNo' },
    { title: '更换开票抬头', width: 150, dataIndex: 'changeHeaderName' },
    { title: '申请说明', width: 150, dataIndex: 'applyRemarks' },
    { title: '最后修改人', width: 120, dataIndex: 'updateName' },
    { title: '最后修改时间', width: 150, dataIndex: 'updateTime' },
  ];

  columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 200);
  }, [initialState?.windowInnerHeight]);
  useEffect(() => {
    actionRef?.current?.reload();
  }, [location.state]);
  const [statusList, setStatusList] = useState<any>([]);
  useEffect(() => {
    // list枚举
    const par = { list: ['loanApplyStatusEnum', 'loanApplyTypeEnum', 'changeHeaderEnum'] };
    // getByKeys(par).then((res: any) => {
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
    <div className="omsAntStyle openSoStyle">
      <div className="form-content-search">
        <ProForm
          layout="inline"
          form={form}
          initialValues={initialValues}
          preserve={false}
          className="ant-advanced-form"
          submitter={{
            render: false,
          }}
        >
          <ProFormText label="借贷申请编号" name="loanApplyNo" placeholder={'请输入'} />
          <ProFormText label="系统发票号" name="systemInvoiceNo" placeholder={'请输入'} />
          <ProFormText label="发货单号" name="obdNo" placeholder={'请输入'} />
          <ProFormText label="销售订单号" name="orderNo" placeholder={'请输入'} />
          <ProFormText label="客户号" name="customerCode" placeholder={'请输入'} />
          <ProFormText label="客户名称" name="customerName" placeholder={'请输入'} />
          <ProFormSelect
            showSearch
            allowClear={false}
            label="申请状态"
            name="loanApplyStatus"
            options={statusList[0]}
            placeholder="请选择"
          />
          <ProFormSelect
            showSearch
            allowClear={false}
            label="借贷类型"
            name="loanApplyType"
            options={statusList[1]}
            placeholder="请选择"
          />
          <ProFormSelect
            showSearch
            allowClear={false}
            label="更换抬头"
            name="changeHeaderFlag"
            options={statusList[2]}
            placeholder="请选择"
          />
          <ProFormText label="创建人  " name="createName" placeholder={'请输入创建人'} />
          <div className="dataPickerItem" style={{ marginRight: '50px' }}>
            <ProFormDateRangePicker
              name="startCreateTime"
              label="创建时间"
              allowClear={false}
              className={'dataPickerCol'}
            />
          </div>

          <Form.Item className="btn-search" style={{ marginLeft: '40px' }}>
            <Space>
              <Button
                key={'查询'}
                type="primary"
                htmlType="submit"
                onClick={() => {
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
          request={async (params: any) => {
            params.curPage = params.current;
            setCurrentPage(params.current);
            setCurrentPageSize(params.pageSize);
            const paramsLoan: any = {
              ...form.getFieldsValue(true),
              startTime: form.getFieldsValue(true).startCreateTime[0]
                ? moment(form.getFieldsValue(true).startCreateTime[0]).format('YYYY-MM-DD')
                : '',
              endTime: form.getFieldsValue(true).startCreateTime[1]
                ? moment(form.getFieldsValue(true).startCreateTime[1]).format('YYYY-MM-DD')
                : '',
              pageNumber: params?.current,
              pageSize: params?.pageSize,
            };
            // const res = await getLoanList(paramsLoan);
            // if (res.errCode === 200) {
            //   return Promise.resolve({
            //     data: res.data?.list,
            //     success: true,
            //     total: res.data?.total,
            //   });
            // } else {
            //   Modal.error({ title: res.errMsg });
            //   return Promise.resolve([]);
            // }
          }}
          options={{ reload: false, density: false }}
          rowKey="sid"
          search={false}
          tableAlertRender={false}
          actionRef={actionRef}
          defaultSize="small"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            // showTotal: total => `共有 ${total} 条数据`,
            showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
            onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
            showQuickJumper: true,
          }}
          headerTitle={
            <Space>
              <Button
                type="primary"
                style={{ marginLeft: '10px' }}
                onClick={() => {
                  history.push(`/to-loan/apply/add?type=add`);
                }}
              >
                新增借贷申请
              </Button>
            </Space>
          }
        />
      </div>
    </div>
  );
};
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <Index />
  </KeepAlive>
);
