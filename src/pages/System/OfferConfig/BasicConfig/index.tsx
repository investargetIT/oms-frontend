import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Space, Switch, Checkbox, message } from 'antd';
import { useModel, history } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryPermission, savePermission, updatePermission } from '@/services/System/index';
import { colLimit, getByKeys } from '@/services';
import {
  ModalForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';

enum OperationEnum {
  'OMS页面操作' = 1,
  '直连接口操作' = 2,
  '跳转来源渠道' = 3,
}

const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const ref: any = useRef<ActionType>();
  const [form] = Form.useForm();
  const [switchForm] = Form.useForm();
  const [yClient, setYClient] = useState(900);
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [status, setStatus]: any = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const [rowData, setRowData] = useState<any>({});
  const [ruleTitle, setRuleTitle] = useState<any>('新增规则');
  const [enumList, setEnumList] = useState<any>([]);
  const [showJump, setShowJump] = useState<any>(false);
  const [showUrl, setShowUrl] = useState<any>(false);
  const colorObj = {
    '3': '#1890FF',
    '2': '#70b603',
    '1': '#FAAD14',
  };

  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

  useEffect(() => {
    // getByKeys({
    //   list: [
    //     'quotationQuotType',
    //     'channelTypeEnum',
    //     'operateButtonEnum',
    //     'operationPermissionTypeEnum',
    //   ],
    // }).then((res: any) => {
    //   if (res?.errCode === 200) {
    //     setEnumList(
    //       res?.data?.map((io: any) => {
    //         return io?.enums?.map((ic: any) => ({
    //           ...ic,
    //           label: ic.name,
    //           value: ic.code,
    //         }));
    //       }),
    //     );
    //   }
    // });
  }, []);

  const enabledOnChange = (e: any) => {
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
      width: 40,
      fixed: 'left',
      render(text, record, index) {
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
            setRowData(record);
            setShowJump(record?.operationPermission?.find((item: any) => item == 1) ? true : false);
            setShowUrl(record?.originLink ? true : false);
            const {
              quotType = '',
              channelType = '',
              operateButton = '',
              operationPermission = '',
              remark = '',
              enabled = '',
              originLink = '',
            } = record;
            setRuleTitle('编辑规则');
            form?.setFieldsValue({
              quotType,
              channelType,
              operateButton,
              operationPermission,
              remark,
              enabled,
              originLink,
            });
            setModalVisible(true);
          }}
        >
          编辑
        </Button>,
      ],
      fixed: 'left',
    },
    {
      title: '编号',
      dataIndex: 'sid',
      width: 100,
      fixed: 'left',
    },
    {
      title: '报价单类型',
      dataIndex: 'quotTypeName',
      width: 140,
    },
    {
      title: '渠道',
      dataIndex: 'channelTypeName',
      width: 150,
    },
    {
      title: '功能按钮',
      dataIndex: 'operateButtonName',
      width: 150,
    },
    {
      title: '操作权限',
      dataIndex: 'operationPermission',
      width: 300,
      render: (_, record: any) => {
        return (
          <>
            {record?.operationPermission?.map((io: any) => (
              <Button
                key={io}
                style={{
                  background: colorObj[io],
                  color: '#fff',
                  minHeight: '26px',
                  marginRight: '10px',
                }}
              >
                {OperationEnum[io]}
              </Button>
            ))}
          </>
        );
      },
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
      width: 120,
      render(text, record) {
        function enableStatusChange(checked: any) {
          // const statusData = {
          //   sid: record?.sid,
          //   quotType: record?.quotType,
          //   channelType: record?.channelType,
          //   operateButton: record?.operateButton,
          //   operationPermission: record?.operationPermission,
          //   remark: record?.remark,
          //   originLink: record?.originLink,
          //   enabled: checked,
          // };
          // updatePermission(statusData)
            // .then((res: any) => {
            //   console.log(res);
            //   if (res.errCode === 200) {
            //     message.success('保存成功', 3);
            //     ref.current?.reload();
            //   } else {
            //     message.error(res.errMsg);
            //   }
            // })
            // .finally(() => {
            //   return;
            // });
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
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
    },
    {
      title: '操作人',
      width: 150,
      dataIndex: 'createName',
    },
    {
      title: '创建时间',
      valueType: 'dateTime',
      width: 150,
      dataIndex: 'createTime',
    },
    {
      title: '最后修改时间',
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
          // const res = await queryPermission(searchParams);
          // res.data?.list?.forEach((e: any, i: number) => {
          //   e.index = i;
          // });
          // if (startPage) {
          //   params.current = 1;
          //   // params.pageSize = 20;
          // }
          // if (res.errCode === 200) {
          //   return Promise.resolve({
          //     data: JSON.parse(JSON.stringify(res.data.list)),
          //     total: res.data.total,
          //     current: currentPage,
          //     pageSize: currentPageSize,
          //     success: true,
          //   });
          // } else {
          //   message.error(res.errMsg, 3);
          //   return Promise.resolve([]);
          // }
        }}
        pagination={{
          pageSize: currentPageSize,
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
              key={'添加'}
              type="primary"
              size="small"
              onClick={() => {
                setRuleTitle('添加规则');
                setShowJump(false);
                setRowData({});
                form?.resetFields();
                setModalVisible(true);
              }}
            >
              添加
            </Button>
            <Form
              layout="inline"
              form={switchForm}
              className="ant-advanced-form"
              autoComplete="off"
            >
              <Form.Item name="enabled" valuePropName="">
                <Checkbox key={'只显示启用'} defaultChecked={false} onChange={enabledOnChange}>
                  只显示启用
                </Checkbox>
              </Form.Item>
            </Form>
          </Space>
        }
      />
      <ModalForm
        layout="horizontal"
        form={form}
        title={ruleTitle}
        onVisibleChange={setModalVisible}
        visible={modalVisible}
        modalProps={{
          destroyOnClose: true,
        }}
        labelCol={{ span: 4 }}
        labelAlign="right"
        onFinish={async (values: any) => {
          const {
            quotType,
            channelType,
            operateButton,
            operationPermission,
            remark,
            enabled,
            originLink = '',
          } = values;
          const par = {
            quotType,
            channelType,
            operateButton,
            operationPermission,
            remark,
            originLink,
            enabled,
          };
          const url = rowData?.sid
            ? updatePermission({ ...par, sid: rowData?.sid })
            : savePermission(par);
          url.then((res: any) => {
            const { errCode, errMsg } = res;
            // if (errCode === 200) {
            //   ref.current?.reload();
            //   message.success('保存成功');
            // } else {
            //   message.error(errMsg);
            // }
          });
          return true;
        }}
      >
        <ProFormSelect
          label="报价单类型"
          name="quotType"
          options={enumList[0]}
          placeholder="-请选择-"
          rules={[{ required: true, message: '请选择' }]}
        />
        <ProFormSelect
          label="渠道"
          name="channelType"
          options={enumList[1]}
          placeholder="-请选择-"
          rules={[{ required: true, message: '请选择' }]}
        />
        <ProFormSelect
          label="功能按钮"
          name="operateButton"
          options={enumList[2]}
          placeholder="-请选择-"
          rules={[{ required: true, message: '请选择' }]}
        />
        <ProFormSelect
          mode="multiple"
          label="操作权限"
          name="operationPermission"
          options={enumList[3]}
          placeholder="-请选择，可多选-"
          rules={[{ required: true, message: '请选择' }]}
          fieldProps={{
            onChange: (val: any) => {
              // if (val.find((item: any) => item == 1)) {
              //   setShowJump(true);
              // } else {
              //   setShowJump(false);
              // }
            },
          }}
        />
        {showJump && (
          <ProFormSwitch
            name="enabledLink"
            label="是否跳转"
            initialValue={rowData?.originLink ? true : false}
            checkedChildren="跳转"
            unCheckedChildren="禁用"
            rules={[{ required: true, message: '请选择' }]}
            fieldProps={{
              onChange: (val: any) => {
                // if (val) {
                //   setShowUrl(true);
                // } else {
                //   setShowUrl(false);
                // }
              },
            }}
          />
        )}
        {showUrl && (
          <ProFormText
            label={'跳转url'}
            name="originLink"
            rules={[{ required: true, message: '请填写' }]}
          />
        )}

        <ProFormTextArea
          name="remark"
          label="备注"
          placeholder={'请输入，最多255字'}
          fieldProps={{ maxLength: 255, showCount: true }}
        />
        <ProFormSwitch
          name="enabled"
          label="是否启用"
          initialValue={true}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      </ModalForm>
    </div>
  );
};

export default Index;
