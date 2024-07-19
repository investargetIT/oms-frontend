/* eslint-disable no-param-reassign */
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Form, Input, Select, Space, Modal, message, Drawer, Spin, Image } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { NumStatus, offerBtnList } from '../contants';
import type { OfferProps } from './const';
import { history } from 'umi';
import { ModalForm, ProFormDateRangePicker, DrawerForm, ProFormSelect } from '@ant-design/pro-form';
import OrderTable from './components/OrderTable';
import ApplyCheck from './components/ApplyCheck';
import ApplyDate from './components/ApplyDate';
import ApplyAdjustFreight from './components/ApplyAdjustFreight';
import ConcatOrderTable from './components/ConcatOrderTable';
import ApplyAskPrice from './components/ApplyAskPrice';
import Dtitle from '../../components/Dtitle';
// import { quoteLink, downloadPdf } from '@/services/InquirySheet/index';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { queryBySaffName } from '@/services/ApprovalFlow';
import '../index.less';
import { shareLink } from '@/services/SalesOrder';
import { getByKeys } from '@/services';

import {
  applyFreight,
  cancleOffer,
  cancleOfferCheck,
  checkFreight,
  checkOfferOrder,
  exportOfferData,
  lineArryByIds,
  offerDetail,
  offerDetailTRans,
  priceSync,
  searchOffer,
  searchOfferType,
  secondInquiry,
  transferSecondOrder,
  operateAuth,
  enterpriseSSO,
} from '@/services/InquirySheet/offerOrder';
import Cookies from 'js-cookie';
import { getCompanyList, getSelectList, toast } from '@/services/InquirySheet/utils';
import { useModel } from 'umi';
import classNames from 'classnames';
import { getEnv, colLimit, getEnvGps, getEnvEnterprise, getEnvMymro } from '@/services/utils';
import { queryChannel } from '@/services/afterSales/utils';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import TableCom from '@/pages/components/TableCom/Index';

