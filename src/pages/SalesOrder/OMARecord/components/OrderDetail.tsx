import React from 'react';
import { Tabs } from 'antd';
import RelatedProcesses from '@/pages/SalesOrder/components/RelatedProcesses';
import './style.css';
import EditContent from '@/pages/SalesOrder/Order/components/ApplyCancellation/EditContent';
interface detailInfo {
  pageParams?: any;
  record?: any;
  tableReload?: any;
  orderNo?: any;
  defaultData?: any;
  addNewDrawerClose?: any;
  type?: any;
  getSid?: any;
}
// const OrderDetail = ({ tableRowData, orderId, addNewDrawerClose, tableReload }: any) => {
const OrderDetail: React.FC<detailInfo> = (props: any) => {
  const { record, orderNo, defaultData, type, pageParams, getSid } = props;
  const { TabPane } = Tabs;

  return (
    <div id="scroll-content" className="form-content-search tabs-detail hasAbsTabs requestDetail">
      <Tabs defaultActiveKey="1">
        <TabPane tab="订单信息" key="1">
          <EditContent
            orderRecord={record}
            pageParams={pageParams}
            tableReload={props.tableReload}
            orderNo={orderNo}
            defaultData={defaultData}
            addNewDrawerClose={props.addNewDrawerClose}
            type={type}
            getSid={getSid}
          />
        </TabPane>
        <TabPane tab="相关流程" key="2">
          <RelatedProcesses billNo={orderNo} />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default OrderDetail;
