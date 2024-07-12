// import { queryBySaffName } from '@/services/ApprovalFlow';
// import { editDetail, editSave, taskConfigAdd } from '@/services/task';
import { getByKeys } from '@/services/utils';
import ProForm, { ProFormRadio, ProFormSelect } from '@ant-design/pro-form';
import { Button, Form, Input, message, Space, Switch } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import PersonSetting from './PersonSetting';
import './style.css';
// const { Option } = Select;

interface closeModal {
  onClose?: () => void;
  tableReload?: () => void;
  isEdit?: boolean;
  sid?: string | number;
}
const AddTask: React.FC<closeModal> = (props: any) => {
  const [form] = Form.useForm();
  const pModalRef = useRef<any>(null);
  const [handlerCode, setHandlerCode] = useState<any>(4);
  const [sPerson, setSPerson] = useState<any>(2);
  const [personList, setPersonList] = useState<any>([]);
  const [cooPersonList, setCooPersonList] = useState<any>([]);
  const [scopeCode, setScopeCode] = useState<any>('');
  const [statusList, setStatusList] = useState<any>([]);
  const [selectPersonArry, setSelectPersonArry] = useState<any>(null);
  const [perObj, setPerObj] = useState<any>({});
  const [initData, setInitData] = useState<any>({});

  useEffect(() => {
    // // 各种枚举list
    // const par = {
    //   list: [
    //     'openSoUrgencyEnum',
    //     'handlerTypeEnum',
    //     'scopeEnum',
    //     'taskTypeEnum',
    //     'timeUnitEnum',
    //     'cooperationTypeEnum',
    //     'completeRequirementEnum',
    //   ],
    // };
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
  }, []);

  useEffect(() => {
    if (props?.isEdit) {
      // editDetail({ sid: props?.sid }).then((res: any) => {
      //   const { data } = res;
      //   form.setFieldsValue({
      //     completeRequirement: data?.completeRequirement,
      //     cooperationType: data?.cooperationType,
      //     defaultConfiguration: data?.defaultConfiguration,
      //     enable: data?.enable,
      //     handlerType: data?.handlerType,

      //     name: data?.name,
      //     responsibleDepartment: data?.responsibleDepartment,
      //     scope: data?.scope,
      //     handlerPerson: data?.staffCode, //zidingyi
      //     staffCode: data?.staffCode,
      //     staffDept: data?.staffDept,
      //     staffName: data?.staffName,
      //     type: data?.type,
      //     typeDescription: data?.typeDescription,
      //     typeStr: '商品',
      //     urgency: data?.urgency,
      //     cooperationList: data?.cooperationList?.map((io: any) => ({
      //       ...io,
      //       label: io.staffName,
      //       value: io.staffCode,
      //     })),
      //   });
      //   setHandlerCode(data?.handlerType);
      //   setCooPersonList(
      //     data?.cooperationList?.map((io: any) => ({
      //       ...io,
      //       label: io.staffName,
      //       value: io.staffCode,
      //     })),
      //   );
      //   setPersonList([{ label: data?.staffName, value: data?.staffCode }]);
      //   setSPerson(data?.cooperationType);
      //   setInitData({
      //     ...data,
      //     // staffCode:data?.staffCode,
      //     // defaultConfiguration: data?.defaultConfiguration,
      //     // enable: data?.enable,
      //     // cooperationType:data?.cooperationType
      //   });
      // });
    } else {
      form?.setFieldsValue({
        defaultConfiguration: true,
        enable: true,
        completeRequirement: 2,
        cooperationType: 2,
        handlerType: 4,
        urgency: 3,
        scope: 1,
      });
      setInitData({
        defaultConfiguration: true,
        enable: true,
        completeRequirement: 2,
        cooperationType: 2,
        handlerType: 4,
        urgency: 3,
        scope: 1,
      });
    }
  }, []);

  // const selectAfter = (
  //   <Select defaultValue="天">
  //     <Option value="天">天</Option>
  //     <Option value="时">时</Option>
  //     <Option value="分">分</Option>
  //   </Select>
  // );

  const submit = async (values: any) => {
    const par = values;
    par.staffName = perObj?.staffName || initData?.staffName;
    par.staffCode = perObj?.staffCode || initData?.staffCode;
    par.staffDept = perObj?.departmentName || initData?.staffDept;
    par.enable = values?.enable ? 1 : 0;
    par.defaultConfiguration = values?.defaultConfiguration ? 1 : 0;
    par.cooperationList = selectPersonArry == null ? initData?.cooperationList : selectPersonArry;

    if (props?.isEdit) {
      par.cooperationList = par.cooperationList;
      par.sid = props?.sid;
      if (form.getFieldValue('handlerType') != 4) {
        par.staffName = null;
        par.staffCode = null;
        par.staffDept = null;
      }
      // await editSave({ ...initData, ...par }).then((res: any) => {
      //   if (res?.errCode === 200) {
      //     message.success('编辑成功');
      //     props?.tableReload();
      //     props?.onClose();
      //   } else {
      //     message.error(res?.errMsg);
      //   }
      // });
    } else {
      // await taskConfigAdd(par).then((res) => {
      //   if (res?.errCode === 200) {
      //     message.success('新增任务类型成功');
      //     props?.tableReload();
      //     props?.onClose();
      //   } else {
      //     message.error(res?.errMsg);
      //   }
      // });
    }
  };

  return (
    <div>
      <ProForm
        layout="horizontal"
        form={form}
        onFinish={(values: any) => submit(values)}
        initialValues={initData}
        submitter={{
          searchConfig: {},
          render: () => {
            return (
              <div
                style={{
                  position: 'fixed',
                  zIndex: 100,
                  bottom: '30px',
                  right: '10px',
                  height: '30px',
                  textAlign: 'end',
                  backgroundColor: '#fff',
                  paddingRight: '10px',
                }}
              >
                <Space>
                  <Button type="primary" htmlType="submit">
                    保存
                  </Button>
                  <Button onClick={props?.onClose}>取消</Button>
                </Space>
              </div>
            );
          },
        }}
      >
        <Form.Item label="任务类型名称" name="name" rules={[{ required: true, message: '请输入' }]}>
          <Input style={{ width: '100%' }} min={1} placeholder="请输入" showCount maxLength={50} />
        </Form.Item>
        <Form.Item
          label="责任部门"
          name="responsibleDepartment"
          rules={[{ required: true, message: '请输入!' }]}
        >
          <Input style={{ width: '100%' }} placeholder="请输入" showCount maxLength={50} />
        </Form.Item>
        <ProFormRadio.Group
          name="handlerType"
          label="默认处理人"
          initialValue={initData?.handlerType}
          options={statusList[1]}
          fieldProps={{
            async onChange(e) {
              setHandlerCode(e.target.value);
              if (e.target.value !== 4) {
                setPersonList([]);
                form?.setFieldsValue({
                  handlerPerson: '',
                });
              }
            },
          }}
        />
        <ProFormSelect
          showSearch
          label=""
          allowClear={false}
          style={{ paddingLeft: '120px' }}
          name="handlerPerson"
          initialValue={initData?.staffCode}
          fieldProps={{
            // labelInValue: true,
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
          disabled={handlerCode == 4 ? false : true}
          placeholder="请输入员工账号关键字，从下拉列表中选择。仅支持单人"
          options={personList}
        />
        <div style={{ position: 'relative' }}>
          <ProFormRadio.Group
            name="scope"
            label="适用范围"
            initialValue={1}
            // initialValue={initData?.scope}
            options={statusList[2]}
            disabled
            fieldProps={{
              onChange(e) {
                setScopeCode(e.target.value);
              },
            }}
          />
          <div style={{ position: 'absolute', right: 0, top: 0 }}>
            {scopeCode === 2 && (
              <Button type="link" onClick={() => pModalRef?.current?.open()}>
                {' '}
                {/* 配置白名单 */}
              </Button>
            )}
            {scopeCode === 3 && <Button type="link">{/* 配置黑名单 */}</Button>}
          </div>
        </div>
        <ProFormSelect
          label="所属项目任务类型"
          name="type"
          initialValue={1}
          // disabled
          options={statusList[3]}
        />
        <Form.Item label="任务类型描述" name="typeDescription">
          <Input.TextArea showCount maxLength={255} placeholder="请输入" allowClear />
        </Form.Item>
        <ProFormRadio.Group
          name="urgency"
          label="默认紧急度"
          initialValue={initData?.urgency}
          options={statusList[0]}
        />
        {/* <Form.Item label="默认提醒时间" name="remark1">
        <Input addonAfter={selectAfter} defaultValue="时" placeholder="请输入" />
      </Form.Item>
      <Form.Item label="默认处理时效" name="remark11">
        <Input addonAfter={selectAfter} defaultValue="天" placeholder="请输入" />
      </Form.Item>
      <Form.Item label="默认重复提醒间隔" name="remark1111">
        <Input addonAfter={selectAfter} defaultValue="天" placeholder="请输入" />
      </Form.Item> */}
        <ProFormRadio.Group
          name="cooperationType"
          label="任务协作方式"
          initialValue={initData?.cooperationType}
          options={statusList[5]}
          fieldProps={{
            onChange(e) {
              setSPerson(e.target.value);
              if (e.target.value !== 2) {
                setCooPersonList([]);
                form.setFieldsValue({ cooperationList: [] });
              }
            },
          }}
        />
        <ProFormSelect
          label=""
          showSearch
          mode="multiple"
          style={{ paddingLeft: '120px' }}
          name="cooperationList"
          initialValue={initData?.cooperationList}
          disabled={sPerson === 2 ? false : true}
          fieldProps={{
            fieldNames: { label: 'staffName', value: 'staffCode' },
            labelInValue: true,
            onChange: (val) => {
              setSelectPersonArry(val);
            },
            onSearch: (val) => {
              // queryBySaffName({ staffName: val }).then((res: any) => {
              //   if (res.errCode === 200) {
              //     setCooPersonList(
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
          placeholder="请输入员工账号关键字，从下拉列表中选择。仅支持多人"
          options={cooPersonList}
        />
        <ProFormRadio.Group
          name="completeRequirement"
          label="完成要求"
          initialValue={initData?.completeRequirement}
          options={statusList[6]}
          disabled
        />
        <Form.Item label="是否启用" name="enable" valuePropName="checked">
          <Switch
            checkedChildren="启用"
            unCheckedChildren="禁用"
            defaultChecked={initData?.enable}
            onChange={(e) => {
              // setAble(e);
              setInitData({
                ...initData,
                enable: e,
              });
            }}
          />
        </Form.Item>
        <Form.Item label="是否默认配置" name="defaultConfiguration" valuePropName="checked">
          <Switch
            checkedChildren="是"
            unCheckedChildren="否"
            defaultChecked={initData?.defaultConfiguration}
            onChange={(e) => {
              // setConfigAble(e);
              setInitData({
                ...initData,
                defaultConfiguration: e,
              });
            }}
          />
        </Form.Item>
      </ProForm>

      {/* 白名单配置 */}
      <PersonSetting ref={pModalRef} />
    </div>
  );
};
export default AddTask;
