import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Button, Space, Drawer, Tag, message } from 'antd';
import './index.less';
import Info from './Info/Info';
import { history } from 'umi';
import { queryLoanDetails } from '@/services/loan';
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
        // const res = await queryLoanDetails(history?.location?.state?.data);
        // if (res.errCode === 200) {
        //   const {
        //     data: { applyVo },
        //   } = res;
        //   setDetail(applyVo);
        // } else {
        //   message.error(res.errMsg);
        // }
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
          <span key={'借贷申请详情'}>借贷申请编号: {Detail?.loanApplyNo}</span>,
          <Tag key={'申请状态'} color="gold" style={{ marginLeft: 10 }}>
            {Detail?.loanApplyStatusName}
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
