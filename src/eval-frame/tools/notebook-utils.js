import { store } from '../store'

function viewModeIsEditor() {
  return store.getState().viewMode === 'EXPLORE_VIEW'
}

function isCommandMode() {
  return store.getState().mode === 'command' && viewModeIsEditor()
}

function viewModeIsPresentation() {
  return store.getState().viewMode === 'REPORT_VIEW'
}

function getCells() {
  return store.getState().cells
}

function getCellBelowSelectedId() {
  const { cells } = store.getState()
  const index = cells.findIndex(c => c.selected)
  if (index === cells.length - 1) {
    // if there is no cell below, return null
    return null
  } else if (index >= 0 && index < (cells.length - 1)) {
    return cells[index + 1].id
  }
  throw new Error('no cell currently selected')
}

function getCellAboveSelectedId() {
  const { cells } = store.getState()
  const index = cells.findIndex(c => c.selected)
  if (index === 0) {
    // if there is no cell above, return null
    return null
  } else if (index > 0 && index <= (cells.length - 1)) {
    return cells[index - 1].id
  }
  throw new Error('no cell currently selected')
}

function getCellById(cells, cellID) {
  // returns a reference to the cell.
  const thisCellIndex = cells.findIndex(c => c.id === cellID)
  const thisCell = cells[thisCellIndex]
  return thisCell
}

function prettyDate(time) {
  const date = new Date(time)
  const diff = (((new Date()).getTime() - date.getTime()) / 1000)
  const dayDiff = Math.floor(diff / 86400)
  // return date for anything greater than a day
  if (Number.isNaN(dayDiff) || dayDiff < 0 || dayDiff > 0) {
    return `${date.getDate()} ${date.toDateString().split(' ')[1]}`
  }

  return (
    (dayDiff === 0 && (
      (diff < 10 && 'just now') ||
      (diff < 30 && `${Math.floor(diff)} secs ago`) ||
      (diff < 60 && '30 secs ago') ||
      (diff < 120 && '1 min ago') ||
      (diff < 3600 && `${Math.floor(diff / 60)} mins ago`) ||
      (diff < 7200 && '1 hr ago') ||
      (diff < 86400 && `${Math.floor(diff / 3600)} hr ago`))
    ) ||
    (dayDiff === 1 && 'Yesterday') ||
    (dayDiff < 7 && `${dayDiff} days ago`) ||
    (dayDiff < 31 && `${Math.ceil(dayDiff / 7)} weeks ago`)
  )
}

function formatDateString(d) {
  const newd = new Date(d)
  return newd.toUTCString()
}

export {
  getCells,
  prettyDate,
  formatDateString,
  getCellById,
  getCellBelowSelectedId, getCellAboveSelectedId,
  isCommandMode,
  viewModeIsEditor, viewModeIsPresentation,
}