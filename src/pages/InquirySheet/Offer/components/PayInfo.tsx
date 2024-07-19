/* eslint-disable @typescript-eslint/no-unused-expressions */
import { getSelectList } from '@/services/InquirySheet/utils';
import { ProFormSelect } from '@ant-design/pro-form';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { fieldLabels } from '../const';

interface PayInfoProps {
  id?: string;
  type?: string; //公用
  readonly?: boolean;
  info?: Record<any, any>;
  onMethodChange?: (newList: any) => void;
  isCsp?: boolean;
}

const PayInfo: React.FC<PayInfoProps> = ({
  readonly,
  info = {} as any,
  onMethodChange,
  isCsp,
  type = '',
}) => {
  const {
    shipType = '10',
    paymentTerm = '',
    paymentMethod = '',
    paymentTerms = '',
    payTypeCust = '',
  } = info;
  const [shipList, setShipList] = useState<any>([]);
  const [condationList, setCondationList] = useState<any>([]);
  const [methodList, setMethodList] = useState<any>([]);

  useEffect(() => {
    // getSelectList({ type: 'ship' }).then((res: any) => {
    //   const { errCode, data } = res;
    //   if (errCode === 200) {
    //     let newList = [] as any;
    //     newList = data?.dataList
    //       ?.map((io: any) => ({
    //         ...io,
    //         label: io.value,
    //         value: io.key,
    //         disabled: ['addOrder', 'offerOrder'].includes(type) && io.key == 20 ? true : false,
    //       }))
    //       ?.filter((ic: any) => ic.key != '30');
    //     setShipList(newList);
    //   }
    // });
    // getSelectList({ type: 'paymentTerm' }).then((res: any) => {
    //   const { errCode, data } = res;
    //   if (errCode === 200) {
    //     setCondationList(
    //       data?.dataList?.map((io: any) => ({
    //         // ...io,
    //         label: io.value,
    //         value: io.key,
    //         disabled: payTypeCust == 1 && io.key == 2 ? true : false, // 1預付款 2信用支付（目前兩個...） 判斷條件一句crm客戶主數據上的支付條件進行判斷 涉及到頁面：報價單管理 轉訂單 合并報價單 編輯報價單 報廢申請
    //       })),
    //     );
    //   }
    // });
  }, [info.paymentTerm]);

  useEffect(() => {
    // getSelectList({ type: 'paymentTerm', code: info.paymentTerm || info.paymentTerms }).then(
    //   (res: any) => {
    //     setMethodList(
    //       res?.data?.dataList[0]?.children?.map((io: any) => ({
    //         ...io,
    //         label: io.value,
    //         value: io.key,
    //       })),
    //     );
    //   },
    // );
  }, [info.paymentTerm, info.paymentTerms]);

  return (
    <>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            allowClear={false}
            label={fieldLabels.shipType}
            name="shipType"
            readonly={readonly}
            initialValue={shipType}
            options={shipList}
            placeholder="请选择"
            rules={[{ required: isCsp ? false : true, message: '请选择' }]}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            allowClear={false}
            label={fieldLabels.paymentTerm}
            name={'paymentTerm' || 'paymentTerms'}
            readonly={readonly}
            initialValue={paymentTerm || paymentTerms}
            options={condationList}
            placeholder="请选择"
            rules={[{ required: isCsp ? false : true, message: '请选择' }]}
            fieldProps={{
              onChange: (val) => {
                getSelectList({ type: 'paymentTerm', code: val }).then((res: any) => {
                  const newList = res?.data?.dataList[0]?.children?.map((io: any) => ({
                    ...io,
                    label: io.value,
                    value: io.key,
                  }));
                  setMethodList(newList);
                  onMethodChange && onMethodChange(newList);
                });
                return val;
              },
            }}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormSelect
            showSearch
            allowClear={false}
            label={fieldLabels.paymentMethod}
            name="paymentMethod"
            readonly={readonly}
            initialValue={paymentMethod}
            options={methodList}
            placeholder="请选择"
            rules={[{ required: isCsp ? false : true, message: '请选择' }]}
          />
        </Col>
      </Row>
    </>
  );
};

export default PayInfo;
