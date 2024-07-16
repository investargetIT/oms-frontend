import React, { useState } from 'react';
import './Inquiry.less';
import { Form, Space, Input, Button, Select, DatePicker } from 'antd';
interface searchProps {
  title?: string;
  getParams: any;
}
const SearchCondition: React.FC<searchProps> = (props) => {
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const { title } = props;
  const { Option } = Select;
  const [companyList, setCompanyList] = useState([]);
  const onFinish = (values: InquirySheet.SearchParams) => {
    setCompanyList([]);
    props.getParams(values);
  };
  return (
    <div className="form-content">
      <p className="form-title">{title || '查询条件'}</p>
      <Form form={form} layout="inline" className="ant-advanced-form" onFinish={onFinish}>
        <Form.Item name="test" label="询价单号">
          <Input placeholder="请输入询价单号" />
        </Form.Item>
        <Form.Item name="test1" label="客户名称">
          <Input placeholder="请输入客户名称" />
        </Form.Item>
        {props.children}
        <Form.Item name="test2" label="所属公司">
          <Select>
            {companyList.map((item: any) => (
              <Option value={item.id}>{item.label}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="test3" label="制造厂商型号">
          <Input placeholder="制造厂商型号" />
        </Form.Item>
        <Form.Item name="test4" label="品牌">
          <Input placeholder="品牌" />
        </Form.Item>
        <Form.Item name="test5" label="创建人">
          <Input placeholder="创建人" />
        </Form.Item>
        <Form.Item name="test6" label="创建时间">
          <RangePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item className="btnStyle">
          <Space>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
              }}
            >
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SearchCondition;
