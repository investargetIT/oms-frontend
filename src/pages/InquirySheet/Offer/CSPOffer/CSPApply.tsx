/* eslint-disable no-param-reassign */
import {
  approvalDiscountCsp,
  approvalDiscountCspWorkFlow,
  calcCsp,
  exportHelpData,
  getItelmListCsp,
  offerDetail,
  offerDetailNeed,
} from '@/services/InquirySheet/offerOrder';
import { getEnv } from '@/services/utils';
import ProDescriptions from '@ant-design/pro-descriptions';
import { ModalForm, ProForm, ProFormDigit, ProFormTextArea } from '@ant-design/pro-form';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Space,
  Tooltip,
  Upload,
  Spin,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, history } from 'umi';
import Cookies from 'js-cookie';
import '../style.less';
import './index.less';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { getSelectList } from '@/services/InquirySheet';
import * as fp from 'lodash';
import UploadList from '../../../SalesOrder/OrderModificationApplication/components/UploadList';

type CSPApplyProps = Record<string, any>;

const CSPApply: React.FC<CSPApplyProps> = () => {
  const params: { id?: any } = useParams() as any;
  const query = useLocation() as any;
  // const { destroyCom } = useModel('tabSelect');
  const [form] = Form.useForm();
  const [info, setInfo] = useState<any>({});
  const [mark, setMark] = useState<any>('');
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [payEnum, setPayEnum] = useState<any>({});
  const [isDiscount, setIsDiscount] = useState<any>(true);
  const [loadding, setLoadding] = useState<any>(false);
  const [load, setLoad]: any = useState(false);
  const formRef = useRef<any>();
  const actionRef = useRef<any>();

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(15);
  const [applyStatus, setApplyStatus]: any = useState();
  const [paramsFile] = useState<any>({});
  const [fileList, setFileList] = useState<any>([]);
  const [applyToCom, setapplyToCom]: any = useState();
  const [showVDate, setshowVDate]: any = useState();
  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

  const getTotal = async (a, p, m) => {
    const par = {
      volumeDiscountTag: m ? 1 : 0,
      volumeDiscountRate: m,
      freightTag: 0,
      querySource: 2,
      tariff: info?.tariff || 0,
      totalFreight: info?.totalFreight || 0,
      itemList: info?.dataList?.map((io: any) => ({
        sid: io.sid,
        bizStatus: io.bizStatus,
        discountRate: p ? io.applyDiscountPercent : null,
        applySalesPrice: a ? io.applySalesPrice : null,
        salesPrice: io.salesPrice,
        listPrice: io.listPrice,
        costPrice: io.cost,
        qty: io.reqQty,
        rmbPurchasePrice: io.rmbPurchasePrice,
        rmbMovingAverageCost: io.rmbMovingAverageCost,
      })),
      deptName: info?.deptName || '',
      customerCode: info?.customerCode,
    };
    const { data, errCode, errMsg } = await calcCsp(par);
    if (errCode == 200) {
      const list = info?.dataList?.map((io: any) => {
        for (let i = 0; i < data?.itemList?.length; i++) {
          if (io.sid == data?.itemList[i]?.sid) {
            io.applyDiscountPercent = data?.itemList[i].discountRate;
            io.applySalesPrice = data?.itemList[i].applySalesPrice;
            io.applySalesPriceNet = data?.itemList[i].applySalesPriceNet;
            io.purchseAmount = fp.round(data?.itemList[i].applySalesPrice * io.reqQty, 2);
            io.cspLockGp = fp.round(
              ((data?.itemList[i]?.applySalesPrice - data?.itemList[i]?.rmbPurchasePrice) /
                data?.itemList[i]?.applySalesPrice) *
                100,
              2,
            );
            io.cspLockAverageGp = fp.round(
              ((data?.itemList[i]?.applySalesPrice - data?.itemList[i]?.rmbMovingAverageCost) /
                data?.itemList[i]?.applySalesPrice) *
                100,
              2,
            );
            return io;
          }
        }
      });
      setInfo({
        ...info,
        amount: data?.amount,
        amountNet: data?.amountNet,
        goodsAmount: data?.goodsAmount,
        goodsAmountNet: data?.goodsAmountNet,
        amountNew: data?.amountNew,
        amountNetNew: data?.amountNetNew,
        goodsAmountNew: data?.goodsAmountNew,
        goodsAmountNetNew: data?.goodsAmountNetNew,
        calcTotalDiscountPercent: data?.calcTotalDiscountPercent,
        calcTaxDiscount: data?.calcTaxDiscount,
        calcApplyDiscount: data?.calcApplyDiscount,
        calcApplyTaxDiscount: data?.calcApplyTaxDiscount,
        gpRate: data?.gpRate,
        finalGpRate: data?.finalGpRate,
        finalGpRateDesc: data?.finalGpRateDesc,
        dataList: list,
      });
    } else {
      message.error(errMsg);
    }
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
      title: 'Product Line',
      width: 150,
      dataIndex: 'productLineId',
      render: (_, record: any) => {
        return record?.productLineName;
      },
    },
    {
      title: 'Segment',
      width: 100,
      dataIndex: 'segmentId',
      render: (_, record: any) => {
        return record?.segmentName;
      },
    },
    {
      title: 'Family',
      width: 100,
      dataIndex: 'familyId',
      render: (_, record: any) => {
        return record?.familyName;
      },
    },
    {
      title: 'Category',
      width: 200,
      dataIndex: 'Category',
      render: (_, record: any) => {
        return record?.categoryName;
      },
    },
    {
      title: 'PM',
      width: 100,
      dataIndex: 'pm',
    },
    {
      title: '品牌',
      width: 100,
      dataIndex: 'brandName',
    },
    {
      title: '产品描述',
      width: 260,
      dataIndex: 'productDesc',
      render: (_, record: any) => {
        return `${record?.brandName}  ${record?.productDesc} ${record?.mfgSku}`;
      },
    },
    {
      title: '制造商型号',
      width: 100,
      dataIndex: 'mfgSku',
    },
    {
      title: '折扣类型',
      width: 80,
      dataIndex: 'discountCode',
      hideInTable: true,
    },
    {
      title: '产品业务状态',
      width: 150,
      dataIndex: 'bizStatus',
      hideInTable: true,
    },
    {
      title: '客户SKU',
      width: 150,
      dataIndex: 'customerSku',
      // className: 'red',
      render: (_, record: any) => {
        return (
          <Input
            placeholder="请输入"
            disabled={record.bizStatus == 21 || record.bizStatus == 31 ? true : false}
            value={record.customerSku}
            onChange={(val: any) => {
              record.customerSku = val?.target?.value;
              setInfo({
                ...info,
                dataList: info?.dataList.map((io: any) => {
                  if (io.sid === record.sid) {
                    io = record;
                  }
                  return io;
                }),
              });
              return val?.target?.value;
            }}
          />
        );
      },
    },
    {
      title: '数量',
      width: 150,
      dataIndex: 'reqQty',
    },
    {
      title: '销售单位',
      width: 150,
      dataIndex: 'salesUomCode',
    },
    {
      title: '面价含税',
      width: 150,
      dataIndex: 'listPrice',
    },
    {
      title: '报价单成交价含税',
      width: 150,
      dataIndex: 'salesPrice',
    },
    {
      title: '预计采购额含税',
      width: 150,
      dataIndex: 'purchseAmount',
    },
    {
      title: '最近一次CSP锁价或助力价格',
      width: 200,
      dataIndex: 'cspLockPrice',
    },
    {
      title: '最近一次CSP锁价或助力价格截止时间',
      width: 260,
      dataIndex: 'cspValidTo',
    },
    {
      title: '建议锁定价含税',
      width: 150,
      dataIndex: 'suggestSalesPrice',
    },
    {
      title: '最近一次成交价',
      width: 150,
      dataIndex: 'lastSalePrice',
    },
    {
      title: '申请CSP锁定价含税',
      width: 150,
      className: 'red',
      dataIndex: 'applySalesPrice',
      render: (_, record: any) => {
        return (
          <InputNumber
            value={record.applySalesPrice}
            disabled={record.bizStatus == 21 || record.bizStatus == 31 ? true : false}
            min={0.01}
            onChange={(val) => {
              record.applySalesPrice = Number(val);
              // record.applySalesPriceNet = Number((record.applySalesPrice / (1 + 0.13)).toFixed(2));
              // record.applyDiscountPercent = Number(
              //   (((record.applySalesPrice - record.salesPrice) * 100) / record.salesPrice).toFixed(
              //     2,
              //   ),
              // );
              setInfo({
                ...info,
                dataList: info?.dataList.map((io: any) => {
                  if (io.sid === record.sid) {
                    io = record;
                  }
                  return io;
                }),
              });

              setTimeout(() => {
                getTotal(true, false, '');
              }, 100);
            }}
            onInput={() => {
              setIsDiscount(false);
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
      title: '申请CSP锁定价未税',
      width: 100,
      dataIndex: 'applySalesPriceNet',
      hideInTable: true,
      render: (_, record: any) => {
        return (
          <InputNumber
            value={record.applySalesPriceNet}
            disabled={record.bizStatus == 21 || record.bizStatus == 31 ? true : false}
            min={0.01}
            onChange={(val) => {
              record.applySalesPriceNet = Number(val);
              record.applySalesPrice = Number((record.applySalesPriceNet * (1 + 0.13)).toFixed(2));
              record.applyDiscountPercent = Number(
                ((record.applySalesPrice - record.salesPrice) / record.salesPrice).toFixed(2),
              );
              setInfo({
                ...info,
                dataList: info?.dataList.map((io: any) => {
                  if (io.sid === record.sid) {
                    io = record;
                  }
                  return io;
                }),
              });
              setIsDiscount(true);
              getTotal();
            }}
          />
        );
      },
    },
    {
      title: '申请折扣%',
      width: 150,
      dataIndex: 'applyDiscountPercent',
      className: 'red',
      render: (_, record: any) => {
        return (
          <InputNumber
            value={record.applyDiscountPercent}
            disabled={record.bizStatus == 21 || record.bizStatus == 31 ? true : false}
            // max={99} 放开最大值
            min={-99.999}
            onChange={(val) => {
              record.applyDiscountPercent = Number(val);
              // record.applySalesPrice = Number(
              //   (record.salesPrice * ((100 + record.applyDiscountPercent) / 100)).toFixed(2),
              // );
              // record.applySalesPriceNet = Number((record.applySalesPrice / (1 + 0.13)).toFixed(2));
              setInfo({
                ...info,
                dataList: info?.dataList.map((io: any) => {
                  if (io.sid === record.sid) {
                    io = record;
                  }
                  return io;
                }),
              });

              setTimeout(() => {
                getTotal(false, true, '');
              }, 100);
            }}
            onInput={() => {
              setIsDiscount(true);
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
      title: '近三个月销售数量',
      width: 200,
      dataIndex: 'threeMonthsSales',
    },
    {
      title: '近3个月销售含税总金额',
      width: 200,
      dataIndex: 'threeMonthsAmount',
    },
    {
      title: '近3个月平均含税单价',
      width: 200,
      dataIndex: 'threeMonthsPrice',
    },
    {
      title: '近12个月销售数量',
      width: 200,
      dataIndex: 'yearSales',
    },
    {
      title: '近12个月销售含税总金额',
      width: 200,
      dataIndex: 'yearAmount',
    },
    {
      title: '近12个月平均含税单价',
      width: 200,
      dataIndex: 'yearPrice',
    },
    {
      title: '最新采购价换算成RMB',
      width: 200,
      dataIndex: 'rmbPurchasePrice',
      hideInTable: true,
    },
    {
      title: '移动平均成本(RMB含税)',
      width: 200,
      dataIndex: 'rmbMovingAverageCost',
      hideInTable: true,
    },
    {
      title: '近3个月成交平均成本',
      width: 200,
      dataIndex: 'threeMonthsAverageCost',
      hideInTable: true,
    },
    {
      title: '近12个月成交平均成本',
      width: 200,
      dataIndex: 'yearAverageCost',
      hideInTable: true,
    },
    {
      title: 'GP0%(最新面价采购价)',
      width: 200,
      dataIndex: 'gpZero',
      hideInTable: true,
    },
    {
      title: '报价单GP%(原成交价移动成本)',
      width: 230,
      dataIndex: 'quotationGp',
      hideInTable: true,
    },
    {
      title: '本次申请锁价GP%-按最新采购价',
      width: 240,
      dataIndex: 'cspLockGp',
      hideInTable: true,
      // render: (_, record: any) => {
      //   const num = fp.round(
      //     ((record?.applySalesPrice - record?.rmbPurchasePrice) /
      //       record?.applySalesPrice) *
      //     100,
      //     2,
      //   );
      //   record.cspLockGp = num;
      //   return num;
      // },
    },
    {
      title: '本次申请锁价GP%-按移动平均成本',
      width: 250,
      dataIndex: 'cspLockAverageGp',
      hideInTable: true,
      // render: (_, record: any) => {
      //   const num = fp.round(
      //     ((record?.applySalesPrice - record?.rmbMovingAverageCost) / record?.applySalesPrice) * 100,
      //     2,
      //   );
      //   record.cspLockAverageGp = num;
      //   return num;
      // },
    },
    {
      title: '是否备货',
      width: 100,
      dataIndex: 'whetherStock',
      render: (_, record: any) => {
        return record.whetherStockStr;
      },
    },
    {
      title: '库存数量',
      width: 100,
      dataIndex: 'stockCount',
    },
    {
      title: '竞争对手',
      width: 150,
      dataIndex: 'competitor',
      render: (_, record: any) => {
        return (
          <Input
            placeholder="请输入"
            disabled={record.bizStatus == 21 || record.bizStatus == 31 ? true : false}
            maxLength={40}
            value={record?.competitor}
            onChange={(val: any) => {
              record.competitor = val?.target?.value;
              setInfo({
                ...info,
                dataList: info?.dataList.map((io: any) => {
                  if (io.sid === record.sid) {
                    io = record;
                  }
                  return io;
                }),
              });
              return val?.target?.value;
            }}
          />
        );
      },
    },
    {
      title: '竞争价格',
      width: 150,
      dataIndex: 'competitorPrice',
      render: (_, record: any) => {
        return (
          <InputNumber
            disabled={record.bizStatus == 21 || record.bizStatus == 31 ? true : false}
            value={record.competitorPrice}
            min={0.01}
            onChange={(val) => {
              record.competitorPrice = val;
              setInfo({
                ...info,
                dataList: info?.dataList.map((io: any) => {
                  if (io.sid === record.sid) {
                    io = record;
                  }
                  return io;
                }),
              });
              return val;
            }}
          />
        );
      },
    },
    {
      title: '期望有效日起',
      dataIndex: 'expectedDateFrom',
      className: 'red',
      width: 150,
      render: (_, record: any) => {
        return (
          <DatePicker
            disabled={record.bizStatus == 21 || record.bizStatus == 31 ? true : false}
            value={moment(record?.expectedDateFrom)}
            onChange={(mo: any, date: any) => {
              record.expectedDateFrom = date;
              if (
                info?.dataList.some(
                  (ele: any) =>
                    moment(ele.expectedDateTo).diff(moment(ele.expectedDateFrom), 'days') > 90,
                )
              ) {
                setshowVDate('超过3个月'); //?设置申请有效期
              } else {
                setshowVDate('不超过3个月');
              }
              setInfo({
                ...info,
                dataList: info?.dataList?.map((io: any) => ({ ...io, expectedDateFrom: date })),
              });
              actionRef?.current?.reload();
              return date;
            }}
            allowClear={false}
            disabledDate={(current: any) => {
              return current < moment().startOf('day');
            }}
          />
        );
      },
    },
    {
      title: '期望有效日止',
      dataIndex: 'expectedDateTo',
      className: 'red',
      width: 150,
      render: (_, record: any) => {
        return (
          <DatePicker
            value={moment(record?.expectedDateTo)}
            disabled={record.bizStatus == 21 || record.bizStatus == 31 ? true : false}
            onChange={(mo: any, date: any) => {
              record.expectedDateTo = date;
              if (
                info?.dataList.find((ele: any) => {
                  return moment(ele.expectedDateTo).diff(moment(ele.expectedDateFrom), 'days') > 90;
                })
              ) {
                setshowVDate('超过3个月'); //?设置申请有效期
              } else {
                setshowVDate('不超过3个月');
              }
              setInfo({
                ...info,
                dataList: info?.dataList?.map((io: any) => ({ ...io, expectedDateTo: date })),
              });
              actionRef?.current?.reload();
              return date;
            }}
            allowClear={false}
            disabledDate={(current: any) => {
              return (
                (current && current > moment(record?.expectedDateFrom).add(1, 'years')) ||
                current < moment(record?.expectedDateFrom)
              );
            }}
          />
        );
      },
    },
    {
      title: '申请有效期（天）',
      dataIndex: 'requestValidity',
      className: 'red',
      width: 150,
      render: (_, record: any) => {
        return (
          <span>
            {moment(info?.dataList.find((ele: any) => ele.sid === record.sid).expectedDateTo).diff(
              moment(info?.dataList.find((ele: any) => ele.sid === record.sid).expectedDateFrom),
              'days',
            )}
          </span>
        );
      },
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    // 区分入口
    setLoad(true);
    if (query?.query?.from == 'need') {
      offerDetailNeed(params?.id, { pageNumber: 1, pageSize: 10000 }).then(async (res: any) => {
        if (res.errCode === 200) {
          const newData = {
            ...res?.data,
            calcTaxDiscount: res.data?.totalDiscount,
          };
          setInfo(newData);
          // 获取行信息数据接口 入参 res?.data?.quotCode B220718145936495
          await getItelmListCsp({ quotCode: res?.data?.quotCode }).then(async (resList: any) => {
            if (resList.errCode === 200) {
              const newList = resList?.data?.dataList.map((io: any) => ({
                ...io,
                qty: io.reqQty,
                applySalesPrice:
                  io.applySalesPrice ||
                  Number(
                    (io.salesPrice * ((100 + (io.applyDiscountPercent || 0)) / 100)).toFixed(2),
                  ),
                applySalesPriceNet:
                  io.applySalesPriceNet ||
                  Number(
                    (
                      (io.salesPrice * (100 + (io.applyDiscountPercent || 0))) /
                      100 /
                      (1 + 0.13)
                    ).toFixed(2),
                  ),
                applyDiscountPercent: io.applyDiscountPercent || 0,
              }));
              // getTotal 计算接口 刷页面
              const par = {
                volumeDiscountTag: mark ? 1 : 0,
                volumeDiscountRate: mark,
                freightTag: 0,
                querySource: 2,
                tariff: newData?.tariff || 0,
                totalFreight: newData?.totalFreight || 0,
                itemList: newList?.map((io: any) => ({
                  sid: io.sid,
                  bizStatus: io.bizStatus,
                  discountRate: isDiscount ? io.applyDiscountPercent : null,
                  applySalesPrice: isDiscount ? null : io.applySalesPrice,
                  salesPrice: io.salesPrice,
                  listPrice: io.listPrice,
                  costPrice: io.cost,
                  qty: io.reqQty,
                  rmbPurchasePrice: io.rmbPurchasePrice,
                  rmbMovingAverageCost: io.rmbMovingAverageCost,
                })),
                deptName: newData?.deptName || '',
                customerCode: newData?.customerCode,
              };
              const { data, errCode, errMsg } = await calcCsp(par);
              if (errCode == 200) {
                const dataCalc = {
                  ...newData,
                  amount: data?.amount,
                  amountNet: data?.amountNet,
                  goodsAmount: data?.goodsAmount,
                  goodsAmountNet: data?.goodsAmountNet,
                  amountNew: data?.amountNew,
                  amountNetNew: data?.amountNetNew,
                  goodsAmountNew: data?.goodsAmountNew,
                  goodsAmountNetNew: data?.goodsAmountNetNew,
                  calcTotalDiscountPercent: data?.calcTotalDiscountPercent,
                  calcTaxDiscount: data?.calcTaxDiscount,
                  calcApplyDiscount: data?.calcApplyDiscount,
                  calcApplyTaxDiscount: data?.calcApplyTaxDiscount,
                  gpRate: data?.gpRate,
                  finalGpRate: data?.finalGpRate,
                  finalGpRateDesc: data?.finalGpRateDesc,
                  dataList: newList?.map((io: any) => {
                    for (let i = 0; i < data?.itemList?.length; i++) {
                      if (io.sid === data?.itemList[i]?.sid) {
                        io.applyDiscountPercent = data?.itemList[i].discountRate;
                        io.applySalesPrice = data?.itemList[i].applySalesPrice;

                        io.purchseAmount = fp.round(
                          data?.itemList[i].applySalesPrice * io.reqQty,
                          2,
                        );
                        io.cspLockGp = fp.round(
                          ((data?.itemList[i]?.applySalesPrice -
                            data?.itemList[i]?.rmbPurchasePrice) /
                            data?.itemList[i]?.applySalesPrice) *
                            100,
                          2,
                        );
                        io.cspLockAverageGp = fp.round(
                          ((data?.itemList[i]?.applySalesPrice -
                            data?.itemList[i]?.rmbMovingAverageCost) /
                            data?.itemList[i]?.applySalesPrice) *
                            100,
                          2,
                        );
                        return io;
                      }
                    }
                  }),
                };
                setInfo(dataCalc);
                // 校验繁殖后端随便写数据
                setLoad(false);
                try {
                  sessionStorage.setItem('oldList', JSON.stringify(dataCalc));
                } catch (error) {}
              } else {
                message.error(errMsg);
                setLoad(false);
              }
            } else {
              message.error(resList?.errMsg);
              setLoad(false);
            }
          });
        } else {
          message.error(res.errMsg);
          setLoad(false);
        }
      });
    } else {
      offerDetail(params?.id, { pageNumber: 1, pageSize: 10000 }).then(async (res: any) => {
        if (res.errCode === 200) {
          const newData = {
            ...res?.data,
            calcTaxDiscount: res.data?.totalDiscount,
          };
          setshowVDate(res?.data?.requestValidity); //?设置申请有效期
          if (res?.data?.groupCustomerAccount) {
            setapplyToCom(1);
            setApplyStatus(1);
          } else {
            setapplyToCom();
            setApplyStatus();
          }
          // 获取行信息数据接口 入参 res?.data?.quotCode B220718145936495
          await getItelmListCsp({ quotCode: res?.data?.quotCode }).then(async (resList: any) => {
            if (resList.errCode === 200) {
              const newList = resList?.data?.dataList.map((io: any) => ({
                ...io,
                qty: io.reqQty,
                applySalesPrice:
                  io.applySalesPrice ||
                  Number(
                    (io.salesPrice * ((100 + (io.applyDiscountPercent || 0)) / 100)).toFixed(2),
                  ),
                applySalesPriceNet:
                  io.applySalesPriceNet ||
                  Number(
                    (
                      (io.salesPrice * (100 + (io.applyDiscountPercent || 0))) /
                      100 /
                      (1 + 0.13)
                    ).toFixed(2),
                  ),
                applyDiscountPercent: io.applyDiscountPercent || 0,
                expectedDateFrom: io.expectedDateFrom || moment().format('YYYY-MM-DD 00:00:00'),
                expectedDateTo:
                  io.expectedDateTo ||
                  moment(io?.expectedDateTo).add(90, 'days').format('YYYY-MM-DD 00:00:00'),
              }));
              // console.log(newList, 'newList');
              // getTotal 计算接口 刷页面
              const par = {
                volumeDiscountTag: mark ? 1 : 0,
                volumeDiscountRate: mark,
                freightTag: 0,
                querySource: 2,
                tariff: newData?.tariff || 0,
                totalFreight: newData?.totalFreight || 0,
                itemList: newList?.map((io: any) => ({
                  sid: io.sid,
                  bizStatus: io.bizStatus,
                  discountRate: isDiscount ? io.applyDiscountPercent : null,
                  applySalesPrice: isDiscount ? null : io.applySalesPrice,
                  salesPrice: io.salesPrice,
                  listPrice: io.listPrice,
                  costPrice: io.cost,
                  qty: io.reqQty,
                  rmbPurchasePrice: io.rmbPurchasePrice,
                  rmbMovingAverageCost: io.rmbMovingAverageCost,
                })),
                deptName: newData?.deptName || '',
                customerCode: newData?.customerCode,
              };
              const { data, errCode, errMsg } = await calcCsp(par);
              if (errCode == 200) {
                const dataCalc = {
                  ...newData,
                  amount: data?.amount,
                  amountNet: data?.amountNet,
                  goodsAmount: data?.goodsAmount,
                  goodsAmountNet: data?.goodsAmountNet,
                  amountNew: data?.amountNew,
                  amountNetNew: data?.amountNetNew,
                  goodsAmountNew: data?.goodsAmountNew,
                  goodsAmountNetNew: data?.goodsAmountNetNew,
                  calcTotalDiscountPercent: data?.calcTotalDiscountPercent,
                  calcTaxDiscount: data?.calcTaxDiscount,
                  calcApplyDiscount: data?.calcApplyDiscount,
                  calcApplyTaxDiscount: data?.calcApplyTaxDiscount,
                  gpRate: data?.gpRate,
                  finalGpRate: data?.finalGpRate,
                  finalGpRateDesc: data?.finalGpRateDesc,
                  dataList: newList?.map((io: any) => {
                    for (let i = 0; i < data?.itemList?.length; i++) {
                      if (io.sid === data?.itemList[i]?.sid) {
                        io.applyDiscountPercent = data?.itemList[i].discountRate;
                        io.applySalesPrice = data?.itemList[i].applySalesPrice;
                        io.purchseAmount = fp.round(
                          data?.itemList[i].applySalesPrice * io.reqQty,
                          2,
                        );
                        io.cspLockGp = fp.round(
                          ((data?.itemList[i]?.applySalesPrice -
                            data?.itemList[i]?.rmbPurchasePrice) /
                            data?.itemList[i]?.applySalesPrice) *
                            100,
                          2,
                        );
                        io.cspLockAverageGp = fp.round(
                          ((data?.itemList[i]?.applySalesPrice -
                            data?.itemList[i]?.rmbMovingAverageCost) /
                            data?.itemList[i]?.applySalesPrice) *
                            100,
                          2,
                        );
                        return io;
                      }
                    }
                  }),
                };
                setInfo(dataCalc);
                // 校验繁殖后端随便写数据

                setLoad(false);
                try {
                  sessionStorage.setItem('oldList', JSON.stringify(dataCalc));
                } catch (error) {}
              } else {
                message.error(errMsg);
                setLoad(false);
              }
            } else {
              message.error(resList?.errMsg);
              setLoad(false);
            }
          });
        } else {
          message.error(res.errMsg);
          setLoad(false);
        }
      });
    }
    //支付条件匹配
    getSelectList({ type: 'paymentTerm' }).then((res: any) => {
      const { errCode, data } = res;
      if (errCode === 200) {
        const obj = {} as any;
        data?.dataList?.map((io: any) => {
          obj[io.key] = io.value;
        });
        setPayEnum(obj);
      }
    });
  }, [params?.id]);

  const writeAll = async () => {
    if (!mark || mark == null) {
      message.error('请输入折扣率');
      return;
    }
    setTimeout(() => {
      getTotal(false, false, mark);
    }, 300);
  };

  // 导出数据
  const exportData = async () => {
    const par = {
      sid: info.sid,
      querySource: 2,
      approvalExcelVoFrontList: info?.dataList.map((ele: any) => {
        return {
          ...ele,
          expectEnd: moment(ele.expectedDateTo).format('YYYY-MM-DD'),
          expectStart: moment(ele.expectedDateFrom).format('YYYY-MM-DD'),
        };
      }),
      // approvalExcelVoFrontList: info?.quotationLineRespVoPage?.list?.map((io: any) => ({
      //   sid: io.quotLineId,
      //   skuType: io.skuType,
      //   sku: io.sku,
      //   salesPrice: io.salesPrice,
      //   applySalesPrice:
      //     io.applySalesPrice ||
      //     Number((io.salesPrice * ((100 + (io.applyDiscountPercent || 0)) / 100)).toFixed(2)),
      //   applySalesPriceNet:
      //     io.applySalesPriceNet ||
      //     Number(
      //       ((io.salesPrice * (100 + (io.applyDiscountPercent || 0))) / 100 / (1 + 0.13)).toFixed(
      //         2,
      //       ),
      //     ),
      //   applyDiscountPercent: io.applyDiscountPercent || 0,
      //   remark: io.remark,
      // })),
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
        if (msg?.file?.response?.errCode === 200) {
          const dataList = msg?.file?.response?.data;
          // console.log(dataList, 'dadadadad');

          // 重新刷新数据
          const newListNew = info?.dataList
            ?.map((io: any) => {
              for (let i = 0; i < info?.dataList?.length; i++) {
                if (io.sid == dataList[i]?.sid) {
                  io.applySalesPrice = dataList[i]?.applyCspSalesPrice;
                  io.salesPrice = dataList[i]?.salesPrice;
                  //仅 展示字段 // 新增五个字段回显展示
                  io.competitor = dataList[i].competitors;
                  io.competitorPrice = dataList[i].competitivePrice;
                  io.customerSku = dataList[i].customerSku;
                  io.expectedDateFrom = dataList[i].expectStart;
                  io.expectedDateTo = dataList[i].expectEnd;

                  return io;
                }
              }
            })
            .filter((ic: any) => ic);
          const newList = [
            ...newListNew,
            ...info?.dataList?.filter((io: any) => !newListNew.some((ic: any) => io.sid == ic.sid)),
          ];
          // console.log(newListNew, 'newListNew');
          for (let i = 0; i < newListNew.length; i++) {
            //?导入的时候，需要对单头上的申请有效期，进行联动,如果导入的有超过90就显示超过3个月，否则不超过3个月
            const element = newListNew[i];
            if (
              moment(element.expectedDateTo).diff(moment(element.expectedDateFrom), 'days') > 90
            ) {
              setshowVDate('超过3个月'); //?设置申请有效期
            } else {
              setshowVDate('不超过3个月');
            }
          }
          const par = {
            volumeDiscountTag: 0,
            volumeDiscountRate: mark,
            freightTag: 0,
            querySource: 2,
            tariff: info?.tariff || 0,
            totalFreight: info?.totalFreight || 0,
            itemList: newList?.map((io: any) => ({
              sid: io.sid,
              bizStatus: io.bizStatus,
              // discountRate: isDiscount ? io.applyDiscountPercent : null,
              // applySalesPrice: isDiscount ? null : io.applySalesPrice,
              applySalesPrice: io.applySalesPrice,
              salesPrice: io.salesPrice,
              listPrice: io.listPrice,
              costPrice: io.cost,
              qty: io.reqQty,
              rmbPurchasePrice: io.rmbPurchasePrice,
              rmbMovingAverageCost: io.rmbMovingAverageCost,
            })),
            deptName: info?.deptName || '',
            customerCode: info?.customerCode,
          };
          const { data, errCode, errMsg } = await calcCsp(par);
          if (errCode == 200) {
            const list = newList.map((io: any) => {
              for (let i = 0; i < data?.itemList?.length; i++) {
                if (io.sid == data?.itemList[i]?.sid) {
                  io.applyDiscountPercent = data?.itemList[i].discountRate;
                  io.applySalesPrice = data?.itemList[i].applySalesPrice;
                  io.purchseAmount = fp.round(data?.itemList[i].applySalesPrice * io.reqQty, 2);
                  io.cspLockGp = fp.round(
                    ((data?.itemList[i]?.applySalesPrice - data?.itemList[i]?.rmbPurchasePrice) /
                      data?.itemList[i]?.applySalesPrice) *
                      100,
                    2,
                  );
                  io.cspLockAverageGp = fp.round(
                    ((data?.itemList[i]?.applySalesPrice -
                      data?.itemList[i]?.rmbMovingAverageCost) /
                      data?.itemList[i]?.applySalesPrice) *
                      100,
                    2,
                  );
                  return io;
                }
              }
            });
            // console.log(list, '-----------');
            actionRef.current.reload();
            setInfo({
              ...info,
              amount: data?.amount,
              amountNet: data?.amountNet,
              goodsAmount: data?.goodsAmount,
              goodsAmountNet: data?.goodsAmountNet,
              amountNew: data?.amountNew,
              amountNetNew: data?.amountNetNew,
              goodsAmountNew: data?.goodsAmountNew,
              goodsAmountNetNew: data?.goodsAmountNetNew,
              calcTotalDiscountPercent: data?.calcTotalDiscountPercent,
              calcTaxDiscount: data?.calcTaxDiscount,
              calcApplyDiscount: data?.calcApplyDiscount,
              calcApplyTaxDiscount: data?.calcApplyTaxDiscount,
              gpRate: data?.gpRate,
              finalGpRate: data?.finalGpRate,
              finalGpRateDesc: data?.finalGpRateDesc,
              dataList: list,
            });
            // console.log(info, 'info');
          } else {
            setTimeout(() => {
              message.error(errMsg);
            }, 2000);
            // 计算出错了
            const sdata = sessionStorage.getItem('oldList') as any;
            setInfo(JSON.parse(sdata));
          }
          message.success(`${msg.file.name} file uploaded successfully`, 1);
          setTimeout(() => {
            setModalVisible(false);
          }, 2000);
        } else {
          message.error(`${msg?.file?.response?.errMsg}`);
          setTimeout(() => {
            setModalVisible(false);
          }, 2000);
        }
      } else if (msg.file.status === 'error') {
        message.error(`${msg.file.name} file upload failed.`);
      }
    },
  };

  const submit = async () => {
    formRef.current?.validateFieldsReturnFormatValue?.().then(async (values: any) => {
      if (applyStatus === 0 && fileList?.length === 0) {
        return message.error('请上传附件');
      }
      const par = {
        ...info,
        approvalDiscountLineReqVoList: info?.dataList?.map((io: any) => ({
          ...io,
          // expectedDateTo: io.expectedDateTo || moment(new Date()).format('YYYY-MM-DD'),
          // expectedDateFrom: io?.expectedDateFrom || moment(new Date()).format('YYYY-MM-DD'),
          expectedDateTo: io.expectedDateTo,
          expectedDateFrom: io?.expectedDateFrom,
          requestValidity: moment(io.expectedDateTo).diff(moment(io.expectedDateFrom), 'days'),
          productDesc: `${io?.brandName}  ${io?.productDesc} ${io?.mfgSku}`,
        })),
        sid: info?.sid,
        applyReason: values?.applyReason,
        applyDiscount: info?.calcApplyTaxDiscount,
        applyDiscountRate: info?.calcApplyDiscount,
        TotalDiscountPerc: info?.calcTotalDiscountPercent,
        calcTaxDiscount: info?.calcTaxDiscount,
        resourceVOList: fileList,
        applyGroupFlag: applyToCom,
        applyTypeFlag: applyStatus,
        requestValidity: showVDate,
        groupCustomerAccount: info?.groupCustomerAccount || null,
        groupCustomerName: info?.groupCustomerName || null,
      };
      let count = 0;
      for (let i = 0; i < par.approvalDiscountLineReqVoList.length; i++) {
        const element = par.approvalDiscountLineReqVoList[i];
        if (element.requestValidity > 365) {
          count++;
          message.error(`sku号${element.sku}申请有效期间隔不可大于365天`);
        }
        if (element.requestValidity < 0) {
          count++;
          message.error(`sku号${element.sku}申请有效期间隔不可小于0`);
        }
      }
      if (count) return;
      setLoadding(true);
      // console.log(par,'par');
      // return;
      if (query?.query?.from === 'need') {
        const { errCode, errMsg } = await approvalDiscountCspWorkFlow(par);
        if (errCode === 200) {
          message.success('申请提交成功');
          setLoadding(false);
          history.push({
            pathname: '/inquiry/csp-offer',
            state: 'succese',
          });
          // destroyCom('/inquiry/csp-offer', location.pathname);
        } else {
          setLoadding(false);
          message.error(errMsg);
        }
      } else {
        const { errCode, errMsg } = await approvalDiscountCsp(par);
        if (errCode === 200) {
          message.success('申请提交成功');
          setLoadding(false);
          // destroyCom('/inquiry/csp-offer', location.pathname);
          history.push({
            pathname: '/inquiry/csp-offer',
            state: 'succese',
          });
        } else {
          setLoadding(false);
          message.error(errMsg);
        }
      }
      sessionStorage.removeItem('oldList');
    });
  };
  const colorList: any = {
    黄色: '#f1db08',
    红色: '#F00',
    绿色: '#35f312',
    黄色警告: '#f1db08',
    红色警告: '#F00',
    绿色警告: '#35f312',
  };
  function changeStatus(e: any) {
    setApplyStatus(e.target.value);
  }
  function changeApplyToCom(e: any) {
    if (e.target.value === 0) {
      setApplyStatus(null);
    } else {
      setApplyStatus(1);
    }
    setapplyToCom(e.target.value);
  }
  return (
    <div className="form-content-search edit" id="inquirySheetOffer">
      <Spin spinning={load}>
        <ProForm
          layout="horizontal"
          className="fix_lable_large has-gridForm"
          initialValues={[]}
          onFinish={submit}
          onFinishFailed={() => {
            message.warning('您有未完善的信息，请填写正确的信息');
          }}
          form={form}
          formRef={formRef}
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
                      提交申请
                    </Button>
                    <Button
                      onClick={() => {
                        // destroyCom('/inquiry/csp-offer', location.pathname);
                        history.go(-1); //?我的代办点击编辑之后，再点取消需要返回之前的页面
                      }}
                    >
                      取消
                    </Button>
                  </Space>
                </div>
              );
            },
          }}
        >
          <Card className="head-title-wrap">
            <Row gutter={24}>
              <Col span={6.5} className="title">
                新增CSP申请
              </Col>
            </Row>
            <Row gutter={[0, 24]} style={{ paddingTop: '10px' }}>
              <Col span={3}>
                <span className="label">清单条目：</span>{' '}
                <span className="val">{info?.quotationLineNum}</span>
              </Col>
            </Row>
          </Card>

          <div className="editContentCol">
            <Card
              title="申请基本信息"
              bordered={false}
              headStyle={{ paddingTop: '8px', fontWeight: 'bold' }}
            >
              <ProDescriptions className="pr-desc-cust" dataSource={info} column={4}>
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

                <ProDescriptions.Item dataIndex="calcApplyDiscount" label="申请折扣%" />
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
                  dataIndex="finalGpRateDesc"
                  label="Final GP%档位"
                  renderText={(text: any, record: any) => {
                    return (
                      <strong style={{ color: colorList[record.finalGpRateDesc] }}>{text}</strong>
                    );
                  }}
                />
                <ProDescriptions.Item dataIndex="groupCustomerName" label="集团客户名称" />
                <ProDescriptions.Item dataIndex="groupCustomerAccount" label="集团客户号" />
                <ProDescriptions.Item label="申请有效期">{showVDate}</ProDescriptions.Item>

                <ProDescriptions.Item dataIndex="" label="应用到集团">
                  <Radio.Group
                    value={applyToCom}
                    onChange={changeApplyToCom}
                    disabled={!info?.groupCustomerAccount}
                  >
                    <Radio value={1}>
                      {/* {record.name} */}
                      应用
                    </Radio>
                    <Radio value={0}>
                      {/* {record.name} */}
                      不应用
                    </Radio>
                  </Radio.Group>
                </ProDescriptions.Item>
                <ProDescriptions.Item
                  dataIndex=""
                  label={
                    <>
                      应用方式：
                      <Tooltip
                        className="specailToolTip"
                        overlayStyle={{ maxWidth: 500 }}
                        title={
                          <div>
                            <div>
                              全部应用：仅对当前集团号下的所有site适用，后续新增site不适用,后续新增site不适用
                            </div>
                            <div>部分应用时：必须在附件上传须配置的集团客户号清单</div>
                          </div>
                        }
                      >
                        <ExclamationCircleOutlined />
                      </Tooltip>
                    </>
                  }
                >
                  <Radio.Group
                    value={applyStatus}
                    disabled={!info?.groupCustomerAccount || !applyToCom}
                    onChange={changeStatus}
                  >
                    <Radio value={1}>
                      {/* {record.name} */}
                      全部应用
                    </Radio>
                    <Radio value={0}>
                      {/* {record.name} */}
                      部分应用
                    </Radio>
                  </Radio.Group>
                </ProDescriptions.Item>
              </ProDescriptions>
              <Row>
                <Col span={16}>
                  <ProFormTextArea
                    name="applyReason"
                    label="申请原因"
                    required
                    placeholder={'请输入，最多255字'}
                    fieldProps={{ required: true, maxLength: 255, showCount: true }}
                  />
                </Col>
              </Row>
            </Card>
            <Card
              title="申请明细"
              bordered={false}
              headStyle={{ paddingTop: '8px', fontWeight: 'bold' }}
            >
              <Row gutter={24}>
                <Col>
                  <ProForm.Group>
                    <ProFormDigit
                      label="折扣率"
                      name="applyDiscountRate"
                      width="sm"
                      // max={99} 放开最大值
                      min={-99.999}
                      fieldProps={{
                        onChange: (val) => {
                          setMark(val);
                          return val;
                        },
                      }}
                    />
                  </ProForm.Group>
                </Col>
                <Col>
                  {' '}
                  <Button onClick={writeAll} size="large" type="primary" ghost={true}>
                    批量修改
                  </Button>
                </Col>
                <Col className="hide-upload">
                  <Button
                    size="large"
                    type="primary"
                    ghost={true}
                    onClick={() => setModalVisible(true)}
                  >
                    导入
                  </Button>
                </Col>
              </Row>
              <div className="cust-table">
                <ProTable<ProColumns>
                  className="cust-table"
                  columns={columns}
                  actionRef={actionRef}
                  bordered
                  size="small"
                  dataSource={info.dataList}
                  pagination={{
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    // showTotal: total => `共有 ${total} 条数据`,
                    showTotal: (totalPage, range) =>
                      `共有 ${totalPage} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                    onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
                    showQuickJumper: true,
                  }}
                  options={false}
                  search={false}
                  rowKey="sid"
                  scroll={{ x: 200, y: 500 }}
                />
              </div>
            </Card>
            {query?.query?.from != 'need' && (
              <Card
                title={<>附件 {applyStatus == 0 && '(必填)'}</>}
                bordered={false}
                bodyStyle={{ paddingLeft: 0, marginLeft: '-20px' }}
              >
                <UploadList
                  getData={(val: any) => setFileList(val)}
                  sourceData={paramsFile.resourceVOList}
                  createName={paramsFile.createName}
                />
              </Card>
            )}
          </div>
        </ProForm>
      </Spin>
      {/* upload 和 导入数据 */}
      <ModalForm
        title="导入申请明细"
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
    </div>
  );
};

// export default CSPApply;
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <CSPApply />
  </KeepAlive>
);