const Index: React.FC<OfferProps> = () => {
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const { initialState } = useModel('@@initialState');
  const [yClient, setYClient] = useState(900);
  const [form] = Form.useForm();
  const [forms] = Form.useForm();
  const ref = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [concatOrderVisible, setConcatOrderVisible] = useState<boolean>(false);
  const [checkVisible, setCheckVisible] = useState<boolean>(false);
  const [effectVisible, setEffectVisible] = useState<boolean>(false);
  const [adjustFreightVisible, setAdjustFreightVisible] = useState<boolean>(false);
  const [askPriceVisible, setAskPriceVisible] = useState<boolean>(false);
  const [cpList, setCpList] = useState<any>([]);
  const [onErrorBtn, setOnErrorBtn] = useState(false);
  const [offerTypeList, setOfferTypeList] = useState<any>([]);
  const [askDetail, setAskDetail] = useState<any>({});
  const [ids, setIds] = useState<any>([]);
  const [combineList, setCombineList] = useState<any>([]);
  const [lineIds, setLineIds] = useState<any>([]);
  const [lineIdsData, setLineIdsData] = useState<any>([]);
  const [detail, setDetail] = useState<any>({});
  const [selectRows, setSelectRows] = useState<any>([]);
  const [pageData, setPageData] = useState<any>([]);
  const [followList, setFollowList] = useState<any>([]);
  // const [adjustData, setAdjustData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const OrderTableRef: any = useRef();
  const [allChannel, setAllChannel] = useState<any>([]);
  const [quotationList, setQuotationList] = useState<any>([]);
  const [loadconcat, setLoadconcat] = useState(false); //?合并报价单的loading效果
  const [loadExport, setLoadExport] = useState<any>(false);
  const [fold, setFold] = useState(false);
  const [helpList, setHelpList] = useState<any>([]);
  const [pageParams, setPageParams] = useState({});
  const [selectedRowKeys, setSelectedRowKeys]: any = useState([]);
  const [selectedRow, setSelectedRow]: any = useState([]);
  const [shareLinkModalShow, setShareLinkModalShow]: any = useState(false);
  const [shareQuoteLink, setShareQuoteLink]: any = useState({});
  const [load, setLoad]: any = useState(false);
  const [allSkuData, setAllSkuData]: any = useState([]);
  function UpDown() {
    setFold(!fold);
  }
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const drawerWidth = window.innerWidth;
  const intFormValue = {
    quotCode: '',
    customerName: '',
    quotType: 0,
    status: '',
    channel: '',
    createTime: [moment().subtract(1, 'month'), moment().endOf('day')],
    sku: '',
    branchCode: '',
    createName: '',
    inquiryCode: '',
    customerCode: '',
    helpStatus: '',
  };
  const getBtnAuth = async (operateButton: any, sels: any) => {
    const paramReqList: any = [];
    sels.forEach((item: any) => {
      const { quotType, channel, quotCode, status, customerCode, adjustFreight } = item;
      paramReqList.push({
        quotType,
        channel,
        quotCode,
        status,
        customerCode,
        adjustFreight,
      });
    });
    // const res = await operateAuth({ operateButton, operateSourceChannel: 0, paramReqList });
    // if (res?.errCode === 200) {
    //   const { data } = res;
    //   return data;
    // } else {
    //   message.error(res?.errMsg);
    // }
  };
  // 获取分享链接
  const getShareLink = async (data: {}) => {
    setLoad(true);
    // const res = await shareLink(data);
    // if (res.code == 200) {
    //   setShareQuoteLink(res.data);
    //   setShareLinkModalShow(true);
    //   setLoad(false);
    // } else {
    //   setLoad(false);
    //   message.error(res?.errMsg || '接口出错，暂时无法提供该分享链接');
    // }
  };
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 300,
      render: (_, record: any) => {
        const { pdfButton, editButton, excelButton, secondButton } = record;
        return (
          <Space>
            {
              // status == 10 &&
              //   quotType == 2 &&
              //   channel != 60 &&
              //   channel != 61 &&
              //   inquiryChannel != 60 &&
              //   inquiryChannel != 61 &&
              //   // quotType != 5 &&
              //   customerProcessStatus != 1
              secondButton ? (
                <Button
                  size="small"
                  type="link"
                  key={'二次询价'}
                  onClick={() => {
                    getBtnAuth(3, [record]).then((resd: any) => {
                      if (resd) {
                        const { operate } = resd;
                        if (operate) {
                          const { sid } = record;
                          offerDetail(sid, { pageNumber: 1, pageSize: 10000 }).then((res) => {
                            const { data, errCode, errMsg } = res;
                            if (errCode === 200) {
                              const par = {
                                ...data,
                                quotationLineRespVoPage: {
                                  list: data?.quotationLineRespVoPage?.list.map(
                                    (io: any, index: any) => ({
                                      ...io,
                                      salesExpectPriceNet: Number(
                                        (io.salesPrice / 1.13).toFixed(2),
                                      ),
                                      salesExpectPrice: io.salesPrice,
                                      index: index,
                                    }),
                                  ),
                                },
                              };
                              setIds([]);
                              setAskDetail(par);
                              setAskPriceVisible(true);
                            } else {
                              message.error(errMsg);
                            }
                          });
                        } else message.error('没有此操作权限');
                      }
                    });
                  }}
                >
                  二次询价
                </Button>
              ) : (
                ''
              )
            }
            {
              // status == 10 &&
              //   channel != 60 &&
              //   channel != 61 &&
              //   inquiryChannel != 60 &&
              //   inquiryChannel != 61 &&
              //   // quotType != 5 &&
              //   customerProcessStatus != 1 &&
              editButton ? (
                <Button
                  size="small"
                  type="link"
                  key={'编辑'}
                  onClick={() => {
                    getBtnAuth(2, [record]).then((res: any) => {
                      if (res) {
                        const { operate } = res;
                        if (operate) {
                          // 删除缓存
                          const { sid } = record;
                          history.push(`/inquiry/offer/edit/${sid}`);
                        } else message.error('没有此操作权限');
                      }
                    });
                  }}
                >
                  编辑
                </Button>
              ) : (
                ''
              )
            }
            {/* {[10, 80, 81, 90, 91].includes(status) && customerProcessStatus != 1 && (
              <span style={{ display: 'flex' }}>
                <Button
                  type="link"
                  target="_blank"
                  href={`${getEnv()}/omsapi/quotation/getDownFileUrl/${
                    record.sid
                  }?token=${Cookies.get('ssoToken')}`}
                  key={'pdf'}
                >
                  PDF
                </Button>
                <Button
                  type="link"
                  target="_blank"
                  href={`${getEnv()}/omsapi/quotation/exportExcel/${record.sid}?token=${Cookies.get(
                    'ssoToken',
                  )}`}
                  key={'EXCEL'}
                  // onClick={() => {
                  //   const { sid } = record;
                  //   downloadExcel({ sid }).then((res) => {
                  //     const blob = new Blob([res], {
                  //       type: 'application/vnd.ms-excel',
                  //     });
                  //     let link = document.createElement('a');
                  //     link.href = URL.createObjectURL(blob);
                  //     link.setAttribute('download', '文件名称.excel');
                  //     link.click();
                  //     link = null;
                  //     message.success('导出成功');
                  //   });
                  // }}
                >
                  EXCEL
                </Button>
              </span>
            )} */}
            <span style={{ display: 'flex' }}>
              {pdfButton ? (
                <Button
                  type="link"
                  target="_blank"
                  href={`${getEnv()}/omsapi/quotation/getDownFileUrl/${
                    record.sid
                  }?token=${Cookies.get('ssoToken')}`}
                  key={'pdf'}
                  // onClick={() => {
                  //   const { sid } = record;
                  //   downloadPdf({ sid }).then((res: any) => {
                  //     if (res?.errCode === 200) {
                  //       const link: any = document.createElement('a');
                  //       link.href = res.data.url;
                  //       link.click();
                  //       message.success('导出成功');
                  //     } else {
                  //       message.error(res.errMsg);
                  //     }
                  //   });
                  // }}
                >
                  PDF
                </Button>
              ) : (
                ''
              )}
              {excelButton ? (
                <Button
                  type="link"
                  target="_blank"
                  href={`${getEnv()}/omsapi/quotation/exportExcel/${record.sid}?token=${Cookies.get(
                    'ssoToken',
                  )}`}
                  key={'EXCEL'}
                  // onClick={() => {
                  //   const { sid } = record;
                  //   downloadExcel({ sid }).then((res) => {
                  //     const blob = new Blob([res], {
                  //       type: 'application/vnd.ms-excel',
                  //     });
                  //     let link = document.createElement('a');
                  //     link.href = URL.createObjectURL(blob);
                  //     link.setAttribute('download', '文件名称.excel');
                  //     link.click();
                  //     link = null;
                  //     message.success('导出成功');
                  //   });
                  // }}
                >
                  EXCEL
                </Button>
              ) : (
                ''
              )}
            </span>
            <Button
              size="small"
              key={'详情'}
              type="link"
              onClick={() => {
                const { sid } = record;
                history.push(`/inquiry/offer/detail/${sid}`);
              }}
            >
              详情
            </Button>
            {record.channel !== 20 && (
              <Button
                size="small"
                key={'分享'}
                type="link"
                onClick={() => {
                  const { quotCode, channel } = record;
                  const code = initialState?.currentUser?.code;
                  let link = `${getEnvEnterprise()}/shareQuota.html?quoteNo=${quotCode}&sc=${code}`;
                  if (channel === 20) {
                    link = `${getEnvMymro()}/shareQuota.html?quoteNo=${quotCode}&sc=${code}`;
                  }
                  if (channel === 100) {
                    link = `${getEnvEnterprise()}/shareQuotaSmart.html?quoteNo=${quotCode}&decrypt=0`;
                  }
                  getShareLink({
                    url: link,
                    shareUserNo: code,
                    appCode: channel,
                    // encryption: true,
                  });
                }}
              >
                分享
              </Button>
            )}
          </Space>
        );
      },
      fixed: 'left',
    },
    {
      title: '报价单号',
      width: 140,
      dataIndex: 'quotCode',
      sorter: (a, b) => (a.quotCode - b.quotCode ? 1 : -1),
      fixed: 'left',
    },
    {
      title: '创建时间',
      width: 150,
      dataIndex: 'createTime',
      sorter: (a, b) => (a.createTime - b.createTime ? 1 : -1),
    },
    {
      title: '报价单状态',
      width: 120,
      dataIndex: 'status',
      render: (_, record: any) => NumStatus[record.status],
      sorter: (a, b) => (a.status - b.status ? 1 : -1),
    },
    {
      title: '客户内部审批状态',
      width: 150,
      dataIndex: 'esStatusName',
    },
    {
      title: '报价单类型',
      width: 120,
      dataIndex: 'quotType',
      render: (_, record: any) => {
        return record?.quotTypeName;
      },
    },
    {
      title: '审批流程',
      width: 120,
      dataIndex: 'checkFlow',
      render: (_, record: any) => {
        return record?.approvalProcess || '-';
      },
    },
    {
      title: '助力状态',
      width: 120,
      dataIndex: 'helpStatus',
      render: (_, record: any) => {
        return record?.helpStatusDesc || '-';
      },
    },
    {
      title: '客户号',
      width: 120,
      dataIndex: 'customerCode',
      sorter: (a, b) => (a.customerCode - b.customerCode ? 1 : -1),
    },
    { title: '客户名称', width: 200, dataIndex: 'customerName', copyable: true, ellipsis: true },
    { title: '总计金额含税', width: 120, dataIndex: 'amount' },
    { title: '头运费合计', width: 120, dataIndex: 'freight' },
    { title: '国际运费合计', width: 120, dataIndex: 'interFreight' },
    { title: '关税合计', width: 120, dataIndex: 'tariff' },
    { title: '总运费', width: 120, dataIndex: 'totalFreight' },
    { title: '货品总计', width: 120, dataIndex: 'goodsAmount' },
    { title: '折扣总计', width: 120, dataIndex: 'totalDiscount' },
    { title: 'R3联系人名称', width: 120, dataIndex: 'contactName' },
    { title: '创建人', width: 120, dataIndex: 'createName' },
    { title: '主销售', width: 120, dataIndex: 'salesName' },
    { title: '所属公司', width: 200, dataIndex: 'branchCompanyName' },
    {
      title: '渠道',
      width: 120,
      dataIndex: 'channel',
      render: (_, record: any) => record?.channelName,
      // render: (_, record: any) => {
      //   if (record?.channel == 10) {
      //     return record?.inquiryChannelName;
      //   } else {
      //     return record?.channelName;
      //   }
      // },
    },
    { title: '报价有效日期', width: 150, dataIndex: 'quotValidDate', valueType: 'date' },
    { title: '跟进状态', width: 200, dataIndex: 'followStatusStr' },
    { title: '未转单原因', width: 200, dataIndex: 'followLostStatusStr' },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  // 转订单
  const transOrder = async () => {
    // 校验
    // quotType： 1 目录品报价单 | 2 Sourcing | 3 GPS | 4 CSP | 5官网 | 6比价反拍 | 7实时询价
    // 官网报价单与OMS、企业站报价单一样权利
    // if (selectRows.some((ic: any) => [5].includes(ic.quotType))) {
    //   message.error('非OMS渠道报价单不支持此操作');
    //   return;
    // }
    // if (selectRows.some((ic: any) => [6].includes(ic.quotType))) {
    //   message.error('当前报价单类型不支持此操作');
    //   return;
    // }
    if (ids.length === 0) {
      message.error('请选择至少一个报价单');
      return;
    }
    // if (ids.length > 1 && selectRows[0].channel == 100 && [3].includes(selectRows[0].quotType)) {
    //   message.error('渠道是智能柜的GPS报价单不支持此操作');
    //   return;
    // }
    // if (ids.length === 1 && selectRows[0].channel == 100 && [3].includes(selectRows[0].quotType)) {
    //   if (![10, 80].includes(selectRows[0].status) || selectRows[0].customerProcessStatus == 1) {
    //     message.error('当前报价单状态不支持转订单');
    //     return false;
    //   }
    //   fetch(`${getEnvGps()}/punchout/oms/setup.html?quotCode=${selectRows[0]?.quotCode}`, {
    //     method: 'POST',
    //   })
    //     .then((res: any) => {
    //       return res.json();
    //     })
    //     .then((res1: any) => {
    //       const url = `${getEnvGps()}/punchout/oms/forward.html?quotCode=${
    //         selectRows[0]?.quotCode
    //       }&token=${res1?.data}`;
    //       window.location.href = url;
    //     });
    //   return;
    // }
    // if (ids.length === 1) {
    //   if (![10, 80].includes(selectRows[0].status) || selectRows[0].customerProcessStatus == 1) {
    //     message.error('当前报价单状态不支持转订单');
    //     return false;
    //   }
    //   if (
    //     selectRows[0].channel == 61 ||
    //     // (selectRows[0].channel == 10 && selectRows[0].inquiryChannel == 61)
    //     // 10 OMS 新增 20官网 120企业站
    //     ([10, 20, 120].includes(selectRows[0].channel) && selectRows[0].inquiryChannel == 61)
    //   ) {
    //     fetch(`${getEnvGps()}/punchout/oms/setup.html?quotCode=${selectRows[0]?.quotCode}`, {
    //       method: 'POST',
    //     })
    //       .then((res: any) => {
    //         return res.json();
    //       })
    //       .then((res1: any) => {
    //         const url = `${getEnvGps()}/punchout/oms/forward.html?quotCode=${
    //           selectRows[0]?.quotCode
    //         }&token=${res1?.data}`;
    //         window.location.href = url;
    //       });
    //     return;
    //   }
    //   if (selectRows[0].channel == 60) {
    //     message.error('GPS渠道报价单仅可在GPS系统内转订单');
    //     return false;
    //   }
    //   // if (selectRows[0].channel == 10 && selectRows[0].inquiryChannel == 60) {
    //   // 10 OMS 新增 20官网 120企业站
    //   if ([10, 20, 120].includes(selectRows[0].channel) && selectRows[0].inquiryChannel == 60) {
    //     message.error('GPS渠道报价单仅可在GPS系统内转订单');
    //     return false;
    //   }
    // }
    // const isGps = selectRows?.some((io: any) => [60, 61].includes(io.channel));
    // if (ids.length > 1) {
    //   if (isGps) {
    //     message.error('当前报价单状态不支持转订单');
    //     return false;
    //   }
    // }
    // const sameLength = Array.from(new Set(selectRows?.map((io: any) => io.customerCode)));
    // if (sameLength.length !== 1) {
    //   message.error('仅可对同一客户的报价单合并转订单');
    //   return false;
    // }
    // const isAdjust = selectRows?.some((io: any) => io.adjustFreight == 1);
    // if (isAdjust && selectRows.length > 1) {
    //   message.error('已调整过运费的报价单，不可合并转订单');
    //   return false;
    // }
    // //10 OMS 新增 20 官网 120 企业站
    // const isStatus = selectRows.every(
    //   (io: any) => [10, 80].includes(io.status) || io.customerProcessStatus !== 1,
    // );
    // if (!isStatus) {
    //   message.error('报价单状态必须为可转订单或部分已清');
    //   return false;
    // }
    // const isCustomerProcessStatus = selectRows.every((io: any) => io.customerProcessStatus === 1);
    // if (isCustomerProcessStatus) {
    //   message.error('报价单状态必须为可转订单或部分已清');
    //   return false;
    // }
    if (selectRows?.length) {
      console.log('selectRows:', selectRows);
      // 企业站-pounchout渠道(130) 不支持和其他渠道一起转单,且不能合并多个单据
      const pounchoutEnterprise = selectRows.filter((item: any) => item.channel === 130)?.length;
      if (
        pounchoutEnterprise &&
        (pounchoutEnterprise !== selectRows.length || pounchoutEnterprise > 1)
      ) {
        message.error(
          `${
            pounchoutEnterprise > 1
              ? '企业站-pounchout渠道报价单不支持合并转单'
              : '企业站-pounchout渠道报价单不支持和其他渠道报价单一起转订单'
          }`,
        );
        return false;
      }
      getBtnAuth(1, selectRows).then((res: any) => {
        if (res) {
          const { jumpLinkUrl, operate } = res;
          // if (operate && selectRows[0].channel == 100) {
          //   enterpriseSSO({
          //     customerCode: selectRows[0].customerCode,
          //     contactCode: selectRows[0].contactCodeR3,
          //     omsLogin: true,
          //   }).then((ssoRes: any) => {
          //     if (ssoRes.errCode === 200) {
          //       const token = ssoRes.data.token;
          //       const url = `${getEnvEnterprise()}/orderConfirmSmart.html?from=oms&type=1&quoteNo=${
          //         selectRows[0]?.quotCode
          //       }&token=${token}`;
          //       // window.location.href = url;
          //       window.open(url, '_blank');
          //     } else {
          //       message.error(ssoRes.errMsg);
          //     }
          //   });
          // } else if (jumpLinkUrl) {
          //   fetch(`${getEnvGps()}/punchout/oms/setup.html?quotCode=${selectRows[0]?.quotCode}`, {
          //     method: 'POST',
          //   })
          //     .then((ress: any) => {
          //       return ress.json();
          //     })
          //     .then((res1: any) => {
          //       const url = `${getEnvGps()}/punchout/oms/forward.html?quotCode=${
          //         selectRows[0]?.quotCode
          //       }&token=${res1?.data}`;
          //       // window.location.href = url;
          //       window.open(url, '_blank');
          //     });
          //   // window.location.href = `${getEnvGps()}${jumpLinkUrl}`;
          // } else if (operate) {
          //   if (pounchoutEnterprise) {
          //     // 先获取企业站免登录token
          //     enterpriseSSO({
          //       customerCode: selectRows[0].customerCode,
          //       contactCode: selectRows[0].contactCodeR3,
          //       omsLogin: true,
          //     }).then((ssoRes: any) => {
          //       console.log('ssoRes', ssoRes);
          //       if (ssoRes.errCode === 200) {
          //         const token = ssoRes.data.token;
          //         const url = `${getEnvEnterprise()}/orderConfirm.html?from=oms&type=1&quoteNo=${
          //           selectRows[0]?.quotCode
          //         }&token=${token}`;
          //         // window.location.href = url;
          //         window.open(url, '_blank');
          //       }
          //     });
          //     // 跳转企业站转单页,传参为当前报价单号
          //   } else {
          //     setOnErrorBtn(false);
          //     setModalVisible(true);
          //     setLineIds([]);
          //     setLineIdsData([]);
          //   }
          // } else {
          //   message.error('没有此操作权限');
          // }
        }
      });
    }
  };
  // 合并报价单判断
  const concat = async () => {
    if (ids.length <= 1) {
      message.error('请至少选择两个报价单');
      return;
    }
    // const isGps = selectRows?.some((io: any) => [60, 61].includes(io.channel));
    // if (isGps) {
    //   message.error('当前包含不支持合并的报价单类型');
    //   return;
    // }
    // const sameLength = Array.from(new Set(selectRows?.map((io: any) => io.quotType)));
    // if (sameLength.length !== 1) {
    //   message.error('不同类型的报价单不能合并报价单');
    //   return false;
    // }
    // if (selectRows[0].quotType == 6) {
    //   message.error('当前报价单类型不支持合并报价单');
    //   return;
    // }
    getBtnAuth(9, selectRows)
      .then((resd: any) => {
        if (resd) {
          const { operate } = resd;
          if (operate) {
            // checkOfferOrder({ quotIdList: ids }).then((res: any) => {
            //   // 校验
            //   const { errCode, errMsg } = res;
            //   if (errCode == 200) {
            //     setLoadconcat(true);
            //     lineArryByIds(selectRows.map((e) => e.quotCode)).then((res1: any) => {
            //       // 详情行信息数组
            //       if (res1.errCode === 200) {
            //         setLoadconcat(false);
            //         setCombineList(res1.data);
            //         setConcatOrderVisible(true);
            //       } else {
            //         setLoadconcat(false);
            //         message.error(res1.errMsg);
            //       }
            //     });
            //   } else {
            //     message.error(errMsg);
            //   }
            // });
          } else message.error('没有此操作权限');
        }
      })
      .catch(() => {
        setLoadconcat(false);
      });
  };

  // 运费调整
  const ajustFreight = async () => {
    if (ids.length === 0) {
      message.error('请选择一个报价单');
      return;
    }
    if (ids.length !== 1) {
      message.error('仅可选择一个报价单发起申请');
      return;
    }
    // if (selectRows[0].channel == 60) {
    //   message.error('当前报价单状态不支持发起审批流程');
    //   return;
    // }
    // // 官网报价单与OMS、企业站报价单一样权利
    // // if (selectRows[0].quotType == 5) {
    // //   message.error('非OMS渠道的报价单, 不支持此操作');
    // //   return;
    // // }
    // if (selectRows[0].quotType == 6) {
    //   message.error('当前报价单类型不支持发起审批流程');
    //   return;
    // }
    // if (selectRows[0].customerProcessStatus == 1) {
    //   message.error('当前报价单状态不支持发起审批流程');
    //   return;
    // }
    getBtnAuth(5, selectRows).then((resd: any) => {
      if (resd) {
        const { operate } = resd;
        if (operate) {
          offerDetailTRans(ids[0]).then(async (res: any) => {
            // const { data, errCode } = res;
            // if (errCode === 200) {
            //   setDetail(data);
            //   const par = {
            //     id: data.sid,
            //     adjustFreightAmount: data.adjustFreight,
            //     applyReason: '1',
            //     freightAdjustQuotationLineReqVoList: data?.quotationLineRespVoList?.map(
            //       (io: any) => ({
            //         id: io.quotLineId,
            //         requestFreight: io.requestFreight,
            //       }),
            //     ),
            //   };
            //   await checkFreight(par).then((res1: any) => {
            //     if (res1.errCode === 200) {
            //       setAdjustFreightVisible(true);
            //     } else {
            //       message.error(res1.errMsg);
            //     }
            //   });
            // }
          });
        } else message.error('没有此操作权限');
      }
    });
  };
  //延长有效期
  const applyDate = async () => {
    if (ids.length === 0) {
      message.error('请选择一个报价单');
      return;
    }
    if (ids.length !== 1) {
      message.error('仅可选择一个报价单发起申请');
      return;
    }
    // if (
    //   selectRows[0].channel == 60 ||
    //   ![10, 91].includes(selectRows[0].status) ||
    //   selectRows[0].customerProcessStatus === 1
    // ) {
    //   message.error('当前报价单状态不支持发起审批流程');
    //   return;
    // }
    // // 官网报价单与OMS、企业站报价单一样权利
    // // if (selectRows[0].quotType == 5) {
    // //   message.error('非OMS渠道的报价单, 不支持此操作');
    // //   return;
    // // }
    // if (selectRows[0].quotType == 7) {
    //   message.error('实时询价报价单, 不支持此操作');
    //   return;
    // }
    // if (selectRows[0].channel == 100 && [3].includes(selectRows[0].quotType)) {
    //   message.error('渠道是智能柜的GPS报价单不支持此操作');
    //   return;
    // }
    getBtnAuth(4, selectRows).then((res: any) => {
      if (res) {
        const { operate } = res;
        if (operate) {
          offerDetail(ids[0]).then((res1) => {
            setDetail(res1?.data);
            setEffectVisible(true);
          });
        } else message.error('没有此操作权限');
      }
    });
  };

  // 助力审批
  const helpCheck = async () => {
    if (ids.length === 0) {
      message.error('请选择一个报价单');
      return;
    }
    if (ids.length !== 1) {
      message.error('仅可选择一个报价单发起申请');
      return;
    }
    // if (selectRows[0].status != 10 || selectRows[0].customerProcessStatus === 1) {
    //   message.error('当前报价单状态不支持发起审批流程');
    //   return;
    // }
    // if (selectRows[0].quotType == 2) {
    //   message.error('Sourcing报价单不可申请助力审批');
    //   return;
    // }
    // // 官网报价单与OMS、企业站报价单一样权利
    // // if (selectRows[0].quotType == 5) {
    // //   message.error('非OMS渠道的报价单, 不支持此操作');
    // //   return;
    // // }
    // if (selectRows[0].channel == 100 && [3].includes(selectRows[0].quotType)) {
    //   message.error('渠道是智能柜的GPS报价单不支持此操作');
    //   return;
    // }
    // if (selectRows[0].helpStatus !== '0') {
    //   message.error('已经助力过的报价单, 不支持此操作');
    //   return;
    // }
    getBtnAuth(10, selectRows).then((res: any) => {
      if (res) {
        const { operate } = res;
        if (operate) {
          setCheckVisible(true);
        } else message.error('没有此操作权限');
      }
    });
  };

  const pushPrice = async () => {
    if (ids.length === 0) {
      message.error('请选择至少一个报价单');
      return;
    }
    // 官网报价单与OMS、企业站报价单一样权利
    // if (selectRows.some((ic: any) => [5].includes(ic.quotType))) {
    //   message.error('非OMS渠道的报价单, 不支持此操作');
    //   return;
    // }
    // if (selectRows.some((ic: any) => ic.customerProcessStatus === 1)) {
    //   message.error('当前状态报价单不支持推送价格');
    //   return;
    // }
    // const pushPriceStatus = selectRows.some((ic: any) => [90, 91, 93, 20].includes(ic.status));
    // if (pushPriceStatus) {
    //   message.error('当前状态报价单不支持推送价格');
    //   return false;
    // } else {
    //   const quotCodeArry = selectRows?.map((io: any) => io.quotCode);
    //   await priceSync({ quotCodeList: quotCodeArry }).then((res: any) => {
    //     if (res.errCode === 200) {
    //       message.success('推送成功');
    //       setIds([]);
    //     } else {
    //       message.error(res?.errMsg);
    //     }
    //   });
    // }

    //add 推送价格和上下架状态校验：可转订单和部分已请可以推送 10 80
    const pushPriceStatus = selectRows.every((ic: any) => [10, 80].includes(ic.status));
    if (pushPriceStatus) {
      getBtnAuth(6, selectRows).then((resd: any) => {
        // if (resd) {
        //   const { operate } = resd;
        //   if (operate) {
        //     const quotCodeArry = selectRows?.map((io: any) => io.quotCode);
        //     priceSync({ quotCodeList: quotCodeArry }).then((res: any) => {
        //       if (res.errCode === 200) {
        //         message.success('推送成功');
        //         setIds([]);
        //       } else {
        //         message.error(res?.errMsg);
        //       }
        //     });
        //   } else message.error('没有此操作权限');
        // }
      });
    } else {
      message.error('可转订单、部分已清支持推送价格，请重新选择');
      return false;
    }
  };

  const exportOffer = async () => {
    // 跨页不下载那些id数据 只下单当前分业的
    const idsFilter = ids.filter((io: any) => pageData.some((ic: any) => ic.sid === io));

    Modal.confirm({
      title: ids?.length ? '确定导出所选择的数据？' : '确定根据查询条件导出数据？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setLoadExport(true);
        const searchParams = { ...form.getFieldsValue(true) };
        searchParams.startCreateTime = moment(searchParams?.createTime[0]).format('YYYY-MM-DD');
        searchParams.endCreateTime = moment(searchParams?.createTime[1]).format('YYYY-MM-DD');
        exportOfferData(
          JSON.parse(JSON.stringify({ ...pageParams, ...searchParams, sidList: idsFilter })),
        ).then((res: any) => {
          const { data } = res;
          const reader = new FileReader();
          reader.onload = function () {
            try {
              const resContent = reader.result ? JSON.parse(reader.result.toString()) : '';
              if (resContent.statusCode) {
                Modal.error(resContent.errMsg);
                setLoadExport(false);
              }
            } catch {
              const el = document.createElement('a');
              el.style.display = 'none';
              el.href = URL.createObjectURL(data);
              el.download = '报价单信息.xlsx';
              document.body.append(el);
              el.click();
              window.URL.revokeObjectURL(el.href);
              document.body.removeChild(el);
              setLoadExport(false);
            }
          };
          reader.readAsText(data);
          setLoadExport(false);
        });
      },
    });
  };

  const btnClick = (item: any, index: number) => {
    // 转订单 合并报价单 助力审批 延长有效期 运费调整 取消报价
    switch (index) {
      case 0:
        transOrder();
        break;
      case 1:
        console.log(item, 'item');
        concat();
        break;
      case 2:
        helpCheck();
        break;
      case 3:
        applyDate();
        break;
      case 4:
        ajustFreight();
        break;
      case 5:
        pushPrice();
        break;
      case 6:
        forms.resetFields();
        if (ids.length === 0) {
          message.error({ content: '至少选择一个报价单' });
          return;
        }

        getBtnAuth(8, selectRows).then((resd: any) => {
          if (resd) {
            const { operate } = resd;
            if (operate) {
              // 校验取消tip
              // cancleOfferCheck({ quotIds: ids.join(',') }).then(async (res: any) => {
              //   if (res?.errCode === 200) {
              //     if (res?.errMsg) {
              //       Modal.confirm({
              //         title: `${res?.errMsg}`,
              //         content: '',
              //         okText: '确认',
              //         cancelText: '取消',
              //         onOk: async () => {
              //           const { errMsg, errCode } = await cancleOffer({ quotIds: ids.join(',') });
              //           toast(errMsg, errCode);
              //           setIds([]);
              //           ref.current?.reload();
              //         },
              //       });
              //     } else {
              //       Modal.confirm({
              //         title: '是否确认取消报价',
              //         content: (
              //           <Form form={forms}>
              //             <Form.Item
              //               name="followLostStatus"
              //               label="未转单原因"
              //               rules={[{ required: true, message: '此项必填' }]}
              //             >
              //               <Select
              //                 options={followList}
              //                 fieldNames={{
              //                   label: 'name',
              //                   value: 'code',
              //                 }}
              //               />
              //             </Form.Item>
              //           </Form>
              //         ),
              //         okText: '确认',
              //         cancelText: '取消',
              //         onOk: async () => {
              //           const resForm = await forms.validateFields();
              //           const { errMsg, errCode } = await cancleOffer({
              //             quotIds: ids.join(','),
              //             followLostStatus: resForm.followLostStatus,
              //           });
              //           toast(errMsg, errCode);
              //           setIds([]);
              //           ref.current?.reload();
              //         },
              //       });
              //     }
              //   } else {
              //     message.error(res?.errMsg);
              //   }
              // });
            } else message.error('没有此操作权限');
          }
        });
        // } else {
        //   message.warning({ content: '当前包含不支持取消的报价单类型' });
        // }
        break;
      case 7:
        exportOffer();
        break;
      // case 8:
      //   getShareLink();
      //   break;
      default:
        break;
    }
  };

  const companyList = async () => {
    // await getCompanyList().then((res: any) => {
    //   if (res?.errCode === 200) {
    //     res?.data?.dataList?.unshift({
    //       key: '',
    //       value: '全部',
    //     });
    //     setCpList(
    //       res?.data?.dataList?.map((io: any) => ({
    //         ...io,
    //         value: io.key,
    //         label: io.value,
    //       })),
    //     );
    //   }
    // });
  };

  const offerType = async () => {
    // await searchOfferType().then((res: any) => {
    //   const {
    //     data: { dropRespVoList },
    //   } = res;
    //   dropRespVoList?.unshift({
    //     code: 0,
    //     name: '全部',
    //   });
    //   setOfferTypeList(
    //     dropRespVoList?.map((io: any) => ({
    //       ...io,
    //       label: io.name,
    //       value: io.code,
    //     })),
    //   );
    // });
  };

  const getChannel = async () => {
    // queryChannel({}).then((res: any) => {
    //   if (res?.errCode === 200) {
    //     res?.data?.unshift({
    //       channel: '',
    //       channelName: '全部',
    //     });
    //     setAllChannel(
    //       res?.data?.map((io: any) => ({
    //         value: io.channel,
    //         label: io.channelName,
    //       })),
    //     );
    //   }
    // });
  };

  const queryListsData = async () => {
    // await getSelectList({ type: 'quotationStatus' }).then((res: any) => {
    //   if (res?.errCode === 200) {
    //     res?.data?.dataList?.unshift({
    //       key: '',
    //       value: '全部',
    //     });
    //     setQuotationList(
    //       res?.data?.dataList?.map((io: any) => ({
    //         ...io,
    //         label: io.value,
    //         value: io.key,
    //       })),
    //     );
    //   }
    // });
    // await getSelectList({ type: 'helpStatus' }).then((res: any) => {
    //   if (res?.errCode === 200) {
    //     res?.data?.dataList?.unshift({
    //       key: '',
    //       value: '全部',
    //     });
    //     setHelpList(
    //       res?.data?.dataList?.map((io: any) => ({
    //         ...io,
    //         label: io.value,
    //         value: io.key,
    //       })),
    //     );
    //   }
    // });
    // await getByKeys({ list: ['quotationFollowLostEnum'] }).then((res: any) => {
    //   if (res?.errCode === 200) {
    //     setFollowList(res?.data[0]?.enums);
    //   }
    // });
  };

  useEffect(() => {
    companyList();
    offerType();
    getChannel();
    queryListsData();
  }, []);

  const getAllSkuData = (data: any) => {
    setAllSkuData(data);
  };
  const onSelect = (lineArray: any, lineData: any) => {
    setLineIds(lineArray);
    setLineIdsData(lineData);
  };
  const onSetAskDetail = (record: any) => {
    setAskDetail({
      ...askDetail,
      quotationLineRespVoPage: {
        list: askDetail?.quotationLineRespVoPage?.list?.map((io: any) => {
          if (io.quotLineId === record.quotLineId) {
            io = record;
          }
          return io;
        }),
      },
    });
  };
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 340);
  }, [initialState?.windowInnerHeight]);

  useEffect(() => {
    if (history.action === 'REPLACE') {
      ref?.current?.reload();
    }
  }, [history.action]);

  return (
    <div className="omsAntStyle offer" id="quotationList">
      <div className="form-content-search">
        <Spin spinning={load}>
          <Form
            layout="inline"
            form={form}
            className="ant-advanced-form"
            initialValues={intFormValue}
          >
            <Form.Item name="quotCode" label="报价单号">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="customerName" label="客户名称">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="customerCode" label="客户号">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="inquiryCode" label="需求单号">
              <Input placeholder="请输入" />
            </Form.Item>
            {!fold && (
              <>
                <Form.Item name="quotType" label="报价单类型">
                  <Select showSearch style={{ width: 200 }} placeholder="">
                    {offerTypeList?.map((item: any) => (
                      <Select.Option key={item.code} value={item.code}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="status" label="报价单状态">
                  <Select showSearch style={{ width: 200 }} placeholder="报价单状态">
                    {quotationList?.map((item: any) => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="channel" label="渠道">
                  <Select showSearch style={{ width: 200 }} placeholder="渠道">
                    {allChannel?.map((item: any) => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="sku" label="SKU号">
                  <Input placeholder="请输入" />
                </Form.Item>
                <Form.Item name="createName" label="创建人">
                  <Input placeholder="请输入" />
                </Form.Item>
                <Form.Item name="branchCode" label="所属公司">
                  <Select showSearch style={{ width: 200 }} placeholder="所属公司">
                    {cpList?.map((item: any) => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="helpStatus" label="助力状态">
                  <Select showSearch style={{ width: 200 }} placeholder="">
                    {helpList?.map((item: any) => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="groupCustomerName" label="集团名称">
                  <Input placeholder="请输入集团名称关键字" />
                </Form.Item>
                <ProFormSelect
                  label="主销售"
                  showSearch
                  name="salesName"
                  fieldProps={{
                    fieldNames: { label: 'staffName', value: 'staffName' },
                    // labelInValue: true,
                  }}
                  placeholder="请输入"
                  request={async (val) => {
                    let list = [] as any;
                    if (val?.keyWords?.trim()) {
                      // await queryBySaffName({ staffName: val.keyWords }).then((res: any) => {
                      //   if (res.errCode === 200) {
                      //     list = res?.data?.dataList;
                      //     if (list.length == 0) {
                      //       list = [{ staffName: val.keyWords, staffCode: val.keyWords }];
                      //     }
                      //   }
                      // });
                    }
                    return list;
                  }}
                />
                <ProFormSelect
                  label="跟进状态"
                  showSearch
                  name="followStatus"
                  fieldProps={{
                    fieldNames: { label: 'name', value: 'code' },
                  }}
                  placeholder="请输入"
                  // request={async () => {
                  //   const res = await getByKeys({ list: ['quotationFollowStatusEnum'] });
                  //   return res?.data[0]?.enums;
                  // }}
                />
                <div className="startCreateTime">
                  <ProFormDateRangePicker name="createTime" label="创建时间" allowClear={false} />
                </div>
              </>
            )}
            <Form.Item className="btn-search">
              <Space>
                <Button
                  key={'查询'}
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    ref.current?.reload();
                    setStartPage(true);
                    setIds([]);
                    setSelectRows([]);
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
                    UpDown();
                  }}
                >
                  {fold ? '展开' : '收起'}
                </Button>
              </Space>
            </Form.Item>
          </Form>

          <TableCom
            bordered
            size="small"
            columns={columns}
            columnsState={{
              value: columnsStateMap,
              onChange: (val: any) => {
                colLimit(val, setColumnsStateMap);
              },
              persistenceKey: history.location.pathname,
              persistenceType: 'localStorage',
            }}
            scroll={{ x: 200, y: yClient }}
            className="cust-table"
            tableStyle={{ paddingLeft: '10px', paddingRight: '10px' }}
            request={async (params) => {
              console.log(params);
              // // 表单搜索项会从 params 传入，传递给后端接口。
              if (startPage) {
                params.current = 1;
              }
              const paramsCust: any = {
                ...form.getFieldsValue(true),
                startCreateTime: form.getFieldsValue(true).createTime[0]
                  ? moment(form.getFieldsValue(true).createTime[0]).format('YYYY-MM-DD')
                  : '',
                endCreateTime: form.getFieldsValue(true).createTime[1]
                  ? moment(form.getFieldsValue(true).createTime[1]).format('YYYY-MM-DD')
                  : '',
                pageNumber: params.current,
                pageSize: params.pageSize,
              };
              setPageParams(params);
              // const {
              //   data: { list, total },
              //   errCode,
              //   errMsg,
              // } = await searchOffer(paramsCust);
              // if (errCode === 200) {
              //   return Promise.resolve({
              //     data: list,
              //     total: total,
              //     success: true,
              //   });
              // } else {
              //   Modal.error(errMsg);
              //   return Promise.resolve([]);
              // }
            }}
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys: ids,
              onChange: (rowKeys, rows) => {
                setIds(rowKeys);
                setSelectRows(rows);
              },
              // 全选是针对当前页面的全选或者费全选，保留记忆选择，会导致自己那个页面选的那个自己都不知道，简单的操作就是过滤数据到当前页面更直观，方便，因为状态校验台严格了
              // onSelect: (record, selected, selectedRow) => {
              //   let keys = [...ids];
              //   if (selected) {
              //     keys = [...ids, record.sid];
              //   } else {
              //     keys = ids.filter((item: any) => item !== record.sid);
              //   }
              //   setIds(keys);
              //   setSelectRows(selectedRow);
              // },
              // onSelectAll: (selected, selectedRows, changeRows) => {
              //   if (selected) {
              //     const addCheckedKeys = changeRows.map((item) => {
              //       return item.sid;
              //     });
              //     setIds([...ids, ...addCheckedKeys]);
              //   } else {
              //     const subCheckedKeys = ids.filter((id: any) => {
              //       return !changeRows.some((item) => {
              //         return item.sid === id;
              //       });
              //     });
              //     setIds(subCheckedKeys);
              //   }
              // },
            }}
            onRow={(record) => {
              return {
                onClick: () => {
                  if (ids.includes(record?.sid)) {
                    const keys = ids.filter((item: any) => item !== record.sid);
                    setIds(keys);
                    setSelectRows(
                      pageData?.filter((io: any) => keys.some((ic: any) => ic == io.sid)),
                    );
                  } else {
                    setIds(ids.concat(record.sid));
                    setSelectRows(
                      pageData?.filter((io: any) =>
                        ids.concat(record.sid).some((ic: any) => ic == io.sid),
                      ),
                    );
                  }
                },
              };
            }}
            onDataSourceChange={(dataTable: any) => {
              setPageData(dataTable);
            }}
            options={{ reload: false, density: false }}
            rowKey="sid"
            pagination={{
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              // showTotal: total => `共有 ${total} 条数据`,
              showTotal: (total, range) =>
                `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
              onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
              showQuickJumper: true,
            }}
            search={false}
            tableAlertRender={false}
            actionRef={ref}
            defaultSize="small"
            headerTitle={
              <Space style={{ paddingLeft: '10px' }}>
                {offerBtnList?.map((item: any, index: number) => (
                  <Button
                    key={item.id}
                    type={item.type}
                    onClick={() => btnClick(item, index)}
                    ghost={item.ghost}
                    loading={index === 1 ? loadconcat : index === 7 ? loadExport : false}
                    className={classNames(
                      index === 6
                        ? 'danger light_danger'
                        : index === 5
                        ? 'light_blue'
                        : index === 8
                        ? 'success light_green'
                        : '',
                    )}
                  >
                    {item.name}
                  </Button>
                ))}
              </Space>
            }
          />
        </Spin>
      </div>
      {/* 转订单  待合并业务*/}
      <ModalForm
        width={1100}
        title="选择转订单任务明细"
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        modalProps={{ destroyOnClose: true }}
        submitter={{
          searchConfig: {
            submitText: '下一步',
            resetText: '取消',
          },
        }}
        onFinish={async () => {
          if (lineIds.length === 0) {
            message.error('请选择行信息');
            return false;
          }
          if (
            lineIdsData.every(
              (io: any) =>
                io.bizStatus == 11 ||
                io.bizStatus == 21 ||
                io.bizStatus == 31 ||
                io.bizStatus == 60,
            )
          ) {
            const par = {
              quotLineIdList: lineIds,
              // quotIdList: ids
            };
            // const { errCode, errMsg } = await transferSecondOrder(par);
            // if (errCode === 200) {
            //   setIds([]);
            //   history.push({
            //     state: JSON.stringify(par),
            //     pathname: '/inquiry/offer/order',
            //   });
            //   return true;
            // } else {
            //   message.error(errMsg);
            //   return false;
            // }
          } else {
            message.error(
              'SKU业务状态不匹配(11:正常销售，21:限量销售，31：尾货待售，60：单笔询价)',
            );
            return false;
          }
        }}
      >
        <OrderTable
          ref={OrderTableRef}
          ids={ids}
          onError={() => {
            setOnErrorBtn(true);
          }}
          dataList={combineList}
          selectRows={selectRows}
          modalVisible={modalVisible}
          OnSelect={(lineArray, lineData) => onSelect(lineArray, lineData)}
          getAllSkuData={getAllSkuData}
        />
        <Button
          type="primary"
          disabled={onErrorBtn}
          className="trasnOrderBtn"
          onClick={async () => {
            if (
              // lineIdsData.every(
              allSkuData.every(
                (io: any) =>
                  io.bizStatus == 11 ||
                  io.bizStatus == 21 ||
                  io.bizStatus == 31 ||
                  io.bizStatus == 60,
              )
            ) {
              const par = {
                quotLineIdList: lineIds,
                quotIdList: ids,
              };
              // const { errCode, errMsg } = await transferSecondOrder(par);
              // if (errCode === 200) {
              //   setModalVisible(false);
              //   setTimeout(() => {
              //     history.push({
              //       state: JSON.stringify(par),
              //       pathname: '/inquiry/offer/order',
              //     });
              //   }, 1000);
              // } else {
              //   message.error(errMsg);
              //   return false;
              // }
            } else {
              message.error(
                'SKU业务状态不匹配(11:正常销售，21:限量销售，31：尾货待售， 60：单笔询价)',
              );
              return false;
            }
          }}
        >
          全选转订单
        </Button>
      </ModalForm>
      {/* 合并报价单 */}
      <ModalForm
        // width={1100}
        title="合并报价单"
        visible={concatOrderVisible}
        modalProps={{
          destroyOnClose: true,
        }}
        onVisibleChange={setConcatOrderVisible}
        submitter={{
          searchConfig: {
            submitText: '下一步',
            resetText: '取消',
          },
        }}
        onFinish={async () => {
          // add 校验成功
          if (lineIds.length === 0) {
            message.error('请至少选择一个报价单');
            return;
          }
          const pars = {
            from: 'concat',
            quotIdList: ids,
            quotLineIdList: lineIds,
          } as any;
          await checkOfferOrder({ quotIdList: ids, quotLineIdList: lineIds }).then((res: any) => {
            // 校验
            const { errCode, errMsg } = res;
            if (errCode == 200) {
              setConcatOrderVisible(false);
              sessionStorage.setItem('idsData', JSON.stringify(lineIdsData)); // 使用后删除
              history.push({
                state: JSON.stringify(pars),
                pathname: '/inquiry/offer/offerOrder',
              });
              return true;
            } else {
              message.error(errMsg);
            }
          });
        }}
      >
        <ConcatOrderTable
          ids={ids}
          dataList={combineList}
          onSelect={(lineArray, lineData) => onSelect(lineArray, lineData)}
        />
      </ModalForm>
      {/* 助力审批modal */}
      <Drawer
        width={(2 * drawerWidth) / 3}
        title={<Dtitle title="助力审批" subTitle="CSP物料不参与助力" />}
        visible={checkVisible}
        onClose={() => setCheckVisible(false)}
        destroyOnClose={true}
        footer={[
          // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
          <Button
            key="back"
            onClick={() => {
              setCheckVisible(false);
              setIds([]);
            }}
          >
            关闭
          </Button>,
        ]}
      >
        <ApplyCheck
          id={ids[0]}
          from="offer"
          onClose={() => {
            setCheckVisible(false);
            setIds([]);
            ref.current?.reload();
          }}
        />
      </Drawer>

      {/* 延长那个有效期 */}
      <Modal
        title="申请延长有效期"
        visible={effectVisible}
        onCancel={() => setEffectVisible(false)}
        className="noTopFootBorder"
        width={520}
        destroyOnClose={true}
        footer={null}
      >
        <ApplyDate
          info={detail}
          onClose={() => {
            setEffectVisible(false);
            setIds([]);
            ref.current?.reload();
          }}
        />
      </Modal>
      {/* 申请调整运费 */}
      <DrawerForm
        title="申请调整运费"
        width={(2 * window.innerWidth) / 3}
        drawerProps={{
          destroyOnClose: true,
        }}
        visible={adjustFreightVisible}
        onVisibleChange={setAdjustFreightVisible}
        submitter={{
          searchConfig: {
            submitText: '提交申请',
            resetText: '取消',
          },
        }}
        onFinish={async (values) => {
          const fileListApplyAdjust = sessionStorage.getItem('fileListApplyAdjust');
          const par = {
            refResourceVOList: fileListApplyAdjust ? JSON.parse(fileListApplyAdjust) : null,
            applyReason: values.applyReason,
            id: detail.sid,
            adjustFreightAmount: values.adjustFreightAmount,
            freightAdjustQuotationLineReqVoList: detail?.quotationLineRespVoList?.map(
              (io: any) => ({
                id: io.quotLineId,
                requestFreight: io.requestFreight,
              }),
            ),
          };
          // await applyFreight(par).then((res: any) => {
          //   const { errCode, errMsg } = res;
          //   if (errCode === 200) {
          //     message.success('提交成功');
          //     setIds([]);
          //     sessionStorage.removeItem('fileListApplyAdjust');
          //     ref.current?.reload();
          //   } else {
          //     message.error(errMsg);
          //   }
          // });
          return true;
        }}
        layout={'horizontal'}
      >
        <ApplyAdjustFreight info={detail} />
      </DrawerForm>
      {/* 申请二次询价 */}
      <DrawerForm
        title="申请二次询价"
        width={1000}
        visible={askPriceVisible}
        onVisibleChange={setAskPriceVisible}
        drawerProps={{
          destroyOnClose: true,
        }}
        submitter={{
          searchConfig: {
            submitText: '提交申请',
            resetText: '取消',
          },
        }}
        onFinish={async () => {
          if (!selectedRowKeys?.length) {
            message.warning('请选择需要操作的数据!');
            return false;
          } else {
            const arr = [];
            for (let i = 0; i < selectedRowKeys.length; i++) {
              const element = selectedRowKeys[i];
              for (let j = 0; j < askDetail?.quotationLineRespVoPage?.list.length; j++) {
                const ele = askDetail?.quotationLineRespVoPage?.list[j];
                if (ele.quotLineId === element) {
                  arr.push(ele);
                }
              }
            }
            const par = {
              sid: askDetail.sid,
              secondInquiryLineReqVoList: arr
                ?.map((io: any) => ({
                  sid: io.quotLineId,
                  salesExpectPrice: io.salesExpectPrice,
                  salesExpectPriceNet: io.salesExpectPriceNet,
                }))
                .filter((ic: any) => ic.salesExpectPrice > 0 && ic.salesExpectPriceNet > 0),
            };
            // const { errCode, errMsg } = await secondInquiry(par);
            // if (errCode === 200) {
            //   message.success('提交成功');
            //   setAskPriceVisible(false);
            // } else {
            //   message.error(errMsg);
            // }
          }
        }}
        layout={'horizontal'}
        // style={{ maxHeight: '600px', overflowY: 'auto',minHeight:'300px' }}
      >
        {askDetail && (
          <ApplyAskPrice
            setSelectedRowKeys={setSelectedRowKeys}
            setSelectedRow={setSelectedRow}
            selectedRowKeys={selectedRowKeys}
            selectedRow={selectedRow}
            detail={askDetail}
            onSetDetail={(record) => onSetAskDetail(record)}
          />
        )}
      </DrawerForm>
      {/*share link modal*/}
      <Modal
        title="报价单分享链接"
        visible={shareLinkModalShow}
        onCancel={() => setShareLinkModalShow(false)}
        className="noTopFootBorder"
        width={600}
        destroyOnClose={true}
        footer={null}
      >
        <div className="" style={{ margin: 20, marginTop: 0 }}>
          方法一：复制链接分享
          <p style={{ color: '#1890ff' }}>
            <span style={{ paddingRight: '10px' }}>链接：{shareQuoteLink.quoteLink}</span>
            <CopyToClipboard
              text={shareQuoteLink.quoteLink}
              onCopy={() => message.success('复制成功~')}
            >
              <Button type="primary">复制链接</Button>
            </CopyToClipboard>
          </p>
          <p style={{ color: '#999', fontSize: '12px' }}>
            *复制链接成功后，将「链接」通过微信、短信、邮件等方式，发送给客户(仅支持纯链接文本形式)
          </p>
        </div>
        <div className="" style={{ margin: 20, marginTop: 0 }}>
          方法二：微信扫描分享
          <div style={{ display: 'flex', flexDirection: 'row', paddingTop: '10px' }}>
            <Image width={100} src={shareQuoteLink.data} />
            <div style={{ paddingLeft: '10px' }}>
              <p>1、打开微信，使用“扫一扫”功能，扫描弹窗二维码；</p>
              <p>2、进入落地页，点击页面右上角的分享功能；</p>
              <p>3、选择好友，进行分享(此方法可以生成卡片模式)；</p>
            </div>
          </div>
        </div>
        <div className="ant-modal-footer">
          <Button htmlType="button" onClick={() => setShareLinkModalShow(false)}>
            关 闭
          </Button>
        </div>
      </Modal>
    </div>
  );
};
// export default Index;
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <Index />
  </KeepAlive>
);
