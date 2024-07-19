import { getStockInfos, getStockTotal } from '@/services/Stock';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Space, Select, Checkbox, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import { useModel, history } from 'umi';
import './index.less';
import ProductLine from '@/pages/components/ProductLine';
import Segment from '@/pages/components/Segment';
import { colLimit } from '@/services';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
const Available: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const ref = useRef<ActionType>();
  const [form] = Form.useForm();
  const [yClient, setYClient] = useState(950);
  const [productCode, setProductCode]: any = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [totalParams, setTotalParams]: any = useState({});
  const [startPage, setStartPage] = useState(false);
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
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      fixed: 'left',
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    { title: 'SKU号', width: 100, dataIndex: 'skuCode', fixed: 'left' },
    { title: '计价单位', width: 160, dataIndex: 'chargeUnit' },
    { title: '物料号', width: 160, dataIndex: 'itemCode' },
    { title: '销售包装单位数量', width: 160, dataIndex: 'stockNum' },
    {
      title: '业务状态编码',
      width: 100,
      dataIndex: 'bizStatus',
      fixed: 'left',
    },
    {
      title: '业务状态说明',
      width: 120,
      dataIndex: 'bizStatus',
      renderText: (text: any, recorder: any) => <span>{statusList[recorder.bizStatus]}</span>,
      fixed: 'left',
    },
    { title: '商品名称', width: 260, dataIndex: 'skuName' },
    // { title: '库存类型', width: 150, dataIndex: 'reqTypeStr' },
    { title: '产品线', width: 120, dataIndex: 'productLine' },
    { title: 'Segment', width: 120, dataIndex: 'segment' },
    { title: 'Family', width: 150, dataIndex: 'familyName' },
    { title: 'Category', width: 120, dataIndex: 'categoryName' },
    { title: '可售数量', width: 150, dataIndex: 'afsCount' },
    { title: '业务占用数量', width: 120, dataIndex: 'occupyCount' },
    { title: '实物库存数量', width: 120, dataIndex: 'stockCount' },
    // {
    //   title: '分仓实物库存',
    //   children: [
    //     {
    //       title: '华东仓',
    //       dataIndex: 'age1',
    //       key: 'age1',
    //       width: 150,
    //       sorter: (a, b) => a.age - b.age,
    //     },
    //     {
    //       title: '华北仓',
    //       dataIndex: 'age2',
    //       key: 'age2',
    //       width: 150,
    //       sorter: (a, b) => a.age - b.age,
    //     },
    //     {
    //       title: '华南仓',
    //       dataIndex: 'age3',
    //       key: 'age3',
    //       width: 150,
    //       sorter: (a, b) => a.age - b.age,
    //     },
    //     {
    //       title: '浦东危险品仓',
    //       dataIndex: 'age7',
    //       key: 'age7',
    //       width: 150,
    //       sorter: (a, b) => a.age - b.age,
    //     },
    //   ],
    // },
    // {
    //   title: '分仓在途库存',
    //   children: [
    //     {
    //       title: '华东仓',
    //       dataIndex: 'age4',
    //       key: 'age4',
    //       width: 150,
    //       sorter: (a, b) => a.age - b.age,
    //     },
    //     {
    //       title: '华北仓',
    //       dataIndex: 'age5',
    //       key: 'age5',
    //       width: 150,
    //       sorter: (a, b) => a.age - b.age,
    //     },
    //     {
    //       title: '华南仓',
    //       dataIndex: 'age6',
    //       key: 'age6',
    //       width: 150,
    //       sorter: (a, b) => a.age - b.age,
    //     },
    //     {
    //       title: '浦东危险品仓',
    //       dataIndex: 'age8',
    //       key: 'age8',
    //       width: 150,
    //       sorter: (a, b) => a.age - b.age,
    //     },
    //   ],
    // },
    { title: '库存更新时间', width: 180, dataIndex: 'updateTime' },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  const productChange = (val: any) => {
    setProductCode(val);
  };
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 320);
  }, [initialState?.windowInnerHeight]);
  return (
    <div className="omsAntStyle">
      <div className="form-content-search">
        <Form className="ant-advanced-form" layout="inline" form={form}>
          <Form.Item name="skuCode" label="SKU号">
            <Input.TextArea placeholder="请输入SKU号,多个请逗号表示" />
          </Form.Item>
          <Form.Item name="skuName" label="商品名称">
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item name="accurate" valuePropName="checked" label="">
            <Checkbox>精确匹配</Checkbox>
          </Form.Item>
          <Form.Item name="gtZero" valuePropName="checked" label="">
            <Checkbox>过滤可用量为0的商品</Checkbox>
          </Form.Item>
          {!fold && (
            <>
              <Form.Item name="productLineId" label="产品线" className="minLabel">
                <ProductLine
                  isEdit={false}
                  onChange={productChange}
                  onType={(val: any) => {
                    form.setFieldsValue({
                      segmentId: '',
                    });
                    if (val == 0) {
                      console.log(val);
                    }
                  }}
                />
              </Form.Item>
              <Form.Item name="segmentId" label="Segment">
                <Segment
                  isEdit={false}
                  parentId={productCode}
                  onType={(val: any, rate: any) => {
                    if (val == 0) {
                      console.log(rate);
                    }
                  }}
                />
              </Form.Item>
              <Form.Item name="bizStatus" label="业务状态">
                <Select showSearch style={{ width: 200 }} placeholder="业务状态">
                  <Select.Option value="" key="全部">
                    全部
                  </Select.Option>
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
                  setStartPage(true);
                  ref.current?.reload(true);
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
          if (searchParams.skuCode) {
            searchParams.codes = searchParams.skuCode.replaceAll(' ', '').split(',');
          }
          if (startPage) {
            params.current = 1;
            // params.pageSize = 20;
          }
          searchParams.curPage = params.current;
          searchParams.pageSize = params.pageSize;
          // getStockTotal().then((resd: any) => {
          //   if (resd.errCode === 200) setTotalParams(resd.data);
          // });
          // const res = await getStockInfos(searchParams);
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
        rowKey="skuCode"
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
        headerTitle={
          <Space style={{ opacity: 0 }}>
            <div>总计业务占用数量:{totalParams.occupyCount}</div>
            <div>总计实物数量:{totalParams.stockCount}</div>
            <div>总计可售数量:{totalParams.stockCount - totalParams.occupyCount}</div>
          </Space>
        }
      />
    </div>
  );
};
// export default Available;
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={location.pathname} saveScrollPosition="screen">
    <Available />
  </KeepAlive>
);
