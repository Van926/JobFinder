import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { useJobs } from '../context/JobContext';
import { useTheme } from '../context/ThemeContext';
import ApplicationForm from './ApplicationFormScreen';

interface Job {
  id: string;
  title: string;
  mainCategory: string;
  companyName: string;
  jobType: string;
  locations: string[];
  workModel: string;
  seniorityLevel: string;
  isApplied?: boolean;
  isSaved?: boolean;
}

const JobFinderScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { savedJobs, saveJob, applyForJob, cancelApplication } = useJobs();
  const { colors } = useTheme();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('https://empllo.com/api/v1');
      const data = await response.json();
      
      if (!data.jobs || !Array.isArray(data.jobs)) {
        throw new Error('Invalid jobs format');
      }

      const jobsWithIds = data.jobs.map((job: Job) => ({
        id: uuidv4(),
        title: job.title || 'No Title',
        mainCategory: job.mainCategory || 'Unknown Category',
        companyName: job.companyName || 'Unknown Company',
        jobType: job.jobType || 'Job Type Unspecified',
        locations: job.locations || ['Location not Specified'],
        workModel: job.workModel || 'Work Model unspecified',
        seniorityLevel: job.seniorityLevel || 'Seniority Level unspecified',
        isApplied: false,
        isSaved: false
      }));
    
      setJobs(jobsWithIds);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setError('Failed to fetch jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job: Job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitApplication = (application: {
    name: string;
    email: string;
    contactNumber: string;
    hireReason: string;
    jobTitle: string;
  }) => {
    console.log('Application submitted:', application);
    setIsFormVisible(false);
    Alert.alert(
      'Application Submitted',
      `Your application for ${application.jobTitle} has been submitted successfully!`
    );
  };

  const isJobSavedOrApplied = (jobId: string) => {
    return savedJobs.some(job => job.id === jobId);
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
        style={[
          styles.searchBar,
          {
            backgroundColor: colors.cardBackground,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder="Search jobs..."
        placeholderTextColor={colors.text}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      {filteredJobs.length > 0 ? (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.jobItem, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={{ color: colors.text }}>Company: {item.companyName}</Text>
              <Text style={{ color: colors.text }}>Job: {item.jobType}</Text>
              <Text style={{ color: colors.text }}>Seniority Level: {item.seniorityLevel}</Text>
              <Text style={{ color: colors.text }}>Work Model: {item.workModel}</Text>
              <Text style={{ color: colors.text }}>Location: {item.locations.join(', ')}</Text>

              {isJobSavedOrApplied(item.id) ? (
                <View style={styles.savedStatusContainer}>
                  <Text style={[styles.statusText, { color: colors.text }]}>
                    {item.isApplied ? 'Already applied' : 'Job already saved'}
                  </Text>
                  <TouchableOpacity
                    style={[styles.navButton, { backgroundColor: colors.buttonBackground }]}
                    onPress={() => navigation.navigate('SavedJobs')}
                  >
                    <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                      View in Saved Jobs
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.buttonBackground }]}
                    onPress={() => {
                      saveJob(item);
                      Alert.alert(
                        'Job Saved',
                        `${item.title} has been saved to your list`,
                        [{ text: 'OK' }]
                      );
                    }}
                  >
                    <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                      Save Job
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.buttonBackground }]}
                    onPress={() => {
                      Alert.alert(
                        'Confirm Application',
                        `Are you sure you want to apply for ${item.title}?`,
                        [
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },
                          {
                            text: 'Apply',
                            onPress: () => {
                              applyForJob(item.id);
                              setSelectedJob(item);
                              setIsFormVisible(true);
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                      Apply
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      ) : (
        <Text style={[styles.noJobsText, { color: colors.text }]}>No jobs found.</Text>
      )}

      <Modal visible={isFormVisible} animationType="slide">
        {selectedJob && (
          <ApplicationForm
            jobTitle={selectedJob.title}
            onSubmit={handleSubmitApplication}
            onCancel={() => setIsFormVisible(false)}
          />
        )}
      </Modal>
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
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  savedStatusContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  navButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 200,
  },
});

export default JobFinderScreen;