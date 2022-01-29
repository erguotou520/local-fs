import { useRef } from 'react'

export interface MindMapNode {
  name: string
  type: 'root' | 'folder' | 'file'
  children?: MindMapNode[]
}

export interface MindMapProps {
  treeNodes: MindMapNode[]
}

const Node = ({ node }: { node: MindMapNode }) => {
  return (
   <div>
     <div>{node.name}</div>
      {node.children && node.children.map(child => <div key={node.name} className='pl-4'><Node node={child} /></div>)}
   </div>
  )
}

const MindMap = ({ treeNodes }: MindMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  return <div ref={containerRef}>
    {treeNodes.map(node => <Node key={node.name} node={node} />)}
  </div>
}

export default MindMap
