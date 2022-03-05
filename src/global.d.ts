import { Workbook, Topic } from 'xmind'
import { Dumper } from 'xmind/dist/utils/dumper'

declare global {
  interface Window {
    Workbook: typeof Workbook
    Topic: typeof Topic
    Dumper: typeof Dumper
  }
}