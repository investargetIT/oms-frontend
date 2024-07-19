/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react';
import { Button, Modal, Form, Select, Input, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { inqBack } from '@/services/InquirySheet';
import { history, useLocation } from 'umi';
const RejectBtn: React.FC<{
  selectedRow?: any;
  recall?: any;
  backVal?: any;
  lastPath?: any;
  inquiryId?: any;
}> = (props: any) => {
  const location: any = useLocation();
  const pathParams: any = location.state;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const formRef = React.createRef<FormInstance>();
  const onOperate = (): boolean => {
    if (!props.selectedRow?.length && !props.inquiryId) {
      Modal.warning({ title: '请选择需要操作的数据!' });
      return false;
    }

    // const path: any = pathParams?.sorurceType || history.location.pathname.split('/').pop();
    // if (['sourcing-pcm'].includes(path)) {
    //   setIsModalVisible(false);
    //   const inqLineIdList = props.selectedRow.map((item: any) => item.skuVo?.inqLineId);
    //   const params = {
    //     returnReason: '',
    //     inquiryId: '',
    //   };
    //   if (inqLineIdList && inqLineIdList.length > 0) {
    //     params.inqLineIdList = inqLineIdList;
    //   }
    //   if (['sourcing-pcm', 'sourcing-pcd'].includes(path)) {
    //     params.returnReason = '请修改报价信息';
    //   }
    //   params.inquiryId = props.inquiryId;
    //   Modal.confirm({
    //     title: '确定进行审核退回处理?',
    //     okText: '确认',
    //     cancelText: '取消',
    //     onOk: () => {
    //       inqBack(path, '150', params).then((resd: any) => {
    //         if (resd.errCode === 200) {
    //           setIsModalVisible(false);
    //           message.success(resd.errMsg);
    //           if (props.recall) {
    //             props.recall();
    //           } else {
    //             history.go(-1);
    //           }
    //         } else {
    //           message.error(resd.errMsg);
    //         }
    //       });
    //     },
    //   });
    // } else {
    //   setIsModalVisible(true);
    // }
    setIsModalVisible(true);
    return true;
  };
  const handleOk = () => {
    const path: any = pathParams?.sorurceType || history.location.pathname.split('/').pop();
    let toLineStatus = '';
    if (path === 'aepcm') {
      toLineStatus = '80';
    } else if (path === 'tepcm') {
      toLineStatus = '110';
    } else if (['sourcing-pcm', 'sourcing-pcd'].includes(path)) {
      toLineStatus = '150';
    }
    const inqLineIdList = props.selectedRow.map((item: any) => item.skuVo?.inqLineId);
    formRef.current?.validateFields().then((res: any) => {
      if (inqLineIdList && inqLineIdList.length > 0) {
        res.inqLineIdList = inqLineIdList;
      }
      res.inquiryId = props.inquiryId;

      if (['sourcing-pcm', 'sourcing-pcd'].includes(path)) {
        res.returnReason = '请修改报价信息';
      }
      const params = {
        inqLineIdList: res.inqLineIdList,
        inquiryId: res.inquiryId,
        returnReason: res.returnReason,
        returnReasonDesc: res.returnReasonDesc_PCM || res.returnReasonDesc,
      };
      // inqBack(path, toLineStatus, params).then((resd: any) => {
      //   if (resd.errCode === 200) {
      //     setIsModalVisible(false);
      //     message.success(resd.errMsg);
      //     if (props.recall) {
      //       props.recall();
      //     } else {
      //       history.go(-1);
      //     }
      //   } else {
      //     message.error(resd.errMsg);
      //   }
      // });
      
      //以下是原来就屏蔽的
      // Modal.confirm({
      //   title: '确定进行审核退回处理?',
      //   okText: '确认',
      //   cancelText: '取消',
      //   onOk: () => {
      //     inqBack(path, toLineStatus, params).then((resd: any) => {
      //       if (resd.errCode === 200) {
      //         setIsModalVisible(false);
      //         message.success(resd.errMsg);
      //         if (props.recall) {
      //           props.recall();
      //         } else {
      //           history.go(-1);
      //         }
      //       } else {
      //         message.error(resd.errMsg);
      //       }
      //     });
      //   },
      // });
    });
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div>
      <Button
        size="small"
        // disabled={!(props.selectedRow?.length || props.inquiryId)}
        // disabled={!props.selectedRow?.length}
        disabled={!props.selectedRow?.length && !props.backVal}
        onClick={onOperate}
        danger
        className="light_danger"
      >
        审核退回
      </Button>
      <Modal
        title="审核退回"
        destroyOnClose
        maskClosable={false}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {/* {!['sourcing-pcm', 'sourcing-pcd'].includes(
          pathParams?.sorurceType || history.location.pathname.split('/').pop(),
        ) ? (
          <Form ref={formRef} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <Form.Item
              label="退回原因"
              name="returnReason"
              rules={[{ required: true, message: '请选择' }]}
            >
              <Select> */}
        {/* <Select.Option value={'缺品牌/型号'}>缺品牌型号</Select.Option>
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
              <Select.Option value={'Sourcing推荐目录品'}>Sourcing推荐目录品</Select.Option> */}
        {/* <Select.Option value={'有目录品'}>有目录品</Select.Option>
                <Select.Option value={'应退回销售'}>应退回销售</Select.Option>
                <Select.Option value={'应sourcing'}>应sourcing</Select.Option>
                <Select.Option value={'其他'}>其他</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="退回原因描述" name="returnReasonDesc">
              <Input.TextArea rows={2} showCount maxLength={255} />
            </Form.Item>
          </Form>
        ) : (
          <Form ref={formRef} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}></Form>
        )
        } */}
        {!['sourcing-pcm', 'sourcing-pcd'].includes(
          pathParams?.sorurceType || history.location.pathname.split('/').pop(),
        ) ? (
          <Form ref={formRef} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <Form.Item
              label="退回原因"
              name="returnReason"
              rules={[{ required: true, message: '请选择' }]}
            >
              <Select>
                {/* <Select.Option value={'缺品牌/型号'}>缺品牌型号</Select.Option>
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
              <Select.Option value={'Sourcing推荐目录品'}>Sourcing推荐目录品</Select.Option> */}
                <Select.Option value={'有目录品'}>有目录品</Select.Option>
                <Select.Option value={'应退回销售'}>应退回销售</Select.Option>
                <Select.Option value={'应sourcing'}>应sourcing</Select.Option>
                <Select.Option value={'其他'}>其他</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="退回原因描述" name="returnReasonDesc">
              <Input.TextArea rows={2} showCount maxLength={255} />
            </Form.Item>
          </Form>
        ) : (
          <Form ref={formRef} style={{ padding: '15px 25px' }} layout="vertical">
            <Form.Item label="退回原因描述:" name="returnReasonDesc_PCM">
              <Input.TextArea
                rows={2}
                showCount
                maxLength={200}
                placeholder="请输入退回原因的补充说明"
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default RejectBtn;
