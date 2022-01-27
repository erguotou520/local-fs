import { useEffect, useRef } from 'react'
import G6 from '@antv/g6'

const { Util } = G6

export interface MindMapNode {
  name: string
  type: 'root' | 'folder' | 'file'
  children?: MindMapNode[]
}

export interface MindMapProps {
  treeNodes: MindMapNode[]
}

const colorArr = [
  '#5B8FF9',
  '#5AD8A6',
  '#5D7092',
  '#F6BD16',
  '#6F5EF9',
  '#6DC8EC',
  '#D3EEF9',
  '#DECFEA',
  '#FFE0C7',
  '#1E9493',
  '#BBDEDE',
  '#FF99C3',
  '#FFE0ED',
  '#CDDDFD',
  '#CDF3E4',
  '#CED4DE',
  '#FCEBB9',
  '#D3CEFD',
  '#945FB9',
  '#FF9845',
]

const MindMap = ({ treeNodes }: MindMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {   

    G6.registerNode(
      'dice-mind-map-root',
      {
        jsx: (cfg) => {
          const width = Util.getTextSize(cfg.label, 16)[0] + 24
          const stroke = cfg.style!.stroke || '#096dd9'

          return `
      <group>
        <rect draggable="true" style={{width: ${width}, height: 42, stroke: ${stroke}, radius: 4}} keyshape>
          <text style={{ fontSize: 16, marginLeft: 12, marginTop: 12 }}>${cfg.label}</text>
        </rect>
      </group>
    `
        },
        getAnchorPoints() {
          return [
            [0, 0.5],
            [1, 0.5],
          ]
        },
      },
      'single-node'
    )
    G6.registerNode(
      'dice-mind-map-sub',
      {
        jsx: (cfg) => {
          const width = Util.getTextSize(cfg.label, 14)[0] + 24
          const color = cfg.color || cfg.style!.stroke

          return `
      <group>
        <rect draggable="true" style={{width: ${width + 24}, height: 22}} keyshape>
          <text draggable="true" style={{ fontSize: 14, marginLeft: 12, marginTop: 6 }}>${cfg.label}</text>
        </rect>
        <rect style={{ fill: ${color}, width: ${width + 24}, height: 2, x: 0, y: 22 }} />
      </group>
    `
        },
        getAnchorPoints() {
          return [
            [0, 0.965],
            [1, 0.965],
          ]
        },
      },
      'single-node'
    )
    G6.registerNode(
      'dice-mind-map-leaf',
      {
        jsx: (cfg) => {
          const width = Util.getTextSize(cfg.label, 12)[0] + 24
          const color = cfg.color || cfg.style!.stroke

          return `
      <group>
        <rect draggable="true" style={{width: ${width + 20}, height: 26, fill: 'transparent' }}>
          <text style={{ fontSize: 12, marginLeft: 12, marginTop: 6 }}>${cfg.label}</text>
        </rect>
        <rect style={{ fill: ${color}, width: ${width + 24}, height: 2, x: 0, y: 32 }} />
      </group>
    `
        },
        getAnchorPoints() {
          return [
            [0, 0.965],
            [1, 0.965],
          ]
        },
      },
      'single-node'
    )
    G6.registerBehavior('scroll-canvas', {
      getEvents: function getEvents() {
        return {
          wheel: 'onWheel',
        }
      },

      onWheel: function onWheel(ev: any) {
        const { graph } = this as any
        if (!graph) {
          return
        }
        if (ev.ctrlKey) {
          const canvas = graph.get('canvas')
          const point = canvas.getPointByClient(ev.clientX, ev.clientY)
          let ratio = graph.getZoom()
          if (ev.wheelDelta > 0) {
            ratio += ratio * 0.05
          } else {
            ratio *= ratio * 0.05
          }
          graph.zoomTo(ratio, {
            x: point.x,
            y: point.y,
          })
        } else {
          const x = ev.deltaX || ev.movementX
          const y = ev.deltaY || ev.movementY || (-ev.wheelDelta * 125) / 3
          graph.translate(-x, -y)
        }
        ev.preventDefault()
      },
    })

    const dataTransform = (data: any) => {
      const changeData = (d: any, color?: string) => {
        const data = {
          ...d,
        }
        switch (d.type) {
          case 'root':
            data.type = 'dice-mind-map-root'
            break
          case 'folder':
            data.type = 'dice-mind-map-sub'
            break
          default:
            data.type = 'dice-mind-map-leaf'
            break
        }

        data.hover = false
        if (d.children) {
          data.children = d.children.map((child: any) => changeData(child))
        }
        return data
      }
      return changeData(data)
    }

    const container = containerRef.current!

    const width = container.scrollWidth
    const height = (container.scrollHeight || 500) - 20
    const tree = new G6.TreeGraph({
      container,
      width,
      height,
      fitView: true,
      fitViewPadding: [10, 20],
      layout: {
        type: 'mindmap',
        direction: 'H',
        getHeight: () => {
          return 16
        },
        getWidth: (node: any) => {
          return node.level === 0 ? Util.getTextSize(node.label, 16)[0] + 12 : Util.getTextSize(node.label, 12)[0]
        },
        getVGap: () => {
          return 10
        },
        getHGap: () => {
          return 60
        },
        getSide: (node: any) => {
          return node.data.direction
        },
      },
      defaultEdge: {
        type: 'cubic-horizontal',
        style: {
          lineWidth: 2,
        },
      },
      minZoom: 0.5,
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'dice-mindmap'],
      },
    })

    tree.data(dataTransform(treeNodes))

    tree.render()
  }, [])

  return <div ref={containerRef}></div>
}

export default MindMap
