import { getChildrenCategory } from '@/services';
import { editInqLine, lineAndSegment } from '@/services/InquirySheet';
import { Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import BrandCom from '../../components/BrandCom';
import Uom from '../../components/Uom';
import '../index.less';
import { useModel } from 'umi';
const EditSku: React.FC<{
  id: string;
  customerCode: string;
}> = (props: any, ref: AsyncGeneratorFunction) => {
  const { getKeys } = useModel('basicUnit', (model) => ({ getKeys: model.getKeys }));
  const [isCg, setIsCg]: any = useState(false);
  const [isSku, setIsSku]: any = useState(false);
  const [lineList, setLineList]: any = useState([]);
  const [sementList, setSementList]: any = useState([]);
  const [replaceList, setReplaceList]: any = useState([]);
  const [cqcgList, setCqcgList]: any = useState([]);
  const [reqBrandName, setReqBrandName]: any = useState('');
  const formRef = React.createRef<FormInstance>();
  const [form] = Form.useForm();
  const productChange = (val: any, options?: any) => {
    const res = formRef.current?.getFieldValue('sku');
    if (!res) formRef.current?.setFieldsValue({ reqSegmentCode: '' });
    if (options?.children) {
      formRef.current?.setFieldsValue({ reqProductLineName: options.children });
    }
    if (val) {
      getChildrenCategory(val).then((resd: any) => {
        if (resd.errCode === 200) {
          setSementList(resd.data.dataList);
        }
      });
    } else {
      setSementList([]);
    }
  };
  useEffect(() => {
    if (props.id) {
      editInqLine(props.id).then((res: any) => {
        if (res.errCode === 200 && res.data) {
          const params = res.data;
          params.sid = props.id;
          form?.setFieldsValue(params);
          setReqBrandName(params.reqBrandName);
          if (params.sku) setIsSku(true);
          if (params.reqSegmentCode) {
            productChange(params.reqProductLineCode);
          }
          if (params.reqIsLongRequest) setIsCg(true);
        }
      });
    }
  }, [props.id]);
  useEffect(() => {
    getChildrenCategory(0).then((res: any) => {
      if (res.errCode === 200) {
        setLineList(res.data.dataList);
      }
    });
    getKeys(['inqReqReplaceableEnum', 'whetherEnum']).then((res: any) => {
      if (res) {
        setReplaceList(res.inqReqReplaceableEnum);
        setCqcgList(res.whetherEnum);
      }
    });
  }, []);
  const onsubmit = async (): Promise<any> => {
    const res = await formRef.current?.validateFields();
    if (!res) return false;
    res.reqIsLongRequestStr = res.reqIsLongRequest === 1 ? '是' : '否';
    if (!(res.reqMfgSku || res.reqPrice) && res.reqMfgSku && res.reqPrice) {
      Modal.error({ title: '需求制造商型号与客户期望单价只能选择填一个!' });
      return false;
    }
    if (!res.reqIsLongRequest && res.reqIsLongRequest === 1) {
      Modal.error({ title: '长期采购数量必填!' });
      return false;
    }
    return res;
  };
  const segmentChange = (val: any, options?: any) => {
    formRef.current?.setFieldsValue({ reqSegmentName: options.children });
  };
  const cgChange = (e: any) => {
    setIsCg(e.target.value === 1);
  };
  // const skuBlur = () => {
  //   const res = formRef.current?.getFieldValue('sku');
  //   const refMtg: any = formRef.current;
  //   if (res) {
  //     setIsSku(true);
  //     lineAndSegment(res).then((resd: any) => {
  //       if (resd.errCode === 200) {
  //         refMtg?.setFieldsValue(resd.data);
  //         productChange(resd.data.reqProductLineCode, resd.data);
  //       }
  //     });
  //   } else {
  //     setIsSku(false);
  //   }
  // };
  // 暴露组件的方法
  useImperativeHandle(ref, () => ({
    onsubmit,
  }));
  const skuBlur = () => {
    const res = formRef.current?.getFieldValue('sku');
    const refMtg: any = formRef.current;
    console.log(res, 'res===');
    if (!res || res.length < 5) {
      setIsSku(false);
      refMtg?.setFieldsValue({
        reqSegmentName: '',
        reqProductLineName: '',
        reqProductLineCode: '',
        reqSegmentCode: '',
      });
      return;
    }
    if (res) {
      setIsSku(true);
      lineAndSegment(res).then((resd: any) => {
        if (resd.errCode === 200 && resd.data?.reqProductLineCode) {
          refMtg?.setFieldsValue(resd.data);
          setReqBrandName(resd.data?.reqBrandName);
          productChange(resd.data.reqProductLineCode, resd.data);
        } else {
          setIsSku(false);
          refMtg?.setFieldsValue({
            reqSegmentName: '',
            reqProductLineName: '',
            reqProductLineCode: '',
            reqSegmentCode: '',
          });
        }
      });
    } else {
      setIsSku(false);
    }
  };
  return (
    <div className="base-info">
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        size="small"
        className="sku-single"
        ref={formRef}
        initialValues={{ reqReplaceable: 0, reqIsLongRequest: 0 }}
      >
        <Form.Item label="需求SKU号" name="sku">
          <Input showCount maxLength={100} onBlur={skuBlur} />
        </Form.Item>
        <Form.Item label="" name={'index'} style={{ display: 'none' }} />
        <Form.Item label="" name={'sid'} style={{ display: 'none' }} />
        <Form.Item label="" name={'reqProductLineName'} style={{ display: 'none' }} />
        <Form.Item label="" name={'reqSegmentName'} style={{ display: 'none' }} />
        <Form.Item
          label="需求产品名称"
          name={'reqProductName'}
          rules={[{ required: true, max: 120, message: '请输入需求产品名称!' }]}
        >
          <Input showCount maxLength={120} />
        </Form.Item>
        <Form.Item label="需求产品品牌" name="reqBrandName" style={{ display: 'none' }}>
          <Input readOnly />
        </Form.Item>
        <Form.Item label="需求产品品牌" name="reqBrandCode">
          <BrandCom
            isHidden={true}
            isEdit={false}
            name={reqBrandName}
            onType={(t1: any, t2: any, name: any) => {
              formRef.current?.setFieldsValue({ reqBrandName: name });
            }}
          />
        </Form.Item>
        <Form.Item label="需求制造商型号" name="reqMfgSku">
          <Input showCount maxLength={80} />
        </Form.Item>
        <Form.Item label="客户期望单价" name="reqPrice">
          <InputNumber addonAfter="元" maxLength={17} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="需求采购单位"
          name="reqUom"
          rules={[{ required: true, message: '请输入需求采购单位!' }]}
        >
          <Uom isProductOil={'0'} />
        </Form.Item>
        <Form.Item
          label="需求数量"
          name="reqQty"
          rules={[{ required: true, message: '请输入需求数量!' }]}
        >
          <InputNumber maxLength={17} />
        </Form.Item>
        <Form.Item
          label="是否可替换"
          name="reqReplaceable"
          rules={[{ required: true, message: '请选择是否可替换!' }]}
        >
          <Radio.Group>
            {replaceList &&
              replaceList.map((item: any) => (
                <Radio value={item.code} key={item.code}>
                  {item.name}
                </Radio>
              ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="需求SKU号" name="sku">
          <Input showCount maxLength={100} onBlur={skuBlur} />
        </Form.Item>
        <Form.Item label="客户物料号" name="reqCustomerSku">
          <Input showCount maxLength={100} />
        </Form.Item>
        <Form.Item label="客户行号" name="reqPoItemNo">
          <Input showCount maxLength={100} />
        </Form.Item>
        <Form.Item label="需求技术参数/规格" name="reqTechSpec">
          <Input showCount maxLength={100} />
        </Form.Item>
        <Form.Item label="需求产品线" name="reqProductLineCode">
          <Select onChange={productChange} disabled={isSku}>
            {lineList &&
              lineList.map((item: any) => (
                <Select.Option value={item.categoryCode} key={item.categoryCode}>
                  {item.categoryName}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item label="需求Segment" name="reqSegmentCode">
          <Select disabled={isSku} onSelect={segmentChange}>
            {sementList &&
              sementList.map((item: any) => (
                <Select.Option value={item.categoryCode} key={item.categoryCode}>
                  {item.categoryName}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item label="是否长期采购" name="reqIsLongRequest">
          <Radio.Group onChange={cgChange}>
            {cqcgList &&
              cqcgList.map((item: any) => (
                <Radio value={item.code} key={item.code}>
                  {item.name}
                </Radio>
              ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="长期采购数量"
          name="reqLongRequestNum"
          rules={[{ required: isCg, message: '请填写长期采购数量!' }]}
        >
          <InputNumber placeholder="请输入(是否长期采购为是时，该项必填)" maxLength={17} />
        </Form.Item>
        <Form.Item label="需求描述" name="reqRemark">
          <Input.TextArea
            placeholder="请填写需求描述"
            showCount
            maxLength={255}
            style={{ height: 120 }}
          />
        </Form.Item>
      </Form>
    </div>
  );
};
export default forwardRef(EditSku);
