import React, { useState } from 'react';
import { Form, Tabs, Input, Button, message } from 'antd';
import { ExclamationCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import './style.css';
import moment from 'moment';
import region1 from './GetRegions.json';
interface closeModal {
  approveModalHandleOk: any;
}
const MasterDataDetail: React.FC<{ id: string; tableRowData: object }, closeModal> = (props) => {
  const { TabPane } = Tabs;
  const { id, tableRowData } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    setConfirmLoading(true);
    const formData = JSON.parse(JSON.stringify(values));
    formData.id = id;
    console.log('Success:', formData);
    setTimeout(() => {
      props.approveModalHandleOk();
      setConfirmLoading(false);
      message.success('保存成功', 3);
      form.resetFields();
    }, 2000);
  };
  const onSubmit = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      props.approveModalHandleOk();
      setConfirmLoading(false);
      message.success('该订单审核通过成功', 3);
    }, 100);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const onReset = () => {
    form.resetFields();
    props.approveModalHandleOk();
  };
  const downloadVatClick = () => {
    setTimeout(() => {
      message.warning('此订单无VAT附件', 3);
    }, 100);
  };
  const dateFormat = 'YYYY-MM-DD';

  function callback(key) {
    console.log(key);
    // console.log(tableRowData);
  }

  function getRegions1(region_code) {
    for (let i = 0; i < region1.data.length; i++)
      if (region1.data[i].RegionCode == region_code) return region1.data[i].RegionName;
  }

  const data = tableRowData;
  data.CreatedTime = moment(tableRowData.CreatedTime).format(dateFormat);
  if (!tableRowData.AdjustFreight) {
    data.AdjustFreight = '否';
  } else {
    data.AdjustFreight = '是';
  }
  data.AmountNet = (tableRowData.Amount / 1.13).toFixed(2);
  data.ShipRegionCode1 = getRegions1(tableRowData.ShipRegionCode1);
  if (tableRowData.ShipType == 10) {
    data.ShipType = '送货上门';
  } else if (tableRowData.ShipType == 20) {
    data.ShipType = '自提';
  } else if (tableRowData.ShipType == 30) {
    data.ShipType = '昆山门店自提';
  }
  if (tableRowData.PaymentTerm == '01') {
    data.PaymentTerm = '在线支付';
  } else if (tableRowData.PaymentTerm == '02') {
    data.PaymentTerm = '快钱';
  } else if (tableRowData.PaymentTerm == '03') {
    data.PaymentTerm = '货到付款';
  } else if (tableRowData.PaymentTerm == '04') {
    data.PaymentTerm = '信用支付';
  } else if (tableRowData.PaymentTerm == '05') {
    data.PaymentTerm = '支付宝';
  } else if (tableRowData.PaymentTerm == '06') {
    data.PaymentTerm = '预付款';
  }
  if (!tableRowData.CompleteDeliv) {
    data.CompleteDeliv = '否';
  } else {
    data.CompleteDeliv = '是';
  }
  if (tableRowData.InvoiceType == '01') {
    data.InvoiceType = '增值税专用发票';
  } else if (tableRowData.InvoiceType == '02') {
    data.InvoiceType = '普票';
  } else if (tableRowData.InvoiceType == '04') {
    data.InvoiceType = '不开票';
  }
  if (tableRowData.InvoiceWithGoods) {
    data.InvoiceWithGoods = '否';
  } else {
    data.InvoiceWithGoods = '是';
  }

  if (tableRowData.OrderTag == '1') {
    data.OrderTag = '发货地址被修改';
  } else if (tableRowData.OrderTag == '2') {
    data.OrderTag = '发票寄送地址被修改';
  } else if (tableRowData.OrderTag == '4') {
    data.OrderTag = '联系人需要授权';
  } else if (tableRowData.OrderTag == '8') {
    data.OrderTag = '开票数据被修改';
  } else if (tableRowData.OrderTag == '12') {
    data.OrderTag = '1.联系人需要授权！2.开票数据被修改!';
  } else if (tableRowData.OrderTag == '16') {
    data.OrderTag = '客户已冻结,需要解冻！';
  } else if (tableRowData.OrderTag == '32') {
    data.OrderTag = '联系人R3号为空,需要维护';
  }

  return (
    <div className="form-content-search tabs-detail">
      {data.OrderTag == null || (
        <div className="tipsCol">
          <div className="ant-alert ant-alert-warning ant-alert-with-description">
            <span className="anticon anticon-exclamation-circle ant-alert-icon">
              <ExclamationCircleOutlined />
            </span>
            <div className="ant-alert-content">
              <div className="ant-alert-message">请注意,以下信息需要审核:</div>
              <div className="ant-alert-description">{data.OrderTag}</div>
            </div>
          </div>
        </div>
      )}
      <Form
        name="form"
        className="has-gridForm"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        initialValues={{
          // OrderTime: [moment().subtract(1, 'month'), moment()],
          // id: id,
          // CustomerCode: data.CustomerCode,
          // CustomerName: data.CustomerName,
          ContactCodeR3: data.ContactCodeR3,
          ContactName: data.ContactName,
          BranchCompanyName: data.BranchCompanyName,
          CsrRemark: data.CsrRemark,
          ShipStreet: data.ShipStreet,
          VatCompanyName: data.VatCompanyName,
          VatTaxNo: data.VatTaxNo,
          VatAddress: data.VatAddress,
          VatTel: data.VatTel,
          VatTelExt: data.VatTelExt,
          VatBankName: data.VatBankName,
          VatBankAccount: data.VatBankAccount,
          InvoiceAddress: data.InvoiceAddress,
        }}
      >
        <Tabs onChange={callback} type="card">
          <TabPane tab="基本信息" key="1">
            <div className="ant-advanced-form three-gridCol">
              <Form.Item label="订单编号">
                <span className="form-span">{id}</span>
              </Form.Item>
              <Form.Item label="客户代号" name="CustomerCode">
                <span className="form-span">{data.CustomerCode}</span>
              </Form.Item>

              <Form.Item label="客户名称">
                <span className="form-span">{data.CustomerName}</span>
              </Form.Item>

              <Form.Item label="R3联系人代号">
                <span className="form-span">{data.ContactCodeR3}</span>
              </Form.Item>
              <Form.Item label="联系人名称">
                <span className="form-span">{data.ContactName}</span>
              </Form.Item>
              <Form.Item label="所属公司">
                <span className="form-span">{data.BranchCompanyName}</span>
              </Form.Item>
              <Form.Item label="商机名称">
                <span className="form-span">{data.OppoValue}</span>
              </Form.Item>

              <Form.Item label="订单创建时间" name="CreatedTime">
                <span className="form-span">{data.CreatedTime}</span>
              </Form.Item>

              <Form.Item label="创建人">
                <span className="form-span">{data.CreatedUser}</span>
              </Form.Item>
              <Form.Item label="订单渠道">
                <span className="form-span">
                  {data.ChannelModel && data.ChannelModel.ChannelName}
                </span>
              </Form.Item>

              <Form.Item label="运费">
                <span className="form-span">&yen; {Number(data.Freight).toFixed(2)}</span>
              </Form.Item>

              <Form.Item label="国际运费">
                <span className="form-span">&yen; {Number(data.InterFreight).toFixed(2)}</span>
              </Form.Item>

              <Form.Item label="关税">
                <span className="form-span">&yen; {Number(data.Tariff).toFixed(2)}</span>
              </Form.Item>

              <Form.Item label="含税总金额">
                <span className="form-span">&yen; {Number(data.Amount).toFixed(2)}</span>
              </Form.Item>

              <Form.Item label="货品总计">
                <span className="form-span">&yen; {Number(data.GoodsAmount).toFixed(2)}</span>
              </Form.Item>

              <Form.Item label="折扣总计">
                <span className="form-span">&yen; {Number(data.TotalDiscount).toFixed(2)}</span>
              </Form.Item>

              <Form.Item label="是否调整运费">
                <span className="form-span">{data.AdjustFreight}</span>
              </Form.Item>

              <Form.Item label="销售人员">
                <span className="form-span">{data.SalesName}</span>
              </Form.Item>
              <Form.Item label="客户采购单号">
                <span className="form-span">{data.PoNo}</span>
              </Form.Item>

              <Form.Item label="网促销活动代号" className="minLabel">
                <span className="form-span">{data.CampaignCode}</span>
              </Form.Item>

              <Form.Item label="网促优惠券代号" className="minLabel">
                <span className="form-span">{data.CouponCode}</span>
              </Form.Item>

              <Form.Item label="用户备注" className="fullLineGrid">
                <span className="form-span">{data.UserRemark}</span>
              </Form.Item>

              <Form.Item label="采购单位名称">
                <span className="form-span">{data.PurchaseName}</span>
              </Form.Item>

              <Form.Item label="下单人姓名">
                <span className="form-span">{data.PurchaseAccount}</span>
              </Form.Item>

              <Form.Item label="下单人联系电话" className="minLabel">
                <span className="form-span">{data.PurchaseMobile}</span>
              </Form.Item>

              <Form.Item label="CSR备注" className="fullLineGrid" name="CsrRemark">
                <Input placeholder="请输入CSR备注" allowClear />
              </Form.Item>
            </div>
          </TabPane>
          <TabPane tab="收货信息" key="3">
            <div className="ant-advanced-form three-gridCol">
              <Form.Item label="姓名">
                <span className="form-span">{data.ConsigneeName}</span>
              </Form.Item>

              <Form.Item label="手机">
                <span className="form-span">{data.ConsigneeMobile}</span>
              </Form.Item>
              <Form.Item label="固话">
                <span className="form-span">{data.ConsigneeTel}</span>
              </Form.Item>

              <Form.Item label="固话分机">
                <span className="form-span">{data.ConsigneeTelExt}</span>
              </Form.Item>
              <Form.Item label="邮编">
                <span className="form-span">{data.ShipZip}</span>
              </Form.Item>

              <Form.Item label="发货地址" className="fullLineGrid" name="ShipStreet">
                <Input placeholder="请输入发货地址" allowClear />
              </Form.Item>
            </div>
          </TabPane>
          <TabPane tab="配送和支付方式" key="4">
            <div className="ant-advanced-form three-gridCol">
              <Form.Item label="发货一级区域">
                <span className="form-span">{data.ShipRegionCode1}</span>
              </Form.Item>

              <Form.Item label="发货二级区域">
                <span className="form-span">{data.ShipRegionCode2}</span>
              </Form.Item>
              <Form.Item label="发货三级区域">
                <span className="form-span">{data.ShipRegionCode3}</span>
              </Form.Item>

              <Form.Item label="发货区域">
                <span className="form-span">{data.ShipRegionName}</span>
              </Form.Item>

              <Form.Item label="交货方式">
                <span className="form-span">{data.ShipType}</span>
              </Form.Item>
              <Form.Item label="支付条件">
                <span className="form-span">{data.PaymentTerm}</span>
              </Form.Item>

              <Form.Item label="是否一次性发货" className="minLabel">
                <span className="form-span">{data.CompleteDeliv}</span>
              </Form.Item>
            </div>
          </TabPane>
          <TabPane tab="开票信息" key="5">
            <div className="ant-advanced-form two-gridCol largeLabel">
              <Form.Item label="开票类型">
                <span className="form-span">{data.InvoiceType}</span>
              </Form.Item>
              <Form.Item label="VAT发票-单位名称" className="minLabel" name="VatCompanyName">
                <Input placeholder="请输入VAT发票-单位名称" allowClear />
              </Form.Item>

              <Form.Item label="VAT发票-纳税人识别号" className="minLabel" name="VatTaxNo">
                <Input placeholder="请输入VAT发票-纳税人识别号" allowClear />
              </Form.Item>

              <Form.Item label="VAT发票-注册地址" className="minLabel" name="VatAddress">
                <Input placeholder="请输入VAT发票-注册地址" allowClear />
              </Form.Item>

              <Form.Item label="VAT发票-注册电话" className="minLabel" name="VatTel">
                <Input placeholder="请输入VAT发票-注册电话" allowClear />
              </Form.Item>

              <Form.Item label="VAT发票-注册电话分机" className="minLabel" name="VatTelExt">
                <Input placeholder="请输入VAT发票-注册电话分机" allowClear />
              </Form.Item>

              <Form.Item label="VAT发票-开户银行" className="minLabel" name="VatBankName">
                <Input placeholder="请输入VAT发票-开户银行" allowClear />
              </Form.Item>

              <Form.Item label="VAT发票-银行账户" className="minLabel" name="VatBankAccount">
                <Input placeholder="请输入VAT发票-银行账户" allowClear />
              </Form.Item>
              <Form.Item label="发票收件人">
                <span className="form-span">{data.InvoiceReceiver}</span>
              </Form.Item>
              <Form.Item label="发票寄送地址" name="InvoiceAddress">
                <Input placeholder="请输入发票寄送地址" allowClear />
              </Form.Item>

              <Form.Item label="发票-收件邮编">
                <span className="form-span">{data.InvoiceZip}</span>
              </Form.Item>
              <Form.Item label="发票-收件Email">
                <span className="form-span">{data.InvoiceEmail}</span>
              </Form.Item>

              <Form.Item label="发票-收件人固话">
                <span className="form-span">{data.InvoiceTel}</span>
              </Form.Item>

              <Form.Item label="发票-收件人手机">
                <span className="form-span">{data.InvoiceMobile}</span>
              </Form.Item>

              <Form.Item label="发票是否随货">
                <span className="form-span">{data.InvoiceWithGoods}</span>
              </Form.Item>

              <Form.Item label="VAT附件">
                <Button type="primary" icon={<DownloadOutlined />} onClick={downloadVatClick}>
                  下载VAT附件
                </Button>
              </Form.Item>
            </div>
          </TabPane>
        </Tabs>
        <div className="ant-modal-footer">
          <Button htmlType="button" onClick={onReset}>
            关 闭
          </Button>
          <Button type="primary" htmlType="submit" loading={confirmLoading}>
            保 存
          </Button>
          <Button type="primary" htmlType="button" loading={confirmLoading} onClick={onSubmit}>
            审核通过
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default MasterDataDetail;
