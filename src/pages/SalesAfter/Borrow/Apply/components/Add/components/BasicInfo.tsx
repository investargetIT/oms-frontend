import { getByKeys } from '@/services';
import { SearchOutlined } from '@ant-design/icons';
import { ProFormRadio, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Col, Form, Input, Modal, Row, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import AddCustomerForm from './AddCustomerForm';
import R3Modal from '@/pages/SalesAfter/components/R3Modal';
import type { ActionType } from '@ant-design/pro-table';
interface BasicInfoProps {
  id?: string;
  type?: string;
  readonly?: boolean;
  info?: Record<any, any>;
  fn?: any;
  fn2?: any;
  // r3list?: any;
  formRef?: any;
}
const BasicInfo: React.FC<BasicInfoProps> = ({ readonly, fn, fn2, formRef }) => {
  const [isAddNewModalVisible, setIsAddNewModalVisible] = useState(false);
  const [modalVal, setModalVal] = useState({});
  const [expectArr, setExpectArr]: any = useState();
  const R3ModalRef: any = useRef<ActionType>();
  const [customerCode, setCustomerCode] = useState();

  //? 点击弹框确认 * 按钮 * 的时候，将弹框内部的行信息传递到父组件
  const getSelModal = (val: any) => {
    fn(val);
  };
  const addNewModalClose = () => {
    setIsAddNewModalVisible(false);
  };
  //?子组件单选触发的时候，将子组件获取的行信息传递到父组件
  const operateMethod = (val: any) => {
    setModalVal(val); //?将客户行信息存储
    setCustomerCode(val.customerCode);
  };
  // ? R3联系人下拉改变触发
  // const r3Change = (e: any) => {
  //   //?e就是拿到的R3联系人代号
  //   // 设置给对应的表单项
  //   formRef?.current?.setFieldsValue({
  //     contactCodeR3: e,
  //   });
  // };
  function saveR3info(val: any) {
    if (val) {
      formRef?.current?.setFieldsValue({
        contactCodeR3: val[0].contactCode,
        contactNameR3: val[0].contactName,
      });
    }
  }
  const ExChange = (value: any) => {
    // console.log(value, 'value');
    const sItem = expectArr.find((item: any) => {
      return item.value == value;
    });
    fn2(sItem.label);
  };
  useEffect(() => {
    // ? 预后期处理下拉
    const Fn = async () => {
      const res = await getByKeys({
        list: ['expectHandleEnum'],
      });
      if (res.errCode === 200) {
        // setEList(res.data[0].enums);
        res.data[0].enums.forEach((element: any) => {
          element.label = element.name;
          element.value = element.code;
        });
        setExpectArr(res.data[0].enums);
        return res.data[0].enums;
      } else {
        return [];
      }
    };
    Fn();
  }, []);

  return (
    <>
      <div className="borrowCreatedContent">
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label={'申请标题'}
              name="applyTitle"
              readonly={readonly}
              placeholder="请输入"
              rules={[{ required: true, message: '请选择', max: 50 }]}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item
              name="customerName"
              rules={[{ required: true, message: '请输入客户名称' }]}
              label="客户名称"
            >
              <Input
                placeholder="请输入客户名称"
                suffix={<SearchOutlined />}
                onClick={() => {
                  setIsAddNewModalVisible(true);
                }}
              />
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label={'客户代号'}
              name="customerCode"
              rules={[{ required: true, message: '' }]}
              placeholder="请输入"
              disabled
              readonly={readonly}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              showSearch
              allowClear={false}
              label={'主销售'}
              name="salesName"
              readonly={readonly}
              disabled
              placeholder="请选择"
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label={'成本中心'} name="costCenterName" readonly={readonly} disabled />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item
              label={'R3联系人'}
              rules={[{ required: true, message: '请选择r3联系人信息' }]}
              name="contactNameR3"
            >
              {/* <Select placeholder="请选择" onChange={r3Change}>
                {r3list?.map((item: any) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select> */}
              <Input
                placeholder="请输入客户名称"
                suffix={<SearchOutlined />}
                onClick={() => {
                  R3ModalRef?.current?.open(customerCode);
                }}
              />
            </Form.Item>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label={'R3联系人代号'} name="contactCodeR3" readonly={readonly} disabled />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <Form.Item
              label={'预期后续处理'}
              rules={[{ required: true, message: '' }]}
              name="expectHandleType"
            >
              <Select placeholder="请选择" onChange={ExChange}>
                {expectArr?.map((item: any) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label={'申请金额'}
              name="applyAmount"
              readonly={readonly}
              placeholder="请选择"
              disabled
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText label={'申请渠道'} name="channelType" readonly={readonly} disabled />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormRadio.Group
              name="partialShipment"
              label="一次性发货"
              initialValue={0}
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
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <ProFormTextArea
              name={'remark'}
              label="申请备注"
              placeholder={'请输入，最多255字'}
              fieldProps={{ maxLength: 255, showCount: true }}
              rules={[{ required: true, message: '请选择' }]}
              labelAlign="left"
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <ProFormTextArea
              name={'excessReason'}
              label="超额原因"
              placeholder={'请输入，最多255字'}
              fieldProps={{ maxLength: 255, showCount: true }}
              labelAlign="left"
            />
          </Col>
        </Row>
      </div>
      <Modal
        width={1500}
        title="选择客户"
        visible={isAddNewModalVisible}
        destroyOnClose={true}
        onOk={() => {
          setIsAddNewModalVisible(false);
          getSelModal(modalVal);
        }}
        onCancel={addNewModalClose}
      >
        <AddCustomerForm
          addNewModalClose={addNewModalClose}
          getSelModal={getSelModal}
          operateMethod={operateMethod}
        />
      </Modal>
      <R3Modal ref={R3ModalRef} operateMethod={saveR3info} />
    </>
  );
};

export default BasicInfo;
