/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-param-reassign */
import {
  approvalDiscount,
  approvalDiscountWorkFlow,
  calcCsp,
  exportHelpData,
  getSelectList,
  offerDetail,
  offerDetailNeed,
} from '@/services/InquirySheet';
import ProDescriptions from '@ant-design/pro-descriptions';
import ProForm, { ModalForm, ProFormDigit, ProFormTextArea } from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  Button,
  Card,
  Form,
  InputNumber,
  message,
  Space,
  Tooltip,
  Upload,
  Spin,
  Tag,
  Popover,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import './index.less';
import Cookies from 'js-cookie';
import { getEnv } from '@/services/utils';
import UploadList from '../../../SalesOrder/OrderModificationApplication/components/UploadList';
import { ProfileTwoTone } from '@ant-design/icons';
import HistoryListModal from './HistoryListModal';
interface ApplyCheckProps {
  // detail?: any;
  from?: string;
  id?: any;
  onClose: (status: any) => void;
}

const ApplyCheck: React.FC<ApplyCheckProps> = ({ id, onClose, from }) => {
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const tableRef = useRef<ActionType>();
  const historyModaRef = useRef<any>();
  const [info, setInfo] = useState<any>({});
  const [mark, setMark] = useState<any>('');
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [loadding, setLoadding] = useState<any>(false);
  const [errorMsg, setErrorMsg] = useState<any>(false);
  const [load, setLoad]: any = useState(false);
  const [payEnum, setPayEnum] = useState<any>({});
  const [applySalesStatus, setApplySalesStatus] = useState<any>(false);
  const [apllySalesNetStatus, setApllySalesNetStatus] = useState<any>(false);
  const [applyPercentStatus, setApplyPercentStatus] = useState<any>(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(15);

  const [paramsFile] = useState<any>({});
  const [fileList, setFileList] = useState<any>([]);
  const [lineSku, setLineSku] = useState<any>('');

  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

  const getTotal = async (a: any, n: any, p: any, m: any, index: any) => {
    // console.log(applySalesStatus, '1');
    // console.log(apllySalesNetStatus, '2');
    // console.log(applyPercentStatus, '3');
    const par = {
      volumeDiscountTag: m ? 1 : 0,
      volumeDiscountRate: m,
      freightTag: 1,
      freight: info?.freight || 0,
      interFreight: info?.interFreight || 0,
      tariff: info?.tariff || 0,
      querySource: 1,
      totalFreight: info?.totalFreight || 0,
      itemList: info?.quotationLineRespVoPage?.list.map((io: any) => ({
        sid: io.quotLineId,
        bizStatus:
          (!io.quotationLineDiscountRespVoList ||
            io?.quotationLineDiscountRespVoList?.some(
              (ic: any) =>
                ic.discountCode != 'YPR0' && ic.discountCode != 'YD17' && ic.discountCode != 'YD25',
            )) &&
          io.allowApplyHelpDiscount !== 0 &&
          io.skuType != 20
            ? 11
            : 31, //31不参与批量折扣11
        discountRate: p ? io.applyDiscountPercent : null,
        applySalesPrice: a ? io.applySalesPrice : null,
        applySalesPriceNet: n ? io.applySalesPriceNet : null,
        salesPrice: io.salesPrice,
        listPrice: io.listPrice,
        costPrice: io.cost,
        qty: io.qty,
        sku: io.sku,
      })),
      deptName: info?.deptName || '',
      customerCode: info?.customerCode,
    };
    try {
      // const { data, errCode, errMsg } = await calcCsp(par);
      // if (errCode == 200) {
      //   const list = info?.quotationLineRespVoPage?.list.map((io: any) => {
      //     if (io.discountCode.indexOf('YD25') == -1) {
      //       for (let i = 0; i < data?.itemList?.length; i++) {
      //         if (io.quotLineId == data?.itemList[i]?.sid) {
      //           io.applyDiscountPercent = data?.itemList[i]?.discountRate;
      //           io.applySalesPrice = data?.itemList[i]?.applySalesPrice;
      //           io.applySalesPriceNet = data?.itemList[i]?.applySalesPriceNet;
      //           io.totalAmount = data?.itemList[i]?.totalAmount;
      //           io.totalAmountNet = data?.itemList[i]?.totalAmountNet;
      //           io.totalAmountAfter = data?.itemList[i]?.discountTotalAmount;
      //           io.totalAmountNetAfter = data?.itemList[i]?.discountTotalAmountNet;
      //           io.custTotalDiscount = data?.itemList[i]?.custTotalDiscount;
      //           io.finalGpRate = data?.itemList[i]?.finalGpRate;
      //           io.gpRate = data?.itemList[i]?.gpRate;
      //           io.cost = data?.itemList[i]?.costPrice;
      //           io.pmsLastCost = data?.itemList[i]?.rmbPurchasePrice;
      //           io.pmlsLastGpRate = data?.itemList[i]?.pmsGpRate;
      //           io.gpRateGear = data?.itemList[i]?.gpRateGear;
      //           io.gpRateGearRate = data?.itemList[i]?.gpRateGearRate;

      //           return io;
      //         }
      //       }
      //     } else {
      //       return io;
      //     }
      //   });
      //   if (index !== -1 ) {
      //     list[index].error = false
      //     let flg =  list.some(e => e.error)
      //     setErrorMsg(flg)
      //   }
      //   setInfo({
      //     ...info,
      //     amount: data?.amount,
      //     amountNet: data?.amountNet,
      //     goodsAmount: data?.goodsAmount,
      //     goodsAmountNet: data?.goodsAmountNet,
      //     amountNew: data?.amountNew,
      //     amountNetNew: data?.amountNetNew,
      //     goodsAmountNew: data?.goodsAmountNew,
      //     goodsAmountNetNew: data?.goodsAmountNetNew,
      //     calcTotalDiscountPercent: data?.calcTotalDiscountPercent,
      //     calcTaxDiscount: data?.calcTaxDiscount,
      //     calcApplyDiscount: data?.calcApplyDiscount,
      //     calcApplyTaxDiscount: data?.calcApplyTaxDiscount,
      //     gpRate: data?.gpRate,
      //     pmsGpRate: data?.pmsGpRate,
      //     pmsGpRateDesc: data?.pmsGpRateDesc,
      //     finalGpRate: data?.finalGpRate,
      //     quotationLineRespVoPage: {
      //       ...info?.quotationLineRespVoPage,
      //       list,
      //     },
      //   });
      // } else {
      //   message.error(errMsg);
      // }
    } catch (error) {
      let list = [...info?.quotationLineRespVoPage?.list]
      list[index].error = true
      setInfo({
        ...info,
        quotationLineRespVoPage:{
          ...info?.quotationLineRespVoPage,
          list,
        },
      })
      setErrorMsg(true)
      message.error('调整出错，请重试！')
    }
  };

  useEffect(() => {
    setLoad(true);
    // 需求单 和 报价单
    if (from === 'need') {
      // offerDetailNeed(id, { pageNumber: 1, pageSize: 10000 }).then(async (res: any) => {
      //   //id quoteCode 測试号B220609090459930
      //   if (res.errCode === 200) {
      //     const newData = {
      //       ...res?.data,
      //       quotationLineRespVoPage: {
      //         ...res?.data?.quotationLineRespVoPage,
      //         list: res?.data?.quotationLineRespVoPage?.list.map((io: any) => ({
      //           ...io,
      //           applySalesPrice:
      //             io.applySalesPrice ||
      //             Number(
      //               (io.salesPrice * ((100 + (io.applyDiscountPercent || 0)) / 100)).toFixed(2),
      //             ),
      //           applySalesPriceNet:
      //             io.applySalesPriceNet ||
      //             Number(
      //               (
      //                 (io.salesPrice * (100 + (io.applyDiscountPercent || 0))) /
      //                 100 /
      //                 (1 + 0.13)
      //               ).toFixed(2),
      //             ),
      //           applyDiscountPercent: io.applyDiscountPercent || 0,
      //         })),
      //       },
      //     };
      //     // getTotal 计算接口 刷页面
      //     const par = {
      //       volumeDiscountTag: mark ? 1 : 0,
      //       volumeDiscountRate: mark,
      //       freightTag: 1,
      //       freight: newData?.freight || 0,
      //       interFreight: newData?.interFreight || 0,
      //       tariff: newData?.tariff || 0,
      //       querySource: 1,
      //       totalFreight: newData?.totalFreight || 0,
      //       itemList: newData?.quotationLineRespVoPage?.list?.map((io: any) => ({
      //         sid: io.quotLineId,
      //         bizStatus:
      //           (!io.quotationLineDiscountRespVoList ||
      //             io?.quotationLineDiscountRespVoList?.some(
      //               (ic: any) =>
      //                 ic.discountCode != 'YPR0' &&
      //                 ic.discountCode != 'YD17' &&
      //                 ic.discountCode != 'YD25',
      //             )) &&
      //           io.allowApplyHelpDiscount !== 0 &&
      //           io.skuType != 20
      //             ? 11
      //             : 31, //31不参与批量折扣
      //         discountRate: applyPercentStatus ? io.applyDiscountPercent : null,
      //         applySalesPrice: applySalesStatus ? io.applySalesPrice : null,
      //         applySalesPriceNet: apllySalesNetStatus ? io.applySalesPriceNet : null,
      //         salesPrice: io.salesPrice,
      //         listPrice: io.listPrice,
      //         costPrice: io.cost,
      //         qty: io.qty,
      //         sku: io.sku,
      //       })),
      //       deptName: newData?.deptName || '',
      //       customerCode: newData?.customerCode,
      //     };
      //     await calcCsp(par).then((res1: any) => {
      //       const { data, errCode, errMsg } = res1;
      //       if (errCode === 200) {
      //         const list = newData?.quotationLineRespVoPage?.list?.map((io: any) => {
      //           for (let i = 0; i < data?.itemList?.length; i++) {
      //             if (io.quotLineId == data?.itemList[i]?.sid) {
      //               io.applyDiscountPercent = data?.itemList[i]?.discountRate;
      //               io.applySalesPrice = data?.itemList[i]?.applySalesPrice;
      //               io.applySalesPriceNet = data?.itemList[i]?.applySalesPriceNet;
      //               io.totalAmount = data?.itemList[i]?.totalAmount;
      //               io.totalAmountNet = data?.itemList[i]?.totalAmountNet;
      //               io.totalAmountAfter = data?.itemList[i]?.discountTotalAmount;
      //               io.totalAmountNetAfter = data?.itemList[i]?.discountTotalAmountNet;
      //               io.custTotalDiscount = data?.itemList[i]?.custTotalDiscount;
      //               io.finalGpRate = data?.itemList[i]?.finalGpRate;
      //               io.gpRate = data?.itemList[i]?.gpRate;
      //               io.cost = data?.itemList[i]?.costPrice;
      //               io.pmsLastCost = data?.itemList[i]?.rmbPurchasePrice;
      //               io.pmlsLastGpRate = data?.itemList[i]?.pmsGpRate;
      //               io.gpRateGear = data?.itemList[i]?.gpRateGear;
      //               io.gpRateGearRate = data?.itemList[i]?.gpRateGearRate;

      //               return io;
      //             }
      //           }
      //         });
      //         const dataCalc = {
      //           ...newData,
      //           amount: data?.amount,
      //           amountNet: data?.amountNet,
      //           goodsAmount: data?.goodsAmount,
      //           goodsAmountNet: data?.goodsAmountNet,
      //           amountNew: data?.amountNew,
      //           amountNetNew: data?.amountNetNew,
      //           goodsAmountNew: data?.goodsAmountNew,
      //           goodsAmountNetNew: data?.goodsAmountNetNew,
      //           calcTotalDiscountPercent: data?.calcTotalDiscountPercent,
      //           calcTaxDiscount: data?.calcTaxDiscount,
      //           calcApplyDiscount: data?.calcApplyDiscount,
      //           calcApplyTaxDiscount: data?.calcApplyTaxDiscount,
      //           gpRate: data?.gpRate,
      //           pmsGpRate: data?.pmsGpRate,
      //           pmsGpRateDesc: data?.pmsGpRateDesc,
      //           finalGpRate: data?.finalGpRate,
      //           quotationLineRespVoPage: {
      //             ...newData?.quotationLineRespVoPage,
      //             list,
      //           },
      //         };
      //         setInfo(dataCalc);
      //         // 校验繁殖后端随便写数据
      //         sessionStorage.setItem('oldList1', JSON.stringify(dataCalc));
      //         setLoad(false);
      //       } else {
      //         message.error(errMsg);
      //         setLoad(false);
      //       }
      //     });
      //   } else {
      //     message.error(res.errMsg);
      //     setLoad(false);
      //   }
      // });
    } else {
      // offerDetail(id, { pageNumber: 1, pageSize: 10000 }).then(async (res: any) => {
      //   // id  //quoteId ==? sid
      //   if (res.errCode === 200) {
      //     const newData = {
      //       ...res?.data,
      //       quotationLineRespVoPage: {
      //         ...res?.data?.quotationLineRespVoPage,
      //         list: res?.data?.quotationLineRespVoPage?.list.map((io: any) => ({
      //           ...io,
      //           applySalesPrice:
      //             io.applySalesPrice ||
      //             Number(
      //               (io.salesPrice * ((100 + (io.applyDiscountPercent || 0)) / 100)).toFixed(2),
      //             ),
      //           applySalesPriceNet:
      //             io.applySalesPriceNet ||
      //             Number(
      //               (
      //                 (io.salesPrice * (100 + (io.applyDiscountPercent || 0))) /
      //                 100 /
      //                 (1 + 0.13)
      //               ).toFixed(2),
      //             ),
      //           applyDiscountPercent: io.applyDiscountPercent || 0,
      //         })),
      //       },
      //     };
      //     // getTotal 计算接口 刷页面
      //     const par = {
      //       volumeDiscountTag: mark ? 1 : 0,
      //       volumeDiscountRate: mark,
      //       freightTag: 1,
      //       freight: newData?.freight || 0,
      //       interFreight: newData?.interFreight || 0,
      //       tariff: newData?.tariff || 0,
      //       querySource: 1,
      //       totalFreight: newData?.totalFreight || 0,
      //       itemList: newData?.quotationLineRespVoPage?.list?.map((io: any) => ({
      //         sid: io.quotLineId,
      //         bizStatus:
      //           (!io.quotationLineDiscountRespVoList ||
      //             io?.quotationLineDiscountRespVoList?.some(
      //               (ic: any) =>
      //                 ic.discountCode != 'YPR0' &&
      //                 ic.discountCode != 'YD17' &&
      //                 ic.discountCode != 'YD25',
      //             )) &&
      //           io.allowApplyHelpDiscount !== 0 &&
      //           io.skuType != 20
      //             ? 11
      //             : 31, //31不参与批量折扣
      //         discountRate: applyPercentStatus ? io.applyDiscountPercent : null,
      //         applySalesPrice: applySalesStatus ? io.applySalesPrice : null,
      //         applySalesPriceNet: apllySalesNetStatus ? io.applySalesPriceNet : null,
      //         salesPrice: io.salesPrice,
      //         listPrice: io.listPrice,
      //         costPrice: io.cost,
      //         qty: io.qty,
      //         sku: io.sku,
      //       })),
      //       deptName: newData?.deptName || '',
      //       customerCode: newData?.customerCode,
      //     };
      //     await calcCsp(par).then((res1: any) => {
      //       const { data, errCode, errMsg } = res1;
      //       if (errCode === 200) {
      //         const list = newData?.quotationLineRespVoPage?.list?.map((io: any) => {
      //           for (let i = 0; i < data?.itemList?.length; i++) {
      //             if (io.quotLineId == data?.itemList[i]?.sid) {
      //               io.applyDiscountPercent = data?.itemList[i]?.discountRate;
      //               io.applySalesPrice = data?.itemList[i]?.applySalesPrice;
      //               io.applySalesPriceNet = data?.itemList[i]?.applySalesPriceNet;
      //               io.totalAmount = data?.itemList[i]?.totalAmount;
      //               io.totalAmountNet = data?.itemList[i]?.totalAmountNet;
      //               io.totalAmountAfter = data?.itemList[i]?.discountTotalAmount;
      //               io.totalAmountNetAfter = data?.itemList[i]?.discountTotalAmountNet;
      //               io.custTotalDiscount = data?.itemList[i]?.custTotalDiscount;
      //               io.finalGpRate = data?.itemList[i]?.finalGpRate;
      //               io.gpRate = data?.itemList[i]?.gpRate;
      //               io.cost = data?.itemList[i]?.costPrice;
      //               io.pmsLastCost = data?.itemList[i]?.rmbPurchasePrice;
      //               io.pmlsLastGpRate = data?.itemList[i]?.pmsGpRate;
      //               io.gpRateGear = data?.itemList[i]?.gpRateGear;
      //               io.gpRateGearRate = data?.itemList[i]?.gpRateGearRate;

      //               return io;
      //             }
      //           }
      //         });
      //         const dataCalc = {
      //           ...newData,
      //           amount: data?.amount,
      //           amountNet: data?.amountNet,
      //           goodsAmount: data?.goodsAmount,
      //           goodsAmountNet: data?.goodsAmountNet,
      //           amountNew: data?.amountNew,
      //           amountNetNew: data?.amountNetNew,
      //           goodsAmountNew: data?.goodsAmountNew,
      //           goodsAmountNetNew: data?.goodsAmountNetNew,
      //           calcTotalDiscountPercent: data?.calcTotalDiscountPercent,
      //           calcTaxDiscount: data?.calcTaxDiscount,
      //           calcApplyDiscount: data?.calcApplyDiscount,
      //           calcApplyTaxDiscount: data?.calcApplyTaxDiscount,
      //           gpRate: data?.gpRate,
      //           pmsGpRate: data?.pmsGpRate,
      //           pmsGpRateDesc: data?.pmsGpRateDesc,
      //           finalGpRate: data?.finalGpRate,
      //           quotationLineRespVoPage: {
      //             ...newData?.quotationLineRespVoPage,
      //             list,
      //           },
      //         };
      //         setInfo(dataCalc);
      //         // 校验繁殖后端随便写数据
      //         sessionStorage.setItem('oldList1', JSON.stringify(dataCalc));
      //         setLoad(false);
      //       } else {
      //         message.error(errMsg);
      //         setLoad(false);
      //       }
      //     });
      //   } else {
      //     message.error(res.errMsg);
      //     setLoad(false);
      //   }
      // });
    }
  }, []);

  const showList = async (re: any) => {
    setLineSku(re.sku);
    historyModaRef?.current?.open();
  };
  const useLast = (): any => {
    if (
      !info?.quotationLineRespVoPage?.list?.some((io: any) => {
        //?如果全部为false才是不对的，此时进入报错逻辑
        return io.recentlySalePrice;
      })
    ) {
      return message.warning('当前报价单明细无历史成交价');
    }
    setInfo({
      ...info,
      quotationLineRespVoPage: {
        ...info.quotationLineRespVoPage,
        list: info?.quotationLineRespVoPage?.list?.map((io: any) => {
          if (
            io.recentlySalePrice && //?首先历史成交价必须存在，不存在就不改了，跳过
            (!io?.quotationLineDiscountRespVoList ||
              (io?.quotationLineDiscountRespVoList?.every((ic: any) => {
                return (
                  ic.discountCode != 'YPR0' &&
                  ic.discountCode != 'YD17' &&
                  ic.discountCode != 'YD25'
                );
              }) &&
                io.allowApplyHelpDiscount !== 0 &&
                io.skuType != 20))
          ) {
            io.applySalesPrice = io.recentlySalePrice;
          }
          return io;
        }),
      },
    });
    setTimeout(() => {
      getTotal(true, false, false, '', -1);
    }, 100);
  };
  const columns: ProColumns<ProColumns>[] = [
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
      title: 'SKU号',
      width: 100,
      dataIndex: 'sku',
      fixed: 'left',
    },
    {
      title: 'SKU标签',
      width: 110,
      dataIndex: 'skuTagList',
      fixed: 'left',
      render(_, record: any) {
        const config = {
          囤: 'orange',
          新seg: 'magenta',
          克伦威尔: 'purple',
        };
        const dom = record?.skuTagList?.map((item: any) => (
          <Tag color={config[item]} key={item}>
            {item}
          </Tag>
        ));
        return <Popover content={dom}>{dom}</Popover>;
      },
    },
    {
      title: '采购GP%档位',
      fixed: 'left',
      width: 120,
      dataIndex: 'gpRateGear',
      render: (_, record: any) => {
        return (
          <>
            {record.gpRateGear == '红色警告' ? (
              <span style={{ color: '#f00' }}>红色警告</span>
            ) : record.gpRateGear == '正常' ? (
              '正常'
            ) : (
              '-'
            )}
          </>
        );
      },
    },
    {
      title: 'SKU类型',
      width: 100,
      dataIndex: 'skuTypeName',
    },
    {
      title: 'SKU类型',
      width: 100,
      dataIndex: 'skuTypeName',
    },
    {
      title: '中文名称',
      width: 250,
      dataIndex: 'productNameZh',
      render: (_, record: any) => {
        return `${record?.brandName} ${record?.productNameZh} ${record?.mfgSku}`;
      },
    },
    {
      title: '数量',
      width: 80,
      dataIndex: 'qty',
    },
    {
      title: '含税面价',
      width: 80,
      dataIndex: 'listPrice',
    },
    {
      title: '原成交价-含税',
      width: 180,
      dataIndex: 'salesPrice',
    },
    {
      title: '原成交价折扣类型',
      width: 180,
      dataIndex: 'discountCode',
    },
    {
      title: '历史成交价含税',
      width: 180,
      dataIndex: 'recentlySalePrice',
      render: (_, record: any) => {
        return (
          <div style={{ display: 'flex' }}>
            <p style={{ flex: 1 }}>{record.recentlySalePrice}</p>
            <Tooltip title="查看历史成交价">
              <div onClick={() => showList(record)} style={{ width: '7%', textAlign: 'right' }}>
                <ProfileTwoTone />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: '建议成交价-含税',
      width: 180,
      dataIndex: 'suggestSalesPrice',
    },
    {
      title: '建议折扣%',
      width: 100,
      dataIndex: 'suggestDiscountPercent',
    },
    {
      title: '申请成交价-含税',
      width: 120,
      dataIndex: 'applySalesPrice',
      render: (_, record: any, index) => {
        return (
          <InputNumber
            value={record.applySalesPrice}
            disabled={
              record?.quotationLineDiscountRespVoList?.some(
                (io: any) =>
                  io.discountCode == 'YPR0' ||
                  io.discountCode == 'YD17' ||
                  io.discountCode == 'YD25',
              ) ||
              record.skuType == 20 ||
              record.allowApplyHelpDiscount == 0
                ? true
                : false
            }
            min={0.01}
            onChange={(val) => {
              record.applySalesPrice = Number(val);
              setInfo({
                ...info,
                quotationLineRespVoPage: {
                  ...info.quotationLineRespVoPage,
                  list: info?.quotationLineRespVoPage?.list?.map((io: any) => {
                    if (io.quotLineId === record.quotLineId) {
                      io = record;
                    }
                    return io;
                  }),
                },
              });
              setTimeout(() => {
                getTotal(true, false, false, '', index);
              }, 100);
            }}
            onInput={() => {
              setApplySalesStatus(true);
              setApplyPercentStatus(false);
              setApllySalesNetStatus(false);
              setMark('');
              form.setFieldsValue({
                applyDiscountRate: '',
              });
            }}
          />
        );
      },
    },
    {
      title: '申请成交价-未税',
      width: 120,
      dataIndex: 'applySalesPriceNet',
      render: (_, record: any, index) => {
        return (
          <InputNumber
            value={record.applySalesPriceNet}
            disabled={
              record?.quotationLineDiscountRespVoList?.some(
                (io: any) =>
                  io.discountCode == 'YPR0' ||
                  io.discountCode == 'YD17' ||
                  io.discountCode == 'YD25',
              ) ||
              record.skuType == 20 ||
              record.allowApplyHelpDiscount == 0
                ? true
                : false
            }
            min={0.01}
            onChange={(val) => {
              console.log(record, index)
              record.applySalesPriceNet = Number(val);
              // record.applySalesPrice = Number((record.applySalesPriceNet * (1 + 0.13)).toFixed(2));
              // record.applyDiscountPercent = Number(
              //   ((record.applySalesPrice - record.salesPrice) / record.salesPrice).toFixed(2),
              // );
              setInfo({
                ...info,
                quotationLineRespVoPage: {
                  ...info.quotationLineRespVoPage,
                  list: info?.quotationLineRespVoPage?.list?.map((io: any) => {
                    if (io.quotLineId === record.quotLineId) {
                      io = record;
                    }
                    return io;
                  }),
                },
              });

              setTimeout(() => {
                getTotal(false, true, false, '', index);
              }, 100);
            }}
            onInput={() => {
              setApllySalesNetStatus(true);
              setApplySalesStatus(false);
              setApplyPercentStatus(false);
              setMark('');
              form.setFieldsValue({
                applyDiscountRate: '',
              });
            }}
          />
        );
      },
    },
    {
      title: '申请折扣%',
      width: 120,
      dataIndex: 'applyDiscountPercent',
      render: (_, record: any, index) => {
        return (
          <InputNumber
            value={record.applyDiscountPercent}
            disabled={
              record?.quotationLineDiscountRespVoList?.some(
                (io: any) =>
                  io.discountCode == 'YPR0' ||
                  io.discountCode == 'YD17' ||
                  io.discountCode == 'YD25',
              ) ||
              record.skuType == 20 ||
              record.allowApplyHelpDiscount == 0
                ? true
                : false
            }
            // max={99} 放开最大值
            min={-99.999}
            onChange={(val) => {
              record.applyDiscountPercent = Number(val);
              // record.applySalesPrice = Number(
              //   record.salesPrice * ((100 - record.applyDiscountPercent) / 100) > 0
              //     ? (record.salesPrice * ((100 + record.applyDiscountPercent) / 100)).toFixed(2)
              //     : (1 + record.applyDiscountPercent).toFixed(2),
              // );
              // record.applySalesPrice = Number(
              //   (record.salesPrice * ((100 + record.applyDiscountPercent) / 100)).toFixed(2),
              // );
              // record.applySalesPriceNet = Number((record.applySalesPrice / (1 + 0.13)).toFixed(2));
              setInfo({
                ...info,
                quotationLineRespVoPage: {
                  ...info.quotationLineRespVoPage,
                  list: info?.quotationLineRespVoPage?.list?.map((io: any) => {
                    if (io.quotLineId === record.quotLineId) {
                      io = record;
                    }
                    return io;
                  }),
                },
              });

              setTimeout(() => {
                getTotal(false, false, true, '', index);
              }, 100);
            }}
            onInput={() => {
              setApplyPercentStatus(true);
              setApplySalesStatus(false);
              setApllySalesNetStatus(false);
              setMark('');
              form.setFieldsValue({
                applyDiscountRate: '',
              });
            }}
          />
        );
      },
    },
    {
      title: '折前行小计-含税',
      width: 180,
      dataIndex: 'totalAmount',
    },
    {
      title: '折前行小计-未税',
      width: 180,
      dataIndex: 'totalAmountNet',
    },
    {
      title: '折后行小计-含税',
      width: 180,
      dataIndex: 'totalAmountAfter',
    },
    {
      title: '折后行小计-未税',
      width: 180,
      dataIndex: 'totalAmountNetAfter',
    },
    {
      title: '签约折扣%',
      width: 100,
      dataIndex: 'contractDiscountPerc',
    },
    {
      title: '累计折扣%',
      width: 100,
      dataIndex: 'custTotalDiscount', ///  累计折扣 = 面价-申请成交价含税
      // render: (_, record: any) => {
      //   if (isNaN(Number((record?.listPrice - record?.applySalesPrice).toFixed(2)))) {
      //     return 0;
      //   } else {
      //     return (record?.listPrice - record?.applySalesPrice).toFixed(2);
      //   }
      // },
    },
    {
      title: '可用库存数量',
      width: 130,
      dataIndex: 'stockCount',
    },
    {
      title: 'GpRate%',
      width: 100,
      dataIndex: 'gpRate',
      render: () => {
        return <span>***</span>;
      },
    },
    {
      title: 'Final GP%',
      width: 100,
      dataIndex: 'finalGpRate',
      render: () => {
        return <span>***</span>;
      },
    },
    {
      title: '成本价',
      width: 100,
      dataIndex: 'cost',
      render: () => {
        return <span>***</span>;
      },
    },
    {
      title: 'PMS最新采购价',
      width: 180,
      dataIndex: 'pmsLastCost',
      render: () => {
        return <span>***</span>;
      },
    },
    {
      title: 'PMS最新采购GP%',
      width: 180,
      dataIndex: 'pmlsLastGpRate',
      render: () => {
        return <span>***</span>;
      },
    },
    {
      title: '备注',
      width: 100,
      dataIndex: 'remark',
    },
    {
      title: '原成交价报价到期日',
      width: 180,
      dataIndex: 'quotValidDate',
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  // const importFile = () => { };

  const writeAll = async () => {
    if (!mark || mark == null) {
      message.error('请输入折扣率');
      return;
    }

    // setTimeout(() => {
    //   getTotal(applySalesStatus, apllySalesNetStatus, applyPercentStatus, mark, -1);
    // }, 300);
  };

  const submit = async (values: any) => {
    setLoadding(true);
    // const filterData = info?.quotationLineRespVoPage?.list?.filter(
    //   (io: any) =>
    //     !io.quotationLineDiscountRespVoList ||
    //     (io?.quotationLineDiscountRespVoList?.some((ic: any) => ic.discountCode != 'YPR0' &&  ic.discountCode != 'YD17' && ic.discountCode != 'YD25') &&
    //       io.skuType != 20),
    // );
    const par = {
      sid: info.sid,
      applyDiscountRate: info?.calcApplyDiscount,
      // applyDiscountRate: values.applyDiscountRate || null,
      applyReason: values.applyReason,
      calcApplyTaxDiscount: info?.calcApplyTaxDiscount,
      gpRate: info?.gpRate,
      finalGpRate: info?.finalGpRate,
      calcTotalDiscountPercent: info?.calcTotalDiscountPercent,
      calcTaxDiscount: info?.calcTaxDiscount,
      pmsGpRate: info?.pmsGpRate, //新加
      pmsGpRateDesc: info?.pmsGpRateDesc,
      resourceVOList: fileList,
      newCustomerTag: info?.newCustomerTag,
      approvalDiscountLineReqVoList: info?.quotationLineRespVoPage?.list?.map((ic: any) => ({
        sid: ic.quotLineId, //必填但是后端返回导出的excel无此参数
        applyDiscountPercent: ic.applyDiscountPercent,
        applySalesPriceNet: ic.applySalesPriceNet,
        applySalesPrice: ic.applySalesPrice,
        ...ic,
        productNameZh: `${ic?.brandName}  ${ic?.productNameZh}  ${ic?.mfgSku}`,
      })),
      deptName: info?.deptName,
      customerCode: info?.customerCode,
      amountNetNew: info?.amountNetNew,
    };
    //行信息数据过滤csp的  discountCode = 'YPR0'
    // 区分入口出口
    if (from === 'need') {
      // 需求单审批流提交
      // await approvalDiscountWorkFlow(par).then((res: any) => {
      //   const { errCode, errMsg } = res;
      //   if (errCode == 200) {
      //     message.success('提交成功');
      //     setLoadding(false);
      //     onClose && onClose(false);
      //   } else {
      //     message.error(errMsg);
      //     setLoadding(false);
      //   }
      // });
    } else {
      // await approvalDiscount(par).then((res: any) => {
      //   const { errCode, errMsg } = res;
      //   if (errCode == 200) {
      //     message.success('提交成功');
      //     setLoadding(false);
      //     onClose && onClose(false);
      //   } else {
      //     message.error(errMsg);
      //     setLoadding(false);
      //   }
      // });
    }
  };

  // 上传文件
  const uploadProps = {
    name: 'file',
    maxCount: 1,
    accept: '.xls,.xlsx',
    action: `${getEnv()}/omsapi/quotation/import/detail/${info?.sid}`,
    headers: {
      token: Cookies.get('ssoToken'),
    },
    beforeUpload(): any {
      if (!info?.sid) return Upload.LIST_IGNORE;
    },
    async onChange(msg: any) {
      if (msg.file.status !== 'uploading') {
      }
      if (msg.file.status === 'done') {
        // if (msg?.file?.response?.errCode === 200) {
        //   const dataList = msg?.file?.response?.data;
        //   // 重新刷新数据
        //   const newListNew = info?.quotationLineRespVoPage?.list
        //     ?.map((io: any) => {
        //       for (let i = 0; i < info?.quotationLineRespVoPage?.list?.length; i++) {
        //         if (io.quotLineId == dataList[i]?.sid) {
        //           io.sid = dataList[i]?.sid;
        //           (io.bizStatus =
        //             (!io.quotationLineDiscountRespVoList ||
        //               io?.quotationLineDiscountRespVoList?.some(
        //                 (ic: any) =>
        //                   ic.discountCode != 'YPR0' &&
        //                   ic.discountCode != 'YD17' &&
        //                   ic.discountCode != 'YD25',
        //               )) &&
        //             io.allowApplyHelpDiscount !== 0 &&
        //             io.skuType != 20
        //               ? 11
        //               : 31), //31不参与批量折扣
        //             (io.discountRate = dataList[i]?.applyDiscountPercent);
        //           io.applySalesPrice = dataList[i]?.applySalesPrice;
        //           io.applySalesPriceNet = dataList[i]?.applySalesPriceNet;
        //           io.salesPrice = dataList[i]?.salesPrice;
        //           io.listPrice = io.listPrice;
        //           io.costPrice = io.cost;
        //           io.qty = io.qty;
        //           io.sku = dataList[i]?.sku;
        //           return io;
        //         }
        //       }
        //     })
        //     ?.filter((ic: any) => ic);
        //   const newList = [
        //     ...newListNew,
        //     ...info?.quotationLineRespVoPage?.list
        //       ?.filter((io: any) => !newListNew.some((ic: any) => io.quotLineId == ic.sid))
        //       ?.map((iq: any) => ({ ...iq, sid: iq.quotLineId, costPrice: iq.cost })),
        //   ];

        //   const par = {
        //     volumeDiscountTag: 0,
        //     // volumeDiscountRate: mark,
        //     freightTag: 1,
        //     freight: info?.freight || 0,
        //     interFreight: info?.interFreight || 0,
        //     tariff: info?.tariff || 0,
        //     querySource: 1,
        //     totalFreight: info?.totalFreight || 0,
        //     itemList: newList,
        //     deptName: info?.deptName || '',
        //     customerCode: info?.customerCode,
        //   };
        //   await calcCsp(par).then((res1: any) => {
        //     const { data, errCode, errMsg } = res1;
        //     if (errCode === 200) {
        //       const list = newList?.map((io: any) => {
        //         for (let i = 0; i < data?.itemList?.length; i++) {
        //           if (io.quotLineId == data?.itemList[i]?.sid) {
        //             io.applyDiscountPercent = data?.itemList[i]?.discountRate;
        //             io.applySalesPrice = data?.itemList[i]?.applySalesPrice;
        //             io.applySalesPriceNet = data?.itemList[i]?.applySalesPriceNet;
        //             io.totalAmount = data?.itemList[i]?.totalAmount;
        //             io.totalAmountNet = data?.itemList[i]?.totalAmountNet;
        //             io.totalAmountAfter = data?.itemList[i]?.discountTotalAmount;
        //             io.totalAmountNetAfter = data?.itemList[i]?.discountTotalAmountNet;
        //             io.custTotalDiscount = data?.itemList[i]?.custTotalDiscount;
        //             io.finalGpRate = data?.itemList[i]?.finalGpRate;
        //             io.gpRate = data?.itemList[i]?.gpRate;
        //             io.cost = data?.itemList[i]?.costPrice;
        //             io.pmsLastCost = data?.itemList[i]?.rmbPurchasePrice;
        //             io.pmlsLastGpRate = data?.itemList[i]?.pmsGpRate;
        //             io.gpRateGear = data?.itemList[i]?.gpRateGear;
        //             io.gpRateGearRate = data?.itemList[i]?.gpRateGearRate;

        //             return io;
        //           }
        //         }
        //       });
        //       setInfo({
        //         ...info,
        //         amount: data?.amount,
        //         amountNet: data?.amountNet,
        //         goodsAmount: data?.goodsAmount,
        //         goodsAmountNet: data?.goodsAmountNet,
        //         amountNew: data?.amountNew,
        //         amountNetNew: data?.amountNetNew,
        //         goodsAmountNew: data?.goodsAmountNew,
        //         goodsAmountNetNew: data?.goodsAmountNetNew,
        //         calcTotalDiscountPercent: data?.calcTotalDiscountPercent,
        //         calcTaxDiscount: data?.calcTaxDiscount,
        //         calcApplyDiscount: data?.calcApplyDiscount,
        //         calcApplyTaxDiscount: data?.calcApplyTaxDiscount,
        //         gpRate: data?.gpRate,
        //         finalGpRate: data?.finalGpRate,
        //         pmsGpRate: data?.pmsGpRate, //新加
        //         pmsGpRateDesc: data?.pmsGpRateDesc, //新加
        //         quotationLineRespVoPage: {
        //           ...info?.quotationLineRespVoPage,
        //           list,
        //         },
        //       });
        //       // sessionStorage.removeItem('oldList1');
        //     } else {
        //       setTimeout(() => {
        //         message.error(errMsg);
        //       }, 2000);
        //       // 计算出错了
        //       const sdata = sessionStorage.getItem('oldList1') as any;
        //       setInfo(JSON.parse(sdata));
        //     }
        //   });
        //   message.success(`${msg.file.name} file uploaded successfully`, 1);
        //   setTimeout(() => {
        //     setModalVisible(false);
        //   }, 2000);
        // } else {
        //   message.error(`${msg?.file?.response?.errMsg}`);
        //   setTimeout(() => {
        //     setModalVisible(false);
        //   }, 2000);
        // }
      } else if (msg.file.status === 'error') {
        message.error(`${msg.file.name} file upload failed.`);
      }
    },
  };

  // 导出数据
  const exportData = async () => {
    const par = {
      sid: info.sid,
      querySource: 1,
      approvalExcelVoFrontList: info?.quotationLineRespVoPage?.list?.map((io: any) => ({
        sid: io.quotLineId,
        skuType: io.skuType,
        sku: io.sku,
        salesPrice: io.salesPrice,
        applySalesPrice:
          io.applySalesPrice ||
          Number((io.salesPrice * ((100 + (io.applyDiscountPercent || 0)) / 100)).toFixed(2)),
        applySalesPriceNet:
          io.applySalesPriceNet ||
          Number(
            ((io.salesPrice * (100 + (io.applyDiscountPercent || 0))) / 100 / (1 + 0.13)).toFixed(
              2,
            ),
          ),
        applyDiscountPercent: io.applyDiscountPercent || 0,
        remark: io.remark,
      })),
    };
    if (par?.sid)
      await exportHelpData(par).then((res: any) => {
        const { data } = res;
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const resContent = reader.result ? JSON.parse(reader.result.toString()) : '';
            if (resContent.statusCode) {
              message.error(resContent.errMsg);
            }
          } catch {
            const el = document.createElement('a');
            el.style.display = 'none';
            el.href = URL.createObjectURL(data);
            el.download = '报价单报价明细.xlsx';
            document.body.append(el);
            el.click();
            window.URL.revokeObjectURL(el.href);
            document.body.removeChild(el);
          }
        };
        reader.readAsText(data);
      });
  };

  useEffect(() => {
    //支付条件匹配
    // getSelectList({ type: 'paymentTerm' }).then((res: any) => {
    //   const { errCode, data } = res;
    //   if (errCode === 200) {
    //     const obj = {} as any;
    //     data?.dataList?.map((io: any) => {
    //       obj[io.key] = io.value;
    //     });
    //     setPayEnum(obj);
    //   }
    // });
  }, []);
  const colorList: any = {
    黄色: '#f1db08',
    红色: '#F00',
    绿色: '#35f312',
    黄色警告: '#f1db08',
    红色警告: '#F00',
    绿色警告: '#35f312',
  };

  return (
    <div className="form-content-search" id="modalApplyCheckContent">
      <Spin spinning={load}>
        <ProForm
          form={form}
          layout="horizontal"
          className="has-gridForm"
          onFinish={(values) => submit(values)}
          onFinishFailed={() => {
            message.warning('您有未完善的信息，请填写正确的信息');
          }}
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
                    <Button onClick={() => onClose(false)}>取消</Button>
                    <Button type="primary" htmlType="submit" loading={loadding} disabled={errorMsg}>
                      提交申请
                    </Button>
                  </Space>
                </div>
              );
            },
          }}
        >
          <Card title="报价单运费信息" bordered={false} bodyStyle={{ paddingBottom: 0 }}>
            <ProDescriptions className="pr-desc-cust" actionRef={actionRef} dataSource={info}>
              <ProDescriptions.Item dataIndex="quotCode" label="报价单号" />
              <ProDescriptions.Item dataIndex="customerCode" label="客户号" />
              <ProDescriptions.Item dataIndex="customerName" label="客户名称" />
              <ProDescriptions.Item dataIndex="contactName" label="R3联系人" />
              <ProDescriptions.Item dataIndex="salesName" label="主销售" />
              <ProDescriptions.Item label="支付条件">
                {payEnum[info?.paymentTerm]}
              </ProDescriptions.Item>
              <ProDescriptions.Item dataIndex="amount" label="原含税总金额" />
              <ProDescriptions.Item dataIndex="amountNet" label="原未税总金额" />
              {/* 还没 */}
              <ProDescriptions.Item dataIndex="goodsAmount" label="原含税货品总计" />
              <ProDescriptions.Item dataIndex="goodsAmountNet" label="原未税货品总计" />
              {/* 计算接口获取 */}
              <ProDescriptions.Item dataIndex="amountNew" label="新含税总金额" />
              <ProDescriptions.Item dataIndex="amountNetNew" label="新未税总金额" />
              <ProDescriptions.Item dataIndex="goodsAmountNew" label="新含税货品总计" />
              <ProDescriptions.Item dataIndex="goodsAmountNetNew" label="新未税货品总计" />

              <ProDescriptions.Item dataIndex="calcTotalDiscountPercent" label="累计折扣%" />
              <ProDescriptions.Item dataIndex="calcTaxDiscount" label="累计含税折扣" />

              <ProDescriptions.Item dataIndex="A" label="申请折扣%" />
              <ProDescriptions.Item dataIndex="calcApplyTaxDiscount" label="申请含税折扣" />
              <ProDescriptions.Item
                dataIndex="gpRate"
                label="GP Rate%"
                render={() => {
                  return '***';
                }}
              />
              <ProDescriptions.Item
                dataIndex="finalGpRate"
                label="Final GP%"
                render={() => {
                  return '***';
                }}
              />
              <ProDescriptions.Item
                dataIndex="pmsGpRate"
                label="PMS最新采购GP%"
                render={() => {
                  return '***';
                }}
              />
              <ProDescriptions.Item
                dataIndex="pmsGpRateDesc"
                label="GP档位"
                renderText={(text: any, record: any) => {
                  return <strong style={{ color: colorList[record.pmsGpRateDesc] }}>{text}</strong>;
                }}
              />
              <ProDescriptions.Item
                dataIndex="oldBgGpRate"
                label="原BG-GP%"
                render={() => {
                  return '***';
                }}
              />
              <ProDescriptions.Item
                dataIndex="newBgGpRate"
                label="新BG-GP%"
                render={() => {
                  return '***';
                }}
              />
              <ProDescriptions.Item
                dataIndex="oldCustomerGpRate"
                label="原客户GP%"
                render={() => {
                  return '***';
                }}
              />
              <ProDescriptions.Item
                dataIndex="newCustomerGpRate"
                label="新客户GP%"
                render={() => {
                  return '***';
                }}
              />
              <ProDescriptions.Item
                dataIndex="newCustomerTag"
                label="客户标签"
                render={(text: any) => {
                  return <Tag color={text === '新客' ? 'green' : 'gray'}>{text}</Tag>;
                }}
              />
            </ProDescriptions>
          </Card>
          <Card title="报价明细" bordered={false} bodyStyle={{ paddingBottom: 0 }}>
            <ProTable<ProColumns>
              tableStyle={{ padding: 0, marginTop: '0' }}
              className="cust-table"
              columns={columns}
              bordered
              rowClassName={(record, index) => {
                if (record.error) {
                  return 'rowBorderColor'
                }
                return ''
              }}
              size="small"
              dataSource={info?.quotationLineRespVoPage?.list}
              pagination={{
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                // showTotal: total => `共有 ${total} 条数据`,
                showTotal: (total, range) =>
                  `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
                showQuickJumper: true,
              }}
              options={false}
              search={false}
              rowKey="quotLineId"
              actionRef={tableRef}
              scroll={{ x: 200, y: 600 }}
              headerTitle={
                <Space style={{ marginBottom: '10px' }}>
                  <ProForm.Group>
                    <ProFormDigit
                      label="折扣率"
                      name="applyDiscountRate"
                      width="sm"
                      // max={99} 放开最大值
                      min={-99.999}
                      fieldProps={{
                        onChange: (val) => {
                          setMark(String(val));
                          // setInfo({
                          //   ...info,
                          // });
                          return val;
                        },
                      }}
                    />
                  </ProForm.Group>
                  <Button
                    onClick={writeAll}
                    size="large"
                    type="primary"
                    ghost={true}
                    style={{ marginTop: '-2px' }}
                  >
                    批量修改
                  </Button>
                  <Button
                    size="large"
                    onClick={() => setModalVisible(true)}
                    type="primary"
                    ghost={true}
                    style={{ marginTop: '-2px' }}
                  >
                    导入
                  </Button>
                  <Button
                    size="large"
                    onClick={useLast}
                    type="primary"
                    ghost={true}
                    style={{ marginTop: '-2px' }}
                  >
                    使用最近成交价
                  </Button>
                </Space>
              }
            />
            <div className="tip-text">
              <p>注：1.申请成交价-含税、申请成交价-未税、申请折扣三项任填一项即可；</p>
              <p>
                <span>2.导入时，上述三值不关联计算，请确认数据无误；</span>
              </p>
            </div>
            <ProFormTextArea
              name="applyReason"
              label="申请原因"
              required
              placeholder={'请输入，最多255字'}
              fieldProps={{ required: true, maxLength: 255, showCount: true }}
            />
          </Card>
          {from != 'need' && (
            <Card title="附件" bordered={false} bodyStyle={{ paddingLeft: 0, marginLeft: '-20px' }}>
              <UploadList
                getData={(val: any) => setFileList(val)}
                sourceData={paramsFile.resourceVOList}
                createName={paramsFile.createName}
              />
            </Card>
          )}
        </ProForm>
        {/* modal import */}
        {/* upload */}
        <ModalForm
          title="导入助力申请明细"
          visible={modalVisible}
          onVisibleChange={setModalVisible}
          modalProps={{ destroyOnClose: true }}
          style={{ margin: '10px 0', marginLeft: '-10px', paddingLeft: '20px' }}
          submitter={{
            searchConfig: {
              submitText: '确认',
              resetText: '取消',
            },
          }}
          onFinish={async () => {
            return true;
          }}
        >
          <p style={{ paddingBottom: '10px' }}>
            请先点击【导出报价明细】，在Excel中编辑申请价格后再导入
          </p>
          <Button type="link" onClick={exportData} style={{ marginLeft: '-10px' }}>
            导出报价明细
          </Button>
          <Upload {...uploadProps} accept=".xls, .xlsx" maxCount={1}>
            <Button type="primary">导入文件</Button>
          </Upload>
        </ModalForm>
        <HistoryListModal sku={lineSku} customerCode={info?.customerCode} ref={historyModaRef} />
      </Spin>
    </div>
  );
};

export default ApplyCheck;
