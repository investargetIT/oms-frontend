import React, { useState } from 'react';
import { Form, Input, Button, message, Radio, Select, Upload } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import { remarkUpdate, remarkCancel } from '../contants';
interface closeModal {
  applyModalHandleOk: any;
}
const ApplyForm: React.FC<{ id: string }, closeModal> = (props) => {
  const { id } = props;
  const [applyForm] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [uploadDisabled, seUploadDisabled] = useState(false);
  const [selectValue, setValue] = useState(10);
  const onFinish = (values: any) => {
    setConfirmLoading(true);
    const formData = new FormData();
    if (values.UploadApplyField && values.UploadApplyField.length > 0) {
      values.UploadApplyField.forEach((file) => {
        formData.append('files', file);
      });
    }

    console.log('Success:', values);
    formData.append('id', id);
    formData.append('Methods', values.Methods);
    if (values.Methods == '10') {
      formData.append('RemarkUpdate', values.RemarkUpdate);
    } else {
      formData.append('RemarkCancel', values.RemarkCancel);
    }
    formData.append('ChangeComment', values.ChangeComment);

    setTimeout(() => {
      props.applyModalHandleOk();
      setConfirmLoading(false);
      message.success('申请提交成功', 3);
      applyForm.resetFields();
      setValue(10);
    }, 2000);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const onReset = () => {
    applyForm.resetFields();
    setValue(10);
    props.applyModalHandleOk();
  };
  const onRadioChange = (e) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
    console.log(selectValue);
  };

  const { TextArea } = Input;
  const [fileList, setFileList] = useState([]);

  const normFile = (e: any) => {
    console.log('Upload event:', e);

    setFileList(e.fileList);
    console.log(fileList);
    console.log('===', e.fileList.length);

    if (e.fileList.length >= 1) {
      seUploadDisabled(true);
    } else {
      seUploadDisabled(false);
    }
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  // const dataProps = {
  // 	onRemove: (file) => {
  // 			const index = fileList.indexOf(file);
  // 			const newFileList = fileList.slice();
  // 			newFileList.splice(index, 1);
  // 			return {fileList: newFileList}
  // 			setFileList(newFileList)
  // 	},
  // 	beforeUpload: (file) => {
  // 			fileList:[...fileList, file]
  // 			setFileList(fileList)
  // 		return false;
  // 	},
  // 	fileList,
  // };

  return (
    <Form
      name="applyForm"
      form={applyForm}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 15 }}
      initialValues={{ Methods: '10' }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="申请方式"
        name="Methods"
        rules={[{ required: true, message: '请选择一种申请方式!' }]}
      >
        <Radio.Group onChange={onRadioChange} value={selectValue}>
          <Radio value="10">修改</Radio>
          <Radio value="20">整单取消</Radio>
        </Radio.Group>
      </Form.Item>
      {}
      {applyForm.getFieldsValue(true).Methods == 20 ? (
        <Form.Item
          name="RemarkCancel"
          label="备注详细信息"
          hasFeedback
          rules={[{ required: true, message: '请选择一种备注详细信息!' }]}
        >
          <Select placeholder="请选择备注详细信息">
            {remarkCancel &&
              remarkCancel.map((item: any) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.label}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      ) : (
        <Form.Item
          name="RemarkUpdate"
          label="备注详细信息"
          hasFeedback
          rules={[{ required: true, message: '请选择一种备注详细信息!' }]}
        >
          <Select placeholder="请选择备注详细信息">
            {remarkUpdate &&
              remarkUpdate.map((item: any) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.label}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      )}
      <Form.Item
        label="申请原因描述"
        name="ChangeComment"
        rules={[{ required: true, message: '请输入申请原因描述!' }]}
      >
        <TextArea placeholder="请描述您的申请原因" rows={4} />
      </Form.Item>

      <Form.Item
        name="UploadApplyField"
        label="导入文件"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload accept=".xls, .xlsx">
          <Button size="large" icon={<FolderOpenOutlined />} disabled={uploadDisabled}>
            选择要导入的Excel文件
          </Button>
        </Upload>
      </Form.Item>

      <div className="ant-modal-footer">
        <Button htmlType="button" onClick={onReset}>
          取 消
        </Button>
        <Button type="primary" htmlType="submit" loading={confirmLoading}>
          确认提交
        </Button>
      </div>
    </Form>
  );
};
export default ApplyForm;
