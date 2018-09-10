import React from 'react'
import { Linking, Text } from 'react-native'

export default class Anchor extends React.Component {
  handlePress = () => {
    const { href, onPress } = this.props
    Linking.openURL(href)
    if (onPress) onPress()
  };

  render() {
    const { children } = this.props
    return (
      <Text {...this.props} onPress={this.handlePress}>
        {children}
      </Text>
    )
  }
}

// <Anchor href="https://google.com">Go to Google</Anchor>
// <Anchor href="mailto://support@expo.io">Email support</Anchor>
