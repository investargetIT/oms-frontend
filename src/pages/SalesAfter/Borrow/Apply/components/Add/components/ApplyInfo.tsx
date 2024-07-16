// import { getConList } from '@/services/InquirySheet/offerOrder';
import { ProFormText } from '@ant-design/pro-form';
import { Col, Row, Form, Input, Modal, message, Radio } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import AddCustomerForm from './AddCustomerForm';
interface ApplyInfoProps {
  id?: string;
  type?: string;
  readonly?: boolean;
  info?: Record<any, any>;
  fn?: any;
  Code?: any;
  passCode?: any;
}

const ApplyInfo: React.FC<ApplyInfoProps> = ({ readonly, fn, Code, passCode }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalVal, setModalVal] = useState({});

  //? 点击弹框确认的时候，将弹框内部的行信息传递到父组件
  const getSelModal = (val: any) => {
    fn(val);
  };
  const ModalClose = () => {
    setShowModal(false);
  };
  //?子组件单选触发的时候，将子组件获取的行信息传递到父组件
  const operateMethod = (val: any) => {
    setModalVal(val); //?将行信息存储
  };
  //?先判断上面的客户选了没有，选了再打开弹框选区域
  const areaFn = (): any => {
    if (!Code) return message.error('请先选择客户');
    setShowModal(true);
  };
  const ExChange = (val: any): any => {
    passCode(val.target.value);
  };
  return (
    <>
      <div className="borrowCreatedContent">
        <Row gutter={24}>
          <Col lg={12} md={12} sm={24} onClick={areaFn}>
            <Form.Item
              name="receiverAddress"
              rules={[{ required: true, message: '请输入收货人地址' }]}
              label="收货人地址"
            >
              <Input
                //?先判断上面的客户选了没有，选了再打开弹框选区域
                placeholder="请输入请输入收货人地址"
                suffix={<SearchOutlined />}
                disabled
              />
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label={'收货地区'} name="district" disabled />
          </Col>

          <Col lg={6} md={12} sm={24}>
            <ProFormText label={'收货邮编'} name="shipZip" disabled />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label={'收货姓名'} name="receiverName" disabled />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label={'收货人手机'} name="receiverMobile" disabled />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label={'收货人固话'} name="fixedPhone" disabled />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText name={'mailbox'} label={'收货人邮箱'} disabled />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <Form.Item label={'是否保税区'} name="toBondFlag">
              <Radio.Group onChange={ExChange}>
                <Radio value={0}>否</Radio>
                <Radio value={1}>是</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              name={'specialCode'}
              label={'特殊编码'}
              readonly={readonly}
              placeholder="请输入"
            />
          </Col>
        </Row>
      </div>
      <Modal
        width={1500}
        title="选择地址"
        visible={showModal}
        destroyOnClose={true}
        onOk={() => {
          setShowModal(false);
          getSelModal(modalVal);
        }}
        onCancel={ModalClose}
      >
        <AddCustomerForm
          Code={Code}
          addNewModalClose={ModalClose}
          getSelModal={getSelModal}
          operateMethod={operateMethod}
        />
      </Modal>
    </>
  );
};

export default ApplyInfo;
