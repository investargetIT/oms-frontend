/* eslint-disable @typescript-eslint/no-unused-expressions */
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal, Space, Upload } from 'antd';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { getEnv } from '@/services/utils';
interface UploadFileProps {
  showList?: (arr: any) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ showList }) => {
  const [list, setList] = useState<any>([]);
  const columns: ProColumns<any>[] = [
    { title: '文件名称', dataIndex: 'resourceName' },
    { title: '文件类型', dataIndex: 'type', width: 150 },
    {
      title: '文件大小',
      dataIndex: 'size',
      width: 150,
      render: (text: any) => (
        <span>
          {Number(text) / 1024 / 1024 > 1024
            ? (Number(text) / 1024 / 1024).toFixed(2) + 'MB'
            : (Number(text) / 1024).toFixed(2) + 'KB'}
        </span>
      ),
    },
    {
      title: '文件状态',
      dataIndex: 'status',
      width: 150,
      render: (text: any) => (
        <span style={{ color: text === 'done' ? 'green' : 'red' }}>
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
      dataIndex: 'option',
      width: 150,
      render: (_, record: any) => (
        <Button
          size="small"
          type="link"
          key={'删除'}
          onClick={() => {
            Modal.confirm({
              title: '确认删除吗？',
              content: '',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                setList(list.filter((io: any) => io.resourceName !== record.resourceName));
                message.success('已删除文件');
              },
            });
          }}
        >
          删除
        </Button>
      ),
    },
  ];

  const uploadProps = {
    name: 'file',
    action: `${getEnv()}/omsapi/refResource/upload`,
    headers: {
      token: Cookies.get('ssoToken'),
    },
    beforeUpload(file: any) {
      if (file.size / 1024 / 1024 > 100) {
        message.error({
          content: '文件大小不能超过100MB!',
        });
        return false;
      }
      let isExist = false;
      list?.forEach((item: any) => {
        if (item.resourceName === file.name) {
          isExist = true;
        }
      });
      if (isExist) {
        message.error({
          content: '文件名称重复请重命名!',
        });
      }
      return !isExist;
    },
    onChange(msg: any) {
      if (msg.file.status !== 'uploading') {
        console.log(msg.file, msg.fileList);
      }
      if (msg.file.status === 'done') {
        // message.success(`${msg.file.name} file uploaded successfully`);
        let isExist = false;
        const tempList = JSON.parse(JSON.stringify(list));
        tempList.forEach((item: any) => {
          if (item.resourceName === msg.file.name) {
            isExist = true;
            item.status = msg.file.status;
            if (msg.file.status == undefined) {
              item.status = 'done';
            }
          }
        });
        if (!isExist) {
          tempList.push({
            resourceName: msg.file.response?.data?.resourceName,
            resourceUrl: msg.file.response?.data?.resourceUrl,
            status: 'done',
            type: msg.file.type,
            size: msg.file.size,
            fileType: msg.file.type,
          });
        }
        if (msg.file?.response?.errCode === 200) {
          setList(tempList);
        } else {
          return message.error('文件上传失败，请重新上传');
        }
        showList && showList(tempList);
        // return
        // const newList = msg?.fileList
        //   ?.map((io: any) => ({
        //     resourceName: io?.response?.data?.resourceName,
        //     resourceUrl: io?.response?.data?.resourceUrl,
        //     type: io?.type,
        //     size: io.size,
        //     status: io?.status,
        //   }))
        //   ?.filter((ic: any) => ic.resourceName);
        // const arr = newList.concat(listFile);
        // const newobj = {};
        // const newarr = arr.reduce((preVal: any, curVal: any) => {
        //   newobj[curVal.resourceName] ? '' : (newobj[curVal.resourceName] = preVal.push(curVal));
        //   return preVal;
        // }, []);
        // setList(newarr);
      } else if (msg.file.status === 'error') {
        message.error(`${msg.file.name} file upload failed.`);
        return false;
      }
    },
  };

  // useEffect(() => {
  //   showList && showList(list);
  // }, [list]);

  return (
    <>
      <ProTable<any>
        columns={columns}
        size="small"
        bordered
        className="hide-upload"
        rowKey="resourceName"
        options={false}
        search={false}
        dateFormatter="string"
        dataSource={list}
        request={() => {
          return Promise.resolve({
            data: list,
            success: true,
          });
        }}
        tableAlertRender={false}
        rowSelection={false}
        headerTitle={
          <Space style={{ marginBottom: '10px' }}>
            <Upload {...uploadProps}>
              <Button type="primary">选择文件</Button>
              <span>（已选择{list.length}个文件）</span>
            </Upload>
          </Space>
        }
        pagination={false}
      />
    </>
  );
};

export default UploadFile;
