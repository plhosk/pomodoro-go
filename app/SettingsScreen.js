import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  StyleSheet, Text, ScrollView, View, Switch, TouchableOpacity, Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons' // eslint-disable-line
import shortid from 'shortid'

import formatTime from '../core/formatTime'
import ActivityModal from './ActivityModal'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#375e97',
  },
  activityContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#999',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    backgroundColor: '#777',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  item: {
    flex: 1,
    padding: 16,
  },
  switchItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  itemText: {
    color: 'white',
    fontSize: 18,
  },
  itemTextSub: {
    fontSize: 14,
    color: '#ccc',
  },
  orderButton: {
    paddingLeft: 8,
    paddingRight: 8,
  },
})

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  }

  state = {
    activityModalVisible: false,
    activityModalName: '',
    activityModalHours: '',
    activityModalMinutes: '',
    activityModalSeconds: '',
    activityModalIndex: 0,
  }

  showActivityModal = (activity, index) => {
    this.setState({
      activityModalVisible: true,
      activityModalName: activity.name,
      activityModalHours: Math.floor(activity.duration / 3600).toString(),
      activityModalMinutes: Math.floor((activity.duration % 3600) / 60).toString(),
      activityModalSeconds: Math.floor(activity.duration % 60).toString(),
      activityModalIndex: index,
    })
  }

  submitActivityModal = () => {
    const { dispatch } = this.props
    const {
      activityModalName, activityModalHours, activityModalMinutes, activityModalSeconds, activityModalIndex,
    } = this.state
    dispatch({
      type: 'TIMER_ACTIVITY_UPDATE',
      payload: {
        name: activityModalName,
        duration: parseInt(activityModalHours || '0', 10) * 3600
          + parseInt(activityModalMinutes || '0', 10) * 60
          + parseInt(activityModalSeconds || '0', 10),
        index: activityModalIndex,
      },
    })
    this.setState({
      activityModalVisible: false,
    })
  }

  hideActivityModal = () => {
    this.setState({
      activityModalVisible: false,
    })
  }

  changeActivityName = (name) => {
    this.setState({
      activityModalName: name,
    })
  }

  changeActivityHours = (str) => {
    const nums = str ? str.match(/\d/g) : ['']
    this.setState({
      activityModalHours: nums.join(''),
    })
  }

  changeActivityMinutes = (str) => {
    const nums = str ? str.match(/\d/g) : ['']
    this.setState({
      activityModalMinutes: nums.join(''),
    })
  }

  changeActivitySeconds = (str) => {
    const nums = str ? str.match(/\d/g) : ['']
    this.setState({
      activityModalSeconds: nums.join(''),
    })
  }

  addActivity = () => {
    const { dispatch } = this.props
    dispatch({ type: 'TIMER_ACTIVITY_CREATE' })
  }

  swapActivities = (index1, index2) => {
    const { dispatch, activities } = this.props
    if (index1 < 0 || index1 >= activities.length
      || index2 < 0 || index2 >= activities.length) {
      return
    }
    dispatch({ type: 'TIMER_ACTIVITY_SWAP', payload: { index1, index2 } })
  }

  deleteActivity = (index) => {
    const { dispatch } = this.props
    dispatch({ type: 'TIMER_ACTIVITY_DELETE', payload: index })
  }

  toggleAutoStart = (value) => {
    const { dispatch } = this.props
    dispatch({ type: 'TIMER_AUTO_START', payload: value })
  }

  toggleAutoAdvance = (value) => {
    const { dispatch } = this.props
    dispatch({ type: 'TIMER_AUTO_ADVANCE', payload: value })
  }

  restoreDefaults = () => {
    const { dispatch } = this.props
    Alert.alert(
      'Restore Defaults',
      'Restore all settings to defaults?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Restore Defaults', onPress: () => dispatch({ type: 'RESET_STORE' }) },
      ],
    )
  }

  render() {
    const {
      activities, autoStart, autoAdvance,
    } = this.props
    const {
      activityModalVisible, activityModalName, activityModalHours, activityModalMinutes, activityModalSeconds,
    } = this.state
    return (
      <ScrollView style={styles.container}>
        <ActivityModal
          isVisible={activityModalVisible}
          name={activityModalName}
          hours={activityModalHours}
          minutes={activityModalMinutes}
          seconds={activityModalSeconds}
          submitModal={this.submitActivityModal}
          hideModal={this.hideActivityModal}
          changeName={this.changeActivityName}
          changeHours={this.changeActivityHours}
          changeMinutes={this.changeActivityMinutes}
          changeSeconds={this.changeActivitySeconds}
        />
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Customize Activities
          </Text>
        </View>
        {activities.map((activity, index) => (
          <View key={`${activity.name}-${shortid.generate()}`} style={styles.activityContainer}>
            <View style={styles.item}>
              <TouchableOpacity
                onPress={() => this.showActivityModal(activity, index)}
              >
                <View>
                  <Text style={styles.itemText}>
                    {`${activity.name}`}
                    {'\n'}
                    <Text style={styles.itemTextSub}>
                      {formatTime(activity.duration)}
                    </Text>
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.orderButton}>
              <TouchableOpacity
                onPress={() => this.swapActivities(index, index - 1)}
              >
                <Text>
                  <Ionicons name="md-arrow-up" size={32} color="white" />
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.orderButton}>
              <TouchableOpacity
                onPress={() => this.swapActivities(index, index + 1)}
              >
                <Text>
                  <Ionicons name="md-arrow-down" size={32} color="white" />
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.orderButton}>
              <TouchableOpacity
                onPress={() => this.deleteActivity(index)}
              >
                <Text>
                  <Ionicons name="md-trash" size={32} color="white" />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <TouchableOpacity
          onPress={this.addActivity}
        >
          <View style={styles.item}>
            <Text style={styles.itemText}>
              Add new activity...
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Timer Options
          </Text>
        </View>
        <View style={styles.activityContainer}>
          <View style={styles.switchItem}>
            <Text style={styles.itemText}>
              Start timer when starting app
            </Text>
            <Switch
              value={autoStart}
              onValueChange={this.toggleAutoStart}
            />
          </View>
        </View>
        <View style={styles.activityContainer}>
          <View style={styles.switchItem}>
            <Text style={styles.itemText}>
              Activity auto-advance
            </Text>
            <Switch
              value={autoAdvance}
              onValueChange={this.toggleAutoAdvance}
            />
          </View>
        </View>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Misc
          </Text>
        </View>
        <TouchableOpacity
          onPress={this.restoreDefaults}
        >
          <View style={styles.activityContainer}>
            <View style={styles.item}>
              <Text style={styles.itemText}>
                Restore all settings to defaults
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

SettingsScreen.propTypes = {
  dispatch: PropTypes.func.isRequired,
  activities: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  autoStart: PropTypes.bool.isRequired,
  autoAdvance: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  activities: state.timer.activities,
  autoStart: state.timer.autoStart,
  autoAdvance: state.timer.autoAdvance,
})

export default connect(mapStateToProps)(SettingsScreen)
