import React, { useRef, useEffect, useState } from 'react';
import '../index.less';
import ProTable from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { ProFormDateRangePicker, ProFormSelect } from '@ant-design/pro-form';
import moment from 'moment';
import { getByKeys } from '@/services';
interface modalProps {
  modalColumn: any;
  operateMethod: Function;
  getData: Function;
  modalOK: any;
  modalTitle: any;
}
const ModalList: React.FC<modalProps> = (props: any) => {
  const ref = useRef<ActionType>();
  const [columns, setColumns] = useState([]);
  const [pn, setPn] = useState(1);
  const [ps, setPs]: any = useState(20);
  const [selectedRowKeys, setSelectedRowKeys]: any = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (rowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRowKeys(rowKeys);
      props.operateMethod(selectedRows);
    },
  };
  const renderCol = (text: number) => {
    return (pn - 1) * ps + text + 1;
  };

  // 商机选择columns
  const merchantCols = [
    {
      title: '序号',
      dataIndex: 'index',
      valueIndex: 'index',
      width: 50,
      search: false,
      render(text: number) {
        return text + 1;
      },
    },
    { title: '商机编号', dataIndex: 'oppoId', ellipsis: true, search: false },
    { title: '商机名称', dataIndex: 'oppoValue', ellipsis: true },
    {
      title: '商机类型',
      dataIndex: 'type',
      ellipsis: true,
      renderFormItem: () => {
        return (
          <ProFormSelect
            name="type"
            allowClear={false}
            placeholder={'请选择'}
            request={async () => {
              let list = [] as any;
              const par = { list: ['oppoTypeEnum'] };
              // await getByKeys(par).then((res: any) => {
              //   if (res?.errCode === 200) {
              //     res?.data?.map((io: any) => {
              //       if (io.key === 'oppoTypeEnum') {
              //         list = io.enums.map((ic: any) => ({
              //           ...ic,
              //           value: ic.code,
              //           label: ic.name,
              //         }));
              //       }
              //     });
              //   }
              // });
              return list;
            }}
          />
        );
      },
    },
    {
      title: '商机状态',
      dataIndex: 'status',
      ellipsis: true,
      renderFormItem: () => {
        return (
          <ProFormSelect
            name="status"
            allowClear={false}
            placeholder={'请选择'}
            request={async () => {
              let list = [] as any;
              const par = { list: ['oppoStatusEnum'] };
              // await getByKeys(par).then((res: any) => {
              //   if (res?.errCode === 200) {
              //     res?.data?.map((io: any) => {
              //       if (io.key === 'oppoStatusEnum') {
              //         list = io.enums.map((ic: any) => ({
              //           ...ic,
              //           value: ic.code,
              //           label: ic.name,
              //         }));
              //       }
              //     });
              //   }
              // });
              return list;
            }}
          />
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      renderFormItem: () => {
        return (
          <div style={{ width: '250px' }}>
            <ProFormDateRangePicker
              name="createTime"
              allowClear={false}
              fieldProps={{ format: 'YYYY-MM-DD' }}
              initialValue={[moment().subtract(1, 'month'), moment().endOf('day')]}
            />
          </div>
        );
      },
    },
    // { title: '成交几率', dataIndex: 'transactionProbability', ellipsis: true, search: false, width:100 },
  ] as any;

  useEffect(() => {
    let temp = JSON.parse(JSON.stringify(props.modalColumn));
    temp[0].render = renderCol;
    if (temp[3].title == '是否已冻结') {
      temp[3].render = function (_: any, record: any) {
        if (record.effective == '0') {
          return '否';
        } else if (record.effective == '1') {
          return '是';
        }
      };
    }
    if (props.modalTitle == '选择商机') {
      temp = merchantCols;
    }
    setColumns(temp);
  }, [props.modalColumn, pn, ps]);

  return (
    <div className="base-info">
      {pn && (
        <ProTable<any>
          columns={columns}
          locale={{
            emptyText: () => (
              <>
                <div style={{ marginBottom: '20px' }}>暂无数据</div>
                <div>请前往CRM系统维护相关客户数据</div>
              </>
            ),
          }}
          request={async (params) => {
            params.pageNumber = params.current;
            setPn(params.pageNumber);
            params.pageSize = params.pageSize;
            setPs(params.pageSize);
            if (props.modalTitle == '选择商机') {
              params.createTimeStart = params.createTime
                ? params.createTime[0]
                : moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss');
              params.createTimeEnd = params.createTime
                ? params.createTime[1]
                : moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
            }
            const result =
              props.getData && (await props.getData(JSON.parse(JSON.stringify(params))));
            let list = [];
            // console.log(props);
            if (result?.data) {
              if (props.modalTitle == '选择客户') {
                list = result?.data?.list?.map((item: any, index: number) => {
                  item.index = index;
                  return item;
                });
              } else if (props.modalTitle == '选择商机') {
                list = result?.data?.list?.map((item: any, index: number) => {
                  item.index = index;
                  return item;
                });
              } else {
                list = result?.data?.dataList?.map((item: any, index: number) => {
                  item.index = index;
                  return item;
                });
              }

              return Promise.resolve({
                data: list,
                total: result.data.total,
                success: true,
              });
            } else {
              return Promise.resolve({});
            }
          }}
          search={{
            labelWidth: 'auto',
            span: 5,
            defaultCollapsed: false,
            collapseRender: false,
            className: 'search-form',
          }}
          rowSelection={{ type: 'radio', ...rowSelection }}
          options={false}
          rowKey="index"
          tableAlertRender={false}
          actionRef={ref}
          defaultSize="small"
          form={{ size: 'small' }}
          scroll={{ x: 200, y: 250 }}
          onRow={(record) => {
            return {
              onClick: () => {
                setSelectedRowKeys([record.index]);
                props.operateMethod([record]);
              }, // 点击行
              onDoubleClick: () => {
                props.operateMethod([record]);
                if (props.modalOK) {
                  props.modalOK();
                }
              },
            };
          }}
          pagination={{
            pageSize: ps,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      )}
    </div>
  );
};

export default ModalList;
