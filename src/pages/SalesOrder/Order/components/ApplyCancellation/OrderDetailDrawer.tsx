import React, { useState, useRef, useEffect } from 'react';
import { Button, Drawer, Space, Tag } from 'antd';
import Info from '@/pages/SalesOrder/Order/components/Info/Info';
import EditModal from '@/pages/SalesOrder/Order/components/EditModal';
import LogInfo from '@/pages/components/LogInfo';
import { getCategory } from '@/services/SalesOrder';
interface detailInfo {
  pageParams?: any;
  record?: any;
  orderNo?: any;
}
const Index: React.FC<detailInfo> = (props: any) => {
  const { orderNo, record, pageParams } = props;
  const [isModalVisible, setIsModalVisible] = useState(false); //?详情抽屉
  const InfoRef: any = useRef();
  const EditRef: any = useRef();
  const [logVisible, setLogVisible]: any = useState(false);
  const drawerWidth = window.innerWidth;
  const [category, setCategory]: any = useState('普通销售订单');
  useEffect(() => {
    getCategory(orderNo).then((res: any) => {
      if (res.errCode === 200) {
        setCategory(res?.data?.category);
      }
    });
  }, [orderNo]);

  function detailDrawerClose() {
    setIsModalVisible(false);
  }
  function inverted() {
    InfoRef?.current?.inverteData();
  }
  const openLog = () => {
    setLogVisible(true);
  };
  const editRemark = () => {
    EditRef?.current?.open(orderNo);
  };

  return (
    <>
      <span className="form-span blue">
        <Space
          className="blue"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setIsModalVisible(true);
            inverted();
          }}
        >
          {orderNo}
        </Space>
      </span>
      <Drawer
        className="withAnchorDrawer DrawerContent OrderDrawer"
        width={drawerWidth}
        placement="right"
        key={'查看订单详情'}
        destroyOnClose={true}
        title={[
          <span key={'订单编号'}>订单编号: {orderNo}</span>,
          <Tag key={'订单状态'} color="gold" style={{ marginLeft: 10 }}>
            {record?.orderStatus}
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
            <strong>{category}</strong>
          </p>,
        ]}
        visible={isModalVisible}
        onClose={detailDrawerClose}
        extra={
          <>
            <Space>
              <Button className="editButton" onClick={editRemark}>
                编辑备注
              </Button>
            </Space>{' '}
            <Space>
              <Button type="link" onClick={openLog}>
                查看操作日志
              </Button>
            </Space>
          </>
        }
        footer={[
          // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
          // {btnStatus=='通过'}
          <Button key="back" onClick={detailDrawerClose}>
            关闭
          </Button>,
        ]}
      >
        <Info
          ref={InfoRef}
          id={orderNo}
          isModalVisible={isModalVisible}
          pageParams={pageParams}
          key={'Order Detail Perview'}
          detailDrawerClose={detailDrawerClose}
          row={record}
        />
        <LogInfo
          id={record?.sid}
          title={'销售订单' + orderNo + ' 操作日志'}
          sourceType={'40'}
          visible={logVisible}
          closed={() => {
            setLogVisible(false);
          }}
        />
      </Drawer>
      <EditModal ref={EditRef} inverted={inverted} />
    </>
  );
};
export default Index;
