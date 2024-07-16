import { Table, Modal, Space, Form, Button } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import type { FormInstance } from 'antd/lib/form';
import ProductLine from '@/pages/components/ProductLine';
import Segment from '@/pages/components/Segment';
import Category from '@/pages/components/Category';
import Family from '@/pages/components/Family';
import './SpecialTable.less';
interface EditableRowProps {
  index: number;
}
const EditableContext = React.createContext<FormInstance<any> | null>(null);
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: any;
  handleSave: (record: any) => void;
}
const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const form = useContext(EditableContext)!;
  const toggleEdit = () => {
    setEditing(!editing);
    // if (record[dataIndex]) {
    //   const newVal: any = {};
    //   newVal[dataIndex] = record[dataIndex];
    //   form?.setFieldsValue(newVal);
    // }
  };
  const save = async (val: any, option: any) => {
    try {
      const newVal: any = {};
      newVal[dataIndex] = val;
      form?.setFieldsValue(newVal);
      setEditing(!editing);
      if (dataIndex === 'productLineCode')
        handleSave({
          ...record,
          productLineCode: val,
          productLineName: option.name,
          segmentCode: '',
          segmentName: '',
          categoryName: '',
          categoryCode: '',
          familyName: '',
          familyCode: '',
        });
      else if (dataIndex === 'segmentCode')
        handleSave({
          ...record,
          segmentCode: val,
          segmentName: option.name,
          categoryName: '',
          categoryCode: '',
          familyName: '',
          familyCode: '',
        });
      else if (dataIndex === 'familyCode')
        handleSave({
          ...record,
          familyCode: val,
          familyName: option.name,
          categoryName: '',
          categoryCode: '',
        });
      else if (dataIndex === 'categoryCode')
        handleSave({ ...record, categoryCode: val, categoryName: option.name });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  const showItemName = () => {
    if (dataIndex === 'productLineCode') return record.productLineName;
    else if (dataIndex === 'segmentCode') return record.segmentName;
    else if (dataIndex === 'familyCode') return record.familyName;
    else if (dataIndex === 'categoryCode') return record.categoryName;
    else return children || ' ';
  };
  if (editable) {
    childNode = editing ? (
      <React.Fragment>
        {dataIndex === 'productLineCode' && (
          <Form.Item
            style={{ margin: 0 }}
            name={`${dataIndex.toString()}`}
            initialValue={record[dataIndex]}
            rules={[
              {
                required: true,
                message: `请填写${title}`,
              },
            ]}
          >
            <ProductLine isEdit={false} onChange={save} />
          </Form.Item>
        )}
        {dataIndex === 'segmentCode' && record.productLineCode && (
          <Form.Item
            style={{ margin: 0 }}
            name={`${dataIndex.toString()}`}
            initialValue={record[dataIndex]}
            rules={[
              {
                required: true,
                message: `请填写${title}`,
              },
            ]}
          >
            <Segment isEdit={false} parentId={record.productLineCode} onChange={save} />
          </Form.Item>
        )}
        {dataIndex === 'familyCode' && record.segmentCode && (
          <Form.Item
            style={{ margin: 0 }}
            name={`${dataIndex.toString()}`}
            initialValue={record[dataIndex]}
            rules={[
              {
                required: true,
                message: `请填写${title}`,
              },
            ]}
          >
            <Category isEdit={false} parentId={record.segmentCode} onChange={save} />
          </Form.Item>
        )}
        {dataIndex === 'categoryCode' && record.familyCode && (
          <Form.Item
            style={{ margin: 0 }}
            name={`${dataIndex.toString()}`}
            initialValue={record[dataIndex]}
            rules={[
              {
                required: true,
                message: `请填写${title}`,
              },
            ]}
          >
            <Family isEdit={false} parentId={record.familyCode} onChange={save} />
          </Form.Item>
        )}
      </React.Fragment>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {showItemName()}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
const SpecialTable: React.FC<{ columns: any; dataSource: any; getData: any }> = ({
  columns,
  dataSource,
  getData,
}) => {
  const [form] = Form.useForm();
  const [productLineCode, setProductLineCode]: any = useState('');
  const [segmentCode, setSegmentCode]: any = useState('');
  const [categoryCode, setCategoryCode]: any = useState('');
  const [isPlVisible, setIsPlVisible]: any = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [defaultColumns, setDefaultColumns] = useState<any[]>([]);
  const handleSave = (row: any) => {
    const newData = JSON.parse(JSON.stringify(list));
    const index = newData.findIndex((item: any) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setList(newData);
    getData(newData);
  };
  useEffect(() => {
    setList(dataSource);
    const newcolumns = columns?.map((col: any) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: any) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave,
        }),
      };
    });
    setDefaultColumns(newcolumns);
  }, [dataSource, columns]);
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const handleOk = () => {
    const btachVal: any = form.getFieldsValue();
    const newVal = JSON.parse(JSON.stringify(list)).map((item: any) => {
      return { ...item, ...btachVal };
    });
    setList(newVal);
    getData(newVal);
    setIsPlVisible(false);
  };
  return (
    <div>
      <Space>
        <Button
          type="primary"
          onClick={() => {
            setIsPlVisible(true);
          }}
        >
          批量设置
        </Button>
      </Space>
      <Table
        rowClassName={() => 'editable-row'}
        scroll={{ x: 150 }}
        size="small"
        rowKey={'sid'}
        components={components}
        bordered
        dataSource={list}
        columns={defaultColumns}
      />
      <Modal
        title="批量设置产线"
        destroyOnClose={true}
        visible={isPlVisible}
        onOk={handleOk}
        onCancel={() => {
          setIsPlVisible(false);
        }}
      >
        <Form form={form}>
          <Form.Item name="productLineName" style={{ display: 'none' }} />
          <Form.Item name="segmentName" style={{ display: 'none' }} />
          <Form.Item name="categoryName" style={{ display: 'none' }} />
          <Form.Item name="familyName" style={{ display: 'none' }} />
          <Form.Item
            label="Product"
            name="productLineCode"
            rules={[{ required: true, message: '请选择产品线' }]}
          >
            <ProductLine
              isEdit={false}
              onChange={(val: any, option: any) => {
                setProductLineCode(val);
                form.setFieldsValue({
                  productLineName: option.name,
                  segmentCode: '',
                  segmentName: '',
                  categoryName: '',
                  categoryCode: '',
                  familyName: '',
                  familyCode: '',
                });
              }}
            />
          </Form.Item>
          <Form.Item
            label="Segment"
            name="segmentCode"
            rules={[{ required: true, message: '请选择segment' }]}
          >
            <Segment
              isEdit={false}
              parentId={productLineCode}
              onChange={(val: any, option: any) => {
                setSegmentCode(val);
                form.setFieldsValue({
                  segmentName: option.name,
                  categoryName: '',
                  categoryCode: '',
                  familyName: '',
                  familyCode: '',
                  sourcingGpRate: option.sourcinggprate,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            label="Family"
            name="familyCode"
            rules={[{ required: true, message: '请选择Family' }]}
          >
            <Family
              isEdit={false}
              parentId={categoryCode}
              onChange={(val: any, option: any) => {
                setCategoryCode(val);
                form.setFieldsValue({
                  familyName: option.name,
                  categoryName: '',
                  categoryCode: '',
                  sourcingGpRate: option.sourcinggprate,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            label="Category"
            name="categoryCode"
            rules={[{ required: true, message: '请选择Category' }]}
          >
            <Category
              isEdit={false}
              parentId={segmentCode}
              onChange={(val: any, option: any) => {
                form.setFieldsValue({
                  categoryName: option.name,
                  sourcingGpRate: option.sourcinggprate,
                });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default SpecialTable;
