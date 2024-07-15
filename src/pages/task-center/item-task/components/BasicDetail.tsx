import {
    ProFormDateTimePicker,
    ProFormRadio,
    ProFormSelect,
    ProFormText,
  } from '@ant-design/pro-form';
  import { Col, Row, Tooltip } from 'antd';
  import React from 'react';
  import '../../index.less';
  import { QuestionCircleOutlined } from '@ant-design/icons';
  
  interface BasicDetailProps {
    readonly?: boolean;
    info?: Record<any, any>;
  }
  
  const BasicDetail: React.FC<BasicDetailProps> = ({ readonly, info = {} as any }) => {
    const {
      missionTaskTypeName = '',
      createTime = '',
      closeTime = '',
      oneDelivery = '',
      updateTime = '',
      customerCode = '',
      customerName = '',
      groupName = '',
      customerType = '',
      // k5Code = '',
      orderNo = '',
      salesCreateTime = '',
      itemNo = '',
      orderType = '',
      delBlockFlag = '',
      orderTypeDesc = '',
      bizStatus = '',
      sku = '',
      poDesc = '',
      productType = '',
      stockType = '',
      brandName = '',
      mfgSku = '',
      orderQty = '',
      openQty = '',
      openAmount = '',
      sapConfirmQty = '',
      confirmAmount = '',
      shortageQty = '',
      bizStatusDesc = '',
      promiseDate = '',
      requestDate = '',
      sourcingNo = '',
      sourcingStatus = '',
      reqArriveDate = '',
      poQty = '',
      poRecQty = '',
      poArriveDate = '',
      delivDeadline = '',
      itemDesc = '',
      alternativedSKU = '',
      replacedSKU = '',
      siteName = '',
      siteSales = '',
      siteSupervisor = '',
      siteManager = '',
      siteBdSales = '',
      siteBdSupervisor = '',
      siteBdManager = '',
      shortageAmount = '',
      customerRegion = '',
      customerChannel = '',
      omsChannelName = '',
      deliveryTerritory = '',
      deliveryRegion = '',
      siteBG = '',
      deliveryAddr = '',
      shippingPoint = '',
      storageLocation = '',
      paymentTerm = '',
      purchGroup = '',
      purchGroupName = '',
      supplierCode = '',
      supplierName = '',
      supplierSku = '',
      productLine = '',
      segment = '',
      family = '',
      abcFlag = '',
      pmName = '',
      pmsName = '',
      poDateChanges = '',
      poPastPromise = '',
      packRemark = '',
      stockContented = '',
      backOrder = '',
      reqBackOrder = '',
      itemGroup = '',
      itemCate = '',
      mm02lt = '',
      me12lt = '',
      outOfStock = '',
      supplierType = '',
      supplierOwner = '',
      arAmount = '',
      whStock = '',
      shStock = '',
      whInTransit = '',
      sendWarehouse = '',
      soNotClearAscription = '',
      soNotClearType = '',
      soNotClearReason = '',
      sapPoNo = '',
      estimateArrivalDate = '',
      poAscriptionReason = '',
      dutyDept = '',
      leaderCmtDate = '',
      leaderComment = '',
    } = info;
  
    const PastPromiseLable: any = (
      <Tooltip title="最后一次变更是否超过承诺交货期">
        <span>
          超承诺交货
          <QuestionCircleOutlined style={{ color: '#1890ff', marginLeft: ' 5px' }} />
        </span>
      </Tooltip>
    );
  
    return (
      <>
        {/* 基本信息1 */}
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              showSearch
              label="项目任务类型"
              initialValue={missionTaskTypeName}
              name="missionTaskTypeName"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormDateTimePicker
              initialValue={createTime}
              label="创建时间"
              name="createTime"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormDateTimePicker
              initialValue={closeTime}
              label="关闭时间"
              name="closeTime"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormDateTimePicker
              initialValue={updateTime}
              label="最新修改时间"
              name="updateTime"
              readonly={readonly}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="客户号"
              initialValue={customerCode}
              name="customerCode"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="客户名称"
              initialValue={customerName}
              name="customerName"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label={'集团名称'} initialValue={groupName} name="groupName" readonly />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              label="客户类型"
              name="customerType"
              initialValue={customerType}
              readonly={readonly}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          {/* <Col lg={6} md={12} sm={24}>
            <ProFormText label="K5 Flag" name="k5Code" initialValue={k5Code} readonly={readonly} />
          </Col> */}
          <Col lg={6} md={12} sm={24}>
            <ProFormText label="SO单号" name="orderNo" initialValue={orderNo} readonly={readonly} />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormDateTimePicker
              initialValue={salesCreateTime}
              label="SO创建时间"
              name="salesCreateTime"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label="行项目" name="itemNo" initialValue={itemNo} readonly={readonly} />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              label="订单类型"
              name="orderType"
              initialValue={orderType}
              readonly={readonly}
              options={[]}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="订单类型描述"
              name="orderTypeDesc"
              initialValue={orderTypeDesc}
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              label="是否交货冻结"
              name="delBlockFlag"
              initialValue={delBlockFlag}
              readonly={readonly}
              options={[]}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormRadio.Group
              name="oneDelivery"
              label="一次性发货"
              initialValue={oneDelivery}
              readonly={readonly}
              options={[
                {
                  label: '否',
                  value: 0,
                },
                {
                  label: '是',
                  value: 1,
                },
              ]}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label="物料号" name="sku" initialValue={sku} readonly={readonly} />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              label="物料状态"
              name="bizStatus"
              initialValue={bizStatus}
              readonly={readonly}
              options={[]}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="物料状态描述"
              name="bizStatusDesc"
              initialValue={bizStatusDesc}
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              label="产品类型"
              name="productType"
              initialValue={productType}
              readonly={readonly}
              options={[]}
            />
          </Col>
  
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              label="stockType"
              name="stockType"
              initialValue={stockType}
              readonly={readonly}
              options={[]}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <ProFormSelect
              label="Brand Name"
              name="brandName"
              initialValue={brandName}
              readonly={readonly}
              options={[]}
            />
          </Col>
          <Col lg={12} md={12} sm={24}>
            <ProFormText label="PO描述" name="poDesc" initialValue={poDesc} readonly={readonly} />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <ProFormText
              label="物料描述"
              name="itemDesc"
              initialValue={itemDesc}
              readonly={readonly}
            />
          </Col>
          <Col lg={12} md={12} sm={24}>
            <ProFormText
              label="制造商型号"
              initialValue={mfgSku}
              name="mfgSku"
              readonly={readonly}
              disabled
            />
          </Col>
        </Row>
        {/* 基本信息2 */}
        <Row
          gutter={24}
          style={{ paddingTop: '24px', marginTop: '12px', borderTop: '1px solid #eee' }}
        >
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="订单数量"
              initialValue={orderQty}
              name="orderQty"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label="Open数量" initialValue={openQty} name="openQty" readonly={readonly} />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label="Open金额" initialValue={openAmount} name="openAmount" readonly />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="SAP确认数量"
              initialValue={sapConfirmQty}
              name="sapConfirmQty"
              readonly
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="确认金额"
              initialValue={confirmAmount}
              name="confirmAmount"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="缺货数量"
              initialValue={shortageQty}
              name="shortageQty"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="缺货金额"
              initialValue={shortageAmount}
              name="shortageAmount"
              readonly
            />
          </Col>
          <Col lg={6} md={12} sm={24} className="cust-lable">
            <ProFormDateTimePicker
              initialValue={promiseDate}
              label="承诺交货日期"
              name="promiseDate"
              readonly={readonly}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormDateTimePicker
              initialValue={requestDate}
              label="请求交货日期"
              name="requestDate"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="SourcingPO号"
              initialValue={sourcingNo}
              name="sourcingNo"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="SourcingPO状态"
              initialValue={sourcingStatus}
              name="sourcingStatus"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormDateTimePicker
              initialValue={reqArriveDate}
              label="预计到库日期"
              name="reqArriveDate"
              readonly={readonly}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label="采购数量" initialValue={poQty} name="poQty" readonly={readonly} />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="已收货数量"
              initialValue={poRecQty}
              name="poRecQty"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              initialValue={poArriveDate}
              label="预估交货日期"
              name="poArriveDate"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormDateTimePicker
              initialValue={delivDeadline}
              label="国能要求交期"
              name="delivDeadline"
              readonly={readonly}
            />
          </Col>
  
          {/* <Col lg={6} md={12} sm={24}>
            <ProFormDateTimePicker 
              initialValue={putOrderDate}
              label="放单时间"
              name="putOrderDate"
              readonly={readonly}
            />
          </Col> */}
        </Row>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <ProFormText
              label="相关替换产品"
              initialValue={alternativedSKU}
              name="alternativedSKU"
              readonly={readonly}
            />
          </Col>
          <Col lg={12} md={12} sm={24}>
            <ProFormText
              label="完全替代产品"
              initialValue={replacedSKU}
              name="replacedSKU"
              readonly={readonly}
            />
          </Col>
        </Row>
        {/* 基本信息3 */}
        <Row
          gutter={24}
          style={{ paddingTop: '24px', marginTop: '12px', borderTop: '1px solid #eee' }}
        >
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="二级客户抬头"
              initialValue={siteName}
              name="siteName"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="二级主销售"
              initialValue={siteSales}
              name="siteSales"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="销售主管"
              initialValue={siteSupervisor}
              name="siteSupervisor"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="销售经理"
              initialValue={siteManager}
              name="siteManager"
              readonly={readonly}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="外销（二级）"
              initialValue={siteBdSales}
              name="siteBdSales"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="外销主管"
              initialValue={siteBdSupervisor}
              name="siteBdSupervisor"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="外销总监"
              initialValue={siteBdManager}
              name="siteBdManager"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label="BG" initialValue={siteBG} name="siteBG" readonly={readonly} />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="客户区域"
              initialValue={customerRegion}
              name="customerRegion"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="客户渠道"
              initialValue={customerChannel}
              name="customerChannel"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="OMS渠道"
              initialValue={omsChannelName}
              name="omsChannelName"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="收货区域"
              initialValue={deliveryTerritory}
              name="deliveryTerritory"
              readonly={readonly}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="收货大区"
              initialValue={deliveryRegion}
              name="deliveryRegion"
              readonly={readonly}
            />
          </Col>
          {/* 
          <Col lg={6} md={12} sm={24}>
            <ProFormText label="创建人" initialValue={founder} name="founder" readonly={readonly} />
          </Col>
                  */}
          <Col lg={12} md={12} sm={24}>
            <ProFormText
              label="收货地址"
              initialValue={deliveryAddr}
              name="deliveryAddr"
              readonly={readonly}
            />
          </Col>
        </Row>
        {/* 基本信息4 */}
        <Row
          gutter={24}
          style={{ paddingTop: '24px', marginTop: '12px', borderTop: '1px solid #eee' }}
        >
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="装运点"
              initialValue={shippingPoint}
              name="shippingPoint"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="库存地点"
              initialValue={storageLocation}
              name="storageLocation"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              showSearch
              label="付款条件"
              initialValue={paymentTerm}
              name="paymentTerm"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="采购组"
              initialValue={purchGroup}
              name="purchGroup"
              readonly={readonly}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="采购组名"
              initialValue={purchGroupName}
              name="purchGroupName"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="供应商号"
              initialValue={supplierCode}
              name="supplierCode"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="供应商名称"
              initialValue={supplierName}
              name="supplierName"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              showSearch
              label="供应商物料号"
              initialValue={supplierSku}
              name="supplierSku"
              readonly={readonly}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="产品组"
              initialValue={productLine}
              name="productLine"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label="Segment" initialValue={segment} name="segment" readonly={readonly} />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label="Family" initialValue={family} name="family" readonly={readonly} />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              showSearch
              label="ABC标识"
              initialValue={abcFlag}
              name="abcFlag"
              readonly={readonly}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label="PM Name" initialValue={pmName} name="pmName" readonly={readonly} />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label="PMS Name" initialValue={pmsName} name="pmsName" readonly={readonly} />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="供应商变更次数"
              initialValue={poDateChanges}
              name="poDateChanges"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label={PastPromiseLable}
              initialValue={poPastPromise}
              name="poPastPromise"
              readonly={readonly}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="包装注释"
              initialValue={packRemark}
              name="packRemark"
              readonly={readonly}
            />
          </Col>
        </Row>
        {/* 基本信息5 */}
        <Row
          gutter={24}
          style={{ paddingTop: '24px', marginTop: '12px', borderTop: '1px solid #eee' }}
        >
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="库存是否满足"
              initialValue={stockContented}
              name="stockContented"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24} className="cust-lable">
            <ProFormText
              label="承诺交期B/O"
              initialValue={backOrder}
              name="backOrder"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24} className="cust-lable">
            <ProFormSelect
              showSearch
              label="要求交期B/O"
              initialValue={reqBackOrder}
              name="reqBackOrder"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="ITEM-GROUP"
              initialValue={itemGroup}
              name="itemGroup"
              readonly={readonly}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="ITEM CATE"
              initialValue={itemCate}
              name="itemCate"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label="MM02 LT" initialValue={mm02lt} name="mm02lt" readonly={readonly} />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label="ME12 LT" initialValue={me12lt} name="me12lt" readonly={readonly} />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="是否缺货"
              initialValue={outOfStock}
              name="outOfStock"
              readonly={readonly}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          {/* <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="是否发货"
              initialValue={whetherToShip}
              name="whetherToShip"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="供应商发货信息"
              initialValue={supplierDeliveryInformation}
              name="supplierDeliveryInformation"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="供应商类型"
              initialValue={supplierType}
              name="供应商类型"
              readonly={readonly}
            />
          </Col> */}
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="供应商种类"
              initialValue={supplierType}
              name="supplierType"
              readonly={readonly}
            />
          </Col>
  
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="供应商负责人"
              initialValue={supplierOwner}
              name="supplierOwner"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="未清AR金额"
              initialValue={arAmount}
              name="arAmount"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label="全仓库存" initialValue={whStock} name="whStock" readonly={readonly} />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label="上海库存" initialValue={shStock} name="shStock" readonly={readonly} />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="全仓在途"
              initialValue={whInTransit}
              name="whInTransit"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="直送外仓"
              initialValue={sendWarehouse}
              name="sendWarehouse"
              readonly={readonly}
            />
          </Col>
        </Row>
        {/* 基本信息6 */}
        <Row
          gutter={24}
          style={{ paddingTop: '24px', marginTop: '12px', borderTop: '1px solid #eee' }}
        >
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="SO未清归属"
              initialValue={soNotClearAscription}
              name="soNotClearAscription"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="SO未清类别"
              initialValue={soNotClearType}
              name="soNotClearType"
              readonly={readonly}
            />
          </Col>
          <Col lg={12} md={12} sm={24}>
            <ProFormText
              label="SO未清原因"
              initialValue={soNotClearReason}
              name="soNotClearReason"
              readonly={readonly}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="SAP PO NO"
              initialValue={sapPoNo}
              name="sapPoNo"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="预计到仓日期"
              initialValue={estimateArrivalDate}
              name="estimateArrivalDate"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="PO归属原因"
              initialValue={poAscriptionReason}
              name="poAscriptionReason"
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24} className="cust-lable">
            <ProFormText
              label="责任部门"
              initialValue={dutyDept}
              name="dutyDept"
              readonly={readonly}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24}>
            <ProFormText
              label="上升会议日期"
              initialValue={leaderCmtDate}
              name="leaderCmtDate"
              readonly={readonly}
            />
          </Col>
          <Col lg={12} md={12} sm={24}>
            <ProFormText
              label="上升会议结论"
              initialValue={leaderComment}
              name="leaderComment"
              readonly={readonly}
            />
          </Col>
        </Row>
      </>
    );
  };
  
  export default BasicDetail;
  