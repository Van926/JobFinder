import React, { createContext, useState, useContext } from 'react';

interface Job {
  id: string;
  title: string;
  isApplied: boolean;
  isSaved?: boolean; // Add this to track saved status in main list
  // ... other job properties
}

interface JobContextType {
  jobs: Job[];
  savedJobs: Job[];
  saveJob: (job: Job) => void;
  removeJob: (id: string) => void;
  applyForJob: (jobId: string) => void;
  cancelApplication: (jobId: string) => void;
}

const JobContext = createContext<JobContextType>({} as JobContextType);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  const saveJob = (job: Job) => {
    const jobWithDefaults = { 
      ...job,
      isApplied: job.isApplied || false,
      isSaved: true 
    };

    setSavedJobs(prev => {
      const isAlreadySaved = prev.some(savedJob => savedJob.id === job.id);
      return isAlreadySaved ? prev : [...prev, jobWithDefaults];
    });

    // Also update the main jobs list to mark as saved
    setJobs(prev => prev.map(j => 
      j.id === job.id ? { ...j, isSaved: true } : j
    ));
  };

  const removeJob = (id: string) => {
    setSavedJobs(prev => prev.filter(job => job.id !== id));
    // Update main jobs list to mark as unsaved
    setJobs(prev => prev.map(j => 
      j.id === id ? { ...j, isSaved: false } : j
    ));
  };

  const applyForJob = (jobId) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isApplied: true } : job
    ));
    setSavedJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isApplied: true } : job
    ));
  };
  

  const cancelApplication = (jobId) => {
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