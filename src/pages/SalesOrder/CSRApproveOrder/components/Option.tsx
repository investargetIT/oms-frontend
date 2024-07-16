import React, { useState } from 'react';
import { Button, Image, Space } from 'antd';
import Cookies from 'js-cookie';

const Option: React.FC<{ record: object }> = (props: any) => {
  const { record } = props;
  const [visible, setVisible] = useState(false);

  const str = record?.resourceUrl?.split('.');
  const fileType = str[str.length - 1];

  return (
    <Space>
      <Button
        size="small"
        key={'下载'}
        type="link"
        onClick={() => window.open(`${record.resourceUrl}?token=${Cookies.get('ssoToken')}`)}
      >
        下载
      </Button>
      {(fileType == 'png' ||
        fileType == 'jpg' ||
        fileType == 'jpeg' ||
        fileType == 'gif' ||
        fileType == 'webp' ||
        fileType == 'bmp') && (
        <Space>
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
        </Space>
      )}
    </Space>
  );
};
export default Option;
