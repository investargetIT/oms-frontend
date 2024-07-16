// import RelationFlux from '@/pages/SalesAfter/Order/components/RelationFlux';
import RelatedProcesses from '@/pages/SalesOrder/components/RelatedProcesses';
import { getByKeys } from '@/services/afterSales/utils';
import {
  // calSubTotal,
  faUpOrDown,
  offerDetail,
  priceSync,
  queryQuotationRelate,
  operateAuth,
} from '@/services/InquirySheet/offerOrder';
import { toast } from '@/services/InquirySheet/utils';
import ProForm, { DrawerForm, ModalForm, ProFormSwitch, ProFormText } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Card, Col, message, Modal, Row, Space, Tabs, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'umi';
import { NumStatus } from '../contants';
import BasicInfo from './components/BasicInfo';
import CloseBtn from './components/CloseBtn';
import InvoiceDeliverInfo from './components/InvoiceDeliverInfo';
import InvoiceInfo from './components/InvoiceInfo';
import Log from './components/Log';
import PayInfo from './components/PayInfo';
import ReceiverInfo from './components/ReceiverInfo';
import TotalDesc from './components/TotalDesc';
import type { TableListItem } from './const';
import { relationTableOrder } from './const';
import TableCom from '@/pages/components/TableCom/Index';
import './style.less';

const { TabPane } = Tabs;

type DetailProps = Record<string, any>;

