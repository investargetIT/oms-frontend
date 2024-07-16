import React, { useState } from 'react';
import { Button, Modal, Form, message, Input } from 'antd';
import type { FormInstance } from 'antd/es/form';
import ProductLine from '@/pages/components/ProductLine';
import Segment from '@/pages/components/Segment';
import { toSourcing, changeSegment2Src } from '@/services/InquirySheet';
import { history, useLocation } from 'umi';

const SourcingBtn: React.FC<{ selectedRow: any; recall?: any }> = (props: any) => {
  const location: any = useLocation();
  const pathParams: any = location.state;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productCode, setProductCode] = useState('');
  const formRef = React.createRef<FormInstance>();
  const onOperate = (): any => {
    if (!props.selectedRow?.length) {
      Modal.warning({ title: '请选择需要操作的数据!' });
      return false;
    }
    let isVisible = false;
    let statusMatch = true;
    props.selectedRow?.forEach((item: any) => {
      if (!item.segmentCode) isVisible = true;
      if (![60, 70, 80, 90, 100, 110].includes(item.lineStatus)) statusMatch = false;
    });
    if (!statusMatch) {
      Modal.warning({
        title: '仅可对AE处理中、AE选配完成、退回至AE、TE处理中、TE选配完成、退回至TE的行进行操作!',
      });
      return false;
    }
    setIsModalVisible(isVisible);
    if (!isVisible) {
      const temp: any = {};
      let inqLineIdList: any = [];
      const path: any = pathParams?.sorurceType || history.location.pathname.split('/').pop();
      if (location.pathname === '/inquiry/ae') {
        props.selectedRow.forEach((e) => {
          inqLineIdList = [...inqLineIdList, ...e.inqLineIds];
        });
      } else {
        inqLineIdList = props.selectedRow.map((item: any) => item.skuVo?.inqLineId);
      }
      if (inqLineIdList?.length) {
        temp.inqLineIdList = inqLineIdList;
      }
      Modal.confirm({
        title: '将按当前各行的产线信息设置需sourcing,确认提交?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          toSourcing(temp, path).then((resd: any) => {
            if (resd.errCode === 200) {
              message.success('操作成功!');
              if (props.recall) {
                props.recall();
              } else {
                history.go(-1);
              }
            } else {
              Modal.error({ title: resd.errMsg });
            }
          });
        },
      });
    }
  };
  const handleOk = () => {
    formRef.current?.validateFields().then((res: any) => {
      const temp: any = {};
      const inqLineIdList: any = props.selectedRow.map((item: any) => item.skuVo.inqLineId);
      if (inqLineIdList?.length) {
        temp.inqLineIdList = inqLineIdList;
      }
      Modal.confirm({
        title: '将按当前各行的产线信息设置需sourcing,确认提交?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          const path: any = pathParams?.sorurceType || history.location.pathname.split('/').pop();
          changeSegment2Src({ ...temp, ...res }, path).then((resd: any) => {
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
      <Button size="small" disabled={!props.selectedRow?.length} onClick={onOperate}>
        转Sourcing
      </Button>
      <Modal
        title="转Sourcing"
        destroyOnClose={true}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{ color: 'red' }}>Product和Segment不可为空，请先设置产线信息</div>
        <div style={{ color: 'red', fontSize: '12px' }}>
          （此设置对选中的无产线的行均生效，已有产线的行数据不变）
        </div>
        <Form ref={formRef} layout="vertical">
          <Form.Item
            label="产品线"
            name="productLineCode"
            rules={[{ required: true, message: '请选择' }]}
          >
            <ProductLine
              isEdit={false}
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

export default SourcingBtn;
