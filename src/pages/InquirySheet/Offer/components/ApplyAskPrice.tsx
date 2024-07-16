/* eslint-disable @typescript-eslint/no-unused-expressions */

import { ProFormText } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Card, Col, InputNumber, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
// import { NumStatus } from '../../contants';
import { fieldLabels } from '../const';
import './index.less';

interface ApplyAdjustFreightProps {
  detail: Record<any, any>;
  selectedRowKeys: any;
  selectedRow: any;
  onSetDetail?: (record: any) => void;
  setSelectedRowKeys?: (record: any) => void;
  setSelectedRow?: (record: any) => void;
  setData?: (record: any) => void;
}

type TableListItem = Record<any, any>;

const ApplyAdjustFreight: React.FC<ApplyAdjustFreightProps> = ({
  detail = {} as any,
  onSetDetail,
  setSelectedRowKeys,
  setSelectedRow,
  selectedRowKeys,
}: any) => {
  // const formRef = useRef<any>();
  // const ref = useRef<ActionType>();
  // const [form] = Form.useForm();
  // console.log(detail, '.....dd..d.d.d..d.');

  // const lists = detail && detail?.sid && JSON.stringify(detail)
  // const q = JSON.parse(lists)
  // const [timeStamp, setTimeStamp] = useState<any>(1);
  const tableRef: any = useRef();
  const [list] = useState<any>(detail?.quotationLineRespVoPage?.list);
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      arr.push(element.quotLineId);
    }
    setSelectedRowKeys && setSelectedRowKeys(arr);
  }, [list]); //?刚进入页面的时候，默认所有都是选中
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '#',
      width: 50,
      dataIndex: 'index',
      valueType: 'index',
      fixed: 'left',
    },
    {
      title: 'SKU号',
      width: 120,
      dataIndex: 'sku',
      fixed: 'left',
    },
    {
      title: '产品名称',
      width: 150,
      dataIndex: 'productNameZh', //name
    },
    // {
    //   title: '转订单状态',
    //   width: 120,
    //   dataIndex: 'lineStatus',
    //   render: (_, record: any) => NumStatus[record.lineStatus],
    // },
    // {
    //   title: 'SKU名称',
    //   width: 120,
    //   dataIndex: 'skuName',
    // },
    {
      title: '报价数量',
      width: 120,
      dataIndex: 'qty',
    },
    {
      title: '含税面价',
      width: 120,
      dataIndex: 'listPrice',
    },
    {
      title: '原成交价含税',
      width: 120,
      dataIndex: 'salesPrice',
    },
    {
      title: <div style={{ color: 'red' }}>销售期望成交价含税</div>,
      width: 180,
      dataIndex: 'salesExpectPrice',
      shouldCellUpdate: () => {
        return true;
      },
      render: (_, record) => {
        return (
          <InputNumber
            min={0}
            className="salesExpectPrice"
            value={record.salesExpectPrice}
            disabled={
              record.secondInquiryStatus !== 0 || !selectedRowKeys.includes(record.quotLineId)
            }
            onChange={(val) => {
              record.salesExpectPrice = val;
              // const rowDom = document.querySelectorAll('.cust-table .ant-table-row')[record.index];
              // const salesExpectPriceNet: any = rowDom.querySelector('.salesExpectPriceNet .ant-input-number-input');
              // console.log(salesExpectPriceNet, '////////');
              // salesExpectPriceNet.val = Number(record.salesExpectPrice / (1 + 0.13)).toFixed(2);
              // 改写数组
              record.salesExpectPriceNet = Number(record.salesExpectPrice / (1 + 0.13)).toFixed(2);
              // const newList = JSON.parse(JSON.stringify(list))
              console.log(record, '????????????????');

              onSetDetail && onSetDetail(record);
              // setList(newList.map((io: any) => {
              //   if (io.quotLineId === record.quotLineId) {
              //     io = record
              //   }
              //   return io
              // }))
            }}
          />
        );
      },
    },
    {
      title: <div style={{ color: 'red' }}>销售期望成交价未税</div>,
      width: 180,
      dataIndex: 'salesExpectPriceNet',
      render: (_, record) => {
        return (
          <InputNumber
            min={0}
            className="salesExpectPriceNet"
            value={record.salesExpectPriceNet}
            // disabled={
            //   record.secondInquiryStatus == 0
            //     ? false
            //     : true || selectedRowKeys.includes(record.quotLineId)
            // }
            disabled={
              record.secondInquiryStatus !== 0 || !selectedRowKeys.includes(record.quotLineId)
            }
            onChange={(val) => {
              record.salesExpectPriceNet = val;
              // const rowDom = document.querySelectorAll('.cust-table .ant-table-row')[record.index];
              // const salesExpectPrice: any = rowDom.querySelector('.salesExpectPrice');
              // salesExpectPrice.innerHTML = Number(record.salesExpectPriceNet * (1 + 0.13)).toFixed(2);
              // 改写数组
              record.salesExpectPrice = Number(record.salesExpectPriceNet * (1 + 0.13)).toFixed(2);
              // const newList = JSON.parse(JSON.stringify(list))
              onSetDetail && onSetDetail(record);

              // setList(newList.map((io: any) => {
              //   if (io.quotLineId === record.quotLineId) {
              //     io = record
              //   }
              //   return io
              // }))
            }}
          />
        );
      },
    },
    // {
    //   title: '行小计',
    //   width: 100,
    //   dataIndex: 'totalAmount',
    // },
    // {
    //   title: '小计折扣',
    //   width: 100,
    //   dataIndex: 'totalDiscount',
    // },
    // {
    //   title: '关联需求单号',
    //   dataIndex: 'inquiryCode',
    //   width: 100,
    // },
    // {
    //   title: '关联报价单号',
    //   dataIndex: 'srcQuotCode',
    //   width: 100,
    // },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  const rowSelection: any = {
    type: 'checkbox',
    selectedRowKeys,
    onChange: (rowKeys: any, selectedRows: any) => {
      setSelectedRow(selectedRows);
      setSelectedRowKeys(rowKeys);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.sku === 'S00001', // Column configuration not to be checked
    }),
  };
  return (
    <>
      <div className="form-content-search edit" id="applyAdjustFreight">
        <div className="has-gridForm">
          <Card title="报价单信息" bordered={false} headStyle={{ fontSize: '14px' }}>
            <Row gutter={24}>
              <Col span={8}>
                <ProFormText
                  labelAlign="left"
                  label={fieldLabels.offerCode}
                  name="quotCode"
                  disabled
                  initialValue={detail.quotCode}
                  labelCol={{ span: 8 }}
                />
              </Col>
              <Col span={8}>
                <ProFormText
                  labelAlign="left"
                  label={fieldLabels.customerName}
                  name="customerName"
                  disabled
                  labelCol={{ span: 8 }}
                  initialValue={detail.customerName}
                />
              </Col>
              <Col span={8}>
                <ProFormText
                  labelAlign="left"
                  label={fieldLabels.salesName}
                  name="salesName"
                  initialValue={detail.salesName}
                  disabled
                  labelCol={{ span: 8 }}
                />
              </Col>
            </Row>
          </Card>
          <Card title=" " bordered={false} headStyle={{ fontSize: '14px' }}>
            <ProTable<any>
              bordered
              size="small"
              rowSelection={rowSelection}
              tableAlertRender={false}
              className="cust-table"
              columns={columns}
              // dataSource={list}
              request={() => {
                return Promise.resolve({
                  data: list,
                  success: true,
                });
              }}
              actionRef={tableRef}
              pagination={false}
              options={false}
              search={false}
              rowKey={`quotLineId`}
              scroll={{ x: 200, y: 600 }}
              headerTitle={
                <div className="SecondTitle">
                  <h3>选择二次询价明细</h3>
                  <h4>Tips:提交申请后，当前报价单会取消，无需二次询价的行，请不要选中</h4>
                </div>
              }
            />
          </Card>
        </div>
      </div>
    </>
  );
};

export default ApplyAdjustFreight;
