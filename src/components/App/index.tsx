import { useEffect, useState } from "react"
import Window from '../Window'

interface AppProps {
  className?: string
  title: string
  icon: string
  iconSize?: 'small' | 'normal' | 'large'
  trigger?: 'click' | 'dblclick'
  beforeStart?: () => void
  onStarted?: () => void
  beforeClose?: () => boolean | void | Promise<boolean | void>
  onClosed?: () => void
  appTrigger: React.ReactNode
  children: React.ReactNode
}

const App = ({ className, title, icon, appTrigger, children, trigger = 'dblclick', beforeStart, onStarted, beforeClose, onClosed }: AppProps) => {
  const [visible, setVisible] = useState(false)

  const onClick = (_trigger: string) => {
    if (_trigger === trigger) {
      beforeStart?.()
      setVisible(true)
    }
  }

  const _onClose = () => {
    setVisible(false)
  }

  useEffect(() => {
    if (visible) {
      onStarted?.()
    } else {
      onClosed?.()
    }
  }, [visible, onStarted, onClosed ])

  return (
    <>
      <div className={className} onClick={() => onClick('click')} onDoubleClick={() => onClick('dblclick')}>
        {appTrigger}
      </div>
      <Window title={title} visible={visible} icon={icon} beforeClose={beforeClose} onClose={_onClose}>
        {children}
      </Window>
    </>
  )
}

export default App