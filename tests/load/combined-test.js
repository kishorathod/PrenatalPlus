import http from 'k6/http';
import { sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { THRESHOLDS, LOAD_PROFILES } from './config.js';
import {
  loginScenario,
  dashboardScenario,
  vitalsScenario,
  createVitalScenario,
  healthAnalyticsScenario,
} from './scenarios.js';

const errorRate = new Rate('errors');

export const options = {
  scenarios: {
    // Scenario 1: Users logging in
    login_users: {
      executor: 'constant-vus',
      vus: 100,
      duration: '3m',
      exec: 'loginFlow',
      tags: { scenario: 'login' },
    },
    
    // Scenario 2: Users browsing dashboard
    dashboard_users: {
      executor: 'ramping-vus',
      startVUs: 20,
      stages: [
        { duration: '30s', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '1m', target: 200 },
        { duration: '30s', target: 0 },
      ],
      exec: 'dashboardFlow',
      tags: { scenario: 'dashboard' },
    },
    
    // Scenario 3: Users recording vitals
    vitals_users: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 50,
      maxVUs: 300,
      stages: [
        { duration: '1m', target: 50 },
        { duration: '2m', target: 100 },
        { duration: '1m', target: 50 },
        { duration: '30s', target: 0 },
      ],
      exec: 'vitalsFlow',
      tags: { scenario: 'vitals' },
    },
    
    // Scenario 4: Users viewing analytics
    analytics_users: {
      executor: 'constant-arrival-rate',
      rate: 30,
      timeUnit: '1s',
      duration: '3m',
      preAllocatedVUs: 50,
      maxVUs: 100,
      exec: 'analyticsFlow',
      tags: { scenario: 'analytics' },
    },
  },
  thresholds: THRESHOLDS,
};

// Setup function - runs once before all scenarios
export function setup() {
  console.log('🚀 Starting combined load test...');
  console.log('📊 Running 4 concurrent scenarios');
  return {};
}

// Scenario 1: Login Flow
export function loginFlow() {
  const loginRes = loginScenario();
  
  if (loginRes.status !== 200) {
    errorRate.add(1);
  }
  
  sleep(Math.random() * 2 + 1);
}

// Scenario 2: Dashboard Flow
export function dashboardFlow() {
  const loginRes = loginScenario();
  
  if (loginRes.status === 200) {
    const cookies = loginRes.cookies;
    const sessionCookie = cookies['next-auth.session-token']?.[0]?.value;
    
    if (sessionCookie) {
      dashboardScenario(sessionCookie);
    } else {
      errorRate.add(1);
    }
  } else {
    errorRate.add(1);
  }
  
  sleep(Math.random() * 3 + 2);
}

// Scenario 3: Vitals Flow
export function vitalsFlow() {
  const loginRes = loginScenario();
  
  if (loginRes.status === 200) {
    const cookies = loginRes.cookies;
    const sessionCookie = cookies['next-auth.session-token']?.[0]?.value;
    
    if (sessionCookie) {
      vitalsScenario(sessionCookie);
      
      // 30% of users create a new vital
      if (Math.random() < 0.3) {
        createVitalScenario(sessionCookie);
      }
    } else {
      errorRate.add(1);
    }
  } else {
    errorRate.add(1);
  }
  
  sleep(Math.random() * 2 + 1);
}

// Scenario 4: Analytics Flow
export function analyticsFlow() {
  const loginRes = loginScenario();
  
  if (loginRes.status === 200) {
    const cookies = loginRes.cookies;
    const sessionCookie = cookies['next-auth.session-token']?.[0]?.value;
    
    if (sessionCookie) {
      healthAnalyticsScenario(sessionCookie);
    } else {
      errorRate.add(1);
    }
  } else {
    errorRate.add(1);
  }
  
  sleep(Math.random() * 3 + 2);
}

// Teardown function - runs once after all scenarios
export function teardown(data) {
  console.log('✅ Combined load test completed');
}
