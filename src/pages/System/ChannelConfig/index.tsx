import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Space, Switch, Modal, Checkbox, message } from 'antd';
import { useModel, history } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import SettingsForm from './components/SettingsForm';
import AddNewChannelForm from './components/AddNewChannelForm';
import { getAllChannelList, updateChannel } from '@/services/System/index';
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
      width: 46,
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
      fixed: 'left',
    },
    {
      title: '渠道号',
      dataIndex: 'channel',
      width: 100,
      sorter: (a, b) => a.channel - b.channel,
      fixed: 'left',
    },
    {
      title: '渠道名称',
      dataIndex: 'channelName',
      width: 180,
      sorter: (a, b) => a.channelName.localeCompare(b.channelName, 'zh'),
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      width: 120,
      render(text, record) {
        function enableStatusChange(checked: any) {
          const statusData = {
            channel: record.channel,
            channelName: record.channelName,
            remark: record.remark,
            enabled: checked,
            sapChannel: record.sapChannel,
            sourceChannel: record.sourceChannel,
            sourceChannelCode: record.sourceChannelCode,
          };
          console.log(statusData);

          updateChannel(statusData)
            .then((res: any) => {
              console.log(res);
              // if (res.errCode === 200) {
              //   message.success('保存成功', 3);
              //   tableReload();
              // } else {
              //   message.error(res.errMsg);
              // }
            })
            .finally(() => {
              return;
            });
        }

        return [
          <Switch
            key={record.index}
            checkedChildren="启用"
            unCheckedChildren="禁用"
            defaultChecked={record.enabled}
            onChange={enableStatusChange}
            checked={record.enabled}
          />,
        ];
      },
      sorter: (a, b) => (a.enabled - b.enabled ? 1 : -1),
    },
    {
      title: '映射SAP渠道号',
      dataIndex: 'sapChannel',
      width: 180,
      // sorter: (a, b) => (a.sapChannel - b.sapChannel ? 1 : -1),
      sorter: (a, b) => a.sapChannel.localeCompare(b.sapChannel, 'zh'),
    },
    {
      title: '外围渠道类型',
      dataIndex: 'sourceChannel',
      width: 180,
      // sorter: (a, b) => (a.sourceChannel - b.sourceChannel ? 1 : -1),
      sorter: (a, b) => a.sourceChannel.localeCompare(b.sourceChannel, 'zh'),
    },
    {
      title: '备注说明',
      dataIndex: 'remark',
      width: 120,
    },
    {
      title: '最近编辑人',
      width: 150,
      dataIndex: 'updateName',
    },
    {
      title: '最近编辑时间',
      valueType: 'dateTime',
      width: 150,
      dataIndex: 'updateTime',
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
          // const searchParams: any = {
          //   pageNumber: params.current,
          //   pageSize: params.pageSize,
          //   enabled: status,
          // };
          // const res = await getAllChannelList(searchParams);
          // res.data?.forEach((e: any, i: number) => {
          //   e.index = i;
          // });
          // if (startPage) {
          //   params.current = 1;
          //   // params.pageSize = 20;
          // }
          // console.log(res.data);
          // if (res.errCode === 200) {
          //   return Promise.resolve({
          //     data: JSON.parse(JSON.stringify(res.data)),
          //     total: res.data.length,
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
              添加渠道
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
        title="新增渠道"
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
