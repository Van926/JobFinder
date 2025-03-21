
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JobFinderScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
    loadSavedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('https://empllo.com/api/v1');
      setJobs(response.data.map(job => ({ ...job, id: uuidv4() })));
    } catch (error) {
      console.error(error);
    }
  };

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

  const saveJob = async (job) => {
    try {
      const newSavedJobs = [...savedJobs, job];
      await AsyncStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
      setSavedJobs(newSavedJobs);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search jobs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.jobItem}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text>{item.company}</Text>
            <Text>{item.location}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ApplicationForm', { jobId: item.id })}>
              <Text style={styles.applyButton}>Apply</Text>
            </TouchableOpacity>
            <Button title="Save" onPress={() => saveJob(item)} />
          </View>
        )}
      />
      <Button title="View Saved Jobs" onPress={() => navigation.navigate('SavedJobs')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
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

export default JobFinderScreen;