import React, { useState, useEffect, useRef } from 'react';
import { Button, Space, Modal, Form, Drawer, Tag } from 'antd';
// import Cookies from 'js-cookie';
import { useModel, history } from 'umi';
import { colLimit, getByKeys } from '@/services';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getLoanOrderList } from '@/services/loan';
import Detail from './detail';
import moment from 'moment';
import ProForm, { ProFormDateRangePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [yClient, setYClient] = useState(900);
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const [drawerVisible, setDrawerVisible] = useState<any>(false);
  const [rowData, setRowData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  const initialValues = {
    loanOrderNo: null,
    customerCode: null,
    customerName: null,
    loanApplyNo: null,
    createName: null,
    salesName: null,
    loanOrderType: null,
    loanOrderStatus: null,
    startTime: moment().subtract(1, 'month'),
    endTime: moment().endOf('day'),
    startCreateTime: [null, null],
  };

  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

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
      render: (_: any, record: any) => {
        return (
          <Space>
            <Button
              size="small"
              key={'详情'}
              type="link"
              onClick={() => {
                setDrawerVisible(true);
                setRowData(record);
              }}
            >
              详情
            </Button>
          </Space>
        );
      },
      fixed: 'left',
    },
    { title: '订单编号', width: 120, dataIndex: 'loanOrderNo' },
    { title: '借贷申请编号', width: 150, dataIndex: 'loanApplyNo' },
    { title: '订单创建时间', width: 150, dataIndex: 'createTime' },
    { title: '订单状态', width: 120, dataIndex: 'loanOrderStatusName' },
    { title: '订单类型', width: 150, dataIndex: 'loanOrderTypeName' },
    { title: '订单渠道', width: 120, dataIndex: 'loanApplyChannelName' },
    { title: '所属公司', width: 150, dataIndex: 'companyName' },
    { title: '客户代号', width: 150, dataIndex: 'customerCode' },
    { title: '客户名称', width: 150, dataIndex: 'customerName' },
    { title: '创建人', width: 150, dataIndex: 'createName' },
    { title: '货品总计含税', width: 120, dataIndex: 'goodsTaxTotalPrice' },
    { title: '运费总计', width: 150, dataIndex: 'totalFreight' },
    { title: '总计金额含税', width: 150, dataIndex: 'taxTotalPrice' },
    { title: '折扣总计含税', width: 120, dataIndex: 'sku' }, //
  ];

  columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 200);
  }, [initialState?.windowInnerHeight]);

  const [statusList, setStatusList] = useState<any>([]);
  useEffect(() => {
    // list枚举
    const par = { list: ['loanOrderStatusEnum', 'loanOrderTypeEnum'] };
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
          className="ant-advanced-form"
          submitter={{
            render: false,
          }}
        >
          <ProFormText label="订单编号" name="loanOrderNo" placeholder={'请输入'} />
          <ProFormText label="客户代号" name="customerCode" placeholder={'请输入客户代号'} />
          <ProFormText label="客户名称" name="customerName" placeholder={'请输入客户名称关键字'} />
          <ProFormText label="借贷申请编号" name="loanApplyNo" placeholder={'请输入'} />
          <ProFormText label="销售人员" name="salesName" placeholder={'请输入'} />
          <ProFormText label="创建人" name="createName" placeholder={'请输入'} />
          <ProFormSelect
            showSearch
            allowClear={false}
            label="订单状态"
            name="loanOrderStatus"
            options={statusList[0]}
            placeholder="请选择"
          />
          <ProFormSelect
            showSearch
            allowClear={false}
            label="订单类型"
            name="loanOrderType"
            options={statusList[1]}
            placeholder="请选择"
          />
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
            const paramsCust: any = {
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
            // const res = await getLoanOrderList(paramsCust);
            // console.log(res, 'res');
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
        />
      </div>
      {/* 详情 */}
      <Drawer
        className="DrawerForm"
        width={window.innerWidth}
        key={'detail'}
        title={[
          <span key={'订单编号'}>订单编号：{rowData?.loanOrderNo}</span>,
          <Tag key={'订单状态tags'} color="gold" style={{ marginLeft: 10 }}>
            {rowData?.loanOrderStatusName}
          </Tag>,
          <p
            key={'订单类型'}
            className="tipsP"
            style={{ marginBottom: '-10px', marginTop: 5, color: '#777' }}
            ref={(node) => {
              if (node) {
                node.style.setProperty('font-size', '12px', 'important');
              }
            }}
          >
            订单类型:
            <strong>{rowData?.loanOrderTypeName}</strong>
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
        <Detail loanOrderNo={rowData?.loanOrderNo} />
      </Drawer>
    </div>
  );
};

import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <Index />
  </KeepAlive>
);
