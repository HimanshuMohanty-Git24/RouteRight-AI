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
      console.log('📝 STORE: Plan data type:', typeof planData);
      console.log('📝 STORE: Plan data keys:', Object.keys(planData));
      console.log('📝 STORE: Plan data JSON:', JSON.stringify(planData));
      
      set({ isLoading: true, error: null });
      console.log('⏳ STORE: Set loading state to true');
      
      try {
        // First call debug endpoint to see what we're sending
        console.log('🔍 STORE: Calling debug endpoint first');
        const debugResponse = await fetch('http://localhost:8000/plan-debug', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(planData),
        });
        
        console.log('🔍 STORE: Debug response status:', debugResponse.status);
        
        // Now make the actual API call to the backend server
        console.log('📡 STORE: Making actual API call');
        const response = await fetch('http://localhost:8000/plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(planData),
        });
        
        console.log('📡 STORE: Response received, status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ STORE: Error response text:', errorText);
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('📦 STORE: Response data:', result);
        
        console.log('✅ STORE: Plan generation completed');
        console.log('📊 STORE: Setting result in store');
        
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
          isLoading: false 
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