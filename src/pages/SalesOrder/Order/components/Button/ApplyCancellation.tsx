import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, message, Radio, Select } from 'antd';
import { getOrderDateList, getNextStep } from '@/services/SalesOrder';
import AddNewDrawer from '../ApplyCancellation/EditDrawer';

// interface detailInfo {
//   tableReload: any;
//   selectOrder?: any;
// }
// const ApplyCancellation: React.FC<detailInfo> = (props: any, Ref: any) => {
const ApplyCancellation = (props: any) => {
  const { selectOrder } = props;
  // const [load, setLoad]: any = useState(false);
  const [confirmLoading, setConfirmLoading]: any = useState(false);
  const [form] = Form.useForm();
  const [modalShow, setModalShow] = useState(false);
  const [requestTypeList, setRequestTypeList]: any = useState([]);
  const [getRequestType, setRequestType]: any = useState('');
  const [CancelTypeData, setCancelTypeData]: any = useState([]);
  const [CancelReasonData, setCancelReasonData]: any = useState([]);
  const [firstStepData, setFirstStepData]: any = useState({});
  const [orderData, setOrderData]: any = useState({});

  const SideBar: any = document.getElementsByClassName('ant-layout-sider');
  const [drawerWidth, setDrawerWidth] = useState(window.innerWidth - 208);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  useEffect(() => {
    getOrderDateList({ type: 'orderRequestType' }).then((res: any) => {
      if (res.errCode === 200) {
        setRequestTypeList([res?.data?.dataList[0], res?.data?.dataList[1]]);
      }
    });
    getOrderDateList({ type: 'orderRequestCancelType' }).then((res: any) => {
      if (res.errCode === 200) {
        setCancelTypeData(res.data?.dataList);
        setCancelReasonData(res.data?.dataList[0]?.children);
      }
    });

    //设置select初始值
    // form.setFieldsValue({
    //   requestType: requestTypeList && requestTypeList[0] ? requestTypeList[0].key : '',
    // });
  }, []);
  function RequestTypeOnChange(e: any) {
    setRequestType(e.target.value);
    form.setFieldsValue({
      cancelReason: null,
      cancelType: null,
    });
  }
  const handleCancelTypeChange = (value: any) => {
    setCancelReasonData(CancelTypeData[value - 1]?.children);
    form.setFieldsValue({
      cancelReason: CancelTypeData[value - 1]?.children[0]?.key,
    });

    // getOrderDateList({ type: 'orderRequestCancelType' }).then((res: any) => {
    //   if (res.errCode === 200) {
    //     setCancelReasonData(res.data?.dataList[value - 1]?.children);
    //     form.setFieldsValue({
    //       cancelReason: res.data?.dataList[value - 1]?.children[0]?.key,
    //     });
    //   }
    // });
  };
  const openModal = () => {
    setModalShow(true);
    form.resetFields();
  };
  const closeModal = () => {
    setModalShow(false);
    form.resetFields();
  };

  const addNewDrawerOpen = () => {
    setIsDrawerVisible(true);
  };

  const addNewDrawerClose = () => {
    setIsDrawerVisible(false);
  };

  const handleOk = () => {
    if (JSON.stringify(selectOrder) == '[]') {
      message.error('请至少选择一个订单！', 3);
    } else {
      openModal();
    }
  };

  const onFinish = (values: any) => {
    setConfirmLoading(true);
    const orderNo = selectOrder[0].orderNo;
    if (orderNo === 0) {
      Modal.warning({
        title: '本订单已锁定！',
        content: (
          <>
            <p>请重新选择订单！</p>
            <p>您也可以到“订单修改申请记录”中编辑或取消本订单的修改申请。</p>
          </>
        ),
        // content: '请重新选择订单，或者到“订单修改申请记录”中编辑或取消本订单的修改申请。',
        okText: '知道了',
      });
      setConfirmLoading(false);
      closeModal();
    } else {
      const formData = JSON.parse(JSON.stringify(values));
      formData.orderNo = orderNo;
      setFirstStepData(formData);
      getNextStep(formData)
        .then((res: any) => {
          if (res?.errCode === 200) {
            setOrderData(res?.data);
            console.log(orderData);
            const sideWidth = SideBar[0]?.clientWidth || 0;
            setDrawerWidth(window.innerWidth - sideWidth);
            setConfirmLoading(false);
            closeModal();
            addNewDrawerOpen();
          } else {
            message.error(res.errMsg);
            setConfirmLoading(false);
          }
        })
        .finally(() => {
          return;
        })
        .catch((errorInfo) => {
          message.error(errorInfo, 3);
          setConfirmLoading(false);
        });
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    message.error('带红色*字段不能为空', 3);
    console.log('Failed:', errorInfo);
  };

  return (
    <span>
      <Button key="申请取消" type="primary" ghost onClick={handleOk}>
        申请取消
      </Button>
      <Modal
        getContainer={false}
        className="noTopFootBorder"
        title={'选择申请类型'}
        visible={modalShow}
        onOk={closeModal}
        onCancel={closeModal}
        width={500}
        destroyOnClose={true}
        footer={[]}
      >
        <Form
          name="form"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          initialValues={{ orderNo: selectOrder[0]?.orderNo }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="申请类型"
            value={getRequestType}
            name="requestType"
            className="fullLineGrid"
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
          <Form.Item
            label="取消原因"
            name="cancelReason"
            rules={[{ required: true, message: '请选择取消原因!' }]}
          >
            <Select placeholder="请选择取消原因">
              {CancelReasonData &&
                CancelReasonData.map((item: any) => (
                  <Select.Option key={item.key} value={item.key}>
                    {item.value}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <div className="ant-modal-footer">
            <Button key="back" loading={confirmLoading} onClick={closeModal}>
              取 消
            </Button>
            <Button type="primary" key="submit" htmlType="submit" loading={confirmLoading}>
              下一步
            </Button>
          </div>
        </Form>
      </Modal>
      <AddNewDrawer
        getSid={orderData}
        record={selectOrder[0]}
        tableReload={props.tableReload}
        orderNo={selectOrder[0]?.orderNo}
        drawerWidth={drawerWidth}
        defaultData={firstStepData}
        isDrawerVisible={isDrawerVisible}
        addNewDrawerClose={addNewDrawerClose}
        addNewDrawerOpen={addNewDrawerOpen}
        type={'add'}
        DrawerTitle={'新增订单取消申请'}
      />
    </span>
  );
};
export default ApplyCancellation;
