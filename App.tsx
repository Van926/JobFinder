// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { JobProvider } from './context/JobContext';
import { ThemeProvider, useTheme } from './context/ThemeContext'; // Import useTheme
import JobFinderScreen from './screens/JobFinderScreen';
import SavedJobsScreen from './screens/SavedJobsScreen';
import { TouchableOpacity, View, Text } from 'react-native'; // Import necessary components

const Stack = createStackNavigator();

// Create a custom header component to use the theme
const AppHeader = ({ navigation }) => {
  const theme = useTheme(); // Use theme context

  return (
    <View style={styles.headerRightContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('SavedJobs')} style={styles.headerButton}>
        <Text style={{ color: theme.colors.headerText }}>Saved Jobs</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          console.log('Theme toggle icon pressed'); // Debug log
          theme.toggleTheme();
        }}
        style={styles.themeToggleButton}
      >
        <MaterialIcons
          name={theme.isDarkMode ? 'wb-sunny' : 'brightness-3'}
          size={24}
          color={theme.colors.headerText}
        />
      </TouchableOpacity>
    </View>
  );
};

// Main App component
export default function App() {
  return (
    <ThemeProvider>
      <JobProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={({ navigation }) => {
              const theme = useTheme(); // Use theme context here
              return {
                headerStyle: {
                  backgroundColor:'orange',
                },
                headerTintColor: 'black',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              };
            }}
          >
            <Stack.Screen
              name="JobFinder"
              component={JobFinderScreen}
              options={({ navigation }) => {
                const theme = useTheme(); // Use theme context here
                return {
                  title: 'LinkedOut',
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('JobFinder')} style={styles.headerButton}>
                      <Text style={{ color: theme.colors.headerText }}>JobFinder</Text>
                    </TouchableOpacity>
                  ),
                  headerRight: () => <AppHeader navigation={navigation} />,
                };
              }}
            />
            <Stack.Screen
              name="SavedJobs"
              component={SavedJobsScreen}
              options={{
                title: 'Saved Jobs',
              
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </JobProvider>
    </ThemeProvider>
  );
}

const styles = {
  headerButton: {
    marginHorizontal: 10,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggleButton: {
    marginHorizontal: 10,
  },
};