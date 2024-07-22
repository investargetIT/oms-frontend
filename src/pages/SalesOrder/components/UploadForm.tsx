import { Button, Modal, Space, Upload, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
// import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { getEnv } from '@/services/utils';
import ProTable from '@ant-design/pro-table';
import Cookies from 'js-cookie';
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';
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
  const [confirmLoading, setConfirmLoading] = useState(false);
  const onRemove = (name: string) => {
    let tempList: any = JSON.parse(JSON.stringify(data));
    tempList = tempList.filter((item: any) => item.resourceName != name);
    setData(tempList);
  };
  const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
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
      width: 120,
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
      width: 100,
      dataIndex: 'status',
      render: (text: string) => (
        <span className={text} style={{ display: ' block', whiteSpace: 'nowrap' }}>
          {text === 'done'
            ? '上传成功'
            : text === 'error'
            ? '上传失败'
            : text === 'uploading'
            ? '上传中'
            : '上传中'}
        </span>
      ),
    },
    {
      title: '操作',
      width: 120,
      render: (record: any) => (
        <Space>
          {record.resourceUrl && (
            <Button key={'下载'} type="link" href={record.resourceUrl}>
              下载
            </Button>
          )}
          {record.resourceUrl && (record.status == 'done' || record.status == 'error') && (
            <Button
              type="link"
              key={'移除'}
              onClick={() => {
                onRemove(record.resourceName);
              }}
            >
              移除
            </Button>
          )}
          {!record.resourceUrl && record.status == 'uploading' && <Spin indicator={loadingIcon} />}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    setIsModalVisible(!!prop.visible);
    setConfirmLoading(false);
    if (prop.maxCount) {
      setMaxCount(prop.maxCount);
    }
  }, [prop.visible]);
  const props = {
    name: 'file',
    showUploadList: false,
    multiple: true,
    maxCount: maxCount,
    // action: 'http://omsapi.test.mymro.cn/omsapi/refResource/upload',
    action: `${prefix}/omsapi/refResource/upload`,
    headers: {
      token: Cookies.get('ssoToken'),
    },
    beforeUpload(file: any) {
      if (file.size / 1024 / 1024 > 100) {
        // console.log(file.size, 'file.size123');
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
      // const tempList = JSON.parse(JSON.stringify(data));
      // isExist = false;
      // tempList.forEach((item: any) => {
      //   if (item.resourceName === file.name) {
      //     isExist = true;
      //     item.status = file.status;
      //   }
      // });
      // if (!isExist) {
      //   if (tempList.length === maxCount) {
      //     tempList.shift();
      //   }
      //   tempList.push({
      //     resourceName: file.name,
      //     percent: file.percent,
      //     status: 'uploading',
      //     type: file.type,
      //     size: file.size,
      //   });
      //   setData(tempList);
      //   setConfirmLoading(true);
      // }
      return !isExist;
    },
    onChange(info: any): any {
      setConfirmLoading(true);
      if (info.file.size / 1024 / 1024 > 100) {
        setConfirmLoading(false);
        return false;
      }
      const tempList = JSON.parse(JSON.stringify(data));
      let isExist = false;
      tempList.forEach((item: any) => {
        if (item.resourceName === info.file.name) {
          isExist = true;
          item.status = info.file.status;
          if (info.file.status == undefined) {
            item.status = 'done';
          }
          // item.status = 'done';
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
          createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        });
      }
      if (info.file.status !== 'uploading') {
        setConfirmLoading(false);
      }
      if (info.file.status === 'done') {
        // if (info.file?.response?.errCode === 200) {
        //   setConfirmLoading(false);
        //   // const name = info.file.response.data.resourceName
        //   const url = info.file.response.data.resourceUrl;
        //   tempList.forEach((item: any) => {
        //     if (item.resourceName === info.file.name) {
        //       item.resourceUrl = url;
        //     }
        //   });
        //   setData(tempList);
        // } else {
        //   return message.error('文件上传失败，请重新上传');
        // }
      } else if (info.file.status === 'error') {
        setConfirmLoading(false);
      }
    },
  };

  function uploadModalClose() {
    setData([]);
    prop.getList([]);
  }

  function uploadModalSubmit() {
    prop.getList(data);
    setData([]);
  }

  return (
    <Modal
      className="noTopFootBorder"
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
      footer={[]}
    >
      <ProTable<any>
        columns={columns}
        scroll={{ x: 100 }}
        bordered
        size="small"
        options={false}
        // request={() => {
        //   return Promise.resolve(data);
        // }}
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

      <div className="ant-modal-footer">
        <Button htmlType="button" onClick={uploadModalClose}>
          关 闭
        </Button>
        <Button
          type="primary"
          htmlType="button"
          loading={confirmLoading}
          onClick={uploadModalSubmit}
        >
          确 认
        </Button>
      </div>
    </Modal>
  );
};

export default UploadInfo;
