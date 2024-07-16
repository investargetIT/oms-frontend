import { getByKeys } from '@/services/afterSales/utils';
import { getRegionList } from '@/services/SalesOrder';
import {
  ProFormCascader,
  ProFormDatePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { Col, Row } from 'antd';

import React, { useEffect, useState } from 'react';

interface ApplyInfoProps {
  id?: string;
  type?: string;
  readonly?: boolean;
  info?: Record<any, any>;
}

const ApplyInfo: React.FC<ApplyInfoProps> = ({ readonly, info = {} as any, type }) => {
  const {
    oneWeekFlag = null,
    packageFullFlag = null,
    pickUpGoodsFlag = null,
    returnToCustomerFlag = null,
    quantityLackFlag = null,
    reissuedFlag = null,
    logisticsQuestionFlag = null,
    obdTotalPrice = '',
    originalOrderType = '',
    systemInvoiceNo = '',
    physicsInvoiceNo = '',
    invoiceStatus = 10,
    invoiceReceiptDate = null,
    invoiceInfoConfirm = '',
    refundExplain = '',
    deliveryDate = null,
    consignee = '',
    consigneeMobile = '',
    consigneeTel = '',
    applyReason = '',
    consigneeAddress = '',
    remark = '',
    regionName = null,
  } = info;
  const [statusList, setStatusList] = useState<any>([]);
  const [pid] = useState<any>(0);
  const [rangeList, setRangeList] = useState<any>([]);
  // const getr3List = async () => {
  //   const { data } = await getConList({
  //     customerCode: info.customerCode,
  //     contactName: info.customerName,
  //   });
  // };

  useEffect(() => {
    // getr3List();
    // 发票状态
    const par = { list: ['invoiceStatusEnum', 'salesOrderCategoryEnum'] };
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
    // 获取省市区列表
    getRegionList({ parentId: pid }).then((res: any) => {
      setRangeList(
        res?.data?.dataList.map((io: any) => ({
          label: io.name,
          value: io.name,
          id: io.id,
          isLeaf: false,
          level: io.level,
        })),
      );
    });
  }, []);

  const loadRegion = async (selectedOptions: any) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    getRegionList({ parentId: selectedOptions[selectedOptions.length - 1].id }).then((res: any) => {
      targetOption.children = res?.data?.dataList.map((io: any) => ({
        label: io.name,
        value: io.name,
        id: io.id,
        isLeaf: io.level == 2 ? false : true,
        level: io.level,
      }));
      setRangeList([...rangeList]);
    });
  };
  return (
    <>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormRadio.Group
            label="七天内"
            name={'oneWeekFlag'}
            initialValue={oneWeekFlag}
            rules={[{ required: true, message: '请选择' }]}
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
            readonly={readonly}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          {/* after 可以输入 detail只读 */}
          <ProFormRadio.Group
            name={'packageFullFlag'}
            initialValue={packageFullFlag}
            label="包装完好"
            rules={[{ required: true, message: '请选择' }]}
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
            readonly={type === 'detail' ? readonly : false}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormRadio.Group
            name={'pickUpGoodsFlag'}
            initialValue={pickUpGoodsFlag}
            label="需提货"
            rules={[{ required: true, message: '请选择' }]}
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
            readonly={readonly}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormRadio.Group
            name={'returnToCustomerFlag'}
            initialValue={returnToCustomerFlag}
            label="退货返还客户"
            rules={[{ required: true, message: '请选择' }]}
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
            readonly={readonly}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormRadio.Group
            name={'quantityLackFlag'}
            initialValue={quantityLackFlag}
            label="少发"
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
            readonly={readonly}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormRadio.Group
            name={'reissuedFlag'}
            initialValue={reissuedFlag}
            label="补发"
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
            readonly={readonly}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormRadio.Group
            name={'logisticsQuestionFlag'}
            initialValue={logisticsQuestionFlag}
            label="物流问题"
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
            readonly={readonly}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            name={'obdTotalPrice'}
            initialValue={obdTotalPrice}
            label={'发货订单总金额'}
            readonly={readonly}
            disabled
            placeholder={'选择发货单后显示'}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            allowClear={false}
            name={'originalOrderType'}
            initialValue={originalOrderType}
            label={'订单类型'}
            options={statusList[1]}
            readonly={readonly}
            placeholder="选择发货订单后显示"
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            name={'systemInvoiceNo'}
            initialValue={systemInvoiceNo}
            label={'系统发票号'}
            readonly={readonly}
            placeholder="选择发货单后显示"
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            name={'physicsInvoiceNo'}
            initialValue={physicsInvoiceNo}
            label={'物理发票号'}
            readonly={readonly}
            placeholder="选择发货单后显示"
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            allowClear={false}
            name={'invoiceStatus'}
            initialValue={invoiceStatus}
            label={'发票状态'}
            readonly={readonly}
            options={statusList[0]}
            placeholder="请选择"
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormDatePicker
            allowClear={false}
            name={'invoiceReceiptDate'}
            initialValue={invoiceReceiptDate}
            label="发票接收日期"
            fieldProps={{
              style: {
                width: '100%',
              },
            }}
            readonly={readonly}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            // 状态判断
            name={'invoiceInfoConfirm'}
            initialValue={invoiceInfoConfirm}
            label={'发票信息确认'}
            placeholder="请输入"
            readonly={type === 'detail' ? readonly : false}
            disabled={type === 'add' || type == 'edit' ? true : false}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            name={'refundExplain'}
            initialValue={refundExplain}
            label={'退票说明'}
            placeholder="请输入"
            readonly={readonly}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormDatePicker
            allowClear={false}
            name={'deliveryDate'}
            initialValue={deliveryDate}
            label="发货时间"
            fieldProps={{
              style: {
                width: '100%',
              },
            }}
            readonly={readonly}
            disabled
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'联系人'}
            name={'consignee'}
            initialValue={consignee}
            fieldProps={
              {
                maxLength: 200,
              }
            }
            readonly={readonly}
            rules={[{ required: true, message: '请选择' }]}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'联系手机'}
            name={'consigneeMobile'}
            initialValue={consigneeMobile}
            readonly={readonly}
            fieldProps={
              {
                // maxLength: 11,
                // minLength: 11,
              }
            }
            rules={[{ message: '请填写手机号' }]}
            // rules={[
            //   { required: true, message: '请填写手机号', pattern: /^1[3456789]\d{9}$/ },
            // ]}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'联系电话'}
            name={'consigneeTel'}
            initialValue={consigneeTel}
            readonly={readonly}
            fieldProps={
              {
                // maxLength: 11,
              }
            }
            rules={[{ message: '请填写联系电话' }]}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <ProFormCascader
            name="regionName"
            allowClear={false}
            initialValue={regionName}
            label="取货地区"
            readonly={readonly}
            fieldProps={{
              // changeOnSelect: true,
              options: rangeList,
              loadData: loadRegion,
              // fieldNames:{ label: 'name', value: 'id', children: 'children' }
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            label={'取货地址'}
            name={'consigneeAddress'}
            initialValue={consigneeAddress}
            readonly={readonly}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <ProFormTextArea
            name={'applyReason'}
            initialValue={applyReason}
            label="申请原因"
            placeholder={'请输入，最多255字'}
            fieldProps={{ maxLength: 255, showCount: true }}
            rules={[{ required: true, message: '请选择' }]}
            readonly={readonly}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <ProFormTextArea
            name={'remark'}
            initialValue={remark}
            label="备注"
            placeholder={'请输入，最多255字'}
            fieldProps={{ maxLength: 255, showCount: true }}
            readonly={readonly}
          />
        </Col>
      </Row>
    </>
  );
};

export default ApplyInfo;