const Detail: React.FC<DetailProps> = () => {
  const params: { id?: any } = useParams();
  const [logVisible, setLogVisible] = useState<any>(false);
  const [info, setInfo] = useState<any>({});
  const [total, setTotal] = useState<any>({});
  const [bizEnum, setBizEnum] = useState<any>({});
  const [selectRows, setSelectRows] = useState<any>([]);
  const [ids, setIds] = useState<any>([]);
  const [shelfVisible, setShelfVisible] = useState<any>(false);
  const actionRef = useRef({} as any);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);

  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
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
      title: 'SKU',
      dataIndex: 'sku',
      width: 100,
      fixed: 'left',
    },
    {
      title: '客户内网上架状态',
      dataIndex: 'isPublic',
      width: 150,
      render: (_, record: any) => {
        const st =
          record?.isPublic == 1
            ? '已上架'
            : record?.isPublic == 2
            ? '已下架'
            : record?.isPublic == 0
            ? '未上架'
            : '-';
        return st;
      },
    },
    {
      title: '转订单状态',
      dataIndex: 'lineStatus',
      render: (_, record: any) => NumStatus[record.lineStatus],
      width: 100,
    },
    {
      title: '本次报价数量',
      dataIndex: 'qty',
      width: 100,
    },
    {
      title: '需求数量',
      dataIndex: 'reqQty',
      width: 100,
    },
    {
      title: '销售单位',
      dataIndex: 'salesUomCode',
      width: 100,
    },
    {
      title: '含税面价',
      dataIndex: 'listPrice',
      width: 100,
    },
    {
      title: '成交价含税',
      dataIndex: 'salesPrice',
      width: 100,
    },
    {
      title: '成交价未税',
      dataIndex: 'salesPriceNet',
      width: 100,
    },
    {
      title: 'csp申请含税',
      dataIndex: 'applySalesPrice',
      width: 100,
      hideInTable: !info?.biddingCsp,
    },
    {
      title: '小计含税',
      dataIndex: 'totalAmount',
      width: 100,
      // render: (_, record) => {
      //   if (!record.qty || !record.salesPrice) {
      //     return '-';
      //   } else {
      //     return (record.qty * record.salesPrice).toFixed(0);
      //   }
      // },
    },
    {
      title: '小计未税',
      dataIndex: 'totalAmountNet',
      // render: (_, record) => {
      //   if (!record.qty || !record.salesPriceNet) {
      //     return '-';
      //   } else {
      //     return (record.qty * record.salesPriceNet).toFixed(0);
      //   }
      // },
      width: 100,
    },
    {
      title: '小计折扣',
      dataIndex: 'totalDiscount',
      width: 100,
    },
    {
      title: '小计折扣率',
      dataIndex: 'totalDiscountPerc',
      render: (_, record: any) => {
        return `${record?.totalDiscountPerc}%`;
      },
      width: 100,
    },
    {
      title: '运费',
      dataIndex: 'freight',
      width: 100,
    },
    {
      title: '国际运费',
      dataIndex: 'interFreight',
      width: 100,
    },
    {
      title: '报价到期日',
      dataIndex: 'quotValidDate',
      valueType: 'date',
      width: 100,
    },
    {
      title: '关税',
      dataIndex: 'tariff',
      width: 100,
    },
    {
      title: '产品名称',
      dataIndex: 'productNameZh',
      width: 400,
      render: (_, record: any) => {
        // return `${record?.brandName} ${record?.productNameZh} ${record?.mfgSku}`;
        return `${record?.productNameZh}`;
      },
    },
    {
      title: '客户物料号',
      dataIndex: 'customerSku',
      width: 100,
    },
    {
      title: '客户行号',
      dataIndex: 'poItemNo',
      width: 100,
    },
    {
      title: '品牌',
      dataIndex: 'brandName',
      width: 100,
    },
    {
      title: '制造商型号',
      dataIndex: 'mfgSku',
      width: 180,
    },
    {
      title: '供应商型号',
      dataIndex: 'supplierSku',
      width: 100,
    },
    {
      title: '物理单位',
      dataIndex: 'phyUomCode',
      width: 100,
    },
    {
      title: 'Product',
      dataIndex: 'productLineCode',
      render: (_, record: any) => {
        return record?.productLineName;
      },
      width: 100,
    },
    {
      title: 'Segment',
      dataIndex: 'segmentCode',
      render: (_, record: any) => {
        return record?.segmentName;
      },
      width: 100,
    },
    // {
    //   title: '是否可退换货',
    //   dataIndex: 'noReturn', //false -0 可退货换，1-true 不可退货换 .galen
    //   render: (_, record: any) => (record.noReturn ? '不可退换' : '可退换'),
    //   width: 100,
    // },
    // {
    //   title: '是否可退货',
    //   dataIndex: 'supplierReturn',
    //   render: (_, record: any) =>
    //     record?.supplierReturn == 0 ? '不可退货' : record?.supplierReturn == 1 ? '可退货' : '-',
    //   width: 100,
    // },
    // {
    //   title: '是否可换货',
    //   dataIndex: 'supplierExchange',
    //   render: (_, record: any) =>
    //     record.supplierExchange == 0 ? '不可换货' : record?.supplierExchange == 1 ? '可换货' : '-',
    //   width: 100,
    // },
    {
      title: '是否直送',
      dataIndex: 'dropShipFlag',
      render: (_, record: any) => (record.dropShipFlag == 1 ? '是' : '否'),
      width: 100,
    },
    {
      title: '产品业务状态',
      dataIndex: 'bizStatus',
      width: 100,
      render: (_, record: any) => bizEnum[record.bizStatus],
    },
    {
      title: '备货类型',
      dataIndex: 'stockType',
      width: 100,
    },
    {
      title: '产品原产国',
      dataIndex: 'madeinCountryCode',
      width: 100,
    },
    {
      title: '交付周期(工作日)',
      dataIndex: 'leadTime',
      width: 100,
    },
    {
      title: '预计发货日期',
      dataIndex: 'deliveryDate',
      valueType: 'date',
      width: 100,
    },
    {
      title: '行项目编号',
      dataIndex: 'inqLnTargetId',
      width: 100,
    },
    {
      title: 'SKU类型',
      dataIndex: 'skuTypeName',
      width: 100,
    },
    {
      title: '折扣类型',
      dataIndex: 'discountCode',
      width: 100,
    },
    {
      title: '关联需求单号',
      dataIndex: 'inquiryCode',
      width: 180,
    },
    {
      title: '关联报价单号',
      dataIndex: 'srcQuotCode',
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 100,
    },
  ];
  const getBtnAuth = async (operateButton: any) => {
    const paramReqList: any = [];
    const {
      quotType,
      channel,
      quotCode,
      status,
      customerProcessStatus,
      customerCode,
      adjustFreight,
    } = info;
    paramReqList.push({
      quotType,
      channel,
      quotCode,
      status,
      customerProcessStatus,
      customerCode,
      adjustFreight,
    });
    const res = await operateAuth({ operateButton, operateSourceChannel: 0, paramReqList });
    if (res?.errCode === 200) {
      const { data } = res;
      return data;
    } else {
      message.error(res?.errMsg);
    }
  };
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  // useEffect(() => {
  //   const par = {
  //     customerCode: info?.customerCode,
  //     shipRegionCode1: info?.shipRegionCode1,
  //     shipRegionCode2: info?.shipRegionCode2,
  //     sid: info.sid,
  //     freight: info.freight,
  //     interFreight: info.interFreight,
  //     tariff: info.tariff,
  //     calSubTotalLineReqVoList: info?.quotationLineRespVoPage?.list?.map((io: any) => ({
  //       ...io,
  //       sid: io.quotLineId,
  //       salesPrice: io.salesPrice,
  //       salesPriceNet: io.salesPriceNet,
  //       freight: io.freight,
  //       interFreight: io.interFreight,
  //       tariff: io.tariff,
  //     })),
  //   };
  //   if (info.sid) {
  //     calSubTotal(par).then((res: any) => {
  //       const { data, errCode } = res;
  //       if (errCode === 200) {
  //         setTotal(data);
  //         // setInfo({
  //         //   ...info,
  //         //   quotationLineRespVoPage: {
  //         //     ...info?.quotationLineRespVoPage,
  //         //     list: info?.quotationLineRespVoPage?.list.map((ic: any) => ({
  //         //       ...ic,
  //         //       freight: ic?.lineFreightRespVo?.interFreight,
  //         //       interFreight: ic?.lineFreightRespVo?.interFreight,
  //         //       tariff: ic?.lineFreightRespVo?.tariff,
  //         //     })),
  //         //   }
  //         // })
  //       }
  //     });
  //   }
  // }, [info]);

  useEffect(() => {
    getByKeys({ list: ['bizStatusEnum'] }).then((res) => {
      const { errCode, data } = res;
      if (errCode === 200) {
        const obj = {} as any;
        data[0]?.enums?.map((io: any) => {
          obj[io.code] = io.name;
        });
        setBizEnum(obj);
      }
    });
  }, []);

  const tabChange = () => {};

  const pushPrice = async () => {
    // if ([90, 91, 93, 20].includes(info.status)) {
    //   message.error('当前状态报价单不支持推送价格');
    //   return false;
    // } else {
    //   await priceSync({ quotCodeList: [info?.quotCode] }).then((res: any) => {
    //     if (res.errCode === 200) {
    //       message.success('推送成功');
    //     } else {
    //       message.error(res?.errMsg);
    //     }
    //   });
    // }
    if ([10, 80].includes(info.status)) {
      getBtnAuth(6).then((resd: any) => {
        if (resd) {
          const { operate } = resd;
          if (operate) {
            priceSync({ quotCodeList: [info?.quotCode] }).then((res: any) => {
              if (res.errCode === 200) {
                message.success('推送成功');
              } else {
                message.error(res?.errMsg);
              }
            });
          } else message.error('没有此操作权限');
        }
      });
    } else {
      message.error('可转订单、部分已清支持推送价格，请重新选择');
      return false;
    }
  };

  const [shelf, setShelf] = useState<any>(null);

  const onShelf = async () => {
    if (ids.length === 0) {
      message.error('请至少选中一行');
      return false;
    }
    // if (selectRows.every((io: any) => io.skuType == 10)) {
    //   message.error('请选择至少一行FA');
    //   return false;
    // }
    // if (selectRows.some((io: any) => io.isPublic != 0)) {
    //   message.error('仅可对未上架的FA操作');
    //   return false;
    // }
    getBtnAuth(7).then((res: any) => {
      if (res) {
        const { operate } = res;
        if (operate) {
          setShelf(true);
          return setShelfVisible(true);
        } else message.error('没有此操作权限');
      }
    });
  };

  const offShelf = async () => {
    if (ids.length === 0) {
      message.error('请至少选中一行');
      return false;
    }
    // if (selectRows.some((io: any) => io.isPublic != 1)) {
    //   message.error('仅可对已上架的FA操作');
    //   return false;
    // }
    getBtnAuth(7).then((res: any) => {
      if (res) {
        const { operate } = res;
        if (operate) {
          setShelf(false);
          return setShelfVisible(true);
        } else message.error('没有此操作权限');
      }
    });

    // const faUpOrDownReqVoList = selectRows.map((io: any) => ({
    //   sku: io.sku,
    //   isPublic: 0, //io.isPublic, 写死不适用行内的状态
    //   lineSid: io.quotLineId,
    // }));
    // const par = {
    //   faUpOrDownReqVoList,
    //   groupCode: info?.groupCustomerAccount,
    //   quotCode: info?.quotCode,
    //   customerCode: info?.customerCode,
    // };
    // Modal.confirm({
    //   title: '确认该操作吗？',
    //   content: '',
    //   okText: '确认',
    //   cancelText: '取消',
    //   onOk: async () => {
    //     const { errCode, errMsg } = await faUpOrDown(par);
    //     if (errCode == 200) {
    //       message.success('下架成功');
    //       setIds([]);
    //       actionRef?.current?.reload();
    //       return;
    //     } else {
    //       message.error(errMsg);
    //       return false;
    //     }
    //   },
    // });
  };

  return (
    <div className="form-content-search offer detail" id="inquirySheetOffer">
      <ProForm
        layout="horizontal"
        className="fix_lable_large has-gridForm"
        initialValues={[]}
        submitter={{
          render: false,
        }}
      >
        <Card className="head-title-wrap">
          <div style={{ fontSize: '16px', marginBottom: '5px' }}>
            报价单号：{info?.quotCode}
            <Tag color="gold" style={{ marginLeft: '10px' }}>
              {NumStatus[info.status]}
            </Tag>
          </div>
          <Row gutter={[0, 24]} style={{ paddingTop: '10px' }}>
            <Col span={3}>
              <span className="label">清单条目：</span>{' '}
              <span className="val">{info.quotationLineNum}</span>
            </Col>
            <Col span={5}>
              <span className="label">报价单类型：</span>{' '}
              <span className="val">{info.quotTypeName}</span>{' '}
            </Col>
            <Col
              span={3}
              offset={12}
              style={{ marginTop: '-20px', display: 'flex', alignItems: 'center' }}
            >
              {!info?.biddingCsp && (
                <Button type="primary" onClick={pushPrice}>
                  推送价格
                </Button>
              )}
              <Button type="link" onClick={setLogVisible}>
                <span style={{ fontSize: '18px', marginTop: '-18px' }}>操作日志</span>
              </Button>
            </Col>
          </Row>
        </Card>
        <div className="editContentCol">
          <Tabs defaultActiveKey="1" size="large" onChange={tabChange} className="cust-tab">
            <TabPane tab="基本信息" key="1">
              <Card title="基本信息" bordered={false} id="basic">
                {info.sid && <BasicInfo type="offerOrder" readonly={true} info={info} />}
              </Card>
              <Card title="收货信息" bordered={false} id="receiver">
                {info.sid && <ReceiverInfo type="offerOrder" readonly={true} info={info} />}
              </Card>
              <Card title="配送及支付信息" bordered={false} id="pay">
                {info.sid && <PayInfo type="offerOrder" readonly={true} info={info} />}
              </Card>
              <Card title="开票信息" bordered={false} id="invoice">
                {info.sid && <InvoiceInfo readonly={true} info={info?.invoiceInfoRespVo} />}
              </Card>
              <Card title="发票寄送信息" bordered={false} id="invoiceDeliver">
                {info.sid && <InvoiceDeliverInfo readonly={true} info={info.invoiceInfoRespVo} />}
              </Card>
              <Card title="报价清单明细" bordered={false} className="order-msg" id="shopDetail">
                {/* //add 推送价格和上下！！！！！架状态校验：可转订单和部分已请可以推送 10 80 */}
                <Row gutter={24} style={{ marginBottom: '-15px' }}>
                  <Col>
                    {[1, 2, 6].includes(info?.quotType) && !info?.biddingCsp && (
                      <Space style={{ marginBottom: '-10px' }}>
                        <Button
                          key={'up'}
                          type={'primary'}
                          onClick={onShelf}
                          disabled={[10, 80].includes(info?.status) ? false : true}
                        >
                          客户内网上架
                        </Button>
                        <Button
                          key={'off'}
                          type={'primary'}
                          onClick={offShelf}
                          disabled={[90, 91, 20, 93].includes(info?.status) ? true : false}
                        >
                          客户内网下架
                        </Button>
                      </Space>
                    )}
                  </Col>
                </Row>
                {total && <TotalDesc totalDesc={total} />}

                <div className="cust-table">
                  <TableCom
                    columns={columns}
                    scroll={{ x: 200, y: 500 }}
                    style={{ padding: '20px 0', background: '#fff' }}
                    size="small"
                    actionRef={actionRef}
                    bordered
                    rowKey="quotLineId"
                    options={{ reload: false, density: false }}
                    search={false}
                    tableAlertRender={false}
                    pagination={{
                      showSizeChanger: true,
                      pageSizeOptions: ['10', '20', '50', '100'],
                      // showTotal: total => `共有 ${total} 条数据`,
                      showTotal: (totalPage, range) =>
                        `共有 ${totalPage} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                      onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
                      showQuickJumper: true,
                    }}
                    dateFormatter="string"
                    request={async (par) => {
                      const { data, errCode, errMsg } = await offerDetail(params?.id, {
                        pageNumber: par?.current,
                        pageSize: par?.pageSize,
                        querySource: 2,
                      });
                      if (errCode === 200) {
                        setInfo({
                          ...data,
                          company: {
                            label: data?.branchCompanyName,
                            value: data?.branchCode,
                          } as any,
                        });
                        const infoTotal = {
                          amount: data?.amount,
                          amountNet: data?.amountNet,
                          goodsAmount: data?.goodsAmount,
                          goodsAmountNet: data?.goodsAmountNet,
                          totalDiscount: data?.totalDiscount,
                          calcFreightRespVo: {
                            headFreight: data?.freight,
                            interFreight: data?.interFreight,
                            tariff: data?.tariff,
                            totalFreight: data?.totalFreight,
                          },
                        };
                        setTotal(infoTotal);
                        return Promise.resolve({
                          data: data?.quotationLineRespVoPage?.list,
                          success: true,
                          total: data?.quotationLineRespVoPage?.total,
                        });
                      } else {
                        return toast(`${errMsg}`, `${errCode}`);
                      }
                    }}
                    rowSelection={
                      [1, 2, 6].includes(info?.quotType) && !info.biddingCsp
                        ? {
                            type: 'checkbox',
                            selectedRowKeys: ids,
                            onChange: (rowKeys: any, rows: any) => {
                              setIds(rowKeys);
                              setSelectRows(rows);
                            },
                          }
                        : false
                    }
                    onRow={(record: any) => {
                      return {
                        onClick: () => {
                          const selectedRowKeys = [...ids];
                          const newList = [...selectRows];
                          if (selectedRowKeys.indexOf(record.quotLineId) >= 0) {
                            selectedRowKeys.splice(selectedRowKeys.indexOf(record.quotLineId), 1);
                            newList.forEach((item, index) => {
                              if (item.quotLineId === record.quotLineId) {
                                newList.splice(index, 1);
                              }
                            });
                          } else {
                            selectedRowKeys.push(record.quotLineId);
                            newList.push(record);
                          }
                          setIds(selectedRowKeys);
                          setSelectRows(newList);
                        },
                      };
                    }}
                  />
                </div>
              </Card>
            </TabPane>
            {info?.quotCode && (
              <TabPane tab="相关流程" key="2">
                <Card title="" className="cust-table" bordered={false}>
                  {/* galen wan公用 */}
                  {/*<RelationFlux workflowId={info?.quotCode} />*/}
                  <RelatedProcesses billNo={info?.quotCode} />
                </Card>
              </TabPane>
            )}
            {info?.quotCode && (
              <TabPane tab="相关订单" key="3">
                <Card title="" className="cust-table" bordered={false}>
                  <ProTable<TableListItem>
                    className="table-cust"
                    bordered
                    columns={relationTableOrder}
                    scroll={{ x: 200, y: 500 }}
                    size="small"
                    rowKey="index"
                    options={false}
                    search={false}
                    pagination={{
                      showSizeChanger: true,
                      pageSizeOptions: ['10', '20', '50', '100'],
                      // showTotal: total => `共有 ${total} 条数据`,
                      showTotal: (totalPage, range) =>
                        `共有 ${totalPage} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                      // onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
                      showQuickJumper: true,
                    }}
                    dateFormatter="string"
                    request={async () => {
                      const par = {
                        quotCode: info?.quotCode,
                        type: 1,
                      };
                      const { data = [] as any } = await queryQuotationRelate(par);
                      // params, sorter, filter
                      return Promise.resolve({
                        data: data?.map((io: any) => ({
                          ...io,
                          orderNo: io.relateCode,
                        })), // 暂时没提供
                        success: true,
                      });
                    }}
                  />
                </Card>
              </TabPane>
            )}
          </Tabs>
        </div>
      </ProForm>
      {/*操作日志*/}
      <DrawerForm<any>
        title="操作日志"
        visible={logVisible}
        onVisibleChange={setLogVisible}
        drawerProps={{
          destroyOnClose: true,
        }}
      >
        <Log sourceId={params?.id} sourceType={30} quotCode={info?.quotCode} />
      </DrawerForm>
      {/* FA上架操作(上下架) */}
      <ModalForm
        style={{ padding: '20px' }}
        title={shelf ? 'FA上架操作' : 'FA下架操作'}
        visible={shelfVisible}
        onVisibleChange={setShelfVisible}
        modalProps={{
          destroyOnClose: true,
        }}
        submitter={{
          searchConfig: {
            submitText: shelf ? '确认上架' : '确认下架',
            resetText: '取消',
          },
        }}
        onFinish={async (values) => {
          const faUpOrDownReqVoList = selectRows.map((io: any) => ({
            sku: io.sku,
            isPublic: shelf ? 1 : 0, // io.isPublic,  不适用行内的isPublic
            lineSid: io.quotLineId,
          }));
          const par = {
            faUpOrDownReqVoList,
            groupCode: info?.groupCustomerAccount,
            quotCode: info?.quotCode,
            customerCode: info?.customerCode,
            isApplyGroup: values?.isApplyGroup,
          };
          Modal.confirm({
            title: '确认该操作吗？',
            content: '',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
              const { errCode, errMsg } = await faUpOrDown(par);
              if (errCode == 200) {
                message.success(shelf ? '上架成功' : '下架成功');
                setShelfVisible(false);
                setIds([]);
                setSelectRows([]);
                actionRef?.current?.reload();
                return;
              } else {
                message.error(errMsg);
                return false;
              }
            },
          });
        }}
        layout={'horizontal'}
      >
        <Row>
          <Col>
            <ProFormSwitch
              name="isApplyGroup"
              label="是否应用到集团"
              disabled={!info?.groupCustomerAccount ? true : false}
              fieldProps={{
                checkedChildren: true,
                unCheckedChildren: false,
              }}
              initialValue={info?.groupCustomerAccount ? true : false}
            />
          </Col>
          {!info?.groupCustomerAccount && (
            <Col offset={1} style={{ color: 'red', paddingTop: '5px' }}>
              当前客户非集团客户
            </Col>
          )}
        </Row>

        <ProFormText
          label={'集团客户号'}
          initialValue={info?.groupCustomerAccount || ''}
          name="groupCustomerAccount"
          readonly
        />
        <ProFormText
          label={'集团名称'}
          initialValue={info?.groupCustomerName || ''}
          name="groupCustomerName"
          readonly
        />
      </ModalForm>
      <CloseBtn type={info?.biddingCsp} />
    </div>
  );
};

export default Detail;
