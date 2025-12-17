// Configuration for load tests
export const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
export const TEST_USERS = 200;
export const PASSWORD = "Test@123";

// Test thresholds
export const THRESHOLDS = {
  http_req_duration: ['p(95)<2000', 'p(99)<3000'],
  http_req_failed: ['rate<0.05'],
  errors: ['rate<0.1'],
};

// Load profiles
export const LOAD_PROFILES = {
  smoke: {
    stages: [
      { duration: '30s', target: 10 },
      { duration: '1m', target: 10 },
      { duration: '30s', target: 0 },
    ],
  },
  load: {
    stages: [
      { duration: '30s', target: 50 },
      { duration: '1m', target: 200 },
      { duration: '2m', target: 500 },
      { duration: '3m', target: 500 },
      { duration: '1m', target: 200 },
      { duration: '30s', target: 0 },
    ],
  },
  stress: {
    stages: [
      { duration: '1m', target: 200 },
      { duration: '2m', target: 500 },
      { duration: '2m', target: 1000 },
      { duration: '3m', target: 1000 },
      { duration: '2m', target: 500 },
      { duration: '1m', target: 0 },
    ],
  },
  spike: {
    stages: [
      { duration: '10s', target: 500 },
      { duration: '1m', target: 500 },
      { duration: '10s', target: 0 },
    ],
  },
  endurance: {
    stages: [
      { duration: '2m', target: 200 },
      { duration: '30m', target: 200 },
      { duration: '2m', target: 0 },
    ],
  },
};

// Helper to get random test user
export function getTestUser(userId = null) {
  const id = userId || Math.floor(Math.random() * TEST_USERS) + 1;
  return {
    email: `patient${id}@test.com`,
    password: PASSWORD,
  };
}

// Helper to generate random vital data
export function generateVitalData() {
  return {
    systolic: Math.floor(Math.random() * 30) + 110,
    diastolic: Math.floor(Math.random() * 20) + 70,
    heartRate: Math.floor(Math.random() * 40) + 60,
    weight: 60 + Math.random() * 20,
    week: Math.floor(Math.random() * 40) + 1,
  };
}
