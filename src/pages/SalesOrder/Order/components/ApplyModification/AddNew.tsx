import { getOrderDateList, saveOMAData } from '@/services/SalesOrder/index';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Select, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import OrderInfoContent from '@/pages/SalesOrder/OrderModificationApplication/components/OrderInfoContent';
import '@/pages/SalesOrder/OrderModificationApplication/components/style.css';
import UploadList from '@/pages/SalesOrder/OrderModificationApplication/components/UploadList';

interface detailInfo {
  addNewDrawerClose?: any;
  tableReload?: any;
  orderNo?: any;
  selectOrder?: any;
}
const Index: React.FC<detailInfo> = (props: any) => {
  // const Index = ({ addNewDrawerClose, tableReload, orderNo, type }: any, ref?: any) => {
  const { orderNo, selectOrder } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  // const [params, setParams]: any = useState({});
  const params = {};
  const [fileData, setFileData] = useState([]);
  const [UpdateTypeData, setUpdateTypeData]: any = useState([]);
  const [UpdateReasonData, setUpdateReasonData]: any = useState([]);
  const [getUpdateTypeCode, setUpdateTypeCode] = useState('');

  // const [getCancelTypeCode, setCancelTypeCode] = useState('');
  // const [getCancelReasonCode, setCancelReasonCode] = useState('');
  const [showRequire, setShowRequire] = useState(false); //?必填是否展示

  // const [tableRowData, setTableRowData]: any = useState(selectOrder[0]);

  const [ChangeUpdateReason, setChangeUpdateReason] = useState(''); //?把修改原因存一下

  useEffect(() => {
    getOrderDateList({ type: 'orderUpdateType', code: 'add' }).then((res: any) => {
      if (res.errCode === 200) {
        setUpdateTypeData(res.data?.dataList);
        setUpdateReasonData(res.data?.dataList[0]?.children);
        setShowRequire(false);
        form.setFieldsValue({
          updateReason: null,
          updateType: null,
        });
      }
    });
  }, []);

  const { confirm } = Modal;

  const handleUpdateTypeChange = (value: any) => {
    console.log(value, 'value');
    setUpdateTypeCode(value);
    if (!value) {
      console.log(ref, 'ref');
    }
    setUpdateReasonData(UpdateTypeData[value - 1]?.children);
    if (
      value === '3' &&
      (UpdateTypeData[value - 1]?.children[0]?.key === '31' ||
        ChangeUpdateReason === '31' ||
        ChangeUpdateReason === '33')
    ) {
      setShowRequire(true);
    } else if (value === '4') {
      setShowRequire(true);
    } else if (
      value === '5' &&
      (UpdateTypeData[value - 1]?.children[0]?.key === '51' ||
        ChangeUpdateReason === '51' ||
        ChangeUpdateReason === '52' ||
        ChangeUpdateReason === '56')
    ) {
      setShowRequire(true);
    } else {
      setShowRequire(false);
    }
    form.setFieldsValue({
      updateReason: UpdateTypeData[value - 1]?.children[0]?.key,
    });

    //   getOrderDateList({ type: 'orderUpdateType', code: 'add' }).then((res: any) => {
    //     // getOrderDateList({ type: 'orderUpdateType' }).then((res: any) => {
    //     //for tester to test
    //     if (res.errCode === 200) {
    //       setUpdateReasonData(UpdateTypeData[value - 1]?.children);
    //       // setUpdateReasonCode(res.data?.dataList[value - 1]?.children[0]?.key);
    //       // console.log(getUpdateReasonCode);
    //       if (
    //         value === '3' &&
    //         (res.data?.dataList[value - 1]?.children[0]?.key === '31' ||
    //           ChangeUpdateReason === '31' ||
    //           ChangeUpdateReason === '33')
    //       ) {
    //         setShowRequire(true);
    //       } else if (value === '4') {
    //         setShowRequire(true);
    //       } else if (
    //         value === '5' &&
    //         (res.data?.dataList[value - 1]?.children[0]?.key === '51' ||
    //           ChangeUpdateReason === '51' ||
    //           ChangeUpdateReason === '52' ||
    //           ChangeUpdateReason === '56')
    //       ) {
    //         setShowRequire(true);
    //       } else {
    //         setShowRequire(false);
    //       }
    //       form.setFieldsValue({
    //         updateReason: res.data?.dataList[value - 1]?.children[0]?.key,
    //       });

    //       if (value === '1' && res.data?.dataList[value - 1]?.children[0]?.key === '11') {
    //         setReceptionNoRules([{ required: true, message: '请输入正确的接待单号' }]);
    //       } else if (value === '2' && res.data?.dataList[value - 1]?.children[0]?.key === '21') {
    //         setReceptionNoRules([{ required: true, message: '请输入正确的接待单号' }]);
    //       } else if (value === '5' && res.data?.dataList[value - 1]?.children[0]?.key === '56') {
    //         setReceptionNoRules([{ required: true, message: '请输入正确的接待单号' }]);
    //       } else {
    //         setReceptionNoRules([{ required: false }]);
    //       }
    //     }
    //   });
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
          saveOMAData(formData)
            .then((res: any) => {
              console.log(res);
              if (res.errCode === 200) {
                message.success('订单修改申请提交成功', 3);
                setConfirmLoading(false);
                props.addNewDrawerClose();
                form.resetFields();
                props.tableReload();
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
    props.addNewDrawerClose();
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
  // function changeReasonFn() {
  //   // setChangeReaSonState(e);
  //   // if (e === '33') {
  //   setShowRequire(true);
  //   // } else {
  //   // setShowRequire(false);
  //   // }
  // }
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
    // if (getUpdateTypeCode === '1' && e === '11') {
    //   setReceptionNoRules([{ required: true, message: '请输入正确的接待单号' }]);
    // } else if (getUpdateTypeCode === '2' && e === '21') {
    //   setReceptionNoRules([{ required: true, message: '请输入正确的接待单号' }]);
    // } else if (getUpdateTypeCode === '5' && e === '56') {
    //   setReceptionNoRules([{ required: true, message: '请输入正确的接待单号' }]);
    // } else {
    //   setReceptionNoRules([{ required: false }]);
    // }
  }
  return (
    <div className="form-content-search tabs-detail requestDetail" id="RequestChannel">
      <section className="omsAntStyles">
        <Form
          className="has-gridForm"
          name="form"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{
            requestChannel: '1',
            requestType: '3',
            orderNo: orderNo,
            // resourceVOList: fileData
          }}
        >
          <div className="content">
            <div className="content1 box">
              <div id="one" className="title">
                基本申请信息
              </div>
              <div className="ant-advanced-form four-gridCol">
                <Form.Item label="申请类型" name="requestType">
                  <span className="form-span">订单修改</span>
                </Form.Item>

                <Form.Item label="申请订单" name="orderNo">
                  <span className="form-span">{orderNo}</span>
                </Form.Item>

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

                <Form.Item
                  label="修改原因"
                  name="updateReason"
                  rules={[{ required: true, message: '请选择修改原因!' }]}
                >
                  <Select placeholder="请选择修改原因" onChange={changeUpdateReason}>
                    {UpdateReasonData &&
                      UpdateReasonData.map((item: any) => (
                        <Select.Option key={item.key} value={item.key} optionlabelprop={item.value}>
                          {item.value}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item label="申请渠道" name="requestChannel">
                  <span className="form-span">OMS</span>
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
            <OrderInfoContent tableRowData={selectOrder[0]} orderId={orderNo} />
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
    </div>
  );
};
export default Index;
