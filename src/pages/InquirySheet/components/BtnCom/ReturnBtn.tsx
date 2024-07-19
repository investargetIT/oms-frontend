import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Select, Radio, Input, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { inqBack, backByInq } from '@/services/InquirySheet';
import { history, useLocation } from 'umi';
const ReturnBtn: React.FC<{
  selectedRow?: any;
  inquiryId?: any;
  recall?: any;
  lastPath?: any;
  isOrder?: any;
}> = (props: any) => {
  const location: any = useLocation();
  const pathParams: any = location.state;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localPath, setLocalPath] = useState('');
  const formRef = React.createRef<FormInstance>();
  const [selectOptin, setSelectOptin]: any = useState('');
  useEffect(() => {
    const path: any = pathParams?.sorurceType || history.location.pathname.split('/').pop();
    setLocalPath(path);
    if (path == '0') {
      console.log(localPath);
    }
    if (['ae', 'te'].includes(path)) {
      setSelectOptin([
        { value: 'PL Segment缺失', name: 'PL Segment缺失' },
        { value: '品牌缺失', name: '品牌缺失' },
        { value: '参数缺失', name: '参数缺失' },
        { value: '重复询价', name: '重复询价' },
        { value: '澄清未果', name: '澄清未果' },
        { value: '产线报价', name: '产线报价' },
        { value: '推荐目录品', name: '推荐目录品' },
        { value: '其他', name: '其他' },
      ]);
    } else if (['RFQquote'].includes(path)) {
      setSelectOptin([
        { value: '重复询价', name: '重复询价' },
        { value: '其他', name: '其他' },
      ]);
    } else {
      setSelectOptin([
        { value: '缺品牌型号', name: '缺品牌型号' },
        { value: '缺参数图片或定制品信息', name: '缺参数图片或定制品信息' },
        { value: '代购风险', name: '代购风险' },
        { value: '信息错误,需确认', name: '信息错误,需确认' },
        { value: '非营业许可范围内', name: '非营业许可范围内' },
        { value: '厂家停产,暂无替代', name: '厂家停产,暂无替代' },
        { value: '项目被报备,暂无报价', name: '项目被报备,暂无报价' },
        { value: '重复询价', name: '重复询价' },
        { value: '物流退回', name: '物流退回(无法进口,危险品等)' },
        { value: '无法出口', name: '无法出口' },
        { value: 'Discontinued', name: 'Discontinued Product' },
        { value: 'Sourcing推荐目录品', name: 'Sourcing推荐目录品' },
        { value: '其他', name: '其他' },
      ]);
    }
  }, []);
  const onOperate = (): boolean => {
    if (props.isOrder && !props.inquiryId && !props.selectedRow?.length) {
      Modal.warning({ title: '请选择需要操作的数据!' });
      return false;
    }
    setIsModalVisible(true);
    return true;
  };
  const handleOk = () => {
    let inqLineIdList: any = []
    const path: any = history.location.pathname.split('/').pop();
    if (path === 'ae') {
      props.selectedRow.forEach(e => {
        inqLineIdList = [...inqLineIdList, ...e.inqLineIds]
      })
    } else {
      inqLineIdList = props.selectedRow?.map((item: any) => item.skuVo?.inqLineId);
    }
    formRef.current?.validateFields().then((res: any) => {
      if (inqLineIdList && inqLineIdList.length > 0) {
        res.inqLineIdList = inqLineIdList;
      } else {
        res.inquiryId = props.inquiryId;
      }
      Modal.confirm({
        title: '确定进行退回处理?',
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          let resd = null;
          // if (props.isOrder) {
          //   resd = await backByInq(res.inquiryId, res);
          // } else {
          //   const path: any = pathParams?.sorurceType || history.location.pathname.split('/').pop();
          //   resd = await inqBack(path, res.toLineStatus, res);
          // }
          // if (resd.errCode === 200) {
          //   message.success(resd.errMsg);
          //   setIsModalVisible(false);
          //   if (props.recall) {
          //     props.recall();
          //   } else {
          //     history.go(-1);
          //   }
          // } else {
          //   message.error(resd.errMsg);
          // }
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
        disabled={
          (props.isOrder && !props.inquiryId) || (!props.isOrder && !props.selectedRow?.length)
        }
        onClick={onOperate}
        danger
        className="light_danger"
      >
        {props.isOrder ? '整单退回' : '退回'}
      </Button>
      <Modal
        title="退回"
        destroyOnClose
        maskClosable={false}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          ref={formRef}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ toLineStatus: '20' }}
        >
          <Form.Item
            label="退回类型"
            name="toLineStatus"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Radio.Group>
              <Radio value={'20'}>退回至销售</Radio>
              {['otherchannel', 'quote', 'te', 'RFQquote'].includes(props.lastPath) && (
                <Radio value={'80'}>退回至AE</Radio>
              )}
              {/* {props.lastPath === 'otherchannel' && <Radio value={'110'}>退回至TE</Radio>} */}
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="退回原因"
            name="returnReason"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Select>
              {selectOptin &&
                selectOptin.map((item: any) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.name}
                  </Select.Option>
                ))}
              {/*['ae', 'te'].includes(localPath) ? (
                <React.Fragment>
                  <Select.Option value={'PL Segment缺失'}>PL Segment缺失</Select.Option>
                  <Select.Option value={'品牌缺失'}>品牌缺失</Select.Option>
                  <Select.Option value={'参数缺失'}>参数缺失</Select.Option>
                  <Select.Option value={'重复询价'}>重复询价</Select.Option>
                  <Select.Option value={'澄清未果'}>澄清未果</Select.Option>
                  <Select.Option value={'产线报价'}>产线报价</Select.Option>
                  <Select.Option value={'其他'}>其他</Select.Option>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Select.Option value={'缺品牌型号'}>缺品牌型号</Select.Option>
                  <Select.Option value={'缺参数图片或定制品信息'}>
                    缺参数图片或定制品信息
                  </Select.Option>
                  <Select.Option value={'代购风险'}>代购风险</Select.Option>
                  <Select.Option value={'信息错误,需确认'}>信息错误,需确认</Select.Option>
                  <Select.Option value={'非营业许可范围内'}>非营业许可范围内</Select.Option>
                  <Select.Option value={'厂家停产,暂无替代'}>厂家停产,暂无替代</Select.Option>
                  <Select.Option value={'项目被报备,暂无报价'}>项目被报备,暂无报价</Select.Option>
                  <Select.Option value={'重复询价'}>重复询价</Select.Option>
                  <Select.Option value={'物流退回'}>物流退回(无法进口,危险品等)</Select.Option>
                  <Select.Option value={'无法出口'}>无法出口</Select.Option>
                  <Select.Option value={'Discontinued'}>Discontinued Product</Select.Option>
                  <Select.Option value={'Sourcing推荐目录品'}>Sourcing推荐目录品</Select.Option>
                  <Select.Option value={'其他'}>其他</Select.Option>
                </React.Fragment>
              )*/}
            </Select>
          </Form.Item>
          <Form.Item label="退回原因描述" name="returnReasonDesc">
            <Input.TextArea rows={2} showCount maxLength={255} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReturnBtn;
