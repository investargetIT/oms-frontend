import React, { useState, useEffect } from 'react';
import { Table, Drawer } from 'antd';
import { logList } from '@/services';
const LogInfo: React.FC<{
  showNo?: string;
  id: string;
  sourceType: string;
  title?: string;
  visible: boolean;
  closed: any;
}> = (props: any) => {
  const [data, setData]: any = useState([]);
  useEffect(() => {
    if (props.visible) {
      logList({ sourceId: props.id, sourceType: props.sourceType }).then((res: any) => {
        if (res.errCode === 200) {
          setData(res.data);
        }
      });
    }
  }, [props.visible]);
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'index',
      fixed: true,
      width: 50,
      render: (text: any, record: any, index: any) => index + 1,
    },
    { title: '操作时间', dataIndex: 'createTime', width: 150, ellipse: true },
    { title: '操作人', dataIndex: 'createName', width: 150, ellipse: true },
    { title: '操作内容', dataIndex: 'opContent', width: 350, ellipse: true },
  ];
  return (
    <Drawer
      title={props.title}
      placement="right"
      destroyOnClose
      width={800}
      zIndex={1001}
      onClose={() => {
        if (props.closed) {
          props.closed();
        }
      }}
      visible={props.visible}
    >
      <div className="base-info">
        {props.sourceType === '20' && <div>需求单号: {props.showNo}</div>}
        {props.sourceType === '21' && <div>任务ID: {props.id}</div>}
        {props.sourceType === '40' && <div>销售单ID: {props.id}</div>}
        <Table columns={columns} dataSource={data} rowKey={'sid'} size="small" />
      </div>
    </Drawer>
  );
};
export default LogInfo;
