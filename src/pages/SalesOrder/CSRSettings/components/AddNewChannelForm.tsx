import React, { useState, useRef } from 'react';
import { Button, message, Input } from 'antd';
import { getAllChannelList, createChannelConfig } from '@/services/SalesOrder/index';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
interface closeModal {
  addNewModalClose: any;
  tableReload: any;
}
const AddNewChannelForm: React.FC<closeModal> = (props: any) => {
  const ref: any = useRef<ActionType>();
  // const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const yClient = 210;
  const [createData, setCreateData] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
    setSelectedRows([]);
    setSelectedRowKeys([]);
    setCreateData({});
    console.log(selectedRows);
  }
  const onSelectChange = (selectedRowKeyss: React.Key[], selectedRowss: any[]) => {
    setCreateData(selectedRowss[0]);
    setSelectedRows(selectedRowss);
    setSelectedRowKeys(selectedRowKeyss);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  // const rowSelection = {
  //   onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
  //     setCreateData(selectedRows[0]);
  //   },
  // };
  const onFinish = () => {
    setConfirmLoading(true);
    const formData = JSON.parse(JSON.stringify(createData));
    if (JSON.stringify(createData) == '{}') {
      message.error('请选择一个渠道后再点击确认', 3);
      setConfirmLoading(false);
    } else {
      const saveData = {
        channel: formData.channel,
        // csrCheck: true,
        // needSalesConfirm: false,
        // enabled: true,
      };

      // createChannelConfig(saveData)
      //   .then((res: any) => {
      //     console.log(res);
      //     if (res.errCode === 200) {
      //       props.addNewModalClose();
      //       setConfirmLoading(false);
      //       message.success('渠道添加成功', 3);
      //       props.tableReload();
      //     } else {
      //       message.error(res.errMsg);
      //       setConfirmLoading(false);
      //     }
      //   })
      //   .finally(() => {
      //     return;
      //   });
    }
    // console.log(formData);
  };

  const onReset = () => {
    props.addNewModalClose();
  };

  const columns: ProColumns<any>[] = [
    {
      title: '#',
      dataIndex: 'index',
      // valueType: 'index',
      width: 40,
      fixed: 'left',
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
      search: false,
    },
    {
      title: '渠道号',
      dataIndex: 'channel',
      width: 60,
      sorter: (a, b) => (a.channel - b.channel ? 1 : -1),
      search: false,
    },
    {
      title: '渠道名称',
      dataIndex: 'channelName',
      width: 180,
      sorter: (a, b) => (a.channelName - b.channelName ? 1 : -1),
      renderFormItem: () => {
        return <Input allowClear placeholder="请输入渠道名称关键字" />;
      },
    },
    {
      title: '启用状态',
      width: 150,
      dataIndex: 'enabled',
      render(text, record) {
        if (!record.enabled) {
          return '禁用';
        } else {
          return <span style={{ color: '#389e0d' }}>启用</span>;
        }
      },
      sorter: (a, b) => (a.enabled - b.enabled ? 1 : -1),
      search: false,
    },
  ];

  columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  return (
    <div className="has-gridForm">
      <div className="base-style noBgBordCol">
        <ProTable<any>
          columns={columns}
          scroll={{ y: yClient }}
          bordered
          size="small"
          request={async (params) => {
            const searchParams: any = {
              pageNumber: params.current,
              pageSize: params.pageSize,
              enabled: '',
              channelName: params.channelName,
            };
            // const res = await getAllChannelList(searchParams);
            // if (startPage) {
            //   params.current = 1;
            //   // params.pageSize = 20;
            // }
            // res.data?.forEach((e: any, i: number) => {
            //   //? 在表格数据的每一条里面加一个标识，然后用这个标识找到对应要编辑的那一项
            //   e.index = i;
            // });
            // if (res.errCode === 200) {
            //   return Promise.resolve({
            //     data: JSON.parse(JSON.stringify(res.data)),
            //     total: res.data?.length,
            //     current: 1,
            //     pageSize: 20,
            //     success: true,
            //   });
            // } else {
            //   message.error(res.errMsg, 3);
            //   return Promise.resolve([]);
            // }
          }}
          rowKey="index"
          search={{
            labelWidth: 'auto',
            span: 12,
            defaultCollapsed: false,
            collapseRender: false,
            className: 'search-form',
          }}
          rowSelection={{ type: 'radio', fixed: 'left', ...rowSelection }}
          options={false}
          tableAlertRender={false}
          onRow={(record) => {
            return {
              onClick: () => {
                setCreateData([record][0]);
                setSelectedRows([record]);
                setSelectedRowKeys([record.index]);
              }, // 点击行
              onDoubleClick: () => {
                setCreateData([record][0]);
                setSelectedRows([record]);
                setSelectedRowKeys([record.index]);
                onFinish();
              },
            };
          }}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            // showTotal: total => `共有 ${total} 条数据`,
            showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
            onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
            showQuickJumper: true,
          }}
          actionRef={ref}
        />
      </div>

      <div className="ant-modal-footer">
        <Button htmlType="button" onClick={onReset}>
          取 消
        </Button>
        <Button type="primary" htmlType="submit" loading={confirmLoading} onClick={onFinish}>
          确 定
        </Button>
      </div>
    </div>
  );
};
export default AddNewChannelForm;
