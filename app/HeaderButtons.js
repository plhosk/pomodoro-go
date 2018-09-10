import React from 'react'
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons'
import { Ionicons } from '@expo/vector-icons' // eslint-disable-line

// define IconComponent, color, sizes and OverflowIcon in one place
const MaterialHeaderButton = props => (
  <HeaderButton {...props} IconComponent={Ionicons} iconSize={32} color="white" />
)

const MaterialHeaderButtons = props => (
  <HeaderButtons
    HeaderButtonComponent={MaterialHeaderButton}
    // OverflowIcon={<Ionicons icon="more-vert" size={23} color="white" />}
    {...props}
  />
)
// const { Item } = HeaderButtons.Item // eslint-disable-line prefer-destructuring

export { MaterialHeaderButtons, Item }
