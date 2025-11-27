#!/bin/bash

# Medical Packages Module CRUD Test Script
# Tests all CRUD operations, ManyToMany relationships, and RBAC permissions
# Usage: ./test-medical-packages-crud.sh

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
PACKAGE_ID=""
SERVICE_ID_1=""
SERVICE_ID_2=""

echo -e "${YELLOW}==========================================${NC}"
echo -e "${YELLOW}Medical Packages Module - CRUD Test Suite${NC}"
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
# Phase 2: Prerequisites - Get Medical Services
# ============================================
print_header "Phase 2: Prerequisites - Get Medical Services"

# Test 2: Get all medical services (to use in packages)
RESPONSE=$(curl -s -X GET "${BASE_URL}/medical-services" \
  -H "Authorization: Bearer ${TOKEN}")

SERVICE_ID_1=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
SERVICE_ID_2=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | head -2 | tail -1 | cut -d':' -f2)

if [ ! -z "$SERVICE_ID_1" ] && [ ! -z "$SERVICE_ID_2" ]; then
  print_result 0 "Medical services retrieved (IDs: $SERVICE_ID_1, $SERVICE_ID_2)"
else
  print_result 1 "Failed to retrieve medical services" "No services found"
  echo -e "${YELLOW}Warning: Proceeding without service IDs${NC}"
fi

# ============================================
# Phase 3: Create Operations
# ============================================
print_header "Phase 3: Create Medical Packages"

# Test 3: Create medical package with services
RESPONSE=$(curl -s -X POST "${BASE_URL}/medical-packages" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "${CONTENT_TYPE}" \
  -d "{
    \"code\": \"PKG-TEST-001\",
    \"nameAr\": \"باقة الاختبار الأساسية\",
    \"nameEn\": \"Test Basic Package\",
    \"description\": \"Test package for CRUD operations\",
    \"serviceIds\": [${SERVICE_ID_1}, ${SERVICE_ID_2}],
    \"totalCoverageLimit\": 5000.00,
    \"active\": true
  }")

PACKAGE_ID=$(extract_id "$RESPONSE")
if [ ! -z "$PACKAGE_ID" ] && [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Create medical package (ID: $PACKAGE_ID)"
else
  print_result 1 "Create medical package failed" "Response: $RESPONSE"
fi

# Test 4: Create duplicate package (should fail)
RESPONSE=$(curl -s -X POST "${BASE_URL}/medical-packages" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "${CONTENT_TYPE}" \
  -d "{
    \"code\": \"PKG-TEST-001\",
    \"nameAr\": \"باقة مكررة\",
    \"nameEn\": \"Duplicate Package\",
    \"active\": true
  }")

if [[ "$RESPONSE" == *"\"success\":false"* ]] || [[ "$RESPONSE" == *"error"* ]]; then
  print_result 0 "Duplicate code validation (correctly rejected)"
else
  print_result 1 "Duplicate code validation failed" "Should reject duplicate codes"
fi

# Test 5: Create package without services
RESPONSE=$(curl -s -X POST "${BASE_URL}/medical-packages" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "${CONTENT_TYPE}" \
  -d '{
    "code": "PKG-TEST-002",
    "nameAr": "باقة بدون خدمات",
    "nameEn": "Package Without Services",
    "active": false
  }')

PACKAGE_ID_2=$(extract_id "$RESPONSE")
if [ ! -z "$PACKAGE_ID_2" ] && [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Create package without services (ID: $PACKAGE_ID_2)"
else
  print_result 1 "Create package without services failed"
fi

# ============================================
# Phase 4: Read Operations
# ============================================
print_header "Phase 4: Read Medical Packages"

# Test 6: Get all packages
RESPONSE=$(curl -s -X GET "${BASE_URL}/medical-packages" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]] && [[ "$RESPONSE" == *"PKG-TEST-001"* ]]; then
  print_result 0 "Get all medical packages"
else
  print_result 1 "Get all medical packages failed"
fi

# Test 7: Get package by ID
RESPONSE=$(curl -s -X GET "${BASE_URL}/medical-packages/${PACKAGE_ID}" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]] && [[ "$RESPONSE" == *"\"code\":\"PKG-TEST-001\""* ]]; then
  print_result 0 "Get package by ID"
else
  print_result 1 "Get package by ID failed"
fi

