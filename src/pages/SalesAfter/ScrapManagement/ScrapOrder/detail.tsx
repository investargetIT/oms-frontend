import ProForm from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { Anchor, Card, Col, Form, message, Row, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import InvoiceDeliverInfo from '../../../InquirySheet/Offer/components/InvoiceDeliverInfo';
import InvoiceInfo from '../../../InquirySheet/Offer/components/InvoiceInfo';
import PayInfo from '../../../InquirySheet/Offer/components/PayInfo';
import ReceiverInfo from '../../../InquirySheet/Offer/components/ReceiverInfo';
import { menuLink } from '@/pages/SalesAfter/components/const';
import '../../index.less';
import RelationDeliver from '../../Order/components/RelationDeliver';
import BasicInfo from '../components/BasicInfo';
import { queryDetail } from '@/services/afterSales';
// import RelationFlux from '../../Order/components/RelationFlux';
import RelatedProcesses from '@/pages/SalesOrder/components/RelatedProcesses';
import TotalDesc from '@/pages/SalesAfter/ScrapManagement/components/TotalDesc';

const { TabPane } = Tabs;
const { Link } = Anchor;

interface DetailProps {
  id?: string;
}

const Detail: React.FC<DetailProps> = ({ id }) => {
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const scrapDetailColumns: ProColumns<any>[] = [
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
    { title: '物料码', dataIndex: 'stockSkuCode', width: 100 },
    { title: '销售包装单位数量', dataIndex: 'unitQuantity', width: 150 },
    {
      title: '报废数量',
      dataIndex: 'qty',
      width: 100,
    },
    {
      title: '销售单位',
      dataIndex: 'unit',
      width: 100,
    },
    {
      title: '面价',
      dataIndex: 'facePrice',
      width: 100,
    },
    {
      title: '成交价含税',
      dataIndex: 'taxPrice',
      width: 100,
    },
    {
      title: '成交价未税',
      dataIndex: 'noTaxPrice',
      width: 100,
    },
    {
      title: '小计含税',
      dataIndex: 'taxSubtotalPrice',
      width: 100,
    },
    {
      title: '小计未税',
      dataIndex: 'noTaxSubtotalPrice',
      width: 100,
    },
    {
      title: '运费',
      dataIndex: 'freightPrice',
      width: 100,
    },
    {
      title: '国际运费',
      dataIndex: 'intlFreightPrice',
      width: 100,
    },
    {
      title: '关税',
      dataIndex: 'tariffPrice',
      width: 100,
    },
    {
      title: '仓库',
      dataIndex: 'wareCode',
      width: 100,
    },
  ];
  scrapDetailColumns.forEach((item: any) => {
    item.ellipsis = true;
  });
  // const fileColumns: ProColumns<any>[] = [
  //   { title: '文件名称', dataIndex: 'resourceName' },
  //   { title: '文件类型', dataIndex: 'resourceTyple', width: 150 },
  //   { title: '创建者', dataIndex: 'createName', width: 150 },
  //   { title: '创建时间', dataIndex: 'createTime', width: 150, valueType: 'date' },
  //   {
  //     title: '操作',
  //     dataIndex: 'option',
  //     width: 150,
  //     render: (_, record: any) => (
  //       <Button
  //         size="small"
  //         type="link"
  //         key={'下载'}
  //         onClick={() => {
  //           console.log(record);
  //         }}
  //       >
  //         下载
  //       </Button>
  //     ),
  //   },
  // ];
  const [info, setInfo] = useState<any>({});

  useEffect(() => {
    queryDetail({ sid: id }).then((res: any) => {
      const { errCode, errMsg, data } = res;
      if (errCode === 200) {
        if (errCode === 200) {
          const newData = {
            ...res.data,
            scrapOrderResVO: {
              ...data?.scrapOrderResVO,
              contactName: {
                label: data?.scrapOrderResVO?.contactNameR3,
                value: data?.scrapOrderResVO?.contactCodeR3,
              },
              afterSales: {
                value: data?.scrapOrderResVO?.supplierName,
              },
            },
            receiverInfo: {
              ...data?.receiverInfo,
            },
            invoiceInfo: {
              ...data?.invoiceInfo,
            },
          };
          setInfo(newData);
          form.setFieldsValue({
            ...data?.scrapOrderResVO,
            contactName: {
              label: data?.scrapOrderResVO?.contactNameR3,
              value: data?.scrapOrderResVO?.contactCodeR3,
            },
            afterSales: {
              label: data?.scrapOrderResVO?.supplierCode,
              value: data?.scrapOrderResVO?.supplierName,
            },
            ...data?.receiverInfo,
            region: `${data?.receiverInfo?.province}${data?.receiverInfo?.city}${data?.receiverInfo?.district}`,
            consigneeEmail: data?.receiverInfo?.receiverEmail,
            paymentTerm: data?.receiverInfo?.paymentTerms,
            ...data?.invoiceInfo,
            vatPhone: data?.invoiceInfo?.vatPhone,
            invoiceReceiveRegion: data?.invoiceInfo?.invoiceRegion,
          });
        }
      } else {
        message.error(errMsg);
      }
    });
  }, [id]);

  const tabChange = (values: any) => {
    console.log(values);
  };

  return (
    <div className="fix_lable_large" id="salesAfterOrderDrawerDetail" style={{ padding: '0' }}>
      {/* <Card className="head-title-wrap">
        <Row gutter={24}>
          <Col span={6} className="title">
            订单编号：{info?.scrapOrderResVO?.scrapOrderNo}
          </Col>
          <Col span={16}>
            <Tag color="gold">{info?.scrapOrderResVO?.scrapOrderStatusDesc}</Tag>
          </Col>
        </Row>
        <Row gutter={[0, 24]} style={{ paddingTop: '10px' }}>
          <Col span={3}>
            <span className="label">订单类型：</span>
            <span className="val">{info?.scrapOrderResVO?.channelTypeDesc}</span>
          </Col>
        </Row>
      </Card> */}
      <Tabs defaultActiveKey="1" size="large" onChange={tabChange} className="fixTab hasTitle">
        <TabPane tab="基本信息" key="1">
          <ProForm
            layout="horizontal"
            className="fix_lable_large"
            form={form}
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
                  <BasicInfo type="scrapDetail" readonly={true} info={info?.scrapOrderResVO} />
                </Card>
                <Card title="收货信息" bordered={false} id="receiver">
                  <ReceiverInfo type="scrapDetail" readonly={true} info={info?.receiverInfo} />
                </Card>
                <Card title="配送及支付信息" bordered={false} id="pay">
                  <PayInfo type="scrapDetail" readonly={true} info={info?.receiverInfo} />
                </Card>
                <Card title="开票信息" bordered={false} id="invoice">
                  <InvoiceInfo type="scrapDetail" readonly={true} info={info?.invoiceInfo} />
                </Card>
                <Card title="发票寄送信息" bordered={false} id="invoiceDeliver">
                  <InvoiceDeliverInfo readonly={true} type="scrapDetail" info={info?.invoiceInfo} />
                </Card>
                <Card title="商品明细" bordered={false} className="order-msg" id="shopDetail">
                  {info?.scrapOrderResVO && <TotalDesc totalDesc={info?.scrapOrderResVO} />}

                  <div className="cust-table">
                    <ProTable<any>
                      columns={scrapDetailColumns}
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
                      dataSource={info?.lineList}
                    />
                  </div>
                </Card>
                {/* <Card title="附件" bordered={false} id="enclosure" className="cust-table">
                  <ProTable<any>
                    columns={fileColumns}
                    bordered
                    size="small"
                    rowKey="id"
                    options={false}
                    search={false}
                    dateFormatter="string"
                    request={() => {
                      return Promise.resolve({
                        data: [],
                        success: true,
                      });
                    }}
                    tableAlertRender={false}
                    rowSelection={false}
                    pagination={{
                      position: ['bottomLeft'],
                      pageSize: 5,
                      showQuickJumper: true,
                    }}
                  />
                </Card> */}
              </Col>
            </Row>
          </ProForm>
        </TabPane>
        <TabPane tab="相关流程11" key="2">
          <Card title="" className="cust-table">
            {/* galen wan公用 */}
            {/*<RelationFlux workflowId={info?.scrapOrderResVO?.scrapApplyNo} />*/}
            <RelatedProcesses billNo={info?.scrapOrderResVO?.scrapApplyNo} />
          </Card>
        </TabPane>
        <TabPane tab="相关发货" key="3">
          <Card title="" className="cust-table">
            <RelationDeliver info={info} type="orderSap" />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};
export default Detail;
