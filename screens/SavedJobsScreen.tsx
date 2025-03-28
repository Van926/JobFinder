import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
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
    alert(`Application for ${application.jobTitle} submitted successfully!`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {savedJobs.length > 0 ? (
        <FlatList
          data={savedJobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.jobItem, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={{ color: colors.text }}>Company: {item.companyName}</Text>
              <Text style={{ color: colors.text }}>Type: {item.jobType}</Text>
              <Text style={{ color: colors.text }}>Location: {item.locations.join(', ')}</Text>

              {item.isApplied ? (
                <>
                  <Text style={[styles.appliedText, { color: colors.text }]}>
                    You have already applied
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: '#ff4444' }]}
                      onPress={() => cancelApplication(item.id)}
                    >
                      <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                        Cancel Application
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: colors.buttonBackground }]}
                      onPress={() => removeJob(item.id)}
                    >
                      <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.buttonBackground }]}
                    onPress={() => {
                      applyForJob(item.id);
                      setSelectedJob(item);
                      setIsFormVisible(true);
                    }}
                  >
                    <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                      Apply
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.buttonBackground }]}
                    onPress={() => removeJob(item.id)}
                  >
                    <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      ) : (
        <Text style={[styles.noJobsText, { color: colors.text }]}>
          No saved jobs found
        </Text>
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
  appliedText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginVertical: 8,
    textAlign: 'center',
    color: '#4CAF50',
  },
});

export default SavedJobsScreen;