/* eslint-disable @typescript-eslint/no-unused-expressions */
import ProForm, {
    DrawerForm,
    ProFormDateTimePicker,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
  } from '@ant-design/pro-form';
  import type { ActionType, ProColumns } from '@ant-design/pro-table';
  // import ProTable from '@ant-design/pro-table';
  import { Button, Card, Col, Form, message, Row, Space, Spin } from 'antd';
  import { useEffect, useRef, useState } from 'react';
  import '../index.less';
  // import Cookies from 'js-cookie';
  import moment from 'moment';
  import { getByKeys } from '@/services/utils';
  import Log from '@/pages/InquirySheet/Offer/components/Log';
  import { colorEnum } from '@/pages/SalesAfter/contants';
  import UploadList from '@/pages/SalesOrder/OrderModificationApplication/components/UploadList';
  import InternalCommunication from '@/pages/components/InternalCommunication';
  import TransTask from './components/TransTask';
  import CompleteTask from './components/CompleteTask';
  import { getDetail, saveEdit, starts } from '@/services/task';
  import { getFilesList } from '@/services/SalesOrder';
  import { DownOutlined, UpOutlined } from '@ant-design/icons';
  
  // const { TabPane } = Tabs;
  interface IProps {
    id: string;
    headTitle: string;
    isRead: boolean;
    onEdit?: (bo: any) => void;
  }
  const TaskDetail: React.FC<any> = (props: IProps) => {
    // const actionRef = useRef<ActionType>();
    const modalTransRef: any = useRef<ActionType>();
    const mdoalCompleteRef: any = useRef<ActionType>();
    const { id, onEdit } = props;
    const [info, setInfo] = useState<any>({});
    const [form] = Form.useForm();
  
    const [logVisible, setLogVisible] = useState<any>(false);
    const [statusList, setStatusList] = useState<any>([]);
    // const [fileList, setFileList] = useState<any>([]);
    const [paramsFile, setParamsFile] = useState<any>({});
    const [isEdit, setIsEdit] = useState<any>(false);
    const [completeStep, setcompleteStep] = useState<any>(0);
    const [showBtn, setShowBtn] = useState<any>(true);
    const [initialValues] = useState<any>({});
    const [dynamicFiled, setDynamicFiled] = useState<any>();
    const [load, setLoad]: any = useState(false);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [currentPageSize, setCurrentPageSize] = useState(20);
  
    // function onShowSizeChange(current: any, pageSize: any) {
    //   setCurrentPage(current);
    //   setCurrentPageSize(pageSize);
    // }
  
    const columns: ProColumns<any>[] = [
      { title: '任务ID', width: 120, dataIndex: 'sid', fixed: 'left' },
      { title: '任务标题', width: 150, dataIndex: 'taskInstanceName' },
      { title: '任务类型', width: 200, dataIndex: 'taskTypeStr' },
      { title: '处理人', width: 120, dataIndex: 'handlerName' },
      {
        title: '任务状态',
        width: 120,
        dataIndex: 'taskInstanceStatus',
        render: (_, record: any) => (
          <span style={{ color: colorEnum[record?.taskInstanceStatusStr] }}>
            {record?.taskInstanceStatusStr}
          </span>
        ),
      },
      { title: '处理部门', width: 120, dataIndex: 'processDepartment' },
      { title: '最新修改时间', width: 200, dataIndex: 'updateTime' },
    ];
    columns.forEach((item: any) => {
      item.ellipsis = true;
    });
  
    const initInfo = async () => {
      setLoad(true);
      const { data, errCode, errMsg } = await getDetail({ sid: id });
      // if (errCode === 200) {
      //   setInfo(data);
      //   setcompleteStep(data?.taskInstanceStatus == 2 ? 1 : 0);
      //   form?.setFieldsValue(data);
      //   // 遍历返回对象
      //   if (Object.keys(data?.displayDataMap).length > 0) {
      //     const obj = data?.displayDataMap as any;
      //     const objArray = [] as any;
      //     for (const [key, value] of Object.entries(obj)) {
      //       objArray.push({ label: key, value: value });
      //     }
      //     setDynamicFiled(objArray);
      //     setLoad(false);
      //   }
      //   setShowBtn(data?.taskInstanceStatus > 2 ? false : true);
      // } else {
      //   message.error(errMsg);
      //   setLoad(false);
      // }
    };
  
    const getListFile = async () => {
      const searchParams: any = {
        sourceId: props?.id,
        sourceType: 120,
      };
      const res: any = await getFilesList(searchParams);
      // if (res.errCode === 200) {
      //   setParamsFile({ resourceVOList: res.data?.list });
      // }
    };
  
    useEffect(() => {
      // 紧急度list
      const par = { list: ['openSoUrgencyEnum'] };
      // getByKeys(par).then((res: any) => {
      //   if (res?.errCode === 200) {
      //     setStatusList(
      //       res?.data?.map((io: any) => {
      //         return io.enums.map((ic: any) => ({
      //           ...ic,
      //           value: ic.code,
      //           label: ic.name,
      //         }));
      //       }),
      //     );
      //   }
      // });
      // 获取详情
      initInfo();
      getListFile(); //附件列表
    }, []);
  
    useEffect(() => {
      onEdit && onEdit(isEdit);
    }, [isEdit]);
  
    const [isDown, setIsDown] = useState<any>(true);
    const arowClick = async () => {
      setIsDown(isDown ? false : true);
    };
  
    return (
      <div className="form-content-search createForm" id="salesAfterApplyEdit">
        {showBtn && (
          <Space>
            {!isEdit && (
              <Button
                style={{ zIndex: 9999999, top: '21px', right: '310px', position: 'absolute' }}
                type="primary"
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                编辑
              </Button>
            )}
            {isEdit && (
              <Button
                style={{ zIndex: 9999999, top: '21px', right: '310px', position: 'absolute' }}
                type="primary"
                onClick={async () => {
                  const newObj = form?.getFieldsValue();
                  // 编辑保存接口
                  const par = {
                    sid: id,
                    taskInstanceName: props?.headTitle || info.taskInstanceName,
                    expectedStartTime: newObj?.expectedStartTime
                      ? moment(newObj?.expectedStartTime).format('YYYY-MM-DD HH:mm:ss')
                      : null,
                    expectedFinishTime: newObj?.expectedFinishTime
                      ? moment(newObj?.expectedFinishTime).format('YYYY-MM-DD HH:mm:ss')
                      : null,
                    remark: newObj?.remark,
                    urgency: newObj?.urgencyType,
                  };
                  const { errCode, errMsg } = await saveEdit(par);
                  if (errCode === 200) {
                    message.success('编辑保存成功');
                    setIsEdit(false);
                  } else {
                    message.error(errMsg);
                  }
                }}
              >
                保存
              </Button>
            )}
            <Button
              style={{ zIndex: 9999999, top: '21px', right: '250px', position: 'absolute' }}
              type="primary"
              onClick={() => modalTransRef?.current?.open()}
              disabled={isEdit ? true : false}
            >
              转交
            </Button>
            {completeStep == 0 && (
              <Button
                style={{ zIndex: 9999999, top: '21px', right: '180px', position: 'absolute' }}
                type="primary"
                onClick={async () => {
                  //调用开始接口
                  const { errCode, errMsg } = await starts({ sid: props?.id });
                  // if (errCode == 200) {
                  //   message.success('任务开始成功');
                  //   setcompleteStep(1);
                  // } else {
                  //   message.error(errMsg);
                  // }
                }}
                disabled={isEdit ? true : false}
              >
                已开始
              </Button>
            )}
            {completeStep == 1 && (
              <Button
                style={{ zIndex: 9999999, top: '21px', right: '180px', position: 'absolute' }}
                type="primary"
                onClick={() => mdoalCompleteRef?.current?.open()}
                disabled={isEdit ? true : false}
              >
                已完成
              </Button>
            )}
          </Space>
        )}
        <Button
          style={{ zIndex: 9999999, top: '21px', right: '100px', position: 'absolute' }}
          type="primary"
          onClick={() => setLogVisible(true)}
        >
          操作日志
        </Button>
        <ProForm
          layout="horizontal"
          className="fix_lable_large has-gridForm"
          form={form}
          submitter={false}
          initialValues={initialValues}
        >
          <Row gutter={24}>
            <Col span={18}>
              <div className="editContentCol minHeight">
                <Card title="任务信息" bordered={false} id="basic" className="openSo_basicDetail">
                  {/* --------------------------动态获取keyvalue */}
                  <Spin spinning={load}>
                    <section>
                      <div className="cust-allFiled" style={{ height: isDown ? '320px' : 'auto' }}>
                        {dynamicFiled?.map((io: any, index: any) => (
                          <ProFormText
                            style={{ marginRight: '20px' }}
                            key={index}
                            name={io.value}
                            initialValue={io.value}
                            label={io.label}
                            fieldProps={{ maxLength: 500, showCount: true }}
                            readonly
                          />
                        ))}
                      </div>
  
                      {/* 任务描述 */}
                      <ProFormTextArea
                        name={'remark'}
                        label="任务描述"
                        placeholder={'任务说明，默认一般无内容，可在编辑时手动填写'}
                        fieldProps={{ maxLength: 500, showCount: true }}
                        readonly={isEdit ? false : true}
                      />
                    </section>
                    <div className="arrow">
                      <div onClick={arowClick} className="duarrow">
                        {isDown && <DownOutlined />}
                        {!isDown && <UpOutlined />}
                      </div>
                    </div>
                  </Spin>
                </Card>
                <Card title="评论" bordered={false} bodyStyle={{ paddingLeft: 0 }}>
                  <InternalCommunication
                    id={props?.id}
                    sourceType={120}
                    // getIntenarlData={getIntenarlData}
                    // chatLogVOList={params.chatLogVOList}
                    // chatLogVOList={chatLogVOList}
                  />
                </Card>
                <Card
                  title="附件"
                  bordered={false}
                  bodyStyle={{ paddingLeft: 0, marginLeft: '-20px' }}
                >
                  <UploadList
                    getData={async (val: any) => {
                      console.log(val);
                      // setFileList(val);
                    }}
                    dynacId={props?.id}
                    sourceData={paramsFile.resourceVOList}
                    createName={paramsFile.createName}
                  />
                </Card>
                {/* <Card title="关联任务" bordered={false}>
                  <ProTable<any>
                    columns={columns}
                    bordered
                    size="small"
                    scroll={{ x: 200, y: 500 }}
                    className="cust-table"
                    tableStyle={{ marginLeft: '-24px' }}
                    request={async (params) => {
                      const paramsCust: any = {
                        rootSid: props?.id,
                        pageNumber: params?.current,
                        pageSize: params?.pageSize,
                      };
                      const {
                        data: { list, total },
                        errCode,
                        errMsg,
                      } = await getPageList(paramsCust);
                      if (errCode === 200) {
                        return Promise.resolve({
                          data: list,
                          total: total,
                          success: true,
                        });
                      } else {
                        message.error(errMsg);
                        return Promise.resolve([]);
                      }
                    }}
                    options={false}
                    rowKey="sid"
                    pagination={{
                      pageSize: 20,
                      showSizeChanger: true,
                      pageSizeOptions: ['10', '20', '50', '100'],
                      showTotal: (total, range) =>
                        `共有 ${total} 条数据, 本页显示 ${range[0]}-${range[1]}条`,
                      // onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
                      showQuickJumper: true,
                    }}
                    search={false}
                    tableAlertRender={false}
                    defaultSize="small"
                    actionRef={actionRef}
                  />
                </Card> */}
              </div>
            </Col>
            <Col span={6}>
              <Card title="基本信息" bordered={false}>
                <ProFormText label="所属项目任务" name="missionName" readonly />
                <ProFormSelect
                  allowClear={false}
                  label={'紧急度'}
                  name="urgency"
                  options={statusList[0]}
                  fieldProps={{
                    // async onChange(value: any) {
                    //   const { errCode, errMsg } = await saveEdit({
                    //     sid: props?.id,
                    //     taskInstanceName: props?.headTitle,
                    //     urgency: value,
                    //   });
                    //   if (errCode === 200) {
                    //     message.success('紧急度修改成功');
                    //   } else {
                    //     message.error(errMsg);
                    //   }
                    // },
                  }}
                  placeholder="请选择"
                />
                <ProFormText label="任务类型" name="taskTypeStr" readonly />
                <ProFormText label="处理人" name="handlerName" readonly />
                <ProFormText label="责任部门" name="responsibleDepartment" readonly />
                <div className="estimate">
                  <ProFormDateTimePicker
                    name="expectedStartTime"
                    label="预计开始"
                    readonly={isEdit ? false : true}
                  />
                </div>
                <div className="estimate">
                  <ProFormDateTimePicker
                    name="expectedFinishTime"
                    label="预计完成"
                    readonly={isEdit ? false : true}
                  />
                </div>
                <ProFormDateTimePicker name="createTime" label="创建时间" readonly />
                <ProFormDateTimePicker name="startTime" label="开始时间" readonly />
                <ProFormDateTimePicker name="finishTime" label="完成时间" readonly />
                <ProFormDateTimePicker name="updateTime" label="最后修改时间" readonly />
                <ProFormText label="累计用时" name="cumulativeTime" readonly />
                <ProFormText label="跟进用时" name="followTime" readonly />
              </Card>
            </Col>
          </Row>
        </ProForm>
        {/* 转交 */}
        <TransTask ref={modalTransRef} sid={info?.sid} info={info} />
        {/* 完成任务 */}
        {info?.sid && (
          <CompleteTask ref={mdoalCompleteRef} sid={info?.sid} isComplete={() => setShowBtn(false)} />
        )}
        {/*操作日志*/}
        <DrawerForm<any>
          title="操作日志"
          visible={logVisible}
          onVisibleChange={setLogVisible}
          submitter={false}
          drawerProps={{
            destroyOnClose: true,
            extra: (
              <Space>
                <Button
                  onClick={() => {
                    setLogVisible(false);
                  }}
                >
                  关闭
                </Button>
              </Space>
            ),
          }}
        >
          <Log sourceId={props?.id} title="任务id" sourceType={120} quotCode={props?.id} />
        </DrawerForm>
      </div>
    );
  };
  export default TaskDetail;
  