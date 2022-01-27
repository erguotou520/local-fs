import apps from "../apps"
import App from "../components/App"

interface DesktopAppsProps {
  //
}

const DesktopApps = (props: DesktopAppsProps) => {

  return (
    <div className="flex flex-col flex-wrap">
      {apps.map(app => (
        <App key={app.name} title={app.name} icon={app.icon} className="flex flex-col h-[86px] m-1 w-19 items-center justify-center"
          appTrigger={
            <>
              <img src={app.icon} className="h-9 w-9" />
              <div className="mt-1 text-center text-sm text-shadow text-[#fafafa]">{app.name}</div>
            </>
          }>
          {<app.app />}
        </App>
      ))}
    </div>
  )
}

export default DesktopApps