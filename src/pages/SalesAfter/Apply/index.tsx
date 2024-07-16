import ProForm, {
  // ProFormCascader,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Form, message, Modal, Space, Tag } from 'antd';
import { useModel, history } from 'umi';
import React, { useEffect, useRef, useState } from 'react';
import '../index.less';
import moment from 'moment';
import {
  afterSalesInquiry,
  authority,
  cancelAfterSales,
  queryAfterType,
} from '@/services/afterSales';
import { getByKeys, queryChannel } from '@/services/afterSales/utils';
import Handle from './Handle';
import { colorEnum } from '../contants';
import { colLimit } from '@/services';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const SalesAfter: React.FC<any> = () => {
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [drawerVisible, setDrawerVisible] = useState<any>(false);
  const [rowData, setRowData] = useState<any>({});
  const [from, setFrom] = useState<any>('');
  const [fold, setFold] = useState(false);

  const initialValues = {
    afterSalesNo: '',
    obdNo: '',
    erpNo: '',
    customerName: '',
    salesName: '',
    afterSalesType: '',
    afterSalesStatus: '',
    originalOrderType: '',
    originalOrderChannelType: '',
    applyChannelType: '',
    startTime: moment().subtract(1, 'month'),
    endTime: moment().endOf('day'),
    startCreateTime: [moment().subtract(1, 'month'), moment().endOf('day')],
  };
  const SideBar = document.getElementsByClassName('ant-layout-sider');
  const [drawerWidth, setDrawerWidth] = useState(window.innerWidth - 208);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [subAfterData, setSubAfterData]: any = useState([]);
  const [thirdAfterData, setThirdAfterData] = useState();
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const { initialState }: any = useModel('@@initialState');
  const [yClient, setYClient] = useState(900);
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
        const { afterSalesStatus } = record;
        //applyChannelType 区分渠道
        return (
          <Space>
            <Button
              size="small"
              key={'详情'}
              type="link"
              onClick={() => {
                setDrawerWidth(window.innerWidth - SideBar[0].clientWidth);
                setDrawerVisible(true);
                setRowData(record);
                setFrom('detail');
                // const { afterSalesNo = '' } = record;
                // history.push(`/sales-after/apply/handle/${afterSalesNo}?from=detail`);
              }}
            >
              详情
            </Button>
            {initialState?.currentUser?.authorizations.includes(
              'salesafter0002:afterSales.handle',
            ) &&
              afterSalesStatus == 40 && (
                <Button
                  size="small"
                  key={'售后处理'}
                  type="link"
                  onClick={async () => {
                    await authority({ afterSalesNo: record?.afterSalesNo }).then((res: any) => {
                      if (res?.errCode === 200) {
                        setDrawerVisible(true);
                        setRowData(record);
                        setFrom('handle');
                      } else {
                        message.error(res?.errMsg);
                      }
                    });
                  }}
                >
                  售后处理
                </Button>
              )}
            {afterSalesStatus == 30 && (
              <Button
                size="small"
                key={'复制'}
                type="link"
                onClick={async () => {
                  history.push(`/sales-after/apply/add?type=edit&&id=${record?.afterSalesNo}`);

                  // history.push({
                  //   pathname: `/sales-after/apply/add?type=edit&&id=${record?.afterSalesNo}`,
                  //   state: { type: 'copy' },
                  // });
                }}
              >
                复制
              </Button>
            )}
            {afterSalesStatus == 10 && (
              <Button
                size="small"
                key={'编辑'}
                type="link"
                onClick={() => {
                  // goto草稿
                  history.push(`/sales-after/apply/edit?type=edit&&id=${record?.afterSalesNo}`);
                }}
              >
                编辑
              </Button>
            )}
            {afterSalesStatus == 10 && (
              <Button
                size="small"
                key={'取消'}
                type="link"
                onClick={() => {
                  Modal.confirm({
                    title: '是否确认取消该售后申请？',
                    content: '取消后该申请不可恢复，如需重新发起，请新建售后申请。',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: async () => {
                      const { errMsg, errCode } = await cancelAfterSales({
                        afterSalesNo: record?.afterSalesNo,
                        customerCode: record?.customerCode,
                      });
                      if (errCode === 200) {
                        message.success('取消成功');
                        actionRef.current?.reload();
                      } else {
                        message.error(errMsg);
                      }
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
    { title: '售后申请编号', width: 150, dataIndex: 'afterSalesNo', fixed: 'left' },
    { title: '销售订单编号', width: 120, dataIndex: 'orderNo', fixed: 'left' },
    { title: '创建时间', width: 200, dataIndex: 'createTime' },
    { title: '创建人', width: 120, dataIndex: 'createName' },
    {
      title: '申请状态',
      width: 120,
      dataIndex: 'afterSalesStatusName',
      render: (_, record: any) => (
        <span style={{ color: colorEnum[record?.afterSalesStatusName] }}>
          {record?.afterSalesStatusName}
        </span>
      ),
    }, //afterSalesStatus
    { title: '售后类型', width: 250, dataIndex: 'afterSalesTypeName' },
    { title: '紧急度', width: 120, dataIndex: 'urgencyTypeName' }, //urgencyType
    { title: '原订单渠道', width: 120, dataIndex: 'originalOrderChannelTypeName' }, //originalOrderChannelType
    { title: '申请标题', width: 200, dataIndex: 'applyTitle' },
    { title: '申请渠道', width: 120, dataIndex: 'applyChannelTypeName' }, //channelType
    { title: '客户代号', width: 120, dataIndex: 'customerCode' },
    { title: '客户名称', width: 120, dataIndex: 'customerName' },
    { title: '发货单号', width: 120, dataIndex: 'obdNo' },
    { title: 'R3联系人', width: 120, dataIndex: 'contactNameR3' },
    { title: 'R3联系人代号', width: 120, dataIndex: 'contactCodeR3' },
    { title: '系统发票号', width: 120, dataIndex: 'systemInvoiceNo' },
    { title: '物理发票号', width: 120, dataIndex: 'physicsInvoiceNo' },
    { title: '发票状态', width: 120, dataIndex: 'invoiceStatusName' }, //invoiceStatus
    { title: '发票接收时间', width: 120, dataIndex: 'invoiceReceiptDate' },
    { title: '退票说明', width: 120, dataIndex: 'refundExplain' },
    { title: '结束时间', width: 150, dataIndex: 'completeDate' },
    { title: '最后修改人', width: 120, dataIndex: 'updateName' },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 360);
  }, [initialState?.windowInnerHeight]);
  const [statusList, setStatusList] = useState<any>([]);
  const [allChannel, setAllChannel] = useState<any>([]);
  const [afterData, setAfterData] = useState<any>([]);

  useEffect(() => {
    if (history.action === 'REPLACE') {
      actionRef.current?.reload();
    }
  }, [history.action]);

  useEffect(() => {
    // 获取地址栏上的参数
    const params = new URLSearchParams(window.location.search);
    const afterSalesNo = params.get('afterSalesNo');
    form.setFieldValue('afterSalesNo', afterSalesNo);
    form.setFieldValue('startCreateTime', []);
    const par = { list: ['afterSalesStatusEnum', 'salesOrderCategoryEnum'] };
    getByKeys(par).then((res: any) => {
      if (res?.errCode === 200) {
        setStatusList(
          res?.data?.map((io: any) => {
            io?.enums?.unshift({
              code: '',
              name: '全部',
            });
            return io.enums.map((ic: any) => ({
              ...ic,
              value: ic.code,
              label: ic.name,
            }));
          }),
        );
      }
    });
    queryChannel({}).then((res: any) => {
      if (res?.errCode === 200) {
        res?.data?.unshift({
          channel: '',
          channelName: '全部',
        });
        setAllChannel(
          res?.data?.map((io: any) => ({
            value: io.channel,
            label: io.channelName,
          })),
        );
      }
    });
    // 售后类型
    queryAfterType({ enabledFlag: null }).then((res: any) => {
      const { data, errCode } = res;
      if (errCode === 200) {
        setAfterData(
          data?.dataList.map((io: any) => ({
            ...io,
            value: io.sid,
            label: io.name,
          })),
        );
      }
    });
  }, []);
  function UpDown() {
    setFold(!fold);
  }
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
          <ProFormText label="售后申请编号" name="afterSalesNo" placeholder={'请输入'} />
          <ProFormText label="发货单号" name="obdNo" placeholder={'请输入'} />
          <ProFormText label="销售订单号" name="orderNo" placeholder={'请输入'} />
          <ProFormText label="客户名称" name="customerName" placeholder={'请输入'} />
          {!fold && (
            <>
              <ProFormText label="销售人员" name="salesName" placeholder={'请输入'} />
              <ProFormSelect
                showSearch
                allowClear={false}
                label="申请状态"
                name="afterSalesStatus"
                options={statusList[0]}
                placeholder="请选择"
              />
              <ProFormSelect
                showSearch
                allowClear={false}
                label="原订单类型"
                name="originalOrderType"
                options={statusList[1]}
                placeholder="请选择"
              />
              <ProFormSelect
                showSearch
                allowClear={false}
                label="原订单渠道"
                name="originalOrderChannelType"
                options={allChannel}
                placeholder="请选择"
              />
              <ProFormSelect
                showSearch
                allowClear={false}
                label="申请渠道"
                name="applyChannelType"
                options={allChannel}
                placeholder="请选择"
              />
              <ProFormSelect
                showSearch
                allowClear={false}
                label="售后类型1"
                name="afterSalesType"
                options={afterData}
                fieldProps={{
                  onChange: () => {
                    // const aaa = afterData.find(
                    //   (item: any) => item.sid == form.getFieldValue('afterSalesType'),
                    // );
                    // console.log(aaa, 'aaa');
                    // console.log(form.getFieldValue('afterSalesType'), 'form.getFieldValue');
                    setSubAfterData(
                      afterData
                        .find((item: any) => item.sid == form.getFieldValue('afterSalesType'))
                        ?.childNodeList?.map((io: any) => ({
                          ...io,
                          value: io.sid,
                          label: io.name,
                        })),
                    );
                    setThirdAfterData([]);
                    form.setFieldsValue({ afterSalesType2: '', afterSalesType3: '' });
                  },
                }}
                placeholder="请选择"
              />
              <ProFormSelect
                showSearch
                allowClear={false}
                label="售后类型2"
                name="afterSalesType2"
                options={subAfterData}
                placeholder="请选择"
                fieldProps={{
                  onChange: () => {
                    // const aaa = afterData.find(
                    //   (item: any) => item.sid == form.getFieldValue('afterSalesType'),
                    // );
                    // console.log(aaa, 'aaa');
                    // console.log(form.getFieldValue('afterSalesType'), 'form.getFieldValue');
                    setThirdAfterData(
                      subAfterData
                        .find((item: any) => item.sid == form.getFieldValue('afterSalesType2'))
                        ?.childNodeList?.map((io: any) => ({
                          ...io,
                          value: io.sid,
                          label: io.name,
                        })),
                    );
                    form.setFieldsValue({ afterSalesType3: '' });
                  },
                }}
              />
              <ProFormSelect
                showSearch
                allowClear={false}
                label="售后类型3"
                name="afterSalesType3"
                options={thirdAfterData}
                placeholder="请选择"
              />
              {/* <ProFormCascader
                key={'indexAfter'}
                label={'售后类型'}
                name="afterSalesType"
                placeholder="请选择"
                // request={async () => {
                //   let list = [] as any;
                //   await queryAfterType({ enabledFlag: null }).then((res: any) => {
                //     const { data, errCode } = res;
                //     if (errCode === 200) {
                //       list = data?.dataList;
                //     }
                //   });
                //   return list;
                // }}
                fieldProps={{
                  showArrow: false,
                  showSearch: true,
                  dropdownMatchSelectWidth: false,
                  // labelInValue: true,
                  options: afterData,
                  fieldNames: {
                    label: 'name',
                    value: 'sid',
                    children: 'childNodeList',
                  },
                }}
              /> */}
              <ProFormText label="创建人" name="createName" placeholder={'请输入创建人'} />
              <ProFormText
                label="所属事业部"
                name="tertiaryDeptName"
                placeholder={'请输入所属事业部'}
              />
              <ProFormSelect
                showSearch
                allowClear={false}
                label="是否Local"
                name="whetherLocal"
                options={[
                  { label: '是', value: 1 },
                  { label: '否', value: 0 },
                ]}
                placeholder="请选择"
              />
              <div className="dataPickerItem">
                <ProFormDateRangePicker
                  name="startCreateTime"
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
                  setSubAfterData([]);
                  setThirdAfterData([]);
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
            if (startPage) {
              params.current = 1;
            }
            const formValue = form.getFieldsValue(true);
            const paramsCust: any = {
              ...formValue,
              startTime: formValue.startCreateTime[0]
                ? moment(formValue.startCreateTime[0]).format('YYYY-MM-DD')
                : '',
              endTime: formValue.startCreateTime[1]
                ? moment(formValue.startCreateTime[1]).format('YYYY-MM-DD')
                : '',
              afterSalesType: formValue?.afterSalesType3
                ? +formValue?.afterSalesType +
                  ',' +
                  formValue?.afterSalesType2 +
                  ',' +
                  formValue?.afterSalesType3
                : formValue?.afterSalesType2
                ? +formValue?.afterSalesType + ',' + formValue?.afterSalesType2 + ','
                : formValue?.afterSalesType
                ? formValue?.afterSalesType.toString() + ','
                : '',
              // ? formValue?.afterSalesType?.join(',')
              // : '',
              pageNumber: params?.current,
              pageSize: params?.pageSize,
            };
            const {
              data: { list, total },
              errCode,
              errMsg,
            } = await afterSalesInquiry(paramsCust);
            if (errCode === 200) {
              return Promise.resolve({
                data: list,
                total: total,
                success: true,
              });
            } else {
              message.error(errMsg);
              return Promise.resolve([]);
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
          search={false}
          tableAlertRender={false}
          defaultSize="small"
          actionRef={actionRef}
          headerTitle={
            initialState?.currentUser?.authorizations.includes('salesafter0002:afterSales.add') ? (
              <Button
                type="primary"
                style={{ marginLeft: '10px' }}
                onClick={() => {
                  history.push(`/sales-after/apply/add?type=add&&id=${1}`);
                }}
              >
                新增售后申请
              </Button>
            ) : (
              <></>
            )
          }
        />
        {/* 详情------- */}
        <Drawer
          className="DrawerForm"
          id="salesAfterApplyDrawer"
          width={drawerWidth}
          key={'detail'}
          title={[
            <span key={'售后申请编号'}>售后申请编号:{rowData?.afterSalesNo}</span>,
            <Tag key={'售后状态'} color="gold" style={{ marginLeft: 10 }}>
              {rowData?.afterSalesStatusName}
            </Tag>,
            // <p
            //   key={'订单类型'}
            //   className="tipsP"
            //   style={{ marginBottom: '-10px', marginTop: 5, color: '#777' }}
            //   ref={(node) => {
            //     if (node) {
            //       node.style.setProperty('font-size', '12px', 'important');
            //     }
            //   }}
            // >
            //   订单类型:
            //   <strong>12121</strong>
            // </p>,
          ]}
          visible={drawerVisible}
          onClose={() => {
            setDrawerVisible(false);
            setRowData({});
            if (from != 'detail') {
              // actionRef.current?.reload();
            }
          }}
          destroyOnClose={true}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setDrawerVisible(false);
                  if (from != 'detail') {
                    // actionRef.current?.reload();
                  }
                  setRowData({});
                }}
              >
                关闭
              </Button>
            </Space>
          }
          // footer={[
          //   定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
          //   <Button key="back" onClick={() => setDrawerVisible(false)}>
          //     关闭
          //   </Button>,
          // ]}
        >
          <Handle
            id={rowData?.afterSalesNo}
            from={from}
            onClose={() => {
              setDrawerVisible(false);
              if (from != 'detail') {
                actionRef.current?.reload();
              }
            }}
          />
        </Drawer>
      </div>
    </div>
  );
};

// export default SalesAfter;
// export default Index;
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <SalesAfter />
  </KeepAlive>
);
