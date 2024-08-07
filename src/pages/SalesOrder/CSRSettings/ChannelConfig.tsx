import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Space, Switch, Modal, message, Radio, Checkbox } from 'antd';
import { useModel } from 'umi';
import { SearchOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import SettingsForm from './components/SettingsForm';
import AddNewChannelForm from './components/AddNewChannelForm';
import {
  getChannelConfigList,
  setChannelConfig,
  updateChannelConfig,
} from '@/services/SalesOrder/index';
import { colLimit } from '@/services';
const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const ref: any = useRef<ActionType>();
  const [form] = Form.useForm();
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const staffCode = initialState?.currentUser?.code;
  const [id, setId] = useState('');
  const [tableRowData, setTableRowData] = useState({});
  const type = 'byChannel';
  const [yClient, setYClient] = useState(900);
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
  const [isAddNewModalVisible, setIsAddNewModalVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [isSetVisible, setIsSetVisible] = useState(false); //批量设置
  const [modalContent, setModalContent] = useState('');
  const [selectedRow, setSelectedRow]: any = useState([]);
  const [selectedRowKeys, setSelectedRowKeys]: any = useState([]);
  const [value, setValue] = useState(true);
  const optionsList = [
    { label: '标记JV', value: 'markJv' },
    { label: 'MDM赋码', value: 'markMdm' },
    { label: '标记切换供应商', value: 'markChangeSupplier' },
    { label: '标记项目单匹配', value: 'markAppointSupplier' },
  ];
  const [saleConfirmList, setSaleConfirmList] = useState<any>([]);
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
    ref.current.reload();
  }
  //批量设置Modal
  const setAudit = (val: number) => {
    if (!selectedRow?.length) {
      message.error('请至少选择一条数据！');
      return false;
    } else {
      setIsSetVisible(true);
      if (val === 1) {
        setModalContent('需要审核主数据');
      } else if (val === 2) {
        setModalContent('是否审核订单');
      } else if (val === 3) {
        setModalContent('是否需要销售确认');
        setSaleConfirmList([]);
      } else if (val === 4) {
        setModalContent('是否需要OMS发起售后');
      }
    }
    console.log(selectedRow);
  };
  const rowSelection: any = {
    type: 'checkbox',
    selectedRowKeys,
    onChange: (rowKeys: any, selectedRows: any) => {
      setSelectedRow(selectedRows);
      setSelectedRowKeys(rowKeys);
    },
  };
  const onChange = (e: any) => {
    setValue(e.target.value);
  };
  const handleSet = async () => {
    const customerArr = selectedRow?.map((item: any) => {
      return item.channel;
    });
    let val;
    if (modalContent === '需要审核主数据') {
      val = 10;
    } else if (modalContent === '是否审核订单') {
      val = 20;
    } else if (modalContent === '是否需要销售确认') {
      // if(saleConfirmList?.filter((io: any) => io =='标记JV' || io=='MDM赋码' ).length==2 || saleConfirmList?.filter((io: any) => io =='标记JV' || io=='MDM赋码' ).length==0){
      //   //满足条件设置
      // }else{
      //   message.error('标记JV和MDM赋码两个都不选或都选') ;return
      // }
      val = 30;
    } else if (modalContent === '是否需要OMS发起售后') {
      val = 50;
    }
    const param = {
      channelList: customerArr,
      csrBatchType: val, //CSR主数据审核 20,"CSR订单审核" 30,"销售确认"   SUPPORT_AFTER_SALES(50,"是否支持售后");
      check: value,
      // 借口是平铺复选框
      saleConfirmList: saleConfirmList,
      markJv: saleConfirmList?.includes('markJv') && value ? 1 : 0,
      markMdm: saleConfirmList?.includes('markMdm') && value ? 1 : 0,
      markChangeSupplier: saleConfirmList?.includes('markChangeSupplier') && value ? 1 : 0,
      markAppointSupplier: saleConfirmList?.includes('markAppointSupplier') && value ? 1 : 0,
    };
    // const { errCode, errMsg } = await setChannelConfig(param);
    // if (errCode == 200) {
    //   message.success('审核成功');
    //   setIsSetVisible(false);
    //   setValue(true);
    //   ref.current.reload();
    // } else {
    //   message.error(errMsg);
    // }
  };

  const CancelSet = () => {
    // setSelectedRow([])
    setValue(true);
    setIsSetVisible(false);
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
          key={'设置'}
          type="link"
          onClick={() => {
            setId(record.channel);
            setTableRowData(record);
            setIsSettingModalVisible(true);
            console.log(id, tableRowData);
          }}
        >
          {' '}
          设置{' '}
        </Button>,
      ],
      fixed: 'left',
    },
    {
      title: '渠道号',
      dataIndex: 'channel',
      width: 100,
      sorter: (a, b) => (a.channel - b.channel ? 1 : -1),
      fixed: 'left',
    },
    {
      title: '渠道名称',
      dataIndex: 'channelName',
      width: 180,
      sorter: (a, b) => (a.channelName - b.channelName ? 1 : -1),
    },
    {
      title: '是否需要审核主数据',
      width: 150,
      dataIndex: 'csrCheck',
      render(text, record) {
        if (!record.csrCheck) {
          return <span style={{ color: '#FF0000' }}>否</span>;
        } else {
          return <span style={{ color: '#389e0d' }}>是</span>;
        }
      },
      sorter: (a, b) => (a.csrCheck - b.csrCheck ? 1 : -1),
    },
    {
      title: '是否需要审核订单',
      width: 150,
      dataIndex: 'csrOrderCheck',
      render(text, record) {
        if (!record.csrOrderCheck) {
          return <span style={{ color: '#FF0000' }}>否</span>;
        } else {
          return <span style={{ color: '#389e0d' }}>是</span>;
        }
      },
      sorter: (a, b) => (a.csrOrderCheck - b.csrOrderCheck ? 1 : -1),
    },
    {
      title: '是否需要销售确认',
      width: 150,
      dataIndex: 'needSalesConfirm',
      render(text, record) {
        if (!record.needSalesConfirm) {
          return <span style={{ color: '#FF0000' }}>否</span>;
        } else {
          return <span style={{ color: '#389e0d' }}>是</span>;
        }
      },
      sorter: (a, b) => (a.needSalesConfirm - b.needSalesConfirm ? 1 : -1),
    },
    {
      title: '是否支持售后',
      width: 170,
      dataIndex: 'supportAfterSales',
      render(text, record) {
        if (!record.supportAfterSales) {
          return <span style={{ color: '#FF0000' }}>否</span>;
        } else {
          return <span style={{ color: '#389e0d' }}>是</span>;
        }
      },
      sorter: (a, b) => (a.supportAfterSales - b.supportAfterSales ? 1 : -1),
    },
    {
      title: '审核备注',
      dataIndex: 'remark',
      width: 120,
      sorter: (a, b) => (a.remark - b.remark ? 1 : -1),
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      width: 120,
      render(text, record) {
        // let enabledStatus = ''
        // if(record.enabled){
        // 	enabledStatus = 'checked'
        // }
        function enableStatusChange(checked: any) {
          const statusData = {
            channel: record.channel,
            csrCheck: record.csrCheck,
            csrOrderCheck: record.csrOrderCheck,
            needSalesConfirm: record.needSalesConfirm,
            supportAfterSales: record.supportAfterSales,
            remark: record.remark,
            enabled: checked,
          };
          // updateChannelConfig(statusData)
          //   .then((res: any) => {
          //     console.log(res);
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
            defaultChecked={record.enabled}
            onChange={enableStatusChange}
            checked={record.enabled}
          />,
        ];
      },
      sorter: (a, b) => (a.enabled - b.enabled ? 1 : -1),
    },
    {
      title: '最近编辑人',
      width: 150,
      dataIndex: 'updateName',
      sorter: (a, b) => (a.updateName - b.updateName ? 1 : -1),
    },
    {
      title: '最近编辑时间',
      valueType: 'dateTime',
      width: 150,
      dataIndex: 'updateTime',
      sorter: (a, b) => (a.updateTime - b.updateTime ? 1 : -1),
    },
  ];

  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 320);
  }, [initialState?.windowInnerHeight]);

  return (
    <div className="omsAntStyle">
      <div className="form-content-search">
        <Form layout="inline" form={form} className="ant-advanced-form" autoComplete="off">
          <Form.Item name="channelName">
            <Input placeholder="搜索渠道名称关键字" allowClear />
          </Form.Item>
          <Form.Item>
            <Button
              key={'查询'}
              type="primary"
              icon={<SearchOutlined />}
              style={{ marginRight: 16 }}
              onClick={() => {
                ref.current?.reload(true);
                setStartPage(true);
              }}
            >
              查 询
            </Button>
            <Button
              key={'重置'}
              onClick={() => {
                form.resetFields();
                setStartPage(true);
                ref.current?.reload(true);
              }}
            >
              重 置
            </Button>
          </Form.Item>
        </Form>
      </div>

      <ProTable<any>
        columns={columns}
        columnsState={{
          value: columnsStateMap,
          onChange: (val: any) => {
            colLimit(val, setColumnsStateMap);
          },
          persistenceKey: 'clientsoms',
          persistenceType: 'localStorage',
        }}
        scroll={{ x: 100, y: yClient }}
        bordered
        size="small"
        options={{ reload: false, density: false }}
        // request={(params, sorter, filter) => {
        //   // 表单搜索项会从 params 传入，传递给后端接口。
        //   console.log(form.getFieldsValue(true), params, sorter, filter, '====list testing====');
        //   return Promise.resolve(list);
        // }}
        request={async (params) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const searchParams = form.getFieldsValue(true);
          if (startPage) {
            params.current = 1;
            // params.pageSize = 20;
          }
          searchParams.pageNumber = params.current;
          searchParams.pageSize = params.pageSize;
          // const res = await getChannelConfigList(searchParams);
          // res.data?.list.forEach((e: any, i: number) => {
          //   //? 在表格数据的每一条里面加一个标识，然后用这个标识找到对应要编辑的那一项
          //   e.index = i;
          // });
          // if (res.errCode === 200) {
          //   return Promise.resolve({
          //     data: res.data?.list,
          //     total: res.data?.total,
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
          showQuickJumper: true,
        }}
        rowKey="index"
        tableAlertRender={false}
        rowSelection={rowSelection}
        onRow={(record: any) => {
          return {
            onClick: () => {
              if (selectedRowKeys.includes(record.index)) {
                const newKeys = selectedRowKeys.filter((item: any) => item !== record.index);
                setSelectedRowKeys(newKeys);
                const newRows = selectedRow.filter((item: any) => item.index !== record.index);
                setSelectedRow(newRows);
              } else {
                setSelectedRowKeys(selectedRowKeys.concat([record.index]));
                setSelectedRow(selectedRow.concat([record]));
              }
            },
          };
        }}
        search={false}
        actionRef={ref}
        headerTitle={
          <Space>
            <Button
              key="添加渠道"
              type="primary"
              size="small"
              onClick={() => {
                setIsAddNewModalVisible(true);
              }}
            >
              添加渠道
            </Button>
            <Button
              key="批量设置主数据审核"
              danger
              className="light_blue"
              size="small"
              onClick={() => {
                setAudit(1);
              }}
            >
              批量设置主数据审核
            </Button>
            <Button
              key="批量设置订单审核"
              danger
              className="light_blue"
              size="small"
              onClick={() => {
                setAudit(2);
              }}
            >
              批量设置订单审核
            </Button>
            <Button
              key="批量设置销售确认"
              danger
              className="light_blue"
              size="small"
              onClick={() => {
                setAudit(3);
              }}
            >
              批量设置销售确认
            </Button>
            <Button
              key="批量设置OMS发起售后"
              danger
              className="light_blue"
              size="small"
              onClick={() => {
                setAudit(4);
              }}
            >
              批量设置OMS发起售后
            </Button>
          </Space>
        }
      />
      <Modal
        className="noTopFootBorder"
        width={460}
        title="设置"
        visible={isSettingModalVisible}
        destroyOnClose={true}
        footer={[]}
        onCancel={settingModalClose}
      >
        <SettingsForm
          id={id}
          type={type}
          tableRowData={tableRowData}
          staffCode={staffCode}
          settingModalClose={settingModalClose}
          tableReload={tableReload}
        />
      </Modal>
      <Modal
        className="noTopFootBorder"
        width={680}
        title="选择渠道"
        visible={isAddNewModalVisible}
        destroyOnClose={true}
        footer={[]}
        onCancel={addNewModalClose}
      >
        <AddNewChannelForm addNewModalClose={addNewModalClose} tableReload={tableReload} />
      </Modal>
      <Modal
        title="批量设置"
        visible={isSetVisible}
        destroyOnClose={true}
        onOk={handleSet}
        onCancel={CancelSet}
      >
        <div style={{ padding: '10px 25px', fontSize: '30px' }}>
          <p style={{ marginTop: '10px' }}>{modalContent}</p>
          <Radio.Group onChange={onChange} value={value}>
            <Radio defaultChecked value={true}>
              是
            </Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
          {modalContent === '是否需要销售确认' && value && (
            <>
              <p>可确认操作设置</p>
              <Checkbox.Group options={optionsList} onChange={(val) => setSaleConfirmList(val)} />
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Index;
