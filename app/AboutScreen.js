import React from 'react'
import {
  StyleSheet, Text, ScrollView, View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons' // eslint-disable-line

import Anchor from './Anchor'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#375e97',
    padding: 8,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  normalText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },
  anchor: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
})

class AboutScreen extends React.Component {
  static navigationOptions = {
    title: 'About',
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.headerText}>
            Pomodoro Go
          </Text>
        </View>
        <View>
          <Text style={styles.normalText}>
            {'\n'}
            by Paul Hoskinson (
            <Anchor style={styles.anchor} href="mailto:plhosk@gmail.com">plhosk@gmail.com</Anchor>
            )
            {'\n\n'}
            View this project on&nbsp;
            <Anchor style={styles.anchor} href="https://github.com/plhosk/pomodoro-go">GitHub</Anchor>
            {'\n\n'}
            Check out some of&nbsp;
            <Anchor style={styles.anchor} href="https://paulhoskinson.surge.sh">my other Web and Mobile projects</Anchor>
          </Text>
        </View>
        <View>
          <Text style={styles.headerText}>
            {'\n'}
            Features
          </Text>
        </View>
        <View>
          <Text style={styles.normalText}>
            {'\n'}
            &nbsp;-&nbsp;Hone your focus and concentration according to the&nbsp;
            <Anchor style={styles.anchor} href="https://en.wikipedia.org/wiki/Pomodoro_Technique">Pomodoro Technique</Anchor>
            {'\n'}
            &nbsp;-&nbsp;Notifications signal a new activity
            {'\n'}
            &nbsp;-&nbsp;Customize activities according to your needs
            {'\n'}
            &nbsp;-&nbsp;Works in the background
          </Text>
        </View>
        <View>
          <Text style={styles.headerText}>
            {'\n'}
            Usage
          </Text>
        </View>
        <View>
          <Text style={styles.normalText}>
            {'\n'}
            &nbsp;-&nbsp;The Pomodoro Technique divides time between 25 minute work intervals and 5 minute breaks.
            {'\n'}
            &nbsp;-&nbsp;Press play to start a countdown timer.
            {'\n'}
            &nbsp;-&nbsp;When the activity is complete a notification appears.
            {'\n'}
            &nbsp;-&nbsp;Customize the name and duration of activities in the settings page.
          </Text>
        </View>
        <View>
          <Text style={styles.headerText}>
            {'\n\n\n'}
          </Text>
        </View>
      </ScrollView>
    )
  }
}

export default AboutScreen
