import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { queryListDataMap } from '@/services';
const Country: React.FC = ({ onChange, value }: any) => {
  const [list, setList] = useState([]);
  useEffect(() => {
    queryListDataMap(['country']).then((res: any) => {
      if (res.errCode === 200) {
        setList(res.data.country);
      }
    });
  }, []);
  const valChange = (val: any) => {
    onChange(val);
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
export default Country;
