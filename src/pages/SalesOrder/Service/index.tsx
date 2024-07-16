import {
  adminCancelOrder,
  getCompanyList,
  getOrderDateList,
  notReplace,
  getSalesOrders,
  saveReplaceLog,
  updatePayOrderInfo,
  modifySapOrderSyncOpState,
} from '@/services/SalesOrder';
import { queryMasterJV } from '@/services/System/index';
import Cookies from 'js-cookie';
import { ExclamationCircleOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { ProFormUploadButton, ModalForm } from '@ant-design/pro-form';
import { history } from 'umi';
import { getByKeys } from '@/services';
import ProTable from '@ant-design/pro-table';
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Space,
  Tag,
  Spin,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import ModalOrder from './components/ModalOrder';
import SalesDealDrawer from './components/SalesDealDrawer';
import EditModal from './components/EditModal';
import Info from './components/Info/Info';
import RelativeOrder from './components/RelativeOrder/RelativeOrder';
import LogInfo from '@/pages/components/LogInfo';
import { getEnv } from '@/services/utils';
import './index.less';
import SpeceilinfoDrawer from './components/SpeceilinfoDrawer';
import TableCom from '@/pages/components/TableCom/Index';
const prefix = getEnv();

export function useUnmounted() {
  const unmountedRef = useRef(false);
  useEffect(() => {
    return () => {
      unmountedRef.current = true;
    };
  }, []);
  return unmountedRef.current;
}
const Index: React.FC = () => {
  const { initialState }: any = useModel('@@initialState');
  const { RangePicker } = DatePicker;
  const ref = useRef<ActionType>();
  // const drawerRef: any = useRef();
  const SaleDrawerRef: any = useRef();
  const SpeceilinfoDrawerRef: any = useRef();
  const [modalVisit, setModalVisit] = useState(false);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [saleVisible, setSaleVisible] = useState(false); //?销售处理单选弹框
  const [saleValue, setSaleValue]: any = useState(); //?销售处理单选框值
  const [isModalVisible, setIsModalVisible] = useState(false); //?详情抽屉
  const [confirmload, setConfirmload]: any = useState(false); //?销售处理单选弹框确认按钮loading
  // const [disableDont, setDisableDont]: any = useState(false); //?不替换单选禁用与否
  const [id, setId]: any = useState('');
  const [type, setType] = useState(''); //订单状态
  const [status, setStatus] = useState(''); //订单状态
  const [yClient, setYClient] = useState(900);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [Record, setRecord]: any = useState(); //?把当前行信息传递给订单详情弹框
  const [pageParams, setParams] = useState(); //?把当前搜索参数传递给订单详情弹框
  const [startPage, setStartPage] = useState(false);
  const [selectOrder, setSelectOrder]: any = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [key, setKey]: any = useState();
  const InfoRef: any = useRef();
  const EditRef: any = useRef();
  const [sid, setSid]: any = useState();
  const [logVisible, setLogVisible]: any = useState(false);
  const [loadPdf, setLoadPdf] = useState(false);
  const [isNc, setIsNc] = useState(true);
  const [fold, setFold] = useState(false);
  const [load, setLoad]: any = useState(false);

  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const drawerWidth = window.innerWidth;
  function detailDrawerClose() {
    setIsModalVisible(false);
  }
  const fn = () => {
    //?子组件调用刷新表格
    ref.current?.reload(true);
  };
  const nextStep = async () => {
    // saleValue //?1是替换，2是不替换
    // setSaleVisible(false);
    if (saleValue == 2) {
      setConfirmload(true);
      const res = await notReplace(Record.orderNo);
      if (res.errCode == 200) {
        message.success('不替换操作成功');
        setSaleVisible(false);
        // 增加log标记
        await saveReplaceLog({ types: [4], orderNo: Record.orderNo });
        fn(); //?刷新主数据的表格
      } else {
        message.warning(res.errMsg);
      }
      setConfirmload(false);
    } else if (saleValue == 1) {
      // console.log(22, '22');
      SaleDrawerRef.current.openDrawer(Record.orderNo, Record, '2');
    }
    setSaleVisible(false);
  };
  const cancelModal = () => {
    // setDisableDont(false); //?设置需要替换的禁用状态是不禁用，恢复初始状态
    setSaleVisible(false);
  };
  const saleChange = (e: any) => {
    setSaleValue(e.target.value);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeyss: React.Key[], selectedRows: any[]) => {
      //左侧单选框触发的时候会执行的函数
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectOrder(selectedRows);
      setSelectedRowKeys(selectedRowKeyss);
    },
    getCheckboxProps: (record: any) => {
      return {
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      };
    },
  };

  //  ? 追加附件
  const openUpload = () => {
    InfoRef?.current?.addUpload();
  };
  //  ? 编辑备注
  const editRemark = () => {
    EditRef?.current?.open(id);
  };
  function inverted() {
    // InfoRef?.current?.inverteData();
  }
  const openLog = () => {
    setLogVisible(true);
  };

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      // valueType: 'index',
      width: 40,
      fixed: 'left',
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'Button',
      className: 'alignLeft',
      render: (_, record) => {
        return [
          <Button
            size="small"
            key={'详情'}
            type="link"
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              setIsModalVisible(true);
              setId(record.orderNo);
              setType(record.category);
              setStatus(record.orderStatus);
              setRecord(record);
              setSid(record.sid);
              InfoRef?.current?.inverteData();
            }}
          >
            详情
          </Button>,
          <Button
            size="small"
            key={'重推'}
            type="link"
            onClick={async () => {
              await modifySapOrderSyncOpState([record.sid]);
              message.success('操作成功');
              ref.current?.reload(true);
            }}
          >
            重推
          </Button>,
        ];
      },
      width: 120,
      fixed: 'left',
    },
    {
      title: '订单编号',
      width: 100,
      dataIndex: 'orderNo',
      sorter: (a, b) => (a.orderNo - b.orderNo ? 1 : -1),
      fixed: 'left',
    },
    {
      title: '订单创建时间',
      width: 150,
      valueType: 'dateTime',
      dataIndex: 'createTime',
      sorter: (a, b) => (a.createTime - b.createTime ? 1 : -1),
    },
    {
      title: '业务类型',
      width: 150,
      dataIndex: 'businessTypeStr',
      sorter: (a, b) => (a.businessTypeStr - b.businessTypeStr ? 1 : -1),
    },
    // {
    //   title: 'ERP订单号',
    //   width: 150,
    //   dataIndex: 'erpOrderNo',
    //   sorter: (a, b) => (a.erpOrderNo - b.erpOrderNo ? 1 : -1),
    // },
    {
      title: '状态',
      width: 150,
      dataIndex: 'orderStatus',
      sorter: (a, b) => (a.orderStatus - b.orderStatus ? 1 : -1),
    },
    {
      title: '订单类型',
      width: 150,
      dataIndex: 'category',
      sorter: (a, b) => (a.category - b.category ? 1 : -1),
    },
    {
      title: '订单渠道',
      dataIndex: 'channel',
      width: 150,
      sorter: (a, b) => (a.channel - b.channel ? 1 : -1),
    },
    { title: '所属公司', width: 200, dataIndex: 'companyName', ellipsis: true },
    { title: '客户代号', width: 150, dataIndex: 'customerCode' },
    { title: '客户名称', width: 200, dataIndex: 'customerName', ellipsis: true },
    { title: 'R3联系人', width: 150, dataIndex: 'contactsName' },
    { title: '创建人', width: 150, dataIndex: 'createName' },
    {
      title: '主销售',
      width: 150,
      dataIndex: 'salesName',
    },
    {
      title: '采购单位客户号',
      width: 150,
      dataIndex: 'purchaseCode',
    },
    {
      title: '采购单位名称',
      width: 150,
      dataIndex: 'purchaseName',
    },
    {
      title: '采购单位主销售',
      width: 150,
      dataIndex: 'purchaseSalesName',
    },

    { title: '客户采购单号', width: 150, dataIndex: 'customerPurchaseNo' },
    { title: '运费', width: 150, dataIndex: 'totalFreight' },
    { title: '总计金额含税', width: 150, dataIndex: 'amount' },
    { title: '货品总计含税', width: 150, dataIndex: 'goodsAmount' },
    { title: '折扣总计', width: 150, dataIndex: 'discountAmount' },
    { title: '已使用的Rebate Pool的金额', width: 190, dataIndex: 'rebate' },
    { title: '网站促销活动代号', width: 150, dataIndex: 'discountCode' },
    { title: 'CSR审单时间', width: 150, valueType: 'dateTime', dataIndex: 'csrReviewTime' },
    { title: 'CSR审单人', width: 150, dataIndex: 'csrReviewUser' },
    { title: '放单备注', width: 150, dataIndex: 'releaseRemark' },
    {
      title: '是否替换',
      width: 150,
      dataIndex: 'replace',
      render: (_, record) => {
        return <span>{record.replace ? '是' : '否'}</span>;
      },
    },
    {
      title: '是否完结',
      width: 150,
      dataIndex: 'completed',
    },
    {
      title: '完结时间',
      width: 180,
      dataIndex: 'completedTime',
      hideInSearch: true,
    },
    {
      title: '是否项目单匹配',
      width: 150,
      dataIndex: 'appointSupplier',
      render: (_, record) => {
        return <span>{record.appointSupplier ? '是' : '否'}</span>;
      },
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  function UpDown() {
    setFold(!fold);
  }
  const [orderStatusList, setOrderStatusList]: any = useState([]);
  const [orderTypeList, setOrderTypeList]: any = useState([]);
  const [orderChannelList, setOrderChannelList]: any = useState([]);
  const [orderCompanyList, setOrderCompanyList]: any = useState([]);
  const [statusList, setStatusList] = useState<any>([]);
  const [JVListData, setJVListData] = useState<any>([]);
  useEffect(() => {
    // 业务类型list
    getByKeys({ list: ['businessTypeEnum'] }).then((res: any) => {
      if (res?.errCode === 200) {
        if (res?.data[0] == null) return;
        setStatusList(
          res?.data?.map((io: any) => {
            return io.enums.map((ic: any) => ({
              ...ic,
              key: ic.code,
              value: ic.name,
            }));
          }),
        );
      }
    });

    queryMasterJV({ pageSize: 200, disable: true }).then((res: any) => {
      if (res?.errCode === 200) {
        setJVListData(res?.data?.list);
      }
    });
  }, []);
  useEffect(() => {
    setIsModalVisible(false);
  }, [history.location.pathname]);
  const openSpecial = async () => {
    if (JSON.stringify(selectOrder) == '[]') {
      message.error('请至少选择一个订单！', 3);
    }
    const arr = selectOrder.map((e) => e.sid);
    await modifySapOrderSyncOpState(arr);
    message.success('操作成功');
    ref.current?.reload(true);
  };
  useEffect(() => {
    const k = Math.random();
    setKey(k);
    getOrderDateList({ type: 'orderStatus' }).then((res: any) => {
      if (res.errCode === 200) {
        setOrderStatusList(res.data.dataList);
      }
    });
    getOrderDateList({ type: 'orderType' }).then((res: any) => {
      if (res.errCode === 200) {
        setOrderTypeList(res.data.dataList);
      }
    });
    getOrderDateList({ type: 'orderChannel' }).then((res: any) => {
      if (res.errCode === 200) {
        setOrderChannelList(res.data.dataList);
      }
    });
    getCompanyList().then((res: any) => {
      if (res.errCode === 200) {
        setOrderCompanyList(res.data.dataList);
      }
    });

    //设置select初始值
    form.setFieldsValue({
      orderStatus: [],
      category: orderTypeList && orderTypeList[0] ? orderTypeList[0].key : '',
      channel: orderChannelList && orderChannelList[0] ? orderChannelList[0].key : '',
      companyCode: orderCompanyList && orderCompanyList[0] ? orderCompanyList[0].key : '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 340);
  }, [initialState?.windowInnerHeight]);

  return (
    <div className="omsAntStyle SalesOrderStyle">
      <div className="form-content-search">
        <Form layout="inline" form={form} className="ant-advanced-form">
          <Form.Item name="orderNo" label="订单编号">
            <Input placeholder="请输入订单编号" />
          </Form.Item>
          <Form.Item className="btn-search">
            <Space>
              <Button
                key={'查询'}
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => {
                  setSelectOrder([]);
                  ref.current?.reload(true);
                  setStartPage(true);
                }}
              >
                查 询
              </Button>
              <Button
                key={'重置'}
                onClick={() => {
                  setSelectOrder([]);
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
      {/*<Button className="cancel" onClick={cancel}>
        取消订单
      </Button>*/}
      <Spin spinning={load}>
        <ProTable
          columns={columns}
          columnsState={{
            persistenceKey: '/sales/list/all',
            persistenceType: 'localStorage',
          }}
          scroll={{ x: 100, y: yClient }}
          bordered
          size="small"
          options={{ reload: false, density: false }}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          request={async (params) => {
            setSelectedRowKeys([]); //?清空单选框
            const searchParams = form.getFieldsValue();
            if (startPage) {
              params.current = 1;
              // params.pageSize = 20;
            }

            searchParams.pageNumber = params.current;
            searchParams.pageSize = params.pageSize;
            const newString = searchParams.orderNo?.substring(0, 1); //?如果发现订单号第一位是0，就把订单号的第一位去掉
            let subOrderNo = searchParams.orderNo;
            if (newString === '0') {
              subOrderNo = JSON.parse(JSON.stringify(searchParams.orderNo.substring(1)));
            }

            const res1 = await getSalesOrders({
              ...searchParams,
              orderNo: subOrderNo,
            });
            setParams(searchParams);

            res1.data?.list.forEach((e: any, i: number) => {
              //? 在表格数据的每一条里面加一个标识，然后用这个标识找到对应要编辑的那一项
              e.index = i;
            });
            if (res1.errCode === 200) {
              return Promise.resolve({
                data: res1.data?.list,
                total: res1.data?.total,
                success: true,
              });
            } else {
              message.error(res1.errMsg);
              return Promise.resolve([]);
            }
          }}
          onRow={(record) => {
            return {
              onClick: () => {
                setSelectOrder([record]);
                setSelectedRowKeys([record.index]);
              }, // 点击行
            };
          }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            // showTotal: total => `共有 ${total} 条数据`,
            showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
            onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
            showQuickJumper: true,
          }}
          // rowKey={(e) => e.orderNo}
          rowKey="index"
          search={false}
          tableAlertRender={false}
          actionRef={ref}
          headerTitle={
            <Space>
              <Button
                key="批量重推"
                type="primary"
                className="light_blue"
                size="small"
                onClick={openSpecial}
              >
                批量重推
              </Button>
            </Space>
          }
        />
      </Spin>

      <Drawer
        title="关联订单"
        width={1000}
        placement="right"
        onClose={() => {
          setVisible(false);
        }}
        visible={visible}
        destroyOnClose={true}
      >
        <RelativeOrder id={id} />
      </Drawer>
      {/* 详情抽屉 */}
      <Drawer
        className="withAnchorDrawer DrawerContent OrderDrawer"
        width={drawerWidth}
        placement="right"
        key={key}
        getContainer={false}
        destroyOnClose={true}
        title={[
          <span key={'订单编号'}>订单编号: {id}</span>,
          <Tag key={'订单状态'} color="gold" style={{ marginLeft: 10 }}>
            {status}
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
            <strong>{type}</strong>
          </p>,
        ]}
        style={{ position: 'fixed' }}
        visible={isModalVisible}
        onClose={detailDrawerClose}
        extra={
          <>
            {(Record?.channelCode === 120 &&
              (status === '待销售确认' ||
                status === 'CSR审核主数据' ||
                status === '等待系统信用检查' ||
                status === '财务审核') &&
              Record?.paymentTermsCode === '1') ||
            (Record?.channelCode === 20 &&
              status === '待付款' &&
              Record?.paymentTermsCode === '1') ? (
              <ModalForm
                title="上传付款凭证"
                width={350}
                submitTimeout={2000}
                onFinish={async (values) => {
                  const { response } = values.file[0];
                  const res = await updatePayOrderInfo({
                    orderNo: Record.orderNo,
                    paymentMethod: Record.paymentMethodCode,
                    payTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    payStatus: '001',
                    resourceVOList: [
                      {
                        resourceUrl: response.data.resourceUrl,
                        resourceName: response.data.resourceName,
                        fileType: '付款凭证',
                      },
                    ],
                  });
                  if (res.errMsg === '成功') {
                    setIsModalVisible(false);
                    ref?.current?.reload();
                    return true;
                  } else {
                    message.error(res.errMsg);
                    return false;
                  }
                }}
                trigger={
                  <Button className="editButton" style={{ marginRight: '20px' }}>
                    上传付款凭证
                  </Button>
                }
              >
                <ProFormUploadButton
                  name="file"
                  max={1}
                  fieldProps={{
                    name: 'file',
                    listType: 'picture-card',
                    accept: '.jpg,.png',
                    headers: {
                      token: Cookies.get('ssoToken'),
                    },
                  }}
                  action={`${prefix}/omsapi/refResource/upload`}
                  rules={[{ required: true, message: '这是必填项' }]}
                />
              </ModalForm>
            ) : (
              <></>
            )}
            <Button style={{ marginRight: '20px' }} className="editButton" onClick={openUpload}>
              追加附件{' '}
            </Button>
            <Space>
              <Button className="editButton" onClick={editRemark}>
                编辑备注
              </Button>
            </Space>{' '}
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
          ref={InfoRef}
          id={id}
          isModalVisible={isModalVisible}
          pageParams={pageParams}
          key={'Order Detail Perview'}
          detailDrawerClose={detailDrawerClose}
          row={Record}
        />
        <LogInfo
          id={sid}
          title={'销售订单' + id + ' 操作日志'}
          sourceType={'40'}
          visible={logVisible}
          closed={() => {
            setLogVisible(false);
          }}
        />
      </Drawer>
      {/* 销售处理抽屉 */}
      {/* <MyDrawer fn={fn} ref={drawerRef} /> */}
      <SalesDealDrawer ref={SaleDrawerRef} fn={fn} />
      <SpeceilinfoDrawer ref={SpeceilinfoDrawerRef} fn={fn} />
      <Modal
        width={460}
        className="saleModal"
        title="销售处理确认"
        visible={saleVisible}
        onOk={nextStep}
        onCancel={cancelModal}
        okButtonProps={{ loading: confirmload }}
      >
        <div style={{ color: '#ababab' }}>请选择处理方式：</div>
        <Radio.Group onChange={saleChange} value={saleValue}>
          <Space direction="vertical">
            <Radio value={1}>需要处理</Radio>
            <Radio value={2}>不处理，继续执行订单</Radio>
          </Space>
        </Radio.Group>
        <div style={{ color: '#c9c9c9' }}>
          Tips:选择“不处理”后将无法在OMS内修改JV标记，请谨慎操作
        </div>
      </Modal>
      <ModalOrder open={modalVisit} visit={setModalVisit} id={id} />
      <EditModal ref={EditRef} inverted={inverted} />
      {loadPdf && (
        <div className="loader-inner ball-pulse">
          <div />
          <div />
          <div />
        </div>
      )}
    </div>
  );
};
// export default Index;
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={location.pathname} saveScrollPosition="screen">
    <Index />
  </KeepAlive>
);
