import React, { useState } from 'react';
import { Button, Drawer, Space } from 'antd';
import ReceptionDetail from './ReceptionDetail';

interface detailInfo {
  receptionCode?: any;
}
const Index: React.FC<detailInfo> = (props: any) => {
  const { receptionCode } = props;
  const SideBar: any = document.getElementsByClassName('ant-layout-sider');
  const [drawerWidth, setDrawerWidth] = useState(window.innerWidth - 208);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  // const InfoRef: any = useRef();

  function detailDrawerOpen() {
    const sideWidth = SideBar[0]?.clientWidth || 0;
    setDrawerWidth(window.innerWidth - sideWidth);
    setIsDrawerVisible(true);
  }
  function detailDrawerClose() {
    setIsDrawerVisible(false);
  }

  return (
    <span className="form-span blue">
      <Space
        className="blue"
        style={{ color: ' #1890ff', cursor: 'pointer' }}
        onClick={() => {
          detailDrawerOpen();
        }}
      >
        {receptionCode}
      </Space>
      <Drawer
        className="DrawerContent ReceptionDetailDrawer"
        width={drawerWidth}
        placement="right"
        key={'接待单'}
        destroyOnClose={true}
        title={[
          <span key={'接待单编号'}>接待单号: {receptionCode}</span>,
          <p
            key={'接待单详情'}
            className="tipsP"
            style={{ marginBottom: '-10px', marginTop: 5, color: '#777' }}
            ref={(node) => {
              if (node) {
                node.style.setProperty('font-size', '12px', 'important');
              }
            }}
          >
            接待单详情
          </p>,
        ]}
        visible={isDrawerVisible}
        onClose={detailDrawerClose}
        extra={
          <Space>
            <Button
              key="close"
              onClick={() => {
                detailDrawerClose();
              }}
            >
              关闭
            </Button>
          </Space>
        }
        footer={[
          // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
          <Button
            key="back"
            onClick={() => {
              detailDrawerClose();
            }}
          >
            关闭
          </Button>,
        ]}
      >
        {isDrawerVisible && (
          <ReceptionDetail receptionCode={receptionCode} key={'Reception Record Detail Perview'} />
        )}
      </Drawer>
    </span>
  );
};
export default Index;
