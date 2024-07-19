import React from 'react';
import ProTable from '@ant-design/pro-table';
import { Col, Row } from 'antd';
interface BasicInfoProps {
  splitPreview?: Record<any, any>;
}
const InvoicePreview: React.FC<BasicInfoProps> = ({ splitPreview = {} as any }) => {
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'index',
      fixed: true,
      width: 50,
      render: (text: any, record: any, index: any) => index + 1,
    },
    { title: 'SKU', dataIndex: 'sku', width: 120 },
    { title: '开票数量', dataIndex: 'qty', width: 100 },
    { title: '开票小计含税 ', dataIndex: 'splitSubtotalPrice', width: 150 },
    { title: '面价', dataIndex: 'facePrice', width: 100 },
    { title: '销售单位', dataIndex: 'salesUnit', width: 100 },
    { title: '产品名称', dataIndex: 'productName', width: 200 },
    { title: '品牌', dataIndex: 'brandName', width: 100 },
    { title: '制造商型号', dataIndex: 'mfgSku', width: 100 },
    { title: '供应商型号', dataIndex: 'supplierNo', width: 260 },
    { title: '物理单位', dataIndex: 'physicsUnit', width: 100 },
    { title: '客户物料号', dataIndex: 'customerSku', width: 120 },
    { title: '客户需求行号', dataIndex: 'customerItemNo', width: 260 },
    {
      title: '是否JV',
      width: 100,
      render(_: any, record: { jvFlag: any }) {
        return <span>{record.jvFlag ? '是' : '否'}</span>;
      },
    },
    { title: 'JV公司', dataIndex: 'jvCompanyName', width: 260 },
  ];
  return (
    <>
      {splitPreview.map((item: any) => {
        return (
          <>
            <Row gutter={24} style={{ marginBottom: '-25px' }}>
              <Col span={6}>{item?.invoiceName}</Col>
            </Row>
            <div className="Detail">
              <table className="amountTable" cellSpacing="0" data-content="币种：CNY">
                <tbody>
                  <tr>
                    <th>本张开票金额总计含税:</th>
                    <td>{item?.totalAmount}</td>
                  </tr>
                </tbody>
              </table>
              <div className="detail_table_mod" style={{ marginTop: '10px' }}>
                <ProTable<any>
                  columns={columns}
                  dataSource={item?.lineList}
                  rowKey="sid"
                  search={false}
                  toolBarRender={false}
                  tableAlertRender={false}
                  defaultSize="small"
                />
              </div>
            </div>
          </>
        );
      })}
    </>
  );
};
export default InvoicePreview;
