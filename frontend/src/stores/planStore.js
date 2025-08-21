import { create } from 'zustand';

// Enhanced debugging for store
console.log('🏪 STORE: Initializing planStore');

const usePlanStore = create((set) => {
  console.log('🔧 STORE: Creating store with initial state');
  
  return {
    currentPlan: null,
    isLoading: false,
    progress: 0,
    currentStep: '',
    error: null,
    userLocation: null,

    setCurrentPlan: (plan) => set({ currentPlan: plan }),
    setLoading: (loading) => set({ isLoading: loading }),
    setProgress: (progress) => set({ progress }),
    setCurrentStep: (step) => set({ currentStep: step }),
    setError: (error) => {
      console.log('⚠️ STORE: Setting error:', error);
      set({ error });
    },
    setUserLocation: (location) => set({ userLocation: location }),

    reset: () => set({
      currentPlan: null,
      isLoading: false,
      progress: 0,
      currentStep: '',
      error: null
    }),

    generatePlan: async (planData) => {
      console.log('📋 STORE: Starting plan generation');
      console.log('📝 STORE: Plan data:', planData);
      
      set({ isLoading: true, error: null, progress: 10, currentStep: 'understanding' });
      console.log('⏳ STORE: Set loading state to true');
      
      try {
        // Step 1: Understanding (show for a good amount of time)
        console.log('📊 STORE: Step 1 - Understanding request');
        await new Promise(resolve => setTimeout(resolve, 1200));
        set({ progress: 15, currentStep: 'understanding' });
        
        // Step 2: Start searching
        set({ progress: 20, currentStep: 'searching' });
        console.log('📊 STORE: Step 2 - Starting search');
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // Debug endpoint call
        console.log('🔍 STORE: Calling debug endpoint first');
        const debugResponse = await fetch('http://localhost:8000/plan-debug', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(planData),
        });
        
        console.log('🔍 STORE: Debug response status:', debugResponse.status);
        
        // Show more searching progress
        set({ progress: 35, currentStep: 'searching' });
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Make the actual API call
        console.log('📡 STORE: Making actual API call');
        const response = await fetch('http://localhost:8000/plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(planData),
        });
        
        console.log('📡 STORE: Response received, status:', response.status);
        
        // Step 3: Validating stage with proper timing
        set({ progress: 55, currentStep: 'validating' });
        console.log('📊 STORE: Step 3 - Validating places');
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ STORE: Error response text:', errorText);
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        // Step 4: Optimizing stage  
        set({ progress: 75, currentStep: 'optimizing' });
        console.log('📊 STORE: Step 4 - Optimizing route');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const result = await response.json();
        console.log('📦 STORE: Response data:', result);
        
        // Step 5: Finalizing stage
        set({ progress: 90, currentStep: 'finalizing' });
        console.log('📊 STORE: Step 5 - Finalizing plan');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        console.log('✅ STORE: Plan generation completed');
        
        // Final step: Complete
        set({ progress: 100, currentStep: 'complete' });
        console.log('📊 STORE: Step 6 - Complete!');
        
        // Show completion for a moment before switching views
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set({ 
          currentPlan: result, 
          isLoading: false,
          error: null
        });
        
        console.log('🎉 STORE: Store state updated successfully');
        
      } catch (error) {
        console.error('❌ STORE: Error in generatePlan');
        console.error('🔍 STORE: Error details:', error);
        
        set({ 
          error: error.message, 
          isLoading: false,
          progress: 0,
          currentStep: 'error'
        });
        
        console.log('💥 STORE: Error state set');
      }
    },
    
    clearPlan: () => {
      console.log('🧹 STORE: Clearing plan data');
      set({ currentPlan: null, error: null });
      console.log('✅ STORE: Plan data cleared');
    }
  };
});

// Debug the store state changes
console.log('🏪 STORE: Store created successfully - Zustand store ready');

console.log('✅ STORE: planStore created successfully');

export default usePlanStore;