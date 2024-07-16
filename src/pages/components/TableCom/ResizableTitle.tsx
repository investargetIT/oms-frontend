import { Resizable } from 'react-resizable';
// const ResizableTitle = (props: any) => {
//   const { onResize, width, ...restProps } = props;
//   const [offset, setOffset] = useState(0);
//   if (!width) {
//     return <th {...restProps} />;
//   }
//   return (
//     <Resizable
//       width={Number(width) + Number(offset)}
//       height={0}
//       handle={
//         <span
//           className="react-resizable-handle"
//           style={{ transform: 'translateX(${offset}px)' }}
//           onClick={(e) => {
//             e.stopPropagation();
//             e.preventDefault();
//           }}
//         />
//       }
//       onResizeStart={() => {
//         document.body.onselectstart = () => false;
//       }}
//       onResize={(e, { size }) => {
//         // 设置最小宽度，防止列被隐藏
//         const newWidth = size.width < 75 ? 75 : size.width;
//         setOffset(newWidth - width);
//       }}
//       onResizeStop={(...arg) => {
//         document.body.onselectstart = () => true;
//         setOffset(0);
//         onResize(...arg);
//       }}
//       draggableOpts={{
//         enableUserSelectHack: false,
//       }}
//     >
//       <th
//         {...restProps}
//         style={{
//           overflow: 'visible',
//           ...restProps.style,
//         }}
//       >
//         <div
//           style={{
//             width: '100%',
//             overflow: 'hidden',
//             whiteSpace: 'nowrap',
//             textOverflow: 'ellipsis',
//           }}
//         >
//           {restProps.children}
//         </div>
//       </th>
//     </Resizable>
//   );
// };
const ResizableTitle = (props: any) => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};
export default ResizableTitle;
