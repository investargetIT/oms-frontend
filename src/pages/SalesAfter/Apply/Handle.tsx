/* eslint-disable no-param-reassign */
// 此页面公用 售后申请详情 售后处理
import ProForm, { DrawerForm, ModalForm } from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import Dtitle from '@/pages/components/Dtitle';
import UploadFile from './components/UploadFile';
import ProTable from '@ant-design/pro-table';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Space,
  Tabs,
  Image,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type { TableListItem } from '../../InquirySheet/Offer/const';
import ApplyInfo from './components/ApplyInfo';
import BasicInfo from './components/BasicInfo';
import '../index.less';
import { transportColumns } from '../contants';
import {
  editAfter,
  getLogistics,
  queryAfterDetail,
  queryListDataMap,
  updateFile,
} from '@/services/afterSales';
import { getByKeys } from '@/services/afterSales/utils';
// import RelationFlux from '../Order/components/RelationFlux';
import RelatedProcesses from '@/pages/SalesOrder/components/RelatedProcesses';
import Cookies from 'js-cookie';
import moment from 'moment';
import Log from '@/pages/InquirySheet/Offer/components/Log';

const { TabPane } = Tabs;

interface HandleProps {
  id: any;
  from: string;
  onClose: (status: boolean) => void;
}

const Handle: React.FC<HandleProps> = ({ id = '', from = '', onClose }) => {
  const tableRef = useRef<ActionType>();
  const [modalVisibleUpload, setModalVisibleUpload] = useState<any>(false);
  const [form] = Form.useForm();
  const [info, setInfo] = useState<any>({});
  const [logisticsList, setLogisticsList] = useState<any>([]);
  const [transList, setTransList] = useState<any>([]);
  const [picImg, setPicImg] = useState<string>('');
  const [statusList, setStatusList] = useState<any>([]);
  const [returnHourse, setReturnHourse] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const formRef = useRef<any>();
  const [logVisible, setLogVisible] = useState<any>(false);
  const [logData, setLogData] = useState({});
  const [tempList, setTempList] = useState<any>([]);
  const showList = (arr: any) => {
    setTempList(arr);
  };
  const getQueryAfterDetail = () => {
    queryAfterDetail({ afterSalesNo: id }).then((res: any) => {
      const { data, errCode } = res;
      if (errCode === 200) {
        const newData = {
          ...data,
          afterSales: {
            ...data.afterSales,
            contactName: {
              value: data?.afterSales.contactCodeR3,
              label: data?.afterSales.contactNameR3,
            },
            afterSalesType: data?.afterSales?.afterSalesType
              ? data?.afterSales?.afterSalesType?.split(',')?.map((io: any) => Number(io))
              : '',
            regionName: data?.afterSales?.province
              ? `${data?.afterSales?.province}/${data?.afterSales?.city}/${data?.afterSales?.district}`
              : '',
          },
        };
        setInfo(newData);
      }
    });
  };

  useEffect(() => {
    getQueryAfterDetail();
    //枚举对象 明细信息里面的
    const par = {
      list: [
        'cargoStatusEnum',
        'returnWarehouseEnum',
        'processResultEnum',
        'skuStatusEnum',
        'realReasonOperateEnum',
      ],
    };
    getByKeys(par).then((res: any) => {
      if (res?.errCode === 200) {
        setStatusList(
          res?.data?.map((io: any) => {
            return io.enums.map((ic: any) => ({
              ...ic,
              value: ic.code,
              label: ic.name,
            }));
          }),
        );
      }
    });

    // 获取地址数据
    queryListDataMap({ typeList: ['retureWareHouse'] }).then((res: any) => {
      if (res.errCode === 200) {
        setReturnHourse(
          res?.data?.retureWareHouse?.map((io: any) => ({
            ...io,
            value: io.key,
            label: io.value,
          })),
        );
      }
    });
    return () => {
      setInfo({});
    };
  }, [id, from]);

  const [visible, setVisible] = useState(false);
  const fileColumns: ProColumns<any>[] = [
    { title: '文件名称', dataIndex: 'resourceName' },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 200,
      render: (_, record: any) => {
        const str = record?.fileType?.split('.');
        return (
          <Space>
            <a
              href={`${record?.resourceUrl}`}
              target="_blank"
              type="link"
              download
              rel="noreferrer"
            >
              下载
            </a>
            {['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(str[1]) && (
              <div>
                <Button
                  size="small"
                  key={'查看'}
                  type="link"
                  onClick={() => {
                    setVisible(true);
                    setPicImg(record.resourceUrl);
                  }}
                >
                  查看
                </Button>
                <Image
                  width={10}
                  style={{ display: 'none' }}
                  src={picImg}
                  preview={{
                    visible,
                    src: picImg,
                    onVisibleChange: (value) => {
                      setVisible(value);
                    },
                  }}
                />
              </div>
            )}
          </Space>
        );
      },
    },
  ];
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
    },
    {
      title: '发货单行号',
      dataIndex: 'obdItemNo',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'SKU号',
      dataIndex: 'sku',
      width: 100,
      className: from === 'handle' ? 'red' : '',
      fixed: 'left',
    },
    {
      title: '产品名称',
      dataIndex: 'itemName',
      width: 400,
      render: (_, record: any) => {
        return `${record?.brandName || ''} ${record?.itemName} ${record?.mfgSku || ''}`;
      },
      ellipsis: true,
    },
    {
      title: '备货类型',
      dataIndex: 'stockType',
      width: 100,
    },
    { title: '物料码', dataIndex: 'stockSkuCode', width: 100 },
    { title: '销售包装单位数量', dataIndex: 'unitQuantity', width: 150 },
    // {
    //   title: '是否可退换货',
    //   dataIndex: 'returnFlagName',
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
      title: '成交价',
      dataIndex: 'salesPrice',
      width: 100,
    },
    {
      title: '发货数量',
      dataIndex: 'qty',
      width: 100,
    },
    {
      title: `${from === 'detail' ? '售后费用合计' : '售后价格'}`,
      dataIndex: 'totalExpensePrice',
      width: 100,
      className: from === 'handle' ? 'red' : '',
      render: (_, record) => {
        if (from === 'handle') {
          return (
            <InputNumber
              placeholder="请输入"
              min={0}
              max={record.salesPrice * (record.applyQty || 1)}
              required
              value={record?.totalExpensePrice}
              defaultValue={record?.processResultType == 30 ? 0 : record.totalExpensePrice}
              onChange={(v) => {
                if (record?.processResultType == 30) {
                  record.totalExpensePrice = 0;
                } else {
                  record.totalExpensePrice = v;
                }
                setInfo({
                  ...info,
                  lineList: info?.lineList?.map((io: any) => {
                    if (io.sid === record.sid) {
                      io = record;
                    }
                    return io;
                  }),
                });
              }}
            />
          );
        } else {
          return record.totalExpensePrice;
        }
      },
    },

    {
      title: '申请售后数量',
      dataIndex: 'applyQty',
      width: 150,
      className: from === 'handle' ? 'red' : '',
      render: (_, record: any) => {
        return record.applyQty;
      },
      // render: (_, record: any) => {
      //   if (from === 'detail') {
      //     return record.applyQty;
      //   } else if (from === 'handle') {
      //     return (
      //       <InputNumber
      //         placeholder="请输入"
      //         min={0}
      //         defaultValue={record.applyQty || 0}
      //         onChange={(v) => {
      //           record.applyQty = v;
      //           return v;
      //         }}
      //       />
      //     );
      //   }
      // },
    },
    {
      title: '最终处理结果',
      dataIndex: 'processResultType',
      className: from === 'handle' ? 'red' : '',
      render: (_, record: any) => {
        return (
          <Select
            style={{ width: '130px' }}
            placeholder="请选择"
            options={statusList[2]}
            disabled={from === 'detail' ? true : false}
            defaultValue={record?.processResultType}
            onChange={(val: any) => {
              record.processResultType = val;
              record.totalExpensePrice = val == 30 ? 0 : record.totalExpensePrice;
              if (val === 30 || val == 50) {
                //?当最终处理结果是补发或者不支持售后，就清空退回仓库的选择项
                record.returnWarehouseType = '';
              }
              setInfo({
                ...info,
                lineList: info?.lineList?.map((io: any) => {
                  //?表格联动，将当前行的record修改之后，替换掉原来的明细的行数据
                  if (io.sid === record.sid) {
                    return record;
                  } else {
                    return io;
                  }
                }),
              });
              return val;
            }}
          />
        );
      },
      width: 150,
    },
    {
      title: 'SKU状态',
      dataIndex: 'skuStatus',
      className: from === 'handle' ? 'red' : '',
      render: (_, record: any) => {
        return (
          <Select
            style={{ width: '130px' }}
            placeholder="请选择"
            options={statusList[3]}
            disabled={from === 'detail' ? true : false}
            defaultValue={record?.skuStatus}
            onChange={(val: any) => {
              const defaultSecondaryShelvesFlag: any = record.secondaryShelvesFlag;
              record.skuStatus = val;
              if (val === 30) {
                //?当SKU状态是‘退供应商’，‘是否二次上架’的值为2
                record.secondaryShelvesFlag = 2;
              } else {
                if (!defaultSecondaryShelvesFlag || defaultSecondaryShelvesFlag === 2) {
                  record.secondaryShelvesFlag = 0;
                } else {
                  record.secondaryShelvesFlag = defaultSecondaryShelvesFlag;
                }
              }
              setInfo({
                ...info,
                lineList: info?.lineList?.map((io: any) => {
                  //?表格联动，将当前行的record修改之后，替换掉原来的明细的行数据
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
      width: 150,
    },
    {
      title: '货物状态',
      dataIndex: 'cargoStatus',
      className: from === 'handle' ? 'blue' : '',
      render: (_, record: any) => {
        return (
          <Select
            style={{ width: '130px' }}
            placeholder="请选择"
            disabled={from === 'detail' ? true : false}
            defaultValue={record?.cargoStatus}
            options={statusList[0]}
            onChange={(val: any) => {
              record.cargoStatus = val;
              setInfo({
                ...info,
                lineList: info?.lineList?.map((io: any) => {
                  //?表格联动，将当前行的record修改之后，替换掉原来的明细的行数据
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
      width: 150,
    },
    {
      title: '客户描述是否一致',
      dataIndex: 'customerDescFlag',
      className: from === 'handle' ? 'blue' : '',
      render: (_, record: any) => {
        return (
          <Select
            options={[
              { label: '否', value: 0 },
              { label: '是', value: 1 },
            ]}
            placeholder="请选择"
            disabled={from === 'detail' ? true : false}
            defaultValue={record?.customerDescFlag}
            onChange={(val: any) => {
              record.customerDescFlag = val;
              setInfo({
                ...info,
                lineList: info?.lineList?.map((io: any) => {
                  //?表格联动，将当前行的record修改之后，替换掉原来的明细的行数据
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
      width: 150,
    },
    {
      title: '最终原因',
      dataIndex: 'realReasonType',
      className: from === 'handle' ? 'red' : '',
      // render: (_, record: any) => {
      //   return record?.realReasonTypeName;
      // },
      render: (_, record: any) => {
        if (from === 'detail') {
          return record?.realReasonTypeName;
        } else {
          if (record?.realReasonType && record?.realReasonTypeName != '') {
            return record?.realReasonTypeName;
          } else {
            return (
              <Select
                style={{ width: '130px' }}
                placeholder="请选择"
                options={statusList[4]}
                disabled={from === 'detail' ? true : false}
                defaultValue={record?.realReasonType}
                value={record?.realReasonType}
                onChange={(val: any) => {
                  record.realReasonType = val;
                  setInfo({
                    ...info,
                    lineList: info?.lineList?.map((io: any) => {
                      //?表格联动，将当前行的record修改之后，替换掉原来的明细的行数据
                      if (io.sid === record.sid) {
                        return record;
                      } else {
                        return io;
                      }
                    }),
                  });
                  return val;
                }}
              />
            );
          }
        }
      },
      width: 150,
    },
    {
      title: 'abc Flag',
      dataIndex: 'abcFlag',
      width: 100,
    },
    {
      title: '客户退换货',
      dataIndex: 'customerReturns',
      width: 100,
    },
    {
      title: 'SKU状态备注',
      width: 150,
      className: from === 'handle' ? 'blue' : '',
      dataIndex: 'skuStatusRemark',
      render: (_, record: any) => {
        if (from === 'detail') {
          return record.skuStatusRemark;
        } else {
          return (
            <Input
              defaultValue={record?.skuStatusRemark}
              placeholder="请输入"
              onChange={(val: any) => {
                record.skuStatusRemark = val.target.value;
                setInfo({
                  ...info,
                  lineList: info?.lineList?.map((io: any) => {
                    //?表格联动，将当前行的record修改之后，替换掉原来的明细的行数据
                    if (io.sid === record.sid) {
                      io = record;
                    }
                    return io;
                  }),
                });
                return val.target.value;
              }}
            />
          );
        }
      },
    },

    {
      title: '行备注',
      dataIndex: 'lineRemark',
      className: from === 'handle' ? 'blue' : '',
      render: (_, record: any) => {
        if (from === 'detail') {
          return record.lineRemark;
        } else {
          return (
            <Input
              placeholder="请输入"
              name="lineRemark"
              defaultValue={record?.lineRemark}
              onChange={(v) => {
                record.lineRemark = v.target.value;
                setInfo({
                  ...info,
                  lineList: info?.lineList?.map((io: any) => {
                    //?表格联动，将当前行的record修改之后，替换掉原来的明细的行数据
                    if (io.sid === record.sid) {
                      io = record;
                    }
                    return io;
                  }),
                });
                return v.target.value;
              }}
            />
          );
        }
      },
      width: 150,
    },
    {
      title: '退回仓库',
      dataIndex: 'returnWarehouseType',
      className: from === 'handle' ? 'blue' : '',
      width: 250,
      render: (_, record: any) => {
        if (from === 'detail') {
          return record?.returnWarehouseTypeName;
        } else {
          return (
            // <ProFormSelect
            //   showSearch
            //   allowClear={false}
            //   name="returnWarehouseType"
            //   options={statusList[1]}
            //   disabled={record?.processResultType == 30 ? true : false} //补发时，此字段禁用
            //   rules={[{ required: true, message: '请选择' }]}
            //   fieldProps={{
            //     defaultValue: record?.returnWarehouseType,
            //     onChange: (val: any) => {
            //       record.returnWarehouseType = val;
            //       return val;
            //     }
            //   }}
            // />
            <Select
              style={{ width: '200px' }}
              placeholder="请选择"
              options={returnHourse}
              //?当最终处理结果是补发或者不支持售后就禁用当前的选择项
              disabled={
                !!(record?.processResultType == 30 || record?.processResultType == 50)
                  ? true
                  : false
              } //补发时或者不支持售后，此字段禁用
              defaultValue={record?.returnWarehouseType}
              value={record.returnWarehouseType}
              onChange={(val: any) => {
                record.returnWarehouseType = val;
                setInfo({
                  ...info,
                  lineList: info?.lineList?.map((io: any) => {
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
        }
      },
    },
    {
      title: '货品接收时间',
      dataIndex: 'goodsReceiveDate',
      className: from === 'handle' ? 'blue' : '',
      width: 200,
      render: (_, record: any) => {
        if (from === 'detail') {
          return record?.goodsReceiveDate;
        } else {
          return (
            <DatePicker
              defaultValue={moment(
                record?.goodsReceiveDate ? record?.goodsReceiveDate : new Date(),
                `YYYY-MM-DD`,
              )}
              onChange={(mo: any, date: any) => {
                // console.log(mo);
                record.goodsReceiveDate = date;
                setInfo({
                  ...info,
                  lineList: info?.lineList?.map((io: any) => {
                    //?表格联动，将当前行的record修改之后，替换掉原来的明细的行数据
                    if (io.sid === record.sid) {
                      io = record;
                    }
                    return io;
                  }),
                });
                return date;
              }}
            />
          );
        }
      },
    },
    {
      title: '维修费走质保',
      dataIndex: 'repairCostInQaFlagName',
      width: 100,
    },
    {
      title: '理赔金额',
      dataIndex: 'claimPrice',
      width: 100,
    },
    {
      title: '物流问题描述',
      dataIndex: 'logisticsDescTypeName',
      width: 100,
      ellipsis: true,
    },
    {
      title: '是否二次上架',
      dataIndex: 'secondaryShelvesFlag',
      width: 100,
      render: (_, record: any) => {
        return (
          <>
            {record.skuStatus !== 30 ? (
              <Select
                options={[
                  { label: '否', value: 0 },
                  { label: '是', value: 1 },
                ]}
                placeholder="请选择"
                disabled={from === 'detail' ? true : false}
                defaultValue={record?.secondaryShelvesFlag || 0}
                onChange={(val: any) => {
                  record.secondaryShelvesFlag = val;
                  setInfo({
                    ...info,
                    lineList: info?.lineList?.map((io: any) => {
                      //?表格联动，将当前行的record修改之后，替换掉原来的明细的行数据
                      if (io.sid === record.sid) {
                        io = record;
                      }
                      return io;
                    }),
                  });
                  return val;
                }}
              />
            ) : (
              <>-</>
            )}
          </>
        );
      },
    },
    {
      title: '是否JV',
      dataIndex: 'jvFlag', // jvFlag
      width: 100,
      hideInTable: true,
    },
    {
      title: 'JV公司',
      dataIndex: 'jvCompanyName', // jvCompanyCode
      width: 250,
      hideInTable: true,
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  useEffect(() => {
    if (info?.afterSales?.obdNo)
      setLogData({
        obd_no_list: [info?.afterSales?.obdNo],
        sys_user: 'OMS',
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info?.afterSales]);
  const tabChange = async (val: any) => {
    if (val == 3) {
      // const par = {
      //   // obd_no_list: ['0402429067'], 演示
      //   obd_no_list: [info?.afterSales?.obdNo],
      //   sys_user: 'OMS',
      // };
      await getLogistics(logData).then((res) => {
        const tran_data_list = [];
        if (res?.errCode === 200) {
          for (let i = 0; i < res?.data?.length; i++) {
            tran_data_list.push(res?.data[i].tran_data_list);
          }
          setLogisticsList(res?.data[0]?.image_urlList);
          setTransList(tran_data_list.flat().map((io: any, index) => ({ ...io, index })));
        } else {
          message.error(res?.errMsg);
        }
      });
    }
  };

  const submit = async (type: any) => {
    formRef.current?.validateFieldsReturnFormatValue?.().then(async (values: any) => {
      setLoading(true);
      const { packageFullFlag = '', invoiceInfoConfirm = '' } = values as any;
      if (info?.lineList?.some((ic: any) => ic.applyQty == 0)) {
        message.error('申请售后数量不能为0');
        setLoading(false);
        return;
      }
      const par = {
        sid: info.afterSales?.sid,
        packageFullFlag,
        invoiceInfoConfirm,
        statusFalg: type === 1 ? true : false,
        lineList: info?.lineList,
      };
      const errList = info?.lineList?.every((io: any) => io.processResultType);
      const hasPrice = info?.lineList?.every((io: any) => io?.totalExpensePrice?.toString());
      const hasSku = info?.lineList?.every((io: any) => io.skuStatus);
      // const hasReason = info?.lineList?.every((io: any) => io.realReasonType);

      if (info?.afterSales?.afterSalesType) {
        if (info?.lineList?.some((io: any) => !io.realReasonType)) {
          message.warning('您有未完善的行明细信息,(最终原因)');
          setLoading(false);
          return false;
        }
      }

      if (!errList || !hasPrice || !hasSku) {
        message.warning('您有未完善的行明细信息，请填写正确的信息');
        setLoading(false);
        return false;
      }

      for (let i = 0; i < info?.lineList?.length; i++) {
        //?当前的最终处理结果是补发或者是不支持售后那么就不进行校验
        console.log();
        if (
          info?.lineList[i].processResultType !== 30 &&
          info?.lineList[i].processResultType !== 50 &&
          info?.lineList[i].processResultType !== 60 &&
          !info?.lineList[i].returnWarehouseType
        ) {
          setLoading(false);
          return message.error(
            `售后明细信息第${i + 1}条缺少处理售后的仓库，请联系供应链售后确认仓库信息`,
          );
        }
        if (
          ([10, 20, 40].includes(info?.lineList[i].processResultType) &&
            info?.lineList[i].returnWarehouseType) ||
          [30, 50, 60].includes(info?.lineList[i].processResultType)
        ) {
        } else {
          message.error('请输入行信息对应的退回仓库地址');
          setLoading(false);
          return false;
        }
      }

      const { errCode, errMsg } = await editAfter(par);
      if (errCode === 200) {
        message.success('提交成功');
        setLoading(false);
        onClose(false);
      } else {
        setLoading(false);
        message.error(errMsg);
      }
    });
  };

  // const downLoadOrder = async () => {
  //   const par = {
  //     orderNo: info?.afterSales?.orderNo,
  //     afterSalesNo: info?.afterSales?.afterSalesNo,
  //     totalPrice: info?.lineList
  //       ?.filter((io: any) => io.processResultType == 40)
  //       ?.map((ic: any) => ic.totalExpensePrice)
  //       ?.reduce((cur: any, net: any) => cur + net),
  //     token: Cookies.get('ssoToken'),
  //   };
  //   downAfterSalesPdf(par).then((res) => {
  //     const blob = new Blob([res], {
  //       type: 'application/vnd.ms-pdf',
  //     });
  //     let link = document.createElement('a') as any;
  //     link.href = URL.createObjectURL(blob);
  //     link.setAttribute('download', `【${info?.afterSales?.orderNo}】售后费用报价单.pdf`);
  //     link.click();
  //     link = null;
  //     message.success('导出成功');
  //   });
  // };

  // const isDown = info?.lineList
  //   ?.filter((io: any) => io.processResultType == 40)
  //   ?.some((ic: any) => ic.totalExpensePrice > 0);

  return (
    <div className="form-content-search salesAfterApplyDrawerEdit" id="salesAfterApplyEdit">
      <Button
        type="primary"
        style={{ zIndex: 9999999, top: '17px', right: '190px', position: 'absolute' }}
        onClick={() => setModalVisibleUpload(true)}
      >
        追加附件
      </Button>
      <Button
        style={{ zIndex: 9999999, top: '17px', right: '90px', position: 'absolute' }}
        type="link"
        onClick={() => setLogVisible(true)}
      >
        操作日志{' '}
      </Button>
      <ProForm
        layout="horizontal"
        initialValues={[]}
        formRef={formRef}
        form={form}
        className="fix_lable_large has-gridForm"
        onFinishFailed={() => {
          setLoading(false);
          message.warning('您有未完善的信息，请填写正确的信息');
        }}
        submitter={{
          searchConfig: {},
          render: () => {
            if (from == 'detail') {
              return null;
            } else if (from === 'handle') {
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
                    {/* {isDown && (
                      <Button onClick={downLoadOrder} loading={loading}>
                        下载维修费报价单
                      </Button>
                    )} */}
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={() => submit(0)}
                      loading={loading}
                    >
                      仅保存
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={() => submit(1)}
                      loading={loading}
                    >
                      保存并提交
                    </Button>
                    <Button onClick={() => onClose(false)}>取消</Button>
                  </Space>
                </div>
              );
            }
          },
        }}
      >
        <div className="drawerEditContentCol">
          <Tabs defaultActiveKey="1" size="large" onChange={tabChange} className="fixTab">
            <TabPane tab="基本信息" key="1">
              <div className={'minHeight'}>
                <Card title="售后基本信息" bordered={false} id="basic">
                  {info.afterSales && (
                    <BasicInfo type={from} readonly={true} info={info?.afterSales} />
                  )}
                </Card>
                <Card title="详细申请信息" bordered={false} id="pay">
                  {/* type 动态类型 params */}
                  {info.afterSales && (
                    <ApplyInfo type={from} readonly={true} info={info?.afterSales} />
                  )}
                </Card>
                <Card title="附件" bordered={false} className="order-msg" id="pay">
                  <ProTable<any>
                    style={{ width: '70%' }}
                    columns={fileColumns}
                    size="small"
                    bordered
                    rowKey={'sid'}
                    options={false}
                    search={false}
                    dateFormatter="string"
                    dataSource={info?.resourceList}
                    tableAlertRender={false}
                    rowSelection={false}
                    // pagination={{//?这里的分页器去掉，避免添加分页的时候，提交的时候提示指定那一条的退回仓库没有填，序号错误
                    //   position: ['bottomLeft'],
                    //   pageSize: 10,
                    //   showQuickJumper: true,
                    // }}
                  />
                </Card>
                <Card title="售后明细信息" bordered={false} className="order-msg" id="shopDetail">
                  <Space
                    style={{
                      fontSize: '12px',
                      color: '#898b8c',
                      display: 'block',
                      textAlign: 'right',
                    }}
                  >
                    币种：CNY
                  </Space>
                  <ProTable<TableListItem>
                    columns={columns}
                    scroll={{ x: 100, y: 500 }}
                    bordered
                    rowKey={'sid'}
                    size="small"
                    actionRef={tableRef}
                    options={false}
                    search={false}
                    pagination={{
                      showSizeChanger: true,
                      pageSizeOptions: ['10', '20', '50', '100'],
                      showTotal: (total, range) =>
                        `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                      showQuickJumper: true,
                    }}
                    dateFormatter="string"
                    dataSource={info?.lineList}
                  />
                </Card>
              </div>
            </TabPane>
            <TabPane tab="相关流程" key="2">
              {/*<RelationFlux workflowId={info?.afterSales?.afterSalesNo} />*/}
              <RelatedProcesses billNo={info?.afterSales?.afterSalesNo} />
            </TabPane>
            <TabPane tab="物流信息" key="3">
              <Card title="物流签收单明细" bordered={false}>
                <ProTable<ProColumns>
                  className="table-cust"
                  columns={[
                    {
                      title: '签收单',
                      dataIndex: 'url',
                      align: 'left',
                    },
                    {
                      title: '操作',
                      dataIndex: 'option',
                      valueType: 'option',
                      align: 'left',
                      width: 200,
                      render: (_, record: any) => (
                        <Space>
                          <Button
                            type="link"
                            target="_blank"
                            href={`${record.url}?token=${Cookies.get('ssoToken')}`}
                            key={'down'}
                          >
                            下载
                          </Button>
                          <Button
                            type="link"
                            target="_blank"
                            href={`${record.url}?token=${Cookies.get('ssoToken')}`}
                            key={'look'}
                          >
                            查看
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                  scroll={{ x: 200, y: 500 }}
                  size="small"
                  bordered
                  rowKey={'url'}
                  options={false}
                  search={false}
                  pagination={{
                    position: ['bottomLeft'],
                    pageSize: 5,
                    showQuickJumper: true,
                  }}
                  dateFormatter="string"
                  dataSource={logisticsList}
                />
              </Card>
              <Card title="物流明细" bordered={false}>
                <ProTable<ProColumns>
                  className="table-cust"
                  columns={transportColumns}
                  scroll={{ x: 200, y: 500 }}
                  size="small"
                  bordered
                  rowKey="index"
                  options={false}
                  search={false}
                  pagination={{
                    position: ['bottomLeft'],
                    pageSize: 5,
                    showQuickJumper: true,
                  }}
                  dateFormatter="string"
                  dataSource={transList}
                />
              </Card>
            </TabPane>
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
          extra: (
            <Space>
              <Button
                onClick={() => {
                  setLogVisible(false);
                }}
              >
                关闭
              </Button>
            </Space>
          ),
        }}
      >
        <Log
          sourceId={info?.afterSales?.sid}
          title="申请编号"
          sourceType={80}
          quotCode={info?.afterSales?.afterSalesNo}
        />
      </DrawerForm>
      <ModalForm
        title={<Dtitle title="附件上传" subTitle="附件上限100个，单个文件不得超过100M" />}
        width={1100}
        visible={modalVisibleUpload}
        onVisibleChange={setModalVisibleUpload}
        modalProps={{ destroyOnClose: true }}
        submitter={{
          searchConfig: {
            submitText: '确认',
            resetText: '取消',
          },
        }}
        onFinish={async () => {
          await updateFile({ sid: info.afterSales.sid, resourceList: tempList });
          getQueryAfterDetail();
          return true;
        }}
      >
        <UploadFile showList={showList} />
      </ModalForm>
    </div>
  );
};

export default Handle;
