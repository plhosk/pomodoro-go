import React from 'react'
import PropTypes from 'prop-types'
import {
  Text, TouchableOpacity, View, StyleSheet, ScrollView, Modal, TextInput,
} from 'react-native'

const styles = StyleSheet.create({
  modal: {
    // flex: 0.7,
    // // width: '80%',
    // flexDirection: 'column',
    // alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#375e97',
    padding: 10,
    flex: 2,
    width: '100%',
    margin: 0,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    margin: 2,
  },
  closeButton: {
    color: 'white',
    fontSize: 20,
    backgroundColor: '#40a9ff',
    marginTop: 30,
    padding: 10,
    textAlign: 'center',
    borderRadius: 4,
  },
  cancelButton: {
    color: 'white',
    fontSize: 20,
    backgroundColor: '#aaa',
    marginTop: 30,
    padding: 10,
    textAlign: 'center',
    borderRadius: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  duration: {
    margin: 8,
  },
  durationContainerStyle: {
    width: 88,
    flex: 1,
    flexDirection: 'column',
  },
  inputName: {
    // height: 40,
    fontSize: 20,
    padding: 10,
    color: 'white',
    borderColor: '#aaa',
  },
  inputNumber: {
    // height: 40,
    fontSize: 20,
    padding: 10,
    color: 'white',
    borderColor: '#aaa',
    width: 88,
  },
})

class ActivityModal extends React.Component {
  render() {
    const {
      isVisible, name, hours, minutes, seconds, submitModal, hideModal,
      changeName, changeHours, changeMinutes, changeSeconds,
    } = this.props
    return (
      <Modal
        visible={isVisible}
        animationType="slide"
        onRequestClose={hideModal}
      >
        <ScrollView contentContainerStyle={styles.modal}>
          <View>
            <Text style={styles.inputName}>
              Activity Name
            </Text>
          </View>
          <TextInput
            style={styles.inputName}
            value={name}
            onChangeText={changeName}
          />
          <View style={styles.durationContainer}>
            <View style={styles.durationContainerStyle}>
              <View>
                <Text style={styles.inputName}>
                  Hours
                </Text>
              </View>
              <View style={styles.duration}>
                <TextInput
                  style={styles.inputNumber}
                  value={hours}
                  onChangeText={changeHours}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.durationContainerStyle}>
              <View>
                <Text style={styles.inputName}>
                  Minutes
                </Text>
              </View>
              <View style={styles.duration}>
                <TextInput
                  style={styles.inputNumber}
                  value={minutes}
                  onChangeText={changeMinutes}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.durationContainerStyle}>
              <View>
                <Text style={styles.inputName}>
                  Seconds
                </Text>
              </View>
              <View style={styles.duration}>
                <TextInput
                  style={styles.inputNumber}
                  value={seconds}
                  onChangeText={changeSeconds}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.buttons}>
            <View style={styles.button}>
              <TouchableOpacity onPress={hideModal}>
                <Text style={styles.cancelButton}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity onPress={submitModal}>
                <Text style={styles.closeButton}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    )
  }
}

ActivityModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  hours: PropTypes.string.isRequired,
  minutes: PropTypes.string.isRequired,
  seconds: PropTypes.string.isRequired,
  submitModal: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  changeName: PropTypes.func.isRequired,
  changeHours: PropTypes.func.isRequired,
  changeMinutes: PropTypes.func.isRequired,
  changeSeconds: PropTypes.func.isRequired,
}

export default ActivityModal
