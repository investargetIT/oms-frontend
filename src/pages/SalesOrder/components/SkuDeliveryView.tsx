import React, { useEffect, useState, useRef } from 'react';
import { querySapOpenSoInfo, getObdItemSignature, saveOrUpdateObd } from '@/services/SalesOrder';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Modal, Spin, message, Input, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getByKeys } from '@/services';
import moment from 'moment';
import { ModalForm, ProFormSelect, ProFormDatePicker } from '@ant-design/pro-form';
interface SkuDeliveryViewParams {
  orderNo?: any;
  getPageLoad?: any;
}
const SkuDeliveryView: React.FC<SkuDeliveryViewParams> = (prop) => {
  const ref: any = useRef<ActionType>();
  // const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalTable, setIsModalTable] = useState(false);
  const [load, setLoad]: any = useState(false);
  const [tableData, setTableData]: any = useState([]);
  const [skuValue, setSkuValue]: any = useState('');
  const [filterparamList, setFilterParamList]: any = useState([]);
  const [currentPage, setCurrentPage]: any = useState(1);
  const [currentPageSize, setCurrentPageSize]: any = useState(10);
  const actionRef = useRef<ActionType>();

  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const getData = () => {
    querySapOpenSoInfo(prop.orderNo)
      .then((res: any) => {
        if (res.errCode === 200) {
          if (res.data?.dataList?.length > 0) {
            const newData = res.data?.dataList.map((item: any, index: any) => {
              item.id = index;
              return item;
            });
            setTableData(newData);
            setFilterParamList(newData);
          } else {
            setTableData(res.data?.dataList);
            setFilterParamList(res.data?.dataList);
          }
          prop.getPageLoad(false);
          setLoad(false);
        } else {
          message.error(res?.errMsg || '数据出错');
          prop.getPageLoad(false);
          setLoad(false);
        }
      })
      .catch(() => {
        message.error('数据出错');
        prop.getPageLoad(false);
        setLoad(false);
      })
      .finally(() => {
        return;
      });
  };

  useEffect(() => {
    if (skuValue !== '') {
      //当value不为空时
      setFilterParamList([]);
      const newData = tableData.filter(
        (item: any) => item?.sku?.toLowerCase().indexOf(skuValue.toLowerCase()) !== -1,
      );
      setFilterParamList(newData);
    } else {
      setFilterParamList(tableData);
    }
  }, [skuValue]);

  const openModal = () => {
    setLoad(true);
    setIsModalVisible(true);
    setSkuValue('');
    setTableData([]);
    setFilterParamList([]);
  };
  const closeModal = () => {
    setIsModalVisible(false);
    prop.getPageLoad(false);
    setLoad(false);
  };
  const viewSkuDeliveryInfo = () => {
    prop.getPageLoad(true);
    openModal();
    getData();
  };
  const columnsList: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 60,
      fixed: 'left',
      render(_, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
      hideInSearch: true,
      readonly: true,
    },
    {
      title: '发货单号',
      dataIndex: 'obdNo',
      readonly: true,
      hideInSearch: true,
    },
    {
      title: '发货单号',
      dataIndex: 'obdNo',
      hideInTable: true,
    },
    {
      title: 'SKU',
      dataIndex: 'skuCode',
      hideInSearch: true,
      readonly: true,
    },
    {
      title: '订单数量',
      dataIndex: 'orderCount',
      hideInSearch: true,
      readonly: true,
    },
    {
      title: '发货数量',
      dataIndex: 'sendCount',
      hideInSearch: true,
      readonly: true,
    },
    {
      title: '客户系统签收状态',
      dataIndex: 'signatureStatus',
      valueType: 'select',
      hideInSearch: true,
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      fieldProps: () => {
        return {
          fieldNames: {
            label: 'name',
            value: 'code',
          },
        };
      },
      request: async (params) => {
        const res = await getByKeys({ list: ['signatureStatusEnum'] });
        if (res.data && res.data.length) {
          return res.data[0].enums;
        }
        return [];
      },
    },
    {
      title: '客户系统签收时间',
      dataIndex: 'signatureTime',
      hideInSearch: true,
      valueType: 'date',
      fieldProps: () => {
        return {
          disabledDate: (current) => current && current >= moment().endOf('day'),
        };
      },
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, index, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 60,
      fixed: 'left',
      render(_, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
      search: false,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 150,
      fixed: 'left',
      search: false,
      // renderFormItem: () => {
      //   // return <Input allowClear placeholder={'输入SKU号'} />;
      // },
    },
    {
      title: '订单行号',
      dataIndex: 'lineNum',
      search: false,
    },
    {
      title: '订单数量',
      dataIndex: 'qty',
      search: false,
    },
    {
      title: 'OPEN数量',
      dataIndex: 'openQty',
      search: false,
    },
    {
      title: '物料码',
      dataIndex: 'stockSkuCode',
      search: false,
    },
    {
      title: '物料码OPEN数量',
      dataIndex: 'openQtySmall',
      search: false,
    },

    {
      title: '预计交货日',
      // valueType: 'date',
      dataIndex: 'estDelDate',
      search: false,
    },
  ];

  columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  const onSelectChange = (newSelectedRowKeys: React.Key[], row) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRow(row);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <Button
        type="primary"
        className={'light_blue'}
        style={{ marginBottom: '10px' }}
        onClick={viewSkuDeliveryInfo}
        key="查看执行详情"
      >
        查看执行详情
      </Button>
      <Button
        type="primary"
        className={'light_blue'}
        style={{ marginBottom: '10px', marginLeft: '10px' }}
        onClick={() => {
          setIsModalTable(true);
        }}
        key="标记客户系统签收"
      >
        标记客户系统签收
      </Button>

      <Modal
        title={'标记客户系统收货'}
        visible={isModalTable}
        width={'76%'}
        destroyOnClose={true}
        onCancel={() => {
          setIsModalTable(false);
        }}
        footer={[
          <Button
            htmlType="button"
            key="关闭窗口"
            onClick={() => {
              setIsModalTable(false);
            }}
          >
            关 闭
          </Button>,
        ]}
      >
        <ProTable
          columns={columnsList}
          options={false}
          size="small"
          editable={{
            type: 'single',
            editableKeys,
            onChange: setEditableRowKeys,
            onSave: async (rowKey, data, row) => {
              await saveOrUpdateObd([data]);
            },
          }}
          actionRef={actionRef}
          rowSelection={rowSelection}
          request={async (params, sorter, filter) => {
            actionRef?.current?.clearSelected();
            setEditableRowKeys([]);
            const res = await getObdItemSignature({
              pageNumber: params.current,
              pageSize: params.pageSize,
              orderNo: prop.orderNo,
              ...params,
            });
            return {
              data:
                res.data.list &&
                res.data.list.map((e) => {
                  return {
                    ...e,
                    id: (Math.random() * 1000000).toFixed(0),
                  };
                }),
              total: res.data.total,
            };
          }}
          rowKey="id"
          scroll={{ y: 500 }}
          tableAlertRender={false}
          toolBarRender={() => [
            <ModalForm
              key="primary"
              title="批量标记"
              trigger={
                <Button type="primary" disabled={selectedRowKeys.length === 0}>
                  批量标记客户系统状态
                </Button>
              }
              modalProps={{
                destroyOnClose: true,
              }}
              layout="horizontal"
              width={400}
              submitTimeout={2000}
              onFinish={async (values) => {
                console.log(values);
                setEditableRowKeys([]);
                const data = selectedRow.map((e) => {
                  return {
                    ...e,
                    ...values,
                  };
                });
                const res = await saveOrUpdateObd(data);
                if (res.errCode === 200) {
                  actionRef.current?.reload();
                  message.success('提交成功');
                  return true;
                }
                return false;
              }}
            >
              <ProFormSelect
                rules={[{ required: true, message: '请选择' }]}
                name="signatureStatus"
                label="客户系统签收状态"
                width="sm"
                fieldProps={{
                  fieldNames: { label: 'name', value: 'code' },
                }}
                request={async () => {
                  const res = await getByKeys({ list: ['signatureStatusEnum'] });
                  if (res.data && res.data.length) {
                    return res.data[0].enums;
                  }
                  return [];
                }}
              />
              <ProFormDatePicker
                name="signatureTime"
                fieldProps={{
                  disabledDate: (current) => current && current >= moment().endOf('day'),
                }}
                width="sm"
                label="客户系统签收时间"
                rules={[{ required: true, message: '请选择' }]}
              />
            </ModalForm>,
          ]}
        />
      </Modal>
      <Modal
        title={'订单执行明细'}
        visible={isModalVisible}
        width={'76%'}
        destroyOnClose={true}
        onOk={() => {
          closeModal();
        }}
        onCancel={() => {
          closeModal();
        }}
        footer={[
          <Button htmlType="button" key="关闭窗口" onClick={closeModal}>
            关 闭
          </Button>,
        ]}
        key={'订单执行明细'}
      >
        <Spin spinning={load}>
          <div className="search-form" style={{ marginBottom: '20px' }}>
            <Form layout="inline">
              <Form.Item label="SKU">
                <Input
                  value={skuValue}
                  onChange={(e) => {
                    setSkuValue(e.target.value?.trim());
                  }}
                  placeholder={'请输入SKU号'}
                  allowClear
                  prefix={<SearchOutlined style={{ color: '#DEE0E8' }} />}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  key={'重置'}
                  onClick={() => {
                    setSkuValue('');
                  }}
                >
                  重 置
                </Button>
              </Form.Item>
            </Form>
          </div>
          <ProTable<any>
            id="fromCrm"
            className="emptySpecialTable"
            // locale={{
            //   emptyText: () => (
            //     <>
            //       <div style={{ marginBottom: '20px' }}>暂无数据</div>
            //       <div>请前往CRM系统维护相关客户数据</div>
            //     </>
            //   ),
            // }}
            columns={columns}
            bordered
            size="small"
            scroll={{ x: 100, y: 300 }}
            dataSource={_.uniqBy(filterparamList, 'id')}
            // dataSource={filterparamList}
            //   request={async (params: any) => {
            //     params.pageNumber = params.current;
            //     params.pageSize = params.pageSize;
            //     setCurrentPage(params.pageNumber);
            //     setCurrentPageSize(params.pageSize);
            //     const res = await  querySapOpenSoInfo(prop.orderNo);
            //     if (startPage) {
            //       params.current = 1;
            //       params.pageSize = 20;
            //     }

            //     if (res?.data) {
            //       const list = res.data?.dataList?.filter((item: any, index: number) => {
            //         item.index = index;
            //         return item;
            //       });
            // 			if (res.errCode === 200) {
            // 				prop.getPageLoad(false);
            // 				setLoad(false);
            // 			  return Promise.resolve({
            // 			    data: list,
            // 			    total: res.data?.dataList?.length,
            // 			    current: 1,
            // 			    pageSize: 20,
            // 			    success: true,
            // 			  });
            // 			} else {
            // 			  message.error(res.errMsg, 3);
            // 				prop.getPageLoad(false);
            // 				setLoad(false);
            // 			  return Promise.resolve([]);
            // 			}

            //     } else {
            //       message.error('数据异常', 3);
            // 			prop.getPageLoad(false);
            // 			setLoad(false);
            //       return Promise.resolve([]);
            //     }
            //   }}
            search={{
              labelWidth: 'auto',
              span: 8,
              defaultCollapsed: false,
              collapseRender: false,
              className: 'search-form',
              optionRender: false,
              // collapsed: false,
            }}
            options={false}
            rowKey="id"
            tableAlertRender={false}
            actionRef={ref}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total, range) =>
                `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
              // onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
              showQuickJumper: true,
            }}
          />
        </Spin>
      </Modal>
    </>
  );
};

// export default forwardRef(SkuDeliveryView);
export default SkuDeliveryView;
