import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { queryListDataMap } from '@/services';
const TransportCondition: React.FC = ({ onChange, value }: any) => {
  const [list, setList] = useState([]);
  useEffect(() => {
    queryListDataMap(['transportCondition']).then((res: any) => {
      if (res.errCode === 200) {
        setList(res.data.transportCondition);
      }
    });
  }, []);
  const valChange = (val: any) => {
    onChange(val.target.value);
  };
  return (
    <Select onChange={valChange} value={value}>
      {list &&
        list.map((item: any) => (
          <Select.Option value={item.key} key={item.key}>
            {item.value}
          </Select.Option>
        ))}
    </Select>
  );
};
export default TransportCondition;
