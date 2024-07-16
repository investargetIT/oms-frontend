import React, { useState } from 'react';
import { Button, Modal, message, Drawer } from 'antd';
import { preCheck } from '@/services/SalesOrder';
import AddNew from '../ApplyModification/AddNew';

// interface detailInfo {
//   tableReload: any;
//   selectOrder?: any;
// }
// const ApplyModification: React.FC<detailInfo> = (props: any, Ref: any) => {
const ApplyModification = (props: any) => {
  const { selectOrder } = props;
  // const [load, setLoad]: any = useState(false);
  // const [confirmLoading, setConfirmLoading]: any = useState(false);

  // const [orderData, setOrderData]: any = useState({});

  const SideBar: any = document.getElementsByClassName('ant-layout-sider');
  const [drawerWidth, setDrawerWidth] = useState(window.innerWidth - 208);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const addNewDrawerOpen = () => {
    setIsDrawerVisible(true);
  };

  const addNewDrawerClose = () => {
    setIsDrawerVisible(false);
  };

  const handleOk = async () => {
    if (JSON.stringify(selectOrder) == '[]') {
      message.error('请至少选择一个订单！', 3);
    } else {
      const orderNo = selectOrder[0].orderNo;
      const res = await preCheck(orderNo);
      if (res.errCode == 200 && res?.data?.success) {
        if (orderNo === 0) {
          //此为模拟效果 需判断订单是否锁定
          Modal.warning({
            title: '本订单已锁定！',
            content: (
              <>
                <p>请重新选择订单！</p>
              </>
            ),
            okText: '知道了',
          });
          // setConfirmLoading(false);
        } else {
          const sideWidth = SideBar[0]?.clientWidth || 0;
          setDrawerWidth(window.innerWidth - sideWidth);
          addNewDrawerOpen();
        }
      } else {
        return message.error('订单尚未同步Sap，请去Sap同步订单');
      }
    }
  };

  return (
    <span>
      <Button key="申请修改" type="primary" ghost onClick={handleOk}>
        申请修改
      </Button>
      <Drawer
        className="DrawerContent"
        width={drawerWidth}
        key={'新增订单修改申请Drawer'}
        title={[<span key={'新增订单修改申请'}>新增订单修改申请</span>]}
        visible={isDrawerVisible}
        onClose={() => {
          setIsDrawerVisible(false);
        }}
        extra={
          <>
            <Button key="close" onClick={addNewDrawerClose}>
              关闭
            </Button>
          </>
        }
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={addNewDrawerClose}>
            关闭
          </Button>,
        ]}
      >
        <AddNew
          addNewDrawerClose={addNewDrawerClose}
          tableReload={props.tableReload}
          orderNo={selectOrder[0]?.orderNo}
          selectOrder={selectOrder}
        />
      </Drawer>
    </span>
  );
};
export default ApplyModification;