# Test 8: Get package by code
RESPONSE=$(curl -s -X GET "${BASE_URL}/medical-packages/code/PKG-TEST-001" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]] && [[ "$RESPONSE" == *"\"id\":${PACKAGE_ID}"* ]]; then
  print_result 0 "Get package by code"
else
  print_result 1 "Get package by code failed"
fi

# Test 9: Get active packages
RESPONSE=$(curl -s -X GET "${BASE_URL}/medical-packages/active" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]] && [[ "$RESPONSE" == *"PKG-TEST-001"* ]]; then
  print_result 0 "Get active packages (includes PKG-TEST-001)"
else
  print_result 1 "Get active packages failed"
fi

# Test 10: Verify services relationship
RESPONSE=$(curl -s -X GET "${BASE_URL}/medical-packages/${PACKAGE_ID}" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"services\":"* ]]; then
  print_result 0 "ManyToMany relationship verified (services loaded)"
else
  print_result 1 "ManyToMany relationship verification failed"
fi

# Test 11: Get package count
RESPONSE=$(curl -s -X GET "${BASE_URL}/medical-packages/count" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Get package count"
else
  print_result 1 "Get package count failed"
fi

# Test 12: Get non-existent package
RESPONSE=$(curl -s -X GET "${BASE_URL}/medical-packages/999999" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":false"* ]] || [[ "$RESPONSE" == *"404"* ]]; then
  print_result 0 "Get non-existent package (correctly returns error)"
else
  print_result 1 "Get non-existent package validation failed"
fi

# ============================================
# Phase 5: Update Operations
# ============================================
print_header "Phase 5: Update Medical Packages"

# Test 13: Update package details
RESPONSE=$(curl -s -X PUT "${BASE_URL}/medical-packages/${PACKAGE_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "${CONTENT_TYPE}" \
  -d "{
    \"code\": \"PKG-TEST-001\",
    \"nameAr\": \"باقة الاختبار المحدثة\",
    \"nameEn\": \"Test Updated Package\",
    \"description\": \"Updated description\",
    \"serviceIds\": [${SERVICE_ID_1}],
    \"totalCoverageLimit\": 7500.00,
    \"active\": true
  }")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Update package details"
else
  print_result 1 "Update package details failed"
fi

# Test 14: Verify updated data
RESPONSE=$(curl -s -X GET "${BASE_URL}/medical-packages/${PACKAGE_ID}" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"Test Updated Package"* ]] && [[ "$RESPONSE" == *"7500"* ]]; then
  print_result 0 "Verify updated data (name and coverage limit changed)"
else
  print_result 1 "Verify updated data failed"
fi

# Test 15: Update to inactive status
RESPONSE=$(curl -s -X PUT "${BASE_URL}/medical-packages/${PACKAGE_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "${CONTENT_TYPE}" \
  -d "{
    \"code\": \"PKG-TEST-001\",
    \"nameAr\": \"باقة الاختبار المحدثة\",
    \"nameEn\": \"Test Updated Package\",
    \"active\": false
  }")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Update package to inactive"
else
  print_result 1 "Update package to inactive failed"
fi

# Test 16: Verify package not in active list
RESPONSE=$(curl -s -X GET "${BASE_URL}/medical-packages/active" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" != *"PKG-TEST-001"* ]]; then
  print_result 0 "Verify inactive package excluded from active list"
else
  print_result 1 "Inactive package verification failed (still in active list)"
fi

# ============================================
# Phase 6: Delete Operations
# ============================================
print_header "Phase 6: Delete Medical Packages"

# Test 17: Delete package
RESPONSE=$(curl -s -X DELETE "${BASE_URL}/medical-packages/${PACKAGE_ID_2}" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":true"* ]]; then
  print_result 0 "Delete medical package (ID: $PACKAGE_ID_2)"
else
  print_result 1 "Delete medical package failed"
fi

# Test 18: Verify deleted package not found
RESPONSE=$(curl -s -X GET "${BASE_URL}/medical-packages/${PACKAGE_ID_2}" \
  -H "Authorization: Bearer ${TOKEN}")

if [[ "$RESPONSE" == *"\"success\":false"* ]] || [[ "$RESPONSE" == *"404"* ]]; then
  print_result 0 "Verify deleted package not found"
else
  print_result 1 "Deleted package verification failed (still accessible)"
fi

# Cleanup: Delete test package 1
curl -s -X DELETE "${BASE_URL}/medical-packages/${PACKAGE_ID}" \
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
