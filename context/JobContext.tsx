// context/JobContext.js
import React, { createContext, useState, useContext } from 'react';

interface Job {
  id: string;
  title: string;
  // ... other job properties
  isApplied: boolean; // Add this new field
}

interface JobContextType {
  jobs: Job[];
  savedJobs: Job[];
  saveJob: (job: Job) => void;
  removeJob: (id: string) => void;
  applyForJob: (jobId: string) => void; // Add this new function
  cancelApplication: (jobId: string) => void; // Add this new function
}

const JobContext = createContext<JobContextType>({} as JobContextType);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  const saveJob = (job: Job) => {
    setSavedJobs(prev => {
      
      const isAlreadySaved = prev.some(savedJob => savedJob.id === job.id);
      if (isAlreadySaved) {
        return prev; // Return previous state if already saved
      }
      return [...prev, job];
      
    });
  };

  const removeJob = (id: string) => {
    setSavedJobs(prev => prev.filter(job => job.id !== id));
  };

  const applyForJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isApplied: true } : job
    ));
    setSavedJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isApplied: true } : job
    ));
  };

  const cancelApplication = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isApplied: false } : job
    ));
    setSavedJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isApplied: false } : job
    ));
  };

  return (
    <JobContext.Provider value={{ 
      jobs, 
      savedJobs, 
      saveJob, 
      removeJob,
      applyForJob,
      cancelApplication
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => useContext(JobContext);