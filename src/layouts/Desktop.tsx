import bgImg from '../assets/desktop.jpg'
import DesktopApps from './DesktopApps'
import TaskBar from './TaskBar'

interface DesktopProps {
  children?: React.ReactNode;
}

const Desktop = ({ children }: DesktopProps) => {

  return (
    <div className="h-screen w-screen">
      <div className="bg-cover top-0 right-0 bottom-0 left-0 -z-1 fixed" style={{
        backgroundImage: `url("${bgImg}")`,
      }}></div>
      <DesktopApps />
      <TaskBar />
      {children}
    </div>
  )
}

export default Desktop