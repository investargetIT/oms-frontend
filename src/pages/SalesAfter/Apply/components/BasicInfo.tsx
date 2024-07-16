/* eslint-disable @typescript-eslint/no-unused-expressions */
import { queryAfterType } from '@/services/afterSales';
import { getByKeys, queryChannel } from '@/services/afterSales/utils';
import { SearchOutlined } from '@ant-design/icons';
// import { getConList } from '@/services/InquirySheet/offerOrder';
import R3Modal from '@/pages/SalesAfter/components/R3Modal';
import '../../index.less';
import {
  ProFormCascader,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { Col, Row } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import type { ActionType } from '@ant-design/pro-table';

interface BasicInfoProps {
  id?: string;
  type?: string;
  readonly?: boolean;
  info?: Record<any, any>;
  changeCode?: (db: any, code: any) => void;
  onModal?: () => void;
  formRef?: any;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  readonly,
  info = {} as any,
  type,
  changeCode,
  onModal,
  formRef,
}) => {
  const {
    obdNo = '', //0401701268
    orderNo = '',
    // erpNo = '23232323',
    applyTitle = '',
    afterSalesType = '',
    afterSalesTypeName = '',
    customerName = '',
    customerCode = '',
    // contactNameR3 = '',
    contactCodeR3 = '',
    salesName = '',
    // greenFlag = 0,
    urgencyType = 10,
    // originalOrderChannelType = null,
    // channelType = null,
    // originalOrderChannelTypeName = '',
    originalOrderChannelType = '',
    // channelTypeName = '',
    // channelType = 10,
    applyChannelType = 10,
    createTime = null,
    completeDate = null,
    purchaseName = '',
    purchaseCode = '',
    afterSalesNo = null,
    tertiaryDeptName = '',
    tertiaryDeptCode = '',
    returnWaybillNo = '',
    whetherLocal = null,
    // r3List = [],
    contactName = {} as any,
  } = info;
  // const [r3List, setR3List] = useState<any>([]);
  const [statusList, setStatusList] = useState<any>([]);
  const [allChannel, setAllChannel] = useState<any>([]);
  const R3ModalRef: any = useRef<ActionType>();

  useEffect(() => {
    // 紧急度list
    const par = { list: ['urgencyEnum'] };
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
    // 渠道
    queryChannel({}).then((res: any) => {
      if (res?.errCode === 200) {
        setAllChannel(
          res?.data?.map((io: any) => ({
            value: io.channel,
            label: io.channelName,
          })),
        );
      }
    });
  }, []);
  function operateMethod(val: { contactName: any; contactCodeR3: any }) {
    if (val) {
      // console.log(val, 'val');
      formRef?.setFieldsValue({
        contactName: {
          label: val[0]?.contactName,
          value: val[0]?.contactCode,
        },
        contactCodeR3: val[0]?.contactCode,
      });
    }
  }
  // console.log(1);

  return (
    <>
      <Row gutter={24}>
        <Col lg={12} md={12} sm={24} className="cust-casder">
          <ProFormCascader
            key={'addafter'}
            label={'售后类型'}
            allowClear={false}
            name="afterSalesType"
            initialValue={afterSalesType || afterSalesTypeName || ''}
            readonly={readonly}
            rules={[{ required: type == 'handle' ? false : true, message: '请选择' }]}
            request={async () => {
              let list = [] as any;
              await queryAfterType({ enabledFlag: 1, afterSalesNo }).then((res: any) => {
                const { data, errCode } = res;
                if (errCode === 200) {
                  list =
                    info.apiChannel && info.apiThreeSalesType
                      ? data?.dataList.map((e) => ({
                          ...e,
                          childNodeList: e.childNodeList.map((ele) => ({
                            ...ele,
                            childNodeList: ele.childNodeList.map((item) => ({
                              ...item,
                              disabled:
                                (item.name === '换货' && info.apiThreeSalesType === '0') ||
                                (item.name === '退货' && info.apiThreeSalesType === '1'),
                            })),
                          })),
                        }))
                      : data?.dataList;
                }
              });
              return list;
            }}
            fieldProps={{
              showArrow: false,
              showSearch: true,
              dropdownMatchSelectWidth: false,
              // labelInValue: true,
              fieldNames: {
                label: 'name',
                value: 'sid',
                children: 'childNodeList',
              },
              onChange: (val: any, selectedOptions: any) => {
                // console.log(selectedOptions);

                changeCode &&
                  changeCode(
                    `${selectedOptions?.slice(-1)[0]?.sid}`,
                    selectedOptions?.slice(-1)[0]?.sapReasonCode,
                  );
              },
            }}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col
          lg={6}
          md={12}
          sm={24}
          onClick={onModal}
          className={classNames(type === 'add' && 'canSee')}
        >
          <ProFormText
            label={'发货单号'}
            initialValue={obdNo}
            name="obdNo"
            readonly={readonly}
            disabled
            placeholder={'请选择'}
            allowClear={false}
            rules={[{ required: true, message: '请选择' }]}
            fieldProps={{
              suffix: !readonly && <SearchOutlined />,
            }}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'申请标题'}
            initialValue={applyTitle}
            name="applyTitle"
            readonly={readonly}
            placeholder="请输入"
            rules={[{ required: true, message: '请输入', max: 50 }]}
            fieldProps={{
              showCount: true,
              maxLength: 50,
            }}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'销售订单编号'}
            initialValue={orderNo}
            name="orderNo"
            readonly={readonly}
            disabled
            placeholder={'选择发货单后显示'}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            allowClear={false}
            label={'主销售'}
            name="salesName"
            initialValue={salesName}
            readonly={readonly}
            disabled
            placeholder={'选择发货单后显示'}
            rules={[{ required: true, message: '请选择' }]}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'客户名称'}
            name="customerName"
            initialValue={customerName}
            rules={[{ required: true, message: '请选择' }]}
            placeholder={'选择发货单后显示'}
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'客户代号'}
            name="customerCode"
            initialValue={customerCode}
            rules={[{ required: true, message: '请选择' }]}
            placeholder={'选择发货单后显示'}
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            disabled={[20, 120].includes(applyChannelType)}
            allowClear={false}
            label={'R3联系人'}
            // name="contactNameR3"
            // initialValue={contactNameR3}
            readonly={readonly}
            // options={r3List}
            placeholder="请选择"
            initialValue={contactName?.label}
            rules={[{ required: true, message: '请选择' }]}
            name="contactName"
            fieldProps={{
              labelInValue: true,
              open: false,
              onClick: () => {
                if (customerCode && ![20, 120].includes(applyChannelType)) {
                  R3ModalRef?.current?.open(customerCode);
                }
              },
              // dropdownStyle: {
              //   maxHeight: '300px',
              // },
              // onChange: (val) => {},
              // onFocus: () => {
              //   if (customerCode) {
              //     queryContact({ customerCode }).then((res: any) => {
              //       if (res.errCode === 200) {
              //         const concatList = res?.data?.dataList?.map((io: any) => ({
              //           label: io.contactName,
              //           value: io.contactCode,
              //         }));
              //         setR3List(concatList);
              //       }
              //     });
              //   }
              // },
            }}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'R3联系人代号'}
            initialValue={contactCodeR3}
            name="contactCodeR3"
            readonly={readonly}
            disabled
            placeholder={''}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            allowClear={false}
            label={'紧急度'}
            name="urgencyType"
            initialValue={urgencyType}
            readonly={readonly}
            options={statusList[0]}
            placeholder="请选择"
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            allowClear={false}
            label={'原订单渠道'}
            name="originalOrderChannelType"
            initialValue={originalOrderChannelType}
            readonly={readonly}
            options={allChannel}
            placeholder="选择发货单后显示"
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            allowClear={false}
            readonly={readonly}
            options={allChannel}
            placeholder="请选择"
            label={'申请渠道'}
            name="applyChannelType"
            initialValue={applyChannelType}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            allowClear={false}
            readonly={readonly}
            placeholder="请选择"
            label={'客户采购单位'}
            name="purchaseName"
            initialValue={purchaseName}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            allowClear={false}
            readonly={readonly}
            placeholder="请选择"
            label={'采购单位代号'}
            name="purchaseCode"
            initialValue={purchaseCode}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            allowClear={false}
            readonly={readonly}
            placeholder="请选择"
            label={'所属事业部'}
            name="tertiaryDeptName"
            initialValue={tertiaryDeptName}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24} style={{ display: 'none' }}>
          <ProFormText
            allowClear={false}
            readonly={readonly}
            placeholder="请选择"
            label={'所属事业部'}
            name="tertiaryDeptCode"
            initialValue={tertiaryDeptCode}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            allowClear={false}
            label={'是否Local'}
            name="whetherLocal"
            initialValue={whetherLocal}
            readonly={readonly}
            options={[
              { label: '是', value: 1 },
              { label: '否', value: 0 },
            ]}
            placeholder="选择"
            disabled
          />
        </Col>
        {type === 'detail' && (
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label={'客户退货运单号'}
              initialValue={returnWaybillNo}
              name="returnWaybillNo"
              readonly={readonly}
              disabled
            />
          </Col>
        )}
        {/* <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'售后金额'}
            initialValue={afterAmount}
            name="afterAmount"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'维修费合计'}
            initialValue={repairAmount}
            name="repairAmount"
            readonly={readonly}
            disabled
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            label={'质检指定仓库'}
            name="store"
            initialValue={store}
            readonly={readonly}
            options={[
              {
                label: '紧急',
                value: 0,
              },
            ]}
            placeholder="请选择"
            rules={[{ required: true, message: '' }]}
          />
        </Col> */}
      </Row>
      {type !== 'add' && type !== 'edit' && (
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormDateTimePicker
              allowClear={false}
              name={'createTime'}
              initialValue={createTime}
              label="申请创建时间"
              fieldProps={{
                style: {
                  width: '100%',
                },
              }}
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormDateTimePicker
              allowClear={false}
              name={'completeDate'}
              initialValue={completeDate}
              label="结束时间"
              fieldProps={{
                style: {
                  width: '100%',
                },
              }}
              readonly={readonly}
            />
          </Col>
        </Row>
      )}
      <R3Modal ref={R3ModalRef} operateMethod={operateMethod} />
    </>
  );
};

export default BasicInfo;
