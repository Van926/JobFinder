import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ApplicationForm = ({ onSubmit, onCancel, jobTitle }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [hireReason, setHireReason] = useState('');
  const [errors, setErrors] = useState({});
  const { colors } = useTheme();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10,15}$/;
    return re.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!validatePhone(contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid phone number (10-15 digits)';
    }
    if (!hireReason.trim()) newErrors.hireReason = 'Please tell us why we should hire you';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert(
        'Confirm Submission',
        'Are you sure you want to submit this application?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Submit',
            onPress: () => {
              onSubmit({
                name,
                email,
                contactNumber,
                hireReason,
                jobTitle
              });
            },
          },
        ]
      );
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Apply for: {jobTitle}</Text>
      
      <View>
        <TextInput 
          style={[
            styles.input, 
            { 
              backgroundColor: colors.cardBackground, 
              color: colors.text, 
              borderColor: errors.name ? '#ff4444' : colors.border 
            }
          ]}
          placeholder="Name"
          placeholderTextColor={colors.text}
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) setErrors({...errors, name: ''});
          }}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>
      
      <View>
        <TextInput
          style={[
            styles.input, 
            { 
              backgroundColor: colors.cardBackground, 
              color: colors.text, 
              borderColor: errors.email ? '#ff4444' : colors.border 
            }
          ]}
          placeholder="Email"
          placeholderTextColor={colors.text}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors({...errors, email: ''});
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>
      
      <View>
        <TextInput
          style={[
            styles.input, 
            { 
              backgroundColor: colors.cardBackground, 
              color: colors.text, 
              borderColor: errors.contactNumber ? '#ff4444' : colors.border 
            }
          ]}
          placeholder="Contact Number"
          placeholderTextColor={colors.text}
          value={contactNumber}
          onChangeText={(text) => {
            setContactNumber(text);
            if (errors.contactNumber) setErrors({...errors, contactNumber: ''});
          }}
          keyboardType="phone-pad"
        />
        {errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}
      </View>
      
      <View>
        <TextInput
          style={[
            styles.input, 
            { 
              backgroundColor: colors.cardBackground, 
              color: colors.text, 
              borderColor: errors.hireReason ? '#ff4444' : colors.border,
              height: 100,
              textAlignVertical: 'top'
            }
          ]}
          placeholder="Why should we hire you?"
          placeholderTextColor={colors.text}
          value={hireReason}
          onChangeText={(text) => {
            setHireReason(text);
            if (errors.hireReason) setErrors({...errors, hireReason: ''});
          }}
          multiline
        />
        {errors.hireReason && <Text style={styles.errorText}>{errors.hireReason}</Text>}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.buttonBackground }]}
          onPress={handleSubmit}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Submit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: colors.border }]}
          onPress={onCancel}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
        </TouchableOpacity>
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
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  submitButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 120,
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ApplicationForm;