import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../theme';

import ScanScreen from '../screens/ScanScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SearchScreen from '../screens/SearchScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import PlantDetailScreen from '../screens/PlantDetailScreen';
import StrainsTabScreen from '../screens/StrainsTabScreen';
import StrainDetailScreen from '../screens/StrainDetailScreen';
import ConsultantScreen from '../screens/ConsultantScreen';
import ToxinDetailScreen from '../screens/ToxinDetailScreen';
import PPFDScreen from '../screens/PPFDScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.parchment,
    card: Colors.parchment,
    text: Colors.ink,
    border: Colors.ink,
  },
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.parchment,
          borderTopColor: Colors.ink,
          borderTopWidth: 1,
          paddingBottom: 26,
          paddingTop: 8,
          height: 84,
        },
        tabBarActiveTintColor: Colors.ink,
        tabBarInactiveTintColor: Colors.highlightBrown,
        tabBarLabelStyle: {
          fontFamily: Fonts.medium,
          fontSize: 11,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'scan-outline';

          if (route.name === 'ScanTab') {
            iconName = focused ? 'scan' : 'scan-outline';
          } else if (route.name === 'HistoryTab') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'SearchTab') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'StrainsTab') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'ConsultantTab') {
            iconName = focused ? 'medical' : 'medical-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="ScanTab" component={ScanScreen} options={{ title: 'Scan' }} />
      <Tab.Screen name="SearchTab" component={SearchScreen} options={{ title: 'Search' }} />
      <Tab.Screen name="StrainsTab" component={StrainsTabScreen} options={{ title: 'Bud Bible' }} />
      <Tab.Screen name="ConsultantTab" component={ConsultantScreen} options={{ title: 'Consult' }} />
      <Tab.Screen name="HistoryTab" component={HistoryScreen} options={{ title: 'History' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.parchment,
            shadowOpacity: 0,
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: Colors.ink,
          },
          headerTintColor: Colors.ink,
          headerTitleStyle: {
            fontFamily: Fonts.handwritten,
            fontSize: 20,
          },
          cardStyle: { backgroundColor: Colors.parchment },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ title: 'Product Info' }}
        />
        <Stack.Screen
          name="PlantDetail"
          component={PlantDetailScreen}
          options={{ title: 'Plant Info' }}
        />
        <Stack.Screen
          name="StrainDetail"
          component={StrainDetailScreen}
          options={{ title: 'Strain Profile' }}
        />
        <Stack.Screen
          name="ToxinDetail"
          component={ToxinDetailScreen}
          options={{ title: 'Toxin Analysis' }}
        />
        <Stack.Screen
          name="PPFDMeter"
          component={PPFDScreen}
          options={{ title: 'Light Meter' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
