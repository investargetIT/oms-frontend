import { useMemo, useEffect, useState } from 'react';
import ResizableTitle from './ResizableTitle';
import ProTable from '@ant-design/pro-table';
import cloneDeep from 'lodash/cloneDeep';
import { colLimit } from '@/services';
import { history } from 'umi';
function Index(props: any) {
  const { columns, ...restProps } = props;
  const [colList, setColList] = useState([]);
  const [pathname, setPathname] = useState('');
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, any>>();
  useEffect(() => {
    setColList(columns);
    setPathname(history.location.pathname)
  }, []);
  const columnsList = useMemo(() => {
    return colList.map((col: any, index: number) => {
      return {
        ...col,
        onHeaderCell: (column: any) => ({
          width: column.width,
          onResize: (e: any, { size }: any) => {
            const copyData: any = cloneDeep(colList);
            copyData[index] = { ...copyData[index], width: size.width };
            setColList(copyData);
          },
        }),
      };
    });
  }, [colList]);
  return (
    <ProTable
      columns={columnsList}
      defaultSize="small"
      bordered
      columnsState={{
        value: columnsStateMap,
        onChange: (val: any) => {
          colLimit(val, setColumnsStateMap);
        },
        persistenceKey: pathname,
        persistenceType: 'localStorage',
      }}

      components={{
        header: {
          cell: ResizableTitle,
        },
      }}
      {...restProps}
    />
  );
}
export default Index;
