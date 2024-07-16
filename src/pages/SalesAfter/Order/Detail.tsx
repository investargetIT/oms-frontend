import ProForm, { DrawerForm } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Anchor, Button, Card, Col, message, Modal, Row, Space, Tabs } from 'antd';
import { useState } from 'react';
import BasicInfo from './components/BasicInfo';
import InvoiceDeliverInfo from '../../InquirySheet/Offer/components/InvoiceDeliverInfo';
import InvoiceInfo from '../../InquirySheet/Offer/components/InvoiceInfo';
import PayInfo from '../../InquirySheet/Offer/components/PayInfo';
import ReceiverInfo from '../../InquirySheet/Offer/components/ReceiverInfo';
import { menuLink } from '@/pages/SalesAfter/components/const';
import '../index.less';
import RelationDeliver from './components/RelationDeliver';
// import { useParams } from 'umi';
import {
  authority,
  cancelAfterOrder,
  confirmRepair,
  queryAfterOrderDetail,
} from '@/services/afterSales';
import TotalDesc from './components/TotalDesc';
// import RelationFlux from './components/RelationFlux';
import Cookies from 'js-cookie';
import RelatedProcesses from '@/pages/SalesOrder/components/RelatedProcesses';
import Log from '@/pages/InquirySheet/Offer/components/Log';
import { getEnv } from '@/services/utils';
import UploadForm from '@/pages/SalesOrder/components/UploadForm';
import { saveRefResource } from '@/services/SalesOrder';
const { TabPane } = Tabs;
const { Link } = Anchor;

