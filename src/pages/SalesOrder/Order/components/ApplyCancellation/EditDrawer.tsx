import React from 'react';
import { Button, Drawer, Modal, message, Tag, Space, Tabs } from 'antd';
import EditContent from './EditContent';
import { cancelAndReleaseOrder } from '@/services/SalesOrder';
import RelatedProcesses from '@/pages/SalesOrder/components/RelatedProcesses';
import './style.css';

interface detailInfo {
  pageParams?: any;
  record?: any;
  tableReload?: any;
  orderNo?: any;
  drawerWidth?: any;
  defaultData?: any;
  isDrawerVisible?: any;
  addNewDrawerClose?: any;
  addNewDrawerOpen?: any;
  type?: any;
  DrawerTitle?: any;
  getSid?: any;
}
const Index: React.FC<detailInfo> = (props: any) => {
  const {
    record,
    orderNo,
    drawerWidth,
    defaultData,
    isDrawerVisible,
    type,
    DrawerTitle,
    pageParams,
    getSid,
  } = props;

  // const tabItems:any = [
  //   { label: '订单信息', key: 'item-1', children: (
  // 		<EditContent
  // 		  orderRecord={record}
  // 		  pageParams={pageParams}
  // 		  tableReload={props.tableReload}
  // 		  orderNo={orderNo}
  // 		  defaultData={defaultData}
  // 		  addNewDrawerClose={props.addNewDrawerClose}
  // 		  type={type}
  // 		  getSid={getSid}
  // 		/>
  // 	)}, // 务必填写 key
  //   { label: '相关流程', key: 'item-2', children: (
  // 		<RelatedProcesses billNo={record.requestNo} />
  // 	)},
  // ];

  const releaseOrder = () => {
    // 走接口 释放订单
    Modal.confirm({
      title: '您确定要取消本次申请吗？',
      // icon: <ExclamationCircleOutlined />,
      content: '您还没有保存本次申请，这将把您之前的操作全部还原。',
      onOk() {
        cancelAndReleaseOrder(getSid)
          .then((res: any) => {
            if (res?.errCode === 200) {
              props.addNewDrawerClose();
              // props.tableReload()
              message.success('本次申请已取消');
            } else {
              message.error(res?.errMsg);
            }
          })
          .finally(() => {
            return;
          })
          .catch((errorInfo) => {
            message.error(errorInfo, 3);
          });
      },
      onCancel() {},
    });
  };

  const closeDrawer = () => {
    if (type == 'add') {
      releaseOrder();
    } else if (type === 'edit' || type === 'view') {
      props.addNewDrawerClose();
    }
  };

  // const [tabKey, setTabKey]: any = useState('tab1');
  const tabChange = (values: any) => {
    // setTabKey(values);
    if (values == '111') {
      console.log(values);
    }
  };

  return (
    <Drawer
      className="DrawerContent"
      width={drawerWidth}
      key={DrawerTitle}
      maskClosable={false}
      title={
        <>
          {type !== 'view' ? (
            <>
              <span key={DrawerTitle}>{DrawerTitle}</span>
              <p
                key={'修改申请说明'}
                className="tipsP"
                style={{ marginBottom: '-10px', marginTop: 5, color: '#999' }}
                ref={(node) => {
                  if (node) {
                    node.style.setProperty('font-size', '12px', 'important');
                  }
                }}
              >
                保存申请时，订单将立即锁定，锁定期间订单不可执行任何操作。此行为会影响订单履约，请谨慎操作！
              </p>
            </>
          ) : (
            <>
              <span key={'修改取消申请编号'}>修改取消申请编号: {record?.requestNo}</span>
              <Tag key={'订单状态'} color="gold" style={{ marginLeft: 10 }}>
                {record?.requestStatusName || '申请审批中'}
              </Tag>
              <p
                key={'申请类型'}
                className="tipsP"
                style={{ marginBottom: '-10px', marginTop: 5, color: '#777' }}
                ref={(node) => {
                  if (node) {
                    node.style.setProperty('font-size', '12px', 'important');
                  }
                }}
              >
                申请类型: <strong>{record?.requestTypeName}</strong>
              </p>
            </>
          )}
        </>
      }
      visible={isDrawerVisible}
      onClose={() => {
        closeDrawer();
        // props.addNewDrawerClose();
      }}
      extra={
        <>
          {type === 'view' && (
            <Space>
              <Button
                key="close"
                onClick={() => {
                  closeDrawer();
                }}
              >
                关闭
              </Button>
            </Space>
          )}
        </>
      }
      destroyOnClose={true}
      footer={[
        <Button
          key="back"
          onClick={() => {
            closeDrawer();
          }}
          style={{ visibility: 'hidden' }}
        >
          关闭
        </Button>,
      ]}
    >
      {type !== 'view' ? (
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
      ) : (
        <div
          id="scroll-content"
          className="form-content-search tabs-detail hasAbsTabs requestDetail requestTabDetail"
        >
          <Tabs defaultActiveKey="tab1" tabPosition={'top'} onChange={tabChange}>
            <Tabs.TabPane tab="订单信息" key="tab1">
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
            </Tabs.TabPane>
            <Tabs.TabPane tab="相关流程" key="tab2">
              <RelatedProcesses billNo={record.requestNo} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      )}
    </Drawer>
  );
};
export default Index;
