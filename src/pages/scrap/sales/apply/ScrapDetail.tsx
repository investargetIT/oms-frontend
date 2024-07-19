/* eslint-disable @typescript-eslint/no-unused-expressions */
import Dtitle from '@/pages/components/Dtitle';
import ProForm, { ModalForm } from '@ant-design/pro-form';
// import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Card, Drawer, Form, message, Modal, Space, Tabs, Tag, Upload } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useLocation } from 'umi';
import InvoiceDeliverInfo from '../../../InquirySheet/Offer/components/InvoiceDeliverInfo';
import InvoiceInfo from '../../../InquirySheet/Offer/components/InvoiceInfo';
import PayInfo from '../../../InquirySheet/Offer/components/PayInfo';
import ReceiverInfo from '../../../InquirySheet/Offer/components/ReceiverInfo';
import './index.less';
import BasicApply from './BasicApply';
import Cookies from 'js-cookie';
import { eandoApplyExport, exportError, queryeandoApplyDetail } from '@/services/afterSales';
// import RelationFlux from '../../Order/components/RelationFlux';
import RelatedProcesses from '@/pages/SalesOrder/components/RelatedProcesses';
import classNames from 'classnames';
import SearchAddress from '@/pages/InquirySheet/Offer/components/SearchAddress';
import SearchAddressInvoice from '@/pages/InquirySheet/Offer/components/SearchAddressInvoice';
import SearchInvoice from '@/pages/InquirySheet/Offer/components/SearchInvoice';
import moment from 'moment';
import { getEnv } from '@/services/utils';
const { TabPane } = Tabs;
// 需求修改 该页面只用做抽屉展示
const ScrapDetail = (props: any, ref: any) => {
  // const { isRead = false } = props;
  const { query } = useLocation() as any;
  const [info, setInfo] = useState<any>({});
  const [isRead] = useState<any>(!!query.isRead ? true : false);
  const [form] = Form.useForm();
  const [sid, setSid] = useState();
  const [uploadVisible, setUploadVisible] = useState<any>(false);
  const [modalVisibleAddress, setModalVisibleAddress] = useState<boolean>(false);
  const [modalVisibleInvice, setModalVisibleInvice] = useState<boolean>(false);
  const [modalVisibleAddressInvoice, setModalVisibleAddressInvoice] = useState<any>(false);
  const [invoiceList, setInvoiceList] = useState<any>({});
  const [addressList, setAddressList] = useState<any>({});
  const [delIds, setDelIds] = useState<any>([]);
  const [errModal, setErrModal] = useState<any>(false);
  const [errorList, setErrorList] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [total, setTotal] = useState();
  const [drawerVisible, setDrawerVisible] = useState<any>(false);

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'left',
      hideInTable: true,
      width: 150,
      render: (_, record: any) => {
        return (
          <Button
            size="small"
            key={'删除'}
            type="link"
            onClick={() => {
              Modal.confirm({
                title: '是否确认删除该明细？',
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  setDelIds(delIds.concat(record?.sid)); //TODO:  ids集合 唯一标识暂时是sku 删除放前台 备edit
                  const delData = info?.lineList?.filter((io: any) => io.sku !== record.sku);
                  setInfo({
                    ...info,
                    lineList: delData,
                  });
                },
              });
            }}
          >
            删除
          </Button>
        );
      },
    },
    { title: 'SKU号', width: 120, dataIndex: 'sku', fixed: 'left' },
    { title: '物料码', dataIndex: 'stockSkuCode', width: 100 },
    { title: '销售包装单位数量', dataIndex: 'unitQuantity', width: 150 },
    { title: '申请销售数量', width: 120, dataIndex: 'eandoQty' },
    { title: 'E&O类别', width: 120, dataIndex: 'eandoType' },
    { title: '销售单位', width: 120, dataIndex: 'salesUomCode' },
    { title: '面价含税', width: 120, dataIndex: 'listPrice' },
    { title: '库存成本（未税）', width: 120, dataIndex: 'stockCostPrice' },
    { title: '申请成交价未税', width: 120, dataIndex: 'applySalesPriceNet' },
    { title: '申请折扣率', width: 120, dataIndex: 'applyDiscountPerc' },
    { title: '申请成交价含税', width: 120, dataIndex: 'applySalesPrice' },
    { title: '小计含税', width: 120, dataIndex: 'applySalesPriceLnTotal' },
    { title: '小计折扣含税', width: 120, dataIndex: 'applyDiscountLnTotal' },
    { title: '备注', width: 120, dataIndex: 'remarks' },
    { title: '发货仓库', width: 120, dataIndex: 'wareCode' },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  // useEffect(() => {
  //   if (isRead) {
  //     queryeandoApplyDetail({ sid, pageNumber: currentPage, pageSize: currentPageSize }).then(
  //       (res: any) => {
  //         if (res?.errCode === 200) {
  //           setInfo({
  //             ...res?.data,
  //             lineList: res?.data?.pageList?.list,
  //           });
  //           setTotal(res?.data?.pageList?.total);
  //           form?.setFieldsValue({
  //             ...res?.data?.eandoApplyVo,
  //             ...res?.data?.invoiceInfo,
  //             ...res?.data?.receiverInfo,
  //             contactName: res?.data?.eandoApplyVo?.contactNameR3,
  //             // afterSales: {
  //             //   label: res?.data?.eandoApplyVo?.supplierName || '',
  //             //   value: res?.data?.eandoApplyVo?.supplierCode || '',
  //             // },
  //             region: `${res?.data?.receiverInfo?.province}${res?.data?.receiverInfo?.city}${res?.data?.receiverInfo?.district}`,
  //             consigneeEmail: res?.data?.receiverInfo?.receiverEmail,
  //             paymentTerm: res?.data?.receiverInfo?.paymentTerms,
  //             vatPhone: res?.data?.invoiceInfo?.vatPhone,
  //             invoiceReceiveRegion: res?.data?.invoiceInfo?.invoiceRegion,
  //           });
  //         } else {
  //           message.error(res.errMsg);
  //         }
  //       },
  //     );
  //   }
  // }, [sid]);
  function onShowSizeChange(current: any, pageSize: any) {
    queryeandoApplyDetail({ eandoApplyNo: sid, pageNumber: current, pageSize: pageSize }).then(
      (res: any) => {
        // if (res?.errCode === 200) {
        //   setInfo({
        //     ...res?.data,
        //     lineList: res?.data?.pageList?.list,
        //   });
        //   setTotal(res?.data?.pageList?.total);
        // } else {
        //   message.error(res.errMsg);
        // }
      },
    );
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const uploadProps = {
    name: 'file',
    maxCount: 1,
    accept: '.xls,.xlsx',
    action: `${getEnv()}/omsapi/scrapApply/import/detail`,
    headers: {
      token: Cookies.get('ssoToken'),
    },
    onChange(msg: any) {
      if (msg.file.status !== 'uploading') {
      }
      if (msg.file.status === 'done') {
        const dataList = msg?.file?.response?.data?.dataList;
        const successList = dataList
          ?.filter((io: any) => io.success === true)
          .map((io: any) => ({
            ...io,
            sysAdjustDate: moment(io.sysAdjustDate).format('YYYY-MM-DD'),
          }));
        const erList = dataList?.filter((io: any) => io.success === false);
        setErrorList(erList);
        setInfo({
          ...info,
          lineList: successList,
        });
        setUploadVisible(false);
        message.success(`${msg.file.name} file uploaded successfully`);
        // 导入失败 然后下载失败数据
        setTimeout(() => {
          setErrModal(true);
        }, 10);
      } else if (msg.file.status === 'error') {
        message.error(`${msg.file.name} file upload failed.`);
      }
    },
  };
  const downErrorData = async () => {
    await exportError(errorList).then((res) => {
      const blob = new Blob([res], {
        type: 'application/vnd.ms-xls',
      });
      let link = document.createElement('a') as any;
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', '失败数据.xlsx');
      link.click();
      link = null;
      message.success('导出成功');
      setErrModal(false);
    });
  };

  const tabChange = async (values: any) => {
    console.log(values);
  };

  const onMethodChange = (val: any) => {
    // setInfo({
    //   ...info,
    //   receiverInfo: {
    //     ...info.receiverInfo,
    //     paymentMethod: val[0].value || ''
    //   }
    // })
    form.setFieldsValue({
      paymentMethod: val[0].value || '',
    });
  };
  useEffect(() => {
    if (isRead) {
      setDrawerVisible(true);
      setSid(query?.eandoApplyNo);
      queryeandoApplyDetail({ eandoApplyNo: query?.eandoApplyNo }).then((res: any) => {
        // if (res?.errCode === 200) {
        //   const newData = {
        //     ...res.data,
        //     receiverInfo: {
        //       ...res?.data?.receiverInfo,
        //       provinceName: res?.data?.receiverInfo.provinceName,
        //       cityName: res?.data?.receiverInfo?.cityName,
        //       districtName: res?.data?.receiverInfo?.districtName,
        //     },
        //     invoiceInfo: {
        //       ...res?.data?.invoiceInfo,
        //     },
        //     lineList: res?.data?.pageList?.list?.map((item: any, index: any) => {
        //       return {
        //         ...item,
        //         index,
        //       };
        //     }),
        //   };
        //   setTotal(res?.data?.pageList?.total);
        //   setInfo(newData);
        //   form?.setFieldsValue({
        //     ...res?.data?.eandoApplyVo,
        //     ...res?.data?.invoiceInfo,
        //     ...res?.data?.receiverInfo,
        //     contactName: res?.data?.eandoApplyVo?.contactNameR3,
        //     region: `${res?.data?.receiverInfo?.province}${res?.data?.receiverInfo?.city}${res?.data?.receiverInfo?.district}`,
        //     consigneeEmail: res?.data?.receiverInfo?.receiverEmail,
        //     paymentTerm: res?.data?.receiverInfo?.paymentTerms,
        //     vatPhone: res?.data?.invoiceInfo?.vatPhone,
        //     invoiceReceiveRegion: res?.data?.invoiceInfo?.invoiceRegion,
        //   });
        // }
      });
    } else {
      form.resetFields();
    }
  }, [query?.sid]);
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
    // console.log(addressList, 'address');
    // jinbao
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
    return true;
  };
  function open(eandoApplyNo: any) {
    setDrawerVisible(true);
    setSid(eandoApplyNo);
    queryeandoApplyDetail({
      eandoApplyNo: eandoApplyNo,
      pageNumber: currentPage,
      pageSize: currentPageSize,
    }).then((res: any) => {
      // if (res?.errCode === 200) {
      //   setInfo({
      //     ...res?.data,
      //     lineList: res?.data?.pageList?.list,
      //   });
      //   setTotal(res?.data?.pageList?.total);
      //   form?.setFieldsValue({
      //     ...res?.data?.eandoApplyVo,
      //     ...res?.data?.invoiceInfo,
      //     ...res?.data?.receiverInfo,
      //     contactName: res?.data?.eandoApplyVo?.contactNameR3,
      //     // afterSales: {
      //     //   label: res?.data?.eandoApplyVo?.supplierName || '',
      //     //   value: res?.data?.eandoApplyVo?.supplierCode || '',
      //     // },
      //     region: `${res?.data?.receiverInfo?.province}${res?.data?.receiverInfo?.city}${res?.data?.receiverInfo?.district}`,
      //     consigneeEmail: res?.data?.receiverInfo?.receiverEmail,
      //     paymentTerm: res?.data?.receiverInfo?.paymentTerms,
      //     vatPhone: res?.data?.invoiceInfo?.vatPhone,
      //     invoiceReceiveRegion: res?.data?.invoiceInfo?.invoiceRegion,
      //   });
      // } else {
      //   message.error(res.errMsg);
      // }
    });
  }
  useImperativeHandle(ref, () => ({
    open,
  }));
  const SideBar = document.getElementsByClassName('ant-layout-sider');
  const drawerWidth = window.innerWidth - SideBar[0].clientWidth;
  return (
    <Drawer
      // className="DrawerForm"
      width={drawerWidth}
      key={'detail'}
      title={[
        <span key={''}>E&O销售申请编号:{info?.eandoApplyVo?.eandoApplyNo}</span>,
        <Tag key={'售后状态'} color="gold" style={{ marginLeft: 10 }}>
          {info?.eandoApplyVo?.eandoStatusStr}
        </Tag>,
      ]}
      visible={drawerVisible}
      onClose={() => {
        setDrawerVisible(false);
        history.go(-1);
      }}
      destroyOnClose={true}
      extra={
        <Space>
          <Button
            onClick={() => {
              setDrawerVisible(false);
              history.go(-1);
            }}
          >
            关闭
          </Button>
        </Space>
      }
    >
      <div className="form-content-search createForm" id="salesAfterApplyEdit">
        <ProForm
          layout="horizontal"
          className="fix_lable_large has-gridForm"
          form={form}
          onFinishFailed={() => {
            message.warning('您有未完善的信息，请填写正确的信息');
          }}
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
          }}
          submitter={{
            render: () => {
              return false;
            },
          }}
        >
          <div className="editContentCol minHeight">
            <Tabs
              defaultActiveKey="1"
              size="large"
              onChange={tabChange}
              className={classNames({ hideTab: isRead ? false : true }, 'fixTab', 'hasTitle')}
            >
              <TabPane tab="基本信息" key="1">
                <Card title="申请基本信息" bordered={false} id="basic">
                  <BasicApply type="scrapApply" readonly={true} info={info?.eandoApplyVo} />
                </Card>
                <Card title="收货信息" bordered={false} id="receiver">
                  <ReceiverInfo
                    info={info?.receiverInfo}
                    type="scrapApply"
                    readonly={true}
                    onModal={() => {
                      !isRead && setModalVisibleAddress(true);
                    }}
                  />
                </Card>
                <Card title="配送及支付信息" bordered={false} id="pay">
                  <PayInfo
                    type="scrapApply"
                    readonly={true}
                    info={info?.receiverInfo}
                    onMethodChange={(newArrayValue: any) => onMethodChange(newArrayValue)}
                  />
                </Card>
                <Card title="开票信息" bordered={false} id="invoice">
                  <InvoiceInfo
                    type="scrapApply"
                    readonly={true}
                    info={info?.invoiceInfo}
                    onModal={() => {
                      !isRead && setModalVisibleInvice(true);
                    }}
                  />
                </Card>
                <Card title="发票寄送信息" bordered={false} id="invoiceDeliver">
                  <InvoiceDeliverInfo
                    type="scrapApply"
                    readonly={true}
                    info={info?.invoiceInfo}
                    onModal={() => {
                      !isRead && setModalVisibleAddressInvoice(true);
                    }}
                  />
                </Card>
                <Card title="明细" bordered={false} className="order-msg" id="shopDetail">
                  <div className="cust-table">
                    <ProTable<ProColumns>
                      columns={columns}
                      scroll={{ x: 200, y: 500 }}
                      size="small"
                      rowKey="index"
                      bordered
                      options={false}
                      search={false}
                      pagination={{
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        // showTotal: total => `共有 ${total} 条数据`,
                        total: total,
                        showTotal: (_, range) =>
                          `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                        showQuickJumper: true,
                        onShowSizeChange: (current: any, pageSize: any) =>
                          onShowSizeChange(current, pageSize),
                      }}
                      dateFormatter="string"
                      dataSource={info?.lineList?.map((io: any, index: any) => ({
                        ...io,
                        index,
                      }))}
                      headerTitle={
                        <Space style={{ marginBottom: '6px' }}>
                          <Button
                            type="primary"
                            key={'export'}
                            onClick={() => {
                              if (!info?.lineList?.length) {
                                message.error('您还没有明细，无法导出，请导入明细');
                                return;
                              }
                              if (info?.lineList?.length > 0) {
                                eandoApplyExport(info?.eandoApplyVo?.eandoApplyNo).then(
                                  (res: any) => {
                                    // console.log(res, 'res');
                                    const blob = new Blob([res], {
                                      type: 'application/vnd.ms-xls',
                                    });
                                    let link = document.createElement('a') as any;
                                    link.href = URL.createObjectURL(blob);
                                    link.setAttribute('download', '明细.xls');
                                    link.click();
                                    link = null;
                                    message.success('导出成功');
                                  },
                                );
                              } else {
                                setUploadVisible(true);
                              }
                            }}
                          >
                            导出
                          </Button>
                        </Space>
                      }
                    />
                  </div>
                </Card>
              </TabPane>
              <TabPane tab="相关流程" key="2">
                <Card title="" className="cust-table">
                  {/* galen wan公用 */}
                  {/*<RelationFlux workflowId={info?.scrapApply?.scrapApplyNo} />*/}
                  <RelatedProcesses billNo={info?.eandoApplyVo?.eandoApplyNo} />
                </Card>
              </TabPane>
            </Tabs>
          </div>
        </ProForm>
        {/* 上传 */}
        <ModalForm
          title={<Dtitle title="导入" subTitle="仅支持xls xlsx格式文件" />}
          visible={uploadVisible}
          onVisibleChange={setUploadVisible}
          modalProps={{ destroyOnClose: true }}
          submitter={{
            searchConfig: {
              submitText: '确定',
              resetText: '取消',
            },
          }}
          onFinish={async () => {
            setUploadVisible(false);
            return true;
          }}
        >
          <Space style={{ marginBottom: '10px' }}>
            <Upload {...uploadProps} accept=".xls, .xlsx" maxCount={1}>
              <Button type="primary">选择文件</Button>
            </Upload>
            <Button
              type="link"
              href={`${getEnv()}/omsapi/download/scrapApply.xlsx?token=${Cookies.get('ssoToken')}`}
            >
              下载模板
            </Button>
          </Space>
        </ModalForm>
        {/* 地址选择 带合并 */}
        <Modal
          title="地址选择"
          width={1500}
          destroyOnClose={true}
          visible={modalVisibleAddress}
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
            customerCode={info?.scrapApply?.customerCode}
            onDbSave={(record) => dbSaveAddress(record)}
            onSelect={(record) => setAddressList(record)}
          />
        </Modal>
        {/* 开票地址选择  */}
        <ModalForm
          title="地址选择"
          layout="horizontal"
          width={1100}
          modalProps={{ destroyOnClose: true }}
          visible={modalVisibleAddressInvoice}
          onVisibleChange={setModalVisibleAddressInvoice}
          submitter={{
            searchConfig: {
              submitText: '选择',
              resetText: '取消',
            },
          }}
          onFinish={async () => {
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
            };
            console.log(invoiceAdd);

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
            customerCode={info?.scrapApply?.customerCode}
            onDbSave={(record) => dbSaveVatAddress(record)}
            onSelect={(record) => setAddressList(record)}
          />
        </ModalForm>
        {/* 选择开票信息 */}
        <ModalForm
          title="选择开票信息"
          layout="horizontal"
          width={1100}
          modalProps={{ destroyOnClose: true }}
          visible={modalVisibleInvice}
          onVisibleChange={setModalVisibleInvice}
          submitter={{
            searchConfig: {
              submitText: '选择',
              resetText: '取消',
            },
          }}
          onFinish={async () => {
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
            customerCode={info?.scrapApply?.customerCode}
            onDbSave={(record) => dbSaveVat(record)}
            onSelect={(record) => setInvoiceList(record)}
          />
        </ModalForm>
        {/* 失败显示 */}
        <Modal
          title="导入结果提示"
          visible={errModal}
          destroyOnClose={true}
          onOk={() => {
            setErrModal(false);
          }}
          onCancel={() => {
            setErrModal(false);
          }}
          okText="确认"
          cancelText=""
        >
          <p style={{ paddingLeft: '18px' }}>
            {' '}
            {`成功导入${info?.lineList?.length}条，失败${errorList?.length}条，可修改后重新导入`}
          </p>
          <Button type="link" key="down" onClick={downErrorData}>
            下载失败数据{' '}
          </Button>
        </Modal>
      </div>
    </Drawer>
  );
};
export default forwardRef(ScrapDetail);
