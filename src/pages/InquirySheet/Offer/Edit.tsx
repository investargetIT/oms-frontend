/* eslint-disable @typescript-eslint/no-unused-expressions */
import { calSubTotalEdit, editOffer, freightAvg, offerDetail } from '@/services/InquirySheet';
import { queryPayInfo, toast } from '@/services/InquirySheet/utils';
import ProForm, { DrawerForm, ModalForm, ProFormRadio, ProFormText } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Card, Col, Form, message, Row, Space, Tag } from 'antd';
import React, { useState, useRef } from 'react';
import { useParams, history, useModel } from 'umi';
import Dtitle from '../../components/Dtitle';
import { NumStatus } from '../contants';
import BasicInfo from './components/BasicInfo';
import type { ActionType } from '@ant-design/pro-table';
import InvoiceDeliverInfo from './components/InvoiceDeliverInfo';
import InvoiceInfo from './components/InvoiceInfo';
import Log from './components/Log';
import PayInfo from './components/PayInfo';
import ReceiverInfo from './components/ReceiverInfo';
import SearchAddress from './components/SearchAddress';
import SearchInvoice from './components/SearchInvoice';
import './style.less';
import SearchAddressInvoice from './components/SearchAddressInvoice';

import TotalDesc from './components/TotalDesc';
import { operateAuth } from '@/services/InquirySheet/offerOrder';
type EditProps = Record<string, any>;

