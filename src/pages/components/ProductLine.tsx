import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { getChildrenCategory } from '@/services';
const ProductLine: React.FC<{ isEdit?: any; onChange: any; onType?: any }> = ({
  onType,
  value,
  onChange,
  isEdit,
}: any) => {
  const [list, setList] = useState([]);
  useEffect(() => {
    // getChildrenCategory(0).then((res: any) => {
    //   if (res.errCode === 200) {
    //     setList(res.data.dataList);
    //   }
    // });
  }, []);
  const valChange = (val: any, option: any) => {
    if (onChange) {
      onChange(val, option);
    }
    if (onType) {
      onType(option.name);
    }
  };
  return (
    <Select onSelect={valChange} value={value} bordered={!isEdit}>
      {list &&
        list.map((item: any) => (
          <Select.Option value={item.categoryCode} key={item.categoryCode} name={item.categoryName}>
            {item.categoryName}
          </Select.Option>
        ))}
    </Select>
  );
};
export default ProductLine;
