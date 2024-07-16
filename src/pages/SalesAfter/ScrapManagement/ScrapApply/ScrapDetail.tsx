/* eslint-disable @typescript-eslint/no-unused-expressions */
import Dtitle from '@/pages/components/Dtitle';
import ProForm, { ModalForm } from '@ant-design/pro-form';
// import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Card, Form, message, Modal, Space, Tabs, Upload } from 'antd';
import { useEffect, useState } from 'react';
// import { useLocation } from 'umi';
import InvoiceDeliverInfo from '../../../InquirySheet/Offer/components/InvoiceDeliverInfo';
import InvoiceInfo from '../../../InquirySheet/Offer/components/InvoiceInfo';
import PayInfo from '../../../InquirySheet/Offer/components/PayInfo';
import ReceiverInfo from '../../../InquirySheet/Offer/components/ReceiverInfo';
import '../../index.less';
import BasicApply from './components/BasicApply';
import Cookies from 'js-cookie';
import { exportError, queryApplyDetail, saveScrapApply } from '@/services/afterSales';
// import RelationFlux from '../../Order/components/RelationFlux';
import RelatedProcesses from '@/pages/SalesOrder/components/RelatedProcesses';
import classNames from 'classnames';
import SearchAddress from '@/pages/InquirySheet/Offer/components/SearchAddress';
import SearchAddressInvoice from '@/pages/InquirySheet/Offer/components/SearchAddressInvoice';
import SearchInvoice from '@/pages/InquirySheet/Offer/components/SearchInvoice';
import moment from 'moment';
import {
  checkBond,
  getSelectList,
  queryBillingInfo,
  queryInvoiceAddress,
  queryPayInfo,
  queryRecAddress,
} from '@/services/InquirySheet/utils';
import { getEnv } from '@/services/utils';
import { useModel } from 'umi';
const { TabPane } = Tabs;
// 需求修改 该页面只用做抽屉展示
interface IProps {
  sid: string;
  isRead: boolean;
}
const ScrapDetail: React.FC<any> = (props: IProps) => {
  const { sid, isRead = false } = props;
  // const { query } = useLocation() as any;
  const [info, setInfo] = useState<any>({});
  // const [isRead] = useState<any>(!!query.isRead ? true : false);
  const [form] = Form.useForm();
  const [uploadVisible, setUploadVisible] = useState<any>(false);
  const [modalVisibleAddress, setModalVisibleAddress] = useState<boolean>(false);
  const [modalVisibleInvice, setModalVisibleInvice] = useState<boolean>(false);
  const [modalVisibleAddressInvoice, setModalVisibleAddressInvoice] = useState<any>(false);
  const [invoiceList, setInvoiceList] = useState<any>({});
  const [addressList, setAddressList] = useState<any>({});
  const [delIds, setDelIds] = useState<any>([]);
  const [errModal, setErrModal] = useState<any>(false);
  const [errorList, setErrorList] = useState<any>([]);
  const { destroyCom } = useModel('tabSelect');

  const calcTotal = async (arrData: any) => {
    form?.setFieldsValue({
      costTotalPrice: arrData
        ?.map((io: any) => io.stockCostPrice * io.scrapQty)
        ?.reduce((cur: any, net: any) => cur + net),
      scrapTotalPrice: arrData
        ?.map((io: any) => io.scrapPrice * io.scrapQty)
        ?.reduce((cur: any, net: any) => cur + net),
    });
  };

  const columns: ProColumns<any>[] = [
    { title: '序号', dataIndex: 'index', valueType: 'index', width: 50, fixed: 'left' },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'left',
      hideInTable: isRead ? true : false,
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
                  calcTotal(delData);
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
    { title: '申请报废数量', width: 120, dataIndex: 'scrapQty' },
    { title: '销售单位', width: 120, dataIndex: 'stockUnit' },
    { title: '库存成本', width: 120, dataIndex: 'stockCostPrice' },
    { title: '报废售价', width: 120, dataIndex: 'scrapPrice' },
    { title: '库存调整原因', width: 120, dataIndex: 'stockAdjustReasonType' },
    { title: '库存调整类别', width: 120, dataIndex: 'stockAdjustType' },
    { title: '系统调整日期', width: 120, dataIndex: 'sysAdjustDate', valueType: 'date' },
    { title: '备注', width: 120, dataIndex: 'remarks' },
    { title: '成本中心', width: 120, dataIndex: 'costCenter' },
    { title: '仓库', width: 120, dataIndex: 'wareCode' },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    if (isRead) {
      queryApplyDetail({ sid }).then((res: any) => {
        if (res?.errCode === 200) {
          const newData = {
            ...res.data,
            scrapApply: {
              ...res?.data?.scrapApply,
              contactName: {
                label: res?.data?.scrapApply?.contactNameR3 || '',
                value: res?.data?.scrapApply?.contactCodeR3 || '',
              },
              afterSales: {
                value: res?.data?.scrapApply?.supplierCode || '',
                label: res?.data?.scrapApply?.supplierName || '',
              },
            },
            receiverInfo: {
              ...res?.data?.receiverInfo,
              provinceName: res?.data?.receiverInfo.provinceName,
              cityName: res?.data?.receiverInfo?.cityName,
              districtName: res?.data?.receiverInfo?.districtName,
            },
            invoiceInfo: {
              ...res?.data?.invoiceInfo,
            },
          };
          setInfo(newData);
          form?.setFieldsValue({
            ...res?.data?.scrapApply,
            contactName: {
              label: res?.data?.scrapApply?.contactNameR3
                ? res?.data?.scrapApply?.contactNameR3
                : '-',
              value: res?.data?.scrapApply?.contactCodeR3
                ? res?.data?.scrapApply?.contactCodeR3
                : '',
            },
            afterSales: {
              label: res?.data?.scrapApply?.supplierName || '',
              value: res?.data?.scrapApply?.supplierCode || '',
            },
            ...res?.data?.receiverInfo,
            region: `${res?.data?.receiverInfo?.province}${res?.data?.receiverInfo?.city}${res?.data?.receiverInfo?.district}`,
            consigneeEmail: res?.data?.receiverInfo?.receiverEmail,
            paymentTerm: res?.data?.receiverInfo?.paymentTerms,
            ...res?.data?.invoiceInfo,
            vatPhone: res?.data?.invoiceInfo?.vatPhone,
            invoiceReceiveRegion: res?.data?.invoiceInfo?.invoiceRegion,
          });
        }
      });
    }
  }, []);

  const submit = async (values: any) => {
    // 、、设计的时候不要，现在要
    let condationList = [] as any;
    let methodList = [] as any;
    await getSelectList({ type: 'paymentTerm' }).then((res: any) => {
      if (res?.errCode === 200) {
        condationList = res?.data?.dataList?.map((io: any) => ({
          ...io,
          label: io.value,
          value: io.key,
        }));
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
        }
      },
    );

    const paymentMethodName = methodList?.filter((io: any) => io.key == values?.paymentMethod)[0]
      ?.label;
    const paymentTermsName = condationList?.filter((io: any) => io.key == values?.paymentTerm)[0]
      ?.label;

    if (!paymentTermsName) {
      message.error('请选择正确的支付条件');
      return false;
    }
    if (!paymentMethodName) {
      message.error('请选择正确的支付方式');
      return false;
    }

    const par = {
      scrapApplyReqVo: {
        applyTitle: values.applyTitle,
        supplierCode: values.afterSales.value,
        supplierName: values.afterSales.label,
        contactNameR3: values.contactName.label,
        contactCodeR3: values.contactName.value,
        salesId: info?.scrapApply?.salesId,
        salesName: values.salesName,
        companyCode: info?.scrapApply?.companyCode,
        companyName: values.companyName,
        applyReason: values.applyReason,
      },
      receiverInfo: {
        ...info.receiverInfo,
        toBond: values.toBond,
        specialCode: values.specialCode,
        shipType: values.shipType,
        paymentMethod: values.paymentMethod,
        paymentTerms: values.paymentTerm,
        province: info?.receiverInfo?.provinceName,
        city: info?.receiverInfo?.cityName,
        district: info.receiverInfo?.districtName,
        paymentTermsName,
        paymentMethodName,
        shipRegionSapCode: info?.receiverInfo?.shipRegionSapCode,
      },
      invoiceInfo: {
        ...info.invoiceInfo,
        invoiceType: values.invoiceType,
        invoiceTitleType: 2, //发票抬头类型，1：个人，2：单位   暂无
        vatCompanyName: values.invoiceTitle, //vatCompanyName 单位后端备用 前端暂无对应
        followMerchandise: values.followMerchandise,
        invoiceRegion: values.invoiceReceiveRegion,
        payerCustomerAccount: info?.invoiceInfo?.payerCustomerAccount,
        invoiceSapCode: info?.invoiceInfo?.invoiceSapCode,
      },
      lineList: info?.lineList,
      // delLineIds: delIds,
    };
    const { errCode, errMsg } = await saveScrapApply(par);
    if (errCode === 200) {
      message.success('申请提交成功');
      destroyCom('/sales-after/scrap-management/scrap-apply', location.pathname);
    } else {
      message.error(errMsg);
    }
  };

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

  const onChangeBasic = async (values: any) => {
    //  以下默认 crm的数据   小心字段，，不一样
    // 默认收货信息
    let defaultRecive = {} as any;
    await queryRecAddress({ customerCode: values?.customerCode }).then((resrecive: any) => {
      if (resrecive?.errCode === 200) {
        if (resrecive?.data?.dataList.length > 0) {
          defaultRecive = {
            region: `${resrecive?.data?.dataList[0]?.provinceName}${resrecive?.data?.dataList[0]?.cityName}${resrecive?.data?.dataList[0]?.districtName}`,
            provinceCode: resrecive?.data?.dataList[0]?.province,
            cityCode: resrecive?.data?.dataList[0]?.city,
            districtCode: resrecive?.data?.dataList[0]?.district,
            provinceName: resrecive?.data?.dataList[0]?.provinceName,
            cityName: resrecive?.data?.dataList[0]?.cityName,
            districtName: resrecive?.data?.dataList[0]?.districtName,
            receiverAddress: resrecive?.data?.dataList[0]?.receiptAddress,
            shipZip: resrecive?.data?.dataList[0]?.receiptZipCode,
            receiverName: resrecive?.data?.dataList[0]?.recipientName,
            receiverMobile: resrecive?.data?.dataList[0]?.receiptMobilePhone,
            receiverPhone: resrecive?.data?.dataList[0]?.receiptFixPhone,
            consigneeEmail: resrecive?.data?.dataList[0]?.receiptEmail,
            shipRegionSapCode: resrecive?.data?.dataList[0]?.sapCode,
          };
        }
      }
    });
    // 默认 queryPayInfo
    let defaultPay = {} as any;
    await queryPayInfo({ customerCode: values?.customerCode }).then((respay: any) => {
      if (respay.data) {
        defaultPay = {
          paymentTerm: (respay?.data?.type && respay?.data?.type?.toString()) || '',
          paymentMethod: respay?.data?.code || '',
        };
      }
    });
    // 获取默认开票信息接口
    let ppinvoice = {} as any;
    await queryBillingInfo({ customerCode: values?.customerCode }).then((res1: any) => {
      if (res1.errCode === 200) {
        if (res1?.data?.dataList?.length > 0) {
          let getInvoiceType: any = '3';
          if (res1?.data?.dataList[0]?.invoiceType == '') {
            getInvoiceType = '3';
          } else {
            const invoiceTypeStr = res1?.data?.dataList[0]?.invoiceType.split(',').sort();
            if (invoiceTypeStr.length <= 1) getInvoiceType = res1?.data?.dataList[0]?.invoiceType;
            else getInvoiceType = invoiceTypeStr[0];
          }
          ppinvoice = {
            invoiceType: getInvoiceType,
            invoiceTitle: res1?.data?.dataList[0].customerName,
            vatTaxNo: res1?.data?.dataList[0].taxNumber,
            vatBankName: res1?.data?.dataList[0].bankName,
            vatBankNo: res1?.data?.dataList[0].bankAccount,
            vatAddress: res1?.data?.dataList[0].registerAddress,
            vatPhone: res1?.data?.dataList[0].registerTelephone,
            payerCustomerAccount: res1?.data?.dataList[0].payerCustomerAccount,
          };
        } else {
          ppinvoice = {
            invoiceType: '3',
          };
        }
      }
    });
    // 默认发票寄送信息
    let defaultVatAddress = {} as any;
    await queryInvoiceAddress({ customerCode: values?.customerCode }).then((resvat: any) => {
      if (resvat.errCode === 200) {
        if (resvat?.data?.dataList?.length > 0) {
          defaultVatAddress = {
            invoiceReceiver: resvat?.data?.dataList[0].recipientName,
            invoiceAddress: resvat?.data?.dataList[0].receiptAddress,
            invoiceZip: resvat?.data?.dataList[0].receiptZipCode,
            invoiceTel: resvat?.data?.dataList[0].receiptFixPhone,
            invoiceMobile: resvat?.data?.dataList[0].receiptMobilePhone,
            invoiceEmail: resvat?.data?.dataList[0].receiptEmail,
            invoiceReceiveRegion: `${resvat?.data?.dataList[0].provinceName}${resvat?.data?.dataList[0].cityName}${resvat?.data?.dataList[0].districtName}`,
            followMerchandise: resvat?.data?.dataList[0].followMerchandise == false ? 0 : 1,
            invoiceSapCode: resvat?.data?.dataList[0]?.sapCode,
          };
        }
      }
    });

    let toBond = false;
    await checkBond({ customerCode: values?.customerCode }).then((resbond: any) => {
      if (resbond?.errCode === 200) {
        toBond = resbond?.data?.toBond;
      }
    });

    const newData = {
      ...info,
      scrapApply: {
        ...info?.scrapApply,
        afterSales: {
          label: values?.customerName,
          value: values?.customerCode,
        },
        companyName: values?.branchCompanyName,
        salesName: values?.salesName,
        customerCode: values?.customerCode,
        contactName: {
          label: values?.contactName?.label == undefined ? '' : values?.contactName?.label,
          value: values?.contactName?.value == undefined ? '' : values?.contactName?.value,
        },
        contactCodeR3: values?.contactName?.value,
        companyCode: values?.branchCode,
        salesId: values?.salesNo,
      },
      receiverInfo: {
        ...info?.receiverInfo,
        ...defaultPay,
        ...defaultRecive,
        customerCode: values?.customerCode,
        toBond,
      },
      invoiceInfo: {
        ...info?.invoiceInfo,
        ...ppinvoice, // 默认开票获取
        ...defaultVatAddress,
      },
    };
    form.setFieldsValue({
      ...info.scrapApply,
      afterSales: {
        label: values?.customerName,
        value: values?.customerCode,
      },
      companyName: values?.branchCompanyName,
      salesName: values?.salesName,
      customerCode: values?.customerCode,
      contactName: {
        label: values?.contactName?.label == undefined ? '' : values?.contactName?.label,
        value: values?.contactName?.value == undefined ? '' : values?.contactName?.value,
      },
      contactCodeR3: values?.contactName?.value,
      ...ppinvoice,
      ...defaultPay,
      ...defaultRecive,
      ...defaultVatAddress,
    });
    setInfo(newData);
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
  return (
    <div className="form-content-search createForm" id="salesAfterApplyEdit">
      <ProForm
        layout="horizontal"
        onFinish={(values) => submit(values)}
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
            if (!isRead)
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
                    <Button type="primary" htmlType="submit">
                      提交申请
                    </Button>
                    <Button
                      onClick={() => {
                        destroyCom('/sales-after/scrap-management/scrap-apply', location.pathname);
                      }}
                    >
                      取消
                    </Button>
                  </Space>
                </div>
              );
            else {
              return false;
            }
          },
        }}
      >
        {/* {isRead ? (
          <Card className="head-title-wrap">
            <div style={{ fontSize: '16px', marginBottom: '5px' }}>
              报废申请编号：{info?.scrapApply?.scrapApplyNo}
              <Tag color="gold" style={{ marginLeft: '10px' }}>
                {info?.scrapApply?.scrapStatusDesc}
              </Tag>
            </div>
            <Row gutter={[0, 24]} style={{ paddingTop: '10px' }}>
              <Col span={5}>
                <span className="label">订单类型：</span>
                <span className="val">报废订单</span>
              </Col>
            </Row>
          </Card>
        ) : (
          <Card className="head-title-wrap">
            <Row gutter={24}>
              <Col span={5} className="title">
                新增报废申请
              </Col>
            </Row>
          </Card>
        )} */}
        <div className="editContentCol minHeight">
          <Tabs
            defaultActiveKey="1"
            size="large"
            onChange={tabChange}
            className={classNames({ hideTab: isRead ? false : true }, 'fixTab', 'hasTitle')}
          >
            <TabPane tab="基本信息" key="1">
              <Card title="申请基本信息" bordered={false} id="basic">
                <BasicApply
                  type="scrapApply"
                  readonly={isRead}
                  info={info?.scrapApply}
                  onChangeBasic={(values: any) => onChangeBasic(values)}
                />
              </Card>
              <Card title="收货信息" bordered={false} id="receiver">
                <ReceiverInfo
                  info={info?.receiverInfo}
                  type="scrapApply"
                  readonly={isRead}
                  onModal={() => {
                    !isRead && setModalVisibleAddress(true);
                  }}
                />
              </Card>
              <Card title="配送及支付信息" bordered={false} id="pay">
                <PayInfo
                  type="scrapApply"
                  readonly={isRead}
                  info={info?.receiverInfo}
                  onMethodChange={(newArrayValue: any) => onMethodChange(newArrayValue)}
                />
              </Card>
              <Card title="开票信息" bordered={false} id="invoice">
                <InvoiceInfo
                  type="scrapApply"
                  readonly={isRead}
                  info={info?.invoiceInfo}
                  onModal={() => {
                    !isRead && setModalVisibleInvice(true);
                  }}
                />
              </Card>
              <Card title="发票寄送信息" bordered={false} id="invoiceDeliver">
                <InvoiceDeliverInfo
                  type="scrapApply"
                  readonly={isRead}
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
                    pagination={false}
                    dateFormatter="string"
                    dataSource={info?.lineList?.map((io: any, index: any) => ({
                      ...io,
                      index,
                    }))}
                    headerTitle={
                      !isRead && (
                        <Space style={{ marginBottom: '6px' }}>
                          <Button
                            type="primary"
                            key={'import'}
                            onClick={() => {
                              if (info?.lineList?.length > 0) {
                                Modal.confirm({
                                  title: '当前已有明细，再次导入将覆盖原内容，是否确认导入？',
                                  okText: '确认',
                                  cancelText: '取消',
                                  onOk: () => {
                                    setUploadVisible(true);
                                  },
                                });
                              } else {
                                setUploadVisible(true);
                              }
                            }}
                          >
                            导入
                          </Button>
                          <Button
                            key={'clear'}
                            onClick={() => {
                              if (!info?.lineList?.length) {
                                message.error('您还没有明细，无法清空，请导入明细');
                                return;
                              }
                              Modal.confirm({
                                title: '确认清空明细吗？',
                                content: '',
                                okText: '确认',
                                cancelText: '取消',
                                onOk: async () => {
                                  setDelIds(info.lineList.map((io: any) => io.sid));
                                  setInfo({
                                    ...info,
                                    lineList: [],
                                  });
                                },
                              });
                            }}
                          >
                            清空明细
                          </Button>
                        </Space>
                      )
                    }
                  />
                </div>
              </Card>
            </TabPane>
            <TabPane tab="相关流程" key="2">
              <Card title="" className="cust-table">
                {/* galen wan公用 */}
                {/*<RelationFlux workflowId={info?.scrapApply?.scrapApplyNo} />*/}
                <RelatedProcesses billNo={info?.scrapApply?.scrapApplyNo} />
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
          calcTotal(info?.lineList);
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
  );
};
export default ScrapDetail;
