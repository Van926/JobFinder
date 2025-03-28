// components/CustomHeader.js
import React from 'react';
import { View, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Image } from 'expo-image';

const CustomHeader = ({ navigation, route, showBackButton }) => {
  const theme = useTheme();

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('JobFinder');
    }
  };

  const getTitle = () => {
    switch (route.name) {
      case 'JobFinder': return 'JobFinder';
      case 'SavedJobs': return 'Saved Jobs';
      default: return route.name;
    }
  };

  return (
    <SafeAreaView style={{ 
      flexDirection: 'row', 
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 16,
      paddingTop:20,
      height: 60,
      backgroundColor: theme.colors.headerBackground
    }}>
      {/* Left Side - Logo/Back Button + Title */}
      <SafeAreaView style={{ flexDirection: 'row', alignItems: 'center' }}>
        {showBackButton ? (
          <>
            <TouchableOpacity onPress={handleGoBack}>
              <MaterialIcons 
                name="arrow-back" 
                size={24} 
                color={theme.colors.headerText} 
              />
            </TouchableOpacity>
            <Text style={{ 
              color: theme.colors.headerText, 
              fontSize: 18, 
              fontWeight: 'bold',
              marginLeft: 10
            }}>
              {getTitle()}
            </Text>
          </>
        ) : (
          <>
           
            <Text style={{ 
              color: theme.colors.headerText, 
              fontSize: 18, 
              fontWeight: 'bold' 
            }}>
              {getTitle()}
            </Text>
          </>
        )}
      </SafeAreaView>

      {/* Right Side - Navigation/Theme Toggle */}
      <SafeAreaView style={{ flexDirection: 'row', alignItems: 'center' }}>
        {route.name === 'JobFinder' ? (
          <TouchableOpacity 
            onPress={() => navigation.navigate('SavedJobs')}
            style={{ marginRight: 20 }}
          >
            <Text style={{ color: theme.colors.headerText }}>Saved Jobs</Text>
          </TouchableOpacity>
        ) : null}
        
        <TouchableOpacity onPress={theme.toggleTheme}>
          <MaterialIcons
            name={theme.isDarkMode ? 'wb-sunny' : 'brightness-3'}
            size={24}
            color={theme.colors.headerText}
          />
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default CustomHeader;