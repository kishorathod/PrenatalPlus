# 🚀 Enterprise Load Testing Suite

## � Test Structure

```
tests/load/
├── config.js              # Centralized configuration
├── scenarios.js           # Reusable scenario functions
├── login-test.js         # Basic login test (500 users)
├── combined-test.js      # Realistic multi-scenario test ⭐
├── spike-test.js         # Sudden load spike
├── stress-test.js        # Beyond capacity (1000 users)
├── reports/              # Auto-generated reports
└── README.md
```

## 🎯 Quick Start

### 1. Run Combined Test (Recommended)
```bash
# Simulates real hospital environment
k6 run tests/load/combined-test.js --summary-export=tests/load/reports/combined-summary.json
```

This runs **4 concurrent scenarios**:
- 100 users logging in
- 200 users browsing dashboards
- 100 users recording vitals
- 50 users viewing analytics

### 2. Run Individual Tests

**Login Test** (500 users):
```bash
k6 run tests/load/login-test.js
```

**Spike Test** (sudden 500 users):
```bash
k6 run tests/load/spike-test.js
```

**Stress Test** (1000 users):
```bash
k6 run tests/load/stress-test.js
```

## 🌍 Environment-Specific Testing

### Local
```bash
k6 run tests/load/combined-test.js
```

### Staging
```bash
k6 run --env BASE_URL=https://staging.prenatalplus.com tests/load/combined-test.js
```

### Production
```bash
k6 run --env BASE_URL=https://prenatalplus.com tests/load/combined-test.js
```

## 📊 Generate HTML Reports

### Install HTML Reporter
```bash
npm install -g k6-reporter
```

### Run with HTML Report
```bash
k6 run tests/load/combined-test.js --out json=tests/load/reports/results.json
k6-reporter tests/load/reports/results.json
```

This creates a beautiful HTML report with:
- ✅ Response time graphs
- ✅ Error breakdown
- ✅ Request distribution
- ✅ Percentile charts

## 🔥 Distributed Load Testing

### Using k6 Cloud
```bash
# Sign up at k6.io/cloud
k6 login cloud
k6 cloud tests/load/combined-test.js
```

### Using Docker (5 workers)
```bash
docker-compose up --scale worker=5
```

This allows testing with **5000+ concurrent users**.

## 📈 Test Scenarios Explained

### Combined Test (Realistic)
Simulates a real hospital environment:
- **Login Users**: Constant 100 users logging in
- **Dashboard Users**: Ramping 20 → 200 users browsing
- **Vitals Users**: 10-100 requests/sec recording vitals
- **Analytics Users**: Constant 30 requests/sec viewing health data

**Duration**: 4 minutes  
**Peak Load**: ~400 concurrent users

### Spike Test
Tests system resilience to sudden traffic:
- 0 → 500 users in 10 seconds
- Hold for 1 minute
- Drop to 0

**Use Case**: Marketing campaign, viral social media post

### Stress Test
Pushes system beyond normal capacity:
- Ramps to 1000 users
- Holds for 3 minutes
- Identifies breaking point

**Use Case**: Capacity planning, infrastructure limits

## 🎨 Custom Test Profiles

Edit `config.js` to create custom profiles:

```javascript
export const LOAD_PROFILES = {
  myCustomTest: {
    stages: [
      { duration: '1m', target: 100 },
      { duration: '5m', target: 100 },
      { duration: '1m', target: 0 },
    ],
  },
};
```

Then use in your test:
```javascript
export const options = {
  stages: LOAD_PROFILES.myCustomTest,
};
```

## � Success Metrics

### Excellent Performance
```
✓ http_req_duration p(95) < 2s
✓ http_req_failed < 1%
✓ errors < 2%
✓ throughput > 100 req/s
```

### Good Performance
```
✓ http_req_duration p(95) < 3s
✓ http_req_failed < 5%
✓ errors < 5%
✓ throughput > 50 req/s
```

### Needs Optimization
```
⚠️ http_req_duration p(95) > 3s
⚠️ http_req_failed > 5%
⚠️ errors > 10%
⚠️ throughput < 50 req/s
```

## 🐛 Troubleshooting

### High Error Rates
1. Check database connection pool
2. Verify API rate limits
3. Monitor server resources

### Slow Response Times
1. Enable query logging
2. Check for N+1 queries
3. Review caching strategy

### Connection Timeouts
1. Increase max connections
2. Add connection pooling
3. Check network latency

## � Best Practices

1. **Start Small**: Run smoke test before full load
2. **Monitor**: Watch server metrics during tests
3. **Iterate**: Optimize and re-test
4. **Document**: Save reports for comparison
5. **Automate**: Add to CI/CD pipeline

## 🎉 CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Load Tests
  run: |
    k6 run tests/load/combined-test.js \
      --summary-export=reports/summary.json
```

### Vercel Deployment Hook
```bash
# After deployment
k6 run --env BASE_URL=$VERCEL_URL tests/load/combined-test.js
```

## � Support

For issues or questions:
- Check k6 docs: https://k6.io/docs/
- Review test logs in `reports/`
- Monitor application logs during tests
