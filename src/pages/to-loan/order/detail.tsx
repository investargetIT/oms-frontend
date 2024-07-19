import ProForm, { DrawerForm } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { Anchor, Card, Col, Form, message, Row, Tabs, Button, Space, Image } from 'antd';
import { useEffect, useState } from 'react';
import { menuLink } from '../components/const';
import '../../to-loan/index.less';
import BasicInfo from '../components/BasicInfo';
import { queryLoanOrderDetails } from '@/services/loan';
import RelatedProcesses from '@/pages/SalesOrder/components/RelatedProcesses';
import Log from '@/pages/InquirySheet/Offer/components/Log';
import React from 'react';

const { TabPane } = Tabs;
const { Link } = Anchor;

interface DetailProps {
  loanOrderNo?: string;
}

const Detail: React.FC<DetailProps> = ({ loanOrderNo }) => {
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [logVisible, setLogVisible] = useState<any>(false);
  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const loanDetailColumns: ProColumns<any>[] = [
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
      title: '开票数量',
      dataIndex: 'qty',
      width: 100,
    },
    {
      title: '销售单位',
      dataIndex: 'salesUnit',
      width: 100,
    },
    {
      title: '面价',
      dataIndex: 'facePrice',
      width: 100,
    },
    {
      title: '成交价含税',
      dataIndex: 'dealTaxPrice',
      width: 100,
    },
    {
      title: '成交价未税',
      dataIndex: 'notDealTaxPrice',
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
      title: '小计折扣',
      dataIndex: 'discountSubtotalPrice',
      width: 100,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      width: 100,
    },
    {
      title: '是否Jv',
      dataIndex: 'jvFlagName',
      width: 100,
    },
    {
      title: 'JV公司',
      dataIndex: 'jvCompanyName',
      width: 100,
    },
    {
      title: '品牌',
      dataIndex: 'brandName',
      width: 100,
    },
    {
      title: '制造商型号',
      dataIndex: 'mfgSku',
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
    //后面都无
    {
      title: '交货周期(天)',
      dataIndex: 'freightPrice',
      width: 100,
    },
    {
      title: '不可退换',
      dataIndex: 'tariffPrice',
      width: 100,
    },
    {
      title: '是否直送',
      dataIndex: 'wareCode',
      width: 100,
    },
    {
      title: 'SKU类型',
      dataIndex: 'freightPrice',
      width: 100,
    },
    {
      title: '产品业务状态',
      dataIndex: 'tariffPrice',
      width: 100,
    },
    {
      title: '备货类型',
      dataIndex: 'wareCode',
      width: 100,
    },
    {
      title: '运费',
      dataIndex: 'wareCode',
      width: 100,
    },
    {
      title: '国际运费',
      dataIndex: 'freightPrice',
      width: 100,
    },
    {
      title: '关税',
      dataIndex: 'tariffPrice',
      width: 100,
    },
    {
      title: '预计发货日期',
      dataIndex: 'wareCode',
      width: 100,
    },
  ];
  loanDetailColumns.forEach((item: any) => {
    item.ellipsis = true;
  });
  const [info, setInfo] = useState<any>({});
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
                <Button size="small" key={'查看'} type="link" onClick={() => setVisible(true)}>
                  查看
                </Button>
                <Image
                  width={10}
                  style={{ display: 'none' }}
                  src={record.resourceUrl}
                  preview={{
                    visible,
                    src: record.resourceUrl,
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

  useEffect(() => {
    queryLoanOrderDetails(loanOrderNo).then((res: any) => {
      const { errCode, errMsg, data } = res;
      if (errCode === 200) {
        if (errCode === 200) {
          setInfo(data);
          form.setFieldsValue({
            ...data?.loanOrder,
          });
        }
      } else {
        message.error(errMsg);
      }
    });
  }, [loanOrderNo]);

  const tabChange = (values: any) => {
    console.log(values);
  };

  return (
    <div className="fix_lable_large" id="salesAfterOrderDrawerDetail" style={{ padding: '0' }}>
      <Button
        style={{ zIndex: 9999999, top: '20px', right: '90px', position: 'absolute' }}
        type="link"
        onClick={() => setLogVisible(true)}
      >
        操作日志{' '}
      </Button>
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
                  <BasicInfo type="basic" readonly={true} info={info?.loanOrder} />
                </Card>
                <Card title="开票信息" bordered={false} id="invoice">
                  {/* <InvoiceInfo type="scrapDetail" readonly={true} info={info?.loanOrder} /> */}
                  <div className="ant-advanced-form four-gridCol">
                    <Form.Item label="发票类型">
                      <span className="form-span">{info?.loanOrder?.vatTypeName}</span>
                    </Form.Item>
                    <Form.Item label="开票抬头">
                      <span className="form-span">{info?.loanOrder?.vatCompanyName}</span>
                    </Form.Item>
                    <Form.Item label="注册电话">
                      <span className="form-span">{info?.loanOrder?.vatPhone}</span>
                    </Form.Item>
                    <Form.Item label="纳税人识别号">
                      <span className="form-span">{info?.loanOrder?.vatTaxNo}</span>
                    </Form.Item>
                    <Form.Item label="开户银行">
                      <span className="form-span">{info?.loanOrder?.vatBankName}</span>
                    </Form.Item>
                    <Form.Item label="注册地址">
                      <span className="form-span">{info?.loanOrder?.vatAddress}</span>
                    </Form.Item>
                    <Form.Item label="银行账户">
                      <span className="form-span">{info?.loanOrder?.vatBankNo}</span>
                    </Form.Item>
                  </div>
                </Card>
                <Card title="发票寄送信息" bordered={false} id="invoiceDeliver">
                  {/* <InvoiceDeliverInfo readonly={true} type="scrapDetail" info={info?.loanOrder} /> */}
                  <div className="ant-advanced-form four-gridCol">
                    <Form.Item label="发票收件地址" className="twoGrid minLabel">
                      <span className="form-span">{info?.loanOrder?.invoiceAddress}</span>
                    </Form.Item>
                    <Form.Item label="发票收件地区">
                      <span className="form-span">{info?.loanOrder?.invoiceRegion}</span>
                    </Form.Item>
                    <Form.Item label="发票收件邮编">
                      <span className="form-span">{info?.loanOrder?.invoiceZip}</span>
                    </Form.Item>
                    <Form.Item label="发票收件人">
                      <span className="form-span">{info?.loanOrder?.invoiceReceiver}</span>
                    </Form.Item>
                    <Form.Item label="发票收件手机">
                      <span className="form-span">{info?.loanOrder?.invoiceMobile}</span>
                    </Form.Item>
                    <Form.Item label="发票收件固话">
                      <span className="form-span">{info?.loanOrder?.invoiceTel}</span>
                    </Form.Item>
                    <Form.Item label="发票收件邮箱">
                      <span className="form-span">{info?.loanOrder?.invoiceEmail}</span>
                    </Form.Item>
                    <Form.Item label="发票随货">
                      <span className="form-span">
                        {info?.loanOrder?.invoiceFollowGoods !== 0 ? '是' : '否'}
                      </span>
                    </Form.Item>
                  </div>
                </Card>
                <Card title="商品明细" bordered={false} className="order-msg" id="shopDetail">
                  {/* {info?.scrapOrderResVO && <TotalDesc totalDesc={info?.scrapOrderResVO} />} */}

                  <div className="cust-table">
                    <ProTable<any>
                      columns={loanDetailColumns}
                      scroll={{ x: 100, y: 300 }}
                      style={{ paddingTop: '30px' }}
                      size="small"
                      rowKey="sid"
                      bordered
                      options={false}
                      search={false}
                      pagination={{
                        pageSize: 20,
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
                      dataSource={info?.loanOrderLineVos}
                    />
                  </div>
                </Card>
                <Card title="附件" bordered={false} id="enclosure" className="cust-table">
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
                </Card>
              </Col>
            </Row>
          </ProForm>
        </TabPane>
        <TabPane tab="相关流程" key="2">
          <Card title="" className="cust-table">
            {/* galen wan公用 */}
            {/*<RelationFlux workflowId={info?.scrapOrderResVO?.scrapApplyNo} />*/}
            <RelatedProcesses billNo={info?.loanOrder?.loanApplyNo} />
          </Card>
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
          sourceId={info?.loanOrder?.sid}
          title="订单编号"
          sourceType={135}
          quotCode={info?.loanOrder?.loanOrderNo}
        />
      </DrawerForm>
    </div>
  );
};
export default Detail;
