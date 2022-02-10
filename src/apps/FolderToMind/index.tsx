import { useState } from "react"
import MindMap, { MindMapNode } from "./MindMap"

interface FolderToMindProps {
  
}

async function getDirectoryStructure(handler: FileSystemHandle, deep = 0): Promise<MindMapNode | undefined> {
  if (handler.kind === 'file') {
    return Promise.resolve(
      {
        name: handler.name,
        type: 'file',
      }
    )
  } else {
    if (deep > 7) {
      return
    }
    const ret: MindMapNode = {
      name: handler.name,
      type: 'folder',
      children: []
    }
    for await (const file of (handler as FileSystemDirectoryHandle).values()) {
      const child = await getDirectoryStructure(file, deep + 1)
      if (child) {
        ret.children!.push(child)
      }
    }
    return ret
  }
}

const FolderToMind = (props: FolderToMindProps) => {

  const [treeNodes, setTreeNodes] = useState<MindMapNode[]>([])

  const chooseFolder = async () => {
    try {
      const handler = await window.showDirectoryPicker()

      const tree = await getDirectoryStructure(handler)
      tree!.type = 'root'
      setTreeNodes([tree!])
    } catch (error) {
      //
    }
  }

  return (
    <div className="flex flex-col h-full p-4">
      <button className="rounded bg-blue-500 h-8 text-white w-30" onClick={chooseFolder}>选择目录</button>
      <div className="flex-1 overflow-auto">
        {treeNodes.length > 0 && <MindMap treeNodes={treeNodes} />}
      </div>
    </div>
  )
}

export default FolderToMind