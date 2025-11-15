
import { useNetworkState } from "expo-network";
import { Stack, router } from "expo-router";
import React, { useEffect } from "react";
import { SystemBars } from "react-native-edge-to-edge";
import "react-native-reanimated";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { AssessmentProvider } from "@/contexts/AssessmentContext";
import { useFonts } from "expo-font";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Custom theme with ImpactWon colors
const ImpactWonTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0D95FF',
    background: '#FFFDF9',
    card: '#FFFFFF',
    text: '#1F2B73',
    border: '#C1E6FF',
    notification: '#FF810C',
  },
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const colorScheme = useColorScheme();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const { isConnected } = useNetworkState();

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AssessmentProvider>
        <WidgetProvider>
          <ThemeProvider value={ImpactWonTheme}>
            <SystemBars style="auto" />
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="welcome" />
              <Stack.Screen name="competency/[section]" />
              <Stack.Screen name="results" />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
              <Stack.Screen
                name="formsheet"
                options={{
                  presentation: "formSheet",
                  sheetAllowedDetents: [0.5, 1],
                  sheetGrabberVisible: true,
                }}
              />
              <Stack.Screen
                name="transparent-modal"
                options={{
                  presentation: "transparentModal",
                  animation: "fade",
                }}
              />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </WidgetProvider>
      </AssessmentProvider>
    </GestureHandlerRootView>
  );
}
