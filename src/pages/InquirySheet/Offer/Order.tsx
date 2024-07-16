/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-param-reassign */
import {
  // calculationUpdate,
  calSubQuotationTotal,
  createTransferOrder,
  // queryAmountRang,
  transferSecondOrder,
  checkDuplicatePo,
} from '@/services/InquirySheet';
import moment from 'moment';
import {
  checkBond,
  getSelectList,
  queryRecAddress,
  calculationAmount,
  queryPayInfo,
} from '@/services/InquirySheet/utils';
import { getEnv } from '@/services/utils';
import ProForm, { ModalForm } from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  Anchor,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Space,
  Upload,
  Spin,
  DatePicker,
} from 'antd';
import Cookies from 'js-cookie';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useModel, history } from 'umi';
import BasicInfo from './components/BasicInfo';
import InvoiceDeliverInfo from './components/InvoiceDeliverInfo';
import InvoiceInfo from './components/InvoiceInfo';
import PayInfo from './components/PayInfo';
import ReceiverInfo from './components/ReceiverInfo';
import SearchAddress from './components/SearchAddress';
import SearchAddressInvoice from './components/SearchAddressInvoice';
import SearchInvoice from './components/SearchInvoice';
import TotalDesc from './components/TotalDesc';
import { menuLink } from './const';
import MyModal from './components/MyModal';
import './style.less';

const { Link } = Anchor;

type TableListItem = Record<any, any>;

