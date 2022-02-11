import { useRef, useState } from "react"
import 'xmind/dist/xmind-sdk.bundle.js'
import JsZip from 'jszip'
import FileSaver from 'file-saver'
import MindMap, { MindMapNode } from "./MindMap"
import type { Topic } from "xmind"

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

function treeNodeToTopic(topic: Topic, parentId: string | null, treeNode: MindMapNode) {
  const id = topic.on(parentId ?? topic.rootTopicId)
    .add({ title: treeNode.name })
    .cid()
  if (treeNode.children) {
    for (const child of treeNode.children) {
      treeNodeToTopic(topic, id, child)
    }
  }
}

const FolderToMind = (props: FolderToMindProps) => {

  const [treeNodes, setTreeNodes] = useState<MindMapNode[]>([])

  const handlerRef = useRef<FileSystemDirectoryHandle>()

  const chooseFolder = async () => {
    try {
      const handler = await window.showDirectoryPicker()
      handlerRef.current = handler
      refresh()
    } catch (error) {
      //
    }
  }

  const refresh = async () => {
    const tree = await getDirectoryStructure(handlerRef.current!)
    tree!.type = 'root'
    setTreeNodes([tree!])
  }

  const exportXMind = () => {
    const workbook = new window.Workbook()
    const topic = new window.Topic({sheet: workbook.createSheet('folders', handlerRef.current!.name)})
    for (const node of treeNodes[0].children!) {
      treeNodeToTopic(topic, null, node)
    }
    const dumper = new window.Dumper({workbook});

    const files = dumper.dumping();
    const zip = new JsZip()
    
    for (const file of files) {
      zip.file(file.filename, file.value)
    }

    zip.generateAsync({ type: 'blob' }).then(function (content) {
      FileSaver.saveAs(content, `${handlerRef.current!.name}.xmind`);
    })
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center">
        <button className="rounded bg-blue-500 h-8 text-white w-30" onClick={chooseFolder}>选择目录</button>
        <button className="rounded bg-blue-500 h-8 text-white ml-8 w-30" onClick={refresh}>刷新</button>
        <button className="rounded bg-blue-500 h-8 text-white ml-8 w-30" onClick={exportXMind}>导出XMind</button>
      </div>
      <div className="flex-1 overflow-auto">
        {treeNodes.length > 0 && <MindMap treeNodes={treeNodes} />}
      </div>
    </div>
  )
}

export default FolderToMind