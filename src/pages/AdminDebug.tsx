import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, getSiteSettings } from '../services/profileService';
import { getProjects } from '../services/projectService';
import { getSkills } from '../services/skillService';
import { initialProfile, initialProjects, initialSkills } from '../data/initialData';

export const AdminDebug: React.FC = () => {
  const { user, isAdmin, isLoading, isLiveSupabase } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    const runTests = async () => {
      console.log('AdminDebug: Starting diagnostic tests...');
      
      const results: any = {
        timestamp: new Date().toISOString(),
        auth: {
          user: user?.email || 'none',
          isAdmin,
          isLoading,
          isLiveSupabase
        },
        services: {}
      };

      // Test profile service
      try {
        const profile = await getProfile();
        results.services.profile = { success: true, data: profile.full_name };
      } catch (error) {
        results.services.profile = { success: false, error: String(error) };
      }

      // Test projects service
      try {
        const projects = await getProjects();
        results.services.projects = { success: true, count: projects.length };
      } catch (error) {
        results.services.projects = { success: false, error: String(error) };
      }

      // Test skills service
      try {
        const skills = await getSkills();
        results.services.skills = { success: true, count: skills.length };
      } catch (error) {
        results.services.skills = { success: false, error: String(error) };
      }

      // Test initial data
      results.initialData = {
        profile: initialProfile.full_name,
        projects: initialProjects.length,
        skills: initialSkills.length
      };

      console.log('AdminDebug: Test results:', results);
      setTestResults(results);
    };

    runTests();
  }, [user, isAdmin, isLoading, isLiveSupabase]);

  useEffect(() => {
    setDebugInfo({
      url: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
      localStorage: {
        adminAuth: sessionStorage.getItem('dhipash_portfolio_admin_auth'),
        profile: localStorage.getItem('dhipash_portfolio_profile') ? 'exists' : 'none'
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#08090B] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Debug Console</h1>
        
        {/* Current State */}
        <div className="mb-8 p-6 bg-zinc-900 rounded-xl">
          <h2 className="text-xl font-bold mb-4 text-[#00E5FF]">Current State</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        {/* Test Results */}
        <div className="mb-8 p-6 bg-zinc-900 rounded-xl">
          <h2 className="text-xl font-bold mb-4 text-[#00E5FF]">Service Test Results</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>

        {/* Manual Actions */}
        <div className="p-6 bg-zinc-900 rounded-xl">
          <h2 className="text-xl font-bold mb-4 text-[#00E5FF]">Manual Actions</h2>
          <div className="space-y-4">
            <button 
              onClick={() => {
                sessionStorage.setItem('dhipash_portfolio_admin_auth', JSON.stringify({
                  email: 'admin@dhipash.dev',
                  isAdmin: true,
                  loginTime: new Date().toISOString()
                }));
                window.location.reload();
              }}
              className="px-4 py-2 bg-[#00E5FF] text-black rounded font-mono"
            >
              Set Local Admin Session
            </button>
            
            <button 
              onClick={() => {
                sessionStorage.clear();
                localStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded font-mono ml-4"
            >
              Clear All Storage
            </button>

            <div className="mt-4">
              <a href="/admin/simple" className="px-4 py-2 bg-green-600 text-white rounded font-mono inline-block">
                Go to Working Simple Admin
              </a>
              <a href="/admin" className="px-4 py-2 bg-blue-600 text-white rounded font-mono inline-block ml-4">
                Try Original Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};