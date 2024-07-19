import React, { useState, useEffect } from 'react';
import { Select, Modal, Form, Input, message } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons';
import { productBrand, createBrand } from '@/services';
import { FormInstance } from 'antd/es/form';
const BrandCom: React.FC<{ isEdit?: any; isHidden?: boolean; onType?: any; name?: any }> = ({
  onType,
  value,
  onChange,
  isHidden,
  name,
  isEdit,
}: any) => {
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const formRef = React.createRef<FormInstance>();
  const valChange = (val: any, option: any) => {
    if (onChange) {
      onChange(val);
    }
    if (onType) {
      onType(option.type, option.typestr, option.name);
    }
  };
  const handleOk = () => {
    formRef.current?.validateFields().then((params: any) => {
      Modal.confirm({
        title: '确定创建新品牌?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          // createBrand(params.brandName).then((res: any) => {
          //   if (res.errCode === 200) {
          //     message.success('操作成功!');
          //     setIsModalVisible(false);
          //   } else {
          //     Modal.error({ title: res.errMsg });
          //   }
          // });
        },
      });
    });
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  let timeout: any = null;
  const handleSearch = (val: any) => {
    if (val) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      // setTimeout(() => {
      //   productBrand(val).then((res: any) => {
      //     if (res.errCode === 200) {
      //       setList(res.data);
      //     }
      //   });
      // }, 1000);
    }
  };
  useEffect(() => {
    if (name) {
      handleSearch(name);
    }
  }, [name]);
  useEffect(() => {
    if (onType && value && name && list?.length) {
      list.map((item: any) => {
        if (item.code === value.toString()) {
          onType(item.type, item.typeStr, item.name);
        }
      });
    }
  }, [value, list]);
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Select
          showSearch
          value={value}
          placeholder="请输入名称模糊搜索"
          defaultActiveFirstOption={false}
          filterOption={false}
          onSearch={handleSearch}
          onSelect={valChange}
          notFoundContent={null}
          bordered={!isEdit}
        >
          {list.length > 0 &&
            list.map((item: any) => (
              <Select.Option
                type={item.type}
                typestr={item.typeStr}
                value={item.code}
                key={item.code}
                name={item.name}
              >
                ({item.code}) {item.name}
              </Select.Option>
            ))}
        </Select>
        {!isHidden && (
          <PlusCircleTwoTone
            style={{ fontSize: '20px' }}
            onClick={() => {
              setIsModalVisible(true);
            }}
          />
        )}
      </div>
      <Modal
        title="添加品牌  (仅支持添加sourcing类型的品牌)"
        visible={isModalVisible}
        destroyOnClose
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form ref={formRef} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
          <Form.Item
            label="品牌名称"
            name="brandName"
            rules={[{ required: true, message: '请填写品牌名称' }]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item label="备注" name="remark">
            <Input.TextArea rows={2} />
          </Form.Item> */}
        </Form>
      </Modal>
    </div>
  );
};
export default BrandCom;
