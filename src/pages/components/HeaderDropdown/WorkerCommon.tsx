import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import { queryBySaffName } from '@/services/ApprovalFlow';
const WorkerCommon: React.FC<any> = ({ value, onChange, name }: any) => {
  const [list, setList] = useState([]);
  const [suffixIcon, setSuffixIcon] = useState(<UserOutlined />);
  const valChange = (val: any) => {
    if (onChange) {
      onChange(val);
    }
  };
  let timeout: any = null;
  const handleSearch = (val: any) => {
    if (val.length > 2) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      // setTimeout(() => {
      //   queryBySaffName({ staffName: val }).then((res: any) => {
      //     if (res.errCode === 200) {
      //       setList(res.data.dataList);
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

  const onMouseDown = () => {
    setSuffixIcon(<SearchOutlined />);
  };

  const onMouseLeave = () => {
    setSuffixIcon(<UserOutlined />);
  };

  return (
    <div>
      <Select
        showSearch
        value={value}
        placeholder="请输入员工账号关键字或工号"
        defaultActiveFirstOption={false}
        filterOption={false}
        onSearch={handleSearch}
        onSelect={valChange}
        notFoundContent={null}
        suffixIcon={suffixIcon}
        showArrow
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
      >
        {list.length > 0 &&
          list.map((item: any) => (
            <Select.Option value={item.staffCode} key={item.staffCode} name={item.staffName}>
              {item.staffName}({item.staffCode})
            </Select.Option>
          ))}
      </Select>
    </div>
  );
};
export default WorkerCommon;
