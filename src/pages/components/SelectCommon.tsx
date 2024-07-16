import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { queryListDataMap } from '@/services';
const SelectCommon: React.FC<{
  selectType: string;
  disabled?: boolean;
  getName?: any;
  getRemark?: any;
  disabledOption?: any;
  isEdit?: any;
}> = ({
  onChange,
  value,
  selectType,
  disabled,
  getName,
  getRemark,
  disabledOption,
  isEdit,
}: any) => {
  const [list, setList] = useState([]);
  useEffect(() => {
    queryListDataMap([selectType]).then((res: any) => {
      if (res.errCode === 200) {
        setList(res.data[selectType]);
      }
    });
  }, []);
  const valChange = (val: any, option: any) => {
    onChange(val);
    if (getName) {
      getName(option.name);
    }
    if (getRemark) {
      getRemark(option.remark);
    }
  };
  return (
    <Select
      onSelect={valChange}
      value={value}
      disabled={disabled}
      style={{ minWidth: '150px' }}
      placeholder="请选择..."
      bordered={!isEdit}
    >
      {list &&
        list.map((item: any) => (
          <Select.Option
            disabled={disabledOption && disabledOption.includes(item.key)}
            value={item.key}
            key={item.key}
            name={item.value}
            remark={item.remark}
          >
            {item.value}
          </Select.Option>
        ))}
    </Select>
  );
};
export default SelectCommon;
