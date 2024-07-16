import { getOrderDateList, saveOMAData, preCheck, preCheckNew } from '@/services/SalesOrder/index';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Radio, Select, InputNumber } from 'antd';
import { forwardRef, useEffect, useState } from 'react';
import AddOrderModal from './AddOrderModal';
import OrderInfoContent from './OrderInfoContent';
import './style.css';
import UploadList from './UploadList';

const OrderDetail = ({ addNewDrawerClose, tableReload }: any, ref?: any) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  // const [params, setParams]: any = useState({});
  const params = {};
  const [fileData, setFileData] = useState([]);
  const [requestTypeList, setRequestTypeList]: any = useState([]);
  const [UpdateTypeData, setUpdateTypeData]: any = useState([]);
  const [UpdateReasonData, setUpdateReasonData]: any = useState([]);
  const [getUpdateTypeCode, setUpdateTypeCode] = useState('');
  // const [getUpdateReasonCode, setUpdateReasonCode] = useState('');

  const [CancelTypeData, setCancelTypeData]: any = useState([]);
  const [CancelReasonData, setCancelReasonData] = useState([]);
  // const [getCancelTypeCode, setCancelTypeCode] = useState('');
  // const [getCancelReasonCode, setCancelReasonCode] = useState('');
  const [showRequire, setShowRequire] = useState(false); //?必填是否展示
  const [isAddNewModalVisible, setIsAddNewModalVisible] = useState(false);
  const [modalVal, setModalVal] = useState({});
  const [choosedOrderNo, setChoosedOrderNo]: any = useState('');
  const [tableRowData, setTableRowData]: any = useState({});
  const [orderNoPlaceholder, setOrderNoPlaceholder]: any = useState('请先选择申请类型!');
  // const [changeReaSonState, setChangeReaSonState] = useState();
  const [ChangeUpdateReason, setChangeUpdateReason] = useState(''); //?把修改原因存一下
  const orderTypeData = [
    { key: 1, value: '常规订单' },
    { key: 2, value: '售后订单' },
    { key: 3, value: '借样订单' },
  ];

  const [receptionCodeRules, setReceptionNoRules]: any = useState([{ required: false }]);
  if (receptionCodeRules == '') {
    console.log(receptionCodeRules, 'receptionCodeRules');
  }
  useEffect(() => {
    getOrderDateList({ type: 'orderRequestType' }).then((res: any) => {
      if (res.errCode === 200) {
        setRequestTypeList(res.data?.dataList);
      }
    });
    getOrderDateList({ type: 'orderUpdateType' }).then((res: any) => {
      if (res.errCode === 200) {
        setUpdateTypeData(res.data?.dataList);
        setUpdateReasonData(res.data?.dataList[0]?.children);
      }
    });

    // getOrderDateList({ type: 'orderRequestCancelReason' }).then((res: any) => {123
    //   if (res.errCode === 200) {
    //     setCancelReasonData(res.data?.dataList);
    //   }
    // });

    getOrderDateList({ type: 'orderRequestCancelType' }).then((res: any) => {
      if (res.errCode === 200) {
        setCancelTypeData(res.data?.dataList);
        setCancelReasonData(res.data?.dataList[0]?.children);
      }
    });

    //设置select初始值
    form.setFieldsValue({
      requestType: requestTypeList && requestTypeList[0] ? requestTypeList[0].key : '',
    });
  }, []);

  const { confirm } = Modal;
  const [getRequestType, setRequestType]: any = useState('');
  const [disabled, setDisabled]: any = useState(true);
  function RequestTypeOnChange(e: any) {
    if (e.target.value !== '3') {
      setShowRequire(true);
      form.setFieldsValue({
        cancelReason: null,
        cancelType: null,
      });
    } else if (e.target.value == '3') {
      setShowRequire(false);
      form.setFieldsValue({
        updateReason: null,
        updateType: null,
      });
    } else {
      setShowRequire(false);
    }
    setReceptionNoRules([{ required: false }]);
    if (choosedOrderNo != '') {
      confirm({
        wrapClassName: 'confirmModal',
        title: '修改申请类型需要重新选择订单?',
        icon: <ExclamationCircleOutlined />,
        content: '你还要继续吗？',
        onOk() {
          // console.log(e.target.value);
          setRequestType(e.target.value);
          setDisabled(false);
          setChoosedOrderNo('');
          setTableRowData({});
          form.setFieldsValue({
            orderNo: '',
          });
          setOrderNoPlaceholder('请重新选择订单!');
        },
        onCancel() {
          // console.log(getRequestType);
          setRequestType(getRequestType);
          form.setFieldsValue({
            requestType: getRequestType,
          });
          setDisabled(false);
          setOrderNoPlaceholder('请选择订单!');
        },
      });
    } else {
      // console.log(e.target.value);
      setRequestType(e.target.value);
      setDisabled(false);
      setOrderNoPlaceholder('请选择订单!');
    }
  }
  const handleCancelTypeChange = (value: any) => {
    setShowRequire(true);
    // setCancelTypeCode(value);
    // console.log(getCancelTypeCode);
    getOrderDateList({ type: 'orderRequestCancelType' }).then((res: any) => {
      if (res.errCode === 200) {
        setCancelReasonData(res.data?.dataList[value - 1]?.children);
        // setCancelReasonCode(res.data?.dataList[value - 1]?.children[0]?.key);
        // console.log(getCancelReasonCode);
        form.setFieldsValue({
          cancelReason: res.data?.dataList[value - 1]?.children[0]?.key,
        });
      }
    });
  };

  const handleUpdateTypeChange = (value: any) => {
    console.log(value, 'value');
    setUpdateTypeCode(value);
    console.log(ref, 'ref');
    getOrderDateList({ type: 'orderUpdateType', code: 'add' }).then((res: any) => {
      // getOrderDateList({ type: 'orderUpdateType' }).then((res: any) => {
      //for tester to test
      if (res.errCode === 200) {
        setUpdateReasonData(res.data?.dataList[value - 1]?.children);
        // setUpdateReasonCode(res.data?.dataList[value - 1]?.children[0]?.key);
        // console.log(getUpdateReasonCode);
        if (
          value === '3' &&
          (res.data?.dataList[value - 1]?.children[0]?.key === '31' ||
            ChangeUpdateReason === '31' ||
            ChangeUpdateReason === '33')
        ) {
          setShowRequire(true);
        } else if (value === '4') {
          setShowRequire(true);
        } else if (
          value === '5' &&
          (res.data?.dataList[value - 1]?.children[0]?.key === '51' ||
            ChangeUpdateReason === '51' ||
            ChangeUpdateReason === '52' ||
            ChangeUpdateReason === '56')
        ) {
          setShowRequire(true);
        } else {
          setShowRequire(false);
        }
        form.setFieldsValue({
          updateReason: res.data?.dataList[value - 1]?.children[0]?.key,
        });

        if (value === '1' && res.data?.dataList[value - 1]?.children[0]?.key === '11') {
          setReceptionNoRules([{ required: true, message: '请输入正确的接待单号' }]);
        } else if (value === '2' && res.data?.dataList[value - 1]?.children[0]?.key === '21') {
          setReceptionNoRules([{ required: true, message: '请输入正确的接待单号' }]);
        } else if (value === '5' && res.data?.dataList[value - 1]?.children[0]?.key === '56') {
          setReceptionNoRules([{ required: true, message: '请输入正确的接待单号' }]);
        } else {
          setReceptionNoRules([{ required: false }]);
        }
      }
    });
  };

  const [orderType, setOrderType] = useState<any>(1);
  const handleOrderTypeChange = (val: any) => {
    if (choosedOrderNo != '') {
      confirm({
        wrapClassName: 'confirmModal',
        title: '修改订单类型需要重新选择订单?',
        icon: <ExclamationCircleOutlined />,
        content: '你还要继续吗？',
        onOk() {
          // console.log(e.target.value);
          // setRequestType(e.target.value);
          setDisabled(false);
          setChoosedOrderNo('');
          setTableRowData({});
          form.setFieldsValue({
            orderNo: '',
            orderType: val,
          });
          setOrderType(val);
          setOrderNoPlaceholder('请重新选择订单!');
        },
        onCancel() {
          setRequestType(getRequestType);
          form.setFieldsValue({
            requestType: getRequestType,
            orderType,
          });
          setDisabled(false);
          setOrderNoPlaceholder('请选择订单!');
        },
      });
    } else {
      setOrderType(val);
    }
  };

  const getSelModal = async (val: any) => {
    if (!val) return;
    if (JSON.stringify(val) != '{}') {
      if (getRequestType != '1') {
        // 字符串 or int ？
        //?选择了弹框的订单号之后
        //?除了整单取消，在发商品明细接口之前加一个预校验，如果校验不通过则不发商品明细，也不会进行订单号的回显操作
        const res = await preCheckNew({ orderNo: val.orderNo, orderType });
        // console.log(res, 'res预校验');
        if (res.errCode == 200 && res?.data?.success) {
          form.setFieldsValue({
            orderNo: val.orderNo,
          });
          setChoosedOrderNo(val.orderNo);
          setTableRowData(val);
        } else {
          return message.error('订单尚未同步Sap，请去Sap同步订单');
        }
      } else {
        form.setFieldsValue({
          orderNo: val.orderNo,
        });
        setChoosedOrderNo(val.orderNo);
        setTableRowData(val);
      }
    }
  };

  const operateMethod = (val: any) => {
    setModalVal(val);
  };
  const addNewModalClose = () => {
    setIsAddNewModalVisible(false);
  };
  const modalOK = () => {
    setIsAddNewModalVisible(false);
    getSelModal(modalVal);
  };
  const onFinish = (values: any) => {
    // console.log(values, fileData);
    setConfirmLoading(true);
    if (showRequire && fileData.length == 0) {
      message.error('至少要上传一个附件', 3);
      setConfirmLoading(false);
    } else {
      confirm({
        wrapClassName: 'confirmModal',
        title: '您确认提交申请?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          const formData = JSON.parse(JSON.stringify(values));
          formData.resourceVOList = fileData;
          formData.requestStatus = 20;
          let tipsWords = '订单取消';
          if (formData.requestType == 3) {
            tipsWords = '订单修改';
          }
          saveOMAData(formData)
            .then((res: any) => {
              console.log(res);
              if (res.errCode === 200) {
                message.success(tipsWords + '申请提交成功', 3);
                setConfirmLoading(false);
                addNewDrawerClose();
                form.resetFields();
                tableReload();
              } else {
                message.error(res.errMsg);
                setConfirmLoading(false);
              }
            })
            .finally(() => {
              return;
            });
        },
        onCancel() {
          setConfirmLoading(false);
        },
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error('带红色*字段不能为空', 3);
    console.log('Failed:', errorInfo);
  };

  const onReset = () => {
    form.resetFields();
    // props.addNewDrawerClose();
    addNewDrawerClose();
  };

  const getData = (val: any) => {
    setFileData(val);
    console.log(val);
  };

  const limitDecimals: any = (value: string) => {
    if (value == null) {
      return '0';
    } else {
      return value
        .replace(/[^\d.]/g, '')
        .replace(/^\./g, '')
        .replace(/\.{2,}/g, '.')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
      // .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      // .replace(/\$\s?|(,*)/g, '');
    }
  };
  function numberOnChange(value: string) {
    if (value == null || value == '') {
      form.setFieldsValue({
        repeatOrderNo: '',
      });
    }
  }
  function receptionCodeOnChange(value: string) {
    if (value == null || value == '') {
      form.setFieldsValue({
        receptionCode: '',
      });
    }
  }
  //?设置取消原因
  function changeReasonFn() {
    // setChangeReaSonState(e);
    // if (e === '33') {
    setShowRequire(true);
    // } else {
    // setShowRequire(false);
    // }
  }
  function changeUpdateReason(e: any) {
    console.log(e, 'e');
    console.log(getUpdateTypeCode);
    setChangeUpdateReason(e);
    if (getUpdateTypeCode === '3' && (e === '31' || e === '33')) {
      setShowRequire(true);
    } else if (getUpdateTypeCode === '4') {
      setShowRequire(true);
    } else if (getUpdateTypeCode === '5' && (e === '51' || e === '52' || e === '56')) {
      setShowRequire(true);
    } else {
      setShowRequire(false);
    }
    if (getUpdateTypeCode === '1' && e === '11') {
      setReceptionNoRules([{ required: true, message: '请输入正确的接待单号' }]);
    } else if (getUpdateTypeCode === '2' && e === '21') {
      setReceptionNoRules([{ required: true, message: '请输入正确的接待单号' }]);
    } else if (getUpdateTypeCode === '5' && e === '56') {
      setReceptionNoRules([{ required: true, message: '请输入正确的接待单号' }]);
    } else {
      setReceptionNoRules([{ required: false }]);
    }
  }
  return (
    <div className="form-content-search tabs-detail requestDetail" id="requestChannelId">
      <section className="omsAntStyles">
        <Form
          className="has-gridForm"
          name="form"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{
            requestChannel: 1,
            orderType: 1,
            // resourceVOList: fileData
          }}
        >
          <div className="content">
            <div className="content1 box">
              <div id="one" className="title">
                基本申请信息
              </div>
              <div className="ant-advanced-form four-gridCol">
                <Form.Item
                  label="申请类型"
                  value={getRequestType}
                  name="requestType"
                  className="twoGrid"
                  onChange={RequestTypeOnChange}
                  rules={[{ required: true, message: '请选择申请类型!' }]}
                >
                  <Radio.Group>
                    {requestTypeList &&
                      requestTypeList.map((item: any) => (
                        <Radio key={item.key} value={item.key} name={item.value}>
                          {item.value}
                        </Radio>
                      ))}
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  label="订单类型"
                  // className="twoGrid"
                  name="orderType"
                  rules={[{ required: true, message: '请选择订单类型!' }]}
                >
                  <Select
                    placeholder="请选择订单类型"
                    defaultValue={1}
                    onChange={handleOrderTypeChange}
                  >
                    {orderTypeData &&
                      orderTypeData.map((item: any) => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.value}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item />

                <Form.Item
                  label="申请订单"
                  name="orderNo"
                  rules={[{ required: true, message: '请选择订单!' }]}
                >
                  <Input.Search
                    placeholder={orderNoPlaceholder}
                    readOnly={true}
                    disabled={disabled}
                    onSearch={() => {
                      setIsAddNewModalVisible(true);
                    }}
                    onClick={() => {
                      setIsAddNewModalVisible(true);
                    }}
                  />
                </Form.Item>

                {(getRequestType == 1 || getRequestType == 2) && (
                  <Form.Item
                    label="取消类型"
                    name="cancelType"
                    rules={[{ required: true, message: '请选择取消类型!' }]}
                  >
                    <Select placeholder="请选择取消类型" onChange={handleCancelTypeChange}>
                      {CancelTypeData &&
                        CancelTypeData.map((item: any) => (
                          <Select.Option key={item.key} value={item.key}>
                            {item.value}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                )}

                {(getRequestType == 1 || getRequestType == 2) && (
                  <Form.Item
                    label="取消原因"
                    name="cancelReason"
                    rules={[{ required: true, message: '请选择取消原因!' }]}
                  >
                    <Select placeholder="请选择取消原因" onChange={changeReasonFn}>
                      {CancelReasonData &&
                        CancelReasonData.map((item: any) => (
                          <Select.Option key={item.key} value={item.key}>
                            {item.value}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                )}

                {getRequestType == 3 && (
                  <Form.Item
                    label="修改类型"
                    name="updateType"
                    rules={[{ required: true, message: '请选择修改类型!' }]}
                  >
                    <Select placeholder={'请选择修改类型'} onChange={handleUpdateTypeChange}>
                      {UpdateTypeData &&
                        UpdateTypeData.map((item: any) => (
                          <Select.Option key={item.key} value={item.key}>
                            {item.value}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                )}

                {getRequestType == 3 && (
                  <Form.Item
                    label="修改原因"
                    name="updateReason"
                    rules={[{ required: true, message: '请选择修改原因!' }]}
                  >
                    <Select placeholder="请选择修改原因" onChange={changeUpdateReason}>
                      {UpdateReasonData &&
                        UpdateReasonData.map((item: any) => (
                          <Select.Option
                            key={item.key}
                            value={item.key}
                            optionlabelprop={item.value}
                          >
                            {item.value}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                )}
              </div>
              <div className="ant-advanced-form four-gridCol" style={{ paddingTop: '0' }}>
                <Form.Item label="申请渠道">
                  <span className="form-span">OMS</span>
                </Form.Item>
                <Form.Item
                  label="申请渠道"
                  name="requestChannel"
                  className="dontShow"
                  style={{ display: 'none' }}
                >
                  <Input bordered={false} readOnly={true} />
                </Form.Item>
                <Form.Item label="重复关联订单" name="repeatOrderNo" className="minLabel">
                  <InputNumber
                    min={'0'}
                    maxLength={20}
                    style={{ width: '100%' }}
                    controls={false}
                    onChange={numberOnChange}
                    formatter={limitDecimals}
                    parser={limitDecimals}
                    precision={0}
                    placeholder="请输入订单号(数字)"
                  />
                </Form.Item>

                {/* <Form.Item label="接待单号" name="receptionCode" rules={receptionCodeRules}> */}
                <Form.Item label="接待单号" name="receptionCode">
                  <InputNumber
                    min={'0'}
                    maxLength={30}
                    style={{ width: '100%' }}
                    controls={false}
                    onChange={receptionCodeOnChange}
                    formatter={limitDecimals}
                    parser={limitDecimals}
                    precision={0}
                    placeholder="请输入接待单号(数字)"
                  />
                </Form.Item>

                <Form.Item
                  label="申请备注描述"
                  className="fullLineGrid minLabel"
                  name="remark"
                  rules={[{ required: true, message: '请输入申请备注描述!' }]}
                >
                  <Input.TextArea
                    showCount
                    maxLength={255}
                    placeholder="请输入申请备注描述"
                    allowClear
                  />
                </Form.Item>
              </div>
            </div>
            <div className="content7 box">
              <div id="seven" className="title">
                附件
                {showRequire && <span style={{ fontSize: '12px', color: '#999' }}>（必填）</span>}
              </div>
              <UploadList
                getData={getData}
                sourceData={params.resourceVOList}
                createName={params.createName}
              />
            </div>

            <div id="one" className="title">
              订单详情信息
            </div>
            {choosedOrderNo != '' && (
              <OrderInfoContent
                tableRowData={tableRowData}
                orderId={choosedOrderNo}
                orderType={orderType}
              />
            )}
          </div>
          <div className="ant-modal-footer drewerFooterNoBorderButtonAbsCol">
            <Button type="primary" htmlType="submit" loading={confirmLoading}>
              提交申请
            </Button>
            <Button htmlType="button" onClick={onReset}>
              取 消
            </Button>
          </div>
        </Form>
      </section>
      <Modal
        width={910}
        title="选择订单"
        visible={isAddNewModalVisible}
        destroyOnClose={true}
        onOk={modalOK}
        onCancel={addNewModalClose}
      >
        <AddOrderModal
          addNewModalClose={addNewModalClose}
          operateMethod={operateMethod}
          modalOK={modalOK}
          getRequestType={getRequestType}
          orderType={orderType}
        />
      </Modal>
    </div>
  );
};
export default forwardRef(OrderDetail);
