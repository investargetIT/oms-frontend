import React, { useState, useRef } from 'react';
import { Button, message, Input } from 'antd';
import {
  getAllCustomerList,
  createCustomerConfig,
  saveWareHouseCustomer,
  queryBatchCustomerList,
} from '@/services/SalesOrder/index';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ProFormTextArea } from '@ant-design/pro-form';
interface closeModal {
  addNewModalClose: any;
  tableReload: any;
  state: any;
  houseInfo: { wareCode: any };
  code: any;
}
const AddNewForm: React.FC<closeModal> = (props) => {
  const ref: any = useRef<ActionType>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const yClient = 250;
  const [createData, setCreateData] = useState({}); //?获取选择的客户行信息

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
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
    setCreateData(selectedRowss);
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

  const onFinish = async () => {
    setConfirmLoading(true);
    const formData = JSON.parse(JSON.stringify(createData));
    if (JSON.stringify(createData) == '{}') {
      message.error('请选择一个客户后再点击确认', 3);
      setConfirmLoading(false);
    } else {
      if (props.state) {
        //?代表是仓库配置的调用
        saveWareHouseCustomer({
          wareCode: props.houseInfo.wareCode,
          storageLocation: props.code,
          customerCode:
            formData instanceof Array ? formData[0].customerCode : formData.customerCode,
        })
          .then((res: any) => {
            // console.log(res);
            if (res.errCode === 200) {
              props.addNewModalClose();
              setConfirmLoading(false);
              message.success('客户添加成功', 3);
              props.tableReload();
            } else {
              message.error(res.errMsg);
              setConfirmLoading(false);
            }
          })
          .finally(() => {
            setConfirmLoading(false);
            return;
          });
      } else {
        //?代表的是原逻辑
        createCustomerConfig(formData)
          .then((res: any) => {
            console.log(res);
            if (res.errCode === 200) {
              props.addNewModalClose();
              setConfirmLoading(false);
              message.success('客户添加成功', 3);
              props.tableReload();
            } else {
              message.error(res.errMsg);
              setConfirmLoading(false);
            }
          })
          .finally(() => {
            return;
          })
          .catch((error: any) => {
            if (error.response) {
              if (error.name == 'ResponseError') {
                //注意：不应该写在这，这些东西 本质是500
                message.error(`${error?.data?.errMsg}`);
              }
              setConfirmLoading(false);
            }
          });
      }
    }
    // console.log(formData);
  };
  // const onFinishFailed = (errorInfo: any) => {
  //   console.log('Failed:', errorInfo);
  // };
  const onReset = () => {
    props.addNewModalClose();
  };

  const columns: ProColumns<any>[] = [
    {
      title: '#',
      dataIndex: 'index',
      // valueType: 'index',
      width: 60,
      fixed: 'left',
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
      search: false,
    },
    {
      title: '客户号',
      dataIndex: 'customerCode',
      width: 100,
      sorter: (a, b) => (a.customerCode - b.customerCode ? 1 : -1),
      renderFormItem: () => {
        return props.state ? (
          <Input allowClear placeholder="请输入完整客户号" />
        ) : (
          <div style={{ display: 'flex', width: '230px' }}>
            <ProFormTextArea name="customerCode" placeholder="请输入客户号" />
            <div style={{ marginLeft: '10px', fontSize: '12px', color: '#888' }}>
              多个客户号请换行
              <br />
              格式例如:
              <br />
              0600166812 0600166813
            </div>
          </div>
        );
      },
    },
    {
      title: '客户中文名称',
      dataIndex: 'customerName',
      width: 180,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
      renderFormItem: () => {
        return <Input allowClear placeholder="请输入客户名称关键字" />;
      },
    },
    {
      title: '所在地区',
      dataIndex: 'provinceName',
      width: 180,
      render(text, record) {
        if (!record.provinceName && !record.cityName) {
          return '-';
        } else {
          if (!record.districtName || record.district == 0) {
            if (record.cityName) {
              return record.provinceName + record.cityName;
            } else {
              return record.provinceName;
            }
          } else {
            return record.provinceName + record.cityName + record.districtName;
          }
        }
      },
      sorter: (a, b) => (a.provinceName - b.provinceName ? 1 : -1),
      search: false,
    },
    {
      title: '详细地址',
      dataIndex: 'street',
      width: 180,
      sorter: (a, b) => (a.street - b.street ? 1 : -1),
      search: false,
    },
    {
      title: '所属公司',
      dataIndex: 'officeName',
      width: 180,
      sorter: (a, b) => (a.officeName - b.officeName ? 1 : -1),
      search: false,
    },
    {
      title: '所属事业部',
      dataIndex: 'ownerDepartmentName',
      width: 180,
      sorter: (a, b) => (a.ownerDepartmentName - b.ownerDepartmentName ? 1 : -1),
      search: false,
    },
    {
      title: '所属团队',
      dataIndex: 'ownerTeam',
      width: 120,
      sorter: (a, b) => (a.ownerTeam - b.ownerTeam ? 1 : -1),
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
          scroll={{ x: 100, y: yClient }}
          bordered
          size="small"
          locale={{
            emptyText: () => (
              <>
                <div style={{ marginBottom: '20px' }}>暂无数据</div>
                <div>请前往CRM系统维护相关客户数据</div>
              </>
            ),
          }}
          request={async (params) => {
            // 注意：新老接口查询入参不一致，调用接口不一致，分页不一致。。。。。
            const searchParams: any = {
              pageNumber: params.current,
              pageSize: params.pageSize,
              customerCode: params.customerCode,
              customerName: params.customerName,
            };
            const searchParamsMult: any = {
              customers: params?.customerCode,
              customerName: params.customerName,
              pageNumber: params.current,
              pageSize: params.pageSize,
            };
            //区分判断调用接口
            const url = props?.state
              ? getAllCustomerList(searchParams)
              : queryBatchCustomerList(searchParamsMult);
            const res = await url;
            if (startPage) {
              params.current = 1;
              // params.pageSize = 20;
            }
            res.data?.list?.forEach((e: any, i: number) => {
              //? 在表格数据的每一条里面加一个标识，然后用这个标识找到对应要编辑的那一项
              e.index = i;
            });
            if (res.errCode === 200) {
              return Promise.resolve({
                data: res.data?.list,
                total: res.data?.total,
                current: 1,
                pageSize: 20,
                success: true,
              });
            } else {
              message.error(res.errMsg, 3);
              return Promise.resolve([]);
            }
          }}
          rowKey="index"
          search={{
            labelWidth: 'auto',
            // span: 8,
            defaultCollapsed: false,
            collapseRender: false,
            className: 'search-form',
          }}
          rowSelection={{
            type: props.state ? 'radio' : 'checkbox',
            fixed: 'left',
            ...rowSelection,
          }}
          options={false}
          tableAlertRender={false}
          onRow={(record) => {
            const old = {
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
            const newmult = {
              onClick: () => {
                if (selectedRowKeys.includes(record.index)) {
                  const newKeys = selectedRowKeys.filter((item: any) => item !== record.index);
                  setSelectedRowKeys(newKeys);
                  const newRows = selectedRows.filter((item: any) => item.index !== record.index);
                  setSelectedRows(newRows);
                  setCreateData(newRows);
                } else {
                  setSelectedRowKeys(selectedRowKeys.concat([record.index]));
                  setSelectedRows(selectedRows.concat([record]));
                  setCreateData(selectedRows.concat([record]));
                }
              },
            };
            return props?.state ? old : newmult;
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
export default AddNewForm;
