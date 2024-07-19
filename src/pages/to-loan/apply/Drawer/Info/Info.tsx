/* eslint-disable @typescript-eslint/no-use-before-define */
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Tabs, Space } from 'antd';
import Option from '@/pages/SalesAfter/components/Option';
import RelatedProcesses from '@/pages/SalesOrder/components/RelatedProcesses';
import { useEffect, useRef, useState } from 'react';
import './style.less';
import { queryLoanDetails } from '@/services/loan';
import UploadForm from '@/pages/SalesOrder/components/UploadForm';
import { saveRefResource } from '@/services/SalesOrder';
import { DrawerForm } from '@ant-design/pro-form';
import Log from '@/pages/InquirySheet/Offer/components/Log';
import React from 'react';
const Info = (props: any) => {
  const { TabPane } = Tabs;
  const { id } = props;
  const ref = useRef<ActionType>();
  const ref2 = useRef<ActionType>();
  const [isUpload, setIsUpload] = useState<any>(false); //追加附件
  const [splitHide, setSplitHide] = useState<boolean>(false); //拆分发票才显示的字段
  const [applyPriceHide, setApplyPriceHide] = useState<boolean>(false); //借贷类型判断是否编辑【申请开票小计含税】
  const [tableRowData, setTableRowData]: any = useState({});
  const [receiveInfo, setReceiveInfo]: any = useState([]);
  const [fileInfo, setFileInfo]: any = useState([]);
  const [logVisible, setLogVisible] = useState<any>(false);
  // 附件
  const appendixColumn: ProColumns<any>[] = [
    // { title: '文件名称', dataIndex: 'resourceName', width: 250 },
    {
      title: '文件名称',
      dataIndex: 'resourceName',
      className: 'alignLeft',
      width: 460,
      fixed: 'left',
    },
    {
      title: '操作',
      dataIndex: 'quotCode',
      width: 85,
      // render(_, record) {
      //   return (
      //     <>
      //       <Button
      //         type="link"
      //         onClick={() =>
      //           window.open(`${record.resourceUrl}?token=${Cookies.get('ssoToken')}`)
      //         }
      //       >
      //         下载
      //       </Button>
      //       ,
      //       <Button
      //         type="link"
      //         onClick={() =>
      //           window.open(`${record.resourceUrl}?token=${Cookies.get('ssoToken')}`)
      //         }
      //       >
      //         查看
      //       </Button>
      //     </>
      //   );
      // },
      render: (_, record): any => {
        if (record.resourceUrl != '') {
          return <Option record={record} key={record.resourceUrl} />;
        }
      },
      fixed: 'right',
    },
  ];
  appendixColumn.forEach((item: any) => {
    item.ellipsis = true;
  });

  // 相关流程
  // const workColumn: ProColumns<any>[] = [
  //   {
  //     title: '序号',
  //     dataIndex: 'index',
  //     valueType: 'index',
  //     width: 50,
  //     fixed: 'left',
  //     render(text, record, index) {
  //       // return index + 1;
  //       return <span>{(currentPage1 - 1) * currentPageSize1 + index + 1}</span>;
  //     },
  //   },
  //   { title: '流程ID', dataIndex: 'workflowId', width: 120 },
  // ];
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
      sourceId: tableRowData?.sid,
      sourceType: 130,
      resourceVOList,
    };
    // const resSave = await saveRefResource(params);
    // // 刷接口
    // if (resSave.errCode === 200) {
    //   fn();
    //   setIsUpload(false);
    // }
  };
  const detailColumn: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        return index + 1;
      },
    },
    { title: 'SKU', dataIndex: 'sku', width: 120, fixed: 'left' },
    { title: '开票数量', dataIndex: 'originalQty', width: 100, fixed: 'left' },
    { title: '开票小计含税 ', dataIndex: 'originaSubtotalPrice', width: 150, fixed: 'left' },
    {
      title: '拆入发票',
      dataIndex: 'splitInvoiceName',
      width: 120,
      hideInTable: splitHide,
      className: 'red',
    },
    {
      title: '拆入数量',
      dataIndex: 'splitQty',
      width: 100,
      hideInTable: splitHide,
      className: 'red',
    },
    {
      title: '拆分开票小计含税 ',
      dataIndex: 'splitSubtotalPrice',
      width: 150,
      hideInTable: splitHide,
      className: 'blue',
    },
    {
      title: '申请开票小计含税',
      dataIndex: 'applySubtotalPrice',
      width: 150,
      hideInTable: applyPriceHide,
    },
    { title: '面价', dataIndex: 'facePrice', width: 100 },
    { title: '销售单位', dataIndex: 'salesUnit', width: 100 },
    { title: '产品名称', dataIndex: 'productName', width: 100 },
    { title: '品牌', dataIndex: 'brandName', width: 100 },
    { title: '制造商型号', dataIndex: 'mfgSku', width: 100 },
    { title: '供应商型号', dataIndex: 'supplierNo', width: 260 },
    { title: '物理单位', dataIndex: 'physicsUnit', width: 100 },
    { title: '客户物料号', dataIndex: 'customerSku', width: 100 },
    { title: '客户需求行号', dataIndex: 'customerItemNo', width: 260 },
    {
      title: '是否JV',
      width: 100,
      render(_, record) {
        return <span>{record.jvFlag ? '是' : '否'}</span>;
      },
    },
    { title: 'JV公司', dataIndex: 'jvCompanyName', width: 260 },
  ];
  detailColumn.forEach((item: any) => {
    item.ellipsis = true;
  });
  // function onShowSizeChange1(current: any, pageSize: any) {
  //   setCurrentPage1(current);
  //   setCurrentPageSize1(pageSize);
  // }
  const fn = async () => {
    // const res = await queryLoanDetails(id);
    // if (res.errCode !== 200) {
    //   //  message.error(res.errMsg)
    //   return;
    // }
    const {
      data: { applyVo, resourceList, lineList },
    } = res;
    if (applyVo?.loanApplyType == 'EO3') {
      setSplitHide(false);
    } else {
      setSplitHide(true);
    }
    if (applyVo?.loanApplyType == 'EO3' || applyVo?.loanApplyType == 'EO4') {
      setApplyPriceHide(true);
    }
    setTableRowData(applyVo);
    setReceiveInfo(lineList);
    setFileInfo(resourceList);
    await setTimeout(() => {}, 0);
    ref?.current?.reload();
    ref2?.current?.reload();
  };
  useEffect(() => {
    fn();
  }, [id]);
  return (
    <div
      id="scroll-content"
      className="form-content-search tabs-detail hasAbsTabs salesAfter-borrow-apply saleOrderDetailInfoDrawer"
    >
      <Button
        style={{ zIndex: 9999999, top: '16px', right: '190px', position: 'absolute' }}
        type="link"
        onClick={() => setLogVisible(true)}
      >
        操作日志{' '}
      </Button>
      <Button
        style={{ zIndex: 9999999, right: '100px', top: '16px', position: 'absolute' }}
        type="primary"
        onClick={() => setIsUpload(true)}
      >
        追加附件{' '}
      </Button>
      <Tabs defaultActiveKey="1">
        <TabPane tab="订单信息" key="1">
          <div className="innerDrawerTabsContent">
            <section className="drawerTabsContent">
              <Form className="has-gridForm">
                <h4 className="formTitle" id="one">
                  申请基本信息
                </h4>
                <div className="ant-advanced-form four-gridCol">
                  <Form.Item label="系统发票号">
                    <span className="form-span">{tableRowData?.systemInvoiceNo}</span>
                  </Form.Item>
                  <Form.Item label="借贷类型">
                    <span className="form-span">{tableRowData?.loanApplyTypeName}</span>
                  </Form.Item>
                  <Form.Item label="申请标题">
                    <span className="form-span">{tableRowData?.applyTitle}</span>
                  </Form.Item>
                  <Form.Item label="更换开票抬头">
                    <span className="form-span">{tableRowData?.changeHeaderName}</span>
                  </Form.Item>
                  <Form.Item label="开票主体">
                    <span className="form-span">{tableRowData?.billSubject}</span>
                  </Form.Item>

                  <Form.Item label="申请备注" className="fullLineGrid">
                    <span className="form-span wordBreak">{tableRowData?.applyRemarks}</span>
                  </Form.Item>
                </div>
                <h4 className="formTitle" id="seven">
                  申请附件
                </h4>
                <div className="detail_table_mod" style={{ marginTop: '10px', width: '70%' }}>
                  <ProTable<any>
                    columns={appendixColumn}
                    dataSource={fileInfo}
                    request={async () => {
                      return Promise.resolve({
                        data: fileInfo,
                        success: true,
                      });
                    }}
                    rowKey="sid"
                    bordered
                    search={false}
                    toolBarRender={false}
                    tableAlertRender={false}
                    actionRef={ref}
                    defaultSize="small"
                    scroll={{ x: 0 }}
                    options={{ reload: false, density: false }}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      pageSizeOptions: ['10', '20', '50', '100'],
                      // showTotal: total => `共有 ${total} 条数据`,
                      showTotal: (total, range) =>
                        `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                    }}
                  />
                </div>
                <h4 className="formTitle" id="two">
                  订单信息
                </h4>
                <div className="ant-advanced-form four-gridCol">
                  <Form.Item label="销售订单号">
                    <span className="form-span">{tableRowData?.orderNo}</span>
                  </Form.Item>
                  <Form.Item label="OBD号">
                    <span className="form-span">{tableRowData?.obdNo}</span>
                  </Form.Item>
                  <Form.Item label="客户编号">
                    <span className="form-span">{tableRowData?.customerCode}</span>
                  </Form.Item>
                  <Form.Item label="客户名称">
                    <span className="form-span">{tableRowData?.customerName}</span>
                  </Form.Item>
                  <Form.Item label="所属公司">
                    <span className="form-span">{tableRowData?.companyName}</span>
                  </Form.Item>
                  <Form.Item label="所属部门">
                    <span className="form-span">{tableRowData?.deptName}</span>
                  </Form.Item>
                  <Form.Item label="所属集团">
                    <span className="form-span">{tableRowData?.groupName}</span>
                  </Form.Item>
                  <Form.Item label="集团公司号">
                    <span className="form-span">{tableRowData?.groupCode}</span>
                  </Form.Item>
                  <Form.Item label="主销售">
                    <span className="form-span">{tableRowData?.salesName}</span>
                  </Form.Item>
                  <Form.Item label="R3联系人">
                    <span className="form-span">{tableRowData?.contactNameR3}</span>
                  </Form.Item>
                  <Form.Item label="R3联系人代号" className="minLabel">
                    <span className="form-span">{tableRowData?.contactCodeR3}</span>
                  </Form.Item>
                  <Form.Item label="原订单渠道">
                    <span className="form-span">{tableRowData?.originalChannelName}</span>
                  </Form.Item>
                  <Form.Item label="采购单位名称" className="minLabel">
                    <span className="form-span">{tableRowData?.purchaseName}</span>
                  </Form.Item>
                </div>
                <h4 className="formTitle" id="three">
                  开票信息
                </h4>
                <div className="ant-advanced-form four-gridCol">
                  <Form.Item label="发票类型">
                    <span className="form-span">{tableRowData?.vatTypeName}</span>
                  </Form.Item>
                  <Form.Item label="开票抬头">
                    <span className="form-span">{tableRowData?.vatCompanyName}</span>
                  </Form.Item>
                  <Form.Item label="注册电话">
                    <span className="form-span">{tableRowData?.vatPhone}</span>
                  </Form.Item>
                  <Form.Item label="纳税人识别号">
                    <span className="form-span">{tableRowData?.vatTaxNo}</span>
                  </Form.Item>
                  <Form.Item label="开户银行">
                    <span className="form-span">{tableRowData?.vatBankName}</span>
                  </Form.Item>
                  <Form.Item label="注册地址">
                    <span className="form-span">{tableRowData?.vatAddress}</span>
                  </Form.Item>
                  <Form.Item label="银行账户">
                    <span className="form-span">{tableRowData?.vatBankNo}</span>
                  </Form.Item>
                </div>
                <h4 className="formTitle" id="four">
                  发票寄送信息
                </h4>
                <div className="ant-advanced-form four-gridCol">
                  <Form.Item label="发票收件地址" className="twoGrid minLabel">
                    <span className="form-span">{tableRowData?.invoiceAddress}</span>
                  </Form.Item>
                  <Form.Item label="发票收件地区">
                    <span className="form-span">{tableRowData?.invoiceRegion}</span>
                  </Form.Item>
                  <Form.Item label="发票收件邮编">
                    <span className="form-span">{tableRowData?.invoiceZip}</span>
                  </Form.Item>
                  <Form.Item label="发票收件人">
                    <span className="form-span">{tableRowData?.invoiceReceiver}</span>
                  </Form.Item>
                  <Form.Item label="发票收件手机">
                    <span className="form-span">{tableRowData?.invoiceMobile}</span>
                  </Form.Item>
                  <Form.Item label="发票收件固话">
                    <span className="form-span">{tableRowData?.invoiceTel}</span>
                  </Form.Item>
                  <Form.Item label="发票收件邮箱">
                    <span className="form-span">{tableRowData?.invoiceEmail}</span>
                  </Form.Item>
                  <Form.Item label="发票随货">
                    <span className="form-span">
                      {tableRowData?.invoiceFollowGoods !== 0 ? '是' : '否'}
                    </span>
                  </Form.Item>
                </div>
                <h4 className="formTitle" id="seven">
                  发票明细
                </h4>
                <div className="detail_table_mod2" style={{ marginTop: '40px' }}>
                  <table className="amountTable" cellSpacing="0" data-content="币种：CNY">
                    <tbody>
                      <tr>
                        <th>原开票总金额含税:</th>
                        <td>{tableRowData?.totalAmount}</td>
                        <th>申请开票总金额含税:</th>
                        <td>{tableRowData?.applyTotalAmount}</td>
                        <th>申请价差:</th>
                        <td>{tableRowData?.applyMarginPrice}</td>
                      </tr>
                    </tbody>
                  </table>
                  <ProTable<any>
                    columns={detailColumn}
                    request={async () => {
                      return Promise.resolve({
                        data: receiveInfo,
                        success: true,
                      });
                    }}
                    rowKey="sampleNo"
                    bordered
                    search={false}
                    toolBarRender={false}
                    tableAlertRender={false}
                    actionRef={ref2}
                    defaultSize="small"
                    scroll={{ x: 0 }}
                    options={{ reload: false, density: false }}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      pageSizeOptions: ['10', '20', '50', '100'],
                      showTotal: (total, range) =>
                        `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                    }}
                  />
                </div>
              </Form>
            </section>
          </div>
        </TabPane>

        <TabPane tab="相关流程" key="2">
          <RelatedProcesses billNo={id} />

          {/*<ProTable<any>
            columns={workColumn}
            request={async () => {
              const res = await processes(id);
              if (res.errCode === 200) {
                res.data?.dataList?.forEach((e: { index: number }, i: number) => {
                  e.index = i;
                });
                return Promise.resolve({
                  data: res.data?.dataList,
                  total: res.data?.total,
                  success: true,
                });
              } else {
                Modal.error(res.errMsg);
                return Promise.resolve([]);
              }
            }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total, range) =>
                `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
              onShowSizeChange: (current, pageSize) => onShowSizeChange1(current, pageSize),
            }}
            rowKey="index"
            search={false}
            toolBarRender={false}
            tableAlertRender={false}
            actionRef={ref3}
            defaultSize="small"
          />
*/}
        </TabPane>
      </Tabs>
      <UploadForm visible={isUpload} getList={loadList} maxCount={100} />
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
          sourceId={tableRowData?.sid}
          title="申请编号"
          sourceType={130}
          quotCode={tableRowData?.loanApplyNo}
        />
      </DrawerForm>
    </div>
  );
};

export default Info;
