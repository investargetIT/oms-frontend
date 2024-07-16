import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Row, Col } from 'antd';
import { getDatalist } from '@/services/DataReport';
import Cookies from 'js-cookie';
import { useModel, history } from 'umi';
import { colLimit } from '@/services';
import ProTable from '@ant-design/pro-table';
const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [yClient, setYClient] = useState(900);
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
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
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    { title: 'SO_SKU', width: 120, dataIndex: 'so_sku' },
    { title: '客户号', width: 120, dataIndex: 'customer_code' },
    { title: '客户名称', width: 120, dataIndex: 'customer_name' },
    { title: '集团名称', width: 150, dataIndex: 'group_name' },
    // { title: 'K5 Flag', width: 120, dataIndex: 'k5_flag' },
    { title: 'PO描述', width: 120, dataIndex: 'po_no' },
    { title: '销售单号', width: 150, dataIndex: 'sales_no' },
    { title: '销售单创建日期时间', width: 150, dataIndex: 'create_date' },
    { title: '行项目', width: 150, dataIndex: 'item_no' },
    { title: '订单类型', width: 150, dataIndex: 'order_type' },
    { title: '订单类型描述', width: 120, dataIndex: 'order_type_desc' },
    { title: '是否交货冻结', width: 150, dataIndex: 'del_block_flag' },
    { title: '一次性发货', width: 150, dataIndex: 'comp_del_flag' },
    { title: '物料号', width: 120, dataIndex: 'material' },
    { title: '物料描述', width: 150, dataIndex: 'item_desc' },
    { title: '制造商型号', width: 120, dataIndex: 'mfg_sku' },
    { title: '工厂相关物料状态', width: 150, dataIndex: 'biz_status' },
    { title: '物料状态描述', width: 120, dataIndex: 'biz_status_desc' },
    { title: '产品类型', width: 120, dataIndex: 'product_type' },
    { title: 'Stock Type', width: 120, dataIndex: 'stock_type' },
    { title: '订单数量', width: 120, dataIndex: 'sales_quantity' },
    { title: 'Open delivery数量', width: 120, dataIndex: 'open_qty' },
    { title: 'Open delivery金额', width: 120, dataIndex: 'open_val' },
    { title: 'SAP确认数量(扣除已发货数量)', width: 120, dataIndex: 'logical_open_qty' },
    { title: '确认金额', width: 120, dataIndex: 'logical_open_val' },
    { title: '缺货数量', width: 120, dataIndex: 'shortage_qty' },
    { title: '缺货金额', width: 120, dataIndex: 'shortage_val' },
    { title: '承诺交货日期', width: 120, dataIndex: 'promise_date' },
    { title: '请求交货期', width: 120, dataIndex: 'request_del_date' },
    { title: 'Sourcing 采购订单号', width: 120, dataIndex: 'sourcing_purch_order' },
    { title: '采购订单状态', width: 120, dataIndex: 'po_status' },
    { title: '预计到库日期', width: 120, dataIndex: 'req_arrive_date' },
    { title: '采购数量', width: 120, dataIndex: 'po_qty' },
    { title: '已收货数量', width: 120, dataIndex: 'po_rec_qty' },
    { title: '预估交货日', width: 120, dataIndex: 'po_arrive_memo' },
    { title: '相关替换产品', width: 120, dataIndex: 'alternativedSKU' },
    { title: '完全替代产品', width: 120, dataIndex: 'replacedSKU' },
    // { title: '放单时间', width: 120, dataIndex: 'release_date' },
    { title: '客户抬头(拆到二级)', width: 120, dataIndex: 'site_name' },
    { title: '负责销售(拆到二级）', width: 120, dataIndex: 'site_sales' },
    { title: '负责销售主管(拆到二级）', width: 120, dataIndex: 'site_supervisor' },
    { title: '负责销售经理(拆到二级）', width: 120, dataIndex: 'site_manager' },
    { title: '负责外销(拆到二级）', width: 120, dataIndex: 'site_bd_sales' },
    { title: '负责外销主管(拆到二级）', width: 120, dataIndex: 'site_bd_supervisor' },
    { title: '负责外销总监(拆到二级）', width: 120, dataIndex: 'site_bd_manager' },
    { title: 'BG', width: 120, dataIndex: 'site_BG' },
    { title: '客户区域', width: 120, dataIndex: 'region' },
    { title: '客户渠道', width: 120, dataIndex: 'channelName' },
    { title: '装运点', width: 120, dataIndex: 'shipping_point' },
    { title: '库存地点', width: 150, dataIndex: 'storage_location' },
    { title: '付款条件', width: 150, dataIndex: 'payment_term' },
    { title: '包装注释', width: 150, dataIndex: 'pack_remark' },
    // { title: '创建人', width: 150, dataIndex: 'creator' },
    { title: '采购组', width: 150, dataIndex: 'purchasing_group' },
    { title: '采购组名', width: 150, dataIndex: 'purch_gp_name' },
    { title: '供应商号', width: 150, dataIndex: 'updateTime' },
    { title: '供应商名', width: 150, dataIndex: 'supplier_name' },
    { title: '供应商物料号', width: 150, dataIndex: 'supplier_sku' },
    { title: '产品组', width: 150, dataIndex: 'product_line' },
    { title: 'Segment', width: 150, dataIndex: 'segment' },
    { title: 'Family', width: 150, dataIndex: 'family' },
    { title: 'ABC标识', width: 150, dataIndex: 'abc_flag' },
    { title: '库存是否满足', width: 150, dataIndex: 'stockCovered' },
    { title: '销售单未清类别', width: 150, dataIndex: 'order_open_cata' },
    { title: '销售单未清原因', width: 150, dataIndex: 'new_order_reason' },
    { title: '销售单未清归属', width: 150, dataIndex: 'new_order_reason_owner' },
    { title: 'BACK ORDER', width: 150, dataIndex: 'back_order' },
    { title: 'ITEM_CATE_GROUP', width: 150, dataIndex: 'item_cate_group' },
    { title: 'ITEM CATE', width: 150, dataIndex: 'item_cate' },
    { title: 'Brand Name', width: 150, dataIndex: 'brand_name_zh' },
    { title: 'MM02 LT', width: 150, dataIndex: 'mm02_LT' },
    { title: 'ME12 LT', width: 150, dataIndex: 'me12_LT' },
    { title: '是否缺货', width: 150, dataIndex: 'stockFlag' },
    { title: '收货地址', width: 150, dataIndex: 'del_addr' },
    { title: '收货区域', width: 150, dataIndex: 'del_territory' },
    { title: '收货大区', width: 150, dataIndex: 'del_region' },
    { title: 'OMS渠道', width: 150, dataIndex: 'channelName' },
    { title: 'pm name', width: 150, dataIndex: 'pm_name' },
    { title: 'pms name', width: 150, dataIndex: 'pms_name' },
    // { title: '是否发货', width: 150, dataIndex: 'billing_flag' },
    // { title: '供应商发货单号或时间', width: 150, dataIndex: 'spl_obd_and_time' },
    // { title: '供应商类型', width: 150, dataIndex: 'supplier_type' },
    { title: '供应商种类', width: 150, dataIndex: 'supplier_type2' },
    { title: '供应商负责人', width: 150, dataIndex: 'supplier_owner' },
    { title: '未清账AR金额', width: 150, dataIndex: 'ar_amt' },
    { title: '全仓库存', width: 150, dataIndex: 'total_hand' },
    { title: '上海库存', width: 150, dataIndex: 'sj_hand' },
    { title: '全仓在途', width: 150, dataIndex: 'open_po_qty' },
    { title: '供应商是否直送外仓', width: 150, dataIndex: 'supplier_flag' },
    { title: 'SAP PO NO', width: 150, dataIndex: 'po_number' },
    { title: '预计到仓日期', width: 150, dataIndex: 'po_vdr_dlv_date' },
    { title: 'PO归属原因', width: 150, dataIndex: 'po_delay_reason' },
    { title: '责任部门', width: 150, dataIndex: 'po_co_dept' },
    { title: 'PPS备注', width: 150, dataIndex: 'po_pps_comment' },
    { title: 'PPS人员', width: 150, dataIndex: 'po_pps_name' },
    { title: 'PPS更新日期', width: 150, dataIndex: 'po_pps_date' },
    { title: '销售反馈', width: 150, dataIndex: 'sales_comment' },
    { title: '销售回复日期', width: 150, dataIndex: 'sales_cmt_date' },
    { title: '仓库反馈', width: 150, dataIndex: 'wh_comment' },
    { title: '仓库反馈日期', width: 150, dataIndex: 'wh_cmt_date' },
    { title: '商品反馈', width: 150, dataIndex: 'pm_comment' },
    { title: '商品反馈日期', width: 150, dataIndex: 'pm_cmt_date' },
    { title: '处理结果(客户是否接受)', width: 150, dataIndex: 'updateTime' },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 200);
  }, [initialState?.windowInnerHeight]);
  // useEffect(() => {
  //   getDatalist().then((res: any) => {
  //     if (res.errCode === 200) {
  //       setData(res.data?.dataList);
  //     } else {
  //       setData([]);
  //     }
  //   });
  // }, []);
  return (
    <div className="omsAntStyle openSoStyle">
      <div className="form-content-search">
        {/* <Space>
        <Button
          size="small"
          key={'导出'}
          type="link"
          href={`https://bireportapi.mymro.cn/reportapi/openso/downloadDatas?token=${Cookies.get(
            'ssoToken',
          )}`}
        >
          {' '}
          导出
        </Button>
      </Space> */}
        {/* <Table columns={columns} dataSource={data} scroll={{ x: 200 }} /> */}
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
          // request={async (params: any) => {
          //   params.curPage = params.current;
          //   setCurrentPage(params.current);
          //   setCurrentPageSize(params.pageSize);
          //   const res = await getDatalist(params);
          //   if (res.errCode === 200) {
          //     return Promise.resolve({
          //       data: res.data?.dataList,
          //       success: true,
          //       total: res.data?.totalCount || 0,
          //     });
          //   } else {
          //     Modal.error({ title: res.errMsg });
          //     return Promise.resolve([]);
          //   }
          // }}
          options={{ reload: false, density: false }}
          rowKey="sku"
          search={false}
          tableAlertRender={false}
          // actionRef={ref}
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
                type="link"
                href={`https://bireportapi.mymro.cn/reportapi/openso/downloadDatas?token=${Cookies.get(
                  'ssoToken',
                )}`}
              >
                {' '}
                导出
              </Button>
            </Space>
          }
        />
        <Space style={{ marginLeft: '15px' }}>
          <Row gutter={24}>
            <Col span={24}>
              <p>各日期相关字段说明：</p>
            </Col>
            <Col span={24} style={{ marginLeft: '15px', marginTop: '5px' }}>
              <p>1.请求交货期：客户要求的交货日期，含义是要求在不早于此日期的前提下尽早发货</p>
            </Col>
            <Col span={24} style={{ marginLeft: '15px' }}>
              <p>
                2.承诺交货日期：订单创建时按照请求交货日期、库存、供应商交货天数等因素计算出的理论交货日期；
              </p>
            </Col>
            <Col span={24} style={{ marginLeft: '45px' }}>
              <p>a.如果库存满足，承诺交货日期就是不早于请求交货日期的首个工作日；</p>
            </Col>
            <Col span={24} style={{ marginLeft: '45px' }}>
              <p>
                b.如果需要采购，则按照供应商交货天数、收货处理天数（如果是仓发）、调拨天数（如果涉及调拨）计算出理论的备货完成日期，那么承诺交货日期就是不早于请求交货日期且不早于备货完成日期的首个工作日；
              </p>
            </Col>
            <Col span={24} style={{ marginLeft: '15px' }}>
              <p>3.国能交货限期：客户要求的最后交货期限，目前仅适用于国能</p>
            </Col>
            <Col span={24} style={{ marginLeft: '15px' }}>
              <p>
                4.预计到仓日期：采购订单的预计交货日期，最初按照供应商交货天数计算而得，后续可能因供应商反馈而变更；
              </p>
            </Col>
            <Col span={24} style={{ marginLeft: '15px' }}>
              <p>5.预估交货日：如果库存满足，则预估交货日为YES；</p>
            </Col>
            <Col span={24} style={{ marginLeft: '45px' }}>
              <p>a.如果只需要采购，不需要调拨，则预估交货日为采购订单的预计到库日期；</p>
            </Col>
            <Col span={24} style={{ marginLeft: '45px' }}>
              <p>b.如果只需要调拨，不需要采购，则预计交货日为当前日期加调拨天数；</p>
            </Col>
            <Col span={24} style={{ marginLeft: '45px' }}>
              <p>c.如果调拨单已经发出，则预计交货日为调拨发货日期加调拨天数；</p>
            </Col>
            <Col span={24} style={{ marginLeft: '45px' }}>
              <p>d.如果既需要调拨，也需要采购，则预估交货日为采购订单的预计到库日期加调拨天数；</p>
            </Col>
            <Col span={24} style={{ marginLeft: '45px' }}>
              <p>e.如果当前的采购和调拨不足以满足订单需求，则预估交货日为NO；</p>
            </Col>
          </Row>
        </Space>
      </div>
    </div>
  );
};

export default Index;
