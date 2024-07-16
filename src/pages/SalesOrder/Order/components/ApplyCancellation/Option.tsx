import React, { useState } from 'react';
import { Button, Image } from 'antd';
import Cookies from 'js-cookie';

const Option: React.FC<{ record?: any; onRemove?: any; type?: any }> = (props: any) => {
  const { record, type } = props;
  const [visible, setVisible] = useState(false);

  const str = record?.resourceUrl?.split('.');
  const fileType = str[str.length - 1];

  return (
    <>
      <Button
        size="small"
        key={'下载'}
        type="link"
        onClick={() => window.open(`${record.resourceUrl}?token=${Cookies.get('ssoToken')}`)}
      >
        下载
      </Button>
      {['png', 'jpg', 'JPG', 'jpeg', 'gif', 'webp', 'bmp'].includes(fileType) && (
        <>
          <Button size="small" key={'查看'} type="link" onClick={() => setVisible(true)}>
            查看
          </Button>
          <Image
            width={10}
            style={{ display: 'none' }}
            src={record.resourceUrl}
            preview={{
              visible,
              src: record.resourceUrl,
              onVisibleChange: (value) => {
                setVisible(value);
              },
            }}
          />
        </>
      )}
      {type !== 'view' && (
        <Button
          key={'移除'}
          size="small"
          type="link"
          onClick={() => {
            // props.onRemove(record.resourceName);
            props.onRemove(record);
          }}
        >
          移除
        </Button>
      )}
    </>
  );
};
export default Option;
