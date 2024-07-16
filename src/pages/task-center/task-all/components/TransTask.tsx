import { queryBySaffName } from '@/services/ApprovalFlow';
import { saveTransferTask } from '@/services/task';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Col, Form, message } from 'antd';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

interface TransTaskProps {
  sid?: any;
  info?: any;
}

const TransTask = (props: TransTaskProps, ref: any) => {
  const [transModalVisible, setTransModalVisible] = useState<any>(false);
  const conRef = useRef<any>();
  const [form] = Form.useForm();
  const [personList, setPersonList] = useState<any>([]);
  const [perObj, setPerObj] = useState<any>({});

  useImperativeHandle(ref, () => ({
    open: () => {
      setTransModalVisible(true);
    },
    close: () => {
      setTransModalVisible(false);
    },
  }));

  // function operateMethod(val: { contactName: any; contactCodeR3: any }) {
  //   if (val) {
  //     console.log(val, 'val');
  //     form?.setFieldsValue({
  //       contactName: {
  //         label: val[0]?.contactName,
  //         value: val[0]?.contactCode,
  //       },
  //       contactCodeR3: val[0]?.contactCode,
  //     });
  //   }
  // }

  return (
    <>
      <ModalForm
        title="转交任务"
        layout="horizontal"
        visible={transModalVisible}
        form={form}
        modalProps={{
          destroyOnClose: true,
        }}
        onVisibleChange={setTransModalVisible}
        submitter={{
          searchConfig: {
            submitText: '确认',
            resetText: '取消',
          },
        }}
        onFinish={async (values: any) => {
          console.log(values);
          const par = {
            sid: props?.sid,
            handlerName: perObj?.staffName,
            handlerCode: perObj?.staffCode,
            processDepartment: perObj?.departmentName,
            transferRemark: values?.transferRemark,
          };
          const { errCode, errMsg } = await saveTransferTask(par);
          // if (errCode === 200) {
          //   message.success('转交成功');
          //   setTransModalVisible(false);
          // } else {
          //   message.error(errMsg);
          // }
          return true;
        }}
      >
        <ProFormText
          label="责任部门"
          initialValue={props?.info.taskTypeStr}
          name="sapConfirmNumber"
          readonly
        />
        <div className="canSee">
          <Col onClick={() => conRef?.current?.open()}>
            <ProFormSelect
              required
              showSearch
              label="处理人"
              allowClear={false}
              name="handlerPerson"
              fieldProps={{
                onChange: (val) => {
                  console.log(val);
                  const selectPerson = personList?.filter((io: any) => io.staffCode == val)[0];
                  setPerObj(selectPerson);
                },
                onSearch: (val) => {
                  // queryBySaffName({ staffName: val }).then((res: any) => {
                  //   if (res.errCode === 200) {
                  //     setPersonList(
                  //       res?.data?.dataList?.map((io: any) => ({
                  //         ...io,
                  //         label: io.staffName,
                  //         value: io.staffCode,
                  //       })),
                  //     );
                  //   }
                  // });
                },
              }}
              placeholder="请选择"
              options={personList}
            />
          </Col>
        </div>
        <ProFormTextArea
          name={'transferRemark'}
          label="转交说明"
          placeholder={'请输入，最多500字'}
          fieldProps={{ maxLength: 500, showCount: true }}
        />
      </ModalForm>
      {/* 人员信息 */}
      {/* <Connect ref = {conRef} operateMethod={operateMethod}/> */}
    </>
  );
};

export default forwardRef(TransTask);
