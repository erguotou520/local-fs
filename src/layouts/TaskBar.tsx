interface TaskBarProps {
  //
}

const TaskBar = (props: TaskBarProps) => {

  return (
    <div className="flex bg-[rgba(243,243,243,0.85)] h-12 text-black w-screen bottom-0 z-100 absolute items-center" style={{
      backdropFilter: 'saturate(3) blur(20px)'
    }}>
      
    </div>
  )
}

export default TaskBar