interface DetailProps {
  id?: string;
  onClose?: () => void;
}
const Detail: React.FC<DetailProps> = ({ id, onClose }) => {
  // const params: { id?: any } = useParams() as any;
  const [info, setInfo] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [logVisible, setLogVisible] = useState<any>(false);
  const [isUpload, setIsUpload] = useState<any>(false);

  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const fileColumns: ProColumns<any>[] = [
    { title: '文件名称', dataIndex: 'resourceName' },
    { title: '文件类型', dataIndex: 'fileType', width: 150 },
    // { title: '创建者', dataIndex: 'createName', width: 150 },
    // { title: '创建时间', dataIndex: 'createTime', width: 150, valueType: 'date' },
    {
      title: '操作',
      dataIndex: 'option',
      width: 150,
      render: (_, record: any) => (
        <Button
          size="small"
          type="link"
          target="_blank"
          href={`${record.resourceUrl}?token=${Cookies.get('ssoToken')}`}
          key={'down'}
        >
          下载
        </Button>
      ),
    },
  ];

  const orderAfterColumns: ProColumns<any>[] = [
    {
      title: '#',
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 100,
      fixed: 'left',
    },
    {
      title: '数量',
      dataIndex: 'qty',
      width: 100,
    },
    {
      title: '销售单位',
      dataIndex: 'salesUnit',
      width: 100,
    },
    { title: '物料码', dataIndex: 'stockSkuCode', width: 100 },
    { title: '销售包装单位数量', dataIndex: 'unitQuantity', width: 150 },
    {
      title: '面价',
      dataIndex: 'facePrice',
      className: 'brown',
      width: 100,
    },
    {
      title: '成交价-含税',
      dataIndex: 'dealTaxPrice',
      className: 'brown',
      width: 100,
    },
    {
      title: '成交价-未税',
      dataIndex: 'noDealTaxPrice',
      className: 'brown',
      width: 100,
    },
    {
      title: '小计-含税',
      dataIndex: 'taxSubtotalPrice',
      className: 'brown',
      width: 100,
    },
    {
      title: '小计-未税',
      dataIndex: 'noTaxSubtotalPrice',
      className: 'brown',
      // render: (_, record) => {
      //   if (!record.qty || !record.salesPriceNet) {
      //     return '-';
      //   } else {
      //     return (record.qty * record.salesPriceNet).toFixed(0);
      //   }
      // },
      width: 100,
    },
    {
      title: '小计-折扣',
      dataIndex: 'discountSubtotalPrice',
      className: 'brown',
      width: 100,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      width: 400,
      render: (_, record: any) => {
        return `${record?.brand || ''} ${record?.productName} ${record?.manufacturerNo || ''}`;
      },
    },
    {
      title: '是否JV',
      dataIndex: 'jvFlagName', // jvFlag
      width: 100,
    },
    {
      title: 'JV公司',
      dataIndex: 'jvCompanyName', // jvCompanyCode
      width: 250,
    },
    {
      title: '制造商型号',
      dataIndex: 'manufacturerNo',
      width: 100,
    },
    {
      title: '供应商型号',
      dataIndex: 'supplierNo',
      width: 100,
    },
    {
      title: '物理单位',
      dataIndex: 'physicsUnit',
      width: 100,
    },
    {
      title: '交付周期(工作日)',
      dataIndex: 'leadTime',
      width: 100,
      hideInTable: true,
    },
    // {
    //   title: '是否可退换货',
    //   dataIndex: 'returnFlagName',
    //   hideInTable: true,
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
      dataIndex: 'directDeliveryFlag',
      hideInTable: true,
      render: (_, record: any) => {
        if (record.directDeliveryFlag == 1) {
          return '是';
        } else if (record.directDeliveryFlag == 0) {
          return '否';
        } else {
          return record.directDeliveryFlag;
        }
      },
      width: 100,
    },
    {
      title: 'SKU类型',
      dataIndex: 'skuTypeName',
      width: 100,
      hideInTable: true,
    },
    {
      title: '产品业务状态',
      dataIndex: 'businessStatus',
      width: 100,
      hideInTable: true,
    },
    {
      title: '备货状态',
      dataIndex: 'stockType',
      width: 100,
      hideInTable: true,
    },
    {
      title: '运费',
      dataIndex: 'freightPrice',
      width: 100,
      hideInTable: true,
    },
    {
      title: '国际运费',
      dataIndex: 'intlFreightPrice',
      width: 100,
      hideInTable: true,
    },
    {
      title: '关税',
      dataIndex: 'tariffPrice',
      width: 100,
      hideInTable: true,
    },
    {
      title: '退回仓库',
      dataIndex: 'returnWarehouseTypeName',
      width: 100,
    },
    {
      title: '发货仓库',
      dataIndex: 'deliveryWarehouse',
      width: 100,
    },
    {
      title: '发货仓库名称',
      dataIndex: 'deliveryWarehouseName',
      width: 150,
    },
    {
      title: '货物起运点',
      dataIndex: 'startDot',
      width: 100,
    },
    {
      title: '货物起运点名称',
      dataIndex: 'startDotName',
      width: 100,
    },
    {
      title: '预计发货日期',
      dataIndex: 'expectDate',
      valueType: 'date',
      width: 100,
    },
  ];
  orderAfterColumns.forEach((item: any) => {
    item.ellipsis = true;
  });

  const tabChange = (values: any) => {
    console.log(values);
  };

  // const downLoadOrder = async () => {
  //   const par = {
  //     sid: info?.salesOrderVO?.sid,
  //     token: Cookies.get('ssoToken'),
  //   };
  //   downAfterOrderPdf(par).then((res) => {
  //     const blob = new Blob([res], {
  //       type: 'application/vnd.ms-pdf',
  //     });
  //     let link = document.createElement('a') as any;
  //     link.href = URL.createObjectURL(blob);
  //     link.setAttribute('download', `【${info?.salesOrderVO?.orderNo}】售后费用报价单.pdf`);
  //     link.click();
  //     link = null;
  //     message.success('导出成功');
  //   });
  // };

  // 刷数据接口
  const initDetail = async () => {
    const { data, errCode, errMsg } = await queryAfterOrderDetail({
      afterSalesOrderNo: id,
    });
    if (errCode === 200) {
      const newObj = {
        ...data,
        receiverVo: {
          ...data.receiverVo,
          paymentMethod: data?.receiverVo?.paymentMethod?.toString(),
          provinceName: data?.receiverVo?.province,
          cityName: data?.receiverVo?.city,
          districtName: data?.receiverVo?.district,
        },
      };
      setInfo(newObj);
      setIsUpload(false);
      return Promise.resolve({
        data: data?.salesOrderLineList,
        success: true,
      });
    } else {
      setIsUpload(false);
      return message.error(errMsg);
    }
  };

  const ButArry = () => {
    // const downOrder = async () => {
    //   downLoadOrder(); // 不适用
    // };
    const cancelOrder = async () => {
      await authority({ afterSalesNo: info?.salesOrderVO?.afterSalesNo }).then(async (res: any) => {
        if (res?.errCode === 200) {
          Modal.confirm({
            title: '确认取消吗？',
            content: '',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
              const { errCode, errMsg } = await cancelAfterOrder({
                sid: info?.salesOrderVO?.sid,
              });
              if (errCode === 200) {
                message.success('取消成功');
                if (onClose) {
                  onClose();
                }
              } else {
                message.error(errMsg);
              }
            },
          });
        } else {
          message.error(res?.errMsg);
        }
      });
    };

    const confirmRepairOrder = async () => {
      await authority({ afterSalesNo: info?.salesOrderVO?.afterSalesNo }).then(async (res: any) => {
        if (res?.errCode === 200) {
          Modal.confirm({
            title: '是否确认维修？',
            content: '',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
              const { errCode, errMsg } = await confirmRepair({ sid: info?.salesOrderVO?.sid });
              if (errCode == 200) {
                message.success('确认成功');
                if (onClose) {
                  onClose();
                }
              } else {
                message.error(errMsg);
              }
            },
          });
        } else {
          message.error(res?.errMsg);
        }
      });
    };

    return (
      <Space>
        {['YORS', 'YFDS'].includes(info?.salesOrderVO?.afterSalesOrderType) && ( //收费维修发货订单、免费维修发货订单
          <Button
            size="small"
            key={'上传PO附件'}
            style={{
              zIndex: 9999999,
              top: '21px',
              right: info?.salesOrderVO?.afterSalesOrderStatus == 40 ? '490px' : '180px',
              position: 'absolute',
            }}
            onClick={() => {
              setIsUpload(true);
            }}
          >
            上传PO附件
          </Button>
        )}
        {info?.salesOrderVO?.afterSalesOrderStatus == 40 && (
          <div>
            <Button
              className="fixImportant"
              style={{
                zIndex: 9999999,
                top: '21px',
                right: '360px',
                position: 'absolute',
                lineHeight: '30px !important',
              }}
              href={`${getEnv()}/omsapi/afterSales/order/exportPDF/${
                info?.salesOrderVO?.sid
              }?token=${Cookies.get('ssoToken')}`}
              key={'pdf'}
            >
              下载维修报价单{' '}
            </Button>
            <Button
              style={{ zIndex: 9999999, top: '21px', right: '270px', position: 'absolute' }}
              className="danger light_danger"
              ghost={false}
              onClick={cancelOrder}
            >
              取消订单{' '}
            </Button>
            <Button
              style={{ zIndex: 9999999, top: '21px', right: '180px', position: 'absolute' }}
              type="primary"
              onClick={confirmRepairOrder}
            >
              确认维修{' '}
            </Button>
          </div>
        )}
        <Button
          style={{ zIndex: 9999999, top: '21px', right: '90px', position: 'absolute' }}
          type="link"
          onClick={() => setLogVisible(true)}
        >
          操作日志{' '}
        </Button>
      </Space>
    );
  };

  const loadList = async (val: any) => {
    const resourceVOList: any = [];
    val.forEach((e: any) => {
      resourceVOList.push({
        resourceName: e.resourceName,
        resourceUrl: e.resourceUrl,
        fileType: 'po附件',
      });
    });
    const params = {
      sourceId: info?.salesOrderVO?.sid,
      sourceType: 83,
      // subType: 20,
      resourceVOList,
    };
    await saveRefResource(params);
    // 刷数据
    await initDetail();
  };

  return (
    <div className="fix_lable_large" id="salesAfterOrderDrawerDetail" style={{ padding: '0' }}>
      {ButArry()}
      <Tabs defaultActiveKey="1" size="large" className="fixTab hasTitle" onChange={tabChange}>
        <TabPane tab="基本信息" key="1">
          <ProForm
            layout="horizontal"
            submitter={{
              render: false,
            }}
          >
            <Row gutter={1}>
              <Col span={2} style={{ background: '#fff' }}>
                <Anchor
                  className="anchor anchor-fixed"
                  id="saleAfterOrderDetailAnchor"
                  getContainer={() => document.querySelector('#scrollContainer')}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  {menuLink?.map((item: any) => (
                    <Link href={item.link} title={item.title} key={item.id} className="linkOrder" />
                  ))}
                </Anchor>
              </Col>
              <Col span={22} id="scrollContainer">
                <Card title="基本信息" bordered={false} id="basic">
                  {info?.salesOrderVO?.sid && (
                    <BasicInfo type="afterOrder" readonly={true} info={info?.salesOrderVO} />
                  )}
                </Card>
                <Card title="收货信息" bordered={false} id="receiver">
                  {info?.salesOrderVO?.sid && (
                    <ReceiverInfo type="afterOrder" readonly={true} info={info?.receiverVo} />
                  )}
                </Card>
                <Card title="配送及支付信息" bordered={false} id="pay">
                  {info?.salesOrderVO?.sid && (
                    <PayInfo type="afterOrder" readonly={true} info={info?.receiverVo} />
                  )}
                </Card>
                <Card title="开票信息" bordered={false} id="invoice">
                  {info?.salesOrderVO?.sid && (
                    <InvoiceInfo type="afterOrder" readonly={true} info={info?.invoiceVo} />
                  )}
                </Card>
                <Card title="发票寄送信息" bordered={false} id="invoiceDeliver">
                  {info?.salesOrderVO?.sid && (
                    <InvoiceDeliverInfo readonly={true} type="afterOrder" info={info?.invoiceVo} />
                  )}
                </Card>

                <Card title="商品明细" bordered={false} className="order-msg" id="shopDetail">
                  {info?.salesOrderVO && (
                    <TotalDesc totalDesc={info?.salesOrderVO} type="afterOrder" />
                  )}
                  <div className="cust-table">
                    <ProTable<any>
                      columns={orderAfterColumns}
                      scroll={{ x: 100, y: 300 }}
                      style={{ paddingTop: '30px' }}
                      size="small"
                      rowKey="sid"
                      bordered
                      options={false}
                      search={false}
                      pagination={{
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        // showTotal: total => `共有 ${total} 条数据`,
                        showTotal: (total, range) =>
                          `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                        onShowSizeChange: (current, pageSize) =>
                          onShowSizeChange(current, pageSize),
                        showQuickJumper: true,
                      }}
                      dateFormatter="string"
                      request={async () => {
                        const { data, errCode, errMsg } = await queryAfterOrderDetail({
                          afterSalesOrderNo: id,
                        });
                        if (errCode === 200) {
                          const newObj = {
                            ...data,
                            receiverVo: {
                              ...data.receiverVo,
                              paymentMethod: data?.receiverVo?.paymentMethod?.toString(),
                              provinceName: data?.receiverVo?.province,
                              cityName: data?.receiverVo?.city,
                              districtName: data?.receiverVo?.district,
                            },
                          };
                          setInfo(newObj);
                          return Promise.resolve({
                            data: data?.salesOrderLineList,
                            success: true,
                          });
                        } else {
                          return message.error(errMsg);
                        }
                      }}
                    />
                  </div>
                </Card>
                <Card title="附件信息" bordered={false} id="enclosure" className="cust-table">
                  <ProTable<any>
                    columns={fileColumns}
                    bordered
                    size="small"
                    rowKey="id"
                    options={false}
                    search={false}
                    dateFormatter="string"
                    dataSource={info?.resourceList}
                    tableAlertRender={false}
                    rowSelection={false}
                    pagination={{
                      position: ['bottomLeft'],
                      showQuickJumper: true,
                    }}
                  />
                </Card>
              </Col>
            </Row>
          </ProForm>
        </TabPane>
        <TabPane tab="相关流程" key="2">
          <div className="cust-table">
            {/* galen wan公用 */}
            {/*info && <RelationFlux workflowId={info?.salesOrderVO?.afterSalesNo} />*/}
            {info && <RelatedProcesses billNo={info?.salesOrderVO?.afterSalesNo} />}
          </div>
        </TabPane>
        <TabPane tab="相关发货" key="3">
          <div className="cust-table">
            <RelationDeliver info={info} type="orderSap" />
          </div>
        </TabPane>
      </Tabs>
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
          sourceId={info?.salesOrderVO?.sid}
          title="订单编号"
          sourceType={83}
          quotCode={info?.salesOrderVO?.afterSalesOrderNo}
        />
      </DrawerForm>
      <UploadForm visible={isUpload} getList={loadList} maxCount={100} />
    </div>
  );
};
export default Detail;
