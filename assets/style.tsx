'use strict';
import { StyleSheet } from 'react-native';
// import { ScrollView, Button, TouchableOpacity, TextInput, View, Image, Text, ViewStyle, Switch, TextStyle, ActivityIndicator, ImageStyle, SafeAreaView }, from "react-native"
import { palette } from "../theme/palette"
import { color, spacing, typography } from "../theme"

module.exports = StyleSheet.create({
  FULL: { flex: 1, backgroundColor: '#FFFFFF' },
  ROOT: {
    flexDirection: "row",
    paddingHorizontal: spacing[4],
    alignItems: "center",
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
    justifyContent: "flex-start",
    backgroundColor: color.palette.orange
  },
  TITLE: { textAlign: "center", fontSize: 18 },
  TITLE_MIDDLE: { flex: 1, justifyContent: "center" },
  LEFT: { width: 32 },
  RIGHT: { width: 32 },
  CONTAINER: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[7]
  },
  TEXT: {
    color: color.palette.black,
    fontFamily: typography.primary,
    fontSize: 16
  },
  TEXTFIELD: {
    color: color.palette.orangeDarker,
    fontFamily: typography.primary,
    fontSize: 18,
    width: 300,
    height: 30,
    margin: 10
  },

  FIELD_TEXT: {
    color: color.palette.orangeDarker,
    fontFamily: typography.primary,
    fontSize: 22,
    borderWidth: 1,
    borderRadius: 61,
    borderColor: color.palette.orangeDarker
  },

  BOLD: { fontWeight: "bold" },

  BOWSER: {
    alignSelf: "center",
    marginVertical: spacing[2],
    maxWidth: "100%",
    width: 103,
    height: 150,
  },
  CONTENT: {
    fontFamily: typography.primary,
    color: color.palette.black,
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
    marginBottom: spacing[4],
    borderColor: color.palette.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 2
  },
  FIELD_BORDER: {
    fontFamily: typography.primary,
    color: color.palette.black,
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing[4],
    borderColor: color.palette.lightGrey,
    borderWidth: 1,
    borderRadius: 61,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 5
  },
  CONTINUE: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    backgroundColor: color.palette.orangeDarker,
    borderRadius: 61,
  },
  CONTINUE_TEXT: {
    color: color.palette.black,
    fontWeight: "bold",
    fontSize: 20,
    letterSpacing: 2,
    textAlign: "center",
  },
  ERROR_TEXT: {
    fontFamily: typography.primary,
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 2,
    color: palette.angry
  },

  FOOTER: { backgroundColor: "#FFFFFF" },
  FOOTER_CONTENT: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
  },

  LOADER: {
    flex: 1, justifyContent: "center", alignItems: "center"
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'stretch', // or 'cover'
  },
});