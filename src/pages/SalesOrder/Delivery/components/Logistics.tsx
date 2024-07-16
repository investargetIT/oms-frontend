import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message } from 'antd';
import { useModel } from 'umi';
import Option from './Option';

const Logistics: React.FC<{
  logisticsError?: any;
  receiptDetail?: any;
  logisticsDetail?: any;
}> = (props: any, ref: any) => {
  const { logisticsError, receiptDetail, logisticsDetail } = props;
  const { initialState } = useModel('@@initialState');
  if (logisticsError != '') {
    message.error(logisticsError, 3);
  }
  const signDetailRef = useRef<ActionType>();
  const detailRef = useRef<ActionType>();

  const [yClient, setYClient] = useState(300);
  function reloadtable() {
    signDetailRef?.current?.reload(true);
    detailRef?.current?.reload(true);
  }
  useImperativeHandle(ref, () => ({
    reloadtable,
  }));
  const columns: ProColumns<any>[] = [
    {
      title: '签收单',
      dataIndex: 'url',
      render: (_, record) => {
        return record.url;
      },
    },
    // {
    //   title: '点击预览',
    //   width: 70,
    //   dataIndex: 'url',
    //   render: (_, record) => {
    //     return <Image height={30} width={30} style={{ marginLeft: '15px' }} src={record.url} />;
    //   },
    // },
    {
      title: '操作',
      width: 85,
      render: (_, record) => {
        if (record.url != '') {
          return <Option record={record} key={record.url} />;
        }
        //    const [visible, setVisible] = useState(false);
        //    return (
        // <Space>
        // 	<Button
        // 		size="small"
        // 		key={'下载'}
        // 		type="link"
        // 		onClick={() => window.open(`${record.url}?token=${Cookies.get('ssoToken')}`)}
        // 	>
        // 		下载
        // 	</Button>,
        // 	<Button size="small" key={'查看'} type="link" onClick={() => setVisible(true)}>
        // 		查看
        // 	</Button>,
        // 	<Image
        // 		width={10}
        // 		key={index}
        // 		style={{ display: 'none' }}
        // 		src={record.url}
        // 		preview={{
        // 			visible,
        // 			src: record.url,
        // 			onVisibleChange: (value) => {
        // 				setVisible(value);
        // 			},
        // 		}}
        // 	/>
        // </Space>
        //    )
      },
      fixed: 'right',
    },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });

  const columns_logistics: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
      fixed: 'left',
    },
    {
      title: '万物集物流状态',
      width: 150,
      dataIndex: 'code',
      render: (_, record) => {
        if (record.code === '1') {
          return '已揽收';
        } else if (record.code === '2') {
          return '准备发出';
        } else if (record.code === '3') {
          return '已发出';
        } else if (record.code === '4') {
          return '到达';
        } else if (record.code === '5') {
          return '派送';
        } else if (record.code === '6') {
          return '签收';
        } else if (record.code === '7') {
          return '拒收';
        } else if (record.code === '10') {
          return '其他';
        }
      },
    },
    {
      title: '在途时间',
      width: 150,
      dataIndex: 'date',
      valueType: 'dateTime',
    },
    {
      title: '在途详细',
      width: 280,
      dataIndex: 'details',
    },
    {
      title: '在途城市',
      width: 180,
      dataIndex: 'place',
    },
  ];
  columns_logistics.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 550);
  }, [initialState?.windowInnerHeight]);
  return (
    <div className="form-content-search tabs-detail leftTd">
      <h4 className="formTitle">物流签收单明细</h4>
      <div className="noPaddingTable">
        <ProTable<any>
          columns={columns}
          scroll={{ x: 100, y: yClient }}
          bordered
          size="small"
          options={{ reload: false, density: false }}
          request={() => {
            return Promise.resolve(receiptDetail);
          }}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            // showTotal: total => `共有 ${total} 条数据`,
            showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
          }}
          rowKey={() => Math.random()}
          search={false}
          toolBarRender={false}
          tableAlertRender={false}
          defaultSize="small"
          actionRef={signDetailRef}
        />
      </div>

      <h4 className="formTitle">物流明细</h4>
      <div className="noPaddingTable">
        <ProTable<any>
          columns={columns_logistics}
          scroll={{ x: 100 }}
          bordered
          size="small"
          options={{ reload: false, density: false }}
          request={() => {
            return Promise.resolve(logisticsDetail);
          }}
          pagination={false}
          rowKey={() => Math.random()}
          search={false}
          toolBarRender={false}
          tableAlertRender={false}
          defaultSize="small"
          actionRef={detailRef}
        />
      </div>
    </div>
  );
};
export default forwardRef(Logistics);
