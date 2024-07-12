/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Space, Switch, Modal, Checkbox, message, Transfer, Drawer } from 'antd';
import { useModel, history } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { colLimit } from '@/services';
import AddTask from './components/AddTask';
// import {
  // changeState,
  // configSubmitFieldDetail,
  // configSubmitToSelectField,
  // taskConfigList,
  // configSubmitFieldSave,
  // configDisplayDataDetail,
  // configDisplayDataSave,
// } from '@/services/task';
import { ModalForm, ProFormCheckbox } from '@ant-design/pro-form';
import '../index.less';

const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const ref: any = useRef<ActionType>();
  const [form] = Form.useForm();
  const [filedForm] = Form.useForm();
  const [id, setId] = useState('');
  const [recordData, setRecordData] = useState<any>({});
  const [yClient, setYClient] = useState(900);
  const [isAddNewModalVisible, setIsAddNewModalVisible] = useState(false);
  const [status, setStatus]: any = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const [settingModal, setSettingModal] = useState<any>(false);
  const [filedSetModal, setFiledSetModal] = useState<any>(false);
  const [addFiledModal, setAddFiledModal] = useState<any>(false);
  const [isEdit, setIsEdit] = useState<any>(false);

  const [initFiledList, setInitFiledList] = useState<any>([]);
  const [allFiledList, setAllFiledList] = useState<any>([]);
  // const [filedFilterList, setFiledFilterList] = useState<any>([]);
  const [checkAll, setCheckAll] = useState<any>(false);
  const [filedRowkey, setFiledRowkey] = useState<any>([]);
  // 配置展示数据
  const [transDataAll, setTransDataAll] = useState<any>([]);
  const [filterTransData, setFilterTransData] = useState<any>([]);

  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }

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
      setStatus(false);
    }
    ref.current?.reload(true);
    setStartPage(true);
  };

  const initFiledListData = async (sid: any) => {
    // const res = await configSubmitFieldDetail({ sid: sid });
    // if (res.errCode == 200) {
    //   setInitFiledList(res?.data?.dataList);
    // } else {
    //   message.error(res?.errMsg);
    // }
  };

  const getTransData = async (sid: any) => {
    // const { data, errMsg, errCode } = await configDisplayDataDetail({ sid: sid });
    // if (errCode === 200) {
    //   setTransDataAll(data?.dataList);
    //   setFilterTransData(
    //     data?.dataList?.filter((ic: any) => ic.fieldSelected).map((ic: any) => ic.fieldEnName),
    //   );
    // } else {
    //   message.error(errMsg);
    // }
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
      width: 260,
      render: (_, record) => [
        <Button
          size="small"
          key={'编辑'}
          type="link"
          onClick={() => {
            setId(record.sid);
            setIsEdit(true);
            setIsAddNewModalVisible(true);
          }}
        >
          {' '}
          编辑{' '}
        </Button>,
        <Button
          size="small"
          key={'配置展示数据'}
          type="link"
          onClick={() => {
            setId(record.sid);
            setSettingModal(true);
            getTransData(record?.sid);
          }}
        >
          配置展示数据
        </Button>,
        <Button
          size="small"
          key={'提交字段配置'}
          type="link"
          onClick={() => {
            setId(record.sid);
            setRecordData(record);
            setFiledSetModal(true);
            initFiledListData(record?.sid);
          }}
        >
          提交字段配置
        </Button>,
      ],
      fixed: 'right',
    },
    {
      title: '任务类型ID',
      dataIndex: 'sid',
      width: 100,
      fixed: 'left',
    },
    {
      title: '任务类型名称',
      dataIndex: 'name',
      width: 180,
    },
    {
      title: '项目任务类型',
      dataIndex: 'typeStr',
      width: 180,
    },
    {
      title: '启用状态',
      dataIndex: 'enable',
      width: 120,
      render(text, record) {
        async function enableStatusChange(checked: any) {
          const statusData = {
            type: 0,
            sid: record.sid,
            enable: checked ? 1 : 0,
          };
          // await changeState(statusData)
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
            defaultChecked={record.enable}
            onChange={enableStatusChange}
            checked={record.enable}
          />,
        ];
      },
    },
    {
      title: '默认任务',
      dataIndex: 'defaultConfiguration',
      width: 120,
      render(text, record) {
        async function enableStatusChange(checked: any) {
          const statusData = {
            type: 1,
            sid: record.sid,
            enable: checked ? 1 : 0,
          };
          // await changeState(statusData)
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
            defaultChecked={record.defaultConfiguration}
            onChange={enableStatusChange}
            checked={record.defaultConfiguration}
          />,
        ];
      },
    },
    {
      title: '默认紧急度',
      dataIndex: 'urgencyStr',
      width: 180,
    },
    {
      title: '适用范围',
      dataIndex: 'scopeStr',
      width: 120,
    },
    {
      title: '完成要求',
      dataIndex: 'completeRequirementStr',
      width: 120,
    },
    {
      title: '任务协作方式',
      dataIndex: 'cooperationTypeStr',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'typeDescription',
      width: 120,
    },
    {
      title: '操作人',
      dataIndex: 'createName',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 120,
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
      width: 120,
    },
  ];
  const filedColumns: ProColumns<any>[] = [
    {
      title: '字段名称',
      dataIndex: 'fieldEnName',
      width: 100,
      fixed: 'left',
    },
    {
      title: '字段描述',
      dataIndex: 'fieldName',
      width: 180,
    },
    {
      title: '字段类型',
      dataIndex: 'fieldTypeDesc',
      width: 180,
    },
    {
      title: '是否系统记录',
      dataIndex: 'systemValue',
      width: 180,
      render: (_, record: any) => {
        return (
          <Checkbox
            checked={record?.systemValue}
            onChange={(e) => {
              setInitFiledList(
                initFiledList?.map((io: any) => {
                  record.systemValue = e.target.checked;
                  if (io.fieldEnName == record?.fieldEnName) {
                    io = record;
                  }
                  return io;
                }),
              );
            }}
          />
        );
      },
    },
    {
      title: '是否必填',
      dataIndex: 'required',
      width: 120,
      render: (_, record: any) => {
        return (
          <Checkbox
            checked={record?.required}
            onChange={(e) => {
              setInitFiledList(
                initFiledList?.map((io: any) => {
                  record.required = e.target.checked;
                  if (io.fieldEnName == record?.fieldEnName) {
                    io = record;
                  }
                  return io;
                }),
              );
            }}
          />
        );
      },
    },
  ];

  columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 320);
  }, [initialState?.windowInnerHeight]);

  const handleChange = (newTargetKeys: string[]) => {
    setFilterTransData(newTargetKeys);
  };

  const handleSearch = (dir: any, value: string) => {
    console.log('search:', dir, value);
  };

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
            pageNumber: params.current,
            pageSize: params.pageSize,
            enable: status ? 1 : null,
          };
          // const res = await taskConfigList(searchParams);
          // res.data?.list?.forEach((e: any, i: number) => {
          //   e.index = i;
          // });
          // if (startPage) {
          //   params.current = 1;
          // }
          // if (res.errCode === 200) {
          //   return Promise.resolve({
          //     data: JSON.parse(JSON.stringify(res.data?.list)),
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
                setIsEdit(false);
                setIsAddNewModalVisible(true);
              }}
            >
              + 添加
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
      {/* 添加任务类型 */}
      <Drawer
        width={'60%'}
        title={isEdit ? '编辑任务类型' : '新增任务类型'}
        visible={isAddNewModalVisible}
        className="has-gridForm"
        destroyOnClose={true}
        footer={false}
        onClose={() => setIsAddNewModalVisible(false)}
      >
        <AddTask
          sid={id}
          isEdit={isEdit}
          onClose={() => setIsAddNewModalVisible(false)}
          tableReload={tableReload}
        />
      </Drawer>
      {/* 配置展示数据*/}
      <Modal
        width={'70%'}
        title="配置展示数据"
        visible={settingModal}
        destroyOnClose={true}
        // footer={[]}
        onOk={async () => {
          const filterSelectData = transDataAll?.filter((io: any) =>
            filterTransData?.some((ic: any) => ic == io.fieldEnName),
          );
          const par = {
            sid: id,
            taskFieldVO: filterSelectData,
          };
          // const { errCode, errMsg } = await configDisplayDataSave(par);
          // if (errCode === 200) {
          //   setSettingModal(false);
          //   message.success('提交配置成功');
          // } else {
          //   message.error(errMsg);
          // }
        }}
        onCancel={() => setSettingModal(false)}
      >
        <Transfer
          dataSource={transDataAll}
          showSearch
          targetKeys={filterTransData}
          onChange={handleChange}
          onSearch={handleSearch}
          render={(item) => item.fieldName}
          listStyle={{ width: '50%', height: '470px' }}
          rowKey={(record) => record.fieldEnName}
          operations={['添加数据', '删除数据']}
          pagination={true}
        />
      </Modal>
      {/* 提交字段配置*/}
      <Modal
        width={'80%'}
        title="提交字段配置"
        visible={filedSetModal}
        destroyOnClose={true}
        onOk={async () => {
          // 保存字段配置
          const par = {
            sid: id,
            list: initFiledList.map((io: any) => ({
              ...io,
              required: io.required ? 1 : 0,
              systemValue: io.systemValue ? 1 : 0,
            })),
          };
          // const { errCode, errMsg } = await configSubmitFieldSave(par);
          // if (errCode === 200) {
          //   message.success('提交成功');
          //   setFiledSetModal(false);
          // } else {
          //   message.error(errMsg);
          // }
        }}
        onCancel={() => setFiledSetModal(false)}
      >
        <p style={{ padding: '20px' }}>
          用于设置当前类型的任务完成时需填写的字段；只支持选择数据库中已有的字段；多个任务提交同一字段时，以最后提交为准
        </p>
        <ProTable<any>
          columns={filedColumns}
          columnsState={{
            value: columnsStateMap,
            onChange: (val: any) => {
              colLimit(val, setColumnsStateMap);
            },
            persistenceKey: history.location.pathname,
            persistenceType: 'localStorage',
          }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: filedRowkey,
            onChange: (rowKeys, rows) => {
              setFiledRowkey(rowKeys);
              // setSelectRows(rows);
              console.log(rows);
            },
          }}
          tableStyle={{ paddingTop: '20px' }}
          scroll={{ x: 100, y: yClient - 200 }}
          bordered
          size="small"
          options={{ reload: false, density: false }}
          dataSource={initFiledList}
          rowKey="fieldEnName"
          search={false}
          actionRef={ref}
          tableAlertRender={false}
          headerTitle={
            <Space>
              <Button
                key={'添加字段'}
                type="primary"
                size="small"
                onClick={async () => {
                  setAddFiledModal(true);
                  // 获取所有字段数据
                  // await configSubmitToSelectField({ type: recordData?.type }).then((res: any) => {
                  //   if (res?.errCode == 200) {
                  //     const list = res?.data?.dataList?.map((io: any) => ({
                  //       ...io,
                  //       label: io.fieldName,
                  //       value: io.fieldEnName,
                  //       systemValue: false,
                  //       required: false,
                  //     }));
                  //     setAllFiledList(list);
                  //   }
                  // });
                }}
              >
                添加字段
              </Button>
              <Button
                key={'删除'}
                className="danger light_danger"
                ghost={false}
                size="small"
                onClick={() => {
                  const newList = initFiledList?.filter(
                    (io: any) => !filedRowkey.some((ic: any) => ic === io.fieldEnName),
                  );
                  setInitFiledList(newList);
                }}
              >
                删除
              </Button>
            </Space>
          }
        />
      </Modal>
      {/*添加字段的 所有数据 */}
      <ModalForm
        className="addFiled"
        width={'80%'}
        title="添加字段"
        form={filedForm}
        visible={addFiledModal}
        style={{ height: `${yClient + 26}px` }}
        modalProps={{
          destroyOnClose: true,
        }}
        onVisibleChange={setAddFiledModal}
        onFinish={async (values: any) => {
          const filterData = allFiledList?.filter((io: any) =>
            values?.fileList.some((ic: any) => io.fieldEnName == ic),
          );
          // setFiledFilterList(filterData)
          setInitFiledList(initFiledList.concat(filterData));
          return true;
        }}
      >
        <Checkbox
          checked={checkAll}
          style={{ marginBottom: '20px' }}
          onChange={(ev: any) => {
            if (ev.target.checked) {
              filedForm.setFieldsValue({
                fileList: allFiledList?.map((io: any) => io.fieldEnName),
              });
              setCheckAll(true);
            } else {
              filedForm.setFieldsValue({ fileList: [] });
              setCheckAll(false);
            }
          }}
        >
          全选
        </Checkbox>
        <ProFormCheckbox.Group
          name="fileList"
          layout="horizontal"
          options={allFiledList}
          fieldProps={{
            onChange(checkedValue) {
              setCheckAll(checkedValue?.length === allFiledList.length ? true : false);
            },
          }}
        />
      </ModalForm>
    </div>
  );
};

export default Index;
