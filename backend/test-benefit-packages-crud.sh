#!/bin/bash

# ==============================
# Benefit Packages CRUD Test Script
# Phase G - TBA WAAD System
# ==============================

BASE_URL="http://localhost:8080/api"
TOKEN=""
PACKAGE_ID=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0
TOTAL=0

# Print colored output
print_test() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}TEST $1: $2${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
    ((PASSED++))
}

print_failure() {
    echo -e "${RED}✗ FAIL${NC}: $1"
    echo -e "${RED}Response: $2${NC}"
    ((FAILED++))
}

print_info() {
    echo -e "${YELLOW}ℹ INFO${NC}: $1"
}

# ==============================
# Test 1: Authentication
# ==============================
test_authentication() {
    print_test "1" "Authenticate and get JWT token"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d '{
            "identifier": "admin",
            "password": "admin123"
        }')
    
    TOKEN=$(echo "$RESPONSE" | jq -r '.data.token // empty')
    
    if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
        print_success "Authentication successful"
        print_info "Token: ${TOKEN:0:50}..."
    else
        print_failure "Authentication failed" "$RESPONSE"
        exit 1
    fi
}

# ==============================
# Test 2: Create Benefit Package
# ==============================
test_create_package() {
    print_test "2" "Create new benefit package"
    ((TOTAL++))
    
    PACKAGE_CODE="BP-$(date +%s)"
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/benefit-packages" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"code\": \"$PACKAGE_CODE\",
            \"nameAr\": \"الباقة الذهبية\",
            \"nameEn\": \"Gold Package\",
            \"description\": \"Comprehensive health insurance package with premium coverage\",
            \"opCoverageLimit\": 50000.00,
            \"opCoPaymentPercentage\": 10.00,
            \"ipCoverageLimit\": 200000.00,
            \"ipCoPaymentPercentage\": 20.00,
            \"maternityCovered\": true,
            \"maternityCoverageLimit\": 30000.00,
            \"dentalCovered\": true,
            \"dentalCoverageLimit\": 5000.00,
            \"opticalCovered\": true,
            \"opticalCoverageLimit\": 2000.00,
            \"pharmacyCovered\": true,
            \"pharmacyCoverageLimit\": 10000.00,
            \"annualLimitPerMember\": 500000.00,
            \"lifetimeLimitPerMember\": 2000000.00,
            \"emergencyCovered\": true,
            \"chronicDiseaseCovered\": true,
            \"preExistingConditionsCovered\": false,
            \"active\": true
        }")
    
    PACKAGE_ID=$(echo "$RESPONSE" | jq -r '.data.id // empty')
    STATUS=$(echo "$RESPONSE" | jq -r '.status // empty')
    
    if [ -n "$PACKAGE_ID" ] && [ "$PACKAGE_ID" != "null" ] && [ "$STATUS" == "success" ]; then
        print_success "Benefit package created successfully (ID: $PACKAGE_ID)"
        print_info "Package Code: $PACKAGE_CODE"
    else
        print_failure "Failed to create benefit package" "$RESPONSE"
    fi
}

# ==============================
# Test 3: Get Package by ID
# ==============================
test_get_package_by_id() {
    print_test "3" "Get benefit package by ID"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/benefit-packages/$PACKAGE_ID" \
        -H "Authorization: Bearer $TOKEN")
    
    FETCHED_ID=$(echo "$RESPONSE" | jq -r '.data.id // empty')
    PACKAGE_NAME=$(echo "$RESPONSE" | jq -r '.data.nameEn // empty')
    
    if [ "$FETCHED_ID" == "$PACKAGE_ID" ]; then
        print_success "Benefit package retrieved successfully"
        print_info "Package Name: $PACKAGE_NAME"
    else
        print_failure "Failed to retrieve benefit package" "$RESPONSE"
    fi
}

