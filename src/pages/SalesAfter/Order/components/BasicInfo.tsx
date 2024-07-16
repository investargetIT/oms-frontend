// import { getConList } from '@/services/InquirySheet/offerOrder';
import { ProFormDateTimePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Button, Col, Drawer, Row, Space, Tag } from 'antd';
import React, { useState } from 'react';
import '../../index.less';
import Handle from '../../Apply/Handle';
interface BasicInfoProps {
  id?: string;
  type?: string;
  readonly?: boolean;
  info?: Record<any, any>;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ readonly, info = {} as any }) => {
  const {
    companyName = '',
    afterSalesNo = '',
    createName = '',
    afterSalesTypeName = '',
    customerName = '',
    buyer = '',
    customerCode = '',
    contactNameR3 = '',
    contactCodeR3 = '',
    salesName = '',
    purchaseName = '',
    tariffPrice = '',
    applyChannelTypeName = '',
    buyerTel = '',
    totalFreightPrice = '',
    intlFreightPrice = '',
    taxTotalPrice = '',
    // orderNo = '',
    goodsTaxPrice = '',
    // reqDelivDate = '',
    // afterSalesStatusName = ''
    customerPurchaseNo = '',
    createTime = '',
  } = info;
  const [drawerVisible, setDrawerVisible] = useState<any>(false);

  // const getr3List = async () => {
  //   const { data } = await getConList({ customerCode: 1212, contactName: info.customerName });
  //   console.log(data);
  // };

  // useEffect(() => {
  //   getr3List();
  // }, []);

  return (
    <>
      <Row gutter={24}>
        <Col lg={12} md={12} sm={24}>
          {/* 只读的 */}
          <ProFormSelect
            showSearch
            label={'售后类型'}
            name="afterSalesTypeName"
            initialValue={afterSalesTypeName}
            readonly={readonly}
            options={[]}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'客户代号'}
            name="customerCode"
            initialValue={customerCode}
            rules={[{ required: true, message: '' }]}
            placeholder="请输入"
            readonly={readonly}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'客户名称'}
            name="customerName"
            initialValue={customerName}
            rules={[{ required: true, message: '' }]}
            placeholder="请输入"
            readonly={readonly}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            label={'R3联系人'}
            name="contactNameR3"
            initialValue={contactNameR3}
            readonly={readonly}
            options={[]}
            placeholder="请选择"
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'R3联系人代号'}
            initialValue={contactCodeR3}
            name="contactCodeR3"
            readonly={readonly}
            disabled
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label={'所属公司'}
            initialValue={companyName}
            name="companyName"
            readonly={readonly}
            options={[]}
            placeholder="请选择"
          />
        </Col>
        <Col
          lg={6}
          md={12}
          sm={24}
          className="pft-cust-col"
          onClick={() => {
            setDrawerVisible(true);
            // history.push(`/sales-after/order/apply/add`);
          }}
        >
          <ProFormText
            label={'售后申请'}
            initialValue={afterSalesNo}
            name="afterSalesNo"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormDateTimePicker
            initialValue={createTime}
            label={'订单创建时间'}
            name="createTime"
            readonly={readonly}
            fieldProps={{
              style: {
                width: '100%',
              },
            }}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label={'主销售'}
            name="salesName"
            initialValue={salesName}
            readonly={readonly}
            options={[]}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label={'创建人'}
            name="createName"
            initialValue={createName}
            readonly={readonly}
            options={[]}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label={'渠道'}
            name="applyChannelTypeName"
            initialValue={applyChannelTypeName}
            readonly={readonly}
            options={[]}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'采购单位名称'}
            name="purchaseName"
            initialValue={purchaseName}
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'下单人姓名'}
            name="buyer"
            initialValue={buyer}
            readonly={readonly}
            disabled
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'下单人电话'}
            initialValue={buyerTel}
            name="buyerTel"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'运费合计'}
            initialValue={totalFreightPrice}
            name="totalFreightPrice"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'国际运费'}
            initialValue={intlFreightPrice}
            name="intlFreightPrice"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'关税'}
            initialValue={tariffPrice}
            name="tariffPrice"
            readonly={readonly}
            disabled
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'含税总金额'}
            initialValue={taxTotalPrice}
            name="taxTotalPrice"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'货品总计含税'}
            initialValue={goodsTaxPrice}
            name="goodsTaxPrice"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'客户采购单号'}
            initialValue={customerPurchaseNo}
            name="customerPurchaseNo"
            readonly={readonly}
            disabled
          />
        </Col>
      </Row>

      {/* 详情------- */}
      <Drawer
        className="DrawerForm"
        width={window.innerWidth}
        key={'detail'}
        title={[
          <span key={'售后申请编号'}>售后申请编号:{afterSalesNo}</span>,
          <Tag key={'售后状态'} color="gold" style={{ marginLeft: 10 }}>
            已完成 {/* 能到订单的是已完成{afterSalesStatusName} */}
          </Tag>,
          //   // <p
          //   //   key={'订单类型'}
          //   //   className="tipsP"
          //   //   style={{ marginBottom: '-10px', marginTop: 5, color: '#777' }}
          //   //   ref={(node) => {
          //   //     if (node) {
          //   //       node.style.setProperty('font-size', '12px', 'important');
          //   //     }
          //   //   }}
          //   // >
          //   //   订单类型:
          //   //   <strong>12121</strong>
          //   // </p>,
        ]}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        extra={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>关闭</Button>
          </Space>
        }
        // footer={[
        //   定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
        //   <Button key="back" onClick={() => setDrawerVisible(false)}>
        //     关闭
        //   </Button>,
        // ]}
      >
        <Handle id={afterSalesNo} from="detail" onClose={() => setDrawerVisible(false)} />
      </Drawer>
    </>
  );
};

export default BasicInfo;
