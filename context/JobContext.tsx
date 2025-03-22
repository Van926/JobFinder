
import React, { createContext, useState, useContext } from 'react';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState([]);

  const saveJob = (job) => {
    setSavedJobs((prevJobs) => {
      const isJobSaved = prevJobs.some((savedJob) => savedJob.id === job.id);
      alert('Job saved successfully!');
      if (!isJobSaved) {
        return [...prevJobs, job];
      }
      return prevJobs;
    });
  };

  const removeJob = (jobId) => {
    setSavedJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  };

  return (
    <JobContext.Provider value={{ savedJobs, saveJob, removeJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => useContext(JobContext);