import { getStockLogs } from '@/services/Stock';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Space, DatePicker, Select, Checkbox, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { useModel, history } from 'umi';
import { colLimit } from '@/services';
import './index.less';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
const Using: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { RangePicker } = DatePicker;
  const ref = useRef<ActionType>();
  const [form] = Form.useForm();
  const [yClient, setYClient] = useState(950);
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
  const statusList = {
    // '11': '正常销售',
    // '12': '缺销售价格',
    // '21': '限量销售',
    // '22': '暂停销售',
    // '31': '尾货待售',
    // '32': '业务终止',
    // '60': '单笔询价',
    '10': '缺价格&销售单位',
    '11': '正常销售',
    '12': '缺价格',
    '13': '缺销售单位',
    '30': '缺价格&销售单位',
    '31': '尾货待售',
    '32': '缺价格',
    '33': '缺销售单位',
    '35': '业务终止',
    '50': '停止销售',
    '60': '单笔询价',
  };
  const optList = {
    2: '清除占用',
    1: '释放',
    3: '占用',
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
    { title: '流水编号', width: 70, dataIndex: 'sid', fixed: 'left' },
    { title: '关联单据', width: 90, dataIndex: 'orderNo', fixed: 'left' },
    { title: 'SKU号', width: 90, dataIndex: 'skuCode', fixed: 'left' },
    {
      title: '状态',
      width: 120,
      dataIndex: 'success',
      render(text, val) {
        return <span>{val.success ? '成功' : '失败'}</span>;
      },
    },
    {
      title: '业务状态编码',
      width: 100,
      dataIndex: 'bizStatus',
    },
    {
      title: '发生时业务状态',
      width: 120,
      dataIndex: 'bizStatus',
      renderText: (text: any, recorder: any) => <span>{statusList[recorder.bizStatus]}</span>,
    },
    {
      title: '流水类型',
      width: 120,
      dataIndex: 'opt',
      renderText: (text: any, recorder: any) => <span>{optList[recorder.opt]}</span>,
    },
    { title: '关联单据来源', width: 120, dataIndex: 'origin' },
    { title: '计价单位', width: 160, dataIndex: 'chargeUnit' },
    { title: '物料号', width: 160, dataIndex: 'itemCode' },
    { title: '销售包装单位数量', width: 160, dataIndex: 'stockNum' },
    { title: '商品名称', width: 260, dataIndex: 'skuName' },
    { title: '动前可售数量', width: 150, dataIndex: 'befafsCount' },
    { title: '动前占用数量', width: 120, dataIndex: 'befoccupyCount' },
    { title: '动前实物数量', width: 120, dataIndex: 'befstockCount' },
    {
      title: '本次可售数量变化',
      width: 120,
      dataIndex: 'changeCount',
      renderText: (text: any, record: any) => {
        if (record?.opt === 1) {
          return <span style={{ color: 'green' }}>+{text}</span>;
        } else if (record?.opt === 3) {
          return <span style={{ color: 'red' }}>-{text}</span>;
        } else {
          return <span>{text}</span>;
        }
      },
    },
    { title: '动后可售数量', width: 120, dataIndex: 'aftafsCount' },
    { title: '动后占用数量', width: 120, dataIndex: 'aftoccupyCount' },
    { title: '动后实物数量', width: 120, dataIndex: 'aftstockCount' },
    { title: '流水生成时间', width: 150, dataIndex: 'updateTime' },
    { title: '备注', width: 150, dataIndex: 'note' },
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
        <Form
          className="ant-advanced-form"
          layout="inline"
          form={form}
          initialValues={{ createTime: [moment().subtract(1, 'month'), moment()] }}
        >
          <Form.Item name="opt" label="流水类型">
            <Select showSearch style={{ width: 200 }} placeholder="流水类型">
              <Select.Option value="" key={'全部'}>
                全部
              </Select.Option>
              {[
                { id: 2, name: '清除占用' },
                { id: 1, name: '释放' },
                { id: 3, name: '占用' },
              ].map((item: any) => (
                <Select.Option value={item.id} key={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="origin" label="关联单据来源">
            <Select showSearch style={{ width: 200 }} placeholder="关联单据来源">
              <Select.Option value="" key={'全部'}>
                全部
              </Select.Option>
              {[{ id: 'OMS', name: 'OMS-订单' }].map((item: any) => (
                <Select.Option value={item.id} key={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="skuCode" label="SKU号">
            <Input placeholder="请输入SKU号" />
          </Form.Item>
          <Form.Item name="skuName" label="商品名称">
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          {!fold && (
            <>
              <Form.Item name="accurate" valuePropName="checked" label="">
                <Checkbox>精确匹配</Checkbox>
              </Form.Item>
              <Form.Item name="bizStatus" label="业务状态">
                <Select showSearch style={{ width: 200 }} placeholder="发生时业务状态">
                  <Select.Option value="">全部</Select.Option>
                  {[
                    // { id: 11, name: '正常销售' },
                    // { id: 12, name: '缺销售价格' },
                    // { id: 21, name: '限量销售' },
                    // { id: 22, name: '暂停销售' },
                    // { id: 31, name: '尾货待售' },
                    // { id: 32, name: '业务终止' },
                    // { id: 60, name: '单笔询价' },
                    { id: 10, name: '(10)缺价格&销售单位' },
                    { id: 11, name: '(11)正常销售' },
                    { id: 12, name: '(12)缺价格' },
                    { id: 13, name: '(13)缺销售单位' },
                    { id: 30, name: '(30)缺价格&销售单位' },
                    { id: 31, name: '(31)尾货待售' },
                    { id: 32, name: '(32)缺价格' },
                    { id: 33, name: '(33)缺销售单位' },
                    { id: 35, name: '(35)业务终止' },
                    { id: 50, name: '(50)停止销售' },
                    { id: 60, name: '(60)单笔询价' },
                  ].map((item: any) => (
                    <Select.Option value={item.id} key={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="createTime" label="时间范围" className="self-time">
                <RangePicker format="YYYY-MM-DD" allowClear={false} />
              </Form.Item>
            </>
          )}
          <Form.Item className="btn-search" style={{ marginLeft: '40px' }} colon={false}>
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
        scroll={{ x: 200, y: yClient }}
        bordered
        size="small"
        request={async (params) => {
          const searchParams = form.getFieldsValue(true);
          if (startPage) {
            params.current = 1;
            // params.pageSize = 20;
          }
          searchParams.startTime =
            moment(searchParams.createTime[0]).format('YYYY-MM-DD') + ' 00:00:00';
          searchParams.endTime =
            moment(searchParams.createTime[1]).format('YYYY-MM-DD') + ' 23:59:59';
          searchParams.curPage = params.current;
          searchParams.pageSize = params.pageSize;
          // const res = await getStockLogs(searchParams);
          // if (res.errCode === 200) {
          //   return Promise.resolve({
          //     data: res.data?.dataList,
          //     total: res.data?.totalCount,
          //     success: true,
          //   });
          // } else {
          //   Modal.error({ title: res.errMsg });
          //   return Promise.resolve([]);
          // }
        }}
        options={{ reload: false, density: false }}
        rowKey="sid"
        search={false}
        tableAlertRender={false}
        actionRef={ref}
        defaultSize="small"
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
          showQuickJumper: true,
        }}
      />
    </div>
  );
};

// export default Using;
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={location.pathname} saveScrollPosition="screen">
    <Using />
  </KeepAlive>
);
