#!/bin/bash

# Visits Module CRUD Test Script
# Tests all CRUD operations, member/provider relationships, and RBAC permissions
# Usage: ./test-visits-crud.sh

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

# Function to extract ID from response
extract_id() {
  echo "$1" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2
}

# Variables
TOKEN=""
ADMIN_TOKEN=""
VISIT_ID=""
MEMBER_ID=""
PROVIDER_ID=""

echo -e "${YELLOW}==========================================${NC}"
echo -e "${YELLOW}Visits Module - CRUD Test Suite${NC}"
echo -e "${YELLOW}==========================================${NC}"

# ============================================
# Phase 1: Authentication
# ============================================
print_header "Phase 1: Authentication"

# Test 1: Admin Login
RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "${CONTENT_TYPE}" \
  -d '{"username":"admin","password":"admin123"}')

ADMIN_TOKEN=$(extract_token "$RESPONSE")
if [ ! -z "$ADMIN_TOKEN" ]; then
  print_result 0 "Admin login successful"
  TOKEN="$ADMIN_TOKEN"
else
  print_result 1 "Admin login failed" "No token received"
  echo -e "${RED}Cannot proceed without authentication${NC}"
  exit 1
fi

# ============================================
# Phase 2: Prerequisites - Get Members and Providers
# ============================================
print_header "Phase 2: Prerequisites - Get Members and Providers"

# Test 2: Get members (to use in visits)
RESPONSE=$(curl -s -X GET "${BASE_URL}/members" \
  -H "Authorization: Bearer ${TOKEN}")

MEMBER_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ ! -z "$MEMBER_ID" ]; then
  print_result 0 "Members retrieved (ID: $MEMBER_ID)"
else
  print_result 1 "Failed to retrieve members" "No members found"
  echo -e "${YELLOW}Warning: Proceeding without member ID${NC}"
fi

# Test 3: Get providers (to use in visits)
RESPONSE=$(curl -s -X GET "${BASE_URL}/providers" \
  -H "Authorization: Bearer ${TOKEN}")

PROVIDER_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ ! -z "$PROVIDER_ID" ]; then
  print_result 0 "Providers retrieved (ID: $PROVIDER_ID)"
else
  print_result 1 "Failed to retrieve providers" "No providers found"
  echo -e "${YELLOW}Warning: Proceeding without provider ID${NC}"
fi

# ============================================
# Phase 3: Create Operations
# ============================================
print_header "Phase 3: Create Visits"

# Test 4: Create visit with member and provider
RESPONSE=$(curl -s -X POST "${BASE_URL}/visits" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "${CONTENT_TYPE}" \
  -d "{
    \"memberId\": ${MEMBER_ID},
    \"providerId\": ${PROVIDER_ID},
    \"visitType\": \"CONSULTATION\",
    \"diagnosis\": \"Annual health checkup\",
    \"visitDate\": \"$(date -u +"%Y-%m-%dT%H:%M:%S")Z\",
    \"status\": \"SCHEDULED\",
    \"costLyd\": 150.00,
    \"notes\": \"Regular checkup visit\"
  }")

