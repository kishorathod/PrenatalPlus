import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Ramp up to 50 users
    { duration: '1m', target: 200 },   // Ramp up to 200 users
    { duration: '2m', target: 500 },   // Ramp up to 500 users
    { duration: '3m', target: 500 },   // Stay at 500 users for 3 minutes
    { duration: '1m', target: 200 },   // Ramp down to 200
    { duration: '30s', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
    errors: ['rate<0.1'],              // Error rate should be below 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Generate test user credentials
function getTestUser(userId) {
  return {
    email: `patient${userId}@test.com`,
    password: 'Test@123',
  };
}

export default function () {
  const userId = Math.floor(Math.random() * 200) + 1; // Random user from 1-200
  const user = getTestUser(userId);

  // 1. Login
  const loginRes = http.post(`${BASE_URL}/api/auth/callback/credentials`, {
    email: user.email,
    password: user.password,
    redirect: 'false',
  });

  const loginSuccess = check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login response time < 1s': (r) => r.timings.duration < 1000,
  });

  if (!loginSuccess) {
    errorRate.add(1);
    return;
  }

  sleep(1);

  // Extract session cookie
  const cookies = loginRes.cookies;
  const sessionCookie = cookies['next-auth.session-token'] || cookies['__Secure-next-auth.session-token'];

  if (!sessionCookie) {
    errorRate.add(1);
    return;
  }

  const headers = {
    Cookie: `next-auth.session-token=${sessionCookie[0].value}`,
  };

  // 2. Access Dashboard
  const dashboardRes = http.get(`${BASE_URL}/patient/dashboard`, { headers });
  check(dashboardRes, {
    'dashboard status is 200': (r) => r.status === 200,
    'dashboard response time < 2s': (r) => r.timings.duration < 2000,
  }) || errorRate.add(1);

  sleep(2);

  // 3. View Vitals Page
  const vitalsRes = http.get(`${BASE_URL}/vitals`, { headers });
  check(vitalsRes, {
    'vitals page status is 200': (r) => r.status === 200,
    'vitals page response time < 2s': (r) => r.timings.duration < 2000,
  }) || errorRate.add(1);

  sleep(1);

  // 4. Fetch Vitals Data (API)
  const vitalsDataRes = http.get(`${BASE_URL}/api/vitals`, { headers });
  check(vitalsDataRes, {
    'vitals API status is 200': (r) => r.status === 200,
    'vitals API response time < 1s': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);

  sleep(2);

  // 5. Record New Vital (10% of users)
  if (Math.random() < 0.1) {
    const vitalData = {
      systolic: Math.floor(Math.random() * 30) + 110,
      diastolic: Math.floor(Math.random() * 20) + 70,
      heartRate: Math.floor(Math.random() * 40) + 60,
      weight: 60 + Math.random() * 20,
      week: Math.floor(Math.random() * 40) + 1,
    };

    const createVitalRes = http.post(
      `${BASE_URL}/api/vitals`,
      JSON.stringify(vitalData),
      {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      }
    );

    check(createVitalRes, {
      'create vital status is 200': (r) => r.status === 200 || r.status === 201,
      'create vital response time < 1.5s': (r) => r.timings.duration < 1500,
    }) || errorRate.add(1);

    sleep(1);
  }

  // 6. View Health Analytics (20% of users)
  if (Math.random() < 0.2) {
    const healthRes = http.get(`${BASE_URL}/patient/health`, { headers });
    check(healthRes, {
      'health page status is 200': (r) => r.status === 200,
      'health page response time < 2s': (r) => r.timings.duration < 2000,
    }) || errorRate.add(1);

    sleep(1);
  }

  sleep(Math.random() * 3 + 2); // Random sleep between 2-5 seconds
}
