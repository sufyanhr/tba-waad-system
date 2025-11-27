#!/bin/bash

# Dashboard API Test Script
# Tests all dashboard endpoints and analytics data
# Usage: ./test-dashboard-api.sh

BASE_URL="http://localhost:8080/api"
CONTENT_TYPE="Content-Type: application/json"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to print test result
print_result() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  if [ $1 -eq 0 ]; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
    echo -e "${GREEN}✓ PASS${NC}: $2"
  else
    FAILED_TESTS=$((FAILED_TESTS + 1))
    echo -e "${RED}✗ FAIL${NC}: $2"
    if [ ! -z "$3" ]; then
      echo -e "${RED}   Error: $3${NC}"
    fi
  fi
}

# Function to print section header
print_header() {
  echo ""
  echo -e "${BLUE}========================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}========================================${NC}"
}

# Function to extract token from response
extract_token() {
  echo "$1" | grep -o '"data":"[^"]*' | cut -d'"' -f4
}

# Variables
TOKEN=""

echo -e "${YELLOW}==========================================${NC}"
echo -e "${YELLOW}Dashboard API - Test Suite${NC}"
echo -e "${YELLOW}==========================================${NC}"

# ============================================
# Phase 1: Authentication
# ============================================
print_header "Phase 1: Authentication"

# Test 1: Admin Login
RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "${CONTENT_TYPE}" \
  -d '{"username":"admin","password":"admin123"}')

TOKEN=$(extract_token "$RESPONSE")
if [ ! -z "$TOKEN" ]; then
  print_result 0 "Admin login successful"
else
  print_result 1 "Admin login failed" "No token received"
  echo -e "${RED}Cannot proceed without authentication${NC}"
  exit 1
fi

# ============================================
# Phase 2: KPIs Endpoint
# ============================================
print_header "Phase 2: KPIs (Key Performance Indicators)"

