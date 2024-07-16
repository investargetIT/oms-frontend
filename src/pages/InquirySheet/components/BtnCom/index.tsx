import React, { useState, useEffect } from 'react';
import { Space } from 'antd';
import { useLocation, history } from 'umi';
import TereplaceBtn from './TereplaceBtn';
import SourcingBtn from './SourcingBtn';
import ReturnBtn from './ReturnBtn';
import ImportBtn from './ImportBtn';
import ExportBtn from './ExportBtn';
import RejectBtn from './RejectBtn';
import AgreeBtn from './AgreeBtn';
import QuoteBtn from './QuoteBtn';
import CancelBtn from './CancelBtn';
import ProductBtn from './ProductBtn';
import ToauditBtn from './ToauditBtn';
import LectotypeFinishBtn from './LectotypeFinishBtn';
const Index: React.FC<{
  selectedRow: any;
  recall?: any;
  status?: string;
  inquiryId?: any;
}> = (props: any) => {
  const [lastPath, setLastPath]: any = useState('');
  const location: any = useLocation();
  const pathParams: any = location.state;
  useEffect(() => {
    const path: any = pathParams?.sorurceType || history.location.pathname.split('/').pop();
    const operate = pathParams?.type;
    if (operate || !pathParams?.sorurceType) setLastPath(path);
  }, [pathParams]);
  return (
    <Space>
      {pathParams?.sorurceType && (
        <ExportBtn
          key="导出"
          inquiryId={props.inquiryId}
          selectedRow={props.selectedRow}
          ExportInquiryCode={pathParams.ExportInquiryCode}
          recall={props.recall}
        />
      )}
      {lastPath === 'ae' && pathParams?.type != 'viewDetail' && (
        <React.Fragment>
          <ImportBtn key="导入" selectedRow={props.selectedRow} recall={props.recall} />
          {(!props.status || [190, 200].includes(props.status)) && (
            <React.Fragment>
              <LectotypeFinishBtn
                key="选配完成"
                selectedRow={props.selectedRow}
                recall={props.recall}
              />
              <TereplaceBtn key="转TE处理" selectedRow={props.selectedRow} recall={props.recall} />
              {/* <ProductBtn key="转产品线" selectedRow={props.selectedRow} recall={props.recall} /> */}
              <SourcingBtn key="转Sourcing" selectedRow={props.selectedRow} recall={props.recall} />
              <ReturnBtn
                key="退回"
                inquiryId={props.inquiryId}
                selectedRow={props.selectedRow}
                recall={props.recall}
              />
            </React.Fragment>
          )}
          {![40].includes(props.status) && (
            <ToauditBtn
              inquiryId={props.inquiryId}
              selectedRow={props.selectedRow}
              recall={props.recall}
            />
          )}
        </React.Fragment>
      )}
      {lastPath === 'te' && pathParams?.type != 'viewDetail' && (
        <React.Fragment>
          <ImportBtn key="导入" selectedRow={props.selectedRow} recall={props.recall} />
          {(!props.status || [190, 200].includes(props.status)) && (
            <LectotypeFinishBtn
              key="选配完成"
              selectedRow={props.selectedRow}
              recall={props.recall}
            />
          )}
          {/* <ProductBtn key="转产品线" selectedRow={props.selectedRow} recall={props.recall} /> */}
          <SourcingBtn key="转Sourcing" selectedRow={props.selectedRow} recall={props.recall} />
          {(!props.status || [190, 200].includes(props.status)) && (
            <ReturnBtn
              key="退回"
              inquiryId={props.inquiryId}
              selectedRow={props.selectedRow}
              recall={props.recall}
              lastPath={lastPath}
            />
          )}
          {![40].includes(props.status) && (
            <ToauditBtn
              inquiryId={props.inquiryId}
              selectedRow={props.selectedRow}
              recall={props.recall}
            />
          )}
        </React.Fragment>
      )}
      {['aepcm', 'tepcm', 'sourcing-pcm', 'sourcing-pcd'].includes(lastPath) &&
        pathParams?.type != 'viewDetail' && (
          <React.Fragment>
            <AgreeBtn
              key="审核通过"
              inquiryId={props.inquiryId}
              selectedRow={props.selectedRow}
              recall={props.recall}
              checkVal={pathParams?.check}
            />
            <RejectBtn
              key="审核退回"
              inquiryId={props.inquiryId}
              selectedRow={props.selectedRow}
              recall={props.recall}
              backVal={pathParams?.back}
            />
          </React.Fragment>
        )}
      {lastPath === 'createsku' && pathParams?.type != 'viewDetail' && (
        <React.Fragment>
          <ImportBtn key="导入" selectedRow={props.selectedRow} recall={props.recall} />
          {/* <ProductBtn key="转产品线" selectedRow={props.selectedRow} recall={props.recall} /> */}
        </React.Fragment>
      )}
      {['otherchannel', 'quote', 'RFQquote'].includes(lastPath) &&
        pathParams?.type != 'viewDetail' && (
          <React.Fragment>
            <ImportBtn key="导入" selectedRow={props.selectedRow} recall={props.recall} />
            <QuoteBtn key="提交报价" selectedRow={props.selectedRow} recall={props.recall} />
            <ProductBtn key="转产品线" selectedRow={props.selectedRow} recall={props.recall} />
            <ReturnBtn
              key="退回"
              inquiryId={props.inquiryId}
              selectedRow={props.selectedRow}
              recall={props.recall}
              lastPath={lastPath}
            />
          </React.Fragment>
        )}

      {lastPath === 'info' && pathParams?.type != 'viewDetail' && (
        <CancelBtn
          key="取消选配型"
          inquiryId={props.inquiryId}
          selectedRow={props.selectedRow}
          recall={props.recall}
        />
      )}
    </Space>
  );
};

export default Index;
