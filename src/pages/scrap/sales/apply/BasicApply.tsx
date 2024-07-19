/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Col, Modal, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import R3Modal from '@/pages/SalesAfter/components/R3Modal';
import type { ActionType } from '@ant-design/pro-table';
import { SearchOutlined } from '@ant-design/icons';
import AddCustomerForm from './AddCustomerForm';
interface BasicInfoProps {
  id?: string;
  type?: string;
  readonly?: boolean;
  info?: Record<any, any>;
  onChangeBasic?: (values: any) => void;
  fn?: any;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ readonly, info = {} as any, onChangeBasic }) => {
  // const [r3List, setR3List] = useState<any>([]);
  const {
    companyName = '',
    costTotalPrice = '',
    applySalesPriceNetTotal = '',
    applyTitle = '',
    contactName = '',
    contactCodeR3 = '',
    salesName = '',
    applyReason = '',
    customerName = '',
  } = info;
  const R3ModalRef: any = useRef<ActionType>();
  const [isAddNewModalVisible, setIsAddNewModalVisible] = useState(false);
  // const [modalVal, setModalVal] = useState({});
  const [customerCode, setCustomerCode] = useState();
  const [rowData, setRowData] = useState<any>({});
  //? 点击弹框确认 * 按钮 * 的时候，将弹框内部的行信息传递到父组件
  // const getSelModal = (val: any) => {
  //   fn(val);
  // };
  useEffect(() => {
    if (info.customerName) {
      setCustomerCode(info.customerCode);
    }
  }, [info]);
  const addNewModalClose = (): any => {
    setIsAddNewModalVisible(false);
  };
  //?子组件单选触发的时候，将子组件获取的行信息传递到父组件
  const operateMethod = (val: any) => {
    if (val) {
      // setModalVal(val); //?将客户行信息存储
      setCustomerCode(val.customerCode);
      onChangeBasic &&
        onChangeBasic({
          ...rowData, //?选择的用户的行信息
          ...val,
        });
    }
  };
  return (
    <>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'申请标题'}
            name="applyTitle"
            initialValue={applyTitle}
            placeholder="请输入"
            rules={[{ required: true, max: 50 }]}
            readonly={readonly}
            fieldProps={{
              showCount: true,
              maxLength: 50,
            }}
          />
        </Col>
        <Col
          className="specialR3Code"
          onClick={() => {
            setIsAddNewModalVisible(true);
          }}
          lg={6}
          md={12}
          sm={24}
        >
          <ProFormText
            rules={[{ required: true, message: '请输入客户名称' }]}
            label={'客户名称'}
            placeholder="请输入客户名称"
            name="customerName"
            initialValue={customerName}
            readonly={readonly}
            fieldProps={{
              readOnly: true,
              // onClick: () => {
              //   setIsAddNewModalVisible(true);
              // },
              suffix: readonly ? '' : <SearchOutlined />,
            }}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'客户代号'}
            name="customerCode"
            initialValue={customerCode}
            readonly={readonly}
            disabled
            placeholder="请选择"
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'主销售'}
            name="salesName"
            initialValue={salesName}
            readonly={readonly}
            disabled
            placeholder="请选择"
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'R3联系人'}
            name="contactName"
            initialValue={contactName}
            readonly={readonly}
            rules={[{ required: true }]}
            fieldProps={{
              readOnly: true,
              // autoComplete:true,
              onClick: () => {
                if (customerCode) {
                  R3ModalRef?.current?.open(customerCode);
                }
              },
            }}
            allowClear={false}
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
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'所属公司'}
            initialValue={companyName}
            name="companyName"
            readonly={readonly}
            disabled
            placeholder="请选择"
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'成本总计未税'}
            initialValue={costTotalPrice}
            name="costTotalPrice"
            readonly={readonly}
            disabled
            placeholder="请选择"
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label={'申请总计未税'}
            initialValue={applySalesPriceNetTotal}
            name="applySalesPriceNetTotal"
            readonly={readonly}
            disabled
            placeholder="请选择"
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
            rules={[{ required: true, message: '请输入' }]}
            readonly={readonly}
          />
        </Col>
      </Row>
      <R3Modal ref={R3ModalRef} operateMethod={(val: any[]) => operateMethod(val[0])} />
      <Modal
        width={1500}
        title="选择客户"
        visible={isAddNewModalVisible}
        destroyOnClose={true}
        onOk={() => {
          setIsAddNewModalVisible(false);
          // getSelModal(modalVal);
          operateMethod(rowData);
        }}
        onCancel={addNewModalClose}
      >
        <AddCustomerForm
          addNewModalClose={addNewModalClose}
          // getSelModal={getSelModal}
          operateMethod={operateMethod}
          onSelect={(rows: any) => setRowData(rows)}
          // onDbSave={(record: any) => dbSave(record)}
        />
      </Modal>
    </>
  );
};

export default BasicInfo;
