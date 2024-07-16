/* eslint-disable no-param-reassign */
import Dtitle from '@/pages/components/Dtitle';
import ProForm, { ModalForm } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  Button,
  Card,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import AddSecondDetail from './components/AddSecondDetail';
import ApplyInfo from './components/ApplyInfo';
import BasicInfo from './components/BasicInfo';
import UploadFile from './components/UploadFile';
import '../index.less';
import {
  editAfterSales,
  queryAfterDetail,
  querySapObd,
  relevantObd,
  submitAfterSales,
} from '@/services/afterSales';
import DrawerTransport from './components/DrawerTransport';
import { getByKeys, querySales } from '@/services/afterSales/utils';
import { useLocation, useModel } from 'umi';
import Cookies from 'js-cookie';
import moment from 'moment';
interface EditProps {
  id?: string;
}
type TableListItem = Record<string, any>;

const Edit: React.FC<EditProps> = () => {
  const [form] = Form.useForm();
  const formRef = useRef<any>();
  const {
    query: { id = '' as any },
  } = useLocation() as any;
  const [modalVisibleSecond, setModalVisibleSecond] = useState<boolean>(false);
  const [modalVisibleUpload, setModalVisibleUpload] = useState<any>(false);
  const [info, setInfo] = useState<any>({});
  const [uploadList, setUploadList] = useState<any>([]);
  const [rowData, setRowData] = useState<any>({});
  const [ids, setIds] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const [transpotVisible, setTranspotVisible] = useState<any>(false);
  const [statusList, setStatusList] = useState<any>([]);
  const [tepList, setTepList] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [dbCode, setDbCode] = useState<any>('');
  const [reCode, setReCode] = useState<any>(null);
  const [delFileIds, setDelFileIds] = useState<any>([]);
  const [delLineIds, setDelLineIds] = useState<any>([]);
  const { destroyCom } = useModel('tabSelect');
  const [secondData, setSecondData] = useState<any>([]);

  const fileColumns: ProColumns<any>[] = [
    { title: '文件名称', dataIndex: 'resourceName', width: 150 },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => {
        return (
          <Space>
            <Button
              type="link"
              target="_blank"
              href={`${record.resourceUrl}?token=${Cookies.get('ssoToken')}`}
              key={'down'}
            >
              下载
            </Button>
            <Button
              size="small"
              type="link"
              key={'remove'}
              onClick={() => {
                Modal.confirm({
                  title: '确认删除吗？',
                  content: '',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    if (record?.sid) {
                      setDelFileIds(delFileIds?.concat(record?.sid));
                    }
                    setUploadList(
                      uploadList.filter((io: any) => io.resourceName !== record.resourceName),
                    );
                  },
                });
              }}
            >
              移除
            </Button>
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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'left',
      width: 100,
      render: (_, record: any) => {
        return (
          <Space>
            <Button
              size="small"
              type="link"
              key={'删除'}
              onClick={() => {
                Modal.confirm({
                  title: '确认删除吗？',
                  content: '',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    setDelLineIds(delLineIds.concat(record?.sid));
                    setInfo({
                      ...info,
                      lineList: info?.lineList?.filter((io: any) => io.idx !== record.idx),
                    });
                  },
                });
              }}
            >
              删除
            </Button>
          </Space>
        );
      },
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
      className: 'red',
      width: 100,
      fixed: 'left',
    },
    {
      title: '产品名称',
      dataIndex: 'itemName',
      width: 400,
      render: (_, record: any) => {
        return `${record?.brandName || ''} ${record?.itemName} ${record?.mfgSku || ''}`;
      },
    },
    {
      title: '备货类型',
      dataIndex: 'stockType',
      width: 150,
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
      title: '售后费用合计',
      dataIndex: 'totalExpensePrice',
      width: 100,
      className: 'red',
      render: (_, record: any) => {
        return (
          <InputNumber
            precision={2}
            min={0}
            max={record.salesPrice * (record.applyQty || 1)}
            disabled={info?.afterSales?.apiChannel}
            // defaultValue={record.salesPrice * (record.applyQty || 1)}
            value={record?.totalExpensePrice || record.salesPrice * (record.applyQty || 1)}
            onChange={(v) => {
              record.totalExpensePrice = v;
              setInfo({
                ...info,
                lineList: info?.lineList?.map((io: any) => {
                  if (io.idx === record.idx) {
                    io = record;
                  }
                  return io;
                }),
              });
            }}
          />
        );
      },
    },
    {
      title: '申请售后数量',
      width: 100,
      className: 'red',
      dataIndex: 'applyQty',
      render: (_, record: any) => {
        return (
          <InputNumber
            min={1}
            max={record.qty}
            defaultValue={record?.applyQty || 1}
            disabled={info?.afterSales?.apiChannel}
            onChange={(v) => {
              record.applyQty = v;
              record.totalExpensePrice = (record?.applyQty * record?.salesPrice).toFixed(2);
              setInfo({
                ...info,
                lineList: info?.lineList?.map((io: any) => {
                  if (io.idx === record.idx) {
                    io = record;
                  }
                  return io;
                }),
              });
            }}
            required
          />
        );
      },
    },
    {
      title: '货物状态',
      width: 200,
      className: 'blue',
      dataIndex: 'cargoStatus',
      render: (_, record: any) => {
        return (
          <Select
            style={{ width: '170px' }}
            allowClear={false}
            options={statusList[0]}
            defaultValue={record?.cargoStatus}
            onChange={(val: any) => {
              record.cargoStatus = val;
            }}
            placeholder="请选择"
          />
        );
      },
    },
    {
      title: '客户描述一致',
      width: 100,
      className: 'blue',
      dataIndex: 'customerDescFlag',
      render: (_, record: any) => {
        return (
          <Select
            allowClear={false}
            options={[
              { label: '是', value: 1 },
              { label: '否', value: 0 },
            ]}
            defaultValue={record?.customerDescFlag}
            onChange={(val: any) => {
              record.customerDescFlag = val;
            }}
          />
        );
      },
    },
    {
      title: '维修费走质保',
      width: 100,
      className: 'blue',
      dataIndex: 'repairCostInQaFlag',
      render: (_, record: any) => {
        return (
          <Select
            allowClear={false}
            defaultValue={record?.repairCostInQaFlag}
            options={[
              { label: '是', value: 1 },
              { label: '否', value: 0 },
            ]}
            onChange={(val: any) => {
              record.repairCostInQaFlag = val;
            }}
          />
        );
      },
    },
    {
      title: '理赔金额',
      width: 100,
      className: 'blue',
      dataIndex: 'claimPrice',
      render: (_, record: any) => {
        return (
          <InputNumber
            min={1}
            value={record?.claimPrice}
            onChange={(v) => (record.claimPrice = v)}
            placeholder="请输入"
          />
        );
      },
    },
    {
      title: '物流问题描述',
      width: 150,
      className: 'blue',
      dataIndex: 'logisticsDescType',
      render: (_, record: any) => {
        return (
          <Select
            style={{ width: '150px' }}
            allowClear={false}
            options={statusList[1]}
            defaultValue={record.logisticsDescType}
            onChange={(val: any) => {
              record.logisticsDescType = val;
              return val;
            }}
            placeholder="请选择"
          />
        );
      },
    },
    {
      title: '行备注',
      width: 200,
      className: 'blue',
      dataIndex: 'lineRemark',
      render: (_, record: any) => {
        return (
          <Input
            placeholder="请输入"
            defaultValue={record.lineRemark}
            onChange={(val: any) => {
              record.lineRemark = val?.target?.value;
              return val?.target?.value;
            }}
          />
        );
      },
    },
    {
      title: '货品接收时间',
      dataIndex: 'goodsReceiveDate',
      width: 200,
      render: (_, record: any) => {
        return (
          <DatePicker
            defaultValue={record?.goodsReceiveDate ? moment(record?.goodsReceiveDate) : null}
            onChange={(mo: any, date: any) => {
              record.goodsReceiveDate = date;
              return date;
            }}
          />
        );
      },
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
      title: '退回仓库',
      dataIndex: 'returnWarehouseType',
      width: 100,
    },
    {
      title: '最终处理结果',
      dataIndex: 'processResultType',
      width: 100,
    },
    {
      title: 'SKU状态',
      dataIndex: 'skuStatus',
      width: 100,
    },
    {
      title: 'SKU状态备注',
      dataIndex: 'skuStatusRemark',
      width: 100,
    },
    {
      title: '最终原因',
      dataIndex: 'realReasonType',
      width: 100,
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    const par = { list: ['cargoStatusEnum', 'logisticsDescEnum'] };
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
  }, []);

  useEffect(() => {
    queryAfterDetail({ afterSalesNo: id }).then((res: any) => {
      const { data, errCode, errMsg } = res;
      if (errCode === 200) {
        querySales({ customerCode: data?.afterSales?.customerCode }).then((res1: any) => {
          if (res.errCode === 200) {
            const sales = {
              salesName: res1?.data[0]?.mainSalesName,
              salesId: res1?.data[0]?.mainSalesId,
            };
            const newData = {
              ...data,
              afterSales: {
                ...data.afterSales,
                contactName: {
                  value: data?.afterSales?.contactCodeR3 || '',
                  label: data?.afterSales?.contactNameR3 || '',
                },
                ...sales,
                afterSalesType: data?.afterSales?.afterSalesType
                  ? data?.afterSales?.afterSalesType?.split(',')?.map((io: any) => Number(io))
                  : '',
                regionName: data?.afterSales?.province
                  ? `${data?.afterSales?.province}/${data?.afterSales?.city}/${data?.afterSales?.district}`
                  : '',
              },
              lineList: data?.lineList?.map((io: any, idx: any) => ({
                ...io,
                idx,
                applyQty: io.applyQty || 1,
                totalExpensePrice: io.totalExpensePrice || 0,
                customerDescFlag: io.customerDescFlag || 0,
                repairCostInQaFlag: io.repairCostInQaFlag || 0,
              })),
            };
            setInfo(newData);
            setUploadList(data?.resourceList);
            // setSelectList(data?.lineList?.map((io: any, index: any) => ({ ...io, index: index })));
          } else {
            message.error(res1.errMsg);
          }
        });
      } else {
        message.error(errMsg);
      }
    });
  }, []);

  const submit = async (num: any) => {
    formRef.current?.validateFieldsReturnFormatValue?.().then(async (values: any) => {
      setLoading(true);

      const newList = info?.lineList?.map((io: any) => ({
        ...io,
        totalExpensePrice: io.totalExpensePrice || io.applyQty * io.salesPrice,
        customerDescFlag: io.customerDescFlag || 0,
        repairCostInQaFlag: io.repairCostInQaFlag || 0,
      }));

      const par = {
        afterSales: {
          sid: info?.afterSales?.sid,
          ...info.afterSales,
          ...values,
          createTime: values?.createTime
            ? moment(values?.createTime).format('YYYY-MM-DD HH:mm:ss')
            : null,
          completeDate: values?.completeDate
            ? moment(values?.completeDate).format('YYYY-MM-DD HH:mm:ss')
            : null,
          invoiceReceiptDate: values.invoiceReceiptDate,
          deliveryDate: values.deliveryDate,
          contactNameR3: values?.contactName?.label || info?.afterSales?.contactNameR3,
          contactCodeR3: values?.contactName?.value || info?.afterSales?.contactCodeR3,
          salesId: info?.afterSales?.salesId,
          afterSalesType: values?.afterSalesType?.join(','),
          afterSalesCode: dbCode || info?.afterSales?.afterSalesCode,
          sapReasonCode: reCode || info?.afterSales?.sapReasonCode,
          // regionName:
          //   typeof values?.regionName == 'string'
          //     ? info?.afterSales?.regionName
          //     : values?.regionName?.join(','),
          province:
            typeof values?.regionName == 'string'
              ? info?.afterSales?.province
              : values?.regionName[0],
          city:
            typeof values?.regionName == 'string' ? info?.afterSales?.city : values?.regionName[1],
          district:
            typeof values?.regionName == 'string'
              ? info?.afterSales?.district
              : values?.regionName[2],
        },
        lineList: newList,
        resourceList: uploadList,
        delLineIds,
        delFileIds,
      };
      const isValidate = newList?.some((io: any) => io.applyQty > io.qty);
      if (isValidate) {
        message.warning('申请售后数量必须小于等于发货数量');
        setLoading(false);
        return false;
      }
      const subStatus = newList?.every((io: any) => io.applyQty > 0);
      const hasPrice = newList?.every((io: any) => io?.totalExpensePrice?.toString());
      if (!subStatus || !hasPrice) {
        message.warning('您有未完善的行信息，请填写正确的信息');
        setLoading(false);
        return false;
      }
      if (num === 0) {
        const { errCode, errMsg } = await editAfterSales(par); // 仅保存
        if (errCode === 200) {
          message.success('保存成功');
          setLoading(false);
          destroyCom('/sales-after/apply', location.pathname);
        } else {
          setLoading(false);
          message.error(errMsg);
        }
      } else if (num === 1) {
        if (uploadList.length === 0) {
          message.error('需要上传附件');
          setLoading(false);
          return;
        }
        const { errCode, errMsg } = await submitAfterSales(par); // 提交审核
        if (errCode === 200) {
          message.success('提交申请成功');
          setLoading(false);
          destroyCom('/sales-after/apply', location.pathname);
        } else {
          setLoading(false);
          message.error(errMsg);
        }
      }
    });
  };

  const [tempList, setTempList] = useState<any>([]);
  const showList = (arr: any) => {
    setTempList(arr);
  };

  const changeCode = (db: any, code: any) => {
    setDbCode(db);
    setReCode(code);
  };

  const delFile = () => {
    if (ids.length === 0) {
      message.error('请选择要删除的文件');
      return false;
    } else {
      Modal.confirm({
        title: '确认删除吗？',
        content: '',
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          const newList = uploadList.filter(
            (io: any) => !rows.some((ic: any) => io.resourceName === ic.resourceName),
          );
          setDelFileIds(
            delFileIds?.concat(rows.filter((io: any) => io.sid)?.map((ic: any) => ic.sid)),
          );
          setUploadList(newList);
        },
      });
    }
  };

  // const getInfo = (record: any) => {
  //   querySales({ customerCode: record?.customerCode }).then((res: any) => {
  //     if (res.errCode === 200) {
  //       const sales = {
  //         salesName: res?.data[0]?.mainSalesName,
  //         salesId: res?.data[0]?.mainSalesId,
  //       };
  //       setRowData({ ...record, ...sales });
  //       form.setFieldsValue({
  //         ...record,
  //         ...sales,
  //         // 拓展映射字段
  //         systemInvoiceNo: record?.invoicevat,
  //         physicsInvoiceNo: record?.invoicevf,
  //         obdTotalPrice: record?.amount,
  //         deliveryDate: record?.sendTime,
  //         consigneeMobile: record?.cellphone,
  //         consigneeTel: record?.phone,
  //         consigneeAddress: record?.address,
  //       });
  //     } else {
  //       message.error(res.errMsg);
  //     }
  //   });
  //   queryContact({ customerCode: record?.customerCode }).then((res: any) => {
  //     if (res.errCode === 200) {
  //       const contactName = {
  //         label: res?.data?.dataList[0]?.contactName,
  //         value: res?.data?.dataList[0]?.contactCodeR3,
  //       };
  //       form.setFieldsValue({
  //         contactName,
  //         contactCodeR3: res?.data?.dataList[0]?.contactCodeR3,
  //       });
  //     } else {
  //       message.error(res.errMsg);
  //     }
  //   });
  // };

  // const chooseLineData = async () => {
  //   const par = {
  //     obdNo: info?.afterSales?.obdNo, // info?.afterSales?.obdNo, TODO: 为null 演示数据
  //     codes: info?.afterSales?.customerCode ? [info?.afterSales?.customerCode] : null,
  //     orderNo: info?.afterSales?.orderNo,
  //     // pageNumber: params?.current,
  //     // pageSize: params?.pageSize,
  //   };
  //   const {
  //     data,
  //     errCode,
  //     errMsg,
  //   } = (await querySapObd(par)) as any;
  //   if (errCode === 200) {
  //     setSelectList(data?.list[0]?.sapObdLinelist);
  //     setModalVisibleSecond(true);
  //   } else {
  //     message.error(errMsg);
  //   }
  // }

  const getTrans = async () => {
    const par = {
      obdNo: info?.afterSales?.obdNo,
      codes: info?.afterSales?.customerCode ? [info?.afterSales?.customerCode] : null,
      orderNo: info?.afterSales?.orderNo,
    };
    querySapObd(par).then((res1: any) => {
      if (res1.errCode === 200) {
        setRowData({
          salesName: info?.afterSales?.salesName,
          ...res1?.data?.list[0],
          // sapObdLinelist: res1?.data?.list[0]?.sapObdLinelist?.map((io: any, index: any) => ({
          //   ...io,
          //   index,
          //   applyQty: io.applyQty || 1,
          // })),
        });
      } else {
        message.error(res1.errMsg);
      }
    });
  };

  return (
    <div className="form-content-search" id="salesAfterApplyEdit">
      <ProForm
        layout="horizontal"
        className="fix_lable_large has-gridForm"
        form={form}
        formRef={formRef}
        onFinishFailed={() => {
          setLoading(false);
          message.warning('您有未完善的信息，请填写正确的信息');
        }}
        onValuesChange={(values) => {
          if (values?.contactName?.value) {
            setInfo({
              ...info,
              afterSales: {
                ...info?.afterSales,
                contactCodeR3: values?.contactName?.value,
              },
            });
            form.setFieldsValue({
              contactCodeR3: values?.contactName?.value,
            });
          }
        }}
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
                  <Button htmlType="submit" onClick={() => submit(0)} loading={loading}>
                    仅保存
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => submit(1)}
                    loading={loading}
                  >
                    提交审批
                  </Button>
                  <Button
                    onClick={() => {
                      destroyCom('/sales-after/apply', location.pathname);
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
        <Card className="head-title-wrap">
          <p className="head-title">编辑售后申请</p>
          <Space>
            <p>提交售后申请时，请提交领导同意的审批邮件或聊天截图，以便尽快审批通过</p>
          </Space>
        </Card>
        <div className="editContentCol">
          <Card title="售后基本信息" bordered={false} id="basic">
            {info?.afterSales && (
              <BasicInfo
                type="edit"
                info={info?.afterSales}
                changeCode={(db, code) => changeCode(db, code)}
                formRef={form}
              />
            )}
          </Card>
          <Card title="详细申请信息" bordered={false} id="pay">
            {info?.afterSales && <ApplyInfo type="edit" info={info?.afterSales} />}
          </Card>

          <Card title="附件" bordered={false} className="order-msg" id="shopDetail">
            <ProTable<TableListItem>
              style={{ width: '70%' }}
              columns={fileColumns}
              bordered
              size="small"
              rowKey="resourceName"
              options={false}
              search={false}
              dateFormatter="string"
              dataSource={uploadList}
              tableAlertRender={false}
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: ids,
                onChange: (rowKeys, rowsd) => {
                  setIds(rowKeys);
                  setRows(rowsd);
                },
              }}
              headerTitle={
                <Space style={{ marginBottom: '6px' }}>
                  <Button type="primary" onClick={() => setModalVisibleUpload(true)}>
                    上传附件
                  </Button>
                  <Button onClick={delFile}>删除选中</Button>
                </Space>
              }
              pagination={false}
            />
          </Card>
          <Card title="售后明细信息" bordered={false} className="order-msg" id="shopDetail">
            <ProTable<TableListItem>
              columns={columns}
              scroll={{ x: 100, y: 500 }}
              size="small"
              bordered
              rowKey={'idx'}
              options={false}
              search={false}
              pagination={false}
              dateFormatter="string"
              dataSource={info?.lineList}
              headerTitle={
                <Space style={{ marginBottom: '6px' }}>
                  <Button
                    type="primary"
                    onClick={async () => {
                      // getTrans();
                      // 换借口了 relevent
                      const par = {
                        obdNo: info?.afterSales?.obdNo,
                        orderNo: info?.afterSales?.orderNo,
                      };
                      await relevantObd(par).then((res: any) => {
                        if (res.errCode === 200) {
                          setSecondData(
                            res?.data?.list[0]?.sapObdLinelist?.map((io: any, index: any) => ({
                              ...io,
                              index,
                              applyQty: io.applyQty || 1,
                            })),
                          );
                        } else {
                          message.error(res.errMsg);
                        }
                      });
                      setModalVisibleSecond(true);
                    }}
                  >
                    选择SKU
                    {/* {info?.lineList?.length > 0 ? '重新选择' : '添加明细'} */}
                  </Button>
                  <br /> <br /> <br />
                  <p>
                    <span style={{ fontSize: '13px' }}>
                      当前已选发货单：{info?.afterSales?.obdNo}
                    </span>{' '}
                    &nbsp; &nbsp; &nbsp; &nbsp;
                    <span
                      style={{
                        fontSize: '13px',
                        color: info?.lineList?.length > 0 ? '#1890ff' : '#888',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        if (info?.afterSales?.obdNo) {
                          getTrans();
                          setTranspotVisible(true);
                        } else {
                          return;
                        }
                      }}
                    >
                      查看物流信息
                    </span>
                  </p>
                </Space>
              }
            />
          </Card>
        </div>
      </ProForm>
      {/* 添加售后明细 */}
      {/* <Modal
        title={<Dtitle title="添加售后明细" subTitle="仅支持单个发货单" />}
        width={1100}
        visible={modalVisible}
        destroyOnClose={true}
        onCancel={() => setModalVisible(false)}
        okText="下一步"
        onOk={() => {
          if (!rowData?.obdNo) {
            message.error('请选择发货单');
            return false;
          } else {
            if (rowData?.sapObdLinelist?.length > 0) {
              setModalVisible(false);
              setModalVisibleSecond(true); //第二步
            } else {
              message.error('相同sku只能发起一次售后申请');
            }
          }
        }}
      >
        {<AddFirstDetail rowKeys={rowData?.obdNo} onSelect={(record) => getInfo(record)} />}
      </Modal> */}
      <ModalForm
        title={'添加发货单'}
        width={1100}
        visible={modalVisibleSecond}
        onVisibleChange={setModalVisibleSecond}
        modalProps={{
          destroyOnClose: true,
        }}
        submitter={{
          searchConfig: {
            submitText: '确认',
            resetText: '取消',
          },
        }}
        onFinish={async () => {
          if (tepList.length === 0) {
            message.error('请选择明细单');
            return false;
          } else {
            let iq = [] as any;
            const oldList = info?.lineList;
            const ics = tepList;
            if (oldList.length == 0) {
              iq = ics;
            } else {
              const filtData = ics?.filter(
                (io: any) => !oldList.some((ic: any) => ic.obdItemNo == io.obdItemNo),
              );
              iq = [...oldList, ...filtData];
            }

            setInfo({
              ...info,
              lineList: iq.map((io: any, idx: any) => ({ ...io, idx })),
              // lineList: tepList.concat(info?.lineList),  //之前有禁用需求额的
            });
            return setModalVisibleSecond(false);
          }
        }}
      >
        <AddSecondDetail
          secondList={secondData}
          onSelect={(list) => {
            setTepList(list);
          }}
        />
      </ModalForm>
      {/* upload */}
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
          setUploadList(tempList.concat(uploadList));
          setTempList([]);
          setIds([]);
          return true;
        }}
      >
        <UploadFile showList={showList} />
      </ModalForm>
      {/*查看物流*/}
      <Drawer
        title="物流信息"
        visible={transpotVisible}
        onClose={() => setTranspotVisible(false)}
        size="large"
        // destroyOnClose={true}
        bodyStyle={{ paddingTop: 0 }}
        extra={
          <Space>
            <Button onClick={() => setTranspotVisible(false)}>关闭</Button>
          </Space>
        }
      >
        <DrawerTransport info={rowData} ids={info?.lineList?.map((io: any) => io.obdNo)} />
      </Drawer>
    </div>
  );
};
export default Edit;
