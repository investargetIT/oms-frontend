/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Form, Input, DatePicker, Select, Row, Col, Modal, InputNumber } from 'antd';
import moment from 'moment';
import './add.less';
import ModalList from '../components/ModalList';
import { customCols, merchantCols, r3Cols } from './constant';
import { useLocation, useModel, useParams } from 'umi';
import { crmCustomer, getCustomerList, getFreeShipping } from '@/services/InquirySheet';
import { getR3ConList } from '@/services/SalesOrder';
const BaseInfo: React.FC<{ params: any; getCustomerCode: Function }> = (props: any, ref: any) => {
  const pathParams: any = useParams();
  const { getKeys } = useModel('basicUnit', (model) => ({ getKeys: model.getKeys }));
  const { initialState } = useModel('@@initialState');
  const [cosPurList, setCosPurList] = useState([]);
  const [cdygList, setCdygList] = useState([]);
  const [isEdit, setIsIdEdit] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('选择客户');
  const [modalColumn, setModalColumn]: any = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [reqList, setReqList] = useState([]);
  const [modalVal, setModalVal] = useState({});
  const [channelList, setChannelList] = useState([]);
  const [form] = Form.useForm();
  const location: any = useLocation();

  const validateMessages = {
    required: '${label} 不可缺少!',
  };
  // 暴露组件的方法
  useImperativeHandle(ref, () => ({
    getBaseForm: async () => {
      const res = await form?.validateFields();
      if (res?.expectedReplyTime) {
        res.expectedReplyTime = moment(res.expectedReplyTime).format('YYYY-MM-DD');
      }
      return res;
    },
    getBaseFormVal: async () => {
      return await form?.getFieldsValue(true);
    },
  }));
  const onSearch = (val: number) => {
    const customerCode = form?.getFieldValue('customerCode');
    if (val === 1) {
      setModalTitle('选择客户');
      setModalColumn(customCols);
      setIsModalVisible(true);
    } else if (val === 2) {
      if (!customerCode) {
        Modal.error({ title: '请先选择客户联系人' });
        return;
      }
      setModalTitle('选择联系人');
      setModalColumn(r3Cols);
      setIsModalVisible(true);
    } else if (val === 3) {
      if (!customerCode) {
        Modal.error({ title: '请先选择客户联系人' });
        return;
      }
      setModalTitle('选择商机');
      setModalColumn(merchantCols);
      setIsModalVisible(true);
    }
  };
  const disabledDate = (current: any) => {
    return !(current > moment().startOf('day'));
  };
  const getSelModal = (val: any) => {
    if (!val || !val[0]) return;
    if (modalTitle === '选择客户') {
      form?.setFieldsValue({
        customerCode: val[0].customerCode,
        customerLevel: val[0].customerLevel,
        customerLevelName: val[0].customerLevelName,
        customerName: val[0].customerName,
        contactName: '',
        contactCodeR3: '',
        salesName: val[0].salesName,
        deptName: val[0].branchDivisionName,
        branchCode: val[0].branchCode,
        branchCompanyName: val[0].branchCompanyName,
      });
      if (val[0].customerCode) {
        getFreeShipping(val[0].customerCode).then((freeRes: any) => {
          if (freeRes.errCode === 200 && freeRes.data) {
            form?.setFieldsValue(freeRes.data);
          }
        });
      }
      props.getCustomerCode(val[0].customerCode);
      getR3ConList({ customerCode: val[0].customerCode, pageSize: 10, pageNumber: 1 }).then(
        (res: any) => {
          if (res.errCode === 200 && res.data?.total === 1) {
            const temp = res.data.dataList[0];
            form?.setFieldsValue({
              contactName: temp.contactName,
              contactCodeR3: temp.contactCodeR3,
            });
          }
        },
      );
    } else if (modalTitle === '选择联系人') {
      form?.setFieldsValue({
        contactName: val[0].contactName,
        contactCodeR3: val[0].contactCode,
      });
    } else if (modalTitle === '选择商机') {
      form?.setFieldsValue({
        oppoId: val[0].oppoId,
        oppoValue: val[0].oppoValue,
      });
    }
  };
  const operateMethod = (val: any) => {
    setModalVal(val);
  };
  useEffect(() => {
    getKeys([
      'custPurposeEnum',
      'toOrderEstimationEnum',
      'reqTypeEnum',
      'inqTypeEnum',
      'channelEnum',
    ]).then((res: any) => {
      if (res) {
        setReqList(res.reqTypeEnum);
        const newAl = res.inqTypeEnum;
        for (const i in newAl) {
          newAl[0].disabled =
            form.getFieldValue('channel') == 10 && props.params?.apiMark != 1 ? false : true;
          newAl[1].disabled =
            form.getFieldValue('channel') != 10 && props.params?.apiMark != 1 ? false : true;
        }
        console.log(newAl);

        setTypeList(res.inqTypeEnum);
        setCosPurList(res.custPurposeEnum);
        setCdygList(res.toOrderEstimationEnum);
        setChannelList(res.channelEnum);
      }
    });
    if (pathParams?.id && !location.state) {
      //?当有链接后面有  id  的时候，就禁用
      setIsIdEdit(true);
    } else if (pathParams?.id && location.state && location.state.type === 'copy') {
      setIsIdEdit(false);
    } else {
      form?.setFieldsValue({
        createName: initialState?.currentUser?.userName,
      });
    }
  }, []);
  useEffect(() => {
    if (props.params?.sid) {
      const res = props.params;
      if (res.expectedReplyTime) res.expectedReplyTime = moment(res.expectedReplyTime);
      form?.setFieldsValue(res);
      // 判断是否可以店家
      getKeys(['inqTypeEnum']).then((res1: any) => {
        if (res1) {
          setTypeList(
            res1.inqTypeEnum.map((ic: any) => {
              if (ic.code == 1) {
                ic.disabled = props.params.apiMark === 1 ? true : false;
              }
              if (ic.code == 2) {
                ic.disabled = props.params.apiMark != 1 ? true : false;
              }
              return ic;
            }),
          );
        }
      });
    }
  }, [props.params]);
  const getData = async (params: any) => {
    const customerCode = form?.getFieldValue('customerCode');
    if (modalTitle === '选择客户') {
      return await crmCustomer(params);
    } else if (modalTitle === '选择联系人') {
      params.customerCode = customerCode;
      // return await getConList1(params);
      return await getR3ConList(params);
    } else if (modalTitle === '选择商机') {
      params.customerCode = customerCode;
      return await getCustomerList(params);
    }
  };
  const modalOK = () => {
    setIsModalVisible(false);
    getSelModal(modalVal);
  };
  return (
    <div
      className="base-info sku-detail formLabelWithPaddingTopCol"
      id="inquirySheetAddFormBaseInfo"
    >
      <Form
        form={form}
        autoComplete="off"
        initialValues={{
          channel: 10,
          inqType: 1,
          reqType: 10,
          toOrderEstimation: 1,
          custPurpose: 20,
        }}
        validateMessages={validateMessages}
      >
        <Row>
          <Col span={6}>
            <Form.Item label="" name={'contactCodeR3'} style={{ display: 'none' }}>
              <Input />
            </Form.Item>
            <Form.Item label="" name={'oppoId'} style={{ display: 'none' }}>
              <Input />
            </Form.Item>
            <Form.Item label="" name={'freeShipping'} style={{ display: 'none' }}>
              <Input />
            </Form.Item>
            <Form.Item label="" name={'branchCode'} style={{ display: 'none' }}>
              <Input />
            </Form.Item>
            <Form.Item label="" name={'customerCode'} style={{ display: 'none' }}>
              <Input />
            </Form.Item>
            <Form.Item label="" name={'customerLevel'} style={{ display: 'none' }}>
              <Input />
            </Form.Item>
            <Form.Item label="客户名称" name={'customerName'} rules={[{ required: true }]}>
              <Input.Search
                disabled={isEdit}
                readOnly
                placeholder="请选择客户名称"
                enterButton
                onClick={() => {
                  onSearch(1);
                }}
                onSearch={() => {
                  onSearch(1);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="客户级别" name={'customerLevelName'}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="询价类型" name={'inqType'} rules={[{ required: true }]}>
              <Select showSearch placeholder="询价类型">
                {typeList &&
                  typeList.map((item: any) => (
                    <Select.Option value={item.code} key={item.code} disabled={item.disabled}>
                      {item.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="需求类型" name={'reqType'} rules={[{ required: true }]}>
              <Select showSearch placeholder="需求类型">
                {reqList &&
                  reqList.map((item: any) => (
                    <Select.Option value={item.code} key={item.code}>
                      {item.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="成单情况预估" name={'toOrderEstimation'} rules={[{ required: true }]}>
              <Select>
                {cdygList &&
                  cdygList.map((item: any) => (
                    <Select.Option value={item.code} key={item.code}>
                      {item.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="客户目的" name={'custPurpose'} rules={[{ required: true }]}>
              <Select>
                {cosPurList &&
                  cosPurList.map((item: any) => (
                    <Select.Option value={item.code} key={item.code}>
                      {item.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="所属公司" name={'branchCompanyName'} rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="期望回复时间" name={'expectedReplyTime'}>
              <DatePicker
                className="oneRequire"
                format="YYYY-MM-DD"
                disabledDate={disabledDate}
                placeholder="仅有提交时为必填项"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="客户所属部门" name={'deptName'} rules={[{ required: true }]}>
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="R3联系人" name={'contactName'}>
              <Input.Search
                className="oneRequire"
                placeholder="仅有提交时为必填项"
                readOnly
                enterButton
                onClick={() => {
                  onSearch(2);
                }}
                onSearch={() => {
                  onSearch(2);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="商机名称" name={'oppoValue'}>
              <Input.Search
                readOnly
                enterButton
                className="oneRequire"
                placeholder="商机名称和项目名称至少需要填写一个"
                onClick={() => {
                  onSearch(3);
                }}
                onSearch={() => {
                  onSearch(3);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="主销售" name={'salesName'}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="创建人" name={'createName'}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="来源渠道" name={'channel'}>
              <Select disabled={true}>
                {channelList &&
                  channelList.map((item: any) => (
                    <Select.Option value={item.code} key={item.code}>
                      {item.name}
                    </Select.Option>
                  ))}
                {/* <Select.Option value={1}>OMS</Select.Option> */}
                {/* <Select.Option value={'GPS'}>GPS</Select.Option>
                <Select.Option value={'GPS-PunchOut'}>GPS-PunchOut</Select.Option>
                <Select.Option value={'Ezquote'}>Ezquote</Select.Option>
                <Select.Option value={'Ezquote-PunchOut'}>Ezquote-PunchOut</Select.Option> */}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="是否免运费" name={'freeShippingStr'}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="FA期望有效期" name={'faExpectValidDays'}>
              <InputNumber min={1} max={360} addonAfter={'天'} precision={0} />
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item label="项目名称" name={'projectName'} style={{ marginBottom: '16px' }}>
              <Input
                maxLength={100}
                showCount
                className="oneRequire"
                placeholder="商机名称和项目名称至少需要填写一个"
              />
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item label="描述" name={'remark'} style={{ marginBottom: '16px' }}>
              <Input.TextArea
                placeholder="描述"
                showCount
                maxLength={255}
                style={{ height: 120 }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Modal
        title={modalTitle}
        visible={isModalVisible}
        destroyOnClose
        width={'80%'}
        onOk={modalOK}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <ModalList
          modalColumn={modalColumn}
          modalOK={modalOK}
          getData={getData}
          operateMethod={operateMethod}
          modalTitle={modalTitle}
        />
      </Modal>
    </div>
  );
};

export default forwardRef(BaseInfo);
