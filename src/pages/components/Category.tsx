import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { getChildrenCategory } from '@/services';
const Category: React.FC<{ isEdit?: any; onChange?: any; parentId: any; onType?: any }> = ({
  value,
  onChange,
  parentId,
  onType,
  isEdit,
}: any) => {
  const [list, setList] = useState([]);
  useEffect(() => {
    if (parentId) {
      getChildrenCategory(parentId).then((res: any) => {
        if (res.errCode === 200) {
          setList(res.data.dataList);
          if (value) {
            const index = res?.data?.dataList?.map((item: any) => item.categoryCode).indexOf(value);
            onType(
              res?.data?.dataList[index]?.categoryName,
              res?.data?.dataList[index]?.sourcingGpRate,
            );
          } else {
            onType(res?.data?.dataList[0]?.categoryName, res?.data?.dataList[0]?.sourcingGpRate);
          }
        }
      });
    }
  }, [parentId]);
  const valChange = (val: any, option: any) => {
    if (onChange) {
      onChange(val, option);
    }
    if (onType) {
      onType(option.name, option.sourcingGpRate);
    }
  };
  return (
    <Select onSelect={valChange} value={value} bordered={!isEdit}>
      {list &&
        list.map((item: any) => (
          <Select.Option
            sourcingGpRate={item.sourcingGpRate}
            name={item.categoryName}
            value={item.categoryCode}
            key={item.categoryCode}
          >
            {item.categoryName}
          </Select.Option>
        ))}
    </Select>
  );
};
export default Category;
