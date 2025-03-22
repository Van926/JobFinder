// screens/SavedJobsScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { useJobs } from '../context/JobContext';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const SavedJobsScreen = () => {
  const { savedJobs, removeJob } = useJobs();
  const { colors } = useTheme(); // Use theme colors
  const [isFormVisible, setIsFormVisible] = useState(false); // State to control modal visibility
  const [selectedJob, setSelectedJob] = useState(null); // Track the selected job for applying
  const [name, setName] = useState(''); // Form fields
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [hireReason, setHireReason] = useState('');

  const applyForJob = (job) => {
    setSelectedJob(job); // Set the selected job
    setIsFormVisible(true); // Show the form modal
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Application submitted for job:', selectedJob);
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Contact Number:', contactNumber);
    console.log('Why should we hire you?', hireReason);

    // Reset form fields and close modal
    setName('');
    setEmail('');
    setContactNumber('');
    setHireReason('');
    setIsFormVisible(false);
    alert('Application submitted successfully!');
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
              <Text style={{ color: colors.text }}>{item.companyName}</Text>
              <Text style={{ color: colors.text }}>{item.jobType}</Text>
              <Text style={{ color: colors.text }}>{item.locations.join(', ')}</Text>
              <Text style={{ color: colors.text }}>
                Salary: {item.minSalary} - {item.maxSalary}
              </Text>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.buttonBackground }]}
                  onPress={() => applyForJob(item)}
                >
                  <Text style={[styles.buttonText, { color: colors.buttonText }]}>Apply</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.buttonBackground }]}
                  onPress={() => removeJob(item.id)}
                >
                  <Text style={[styles.buttonText, { color: colors.buttonText }]}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={[styles.noJobsText, { color: colors.text }]}>No saved jobs found.</Text>
      )}

      {/* Application Form Modal */}
      <Modal visible={isFormVisible} animationType="slide" transparent={false}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Application Form</Text>

          {/* Form Fields */}
          <TextInput
            style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.text, borderColor: colors.border }]}
            placeholder="Name"
            placeholderTextColor={colors.text}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.text, borderColor: colors.border }]}
            placeholder="Email"
            placeholderTextColor={colors.text}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.text, borderColor: colors.border }]}
            placeholder="Contact Number"
            placeholderTextColor={colors.text}
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.text, borderColor: colors.border, height: 100 }]}
            placeholder="Why should we hire you?"
            placeholderTextColor={colors.text}
            value={hireReason}
            onChangeText={setHireReason}
            multiline
          />

          {/* Submit and Cancel Buttons */}
          <View style={styles.modalButtonContainer}>
            <Button title="Submit" onPress={handleSubmit} />
            <Button title="Cancel" onPress={() => setIsFormVisible(false)} />
          </View>
        </View>
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
  modalContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default SavedJobsScreen;