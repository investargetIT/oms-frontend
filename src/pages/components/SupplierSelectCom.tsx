import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { getSupplierList } from '@/services';
const SupplierSelectCom: React.FC<{ isEdit?: any; getName?: any; filterName?: any }> = ({
  filterName,
  value,
  onChange,
  getName,
  isEdit,
}: any) => {
  const [list, setList] = useState([]);
  const [code, setCode]: any = useState(null);
  useEffect(() => {
    setCode(value);
  }, [value]);
  let timeout: any = null;
  const handleSearch = (val: any) => {
    if (val) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      // setTimeout(() => {
      //   getSupplierList(val).then((res: any) => {
      //     if (res.errCode === 200) {
      //       setList(res.data.dataList);
      //     }
      //   });
      // }, 1000);
    }
  };
  useEffect(() => {
    if (filterName) {
      handleSearch(filterName);
    }
  }, [filterName]);
  const handleChange = (val: any, option: any) => {
    if (onChange) {
      onChange(val);
    }
    if (getName) {
      getName(option.name);
    }
  };
  return (
    <React.Fragment>
      <Select
        showSearch
        value={code}
        placeholder="请输入名称模糊搜索"
        defaultActiveFirstOption={false}
        filterOption={false}
        onSearch={handleSearch}
        onSelect={handleChange}
        notFoundContent={null}
        bordered={!isEdit}
      >
        {list.length > 0 &&
          list.map((item: any) => (
            <Select.Option
              name={item.supplierNameZh}
              value={item.supplierCode}
              key={item.supplierCode}
            >
              ({item.supplierCode}){item.supplierNameZh}
            </Select.Option>
          ))}
      </Select>
    </React.Fragment>
  );
};
export default SupplierSelectCom;
