import React, { useRef, useEffect, useState } from 'react';
import './modal.less';
import ProTable from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { message, Input, Tabs } from 'antd';
interface modalProps {
  modalTitle: any;
  modalColumn: any;
  operateMethod: Function;
  getData: Function;
  modalOK: any;
  showApiAddress: any;
  basicData: any;
}
const ModalList: React.FC<modalProps> = (props: any) => {
  const { TabPane } = Tabs;
  const ref = useRef<ActionType>();
  const refTwoLevel = useRef<ActionType>();
  const refOneLevel = useRef<ActionType>();
  const [columns, setColumns] = useState([]);
  const [startPage, setStartPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [selectedRowKeys, setSelectedRowKeys]: any = useState([]);
  const [searchOption, setSearchOption]: any = useState(false);

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(rowKeys);
      props.operateMethod(selectedRows);
    },
    // getCheckboxProps: (record: any) => ({
    //   // disabled: record.effective === '0', // Column configuration not to be checked
    //   // effective: record.effective,
    // }),
  };
  const renderCol = (text: number) => {
    // return (currentPage - 1) * currentPageSize + text + 1;
    return text + 1;
  };
  const addressCol = (text, record: any) => {
    if (!record.districtName || record.district == 0) {
      return record.provinceName + ' ' + record.cityName;
    } else {
      return record.provinceName + ' ' + record.cityName + ' ' + record.districtName;
    }
  };
  const r3FrozenCol = (text, record: any) => {
    if (record.effective == 1) {
      return '是';
    } else if (record.effective == 0) {
      return '否';
    }
  };
  const r3Placeholder = () => {
    return <Input allowClear placeholder={'输入联系人姓名关键字'} />;
  };
  const searchAddress = () => {
    return <Input allowClear placeholder={'输入收件地址关键字'} />;
  };
  const searchReceiver = () => {
    return <Input allowClear placeholder={'输入收件人关键字'} />;
  };
  const searchMobile = () => {
    return <Input allowClear placeholder={'精确输入手机号'} />;
  };

  useEffect(() => {
    const temp = JSON.parse(JSON.stringify(props.modalColumn));
    temp[0].render = renderCol;
    if (props.modalTitle == '选择地址' || props.modalTitle == '选择发票收件信息') {
      temp[1].render = addressCol;
      temp[2].renderFormItem = searchAddress;
      temp[3].renderFormItem = searchReceiver;
      temp[5].renderFormItem = searchMobile;
      setSearchOption({
        labelWidth: 'auto',
        span: 6,
        defaultCollapsed: false,
        collapseRender: false,
        className: 'search-form',
      });
    } else if (props.modalTitle == '选择R3联系人') {
      temp[3].render = r3FrozenCol;
      temp[2].renderFormItem = r3Placeholder;
      setSearchOption({
        labelWidth: 'auto',
        span: 8,
        defaultCollapsed: false,
        collapseRender: false,
        className: 'search-form',
      });
    } else {
      setSearchOption(false);
    }
    setColumns(temp);
  }, [props.modalColumn, currentPage, currentPageSize]);

  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setSelectedRowKeys([]);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
    props.operateMethod('');
  }
  const tabChange = (key: any) => {
    console.log(key);
    if (key === '1') {
      refTwoLevel?.current?.reload();
    } else {
      refOneLevel?.current?.reload();
    }
  };
  return (
    <div className="base-style">
      {props.showApiAddress && (
        <Tabs defaultActiveKey="1" onTabClick={tabChange} id={'modalListTabsCol'}>
          <TabPane tab="二级单位" key="1">
            <p>
              采购单位名称：{props.basicData?.purchaseName}; 客户号：{props.basicData?.purchaseCode}
            </p>
            <ProTable<any>
              id="fromCrm"
              className="emptySpecialTable"
              locale={{
                emptyText: () => (
                  <>
                    <div style={{ marginBottom: '20px' }}>暂无数据</div>
                    <div>请前往CRM系统维护相关客户数据</div>
                  </>
                ),
              }}
              columns={columns}
              bordered
              size="small"
              scroll={{ x: 100, y: 300 }}
              request={async (params: any) => {
                params.pageNumber = params.current;
                params.pageSize = params.pageSize;
                setCurrentPage(params.pageNumber);
                setCurrentPageSize(params.pageSize);
                // const result = props.getData && (await props.getData(params, 2));
                const result = props.getData && (await props.getData(params));
                if (startPage) {
                  params.current = 1;
                  params.pageSize = 20;
                }

                if (result?.data) {
                  const list = result.data?.dataList?.filter((item: any, index: number) => {
                    item.index = index;
                    if (props.modalTitle == '选择地址' || props.modalTitle == '选择发票收件信息') {
                      return (
                        (!params.receiptAddress ||
                          item.receiptAddress?.includes(params.receiptAddress)) &&
                        (!params.recipientName ||
                          item.recipientName?.includes(params.recipientName)) &&
                        (!params.receiptMobilePhone ||
                          item.receiptMobilePhone === params.receiptMobilePhone)
                      );
                    } else {
                      return item;
                    }
                  });

                  return Promise.resolve({
                    data: list,
                    total: result.data.dataList?.length,
                    success: true,
                    pageSize: 20,
                  });
                } else {
                  message.error(result.errMsg, 3);
                  return Promise.resolve([]);
                }
              }}
              search={searchOption}
              // search={{
              //   labelWidth: 'auto',
              //   span: 8,
              //   defaultCollapsed: false,
              //   collapseRender: false,
              //   className: 'search-form',
              // }}
              rowSelection={{ type: 'radio', fixed: 'left', ...rowSelection }}
              options={false}
              rowKey="index"
              tableAlertRender={false}
              actionRef={refTwoLevel}
              onRow={(record) => {
                return {
                  onClick: () => {
                    setSelectedRowKeys([record.index]);
                    props.operateMethod([record]);
                  }, // 点击行
                  onDoubleClick: () => {
                    props.operateMethod([record]);
                    if (props.modalOK) {
                      props.modalOK();
                    }
                  },
                };
              }}
              pagination={{
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                // showTotal: total => `共有 ${total} 条数据`,
                showTotal: (total, range) =>
                  `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
                showQuickJumper: true,
              }}
            />
          </TabPane>
          <TabPane tab="一级单位" key="2">
            <p>
              客户名称：{props.basicData?.customerName}; 客户号：{props.basicData?.customerCode}
            </p>
            <ProTable<any>
              id="fromCrm"
              className="emptySpecialTable"
              locale={{
                emptyText: () => (
                  <>
                    <div style={{ marginBottom: '20px' }}>暂无数据</div>
                    <div>请前往CRM系统维护相关客户数据</div>
                  </>
                ),
              }}
              columns={columns}
              bordered
              size="small"
              scroll={{ x: 100, y: 300 }}
              request={async (params: any) => {
                params.pageNumber = params.current;
                params.pageSize = params.pageSize;
                setCurrentPage(params.pageNumber);
                setCurrentPageSize(params.pageSize);
                // const result = props.getData && (await props.getData(params, 2));
                const result = props.getData && (await props.getData(params));
                if (startPage) {
                  params.current = 1;
                  params.pageSize = 20;
                }

                if (result?.data) {
                  const list = result.data?.dataList?.filter((item: any, index: number) => {
                    item.index = index;
                    if (props.modalTitle == '选择地址' || props.modalTitle == '选择发票收件信息') {
                      return (
                        (!params.receiptAddress ||
                          item.receiptAddress?.includes(params.receiptAddress)) &&
                        (!params.recipientName ||
                          item.recipientName?.includes(params.recipientName)) &&
                        (!params.receiptMobilePhone ||
                          item.receiptMobilePhone === params.receiptMobilePhone)
                      );
                    } else {
                      return item;
                    }
                  });

                  return Promise.resolve({
                    data: list,
                    total: result.data.dataList?.length,
                    success: true,
                    pageSize: 20,
                  });
                } else {
                  message.error(result.errMsg, 3);
                  return Promise.resolve([]);
                }
              }}
              search={searchOption}
              // search={{
              //   labelWidth: 'auto',
              //   span: 8,
              //   defaultCollapsed: false,
              //   collapseRender: false,
              //   className: 'search-form',
              // }}
              rowSelection={{ type: 'radio', fixed: 'left', ...rowSelection }}
              options={false}
              rowKey="index"
              tableAlertRender={false}
              actionRef={refOneLevel}
              onRow={(record) => {
                return {
                  onClick: () => {
                    setSelectedRowKeys([record.index]);
                    props.operateMethod([record]);
                  }, // 点击行
                  onDoubleClick: () => {
                    props.operateMethod([record]);
                    if (props.modalOK) {
                      props.modalOK();
                    }
                  },
                };
              }}
              pagination={{
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                // showTotal: total => `共有 ${total} 条数据`,
                showTotal: (total, range) =>
                  `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
                showQuickJumper: true,
              }}
            />
          </TabPane>
        </Tabs>
      )}

      {!props.showApiAddress && (
        <ProTable<any>
          id="fromCrm"
          className="emptySpecialTable"
          locale={{
            emptyText: () => (
              <>
                <div style={{ marginBottom: '20px' }}>暂无数据</div>
                <div>请前往CRM系统维护相关客户数据</div>
              </>
            ),
          }}
          columns={columns}
          bordered
          size="small"
          scroll={{ x: 100, y: 300 }}
          request={async (params: any) => {
            console.log(params, 'params');
            params.pageNumber = params.current;
            params.pageSize = params.pageSize;
            setCurrentPage(params.pageNumber);
            setCurrentPageSize(params.pageSize);
            // const result = props.getData && (await props.getData(params, 2));
            const result = props.getData && (await props.getData(params));
            if (startPage) {
              params.current = 1;
              params.pageSize = 20;
            }

            if (result?.data) {
              const list = result.data?.dataList?.filter((item: any, index: number) => {
                item.index = index;
                if (props.modalTitle == '选择地址' || props.modalTitle == '选择发票收件信息') {
                  return (
                    (!params.receiptAddress ||
                      item.receiptAddress?.includes(params.receiptAddress)) &&
                    (!params.recipientName || item.recipientName?.includes(params.recipientName)) &&
                    (!params.receiptMobilePhone ||
                      item.receiptMobilePhone === params.receiptMobilePhone)
                  );
                } else {
                  return item;
                }
              });
              if (params.keyword) {
                const arr = result.data.dataList?.filter(
                  (e) =>
                    e.email.includes(params.keyword) ||
                    e.mobile.includes(params.keyword) ||
                    e.tel.includes(params.keyword),
                );
                return Promise.resolve({
                  data: arr || [],
                  total: arr.length,
                  success: true,
                  pageSize: 20,
                });
              }
              return Promise.resolve({
                data: list,
                total: result.data.dataList?.length,
                success: true,
                pageSize: 20,
              });
            } else {
              message.error(result.errMsg, 3);
              return Promise.resolve([]);
            }
          }}
          search={searchOption}
          // search={{
          //   labelWidth: 'auto',
          //   span: 8,
          //   defaultCollapsed: false,
          //   collapseRender: false,
          //   className: 'search-form',
          // }}
          rowSelection={{ type: 'radio', fixed: 'left', ...rowSelection }}
          options={false}
          rowKey="index"
          tableAlertRender={false}
          actionRef={ref}
          onRow={(record) => {
            return {
              onClick: () => {
                setSelectedRowKeys([record.index]);
                props.operateMethod([record]);
              }, // 点击行
              onDoubleClick: () => {
                props.operateMethod([record]);
                if (props.modalOK) {
                  props.modalOK();
                }
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
        />
      )}
    </div>
  );
};

export default ModalList;
