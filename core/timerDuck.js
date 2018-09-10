import { persistReducer } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'timer',
  storage,
  blacklist: [
    'running',
    'currentValue',
    'currentActivityIndex',
    'timestampMs',
  ],
  reconciler: autoMergeLevel2,
}

const defaults = {
  activities: [
    { name: 'Focus', duration: 25 * 60 },
    { name: 'Break', duration: 5 * 60 },
    // { name: 'Focus', duration: 30 },
    // { name: 'Break', duration: 20 },
  ],
  // currentValue: 30,
  currentValue: 25 * 60,
  currentActivityIndex: 0,
  autoAdvance: true,
  autoStart: false,
  running: false,
  timestampMs: Math.round((new Date()).getTime()),
}

const reducer = (state = defaults, action) => {
  switch (action.type) {
    case 'TIMER_WARP':
      return {
        ...state,
        currentValue: action.payload.value,
        currentActivityIndex: action.payload.activityIndex,
      }
    case 'TIMER_TIMESTAMP_MS':
      return {
        ...state,
        timestampMs: action.payload,
      }
    case 'RESET_STORE':
      return {
        ...defaults,
        activities: [...defaults.activities],
      }
    case 'TIMER_DECREMENT':
      return {
        ...state,
        currentValue: state.currentValue - 1,
      }
    case 'TIMER_RUNNING':
      return {
        ...state,
        running: action.payload,
      }
    case 'TIMER_RESET':
      return {
        ...state,
        currentValue: state.activities[state.currentActivityIndex].duration,
      }
    case 'TIMER_AUTO_ADVANCE':
      return {
        ...state,
        autoAdvance: action.payload,
      }
    case 'TIMER_AUTO_START':
      return {
        ...state,
        autoStart: action.payload,
      }
    case 'TIMER_ACTIVITY_CREATE': {
      let num = 1
      const names = state.activities.map(activity => activity.name)
      while (names.includes(`New Activity ${num}`)) {
        num += 1
      }
      return {
        ...state,
        activities: [...state.activities, { name: `New Activity ${num}`, duration: 25 * 60 }],
      }
    }
    case 'TIMER_ACTIVITY_DELETE': {
      const activities = [...state.activities]
      let { currentActivityIndex, currentValue, running } = state
      activities.splice(action.payload, 1)
      if (currentActivityIndex >= action.payload) {
        if (currentActivityIndex > 0) {
          currentActivityIndex -= 1
        }
        if (activities.length === 0) {
          activities.push({
            name: 'New Activity 1',
            duration: 25 * 60,
          })
        }
        currentValue = activities[currentActivityIndex].duration
        if (running && !state.autoAdvance) {
          running = false
        }
      }
      return {
        ...state,
        activities,
        currentActivityIndex,
        currentValue,
        running,
      }
    }
    case 'TIMER_ACTIVITY_UPDATE': {
      // payload.index
      // payload.name
      // payload.duration
      const activities = [...state.activities]
      let { currentValue } = state
      // const { currentActivityIndex, running } = state

      // prevent duplicate names
      let newName = action.payload.name
      const names = state.activities.map(activity => activity.name)
      names.splice(action.payload.index, 1) // disregard previous name
      if (names.includes(newName)) {
        let num = 1
        while (names.includes(`${newName} (${num})`)) {
          num += 1
        }
        newName = `${newName} (${num})`
      }

      // activities[action.payload.index].name = newName
      // activities[action.payload.index].duration = action.payload.duration
      activities[action.payload.index] = { name: newName, duration: action.payload.duration }
      // activities[action.payload.index].duration = action.payload.duration
      // if ((running && currentActivityIndex === action.payload.index)
      if (currentValue > activities[state.currentActivityIndex].duration) {
        currentValue = activities[state.currentActivityIndex].duration
      }
      return {
        ...state,
        activities: [...activities],
        currentValue,
      }
    }
    case 'TIMER_ACTIVITY_SWAP': {
      // payload.index1
      // payload.index2
      const activity1 = { ...state.activities[action.payload.index1] }
      const activity2 = { ...state.activities[action.payload.index2] }
      const activities = [...state.activities]
      let { currentActivityIndex, currentValue } = state
      // activities[action.payload.index1].name = state.activities[action.payload.index2].name
      // activities[action.payload.index2].name = state.activities[action.payload.index1].name
      // activities[action.payload.index1].duration = state.activities[action.payload.index2].duration
      // activities[action.payload.index2].duration = state.activities[action.payload.index1].duration
      activities[action.payload.index1] = activity2
      activities[action.payload.index2] = activity1
      if (currentActivityIndex === action.payload.index1 || currentActivityIndex === action.payload.index2) {
        currentActivityIndex = Math.min(action.payload.index1, action.payload.index2)
        currentValue = activities[currentActivityIndex].duration
      }
      return {
        ...state,
        activities,
        currentActivityIndex,
        currentValue,
      }
    }
    case 'TIMER_ACTIVITY_ADVANCE': {
      let { currentActivityIndex } = state
      let { currentValue } = state
      if (state.currentActivityIndex >= (state.activities.length - 1)) {
        currentActivityIndex = 0
      } else {
        currentActivityIndex += 1
      }
      currentValue = state.activities[currentActivityIndex].duration
      return {
        ...state,
        currentActivityIndex,
        currentValue,
      }
    }
    default:
      return state
  }
}

const timerReducer = persistReducer(persistConfig, reducer)

// function* timerUpdate(action) {
//   try {

//   } catch (e) {
//     yield call(error => console.log(`Request full list error: ${error.message || ''}`), e)
//   }
// }

// function* timerSagas() {
//   yield takeLatest('TIMER_DECREMENT', timerUpdate)
// }

export { timerReducer } // eslint-disable-line import/prefer-default-export
