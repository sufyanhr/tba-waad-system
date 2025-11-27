#!/bin/bash

#############################################
# Medical Categories CRUD Test Script
# Tests all medical category endpoints
# TBA WAAD System - Phase G Module 7/11
#############################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:8080/api"
ADMIN_USERNAME="admin@tba.sa"
ADMIN_PASSWORD="admin123"

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Temporary file for response
RESPONSE_FILE=$(mktemp)

# Cleanup function
cleanup() {
  rm -f "$RESPONSE_FILE"
}
trap cleanup EXIT

# Helper functions
print_test() {
  echo -e "\n${CYAN}═══════════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}TEST $1: $2${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
}

print_success() {
  echo -e "${GREEN}✓ PASS:${NC} $1"
  ((TESTS_PASSED++))
}

print_failure() {
  echo -e "${RED}✗ FAIL:${NC} $1"
  ((TESTS_FAILED++))
}

print_info() {
  echo -e "${YELLOW}ℹ INFO:${NC} $1"
}

# Parse JSON response
parse_json() {
  echo "$1" | jq -r "$2" 2>/dev/null || echo ""
}

#############################################
# TEST 1: Authentication
#############################################
print_test "1" "Authenticate and get JWT token"
((TESTS_RUN++))

AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"$ADMIN_USERNAME\",\"password\":\"$ADMIN_PASSWORD\"}")

echo "Response: $AUTH_RESPONSE"

TOKEN=$(parse_json "$AUTH_RESPONSE" '.data.token // .token // .data.accessToken // .accessToken')

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  print_success "Authentication successful, token obtained"
  print_info "Token: ${TOKEN:0:50}..."
else
  print_failure "Authentication failed"
  echo "Response: $AUTH_RESPONSE"
  exit 1
fi

#############################################
# TEST 2: Create Medical Category (Lab Tests)
#############################################
print_test "2" "Create Medical Category - Lab Tests"
((TESTS_RUN++))

CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/medical-categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "code": "LAB",
    "nameAr": "الفحوصات المخبرية",
    "nameEn": "Laboratory Tests",
    "description": "Medical laboratory tests and diagnostics",
    "active": true
  }')

echo "Response: $CREATE_RESPONSE"

CATEGORY_ID=$(parse_json "$CREATE_RESPONSE" '.data.id')

if [ -n "$CATEGORY_ID" ] && [ "$CATEGORY_ID" != "null" ]; then
  print_success "Medical category created successfully with ID: $CATEGORY_ID"
else
  print_failure "Failed to create medical category"
  echo "Response: $CREATE_RESPONSE"
fi

#############################################
# TEST 3: Get Medical Category by ID
#############################################
print_test "3" "Get Medical Category by ID"
((TESTS_RUN++))

if [ -n "$CATEGORY_ID" ] && [ "$CATEGORY_ID" != "null" ]; then
  GET_RESPONSE=$(curl -s -X GET "$BASE_URL/medical-categories/$CATEGORY_ID" \
    -H "Authorization: Bearer $TOKEN")

  echo "Response: $GET_RESPONSE"

  RETRIEVED_CODE=$(parse_json "$GET_RESPONSE" '.data.code')

  if [ "$RETRIEVED_CODE" = "LAB" ]; then
    print_success "Medical category retrieved successfully"
  else
    print_failure "Failed to retrieve medical category"
    echo "Response: $GET_RESPONSE"
  fi
else
  print_failure "Cannot test - no category ID available"
fi

#############################################
# TEST 4: List All Medical Categories
#############################################
print_test "4" "List All Medical Categories"
((TESTS_RUN++))