const Edit: React.FC<EditProps> = () => {
  const { destroyCom } = useModel('tabSelect');
  const params: { id?: any } = useParams();
  const [form] = Form.useForm();
  const [logVisible, setLogVisible] = useState<any>(false);
  const [selectMethod, setSelectMethod] = useState<any>('a');
  const [modalVisibleAddress, setModalVisibleAddress] = useState<boolean>(false);
  const [modalVisibleInvice, setModalVisibleInvice] = useState<boolean>(false);
  const [modalVisibleAddressInvoice, setModalVisibleAddressInvoice] = useState<any>(false);
  const [modalVisibleFreight, setModalVisibleFreight] = useState<boolean>(false);
  const [invoiceList, setInvoiceList] = useState<any>({});
  const [addressList, setAddressList] = useState<any>({});
  const [total, setTotal] = useState<any>({});
  const [info, setInfo] = useState<any>({});
  const actRef = useRef<ActionType>();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);

  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
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
  const getTotal = async (address: any) => {
    console.log(111111);
    let sCode1 = '';
    let sCode2 = '';
    if (address) {
      sCode1 = address.shipRegionCode1;
      sCode2 = address.shipRegionCode2;
    } else {
      (sCode1 = info?.shipRegionCode1), (sCode2 = info?.shipRegionCode2);
    }
    const par = {
      customerCode: info?.customerCode,
      shipRegionCode1: sCode1,
      shipRegionCode2: sCode2,
      sid: info.sid,
      freight: info.freight,
      interFreight: info.interFreight,
      tariff: info.tariff,
      quotType: info.quotType,
      calSubTotalLineReqVoList: info?.quotationLineRespVoPage?.list?.map((io: any) => ({
        ...io,
        sid: io.quotLineId,
        salesPrice: io.salesPrice,
        salesPriceNet: io.salesPriceNet,
        freight: io.freight,
        interFreight: io.interFreight,
        tariff: io.interFreight,
      })),
    };
    if (info.sid && info?.quotationLineRespVoPage?.list?.length > 0) {
      calSubTotalEdit(par).then((res: any) => {
        const { data, errCode } = res;
        if (errCode === 200) {
          setTotal(data);
        }
      });
    }
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
      title: 'SKU',
      dataIndex: 'sku',
      width: 100,
      fixed: 'left',
    },
    {
      title: '报价行ID',
      dataIndex: 'quotLineId',
      width: 100,
    },
    { title: '物料码', dataIndex: 'stockSkuCode', width: 100 },
    { title: '销售包装单位数量', dataIndex: 'unitQuantity', width: 150 },
    {
      title: '需求数量',
      dataIndex: 'reqQty',
      width: 100,
    },
    {
      title: '可转数量',
      dataIndex: 'canTransforQuotQty',
      width: 100,
    },
    {
      title: '已转数量',
      dataIndex: 'totalCloseQty',
      width: 100,
    },
    {
      title: '本次报价数量',
      width: 100,
      dataIndex: 'qty',
      // render: (_, record: any) => {
      //   return (
      //     <InputNumber
      //       min={1}
      //       defaultValue={record.qty}
      //       onChange={(v) => {
      //         record.qty = v;
      //       }}
      //     />
      //   );
      // },
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
      title: '行运费',
      dataIndex: 'freight',
      width: 100,
    },
    {
      title: '国际运费',
      dataIndex: 'interFreight',
      width: 100,
    },
    {
      title: '关税',
      dataIndex: 'tariff',
      width: 100,
    },
    {
      title: '报价到期日',
      dataIndex: 'quotValidDate',
      valueType: 'date',
      width: 100,
    },
    {
      title: '产品名称',
      dataIndex: 'productNameZh',
      width: 400,
      render: (_, record: any) => {
        return `${record?.brandName} ${record?.productNameZh} ${record?.mfgSku}`;
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
      dataIndex: 'supplierCode',
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
    //   dataIndex: 'noReturn',
    //   render: (_, record: any) => (record.noReturn ? '不可退换' : '可退换'),
    //   width: 100,
    // },
    {
      title: '是否可退货',
      dataIndex: 'supplierReturn',
      render: (_, record: any) =>
        record?.supplierReturn == 0 ? '不可退货' : record?.supplierReturn == 1 ? '可退货' : '-',
      width: 100,
    },
    {
      title: '是否可换货',
      dataIndex: 'supplierExchange',
      render: (_, record: any) =>
        record.supplierExchange == 0 ? '不可换货' : record?.supplierExchange == 1 ? '可换货' : '-',
      width: 100,
    },
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
      title: '行项目编号',
      dataIndex: 'inqLnTargetId',
      width: 100,
    },
    {
      title: '关联需求单号',
      dataIndex: 'inquiryCode',
      width: 180,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 100,
    },
  ];
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
  //       tariff: io.interFreight,
  //     })),
  //   };
  //   if (info.sid && info?.quotationLineRespVoPage?.list?.length > 0) {
  //     calSubTotal(par).then((res: any) => {
  //       const { data, errCode } = res;
  //       if (errCode === 200) {
  //         setTotal(data);
  //       }
  //     });
  //   }
  // }, [info.sid]);

  const submit = async (values: any) => {
    const par = {
      // ...total,
      ...info,
      ...values,
      goodsAmount: total?.goodsAmount,
      freight: total?.calcFreightRespVo?.headFreight,
      interFreight: total?.calcFreightRespVo?.interFreight,
      tariff: total?.calcFreightRespVo?.tariff,
      totalFreight: total?.calcFreightRespVo?.totalFreight,
      amount: total?.amount,
      amountNet: total?.amountNet,
      totalDiscount: total?.totalDiscount,
      contactCodeR3: values?.contactName?.key || info?.contactCodeR3,
      contactName: values?.contactName?.label || info?.contactName,
      oppoValue: values?.oppoValue?.label || info?.oppoValue, //labelInValue
      oppoId: values?.oppoValue?.key || info?.oppoId, //labelInValue
      branchCompanyName: values?.company?.label || info?.branchCompanyName || '',
      branchCode: values?.company?.value || info?.branchCode || '',

      invoiceInfo: {
        ...info.invoiceInfoRespVo,
        ...info.invoiceCode,
        invoiceAddress: values.invoiceAddress,
        invoiceEmail: values.invoiceEmail,
        invoiceMobile: values.invoiceMobile,
        invoiceReceiveRegion: values.invoiceReceiveRegion,
        invoiceReceiver: values.invoiceReceiver,
        invoiceTel: values.invoiceTel,
        invoiceTitle: values.invoiceTitle,
        invoiceType: values.invoiceType,
        invoiceZip: values.invoiceZip,
        vatAddress: values.vatAddress,
        vatBankName: values.vatBankName,
        vatBankNo: values.vatBankNo,
        vatCompanyName: values.vatCompanyName,
        vatTaxNo: values.vatTaxNo,
        vatPhone: values.vatPhone,
        invoiceSapCode: info.invoiceSapCode,
      },
      shipRegionCode1: info.shipRegionCode1,
      shipRegionCode2: info.shipRegionCode2,
      shipRegionCode3: info.shipRegionCode3,
      shipRegionName1: info.shipRegionName1,
      shipRegionName2: info.shipRegionName2,
      shipRegionName3: info.shipRegionName3,

      sid: info.sid,
      reqDelivDate: values?.reqDelivDate || info.reqDelivDate,
      quotValidDate: values?.quotValidDate || info.quotValidDate,
      customerCode: values?.customerCode || info.customerCode,
      vatCompanyName: info.invoiceTitle || values.invoiceTitle, //vatCompanyName 单位后端备用 前端暂无对应
      editQuotationLineReqVoList: info.quotationLineRespVoPage?.list?.map((item: any) => ({
        sid: item?.quotLineId?.toString(),
        reqQty: item.qty,
      })),
    };

    const { errCode, errMsg } = await editOffer(par);
    if (errCode === 200) {
      message.success('提交成功');
      destroyCom('/inquiry/offer', location.pathname);
    } else {
      message.error(errMsg);
    }
  };

  const onMethodChange = (val: any) => {
    // setPaymentData(val[0].value || '')
    // setInfo({
    //   ...info,
    //   paymentMethod: val[0].value || '',
    // });
    form.setFieldsValue({
      paymentMethod: val[0].value || '',
    });
  };

  const dbSaveAddress = async (val: any) => {
    if (Object.values(val).length === 0) {
      message.error('请选择信息');
      return false;
    }
    // baozi
    const address = {
      region: `${val.provinceName}${val.cityName}${val.districtName}`,
      shipRegionCode1: val.province,
      shipRegionCode2: val.city,
      shipRegionCode3: val.district,
      shipRegionName1: val.provinceName,
      shipRegionName2: val.cityName,
      shipRegionName3: val.districtName,
      shipStreet: val.receiptAddress,
      shipZip: val.receiptZipCode,
      consigneeName: val.recipientName,
      consigneeMobile: val.receiptMobilePhone,
      consigneeTel: val.receiptFixPhone,
      shipEmail: val.receiptEmail,
      shipRegionSapCode: val?.shipRegionSapCode,
    };

    setInfo({
      ...info,
      ...address,
    });
    form.setFieldsValue({
      ...address,
    });
    if (info?.adjustFreight == 0) {
      getTotal(address);
    }
    setModalVisibleAddress(false);
  };

  const dbSaveVatAddress = async (val: any) => {
    if (Object.values(val).length === 0) {
      message.error('请选择信息');
      return false;
    }
    const invoiceAdd = {
      invoiceReceiver: val.recipientName,
      invoiceAddress: val.receiptAddress,
      invoiceZip: val.receiptZipCode,
      invoiceTel: val.receiptFixPhone,
      invoiceMobile: val.receiptMobilePhone,
      invoiceEmail: val.receiptEmail,
      invoiceReceiveRegion: `${val.provinceName}${val.cityName}${val.districtName}`,
      followMerchandise: val.followMerchandise == false ? 0 : 1,
      invoiceSapCode: val?.invoiceSapCode,
    };
    setInfo({
      ...info,
      ...invoiceAdd,
    });
    form.setFieldsValue({
      ...invoiceAdd,
    });
    setModalVisibleAddressInvoice(false);
  };

  const dbSaveVat = async (val: any) => {
    if (Object.values(val).length === 0) {
      message.error('请选择信息');
      return false;
    }
    setInfo({
      ...info,
      ...val,
    });
    form.setFieldsValue({
      ...val,
    });
    setModalVisibleInvice(false);
  };

  return (
    <div className="form-content-search edit" id="inquirySheetOffer">
      <ProForm
        layout="horizontal"
        className="fix_lable_large has-gridForm"
        onFinish={(values) => submit(values)}
        onFinishFailed={() => {
          message.warning('您有未完善的信息，请填写正确的信息');
        }}
        onValuesChange={(values) => {
          if (values?.invoiceType) {
            setInfo({
              ...info,
              invoiceInfoRespVo: {
                ...info.invoiceInfoRespVo,
                invoiceType: values?.invoiceType == 3 ? 3 : values?.invoiceType,
              },
            });
          }
        }}
        form={form}
        submitter={{
          searchConfig: {},
          render: () => {
            return (
              <div
                style={{
                  position: 'fixed',
                  zIndex: 100,
                  bottom: '10px',
                  right: '10px',
                  height: '30px',
                  textAlign: 'end',
                  backgroundColor: '#fff',
                  paddingRight: '10px',
                }}
              >
                <Space>
                  <Button type="primary" htmlType="submit">
                    保存
                  </Button>
                  <Button
                    onClick={() => {
                      destroyCom('/inquiry/offer', location.pathname);
                    }}
                  >
                    取消
                  </Button>
                </Space>
              </div>
            );
          },
        }}
        initialValues={[]}
      >
        <Card bordered={false} className="head-title-wrap">
          {/* <p className="head-title">{title}</p> */}
          <div style={{ fontSize: '16px', marginBottom: '5px' }}>
            报价单号：{info?.quotCode}
            <Tag color="gold" style={{ marginLeft: '10px' }}>
              {NumStatus[info.status]}
            </Tag>
          </div>
          <Row gutter={[0, 24]}>
            <Col span={3}>
              <span className="label">清单条目：</span>{' '}
              <span className="val">{info?.quotationLineNum}</span>
            </Col>
            <Col span={5}>
              <span className="label">报价单类型：</span>{' '}
              <span className="val">{info.quotTypeName}</span>{' '}
            </Col>
            <Col
              span={2}
              offset={14}
              style={{ fontSize: '18px', marginTop: '-20px', color: '#1890ff' }}
            >
              {' '}
              <Button type="link" style={{ marginTop: '-10px' }} onClick={setLogVisible}>
                <span style={{ fontSize: '18px' }}>操作日志</span>
              </Button>
            </Col>
          </Row>
        </Card>
        <div className="editContentCol">
          <Card title="基本信息" bordered={false} id="basic">
            {info.sid && <BasicInfo info={info} type="offerOrder" />}
          </Card>
          <Card title="收货信息" bordered={false} id="receiver">
            {info.sid && (
              <ReceiverInfo
                info={info}
                type="offerOrder"
                onModal={() => {
                  setModalVisibleAddress(true);
                  setAddressList([]);
                }}
              />
            )}
          </Card>
          <Card title="配送及支付信息" bordered={false} id="pay">
            {info.sid && (
              <PayInfo
                info={info}
                type="offerOrder"
                onMethodChange={(newArrayValue: any) => onMethodChange(newArrayValue)}
              />
            )}
          </Card>
          <Card title="开票信息" bordered={false} id="invoice">
            {info.sid && (
              <InvoiceInfo
                info={info?.invoiceInfoRespVo}
                onModal={() => {
                  setModalVisibleInvice(true);
                  setInvoiceList([]);
                }}
              />
            )}
          </Card>
          <Card title="发票寄送信息" bordered={false} id="invoiceDeliver">
            {info.sid && (
              <InvoiceDeliverInfo
                info={info?.invoiceInfoRespVo}
                type="edit"
                onModal={() => {
                  setModalVisibleAddressInvoice(true);
                  setAddressList([]);
                }}
              />
            )}
          </Card>
          <Card title="报价清单明细" bordered={false} className="order-msg" id="shopDetail">
            <Row gutter={24} style={{ marginBottom: '-25px' }}>
              <Col span={10}>
                <Button
                  type="primary"
                  onClick={() => {
                    // if (info.adjustFreight == 0) {
                    //   setModalVisibleFreight(true);
                    // } else {
                    //   message.error('只可分摊一次运费哦');
                    // }
                    getBtnAuth(5).then((res: any) => {
                      if (res) {
                        const { operate } = res;
                        if (operate) {
                          setModalVisibleFreight(true);
                        } else message.error('没有此操作权限');
                      }
                    });
                  }}
                >
                  分摊运费
                </Button>
              </Col>
            </Row>
            {total && <TotalDesc totalDesc={total} type="edit" />}
            <div className="cust-table">
              <ProTable<any>
                bordered
                columns={columns}
                scroll={{ x: 200, y: 500 }}
                style={{ padding: '20px 0', background: '#fff' }}
                size="small"
                rowKey="quotLineId"
                options={false}
                search={false}
                actionRef={actRef}
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
                  // 注意次params
                  const { data, errCode, errMsg } = await offerDetail(params?.id, {
                    pageNumber: par?.current,
                    pageSize: par?.pageSize,
                  });

                  if (errCode === 200) {
                    // 默认 queryPayInfo
                    let defaultPay = {} as any;
                    await queryPayInfo({ customerCode: data?.customerCode }).then((respay: any) => {
                      if (respay.data) {
                        defaultPay = {
                          payTypeCust: respay?.data?.type,
                        };
                      }
                    });
                    setInfo({
                      ...defaultPay,
                      ...data,
                      shipType: data?.shipType,
                      invoiceCode: {
                        provinceCode: data.invoiceInfoRespVo?.province,
                        cityCode: data.invoiceInfoRespVo?.city,
                        districtCode: data.invoiceInfoRespVo?.district,
                      },
                      company: { label: data?.branchCompanyName, value: data?.branchCode } as any,
                      quotationLineRespVoPage: {
                        ...data.quotationLineRespVoPage,
                        list: data?.quotationLineRespVoPage?.list?.map((io: any, index: any) => ({
                          ...io,
                          index: index,
                        })),
                      },
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
                      data: data?.quotationLineRespVoPage?.list?.map((io: any) => ({
                        ...io,
                        canTransforQuotQty: io.qty,
                        // canTransforQuotQty: io.reqQty - io.totalCloseQty,
                      })),
                      total: data?.quotationLineRespVoPage?.total,
                      success: true,
                    });
                  } else {
                    return toast(`${errMsg}`, `${errCode}`);
                  }
                }}
              />
            </div>
          </Card>
        </div>
      </ProForm>
      {/* 地址选择 带合并 */}
      <ModalForm
        title="地址选择"
        layout="horizontal"
        width={1100}
        modalProps={{
          destroyOnClose: true,
        }}
        visible={modalVisibleAddress}
        onVisibleChange={setModalVisibleAddress}
        submitter={{
          searchConfig: {
            submitText: '选择',
            resetText: '取消',
          },
        }}
        onFinish={async () => {
          if (Object.values(addressList).length === 0) {
            message.error('请选择信息');
            return false;
          }
          // baozi
          const address = {
            region: `${addressList.provinceName}${addressList.cityName}${addressList.districtName}`,
            shipRegionCode1: addressList.province,
            shipRegionCode2: addressList.city,
            shipRegionCode3: addressList.district,
            shipRegionName1: addressList.provinceName,
            shipRegionName2: addressList.cityName,
            shipRegionName3: addressList.districtName,
            shipStreet: addressList.receiptAddress,
            shipZip: addressList.receiptZipCode,
            consigneeName: addressList.recipientName,
            consigneeMobile: addressList.receiptMobilePhone,
            consigneeTel: addressList.receiptFixPhone,
            shipEmail: addressList.receiptEmail,
            shipRegionSapCode: addressList?.shipRegionSapCode,
          };
          setInfo({
            ...info,
            ...address,
          });
          form.setFieldsValue({
            ...address,
          });
          if (info?.adjustFreight == 0) {
            getTotal(address);
          }
          return true;
        }}
      >
        <SearchAddress
          customerCode={info.customerCode}
          onDbSave={(record) => dbSaveAddress(record)}
          onSelect={(record) => setAddressList(record)}
          rowkey={addressList.key}
        />
      </ModalForm>
      {/* 开票地址选择  */}
      <ModalForm
        title="地址选择"
        layout="horizontal"
        width={1100}
        visible={modalVisibleAddressInvoice}
        onVisibleChange={setModalVisibleAddressInvoice}
        modalProps={{
          destroyOnClose: true,
        }}
        submitter={{
          searchConfig: {
            submitText: '选择',
            resetText: '取消',
          },
        }}
        onFinish={async (values) => {
          console.log(values);
          if (Object.values(addressList).length === 0) {
            message.error('请选择信息');
            return false;
          }
          const invoiceAdd = {
            invoiceReceiver: addressList.recipientName,
            invoiceAddress: addressList.receiptAddress,
            invoiceZip: addressList.receiptZipCode,
            invoiceTel: addressList.receiptFixPhone,
            invoiceMobile: addressList.receiptMobilePhone,
            invoiceEmail: addressList.receiptEmail,
            invoiceReceiveRegion: `${addressList.provinceName}${addressList.cityName}${addressList.districtName}`,
            followMerchandise: addressList.followMerchandise == false ? 0 : 1,
            invoiceSapCode: addressList?.invoiceSapCode,
          };
          setInfo({
            ...info,
            ...invoiceAdd,
            invoiceCode: {
              provinceCode: addressList.province,
              cityCode: addressList.city,
              districtCode: addressList.district,
            },
          });
          form.setFieldsValue({
            ...invoiceAdd,
          });
          return true;
        }}
      >
        <SearchAddressInvoice
          customerCode={info.customerCode}
          onDbSave={(record) => dbSaveVatAddress(record)}
          onSelect={(record) => setAddressList(record)}
        />
      </ModalForm>
      {/* 选择开票信息 */}
      <ModalForm
        title="选择开票信息"
        layout="horizontal"
        width={1100}
        visible={modalVisibleInvice}
        onVisibleChange={setModalVisibleInvice}
        modalProps={{
          destroyOnClose: true,
        }}
        submitter={{
          searchConfig: {
            submitText: '选择',
            resetText: '取消',
          },
        }}
        onFinish={async (values) => {
          console.log(values);
          if (Object.values(invoiceList).length === 0) {
            message.error('请选择信息');
            return false;
          }
          setInfo({
            ...info,
            ...invoiceList,
          });
          form.setFieldsValue({
            ...invoiceList,
          });
          return true;
        }}
      >
        <SearchInvoice
          customerCode={info.customerCode}
          onDbSave={(record) => dbSaveVat(record)}
          onSelect={(record) => setInvoiceList(record)}
        />
      </ModalForm>
      {/* 设置运费分摊 */}
      <ModalForm
        title={<Dtitle title="设置运费分摊" subTitle="只可分摊一次" />}
        layout="horizontal"
        visible={modalVisibleFreight}
        onVisibleChange={setModalVisibleFreight}
        submitter={{
          searchConfig: {
            submitText: '确定',
            resetText: '取消',
          },
        }}
        onFinish={async (values) => {
          // const stringVal = values?.fixLine;
          // const q = info?.quotationLineRespVoPage?.list
          //   ?.filter((io: any) => stringVal?.split(',').some((ic: any) => io.index + 1 == ic))
          //   ?.map((iq: any) => iq.quotLineId)
          //   .toString();

          // info?.quotationLineRespVoPage?.list[
          //   (currentPage - 1) * currentPageSize + Number(values.fixLine) - 1
          // ].quotLineId
          const ppr = values?.method == 0 ? 0 : values?.fixLine;
          if (
            ppr != 0 &&
            info?.quotationLineRespVoPage?.list?.filter((io: any) =>
              ppr?.split(',')?.some((ic: any) => io.quotLineId == ic),
            ).length != ppr?.split(',')?.length
          ) {
            message.error('输入的值不匹配，请稍后再试');
            return false;
          }
          const par = {
            quotId: info.sid,
            quotLineIdList: values?.method == 0 ? [0] : [ppr],
          };
          const { errCode, errMsg } = await freightAvg(par);
          if (errCode === 200) {
            actRef?.current?.reload();
            message.success('提交成功');
          } else {
            message.error(errMsg);
            return false;
          }
          return true;
        }}
      >
        <p>请选择分摊方式:</p>
        <ProFormRadio.Group
          name="method"
          label=""
          initialValue={'0'}
          fieldProps={{
            onChange: (e) => {
              setSelectMethod(e.target.value);
            },
          }}
          options={[
            {
              label: '平均分摊',
              value: '0',
            },
            {
              label: '分摊到指定行',
              value: '1',
            },
          ]}
        />
        {selectMethod === '1' && (
          <ProFormText
            rules={[{ required: true, message: '请输入' }]}
            label={'输入指定报价行ID:'}
            name="fixLine"
            placeholder="请输入"
          />
        )}
        <p>Tips:分摊与行项目数量、体积、重量无关</p>
      </ModalForm>
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
    </div>
  );
};

// export default Edit;
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <Edit />
  </KeepAlive>
);