# ==============================
# Test 4: List All Packages
# ==============================
test_list_packages() {
    print_test "4" "List all benefit packages"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/benefit-packages" \
        -H "Authorization: Bearer $TOKEN")
    
    ITEMS=$(echo "$RESPONSE" | jq -r '.data // empty')
    COUNT=$(echo "$RESPONSE" | jq -r '.data | length // 0')
    
    if [ -n "$ITEMS" ] && [ "$ITEMS" != "null" ]; then
        print_success "Benefit packages list retrieved (Count: $COUNT)"
    else
        print_failure "Failed to retrieve benefit packages list" "$RESPONSE"
    fi
}

# ==============================
# Test 5: Get Active Packages
# ==============================
test_get_active_packages() {
    print_test "5" "Get active benefit packages"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/benefit-packages/active" \
        -H "Authorization: Bearer $TOKEN")
    
    COUNT=$(echo "$RESPONSE" | jq -r '.data | length // 0')
    
    if [ "$COUNT" -ge 1 ]; then
        print_success "Active benefit packages retrieved (Count: $COUNT)"
    else
        print_failure "Failed to retrieve active benefit packages" "$RESPONSE"
    fi
}

# ==============================
# Test 6: Get Package by Code
# ==============================
test_get_by_code() {
    print_test "6" "Get benefit package by code"
    ((TOTAL++))
    
    PACKAGE_CODE=$(curl -s -X GET "$BASE_URL/benefit-packages/$PACKAGE_ID" \
        -H "Authorization: Bearer $TOKEN" | jq -r '.data.code // empty')
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/benefit-packages/code/$PACKAGE_CODE" \
        -H "Authorization: Bearer $TOKEN")
    
    FETCHED_ID=$(echo "$RESPONSE" | jq -r '.data.id // empty')
    
    if [ "$FETCHED_ID" == "$PACKAGE_ID" ]; then
        print_success "Benefit package found by code"
    else
        print_failure "Failed to find benefit package by code" "$RESPONSE"
    fi
}

# ==============================
# Test 7: Update Package
# ==============================
test_update_package() {
    print_test "7" "Update benefit package"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X PUT "$BASE_URL/benefit-packages/$PACKAGE_ID" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"code\": \"BP-UPDATED-$(date +%s)\",
            \"nameAr\": \"الباقة الذهبية المحدثة\",
            \"nameEn\": \"Gold Package - Updated\",
            \"description\": \"Updated comprehensive health insurance package\",
            \"opCoverageLimit\": 60000.00,
            \"opCoPaymentPercentage\": 10.00,
            \"ipCoverageLimit\": 250000.00,
            \"ipCoPaymentPercentage\": 20.00,
            \"maternityCovered\": true,
            \"maternityCoverageLimit\": 35000.00,
            \"dentalCovered\": true,
            \"dentalCoverageLimit\": 6000.00,
            \"opticalCovered\": true,
            \"opticalCoverageLimit\": 2500.00,
            \"pharmacyCovered\": true,
            \"pharmacyCoverageLimit\": 12000.00,
            \"annualLimitPerMember\": 600000.00,
            \"lifetimeLimitPerMember\": 2500000.00,
            \"emergencyCovered\": true,
            \"chronicDiseaseCovered\": true,
            \"preExistingConditionsCovered\": true,
            \"active\": true
        }")
    
    UPDATED_NAME=$(echo "$RESPONSE" | jq -r '.data.nameEn // empty')
    
    if [[ "$UPDATED_NAME" == *"Updated"* ]]; then
        print_success "Benefit package updated successfully"
        print_info "New Name: $UPDATED_NAME"
    else
        print_failure "Failed to update benefit package" "$RESPONSE"
    fi
}

