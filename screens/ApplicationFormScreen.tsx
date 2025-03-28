// components/ApplicationForm.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ApplicationForm = ({ onSubmit, onCancel, jobTitle }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [hireReason, setHireReason] = useState('');
  const { colors } = useTheme();

  const handleSubmit = () => {
    onSubmit({
      name,
      email,
      contactNumber,
      hireReason,
      jobTitle
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Apply for: {jobTitle}</Text>
      
      <TextInput 
        style={[styles.input, { 
          backgroundColor: colors.cardBackground, 
          color: colors.text, 
          borderColor: colors.border 
        }]}
        placeholder="Name"
        placeholderTextColor={colors.text}
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.cardBackground, 
          color: colors.text, 
          borderColor: colors.border 
        }]}
        placeholder="Email"
        placeholderTextColor={colors.text}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.cardBackground, 
          color: colors.text, 
          borderColor: colors.border 
        }]}
        placeholder="Contact Number"
        placeholderTextColor={colors.text}
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.cardBackground, 
          color: colors.text, 
          borderColor: colors.border,
          height: 100,
          textAlignVertical: 'top'
        }]}
        placeholder="Why should we hire you?"
        placeholderTextColor={colors.text}
        value={hireReason}
        onChangeText={setHireReason}
        multiline
      />

      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={handleSubmit} />
        <Button title="Cancel" onPress={onCancel} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default ApplicationForm;