const Order: React.FC<any> = () => {
  const location = useLocation() as any;
  const [form] = Form.useForm();
  const [load, setLoad]: any = useState(false);
  const actionRef = useRef<ActionType>();
  const { quotLineIdList = [] as any, quotIdList = [] as any } =
    location?.state && (JSON.parse(location?.state) as any);
  const [info, setInfo] = useState<any>({});
  const [total, setTotal] = useState<any>({}); // ?头上的表格相关价格信息
  const [loadding, setLoadding] = useState<any>(false);
  const modalRef: any = useRef<ActionType>();
  const { destroyCom } = useModel('tabSelect');
  const [codeErrorMsg, setCodeErrorMsg] = useState<any>('');
  // ? 调增数量
  const getTotal = async (address?: any) => {
    let sCode1 = '';
    let sCode2 = '';
    if (address) {
      sCode1 = address.province;
      sCode2 = address.cityCode;
    }

    if (form.getFieldValue('provinceCode')) {
      sCode1 = form.getFieldValue('provinceCode');
      sCode2 = form.getFieldValue('cityCode');
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
      quotType: info.quotType,
      calSubTotalLineReqVoList: info?.lines?.map((io: any) => ({
        ...io,
        sid: io.quotationLineId,
        salesPrice: io.salesPrice || 0,
        salesPriceNet: io.salesPriceNet || 0,
        freight: io.freight || 0,
        interFreight: io.interFreight || 0,
        tariff: io.tariff || 0,
        dropShipFlag: io?.dropShipFlag == true ? 1 : 0,
      })),
    };
    // ?根据报价行id计算报价小计相关信息
    await calSubQuotationTotal(par).then(async (res: any) => {
      const { data, errCode } = res;
      if (errCode === 200) {
        setTotal(data);
        //setDetails  行信息重新计算赋值   ///后端接口未完成状态带 待测试
        // console.log(info.lines, '???');
        if (info.lines?.length > 0) {
          const linesArray = info.lines as any;
          for (let i = 0; i < linesArray.length; i++) {
            linesArray[i].totalAmount =
              data?.calSubTotalLineRespVoList[i]?.totalAmount || linesArray[i].totalAmount; //?小计含税
            linesArray[i].totalAmountNet =
              data?.calSubTotalLineRespVoList[i]?.totalAmountNet || linesArray[i].totalAmountNet; //?小计未税
            // linesArray[i].salesPrice =
            //   data?.calSubTotalLineRespVoList[i]?.salesPrice || linesArray[i].salesPrice; //?成交价含税
            // linesArray[i].salesPriceNet =
            //   data?.calSubTotalLineRespVoList[i]?.salesPriceNet || linesArray[i].salesPriceNet; //?成交价未税
            linesArray[i].totalDiscount =
              data?.calSubTotalLineRespVoList[i]?.totalDiscount || linesArray[i].totalDiscount; //?小计折扣
            linesArray[i].freight =
              data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo?.lineFreight ||
              linesArray[i].freight; //?运费
            linesArray[i].interFreight =
              data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo?.interFreight ||
              linesArray[i].interFreight; //?行国际运费
            linesArray[i].tariff =
              data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo?.tariff || linesArray[i].tariff; //?关税
            linesArray[i].totalFreight =
              data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo?.totalFreight ||
              linesArray[i].totalFreight; //?
          }
          // let mList: any;
          //? 获取调整的最大最小值的参数(数组)
          // const amountList = info?.lines.map((io: any) => ({
          //   qty: io.qty,
          //   quotationLineId: io.quotationLineId,
          //   quotationNo: io.quotationNo,
          // }));
          // //? 获取调整的最大最小值
          // await queryAmountRang({ amountList }).then((resamount: any) => {
          //   if (resamount?.errCode == 200) {
          //     mList = linesArray.map((io: any) => {
          //       for (let i = 0; i < resamount?.data?.dataList.length; i++) {
          //         if (io.quotationLineId == resamount?.data?.dataList[i].quotationLineId) {
          //           io.totalAmountMin = resamount?.data?.dataList[i].totalAmountMin;
          //           io.totalAmountMax = resamount?.data?.dataList[i].totalAmountMax;
          //           return io;
          //         }
          //       }
          //     });
          //     return mList;
          //   } else {
          //     message.error(resamount?.errMsg);
          //   }
          // });

          // await
          // const calcUpdateParams = {
          //   goodsAmount: total?.goodsAmount,
          //   amount: total?.amount,
          //   amountNet: total?.amountNet,
          //   totalDiscount: total?.totalDiscount,
          //   freight: total?.calcFreightRespVo?.headFreight,
          //   interFreight: total?.calcFreightRespVo?.interFreight,
          //   totalFreight: total?.calcFreightRespVo?.totalFreight,
          //   tariff: total?.calcFreightRespVo?.tariff,
          //   quotCode: info?.quotCode,
          //   // gpRate: 暂无
          //   lines: mList,
          // };
          // ? 获取最新的小计含税的金额信息，和小计未税的金额信息，并将其替换
          // await calculationUpdate(calcUpdateParams).then(async (rescalc: any) => {
          //   if (rescalc.errCode == 200) {
          //     mList?.map((io: any) => {
          //       for (let i = 0; i < rescalc?.data?.calSubTotalLineRespVoList.length; i++) {
          //         if (io.quotationLineId == rescalc?.data?.calSubTotalLineRespVoList[i].sid) {
          //           io.totalAmount = rescalc?.data?.calSubTotalLineRespVoList[i].totalAmount;
          //           io.totalAmountNet = rescalc?.data?.calSubTotalLineRespVoList[i].totalAmountNet;
          //           return io;
          //         }
          //       }
          //     });
          //   }
          // });
          if (address) {
            setInfo({
              ...info,
              receiverInfo: {
                ...info.invoiceInfo,
                ...address,
              },
              lines: linesArray,
            });
          } else {
            setInfo({
              ...info,
              lines: linesArray,
            });
          }

          // actionRef?.current?.reload();
        }
      }
    });
  };
  // ?小计含税计算
  // const refreshAmount = async () => {
  //   const calcUpdateParams = {
  //     goodsAmount: total?.goodsAmount,
  //     amount: total?.amount,
  //     amountNet: total?.amountNet,
  //     totalDiscount: total?.totalDiscount,
  //     freight: total?.calcFreightRespVo?.headFreight,
  //     interFreight: total?.calcFreightRespVo?.interFreight,
  //     totalFreight: total?.calcFreightRespVo?.totalFreight,
  //     tariff: total?.calcFreightRespVo?.tariff,
  //     quotCode: info?.quotCode,
  //     // gpRate: 暂无
  //     lines: info?.lines,
  //   };
  //   // ?获取最新的金额信息
  //   await calculationUpdate(calcUpdateParams).then(async (rescalc: any) => {
  //     if (rescalc?.errCode == 200) {
  //       console.log(rescalc, 'rescalc');
  //       let mList;
  //       const amountList = info?.lines.map((io: any) => ({
  //         qty: io.qty,
  //         quotationLineId: io.quotationLineId,
  //         quotationNo: io.quotationNo,
  //       }));
  //       await queryAmountRang({ amountList }).then((resamount: any) => {
  //         if (resamount?.errCode == 200) {
  //           mList = rescalc?.data?.calSubTotalLineRespVoList?.map((io: any) => {
  //             for (let i = 0; i < resamount?.data?.dataList.length; i++) {
  //               if (io.quotationLineId == resamount?.data?.dataList[i].quotationLineId) {
  //                 io.totalAmountMin = resamount?.data?.dataList[i].totalAmountMin;
  //                 io.totalAmountMax = resamount?.data?.dataList[i].totalAmountMax;
  //                 return io;
  //               }
  //             }
  //           });
  //           return mList;
  //         } else {
  //           message.error(resamount?.errMsg);
  //         }
  //       });
  //       // 刷数据
  //       setInfo({
  //         ...info,
  //         lines: mList,
  //       });
  //       setTotal({
  //         goodsAmount: rescalc?.data?.goodsAmount,
  //         amount: rescalc?.data?.amount,
  //         amountNet: rescalc?.data?.amountNet,
  //         totalDiscount: rescalc?.data?.totalDiscount,
  //         calcFreightRespVo: {
  //           headFreight: rescalc?.data?.calcFreightRespVo?.headFreight,
  //           totalFreight: rescalc?.data?.calcFreightRespVo?.totalFreight,
  //           interFreight: rescalc?.data?.calcFreightRespVo?.interFreight,
  //           tariff: rescalc?.data?.calcFreightRespVo?.tariff,
  //         },
  //       });
  //     } else {
  //       message.error(rescalc?.errMsg);
  //     }
  //   });
  // };
  // ? 小计未税和一些调用这个函数的计算与联动
  const reTotalAmountNet = async (record: any, val: any, type: number) => {
    // console.log(record, 'record', val);
    const params = {
      //?参数
      sourceType: 1, //?请求类型 1. 转订单 2 csr
      freight: total.calcFreightRespVo?.headFreight || 0, //?头运费
      interFreight: total?.calcFreightRespVo?.interFreight || 0, //?国际运费
      discountAmount: total?.totalDiscount || 0, //?折扣总计
      goodsAmount: total?.goodsAmount || 0, //?货品总计
      totalFreight: total?.calcFreightRespVo?.totalFreight || 0, //?总运费
      tariff: total?.calcFreightRespVo?.tariff || 0, //?关税
      pricingMethod: info?.pricingMethod, //计价方式
      //? orderNo:'' CSR审核订单的时候需要订单号
      //?行信息
      line: {
        qty: record?.qty, //?本次转订单数量
        quotationLineId: record?.quotationLineId, //?单据行id
        quotationNo: record?.quotationNo, //?报价单号
        type: type, //?请求计算字段类型 1.成交价含税 2.成交价未税,3.小计含税,小计未税
        listTotalAmount: record.totalAmount, //?把上一次的小计含税给后端
        price: val, //?请求字段类型对应的价格
        totalDiscount: record?.totalDiscount, //?行里面的申请折扣
      },
    };
    const res = await calculationAmount(params); //?联动接口
    // console.log(res, 'res');
    if (res.errCode === 200) {
      // 找到要联动的三项（成交价含税成交价未税小计含税）并修改自己（小计未税）
      const linesArray = info.lines.map((item: any) => {
        if (item.quotationLineId === record.quotationLineId) {
          return {
            ...item,
            salesPrice: res?.data?.lines?.amountVO?.salesPrice, //?成交价含税
            salesPriceNet: res?.data?.lines?.amountVO?.salesPriceNet, //?成交价未税
            totalAmount: res?.data?.lines?.amountVO?.totalAmount, //?小计含税
            totalAmountNet: res?.data?.lines?.amountVO?.totalAmountNet, //?小计未税
            totalDiscount: res?.data?.lines?.amountVO?.totalDiscount, //?小计折扣
          };
        } else {
          return item;
        }
      });
      setTotal({
        ...total,
        goodsAmount: res?.data?.goodsAmount, //?联动货品金额合计含税   123
        amountNet: res?.data?.amountNet, //?联动总计金额未税
        calcFreightRespVo: res?.data?.calcFreightRespVo, //?头运费,国际运费,关税,运费总计
        amount: res?.data?.amount, //?联动总计金额含税
        totalDiscount: res?.data?.discountAmount, //?联动折扣总计
      });
      setInfo({
        ...info,
        lines: linesArray,
      });
      // actionRef?.current?.reload();
    } else {
      message.error(res.errMsg);
    }
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
              setInfo({
                ...info,
                lines: info?.lines?.map((io: any) => {
                  if (io.quotationLineId === record.quotationLineId) {
                    io = record;
                  }
                  return io;
                }),
              });
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
      dataIndex: 'transQty',
      width: 100,
    },
    {
      title: '已转数量',
      dataIndex: 'closeQty',
      width: 100,
    },
    {
      title: '本次转订单数量',
      width: 100,
      dataIndex: 'qty',
      render: (_, record: any) => {
        // 是否运费调整过(根据此字段判断商品明细是否可以修改转订单数量).
        if (info?.adjustFreight == 0) {
          return (
            <InputNumber
              min={record.salesMoq || 0}
              max={record.transQty ? record.transQty : 0}
              defaultValue={record.qty}
              disabled={record.qty > record.transQty || record?.bizStatus == 60 ? true : false}
              onChange={(v: any) => {
                record.qty = v;
                if (v > record.transQty) {
                  return false;
                } else if (v < record?.salesMoq) {
                  return false;
                }
                // 共计联动计算
                setInfo({
                  ...info,
                  lines: info?.lines?.map((io: any) => {
                    if (io.quotationLineId === record.quotationLineId) {
                      io = record;
                    }
                    return io;
                  }),
                });
                getTotal();
                // if (record.qty == record.transQty) {123
                //   record.qty = record.transQty;
                //   message.error('转订单数量不能大于可转数量');
                //   return false;
                // } else if (record?.salesMoq == record.qty) {
                //   message.error('转订单数量不能小于最小起订量');
                //   return false;
                // }
                // else {
                // record.qty = v;
                // setInfo({
                //   ...info,
                //   lines: info?.lines?.map((io: any) => {
                //     if (io.quotationLineId === record.quotationLineId) {
                //       io = record;
                //     }
                //     return io;
                //   }),
                // });
                // getTotal();
                // }
              }}
              onInput={(val: any) => {
                if (val > record.transQty) {
                  message.error('转订单数量不能大于可转数量');
                } else if (val < record?.salesMoq) {
                  message.error('转订单数量不能小于最小起订量');
                }
              }}
              onPressEnter={(e) => {
                e.preventDefault();
              }}
            />
          );
        } else {
          return record.qty;
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
      title: '成交价含税',
      dataIndex: 'salesPrice',
      width: 160,
      render: (_, record) => {
        return (
          <InputNumber
            style={{ width: '140px' }}
            step={0.01}
            value={record.salesPrice}
            defaultValue={record.salesPrice}
            onChange={(val: any) => {
              if (val) {
                reTotalAmountNet(record, val, 1);
              }
            }}
            onPressEnter={(e) => {
              e.preventDefault();
            }}
          />
        );
      },
    },
    {
      title: '成交价未税',
      dataIndex: 'salesPriceNet',
      width: 160,
      render: (_, record) => {
        return (
          <InputNumber
            style={{ width: '140px' }}
            step={0.01}
            value={record.salesPriceNet}
            defaultValue={record.salesPriceNet}
            onChange={(val: any) => {
              if (val) {
                reTotalAmountNet(record, val, 2);
              }
            }}
            onPressEnter={(e) => {
              e.preventDefault();
            }}
          />
        );
      },
    },
    {
      title: '小计含税',
      dataIndex: 'totalAmount',
      width: 160,
      // render: (_, record: any) => {
      //   // if (info?.adjustFreight == 0) {
      //   return (
      //     <InputNumber
      //       style={{ width: '140px' }}
      //       step={0.01}
      //       value={record.totalAmount}
      //       defaultValue={record.totalAmount}
      //       min={Number(record?.totalAmountMin?.toFixed(2))}
      //       max={Number(record?.totalAmountMax?.toFixed(2))}
      //       onChange={(val: any) => {
      //         record.totalAmount = val;
      //         setInfo({
      //           ...info,
      //           lines: info?.lines?.map((io: any) => {
      //             if (io.quotationLineId === record.quotationLineId) {
      //               io = record;
      //             }
      //             return io;
      //           }),
      //         });
      //         refreshAmount();
      //         if (val === record?.totalAmountMin) {
      //           message.error('调整额度已达到调整极限');
      //           return false;
      //         } else if (val === record?.totalAmountMax) {
      //           message.error('调整额度已达到调整极限');
      //           return false;
      //         }
      //       }}
      //       onPressEnter={(e) => {
      //         e.preventDefault();
      //       }}
      //     />
      //   );
      // },
      render: (_, record) => {
        return (
          <InputNumber
            style={{ width: '140px' }}
            step={0.01}
            value={record.totalAmount}
            defaultValue={record.totalAmount}
            onChange={(val: any) => {
              if (val) {
                reTotalAmountNet(record, val, 3);
              }
            }}
            onPressEnter={(e) => {
              e.preventDefault();
            }}
          />
        );
      },
    },
    {
      title: '小计未税',
      dataIndex: 'totalAmountNet',
      width: 160,
      render: (_, record) => {
        return (
          <InputNumber
            style={{ width: '140px' }}
            step={0.01}
            value={record.totalAmountNet}
            defaultValue={record.totalAmountNet}
            onChange={(val: any) => {
              if (val) {
                reTotalAmountNet(record, val, 4);
              }
            }}
            onPressEnter={(e) => {
              e.preventDefault();
            }}
          />
        );
      },
    },
    {
      title: '小计折扣',
      dataIndex: 'totalDiscount',
      width: 100,
    },
    {
      title: '运费',
      dataIndex: 'freight',
      width: 100,
    },
    {
      title: '行国际运费',
      dataIndex: 'interFreight',
      width: 100,
    },
    {
      title: '关税',
      dataIndex: 'tariff',
      width: 100,
    },
    // {
    //   title: '总价-含税',
    //   dataIndex: 'amount',
    //   width: 100,
    // },
    {
      title: '报价到期日',
      dataIndex: 'quotValidDate',
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
      width: 200,
      render: (_, record: any) => {
        return (
          <Input
            placeholder="请输入"
            maxLength={20}
            defaultValue={record.customerSku}
            onChange={(val: any) => {
              record.customerSku = val?.target?.value;
              return val?.target?.value;
            }}
          />
        );
      },
    },
    {
      title: '客户行号',
      dataIndex: 'poItemNo',
      width: 100,
      render: (_, record: any) => {
        return (
          <Input
            placeholder="请输入"
            maxLength={6}
            defaultValue={record.poItemNo}
            onChange={(val: any) => {
              record.poItemNo = val?.target?.value;
              return val?.target?.value;
            }}
          />
        );
      },
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
      title: '交付周期(工作日)',
      dataIndex: 'leadTime',
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
      render: (_, record: any) => (record.dropShipFlag == true ? '是' : '否'),
      width: 100,
    },
    {
      title: 'SKU类型',
      dataIndex: 'skuTypeName',
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
      title: '预计发货日期',
      dataIndex: 'deliveryDate',
      valueType: 'date',
      width: 100,
    },
    {
      title: '客户期望交期',
      dataIndex: 'expectedDate',
      width: 160,
      render: (_, record) => {
        return (
          <DatePicker
            format="YYYY-MM-DD"
            defaultValue={record.expectedDate ? moment(record.expectedDate, 'YYYY-MM-DD') : record.expectedDate}
            onChange={(e,dateString) => {
              record.expectedDate = dateString
            }}
            disabledDate={(current: any) => {
              return current < moment().startOf('day');
            }}
          />
        );
      },
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
      width: 180,
    },
  ];
  const [modalVisibleAddress, setModalVisibleAddress] = useState<boolean>(false);
  const [modalVisibleInvice, setModalVisibleInvice] = useState<boolean>(false);
  const [modalVisibleAddressInvoice, setModalVisibleAddressInvoice] = useState<any>(false);
  const [invoiceList, setInvoiceList] = useState<any>({});
  const [addressList, setAddressList] = useState<any>({});
  // const [fileList, setFileList] = useState<any>([]);
  const [fileType, setFileType] = useState<any>('');
  const [filePo, setFilePo] = useState<any>([]);
  const [fileInvoice, setFileInvoice] = useState<any>([]);
  const [fileOther, setFileOther] = useState<any>([]);
  const [sapcode, setSapcode] = useState();
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  const uploadProps = {
    name: 'file',
    action: `${getEnv()}/omsapi/refResource/upload`,
    accept: '*',
    headers: {
      token: Cookies.get('ssoToken'),
    },
    beforeUpload(msg: any) {
      if (msg.size / 1024 / 1024 > 100) {
        message.error('文件大小不能超过100MB!');
        return false;
      }
    },
    onChange(msg: any) {
      if (msg.file.status !== 'uploading') {
      }
      if (msg.file.status === 'done') {
        const {
          response: { data },
          uid,
        } = msg.file;
        const par = {
          sid: info.sid || 1,
          resourceName: data.resourceName,
          resourceUrl: data.resourceUrl,
          fileType: fileType,
          uid,
        };
        setFilePo([par]);
        message.success(`${msg.file.name} file uploaded successfully`);
      } else if (msg.file.status === 'error') {
        message.error(`${msg.file.name} file upload failed.`);
      }
    },
    onRemove() {
      setFilePo([]);
    },
  };
  const uploadPropsInvoice = {
    name: 'file',
    action: `${getEnv()}/omsapi/refResource/upload`,
    accept: '*',
    headers: {
      token: Cookies.get('ssoToken'),
    },
    beforeUpload(msg: any) {
      if (msg.size / 1024 / 1024 > 100) {
        message.error('文件大小不能超过100MB!');
        return false;
      }
    },
    onChange(msg: any) {
      if (msg.file.status !== 'uploading') {
      }
      if (msg.file.status === 'done') {
        const {
          response: { data },
          uid,
        } = msg.file;
        const par = {
          sid: info.sid || 1,
          resourceName: data.resourceName,
          resourceUrl: data.resourceUrl,
          fileType: fileType,
          uid,
        };
        setFileInvoice([par]);
        message.success(`${msg.file.name} file uploaded successfully`);
      } else if (msg.file.status === 'error') {
        message.error(`${msg.file.name} file upload failed.`);
      }
    },
    onRemove() {
      setFileInvoice([]);
    },
  };
  const uploadPropsOther = {
    name: 'file',
    action: `${getEnv()}/omsapi/refResource/upload`,
    accept: '*',
    headers: {
      token: Cookies.get('ssoToken'),
    },
    beforeUpload(msg: any) {
      if (msg.size / 1024 / 1024 > 100) {
        message.error('文件大小不能超过100MB!');
        return false;
      }
    },
    onChange(msg: any) {
      if (msg.file.status !== 'uploading') {
      }
      if (msg.file.status === 'done') {
        const {
          response: { data },
          uid,
        } = msg.file;
        const par = {
          sid: info.sid || 1,
          resourceName: data.resourceName,
          resourceUrl: data.resourceUrl,
          fileType: fileType,
          uid,
        };
        setFileOther([par]);
        message.success(`${msg.file.name} file uploaded successfully`);
      } else if (msg.file.status === 'error') {
        message.error(`${msg.file.name} file upload failed.`);
      }
    },
    onRemove() {
      setFileOther([]);
    },
  };

  useEffect(() => {
    setLoad(true);
    const par = {
      quotLineIdList,
    };
    const parAll = {
      quotLineIdList,
      quotIdList,
    };
    transferSecondOrder(quotIdList.length > 0 ? parAll : par)
      .then(async (res) => {
        const { data, errCode } = res;
        if (errCode === 200) {
          setSapcode(res?.data?.receiverInfo?.shipRegionSapCode);
          let toBond = false;
          await checkBond({ customerCode: data?.customerCode }).then((res1: any) => {
            if (res1?.errCode === 200) {
              toBond = res1?.data?.toBond;
            }
          });
          // 默认 queryPayInfo
          let defaultPay = {} as any;
          await queryPayInfo({ customerCode: data?.customerCode }).then((respay: any) => {
            if (respay.data) {
              defaultPay = {
                payTypeCust: respay?.data?.type,
              };
            }
          });
          // 强刷
          const parCalc = {
            customerCode: data?.customerCode || '',
            shipRegionCode1: data?.receiverInfo?.provinceCode || '',
            shipRegionCode2: data?.receiverInfo?.cityCode || '',
            sid: data?.sid,
            freight: data?.freight || 0,
            interFreight: data?.interFreight || 0,
            tariff: data?.tariff || 0,
            quotType: data?.quotType,
            calSubTotalLineReqVoList: data?.lines?.map((io: any) => ({
              ...io,
              sid: io.quotationLineId,
              salesPrice: io.salesPrice || 0,
              salesPriceNet: io.salesPriceNet || 0,
              freight: io.freight || 0,
              interFreight: io.interFreight || 0,
              tariff: io.tariff || 0,
              dropShipFlag: io?.dropShipFlag == true ? 1 : 0,
            })),
          };
          let lines = [] as any;
          let totalSrc = {} as any;
          await calSubQuotationTotal(parCalc).then((resCalc: any) => {
            if (resCalc?.errCode === 200) {
              if (data?.adjustFreight != 0) {
                totalSrc = {
                  goodsAmount: data?.goodsAmount || 0,
                  amount: data?.amount || 0,
                  amountNet: data?.netPrice || 0,
                  totalDiscount: data?.discountAmount || 0,
                  calcFreightRespVo: {
                    headFreight: data?.freight || 0,
                    totalFreight: data?.totalFreight || 0,
                    interFreight: data?.interFreight || 0,
                    tariff: data?.tariff || 0,
                  },
                };
                lines = data?.lines;
              } else {
                totalSrc = {
                  goodsAmount: resCalc?.data?.goodsAmount || 0,
                  amount: resCalc?.data?.amount || 0,
                  amountNet: resCalc?.data?.amountNet || 0,
                  totalDiscount: resCalc?.data?.totalDiscount || 0,
                  calcFreightRespVo: {
                    headFreight: resCalc?.data?.calcFreightRespVo?.headFreight || 0,
                    totalFreight: resCalc?.data?.calcFreightRespVo?.totalFreight || 0,
                    interFreight: resCalc?.data?.calcFreightRespVo?.interFreight || 0,
                    tariff: resCalc?.data?.calcFreightRespVo?.tariff || 0,
                  },
                };
                if (data?.lines?.length > 0) {
                  const linesArray = data.lines as any;
                  for (let i = 0; i < linesArray.length; i++) {
                    linesArray[i].totalAmount =
                      resCalc?.data?.calSubTotalLineRespVoList[i]?.totalAmount ||
                      linesArray[i].totalAmount;
                    linesArray[i].totalAmountNet =
                      resCalc?.data?.calSubTotalLineRespVoList[i]?.totalAmountNet ||
                      linesArray[i].totalAmountNet;
                    linesArray[i].totalDiscount =
                      resCalc?.data?.calSubTotalLineRespVoList[i]?.totalDiscount ||
                      linesArray[i].totalDiscount;
                    linesArray[i].freight =
                      resCalc?.data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo?.lineFreight ||
                      linesArray[i].freight;
                    linesArray[i].interFreight =
                      resCalc?.data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo
                        ?.interFreight || linesArray[i].interFreight;
                    linesArray[i].tariff =
                      resCalc?.data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo?.tariff ||
                      linesArray[i].tariff;
                    linesArray[i].totalFreight =
                      resCalc?.data?.calSubTotalLineRespVoList[i]?.lineFreightRespVo
                        ?.totalFreight || linesArray[i].totalFreight;
                  }
                  lines = linesArray;
                }
              }
            }
          });
          // 三个后端三种省市区字段
          setTimeout(async () => {
            setLoad(false);
            setTotal(totalSrc);
            // 新加两个接口 增加两个字段  获取小计含税最大最小值,,,,
            // const amountList = lines.map((io: any) => ({
            //   qty: io.qty,
            //   quotationLineId: io.quotationLineId,
            //   quotationNo: io.quotationNo,
            // }));
            // await queryAmountRang({ amountList }).then((resamount: any) => {
            //   if (res?.errCode == 200) {
            //     const mList = lines?.map((io: any) => {
            //       for (let i = 0; i < resamount?.data?.dataList.length; i++) {
            //         if (io.quotationLineId == resamount?.data?.dataList[i].quotationLineId) {
            //           io.totalAmountMin = resamount?.data?.dataList[i].totalAmountMin;
            //           io.totalAmountMax = resamount?.data?.dataList[i].totalAmountMax;
            //           return io;
            //         }
            //       }
            //     });
            //     return mList;
            //   } else {
            //     message.error(resamount?.errMsg);
            //   }
            // });

            // 重新渲染含税等行信息接口数据
            // const calcUpdateParams =  {
            //   goodsAmount: totalSrc?.goodsAmount,
            //   amount:totalSrc?.amount,
            //   amountNet: totalSrc?.amountNet,
            //   totalDiscount: totalSrc?.totalDiscount,
            //   freight:totalSrc?.calcFreightRespVo?.headFreight,
            //   interFreight:totalSrc?.calcFreightRespVo?.interFreight,
            //   totalFreight:totalSrc?.calcFreightRespVo?.totalFreight,
            //   tariff:totalSrc?.calcFreightRespVo?.tariff,
            //   // gpRate: 暂无
            //   lines
            // }
            // await calculationUpdate(calcUpdateParams).then((rescalc: any)=>{
            //   if(rescalc?.errCode ==200){

            //   }else {message.error(rescalc?.errMsg)}
            // })

            // data.invoiceInfo.invoiceMobile = '1';
            // data.invoiceInfo.invoiceTel = '2';
            setInfo({
              ...defaultPay,
              ...data,
              // 区别字段
              r3: {
                contactsName: data.contactsName,
                contactsCode: data.contactsCode,
              },
              paymentTerm: data.paymentTerms,
              receiverInfo: {
                ...data.receiverInfo,
                provinceName: data.receiverInfo.province,
                cityName: data.receiverInfo.city,
                districtName: data.receiverInfo.district,
                toBond,
              },
              lines: lines?.map((io: any) => ({
                ...io,
                ...io.produceInfo,
                expectedDate: ""
              })),
            });
            console.log(lines, 'lines');
          }, 100);
        }
      })
      .catch((e: any) => {
        setLoad(false);
        console.log(e, 'e');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function reSelect() {
    modalRef?.current?.close();
    setModalVisibleAddress(true);
  }
  const refresh = async () => {
    const res = await queryRecAddress({ customerCode: info.customerCode });
    if (res.errCode == 200) {
      // console.log(res, 'res');
      const val = res?.data?.dataList?.find((item: any) => {
        return item.sapCode === sapcode;
      });
      // console.log(val, 'val');
      const address = {
        provinceCode: val.province,
        cityCode: val.city,
        districtCode: val.district,
        provinceName: val.provinceName,
        cityName: val.cityName,
        districtName: val.districtName,
        region: `${val.provinceName}${val.cityName}${val.districtName}`,
        receiverAddress: val.receiptAddress,
        shipZip: val.receiptZipCode,
        receiverName: val.recipientName,
        receiverMobile: val.receiptMobilePhone,
        receiverPhone: val.receiptFixPhone,
        consigneeEmail: val.receiptEmail,
        extensionNumber: '021', // 其实已经去掉了
        shipRegionSapCode: val?.sapCode,
      };
      setInfo({
        ...info,
        receiverInfo: {
          ...info.invoiceInfo,
          ...address,
        },
      });
      form.setFieldsValue({
        ...address,
      });
      modalRef?.current?.close();
    } else {
      message.error('失败' + res.errMsg);
    }
  };
  const reBack = () => {
    destroyCom('/inquiry/offer', location.pathname);
  };
  const submit = async (values: any) => {
    if (!values.receiverMobile && !values.receiverPhone) {
      return message.error('请完善收货信息中的收货人手机，或收货人固话');
    }
    if (values.invoiceType == '1' && !values.invoiceMobile && !values.invoiceTel) {
      return message.error('请完善发票寄送信息中的收货人手机，或收货人固话');
    }
    // console.log(values,'values');
    if (moment(values).diff(moment(new Date()), 'days') < 0) {
      return message.error('要求发货日不可早于当日');
    }
    // console.log(123,'123');
    // return
    // vales 取不到就取info的，info取不到就没了 字段太多了，不知道哪些非必传
    // console.log(values, 'values');
    if (!values.receiverMobile && !values.receiverPhone) {
      return message.error('请完善收货信息中的收货人手机，或收货人固话');
    }
    if (values.invoiceType == 1 && !values.invoiceMobile && !values.invoiceTel) {
      return message.error('请完善发票寄送信息中的收货人手机，或收货人固话');
    }
    // console.log(info, 'infossss');
    // 单独使用了
    // return;
    setLoadding(true);
    let condationList = [] as any;
    let methodList = [] as any;
    await getSelectList({ type: 'paymentTerm' }).then((res: any) => {
      if (res?.errCode === 200) {
        condationList = res?.data?.dataList?.map((io: any) => ({
          ...io,
          label: io.value,
          value: io.key,
        }));
      } else {
        setLoadding(false);
      }
    });
    await getSelectList({ type: 'paymentTerm', code: values.paymentTerm || info.paymentTerm }).then(
      (res: any) => {
        if (res?.errCode === 200) {
          methodList = res?.data?.dataList[0]?.children?.map((io: any) => ({
            ...io,
            label: io.value,
            value: io.key,
          }));
        } else {
          setLoadding(false);
        }
      },
    );

    const paymentMethodName = methodList?.filter((io: any) => io.key == values?.paymentMethod)[0]
      ?.label;
    const paymentTermsName = condationList?.filter((io: any) => io.key == values?.paymentTerm)[0]
      ?.label;

    if (!paymentTermsName) {
      message.error('请选择正确的支付条件');
      setLoadding(false);
      return false;
    }
    if (!paymentMethodName) {
      message.error('请选择正确的支付方式');
      setLoadding(false);
      return false;
    }
    const par = {
      channel: 10,
      category: values.category || 10,
      needInvoice: values?.invoiceType === '无需发票' ? false : true, // 后端下拉接口对应code是否已经匹配好
      customerCode: values?.customerCode, //'0600030034',
      customerName: values?.customerName,
      contactsCode: values?.r3?.value || info?.r3?.contactsCode || info?.contactsCode || '', //'0000133300',
      contactsName: values?.r3?.label || info?.r3?.contactsName || info?.contactsName || '',
      couponCode: values?.couponCode,
      csrRemark: values?.csrRemark,
      userRemark: values?.userRemark,
      customerPurchaseNo: values?.customerPurchaseNo,
      oppoValue: values?.oppoId?.label || info?.oppoValue || '', //labelInValue
      oppoId: values?.oppoId?.key || info?.oppoId || '', //labelInValue
      partialShipment: values?.partialShipment,
      paymentMethod: values?.paymentMethod,
      paymentTerms: values?.paymentTerm, // 包子的是paymentTerm
      paymentMethodName, // 后加的
      paymentTermsName, // 后加的
      salesName: values?.salesName,
      salesNo: info?.salesNo,
      sendDate: values?.sendDate,
      expectedDate: values?.expectedDate,
      shipType: values?.shipType,
      // 明细
      validToDate: info?.validToDate,
      gpRate: info?.gpRate || 0,

      goodsAmount: total?.goodsAmount || info?.goodsAmount,
      freight:
        total?.calcFreightRespVo?.headFreight >= 0
          ? total?.calcFreightRespVo?.headFreight
          : info?.freight || 0,
      interFreight:
        total?.calcFreightRespVo?.interFreight >= 0
          ? total?.calcFreightRespVo?.interFreight
          : info?.interFreight || 0,
      tariff:
        total?.calcFreightRespVo?.tariff >= 0
          ? total?.calcFreightRespVo?.tariff
          : info?.tariff || 0,
      totalFreight:
        total?.calcFreightRespVo?.totalFreight >= 0
          ? total?.calcFreightRespVo?.totalFreight
          : info?.totalFreight || 0,
      intelDevice: values?.intelDevice || 0,
      amount: total?.amount || info?.amount || 0,
      netPrice: total?.amountNet || info?.netPrice || 0,
      discountAmount: total?.totalDiscount || 0,
      specialCode: values?.specialCode || info?.specialCode || '',

      receiverInfo: {
        receiverName: values?.receiverName || info.receiverName,
        receiverPhone: values?.receiverPhone || info.receiverPhone,
        receiverMobile: values?.receiverMobile || info.receiverMobile,
        receiverAddress: values?.receiverAddress || info.receiverAddress,
        provinceCode: info?.receiverInfo?.provinceCode,
        cityCode: info?.receiverInfo?.cityCode,
        districtCode: info?.receiverInfo?.districtCode,
        province: info?.receiverInfo?.provinceName,
        city: info?.receiverInfo?.cityName,
        district: info?.receiverInfo?.districtName,
        shipZip: values?.shipZip || info?.receiverInfo?.shipZip,
        extensionNumber: info?.receiverInfo?.extensionNumber,
        consigneeEmail: values?.consigneeEmail || info?.receiverInfo?.consigneeEmail,
        toBond: values?.toBond,
        specialCode: values?.specialCode || info?.specialCode,
        shipRegionSapCode: info?.receiverInfo?.shipRegionSapCode || info?.shipRegionSapCode,
      },
      invoiceInfo: {
        ...info.invoiceInfo,
        ...values,
        payerCustomerAccount: info?.invoiceInfo?.payerCustomerAccount || info?.payerCustomerAccount,
        invoiceSapCode: info?.invoiceInfo?.invoiceSapCode || info?.invoiceSapCode,
      },
      lines: info?.lines,
      resourceVOList: [...filePo, ...fileInvoice, ...fileOther],
    };
    //add 弹窗提醒 转订单运费提醒 || add新加需求 或者 校验
    const parCheck = {
      customerCode: values?.customerCode,
      customerPurchaseNo: values?.customerPurchaseNo,
      amount: total?.amount || info?.amount || 0,
    };
    let checkFlag = '';
    const { data, errCode, errMsg } = await checkDuplicatePo(parCheck);
    if (errCode == 200) {
      checkFlag = data;
    } else {
      message.error(errMsg);
      setLoadding(false);
      return false;
    }
    // go on
    if (total?.calcFreightRespVo?.totalFreight != 0) {
      Modal.confirm({
        title: '转订单运费提醒',
        content: '您本次创建的订单中含有运费，请确认！',
        onOk: async () => {
          if (checkFlag) {
            Modal.confirm({
              title: 'PO重复转订单提醒',
              content: (
                <div>
                  <p>您在三个月内存在同一PO相同金额的订单，</p>
                  <p>请确认是否重复创建订单!</p>
                </div>
              ),
              onOk: async () => {
                const res = await createTransferOrder(par);
                // console.log(res, 'res');
                if (res?.errCode === 200) {
                  message.success('订单创建成功');
                  setTimeout(() => {
                    setLoadding(false);
                    reBack();
                  }, 500);
                } else if (res?.errCode === 672) {
                  // modalRef?.current?.open();
                  setCodeErrorMsg(res?.errMsg);
                  Modal.warning({
                    title: '地址信息已经失效',
                    content: res?.errMsg || '请刷新并重新选择地址',
                    okText: '知道了',
                    onOk() {
                      setLoadding(false);
                    },
                    onCancel() {
                      setLoadding(false);
                    },
                  });
                } else {
                  setLoadding(false);
                  message.error(res?.errMsg);
                }
              },
              onCancel: async () => {
                setLoadding(false);
                return false;
              },
            });
          } else {
            const res = await createTransferOrder(par);
            // console.log(res, 'res');
            if (res?.errCode === 200) {
              message.success('订单创建成功');
              setTimeout(() => {
                setLoadding(false);
                reBack();
              }, 500);
            } else if (res?.errCode === 672) {
              // modalRef?.current?.open();
              setCodeErrorMsg(res?.errMsg);
              Modal.warning({
                title: '地址信息已经失效',
                content: res?.errMsg || '请刷新并重新选择地址',
                okText: '知道了',
                onOk() {
                  setLoadding(false);
                },
                onCancel() {
                  setLoadding(false);
                },
              });
            } else {
              setLoadding(false);
              message.error(res?.errMsg);
            }
          }
        },
        onCancel: async () => {
          setLoadding(false);
        },
      });
    } else if (checkFlag) {
      Modal.confirm({
        title: 'PO重复转订单提醒',
        content: (
          <div>
            <p>您在三个月内存在同一PO相同金额的订单，</p>
            <p>请确认是否重复创建订单!</p>
          </div>
        ),
        onOk: async () => {
          const res = await createTransferOrder(par);
          // console.log(res, 'res');
          if (res?.errCode === 200) {
            message.success('订单创建成功');
            setTimeout(() => {
              setLoadding(false);
              reBack();
            }, 500);
          } else if (res?.errCode === 672) {
            // modalRef?.current?.open();
            setCodeErrorMsg(res?.errMsg);
            Modal.warning({
              title: '地址信息已经失效',
              content: res?.errMsg || '请刷新并重新选择地址',
              okText: '知道了',
              onOk() {
                setLoadding(false);
              },
              onCancel() {
                setLoadding(false);
              },
            });
          } else {
            setLoadding(false);
            message.error(res?.errMsg);
          }
        },
        onCancel: async () => {
          setLoadding(false);
          return false;
        },
      });
    } else {
      const res = await createTransferOrder(par);
      // console.log(res, 'res');
      if (res?.errCode === 200) {
        message.success('订单创建成功');
        setTimeout(() => {
          setLoadding(false);
          reBack();
        }, 500);
      } else if (res?.errCode === 672) {
        // modalRef?.current?.open();
        setCodeErrorMsg(res?.errMsg);
        Modal.warning({
          title: '地址信息已经失效',
          content: res?.errMsg || '请刷新并重新选择地址',
          okText: '知道了',
          onOk() {
            setLoadding(false);
          },
          onCancel() {
            setLoadding(false);
          },
        });
      } else {
        setLoadding(false);
        message.error(res?.errMsg);
      }
    }
  };

  const onMethodChange = (val: any) => {
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
    const address = {
      ...addressList,
      provinceCode: val.province,
      cityCode: val.city,
      districtCode: val.district,
      provinceName: val.provinceName,
      cityName: val.cityName,
      districtName: val.districtName,
      region: `${val.provinceName}${val.cityName}${val.districtName}`,
      receiverAddress: val.receiptAddress,
      shipZip: val.receiptZipCode,
      receiverName: val.recipientName,
      receiverMobile: val.receiptMobilePhone,
      receiverPhone: val.receiptFixPhone,
      consigneeEmail: val.receiptEmail,
      extensionNumber: '021', // 其实已经去掉了
      shipRegionSapCode: val?.shipRegionSapCode,
    };
    setInfo({
      ...info,
      receiverInfo: {
        ...info.invoiceInfo,
        ...address,
      },
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
      followMerchandise: val.followMerchandise == true ? 1 : 0,
      invoiceSapCode: val?.invoiceSapCode,
    };
    setInfo({
      ...info,
      invoiceInfo: {
        ...info.invoiceInfo,
        ...invoiceAdd,
      },
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
    const tInvoice = {
      ...val,
      vatPhone: val.vatPhone,
      vatBankNo: val.vatBankNo,
    };

    setInfo({
      ...info,
      invoiceInfo: {
        ...info.invoiceInfo,
        ...tInvoice,
      },
    });
    form.setFieldsValue({
      ...tInvoice,
    });
    setModalVisibleInvice(false);
  };
  const handleOk = () => {
    // jinbao
    if (Object.values(addressList).length === 0) {
      message.error('请选择信息');
      return false;
    }
    const address = {
      ...addressList,
      provinceCode: addressList.province,
      cityCode: addressList.city,
      districtCode: addressList.district,
      provinceName: addressList.provinceName,
      cityName: addressList.cityName,
      districtName: addressList.districtName,
      region: `${addressList.provinceName}${addressList.cityName}${addressList.districtName}`,
      receiverAddress: addressList.receiptAddress,
      shipZip: addressList.receiptZipCode,
      receiverName: addressList.recipientName,
      receiverMobile: addressList.receiptMobilePhone,
      receiverPhone: addressList.receiptFixPhone,
      consigneeEmail: addressList.receiptEmail,
      extensionNumber: '021', // 其实已经去掉了
      shipRegionSapCode: addressList?.shipRegionSapCode,
    };
    setInfo({
      ...info,
      receiverInfo: {
        ...info.invoiceInfo,
        ...address,
      },
    });
    form.setFieldsValue({
      ...address,
    });
    setModalVisibleAddress(false);
    console.log(address);
    if (info?.adjustFreight == 0) {
      getTotal(address);
    }
    return true;
  };
  return (
    <Spin spinning={load}>
      <div className="form-content-search offer edit createQuotatian" id="inquirySheetOffer">
        <ProForm
          layout="horizontal"
          className="fix_lable_large has-gridForm"
          onFinish={(values) => submit(values)}
          onFinishFailed={() => {
            message.warning('您有未完善的信息，请填写正确的信息');
          }}
          labelWrap
          onValuesChange={(values) => {
            if (values?.invoiceType) {
              setInfo({
                ...info,
                invoiceInfo: {
                  ...info.invoiceInfo,
                  invoiceType: values?.invoiceType == 3 ? 3 : values?.invoiceType,
                },
              });
            }
            if (values?.r3?.value) {
              form.setFieldsValue({
                contactsCode: values?.r3?.value,
              });
            }
          }}
          form={form}
          submitter={{
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
            <p className="head-title">新增订单</p>
            <Space>
              {/*<p>清单条目：{quotLineIdList?.length || 1}</p>*/}
              <p>清单条目：{quotLineIdList?.length || info?.lines?.length || 1}</p>
            </Space>
          </Card>
          <Row gutter={2} style={{ background: '#fff' }}>
            <Col span={2} style={{ background: '#fff' }}>
              <Anchor
                className="anchor"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                {menuLink?.map((item: any) => (
                  <Link href={item.link} title={item.title} key={item.id} className="linkOrder" />
                ))}
              </Anchor>
            </Col>
            <Col span={22}>
              <div className="editContentCol">
                <Card title="基本信息" bordered={false} id="basic">
                  {info?.salesName && <BasicInfo info={info} type="addOrder" onChangeDate={(str) => {
                     setInfo({
                      ...info,
                      lines: []
                    })
                    let arr = info.lines.map(e => {
                      return {
                        ...e,
                        expectedDate: str
                      }
                    })
                   
                   setTimeout(() => {
                    setInfo({
                      ...info,
                      lines: arr
                    })
                   }, 500)
                    console.log(info, 'info')
                  }}/>}
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
                  {info?.salesName && (
                    <ReceiverInfo
                      info={info.receiverInfo}
                      type="addOrder"
                      onModal={() => {
                        setModalVisibleAddress(true);
                        setAddressList([]);
                      }}
                    />
                  )}
                </Card>
                <Card title="配送及支付信息" bordered={false} id="pay">
                  {info?.salesName && (
                    <PayInfo
                      info={info}
                      type="addOrder"
                      onMethodChange={(newArrayValue: any) => onMethodChange(newArrayValue)}
                    />
                  )}
                </Card>
                <Card title="开票信息" bordered={false} id="invoice">
                  {info?.salesName && (
                    <InvoiceInfo
                      info={info.invoiceInfo}
                      type="addOrder"
                      onModal={() => {
                        setModalVisibleInvice(true);
                        setInvoiceList([]);
                      }}
                    />
                  )}
                </Card>
                <Card title="发票寄送信息" bordered={false} id="invoiceDeliver">
                  {info?.salesName && (
                    <InvoiceDeliverInfo
                      info={info.invoiceInfo}
                      type="addOrder"
                      onModal={() => {
                        setModalVisibleAddressInvoice(true);
                        setAddressList([]);
                      }}
                    />
                  )}
                </Card>
                <Card
                  title={
                    <div id="six" className="title">
                      明细信息
                      <span className="tipsInTitle" style={{ marginLeft: '50px' }}>
                        支持上调成交价(已享CSP价除外)
                      </span>
                    </div>
                  }
                  bordered={false}
                  className="order-msg"
                  id="shopDetail"
                >
                  {total && <TotalDesc totalDesc={total} />}
                  <div className="cust-table">
                    <ProTable<TableListItem>
                      columns={columns}
                      bordered
                      actionRef={actionRef}
                      scroll={{ x: 200, y: 500 }}
                      style={{ padding: '20px 0', background: '#fff' }}
                      size="small"
                      rowKey="quotationLineId"
                      tableStyle={{ paddingTop: '10px' }}
                      options={{ reload: false, density: false }}
                      search={false}
                      pagination={false}
                      dateFormatter="string"
                      dataSource={info?.lines}
                    />
                  </div>
                </Card>
                <Card title="附件信息" className="upload-card" bordered={false} id="enclosure">
                  <Row gutter={24} style={{ marginBottom: '20px' }}>
                    <Col span={3}>
                      <p>PO附件：</p>
                      <p>(MAX：1)</p>
                    </Col>
                    <Col
                      span={6}
                      onClick={() => {
                        setFileType('PO附件');
                      }}
                    >
                      <Upload maxCount={1} {...uploadProps}>
                        <Button>上传附件</Button>
                      </Upload>
                    </Col>
                  </Row>
                  <Row gutter={24} style={{ marginBottom: '20px' }}>
                    <Col span={3}>
                      <p>发票信息附件：</p>
                      <p>(MAX：1)</p>
                    </Col>
                    <Col span={6} onClick={() => setFileType('发票信息附件')}>
                      <Upload maxCount={1} {...uploadPropsInvoice}>
                        <Button>上传附件</Button>
                      </Upload>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={3}>
                      <p>其他附件：</p>
                      <p>(MAX：1)</p>
                    </Col>
                    <Col span={6} onClick={() => setFileType('其他附件')}>
                      <Upload maxCount={1} {...uploadPropsOther}>
                        <Button>上传附件</Button>
                      </Upload>
                    </Col>
                  </Row>
                </Card>
              </div>
            </Col>
          </Row>
        </ProForm>
        {/* 地址选择 带合并 */}
        <Modal
          title="地址选择"
          width={1500}
          visible={modalVisibleAddress}
          destroyOnClose={true}
          onCancel={() => setModalVisibleAddress(false)}
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
          title="发票地址选择"
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
              followMerchandise: addressList.followMerchandise == true ? 1 : 0,
              invoiceSapCode: addressList?.invoiceSapCode,
              provinceCode: addressList.province,
              cityCode: addressList.city,
              districtCode: addressList.district,
            };

            setInfo({
              ...info,
              invoiceInfo: {
                ...info.invoiceInfo,
                ...invoiceAdd,
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
            if (Object.values(invoiceList).length === 0) {
              message.error('请选择信息');
              return false;
            }
            console.log(values);
            const tInvoice = {
              ...invoiceList,
              vatPhone: invoiceList.vatPhone,
              vatBankNo: invoiceList.vatBankNo,
            };

            setInfo({
              ...info,
              invoiceInfo: {
                ...info.invoiceInfo,
                ...tInvoice,
              },
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
        <MyModal ref={modalRef} reSelect={reSelect} refresh={refresh} codeErrorMsg={codeErrorMsg} />
      </div>
    </Spin>
  );
};
// export default Order;
import { KeepAlive } from 'react-activation';
// import { set } from 'lodash';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <Order />
  </KeepAlive>
);
