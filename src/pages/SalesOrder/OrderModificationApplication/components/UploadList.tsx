import React, { useState, useEffect } from 'react';
import { Space, Button, message } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import UploadForm from '@/pages/SalesOrder/components/UploadForm';
import { history, useModel } from 'umi';
import { saveRefResource } from '@/services/SalesOrder';

const UploadList: React.FC<{ getData?: any; sourceData?: any; createName?: any; dynacId?: any }> = (
  props: any,
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

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
  const loadList = async (val: any[]) => {
    const temp = val.filter((item: any) => {
      const list = data.filter((ite: any) => ite.resourceName === item.resourceName);
      return !list.length;
    });
    if (props?.dynacId) {
      const resourceVOList: any = [];
      val.forEach((e: any) => {
        resourceVOList.push({
          resourceName: e.resourceName,
          resourceUrl: e.resourceUrl,
          fileType: e.type,
        });
      });
      const params = {
        sourceId: props?.dynacId,
        sourceType: 120,
        resourceVOList,
      };
      await saveRefResource(params);
      //  刷接口
    }
    setData(data.concat(temp));
    setIsUpload(false);
  };
  const onRemove = (name: string) => {
    const tempList: any = data.filter((item: any) => item.resourceName !== name);
    setData(tempList);
  };
  const deleteAll = () => {
    const tempList: any = data.filter((item: any) => !selectedRowsKeys.includes(item.resourceName));
    console.log(selectedRowsKeys);
    if (JSON.stringify(selectedRowsKeys) == '[]') {
      message.error('请至少选择一个文件！', 3);
    } else {
      setData(tempList);
      setSelectedRowsKeys([]);
      setIsUpload(false);
    }
  };
  const fileNameRowWidth = (100 % -80) - 100;
  const attachment_columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      // valueType: 'index',
      width: 40,
      fixed: 'left',
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '操作',
      width: 80,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            key={'下载'}
            type="link"
            onClick={() => window.open(`${record.resourceUrl}?token=${Cookies.get('ssoToken')}`)}
          >
            下载
          </Button>
          {btnShow &&
            (!props.createName || initialState?.currentUser?.userName === props.createName) && (
              <Button
                key={'移除'}
                size="small"
                type="link"
                onClick={() => {
                  onRemove(record.resourceName);
                }}
              >
                移除
              </Button>
            )}
        </Space>
      ),
      fixed: 'right',
    },
    {
      title: '文件名称',
      dataIndex: 'resourceName',
      width: fileNameRowWidth,
      className: 'alignLeft',
      fixed: 'left',
      sorter: (a, b) => (a.resourceName - b.resourceName ? 1 : -1),
    },
  ];

  attachment_columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowsKeys(selectedRowKeys);
    },
  };
  useEffect(() => {
    const lastName: any = history.location.pathname;
    if (lastName.indexOf('OMA') === -1) {
      setBtnShow(false);
    }
    if (lastName.indexOf('offer') > 0) {
      setBtnShow(true);
    }
    if (lastName.indexOf('task-all') > 0) {
      setBtnShow(true);
    }
  }, []);
  return (
    <div className="detail_table_mod" style={{ width: '70%' }}>
      <ProTable<any>
        columns={attachment_columns}
        bordered
        size="small"
        rowSelection={{ type: 'checkbox', fixed: 'left', width: '40', ...rowSelection }}
        dataSource={data}
        rowKey={'resourceName'}
        search={false}
        options={false}
        tableAlertRender={false}
        defaultSize="small"
        scroll={{ x: 100, y: 250 }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
        }}
        headerTitle={
          <Space style={{ marginBottom: '10px' }}>
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
        }
      />
      <UploadForm visible={isUpload} getList={loadList} maxCount={100} />
    </div>
  );
};

export default UploadList;
