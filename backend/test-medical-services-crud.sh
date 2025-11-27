#!/bin/bash

# ==============================================================================
# Medical Services Module - CRUD Test Script
# ==============================================================================
# Tests all CRUD operations for medical services including:
# - List all services
# - Create service
# - Get service by ID
# - Update service
# - Delete service
# - Category relationships
# - Pricing validation
# - Status toggling
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="${BASE_URL:-http://localhost:8080}"
API_URL="$BASE_URL/api"

# Test credentials (Update these with valid credentials)
USERNAME="${TEST_USERNAME:-admin@tba.ly}"
PASSWORD="${TEST_PASSWORD:-admin123}"

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Variables to store test data
AUTH_TOKEN=""
CATEGORY_ID=""
SERVICE_ID=""
SERVICE_CODE="TEST-SVC-$(date +%s)"

# ==============================================================================
# Helper Functions
# ==============================================================================

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_test() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo ""
    echo -e "${YELLOW}Test #${TOTAL_TESTS}: $1${NC}"
}

print_success() {
    PASSED_TESTS=$((PASSED_TESTS + 1))
    echo -e "${GREEN}✓ PASS: $1${NC}"
}

print_failure() {
    FAILED_TESTS=$((FAILED_TESTS + 1))
    echo -e "${RED}✗ FAIL: $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ INFO: $1${NC}"
}

# ==============================================================================
# Test Functions
# ==============================================================================

