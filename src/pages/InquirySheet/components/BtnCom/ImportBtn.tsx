import React, { useState, useEffect } from 'react';
import { Button, Upload, Modal, Space, message } from 'antd';
import Cookies from 'js-cookie';
import { getEnv } from '@/services/utils';
import { useLocation } from 'umi';
import { cascadeSave } from '@/services/InquirySheet';
import SpecialTable from '@/pages/InquirySheet/components/BtnCom/SpecialTable';
const ImportBtn: React.FC<{ selectedRow: any; recall?: any }> = (props: any) => {
  const [uploadUrl, setUploadUrl]: any = useState('');
  const [isModalVisible, setIsModalVisible]: any = useState(false);
  const [list, setList]: any = useState([]);
  const location = useLocation();
  const pathParams: any = location.state;
  useEffect(() => {
    const path: any = pathParams?.sorurceType || location.pathname.split('/').pop();
    if (path === 'createsku') {
      setUploadUrl(`${getEnv()}/omsapi/toAssortment/import`);
    } else {
      setUploadUrl(`${getEnv()}/omsapi/inqLnExcel/import/${path}`);
    }
  }, []);
  const uploadMsg = (successNum?: number, errorNum?: number, url?: string) => (
    <Space>
      <p style={{ width: '70%' }}>
        成功导入<span style={{ color: '#40A9FF', fontWeight: 'bold' }}>{successNum}</span>条，失败
        <span style={{ color: 'red', fontWeight: 'bold' }}>{errorNum}</span>条，可修改后重新导入
      </p>
      <Button type="link" href={url}>
        下载失败数据
      </Button>
    </Space>
  );
  let hide: any = null;
  const uploadProps: any = {
    maxCount: 1,
    accept: '.xls,.xlsx',
    name: 'file',
    showUploadList: false,
    action: uploadUrl,
    headers: {
      token: Cookies.get('ssoToken'),
    },
    onChange(info: any) {
      if (info.file.status === 'done') {
        if (hide) {
          setTimeout(hide, 100);
        }
        const res: any = info.file.response;
        if (res.errCode === 200) {
          if (res.data?.length) {
            setIsModalVisible(true);
            setList(res.data);
          } else {
            Modal.success({
              title: '导入成功!',
            });
            if (props.recall) props.recall();
          }
        } else {
          if (res.data) {
            Modal.warning({
              title: '导入结果提示',
              content: uploadMsg(res.data?.successNum, res.data?.errorNum, res.data?.url),
            });
          } else {
            Modal.warning({
              title: '导入结果提示',
              content: res.errMsg,
            });
          }
        }
      } else if (info.file.status === 'error') {
        if (hide) {
          setTimeout(hide, 100);
        }
        Modal.error({
          title: `${info.file.name} 导入失败!`,
        });
      } else if (info.file.status === 'uploading') {
        if (!hide)
          hide = message.loading({
            content: '接口疯狂加载中...',
            className: 'loadingMessage',
            duration: 0,
          });
      }
    },
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleOk = () => {
    Modal.confirm({
      title: '确定提交?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        cascadeSave({ list }).then((resd: any) => {
          if (resd.errCode === 200) {
            message.success('操作成功!');
            setIsModalVisible(false);
            if (props.recall) {
              props.recall();
            } else {
              history.go(-1);
            }
          } else {
            message.error(resd.errMsg);
          }
        });
      },
    });
  };
  const getData = (ls: any) => {
    setList(ls);
  };
  const columns: any = [
    { title: '行项目ID', dataIndex: 'sid', width: 150, ellipsis: true, fixed: 'left' },
    { title: '需求单号', dataIndex: 'inquiryCode', width: 200, ellipsis: true, fixed: 'left' },
    { title: 'SKU', dataIndex: 'sku', width: 200, ellipsis: true, fixed: 'left' },
    { title: '需求产品名称', dataIndex: 'reqProductName', width: 200, ellipsis: true },
    { title: '匹配类型', dataIndex: 'pairTypeStr', width: 200, ellipsis: true },
    { title: 'SKU产品名称', dataIndex: 'productNameZh', width: 200, ellipsis: true },
    { title: 'SKU类型', dataIndex: 'skuTypeStr', width: 200, ellipsis: true },
    { title: 'Product', dataIndex: 'productLineCode', editable: true, width: 200, ellipsis: true },
    { title: 'Segment', dataIndex: 'segmentCode', editable: true, width: 200, ellipsis: true },
    { title: 'Family', dataIndex: 'familyCode', editable: true, width: 200, ellipsis: true },
    { title: 'Category', dataIndex: 'categoryCode', editable: true, width: 200, ellipsis: true },
  ];

  return (
    <div>
      <Upload {...uploadProps}>
        <Button type="primary">导入</Button>
      </Upload>
      <Modal
        title="待完善产线"
        width={800}
        destroyOnClose={true}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <SpecialTable columns={columns} dataSource={list} getData={getData} />
      </Modal>
    </div>
  );
};
export default ImportBtn;
