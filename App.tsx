// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { JobProvider } from './context/JobContext';
import { ThemeProvider } from './context/ThemeContext';
import JobFinderScreen from './screens/JobFinderScreen';
import SavedJobsScreen from './screens/SavedJobsScreen';
import CustomHeader from './components/CustomHeader';

const Stack = createStackNavigator();

const App = () => {
  return (
    <ThemeProvider>
      <JobProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="JobFinder"
            screenOptions={{
              header: ({ navigation, route }) => (
                <CustomHeader 
                  navigation={navigation}
                  route={route}
                  showBackButton={route.name !== 'JobFinder'}
                />
              ),
            }}
          >
            <Stack.Screen 
              name="JobFinder" 
              component={JobFinderScreen}
              options={{ title: 'JobFinder' }}
            />
            <Stack.Screen 
              name="SavedJobs" 
              component={SavedJobsScreen}
              options={{ title: 'Saved Jobs' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </JobProvider>
    </ThemeProvider>
  );
};

export default App;