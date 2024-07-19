import React, { useState } from 'react';
import { Button, Modal, Form, Select, Input, message } from 'antd';
import { FormInstance } from 'antd/es/form';
import { cancelOption } from '@/services/InquirySheet';
import { history } from 'umi';
const CancelBtn: React.FC<{
  inquiryId?: any;
  selectedRow?: any;
  recall?: any;
  lastPath?: any;
}> = (props: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const formRef = React.createRef<FormInstance>();
  const onOperate = (): boolean => {
    if (!props.selectedRow?.length) {
      Modal.warning({ title: '请选择需要操作的数据!' });
      return false;
    }
    // let isProbable = false;
    // props.selectedRow.forEach((item: any) => {
    //   if (![190, 210, 200].includes(item.lineStatus)) isProbable = true;
    // });
    // if (isProbable) {
    //   Modal.warning({ title: '请选择可转报价的明细进行取消选配型!' });
    //   return false;
    // }
    setIsModalVisible(true);
    return true;
  };
  const handleOk = () => {
    const inquiryId: any = props.selectedRow[0].inquiryId;
    const inqLineIdList = props.selectedRow.map((item: any) => item.skuVo?.inqLineId);
    formRef.current?.validateFields().then((res: any) => {
      if (inqLineIdList && inqLineIdList.length > 0) {
        res.inqLineIdList = inqLineIdList;
      }
      res.inquiryId = inquiryId;
      Modal.confirm({
        title: '确定取消选配型?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          // cancelOption(res).then((resd: any) => {
          //   if (resd.errCode === 200) {
          //     message.success('操作成功!');
          //     setIsModalVisible(false);
          //     if (props.recall) {
          //       props.recall();
          //     } else {
          //       history.go(-1);
          //     }
          //   } else {
          //     message.error(resd.errMsg);
          //   }
          // });
        },
      });
    });
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div>
      <Button
        size="small"
        onClick={onOperate}
        danger
        className="light_danger"
        disabled={!props.selectedRow?.length}
      >
        取消选配型
      </Button>
      <Modal
        title="取消选配型"
        destroyOnClose
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form ref={formRef} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Form.Item
            label="取消原因"
            name="returnReason"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Select>
              <Select.Option value={'缺品牌/型号'}>缺品牌型号</Select.Option>
              <Select.Option value={'缺参数图片或定制品信息'}>缺参数图片或定制品信息</Select.Option>
              <Select.Option value={'代购风险'}>代购风险</Select.Option>
              <Select.Option value={'信息错误,需确认'}>信息错误,需确认</Select.Option>
              <Select.Option value={'非营业许可范围内'}>非营业许可范围内</Select.Option>
              <Select.Option value={'厂家停产,暂无替代'}>厂家停产,暂无替代</Select.Option>
              <Select.Option value={'项目被报备,暂无报价'}>项目被报备,暂无报价</Select.Option>
              <Select.Option value={'重复询价'}>重复询价</Select.Option>
              <Select.Option value={'物流退回'}>物流退回(无法进口,危险品等)</Select.Option>
              <Select.Option value={'无法出口'}>无法出口</Select.Option>
              <Select.Option value={'Discontinued'}>Discontinued Product</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="取消原因描述" name="returnReasonDesc">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CancelBtn;