LIST_RESPONSE=$(curl -s -X GET "$BASE_URL/medical-categories" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $LIST_RESPONSE"

# Check if data is array or has data property
CATEGORY_COUNT=$(parse_json "$LIST_RESPONSE" '.data | length // . | length')

if [ -n "$CATEGORY_COUNT" ] && [ "$CATEGORY_COUNT" -gt 0 ]; then
  print_success "Medical categories list retrieved successfully ($CATEGORY_COUNT categories)"
else
  print_failure "Failed to retrieve medical categories list"
  echo "Response: $LIST_RESPONSE"
fi

#############################################
# TEST 5: Get Medical Category by Code
#############################################
print_test "5" "Get Medical Category by Code"
((TESTS_RUN++))

CODE_RESPONSE=$(curl -s -X GET "$BASE_URL/medical-categories/code/LAB" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $CODE_RESPONSE"

CODE_NAME=$(parse_json "$CODE_RESPONSE" '.data.nameEn')

if [ "$CODE_NAME" = "Laboratory Tests" ]; then
  print_success "Medical category retrieved by code successfully"
else
  print_failure "Failed to retrieve medical category by code"
  echo "Response: $CODE_RESPONSE"
fi

#############################################
# TEST 6: Update Medical Category
#############################################
print_test "6" "Update Medical Category"
((TESTS_RUN++))

if [ -n "$CATEGORY_ID" ] && [ "$CATEGORY_ID" != "null" ]; then
  UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/medical-categories/$CATEGORY_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "code": "LAB",
      "nameAr": "الفحوصات المخبرية المحدثة",
      "nameEn": "Laboratory Tests (Updated)",
      "description": "Updated description for lab tests",
      "active": true
    }')

  echo "Response: $UPDATE_RESPONSE"

  UPDATED_NAME=$(parse_json "$UPDATE_RESPONSE" '.data.nameEn')

  if [ "$UPDATED_NAME" = "Laboratory Tests (Updated)" ]; then
    print_success "Medical category updated successfully"
  else
    print_failure "Failed to update medical category"
    echo "Response: $UPDATE_RESPONSE"
  fi
else
  print_failure "Cannot test - no category ID available"
fi

#############################################
# TEST 7: Create Second Category (Radiology)
#############################################
print_test "7" "Create Second Medical Category - Radiology"
((TESTS_RUN++))

RADIOLOGY_RESPONSE=$(curl -s -X POST "$BASE_URL/medical-categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "code": "RAD",
    "nameAr": "الأشعة",
    "nameEn": "Radiology",
    "description": "Radiology and imaging services",
    "active": true
  }')

echo "Response: $RADIOLOGY_RESPONSE"

RADIOLOGY_ID=$(parse_json "$RADIOLOGY_RESPONSE" '.data.id')

if [ -n "$RADIOLOGY_ID" ] && [ "$RADIOLOGY_ID" != "null" ]; then
  print_success "Radiology category created successfully with ID: $RADIOLOGY_ID"
else
  print_failure "Failed to create radiology category"
  echo "Response: $RADIOLOGY_RESPONSE"
fi

#############################################
# TEST 8: Create Third Category (Dental - Inactive)
#############################################
print_test "8" "Create Third Medical Category - Dental (Inactive)"
((TESTS_RUN++))

DENTAL_RESPONSE=$(curl -s -X POST "$BASE_URL/medical-categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "code": "DENT",
    "nameAr": "طب الأسنان",
    "nameEn": "Dental Services",
    "description": "Dental care and treatments",
    "active": false
  }')

echo "Response: $DENTAL_RESPONSE"

DENTAL_ID=$(parse_json "$DENTAL_RESPONSE" '.data.id')

if [ -n "$DENTAL_ID" ] && [ "$DENTAL_ID" != "null" ]; then
  print_success "Dental category (inactive) created successfully with ID: $DENTAL_ID"
else
  print_failure "Failed to create dental category"
  echo "Response: $DENTAL_RESPONSE"
fi

#############################################
# TEST 9: Create Fourth Category (Surgery)
#############################################
print_test "9" "Create Fourth Medical Category - Surgery"
((TESTS_RUN++))

SURGERY_RESPONSE=$(curl -s -X POST "$BASE_URL/medical-categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "code": "SURG",
    "nameAr": "الجراحة",
    "nameEn": "Surgery",
    "description": "Surgical procedures and operations",
    "active": true
  }')

echo "Response: $SURGERY_RESPONSE"

SURGERY_ID=$(parse_json "$SURGERY_RESPONSE" '.data.id')

if [ -n "$SURGERY_ID" ] && [ "$SURGERY_ID" != "null" ]; then
  print_success "Surgery category created successfully with ID: $SURGERY_ID"
else
  print_failure "Failed to create surgery category"
  echo "Response: $SURGERY_RESPONSE"
fi

#############################################
# TEST 10: Verify List Contains All Categories
#############################################
print_test "10" "Verify List Contains All Created Categories"
((TESTS_RUN++))

FULL_LIST_RESPONSE=$(curl -s -X GET "$BASE_URL/medical-categories" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $FULL_LIST_RESPONSE"

FULL_COUNT=$(parse_json "$FULL_LIST_RESPONSE" '.data | length // . | length')

if [ -n "$FULL_COUNT" ] && [ "$FULL_COUNT" -ge 4 ]; then
  print_success "List contains all categories (found $FULL_COUNT categories)"
else
  print_failure "List does not contain expected number of categories (found: $FULL_COUNT, expected: >= 4)"
  echo "Response: $FULL_LIST_RESPONSE"
fi

#############################################
# TEST 11: Validation - Missing Required Fields
#############################################
print_test "11" "Validation - Missing Required Fields"
((TESTS_RUN++))

VALIDATION_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BASE_URL/medical-categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "description": "Missing required fields"
  }')

echo "Response: $VALIDATION_RESPONSE"

HTTP_STATUS=$(echo "$VALIDATION_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)

if [ "$HTTP_STATUS" = "400" ] || [ "$HTTP_STATUS" = "422" ]; then
  print_success "Validation correctly rejected missing required fields (HTTP $HTTP_STATUS)"
else
  print_failure "Validation did not reject missing required fields (HTTP $HTTP_STATUS)"
  echo "Response: $VALIDATION_RESPONSE"
fi

#############################################
# TEST 12: Unauthorized Access
#############################################
print_test "12" "Unauthorized Access (No Token)"
((TESTS_RUN++))

UNAUTH_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/medical-categories")

echo "Response: $UNAUTH_RESPONSE"

UNAUTH_STATUS=$(echo "$UNAUTH_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)

if [ "$UNAUTH_STATUS" = "401" ] || [ "$UNAUTH_STATUS" = "403" ]; then
  print_success "Unauthorized access correctly rejected (HTTP $UNAUTH_STATUS)"
else
  print_failure "Unauthorized access was not rejected (HTTP $UNAUTH_STATUS)"
  echo "Response: $UNAUTH_RESPONSE"
fi

#############################################
# TEST 13: Not Found (Invalid ID)
#############################################
print_test "13" "Handle 404 - Non-existent Category"
((TESTS_RUN++))

NOT_FOUND_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/medical-categories/999999" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $NOT_FOUND_RESPONSE"

NOT_FOUND_STATUS=$(echo "$NOT_FOUND_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)

if [ "$NOT_FOUND_STATUS" = "404" ] || [ "$NOT_FOUND_STATUS" = "400" ]; then
  print_success "Non-existent category correctly handled (HTTP $NOT_FOUND_STATUS)"
else
  print_failure "Non-existent category not properly handled (HTTP $NOT_FOUND_STATUS)"
  echo "Response: $NOT_FOUND_RESPONSE"
fi

#############################################
# TEST 14: Delete Medical Category
#############################################
print_test "14" "Delete Medical Category (Radiology)"
((TESTS_RUN++))

if [ -n "$RADIOLOGY_ID" ] && [ "$RADIOLOGY_ID" != "null" ]; then
  DELETE_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X DELETE "$BASE_URL/medical-categories/$RADIOLOGY_ID" \
    -H "Authorization: Bearer $TOKEN")

  echo "Response: $DELETE_RESPONSE"

  DELETE_STATUS=$(echo "$DELETE_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)

  if [ "$DELETE_STATUS" = "200" ] || [ "$DELETE_STATUS" = "204" ]; then
    print_success "Medical category deleted successfully (HTTP $DELETE_STATUS)"
  else
    print_failure "Failed to delete medical category (HTTP $DELETE_STATUS)"
    echo "Response: $DELETE_RESPONSE"
  fi
else
  print_failure "Cannot test - no radiology category ID available"
fi

#############################################
# TEST 15: Verify Deletion (404 Expected)
#############################################
print_test "15" "Verify Deletion - Category Should Not Exist"
((TESTS_RUN++))

if [ -n "$RADIOLOGY_ID" ] && [ "$RADIOLOGY_ID" != "null" ]; then
  VERIFY_DELETE_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/medical-categories/$RADIOLOGY_ID" \
    -H "Authorization: Bearer $TOKEN")

  echo "Response: $VERIFY_DELETE_RESPONSE"

  VERIFY_STATUS=$(echo "$VERIFY_DELETE_RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)

  if [ "$VERIFY_STATUS" = "404" ] || [ "$VERIFY_STATUS" = "400" ]; then
    print_success "Deletion verified - category no longer exists (HTTP $VERIFY_STATUS)"
  else
    print_failure "Deletion verification failed - category still exists (HTTP $VERIFY_STATUS)"
    echo "Response: $VERIFY_DELETE_RESPONSE"
  fi
else
  print_failure "Cannot test - no radiology category ID available"
fi

#############################################
# Test Summary
#############################################
echo -e "\n${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}TEST SUMMARY${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "Total Tests: ${TESTS_RUN}"
echo -e "${GREEN}Passed: ${TESTS_PASSED}${NC}"
echo -e "${RED}Failed: ${TESTS_FAILED}${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "\n${GREEN}✓ ALL TESTS PASSED!${NC}"
  exit 0
else
  echo -e "\n${RED}✗ SOME TESTS FAILED${NC}"
  exit 1
fi
