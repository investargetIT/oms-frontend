import { createContent, searchContent } from '@/services/InquirySheet';
import { Button, Input, message, Modal, Space, Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
const InternalCommunication: React.FC<{
  getIntenarlData?: Function;
  id?: any;
  sourceType?: any;
  chatLogVOList?: any;
}> = (props: any) => {
  const [data, setData]: any = useState([]);
  const [remark, setRemark]: any = useState('');
  const [visible, setVisible]: any = useState(false);
  const { initialState } = useModel('@@initialState');
  useEffect(() => {
    if (props.getIntenarlData) {
      props.getIntenarlData(data);
    }
  }, [data]);
  useEffect(() => {
    if (props.chatLogVOList?.length) {
      setData(props.chatLogVOList);
    }
  }, [props.chatLogVOList]);
  const getData = () => {
    if (props.id) {
      searchContent({ sourceId: props.id, sourceType: props.sourceType || 20 }).then((res: any) => {
        if (res.errCode === 200) {
          setData(res.data?.dataList);
        }
      });
    }
  };
  useEffect(() => {
    getData();
  }, [props.id]);
  const columns: any = [
    {
      title: '时间',
      dataIndex: 'createTime',
      width: 150,
      render: (text: any) => {
        return <span>{text}</span>;
      },
    },
    {
      title: '沟通内容',
      dataIndex: 'opContent',
      className: 'wordBreak',
    },
    {
      title: '操作人',
      dataIndex: 'createName',
      width: 150,
    },
  ];

  // columns.forEach((item: any) => {
  //   item.ellipsis = true;
  // });
  const modalOk = (): any => {
    if (!remark) {
      message.error('请填写沟通内容!');
      return false;
    }
    if (!props.id) {
      setData(
        [
          {
            createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            operator: initialState?.currentUser?.userName,
            opContent: remark,
            sourceType: props.sourceType || 20,
          },
        ].concat(data),
      );
    } else {
      // 调用添加接口进行添加
      createContent({
        opContent: remark,
        sourceId: props.id,
        sourceType: props.sourceType || 20,
      }).then((res: any) => {
        if (res.errCode === 200) {
          message.success('内部沟通记录保存成功！');
          getData();
        } else {
          message.error(res.errMsg);
        }
      });
    }
    setVisible(false);
    setRemark('');
  };
  const modalCancel = () => {
    setVisible(false);
    setRemark('');
  };
  const onChange = ({ target: { value } }: any) => {
    setRemark(value);
  };
  return (
    <div className="base-info" id="internalCommunication" style={{ marginBottom: '10px' }}>
      <Space style={{ margin: ' 5px 0' }}>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setVisible(true);
          }}
        >
          添加
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={'opContent'}
        size="small"
        bordered
        style={{ width: '70%' }}
      />
      <Modal title="添加内部沟通记录" visible={visible} onOk={modalOk} onCancel={modalCancel}>
        <Input.TextArea
          showCount
          rows={4}
          value={remark}
          placeholder="请输入,最多255字"
          maxLength={255}
          onChange={onChange}
        />
      </Modal>
    </div>
  );
};
export default InternalCommunication;
