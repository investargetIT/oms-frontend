import { queryPageList } from '@/services/afterSales';
import { getByKeys } from '@/services/afterSales/utils';
import ProForm, { ProFormDateRangePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Form, message, Space, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useModel, history } from 'umi';
import { colorEnum } from '../../contants';
import '../../index.less';
import { colLimit } from '@/services';
import ScrapDetail from './ScrapDetail';
const Index: React.FC<any> = () => {
  const [form] = Form.useForm();
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const actionRef = useRef<ActionType>();
  const initialValues = {
    scrapApplyNo: '',
    applyTitle: '',
    scrapStatus: '',
    createTimeStart: '',
    createTimeEnd: '',
    pageNumber: 1,
    pageSize: 20,
    startCreateTime: [moment().subtract(1, 'month'), moment().endOf('day')],
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState<any>(false);
  const [rowData, setRowData] = useState<any>({});

  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  const { initialState } = useModel('@@initialState');
  const [yClient, setYClient] = useState(900);
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        // return index + 1;
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 70,
      render: (_, record: any) => {
        return (
          <Space>
            {/* <Button
              size="small"
              key={'取消'}
              type="link"
              onClick={() => {
                console.log(record);
                Modal.confirm({
                  title: '是否确认取消该报废申请？',
                  content: '取消后该申请不可恢复，如需重新发起，请新建报废申请。',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {},
                });
              }}
            >
              取消
            </Button> */}
            <Button
              size="small"
              key={'详情'}
              type="link"
              onClick={() => {
                // const { sid } = record; //修改为抽屉 ，但保留原add同组件详情页面
                setDrawerVisible(true);
                setRowData(record);
                // history.push(
                //   `/sales-after/scrap-management/scrap-apply/add/?sid=${sid}&&isRead=true`,
                // );
              }}
            >
              详情
            </Button>
          </Space>
        );
      },
      fixed: 'left',
    },
    // {
    //   title: 'OA -- 回调模拟',
    //   width: 150,
    //   dataIndex: '12',
    //   render: (_, record) => {
    //     return (
    //       <Space>
    //         {record?.scrapStatusCode == 2 && (
    //           <Button
    //             size="small"
    //             key={'oa'}
    //             type="link"
    //             onClick={async () => {
    //               const { sid } = record;
    //               await audit({ sid, auditResult: 80 });
    //               actionRef?.current?.reload();
    //             }}
    //           >
    //             去回调
    //           </Button>
    //         )}
    //       </Space>
    //     );
    //   },
    // },
    { title: '报废申请编号', width: 150, dataIndex: 'scrapApplyNo', fixed: 'left' },
    { title: '创建时间', width: 170, dataIndex: 'createTime' },
    { title: '创建人', width: 120, dataIndex: 'createName' },
    {
      title: '申请状态',
      width: 120,
      dataIndex: 'scrapStatusDesc',
      render: (_, record) => {
        return (
          <span style={{ color: colorEnum[record.scrapStatusDesc] }}>{record.scrapStatusDesc}</span>
        );
      },
    },
    { title: '申请标题', width: 260, dataIndex: 'applyTitle' },
    { title: '总价', width: 120, dataIndex: 'scrapTotalPrice' },
    { title: '申请原因', width: 200, dataIndex: 'applyReason', ellipsis: true },
    { title: '最后修改人', width: 120, dataIndex: 'updateName' },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 320);
  }, [initialState?.windowInnerHeight]);
  const [statusList, setStatusList] = useState<any>([]);
  useEffect(() => {
    const par = { list: ['scrapApplyStatusEnum'] };
    getByKeys(par).then((res: any) => {
      if (res?.errCode === 200) {
        setStatusList(
          res?.data?.map((io: any) => {
            io?.enums?.unshift({
              code: '',
              name: '全部',
            });
            return io.enums.map((ic: any) => ({
              ...ic,
              value: ic.code,
              label: ic.name,
            }));
          }),
        );
      }
    });
  }, []);

  return (
    <div className="omsAntStyle sales-after" id="omsAntStyle">
      <div className="form-content-search">
        <ProForm
          layout="inline"
          form={form}
          initialValues={initialValues}
          className="ant-advanced-form"
          onFinishFailed={() => {
            message.warning('您有未完善的信息，请填写正确的信息');
          }}
          submitter={{
            render: false,
          }}
        >
          <ProFormText label="报废申请编号" name="scrapApplyNo" placeholder={'请输入'} />
          <ProFormText label="申请标题" name="applyTitle" placeholder={'请输入'} />
          <ProFormSelect
            showSearch
            allowClear={false}
            label="申请状态"
            name="scrapStatus"
            options={statusList[0]}
            placeholder="请选择"
          />
          <ProFormDateRangePicker
            name="startCreateTime"
            label="创建时间"
            placeholder={['开始日期', '结束日期']}
            className={'dataPickerCol'}
          />
          <Form.Item className="btn-search" style={{ marginLeft: '40px' }}>
            <Space>
              <Button
                key={'查询'}
                type="primary"
                htmlType="submit"
                onClick={() => {
                  setStartPage(true);
                  actionRef.current?.reload();
                }}
              >
                查 询
              </Button>
              <Button
                key={'重置'}
                onClick={() => {
                  form.resetFields();
                }}
              >
                重 置
              </Button>
            </Space>
          </Form.Item>
        </ProForm>
        <ProTable<any>
          bordered
          size="small"
          actionRef={actionRef}
          columns={columns}
          columnsState={{
            value: columnsStateMap,
            onChange: (val: any) => {
              colLimit(val, setColumnsStateMap);
            },
            persistenceKey: history.location.pathname,
            persistenceType: 'localStorage',
          }}
          scroll={{ x: 200, y: yClient }}
          style={{ margin: '10px 0' }}
          request={async (params) => {
            if (startPage) {
              params.current = 1;
              // params.pageSize = 20;
            }
            const par = {
              ...form.getFieldsValue(true),
              createTimeStart: form.getFieldsValue(true).startCreateTime[0]
                ? moment(form.getFieldsValue(true).startCreateTime[0]).format('YYYY-MM-DD HH:mm:ss')
                : '',
              createTimeEnd: form.getFieldsValue(true).startCreateTime[1]
                ? moment(form.getFieldsValue(true).startCreateTime[1]).format('YYYY-MM-DD HH:mm:ss')
                : '',
              pageNumber: params?.current,
              pageSize: params?.pageSize,
            };
            const { data, errCode, errMsg } = await queryPageList(par);
            if (errCode === 200) {
              return Promise.resolve({
                data: data?.list,
                success: true,
                total: data?.total,
              });
            } else {
              return message.error(errMsg);
            }
          }}
          options={{ reload: false, density: false }}
          rowKey="sid"
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            // showTotal: total => `共有 ${total} 条数据`,
            showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
            onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
            showQuickJumper: true,
          }}
          search={false}
          tableAlertRender={false}
          defaultSize="small"
          headerTitle={
            <Button
              type="primary"
              onClick={() => {
                history.push(`/sales-after/scrap-management/scrap-apply/add?from=add`);
              }}
            >
              新增报废申请
            </Button>
          }
        />
        {/* 详情 */}
        <Drawer
          className="DrawerForm"
          width={window.innerWidth}
          key={'detail'}
          title={[
            <span key={'报废申请号编号'}>报废申请号编号：{rowData?.scrapApplyNo}</span>,
            <Tag key={'订单类型'} color="gold" style={{ marginLeft: 10 }}>
              {rowData?.scrapStatusDesc}
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
              <strong>{rowData?.channelTypeDesc || '报废订单'}</strong>
            </p>,
          ]}
          visible={drawerVisible}
          onClose={() => {
            setDrawerVisible(false);
          }}
          destroyOnClose={true}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setDrawerVisible(false);
                }}
              >
                关闭
              </Button>
            </Space>
          }
        >
          <ScrapDetail sid={rowData?.sid} isRead={true} />
        </Drawer>
      </div>
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
