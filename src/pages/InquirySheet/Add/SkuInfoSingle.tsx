/* eslint-disable @typescript-eslint/no-unused-expressions */
import { getChildrenCategory } from '@/services';
import { lineAndSegment, customerMatchSku, getCustomerltemCodeBySku } from '@/services/InquirySheet';
import { Button, Drawer, Form, Input, InputNumber, Modal, Radio, Select, Space, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { ColumnsType } from 'antd/es/table';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import BrandCom from '../../components/BrandCom';
import Uom from '../../components/Uom';
import '../index.less';
import { useModel } from 'umi';
import { validatePriceBase } from '@/util/index';
const SkuInfoSingle: React.FC<{
  customerCode: string;
  getSingleSkuData: any;
  visible?: boolean;
  skuInitial?: any;
}> = (props: any, ref: AsyncGeneratorFunction) => {
  const { getKeys } = useModel('basicUnit', (model) => ({ getKeys: model.getKeys }));
  const [visible, setVisible]: any = useState(false);
  const [isCg, setIsCg]: any = useState(false);
  const [isSku, setIsSku]: any = useState(false);
  const [errMsg, setErrMsg]: any = useState('');
  const [lineList, setLineList]: any = useState([]);
  const [sementList, setSementList]: any = useState([]);
  const [dataSource, setDataSource]: any = useState([]);
  const [replaceList, setReplaceList]: any = useState([]);
  const [cqcgList, setCqcgList]: any = useState([]);
  const [selectedRowsDate, setSelectedRows]: any = useState([]);
  const [reqBrandName, setReqBrandName]: any = useState('');
  const formRef = React.createRef<FormInstance>();
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const productChange = (val: any, options?: any, type: any) => {
    // const res = formRef.current?.getFieldValue('sku');
    // if (!res) formRef.current?.setFieldsValue({ reqSegmentCode: '', reqSegmentName: '' });
    if (options?.children) {
      formRef.current?.setFieldsValue({ reqProductLineName: options.children });
    }
    if (val) {
      getChildrenCategory(val).then((resd: any) => {
        if (resd.errCode === 200) {
          setSementList(resd.data.dataList);
          !type && form.setFieldsValue({ reqSegmentCode: '', reqSegmentName: '' });
        }
      });
    } else {
      setSementList([]);
    }
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
    setSelectedRows([]);
    setDataSource([]);
  };
  const columns: ColumnsType<DataType> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
    },
    {
      title: '客户物料号',
      dataIndex: 'customerSku',
    },
    {
      title: '万物集SKU号',
      dataIndex: 'sku',
    },
    {
      title: '产品名称',
      dataIndex: 'productNameZh',
      ellipsis: true,
    },
  ];
  // 暴露组件的方法
  useImperativeHandle(ref, () => ({
    setForm: async (res: any) => {
      formRef.current?.setFieldsValue(res);
      setReqBrandName(res.reqBrandName);
      if (res.sku) setIsSku(true);
      if (res.reqSegmentCode) {
        productChange(res.reqProductLineCode, null, true);
      }
      if (res.reqIsLongRequest) setIsCg(true);
      // 初始化需求segementlist
      if (res?.reqProductLineCode)
        getChildrenCategory(res.reqProductLineCode).then((resd: any) => {
          if (resd.errCode === 200) {
            setSementList(resd.data.dataList);
          }
        });
    },
    resetForm: async () => {
      formRef.current?.resetFields();
      setIsCg(false);
      setIsSku(false);
    },
  }));
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
  useEffect(() => {
    setVisible(props.visible);
  }, [props.visible]);
  useEffect(() => {
    formRef.current?.validateFields(['reqCustomerSku']);
  }, [errMsg]);
  const onClose = () => {
    setIsCg(false);
    setIsSku(false);
    props.getSingleSkuData();
  };
  const onOk = () => {
    formRef.current?.validateFields().then((res: any): any => {
      res.reqIsLongRequestStr = res.reqIsLongRequest === 1 ? '是' : '否';
      if (!res.reqMfgSku && !res.reqPrice) {
        Modal.error({ title: '需求制造商型号与客户期望单价必须选择填一个!' });
        return false;
      }
      if (!res.reqIsLongRequest && res.reqIsLongRequest === 1) {
        Modal.error({ title: '长期采购数量必填!' });
        return false;
      }
      confirm({
        title: '确定保存吗？',
        onOk() {
          res.customerCode = props.customerCode;
          props.getSingleSkuData(res);
        },
      });
    });
  };
  const segmentChange = (val: any, options?: any) => {
    formRef.current?.setFieldsValue({ reqSegmentName: options.children });
  };
  const cgChange = (e: any) => {
    setIsCg(e.target.value === 1);
  };
  const skuBlur = (flg) => {
    const res = formRef.current?.getFieldValue('sku');
    const refMtg: any = formRef.current;
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
      lineAndSegment(res).then(async (resd: any) => {
        if (resd.errCode === 200 && resd.data?.reqProductLineCode) {
          
          refMtg?.setFieldsValue(resd.data);
          refMtg?.setFieldsValue({
            reqUom: resd.data.reqUomCode + '_' + resd.data.reqUom,
          });
          setReqBrandName(resd.data?.reqBrandName);
          productChange(resd.data.reqProductLineCode, resd.data, true);
          if (flg !== false) {
            const resNo = await getCustomerltemCodeBySku({sku:res, customerCode:props.customerCode})
            if (resNo.data) {
              refMtg?.setFieldsValue({
                reqCustomerSku: resNo.data
              });
            }
          }
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
      <Drawer
        title="操作需求明细"
        size="large"
        placement="right"
        destroyOnClose
        maskClosable={false}
        forceRender={true}
        onClose={onClose}
        visible={visible}
        extra={
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" onClick={onOk}>
              确定
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          size="small"
          className="sku-single"
          ref={formRef}
          autoComplete="off"
          initialValues={{ reqReplaceable: 0, reqIsLongRequest: 0 }}
        >
          <Form.Item
            label="需求SKU号"
            name="sku"
            rules={[{ required: false, max: 10, message: '需求SKU号最多10位!' }]}
          >
            <Input showCount maxLength={10} onBlur={skuBlur} />
          </Form.Item>
          <Form.Item label="" name={'index'} style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          <Form.Item label="" name={'sid'} style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          <Form.Item label="" name={'reqProductLineName'} style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          <Form.Item label="" name={'reqSegmentName'} style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          <Form.Item
            label="需求产品名称"
            name={'reqProductName'}
            rules={[{ required: true, max: 120, message: '请输入合适长度的需求产品名称!' }]}
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
          <Form.Item
            label="需求制造商型号"
            name="reqMfgSku"
            className="oneRequire"
            rules={[{ required: false, max: 80, message: '需求制造商型号长度超长，请重新编辑!' }]}
          >
            <Input
              showCount
              maxLength={80}
              placeholder="需求制造商型号与客户期望单价必须选择填一个!"
            />
          </Form.Item>
          <Form.Item
            label="客户期望单价"
            name="reqPrice"
            rules={[{ validator: validatePriceBase, max: 17, message: '请填写合理的客户期望单价' }]}
          >
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
            rules={[
              { required: true, validator: validatePriceBase, message: '请填写合理的需求数量' },
            ]}
          >
            <InputNumber />
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
          <Form.Item
            label="客户物料号"
            name="reqCustomerSku"
            validateTrigger="onBlur"
            rules={[
              {
                required: false,
                validator: async (rule, value) => {
                  if (value && !props.customerCode) {
                    throw new Error('直接输入客户物料号时请先选择客户！');
                  } else if (value && props.customerCode && errMsg) {
                    throw new Error(errMsg);
                  }
                },
              },
            ]}
          >
            <Input
              showCount
              maxLength={20}
              onBlur={async () => {
                const value = formRef.current?.getFieldValue('reqCustomerSku');
                if (value && props.customerCode) {
                  const res = await customerMatchSku({
                    customerCode: props.customerCode,
                    customerSku: value,
                  });
                  if (res?.data?.dataList) {
                    setDataSource(res.data.dataList);
                    setChildrenDrawer(true);
                    setErrMsg('');
                  } else {
                    setErrMsg(res.errMsg);
                  }
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label="客户行号"
            name="reqPoItemNo"
            rules={[{ required: false, max: 6, message: '客户行号超长!' }]}
          >
            <Input showCount maxLength={6} />
          </Form.Item>
          <Form.Item
            label="需求技术参数/规格"
            name="reqTechSpec"
            rules={[{ required: false, max: 100, message: '需求技术参数/规格超长!' }]}
          >
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
            rules={[
              {
                validator: validatePriceBase,
                required: isCg,
                min: 0,
                message: '请填写合理的长期采购数量',
              },
            ]}
          >
            <InputNumber min={0} placeholder="请输入(是否长期采购为是时，该项必填)" />
          </Form.Item>
          <Form.Item
            label="需求描述"
            name="reqRemark"
            rules={[{ required: false, max: 255, message: '需求描述超长!' }]}
          >
            <Input.TextArea
              placeholder="请填写需求描述"
              showCount
              maxLength={255}
              style={{ height: 120 }}
            />
          </Form.Item>
        </Form>
        <Drawer
          title="客户物料号匹配"
          width={550}
          onClose={onChildrenDrawerClose}
          visible={childrenDrawer}
          extra={
            <Space>
              <Button onClick={onChildrenDrawerClose}>取消</Button>
              <Button
                type="primary"
                disabled={!selectedRowsDate.length}
                onClick={() => {
                  if (selectedRowsDate && selectedRowsDate.length) {
                    formRef.current?.setFieldsValue({
                      sku: selectedRowsDate[0].sku,
                    });
                    skuBlur(false);
                    onChildrenDrawerClose();
                  }
                }}
              >
                确定
              </Button>
            </Space>
          }
        >
          <Table
            size="small"
            rowKey="orderNo"
            dataSource={dataSource}
            columns={columns}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedRowsDate.map(e => e.orderNo),
              onChange: (selectedRowKeys: React.Key[], selectedRows) => {
                setSelectedRows(selectedRows);
              },
            }}
          />
        </Drawer>
      </Drawer>
    </div>
  );
};
export default forwardRef(SkuInfoSingle);
