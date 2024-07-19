/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  calSubTotal,
  checkOfferOrder,
  combineOfferOrder,
  createOfferOrder,
  createOfferOrderCsp,
  getBasicInformation,
  getItemList,
  offerDetail,
} from '@/services/InquirySheet/offerOrder';
import ProForm, { ModalForm } from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Card, Form, InputNumber, message, Modal, Space, Radio } from 'antd';
import moment from 'moment';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation, useModel, history } from 'umi';
import BasicInfo from './components/BasicInfo';
import InvoiceDeliverInfo from './components/InvoiceDeliverInfo';
import InvoiceInfo from './components/InvoiceInfo';
import PayInfo from './components/PayInfo';
import ReceiverInfo from './components/ReceiverInfo';
import SearchAddress from './components/SearchAddress';
import SearchInvoice from './components/SearchInvoice';
import './style.less';
import SearchAddressInvoice from './components/SearchAddressInvoice';
import { getByKeys } from '@/services/afterSales/utils';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  queryBillingInfo,
  queryInvoiceAddress,
  queryPayInfo,
  queryRecAddress,
} from '@/services/InquirySheet/utils';
import TotalDesc from './components/TotalDesc';
import { VList } from 'virtuallist-antd';

type OfferOrderProps = Record<string, any>;

