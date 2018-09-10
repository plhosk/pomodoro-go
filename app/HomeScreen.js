import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  StyleSheet, Text, View, TouchableNativeFeedback, Platform,
} from 'react-native'
import { LinearGradient, Notifications } from 'expo'
import { createStackNavigator } from 'react-navigation'
import { Ionicons } from '@expo/vector-icons' // eslint-disable-line
import { fromLeft } from 'react-navigation-transitions'

import formatTime from '../core/formatTime'

import { MaterialHeaderButtons, Item } from './HeaderButtons'
import SettingsScreen from './SettingsScreen'
import AboutScreen from './AboutScreen'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#375e97',
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    // paddingTop: 16,
  },
  topText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.5)',
    paddingTop: 8,
    textAlign: 'center',
  },
  topTextActivity: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  centeredContainer: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  timerText: {
    // paddingTop: 16,
    color: 'white',
    fontSize: 84,
    textAlign: 'center',
  },
  buttons: {
    // width: 300,
    alignSelf: 'stretch',
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 0,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Pomodoro Go',
    headerRight: (
      <MaterialHeaderButtons>
        <Item
          title="settings"
          iconName="md-settings"
          onPress={navigation.getParam('openSettings')}
        />
      </MaterialHeaderButtons>
    ),
  })

  componentDidMount() {
    const { navigation, autoStart, dispatch } = this.props
    navigation.setParams({ openSettings: this.openSettings })
    this.resetTimer()
    dispatch({ type: 'TIMER_RESET' })
    if (autoStart) {
      dispatch({ type: 'TIMER_RUNNING', payload: true })
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('activity-completion-alerts', {
        name: 'Activity completion alerts',
        sound: true,
        vibrate: true,
        priority: 'high',
      })
    }
  }

  clearTimer = () => {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }

  resetTimer = () => {
    const { dispatch } = this.props
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    this.intervalId = setInterval(this.tick, 1000)
    dispatch({ type: 'TIMER_TIMESTAMP_MS', payload: Math.round((new Date()).getTime()) })
    this.rescheduleNotifications()
  }

  tick = () => {
    const {
      dispatch, running, autoAdvance, currentValue, currentActivityIndex, timestampMs,
    } = this.props
    if (running) {
      let adjustedCurrentValue = currentValue
      let adjustedCurrentActivityIndex = currentActivityIndex
      const currentMs = Math.round((new Date()).getTime())
      if (currentMs > (2500 + timestampMs)) {
        const offset = Math.round((currentMs - timestampMs) / 1000)
        const adjusted = this.computeAdjustedCurrentValue(offset)
        adjustedCurrentValue = adjusted.newValue
        adjustedCurrentActivityIndex = adjusted.newActivityIndex
        if (adjustedCurrentValue !== currentValue
        || adjustedCurrentActivityIndex !== currentActivityIndex) {
          dispatch({
            type: 'TIMER_WARP',
            payload: {
              value: adjustedCurrentValue,
              activityIndex: adjustedCurrentActivityIndex,
            },
          })
        }
      }
      if (adjustedCurrentValue === 0) {
        this.sendImmediateNotification()
        if (autoAdvance) {
          dispatch({ type: 'TIMER_ACTIVITY_ADVANCE' })
        } else {
          dispatch({ type: 'TIMER_RUNNING', payload: false })
        }
      } else {
        dispatch({ type: 'TIMER_DECREMENT' })
      }
    }
    dispatch({ type: 'TIMER_TIMESTAMP_MS', payload: Math.round((new Date()).getTime()) })
    this.rescheduleNotifications()
  }

  computeAdjustedCurrentValue = (offset) => {
    const {
      running, autoAdvance, currentValue, activities, currentActivityIndex,
    } = this.props
    if (!running) {
      return currentValue
    }
    if (!autoAdvance) {
      let newValue = currentValue - offset
      if (newValue > activities[currentActivityIndex].duration) {
        newValue = 0
      }
      return newValue
    }
    const cycleDuration = activities
      .map(activity => activity.duration)
      .reduce((acc, cur) => acc + cur)
      + activities.length
    let oldPosition = 0
    for (let i = 0; i < activities.length; i += 1) {
      if (currentActivityIndex > i) {
        oldPosition += activities[i].duration
      } else if (currentActivityIndex === i) {
        oldPosition += activities[i].duration - currentValue
      }
    }
    let newPosition = (oldPosition + offset) % cycleDuration

    let newValue = 0
    let newActivityIndex = 0
    for (let i = 0; i < activities.length; i += 1) {
      if (newPosition <= activities[i].duration) {
        newActivityIndex = i
        newValue = activities[i].duration - newPosition
        break
      }
      newPosition -= activities[i].duration + 1
    }

    // value will be decremented right away. add 1
    newValue += 1
    return { newValue, newActivityIndex }
  }

  generateActivityCompletedNotificationObject = (activityIndex) => {
    const { activities } = this.props
    return {
      title: 'Pomodoro Go',
      body: `Activity completed: ${activities[activityIndex].name}`,
      android: {
        channelId: 'activity-completion-alerts',
        icon: '../assets/icon.png',
      },
      ios: {
        sound: true,
      },
    }
  }

  openSettings = () => {
    const { navigation } = this.props
    navigation.navigate('Settings')
  }

  handlePressReset = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'TIMER_RESET',
    })
    this.resetTimer()
  }

  handlePressPlay = () => {
    const {
      dispatch, running, currentValue,
    } = this.props
    if (currentValue === 0 && !running) {
      dispatch({ type: 'TIMER_ACTIVITY_ADVANCE' })
      dispatch({ type: 'TIMER_RUNNING', payload: true })
    } else {
      dispatch({ type: 'TIMER_RUNNING', payload: !running })
    }
    this.resetTimer()
  }

  handlePressFastForward = () => {
    const { dispatch } = this.props
    dispatch({ type: 'TIMER_ACTIVITY_ADVANCE' })
    // reset timer
    this.resetTimer()
  }

  async sendImmediateNotification() {
    const { currentActivityIndex } = this.props
    const notification = this.generateActivityCompletedNotificationObject(currentActivityIndex)
    await Notifications.dismissAllNotificationsAsync()
    await Notifications.presentLocalNotificationAsync(notification)
  }

  async rescheduleNotifications() {
    const {
      running, autoAdvance, activities, currentValue, currentActivityIndex,
    } = this.props
    await Notifications.cancelAllScheduledNotificationsAsync()
    if (running) {
      // console.log('sep')
      if (!autoAdvance) {
        const time = (new Date()).getTime()
          + ((activities[currentActivityIndex].duration - currentValue + 1) * 1000)
        Notifications.scheduleLocalNotificationAsync(
          this.generateActivityCompletedNotificationObject(currentActivityIndex),
          {
            time: time + 1000,
          },
        )
      } else {
        const promises = []
        const cycleDuration = activities
          .map(activity => activity.duration)
          .reduce((acc, cur) => acc + cur)
          + activities.length
        let shifted = [...activities]
        shifted = shifted.concat(shifted.splice(0, currentActivityIndex))
        for (let i = 0; i < shifted.length; i += 1) {
          let time = (new Date()).getTime()
          for (let j = 0; j <= i; j += 1) {
            if (j === 0) {
              time += (currentValue + 1) * 1000
            } else {
              time += (shifted[j].duration + 1) * 1000
            }
          }
          let notifIndex = i - currentActivityIndex
          if (notifIndex < 0) notifIndex += shifted.length
          // set to 1 when intervalMs bug is fixed and uncomment the intervalMs line below
          const INTERVAL_MS_WORKAROUND_CYCLES = 4
          for (let cycleNumber = 0; cycleNumber < INTERVAL_MS_WORKAROUND_CYCLES; cycleNumber += 1) {
            const notifTime = time + (cycleNumber * cycleDuration * 1000) + 1000
            const schedulingOptions = {
              time: notifTime,
              // intervalMs: cycleDuration * 1000,
            }
            // console.log(notifIndex, Math.round((notifTime - (new Date()).getTime()) / 1000))
            promises.push(Notifications.scheduleLocalNotificationAsync(
              this.generateActivityCompletedNotificationObject(notifIndex), schedulingOptions,
            ))
          }
        }
        await Promise.all(promises)
      }
    }
  }

  render() {
    const {
      currentValue, running, activities, currentActivityIndex,
    } = this.props
    return (
      <View style={styles.container}>
        <LinearGradient
          style={styles.centeredContainer}
          colors={['#375e97', '#34675c']}
        >
          <View style={styles.centeredContainer}>
            <View style={styles.top}>
              <Text style={styles.topText}>
                Current Activity:
                {'\n'}
              </Text>
              <Text style={styles.topTextActivity}>
                {activities[currentActivityIndex].name}
              </Text>
            </View>
            <View>
              <Text
                style={styles.timerText}
              >
                {formatTime(currentValue)}
              </Text>
            </View>
            <View
              style={styles.buttons}
            >
              <TouchableNativeFeedback
                onPress={this.handlePressReset}
                background={TouchableNativeFeedback.Ripple('#999', true)}
              >
                <View style={styles.button}>
                  <Text>
                    <Ionicons name="md-undo" size={48} color="white" />
                  </Text>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback
                onPress={this.handlePressPlay}
                background={TouchableNativeFeedback.Ripple('#999', true)}
              >
                <View style={styles.button}>
                  <Text>
                    <Ionicons
                      name={running ? 'md-pause' : 'md-play'}
                      size={80}
                      color="white"
                    />
                  </Text>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback
                onPress={this.handlePressFastForward}
                background={TouchableNativeFeedback.Ripple('#999', true)}
              >
                <View style={styles.button}>
                  <Text>
                    <Ionicons name="md-skip-forward" size={48} color="white" />
                  </Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </LinearGradient>
      </View>
    )
  }
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({}).isRequired,
  dispatch: PropTypes.func.isRequired,
  currentValue: PropTypes.number.isRequired,
  running: PropTypes.bool.isRequired,
  autoStart: PropTypes.bool.isRequired,
  autoAdvance: PropTypes.bool.isRequired,
  activities: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currentActivityIndex: PropTypes.number.isRequired,
  timestampMs: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  currentValue: state.timer.currentValue,
  running: state.timer.running,
  autoStart: state.timer.autoStart,
  autoAdvance: state.timer.autoAdvance,
  activities: state.timer.activities,
  currentActivityIndex: state.timer.currentActivityIndex,
  timestampMs: state.timer.timestampMs,
})

const HomeScreenConnected = connect(mapStateToProps)(HomeScreen)

export default createStackNavigator({
  Home: HomeScreenConnected,
  Settings: SettingsScreen,
  About: AboutScreen,
}, {
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#375e97',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 24,
    },
  },
  transitionConfig: () => fromLeft(),
})
