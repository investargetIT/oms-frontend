import ProForm, { ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Card, DatePicker, Drawer, Form, message, Space, Tabs } from 'antd';
import { useEffect, useRef, useState } from 'react';
import '../index.less';
import classNames from 'classnames';
import moment from 'moment';
import { getByKeys } from '@/services/utils';
import BasicDetail from './components/BasicDetail.tsx';
import RelatedTasks from './components/RelatedTasks.tsx';
import DealDetail from './components/DealDetail.tsx';
import { addTask, getAddTaskList, missionDetail } from '@/services/task';

const { TabPane } = Tabs;
interface IProps {
  id: string;
}
const ItemTaskDetail: React.FC<any> = (props: IProps) => {
  const { id } = props;
  const [info, setInfo] = useState<any>({});
  const [form] = Form.useForm();
  const formRef = useRef<any>();
  const [drawerVisible, setDrawerVisible] = useState<any>(false);
  const [startTime, setStartTime] = useState<any>('');
  const [taskTypeObj, setTaskTypeObj] = useState<any>({});
  const [taskTypeList, setTaskTypeList] = useState<any>([]);

  useEffect(() => {
    missionDetail({ sid: id }).then((res: any) => {
      // const { data, errCode, errMsg } = res;
      // if (errCode === 200) {
      //   setInfo(data);
      // } else {
      //   message.error(errMsg);
      // }
    });
    // 初始化
    getAddTaskList({ name: '' }).then((res: any) => {
      // if (res.errCode === 200) {
      //   setTaskTypeList(
      //     res?.data?.dataList?.map((io: any) => ({
      //       ...io,
      //       label: io.name,
      //       value: io.sid,
      //     })),
      //   );
      // }
    });
  }, []);

  const tabChange = async (values: any) => {
    console.log(values);
  };

  const [statusList, setStatusList] = useState<any>([]);
  useEffect(() => {
    // list枚举
    const par = { list: ['missionTypeEnum', 'openSoUrgencyEnum'] };
    getByKeys(par).then((res: any) => {
      // if (res?.errCode === 200) {
      //   setStatusList(
      //     res?.data?.map((io: any) => {
      //       return io.enums.map((ic: any) => ({
      //         ...ic,
      //         value: ic.code,
      //         label: ic.name,
      //       }));
      //     }),
      //   );
      // }
    });
  }, []);

  return (
    <div className="form-content-search createForm" id="salesAfterApplyEdit">
      <Button
        style={{ zIndex: 9999999, top: '21px', right: '100px', position: 'absolute' }}
        type="primary"
        onClick={() => setDrawerVisible(true)}
      >
        新增任务
      </Button>
      <ProForm
        layout="horizontal"
        className="fix_lable_large has-gridForm"
        form={form}
        submitter={false}
      >
        <div className="editContentCol minHeight">
          <Tabs
            defaultActiveKey="1"
            size="large"
            onChange={tabChange}
            className={classNames('fixTab', 'hasTitle')}
          >
            <TabPane tab="基本信息" key="1">
              <Card title="基本信息" bordered={false} id="basic">
                {info?.missionTaskType && <BasicDetail info={info} readonly={true} />}
              </Card>
              <Card title="处理信息" bordered={false} id="deal">
                {info?.missionTaskType && <DealDetail info={info} readonly={true} />}
              </Card>
            </TabPane>
            <TabPane tab="相关任务" key="2">
              <RelatedTasks id={id} />
            </TabPane>
          </Tabs>
        </div>
      </ProForm>
      {/* 新增任务 */}
      <Drawer
        className="DrawerForm"
        width="50%"
        title={'新增任务'}
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
              取消
            </Button>
            <Button
              type="primary"
              onClick={async () => {
                // 新增任务 mission
                const data = formRef?.current?.getFieldsFormatValue();
                const { errCode, errMsg } = await addTask({
                  ...taskTypeObj,
                  ...data,
                  missionId: id,
                });
                if (errCode === 200) {
                  message.success('新增任务成功');
                  setDrawerVisible(false);
                } else {
                  message.error(errMsg);
                }
              }}
            >
              确定
            </Button>
          </Space>
        }
      >
        <ProForm
          layout="horizontal"
          className="fix_lable_large has-gridForm"
          formRef={formRef}
          initialValues={[]}
          submitter={{
            render: false,
          }}
        >
          <ProFormText
            label="任务名称"
            name="taskInstanceName"
            placeholder={'请输入'}
            fieldProps={{ maxLength: 50, showCount: true }}
            required
          />
          <ProFormSelect
            showSearch
            allowClear={false}
            label="任务类型"
            name="taskId"
            options={taskTypeList}
            key="type"
            placeholder="请选择"
            required
            fieldProps={{
              onChange: (val) => {
                const selectData = taskTypeList?.filter((io: any) => io.sid == val)[0];
                setTaskTypeObj(selectData);
              },
              onSearch: (val) => {
                getAddTaskList({ name: val }).then((res: any) => {
                  if (res.errCode === 200) {
                    setTaskTypeList(
                      res?.data?.dataList?.map((io: any) => ({
                        ...io,
                        label: io.name,
                        value: io.sid,
                      })),
                    );
                  }
                });
              },
            }}
          />
          <ProFormSelect
            allowClear={false}
            label="优先级"
            name="urgency"
            options={statusList[1]}
            placeholder="请选择"
            required
          />
          <ProFormTextArea
            name={'remark'}
            label="任务描述"
            placeholder={'请输入，最多255字'}
            fieldProps={{ maxLength: 255, showCount: true }}
          />

          <Form.Item name="expectedStartTime" label="预计开始时间" style={{ width: '100%' }}>
            <DatePicker
              showTime
              style={{ width: '100%' }}
              allowClear={false}
              onChange={(e: any, date: any) => {
                setStartTime(date);
              }}
              disabledDate={(current: any) => {
                return current < moment().startOf('day');
              }}
            />
          </Form.Item>
          <Form.Item name="expectedFinishTime" label="预计结束时间" style={{ width: '100%' }}>
            <DatePicker
              showTime
              style={{ width: '100%' }}
              allowClear={false}
              disabledDate={(current: any) => {
                return current < moment(startTime);
              }}
            />
          </Form.Item>
        </ProForm>
      </Drawer>
    </div>
  );
};
export default ItemTaskDetail;
