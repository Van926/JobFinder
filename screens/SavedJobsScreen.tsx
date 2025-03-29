import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { useJobs } from '../context/JobContext';
import { useTheme } from '../context/ThemeContext';
import ApplicationForm from './ApplicationFormScreen';

const SavedJobsScreen = () => {
  const { savedJobs, removeJob, applyForJob, cancelApplication } = useJobs();
  const { colors } = useTheme();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleSubmitApplication = (application) => {
    console.log('Application submitted:', application);
    setIsFormVisible(false);
    Alert.alert(
      'Application Submitted',
      `Your application for ${application.jobTitle} has been submitted successfully!`
    );
  };

  const handleRemoveJob = (jobId, jobTitle) => {
    Alert.alert(
      'Remove Job',
      `Are you sure you want to remove ${jobTitle} from your saved jobs?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            removeJob(jobId);
            Alert.alert('Job Removed', 'The job has been removed from your saved list');
          },
        },
      ]
    );
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setIsFormVisible(true);
  };

  const handleCancelApplication = (jobId, jobTitle) => {
    Alert.alert(
      'Cancel Application',
      `Are you sure you want to cancel your application for ${jobTitle}?`,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            cancelApplication(jobId);
            Alert.alert(
              'Application Cancelled',
              'Your application has been withdrawn'
            );
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {savedJobs.length > 0 ? (
        <FlatList
          data={savedJobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={[styles.jobItem, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={{ color: colors.text }}>Company: {item.companyName}</Text>
              <Text style={{ color: colors.text }}>Type: {item.jobType}</Text>
              <Text style={{ color: colors.text }}>Location: {item.locations?.join(', ') || 'Not specified'}</Text>

              {item.isApplied ? (
                <View style={styles.appliedContainer}>
                  <Text style={[styles.appliedText, { color: '#4CAF50' }]}>
                    ✓ Application Submitted
                  </Text>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#ff4444' }]}
                    onPress={() => handleCancelApplication(item.id, item.title)}
                  >
                    <Text style={[styles.buttonText, { color: 'white' }]}>
                      Cancel Application
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.buttonBackground }]}
                    onPress={() => handleApply(item)}
                  >
                    <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                      Apply
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#ff4444' }]}
                    onPress={() => handleRemoveJob(item.id, item.title)}
                  >
                    <Text style={[styles.buttonText, { color: 'white' }]}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.noJobsText, { color: colors.text }]}>
            No saved jobs found
          </Text>
          <Text style={[styles.hintText, { color: colors.text }]}>
            Save jobs from the Job Finder screen to see them here
          </Text>
        </View>
      )}

      <Modal visible={isFormVisible} animationType="slide">
        {selectedJob && (
          <ApplicationForm
            jobTitle={selectedJob.title}
            onSubmit={(application) => {
              applyForJob(selectedJob.id);
              handleSubmitApplication(application);
            }}
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
  listContainer: {
    paddingBottom: 20,
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
    marginBottom: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noJobsText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  appliedContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 120,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  appliedText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
  },
});

export default SavedJobsScreen;