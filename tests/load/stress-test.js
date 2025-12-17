import { Rate } from 'k6/metrics';
import { THRESHOLDS, LOAD_PROFILES } from './config.js';
import {
  loginScenario,
  dashboardScenario,
  vitalsScenario,
} from './scenarios.js';

const errorRate = new Rate('errors');

export const options = {
  stages: LOAD_PROFILES.stress,
  thresholds: THRESHOLDS,
};

export default function () {
  const loginRes = loginScenario();
  
  if (loginRes.status === 200) {
    const cookies = loginRes.cookies;
    const sessionCookie = cookies['next-auth.session-token']?.[0]?.value;
    
    if (sessionCookie) {
      dashboardScenario(sessionCookie);
      vitalsScenario(sessionCookie);
    } else {
      errorRate.add(1);
    }
  } else {
    errorRate.add(1);
  }
}
