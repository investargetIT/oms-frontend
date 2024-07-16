import {
  deleteWareHouseCustomer,
  deleteWareHouseMapping,
  deleteWareHouseRegion,
  queryWareHouse,
  queryWareHouseConfig,
  queryWareHouseCustomer,
  queryWareHouseMapping,
  queryWareHouseRegion,
  updateWareHouseConfig,
  updateWareHouseMapping,
} from '@/services/SalesOrder';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Card, message, Modal, Switch, Tabs } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import AddNewCustomerForm from '../CSRSettings/components/AddNewCustomerForm';
import MyModal from './components/Modal';
import AddModal from './components/Modal/Modal';
import './style.less';
const { TabPane } = Tabs;
const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [afterSale, setafterSale] = useState(false);
  const [state, setState] = useState(false);
  const [virtualFlag, setVirtualFlag] = useState(false);
  const [code, setCode] = useState(); //?主页面装运点信息
  const [yClient, setYClient] = useState(900);
  const [cityInfo, setCityInfo]: any = useState([]);
  const [houseInfo, setHouseInfo]: any = useState();
  const [isAddNewModalVisible, setIsAddNewModalVisible] = useState(false);
  const [Length, setLength]: any = useState();
  const [tableData, setTableData]: any = useState();
  const ref: any = useRef<ActionType>();
  const ref2: any = useRef<ActionType>();
  const ref3: any = useRef<ActionType>();
  const addRef: any = useRef<ActionType>();
  const Modalref: any = useRef<ActionType>();
  function onShowSizeChange(current: any, pageSize: any) {
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const addNewModalClose = () => {
    setIsAddNewModalVisible(false);
  };
  const reloadTable = () => {
    ref.current?.reload();
  };
  const reloadTable3 = () => {
    ref3.current?.reload();
  };
  const addServeRange = () => {
    Modalref.current.openModal('serve');
  };
  const addServer = () => {
    setIsAddNewModalVisible(true);
  };
  const addWarehouse = () => {
    Modalref.current.openModal('add', cityInfo);
  };
  const cityChange = (): any => {};
  function tableReload() {
    ref2.current.reload();
  }
  //?最外面的tab切换到哪一项，那么当前的仓库信息就是哪一项的信息
  const tabChange = async (e: any) => {
    setHouseInfo(cityInfo[e]);
    setCode(cityInfo[e].storageLocationCode);
    const result = await queryWareHouseConfig(cityInfo[e].wareCode); //?刚一开始进入页面的时候将状态和是否接收售后设置一下
    const {
      data: { efficient, afterSale: a, virtualFlag: b },
    } = result;
    setState(efficient);
    setafterSale(a);
    setVirtualFlag(b);
  };
  const delReg = async (record: any) => {
    const res = await deleteWareHouseRegion(record.sid);
    if (res.errCode === 200) {
      message.success('删除成功');
      ref.current.reload();
    } else {
      message.error('获取区域失败');
    }
  };
  //?一进入页面查询仓库信息
  const fn = async () => {
    const res = await queryWareHouse();
    if (res.errCode == 200) {
      if (res.data.length > 0) {
        setCityInfo(res.data);
        setHouseInfo(res.data[0]); //?刚进入页面的时候默认是第一个省份的信息
        setCode(res?.data[0]?.storageLocationCode); //?设置装运点信息
        const result = await queryWareHouseConfig(res?.data[0]?.wareCode); //?刚一开始进入页面的时候将状态和是否接收售后设置一下
        if (result.errCode == 200) {
          const {
            data: { efficient, afterSale: a, virtualFlag: b },
          } = result || {};
          setState(efficient);
          setafterSale(a);
          setVirtualFlag(b);
        } else {
          message.error('失败' + res.errMsg);
        }
      } else {
        message.error('查询仓库信息接口为空');
      }
    } else {
      message.error('失败' + res.errMsg);
    }
  };
  const saleChange = async (e: any) => {
    setafterSale(e);
    const res = await updateWareHouseConfig({
      efficient: state,
      afterSale: e,
      virtualFlag,
      wareCode: houseInfo.wareCode,
    });
    if (res.errCode === 200) {
      message.success('修改成功');
    } else {
      message.error('修改失败' + res.errMsg);
    }
  };
  // ?是否虚拟仓
  const vChange = async (e: any) => {
    setVirtualFlag(e);
    const res = await updateWareHouseConfig({
      efficient: state,
      afterSale,
      virtualFlag: e,
      wareCode: houseInfo.wareCode,
    });
    if (res.errCode === 200) {
      message.success('修改成功');
    } else {
      message.error('修改失败' + res.errMsg);
    }
  };
  const stateChange = async (e: any) => {
    setState(e);
    const res = await updateWareHouseConfig({
      efficient: e,
      afterSale: afterSale,
      virtualFlag,
      wareCode: houseInfo.wareCode,
    });
    if (res.errCode === 200) {
      message.success('修改成功');
    } else {
      message.error('修改失败' + res.errMsg);
    }
  };
  const delServer = async (e: any) => {
    const res = await deleteWareHouseCustomer(e.sid);
    if (res.errCode === 200) {
      message.success('删除成功');
      ref2.current.reload();
    } else {
      message.error('删除失败' + res.errMsg);
    }
  };
  const delHouse = async (record: any) => {
    const res = await deleteWareHouseMapping(record.sid);
    if (res.errCode === 200) {
      message.success('删除成功');
    } else {
      message.error('删除失败' + res.errMsg);
    }
  };
  const move = async (record: any, num: any) => {
    if (num == 1) {
      //上移
      const upSid = tableData[record.index - 1].sid;
      const params = { upMappingId: upSid, downMappingId: record.sid };
      const res = await updateWareHouseMapping(params);
      if (res.errCode === 200) {
        message.success('修改优先级成功');
        reloadTable3();
      } else {
        message.error('修改优先级失败' + res.errMsg);
      }
    } else {
      const upSid = tableData[record.index + 1].sid;
      const params = { upMappingId: record.sid, downMappingId: upSid };
      const res = await updateWareHouseMapping(params);
      if (res.errCode === 200) {
        message.success('修改优先级成功');
        reloadTable3();
      } else {
        message.error('修改优先级失败' + res.errMsg);
      }
    }
  };
  const showDialog = (record: any, tableNo: number) => {
    addRef.current.openModal(record, tableNo, code);
  };
  useEffect(() => {
    fn();
  }, []);
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 420);
  }, [initialState?.windowInnerHeight]);
  const columns: ProColumns<any>[] = [
    {
      title: '#',
      dataIndex: 'index',
      width: 40,
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '服务地区',
      dataIndex: 'regionName',
      width: 150,
      sorter: (a, b) => (a.orderId - b.orderId ? 1 : -1),
    },
    {
      title: '添加人',
      dataIndex: 'createName',
      width: 150,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '添加时间',
      valueType: 'dateTime',
      dataIndex: 'createTime',
      width: 150,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '操作',
      dataIndex: '操作',
      // valueType: 'index',
      width: 150,
      fixed: 'right',
      render(_, record) {
        return (
          <Button type="link" onClick={() => delReg(record)}>
            删除
          </Button>
        );
      },
    },
  ];
  const columns2: ProColumns<any>[] = [
    {
      title: '#',
      dataIndex: 'index',
      width: 40,
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '客户代号',
      dataIndex: 'customerCode',
      width: 120,
      sorter: (a, b) => (a.orderId - b.orderId ? 1 : -1),
    },
    {
      title: '装运点',
      dataIndex: 'storageLocation',
      width: 70,
    },
    {
      title: '客户中文名称',
      dataIndex: 'customerName',
      width: 200,
    },
    {
      title: '所在地区',
      dataIndex: 'regionName',
      width: 150,
    },
    {
      title: '所在地区',
      dataIndex: 'regionName',
      width: 150,
    },
    {
      title: '街道名称',
      dataIndex: 'streetAddress',
      width: 150,
    },
    {
      title: '所属公司',
      dataIndex: 'companyName',
      width: 180,
    },
    {
      title: '操作',
      dataIndex: '删除',
      // valueType: 'index',
      width: 180,
      fixed: 'right',
      render(_, record) {
        // return index + 1;
        return (
          <>
            <Button type="link" onClick={() => delServer(record)}>
              删除客户
            </Button>
            <Button onClick={() => showDialog(record, 2)} type="link">
              编辑装运点
            </Button>
          </>
        );
      },
    },
  ];
  const columns3: ProColumns<any>[] = [
    {
      title: '#',
      dataIndex: 'index',
      width: 40,
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '仓库编号',
      dataIndex: 'backUpWareCode',
      width: 90,
      sorter: (a, b) => (a.orderId - b.orderId ? 1 : -1),
    },
    {
      title: '仓库名称',
      dataIndex: 'backUpWareName',
      width: 250,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '优先级',
      dataIndex: 'level',
      width: 250,
      sorter: (a, b) => (a.customerName - b.customerName ? 1 : -1),
    },
    {
      title: '操作',
      dataIndex: '操作',
      // valueType: 'index',
      width: 140,
      fixed: 'right',
      render(_, record, index) {
        let firstHidden = false;
        if (index === 0) {
          firstHidden = true;
        }
        let lastHidden = false;
        if (index === Length - 1) {
          lastHidden = true;
        }
        return [
          <Button type="link" disabled={firstHidden} onClick={() => move(record, 1)} key={'上移'}>
            上移
          </Button>,
          <Button type="link" disabled={lastHidden} onClick={() => move(record, 2)} key={'下移'}>
            下移
          </Button>,
          <Button type="link" onClick={() => delHouse(record)} key={'删除'}>
            删除
          </Button>,
        ];
      },
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  columns2.forEach((item: any) => {
    item.ellipsis = true;
  });
  columns3.forEach((item: any) => {
    item.ellipsis = true;
  });

  return (
    <div id="WarehouseConfig">
      <Card>
        <Tabs tabPosition={'left'} onChange={tabChange}>
          {cityInfo.map((item: any, index: number) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <TabPane tab={item.wareName} key={index}>
                <Tabs id="Innertabs" onChange={() => cityChange()}>
                  <TabPane tab="仓库属性配置" key="1" id="tabPanclass">
                    <header>
                      <div className="leftPart">
                        <h5>状态:</h5>
                        <h5>是否接收售后:</h5>
                        <h5>是否虚拟仓:</h5>
                      </div>
                      <div className="SwitchBox">
                        <div>
                          <Switch
                            checked={state}
                            onChange={stateChange}
                            checkedChildren="启用"
                            unCheckedChildren="禁用"
                            defaultChecked
                          />
                        </div>
                        <div>
                          <Switch
                            checked={afterSale}
                            onChange={saleChange}
                            checkedChildren="启用"
                            unCheckedChildren="禁用"
                          />
                        </div>
                        <div>
                          <Switch
                            checked={virtualFlag}
                            onChange={vChange}
                            checkedChildren="启用"
                            unCheckedChildren="禁用"
                          />
                        </div>
                      </div>
                      {/* <div className="storagLa">
                        <span>装运点：</span>
                        <Input
                          readOnly
                          onClick={() => showDialog('', 1)}
                          style={{ width: '200px' }}
                          value={code}
                        />
                        {code == undefined && <span>请填写SAP中装运点代码</span>}
                      </div> */}
                    </header>
                    <Button id="addServeBtn" onClick={addServeRange}>
                      添加服务范围
                    </Button>
                    <ProTable<any>
                      columns={columns}
                      scroll={{ x: 100, y: yClient }}
                      bordered
                      size="small"
                      options={false}
                      request={async (params) => {
                        const searchParams: any = {
                          pageNumber: params.current,
                          pageSize: params.pageSize,
                          wareCode: houseInfo.wareCode,
                        };
                        const res = await queryWareHouseRegion(searchParams);
                        if (res.errCode === 200) {
                          res.data?.list.forEach((e: any, i: any) => {
                            e.index = i;
                          });
                          return Promise.resolve({
                            data: res.data?.list,
                            total: res.data?.total,
                            success: true,
                          });
                        } else {
                          Modal.error(res.errMsg);
                          return Promise.resolve([]);
                        }
                      }}
                      pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        // showTotal: total => `共有 ${total} 条数据`,
                        showTotal: (total, range) =>
                          `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                        onShowSizeChange: (current, pageSize) =>
                          onShowSizeChange(current, pageSize),
                      }}
                      rowKey="index"
                      search={false}
                      tableAlertRender={false}
                      toolBarRender={false}
                      actionRef={ref}
                      className="Mytable"
                    />
                  </TabPane>
                  <TabPane tab="客户配置" key="2">
                    <Button id="addServeBtn" onClick={addServer}>
                      添加客户
                    </Button>
                    <ProTable<any>
                      columns={columns2}
                      scroll={{ x: 0, y: yClient }}
                      bordered
                      size="small"
                      options={false}
                      request={async (params) => {
                        const searchParams: any = {
                          pageNumber: params.current,
                          pageSize: params.pageSize,
                          wareCode: houseInfo.wareCode,
                        };
                        const res = await queryWareHouseCustomer(searchParams);
                        if (res.errCode === 200) {
                          res.data?.list.forEach((e: any, i: any) => {
                            e.index = i;
                          });
                          return Promise.resolve({
                            data: res.data?.list,
                            total: res.data?.total,
                            success: true,
                          });
                        } else {
                          Modal.error(res.errMsg);
                          return Promise.resolve([]);
                        }
                      }}
                      pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        // showTotal: total => `共有 ${total} 条数据`,
                        showTotal: (total, range) =>
                          `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                        onShowSizeChange: (current, pageSize) =>
                          onShowSizeChange(current, pageSize),
                      }}
                      rowKey="index"
                      search={false}
                      tableAlertRender={false}
                      toolBarRender={false}
                      actionRef={ref2}
                      className="Mytable"
                    />
                  </TabPane>
                  <TabPane tab="平行仓库配置" key="3">
                    <Button id="addServeBtn" onClick={addWarehouse}>
                      添加仓库
                    </Button>
                    <ProTable<any>
                      columns={columns3}
                      scroll={{ x: 100, y: yClient }}
                      bordered
                      size="small"
                      options={false}
                      request={async (params) => {
                        const searchParams: any = {
                          pageNumber: params.current,
                          pageSize: params.pageSize,
                          wareCode: houseInfo.wareCode,
                        };
                        const res = await queryWareHouseMapping(searchParams);
                        if (res.errCode === 200) {
                          res.data?.list.forEach((e: any, i: any) => {
                            e.index = i;
                          });
                          setTableData(res.data?.list);
                          setLength(res.data?.list?.length);
                          return Promise.resolve({
                            data: res.data?.list,
                            total: res.data?.total,
                            success: true,
                          });
                        } else {
                          Modal.error(res.errMsg);
                          return Promise.resolve([]);
                        }
                      }}
                      pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        // showTotal: total => `共有 ${total} 条数据`,
                        showTotal: (total, range) =>
                          `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                        onShowSizeChange: (current, pageSize) =>
                          onShowSizeChange(current, pageSize),
                      }}
                      rowKey="index"
                      search={false}
                      tableAlertRender={false}
                      toolBarRender={false}
                      actionRef={ref3}
                      className="Mytable"
                    />
                  </TabPane>
                </Tabs>
              </TabPane>
            );
          })}
        </Tabs>
      </Card>
      {/* //?添加服务范围弹框 */}
      <MyModal
        fn={reloadTable}
        fn2={reloadTable3}
        houseInfo={houseInfo}
        cityInfo={cityInfo}
        ref={Modalref}
        length={Length}
      />
      {/* //?添加客户弹框 */}
      <Modal
        className="noTopFootBorder"
        width={910}
        title="选择客户"
        visible={isAddNewModalVisible}
        destroyOnClose={true}
        footer={[]}
        onCancel={addNewModalClose}
      >
        <AddNewCustomerForm
          addNewModalClose={addNewModalClose}
          tableReload={tableReload}
          houseInfo={houseInfo}
          state={true}
          code={code}
        />
      </Modal>
      <AddModal ref={addRef} houseInfo={houseInfo} fn={reloadTable} fn2={tableReload} />
    </div>
  );
};
// export default Index;
import { KeepAlive } from 'react-activation';
import { history } from 'umi';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <Index />
  </KeepAlive>
);
