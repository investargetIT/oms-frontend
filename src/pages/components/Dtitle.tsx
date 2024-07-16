import React from 'react';

interface componentsProps {
  title?: string;
  subTitle?: string;
}

const components: React.FC<componentsProps> = ({ title, subTitle }) => {
  return (
    <>
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
        {title}
        <span style={{ color: '#888', fontSize: '14px' }}> {subTitle}</span>
      </div>
    </>
  );
};

export default components;
