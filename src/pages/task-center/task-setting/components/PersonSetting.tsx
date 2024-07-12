import { ModalForm } from '@ant-design/pro-form';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, Col, Input, Row } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
const { Search } = Input;
interface PersonSettingProps {}

const PersonSetting = (props: PersonSettingProps, ref: any) => {
  const [modalVisible, setModalVisible] = useState<any>(false);
  const columns: ProColumns<any>[] = [
    {
      title: '员工工号',
      dataIndex: 'sid',
      width: 100,
      fixed: 'left',
    },
    {
      title: '员工名称',
      dataIndex: 'name',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'typeStr',
      width: 180,
    },

    {
      title: '部门',
      dataIndex: 'urgencyStr',
      width: 180,
    },

    {
      title: '职位',
      dataIndex: 'updateTime',
      width: 120,
    },
  ];
  useImperativeHandle(ref, () => ({
    open: () => {
      setModalVisible(true);
    },
    close: () => {
      setModalVisible(false);
    },
  }));

  return (
    <ModalForm
      width={'80%'}
      title="白名单"
      layout="horizontal"
      visible={modalVisible}
      modalProps={{
        destroyOnClose: true,
      }}
      onVisibleChange={setModalVisible}
      submitter={false}
      //   submitter={{
      //     searchConfig: {
      //       submitText: '确认',
      //       resetText: '取消',
      //     },
      //   }}
      onFinish={async (values: any) => {
        console.log(values);
        return true;
      }}
    >
      <Row>
        <Col span={12}>任务类型：OpenSO-PPS任务</Col>
        <Col span={12}>适用范围：白名单</Col>
      </Row>
      <Row style={{ margin: '20px 0' }}>
        <Col span={16}>
          <ProTable<any>
            columns={columns}
            tableStyle={{ marginTop: '20px' }}
            bordered
            size="small"
            scroll={{ x: 100, y: 300 }}
            dataSource={[{ sid: 12 }, { sid: 23 }]}
            // request={async (params: any) => {
            //   params.pageNumber = params.current;
            //   params.pageSize = params.pageSize;
            //   return Promise.resolve([]);
            // }}
            search={false}
            options={false}
            rowKey="sid"
            tableAlertRender={false}
            rowSelection={{
              type: 'checkbox',
              // selectedRowKeys: ids,
              // onChange: (rowKeys, rows) => {
              //   setIds(rowKeys);
              //   setSelectRows(rows);
              // },
            }}
            onRow={(record: any) => {
              console.log(record);
              return {
                onClick: () => {
                  // if (ids.includes(record?.sid)) {
                  //   const keys = ids.filter((item: any) => item !== record.sid);
                  //   setIds(keys);
                  //   setSelectRows(
                  //     pageData?.filter((io: any) => keys.some((ic: any) => ic == io.sid)),
                  //   );
                  // } else {
                  //   setIds(ids.concat(record.sid));
                  //   setSelectRows(
                  //     pageData?.filter((io: any) =>
                  //       ids.concat(record.sid).some((ic: any) => ic == io.sid),
                  //     ),
                  //   );
                  // }
                },
              };
            }}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            headerTitle={[
              <Button
                key={'批量删除'}
                type="primary"
                size="small"
                className="danger light_danger"
                ghost={false}
              >
                批量删除
              </Button>,
              <Button key={'导入'} type="default" size="small" style={{ marginLeft: '20px' }}>
                导入
              </Button>,
            ]}
          />
        </Col>
        <Col span={8}>
          <Search
            placeholder="请输入员工名称关键字"
            allowClear
            enterButton="Search"
            onSearch={(val: any) => {
              console.log(val);
            }}
          />
          <div>
            list
            {[1, 2].map((io: any) => io)}
          </div>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default forwardRef(PersonSetting);
