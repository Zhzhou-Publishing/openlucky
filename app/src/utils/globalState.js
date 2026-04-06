/**
 * Global state management for the application
 */
import { reactive } from 'vue'

export const globalState = reactive({
  isSaveAllClicked: false
})

export function setSaveAllClicked(value) {
  console.log('Global state isSaveAllClicked changed:', globalState.isSaveAllClicked, '->', value)
  globalState.isSaveAllClicked = value
}

export function getSaveAllClicked() {
  return globalState.isSaveAllClicked
}
