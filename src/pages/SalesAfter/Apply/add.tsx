/* eslint-disable no-param-reassign */
// add edit 需求修改过里面逻辑改动少 适应满足需求
import Dtitle from '@/pages/components/Dtitle';
import ProForm, { ModalForm } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useLocation, useModel } from 'umi';
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
import AddFirstDetail from './components/AddFirstDetail';
import AddSecondDetail from './components/AddSecondDetail';
import ApplyInfo from './components/ApplyInfo';
import BasicInfo from './components/BasicInfo';
import UploadFile from './components/UploadFile';
import '../index.less';
import {
  editAfterSales,
  queryAfterDetail,
  relevantObd,
  submitAfterSales,
} from '@/services/afterSales';
import DrawerTransport from './components/DrawerTransport';
import { getByKeys, queryContact, querySales } from '@/services/afterSales/utils';
import Cookies from 'js-cookie';

interface AddProps {
  id?: string;
}
type TableListItem = Record<string, any>;

const Add: React.FC<AddProps> = () => {
  const { destroyCom } = useModel('tabSelect');
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalVisibleSecond, setModalVisibleSecond] = useState<boolean>(false);
  const [modalVisibleUpload, setModalVisibleUpload] = useState<any>(false);
  const [uploadList, setUploadList] = useState<any>([]);
  const [rowData, setRowData] = useState<any>({});
  const [selectList, setSelectList] = useState<any>([]);
  const [ids, setIds] = useState<any>([]);
  const [fileRowsData, setFileRowsData] = useState<any>([]);
  const [transpotVisible, setTranspotVisible] = useState<any>(false);
  const [statusList, setStatusList] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [dbCode, setDbCode] = useState<any>('');
  const [reCode, setReCode] = useState<any>(null);
  const [btnType, setBtnType] = useState<any>(null);
  const formRef = useRef<any>();
  const [secondData, setSecondData] = useState<any>([]);
  const [copyInfo, setCopyInfo]: any = useState();

  const {
    query: { id = '' as any },
  } = useLocation() as any;
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
                    setUploadList(
                      uploadList.filter((io: any) => io.resourceName != record.resourceName),
                    );
                    message.success('已删除文件');
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
                    setSelectList(selectList?.filter((io: any) => io.index !== record.index));
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
            min={0}
            precision={2}
            max={record.salesPrice * record.applyQty}
            // defaultValue={record.salesPrice * record.applyQty}
            value={record?.totalExpensePrice || record.salesPrice * record.applyQty}
            onChange={(v) => {
              record.totalExpensePrice = v;
              setSelectList(
                selectList?.map((io: any) => {
                  if (io.index === record.index) {
                    io = record;
                  }
                  return io;
                }),
              );
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
            defaultValue={record?.applyQty || 0}
            max={record.qty}
            value={record.applyQty || 0}
            onChange={(v) => {
              record.applyQty = v;
              record.totalExpensePrice = Number((record.applyQty * record.salesPrice).toFixed(2));
              setSelectList(
                selectList?.map((io: any) => {
                  if (io.index === record.index) {
                    io = record;
                  }
                  return io;
                }),
              );
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
            style={{ width: '150px' }}
            allowClear={false}
            options={statusList[0]}
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
            options={[
              { label: '是', value: 1 },
              { label: '否', value: 0 },
            ]}
            defaultValue={record?.repairCostInQaFlag}
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
          <InputNumber min={1} onChange={(v) => (record.claimPrice = v)} placeholder="请输入" />
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
            style={{ width: '130px' }}
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
            onChange={(mo: any, date: any) => {
              console.log(mo);
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
    if (id == 1) return;
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
              lineList: data?.lineList?.map((io: any) => ({
                ...io,
                applyQty: io.applyQty || 1,
                totalExpensePrice: io.totalExpensePrice || 0,
                customerDescFlag: io.customerDescFlag || 0,
                repairCostInQaFlag: io.repairCostInQaFlag || 0,
              })),
            };
            // console.log(newData, 'newData');
            setCopyInfo(newData);
            if (newData?.afterSales?.obdNo) {
              setRowData({ ...newData, obdNo: newData?.afterSales?.obdNo });
            }
            // setUploadList(data?.resourceList);
            //?处理复制的逻辑和编辑的逻辑区分
            setSelectList(
              data?.lineList?.map((io: any, index: any) => ({
                ...io,
                index: index,
                sid: null,
                afterSalesNo: null,
              })),
            );
          } else {
            message.error(res1.errMsg);
          }
        });
      } else {
        message.error(errMsg);
      }
    });
  }, []);
  const submit = async (val: any) => {
    if (val === 0) {
      setBtnType(0);
      setLoading(true);
      const noVaData = formRef?.current?.getFieldsFormatValue();
      if (selectList.some((ic: any) => ic.applyQty == 0)) {
        message.error('申请售后数量不能为0');
        setLoading(false);
        return;
      }
      // console.log(noVaData, 'noVaData');
      if (noVaData?.obdNo) {
        const par = {
          afterSales: {
            ...noVaData,
            invoiceReceiptDate: noVaData.invoiceReceiptDate,
            deliveryDate: noVaData.deliveryDate,
            contactNameR3: noVaData?.contactName?.label || noVaData?.contactName,
            contactCodeR3: noVaData?.contactName?.value || noVaData?.contactCodeR3,
            salesId: rowData?.salesId,
            afterSalesType: noVaData?.afterSalesType ? noVaData?.afterSalesType?.join(',') : '',
            // afterSalesCode: dbCode,
            sapReasonCode: reCode || copyInfo?.afterSales?.sapReasonCode,
            // regionName: noVaData?.regionName ? noVaData?.regionName?.join(',') : '',
            province: noVaData?.regionName ? noVaData?.regionName[0] : '',
            city: noVaData?.regionName ? noVaData?.regionName[1] : '',
            district: noVaData?.regionName ? noVaData?.regionName[2] : '',
          },
          lineList: selectList,
          resourceList: uploadList,
        };
        if (!par.afterSales.sapReasonCode) {
          message.error('售后类型缺少SAP订单原因，请重新选择，或联系销售');
          setLoading(false);
          return false;
        }
        const { errCode, errMsg } = await editAfterSales(par); // 仅保存
        if (errCode == 200) {
          message.success('保存成功');
          destroyCom('/sales-after/apply', location.pathname);
        } else {
          message.error(errMsg);
          setLoading(false);
        }
      } else {
        message.error('请选择发货单号');
        setLoading(false);
        return;
      }
    }
    if (val == 1) {
      setBtnType(1);
      formRef.current?.validateFieldsReturnFormatValue?.().then(async (values: any) => {
        setLoading(true);
        if (values?.afterSalesType.length < 3) {
          message.error('售后类型必须为三级');
          setLoading(false);
          return;
        }
        if (uploadList.length === 0) {
          message.error('需要上传附件');
          setLoading(false);
          return;
        }
        if (selectList.some((ic: any) => ic.applyQty == 0)) {
          message.error('申请售后数量不能为0');
          setLoading(false);
          return;
        }
        const par = {
          afterSales: {
            ...values,
            invoiceReceiptDate: values.invoiceReceiptDate,
            deliveryDate: values.deliveryDate,
            contactNameR3: values?.contactName?.label || values?.contactName,
            contactCodeR3: values?.contactName?.value || values?.contactCodeR3,
            salesId: rowData?.salesId,
            afterSalesType: values?.afterSalesType?.join(','),
            afterSalesCode: dbCode,
            sapReasonCode: reCode || copyInfo?.afterSales?.sapReasonCode,
            // regionName: values?.regionName ? values?.regionName?.join(',') : '',
            province: values?.regionName ? values?.regionName[0] : '',
            city: values?.regionName ? values?.regionName[1] : '',
            district: values?.regionName ? values?.regionName[2] : '',
          },
          lineList: selectList,
          resourceList: uploadList,
        };
        if (!par.afterSales.sapReasonCode) {
          message.error('售后类型缺少SAP订单原因，请重新选择，或联系销售');
          setLoading(false);
          return false;
        }
        const { errCode, errMsg } = await submitAfterSales(par);
        if (errCode === 200) {
          message.success('提交申请成功');
          setLoading(false);
          destroyCom('/sales-after/apply', location.pathname);
        } else {
          setLoading(false);
          message.error(errMsg);
        }
      });
    }
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
    const nameList = fileRowsData.map((io: any) => io.resourceName);
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
            (io: any) => !nameList.some((ic: any) => io.resourceName === ic),
          );
          setUploadList(newList);
        },
      });
    }
  };

  const getInfo = (record: any) => {
    querySales({ customerCode: record?.customerCode }).then((res: any) => {
      if (res.errCode === 200) {
        const sales = {
          salesName: res?.data[0]?.mainSalesName,
          salesId: res?.data[0]?.mainSalesId,
        };
        const contactName = {
          label: record?.contactNameR3,
          value: record?.contactCodeR3,
        };
        setRowData({ ...record, ...sales, contactName });
        form.setFieldsValue({
          ...record,
          ...sales,
          // 拓展映射字段
          systemInvoiceNo: record?.invoicevf,
          physicsInvoiceNo: record?.invoicevat,
          obdTotalPrice: record?.amount,
          deliveryDate: record?.sendTime,
          consigneeMobile: record?.cellphone,
          consigneeTel: record?.phone,
          consigneeAddress: record?.address,
          purchaseName: record.purchaseName,
          purchaseCode: record.purchaseCode,
          tertiaryDeptCode: record.tertiaryDeptCode,
          tertiaryDeptName: record.tertiaryDeptName,
          whetherLocal: record.whetherLocal,
          contactName,
          contactCodeR3: record?.contactCodeR3,
        });
      } else {
        message.error(res.errMsg);
      }
    });
    //old
    // queryContact({ customerCode: record?.customerCode }).then((res: any) => {
    //   if (res.errCode === 200) {
    //     const contactName = {
    //       label: res?.data?.dataList[0]?.contactName,
    //       value: res?.data?.dataList[0]?.contactCode,
    //     };
    //     form.setFieldsValue({
    //       contactName,
    //       contactCodeR3: res?.data?.dataList[0]?.contactCode,
    //     });
    //   } else {
    //     message.error(res.errMsg);
    //   }
    // });
  };

  const getSecondData = async () => {
    // 新增接口查询 选择售后SKU
    const par = {
      obdNo: rowData?.obdNo,
      orderNo: rowData?.orderNo,
    };
    relevantObd(par).then((res: any) => {
      if (res.errCode === 200) {
        setSecondData(res?.data?.list[0]?.sapObdLinelist);
        form.setFieldsValue({
          whetherLocal: res?.data?.list[0].whetherLocal,
        });
      } else {
        message.error(res.errMsg);
      }
    });
  };

  const dbSave = async (record: any) => {
    getInfo(record);
    // setModalVisible(false)
  };

  return (
    <div className="form-content-search" id="salesAfterApplyEdit">
      <ProForm
        layout="horizontal"
        className="fix_lable_large has-gridForm"
        onFinish={(values) => submit(values)}
        formRef={formRef}
        onFinishFailed={() => {
          if (btnType == 0) {
            return;
          } else if (btnType == 1) {
            message.warning('您有未完善的信息，请填写正确的信息');
          }
          setLoading(false);
        }}
        onValuesChange={(values) => {
          if (values?.contactName?.value) {
            setRowData({
              ...rowData,
              contactCodeR3: values?.contactName?.value,
            });
            form.setFieldsValue({
              contactCodeR3: values?.contactName?.value,
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
                  <Button
                    type="primary"
                    // ghost={true}
                    htmlType="submit"
                    onClick={() => submit(0)}
                    loading={loading}
                  >
                    仅保存
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    onClick={() => submit(1)}
                  >
                    提交申请
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
          <p className="head-title">新增售后申请</p>
          <Space>
            <p>提交售后申请时，请提交领导同意的审批邮件或聊天截图，以便尽快审批通过</p>
          </Space>
        </Card>
        <div className="editContentCol">
          <Card title="售后基本信息" bordered={false} id="basic">
            {id &&
              copyInfo?.afterSales && ( //?这个是复制的逻辑
                <BasicInfo
                  formRef={form}
                  type="add"
                  info={copyInfo?.afterSales}
                  changeCode={(db, code) => changeCode(db, code)}
                  onModal={() => setModalVisible(true)}
                />
              )}
            {id === '1' && ( //?这个是新增的逻辑
              <BasicInfo
                formRef={form}
                type="add"
                info={rowData}
                changeCode={(db, code) => changeCode(db, code)}
                onModal={() => setModalVisible(true)}
              />
            )}
          </Card>
          <Card title="详细申请信息" bordered={false} id="pay">
            {/* //?这个是复制的逻辑 */}
            {id && copyInfo?.afterSales && <ApplyInfo type="add" info={copyInfo?.afterSales} />}
            {/* 这个是新增的逻辑 */}
            {id === '1' && <ApplyInfo type="add" info={rowData?.afterSales} />}
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
                onChange: (rowKeys, selectedRowKeys) => {
                  setIds(rowKeys);
                  setFileRowsData(selectedRowKeys);
                },
              }}
              headerTitle={
                <Space style={{ marginBottom: '6px' }}>
                  <Button type="primary" onClick={() => setModalVisibleUpload(true)}>
                    <span style={{ color: '#ff4d4f' }}>*</span>上传附件
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
              rowKey={'obdItemNo'}
              options={false}
              search={false}
              pagination={false}
              dateFormatter="string"
              dataSource={selectList}
              headerTitle={
                <Space style={{ marginBottom: '6px', opacity: rowData?.obdNo > 0 ? 1 : 0.6 }}>
                  <Button
                    type="primary"
                    style={{ opacity: rowData?.obdNo > 0 ? 1 : 0.6 }}
                    onClick={() => {
                      if (rowData?.obdNo) {
                        getSecondData();
                        setModalVisibleSecond(true);
                      } else {
                        message.error('请先选择发货单号');
                      }
                    }}
                  >
                    {/* {selectList?.length > 0 ? '重新选择' : '选择SKU'} */}
                    选择SKU
                  </Button>
                  <br /> <br />
                  <p>
                    {/* <span style={{ fontSize: '13px' }}>当前已选发货单：{rowData?.obdNo}</span> &nbsp; */}
                    {/* &nbsp; &nbsp; &nbsp; */}
                    <span
                      style={{
                        fontSize: '13px',
                        color: '#1890ff',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        if (rowData?.obdNo) {
                          setTranspotVisible(true);
                        } else {
                          return;
                        }
                      }}
                    >
                      查看原发货单物流信息
                    </span>
                  </p>
                </Space>
              }
            />
          </Card>
        </div>
      </ProForm>
      {/* 添加售后明细 */}
      <Modal
        title="添加发货单"
        width={1100}
        visible={modalVisible}
        destroyOnClose={true}
        onCancel={() => setModalVisible(false)}
        okText="下一步"
        onOk={async () => {
          if (!rowData?.obdNo) {
            message.error('请选择发货单');
            return false;
          } else if (rowData?.supportAfterSales == false) {
            message.error('该订单渠道不支持后台发起售后申请，请联系客户在API平台发起售后');
            return false;
          } else {
            if (rowData?.sapObdLinelist?.length > 0) {
              setSecondData([]);
              await getSecondData();
              setModalVisible(false);
              setModalVisibleSecond(true); //第二步
              setSelectList([]); //清空之前数据
            } else {
              message.error('相同sku只能发起一次售后申请');
            }
          }
        }}
      >
        {
          <AddFirstDetail
            rowKeys={rowData?.obdNo}
            onSelect={(record) => getInfo(record)}
            onDbSave={(record) => dbSave(record)}
          />
        }
      </Modal>
      <ModalForm
        title="选择售后SKU"
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
          if (selectList.length === 0) {
            message.error('请选择明细单');
            return false;
          } else {
            return setModalVisibleSecond(false);
          }
        }}
      >
        <AddSecondDetail
          // secondList={rowData?.sapObdLinelist}
          secondList={secondData}
          onSelect={(list) =>
            setSelectList(
              list?.map((io: any, index: any) => ({
                ...io,
                index: index,
                applyQty: io.applyQty || 0,
                totalExpensePrice: io.totalExpensePrice || io.applyQty || 0 * io.salesPrice,
                customerDescFlag: io.customerDescFlag || 0,
                repairCostInQaFlag: io.repairCostInQaFlag || 0,
              })),
            )
          }
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
        bodyStyle={{ paddingTop: 0 }}
        extra={
          <Space>
            <Button onClick={() => setTranspotVisible(false)}>关闭</Button>
          </Space>
        }
      >
        <DrawerTransport info={rowData} ids={selectList?.map((io: any) => io.obdNo)} />
      </Drawer>
    </div>
  );
};
// export default Add;
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={location.pathname} saveScrollPosition="screen">
    <Add />
  </KeepAlive>
);
