import React, { useState, useEffect } from 'react';
import { Space, Button, message, Modal } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import UploadForm from '@/pages/SalesOrder/components/UploadForm';
import { ExclamationCircleOutlined } from '@ant-design/icons';
// import { history, useModel } from 'umi';
import { history } from 'umi';
import { saveRefResource, getFilesList } from '@/services/SalesOrder';
import Option from './Option';

const UploadList: React.FC<{
  getData?: any;
  sourceData?: any;
  type?: any;
  dynacId?: any;
  getDeleteData?: any;
}> = (props: any) => {
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

  const [deleteData, setDeleteData]: any = useState([]);

  // const { initialState } = useModel('@@initialState');

  // const [fileDataList, setFileDataList] = useState<any>([]);

  const getFileDataList = async (sid: any) => {
    const searchParams: any = {
      pageNumber: currentPage,
      pageSize: currentPageSize,
      sourceId: sid,
      sourceType: 40,
      subType: 30,
      // sourceType: 150,
      // subType: 30,
    };
    const res = await getFilesList(searchParams);
    if (res.errCode === 200) {
      // setFileDataList(res?.data?.list);
      if (res?.data?.list) {
        setData(res?.data?.list);
      }
      // setTotal(res.data?.total)
    } else {
      message.error(res.errMsg, 3);
    }
  };

  useEffect(() => {
    getFileDataList(props.dynacId);
    // if (fileDataList) {
    //   setData(fileDataList);
    // }
  }, [props.dynacId]);

  useEffect(() => {
    if (props.getData) {
      props.getData(data);
    }
  }, [data]);

  const loadList = async (val: any[]) => {
    const temp = val.filter((item: any) => {
      // const list = data.filter((ite: any) => ite.resourceName === item.resourceName);
      const list = data.filter((ite: any) => ite.sid === item.sid);
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
        // sourceType: 150,
        sourceType: 40,
        subType: 30,
        resourceVOList,
      };
      if (props.type === 'view') {
        await saveRefResource(params);
      }

      //  刷接口
    }
    setData(data.concat(temp));
    props.getData(data.concat(temp));
    setIsUpload(false);
  };

  // const onRemove = (name: string) => {
  //   Modal.confirm({
  //     title: '您确定要删除吗?',
  //     icon: <ExclamationCircleOutlined />,
  //     onOk() {
  //       const tempList: any = data.filter((item: any) => item.resourceName !== name);
  //       setData(tempList);
  //     },
  //   });
  // };
  // const onRemove = (record: any) => {
  //   removeFile(record.sid)
  //     .then((res: any) => {
  //       if (res?.errCode === 200) {
  //         const tempList: any = data.filter((item: any) => item.sid !== record.sid);
  //         setData(tempList);
  //       } else {
  //         message.error(res?.errMsg);
  //       }
  //     })
  //     .finally(() => {
  //       return;
  //     })
  //     .catch((errorInfo: any) => {
  //       message.error(errorInfo, 3);
  //     });
  // };
  // const deleteAll = () => {
  //   Modal.confirm({
  //     title: '您确定要删除吗?',
  //     icon: <ExclamationCircleOutlined />,
  //     onOk() {
  //       const tempList: any = data.filter(
  //         (item: any) => !selectedRowsKeys.includes(item.resourceName),
  //       );
  //       console.log(selectedRowsKeys);
  //       if (JSON.stringify(selectedRowsKeys) == '[]') {
  //         message.error('请至少选择一个文件！', 3);
  //       } else {
  //         setData(tempList);
  //         setSelectedRowsKeys([]);
  //         setIsUpload(false);
  //       }
  //     },
  //   });
  // };
  const onRemove = (recordData: any) => {
    Modal.confirm({
      title: '您确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        const tempList: any = data.filter(
          (item: any) => item.resourceName !== recordData.resourceName,
        );
        setData(tempList);
        props.getData(tempList);
        if (recordData.sid) {
          const delData: any = deleteData.concat(recordData.sid);
          props.getDeleteData(delData);
          setDeleteData(delData);
        }
      },
    });
  };

  const deleteAll = () => {
    if (JSON.stringify(selectedRowsKeys) == '[]') {
      message.error('请至少选择一个文件！', 3);
    } else {
      Modal.confirm({
        title: '您确定要删除吗?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          const tempList: any = data.filter(
            (item: any) => !selectedRowsKeys.includes(item.resourceName),
          );
          const thisData: any = data.filter((item: any) =>
            selectedRowsKeys.includes(item.resourceName),
          );
          const detSidData: any = [];
          thisData.filter((i: any) => {
            if (i.sid) {
              detSidData.push(i.sid);
            }
          });
          const delData: any = deleteData.concat(detSidData);
          props.getDeleteData(delData);
          setDeleteData(delData);
          console.log(delData);

          setData(tempList);
          props.getData(tempList);
          setSelectedRowsKeys([]);
          setIsUpload(false);
        },
      });
    }
  };

  // const deleteAll = () => {
  //   const tempList: any = data.filter((item: any) => !selectedRowsKeys.includes(item.sid));
  //   console.log(selectedRowsKeys);
  //   if (JSON.stringify(selectedRowsKeys) == '[]') {
  //     message.error('请至少选择一个文件！', 3);
  //   } else {
  //     const deleteData: any = selectedRowsKeys;
  //     deleteData.filter((item: any) => {
  //       removeFile(item)
  //         .then((res: any) => {
  //           if (res?.errCode === 200) {
  //           } else {
  //             message.error(res?.errMsg);
  //           }
  //         })
  //         .finally(() => {
  //           return;
  //         })
  //         .catch((errorInfo: any) => {
  //           message.error(errorInfo, 3);
  //         });
  //     });

  //     setData(tempList);
  //     setSelectedRowsKeys([]);
  //     setIsUpload(false);
  //   }
  // };
  // const fileNameRowWidth = (100 % -40) - 85;
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
      width: 145,
      render: (_, record) => {
        return (
          <Option
            // onRemove={() => onRemove(record.resourceName)}
            onRemove={() => onRemove(record)}
            btnShow={btnShow}
            type={props.type}
            record={record}
            key={record.resourceUrl}
          />
        );
        // <Space>
        //   <Button
        //     size="small"
        //     key={'下载'}
        //     type="link"
        //     onClick={() => window.open(`${record.resourceUrl}?token=${Cookies.get('ssoToken')}`)}
        //   >
        //     下载
        //   </Button>
        //   {btnShow &&
        //     (!props.createName || initialState?.currentUser?.userName === props.createName) && (
        //       <Button
        //         key={'移除'}
        //         size="small"
        //         type="link"
        //         onClick={() => {
        //           onRemove(record.resourceName);
        //         }}
        //       >
        //         移除
        //       </Button>
        //     )}
        // </Space>
      },
      fixed: 'right',
    },
    {
      title: '文件名称',
      dataIndex: 'resourceName',
      className: 'alignLeft',
      width: '100%',
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
  const [rowSelectionOption, setRowSelectionOption]: any = useState({
    type: 'checkbox',
    fixed: 'left',
    width: '40',
    ...rowSelection,
  });
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
    if (props.type == 'view') {
      setRowSelectionOption(false);
    }
  }, []);

  return (
    <div className="detail_table_mod" style={{ width: '70%' }}>
      <ProTable<any>
        columns={attachment_columns}
        bordered
        size="small"
        // rowSelection={{ type: 'checkbox', fixed: 'left', width: '40', ...rowSelection }}
        rowSelection={rowSelectionOption}
        dataSource={data}
        rowKey={'resourceName'}
        search={false}
        options={false}
        tableAlertRender={false}
        defaultSize="small"
        scroll={{ x: 100, y: 250 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
        }}
        headerTitle={
          <Space>
            <Button
              style={{ marginBottom: '10px' }}
              type="primary"
              size="small"
              key={'上传附件'}
              onClick={() => {
                setIsUpload(true);
              }}
              className={`${props.type === 'view' && 'fixedTop'}`}
            >
              {props.type !== 'view' && <span>上传附件</span>}
              {props.type === 'view' && <span>追加附件</span>}
            </Button>
            {props.type !== 'view' && (
              <Button
                key={'删除选中'}
                onClick={deleteAll}
                size="small"
                style={{ marginBottom: '10px' }}
              >
                删除选中
              </Button>
            )}
          </Space>
        }
      />
      <UploadForm visible={isUpload} getList={loadList} maxCount={100} />
    </div>
  );
};

export default UploadList;
