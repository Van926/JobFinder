// screens/JobFinderScreen.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { useJobs } from '../context/JobContext';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const JobFinderScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { saveJob } = useJobs();
  const { colors, toggleTheme, isDarkMode } = useTheme(); // Use theme colors and toggle function

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('https://remotive.io/api/remote-jobs');
      const data = await response.json();
      
      if (!data.jobs || !Array.isArray(data.jobs)) {
        throw new Error('Invalid jobs format');
      }

      const jobsWithIds = data.jobs.map((job) => ({
        id: job.id || uuidv4(),
        title: job.title || 'No Title',
        description: job.description || 'No Description',
        category: job.Category || 'Unknown Category',
        companyName: job.company_name || 'Unknown Company',
        jobType: job.job_type || 'Job Type Unspecified',
        locations: job.candidate_required_location ? [job.candidate_required_location] : ['Location not Specified'],
        minSalary: job.salary ? job.salary.split(' - ')[0] : 'Minimum Salary Unavailable',
        maxSalary: job.salary ? job.salary.split(' - ')[1] : 'Max Salary Unavailable',
      }));

      setJobs(jobsWithIds);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setError('Failed to fetch jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const applyForJob = (job) => {
    // Handle the apply action
    console.log('Applying for job:', job);
    alert('Apply button clicked!');
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.text} />
        <Text style={{ color: colors.text }}>Loading jobs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
        <TouchableOpacity onPress={fetchJobs} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        style={[styles.searchBar, { backgroundColor: colors.cardBackground, color: colors.text, borderColor: colors.border }]}
        placeholder="Search jobs..."
        placeholderTextColor={colors.text}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {filteredJobs.length > 0 ? (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.jobItem, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={{ color: colors.text }}>Company: {item.companyName}</Text>
              <Text style={{ color: colors.text }}>Job: {item.jobType}</Text>
        
              <Text style={{ color: colors.text }}>Location: {item.locations.join(', ')}</Text>
              <Text style={{ color: colors.text }}>
                Salary: {item.minSalary} - {item.maxSalary}
              </Text>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.buttonBackground }]}
                  onPress={() => saveJob(item)}
                >
                  <Text style={[styles.buttonText, { color: colors.buttonText }]}>Save Job</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.buttonBackground }]}
                  onPress={() => applyForJob(item)}
                >
                  <Text style={[styles.buttonText, { color: colors.buttonText }]}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={[styles.noJobsText, { color: colors.text }]}>No jobs found.</Text>
      )}
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
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  jobItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noJobsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JobFinderScreen;