
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { router, Redirect } from "expo-router";
import { colors } from "@/styles/commonStyles";

export default function HomeScreen() {
  // Redirect to welcome screen
  return <Redirect href="/welcome" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
