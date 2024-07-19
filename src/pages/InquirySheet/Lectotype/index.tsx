import { allInquiry, cancelInquiry, exportInquiry, inqExportLn } from '@/services/InquirySheet';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Space, DatePicker, Select, Modal, message } from 'antd';
import moment from 'moment';
import { history, useModel } from 'umi';
import './index.less';
import TransferQuto from './TransferQuto';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { getFieldConfiguration, saveFieldConfiguration } from '@/services/InquirySheet';
// import { KeepAlive } from 'react-activation';
import { colLimit } from '@/services';
import { KeepAlive } from 'react-activation';
import TableCom from '@/pages/components/TableCom/Index';
const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  // const { getKeys } = useModel('basicUnit', (model) => ({ getKeys: model.getKeys }));
  const { RangePicker }: any = DatePicker;
  const ref = useRef<ActionType>();
  const ModRef = useRef();
  const [form] = Form.useForm();
  const [yClient, setYClient] = useState(950);
  const [selRows, setSelRows]: any = useState([]);
  const [pageParams, setPageParams] = useState({});
  const [companyList, setCompanyList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys]: any = useState([]);
  const [levelList, setLevelList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [reqList, setReqList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const [fold, setFold] = useState(false);
  function UpDown() {
    setFold(!fold);
  }
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const btnCol = (record: any) => {
    const temp: any = [];
    if ([30].includes(record.status)) {
      // if ([30, 20].includes(record.status)) {
      temp.push(
        <Button
          size="small"
          key={'编辑'}
          type="link"
          onClick={() => {
            history.push(`/inquiry/edit/${record.sid}`);
          }}
        >
          编辑
        </Button>,
      );
    }
    if (![30].includes(record.status)) {
      // if ([30, 20].includes(record.status)) {
      temp.push(
        <Button
          size="small"
          key={'复制'}
          type="link"
          onClick={() => {
            // history.push(`/inquiry/add/${record.sid}`);
            history.push({
              state: { id: record.inquiryCode, type: 'copy' },
              pathname: `/inquiry/edit/${record.sid}`,
            });
          }}
        >
          复制
        </Button>,
      );
    }
    temp.push(
      <Button
        size="small"
        key={'详情'}
        type="link"
        onClick={() => {
          history.push({
            state: { id: record.sid, sorurceType: 'info', type: 'operate' },
            pathname: '/inquiry/info',
          });
        }}
      >
        {' '}
        详情{' '}
      </Button>,
    );
    return temp;
  };
  const colorList = {
    '10': '#bfbfbf',
    '20': '#bfbfbf',
    '30': '#000',
    '40': '#000',
    '50': '#eb2f96',
    '130': '#fadb14',
    '180': '#fadb14',
    '200': '#1890ff',
    '210': '#52c41a',
  };
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '操作',
      width: 100,
      render: (record: any, text: any) => btnCol(text),
      fixed: 'left',
    },
    { title: '需求单号', width: 160, dataIndex: 'inquiryCode', fixed: 'left' },
    {
      title: '需求单状态',
      width: 120,
      dataIndex: 'statusStr',
      renderText: (text: any, recorder: any) => (
        <span style={{ color: colorList[recorder.status] }}>{text}</span>
      ),
    },
    {
      title: '有无可清数量',
      width: 120,
      dataIndex: 'clearableQty',
      renderText: (text: string) => {
        return text === '有' ? <span style={{ color: 'red' }}>{text}</span> : <span>{text}</span>;
      },
    },
    {
      title: '是否需要sourcing',
      width: 120,
      dataIndex: 'needSourcing',
      renderText: (text: string) => {
        return text === '是' ? <span style={{ color: 'red' }}>{text}</span> : <span>{text}</span>;
      },
    },
    {
      title: '是否有退回销售',
      width: 120,
      dataIndex: 'returnSale',
      renderText: (text: string) => {
        return text === '是' ? <span style={{ color: 'red' }}>{text}</span> : <span>{text}</span>;
      },
    },
    { title: '是否有二次询价', width: 120, dataIndex: 'secondInquiry' },
    { title: '需求类型', width: 150, dataIndex: 'reqTypeStr' },
    { title: '询价类型', width: 120, dataIndex: 'inqTypeStr' },
    { title: '渠道', width: 120, dataIndex: 'channelStr' },
    { title: '所属公司', width: 150, dataIndex: 'branchCompanyName' },
    { title: '客户号', width: 120, dataIndex: 'customerCode' },
    { title: '客户名称', width: 150, dataIndex: 'customerName' },
    { title: '客户级别', width: 120, dataIndex: 'customerLevel' },
    { title: '商机名称', width: 120, dataIndex: 'oppoValue' },
    { title: '项目名称', width: 120, dataIndex: 'projectName' },
    { title: 'R3联系人', width: 120, dataIndex: 'contactName' },
    { title: '评分', width: 120, dataIndex: 'sysScore' },
    { title: '创建人', width: 120, dataIndex: 'createName' },
    { title: '需求单创建时间', width: 150, dataIndex: 'createTime' },
    { title: '需求单提交时间', width: 150, dataIndex: 'submitTime' },
    // { title: 'AE澄清开始时间', width: 150, dataIndex: 'aeClarifyTime' },
    { title: 'AE选配开始时间', width: 150, dataIndex: 'startMatchTime' },
    { title: '最后修改时间', width: 150, dataIndex: 'updateTime' },
    { title: '需求单完成时间', width: 150, dataIndex: 'completeTime' },
    { title: '用时统计(小时)', width: 120, dataIndex: 'useTime' },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    // getKeys([
    //   'reqTypeEnum',
    //   'inqTypeAllEnum',
    //   'inqStat',
    //   'customerLevelEnum',
    //   'branchCompanyEnum',
    // ]).then((res: any) => {
    //   if (res) {
    //     setReqList(res.reqTypeEnum);
    //     setTypeList(res.inqTypeAllEnum);
    //     setStatusList(res.inqStat);
    //     setLevelList(res.customerLevelEnum);
    //     setCompanyList(res.branchCompanyEnum);
    //   }
    // });
  }, []);
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 340);
    if (history.action === 'REPLACE') {
      ref.current?.reload();
      setSelectedRowKeys([]);
    }
  }, [history.action]);
  useEffect(() => {
    // getFieldConfiguration({ url: history.location.pathname }).then((res) => {
    //   if (res.data) {
    //     const datas = JSON.parse(res.data);
    //     setColumnsStateMap(datas);
    //   } else {
    //     setColumnsStateMap({});
    //   }
    // });
  }, [history.location.pathname]);
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 360);
  }, [initialState?.windowInnerHeight]);
  const onExport = () => {
    const sidList = selRows.map((ite: any) => ite.sid);
    let titleMsg = '';
    if (selRows.length) {
      titleMsg = '确定导出所选择的数据？';
    } else {
      titleMsg = '确定根据查询条件导出数据？';
    }
    Modal.confirm({
      title: titleMsg,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const searchParams = form.getFieldsValue(true);
        searchParams.createTimeStart = moment(searchParams.createTime[0]).format('YYYY-MM-DD');
        searchParams.createTimeEnd = moment(searchParams.createTime[1]).format('YYYY-MM-DD');
        // exportInquiry(JSON.parse(JSON.stringify({ ...pageParams, ...searchParams, sidList }))).then(
        //   (res: any) => {
        //     const { data } = res;
        //     const reader = new FileReader();
        //     reader.onload = function () {
        //       try {
        //         const resContent = reader.result ? JSON.parse(reader.result.toString()) : '';
        //         if (resContent.statusCode) {
        //           Modal.error(resContent.errMsg);
        //         }
        //       } catch {
        //         const el = document.createElement('a');
        //         el.style.display = 'none';
        //         el.href = URL.createObjectURL(data);
        //         el.download = '需求单信息.xlsx';
        //         document.body.append(el);
        //         el.click();
        //         window.URL.revokeObjectURL(el.href);
        //         document.body.removeChild(el);
        //       }
        //     };
        //     reader.readAsText(data);
        //   },
        // );
      },
    });
  };
  const onSelect = (rowKeys: any, selectedRows: any) => {
    setSelRows(selectedRows);
    setSelectedRowKeys(rowKeys);
  };
  const onCancel = (): boolean => {
    if (selRows.length === 0) {
      Modal.warning({ title: '请选择需要取消的需求单!' });
      return false;
    }
    const ids = selRows.map((ite: any) => ite.sid);
    Modal.confirm({
      title: '确定取消所选择的需求单？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // cancelInquiry(ids.join()).then((res: any) => {
        //   if (res.errCode === 200) {
        //     message.success('取消成功!');
        //     ref.current?.reload();
        //     setSelectedRowKeys([]);
        //   } else {
        //     message.error(res.errMsg);
        //   }
        // });
      },
    });
    return true;
  };
  const onExportDetail = () => {
    if (selRows.length === 0) {
      Modal.warning({ title: '请选择至少一个需求单导出' });
      return false;
    }
    const ids = selRows.map((ite: any) => ite.sid);
    Modal.confirm({
      title: '确定导出所选择的需求单？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // inqExportLn(JSON.parse(JSON.stringify(ids))).then((res: any) => {
        //   const { data } = res;
        //   const reader = new FileReader();
        //   reader.onload = function () {
        //     try {
        //       const resContent = reader.result ? JSON.parse(reader.result.toString()) : '';
        //       if (resContent.statusCode) {
        //         Modal.error(resContent.errMsg);
        //       }
        //     } catch {
        //       const el = document.createElement('a');
        //       el.style.display = 'none';
        //       el.href = URL.createObjectURL(data);
        //       el.download = '需求单信息.xlsx';
        //       document.body.append(el);
        //       el.click();
        //       window.URL.revokeObjectURL(el.href);
        //       document.body.removeChild(el);
        //     }
        //   };
        //   reader.readAsText(data);
        // });
      },
    });
    return true;
  };
  const onTranfer = (): boolean => {
    if (!selectedRowKeys.length) {
      Modal.warning({ title: '请选择需求单' });
      return false;
    }
    const code = new Set();
    let isDis = false;
    let cspNum = 0;
    let bjNum = 0;
    selRows.forEach((item: any) => {
      if (item.custPurpose === 40) {
        ++cspNum;
      }
      if (item.custPurpose === 50) {
        ++bjNum;
      }
      if (![210, 200].includes(item.status)) isDis = true;
      code.add(item.customerCode);
    });
    if (selRows.some((io: any) => io.apiMark == 1)) {
      Modal.warning({ title: '存在状态不可转的需求单，请重新选择' });
      return false;
    }
    if (isDis) {
      Modal.warning({ title: '存在状态不可转的需求单，请重新选择' });
      return false;
    }
    if (code.size > 1) {
      Modal.warning({ title: '请选择客户相同的需求单!' });
      return false;
    }
    if (bjNum !== 0 && bjNum !== selRows?.length) {
      Modal.warning({ title: '比价反拍需求单不可与其他目的的需求单合并转报价单!' });
      return false;
    }
    if (cspNum !== 0 && cspNum !== selRows?.length) {
      Modal.warning({ title: 'CSP需求单不可与其他渠道需求单合并转报价单!' });
      return false;
    }
    setVisible(true);
    return true;
  };
  const modalOk = async () => {
    const res = await ModRef.current?.getParams();
    if (res && res.length) {
      const inquiryId = new Set();
      const sid: any = [];
      res.forEach((item: any) => {
        inquiryId.add(item.inquiryId);
        sid.push(item.sid);
      });
      const pars: any = {
        from: 'need',
        quotIdList: Array.from(inquiryId),
        quotLineIdList: sid,
      };
      history.push({
        state: JSON.stringify(pars),
        pathname: '/inquiry/offer/offerOrder',
      });
      setVisible(false);
    } else {
      Modal.warning({ title: '请选择行明细!' });
    }
  };
  return (
    <div className="omsAntStyle" id="omsAntStyle">
      <div className="form-content-search">
        <Form
          autoComplete="off"
          layout="inline"
          form={form}
          className="ant-advanced-form"
          initialValues={{
            needSourcing: '',
            returnSale: '',
            secondInquiry: '',
            createTime: [moment().subtract(1, 'month'), moment()],
          }}
        >
          <Form.Item name="inquiryCode" label="需求单号">
            <Input placeholder="请输入需求单号" />
          </Form.Item>
          <Form.Item name="customerCode" label="客户号">
            <Input placeholder="请输入客户号" />
          </Form.Item>
          <Form.Item name="customerName" label="客户名称">
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          <Form.Item name="status" label="需求单状态">
            <Select showSearch style={{ width: 200 }} placeholder="需求单状态">
              <Select.Option value="">全部</Select.Option>
              {statusList &&
                statusList.map((item: any) => (
                  <Select.Option value={item.code} key={item.code}>
                    {item.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          {!fold && (
            <>
              <Form.Item name="reqType" label="需求类型">
                <Select showSearch style={{ width: 200 }} placeholder="需求类型">
                  <Select.Option value="">全部</Select.Option>
                  {reqList &&
                    reqList.map((item: any) => (
                      <Select.Option value={item.code} key={item.code}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item name="inqType" label="询价类型">
                <Select showSearch style={{ width: 200 }} placeholder="询价类型">
                  <Select.Option value="" key="0">
                    全部
                  </Select.Option>
                  {typeList &&
                    typeList.map((item: any) => (
                      <Select.Option value={item.code} key={item.code}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item name="customerLevel" label="客户级别">
                <Select showSearch style={{ width: 200 }} placeholder="客户级别">
                  <Select.Option value="">全部</Select.Option>
                  {levelList &&
                    levelList.map((item: any) => (
                      <Select.Option value={item.code} key={item.code}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item name="branchCode" label="所属公司">
                <Select showSearch style={{ width: 200 }} placeholder="所属公司">
                  <Select.Option value="" key="0">
                    全部
                  </Select.Option>
                  {companyList &&
                    companyList.map((item: any) => (
                      <Select.Option value={item.code} key={item.code}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item name="sku" label="SKU">
                <Input placeholder="请输入sku" />
              </Form.Item>
              <Form.Item name="productName" label="产品名称">
                <Input placeholder="请输入产品名称" />
              </Form.Item>
              <Form.Item name="reqProductName" label="需求产品名称">
                <Input placeholder="请输入需求产品名称" />
              </Form.Item>
              <Form.Item name="reqMfgSku" label="需求制造商型号">
                <Input placeholder="请输入需求制造商型号" />
              </Form.Item>
              <Form.Item name="returnSale" label="退回销售">
                <Select showSearch style={{ width: 200 }} placeholder="退回销售">
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value="1">是</Select.Option>
                  <Select.Option value="0">否</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="secondInquiry" label="二次询价">
                <Select showSearch style={{ width: 200 }} placeholder="二次询价">
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value="1">是</Select.Option>
                  <Select.Option value="0">否</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="needSourcing" label="是否需要sourcing">
                <Select showSearch style={{ width: 200 }} placeholder="是否需要souricng">
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value="1">是</Select.Option>
                  <Select.Option value="0">否</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="projectName" label="项目名称">
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item name="createName" label="创建人">
                <Input placeholder="请输入创建人" />
              </Form.Item>
              <Form.Item name="createTime" label="创建时间" className="self-time">
                <RangePicker format="YYYY-MM-DD" allowClear={false} />
              </Form.Item>
            </>
          )}
          <Form.Item label=" " colon={false}>
            <Space>
              <Button
                size="small"
                key={'查询'}
                type="primary"
                onClick={() => {
                  ref.current?.reload(true);
                  setStartPage(true);
                }}
              >
                查 询
              </Button>
              <Button
                size="small"
                key={'重置'}
                onClick={() => {
                  form.resetFields();
                }}
              >
                重 置
              </Button>
              <Button
                key={'展开'}
                icon={fold ? <DownOutlined /> : <UpOutlined />}
                onClick={() => {
                  UpDown();
                }}
              >
                {fold ? '展开' : '收起'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <TableCom
        columns={columns}
        scroll={{ x: 200, y: yClient }}
        columnsState={{
          value: columnsStateMap,
          onChange: (val: any) => {
            setColumnsStateMap(val);
            // saveFieldConfiguration({
            //   url: history.location.pathname,
            //   fieldConfiguration: JSON.stringify(val),
            // });
          },
          // persistenceKey: '/inquiry/lectotype',
          // persistenceType: 'localStorage',
        }}
        request={async (params: any) => {
          const searchParams = form.getFieldsValue(true);
          if (startPage) {
            params.current = 1;
          }
          searchParams.createTimeStart = moment(searchParams.createTime[0]).format('YYYY-MM-DD');
          searchParams.createTimeEnd = moment(searchParams.createTime[1]).format('YYYY-MM-DD');
          searchParams.pageNumber = params.current;
          searchParams.pageSize = params.pageSize;
          setPageParams(params);
          // const res = await allInquiry(searchParams);
          // setSelectedRowKeys([]);
          // setSelRows([]);
          // if (res.errCode === 200) {
          //   return Promise.resolve({ data: res.data?.list, total: res.data?.total, success: true });
          // } else {
          //   Modal.error({ title: res.errMsg });
          //   return Promise.resolve([]);
          // }
        }}
        rowSelection={{ type: 'checkbox', onChange: onSelect, selectedRowKeys }}
        onRow={(record: any) => {
          return {
            onClick: () => {
              if (selectedRowKeys.includes(record.sid)) {
                const newKeys = selectedRowKeys.filter((item: any) => item !== record.sid);
                setSelectedRowKeys(newKeys);
                const newRows = selRows.filter((item: any) => item.sid !== record.sid);
                setSelRows(newRows);
              } else {
                setSelectedRowKeys(selectedRowKeys.concat([record.sid]));
                setSelRows(selRows.concat([record]));
              }
            },
          };
        }}
        options={{ reload: false, density: false }}
        rowKey="sid"
        search={false}
        tableAlertRender={false}
        actionRef={ref}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100', '200'],
          showTotal: (total: any, range: any) =>
            `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          onShowSizeChange: (current: any, pageSize: any) => onShowSizeChange(current, pageSize),
          showQuickJumper: true,
        }}
        headerTitle={
          <Space>
            <Button
              key="新增"
              type="primary"
              size="small"
              onClick={() => {
                history.push('/inquiry/add');
              }}
            >
              新 增
            </Button>
            <Button key="转报价单" type="primary" ghost size="small" onClick={onTranfer}>
              转报价单
            </Button>
            <Button key="导出" size="small" onClick={onExport}>
              导出
            </Button>
            <Button key="导出明细" size="small" onClick={onExportDetail}>
              导出明细
            </Button>
            <Button key="取消需求" danger className="light_danger" size="small" onClick={onCancel}>
              取消需求
            </Button>
          </Space>
        }
      />
      <Modal
        title="选择询价任务明细"
        width="1000"
        visible={visible}
        destroyOnClose
        onOk={modalOk}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <TransferQuto ref={ModRef} sidList={selectedRowKeys} />
      </Modal>
    </div>
  );
};
// export default Index;
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <Index />
  </KeepAlive>
);
