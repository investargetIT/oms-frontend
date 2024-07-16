/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useState, useRef } from 'react';
import { Button, Form, Input, message, Modal, Select, InputNumber, Spin } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import {
  getOrderDateList,
  cancelAndReleaseOrder,
  getCancellationDetail,
  requestSubmit,
  onlySave,
} from '@/services/SalesOrder';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import UploadList from './UploadList';
import OrderDetailDrawer from './OrderDetailDrawer';
import { useModel } from 'umi';
import './style.css';
import ReceptionDrawer from '@/pages/SalesOrder/OrderModificationApplication/components/ReceptionDrawer';

interface detailInfo {
  pageParams?: any;
  orderRecord?: any;
  tableReload?: any;
  orderNo?: any;
  defaultData?: any;
  addNewDrawerClose?: any;
  type?: any;
  getSid?: any;
  // releaseOrder?: any;
}
const Index: React.FC<detailInfo> = (props: any) => {
  const { orderNo, defaultData, type, orderRecord, pageParams, getSid } = props;
  const { initialState } = useModel('@@initialState');
  const [yClient, setYClient] = useState(900);
  const ref: any = useRef<ActionType>();
  const [load, setLoad]: any = useState(false);
  const [confirmLoading, setConfirmLoading]: any = useState(false);
  const [form] = Form.useForm();

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

  const [fileData, setFileData] = useState([]);
  const [deleteFileData, setDeleteFileData] = useState([]);
  // const [fileDataList, setFileDataList] = useState<any>([]);

  const [CancelTypeData, setCancelTypeData]: any = useState([]);
  const [CancelReasonData, setCancelReasonData]: any = useState([]);

  // const [initialValues, setInitialValues]: any = useState({});
  const [precision, setPrecision]: any = useState(0);

  const [basicData, setBasicData]: any = useState({});
  const [skuLineData, setSkuLineData]: any = useState([]);
  const [applyAmount, setApplyAmount]: any = useState(0);
  const [applyQty, setApplyQty]: any = useState(0);
  // 仅保存有变化的行数据
  // const [submitData, setSubmitData]: any = useState([]);
  const [allQtyData, setAllQtyData]: any = useState([]);

  // const getFileDataList = async (sid: any) => {
  //   const searchParams: any = {
  //     pageNumber: currentPage,
  //     pageSize: currentPageSize,
  //     sourceId: sid,
  //     sourceType: 150,
  //     // subType: 30,
  //   };
  //   const res = await getFilesList(searchParams);
  //   if (res.errCode === 200) {
  //     setFileDataList(res?.data?.list);
  //     // setTotal(res.data?.total)
  //   } else {
  //     message.error(res.errMsg, 3);
  //   }
  // };
  function totalSummary(arr: any) {
    let amount = 0;
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
      amount += arr[i].max * arr[i].salesPrice;
      total += arr[i].requestQty * arr[i].salesPrice;
    }
    if (defaultData?.requestType == 1) {
      return amount;
    } else {
      return total;
    }
  }
  function totalQty(arr: any) {
    let totalAmountQty = 0;
    let total_Qty = 0;
    for (let i = 0; i < arr.length; i++) {
      totalAmountQty += arr[i].max;
      total_Qty += arr[i].requestQty;
    }
    if (defaultData?.requestType == 1) {
      return totalAmountQty;
    } else {
      return total_Qty;
    }
  }

  useEffect(() => {
    setLoad(true);
    getOrderDateList({ type: 'orderRequestCancelType' }).then((res: any) => {
      if (res.errCode === 200) {
        setCancelTypeData(res.data?.dataList);
        setCancelReasonData(res.data?.dataList[defaultData?.cancelType - 1]?.children);
      }
    });

    form.setFieldsValue({
      requestType: defaultData?.requestType,
      cancelType: defaultData?.cancelType + '',
      cancelReason: defaultData?.cancelReason,
      orderNo: orderNo,
    });
    getCancellationDetail(getSid).then((res: any) => {
      if (res?.errCode === 200) {
        // console.log(res.data)
        setBasicData(res?.data?.requestVo);
        // setBasicData(allData?.requestVo);
        if (res?.data?.requestVo?.orderChannel == 22) {
          setPrecision(2);
        }
        const lineData = res?.data?.lnVos?.map((item) => {
          const itemData = item;
          itemData.max = Number(item.qty) - Number(item.cancelQty);
          itemData.notDeliveryQty =
            Number(item.qty) - Number(item.cancelQty) - Number(item.closeQty);
          itemData.defaultQty = itemData?.requestQty || 0;
          if (type !== 'view') {
            itemData.qtyEditDisabled = false;
            if (type == 'add') {
              itemData.requestQty = 0;
            }
            if (Number(item.qty) === Number(item.cancelQty)) {
              itemData.qtyEditDisabled = true;
              itemData.requestQty = itemData.max;
            }
            if (defaultData?.requestType == 1) {
              itemData.qtyEditDisabled = true;
              itemData.requestQty = itemData.max;
            }
            // 订单不可编辑
            if (res?.data?.requestVo?.isEdit == 0) {
              itemData.qtyEditDisabled = true;
            }
          } else {
            itemData.qtyEditDisabled = true;
          }
          itemData.lnRequestAmount = (
            Number(itemData.requestQty) * Number(itemData.salesPrice)
          ).toFixed(2);
          return itemData;
        });

        setSkuLineData(lineData);
        // console.log(skuLineData);
        setApplyAmount(totalSummary(lineData).toFixed(2));
        // getFileDataList(orderRecord?.sid);
        const newQtyData = lineData?.map((item) => {
          return {
            sid: item.sid,
            sku: item.sku,
            soLnSid: item.soLnSid,
            requestQty: item?.requestQty || 0,
          };
        });
        setAllQtyData(newQtyData);

        if (type == 'add') {
        } else if (type == 'edit') {
          // if (defaultData?.requestType == 2) {
          //   const hasChangeData = res?.data?.lnVos?.map((i) => {
          //     // if (i.requestQty > 0) {
          //     return {
          //       sid: i.sid,
          //       sku: i.sku,
          //       soLnSid: i.soLnSid,
          //       requestQty: i.requestQty,
          //     };
          //     // }
          //   });
          //   setSubmitData(hasChangeData);
          // }

          form.setFieldsValue({
            repeatOrderNo: res?.data?.requestVo?.repeatOrderNo || '',
            receptionCode: res?.data?.requestVo?.receptionCode || '',
            remark: res?.data?.requestVo?.remark,
          });
        } else if (type == 'view') {
        }
        setLoad(false);
      }
    });
  }, []);

  const handleCancelTypeChange = (value: any) => {
    setCancelReasonData(CancelTypeData[value - 1]?.children);
    form.setFieldsValue({
      cancelReason: CancelTypeData[value - 1]?.children[0]?.key,
    });
    // getOrderDateList({ type: 'orderRequestCancelType' }).then((res: any) => {
    //   if (res.errCode === 200) {
    //     setCancelReasonData(res.data?.dataList[value - 1]?.children);
    //     form.setFieldsValue({
    //       cancelReason: res.data?.dataList[value - 1]?.children[0]?.key,
    //     });
    //   }
    // });
  };

  const onFinish = (values: any) => {
    console.log(values, fileData);
    setConfirmLoading(true);
    setLoad(true);

    if (fileData.length == 0) {
      message.error('至少要上传一个附件', 3);
      setConfirmLoading(false);
      setLoad(false);
    } else if (applyQty === 0) {
      message.error('申请取消数量不可都为0', 3);
      setConfirmLoading(false);
      setLoad(false);
      // } else if (applyAmount == 0) {
      //   message.error('申请取消数量不可都为0', 3);
      //   setConfirmLoading(false);
      //   setLoad(false);
    } else {
      Modal.confirm({
        title: '您确定要提交本次申请吗？',
        onOk() {
          const requestVo = JSON.parse(JSON.stringify(values));
          requestVo.requestNo = basicData?.requestNo;
          const formData: any = {};
          formData.requestVo = requestVo;
          formData.resourceVOList = fileData;
          if (type !== 'view') {
            formData.delFileIds = deleteFileData;
          }
          if (values.requestType === '1') {
            formData.lnVos = [];
          } else {
            formData.lnVos = allQtyData;
          }
          console.log(formData);
          requestSubmit(formData)
            .then((res: any) => {
              if (res?.errCode === 200) {
                props.addNewDrawerClose();
                props.tableReload();
                message.success('本次申请提交成功');
                setConfirmLoading(false);
                setLoad(false);
              } else {
                message.error(res?.errMsg);
                setConfirmLoading(false);
                setLoad(false);
              }
            })
            .finally(() => {
              return;
            })
            .catch((errorInfo) => {
              message.error(errorInfo, 3);
            });
        },
        onCancel() {
          // console.log(submitData);
          setConfirmLoading(false);
          setLoad(false);
        },
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error('带红色*字段不能为空', 3);
    console.log('Failed:', errorInfo);
  };

  const releaseOrder = () => {
    Modal.confirm({
      title: '您确定要取消本次申请吗？',
      icon: <ExclamationCircleOutlined />,
      content: '这将把您之前的操作全部还原。',
      onOk() {
        cancelAndReleaseOrder(getSid)
          .then((res: any) => {
            if (res?.errCode === 200) {
              form.resetFields();
              props.addNewDrawerClose();
              message.success('本次申请已取消');
            } else {
              message.error(res?.errMsg);
              setConfirmLoading(false);
            }
          })
          .finally(() => {
            return;
          })
          .catch((errorInfo) => {
            message.error(errorInfo, 3);
            setConfirmLoading(false);
          });
      },
      onCancel() {},
    });
  };
  const onReset = () => {
    if (type == 'add') {
      releaseOrder();
    } else if (type === 'edit') {
      form.resetFields();
      props.addNewDrawerClose();
    }
  };

  const onlySaveClick = () => {
    setConfirmLoading(true);
    setLoad(true);
    const requestVo = JSON.parse(JSON.stringify(form.getFieldsValue(true)));
    requestVo.requestNo = basicData?.requestNo;
    const formData: any = {};
    formData.requestVo = requestVo;
    formData.resourceVOList = fileData;
    if (type !== 'view') {
      formData.delFileIds = deleteFileData;
    }

    if (form.getFieldsValue(true).requestType === '1') {
      formData.lnVos = [];
    } else {
      formData.lnVos = allQtyData;
    }
    console.log(formData);
    const saveData = JSON.parse(JSON.stringify(formData));
    onlySave(saveData)
      .then((res: any) => {
        if (res?.errCode === 200) {
          form.resetFields();
          props.addNewDrawerClose();
          props.tableReload();
          message.success('本次修改保存成功');
          setConfirmLoading(false);
          setLoad(false);
        } else {
          message.error(res?.errMsg);
          setConfirmLoading(false);
          setLoad(false);
        }
      })
      .finally(() => {
        return;
      })
      .catch((errorInfo: any) => {
        message.error(errorInfo, 3);
        setConfirmLoading(false);
        setLoad(false);
      });
  };

  const getData = (val: any) => {
    setFileData(val);
    // console.log(val);
  };

  const getDeleteData = (val: any) => {
    setDeleteFileData(val);
  };

  const limitDecimals: any = (value: string) => {
    if (value == null) {
      return '0';
    } else {
      return value
        .replace(/[^\d.]/g, '')
        .replace(/^\./g, '')
        .replace(/\.{2,}/g, '.')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
      // .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      // .replace(/\$\s?|(,*)/g, '');
    }
  };
  function numberOnChange(value: string) {
    if (value == null || value == '') {
      form.setFieldsValue({
        repeatOrderNo: '',
      });
    }
  }
  function receptionCodeOnChange(value: string) {
    if (value == null || value == '') {
      form.setFieldsValue({
        receptionCode: '',
      });
    }
  }
  const readNewQty = (value: any, record: any) => {
    skuLineData?.forEach((item: any) => {
      if (item?.soLnSid == record.soLnSid) {
        item.requestQty = Number(value);
        item.lnRequestAmount = (Number(value) * Number(record.salesPrice)).toFixed(2);
      }
    });
    record.requestQty = Number(value);
    record.lnRequestAmount = (Number(value) * Number(record.salesPrice)).toFixed(2);
    if (JSON.stringify(skuLineData) != '[]') {
      const newArr = skuLineData.map((e: any) => {
        if (e.soLnSid == record.soLnSid) {
          e.requestQty = Number(value);
          e.lnRequestAmount = (Number(value) * Number(record.salesPrice)).toFixed(2);
          return e;
        } else {
          return e;
        }
      });
      setSkuLineData(newArr);
      setApplyAmount(totalSummary(newArr));
      setApplyQty(totalQty(newArr));
      const newQtyData = newArr?.map((i) => {
        return {
          sid: i.sid,
          sku: i.sku,
          soLnSid: i.soLnSid,
          requestQty: i?.requestQty || 0,
        };
      });
      setAllQtyData(newQtyData);
    }
  };

  const changeQty = (value: any, record: any) => {
    readNewQty(value, record);
    record.requestQty = Number(value);
    record.lnRequestAmount = (Number(value) * Number(record.salesPrice)).toFixed(2);
    // console.log(submitData)
    // if (JSON.stringify(submitData) != '[]') {
    //   const res = submitData.some((e: any) => {
    //     //?先看看参数的数组里面有没有重复的
    //     return e.soLnSid == record.soLnSid;
    //   });
    //   if (!res) {
    //     //?如果没有就合并一下新的
    //     const params = submitData.concat({
    //       sid: record.sid,
    //       sku: record.sku,
    //       soLnSid: record.soLnSid,
    //       requestQty: Number(value),
    //     });
    //     setSubmitData(params);
    //   } else {
    //     //?如果有就更新当前项
    //     const newArr = submitData.map((e: any) => {
    //       if (e.soLnSid == record.soLnSid) {
    //         // e.contractDeliveryDate = record.contractDeliveryDate;
    //         e.requestQty = Number(value);
    //         return e;
    //       } else {
    //         return e;
    //       }
    //     });
    //     setSubmitData(newArr);
    //   }
    // } else {
    //   const newArr: any = {
    //     sid: record.sid,
    //     sku: record.sku,
    //     soLnSid: record.soLnSid,
    //     requestQty: Number(value),
    //   };
    //   setSubmitData(newArr);
    // }

    // const res = submitData.some((e: any) => {
    //   //?先看看参数的数组里面有没有重复的
    //   return e.soLnSid == record.soLnSid;
    // });
    // if (!res) {
    //   //?如果有就合并一下新的
    //   const params = submitData.concat({
    //     sid: record.sid,
    //     sku: record.sku,
    //     soLnSid: record.soLnSid,
    //     requestQty: Number(value),
    //   });
    //   setSubmitData(params);
    // } else {
    //   //?如果没有就更新当前项
    //   const newArr = submitData.map((e: any) => {
    //     if (e.soLnSid == record.soLnSid) {
    //       // e.contractDeliveryDate = record.contractDeliveryDate;
    //       e.requestQty = Number(value);
    //       return e;
    //     } else {
    //       return e;
    //     }
    //   });
    //   setSubmitData(newArr);
    // }
  };

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 40,
      fixed: 'left',
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 100,
      sorter: (a, b) => a.sku - b.sku,
      fixed: 'left',
    },
    {
      title: '产品名称',
      dataIndex: 'productNameZh',
      width: 200,
      sorter: (a, b) => a.productNameZh - b.productNameZh,
    },
    {
      title: '订单数量',
      dataIndex: 'qty',
      width: 100,
      sorter: (a, b) => {
        const aData = a.qty || 0;
        const bData = b.qty || 0;
        return aData - bData;
      },
    },
    {
      title: '已取消数量',
      dataIndex: 'cancelQty',
      width: 100,
      sorter: (a, b) => {
        const aData = a.cancelQty || 0;
        const bData = b.cancelQty || 0;
        return aData - bData;
      },
    },
    {
      title: '已发货数量',
      dataIndex: 'closeQty',
      width: 100,
      sorter: (a, b) => {
        const aData = a.closeQty || 0;
        const bData = b.closeQty || 0;
        return aData - bData;
      },
    },
    {
      title: '申请取消数量',
      dataIndex: 'requestQty',
      width: 100,
      render: (_, record) => {
        let statusProp: any = '';
        if (record.requestQty >= record.notDeliveryQty) {
          statusProp = {
            status: 'warning',
          };
          // }else if (record.requestQty >= record.max){
          // 	statusProp = {
          // 		status: 'error'
          // 	}
        }
        return (
          <>
            {type !== 'view' ? (
              <>
                {record?.qtyEditDisabled ? (
                  <span>{record?.requestQty}</span>
                ) : (
                  <InputNumber
                    className={`${record?.requestQty >= record?.notDeliveryQty ? 'hasDanger' : ''}`}
                    {...statusProp}
                    style={{ width: '90px' }}
                    step={1}
                    keyboard={true}
                    min={0}
                    // precision={0}
                    precision={precision}
                    max={record.max}
                    value={record?.requestQty}
                    onChange={(val: any) => {
                      changeQty(val, record);
                    }}
                    onStep={(val: any) => {
                      changeQty(val, record);
                    }}
                    onPressEnter={(e) => {
                      e.preventDefault();
                    }}
                  />
                )}
              </>
            ) : (
              <span>{record?.requestQty}</span>
            )}
          </>
        );
      },
      sorter: (a, b) => {
        const aData = a.requestQty || 0;
        const bData = b.requestQty || 0;
        return aData - bData;
      },
    },
    {
      title: '申请取消金额含税',
      dataIndex: 'lnRequestAmount',
      width: 130,
      sorter: (a, b) => {
        const aData = a.lnRequestAmount || '0';
        const bData = b.lnRequestAmount || '0';
        return aData - bData;
      },
    },
    {
      title: '面价',
      dataIndex: 'listPrice',
      width: 80,
      sorter: (a, b) => {
        const aData = a.listPrice || '0';
        const bData = b.listPrice || '0';
        return aData - bData;
      },
    },
    {
      title: '成交价含税',
      dataIndex: 'salesPrice',
      width: 100,
      sorter: (a, b) => {
        const aData = a.salesPrice || '0';
        const bData = b.salesPrice || '0';
        return aData - bData;
      },
    },
    {
      title: '成交价未税',
      dataIndex: 'salesPriceNet',
      width: 100,
      sorter: (a, b) => {
        const aData = a.salesPriceNet || '0';
        const bData = b.salesPriceNet || '0';
        return aData - bData;
      },
    },
    {
      title: '小计含税',
      dataIndex: 'lnTotalAmount',
      width: 90,
      sorter: (a, b) => {
        const aData = a.lnTotalAmount || '0';
        const bData = b.lnTotalAmount || '0';
        return aData - bData;
      },
    },
    {
      title: '运费',
      dataIndex: 'freight',
      width: 90,
      sorter: (a, b) => {
        const aData = a.freight || '0';
        const bData = b.freight || '0';
        return aData - bData;
      },
    },
    {
      title: '国际运费',
      dataIndex: 'interFreight',
      width: 90,
      sorter: (a, b) => {
        const aData = a.interFreight || '0';
        const bData = b.interFreight || '0';
        return aData - bData;
      },
    },
    {
      title: '关税',
      dataIndex: 'tariff',
      width: 90,
      sorter: (a, b) => {
        const aData = a.tariff || '0';
        const bData = b.tariff || '0';
        return aData - bData;
      },
    },
    {
      title: '备货类型',
      dataIndex: 'stockType',
      width: 150,
      sorter: (a, b) => a.stockType - b.stockType,
    },
    {
      title: '预计交货日期',
      dataIndex: 'deliveryDate',
      valueType: 'date',
      width: 150,
      sorter: (a, b) => {
        const aTime = a.deliveryDate || moment();
        const bTime = b.deliveryDate || moment();
        const aData = new Date(aTime).getTime();
        const bData = new Date(bTime).getTime();
        return aData - bData;
      },
    },
    {
      title: '客户物料号',
      dataIndex: 'customerSku',
      width: 150,
      sorter: (a, b) => a.customerSku - b.customerSku,
    },
    {
      title: '客户需求行号',
      dataIndex: 'poItemNo',
      width: 150,
      sorter: (a, b) => a.poItemNo - b.poItemNo,
    },
  ];

  columns.forEach((item: any) => {
    item.ellipsis = true;
    item.align = 'center';
  });

  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 500);
  }, [initialState?.windowInnerHeight]);

  return (
    <div className="form-content-search tabs-detail requestDetail" id="RequestChannel">
      <section className="omsAntStyles">
        <Form
          className="has-gridForm"
          name="form"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          // initialValues={{
          // 	requestType: defaultData?.requestType,
          // 	cancelType: defaultData?.cancelType,
          // 	cancelReason: defaultData?.cancelReason,
          // 	orderNo: orderNo,
          // }}
        >
          <Spin spinning={load}>
            <div className="content">
              <div className="content1 box">
                <div id="one" className="title">
                  申请基本信息
                </div>
                <div className="ant-advanced-form four-gridCol" id="cancelApplyDetailTopCol">
                  <Form.Item label="申请类型" name="requestType">
                    <span className="form-span">
                      {defaultData?.requestType == 1 ? '整单取消' : '部分取消'}
                    </span>
                  </Form.Item>
                  <Form.Item label="申请订单" name="orderNo">
                    <OrderDetailDrawer
                      pageParams={pageParams}
                      record={orderRecord}
                      orderNo={orderNo}
                    />
                  </Form.Item>
                  {type !== 'view' ? (
                    <Form.Item
                      label="取消类型"
                      name="cancelType"
                      rules={[{ required: true, message: '请选择取消类型!' }]}
                    >
                      <Select placeholder="请选择取消类型" onChange={handleCancelTypeChange}>
                        {CancelTypeData &&
                          CancelTypeData.map((item: any) => (
                            <Select.Option key={item.key} value={item.key}>
                              {item.value}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  ) : (
                    <Form.Item label="取消类型">
                      <span className="form-span">{basicData?.cancelTypeStr}</span>
                    </Form.Item>
                  )}

                  {type !== 'view' ? (
                    <Form.Item
                      label="取消原因"
                      name="cancelReason"
                      rules={[{ required: true, message: '请选择取消原因!' }]}
                    >
                      <Select placeholder="请选择取消原因">
                        {CancelReasonData &&
                          CancelReasonData.map((item: any) => (
                            <Select.Option key={item.key} value={item.key}>
                              {item.value}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                  ) : (
                    <Form.Item label="取消原因">
                      <span className="form-span">{basicData?.cancelReasonStr}</span>
                    </Form.Item>
                  )}

                  {type !== 'view' ? (
                    <Form.Item label="重复关联订单" name="repeatOrderNo">
                      <InputNumber
                        min={'0'}
                        maxLength={20}
                        style={{ width: '100%' }}
                        controls={false}
                        onChange={numberOnChange}
                        formatter={limitDecimals}
                        parser={limitDecimals}
                        precision={0}
                        placeholder="请输入订单号(数字)"
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item label="重复关联订单">
                      <span className="form-span">{basicData?.repeatOrderNo}</span>
                    </Form.Item>
                  )}

                  <Form.Item label="客户代号">
                    <span className="form-span">{basicData?.customerCode}</span>
                  </Form.Item>

                  <Form.Item label="客户名称">
                    <span className="form-span">{basicData?.customerName}</span>
                  </Form.Item>

                  <Form.Item label="同步SAP状态">
                    <span className="form-span">{basicData?.sapOpStateStr}</span>
                  </Form.Item>

                  <Form.Item label="是否有OBD">
                    <span className="form-span">{basicData?.hasObd ? '是' : '否'}</span>
                  </Form.Item>
                  <Form.Item label="是否有PO">
                    <span className="form-span">{basicData?.hasPo ? '是' : '否'}</span>
                  </Form.Item>

                  <Form.Item label="订单总金额">
                    <span className="form-span">
                      &yen; {Number(basicData?.amount || '0.00').toFixed(2)}
                    </span>
                  </Form.Item>
                  <Form.Item label="申请取消金额">
                    <span className="form-span">&yen; {Number(applyAmount).toFixed(2)}</span>
                  </Form.Item>
                  <Form.Item label="订单状态">
                    <span className="form-span">{basicData?.orderStatusStr}</span>
                  </Form.Item>
                  <Form.Item label="OBD号">
                    <span className="form-span">{basicData?.obdNo}</span>
                  </Form.Item>
                  <Form.Item label="申请渠道">
                    <span className="form-span">{basicData?.requestChannelStr}</span>
                  </Form.Item>
                  <Form.Item label="采购单位名称">
                    <span className="form-span">{basicData?.purchaseName}</span>
                  </Form.Item>
                  <Form.Item label="采购单位客户号">
                    <span className="form-span">{basicData?.purchaseCode}</span>
                  </Form.Item>

                  {type !== 'view' ? (
                    <Form.Item label="接待单号" name="receptionCode">
                      <InputNumber
                        min={'0'}
                        maxLength={30}
                        style={{ width: '100%' }}
                        controls={false}
                        onChange={receptionCodeOnChange}
                        formatter={limitDecimals}
                        parser={limitDecimals}
                        precision={0}
                        placeholder="请输入接待单号(数字)"
                      />
                    </Form.Item>
                  ) : (
                    <>
                      {basicData?.receptionCode && (
                        <Form.Item label="接待单号">
                          <ReceptionDrawer receptionCode={basicData?.receptionCode} />
                        </Form.Item>
                      )}
                    </>
                  )}

                  {type !== 'view' ? (
                    <Form.Item
                      label="申请备注描述"
                      className="fullLineGrid"
                      name="remark"
                      rules={[{ required: true, message: '请输入申请备注描述!' }]}
                    >
                      <Input.TextArea
                        showCount
                        maxLength={255}
                        placeholder="请输入申请备注描述"
                        allowClear
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item label="申请备注描述" className="fullLineGrid">
                      <span className="form-span">{basicData?.remark}</span>
                    </Form.Item>
                  )}
                </div>
              </div>
              <div className="content2 box">
                <div id="two" className="title">
                  附件 <span style={{ fontSize: '12px', color: '#999' }}>（必须）</span>
                </div>
                <UploadList
                  getData={getData}
                  getDeleteData={getDeleteData}
                  // sourceData={params?.resourceVOList}
                  // sourceData={fileDataList}
                  type={type}
                  dynacId={getSid}
                  // createName={params?.createName}
                />
              </div>
              <div className="content3 box">
                <div id="three" className="title">
                  订单详情信息
                </div>
                <div className="ant-advanced-form" style={{ marginTop: '20px' }}>
                  <table className="amountTable" cellSpacing="0" data-content="币种：CNY">
                    <tbody>
                      <tr>
                        <th>原货品金额含税:</th>
                        <td>{Number(basicData?.goodsAmount).toFixed(2)}</td>
                        <th>原总计金额含税:</th>
                        <td>{Number(basicData?.amount).toFixed(2)}</td>
                        <th>原总计金额未税:</th>
                        <td>{Number(basicData?.amountNet).toFixed(2)}</td>
                      </tr>
                      {type === 'view' ? (
                        <tr className="redFont">
                          <th>新货品金额含税:</th>
                          <td>{Number(basicData?.newGoodsAmount).toFixed(2)}</td>
                          <th>新总计金额含税:</th>
                          <td>{Number(basicData?.newAmount).toFixed(2)}</td>
                          <th>申请总计金额未税:</th>
                          <td>{Number(basicData?.newAmountNet).toFixed(2)}</td>
                        </tr>
                      ) : (
                        <tr className="redFont">
                          <th>新货品金额含税:</th>
                          <td>
                            {(Number(basicData?.goodsAmount) - Number(applyAmount)).toFixed(2)}
                          </td>
                          <th>新总计金额含税:</th>
                          <td>{(Number(basicData?.amount) - Number(applyAmount)).toFixed(2)}</td>
                          <th>申请总计金额未税:</th>
                          <td>
                            {((Number(basicData?.amount) - Number(applyAmount)) / 1.13).toFixed(2)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="detail_table_mod">
                    <ProTable<any>
                      columns={columns}
                      defaultSize="small"
                      scroll={{ x: 100, y: yClient }}
                      bordered
                      actionRef={ref}
                      size="small"
                      rowClassName={(record: any) =>
                        ((type === 'view' && record.requestQty > 0) ||
                          (type !== 'view' && record.qtyEditDisabled)) &&
                        'light_red'
                      }
                      dataSource={skuLineData}
                      rowKey="soLnSid"
                      search={false}
                      options={{ reload: false, density: false }}
                      tableAlertRender={false}
                      pagination={{
                        // pageSize: 20,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        // showTotal: total => `共有 ${total} 条数据`,
                        showTotal: (total: any, range: any) =>
                          `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                        onShowSizeChange: (current: any, pageSize: any) =>
                          onShowSizeChange(current, pageSize),
                        showQuickJumper: true,
                      }}
                      className="selectedTable changeRequestAmountTable"
                    />
                    {type !== 'view' && (
                      <span
                        style={{
                          width: '500px',
                          color: '#3f3c3cae',
                          display: 'block',
                          transform: 'translateY(-40px)',
                        }}
                      >
                        橙色高亮仅表示该行申请取消数量超过了未发货数量
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Spin>
          {type !== 'view' && (
            <div className="ant-modal-footer drewerFooterNoBorderButtonAbsCol">
              <Button
                type="primary"
                className="light_blue"
                loading={confirmLoading}
                onClick={() => {
                  onlySaveClick();
                }}
              >
                仅保存
              </Button>
              <Button type="primary" htmlType="submit" loading={confirmLoading}>
                提交审批
              </Button>
              <Button
                htmlType="button"
                onClick={() => {
                  onReset();
                }}
              >
                取 消
              </Button>
            </div>
          )}
        </Form>
      </section>
    </div>
  );
};
export default Index;
