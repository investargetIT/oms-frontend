import { useState, forwardRef, useImperativeHandle } from 'react';
import { Button, Space, Drawer, Tag } from 'antd';
import './index.less';
import Info from './Info/Info';
const MyDrawer = ({ pageParams }: any, ref: any) => {
  const drawerWidth = window.innerWidth;
  // const key = new Date().getTime();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Record, setRecord]: any = useState();
  const [key, setKey]: any = useState();

  const open = async (e: any) => {
    const k = Math.random();
    setKey(k);
    setIsModalVisible(true);
    setRecord(e);
  };
  const close = () => {
    setIsModalVisible(false);
  };
  useImperativeHandle(ref, () => ({
    openDrawer: open,
    closeDrawer: close,
  }));
  return (
    <div>
      <Drawer
        className="withAnchorDrawer DrawerForm OrderDrawer"
        width={drawerWidth}
        placement="right"
        key={key}
        title={[
          <span key={'订单编号'}>订单编号: {Record?.sampleOrderNo}</span>,
          <Tag key={'订单状态'} color="gold" style={{ marginLeft: 10 }}>
            {Record?.sampleOrderStautsName}
          </Tag>,
          <p
            key={'订单类型'}
            className="tipsP"
            style={{ marginBottom: '-10px', marginTop: 5, color: '#777' }}
            ref={(node) => {
              if (node) {
                node.style.setProperty('font-size', '12px', 'important');
              }
            }}
          >
            订单类型:
            <strong>{'借样订单'}</strong>
          </p>,
        ]}
        visible={isModalVisible}
        onClose={close}
        extra={
          <Space>
            <Button onClick={close}>关闭</Button>
          </Space>
        }
      >
        <Info
          id={Record?.sampleOrderNo}
          pageParams={pageParams}
          key={'Order Detail Perview'}
          row={Record}
        />
      </Drawer>
    </div>
  );
};
export default forwardRef(MyDrawer);
