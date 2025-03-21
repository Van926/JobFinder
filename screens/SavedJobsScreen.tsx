// screens/SavedJobsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SavedJobsScreen = ({ navigation }) => {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    try {
      const savedJobs = await AsyncStorage.getItem('savedJobs');
      if (savedJobs) {
        setSavedJobs(JSON.parse(savedJobs));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={savedJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.jobItem}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text>{item.company}</Text>
            <Text>{item.location}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ApplicationForm', { jobId: item.id })}>
              <Text style={styles.applyButton}>Apply</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  jobItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  applyButton: {
    color: 'blue',
    marginTop: 8,
  },
});

export default SavedJobsScreen;