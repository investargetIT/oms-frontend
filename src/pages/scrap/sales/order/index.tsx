// import { colorEnum } from '@/pages/SalesAfter/contants';
import { colLimit } from '@/services';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import ProForm, { ProFormDateRangePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Form, Space, Tag, message } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useModel, history } from 'umi';
import { queryEandoOrderPageList, queryListDetail } from '@/services/afterSales';
import EditModal from '@/pages/SalesOrder/Order/components/EditModal';
import Info from './Info/Info';
import LogInfo from '@/pages/components/LogInfo';
const Index: React.FC = () => {
  const [form] = Form.useForm();
  const [fold, setFold] = useState<any>(false);
  const [statusList, setStatusList] = useState<any>([]);
  const [rowData, setRowData] = useState<any>({});
  const actionRef = useRef<any>({});
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const drawerWidth = window.innerWidth;
  const [drawerVisible, setDrawerVisible] = useState<any>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  // const SideBar = document.getElementsByClassName('ant-layout-sider');
  const EditRef: any = useRef();
  const [logVisible, setLogVisible]: any = useState(false);

  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const { initialState } = useModel('@@initialState');
  const [yClient, setYClient] = useState(900);
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 360);
  }, [initialState?.windowInnerHeight]);

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
            <Button
              size="small"
              key={'详情'}
              type="link"
              onClick={() => {
                // setDrawerVisible(true);
                setRowData(record);
                setDrawerVisible(true);
                // setFrom('detail');
              }}
            >
              详情
            </Button>
          </Space>
        );
      },
      fixed: 'left',
    },
    { title: '订单编号', width: 150, dataIndex: 'eandoOrderNo', fixed: 'left' },
    { title: '订单创建时间', width: 150, dataIndex: 'createTime', valueType: 'dateTime' },
    { title: 'E&O销售申请编号', width: 150, dataIndex: 'eandoApplyNo' },
    {
      title: '订单状态',
      width: 120,
      dataIndex: 'eandoOrderStatusStr',
      // render: (_, record: any) => (
      //   <span style={{ color: colorEnum[record?.eandoOrderStatusStr] }}>{record?.eandoOrderStatusStr}</span>
      // ),
    },
    {
      title: '订单类型',
      width: 120,
      dataIndex: 'eandoOrderTypeStr',
    },
    { title: '订单渠道', width: 200, dataIndex: 'channelTypeStr' },
    { title: '所属公司', width: 200, dataIndex: 'companyName' },
    { title: '客户代号', width: 120, dataIndex: 'customerCode' },
    { title: '客户名称', width: 120, dataIndex: 'customerName' },
    { title: '创建人', width: 120, dataIndex: 'createName' },
    { title: '货品总计含税', width: 120, dataIndex: 'goodsTaxTotalPrice' },
    { title: '运费总计', width: 120, dataIndex: 'freightTotalPrice' },
    { title: '总计金额含税', width: 120, dataIndex: 'goodsTaxTotalPrice' },
    { title: '折扣总计含税', width: 120, dataIndex: 'discountTaxTotalPrice' },
  ];
  //  ? 编辑备注
  // const editRemark = () => {
  //   EditRef?.current?.open(rowData.eandoOrderNo);
  // };
  function detailDrawerClose() {
    setDrawerVisible(false);
  }
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  const openLog = () => {
    setLogVisible(true);
  };
  useEffect(() => {
    // queryListDetail({ type: 'eandoOrderStatus' }).then((res: any) => {
    //   if (res?.errCode === 200) {
    //     const arr = res?.data?.dataList;
    //     arr.shift();
    //     setStatusList(arr);
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
          <ProFormText label="订单编号" name="eandoOrderNo" placeholder={'请输入'} />
          <ProFormText label="客户代号" name="customerCode" placeholder={'请输入'} />
          <ProFormText label="客户名称" name="customerName" placeholder={'请输入'} />
          <ProFormText label={'E&O申请编号'} name="eandoApplyNo" placeholder={'请输入'} />
          {!fold && (
            <>
              <ProFormText label="创建人" name="createName" placeholder={'请输入'} />
              <ProFormSelect
                showSearch
                allowClear={false}
                label="订单状态"
                name="eandoOrderStatus"
                options={statusList?.map((io: any) => ({
                  ...io,
                  label: io.value,
                  value: io.key,
                }))}
                placeholder="请选择"
              />
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
          // dataSource={[{ sid: 12 }]}
          request={async (params) => {
            // const paramsCust: any = {
            //   ...form.getFieldsValue(true),
            //   createTimeStart: form.getFieldsValue(true).createTime[0]
            //     ? moment(form.getFieldsValue(true).createTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
            //     : '',
            //   createTimeEnd: form.getFieldsValue(true).createTime[1]
            //     ? moment(form.getFieldsValue(true).createTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
            //     : '',
            //   pageNumber: params?.current,
            //   pageSize: params?.pageSize,
            // };
            // const {
            //   data: { list, total },
            //   errCode,
            //   errMsg,
            // } = await queryEandoOrderPageList(paramsCust);
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
            showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
            onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
            showQuickJumper: true,
          }}
          search={false}
          tableAlertRender={false}
          defaultSize="small"
          actionRef={actionRef}
        />
        {/* 详情抽屉 */}
        <Drawer
          className="withAnchorDrawer DrawerContent OrderDrawer"
          width={drawerWidth}
          placement="right"
          key={'Detailskey'}
          destroyOnClose={true}
          title={[
            <span key={'订单编号'}>订单编号: {rowData.eandoOrderNo}</span>,
            <Tag key={'订单状态'} color="gold" style={{ marginLeft: 10 }}>
              {rowData.eandoOrderStatusStr}
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
              <strong>{rowData.eandoOrderTypeStr}</strong>
            </p>,
          ]}
          visible={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          extra={
            <>
              {/* <Space>
                <Button className="editButton" onClick={editRemark}>
                  编辑备注
                </Button>
              </Space> */}
              <Space>
                <Button type="link" onClick={openLog}>
                  查看操作日志
                </Button>
              </Space>
            </>
          }
          footer={[
            // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
            // {btnStatus=='通过'}
            <Button key="back" onClick={detailDrawerClose}>
              关闭
            </Button>,
          ]}
        >
          <Info
            // ref={InfoRef}
            id={rowData.eandoOrderNo}
            isModalVisible={drawerVisible}
            key={'Order Detail Perview'}
            detailDrawerClose={detailDrawerClose}
            row={rowData}
          />
        </Drawer>
        <LogInfo
          id={rowData.sid}
          title={'销售订单' + rowData.eandoOrderNo + ' 操作日志'}
          sourceType={'40'}
          visible={logVisible}
          closed={() => {
            setLogVisible(false);
          }}
        />
        <EditModal ref={EditRef} />
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
