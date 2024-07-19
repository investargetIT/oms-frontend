import Dtitle from '@/pages/components/Dtitle';
import RebackEditPage from '@/pages/SalesOrder/Order/components/AtoBDrawer';
import {
  getHandledWorkflowRequestList4Ofs,
  getMyWorkflowRequestList,
  getToDoWorkflowRequestList,
  cancelOa,
} from '@/services/ApprovalFlow';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Input, message, Space, Tabs, Drawer, Tooltip, Modal, Select } from 'antd';
import Cookies from 'js-cookie';
import { QuestionCircleFilled } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useModel, history } from 'umi';
import SelectCommon from '../../components/SelectCommon';
import WorkerCommon from './WorkerCommon';
import ApplyCheck from '../../InquirySheet/Offer/components/ApplyCheck';
import './index.less';
import { loadAuthMenus } from '@/services/login';
import { queryListDataMap } from '@/services';
const codeList = [
  '54',
  '102',
  '151',
  '159',
  '163',
  '172',
  '180',
  '198',
  '223',
  '183',
  '203',
  '225',
  '255',
];
const Index: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const [archivestatus, setArchivestatus] = useState('2');
  const [lastPath, setLastPath] = useState('doself');
  const [checkVisible, setCheckVisible] = useState(false);
  const [yClient, setYClient] = useState(900);
  const [id, setIds]: any = useState([]);
  const actRef = useRef<ActionType>();
  const applyRef: any = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [approvalStatusList, setApprovalStatusList] = useState<any>([]);
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const showOAdetail = async (render: any) => {
    // 用来校验是否登录
    // const res = await loadAuthMenus();
    // if (res.errCode === 200) {
    //   window.open(`${render.pcurl}&token=${Cookies.get('ssoToken')}`);
    // } else {
    //   message.error('个人用户权限异常，请重新登录!');
    // }
  };
  const showOmsEdit = (render: any) => {
    console.log(render.requestmark);
    if (codeList.includes(render.workflowBaseInfo?.workflowId)) {
      //?54,102,151,159是助力申请的退回, '163','172', '180'新增正式环境
      setIds(render.requestmark);
      setCheckVisible(true);
    } else if (
      //?'123', '152', '153'是csp的退回
      ['123', '152', '153', '167', '118', '254'].includes(render.workflowBaseInfo?.workflowId) &&
      render.requestmark
    ) {
      history.push(`/inquiry/csp-offer/csp-apply/${render.requestmark}?from=need`);
    } else if (['55', '103', '217', '256'].includes(render.workflowBaseInfo?.workflowId)) {
      //?55测试环境的A换B，103是正式环境的A换B
      applyRef.current?.openDrawer(render.requestmark, render, '1');
    }
  };
  const rowSelection: any = {
    type: 'checkbox',
    selectedRowKeys,
    onChange: (selectedKeys: any, selRows: any) => {
      setSelectedRows(selRows);
      setSelectedRowKeys(selectedKeys);
    },
  };

  const drawerWidth = window.innerWidth;
  const columns: any = [
    {
      title: '#',
      dataIndex: 'index',
      valueType: 'index',
      fixed: 'left',
      width: 50,
      render(text: any, record: any, index: any) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'pcurl',
      fixed: 'left',
      width: 150,
      render(text: any, render: any) {
        // return (
        //   <Space>
        //     <Button
        //       size="small"
        //       key={'详情'}
        //       type="link"
        //       onClick={() => {
        //         showOAdetail(render);
        //       }}
        //     >
        //       {' '}
        //       详情{' '}
        //     </Button>
        //     {/* currentnodetype 0 :退回，1或2审批中，3审批结束 */}
        //     {render.currentnodetype === '0' &&
        //       //?54,102,151,是助力申请的退回152,153是csp审批退回
        //       //?55测试环境的A换B，103是正式环境的A换B
        //       //?'123', '152', '153'是csp的退回, 新增'167'测试环境
        //       //?'163'新增测试环境，'172', '180'新增正式环境
        //       (codeList.includes(render.workflowBaseInfo?.workflowId) ||
        //         (['123', '152', '153', '167', '118', '254'].includes(
        //           render.workflowBaseInfo?.workflowId,
        //         ) &&
        //           render.requestmark) ||
        //         ['55', '103', '217', '223', '183', '256'].includes(
        //           render.workflowBaseInfo?.workflowId,
        //         )) && (
        //         <Button
        //           size="small"
        //           key={'编辑'}
        //           type="link"
        //           onClick={() => {
        //             showOmsEdit(render);
        //           }}
        //         >
        //           {' '}
        //           编辑{' '}
        //         </Button>
        //       )}
        //     {render.currentnodetype === '0' &&
        //       codeList.includes(render.workflowBaseInfo?.workflowId) && (
        //         <Button
        //           size="small"
        //           key={'取消'}
        //           type="link"
        //           onClick={() => {
        //             Modal.confirm({
        //               title: (
        //                 <div style={{ fontWeight: '800', color: '#656565' }}>
        //                   确认取消此流程吗？
        //                 </div>
        //               ),
        //               content: (
        //                 <div>
        //                   <span style={{ color: '#f04031' }}>
        //                     取消后此流程不可在OMS和OA里查看，且原业务单据视为已申请过，
        //                   </span>
        //                   你还要继续吗？
        //                 </div>
        //               ),
        //               okText: '确认取消',
        //               cancelText: '不取消',
        //               onOk: () => {
        //                 let flag = false;
        //                 if (codeList.includes(render.workflowBaseInfo?.workflowId)) {
        //                   //?如果是助力审批的话就是true
        //                   flag = true;
        //                 }
        //                 cancelOa({
        //                   workflowId: render.workflowBaseInfo?.workflowId,
        //                   requestName: render.requestName,
        //                   requestId: render.requestId,
        //                   workflowName: render.workflowBaseInfo?.workflowName,
        //                   billNo: render.requestmark,
        //                   createUser: render.creatorName,
        //                   createTime: render.createTime,
        //                   updateTime: render.lastOperateTime,
        //                   helpFlag: flag,
        //                 }).then((res: any) => {
        //                   if (res.errCode === 200) {
        //                     message.success('操作成功!');
        //                     actRef?.current?.reload();
        //                   } else {
        //                     Modal.error({ title: res.errMsg });
        //                   }
        //                 });
        //               },
        //             });
        //           }}
        //         >
        //           取消
        //         </Button>
        //       )}
        //   </Space>
        // );
      },
    },
    { title: '流程ID', dataIndex: 'requestId', width: 80, fixed: true, ellipsis: true },
    { title: '标题', dataIndex: 'requestName', width: 150, ellipsis: true },
    {
      title: '任务类型',
      dataIndex: 'workflowBaseInfo',
      width: 150,
      ellipsis: true,
      render: (text: any, render: any) => {
        return <span>{render.workflowBaseInfo?.workflowName}</span>;
      },
    },
    { title: '业务单据编号', dataIndex: 'requestmark', width: 150, ellipsis: true },
    { title: '申请备注', dataIndex: 'requestRemark', width: 150, ellipsis: true },
    { title: '发起人', dataIndex: 'creatorName', width: 100, ellipsis: true },
    { title: '当前节点', dataIndex: 'currentNodeName', width: 70, ellipsis: true },
    { title: '创建时间', dataIndex: 'createTime', width: 120, ellipsis: true },
    { title: '最后操作时间', dataIndex: 'lastOperateTime', width: 120, ellipsis: true },
    { title: '审批状态', dataIndex: 'currentnodetypeName', width: 100, ellipsis: true },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 280);
  }, [initialState?.windowInnerHeight]);
  useEffect(() => {
    const path: any = history.location.pathname.split('/').pop();
    setLastPath(path);
  }, []);
  const onChange = (key: string) => {
    setArchivestatus(key);
    actRef.current?.reload();
  };
  const showOAdetailBatch = () => {
    if (selectedRows.length > 0) {
      selectedRows.forEach((item: any) => {
        showOAdetail(item);
      });
    } else {
      message.warning('请先选择数据!');
    }
  };

  useEffect(() => {
    // 奥审批状态
    // queryListDataMap(['oaApprovalStatus']).then((res: any) => {
      // if (res.errCode === 200) {
      //   setApprovalStatusList(res?.data?.oaApprovalStatus);
      // }
    // });
  }, []);

  return (
    <div className="pageTabs back-log">
      <Tabs defaultActiveKey={archivestatus} onChange={onChange}>
        {lastPath === 'doself' && (
          <React.Fragment>
            <Tabs.TabPane tab="待办任务" key="2" />
            <Tabs.TabPane tab="已办任务" key="1" />
          </React.Fragment>
        )}
        {lastPath === 'submitself' && (
          <React.Fragment>
            <Tabs.TabPane tab="未完成" key="2" />
            <Tabs.TabPane tab="已完成" key="1" />
          </React.Fragment>
        )}
      </Tabs>
      <div className="omsAntStyle">
        <div className="form-content-search">
          <Form
            layout="inline"
            form={form}
            className="ant-advanced-form"
            autoComplete="off"
            initialValues={{ approvalStatus: '' }}
          >
            <Form.Item name="requestname" label="标题">
              <Input placeholder="标题关键字或业务单据号" />
            </Form.Item>
            {lastPath === 'doself' && (
              <Form.Item name="workcode" label="发起人">
                <WorkerCommon />
              </Form.Item>
            )}
            {lastPath === 'doself' && archivestatus == '1' && (
              <Form.Item name="approvalStatus" label="审批状态">
                <Select placeholder="请选择">
                  <Select.Option value="" key={'全部'}>
                    全部
                  </Select.Option>
                  {approvalStatusList?.map((item: any) => (
                    <Select.Option key={item.key} value={item.value}>
                      {/* 此处入参后端要求中文 */}
                      {item.value}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            <Form.Item name="requestId" label="流程ID">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="workflowIds" label="任务类型">
              <SelectCommon isEdit={false} selectType="oaWorkFlowIdType" />
            </Form.Item>
            {/* <Form.Item name="requestRemark" label="申请备注">
              <Input placeholder="请输入" />
            </Form.Item> */}
            <Form.Item>
              <Space>
                <Button
                  key={'查询'}
                  type="primary"
                  onClick={() => {
                    actRef.current?.reload(true);
                    setStartPage(true);
                  }}
                >
                  查 询
                </Button>
                <Button
                  key={'重置'}
                  onClick={() => {
                    form.resetFields();
                    setStartPage(true);
                  }}
                >
                  重 置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
        <ProTable<any>
          columns={columns}
          bordered
          size="small"
          request={async (params) => {
            const searchParams = form.getFieldsValue(true);
            if (startPage) {
              params.current = 1;
              // params.pageSize = 20;
            }
            searchParams.pageNo = params.current;
            searchParams.pageSize = params.pageSize;
            let res = null;
            setSelectedRows([]);
            setSelectedRowKeys([]);
            // if (lastPath === 'submitself') {
            //   searchParams.archivestatus = archivestatus;
            //   res = await getMyWorkflowRequestList(searchParams);
            // } else if (archivestatus === '2') {
            //   res = await getToDoWorkflowRequestList(searchParams);
            // } else if (archivestatus === '1') {
            //   res = await getHandledWorkflowRequestList4Ofs(searchParams);
            // }
            // if (res.errCode === 200) {
            //   const list: any = res.data?.list || [];
            //   // const list: any = [{ requestId: 1, currentnodetypeName: '审批退回' }];

            //   return Promise.resolve({ total: res.data.total, data: list, success: true });
            // } else {
            //   message.error(res.errMsg);
            //   return Promise.resolve([]);
            // }
          }}
          rowSelection={rowSelection}
          options={false}
          rowKey="requestId"
          search={false}
          tableAlertRender={false}
          actionRef={actRef}
          defaultSize="small"
          scroll={{ x: 200, y: yClient }}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            // showTotal: total => `共有 ${total} 条数据`,
            showTotal: (total: any, range: any[]) =>
              `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
            onShowSizeChange: (current: any, pageSize: any) => onShowSizeChange(current, pageSize),
            showQuickJumper: true,
          }}
          headerTitle={
            <div>
              <Button
                size="small"
                key={'详情'}
                type="primary"
                onClick={() => {
                  showOAdetailBatch();
                }}
              >
                批量展开详情
                <Tooltip
                  placement="rightBottom"
                  overlayClassName="selfTooltip"
                  title={
                    '选择多个任务，点击可一次性打开多个任务审批窗口，如遇问题，请点击chrome浏览器右上角三个竖点，进入设置，搜索“弹出式窗口和重定向”,在默认行为中勾选“网站可以发送弹出式窗口并使用重定向”，上述方法仍无法解决，请联系运维支持。'
                  }
                >
                  <QuestionCircleFilled />
                </Tooltip>
              </Button>
            </div>
          }
        />
      </div>
      <Drawer
        width={(2 * drawerWidth) / 3}
        title={<Dtitle title="助力审批" subTitle="CSP物料不参与助力" />}
        visible={checkVisible}
        onClose={() => setCheckVisible(false)}
        destroyOnClose={true}
        footer={[
          // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
          <Button
            key="back"
            onClick={() => {
              setCheckVisible(false);
              setIds([]);
            }}
          >
            关闭
          </Button>,
        ]}
      >
        <ApplyCheck
          id={id}
          from="need"
          onClose={() => {
            setCheckVisible(false);
            setIds([]);
            actRef.current?.reload();
          }}
        />
      </Drawer>
      <RebackEditPage
        fn={() => {
          actRef.current?.reload(true);
        }}
        ref={applyRef}
      />
    </div>
  );
};
// export default Index;
import { KeepAlive } from 'react-activation';
export default () => (
  <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
    <Index />
  </KeepAlive>
);
