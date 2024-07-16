import { createSpecialRequest, getOrderDateList, getStock } from '@/services/SalesOrder/index';
import { getEnv } from '@/services/utils';
import { FolderOpenOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Select, Upload } from 'antd';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import './style.less';

const prefix = getEnv();
interface closeModal {
  applyModalHandleOk: any;
  detailTableReload: any;
}
const ApplyForm: React.FC<{ sku: string; lineData: object; tableRowData: object }, closeModal> = (
  props,
) => {
  const { sku, lineData, tableRowData } = props;
  const [applyForm] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [uploadDisabled, setUploadDisabled] = useState(false);
  const [SpeicalTypeData, setSpeicalTypeData] = useState(false);
  const [data, setData]: any = useState([]);
  const [stock, setStock]: any = useState(0);
  useEffect(() => {
    getOrderDateList({ type: 'special' }).then((res: any) => {
      if (res.errCode === 200) {
        setSpeicalTypeData(res.data.dataList);
      }
    });

    getStock({ orderNo: tableRowData.orderNo, sku: sku }).then((res: any) => {
      if (res.errCode === 200) {
        setStock(res.data?.stockCount);
      }
    });

    //设置select初始值
    // applyForm.setFieldsValue({
    //   specialType: SpeicalTypeData && SpeicalTypeData[0] ? SpeicalTypeData[0].key : '',
    // });
  }, []);
  const onFinish = (values: any) => {
    setConfirmLoading(true);
    const formData = JSON.parse(JSON.stringify(values));

    const saveData = {
      customerCode: formData.customerCode,
      customerName: formData.customerName,
      lineId: formData.lineId,
      orderNo: formData.orderNo,
      specialType: formData.specialType,
      requestAmount: formData.requestAmount,
      csrRemark: formData.csrRemark,
      purchaseAccount: formData.purchaseAccount,
      purchaseTel: formData.purchaseTel,
      requestReason: formData.requestReason,
      sku: formData.sku,
      inventory: formData.inventory,
      remark: formData.remark,
      resourceVOList: data,
    };
    console.log(saveData);
    createSpecialRequest(saveData)
      .then((res: any) => {
        console.log(res);
        if (res.errCode === 200) {
          props.applyModalHandleOk();
          setConfirmLoading(false);
          props.detailTableReload();
          message.success('特殊需求申请提交成功', 3);
          applyForm.resetFields();
        } else {
          message.error(res.errMsg);
          setConfirmLoading(false);
        }
      })
      .finally(() => {
        return;
      });

    // const formData = new FormData();
    // if (values.UploadApplyField && values.UploadApplyField.length > 0) {
    //   values.UploadApplyField.forEach((file) => {
    //     formData.append('files', file);
    //   });
    // }

    // console.log('Success:', values);

    //  setTimeout(() => {
    //    props.applyModalHandleOk();
    // props.detailTableReload();
    //    setConfirmLoading(false);
    //    message.success('特殊需求申请提交成功', 3);
    //    applyForm.resetFields();
    //  }, 2000);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const onReset = () => {
    applyForm.resetFields();
    props.applyModalHandleOk();
  };

  const [fileList, setFileList] = useState([]);

  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (e.file.size / 1024 / 1024 > 100) {
      return [];
    } else {
      setFileList(e.fileList);
      console.log(fileList);
      if (e.fileList.length >= 1) {
        setUploadDisabled(true);
      } else {
        setUploadDisabled(false);
      }
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    }
  };

  const uploadProps = {
    name: 'file',
    showUploadList: true,
    multiple: false,
    maxCount: 1,
    action: `${prefix}/omsapi/refResource/upload`,
    headers: {
      token: Cookies.get('ssoToken'),
    },
    onRemove: () => {
      setData([]);
      setFileList([]);
    },
    beforeUpload(file: any) {
      if (file.size / 1024 / 1024 > 100) {
        message.error({
          content: '文件大小不能超过100MB!',
        });
        return false;
      }
      // let isExist = false;
      // data.forEach((item: any) => {
      //   if (item.resourceName === file.name) {
      //     isExist = true;
      //   }
      // });
      // return !isExist;
    },
    onChange(info: any) {
      if (info.file.size / 1024 / 1024 > 100) {
        return false;
      } else {
        const tempList = JSON.parse(JSON.stringify(data));
        let isExist = false;
        tempList.forEach((item: any) => {
          if (item.resourceName === info.file.name) {
            isExist = true;
            // item.status = info.file.status;
          }
        });
        if (!isExist) {
          if (tempList.length === 1) {
            tempList.shift();
          }
          tempList.push({
            resourceName: info.file.name,
            resourceUrl: info.file.name,
            // percent: info.file.percent,
            // status: '上传中',
            fileType: info.file.type,
            // size: info.file.size,
          });
        }
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          if (info.file?.response?.errCode === 200) {
            // const name = info.file.response.data.resourceName
            const url = info.file.response.data.resourceUrl;
            tempList.forEach((item: any) => {
              if (item.resourceName === info.file.name) {
                item.resourceUrl = url;
              }
            });
          }
        } else if (info.file.status === 'error') {
        }
        setData(tempList);
      }
    },
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
  // 	if (file.size / 1024 > 100) {
  // 	  message.error({
  // 	    content: '文件大小不能超过100MB!',
  // 	  });
  // 	  return false;
  // 	}
  // 			fileList:[...fileList, file]
  // 			setFileList(fileList)
  // 		return false;
  // 	},
  // 	fileList,
  // };

  return (
    <div id="applicationForSpecialNeeds">
      <div className="form-content-search tabs-detail">
        <Form
          className="has-gridForm"
          name="applyForm"
          form={applyForm}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{
            orderNo: tableRowData.orderNo,
            lineId: lineData.orderLineId,
            customerCode: tableRowData.customerCode,
            customerName: tableRowData.customerName,
            purchaseAccount: tableRowData.purchaseAccount,
            purchaseTel: tableRowData.purchaseTel,
            sku: sku,
            inventory: stock,
            requestAmount: lineData.qty,
            csrRemark: tableRowData.csrRemark,
          }}
        >
          <h4 className="fromTitle">订单信息</h4>
          <div className="ant-advanced-form three-gridCol noBgBordCol upDetailCol">
            <Form.Item label="订单编号" name="orderNo">
              <span className="form-span">{tableRowData?.orderNo}</span>
            </Form.Item>
            <Form.Item label="行号" name="lineId">
              <span className="form-span">{lineData?.orderLineId}</span>
            </Form.Item>
            <Form.Item label="客户号" name="customerCode">
              <span className="form-span">{tableRowData?.customerCode}</span>
            </Form.Item>
            <Form.Item label="客户名称" name="customerName">
              <span className="form-span">{tableRowData?.customerName}</span>
            </Form.Item>
            <Form.Item label="采购单位客户号">
              <span className="form-span">{tableRowData?.purchaseCode}</span>
            </Form.Item>
            <Form.Item label="采购单位主销售">
              <span className="form-span">{tableRowData?.purchaseSalesName}</span>
            </Form.Item>
            <Form.Item label="下单人" name="purchaseAccount">
              <span className="form-span">{tableRowData?.purchaseAccount}</span>
            </Form.Item>

            <Form.Item label="下单人电话" name="purchaseTel" className="minLabel">
              <span className="form-span">{tableRowData?.purchaseTel}</span>
            </Form.Item>

            <Form.Item label="SKU" name="sku">
              <span className="form-span">{sku}</span>
            </Form.Item>
            <Form.Item label="库存" name="inventory">
              <span className="form-span">{stock}</span>
            </Form.Item>
            <Form.Item label="需求数量" name="requestAmount">
              <span className="form-span">{lineData?.qty}</span>
            </Form.Item>
            <Form.Item label="CSR备注" name="csrRemark" className="fullLineGrid">
              <span className="form-span">{tableRowData?.csrRemark}</span>
            </Form.Item>
          </div>
          <h4 className="fromTitle">申请信息</h4>
          <div className="ant-advanced-form four-gridCol noBgBordCol downFormCol">
            <Form.Item
              className="twoGrid"
              name="specialType"
              label="申请需求类型"
              hasFeedback
              rules={[{ required: true, message: '请选择一种申请需求类型!' }]}
            >
              <Select placeholder="请选择申请需求类型">
                {SpeicalTypeData &&
                  SpeicalTypeData.map((item: any) => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.value}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="客户备注"
              className="fullLineGrid"
              name="requestReason"
              hasFeedback
              rules={[{ required: true, message: '请描述产品具体特殊要求!' }]}
            >
              <Input.TextArea
                showCount
                maxLength={255}
                placeholder="请描述产品具体特殊要求"
                allowClear
              />
            </Form.Item>

            <Form.Item
              label="备注"
              className="fullLineGrid"
              name="remark"
              hasFeedback
              rules={[{ required: true, message: '请输入备注!' }]}
            >
              <Input.TextArea showCount maxLength={255} placeholder="请输入备注" allowClear />
            </Form.Item>

            <Form.Item
              className="minLabel fullLineGrid"
              name="UploadApplyField"
              label="上传附件(MAX:1)"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              hasFeedback
            >
              <Upload accept="*" maxCount={1} {...uploadProps}>
                <Button size="large" icon={<FolderOpenOutlined />} disabled={uploadDisabled}>
                  选择要上传的附件
                </Button>
              </Upload>
            </Form.Item>
          </div>

          <div className="ant-modal-footer">
            <Button htmlType="button" onClick={onReset}>
              取 消
            </Button>
            <Button type="primary" htmlType="submit" loading={confirmLoading}>
              确认提交
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default ApplyForm;
