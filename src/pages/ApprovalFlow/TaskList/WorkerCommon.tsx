import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { queryBySaffName } from '@/services/ApprovalFlow';
const WorkerCommon: React.FC<any> = ({ value, onChange, name }: any) => {
  const [list, setList] = useState([]);
  const valChange = (val: any) => {
    if (onChange) {
      onChange(val);
    }
  };
  let timeout: any = null;
  const handleSearch = (val: any) => {
    // if (val.length > 2) {
    //   if (timeout) {
    //     clearTimeout(timeout);
    //     timeout = null;
    //   }
    //   setTimeout(() => {
    //     queryBySaffName({ staffName: val }).then((res: any) => {
    //       if (res.errCode === 200) {
    //         setList(res.data.dataList);
    //       }
    //     });
    //   }, 1000);
    // }
  };
  useEffect(() => {
    if (name) {
      handleSearch(name);
    }
  }, [name]);
  return (
    <div>
      <Select
        showSearch
        value={value}
        placeholder="请输入发起人名称模糊搜索"
        defaultActiveFirstOption={false}
        filterOption={false}
        onSearch={handleSearch}
        onSelect={valChange}
        notFoundContent={null}
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