# ==============================
# Test 8: Create Second Package
# ==============================
test_create_second_package() {
    print_test "8" "Create second benefit package (for deletion)"
    ((TOTAL++))
    
    PACKAGE_CODE_2="BP-DEL-$(date +%s)"
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/benefit-packages" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"code\": \"$PACKAGE_CODE_2\",
            \"nameAr\": \"الباقة الفضية\",
            \"nameEn\": \"Silver Package\",
            \"description\": \"Standard health insurance package\",
            \"opCoverageLimit\": 30000.00,
            \"opCoPaymentPercentage\": 15.00,
            \"ipCoverageLimit\": 100000.00,
            \"ipCoPaymentPercentage\": 25.00,
            \"maternityCovered\": false,
            \"dentalCovered\": false,
            \"opticalCovered\": false,
            \"pharmacyCovered\": true,
            \"pharmacyCoverageLimit\": 5000.00,
            \"annualLimitPerMember\": 200000.00,
            \"lifetimeLimitPerMember\": 1000000.00,
            \"emergencyCovered\": true,
            \"chronicDiseaseCovered\": false,
            \"preExistingConditionsCovered\": false,
            \"active\": true
        }")
    
    PACKAGE_ID_2=$(echo "$RESPONSE" | jq -r '.data.id // empty')
    
    if [ -n "$PACKAGE_ID_2" ] && [ "$PACKAGE_ID_2" != "null" ]; then
        print_success "Second benefit package created (ID: $PACKAGE_ID_2)"
        PACKAGE_ID=$PACKAGE_ID_2  # Update for deletion test
    else
        print_failure "Failed to create second benefit package" "$RESPONSE"
    fi
}

# ==============================
# Test 9: Create Third Package (Inactive)
# ==============================
test_create_inactive_package() {
    print_test "9" "Create inactive benefit package"
    ((TOTAL++))
    
    PACKAGE_CODE_3="BP-INACTIVE-$(date +%s)"
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/benefit-packages" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"code\": \"$PACKAGE_CODE_3\",
            \"nameAr\": \"الباقة البرونزية\",
            \"nameEn\": \"Bronze Package\",
            \"description\": \"Basic health insurance package\",
            \"opCoverageLimit\": 20000.00,
            \"opCoPaymentPercentage\": 20.00,
            \"ipCoverageLimit\": 50000.00,
            \"ipCoPaymentPercentage\": 30.00,
            \"maternityCovered\": false,
            \"dentalCovered\": false,
            \"opticalCovered\": false,
            \"pharmacyCovered\": true,
            \"pharmacyCoverageLimit\": 3000.00,
            \"annualLimitPerMember\": 100000.00,
            \"lifetimeLimitPerMember\": 500000.00,
            \"emergencyCovered\": true,
            \"chronicDiseaseCovered\": false,
            \"preExistingConditionsCovered\": false,
            \"active\": false
        }")
    
    PACKAGE_ID_3=$(echo "$RESPONSE" | jq -r '.data.id // empty')
    ACTIVE=$(echo "$RESPONSE" | jq -r '.data.active // empty')
    
    if [ -n "$PACKAGE_ID_3" ] && [ "$PACKAGE_ID_3" != "null" ] && [ "$ACTIVE" == "false" ]; then
        print_success "Inactive benefit package created (ID: $PACKAGE_ID_3)"
    else
        print_failure "Failed to create inactive benefit package" "$RESPONSE"
    fi
}

# ==============================
# Test 10: Verify Active Filter
# ==============================
test_verify_active_filter() {
    print_test "10" "Verify active filter excludes inactive packages"
    ((TOTAL++))
    
    # Get all packages
    ALL_RESPONSE=$(curl -s -X GET "$BASE_URL/benefit-packages" \
        -H "Authorization: Bearer $TOKEN")
    ALL_COUNT=$(echo "$ALL_RESPONSE" | jq -r '.data | length // 0')
    
    # Get active packages
    ACTIVE_RESPONSE=$(curl -s -X GET "$BASE_URL/benefit-packages/active" \
        -H "Authorization: Bearer $TOKEN")
    ACTIVE_COUNT=$(echo "$ACTIVE_RESPONSE" | jq -r '.data | length // 0')
    
    if [ "$ACTIVE_COUNT" -lt "$ALL_COUNT" ]; then
        print_success "Active filter working correctly (All: $ALL_COUNT, Active: $ACTIVE_COUNT)"
    else
        print_failure "Active filter not working properly" "All: $ALL_COUNT, Active: $ACTIVE_COUNT"
    fi
}

