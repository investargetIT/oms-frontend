import { getAddTaskList, getFinishSubmitField, saveFinish } from '@/services/task';
import { ModalForm, ProFormRadio, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { Form, message } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

interface CompleteTaskProps {
  sid?: any;
  isComplete: (n: any) => void;
}

const CompleteTask = (props: CompleteTaskProps, ref: any) => {
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [doesFlow, setCha] = useState<any>(0);
  const [form] = Form.useForm();
  const [custFileList, setCustFileList] = useState<any>([]);
  const formRef = useRef<any>();
  const [taskTypeList, setTaskTypeList] = useState<any>([]);

  useImperativeHandle(ref, () => ({
    open: () => {
      setModalVisible(true);
    },
    close: () => {
      setModalVisible(false);
    },
  }));

  useEffect(() => {
    getFinishSubmitField({ sid: props.sid }).then((res: any) => {
      if (res?.errCode == 200) {
        setCustFileList(res?.data?.dataList);
      } else {
        message.error(res?.errMsg);
      }
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

  return (
    <ModalForm
      title="完成任务"
      layout="horizontal"
      visible={modalVisible}
      form={form}
      formRef={formRef}
      modalProps={{
        destroyOnClose: true,
      }}
      onVisibleChange={setModalVisible}
      submitter={{
        searchConfig: {
          submitText: '确认',
          resetText: '取消',
        },
      }}
      onFinish={async (values: any) => {
        const filterFiled = { ...values };
        delete filterFiled.sid;
        delete filterFiled.doesFlow;
        delete filterFiled.remark;
        delete filterFiled.taskId;
        const par = {
          ...values,
          sid: props?.sid,
          submitField: {
            ...filterFiled,
          },
        };
        const { errCode, errMsg } = await saveFinish(par);
        // if (errCode === 200) {
        //   message.success('完成任务');
        //   props?.isComplete(false);
        //   setModalVisible(false);
        // } else {
        //   message.error(errMsg);
        // }
        form?.resetFields();
      }}
    >
      {custFileList?.map((io: any, index: any) => {
        return (
          <ProFormTextArea
            key={index}
            name={io.fieldEnName}
            label={io.fieldName}
            placeholder={'请输入'}
            fieldProps={{ maxLength: io.length || 500, showCount: true }}
            rules={[{ required: io.required === 1 ? true : false, message: '请选择' }]}
          />
        );
      })}
      <ProFormRadio.Group
        label="是否流转到其他部门"
        name={'doesFlow'}
        initialValue={0}
        fieldProps={{
          onChange: (ev: any) => {
            setCha(ev.target.value);
            // if (ev.target.value == 0) {
            //   form.setFieldsValue({
            //     remark: '',
            //     duty: '',
            //   });
            // }
          },
        }}
        options={[
          {
            label: '不需流转',
            value: 0,
          },
          {
            label: '需要流转',
            value: 1,
          },
        ]}
      />
      {/* <ProFormText
        label="责任部门"
        name="taskId"
        disabled={doesFlow === 1 ? false : true}
        rules={[{ required: doesFlow === 1 ? true : false, message: '请选择' }]}
      /> */}

      <ProFormSelect
        showSearch
        allowClear={false}
        label="责任部门"
        name="taskId"
        options={taskTypeList}
        key="type"
        placeholder="请选择"
        disabled={doesFlow === 1 ? false : true}
        rules={[{ required: doesFlow === 1 ? true : false, message: '请选择' }]}
        // fieldProps={{
        //   onChange: (val:any) => {
        //     const selectData = taskTypeList?.filter((io: any) => io.sid == val)[0];
        //     setTaskTypeObj(selectData);
        //   },
        //   onSearch: (val) => {
        //     getAddTaskList({ name: val }).then((res: any) => {
        //       if (res.errCode === 200) {
        //         setTaskTypeList(
        //           res?.data?.dataList?.map((io: any) => ({
        //             ...io,
        //             label: io.name,
        //             value: io.sid,
        //           })),
        //         );
        //       }
        //     });
        //   },
        // }}
      />

      <ProFormTextArea
        name={'remark'}
        label="流转说明"
        placeholder={'请输入，最多500字'}
        fieldProps={{ maxLength: 500, showCount: true }}
        disabled={doesFlow === 0 ? true : false}
      />
    </ModalForm>
  );
};

export default forwardRef(CompleteTask);
