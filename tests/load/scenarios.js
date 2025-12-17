import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, getTestUser, generateVitalData } from './config.js';

// Individual scenario functions
export function loginScenario() {
  const user = getTestUser();
  
  const res = http.post(`${BASE_URL}/api/auth/callback/credentials`, {
    email: user.email,
    password: user.password,
    redirect: 'false',
  });

  check(res, {
    'login successful': (r) => r.status === 200,
    'login fast': (r) => r.timings.duration < 1000,
  });

  sleep(1);
  return res;
}

export function dashboardScenario(sessionCookie) {
  const headers = {
    Cookie: `next-auth.session-token=${sessionCookie}`,
  };

  const res = http.get(`${BASE_URL}/patient/dashboard`, { headers });
  
  check(res, {
    'dashboard loaded': (r) => r.status === 200,
    'dashboard fast': (r) => r.timings.duration < 2000,
  });

  sleep(2);
  return res;
}

export function vitalsScenario(sessionCookie) {
  const headers = {
    Cookie: `next-auth.session-token=${sessionCookie}`,
  };

  // View vitals page
  http.get(`${BASE_URL}/vitals`, { headers });
  sleep(1);

  // Fetch vitals data
  const res = http.get(`${BASE_URL}/api/vitals`, { headers });
  
  check(res, {
    'vitals fetched': (r) => r.status === 200,
    'vitals fast': (r) => r.timings.duration < 1000,
  });

  sleep(1);
  return res;
}

export function createVitalScenario(sessionCookie) {
  const headers = {
    Cookie: `next-auth.session-token=${sessionCookie}`,
    'Content-Type': 'application/json',
  };

  const vitalData = generateVitalData();
  
  const res = http.post(
    `${BASE_URL}/api/vitals`,
    JSON.stringify(vitalData),
    { headers }
  );

  check(res, {
    'vital created': (r) => r.status === 200 || r.status === 201,
    'create fast': (r) => r.timings.duration < 1500,
  });

  sleep(1);
  return res;
}

export function healthAnalyticsScenario(sessionCookie) {
  const headers = {
    Cookie: `next-auth.session-token=${sessionCookie}`,
  };

  const res = http.get(`${BASE_URL}/patient/health`, { headers });
  
  check(res, {
    'health analytics loaded': (r) => r.status === 200,
    'analytics fast': (r) => r.timings.duration < 2000,
  });

  sleep(2);
  return res;
}