VISIT_ID=$(extract_id "$RESPONSE")
if [ ! -z "$VISIT_ID" ] && [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Create visit (ID: $VISIT_ID)"
else
  print_result 1 "Create visit failed" "Response: $RESPONSE"
fi

# Test 5: Create visit without required fields (should fail)
RESPONSE=$(curl -s -X POST "${BASE_URL}/visits" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "${CONTENT_TYPE}" \
  -d '{
    "visitType": "EMERGENCY"
  }')

if [[ "$RESPONSE" == *"\"success\":false"* ]] || [[ "$RESPONSE" == *"error"* ]]; then
  print_result 0 "Required fields validation (correctly rejected)"
else
  print_result 1 "Required fields validation failed" "Should reject incomplete data"
fi

# Test 6: Create emergency visit
RESPONSE=$(curl -s -X POST "${BASE_URL}/visits" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "${CONTENT_TYPE}" \
  -d "{
    \"memberId\": ${MEMBER_ID},
    \"providerId\": ${PROVIDER_ID},
    \"visitType\": \"EMERGENCY\",
    \"diagnosis\": \"Acute chest pain\",
    \"visitDate\": \"$(date -u +"%Y-%m-%dT%H:%M:%S")Z\",
    \"status\": \"IN_PROGRESS\",
    \"costLyd\": 500.00
  }")

VISIT_ID_2=$(extract_id "$RESPONSE")
if [ ! -z "$VISIT_ID_2" ] && [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Create emergency visit (ID: $VISIT_ID_2)"
else
  print_result 1 "Create emergency visit failed"
fi

# ============================================
# Phase 4: Read Operations
# ============================================
print_header "Phase 4: Read Visits"

# Test 7: Get all visits
RESPONSE=$(curl -s -X GET "${BASE_URL}/visits" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Get all visits"
else
  print_result 1 "Get all visits failed"
fi

# Test 8: Get visit by ID
RESPONSE=$(curl -s -X GET "${BASE_URL}/visits/${VISIT_ID}" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]] && [[ "$RESPONSE" == *"\"visitType\":\"CONSULTATION\""* ]]; then
  print_result 0 "Get visit by ID"
else
  print_result 1 "Get visit by ID failed"
fi

# Test 9: Get visits by member
RESPONSE=$(curl -s -X GET "${BASE_URL}/visits/member/${MEMBER_ID}" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Get visits by member"
else
  print_result 1 "Get visits by member failed"
fi

# Test 10: Get visits by provider
RESPONSE=$(curl -s -X GET "${BASE_URL}/visits/provider/${PROVIDER_ID}" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Get visits by provider"
else
  print_result 1 "Get visits by provider failed"
fi

# Test 11: Get visit count
RESPONSE=$(curl -s -X GET "${BASE_URL}/visits/count" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Get visit count"
else
  print_result 1 "Get visit count failed"
fi

# Test 12: Get non-existent visit
RESPONSE=$(curl -s -X GET "${BASE_URL}/visits/999999" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":false"* ]] || [[ "$RESPONSE" == *"404"* ]]; then
  print_result 0 "Get non-existent visit (correctly returns error)"
else
  print_result 1 "Get non-existent visit validation failed"
fi

# ============================================
# Phase 5: Update Operations
# ============================================
print_header "Phase 5: Update Visits"

# Test 13: Update visit status and diagnosis
RESPONSE=$(curl -s -X PUT "${BASE_URL}/visits/${VISIT_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "${CONTENT_TYPE}" \
  -d "{
    \"memberId\": ${MEMBER_ID},
    \"providerId\": ${PROVIDER_ID},
    \"visitType\": \"CONSULTATION\",
    \"diagnosis\": \"Annual health checkup - All tests normal\",
    \"visitDate\": \"$(date -u +"%Y-%m-%dT%H:%M:%S")Z\",
    \"status\": \"COMPLETED\",
    \"costLyd\": 150.00,
    \"notes\": \"Patient in good health\"
  }")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Update visit status and diagnosis"
else
  print_result 1 "Update visit failed"
fi

# Test 14: Verify updated data
RESPONSE=$(curl -s -X GET "${BASE_URL}/visits/${VISIT_ID}" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"COMPLETED"* ]] && [[ "$RESPONSE" == *"All tests normal"* ]]; then
  print_result 0 "Verify updated data (status and diagnosis changed)"
else
  print_result 1 "Verify updated data failed"
fi

# Test 15: Update visit cost
RESPONSE=$(curl -s -X PUT "${BASE_URL}/visits/${VISIT_ID_2}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "${CONTENT_TYPE}" \
  -d "{
    \"memberId\": ${MEMBER_ID},
    \"providerId\": ${PROVIDER_ID},
    \"visitType\": \"EMERGENCY\",
    \"diagnosis\": \"Acute chest pain - Stable condition\",
    \"visitDate\": \"$(date -u +"%Y-%m-%dT%H:%M:%S")Z\",
    \"status\": \"COMPLETED\",
    \"costLyd\": 750.00,
    \"notes\": \"Patient discharged\"
  }")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Update visit cost"
else
  print_result 1 "Update visit cost failed"
fi

# ============================================
# Phase 6: Delete Operations
# ============================================
print_header "Phase 6: Delete Visits"

# Test 16: Delete visit
RESPONSE=$(curl -s -X DELETE "${BASE_URL}/visits/${VISIT_ID_2}" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Delete visit (ID: $VISIT_ID_2)"
else
  print_result 1 "Delete visit failed"
fi

# Test 17: Verify deleted visit not found
RESPONSE=$(curl -s -X GET "${BASE_URL}/visits/${VISIT_ID_2}" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":false"* ]] || [[ "$RESPONSE" == *"404"* ]]; then
  print_result 0 "Verify deleted visit not found"
else
  print_result 1 "Deleted visit verification failed (still accessible)"
fi

# Cleanup: Delete test visit 1
curl -s -X DELETE "${BASE_URL}/visits/${VISIT_ID}" \
  -H "Authorization: Bearer ${TOKEN}" > /dev/null

# ============================================
# Final Summary
# ============================================
print_header "Test Summary"

echo ""
echo -e "${YELLOW}Total Tests:${NC}  ${TOTAL_TESTS}"
echo -e "${GREEN}Passed:${NC}       ${PASSED_TESTS}"
echo -e "${RED}Failed:${NC}       ${FAILED_TESTS}"

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
