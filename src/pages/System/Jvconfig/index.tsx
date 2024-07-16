import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Space, Switch, Modal, Checkbox, message } from 'antd';
import { useModel, history } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import SettingsForm from './components/SettingsForm';
import AddNewChannelForm from './components/AddNewChannelForm';
import { queryMasterJV, updateMasterJV } from '@/services/System/index';
import { colLimit } from '@/services';

const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const ref: any = useRef<ActionType>();
  const [form] = Form.useForm();
  const [id, setId] = useState('');
  const [tableRowData, setTableRowData] = useState({});
  const [yClient, setYClient] = useState(900);
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
  const [isAddNewModalVisible, setIsAddNewModalVisible] = useState(false);
  const [status, setStatus]: any = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const settingModalClose = () => {
    setIsSettingModalVisible(false);
    console.log(isSettingModalVisible);
  };
  const addNewModalClose = () => {
    setIsAddNewModalVisible(false);
  };
  function tableReload() {
    ref.current?.reload();
  }
  // function enabledOnChange(checkedValues) {
  // 	console.log(checkedValues);
  // }
  const enabledOnChange = (e: any) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      setStatus(true);
    } else {
      setStatus('');
    }
    ref.current?.reload(true);
    setStartPage(true);
  };
  const columns: ProColumns<any>[] = [
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
      width: 100,
      render: (_, record) => [
        <Button
          size="small"
          key={'编辑'}
          type="link"
          onClick={() => {
            setId(record.channel);
            setTableRowData(record);
            setIsSettingModalVisible(true);
            console.log(id, tableRowData);
          }}
        >
          {' '}
          编辑{' '}
        </Button>,
      ],
      fixed: 'right',
    },
    {
      title: 'JV Code',
      dataIndex: 'jvCompanyCode',
      width: 100,
      sorter: (a, b) => a.channel - b.channel,
      fixed: 'left',
    },
    {
      title: 'JV 公司名称',
      dataIndex: 'jvCompanyName',
      width: 180,
      sorter: (a, b) => a.channelName.localeCompare(b.channelName, 'zh'),
    },
    {
      title: '启用状态',
      dataIndex: 'disable',
      width: 120,
      render(text, record) {
        function enableStatusChange(checked: any) {
          const statusData = {
            jvCompanyCode: record.jvCompanyCode,
            jvCompanyName: record.jvCompanyName,
            remarks: record.remarks,
            disable: checked,
          };
          // console.log(statusData);

          // updateMasterJV(statusData)
          //   .then((res: any) => {
          //     if (res.errCode === 200) {
          //       message.success('保存成功', 3);
          //       tableReload();
          //     } else {
          //       message.error(res.errMsg);
          //     }
          //   })
          //   .finally(() => {
          //     return;
          //   });
        }
        return [
          <Switch
            key={record.index}
            checkedChildren="启用"
            unCheckedChildren="禁用"
            defaultChecked={record.disable}
            onChange={enableStatusChange}
            checked={record.disable}
          />,
        ];
      },
      sorter: (a, b) => (a.enabled - b.enabled ? 1 : -1),
    },
    {
      title: '备注说明',
      dataIndex: 'remarks',
      width: 180,
      // sorter: (a, b) => (a.sapChannel - b.sapChannel ? 1 : -1),
      sorter: (a, b) => a.sapChannel.localeCompare(b.sapChannel, 'zh'),
    },
    {
      title: '最近修改人',
      dataIndex: 'updateName',
      width: 120,
      // sorter: (a, b) => (a.sourceChannel - b.sourceChannel ? 1 : -1),
      sorter: (a, b) => a.sourceChannel.localeCompare(b.sourceChannel, 'zh'),
    },
    {
      title: '最近修改时间',
      dataIndex: 'updateTime',
      width: 120,
    },
  ];

  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 320);
  }, [initialState?.windowInnerHeight]);

  return (
    <div className="omsAntStyle" style={{ marginTop: '6px' }}>
      <ProTable<any>
        columns={columns}
        columnsState={{
          value: columnsStateMap,
          onChange: (val: any) => {
            colLimit(val, setColumnsStateMap);
          },
          persistenceKey: history.location.pathname,
          persistenceType: 'localStorage',
        }}
        scroll={{ x: 100, y: yClient }}
        bordered
        size="small"
        options={{ reload: false, density: false }}
        request={async (params) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const searchParams: any = {
            pageNo: params.current,
            pageSize: params.pageSize,
            disable: status,
          };
          // const res = await queryMasterJV(searchParams);
          // res.data?.list?.forEach((e: any, i: number) => {
          //   e.index = i;
          // });
          // if (startPage) {
          //   params.current = 1;
          //   // params.pageSize = 20;
          // }
          // // console.log(res.data);
          // if (res.errCode === 200) {
          //   return Promise.resolve({
          //     data: JSON.parse(JSON.stringify(res.data?.list)),
          //     total: res.data?.list.length,
          //     current: 1,
          //     pageSize: 20,
          //     success: true,
          //   });
          // } else {
          //   message.error(res.errMsg, 3);
          //   return Promise.resolve([]);
          // }
        }}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          // showTotal: total => `共有 ${total} 条数据`,
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
        }}
        rowKey="index"
        search={false}
        actionRef={ref}
        headerTitle={
          <Space>
            <Button
              key={'添加渠道'}
              type="primary"
              size="small"
              onClick={() => {
                setIsAddNewModalVisible(true);
              }}
            >
              新增
            </Button>
            <Form layout="inline" form={form} className="ant-advanced-form" autoComplete="off">
              <Form.Item name="enabled" valuePropName="">
                <Checkbox key={'只显示启用'} defaultChecked={false} onChange={enabledOnChange}>
                  只显示启用
                </Checkbox>
              </Form.Item>
            </Form>
          </Space>
        }
      />
      <Modal
        className="noTopFootBorder"
        width={460}
        title="编辑渠道信息"
        visible={isSettingModalVisible}
        destroyOnClose={true}
        footer={[]}
        onCancel={settingModalClose}
      >
        <SettingsForm
          id={id}
          tableRowData={tableRowData}
          settingModalClose={settingModalClose}
          tableReload={tableReload}
        />
      </Modal>
      <Modal
        className="noTopFootBorder"
        width={460}
        title="新增"
        visible={isAddNewModalVisible}
        destroyOnClose={true}
        footer={[]}
        onCancel={addNewModalClose}
      >
        <AddNewChannelForm addNewModalClose={addNewModalClose} tableReload={tableReload} />
      </Modal>
    </div>
  );
};

export default Index;
