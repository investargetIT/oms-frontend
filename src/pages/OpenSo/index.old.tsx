import React, { useState, useEffect, useRef } from 'react';
import { Button, Space, Modal, Form, message } from 'antd';
// import Cookies from 'js-cookie';
import { useModel, history } from 'umi';
import { colLimit, getByKeys } from '@/services';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { exportReporterMissionOpenData, openSO } from '@/services/task';
import ProForm, { ProFormDateRangePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import moment from 'moment';
const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [yClient, setYClient] = useState(900);
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [fold, setFold] = useState(false);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  const initialValues = {
    sku: '',
    customerCode: '',
    customerName: '',
    orderNo: '',
    siteSales: '',
    backOrder: '',
    reqBackOrder: '',
    groupName: '',
    dutyDept: '',
    soNotClearAscription: '',
    promiseStartDate: '',
    promiseEndDate: '',
    time: [null, null],
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
    { title: 'OpenSO_ID', width: 120, dataIndex: 'sid' },
    { title: 'SO_SKU', width: 120, dataIndex: 'soSku' },
    { title: '客户号', width: 120, dataIndex: 'customerCode' },
    { title: '客户名称', width: 120, dataIndex: 'customerName' },
    { title: '集团名称', width: 150, dataIndex: 'groupName' },
    { title: '客户类型', width: 120, dataIndex: 'customerType' },
    { title: 'PO描述', width: 120, dataIndex: 'poDesc' },
    { title: '销售单号', width: 150, dataIndex: 'orderNo' },
    { title: '销售单创建日期时间', width: 150, dataIndex: 'salesCreateTime' },
    { title: '行项目', width: 150, dataIndex: 'itemNo' },
    { title: '订单类型', width: 150, dataIndex: 'orderType' },
    { title: '订单类型描述', width: 120, dataIndex: 'orderTypeDesc' },
    { title: '是否交货冻结', width: 150, dataIndex: 'delBlockFlag' },
    { title: '一次性发货', width: 150, dataIndex: 'oneDelivery' },
    { title: '物料号', width: 120, dataIndex: 'sku' },
    { title: '物料描述', width: 150, dataIndex: 'itemDesc' },
    { title: '制造商型号', width: 120, dataIndex: 'mfgSku' },
    { title: '工厂相关物料状态', width: 150, dataIndex: 'bizStatus' },
    { title: '物料状态描述', width: 120, dataIndex: 'bizStatusDesc' },
    { title: '产品类型', width: 120, dataIndex: 'productType' },
    { title: 'Stock Type', width: 120, dataIndex: 'stockType' },
    { title: '订单数量', width: 120, dataIndex: 'orderQty' },
    { title: 'Open delivery数量', width: 120, dataIndex: 'openQty' },
    { title: 'Open delivery金额', width: 120, dataIndex: 'openAmount' },
    { title: 'SAP确认数量(扣除已发货数量)', width: 120, dataIndex: 'sapConfirmQty' },
    { title: '确认金额', width: 120, dataIndex: 'confirmAmount' },
    { title: '缺货数量', width: 120, dataIndex: 'shortageQty' },
    { title: '缺货金额', width: 120, dataIndex: 'shortageAmount' },
    { title: '承诺交货日期', width: 120, dataIndex: 'promiseDate' },
    { title: '请求交货期', width: 120, dataIndex: 'requestDate' },
    { title: 'Sourcing 采购订单号', width: 120, dataIndex: 'sourcingNo' },
    { title: '采购订单状态', width: 120, dataIndex: 'sourcingStatus' },
    { title: '预计到库日期', width: 120, dataIndex: 'reqArriveDate' },
    { title: '采购数量', width: 120, dataIndex: 'poQty' },
    { title: '已收货数量', width: 120, dataIndex: 'poRecQty' },
    { title: '预估交货日', width: 120, dataIndex: 'poArriveDate' },
    { title: '相关替换产品', width: 120, dataIndex: 'alternativedSKU' },
    { title: '完全替代产品', width: 120, dataIndex: 'replacedSKU' },
    // { title: '放单时间', width: 120, dataIndex: 'release_date' },
    { title: '客户抬头(拆到二级)', width: 120, dataIndex: 'siteName' },
    { title: '负责销售(拆到二级）', width: 120, dataIndex: 'siteSales' },
    { title: '负责销售主管(拆到二级）', width: 120, dataIndex: 'siteSupervisor' },
    { title: '负责销售经理(拆到二级）', width: 120, dataIndex: 'siteManager' },
    { title: '负责外销(拆到二级）', width: 120, dataIndex: 'siteBdSales' },
    { title: '负责外销主管(拆到二级）', width: 120, dataIndex: 'siteBdSupervisor' },
    { title: '负责外销总监(拆到二级）', width: 120, dataIndex: 'siteBdManager' },
    { title: 'BG', width: 120, dataIndex: 'siteBG' },
    { title: '客户区域', width: 120, dataIndex: 'customerRegion' },
    { title: '客户渠道', width: 120, dataIndex: 'customerChannel' },
    { title: '装运点', width: 120, dataIndex: 'shippingPoint' },
    { title: '库存地点', width: 150, dataIndex: 'storageLocation' },
    { title: '付款条件', width: 150, dataIndex: 'paymentTerm' },
    { title: '包装注释', width: 150, dataIndex: 'packRemark' },
    // { title: '创建人', width: 150, dataIndex: 'creator' },
    { title: '采购组', width: 150, dataIndex: 'purchGroup' },
    { title: '采购组名', width: 150, dataIndex: 'purchGroupName' },
    { title: '供应商号', width: 150, dataIndex: 'supplierCode' },
    { title: '供应商名', width: 150, dataIndex: 'supplierName' },
    { title: '供应商物料号', width: 150, dataIndex: 'supplierSku' },
    { title: '产品组', width: 150, dataIndex: 'productLine' },
    { title: 'Segment', width: 150, dataIndex: 'segment' },
    { title: 'Family', width: 150, dataIndex: 'family' },
    { title: 'ABC标识', width: 150, dataIndex: 'abcFlag' },
    { title: '库存是否满足', width: 150, dataIndex: 'stockContented' },
    { title: '销售单未清类别', width: 150, dataIndex: 'soNotClearType' },
    { title: '销售单未清原因', width: 150, dataIndex: 'soNotClearReason' },
    { title: '销售单未清归属', width: 150, dataIndex: 'soNotClearAscription' },
    { title: 'BACK ORDER', width: 150, dataIndex: 'backOrder' },
    { title: 'ITEM_CATE_GROUP', width: 150, dataIndex: 'itemGroup' },
    { title: 'ITEM CATE', width: 150, dataIndex: 'itemCate' },
    { title: 'Brand Name', width: 150, dataIndex: 'brandName' },
    { title: 'MM02 LT', width: 150, dataIndex: 'mm02lt' },
    { title: 'ME12 LT', width: 150, dataIndex: 'me12lt' },
    { title: '是否缺货', width: 150, dataIndex: 'outOfStock' },
    { title: '收货地址', width: 150, dataIndex: 'deliveryAddr' },
    { title: '收货区域', width: 150, dataIndex: 'deliveryTerritory' },
    { title: '收货大区', width: 150, dataIndex: 'deliveryRegion' },
    { title: 'OMS渠道', width: 150, dataIndex: 'omsChannelName' },
    { title: 'pm name', width: 150, dataIndex: 'pmName' },
    { title: 'pms name', width: 150, dataIndex: 'pmsName' },
    // { title: '是否发货', width: 150, dataIndex: 'billing_flag' },
    // { title: '供应商发货单号或时间', width: 150, dataIndex: 'spl_obd_and_time' },
    // { title: '供应商类型', width: 150, dataIndex: 'supplier_type' },
    { title: '供应商种类', width: 150, dataIndex: 'supplierType' },
    { title: '供应商负责人', width: 150, dataIndex: 'supplierOwner' },
    { title: '未清账AR金额', width: 150, dataIndex: 'arAmount' },
    { title: '全仓库存', width: 150, dataIndex: 'whStock' },
    { title: '上海库存', width: 150, dataIndex: 'shStock' },
    { title: '全仓在途', width: 150, dataIndex: 'whInTransit' },
    { title: '供应商是否直送外仓', width: 150, dataIndex: 'sendWarehouse' },
    { title: 'SAP PO NO', width: 150, dataIndex: 'sapPoNo' },
    { title: '预计到仓日期', width: 150, dataIndex: 'estimateArrivalDate' },
    { title: 'PO归属原因', width: 150, dataIndex: 'poAscriptionReason' },
    { title: '责任部门', width: 150, dataIndex: 'dutyDept' },
    { title: 'PPS反馈', width: 150, dataIndex: 'ppsFeedback' },
    { title: '销售反馈', width: 150, dataIndex: 'salesFeedback' },
    { title: '仓库反馈', width: 150, dataIndex: 'whFeedback' },
    { title: '商品反馈', width: 150, dataIndex: 'goodsFeedback' },
    // { title: '处理结果(客户是否接受)', width: 150, dataIndex: 'updateTime' },
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
    const par = { list: ['missionNotAscriptionEnum', 'missionBackOrderEnum'] };
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
  }, []);

  const [loadExport, setLoadExport] = useState<any>(false);
  const [pageParams, setPageParams] = useState({} as any);

  const exportReporter = async () => {
    setLoadExport(true);
    const searchParams = { ...form.getFieldsValue(true) };
    searchParams.promiseStartDate = searchParams?.time[0]
      ? moment(searchParams?.time[0]).format('YYYY-MM-DD')
      : null;
    searchParams.promiseEndDate = searchParams?.time[1]
      ? moment(searchParams?.time[1]).format('YYYY-MM-DD')
      : null;
    searchParams.pageNumber = pageParams.curPage;
    searchParams.pageSize = pageParams.pageSize;
    exportReporterMissionOpenData(JSON.parse(JSON.stringify({ ...searchParams }))).then(
      (res: any) => {
        const { data } = res;
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const resContent = reader.result ? JSON.parse(reader.result.toString()) : '';
            if (resContent.statusCode) {
              message.error(resContent.errMsg);
              setLoadExport(false);
            }
          } catch {
            const el = document.createElement('a');
            el.style.display = 'none';
            el.href = URL.createObjectURL(data);
            el.download = '导出信息.xlsx';
            document.body.append(el);
            el.click();
            window.URL.revokeObjectURL(el.href);
            document.body.removeChild(el);
            setLoadExport(false);
          }
        };
        reader.readAsText(data);
        setLoadExport(false);
      },
    );
  };

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
          <ProFormText label="SO单号" name="orderNo" placeholder={'请输入'} />
          <ProFormText label="SKU" name="sku" placeholder={'请输入'} />
          <ProFormText label="客户号" name="customerCode" placeholder={'请输入客户号'} />
          <ProFormText label="客户名称" name="customerName" placeholder={'请输入'} />
          {!fold && (
            <>
              <ProFormText label="二级主销售" name="siteSales" placeholder={'请输入'} />
              <ProFormSelect
                showSearch
                allowClear={false}
                label="承诺交期B/O"
                name="backOrder"
                options={statusList[1]}
                placeholder="请选择"
              />
              <ProFormSelect
                showSearch
                allowClear={false}
                label="要求交期B/O"
                name="reqBackOrder"
                options={statusList[1]}
                placeholder="请选择"
              />
              <ProFormText label="集团名称" name="groupName" placeholder={'请输入集团名称关键字'} />
              <ProFormSelect
                showSearch
                allowClear={false}
                label="SO未清归属"
                name="soNotClearAscription"
                options={statusList[0]}
                placeholder="请选择"
              />
              <ProFormSelect
                showSearch
                allowClear={false}
                label="责任部门"
                name="dutyDept"
                options={statusList[0]}
                placeholder="请选择"
              />
              <div className="dataPickerItem" style={{ marginRight: '50px' }}>
                <ProFormDateRangePicker
                  name="time"
                  label="承诺交期"
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
              promiseStartDate: form.getFieldsValue(true).time[0]
                ? moment(form.getFieldsValue(true).time[0]).format('YYYY-MM-DD')
                : null,
              promiseEndDate: form.getFieldsValue(true).time[1]
                ? moment(form.getFieldsValue(true).time[1]).format('YYYY-MM-DD')
                : null,
              pageNumber: params?.current,
              pageSize: params?.pageSize,
            };
            setPageParams(params);
            const res = await openSO(paramsCust);
            if (res.errCode === 200) {
              return Promise.resolve({
                data: res.data?.list,
                success: true,
                total: res.data?.total,
              });
            } else {
              Modal.error({ title: res.errMsg });
              return Promise.resolve([]);
            }
          }}
          options={{ reload: false, density: false }}
          rowKey="sid"
          search={false}
          tableAlertRender={false}
          actionRef={actionRef}
          defaultSize="small"
          pagination={{
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
                size="small"
                key={'导出'}
                onClick={exportReporter}
                loading={loadExport}
                // type="link"
                // href={`https://bireportapi.mymro.cn/reportapi/openso/downloadDatas?token=${Cookies.get(
                //   'ssoToken',
                // )}`}
              >
                {' '}
                导出
              </Button>
            </Space>
          }
        />
      </div>
    </div>
  );
};

export default Index;
