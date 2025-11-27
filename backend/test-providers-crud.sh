#!/bin/bash

# ==============================
# TBA Waad System - Providers Module Test Script
# ==============================
# Purpose: Comprehensive automated testing of Providers CRUD API
# Uses Official Entities Only
# ==============================

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# API Configuration
BASE_URL="http://localhost:8080/api"
AUTH_ENDPOINT="${BASE_URL}/auth/login"
PROVIDERS_ENDPOINT="${BASE_URL}/providers"

# Test credentials
ADMIN_USERNAME="admin@tba.sa"
ADMIN_PASSWORD="Admin@123"

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# JWT Token
JWT_TOKEN=""

# Test data IDs
PROVIDER_ID=""

# ==============================
# Utility Functions
# ==============================

print_header() {
    echo -e "\n${CYAN}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════════════════════${NC}\n"
}

print_test() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${BLUE}[TEST #${TOTAL_TESTS}]${NC} $1"
}

print_success() {
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}✓ PASS:${NC} $1"
}

print_fail() {
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}✗ FAIL:${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ INFO:${NC} $1"
}

print_summary() {
    echo -e "\n${CYAN}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  TEST SUMMARY${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════════════════════${NC}"
    echo -e "Total Tests: ${TOTAL_TESTS}"
    echo -e "${GREEN}Passed: ${TESTS_PASSED}${NC}"
    echo -e "${RED}Failed: ${TESTS_FAILED}${NC}"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "\n${GREEN}✓ ALL TESTS PASSED!${NC} 🎉"
    else
        echo -e "\n${RED}✗ SOME TESTS FAILED${NC} ⚠️"
    fi
    echo -e "${CYAN}════════════════════════════════════════════════════════════════${NC}\n"
}

# ==============================
# Test Functions
# ==============================

test_login() {
    print_header "TEST 1: Authentication"
    print_test "Admin login to obtain JWT token"
    
    RESPONSE=$(curl -s -X POST "${AUTH_ENDPOINT}" \
        -H "Content-Type: application/json" \
        -d "{
            \"identifier\": \"${ADMIN_USERNAME}\",
            \"password\": \"${ADMIN_PASSWORD}\"
        }")
    
    JWT_TOKEN=$(echo "$RESPONSE" | jq -r '.data.token')
    
    if [ "$JWT_TOKEN" != "null" ] && [ -n "$JWT_TOKEN" ]; then
        print_success "Login successful, JWT token obtained"
        print_info "Token: ${JWT_TOKEN:0:50}..."
    else
        print_fail "Login failed or invalid token"
        echo "$RESPONSE" | jq '.'
        exit 1
    fi
}

test_create_provider() {
    print_header "TEST 2: Create Provider"
    print_test "Creating healthcare provider (مستشفى طرابلس المركزي)"
    
    RESPONSE=$(curl -s -X POST "${PROVIDERS_ENDPOINT}" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${JWT_TOKEN}" \
        -d '{
            "name": "مستشفى طرابلس المركزي",
            "nameEn": "Tripoli Central Hospital",
            "code": "TCH-001",
            "licenseNumber": "LIC-HOSPITAL-001",
            "providerType": "HOSPITAL",
            "phone": "+218213334444",
            "email": "info@tripoli-hospital.ly",
            "address": "طرابلس، ليبيا",
            "city": "طرابلس",
            "active": true
        }')
    
    PROVIDER_ID=$(echo "$RESPONSE" | jq -r '.data.id // .id')
    
    if [ "$PROVIDER_ID" != "null" ] && [ -n "$PROVIDER_ID" ]; then
        print_success "Provider created successfully (ID: $PROVIDER_ID)"
        echo "$RESPONSE" | jq '.'
    else
        # Try to fetch existing provider
        print_info "Provider might already exist, fetching..."
        RESPONSE=$(curl -s -X GET "${PROVIDERS_ENDPOINT}?search=TCH-001&page=0&size=1" \
            -H "Authorization: Bearer ${JWT_TOKEN}")
        
        PROVIDER_ID=$(echo "$RESPONSE" | jq -r '.data.items[0].id')
        
        if [ "$PROVIDER_ID" != "null" ] && [ -n "$PROVIDER_ID" ]; then
            print_success "Using existing provider (ID: $PROVIDER_ID)"
        else
            print_fail "Failed to create or fetch provider"
            echo "$RESPONSE" | jq '.'
            exit 1
        fi
    fi
}

