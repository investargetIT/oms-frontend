import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Button, Space, Drawer, Tag } from 'antd';
import './index.less';
import Info from './Info/Info';
import { detail } from '@/services/afterSales';

import { history } from 'umi';
const MyDrawer = ({}: any, ref: any) => {
  const drawerWidth = window.innerWidth;
  // const key = new Date().getTime();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Record, setRecord]: any = useState();
  const [key, setKey]: any = useState();
  const [Detail, setDetail]: any = useState();

  useEffect(() => {
    if (history?.location?.state?.data) {
      const fn = async () => {
        const res = await detail(history?.location?.state?.data);
        const {
          data: { sampleVO },
        } = res;
        setDetail(sampleVO);
      };
      fn();
      setIsModalVisible(true);
      const k = Math.random();
      setKey(k);
      setRecord(history.location.state.data);
    }
  }, []);

  const open = async (e: any) => {
    const k = Math.random();
    setKey(k);
    setIsModalVisible(true);
    setRecord(e);
  };
  const close = () => {
    setIsModalVisible(false);
    history.goBack();
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
          <span key={'借样申请详情'}>借样申请编号: {Detail?.sampleNo}</span>,
          <Tag key={'申请状态'} color="gold" style={{ marginLeft: 10 }}>
            {Detail?.applyStatusName}
          </Tag>,
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
          id={Record}
          // pageParams={pageParams}
          key={'Order Detail Perview'}
        />
      </Drawer>
    </div>
  );
};
export default forwardRef(MyDrawer);