# Test 1: Authentication
test_authentication() {
    print_test "Authenticate user"
    
    RESPONSE=$(curl -s -X POST "$API_URL/auth/signin" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")
    
    AUTH_TOKEN=$(echo "$RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    
    if [ -n "$AUTH_TOKEN" ]; then
        print_success "Authentication successful"
        print_info "Token: ${AUTH_TOKEN:0:20}..."
        return 0
    else
        print_failure "Authentication failed"
        echo "Response: $RESPONSE"
        exit 1
    fi
}

# Test 2: Get first medical category (needed for creating services)
test_get_medical_category() {
    print_test "Get medical category for testing"
    
    RESPONSE=$(curl -s -X GET "$API_URL/medical-categories" \
        -H "Authorization: Bearer $AUTH_TOKEN")
    
    CATEGORY_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    
    if [ -n "$CATEGORY_ID" ]; then
        print_success "Found medical category with ID: $CATEGORY_ID"
        return 0
    else
        print_failure "No medical categories found"
        echo "Response: $RESPONSE"
        exit 1
    fi
}

# Test 3: List all medical services (initial)
test_list_services_initial() {
    print_test "List all medical services (initial state)"
    
    RESPONSE=$(curl -s -X GET "$API_URL/medical-services" \
        -H "Authorization: Bearer $AUTH_TOKEN")
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        print_success "Successfully retrieved medical services list"
        COUNT=$(echo "$RESPONSE" | grep -o '"id":' | wc -l)
        print_info "Found $COUNT existing services"
        return 0
    else
        print_failure "Failed to retrieve medical services"
        echo "Response: $RESPONSE"
        return 1
    fi
}

# Test 4: Create medical service - Valid data
test_create_service_valid() {
    print_test "Create medical service with valid data"
    
    RESPONSE=$(curl -s -X POST "$API_URL/medical-services" \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"code\": \"$SERVICE_CODE\",
            \"nameAr\": \"خدمة طبية تجريبية\",
            \"nameEn\": \"Test Medical Service\",
            \"categoryId\": $CATEGORY_ID,
            \"priceLyd\": 150.00,
            \"costLyd\": 100.00,
            \"coverageLimit\": 200.00,
            \"description\": \"This is a test medical service for automated testing\",
            \"active\": true
        }")
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        SERVICE_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)
        print_success "Service created successfully with ID: $SERVICE_ID"
        print_info "Service Code: $SERVICE_CODE"
        return 0
    else
        print_failure "Failed to create service"
        echo "Response: $RESPONSE"
        return 1
    fi
}

# Test 5: Create medical service - Missing required fields
test_create_service_missing_fields() {
    print_test "Create medical service with missing required fields"
    
    RESPONSE=$(curl -s -X POST "$API_URL/medical-services" \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"nameAr\": \"خدمة ناقصة\"
        }")
    
    if echo "$RESPONSE" | grep -q '"success":false'; then
        print_success "Correctly rejected service with missing fields"
        return 0
    else
        print_failure "Should have rejected service with missing fields"
        echo "Response: $RESPONSE"
        return 1
    fi
}

# Test 6: Create medical service - Duplicate code
test_create_service_duplicate_code() {
    print_test "Create medical service with duplicate code"
    
    RESPONSE=$(curl -s -X POST "$API_URL/medical-services" \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"code\": \"$SERVICE_CODE\",
            \"nameAr\": \"خدمة مكررة\",
            \"nameEn\": \"Duplicate Service\",
            \"categoryId\": $CATEGORY_ID,
            \"priceLyd\": 100.00,
            \"active\": true
        }")
    
    if echo "$RESPONSE" | grep -q '"success":false'; then
        print_success "Correctly rejected duplicate service code"
        return 0
    else
        print_failure "Should have rejected duplicate service code"
        echo "Response: $RESPONSE"
        return 1
    fi
}

# Test 7: Get service by ID
test_get_service_by_id() {
    print_test "Get medical service by ID"
    
    if [ -z "$SERVICE_ID" ]; then
        print_failure "No service ID available for testing"
        return 1
    fi
    
    RESPONSE=$(curl -s -X GET "$API_URL/medical-services/$SERVICE_ID" \
        -H "Authorization: Bearer $AUTH_TOKEN")
    
    if echo "$RESPONSE" | grep -q "\"code\":\"$SERVICE_CODE\""; then
        print_success "Successfully retrieved service by ID"
        print_info "Service: $(echo "$RESPONSE" | grep -o '"nameEn":"[^"]*' | cut -d'"' -f4)"
        return 0
    else
        print_failure "Failed to retrieve service by ID"
        echo "Response: $RESPONSE"
        return 1
    fi
}

# Test 8: Update medical service - Valid data
test_update_service_valid() {
    print_test "Update medical service with valid data"
    
    if [ -z "$SERVICE_ID" ]; then
        print_failure "No service ID available for testing"
        return 1
    fi
    
    RESPONSE=$(curl -s -X PUT "$API_URL/medical-services/$SERVICE_ID" \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"code\": \"$SERVICE_CODE\",
            \"nameAr\": \"خدمة طبية محدثة\",
            \"nameEn\": \"Updated Medical Service\",
            \"categoryId\": $CATEGORY_ID,
            \"priceLyd\": 200.00,
            \"costLyd\": 150.00,
            \"coverageLimit\": 300.00,
            \"description\": \"This service has been updated\",
            \"active\": true
        }")
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        print_success "Service updated successfully"
        return 0
    else
        print_failure "Failed to update service"
        echo "Response: $RESPONSE"
        return 1
    fi
}

# Test 9: Update medical service - Change price
test_update_service_price() {
    print_test "Update medical service price"
    
    if [ -z "$SERVICE_ID" ]; then
        print_failure "No service ID available for testing"
        return 1
    fi
    
    RESPONSE=$(curl -s -X PUT "$API_URL/medical-services/$SERVICE_ID" \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"code\": \"$SERVICE_CODE\",
            \"nameAr\": \"خدمة طبية محدثة\",
            \"nameEn\": \"Updated Medical Service\",
            \"categoryId\": $CATEGORY_ID,
            \"priceLyd\": 250.00,
            \"costLyd\": 150.00,
            \"active\": true
        }")
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        print_success "Service price updated successfully"
        return 0
    else
        print_failure "Failed to update service price"
        echo "Response: $RESPONSE"
        return 1
    fi
}

# Test 10: Update medical service - Toggle status
test_update_service_status() {
    print_test "Toggle medical service status (deactivate)"
    
    if [ -z "$SERVICE_ID" ]; then
        print_failure "No service ID available for testing"
        return 1
    fi
    
    RESPONSE=$(curl -s -X PUT "$API_URL/medical-services/$SERVICE_ID" \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"code\": \"$SERVICE_CODE\",
            \"nameAr\": \"خدمة طبية محدثة\",
            \"nameEn\": \"Updated Medical Service\",
            \"categoryId\": $CATEGORY_ID,
            \"priceLyd\": 250.00,
            \"costLyd\": 150.00,
            \"active\": false
        }")
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        print_success "Service status toggled successfully"
        return 0
    else
        print_failure "Failed to toggle service status"
        echo "Response: $RESPONSE"
        return 1
    fi
}

# Test 11: List services after create
test_list_services_after_create() {
    print_test "List all medical services (after create)"
    
    RESPONSE=$(curl -s -X GET "$API_URL/medical-services" \
        -H "Authorization: Bearer $AUTH_TOKEN")
    
    if echo "$RESPONSE" | grep -q "\"code\":\"$SERVICE_CODE\""; then
        print_success "New service appears in the list"
        return 0
    else
        print_failure "New service not found in list"
        echo "Response: $RESPONSE"
        return 1
    fi
}

# Test 12: Search services by code
test_search_by_code() {
    print_test "Search services by code"
    
    RESPONSE=$(curl -s -X GET "$API_URL/medical-services?code=$SERVICE_CODE" \
        -H "Authorization: Bearer $AUTH_TOKEN")
    
    if echo "$RESPONSE" | grep -q "\"code\":\"$SERVICE_CODE\""; then
        print_success "Successfully found service by code"
        return 0
    else
        print_failure "Failed to find service by code"
        echo "Response: $RESPONSE"
        return 1
    fi
}

# Test 13: Filter services by category
test_filter_by_category() {
    print_test "Filter services by category"
    
    RESPONSE=$(curl -s -X GET "$API_URL/medical-services?categoryId=$CATEGORY_ID" \
        -H "Authorization: Bearer $AUTH_TOKEN")
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        print_success "Successfully filtered services by category"
        COUNT=$(echo "$RESPONSE" | grep -o '"id":' | wc -l)
        print_info "Found $COUNT services in category $CATEGORY_ID"
        return 0
    else
        print_failure "Failed to filter services by category"
        echo "Response: $RESPONSE"
        return 1
    fi
}

# Test 14: Get active services only
test_get_active_services() {
    print_test "Get active services only"
    
    RESPONSE=$(curl -s -X GET "$API_URL/medical-services?active=true" \
        -H "Authorization: Bearer $AUTH_TOKEN")
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        print_success "Successfully retrieved active services"
        COUNT=$(echo "$RESPONSE" | grep -o '"active":true' | wc -l)
        print_info "Found $COUNT active services"
        return 0
    else
        print_failure "Failed to retrieve active services"
        echo "Response: $RESPONSE"
        return 1
    fi
}

# Test 15: Update with invalid category
test_update_invalid_category() {
    print_test "Update service with invalid category ID"
    
    if [ -z "$SERVICE_ID" ]; then
        print_failure "No service ID available for testing"
        return 1
    fi
    
    RESPONSE=$(curl -s -X PUT "$API_URL/medical-services/$SERVICE_ID" \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"code\": \"$SERVICE_CODE\",
            \"nameAr\": \"خدمة طبية\",
            \"nameEn\": \"Medical Service\",
            \"categoryId\": 999999,
            \"priceLyd\": 100.00,
            \"active\": true
        }")
    
    if echo "$RESPONSE" | grep -q '"success":false'; then
        print_success "Correctly rejected invalid category ID"
        return 0
    else
        print_failure "Should have rejected invalid category ID"
        echo "Response: $RESPONSE"
        return 1
    fi
}

# Test 16: Update with negative price
test_update_negative_price() {
    print_test "Update service with negative price"
    
    if [ -z "$SERVICE_ID" ]; then
        print_failure "No service ID available for testing"
        return 1
    fi
    
    RESPONSE=$(curl -s -X PUT "$API_URL/medical-services/$SERVICE_ID" \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"code\": \"$SERVICE_CODE\",
            \"nameAr\": \"خدمة طبية\",
            \"nameEn\": \"Medical Service\",
            \"categoryId\": $CATEGORY_ID,
            \"priceLyd\": -50.00,
            \"active\": true
        }")
    
    if echo "$RESPONSE" | grep -q '"success":false'; then
        print_success "Correctly rejected negative price"
        return 0
    else
        print_failure "Should have rejected negative price"
        echo "Response: $RESPONSE"
        return 1
    fi
}

# Test 17: Get non-existent service
test_get_nonexistent_service() {
    print_test "Get non-existent service"
    
    RESPONSE=$(curl -s -X GET "$API_URL/medical-services/999999" \
        -H "Authorization: Bearer $AUTH_TOKEN")
    
    if echo "$RESPONSE" | grep -q '"success":false'; then
        print_success "Correctly handled non-existent service"
        return 0
    else
        print_failure "Should have returned error for non-existent service"
        echo "Response: $RESPONSE"
        return 1
    fi
}

# Test 18: Delete medical service
test_delete_service() {
    print_test "Delete medical service"
    
    if [ -z "$SERVICE_ID" ]; then
        print_failure "No service ID available for testing"
        return 1
    fi
    
    RESPONSE=$(curl -s -X DELETE "$API_URL/medical-services/$SERVICE_ID" \
        -H "Authorization: Bearer $AUTH_TOKEN")
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        print_success "Service deleted successfully"
        return 0
    else
        print_failure "Failed to delete service"
        echo "Response: $RESPONSE"
        return 1
    fi
}

# Test 19: Verify service deleted
test_verify_service_deleted() {
    print_test "Verify service is deleted"
    
    if [ -z "$SERVICE_ID" ]; then
        print_failure "No service ID available for testing"
        return 1
    fi
    
    RESPONSE=$(curl -s -X GET "$API_URL/medical-services/$SERVICE_ID" \
        -H "Authorization: Bearer $AUTH_TOKEN")
    
    if echo "$RESPONSE" | grep -q '"success":false'; then
        print_success "Service is properly deleted"
        return 0
    else
        print_failure "Service still exists after deletion"
        echo "Response: $RESPONSE"
        return 1
    fi
}

# Test 20: List services after delete
test_list_services_after_delete() {
    print_test "List all medical services (after delete)"
    
    RESPONSE=$(curl -s -X GET "$API_URL/medical-services" \
        -H "Authorization: Bearer $AUTH_TOKEN")
    
    if echo "$RESPONSE" | grep -q "\"code\":\"$SERVICE_CODE\""; then
        print_failure "Deleted service still appears in list"
        echo "Response: $RESPONSE"
        return 1
    else
        print_success "Deleted service removed from list"
        return 0
    fi
}

# ==============================================================================
# Main Test Execution
# ==============================================================================

main() {
    print_header "MEDICAL SERVICES MODULE - CRUD TESTS"
    
    echo ""
    echo "Base URL: $BASE_URL"
    echo "API URL: $API_URL"
    echo "Username: $USERNAME"
    echo ""
    
    # Authentication
    test_authentication
    
    # Get test data (category)
    test_get_medical_category
    
    # Run all tests
    test_list_services_initial
    test_create_service_valid
    test_create_service_missing_fields
    test_create_service_duplicate_code
    test_get_service_by_id
    test_update_service_valid
    test_update_service_price
    test_update_service_status
    test_list_services_after_create
    test_search_by_code
    test_filter_by_category
    test_get_active_services
    test_update_invalid_category
    test_update_negative_price
    test_get_nonexistent_service
    test_delete_service
    test_verify_service_deleted
    test_list_services_after_delete
    
    # Print summary
    print_header "TEST SUMMARY"
    echo ""
    echo -e "Total Tests:  ${BLUE}$TOTAL_TESTS${NC}"
    echo -e "Passed:       ${GREEN}$PASSED_TESTS${NC}"
    echo -e "Failed:       ${RED}$FAILED_TESTS${NC}"
    echo ""
    
    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}   ALL TESTS PASSED! ✓${NC}"
        echo -e "${GREEN}========================================${NC}"
        exit 0
    else
        echo -e "${RED}========================================${NC}"
        echo -e "${RED}   SOME TESTS FAILED! ✗${NC}"
        echo -e "${RED}========================================${NC}"
        exit 1
    fi
}

# Run main function
main
