import { useEffect, useState } from "react"

interface WindowProps {
  title: string
  icon?: string
  visible?: boolean
  defaultMaximized?: boolean
  defaultSize?: [number, number]
  beforeClose?: () => boolean | void | Promise<boolean | void>
  onClose?: () => void
  children: React.ReactNode
}

const Window = ({ visible, onClose, title, icon, children, defaultMaximized = true, defaultSize = [640, 480], beforeClose }: WindowProps) => {
  const [[left, top], setPos] = useState([0, 0])

  const _onShow = () => {
    setPos([0, 0])
  }

  const _onClose = async () => {
    const result = await beforeClose?.()
    if (result === false) {
      return
    }
    onClose?.()
  }

  useEffect(() => {
    if (visible) {
      _onShow()
    }
  }, [visible])

  return visible ? (
    <div className={`absolute bg-white flex flex-col items-start rounded shadow max-w-screen max-h-[calc(100vh - 48px)]`} style={defaultMaximized ? {
      width: '100vw',
      height: 'calc(100vh - 48px)',
      left: `${left}px`,
      top: `${top}px`
    } : {
      width: defaultSize[0],
      height: defaultSize[1],
      left: `${left}px`,
      top: `${top}px`
    }}>
      <div className="flex h-[26px] w-full pl-6 items-center">
        {icon && <img src={icon} className="h-[14px] w-[14px]" />}
        <span className="text-sm text-black ml-1">{title}</span>
        <div className="flex ml-auto items-center">
          <div className="flex w-9 items-center justify-center group" onClick={_onClose}>
            <svg className="h-2 text-dark-300 w-2 group-hover:(w-3 h-3 text-dark-600) " viewBox="0 0 24 24">
              <g fill="none">
                <path d="M4.397 4.554l.073-.084a.75.75 0 0 1 .976-.073l.084.073L12 10.939l6.47-6.47a.75.75 0 1 1 1.06 1.061L13.061 12l6.47 6.47a.75.75 0 0 1 .072.976l-.073.084a.75.75 0 0 1-.976.073l-.084-.073L12 13.061l-6.47 6.47a.75.75 0 0 1-1.06-1.061L10.939 12l-6.47-6.47a.75.75 0 0 1-.072-.976l.073-.084l-.073.084z" fill="currentColor"></path>
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full overflow-auto">
        {children}
      </div>
    </div>
  ) : null
}

export default Window