# Test 2: Get all KPIs
RESPONSE=$(curl -s -X GET "${BASE_URL}/dashboard/kpis" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Get KPIs"
  
  # Validate KPI fields
  if [[ "$RESPONSE" == *"totalMembers"* ]] && [[ "$RESPONSE" == *"totalEmployers"* ]] && \
     [[ "$RESPONSE" == *"totalProviders"* ]] && [[ "$RESPONSE" == *"activePolicies"* ]]; then
    print_result 0 "KPI fields validation (contains expected fields)"
  else
    print_result 1 "KPI fields validation" "Missing expected fields"
  fi
else
  print_result 1 "Get KPIs failed"
  print_result 1 "KPI fields validation" "No data to validate"
fi

# ============================================
# Phase 3: Claims Analytics
# ============================================
print_header "Phase 3: Claims Analytics"

# Test 3: Get claims trend
RESPONSE=$(curl -s -X GET "${BASE_URL}/dashboard/claims/trend" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Get claims trend (12 months)"
else
  print_result 1 "Get claims trend failed"
fi

# Test 4: Get claims by employer
RESPONSE=$(curl -s -X GET "${BASE_URL}/dashboard/claims/by-employer" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Get claims by employer"
else
  print_result 1 "Get claims by employer failed"
fi

# Test 5: Get claims by provider
RESPONSE=$(curl -s -X GET "${BASE_URL}/dashboard/claims/by-provider" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Get claims by provider"
else
  print_result 1 "Get claims by provider failed"
fi

# Test 6: Get latest claims
RESPONSE=$(curl -s -X GET "${BASE_URL}/dashboard/latest-claims" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Get latest claims (recent 5)"
else
  print_result 1 "Get latest claims failed"
fi

# ============================================
# Phase 4: Pre-Authorization Analytics
# ============================================
print_header "Phase 4: Pre-Authorization Analytics"

# Test 7: Get preauth trend
RESPONSE=$(curl -s -X GET "${BASE_URL}/dashboard/preauth/trend" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Get preauth trend (12 months)"
else
  print_result 1 "Get preauth trend failed"
fi

# Test 8: Get preauth by status
RESPONSE=$(curl -s -X GET "${BASE_URL}/dashboard/preauth/by-status" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Get preauth by status distribution"
else
  print_result 1 "Get preauth by status failed"
fi

# Test 9: Get latest preauth
RESPONSE=$(curl -s -X GET "${BASE_URL}/dashboard/latest-preauth" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Get latest preauth (recent 5)"
else
  print_result 1 "Get latest preauth failed"
fi

# ============================================
# Phase 5: Visits Analytics
# ============================================
print_header "Phase 5: Visits Analytics"

# Test 10: Get visits trend
RESPONSE=$(curl -s -X GET "${BASE_URL}/dashboard/visits/trend" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Get visits trend (12 months)"
else
  print_result 1 "Get visits trend failed"
fi

# Test 11: Get latest visits
RESPONSE=$(curl -s -X GET "${BASE_URL}/dashboard/latest-visits" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Get latest visits (recent 5)"
else
  print_result 1 "Get latest visits failed"
fi

# ============================================
# Phase 6: Members Analytics
# ============================================
print_header "Phase 6: Members Analytics"

# Test 12: Get members trend
RESPONSE=$(curl -s -X GET "${BASE_URL}/dashboard/members/trend" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Get members growth trend (12 months)"
else
  print_result 1 "Get members growth trend failed"
fi

# ============================================
# Phase 7: Services Analytics (Optional)
# ============================================
print_header "Phase 7: Services Analytics"

# Test 13: Get services usage
RESPONSE=$(curl -s -X GET "${BASE_URL}/dashboard/services/usage" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Get services usage by category"
elif [[ "$RESPONSE" == *"404"* ]] || [[ "$RESPONSE" == *"Not Found"* ]]; then
  echo -e "${YELLOW}⚠ SKIP${NC}: Services usage endpoint not implemented (optional)"
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
else
  print_result 1 "Get services usage failed"
fi

# ============================================
# Phase 8: Performance Tests
# ============================================
print_header "Phase 8: Performance & Edge Cases"

# Test 14: Concurrent KPI requests
START_TIME=$(date +%s)
for i in {1..3}; do
  curl -s -X GET "${BASE_URL}/dashboard/kpis" \
    -H "Authorization: Bearer ${TOKEN}" > /dev/null &
done
wait
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

if [ $DURATION -lt 5 ]; then
  print_result 0 "Concurrent requests performance (${DURATION}s < 5s)"
else
  print_result 1 "Concurrent requests performance" "Took ${DURATION}s (expected < 5s)"
fi

# Test 15: Unauthorized access
RESPONSE=$(curl -s -X GET "${BASE_URL}/dashboard/kpis")

if [[ "$RESPONSE" == *"401"* ]] || [[ "$RESPONSE" == *"Unauthorized"* ]] || [[ "$RESPONSE" == *"\"success\":false"* ]]; then
  print_result 0 "Unauthorized access protection (correctly rejected)"
else
  print_result 1 "Unauthorized access protection" "Should reject requests without token"
fi

# Test 16: Invalid token
RESPONSE=$(curl -s -X GET "${BASE_URL}/dashboard/kpis" \
  -H "Authorization: Bearer invalid_token_12345")

if [[ "$RESPONSE" == *"401"* ]] || [[ "$RESPONSE" == *"Unauthorized"* ]] || [[ "$RESPONSE" == *"\"success\":false"* ]]; then
  print_result 0 "Invalid token protection (correctly rejected)"
else
  print_result 1 "Invalid token protection" "Should reject invalid tokens"
fi

# ============================================
# Final Summary
# ============================================
print_header "Test Summary"

echo ""
echo -e "${YELLOW}Total Tests:${NC}  ${TOTAL_TESTS}"
echo -e "${GREEN}Passed:${NC}       ${PASSED_TESTS}"
echo -e "${RED}Failed:${NC}       ${FAILED_TESTS}"

PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
echo -e "${BLUE}Pass Rate:${NC}    ${PASS_RATE}%"

if [ $FAILED_TESTS -eq 0 ]; then
  echo ""
  echo -e "${GREEN}========================================${NC}"
  echo -e "${GREEN}All tests passed! ✓${NC}"
  echo -e "${GREEN}========================================${NC}"
  exit 0
else
  echo ""
  echo -e "${RED}========================================${NC}"
  echo -e "${RED}Some tests failed. Please review.${NC}"
  echo -e "${RED}========================================${NC}"
  exit 1
fi
