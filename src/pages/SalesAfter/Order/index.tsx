import { authority, cancelAfterOrder, confirmRepair, queryAfterOrder } from '@/services/afterSales';
import { getByKeys, queryChannel } from '@/services/afterSales/utils';
import { getCompanyList } from '@/services/InquirySheet/utils';
import ProForm, { ProFormDateRangePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Form, message, Modal, Space, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useModel, history } from 'umi';
import '../index.less';
import Detail from './Detail';
import { colLimit } from '@/services';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { getOrderDateList, saveRefResource } from '@/services/SalesOrder';
import UploadForm from '@/pages/SalesOrder/components/UploadForm';

type OrderProps = Record<any, any>;

const Order: React.FC<OrderProps> = () => {
  const { initialState }: any = useModel('@@initialState');
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();

  const initialValues = {
    afterSalesOrderNo: null,
    customerCode: null,
    customerName: null,
    afterSalesNo: null,
    salesName: null,
    createName: null,
    afterSalesOrderStatus: '',
    afterSalesOrderType: '',
    applyChannelType: '',
    companyCode: '',
    startTime: moment().subtract(1, 'month'),
    endTime: moment().endOf('day'),
    startCreateTime: [moment().subtract(1, 'month'), moment().endOf('day')],
    businessType: '',
    jvCompanyName: '',
  };

  const [recordData, setRecord] = useState<any>({});
  const [isUpload, setIsUpload] = useState<any>(false);
  const [orderStatusList, setOrderStatusList]: any = useState([]);
  const [statusList, setStatusList] = useState<any>([]);
  const [cpList, setCpList] = useState<any>([]);
  const [allChannel, setAllChannel] = useState<any>([]);
  const [drawerVisible, setDrawerVisible] = useState<any>(false);
  const [rowData, setRowData] = useState<any>({});
  const [yClient, setYClient] = useState(900);
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

  useEffect(() => {
    // 获取地址栏上的参数
    const params = new URLSearchParams(window.location.search);
    const afterSalesOrderNo = params.get('afterSalesOrderNo');
    form.setFieldValue('afterSalesOrderNo', afterSalesOrderNo);
    form.setFieldValue('startCreateTime', []);
    // 老系统订单状态不用了
    const par = { list: ['statusEnum', 'afterSalesOrderTypeEnum', 'businessTypeEnum'] };
    getByKeys(par).then((res: any) => {
      if (res?.errCode === 200) {
        setStatusList(
          res?.data?.map((io: any) => {
            io?.enums?.unshift({
              code: '',
              name: '全部',
            });
            return io?.enums?.map((ic: any) => ({
              ...ic,
              value: ic.code,
              label: ic.name,
            }));
          }),
        );
      }
    });
    // 订单状态 新系统订单状态
    getOrderDateList({ type: 'afterSalesOrderStatus' }).then((res: any) => {
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
    // 公司
    getCompanyList().then((res: any) => {
      if (res?.errCode === 200) {
        res?.data?.dataList?.unshift({
          key: '',
          value: '全部',
        });
        setCpList(
          res?.data?.dataList?.map((io: any) => ({
            ...io,
            value: io.key,
            label: io.value,
          })),
        );
      }
    });
    // 渠道
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
  }, []);

  const loadList = async (val: any) => {
    const resourceVOList: any = [];
    val.forEach((e: any) => {
      resourceVOList.push({
        resourceName: e.resourceName,
        resourceUrl: e.resourceUrl,
        fileType: 'po附件',
      });
    });
    const params = {
      sourceId: recordData?.sid,
      sourceType: 83,
      // subType: 20,
      resourceVOList,
    };
    await saveRefResource(params);
    setIsUpload(false);
  };

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
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
      fixed: 'left',
      render: (_, record: any) => {
        return (
          <Space>
            <Button
              size="small"
              key={'详情'}
              type="link"
              onClick={() => {
                setDrawerVisible(true);
                setRowData(record);
                // history.push(`/sales-after/order/detail/${record?.afterSalesOrderNo}`);
              }}
            >
              详情
            </Button>
            {initialState?.currentUser?.authorizations.includes(
              ' salesafter0006:afterSalesOrder.confirmRepair',
            ) &&
              record?.afterSalesOrderStatus == 40 && (
                <Button
                  size="small"
                  key={'确认维修'}
                  type="link"
                  onClick={async () => {
                    await authority({ afterSalesNo: record?.afterSalesNo }).then((res: any) => {
                      if (res?.errCode === 200) {
                        Modal.confirm({
                          title: '是否确认维修？',
                          content: '',
                          okText: '确认',
                          cancelText: '取消',
                          onOk: async () => {
                            const { errCode, errMsg } = await confirmRepair({ sid: record.sid });
                            if (errCode == 200) {
                              actionRef.current?.reload();
                              message.success('确认成功');
                            } else {
                              message.error(errMsg);
                            }
                          },
                        });
                      } else {
                        message.error(res?.errMsg);
                      }
                    });
                  }}
                >
                  确认维修
                </Button>
              )}
            {initialState?.currentUser?.authorizations.includes(
              ' salesafter0006:afterSalesOrder.cancle',
            ) &&
              record?.afterSalesOrderStatus == 40 && (
                <Button
                  size="small"
                  key={'取消'}
                  type="link"
                  onClick={async () => {
                    await authority({ afterSalesNo: record?.afterSalesNo }).then((res: any) => {
                      if (res?.errCode === 200) {
                        Modal.confirm({
                          title: '是否取消？',
                          content: '',
                          okText: '确认',
                          cancelText: '取消',
                          onOk: async () => {
                            const { errCode, errMsg } = await cancelAfterOrder({
                              sid: record?.sid,
                            });
                            if (errCode === 200) {
                              message.success('取消成功');
                              actionRef.current?.reload();
                            } else {
                              message.error(errMsg);
                            }
                          },
                        });
                      } else {
                        message.error(res?.errMsg);
                      }
                    });
                  }}
                >
                  取消
                </Button>
              )}
            {['YORS', 'YFDS'].includes(record?.afterSalesOrderType) && ( //收费维修发货订单、免费维修发货订单
              <Button
                size="small"
                key={'上传PO附件'}
                type="link"
                onClick={() => {
                  setIsUpload(true);
                  setRecord(record);
                }}
              >
                上传PO附件
              </Button>
            )}
          </Space>
        );
      },
    },
    { title: '售后申请编号', width: 150, dataIndex: 'afterSalesNo', fixed: 'left' },
    { title: '订单编号', width: 150, dataIndex: 'afterSalesOrderNo', fixed: 'left' },
    {
      title: '业务类型',
      width: 150,
      dataIndex: 'businessTypeName',
    },
    { title: '订单创建时间', width: 150, dataIndex: 'createTime' },
    { title: '订单状态', width: 120, dataIndex: 'afterSalesOrderStatusName' },
    { title: '订单类型', width: 120, dataIndex: 'afterSalesOrderTypeName' },
    { title: '订单渠道', width: 120, dataIndex: 'applyChannelTypeName' },
    { title: '所属公司', width: 150, dataIndex: 'companyName' },
    { title: '客户代号', width: 120, dataIndex: 'customerCode' },
    { title: '客户名称', width: 120, dataIndex: 'customerName' },
    { title: 'R3联系人', width: 120, dataIndex: 'contactNameR3' },
    { title: '创建人', width: 120, dataIndex: 'createName' },
    { title: '客户采购单号', width: 120, dataIndex: 'customerPurchaseNo' },
    { title: '运费', width: 120, dataIndex: 'headFreightPrice' },
    { title: '总计金额含税', width: 120, dataIndex: 'taxTotalPrice' },
    { title: '货品总计含税', width: 120, dataIndex: 'goodsTaxPrice' },
    { title: '折扣总计含税', width: 120, dataIndex: 'discountTaxTotalPrice' },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 350);
  }, [initialState?.windowInnerHeight]);
  return (
    <div className="omsAntStyle sales-after">
      <div className="form-content-search">
        <ProForm
          layout="inline"
          form={form}
          initialValues={initialValues}
          className="ant-advanced-form"
          submitter={{
            render: false,
          }}
          onFinishFailed={() => {
            message.warning('您有未完善的信息，请填写正确的信息');
          }}
        >
          <ProFormText label="订单编号" name="afterSalesOrderNo" placeholder={'请输入'} />
          <ProFormText label="客户代号" name="customerCode" placeholder={'请输入'} />
          <ProFormText label="客户名称" name="customerName" placeholder={'请输入'} />
          <ProFormText label="售后申请编号" name="afterSalesNo" placeholder={'请输入'} />
          {!fold && (
            <>
              <ProFormText label="销售人员" name="salesName" placeholder={'请输入'} />
              <ProFormText label="创建人" name="createName" placeholder={'请输入'} />
              <ProFormSelect
                label="订单状态"
                name="afterSalesOrderStatus"
                options={orderStatusList}
                placeholder="请选择"
                showSearch
                allowClear={false}
              />
              <ProFormSelect
                label="订单类型"
                name="afterSalesOrderType"
                options={statusList[1]}
                placeholder="请选择"
                showSearch
                allowClear={false}
              />
              <ProFormSelect
                label="渠道"
                name="applyChannelType"
                options={allChannel}
                placeholder="请选择"
                showSearch
                allowClear={false}
              />
              <ProFormSelect
                showSearch
                allowClear={false}
                label="所属公司"
                name="companyCode"
                options={cpList}
                placeholder="请选择"
              />

              <ProFormText label="jv公司" name="jvCompanyName" placeholder={'请输入jv公司'} />

              <ProFormSelect
                showSearch
                allowClear={false}
                label="业务类型"
                name="businessType"
                options={statusList[2]}
                placeholder="请选择"
              />
              <div className="dataPickerItem">
                <ProFormDateRangePicker
                  name="startCreateTime"
                  label="创建时间"
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
                  setStartPage(true);
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
          columns={columns}
          columnsState={{
            value: columnsStateMap,
            onChange: (val: any) => {
              colLimit(val, setColumnsStateMap);
            },
            persistenceKey: history.location.pathname,
            persistenceType: 'localStorage',
          }}
          size="small"
          scroll={{ x: 200, y: yClient }}
          actionRef={actionRef}
          className="cust-table"
          tableStyle={{ paddingLeft: '10px', paddingRight: '10px' }}
          request={async (params) => {
            // // 表单搜索项会从 params 传入，传递给后端接口。
            if (startPage) {
              params.current = 1;
            }
            const paramsCust: any = {
              ...form.getFieldsValue(true),
              startTime: form.getFieldsValue(true).startCreateTime[0]
                ? moment(form.getFieldsValue(true).startCreateTime[0]).format('YYYY-MM-DD')
                : '',
              endTime: form.getFieldsValue(true).startCreateTime[1]
                ? moment(form.getFieldsValue(true).startCreateTime[1]).format('YYYY-MM-DD')
                : '',
              pageNumber: params.current,
              pageSize: params.pageSize,
            };
            const res = await queryAfterOrder(paramsCust);
            if (res.errCode === 200) {
              return Promise.resolve({
                data: res?.data?.list,
                total: res?.data?.total,
                success: true,
              });
            } else {
              message.error(res.errMsg);
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
        />
      </div>
      {/* 详情 */}
      <Drawer
        className="DrawerForm"
        width={window.innerWidth}
        key={'detail'}
        title={[
          <span key={'订单编号'}>订单编号：{rowData?.afterSalesOrderNo}</span>,
          <Tag key={'售后状态'} color="gold" style={{ marginLeft: 10 }}>
            {rowData?.afterSalesOrderStatusName}
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
            <strong>{rowData?.afterSalesOrderTypeName}</strong>
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
        <Detail
          id={rowData?.afterSalesOrderNo}
          onClose={() => {
            setDrawerVisible(false);
            actionRef.current?.reload();
          }}
        />
      </Drawer>
      <UploadForm visible={isUpload} getList={loadList} maxCount={100} />
    </div>
  );
};

// export default Order;
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <Order />
  </KeepAlive>
);
