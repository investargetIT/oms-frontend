import React, { useState } from 'react';
import { Button, Modal, Form, message, Input } from 'antd';
import { FormInstance } from 'antd/es/form';
import ProductLine from '@/pages/components/ProductLine';
import Segment from '@/pages/components/Segment';
import { changeSegment } from '@/services/InquirySheet';
import { history, useLocation } from 'umi';
const ProreplaceBtn: React.FC<{ selectedRow: any; recall?: any }> = (props: any) => {
  const location: any = useLocation();
  const pathParams: any = location.state;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productCode, setProductCode] = useState('');
  const formRef = React.createRef<FormInstance>();
  const onOperate = (): boolean => {
    if (!props.selectedRow?.length) {
      Modal.warning({ title: '请选择需要操作的数据!' });
      return false;
    }
    setIsModalVisible(true);
    return true;
  };
  const handleOk = () => {
    formRef.current?.validateFields().then((res: any) => {
      const temp: any = {};
      const inqLineIdList: any = props.selectedRow.map((item: any) => item.skuVo.inqLineId);
      if (inqLineIdList?.length) {
        temp.inqLineIdList = inqLineIdList;
      }
      const path: any = pathParams?.sorurceType || history.location.pathname.split('/').pop();
      Modal.confirm({
        title: '确定转产品线?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          changeSegment({ ...temp, ...res }, path).then((resd: any) => {
            if (resd.errCode === 200) {
              message.success('操作成功!');
              if (props.recall) {
                props.recall();
              } else {
                history.go(-1);
              }
              setIsModalVisible(false);
            } else {
              Modal.error({ title: resd.errMsg });
            }
          });
        },
      });
    });
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const productChange = (val: any) => {
    setProductCode(val);
    formRef.current?.setFieldsValue({ segmentCode: '', segmentName: '' });
  };
  return (
    <div>
      <Button
        size="small"
        className="light_blue"
        disabled={!props.selectedRow?.length}
        onClick={onOperate}
      >
        转产线
      </Button>
      <Modal
        title="转产品线"
        destroyOnClose={true}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form ref={formRef} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Form.Item
            label="产品线"
            name="productLineCode"
            rules={[{ required: true, message: '请选择' }]}
          >
            <ProductLine
              onChange={productChange}
              onType={(val: any) => formRef.current?.setFieldsValue({ productLineName: val })}
            />
          </Form.Item>
          <Form.Item
            label="Segment"
            name="segmentCode"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Segment
              isEdit={false}
              parentId={productCode}
              onType={(val: any) => formRef.current?.setFieldsValue({ segmentName: val })}
            />
          </Form.Item>
          <Form.Item label="" name="productLineName" style={{ display: 'none' }}>
            <Input readOnly />
          </Form.Item>
          <Form.Item label="" name="segmentName" style={{ display: 'none' }}>
            <Input readOnly />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProreplaceBtn;
