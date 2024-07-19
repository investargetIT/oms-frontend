import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Tree, Table, Modal, Select, message } from 'antd';
import { FormInstance } from 'antd/es/form';
import {
  deptList,
  deleteDept,
  createDept,
  memberDept,
  roleDeptName,
  createMember,
  delMember,
  updateMember,
  queryDeptListByType,
} from '@/services/InquirySheet';
import './style.less';
const Index: React.FC = () => {
  const formRef = React.createRef<FormInstance>();
  const formRef1 = React.createRef<FormInstance>();
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [treeData, setTreeData]: any = useState([]);
  const [roleList, setRoleList]: any = useState([]);
  const [depList, setDeptList]: any = useState([]);
  const [treeSel, setTreeSel]: any = useState('');
  const [deptCode, setDeptCode]: any = useState('');
  const [treeSelKey, setTreeSelKey]: any = useState('');
  const getDeptList = () => {
    // deptList().then((res: any) => {
    //   if (res.errCode === 200) {
    //     setTreeData(res.data.dataList);
    //   }
    // });
  };
  useEffect(() => {
    getDeptList();
  }, []);
  // const getMemberList = (id: any) => {
  //   memberDept(id).then((res: any) => {
  //     if (res.errCode === 200) {
  //       setDataSource(res.data.dataList);
  //     } else {
  //       setDataSource([]);
  //     }
  //   });
  // };
  const editMember = (record: any) => {
    setIsModalVisible1(true);
    formRef1.current?.setFieldsValue(record);
  };
  const onDelMember = (text: any) => {
    Modal.confirm({
      title: `确定删除成员?`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // delMember(text).then((resd: any) => {
        //   if (resd.errCode === 200) {
        //     message.success('删除成功!');
        //     getMemberList(treeSel.sid);
        //   } else {
        //     message.error(resd.errMsg);
        //   }
        // });
      },
    });
  };
  const columns: any = [
    {
      title: '#',
      dataIndex: 'index',
      width: 50,
      render: (text: any, render: any, index: any) => <span>{index + 1}</span>,
    },
    { title: '人员', width: 120, dataIndex: 'adName', ellipsis: true },
    { title: '角色', width: 120, dataIndex: 'roleName', ellipsis: true },
    { title: '所在部门', width: 120, dataIndex: 'deptNameStr', ellipsis: true },
    { title: '操作人', width: 120, dataIndex: 'updateName', ellipsis: true },
    { title: '创建时间', width: 120, dataIndex: 'createTime', ellipsis: true },
    { title: '最后更新时间', width: 150, dataIndex: 'updateTime', ellipsis: true },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      dataIndex: 'sid',
      render: (text: any, recorder: any) => {
        return [
          <Button
            type="link"
            key={'编辑'}
            onClick={() => {
              editMember(recorder);
            }}
          >
            编辑
          </Button>,
          <Button
            type="link"
            key={'删除'}
            onClick={() => {
              onDelMember(text);
            }}
          >
            删除
          </Button>,
        ];
      },
    },
  ];
  const onSelect = (selectedKeys: any, { node }: any) => {
    setTreeSelKey(selectedKeys);
    setTreeSel(node);
    if (node.sid && node.children.length === 0) {
      getMemberList(node.sid);
    } else {
      setDataSource([]);
    }
  };
  const onCreatDept = () => {
    formRef.current?.validateFields().then((res: any) => {
      Modal.confirm({
        title: `确定添加部门${res.deptName}(上级部门：${treeSel.deptName})?`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          // createDept({
          //   parentDeptName: treeSel.deptName,
          //   parentDeptId: treeSel.sid,
          //   deptName: res.deptName,
          //   deptCode,
          // }).then((resd: any) => {
          //   if (resd.errCode === 200) {
          //     message.success('添加成功!');
          //     getDeptList();
          //     setIsModalVisible(false);
          //   } else {
          //     message.error(resd.errMsg);
          //   }
          // });
        },
      });
    });
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const addMember = () => {
    formRef1.current?.validateFields().then((res: any) => {
      res.deptNameStr = treeSel.deptName;
      Modal.confirm({
        title: `确定添加${treeSel.deptName}成员?`,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          let resd = null;
          // if (res.bizDeptId) {
          //   resd = await updateMember(res);
          // } else {
          //   res.bizDeptId = treeSel.sid;
          //   resd = await createMember(res);
          // }
          // if (resd.errCode === 200) {
          //   formRef1.current?.resetFields();
          //   message.success('添加成功!');
          //   setIsModalVisible1(false);
          //   getMemberList(treeSel.sid);
          //   formRef1.current?.resetFields();
          // } else {
          //   message.error(resd.errMsg);
          // }
        },
      });
    });
  };
  const handleCancel1 = () => {
    formRef1.current?.resetFields();
    setIsModalVisible1(false);
  };
  const memberVisible = () => {
    if (!treeSel?.sid) {
      Modal.warning({ title: '请先选择所属部门!' });
      return;
    }
    if (treeSel.children.length !== 0) {
      Modal.warning({ title: '只能添加在最后一层节点下!' });
      return;
    }
    setIsModalVisible1(true);
    formRef1.current?.resetFields();
    const deptName = treeSel.deptNameStr.split('/')[0];
    // roleDeptName(deptName).then((res: any) => {
    //   if (res.errCode === 200 && res.data) {
    //     setRoleList(res.data);
    //   } else {
    //     setRoleList([]);
    //   }
    // });
  };
  const onDeleteDept = (): boolean => {
    if (!treeSel?.sid) {
      Modal.warning({ title: '请选择需要操作的数据!' });
      return false;
    }
    Modal.confirm({
      title: `确定删除部门${treeSel.deptName}?`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // deleteDept(treeSel.sid).then((resd: any) => {
        //   if (resd.errCode === 200) {
        //     message.success('删除成功!');
        //     getDeptList();
        //     setTreeSelKey([]);
        //     setTreeSel('');
        //   } else {
        //     message.error(resd.errMsg);
        //   }
        // });
      },
    });
    return true;
  };
  const showDeptAdd = (): any => {
    if (!treeSel?.sid) {
      Modal.warning({ title: '请选择需要添加的上级部门!' });
      return false;
    }
    if (!['MEGA', 'SOE', 'KA'].includes(treeSel?.deptName)) {
      Modal.warning({ title: '暂时不支持添加子部门(支持的有MEGA, SOE,KA)!' });
      return false;
    }
    setIsModalVisible(true);
    setDeptList([]);
    // queryDeptListByType({ deptAgency: treeSel?.deptName }).then((res: any) => {
    //   if (res.errCode === 200 && res.data?.dataList) {
    //     setDeptList(res.data?.dataList);
    //   }
    // });
  };
  const deptChage = (val: any, option: any) => {
    setDeptCode(option.code);
  };
  return (
    <div
      className="contentSty omsAntStyle"
      id="businessConfiguration"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '10px',
        background: '#fff',
        height: '100%',
      }}
    >
      <div
        className="left"
        style={{
          minWidth: '300px',
          height: '100%',
          padding: '2px',
        }}
      >
        <Space style={{ marginBottom: '10px' }}>
          <Button type="primary" size="small" onClick={showDeptAdd}>
            添加部门
          </Button>
          <Button size="small" onClick={onDeleteDept}>
            删 除
          </Button>
        </Space>
        <Tree
          showIcon
          selectedKeys={treeSelKey}
          fieldNames={{ title: 'deptName', key: 'sid', children: 'children' }}
          treeData={treeData}
          onSelect={onSelect}
        />
      </div>
      <div className="right" style={{ flex: 1 }}>
        <Button
          type="primary"
          size="small"
          onClick={memberVisible}
          style={{ marginBottom: '10px' }}
        >
          添加人员
        </Button>
        <Table dataSource={dataSource} size="small" columns={columns} rowKey={'sid'} bordered />
      </div>
      <Modal
        title="添加子部门"
        destroyOnClose={true}
        visible={isModalVisible}
        onOk={onCreatDept}
        onCancel={handleCancel}
      >
        <Form ref={formRef} labelCol={{ span: 5 }}>
          <Form.Item label="所属部门">
            <p>
              {treeSel.parentDeptName}/{treeSel.deptName}
            </p>
          </Form.Item>
          <Form.Item name="deptName" label="添加子部门" rules={[{ required: true }]}>
            <Select onSelect={deptChage}>
              {depList.length > 0 &&
                depList.map((item: any) => (
                  <Select.Option value={item.deptName} key={item.deptCode} code={item.deptCode}>
                    {item.deptName}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={'添加/编辑成员'}
        forceRender={true}
        destroyOnClose={true}
        visible={isModalVisible1}
        onOk={addMember}
        onCancel={handleCancel1}
      >
        <Form ref={formRef1} labelCol={{ span: 5 }}>
          <Form.Item name={'bizDeptId'} label="" style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          <Form.Item name={'sid'} label="" style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          <Form.Item label="所属部门">{treeSel.deptNameStr}</Form.Item>
          <Form.Item name={'adName'} label="添加成员" rules={[{ required: true }]}>
            <Input placeholder='请输入域账号名, 例如:"Sam Zhang"' />
          </Form.Item>
          <Form.Item name={'roleName'} label="设置角色" rules={[{ required: true }]}>
            <Select>
              {roleList.length > 0 &&
                roleList.map((item: any) => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Index;
