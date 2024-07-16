import {
  getAllAfterSalesReasonList,
  updateAfterSalesReason,
  entEdit,
  getAfterSalesReason,
} from '@/services/System/index';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Checkbox, Form, message, Modal, Space, Switch, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useModel, history } from 'umi';
import AddNewReasonForm from './components/AddNewReasonForm';
import SettingsForm from './components/SettingsForm';
import { colLimit } from '@/services';
import './style.css';
// interface DataType {
//   // key: React.ReactNode;
// 	sid: number;
//   name: string;
// 	level:	number;
// 	remark: string;
// 	enabledFlag: string;
// 	childNodeList?: DataType[];
// }

const Index: React.FC = () => {
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const { initialState } = useModel('@@initialState');
  const ref: any = useRef<ActionType>();
  const [yClient, setYClient] = useState(900);
  const [id, setId] = useState('');
  const [tableRowData, setTableRowData] = useState({});
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
  const [isAddNewModalVisible, setIsAddNewModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [status, setStatus]: any = useState(null);
  const [editType, setEditType]: any = useState('edit');
  const [editTitle, setEditTitle]: any = useState('编辑售后原因');
  const [resData, setResData]: any = useState([]);
  const [getParent, setGetParent]: any = useState('');
  const [switchDisabled, setSwitchDisabled]: any = useState(false);
  const [isTypeVisible, setIsTypeVisible]: any = useState(false);
  const [selList, setSelList]: any = useState([]);
  const [selItemList, setSelItemList]: any = useState([]);
  const tableReload = () => {
    ref.current?.reload();
  };
  const addNewModalClose = () => {
    setIsAddNewModalVisible(false);
  };
  const settingModalClose = () => {
    setIsSettingModalVisible(false);
  };
  const enabledOnChange = (e: any) => {
    // console.log(e.target.checked);
    // if (e.target.checked) {
    //   setStatus(1);
    // } else {
    //   setStatus(null);
    // }
    // ref.current?.reload(true);
    // console.log(status);
  };

  function findParent(data, sid) {
    let arr = '';
    data.find((item) => {
      if (item.sid === sid) {
        arr = item.name;
        return true;
      } else if (item.childNodeList.length) {
        arr = findParent(item.childNodeList, sid, arr);
        if (arr.length) {
          if (item.sid === sid) {
            arr = item.name;
            return true;
          }
          return true;
        } else {
          return false;
        }
      }
      return false;
    });
    return arr;
  }

  function setDisabledData(data) {
    const sources = data;
    // sources.find((item) => {
      // if (item.level === 1 && item.enabledFlag == 0) {
      //   item.childrenDisabled = true;
      //   if (item.childNodeList.length) {
      //     item.childNodeList.find((it) => {
      //       it.disabled = true;
      //       it.childrenDisabled = true;
      //       if (it.childNodeList.length) {
      //         it.childNodeList.find((i) => {
      //           i.disabled = true;
      //         });
      //       }
      //     });
      //   }
      // } else if (item.level === 1 && item.enabledFlag == 1) {
      //   if (item.childNodeList.length) {
      //     item.childNodeList.find((it) => {
      //       if (it.level === 2 && it.enabledFlag == 0) {
      //         it.childrenDisabled = true;
      //         if (it.childNodeList.length) {
      //           it.childNodeList.find((i) => {
      //             i.disabled = true;
      //           });
      //         }
      //       }
      //     });
      //   }
      // }
      // if (item.childNodeList.length) {
      //   item.children = item.childNodeList;
      //   item.childNodeList.find((it) => {
      //     if (it.childNodeList.length) {
      //       it.children = it.childNodeList;
      //       it.childNodeList.find((i) => {
      //         if (i.childNodeList.length) {
      //           i.children = i.childNodeList;
      //         }
      //       });
      //     }
      //   });
      // }
    // });
    return sources;
  }
  const getSelect = async () => {
    // const res = await getAfterSalesReason();
    // if (res.errCode === 200) {
    //   setSelList(res?.data?.dataList);
    //   return res?.data?.dataList;
    // }
    return [];
  };
  const columns: ProColumns<any>[] = [
    {
      title: '分类ID',
      dataIndex: 'sid',
      width: 130,
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      className: 'alignLeft',
      width: '30%',
      // render(text, record) {
      //   if (!record.childNodeList.length) {
      //     return <span className="noLeftButton">{record.name}</span>;
      //   } else {
      //     return record.name;
      //   }
      // },
    },
    {
      title: '启用状态',
      dataIndex: 'enabledFlag',
      width: 90,
      render(text, record) {
        function enableStatusChange(checked: any) {
          let enabled_status = 1;
          // if (!checked) {
          //   enabled_status = 0;
          // }
          // const statusData = {
          //   sid: record.sid,
          //   enabledFlag: enabled_status,
          // };
          // updateAfterSalesReason(statusData)
          //   .then((res: any) => {
          //     console.log(res);
          //     if (res.errCode === 200) {
          //       message.success('保存成功', 3);
          //       ref.current?.reload(true);
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
            disabled={record.disabled}
            key={record.sid}
            checkedChildren="启用"
            unCheckedChildren="禁用"
            defaultChecked={record.enabledFlag}
            onChange={enableStatusChange}
            checked={record.enabledFlag}
          />,
        ];
      },
    },
    {
      title: 'SAP订单原因',
      dataIndex: 'sapReasonCode',
      width: 90,
    },
    {
      title: 'OA流程code',
      dataIndex: 'oaCode',
      width: 90,
    },
    {
      title: '成本中心',
      dataIndex: 'costCenter',
      width: 90,
    },
    {
      title: '备注说明',
      dataIndex: 'remark',
      width: '30%',
    },
    {
      title: '级别',
      dataIndex: 'level',
      width: 40,
    },
    {
      title: '操作',
      dataIndex: 'sid',
      className: 'alignLeft',
      width: 150,
      render: (_, record) => {
        const parent_Name = findParent(resData, record.parentId);
        const btnList = [
          <Button
            size="small"
            key={'编辑'}
            type="link"
            onClick={() => {
              setId(record.sid);
              setTableRowData(record);
              setIsSettingModalVisible(true);
              setEditType('edit');
              setEditTitle('编辑售后原因');
              setGetParent(parent_Name);
              setSwitchDisabled(record.disabled);
            }}
          >
            {' '}
            编辑{' '}
          </Button>,
          <Button
            disabled={record.level == 3 ? true : false}
            size="small"
            key={'添加下级'}
            type="link"
            onClick={() => {
              setId(record.sid);
              setTableRowData(JSON.parse(JSON.stringify(record)));
              setIsSettingModalVisible(true);
              setEditType('add');
              setEditTitle('新增子分类');
              setGetParent(record.name);
              setSwitchDisabled(record.childrenDisabled);
            }}
          >
            {' '}
            添加下级{' '}
          </Button>,
        ];
        if (record.level === 3) {
          btnList.push(
            <Button
              size="small"
              key={'企业站映射'}
              type="link"
              onClick={async () => {
                let res = selList;
                if (selList?.length === 0) res = await getSelect();
                res.forEach((item: any) => {
                  if (item?.key === record?.entTypeCode) setSelItemList(item.children);
                });
                setIsTypeVisible(true);
                setId(record?.sid);
                record.entEnabledFlag = !!record?.entEnabledFlag;
                record.omsEnabledFlag = !!record?.omsEnabledFlag;
                form1.setFieldsValue(record);
              }}
            >
              {' '}
              企业站映射{' '}
            </Button>,
          );
        }
        return btnList;
      },
    },
  ];
  const typeClose = () => {
    setIsTypeVisible(false);
  };
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 320);
  }, [initialState?.windowInnerHeight]);

  return (
    <div className="omsAntStyle" style={{ marginTop: '6px' }}>
      <div className="TableBox">
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
          expandable={{
            // childrenColumnName: 'childNodeList',
            defaultExpandAllRows: true,
            defaultExpandedRowKeys: resData.map((o) => o.sid),
            // expandRowByClick: true
          }}
          request={async (params) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            // const searchParams: any = {
            //   // pageNumber: params.current,
            //   // pageSize: params.pageSize,
            //   enabledFlag: status,
            // };
            // console.log(params);
            // const res = await getAllAfterSalesReasonList(searchParams);
            // res.data?.dataList.forEach((e: any, i: number) => {
            //   e.index = i;
            // });
            // if (startPage) {
            //   params.current = 1;
            //   params.pageSize = 20;
            // }
            // if (res.errCode === 200) {
            //   setResData(res.data?.dataList);
            //   console.log(setDisabledData(JSON.parse(JSON.stringify(res.data?.dataList))));
            //   return Promise.resolve({
            //     // data: JSON.parse(JSON.stringify(res.data)),
            //     data: setDisabledData(JSON.parse(JSON.stringify(res.data?.dataList))),
            //     total: res.data?.dataList.length,
            //     // current: 1,
            //     // pageSize: 20,
            //     success: true,
            //   });

            //   setResData(res.data);
            //   console.log(resData);
            // } else {
            //   message.error(res.errMsg, 3);
            //   return Promise.resolve([]);
            //   setResData([]);
            // }
          }}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          }}
          className="Mytable"
          search={false}
          actionRef={ref}
          headerTitle={
            <Space>
              <Button type="primary" size="small" onClick={() => setIsAddNewModalVisible(true)}>
                新增
              </Button>
              <Form layout="inline" form={form} className="ant-advanced-form" autoComplete="off">
                <Form.Item name="enabledFlag" valuePropName="">
                  <Checkbox key={'只显示启用'} defaultChecked={false} onChange={enabledOnChange}>
                    只显示启用
                  </Checkbox>
                </Form.Item>
              </Form>
            </Space>
          }
          rowKey="sid"
        />
      </div>
      <Modal
        className="noTopFootBorder"
        width={560}
        title={editTitle}
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
          editType={editType}
          getParent={getParent}
          switchDisabled={switchDisabled}
        />
      </Modal>
      <Modal
        className="noTopFootBorder"
        width={560}
        title="新增售后原因"
        visible={isAddNewModalVisible}
        destroyOnClose={true}
        footer={[]}
        onCancel={addNewModalClose}
      >
        <AddNewReasonForm addNewModalClose={addNewModalClose} tableReload={tableReload} />
      </Modal>
      <Modal
        width={560}
        title="企业站类型映射"
        visible={isTypeVisible}
        destroyOnClose={true}
        onCancel={typeClose}
        onOk={() => {
          form1.validateFields().then((params: any) => {
            // if (id) {
            //   params.omsEnabledFlag = params?.omsEnabledFlag ? 1 : 0;
            //   params.entEnabledFlag = params?.entEnabledFlag ? 1 : 0;
            //   entEdit({ ...params, sid: id }).then((res: any) => {
            //     if (res?.errCode === 200) {
            //       message.success('配置成功');
            //       ref?.current?.reload();
            //       setIsTypeVisible(false);
            //     } else message.error(res?.errMsg);
            //   });
            // }
          });
        }}
      >
        <Form preserve={false} name="form" form={form1} autoComplete="off" labelCol={{ span: 8 }}>
          <Form.Item
            label="企业站-售后类型类型"
            name="entTypeCode"
            rules={[{ required: true, message: '售后类型不能为空!' }]}
          >
            <Select
              placeholder="请选择售后类型类型"
              onChange={(_: any, { item }: any) => {
                setSelItemList(item);
              }}
            >
              {selList.length > 0 &&
                selList.map((item: any) => (
                  <Select.Option value={item.key} key={item.key} item={item.children}>
                    {item.value}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="企业站-售后原因"
            name="entReasonCode"
            rules={[{ required: true, message: '售后原因名称不能为空!' }]}
          >
            <Select>
              {selItemList.length > 0 &&
                selItemList.map((item: any) => (
                  <Select.Option value={item.key} key={item.key}>
                    {item.value}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            className="fullLineGrid"
            label="企业站-是否启用"
            name={'entEnabledFlag'}
            initialValue={true}
            valuePropName={'checked'}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked={true} />
          </Form.Item>
          <Form.Item
            className="fullLineGrid"
            label="oms-是否启用"
            name={'omsEnabledFlag'}
            initialValue={true}
            valuePropName={'checked'}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked={true} />
            {/* <span>禁用时企业站接口获取不到此数据</span> */}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Index;
