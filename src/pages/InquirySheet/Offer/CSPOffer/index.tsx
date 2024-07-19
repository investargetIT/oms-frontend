import { cancleOffer, searchOffer } from '@/services/InquirySheet';
import { getCompanyList, toast } from '@/services/InquirySheet/utils';
import { getOrderDateList } from '@/services/SalesOrder';
import ProForm, { ProFormDateRangePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, message, Modal, Space } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useModel, history, useLocation } from 'umi';
import { getEnv } from '@/services/utils';
import Cookies from 'js-cookie';
// import '../style.less';
import { colLimit } from '@/services';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
type IndexProps = Record<any, any>;

const Index: React.FC<IndexProps> = () => {
  const { initialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  const initialValues = {
    quotCode: '',
    customerName: '',
    cspStatus: '',
    startCreateTime: [moment().subtract(1, 'month'), moment().endOf('day')],
    sku: '',
    branchCode: '',
    createName: '',
    biddingCsp: true,
    inquiryCode: '',
    customerCode: '',
  };

  const [statusList, setStatusList] = useState<any>([]);
  const [cpList, setCpList] = useState<any>([]);
  const [yClient, setYClient] = useState(900);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [startPage, setStartPage] = useState(false);
  const [fold, setFold] = useState(false);
  const Location = useLocation();
  function UpDown() {
    setFold(!fold);
  }
  function onShowSizeChange(current: any, pageSize: any) {
    setStartPage(false);
    setCurrentPage(current);
    setCurrentPageSize(pageSize);
  }
  useEffect(() => {
    if (actionRef.current) actionRef.current?.reload();
  }, [Location.pathname]);
  useEffect(() => {
    const par = { type: 'cspStatus' };
    // getOrderDateList(par).then((res: any) => {
    //   if (res?.errCode === 200) {
    //     const newData = res?.data?.dataList;
    //     newData?.unshift({
    //       key: '',
    //       value: '全部',
    //     });
    //     setStatusList(
    //       newData?.map((io: any) => ({
    //         ...io,
    //         value: io.key,
    //         label: io.value,
    //       })),
    //     );
    //   }
    // });
    // 公司
    // getCompanyList().then((res: any) => {
    //   if (res?.errCode === 200) {
    //     res?.data?.dataList?.unshift({
    //       key: '',
    //       value: '全部',
    //     });
    //     setCpList(
    //       res?.data?.dataList?.map((io: any) => ({
    //         ...io,
    //         value: io.key,
    //         label: io.value,
    //       })),
    //     );
    //   }
    // });
  }, []);

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 50,
      fixed: 'left',
      render(text, record, index) {
        return <span>{(currentPage - 1) * currentPageSize + index + 1}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'left',
      width: 300,
      render: (_, record: any) => {
        return (
          <Space>
            {record?.cspStatus == 0 && (
              <Button
                size="small"
                key={'取消'}
                type="link"
                onClick={() => {
                  Modal.confirm({
                    title: '确认取消吗？',
                    content: '',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: async () => {
                      const { errMsg, errCode } = await cancleOffer({ quotIds: record?.sid });
                      toast(errMsg, errCode);
                      actionRef?.current?.reload();
                    },
                  });
                }}
              >
                取消
              </Button>
            )}
            {record?.cspStatus == 0 && (
              <Button
                size="small"
                key={'cspS申请'}
                type="link"
                onClick={() => {
                  history.push(`/inquiry/csp-offer/csp-apply/${record?.sid}?from=offer`);
                }}
              >
                CSP申请
              </Button>
            )}
            <Button
              size="small"
              key={'详情'}
              type="link"
              onClick={() => {
                history.push(`/inquiry/offer/detail/${record?.sid}`);
              }}
            >
              详情
            </Button>
            {record.cspStatusStr !== '审批中' && (
              <>
                <Button
                  type="link"
                  target="_blank"
                  href={`${getEnv()}/omsapi/quotation/getDownFileUrl/${
                    record.sid
                  }?token=${Cookies.get('ssoToken')}`}
                  key={'pdf'}
                >
                  PDF
                </Button>
                <Button
                  type="link"
                  target="_blank"
                  href={`${getEnv()}/omsapi/quotation/exportExcel/${record.sid}?token=${Cookies.get(
                    'ssoToken',
                  )}`}
                  key={'EXCEL'}
                >
                  EXCEL
                </Button>
              </>
            )}
          </Space>
        );
      },
    },
    { title: '报价单号', width: 150, dataIndex: 'quotCode', fixed: 'left' },
    { title: '创建时间', width: 150, dataIndex: 'createTime' },
    { title: 'CSP状态', width: 120, dataIndex: 'cspStatusStr' },
    { title: '客户号', width: 120, dataIndex: 'customerCode' },
    { title: '客户名称', width: 260, dataIndex: 'customerName' },
    { title: '总计金额含税', width: 120, dataIndex: 'amount' },
    { title: '头运费合计', width: 120, dataIndex: 'freight' },
    { title: '国际运费合计', width: 120, dataIndex: 'interFreight' },
    { title: '关税合计', width: 120, dataIndex: 'tariff' },
    { title: '总运费', width: 120, dataIndex: 'totalFreight' },
    { title: '货品总计', width: 120, dataIndex: 'goodsAmount' },
    { title: '折扣总计', width: 120, dataIndex: 'totalDiscount' },
    { title: 'R3联系人名称', width: 120, dataIndex: 'contactName' },
    { title: '创建人', width: 120, dataIndex: 'createName' },
    { title: '所属公司', width: 200, dataIndex: 'branchCompanyName' },
    { title: '报价有效日期', width: 150, dataIndex: 'quotValidDate', valueType: 'date' },
  ];
  columns.forEach((item: any) => {
    item.ellipsis = true;
  });
  useEffect(() => {
    setYClient((initialState?.windowInnerHeight || window.innerHeight) - 350);
  }, [initialState?.windowInnerHeight]);
  return (
    <div className=" omsAntStyle sales-after">
      <div className="form-content-search">
        <ProForm
          layout="inline"
          form={form}
          initialValues={initialValues}
          className="ant-advanced-form"
          submitter={{
            render: false,
          }}
          onFinishFailed={() => {
            message.warning('您有未完善的信息，请填写正确的信息');
          }}
        >
          <ProFormText label="CSP报价单号" name="quotCode" placeholder={'请输入'} />
          <ProFormText label="客户名称" name="customerName" placeholder={'请输入'} />
          <ProFormText label="客户号" name="customerCode" placeholder={'请输入'} />
          <ProFormText label="需求单号" name="inquiryCode" placeholder={'请输入'} />
          {!fold && (
            <>
              <ProFormSelect
                label="CSP状态"
                name="cspStatus"
                options={statusList}
                placeholder="请选择"
                showSearch
                allowClear={false}
              />
              <ProFormText label="SKU号" name="sku" placeholder={'请输入'} />
              <ProFormText label="创建人" name="createName" placeholder={'请输入'} />
              <ProFormSelect
                showSearch
                allowClear={false}
                label="所属公司"
                name="branchCode"
                options={cpList}
                placeholder="请选择"
              />
              <ProFormDateRangePicker name="startCreateTime" label="创建时间" />
            </>
          )}
          <Form.Item className="btn-search">
            <Space>
              <Button
                key={'查询'}
                type="primary"
                htmlType="submit"
                onClick={() => {
                  actionRef.current?.reload();
                  setStartPage(true);
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
              <Button
                key={'展开'}
                icon={fold ? <DownOutlined /> : <UpOutlined />}
                onClick={() => {
                  UpDown();
                }}
              >
                {fold ? '展开' : '收起'}
              </Button>
            </Space>
          </Form.Item>
        </ProForm>

        <ProTable<any>
          bordered
          columns={columns}
          columnsState={{
            value: columnsStateMap,
            onChange: (val: any) => {
              colLimit(val, setColumnsStateMap);
            },
            persistenceKey: history.location.pathname,
            persistenceType: 'localStorage',
          }}
          size="small"
          scroll={{ x: 200, y: yClient }}
          actionRef={actionRef}
          className="cust-table"
          tableStyle={{ paddingLeft: '10px', paddingRight: '10px' }}
          request={async (params) => {
            // // 表单搜索项会从 params 传入，传递给后端接口。
            if (startPage) {
              params.current = 1;
            }
            const paramsCust: any = {
              ...form.getFieldsValue(true),
              startCreateTime: form.getFieldsValue(true).startCreateTime[0]
                ? moment(form.getFieldsValue(true).startCreateTime[0]).format('YYYY-MM-DD')
                : '',
              endCreateTime: form.getFieldsValue(true).startCreateTime[1]
                ? moment(form.getFieldsValue(true).startCreateTime[1]).format('YYYY-MM-DD')
                : '',
              pageNumber: params.current,
              pageSize: params.pageSize,
            };
            // const {
            //   data: { list, total },
            //   errCode,
            //   errMsg,
            // } = await searchOffer(paramsCust);
            // if (errCode === 200) {
            //   return Promise.resolve({
            //     data: list,
            //     total: total,
            //     success: true,
            //   });
            // } else {
            //   message.error(errMsg);
            //   return Promise.resolve([]);
            // }
          }}
          options={{ reload: false, density: false }}
          rowKey="sid"
          pagination={{
            showSizeChanger: true,
            showTotal: (total, range) => `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
            onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
            showQuickJumper: true,
          }}
          search={false}
          tableAlertRender={false}
        />
      </div>
    </div>
  );
};

export default Index;
// import { KeepAlive } from 'react-activation';
// export default () => (
//   <KeepAlive name={history.location.pathname} saveScrollPosition="screen">
//     <Index />
//   </KeepAlive>
// );
