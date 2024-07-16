import React from 'react';
import { Tabs } from 'antd';
import CustomerConfig from './CustomerConfig';
import ChannelConfig from './ChannelConfig';
// import { history } from 'umi';
import './style.css';
const Index: React.FC = () => {
  const { TabPane } = Tabs;
  return (
    <div className="pageTabs">
      <Tabs defaultActiveKey="1">
        <TabPane tab="按客户配置" key="1">
          <CustomerConfig />
        </TabPane>
        <TabPane tab="按渠道配置" key="2">
          <ChannelConfig />
        </TabPane>
      </Tabs>
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
