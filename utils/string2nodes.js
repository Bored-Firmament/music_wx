export default function string2Nodes(keyword, value) {
  // 创建节点
  let nodes = []
  // 建议搜索 是否 包含 输入内容
  // 1.包含-拆分字符串,分别用rich-text的node格式编写
  // 2.不包含-直接用rich-text的node格式编写

  if(keyword.startsWith(value)) {
    const text1 = keyword.slice(0, value.length);
    const node1 = {
      name: 'span',
      attrs: { style: 'color: #2c8; font-size: 14px; font-weight: 800;' },
      children: [{ type: 'text', text: text1 }]
    }
    nodes.push(node1);
    
    const text2 = keyword.slice(value.length);
    const node2 = {
      name: 'span',
      attrs: { style: 'color: #000; font-size: 14px;' },
      children: [{ type: 'text', text: text2 }]
    }
    nodes.push(node2);
  } else {
    const node = {
      name: 'span',
      attrs: { style: 'color: #000; font-size: 14px;' },
      children: [{ type: 'text', text: keyword }]
    }
    nodes.push(node);
  }
  // 返回最终节点
  return nodes;
}