# ==============================
# Test 11: Validation - Missing Required Fields
# ==============================
test_validation_missing_fields() {
    print_test "11" "Validation - Missing required fields"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/benefit-packages" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "code": "",
            "nameAr": "",
            "nameEn": ""
        }')
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/benefit-packages" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "code": "",
            "nameAr": "",
            "nameEn": ""
        }')
    
    if [ "$HTTP_CODE" == "400" ] || [ "$HTTP_CODE" == "422" ]; then
        print_success "Validation working correctly (HTTP $HTTP_CODE)"
    else
        print_failure "Validation failed (Expected 400/422, got $HTTP_CODE)" "$RESPONSE"
    fi
}

# ==============================
# Test 12: Unauthorized Access
# ==============================
test_unauthorized_access() {
    print_test "12" "Test unauthorized access (no token)"
    ((TOTAL++))
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/benefit-packages")
    
    if [ "$HTTP_CODE" == "403" ] || [ "$HTTP_CODE" == "401" ]; then
        print_success "Unauthorized access blocked (HTTP $HTTP_CODE)"
    else
        print_failure "Unauthorized access test failed (Expected 401/403, got $HTTP_CODE)" ""
    fi
}

# ==============================
# Test 13: Handle 404 Not Found
# ==============================
test_not_found() {
    print_test "13" "Handle non-existent benefit package (404)"
    ((TOTAL++))
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/benefit-packages/999999" \
        -H "Authorization: Bearer $TOKEN")
    
    if [ "$HTTP_CODE" == "404" ]; then
        print_success "404 Not Found handled correctly"
    else
        print_failure "404 test failed (Expected 404, got $HTTP_CODE)" ""
    fi
}

# ==============================
# Test 14: Delete Package
# ==============================
test_delete_package() {
    print_test "14" "Delete benefit package"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X DELETE "$BASE_URL/benefit-packages/$PACKAGE_ID" \
        -H "Authorization: Bearer $TOKEN")
    
    STATUS=$(echo "$RESPONSE" | jq -r '.status // empty')
    
    if [ "$STATUS" == "success" ]; then
        print_success "Benefit package deleted successfully"
    else
        print_failure "Failed to delete benefit package" "$RESPONSE"
    fi
}

# ==============================
# Test 15: Verify Deletion
# ==============================
test_verify_deletion() {
    print_test "15" "Verify benefit package deletion"
    ((TOTAL++))
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/benefit-packages/$PACKAGE_ID" \
        -H "Authorization: Bearer $TOKEN")
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/benefit-packages/$PACKAGE_ID" \
        -H "Authorization: Bearer $TOKEN")
    
    RESPONSE_STATUS=$(echo "$RESPONSE" | jq -r '.status // empty')
    
    if [ "$HTTP_CODE" == "404" ] || [ "$RESPONSE_STATUS" == "error" ]; then
        print_success "Benefit package deletion verified"
    else
        print_failure "Benefit package still exists after deletion" "$RESPONSE"
    fi
}

# ==============================
# Run All Tests
# ==============================
echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║    BENEFIT PACKAGES MODULE - COMPREHENSIVE TEST SUITE     ║${NC}"
echo -e "${CYAN}║                   TBA WAAD System - Phase G                ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

test_authentication
test_create_package
test_get_package_by_id
test_list_packages
test_get_active_packages
test_get_by_code
test_update_package
test_create_second_package
test_create_inactive_package
test_verify_active_filter
test_validation_missing_fields
test_unauthorized_access
test_not_found
test_delete_package
test_verify_deletion

# ==============================
# Summary
# ==============================
echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                      TEST SUMMARY                          ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "Total Tests: ${BLUE}$TOTAL${NC}"
echo -e "Passed:      ${GREEN}$PASSED${NC}"
echo -e "Failed:      ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║           ✓ ALL TESTS PASSED SUCCESSFULLY ✓               ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║              ✗ SOME TESTS FAILED ✗                        ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
