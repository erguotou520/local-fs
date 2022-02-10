import { useEffect, useRef } from 'react'
import { Markmap } from 'markmap-view'

export interface MindMapNode {
  name: string
  type: 'root' | 'folder' | 'file'
  children?: MindMapNode[]
}

export interface MindMapProps {
  treeNodes: MindMapNode[]
}

type INode = NonNullable<Parameters<typeof Markmap.create>[2]>

function dataConvert(treeNode: MindMapNode, deep: number): INode {
  return {
    d: deep,
    t: treeNode.type,
    v: treeNode.name,
    c: treeNode.children ? treeNode.children.map(child => dataConvert(child, deep + 1)) : [],
  }
}

const MindMap = ({ treeNodes }: MindMapProps) => {
  const containerRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    Markmap.create(containerRef.current!, {}, dataConvert(treeNodes[0], 0))
  }, [])

  return <svg ref={containerRef} className="h-full w-full" />
}

export default MindMap
