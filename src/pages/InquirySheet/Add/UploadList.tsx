import React, { useState, useEffect } from 'react';
import { Space, Button, Table, Divider } from 'antd';
import UploadInfo from '../components/UploadInfo';
import { history, useModel } from 'umi';
const UploadList: React.FC<{ getData?: any; sourceData?: any; createName?: any }> = (
  props: any,
) => {
  const [data, setData]: any = useState([]);
  const [isUpload, setIsUpload]: any = useState(false);
  const [btnShow, setBtnShow]: any = useState(true);
  const [selectedRowsKeys, setSelectedRowsKeys]: any = useState([]);
  const { initialState } = useModel('@@initialState');
  useEffect(() => {
    if (props.getData) {
      props.getData(data);
    }
  }, [data]);
  useEffect(() => {
    if (props.sourceData) {
      setData(props.sourceData);
    }
  }, [props.sourceData]);
  const loadList = (val: any[]) => {
    const temp = val.filter((item: any) => {
      const list = data.filter((ite: any) => ite.resourceName === item.resourceName);
      return !list.length;
    });
    setData(data.concat(temp));
    setIsUpload(false);
  };
  const onRemove = (name: string) => {
    const tempList: any = data.filter((item: any) => item.resourceName !== name);
    setData(tempList);
  };
  const deleteAll = () => {
    const tempList: any = data.filter((item: any) => !selectedRowsKeys.includes(item.resourceName));
    setData(tempList);
    setSelectedRowsKeys([]);
    setIsUpload(false);
  };
  const columns: any = [
    {
      align: 'left',
      title: '文件名称',
      dataIndex: 'resourceName',
    },
    {
      title: '操作',
      render: (text: any) => (
        <Space>
          <Button type="link" key={'下载'} href={text.resourceUrl} size="small">
            下载
          </Button>
          {btnShow &&
            (!props.createName || initialState?.currentUser?.userName === props.createName) && (
              <Button
                key={'移除'}
                size="small"
                type="link"
                onClick={() => {
                  onRemove(text.resourceName);
                }}
              >
                移除
              </Button>
            )}
        </Space>
      ),
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowsKeys(selectedRowKeys);
    },
  };
  useEffect(() => {
    const lastName: any = history.location.pathname;
    if (lastName.indexOf('add') === -1 && lastName.indexOf('edit') === -1) {
      setBtnShow(false);
    }
  }, []);
  return (
    <div className="base-info" style={{ marginBottom: '10px' }}>
      {btnShow && (
        <Space split={<Divider type="vertical" />} style={{ margin: ' 5px 0 0' }}>
          <Button
            type="primary"
            size="small"
            key={'上传附件'}
            onClick={() => {
              setIsUpload(true);
            }}
          >
            上传附件
          </Button>
          <Button key={'删除选中'} onClick={deleteAll} size="small">
            删除选中
          </Button>
        </Space>
      )}
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        rowKey={'resourceName'}
        size={'small'}
        pagination={{ defaultPageSize: 5 }}
        bordered
        style={{ width: '70%', marginTop: '5px' }}
      />
      <UploadInfo visible={isUpload} getList={loadList} />
    </div>
  );
};

export default UploadList;
