import { Form, Space, Button, DatePicker, Select, Table, message } from 'antd';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { approvalProcessExcelTemp, approvalProcess } from '@/services/DataReport/index';
const AuditForm: React.FC = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource]: any[] = useState([]);
  const [type, setType] = useState(1);
  const { Option } = Select;
  const onSearch = (values: number) => {
    setType(values);
    form.submit();
  };
  const onFinish = (values: any) => {
    const params = JSON.parse(JSON.stringify(values));
    params.endTime = new Date(params.endTime).getTime();
    // if (type === 2) {
    //   approvalProcessExcelTemp(params).then((res: any) => {
    //     const { data, response } = res;
    //     const reader = new FileReader();
    //     reader.onload = function () {
    //       try {
    //         const resContent = reader.result ? JSON.parse(reader.result.toString()) : '';
    //         if (resContent.statusCode) {
    //           message.error(resContent.errMsg);
    //         }
    //       } catch {
    //         const el = document.createElement('a');
    //         el.style.display = 'none';
    //         el.href = URL.createObjectURL(data);
    //         const filename =
    //           response.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1] || '';
    //         el.download = filename || 'auditForm数据报表信息.xlsx';
    //         document.body.append(el);
    //         el.click();
    //         window.URL.revokeObjectURL(el.href);
    //         document.body.removeChild(el);
    //       }
    //     };
    //     reader.readAsText(data);
    //   });
    // } else if (type === 1) {
    //   approvalProcess(params).then((res: DataReport.auditFormResult) => {
    //     if (res?.statusCode === 200) {
    //       const list: any[] = res?.data?.data || [];
    //       list.forEach((item, index) => {
    //         item.index = index;
    //       });
    //       setDataSource(list);
    //     } else {
    //       setDataSource([]);
    //       message.error(res.errMsg);
    //     }
    //   });
    // }
  };
  useEffect(() => {
    onSearch(1);
  }, []);
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
    },
    {
      title: '审批类型（流程名称）',
      dataIndex: 'name',
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
    },
    {
      title: '客户号',
      dataIndex: 'customerCode',
    },
    {
      title: '毛利(%)',
      dataIndex: 'gpRate',
    },
    {
      title: '金额',
      dataIndex: 'amount',
    },
    {
      title: '发起人',
      dataIndex: 'startUser',
    },
    {
      title: '发起时间',
      dataIndex: 'startTime',
    },
    {
      title: '处理时间',
      dataIndex: 'endTime',
    },
  ];
  return (
    <div className="contentSty">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Form
          layout="inline"
          form={form}
          initialValues={{
            endTime: moment(new Date(), 'YYYY-MM-DD'),
            type: '',
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="审批时间："
            name="endTime"
            rules={[{ required: true, message: '请选择审批时间!' }]}
          >
            <DatePicker allowClear={false} />
          </Form.Item>
          <Form.Item label="审批类型：" name="type">
            <Select style={{ width: 150 }}>
              <Option value="">==请选择==</Option>
              <Option value="1">报价单流程</Option>
              <Option value="2">订单流程</Option>
              <Option value="3">售后流程</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={() => onSearch(1)}>
                查询
              </Button>
              <Button type="primary" onClick={() => onSearch(2)}>
                导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
        <Table dataSource={dataSource} columns={columns} rowKey="index" />
      </Space>
    </div>
  );
};

export default AuditForm;
