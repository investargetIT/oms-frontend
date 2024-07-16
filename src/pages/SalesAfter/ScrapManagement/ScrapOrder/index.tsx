import ProForm, { ProFormDateRangePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Form, message, Space, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import '../../index.less';
import './style.less';
import moment from 'moment';
import { queryAfterOrderList } from '@/services/afterSales';
import Detail from './detail';
import { useModel, history } from 'umi';
import { colLimit } from '@/services';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { getOrderDateList } from '@/services/SalesOrder';
const Index: React.FC<any> = () => {
  const [form] = Form.useForm();
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const actionRef = useRef<ActionType>();
  const [drawerVisible, setDrawerVisible] = useState<any>(false);
  const [rowData, setRowData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [fold, setFold] = useState(false);
  function UpDown() {
    setFold(!fold);
  }
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

  const initialValues = {
    scrapOrderNo: '',
    supplierCode: '',
    supplierName: '',
    scrapApplyNo: '',
    salesName: '',
    createName: '',
    createTimeStart: null,
    createTimeEnd: null,
    scrapOrderStatus: '',
    startCreateTime: [moment().subtract(1, 'month'), moment().endOf('day')],
  };
  const { initialState } = useModel('@@initialState');
  const [yClient, setYClient] = useState(900);
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 70,
      render: (_, record: any) => {
        return (
          <Button
            size="small"
            key={'详情'}
            type="link"
            onClick={() => {
              // const { sid } = record;
              setDrawerVisible(true);
              setRowData(record);
              // history.push(`/sales-after/scrap-management/scrap-order/detail/${sid}`);
            }}
          >
            详情
          </Button>
        );
      },
      fixed: 'left',
    },
    { title: '订单编号', width: 150, dataIndex: 'scrapOrderNo', fixed: 'left' },
    { title: '订单创建时间', width: 150, dataIndex: 'createTime' },
    { title: '报废申请编号', width: 150, dataIndex: 'scrapApplyNo', fixed: 'left' },
    { title: '订单状态', width: 120, dataIndex: 'scrapOrderStatusDesc' },
    { title: '所属公司', width: 180, dataIndex: 'companyName' },
    { title: '客户代号', width: 120, dataIndex: 'supplierCode' },
    { title: '客户名称', width: 200, dataIndex: 'supplierName' },
    { title: 'R3联系人名称', width: 120, dataIndex: 'contactNameR3' },
    { title: '创建人', width: 120, dataIndex: 'createName' },
    { title: '运费', width: 120, dataIndex: 'freightTotalPrice' },
    { title: '总计金额含税', width: 120, dataIndex: 'taxTotalPrice' },
    { title: '货品总计含税', width: 120, dataIndex: 'goodsTaxTotalPrice' },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 320);
  }, [initialState?.windowInnerHeight]);
  const [orderStatusList, setOrderStatusList]: any = useState([]);

  useEffect(() => {
    // const par = { list: ['statusEnum'] }; 老的
    // getByKeys(par).then((res: any) => {
    //   if (res?.errCode === 200) {
    //     setStatusList(
    //       res?.data?.map((io: any) => {
    //         io?.enums?.unshift({
    //           code: '',
    //           name: '全部',
    //         });
    //         return io?.enums?.map((ic: any) => ({
    //           ...ic,
    //           value: ic.code,
    //           label: ic.name,
    //         }));
    //       }),
    //     );
    //   }
    // });
    // 新的
    // 订单状态 新系统订单状态
    getOrderDateList({ type: 'orderStatus' }).then((res: any) => {
      if (res.errCode === 200) {
        res?.data?.dataList?.unshift({
          key: '',
          value: '全部',
        });
        setOrderStatusList(
          res?.data?.dataList?.map((io: any) => ({
            ...io,
            label: io.value,
            value: io.key,
          })),
        );
      }
    });
  }, []);

  return (
    <div className="omsAntStyle sales-after" id="omsAntStyle">
      <div className="form-content-search">
        <ProForm
          layout="inline"
          form={form}
          submitter={false}
          initialValues={initialValues}
          className="ant-advanced-form"
        >
          <ProFormText label="订单编号" name="scrapOrderNo" placeholder={'请输入'} />
          <ProFormText label="客户代号" name="supplierCode" placeholder={'请输入'} />
          <ProFormText label="客户名称" name="supplierName" placeholder={'请输入'} />
          <ProFormText label="报废申请编号" name="scrapApplyNo" placeholder={'请输入'} />
          {!fold && (
            <>
              <ProFormText label="销售人员" name="salesName" placeholder={'请输入'} />
              <ProFormText label="创建人" name="createName" placeholder={'请输入'} />
              <ProFormSelect
                showSearch
                allowClear={false}
                label="订单状态"
                name="scrapOrderStatus"
                options={orderStatusList}
              />
              <div className="dataPickerCol">
                <ProFormDateRangePicker name="startCreateTime" label="创建时间" />
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
                  setStartPage(true);
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
                  UpDown();
                }}
              >
                {fold ? '展开' : '收起'}
              </Button>
            </Space>
          </Form.Item>
        </ProForm>
        <ProTable<any>
          bordered
          size="small"
          columns={columns}
          columnsState={{
            value: columnsStateMap,
            onChange: (val: any) => {
              colLimit(val, setColumnsStateMap);
            },
            persistenceKey: history.location.pathname,
            persistenceType: 'localStorage',
          }}
          scroll={{ x: 200, y: yClient }}
          style={{ margin: '10px 0' }}
          request={async (params) => {
            if (startPage) {
              params.current = 1;
              // params.pageSize = 20;
            }
            const par = {
              ...form.getFieldsValue(true),
              createTimeStart: form.getFieldsValue(true).startCreateTime[0]
                ? moment(form.getFieldsValue(true).startCreateTime[0]).format('YYYY-MM-DD HH:mm:ss')
                : '',
              createTimeEnd: form.getFieldsValue(true).startCreateTime[1]
                ? moment(form.getFieldsValue(true).startCreateTime[1]).format('YYYY-MM-DD HH:mm:ss')
                : '',
              pageNumber: params?.current,
              pageSize: params?.pageSize,
            };
            const { data, errCode, errMsg } = await queryAfterOrderList(par);
            if (errCode === 200) {
              return Promise.resolve({
                data: data?.list,
                success: true,
                total: data?.total,
              });
            } else {
              return message.error(errMsg);
            }
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
          actionRef={actionRef}
          search={false}
          tableAlertRender={false}
          defaultSize="small"
        />
      </div>
      {/* 详情 */}
      <Drawer
        className="DrawerForm"
        width={window.innerWidth}
        key={'detail'}
        title={[
          <span key={'订单编号'}>订单编号：{rowData?.scrapOrderNo}</span>,
          <Tag key={'售后状态'} color="gold" style={{ marginLeft: 10 }}>
            {rowData?.scrapOrderStatusDesc}
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
            <strong>{rowData?.channelTypeDesc || '报废订单'}</strong>
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
        <Detail id={rowData?.sid} />
      </Drawer>
    </div>
  );
};

export default Index;