const OfferOrder: React.FC<OfferOrderProps> = () => {
  const [form] = Form.useForm();
  const [forms] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const location = useLocation() as any;
  const {
    from = '',
    quotIdList = [],
    quotLineIdList = [],
  } = location?.state && (JSON.parse(location?.state) as any);
  // const from = "need"
  // const quotIdList = [380]
  // const quotLineIdList = [7123]

  const [info, setInfo] = useState<any>({});
  const [total, setTotal] = useState<any>({});
  const [idsData, setIdsData] = useState<any>([]);
  const [bizEnum, setBizEnum] = useState<any>({});
  const [canSubmit, setCanSubmit] = useState<any>(true);
  const [loadding, setLoadding] = useState<any>(false);
  const [mergeOrder, setMergeOrder] = useState<any>(true);
  const [custPurpose, setCustPurpose] = useState<any>('');
  const vComponents = useMemo(() => {
    // 使用VList 即可有虚拟列表的效果
    return VList({
      resetTopWhenDataChange: false,
      height: 1000, // 此值和scrollY值相同. 必传. (required).  same value for scrolly
    });
  }, []);
  const getTotal = async (address: any) => {
    let sCode1 = '';
    let sCode2 = '';
    if (address) {
      sCode1 = address.shipRegionCode1;
      sCode2 = address.shipRegionCode2;
    } else {
      (sCode1 = info?.receiverInfo?.provinceCode || info?.shipRegionCode1 || ''),
        (sCode2 = info?.receiverInfo?.cityCode || info?.shipRegionCode2 || '');
    }

    const par = {
      customerCode: info?.customerCode || '',
      shipRegionCode1: sCode1,
      shipRegionCode2: sCode2,
      sid: info.sid,
      freight: info.freight || 0,
      interFreight: info.interFreight || 0,
      tariff: info.tariff || 0,
      calSubTotalLineReqVoList: idsData.map((io: any) => ({
        sid: io.quotLineId,
        ...io,
      })),
      biddingCsp: info?.biddingCsp,
      custPurpose: info?.custPurpose,
    };
    if (par?.sid)
      await calSubTotal(par).then((res: any) => {
        const { data, errCode, errMsg } = res;
        // if (errCode === 200) {
        //   setTotal(data);
        //   //setDetails  行信息重新计算赋值   ///后端接口未完成状态带 待测试
        //   if (idsData?.length > 0) {
        //     const linesArray = idsData as any;
        //     for (let i = 0; i < linesArray.length; i++) {
        //       linesArray[i].totalAmount =
        //         data?.calSubTotalLineRespVoList[i]?.totalAmount || linesArray[i].totalAmount;
        //       linesArray[i].totalAmountNet =
        //         data?.calSubTotalLineRespVoList[i]?.totalAmountNet || linesArray[i].totalAmountNet;
        //       linesArray[i].totalDiscount =
        //         data?.calSubTotalLineRespVoList[i]?.totalDiscount || linesArray[i].totalDiscount;
        //       linesArray[i].freight =
        //         data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo?.lineFreight ||
        //         linesArray[i].freight;
        //       linesArray[i].interFreight =
        //         data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo?.interFreight ||
        //         linesArray[i].interFreight;
        //       linesArray[i].tariff =
        //         data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo?.tariff ||
        //         linesArray[i].tariff;
        //       linesArray[i].totalFreight =
        //         data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo?.totalFreight ||
        //         linesArray[i].totalFreight;
        //     }
        //     setIdsData(linesArray.concat());
        //     actionRef?.current?.reload();
        //   }
        //   setCanSubmit(true);
        // } else if (errCode == 100009) {
        //   setCanSubmit(false);
        //   message.error(errMsg);
        //   return false;
        // } else if (errCode == 300169) {
        //   setCanSubmit(false);
        //   message.error(errMsg);
        //   return false;
        // }
      });
  };

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
    },
    {
      title: '排序',
      dataIndex: 'lineNum',
      width: 100,
      fixed: 'left',
      render: (_, record: any) => {
        return (
          <InputNumber
            min={1}
            width={30}
            precision={0}
            value={record?.lineNum}
            onChange={(val: any) => {
              record.lineNum = val;
              setIdsData(
                idsData.map((io: any) => {
                  if (io.sid === record.sid) {
                    io = record;
                  }
                  return io;
                }),
              );
            }}
            onPressEnter={(e) => {
              e.preventDefault();
            }}
          />
        );
      },
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 100,
      fixed: 'left',
    },
    {
      title: '需求数量',
      dataIndex: 'reqQty',
      width: 100,
    },
    {
      title: '可转数量',
      dataIndex: 'canTransforQuotQty',
      width: 100,
      // render: (_, record: any) => {
      //   if (from === 'concat') {
      //     return record.qty - record.closeQty;
      //   } else {
      //     return record?.canTransforQuotQty;
      //   }
      // },
    },
    {
      title: '已转数量',
      dataIndex: 'closeQty',
      width: 100,
    },
    {
      title: '本次报价数量',
      width: 100,
      dataIndex: 'qty',
      render: (_, record: any) => {
        if (from === 'concat') {
          return record.qty;
        } else if (from === 'need') {
          return (
            <InputNumber
              step={record?.salesMoqIncrement}
              min={record.salesMoq || 1}
              max={
                record?.salesMoq - record?.canTransforQuotQty > 0
                  ? 10000000000000000000
                  : record.canTransforQuotQty
              }
              disabled={record?.bizStatus == 60 ? true : false}
              value={record.qty}
              onChange={(v) => {
                record.qty = v;
                if (
                  v > record.canTransforQuotQty &&
                  record?.canTransforQuotQty > record?.salesMoq
                ) {
                  return false;
                } else if (v < record?.salesMoq) {
                  return false;
                } else if (
                  v > record.canTransforQuotQty &&
                  record?.salesMoq - record?.canTransforQuotQty > 0 &&
                  (v - record?.salesMoq) % record?.salesMoqIncrement != 0
                ) {
                  return false;
                }
                // 总价计算联动逻辑
                getTotal();
              }}
              onInput={(val: any) => {
                if (
                  val > record.canTransforQuotQty &&
                  record?.canTransforQuotQty - record?.salesMoq >= 0
                ) {
                  message.error('数量不能大于可转数量');
                } else if (val < record?.salesMoq) {
                  message.error('数量不能小于最小起订量');
                } else if (
                  val > record.canTransforQuotQty &&
                  (val - record?.salesMoq) % record?.salesMoqIncrement != 0
                ) {
                  message.error('数量不符合最小起订量和最小起订增幅规则');
                }
              }}
              onPressEnter={(e) => {
                e.preventDefault();
              }}
            />
          );
        }
      },
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
      title: '成交价-含税',
      dataIndex: 'salesPrice',
      width: 100,
    },
    {
      title: '成交价-未税',
      dataIndex: 'salesPriceNet',
      width: 100,
    },
    {
      title: '小计-含税',
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
      title: '小计-未税',
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
      title: '小计-折扣',
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
      width: 100,
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
      render: (_, record: any) => bizEnum[record.bizStatus],
    },
    {
      title: '备货状态',
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
      title: 'SKU类型',
      dataIndex: 'skuType',
      width: 100,
      hideInTable: true,
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
      title: '关联需求号',
      dataIndex: 'inquiryCode',
      width: 180,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 100,
    },
  ];
  const [modalVisibleAddress, setModalVisibleAddress] = useState<boolean>(false);
  const [modalVisibleInvice, setModalVisibleInvice] = useState<boolean>(false);
  const [modalVisibleAddressInvoice, setModalVisibleAddressInvoice] = useState<any>(false);
  const [invoiceList, setInvoiceList] = useState<any>({});
  const [addressList, setAddressList] = useState<any>({});
  const { destroyCom } = useModel('tabSelect');
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  const reBack = () => {
    const fromTemp = JSON.parse(location.state).from || '';
    const lastPath = fromTemp === 'need' ? '/inquiry/lectotype' : '/inquiry/offer';
    destroyCom(lastPath, location.pathname);
  };
  const submit = async (values: any) => {
    // console.log(values, 'values');
    if (!values.consigneeMobile && !values.consigneeTel) {
      return message.error('请完善收货信息中的收货人手机，或收货人固话');
    }
    if (values.invoiceType == '1' && !values.invoiceMobile && !values.invoiceTel) {
      return message.error('请完善发票寄送信息中的收货人手机，或收货人固话');
    }
    // 需要判断是来自需求单还是报价单
    // setLoadding(true);
    if (from === 'concat') {
      const quotLineIdListSort = idsData.sort((a: { lineNum: any }, b: { lineNum: any }) => {
        return Number(a.lineNum) - Number(b.lineNum);
      });
      const quotLineArray = quotLineIdListSort.map((e) => e.quotLineId);
      const par = {
        quotIdList,
        quotLineIdList: quotLineArray,
        createQuotationReqVo: {
          quotType: custPurpose,
          customerCode: info.customerCode,
          quotValidDate: info.quotValidDate,
          vatCompanyName: values.invoiceTitle, //t抬头的值 单位
          ...info,
          invoiceInfoRespVo: {
            ...info.invoiceInfoRespVo,
            ...values,
            vatTaxNo: values.vatTaxNo,
            vatAddress: values.vatAddress,
            vatPhone: values.vatPhone,
            vatBankName: values.vatBankName,
            vatBankNo: values.vatBankNo,
            followMerchandise: values.followMerchandise || info?.followMerchandise,
            vatCompanyName: values.vatCompanyName || info.vatCompanyName || values.invoiceTitle,
            invoiceReceiveRegion: values.invoiceReceiveRegion,
          },
          ...values,
          // totalAmount: total.amount,
          // totalAmountNet: total.amountNet,

          goodsAmount: total?.goodsAmount || 0,
          freight: total?.calcFreightRespVo?.headFreight || 0,
          interFreight: total?.calcFreightRespVo?.interFreight || 0,
          tariff: total?.calcFreightRespVo?.tariff || 0,
          totalFreight: total?.calcFreightRespVo?.totalFreight || 0,
          amount: total?.amount || 0,
          amountNet: total?.amountNet || 0,
          totalDiscount: total?.totalDiscount || 0,

          contactCodeR3: values?.contactName?.key || info?.contactCodeR3 || '',
          contactName: values?.contactName?.label || info?.contactName || '',
          oppoValue: values?.oppoValue?.label || info?.oppoValue || '', //labelInValue
          oppoId: values?.oppoValue?.key || info?.oppoId || '', //labelInValue

          branchCompanyName: values?.company?.label || info?.branchCompanyName || '',
          branchCode: values?.company?.value || info?.branchCode || '',
        },
      };
      // await checkOfferOrder({ quotIdList, quotLineIdList: quotLineArray }).then(
      //   async (res1: any) => {
      //     // 校验
      //     if (res1.errCode === 200) {
      //       await combineOfferOrder(par).then((res: any) => {
      //         const { errCode, errMsg } = res;
      //         if (errCode === 200) {
      //           message.success('合并报价单成功');
      //           sessionStorage.removeItem('idsData');
      //           setLoadding(false);
      //           reBack();
      //           return;
      //         } else {
      //           message.error(errMsg);
      //           setLoadding(false);
      //           return false;
      //         }
      //       });
      //     } else {
      //       setLoadding(false);
      //       message.error(res1.errMsg);
      //     }
      //   },
      // );
    } else {
      // 询价转报价
      if (!canSubmit) {
        message.error('服务器运费接口异常，暂时无法提交');
        setLoadding(false);
        return;
      }
      const dateArry = idsData.map((ic: any) => moment(ic.quotValidDate));
      const params = {
        merge: 0,
        createQuotationReqVo: {
          quotValidDate: moment.min(dateArry).format('YYYY-MM-DD'), // 报价单有效期：取行行信息报价单有效期最早的(12,13 取12)
          ...info,
          ...values,
          // totalAmount: total.amount,
          // totalAmountNet: total.amountNet,
          quotType: custPurpose,
          goodsAmount: total?.goodsAmount || 0,
          freight: total?.calcFreightRespVo?.headFreight || 0,
          interFreight: total?.calcFreightRespVo?.interFreight || 0,
          tariff: total?.calcFreightRespVo?.tariff || 0,
          totalFreight: total?.calcFreightRespVo?.totalFreight || 0,
          amount: total?.amount || 0,
          amountNet: total?.amountNet || 0,
          totalDiscount: total?.totalDiscount || 0,

          contactCodeR3: values?.contactName?.key || info?.contactCodeR3 || '',
          contactName: values?.contactName?.label || info?.contactName || '',
          oppoValue: values?.oppoValue?.label || info?.oppoValue || '', //labelInValue
          oppoId: values?.oppoValue?.key || info?.oppoId || '', //labelInValue
          branchCompanyName: values?.company?.label || info?.branchCompanyName || '',
          branchCode: values?.company?.value || info?.branchCode || '',
          shipRegionSapCode: info?.shipRegionSapCode,
          // csp 报价单拿新增三个参数
          inquiryChannel: info?.inquiryChannel,
          sourceInquiryId: info?.sourceInquiryId,
          biddingCsp: info?.biddingCsp,

          invoiceInfoRespVo: {
            ...info,
            ...values,
            vatCompanyName: values?.vatCompanyName || info?.vatCompanyName || values?.invoiceTitle,
            payerCustomerAccount: info?.payerCustomerAccount,
            invoiceSapCode: info?.invoiceSapCode,
            followMerchandise: values.followMerchandise || info?.followMerchandise,
          },
        },
        createQuotationReqVoList: idsData?.map((io: any) => ({
          quotValidDate: moment.min(dateArry).format('YYYY-MM-DD'),
          reqUom: 'PK',
          ...io,
          deliveryDate: `${io.deliveryDate} 00:00:00`,
        })),
      };

      // 区分csp报价单和普通报价单
      const urlOffer = info?.biddingCsp ? createOfferOrderCsp : createOfferOrder;
      if (!info?.biddingCsp && mergeOrder) {
        Modal.confirm({
          title: '是否需要合并操作',
          icon: <ExclamationCircleOutlined />,
          content: (
            <Form form={forms} name="control-hooks" initialValues={{ merge: 0 }}>
              <Form.Item name="merge" rules={[{ required: true, message: '此项必填' }]}>
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          ),
          async onOk() {
            const resForm = await forms.validateFields();
            const { errCode, errMsg } = await urlOffer({
              ...params,
              ...resForm,
            });
            // if (errCode === 200) {
            //   message.success('保存成功！');
            //   setLoadding(false);
            //   reBack();
            //   return;
            // } else {
            //   setLoadding(false);
            //   message.error(`${errMsg}`);
            //   return false;
            // }
          },
        });
      } else {
        // const { errCode, errMsg } = await urlOffer(params);
        // if (errCode === 200) {
        //   message.success('保存成功！');
        //   setLoadding(false);
        //   reBack();
        //   return;
        // } else {
        //   setLoadding(false);
        //   message.error(`${errMsg}`);
        //   return false;
        // }
      }
    }
  };

  useEffect(() => {
    if (from === 'concat') {
      // 合并报价
      const lineData = sessionStorage.getItem('idsData');
      const lData = lineData && JSON.parse(lineData);
      // offerDetail(quotIdList[0]).then(async (res) => {
      //   const { data, errCode } = res;
      //   if (errCode === 200) {
      //     // 默认 queryPayInfo
      //     let defaultPay = {} as any;
      //     await queryPayInfo({ customerCode: data?.customerCode }).then((respay: any) => {
      //       if (respay.data) {
      //         defaultPay = {
      //           payTypeCust: respay?.data?.type,
      //         };
      //       }
      //     });
      //     setInfo({
      //       ...defaultPay,
      //       ...data,
      //       company: { label: data?.branchCompanyName, value: data?.branchCode } as any,
      //     });
      //     // const lineDataNew = lData.map((io: any) => ({
      //     //   ...io,
      //     //   sid: io.quotLineId,
      //     //   canTransforQuotQty: io.qty - io.closeQty,
      //     //   qty: io.qty - io.closeQty,
      //     //   tr: io.qty - io.closeQty,
      //     // }));
      //     // console.log(lineDataNew);

      //     lData.forEach((io: any) => {
      //       (io.sid = io.quotLineId),
      //         (io.canTransforQuotQty = io.qty - io.closeQty),
      //         (io.qty = io.qty - io.closeQty),
      //         (io.tr = io.qty - io.closeQty);
      //     });
      //     const par = {
      //       customerCode: data?.customerCode || '',
      //       shipRegionCode1: data?.shipRegionCode1 || '',
      //       shipRegionCode2: data?.shipRegionCode2 || '',
      //       sid: data.sid,
      //       freight: data.freight || 0,
      //       interFreight: data.interFreight || 0,
      //       tariff: data.tariff || 0,
      //       calSubTotalLineReqVoList: lData,
      //       biddingCsp: data?.biddingCsp,
      //       custPurpose: data?.custPurpose,
      //     };
      //     console.log(data, '1111');
      //     if (lData.length > 0) {
      //       calSubTotal(par).then(async (res1: any) => {
      //         if (res1?.errCode === 200) {
      //           if (lData?.length > 0) {
      //             const linesArray = lData as any;
      //             for (let i = 0; i < linesArray.length; i++) {
      //               linesArray[i].totalAmount =
      //                 res1?.data?.calSubTotalLineRespVoList[i]?.totalAmount ||
      //                 linesArray[i].totalAmount;
      //               linesArray[i].totalAmountNet =
      //                 res1?.data?.calSubTotalLineRespVoList[i]?.totalAmountNet ||
      //                 linesArray[i].totalAmountNet;
      //               linesArray[i].totalDiscount =
      //                 res1?.data?.calSubTotalLineRespVoList[i]?.totalDiscount ||
      //                 linesArray[i].totalDiscount;
      //               linesArray[i].freight =
      //                 res1?.data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo?.lineFreight ||
      //                 linesArray[i].freight;
      //               linesArray[i].interFreight =
      //                 res1?.data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo?.interFreight ||
      //                 linesArray[i].interFreight;
      //               linesArray[i].tariff =
      //                 res1?.data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo?.tariff ||
      //                 linesArray[i].tariff;
      //               linesArray[i].totalFreight =
      //                 res1?.data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo?.totalFreight ||
      //                 linesArray[i].totalFreight;
      //             }
      //             setIdsData(linesArray.concat());
      //           }
      //           setTotal(res1?.data);
      //           setCanSubmit(true);
      //         } else if (errCode == 100009) {
      //           setCanSubmit(false);
      //           message.error(res1?.errMsg);
      //           return false;
      //         } else if (errCode == 300169) {
      //           setCanSubmit(false);
      //           message.error(res1?.errMsg);
      //           return false;
      //         }
      //       });
      //     }
      //   }
      // });
    } else if (from === 'need') {
      // 需求单询价转报价
      let newInfo = {} as any;
      // getBasicInformation({ sid: quotIdList[0] }).then(async (res: any) => {
      //   const { data, errCode, errMsg } = res;
      //   if (errCode === 200) {
      //     if (!data.mergePop) {
      //       setMergeOrder(false);
      //     }
      //     newInfo = data;
      //     setCustPurpose(newInfo?.custPurpose);
      //     //  以下默认 crm的数据
      //     // 默认收货信息
      //     let defaultRecive = {} as any;
      //     queryRecAddress({ customerCode: data?.customerCode }).then((resrecive: any) => {
      //       if (resrecive?.errCode === 200) {
      //         if (resrecive?.data?.dataList.length > 0) {
      //           const defAdr = resrecive?.data?.dataList?.filter((io: any) => io.defaultAddr);
      //           let defAdrObj = [] as any;
      //           if (defAdr.length > 0) {
      //             defAdrObj = defAdr;
      //           } else {
      //             defAdrObj = resrecive?.data?.dataList;
      //           }
      //           defaultRecive = {
      //             shipRegionCode1: defAdrObj[0]?.province,
      //             shipRegionCode2: defAdrObj[0]?.city,
      //             shipRegionCode3: defAdrObj[0]?.district,
      //             shipRegionName1: defAdrObj[0]?.provinceName,
      //             shipRegionName2: defAdrObj[0]?.cityName,
      //             shipRegionName3: defAdrObj[0]?.districtName,
      //             shipStreet: defAdrObj[0]?.receiptAddress,
      //             shipZip: defAdrObj[0]?.receiptZipCode,
      //             consigneeName: defAdrObj[0]?.recipientName,
      //             consigneeMobile: defAdrObj[0]?.receiptMobilePhone,
      //             consigneeTel: defAdrObj[0]?.receiptFixPhone,
      //             shipEmail: defAdrObj[0]?.receiptEmail,
      //             shipRegionSapCode: defAdrObj[0]?.sapCode,
      //           };
      //         }
      //       }
      //     });
      //     // 默认 queryPayInfo
      //     let defaultPay = {} as any;
      //     await queryPayInfo({ customerCode: data?.customerCode }).then((respay: any) => {
      //       if (respay.data) {
      //         defaultPay = {
      //           paymentTerm: (respay?.data?.type && respay?.data?.type?.toString()) || '',
      //           paymentMethod: respay?.data?.code || '',
      //           payTypeCust: respay?.data?.type,
      //         };
      //       }
      //     });
      //     // 默认开票盘信息
      //     let ppinvoice = {} as any;
      //     await queryBillingInfo({ customerCode: data?.customerCode }).then((res1: any) => {
      //       if (res1.errCode === 200) {
      //         if (res1?.data?.dataList?.length > 0) {
      //           let getInvoiceType: any = '3';
      //           if (res1?.data?.dataList[0]?.invoiceType == '') {
      //             getInvoiceType = '3';
      //           } else {
      //             const invoiceTypeStr = res1?.data?.dataList[0]?.invoiceType.split(',').sort();
      //             if (invoiceTypeStr.length <= 1)
      //               getInvoiceType = res1?.data?.dataList[0]?.invoiceType;
      //             else getInvoiceType = invoiceTypeStr[0];
      //           }
      //           ppinvoice = {
      //             invoiceType: getInvoiceType,
      //             invoiceTitle: res1?.data?.dataList[0].customerName,
      //             vatTaxNo: res1?.data?.dataList[0].taxNumber,
      //             vatBankName: res1?.data?.dataList[0].bankName,
      //             vatBankNo: res1?.data?.dataList[0].bankAccount,
      //             vatAddress: res1?.data?.dataList[0].registerAddress,
      //             vatPhone: res1?.data?.dataList[0].registerTelephone,
      //             payerCustomerAccount: res1?.data?.dataList[0].payerCustomerAccount,
      //           };
      //         } else {
      //           ppinvoice = {
      //             invoiceType: '3',
      //           };
      //         }
      //       }
      //     });
      //     // 默认发票寄送信息
      //     let defaultVatAddress = {} as any;
      //     queryInvoiceAddress({ customerCode: data?.customerCode }).then((resvat: any) => {
      //       if (resvat?.errCode === 200) {
      //         if (resvat?.data?.dataList?.length > 0) {
      //           const defInvoAdr = resvat?.data?.dataList?.filter((io: any) => io.defaultAddr);
      //           let defInvoAdrObj = [] as any;
      //           if (defInvoAdr.length > 0) {
      //             defInvoAdrObj = defInvoAdr;
      //           } else {
      //             defInvoAdrObj = resvat?.data?.dataList;
      //           }
      //           defaultVatAddress = {
      //             invoiceReceiver: defInvoAdrObj[0].recipientName,
      //             invoiceAddress: defInvoAdrObj[0].receiptAddress,
      //             invoiceZip: defInvoAdrObj[0].receiptZipCode,
      //             invoiceTel: defInvoAdrObj[0].receiptFixPhone,
      //             invoiceMobile: defInvoAdrObj[0].receiptMobilePhone,
      //             invoiceEmail: defInvoAdrObj[0].receiptEmail,
      //             invoiceReceiveRegion: `${defInvoAdrObj[0].provinceName}${defInvoAdrObj[0].cityName}${defInvoAdrObj[0].districtName}`,
      //             followMerchandise: defInvoAdrObj[0].followMerchandise == false ? 0 : 1,
      //             invoiceSapCode: defInvoAdrObj[0]?.sapCode,
      //             cityCode: defInvoAdrObj[0]?.city,
      //             provinceCode: defInvoAdrObj[0]?.province,
      //             districtCode: defInvoAdrObj[0]?.district,
      //           };
      //         }
      //       }
      //     });
      //     setTimeout(() => {
      //       form.setFieldsValue({
      //         ...ppinvoice,
      //         ...defaultPay,
      //         ...defaultRecive,
      //         ...defaultVatAddress,
      //       });
      //       setInfo({
      //         ...data,
      //         // TODO:  后端无返回值，默认0
      //         ...ppinvoice,
      //         ...defaultPay,
      //         ...defaultRecive,
      //         ...defaultVatAddress,
      //         channel: 10,
      //         freight: 0,
      //         interFreight: 0,
      //         tariff: 0,
      //         company: { label: data?.branchCompanyName, value: data?.branchCode } as any,
      //       });
      //     }, 200);

      //     await getItemList({ sidList: quotLineIdList }).then(async (resqw: any) => {
      //       if (resqw?.errCode === 200) {
      //         const flg = resqw?.data.some((e) => e.mergePop);
      //         if (!flg) {
      //           setMergeOrder(false);
      //         }

      //         const newlist = resqw?.data.map((io: any) => ({
      //           ...io,
      //           qty: io.canQuoteQty || 0, //默认1 接口无返回情况
      //           canTransforQuotQty: io.canQuoteQty,
      //           closeQty: io.quoteQty,
      //           totalAmount: io.totalAmount,
      //           totalAmountNet: io.totalAmountNet,
      //           tariff: io.tariffPrice,
      //           customerSku: io.reqCustomerSku,
      //           poItemNo: io.reqPoItemNo,
      //           supplierCode: io.supplierSku,
      //           deliveryDate: io.expectDate,
      //           // quotLineId: io.inquiryCode,
      //           inqLnTargetId: io.sid,
      //           remark: io.skuRemark || '',
      //           quotValidDate: io.quoteValidDate, // 后端不一致 两人少了个e
      //           inquiryLineId: io.sid, //行id
      //           inquiryId: io.inquiryId, //行单id
      //         }));
      //         //覆盖运费
      //         const par = {
      //           customerCode: newInfo?.customerCode || '',
      //           shipRegionCode1: defaultRecive?.shipRegionCode1 || '',
      //           shipRegionCode2: defaultRecive?.shipRegionCode2 || '',
      //           sid: newInfo.sid,
      //           freight: newInfo.freight || 0,
      //           interFreight: newInfo.interFreight || 0,
      //           tariff: newInfo.tariff || 0,
      //           calSubTotalLineReqVoList: newlist,
      //           biddingCsp: newInfo?.biddingCsp,
      //           custPurpose: newInfo.custPurpose,
      //         };
      //         if (newlist.length > 0 && par?.sid) {
      //           await calSubTotal(par).then((res1: any) => {
      //             // const { data1, errCode1, errMsg1 } = res1;
      //             if (errCode === 200) {
      //               if (newlist?.length > 0) {
      //                 const linesArray = newlist as any;
      //                 for (let i = 0; i < linesArray.length; i++) {
      //                   linesArray[i].totalAmount =
      //                     res1.data?.calSubTotalLineRespVoList[i]?.totalAmount ||
      //                     linesArray[i].totalAmount;
      //                   linesArray[i].totalAmountNet =
      //                     res1.data?.calSubTotalLineRespVoList[i]?.totalAmountNet ||
      //                     linesArray[i].totalAmountNet;
      //                   linesArray[i].totalDiscount =
      //                     res1.data?.calSubTotalLineRespVoList[i]?.totalDiscount ||
      //                     linesArray[i].totalDiscount;
      //                   linesArray[i].freight =
      //                     res1.data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo?.lineFreight ||
      //                     linesArray[i].freight;
      //                   linesArray[i].interFreight =
      //                     res1.data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo
      //                       ?.interFreight || linesArray[i].interFreight;
      //                   linesArray[i].tariff =
      //                     res1.data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo?.tariff ||
      //                     linesArray[i].tariff;
      //                   linesArray[i].totalFreight =
      //                     res1.data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo
      //                       ?.totalFreight || linesArray[i].totalFreight;
      //                 }
      //                 // setTimeout(() => {
      //                 setIdsData(linesArray.concat());
      //                 setTotal(res1.data);
      //                 // }, 500)
      //               }
      //               setCanSubmit(true);
      //             } else if (res1?.errCode == 100009) {
      //               setCanSubmit(false);
      //               message.error(res1?.errMsg);
      //               return false;
      //             } else if (res1?.errCode == 300169) {
      //               setCanSubmit(false);
      //               message.error(res1?.errMsg);
      //               return false;
      //             }
      //           });
      //         }
      //       } else {
      //         message.error(resqw?.errMsg);
      //       }
      //     });
      //   } else {
      //     message.error(errMsg);
      //   }
      // });
    }

    //c产品业务状态
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
  }, [from]);

  const onMethodChange = (val: any) => {
    setInfo({
      ...info,
      paymentMethod: val[0].value || '',
    });
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
    getTotal(address);
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
  const handleOk = async () => {
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
    setModalVisibleAddress(false);
    getTotal(address);
    return true;
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
                  <Button type="primary" htmlType="submit" loading={loadding}>
                    保存
                  </Button>
                  <Button onClick={reBack}>取消</Button>
                </Space>
              </div>
            );
          },
        }}
      >
        <Card className="head-title-wrap">
          <p className="head-title">{info?.biddingCsp ? '新增CSP报价单' : '新增报价单'}</p>
          <Space>
            <p>清单条目：{quotLineIdList?.length}</p>
          </Space>
        </Card>
        <div className="editContentCol">
          <Card title="基本信息" bordered={false} id="basic">
            {info.sid && <BasicInfo info={info} type="offerOrder" isCsp={info?.biddingCsp} />}
          </Card>
          <Card
            title={
              <div>
                收货信息{' '}
                <span style={{ color: '#cd0f0f', fontSize: '12px', fontWeight: 'normal' }}>
                  （请确保收货地区包含省市信息，或重新选择收货信息）
                </span>
              </div>
            }
            bordered={false}
            id="receiver"
          >
            {info.sid && (
              <ReceiverInfo
                info={info}
                type="offerOrder"
                isCsp={info?.biddingCsp}
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
                isCsp={info?.biddingCsp}
                onMethodChange={(newArrayValue: any) => onMethodChange(newArrayValue)}
              />
            )}
          </Card>
          <Card title="开票信息" bordered={false} id="invoice">
            {info.sid && (
              <InvoiceInfo
                info={info?.invoiceInfoRespVo}
                isCsp={info?.biddingCsp}
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
                onModal={() => {
                  setModalVisibleAddressInvoice(true);
                  setAddressList([]);
                }}
              />
            )}
          </Card>
          <Card title="报价清单明细" bordered={false} className="order-msg" id="shopDetail">
            {total && <TotalDesc totalDesc={total} />}
            <div className="cust-table">
              {total && (
                <ProTable<any>
                  bordered
                  columns={columns}
                  scroll={{ x: 200, y: 500 }}
                  style={{ padding: '20px 0', background: '#fff' }}
                  tableStyle={{ paddingTop: '10px' }}
                  size="small"
                  rowKey={'quotLineId'}
                  options={{ reload: false, density: false }}
                  search={false}
                  pagination={false}
                  dateFormatter="string"
                  dataSource={idsData}
                  actionRef={actionRef}
                  components={vComponents}
                  // request={() => {
                  //   // params, sorter, filter
                  //   return Promise.resolve({
                  //     data: idsData,
                  //     success: true,
                  //   });
                  // }}
                />
              )}
            </div>
          </Card>
        </div>
      </ProForm>
      {/* 地址选择 带合并 */}
      <Modal
        title="地址选择"
        width={1500}
        onCancel={() => setModalVisibleAddress(false)}
        visible={modalVisibleAddress}
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={() => setModalVisibleAddress(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            选择
          </Button>,
        ]}
      >
        <SearchAddress
          customerCode={info.customerCode}
          onDbSave={(record) => dbSaveAddress(record)}
          onSelect={(record) => setAddressList(record)}
        />
      </Modal>
      {/* 开票地址选择  */}
      <ModalForm
        title="地址选择"
        layout="horizontal"
        width={1500}
        visible={modalVisibleAddressInvoice}
        onVisibleChange={setModalVisibleAddressInvoice}
        submitter={{
          searchConfig: {
            submitText: '选择',
            resetText: '取消',
          },
        }}
        modalProps={{
          destroyOnClose: true,
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
            provinceCode: addressList.province,
            cityCode: addressList.city,
            districtCode: addressList.district,
          };
          setInfo({
            ...info,
            ...invoiceAdd,
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
        width={1500}
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
    </div>
  );
};
// export default OfferOrder;
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <OfferOrder />
  </KeepAlive>
);