test_get_provider_by_id() {
    print_header "TEST 3: Get Provider by ID"
    print_test "Fetching provider details by ID: $PROVIDER_ID"
    
    RESPONSE=$(curl -s -X GET "${PROVIDERS_ENDPOINT}/${PROVIDER_ID}" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    NAME=$(echo "$RESPONSE" | jq -r '.data.name')
    LICENSE=$(echo "$RESPONSE" | jq -r '.data.licenseNumber')
    
    if [ "$NAME" == "مستشفى طرابلس المركزي" ] && [ "$LICENSE" == "LIC-HOSPITAL-001" ]; then
        print_success "Provider retrieved successfully"
        echo "$RESPONSE" | jq '.'
    else
        print_fail "Failed to retrieve provider correctly"
        echo "$RESPONSE" | jq '.'
    fi
}

test_list_providers() {
    print_header "TEST 4: List Providers (Paginated)"
    print_test "Fetching paginated list of providers (page 0, size 10)"
    
    RESPONSE=$(curl -s -X GET "${PROVIDERS_ENDPOINT}?page=0&size=10" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    TOTAL_ELEMENTS=$(echo "$RESPONSE" | jq -r '.data.total // .data.totalElements')
    CONTENT_LENGTH=$(echo "$RESPONSE" | jq '.data.items | length // .data.content | length')
    
    if [ "$TOTAL_ELEMENTS" != "null" ] && [ "$TOTAL_ELEMENTS" -ge 1 ]; then
        print_success "Providers list retrieved successfully (Total: $TOTAL_ELEMENTS, Returned: $CONTENT_LENGTH)"
        echo "$RESPONSE" | jq '.data.items[0] // .data.content[0]'
    else
        print_fail "Failed to retrieve providers list"
        echo "$RESPONSE" | jq '.'
    fi
}

test_search_providers() {
    print_header "TEST 5: Search Providers"
    print_test "Searching providers by name: 'طرابلس'"
    
    RESPONSE=$(curl -s -X GET "${PROVIDERS_ENDPOINT}?search=طرابلس&page=0&size=10" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    TOTAL_ELEMENTS=$(echo "$RESPONSE" | jq -r '.data.total // .data.totalElements')
    FIRST_NAME=$(echo "$RESPONSE" | jq -r '.data.items[0].name // .data.content[0].name')
    
    if [ "$TOTAL_ELEMENTS" -ge 1 ] && [[ "$FIRST_NAME" == *"طرابلس"* ]]; then
        print_success "Search returned ${TOTAL_ELEMENTS} result(s)"
        echo "$RESPONSE" | jq '.data.items[0] // .data.content[0]'
    else
        print_fail "Search failed to return expected results"
        echo "$RESPONSE" | jq '.'
    fi
}

test_filter_by_type() {
    print_header "TEST 6: Filter Providers by Type"
    print_test "Filtering providers by type: HOSPITAL"
    
    RESPONSE=$(curl -s -X GET "${PROVIDERS_ENDPOINT}?providerType=HOSPITAL&page=0&size=10" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    TOTAL_ELEMENTS=$(echo "$RESPONSE" | jq -r '.data.total // .data.totalElements')
    FIRST_TYPE=$(echo "$RESPONSE" | jq -r '.data.items[0].providerType // .data.content[0].providerType')
    
    if [ "$TOTAL_ELEMENTS" -ge 1 ] && [ "$FIRST_TYPE" == "HOSPITAL" ]; then
        print_success "Type filter working correctly (Hospitals: $TOTAL_ELEMENTS)"
        echo "$RESPONSE" | jq '.data.items[0] // .data.content[0]'
    else
        print_fail "Type filter not working as expected"
        echo "$RESPONSE" | jq '.'
    fi
}

test_filter_by_license() {
    print_header "TEST 7: Get Provider by License Number"
    print_test "Fetching provider by license: LIC-HOSPITAL-001"
    
    RESPONSE=$(curl -s -X GET "${PROVIDERS_ENDPOINT}/license/LIC-HOSPITAL-001" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    LICENSE=$(echo "$RESPONSE" | jq -r '.data.licenseNumber')
    
    if [ "$LICENSE" == "LIC-HOSPITAL-001" ]; then
        print_success "Provider retrieved by license successfully"
        echo "$RESPONSE" | jq '.'
    else
        print_fail "Failed to retrieve provider by license"
        echo "$RESPONSE" | jq '.'
    fi
}

test_filter_by_status() {
    print_header "TEST 8: Filter Providers by Status"
    print_test "Filtering active providers only"
    
    RESPONSE=$(curl -s -X GET "${PROVIDERS_ENDPOINT}?status=true&page=0&size=10" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    TOTAL_ELEMENTS=$(echo "$RESPONSE" | jq -r '.data.total // .data.totalElements')
    FIRST_ACTIVE=$(echo "$RESPONSE" | jq -r '.data.items[0].active // .data.content[0].active')
    
    if [ "$TOTAL_ELEMENTS" -ge 1 ] && [ "$FIRST_ACTIVE" == "true" ]; then
        print_success "Status filter working correctly (Active providers: $TOTAL_ELEMENTS)"
        echo "$RESPONSE" | jq '.data.items[0] // .data.content[0]'
    else
        print_fail "Status filter not working as expected"
        echo "$RESPONSE" | jq '.'
    fi
}

test_update_provider() {
    print_header "TEST 9: Update Provider"
    print_test "Updating provider details (ID: $PROVIDER_ID)"
    
    RESPONSE=$(curl -s -X PUT "${PROVIDERS_ENDPOINT}/${PROVIDER_ID}" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${JWT_TOKEN}" \
        -d "{
            \"name\": \"مستشفى طرابلس المركزي\",
            \"nameEn\": \"Tripoli Central Hospital\",
            \"code\": \"TCH-001\",
            \"licenseNumber\": \"LIC-HOSPITAL-001\",
            \"providerType\": \"HOSPITAL\",
            \"phone\": \"+218213334455\",
            \"email\": \"contact@tripoli-hospital.ly\",
            \"address\": \"طرابلس المركز، ليبيا\",
            \"city\": \"طرابلس\",
            \"active\": true
        }")
    
    UPDATED_PHONE=$(echo "$RESPONSE" | jq -r '.data.phone')
    UPDATED_EMAIL=$(echo "$RESPONSE" | jq -r '.data.email')
    
    if [ "$UPDATED_PHONE" == "+218213334455" ] && [ "$UPDATED_EMAIL" == "contact@tripoli-hospital.ly" ]; then
        print_success "Provider updated successfully"
        echo "$RESPONSE" | jq '.'
    else
        print_fail "Failed to update provider"
        echo "$RESPONSE" | jq '.'
    fi
}

test_unauthorized_access() {
    print_header "TEST 10: Unauthorized Access (Security Test)"
    print_test "Attempting to access providers without JWT token"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "${PROVIDERS_ENDPOINT}")
    
    if [ "$HTTP_CODE" == "401" ] || [ "$HTTP_CODE" == "403" ]; then
        print_success "Unauthorized access correctly blocked (HTTP $HTTP_CODE)"
    else
        print_fail "Security issue: Unauthorized access not blocked (HTTP $HTTP_CODE)"
    fi
}

test_not_found() {
    print_header "TEST 11: Not Found (404 Test)"
    print_test "Attempting to fetch non-existent provider (ID: 999999)"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "${PROVIDERS_ENDPOINT}/999999" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    if [ "$HTTP_CODE" == "404" ]; then
        print_success "404 Not Found handled correctly"
    else
        print_fail "Expected 404, got HTTP $HTTP_CODE"
    fi
}

test_delete_provider() {
    print_header "TEST 12: Delete Provider"
    print_test "Deleting provider (ID: $PROVIDER_ID)"
    
    RESPONSE=$(curl -s -X DELETE "${PROVIDERS_ENDPOINT}/${PROVIDER_ID}" \
        -H "Authorization: Bearer ${JWT_TOKEN}")
    
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    MESSAGE=$(echo "$RESPONSE" | jq -r '.message')
    
    if [ "$STATUS" == "success" ] || [[ "$MESSAGE" == *"success"* ]] || [[ "$MESSAGE" == *"deleted"* ]]; then
        print_success "Provider deleted successfully"
        
        # Verify deletion
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "${PROVIDERS_ENDPOINT}/${PROVIDER_ID}" \
            -H "Authorization: Bearer ${JWT_TOKEN}")
        
        if [ "$HTTP_CODE" == "404" ]; then
            print_success "Deletion verified (HTTP 404 on subsequent GET)"
        else
            print_fail "Provider still exists after deletion (HTTP $HTTP_CODE)"
        fi
    else
        print_fail "Failed to delete provider"
        echo "$RESPONSE" | jq '.'
    fi
}

# ==============================
# Main Execution
# ==============================

main() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                                                                ║"
    echo "║        TBA WAAD SYSTEM - PROVIDERS MODULE TEST SUITE           ║"
    echo "║                                                                ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    
    print_info "API Base URL: ${BASE_URL}"
    print_info "Testing as user: ${ADMIN_USERNAME}"
    print_info "Start Time: $(date)"
    
    # Check if jq is installed
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}Error: jq is not installed. Please install jq to parse JSON responses.${NC}"
        exit 1
    fi
    
    # Run all tests
    test_login
    test_create_provider
    test_get_provider_by_id
    test_list_providers
    test_search_providers
    test_filter_by_type
    test_filter_by_license
    test_filter_by_status
    test_update_provider
    test_unauthorized_access
    test_not_found
    test_delete_provider
    
    # Print summary
    print_summary
    
    print_info "End Time: $(date)"
    
    # Exit with appropriate code
    if [ $TESTS_FAILED -eq 0 ]; then
        exit 0
    else
        exit 1
    fi
}

# Run main function
main "$@"
