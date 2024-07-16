import React from 'react';
import { Switch } from 'antd';
const ReSwitch: React.FC<{
  activeVal?: any;
  unactiveVal?: any;
  checkedChildren?: string;
  unCheckedChildren?: string;
}> = ({ value, onChange, activeVal, unactiveVal, checkedChildren, unCheckedChildren }: any) => {
  const valChange = (val: any) => {
    if (onChange) {
      if (val) {
        return activeVal === undefined ? val : activeVal;
      } else {
        return unactiveVal === undefined ? val : activeVal;
      }
    }
  };
  return (
    <Switch
      checkedChildren={checkedChildren}
      unCheckedChildren={unCheckedChildren}
      defaultChecked={value === activeVal}
      onChange={valChange}
    />
  );
};
export default ReSwitch;
