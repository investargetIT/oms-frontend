import { Button, message, Modal, Space, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
// import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { getEnv } from '@/services/utils';
import ProTable from '@ant-design/pro-table';
import Cookies from 'js-cookie';
import './index.less';

const prefix = getEnv();
interface uploadParams {
  visible?: boolean;
  getList: any;
  maxCount?: number;
}
const UploadInfo: React.FC<uploadParams> = (prop) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData]: any = useState([]);
  const [maxCount, setMaxCount]: any = useState(100);
  const onRemove = (name: string) => {
    let tempList: any = JSON.parse(JSON.stringify(data));
    tempList = tempList.filter((item: any) => item.resourceName != name);
    setData(tempList);
  };
  const columns: any = [
    {
      title: '文件名称',
      dataIndex: 'resourceName',
      width: 200,
    },
    {
      title: '文件类型',
      dataIndex: 'type',
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      render: (text: string) => (
        <span>
          {Number(text) / 1024 / 1024 > 1024
            ? (Number(text) / 1024 / 1024).toFixed(2) + 'MB'
            : (Number(text) / 1024).toFixed(2) + 'KB'}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: string) => (
        <span className={text}>
          {text === 'done' ? '上传成功' : text === 'error' ? '上传失败' : '上传中'}
        </span>
      ),
    },
    {
      title: '操作',
      render: (text: any) => (
        <Space>
          {text.resourceUrl && (
            <Button key={'下载'} type="link" href={text.resourceUrl}>
              下载
            </Button>
          )}
          <Button
            type="link"
            key={'移除'}
            onClick={() => {
              onRemove(text.resourceName);
            }}
          >
            移除
          </Button>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    setIsModalVisible(!!prop.visible);
    if (prop.maxCount) {
      setMaxCount(prop.maxCount);
    }
  }, [prop.visible]);
  const props = {
    name: 'file',
    showUploadList: false,
    multiple: true,
    maxCount: maxCount,
    action: `${prefix}/omsapi/refResource/upload`,
    headers: {
      token: Cookies.get('ssoToken'),
    },
    beforeUpload(file: any) {
      if (file.size / 1024 / 1024 > 100) {
        Modal.error({
          content: '文件大小不能超过100MB!',
        });
        return false;
      }
      let isExist = false;
      data.forEach((item: any) => {
        if (item.resourceName === file.name) {
          isExist = true;
        }
      });
      if (isExist) {
        Modal.error({
          content: '文件名称重复请重命名!',
        });
      }
      return !isExist;
    },
    onChange(info: any): any {
      if (info.file.size / 1024 / 1024 > 100) {
        return false;
      }
      const tempList = JSON.parse(JSON.stringify(data));
      let isExist = false;
      tempList.forEach((item: any) => {
        if (item.resourceName === info.file.name) {
          isExist = true;
          item.status = info.file.status;
        }
      });
      if (!isExist) {
        if (tempList.length === maxCount) {
          tempList.shift();
        }
        tempList.push({
          resourceName: info.file.name,
          percent: info.file.percent,
          status: 'done',
          type: info.file.type,
          size: info.file.size,
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
          setData(tempList);
        } else {
          return message.error('文件上传失败，请重新上传');
        }
      } else if (info.file.status === 'error') {
      }
    },
  };
  return (
    <Modal
      title={
        <div>
          <span style={{ fontWeight: 'bold', marginRight: '10px' }}>附件上传</span>
          <span>(附件上限{maxCount}个，单个文件不得超过100M)</span>
        </div>
      }
      visible={isModalVisible}
      width={'70%'}
      onOk={() => {
        prop.getList(data);
        setData([]);
      }}
      onCancel={() => {
        prop.getList([]);
        setData([]);
      }}
    >
      <ProTable<any>
        columns={columns}
        scroll={{ x: 100 }}
        bordered
        size="small"
        options={false}
        request={() => {
          return Promise.resolve(data);
        }}
        dataSource={data}
        pagination={false}
        rowKey="resourceName"
        search={false}
        headerTitle={
          <Space style={{ marginBottom: '10px' }}>
            <Upload {...props}>
              <Button type="primary" size="small" style={{ marginRight: '10px' }}>
                选择文件
              </Button>
              (已选择{data.length}个文件)
            </Upload>
          </Space>
        }
      />
    </Modal>
  );
};

export default UploadInfo;
