import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
})

export const planAPI = {
  createPlan: async (planData, onProgress) => {
    console.log('📡 PLAN API: Starting createPlan');
    console.log('📡 PLAN API: FormData received:', planData);
    console.log('📡 PLAN API: OnUpdate callback type:', typeof onProgress);
    
    try {
      // Convert the frontend format to backend format
      const planDataConverted = {
        user_text: planData.text,
        lat: planData.lat,
        lng: planData.lng
      };
      
      console.log('🔄 PLAN API: Converted data for backend:', planDataConverted);
      
      // Simulate progress updates for better UX
      console.log('📊 PLAN API: Sending progress update - Understanding');
      onProgress({ type: 'progress', data: { progress: 20, step: 'understanding', message: 'Understanding your request...' } });
      
      setTimeout(() => {
        console.log('📊 PLAN API: Sending progress update - Searching');
        onProgress({ type: 'progress', data: { progress: 40, step: 'searching', message: 'Searching for places...' } });
      }, 500);
      
      setTimeout(() => {
        console.log('📊 PLAN API: Sending progress update - Validating');
        onProgress({ type: 'progress', data: { progress: 60, step: 'validating', message: 'Validating options...' } });
      }, 1000);
      
      setTimeout(() => {
        console.log('📊 PLAN API: Sending progress update - Optimizing');
        onProgress({ type: 'progress', data: { progress: 80, step: 'optimizing', message: 'Optimizing route...' } });
      }, 1500);
      
      // Make the actual API call
      console.log('📡 PLAN API: Making API call to backend');
      const response = await fetch(`${API_BASE_URL}/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planDataConverted),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create plan');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop(); // Keep the last, possibly incomplete, message

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              onProgress(data);
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ PLAN API: Error occurred:', error);
      console.error('❌ PLAN API: Error type:', typeof error);
      console.error('❌ PLAN API: Error message:', error.message);
      console.error('❌ PLAN API: Error stack:', error.stack);
      
      onProgress({ 
        type: 'error', 
        data: { 
          message: error.message || 'Failed to generate plan' 
        } 
      });
    }
  },

  submitFeedback: async (planId, feedbackData) => {
    console.log('📤 API: Submitting feedback for plan:', planId);
    console.log('📤 API: Feedback data:', feedbackData);
    
    try {
      const response = await api.post('/feedback', feedbackData);
      console.log('✅ API: Feedback submitted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ API: Feedback submission failed:', error);
      console.error('❌ API: Error response:', error.response?.data);
      throw error;
    }
  },
}

export const locationAPI = {
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      )
    })
  }
}
// Enhanced debugging for API calls
console.log('🔧 API: Service initialized with base URL:', API_BASE_URL);
console.log('🔧 API: Service initialized with base URL:', API_BASE_URL);

// Test API connection on load
console.log('🧪 API: Testing connection to backend...');
fetch('http://localhost:8000/test')
  .then(response => {
    console.log('🧪 API: Test response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('🧪 API: Test response data:', data);
  })
  .catch(error => {
    console.error('🧪 API: Test connection failed:', error);
  });

export const generateRoute = async (routeData) => {
  console.log('🌐 API: Starting route generation request');
  console.log('📝 API: Request data:', JSON.stringify(routeData, null, 2));
  console.log('🔗 API: Target URL:', `${API_BASE_URL}/generate-route`);
  
  try {
    console.log('📡 API: Sending POST request...');
    const startTime = performance.now();
    
    const response = await fetch(`${API_BASE_URL}/generate-route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(routeData),
    });

    const requestTime = performance.now() - startTime;
    console.log(`⏱️ API: Request completed in ${requestTime.toFixed(2)}ms`);
    console.log('📊 API: Response status:', response.status);
    console.log('📊 API: Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error('❌ API: HTTP error detected');
      console.error('🔍 API: Status:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('📄 API: Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('✅ API: Response OK, parsing JSON...');
    const result = await response.json();
    console.log('🎉 API: Route generation successful!');
    console.log('📋 API: Response structure:', Object.keys(result));
    console.log('📋 API: Full response:', JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error('❌ API: Critical error in generateRoute');
    console.error('🔍 API: Error type:', error.constructor.name);
    console.error('📝 API: Error message:', error.message);
    console.error('📚 API: Error stack:', error.stack);
    throw error;
  }
};