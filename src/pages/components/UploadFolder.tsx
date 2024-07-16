import React from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const UploadFolder: React.FC = (props?: any) => {
  return (
    <div style={{ backgroundColor: '#fff' }}>
      <Upload {...props}>
        <Button icon={<UploadOutlined />} type="primary">
          上传
        </Button>
      </Upload>
    </div>
  );
};

export default UploadFolder;
