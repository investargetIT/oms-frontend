import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Form, message, Spin } from 'antd';
import { forwardRef, useEffect, useRef, useState } from 'react';

import {
  getOrderDetail,
  goodsDetails,
  isThirtyRepeat,
  querySnapshotDetail,
} from '@/services/SalesOrder/index';
import moment from 'moment';

const OrderInfoContent = ({ tableRowData, orderId, orderType }: any, ref: any) => {
  const yClient = 300;
  const detailRef: any = useRef<ActionType>();
  const [load, setLoad] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

  const dateFormat = 'YYYY-MM-DD';
  const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
  const data = tableRowData;

  const [basicData, setBasicData]: any = useState({});
  const [receiveData, setReceiveData]: any = useState({});
  const [invoiceData, setInvoiceData]: any = useState({});
  const [pageLineVOList, setPageLineVO] = useState<any>([]);

  useEffect(() => {
    const fn = async () => {
      setLoad(true);
      //注意：以下接口要修改为新的合并借口（类型post入参 订单号 订单类型） 老街口扔在使用
      const res = await querySnapshotDetail({ orderNo: orderId, orderType });
      // const res = await getOrderDetail(orderId); //单独老街口
      if (res.errCode === 200) {
        const {
          salesOrderSnapshotRespVo: {
            salesOrderRespVo,
            salesOrderReceiverRespVo,
            salesOrderInvoiceInfoRespVo,
          },
          pageLineVO: { list },
        } = res?.data;
        if (salesOrderRespVo) {
          setBasicData(salesOrderRespVo);
        }
        if (salesOrderReceiverRespVo) {
          setReceiveData(salesOrderReceiverRespVo);
        }
        if (salesOrderInvoiceInfoRespVo) {
          setInvoiceData(salesOrderInvoiceInfoRespVo);
        }
        if (list) {
          setPageLineVO(list);
        }
        setLoad(false);
      } else {
        setLoad(false);
      }

      console.log(basicData, receiveData, invoiceData);

      console.log(ref);
    };
    fn();
  }, [orderId]);

  if (basicData.tariff >= 0 && basicData.tariff != '') {
    data.tariff = basicData.tariff;
  } else {
    data.tariff = '0.00';
  }

  const customer_code = tableRowData.customerCode;
  // const [toBondStatus, setToBondStatus]: any = useState(false);
  const [thirtyRepeatStatus, setThirtyRepeatStatus]: any = useState(false);
  useEffect(() => {
    // getToBondStatus(customer_code).then((res: any) => {
    //   if (res.errCode === 200) {
    //     setToBondStatus(res.data.toBond);
    //   }
    // });
    // const isThirtyRepeat_params = {
    //   orderNo: orderId,
    //   customerCode: customer_code,
    //   amount: basicData.amount,
    // };
    // isThirtyRepeat(isThirtyRepeat_params).then((res: any) => {
    //   if (res.errCode === 200) {
    //     if (JSON.stringify(res.data?.dataList) != '[]') {
    //       setThirtyRepeatStatus(true);
    //     } else {
    //       setThirtyRepeatStatus(false);
    //     }
    //   }
    //   console.log(thirtyRepeatStatus);
    // });
  }, []);

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
      title: 'SKU',
      dataIndex: 'sku',
      width: 80,
      fixed: 'left',
    },
    {
      title: '产品名称',
      dataIndex: 'productNameConcatStr',
      width: 350,
    },
    { title: '物料码', dataIndex: 'stockSkuCode', width: 100 },
    { title: '销售包装单位数量', dataIndex: 'unitQuantity', width: 150 },
    {
      title: '备货类型',
      dataIndex: 'stockType',
      width: 150,
    },
    {
      title: '预计交货日期',
      dataIndex: 'deliveryDate',
      valueType: 'date',
      width: 150,
    },
    {
      title: '面价',
      dataIndex: 'listPrice',
      width: 80,
      render(text, record) {
        if (record.listPrice >= 0 && record.listPrice != '') {
          return Number(record.listPrice).toFixed(2);
        } else {
          return '0.00';
        }
      },
    },
    {
      title: '成交价含税',
      dataIndex: 'salesPrice',
      width: 100,
      render(text, record) {
        if (record.salesPrice >= 0 && record.salesPrice != '') {
          return Number(record.salesPrice).toFixed(2);
        } else {
          return '0.00';
        }
      },
    },

    { title: '数量', dataIndex: 'qty', width: 80 },
    {
      title: '小计含税',
      dataIndex: 'totalAmount',
      width: 100,
      render(text, record) {
        if (record.totalAmount >= 0 && record.totalAmount != '') {
          return Number(record.totalAmount).toFixed(2);
        } else {
          return '0.00';
        }
      },
    },
    {
      title: '运费',
      dataIndex: 'freight',
      width: 120,
      render(text, record) {
        if (record.freight >= 0 && record.freight != '') {
          return Number(record.freight).toFixed(2);
        } else {
          return '0.00';
        }
      },
      sorter: (a, b) => (a.freight - b.freight ? 1 : -1),
    },
    {
      title: '国际运费',
      dataIndex: 'interFreight',
      width: 120,
      render(text, record) {
        if (record.interFreight >= 0 && record.interFreight != '') {
          return Number(record.interFreight).toFixed(2);
        } else {
          return '0.00';
        }
      },
      sorter: (a, b) => (a.interFreight - b.interFreight ? 1 : -1),
    },
    {
      title: '关税',
      dataIndex: 'tariff',
      width: 120,
      render(text, record) {
        if (record.tariff >= 0 && record.tariff != '') {
          return Number(record.tariff).toFixed(2);
        } else {
          return '0.00';
        }
      },
      sorter: (a, b) => (a.tariff - b.tariff ? 1 : -1),
    },
    { title: '客户物料号', dataIndex: 'customerSku', width: 100 },
    { title: '客户需求行号', dataIndex: 'poItemNo', width: 100 },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  return (
    <Spin spinning={load}>
      <div className="detailInfoContent saleOrderDetailInfoDrawer">
        <div className="content1 box">
          <div id="one" className="title">
            基本信息
          </div>
          <div className="ant-advanced-form four-gridCol">
            <Form.Item label="订单渠道">
              <span className="form-span">{basicData?.channel}</span>
            </Form.Item>
            <Form.Item label="客户代号">
              <span className="form-span">{basicData?.customerCode}</span>
            </Form.Item>
            <Form.Item label="客户名称">
              <span className="form-span">{basicData?.customerName}</span>
            </Form.Item>
            <Form.Item label="R3联系人名称">
              <span className="form-span">{basicData?.contactsName}</span>
            </Form.Item>
            <Form.Item label="主销售">
              <span className="form-span">{basicData?.salesName}</span>
            </Form.Item>
            <Form.Item label="一次性发货">
              <span className="form-span">{basicData?.partialShipment ? '是' : '否'}</span>
            </Form.Item>
            <Form.Item label="OMS创建时间">
              <span className="form-span">
                {moment(basicData?.createTime).format(dateTimeFormat)}
              </span>
            </Form.Item>
            <Form.Item label="客户采购单号">
              <span className="form-span">{basicData?.customerPurchaseNo}</span>
            </Form.Item>
            <Form.Item label="要求发货日期">
              <span className="form-span">{moment(basicData?.sendDate).format(dateFormat)}</span>
            </Form.Item>
            <Form.Item label="总计金额含税">
              <span className="form-span">&yen; {Number(basicData?.amount).toFixed(2)}</span>
            </Form.Item>
            <Form.Item label="货品金额含税">
              <span className="form-span">&yen; {Number(basicData?.goodsAmount).toFixed(2)}</span>
            </Form.Item>
            <Form.Item label="运费总计">
              <span className="form-span">&yen; {Number(basicData?.totalFreight).toFixed(2)}</span>
            </Form.Item>
            <Form.Item label="国际运费">
              <span className="form-span">&yen; {Number(basicData?.interFreight).toFixed(2)}</span>
            </Form.Item>
            <Form.Item label="关税">
              <span className="form-span">&yen; {Number(data?.tariff).toFixed(2)}</span>
            </Form.Item>
            <Form.Item label="运费调整过">
              <span className="form-span">{basicData?.adjustFreight ? '是' : '否'}</span>
            </Form.Item>
          </div>
        </div>
        <div className="content2 box">
          <div id="two" className="title">
            收货信息
          </div>
          <div className="ant-advanced-form four-gridCol">
            <Form.Item label="收货人地址" className="twoGrid">
              <span className="form-span">{receiveData?.receiverAddress}</span>
            </Form.Item>
            <Form.Item label="收货地区">
              <span className="form-span">{receiveData?.receivingArea}</span>
            </Form.Item>
            <Form.Item label="邮编">
              <span className="form-span">{receiveData?.shipZip}</span>
            </Form.Item>
            <Form.Item label="收货人姓名">
              <span className="form-span">{receiveData?.receiverName}</span>
            </Form.Item>
            <Form.Item label="收货人手机">
              <span className="form-span">{receiveData?.receiverMobile}</span>
            </Form.Item>
            <Form.Item label="收货人固话">
              <span className="form-span">{receiveData?.receiverPhone}</span>
            </Form.Item>
            <Form.Item label="收货人邮箱">
              <span className="form-span">{receiveData?.consigneeEmail}</span>
            </Form.Item>
            <Form.Item label="是否保税区">
              <span className="form-span">{receiveData?.toBond ? '是' : '否'}</span>
            </Form.Item>
            <Form.Item label="特殊编码">
              <span className="form-span">{basicData?.specialCode}</span>
            </Form.Item>
          </div>
        </div>
        <div className="content3 box">
          <div id="three" className="title">
            配送及支付
          </div>
          <div className="ant-advanced-form four-gridCol">
            <Form.Item label="交货方式">
              <span className="form-span">{basicData?.shipType}</span>
            </Form.Item>
            <Form.Item label="支付条件">
              <span className="form-span">{basicData?.paymentTerms}</span>
            </Form.Item>

            <Form.Item label="支付方式" className="twoGrid">
              <span className="form-span">{basicData?.paymentMethod}</span>
            </Form.Item>
          </div>
        </div>
        <div className="content4 box">
          <div id="four" className="title">
            开票信息
          </div>
          <div className="ant-advanced-form four-gridCol">
            <Form.Item label="发票类型">
              <span className="form-span">{invoiceData?.invoiceType}</span>
            </Form.Item>
            <Form.Item label="开票抬头" className="twoGrid">
              <span className="form-span">{invoiceData?.invoiceTitle}</span>
            </Form.Item>
            <Form.Item label="纳税人识别号" className="minLabel">
              <span className="form-span">{invoiceData?.vatTaxNo}</span>
            </Form.Item>

            <Form.Item label="注册地址">
              <span className="form-span">{invoiceData?.vatAddress}</span>
            </Form.Item>

            <Form.Item label="注册电话">
              <span className="form-span">{invoiceData?.vatPhone}</span>
            </Form.Item>

            <Form.Item label="开户银行">
              <span className="form-span">{invoiceData?.vatBankName}</span>
            </Form.Item>

            <Form.Item label="银行账户">
              <span className="form-span">{invoiceData?.vatBankNo}</span>
            </Form.Item>
          </div>
        </div>
        <div className="content5 box">
          <div id="five" className="title">
            发票寄送信息
          </div>
          <div className="ant-advanced-form four-gridCol">
            <Form.Item label="发票收件地址" className="twoGrid minLabel">
              <span className="form-span">{invoiceData?.invoiceAddress}</span>
            </Form.Item>
            <Form.Item label="发票收件地区">
              <span className="form-span">{invoiceData?.invoiceReceiveRegion}</span>
            </Form.Item>
            <Form.Item label="发票收件邮编" className="minLabel">
              <span className="form-span">{invoiceData?.invoiceZip}</span>
            </Form.Item>
            <Form.Item label="发票收件人">
              <span className="form-span">{invoiceData?.invoiceReceiver}</span>
            </Form.Item>
            <Form.Item label="发票收件手机" className="minLabel">
              <span className="form-span">{invoiceData?.invoiceMobile}</span>
            </Form.Item>
            <Form.Item label="发票收件固话" className="minLabel">
              <span className="form-span">{invoiceData?.invoiceTel}</span>
            </Form.Item>

            <Form.Item label="发票收件邮箱" className="minLabel">
              <span className="form-span">{invoiceData?.invoiceEmail}</span>
            </Form.Item>
            <Form.Item label="发票随货">
              <span className="form-span">
                {invoiceData?.followMerchandise == 1
                  ? '是'
                  : invoiceData?.followMerchandise == 0
                  ? '否'
                  : ''}
              </span>
            </Form.Item>
          </div>
        </div>
        <div className="content6 box">
          <div id="six" className="title">
            商品明细
          </div>
          <div className="ant-advanced-form" style={{ marginTop: '20px' }}>
            <table className="amountTable" cellSpacing="0" data-content="币种：CNY">
              <tbody>
                <tr>
                  <th>货品金额合计:</th>
                  <td>{Number(basicData?.goodsAmount).toFixed(2)}</td>
                  <th>头运费:</th>
                  <td>{Number(basicData?.freight).toFixed(2)}</td>
                  <th>国际运费:</th>
                  <td>{Number(basicData?.interFreight).toFixed(2)}</td>
                  <th>关税:</th>
                  <td>{Number(data?.tariff).toFixed(2)}</td>
                </tr>
                <tr>
                  <th>运费总计:</th>
                  <td>{Number(basicData?.totalFreight).toFixed(2)}</td>
                  <th>总计金额含税:</th>
                  <td>{Number(basicData?.amount).toFixed(2)}</td>
                  <th>总计金额未税:</th>
                  <td>{Number(basicData?.netPrice).toFixed(2)}</td>
                  <th>使用返利金额:</th>
                  <td>{Number(basicData?.rebate).toFixed(2)}</td>
                  {/*<th>优惠券金额:</th>
							<td>0.00</td>*/}
                </tr>
              </tbody>
            </table>

            <div className="detail_table_mod">
              <ProTable<any>
                columns={columns}
                dataSource={pageLineVOList}
                // request={async (params: any) => {
                //   const searchParams: any = {};
                //   searchParams.pageNumber = params.current;
                //   searchParams.pageSize = params.pageSize;
                //   searchParams.orderNo = orderId;
                //   const res = await goodsDetails(searchParams);
                //   res.data?.list.forEach((e: any, i: number) => {
                //     //? 在表格数据的每一条里面加一个标识，然后用这个标识找到对应要编辑的那一项
                //     e.index = i;
                //   });

                //   if (res.errCode === 200) {
                //     return Promise.resolve({
                //       data: res.data?.list,
                //       total: res.data?.total,
                //       current: 1,
                //       pageSize: 10,
                //       success: true,
                //     });
                //   } else {
                //     message.error(res.errMsg);
                //     return Promise.resolve([]);
                //   }
                // }}
                rowKey="index"
                search={false}
                toolBarRender={false}
                tableAlertRender={false}
                defaultSize="small"
                scroll={{ x: 100, y: yClient }}
                bordered
                actionRef={detailRef}
                size="small"
                pagination={{
                  defaultPageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ['1', '2', '3', '100'],
                  showTotal: (total, range) =>
                    `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                  onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};
export default forwardRef(OrderInfoContent);
