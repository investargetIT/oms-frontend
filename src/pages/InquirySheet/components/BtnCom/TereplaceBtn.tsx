import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Select, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { aeTote, getTe } from '@/services/InquirySheet';
import { history } from 'umi';

const TereplaceBtn: React.FC<{ selectedRow: any; recall?: any }> = (props: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [list, setList] = useState([]);
  const formRef = React.createRef<FormInstance>();
  useEffect(() => {
    // getTe().then((res: any) => {
    //   if (res.errCode === 200) {
    //     setList(res.data.dataList);
    //   }
    // });
  }, []);
  const getParams = (): any => {
    const temp: any = {};
    let inqLineIdList: any = []
    const path: any = history.location.pathname.split('/').pop();
    if (path === 'ae') {
      props.selectedRow.forEach(e => {
        inqLineIdList = [...inqLineIdList, ...e.inqLineIds]
      })
    } else {
      inqLineIdList = props.selectedRow.map((item: any) => item.skuVo?.inqLineId);
    }
    if (inqLineIdList?.length) {
      temp.inqLineIdList = inqLineIdList;
    }
    return temp;
  };
  const onOperate = (): boolean => {
    if (!props.selectedRow?.length) {
      Modal.warning({ title: '请选择需要操作的数据!' });
      return false;
    }
    // aeTote(getParams()).then((res: any) => {
    //   if (res.errCode === 200) {
    //     setIsModalVisible(true);
    //   } else {
    //     Modal.error({ title: res.errMsg });
    //   }
    // });
    return true;
  };
  const handleOk = () => {
    formRef.current?.validateFields().then((res: any) => {
      const params: any = getParams();
      Modal.confirm({
        title: '确定转TE?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          // aeTote({ ...params, ...res }).then((resd: any) => {
          //   if (resd.errCode === 200) {
          //     message.success('操作成功!');
          //     setIsModalVisible(false);
          //     if (props.recall) {
          //       props.recall();
          //     } else {
          //       history.go(-1);
          //     }
          //   } else {
          //     Modal.error({ title: resd.errMsg });
          //   }
          // });
        },
      });
    });
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div>
      <Button size="small" disabled={!props.selectedRow?.length} onClick={onOperate}>
        转TE处理
      </Button>
      <Modal
        title="转TE处理"
        destroyOnClose
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form ref={formRef} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Form.Item label="TE" name="teName" rules={[{ required: true, message: '请选择' }]}>
            <Select>
              {list &&
                list.map((item: any) => (
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

export default TereplaceBtn;
