import React, { useEffect, useState } from 'react';
import { Space, Card, Button, Row, Col, Form, Modal, DatePicker, Input, message, Tag } from 'antd';
import { useParams, history } from 'umi';
import LogInfo from '@/pages/components/LogInfo';
import { queryBackDetail, modifyBackDetail } from '@/services/afterSales';
import InternalCommunication from '@/pages/components/InternalCommunication';
import moment from 'moment';
import { CloseCircleTwoTone } from '@ant-design/icons';
import './style.less';

const Info: React.FC = () => {
  const pathParams: any = useParams();
  const [id, setId] = useState('');
  const [statusType, setStatusType] = useState(1);
  const [params, setParams]: any = useState({});
  const [logVisible, setLogVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  // const { destroyCom } = useModel('tabSelect');
  useEffect(() => {
    const newId: any = pathParams?.id || '';
    setId(newId);
    if (newId) {
      queryBackDetail({ sid: newId }).then((res: any) => {
        if (res.errCode === 200) {
          setParams(res.data);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const updateShow = (type: any) => {
    setStatusType(type);
    setIsModalVisible(true);
  };
  const save = () => {
    form.validateFields().then((saveParams: any) => {
      saveParams.invoiceReceiptDate = moment(saveParams.invoiceReceiptDate).format('YYYY-MM-DD');
      saveParams.sid = params.sid;
      if (params.invoiceBackStatus === 1) {
        saveParams.invoiceBackOperate = statusType === 1 ? 1 : 2;
      } else if (params.invoiceBackStatus === 2) {
        saveParams.invoiceBackOperate = statusType === 1 ? 3 : 4;
      }
      Modal.confirm({
        title: '确定提交?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          modifyBackDetail(saveParams).then((resd: any) => {
            if (resd.errCode === 200) {
              message.success('操作成功!');
              setIsModalVisible(false);
              // destroyCom('/sales-after/invoice', location.pathname)
              history.replace(`/sales-after/invoice`);
            } else {
              message.error(resd.errMsg);
            }
          });
        },
      });
    });
  };
  return (
    <div id="invoiceBackDetail">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '#fff',
          padding: '0 20px',
          height: '60px',
          margin: '5px 10px 0',
          position: 'sticky',
          top: '0',
          zIndex: '9',
          borderBottom: '1px solid #f0f2f5',
        }}
      >
        <div>
          <span style={{ marginBottom: '10px', fontSize: '15px', lineHeight: '60px' }}>
            发票追回任务编号: <Space>{params.invoiceBackNo}</Space>{' '}
            <Tag key={'任务状态'} color="gold" style={{ marginLeft: 10 }}>
              {params?.invoiceBackStatusDesc}
            </Tag>
          </span>
        </div>
        <Space>
          {params.invoiceBackStatus === 1 && (
            <React.Fragment>
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  updateShow(1);
                  form.setFieldsValue({
                    remark: '',
                  });
                }}
              >
                完成
              </Button>
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  form.setFieldsValue({
                    remark: '',
                  });
                  updateShow(2);
                }}
              >
                待销售跟进
              </Button>
            </React.Fragment>
          )}
          {params.invoiceBackStatus === 2 && (
            <React.Fragment>
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  form.setFieldsValue({
                    remark: '',
                  });
                  updateShow(1);
                }}
              >
                追票完成
              </Button>
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  form.setFieldsValue({
                    remark: '',
                  });
                  updateShow(2);
                }}
              >
                无法追回
              </Button>
            </React.Fragment>
          )}
          <Button
            size="small"
            onClick={() => {
              setLogVisible(true);
            }}
          >
            查看操作日志
          </Button>
          <Button
            size="small"
            key={'关闭'}
            icon={<CloseCircleTwoTone />}
            onClick={() => {
              history.go(-1);
            }}
          >
            {' '}
            关闭{' '}
          </Button>
        </Space>
      </div>
      <div
        className="detailContentCol"
        style={{ backgroundColor: '#fff', padding: '10px', margin: '10px' }}
      >
        <Card
          bordered={false}
          title="基本信息"
          headStyle={{ fontWeight: 'bold', fontSize: '12px', padding: '0px', minHeight: '22px' }}
        >
          <Form size="small" labelWrap>
            <Row>
              <Col span={6}>
                <Form.Item label="关联售后申请">
                  <span>{params.afterSalesNo}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="关联销售订单">
                  <span>{params.sapSoNo}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="任务创建时间">
                  <span>{params.createTime}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="最近更新人">
                  <span>{params.updateName}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="客户名称">
                  <span>{params.customerName}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="客户代号">
                  <span>{params.customerCode}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="R3联系人">
                  <span>{params.contactNameR3}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="R3联系人代号">
                  <span>{params.contactCodeR3}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="主销售">
                  <span>{params.salesName}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="最后更新时间">
                  <span>{params.updateTime}</span>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card
          bordered={false}
          title="发票信息"
          headStyle={{ fontWeight: 'bold', fontSize: '12px', padding: '0px', minHeight: '22px' }}
        >
          <Form size="small" labelWrap>
            <Row>
              <Col span={6}>
                <Form.Item label="系统发票号">
                  <span>{params.systemInvoiceNo}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="物理发票号">
                  <span>{params.physicsInvoiceNo}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="申请时状态">
                  <span>{params.invoiceStatusDesc}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="申请时说明">
                  <span>{params.refundExplain}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="售后发票确认">
                  <span>{params.invoiceInfoConfirm}</span>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="发票接收日期">
                  <span>{params.invoiceReceiptDate}</span>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="任务备注">
              <span className="wordBreak">{params.remark}</span>
            </Form.Item>
          </Form>
        </Card>
        <Card
          bordered={false}
          title="内部沟通记录"
          headStyle={{ fontWeight: 'bold', fontSize: '12px', padding: '0px', minHeight: '22px' }}
        >
          <InternalCommunication sourceType={110} id={id} />
        </Card>
      </div>
      <LogInfo
        id={id}
        title={'发票追回'}
        sourceType={'110'}
        visible={logVisible}
        closed={() => {
          setLogVisible(false);
        }}
      />
      <Modal
        title="信息完善"
        width={800}
        destroyOnClose={true}
        visible={isModalVisible}
        onOk={save}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <Form size="small" form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
          {statusType === 1 && (
            <Form.Item
              label="发票接收日期"
              name={'invoiceReceiptDate'}
              rules={[{ required: true, message: '请选择发票接收日期!' }]}
            >
              <DatePicker />
            </Form.Item>
          )}
          <Form.Item
            label="任务备注"
            name={'remark'}
            rules={[
              {
                required: statusType === 2 && params.invoiceBackStatus === 2,
                message: '请填写任务备注!',
              },
            ]}
          >
            <Input.TextArea rows={4} maxLength={255} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Info;
