#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:8080/api"
TOKEN=""
TEST_MEMBER_ID=""

# Counter
PASSED=0
FAILED=0

# Helper functions
log_test() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
    ((PASSED++))
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
    ((FAILED++))
}

log_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

# Test 1: Login and get token
test_login() {
    log_test "Test 1: Login to get JWT token"
    
    RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"identifier": "admin@tba.sa", "password": "Admin@123"}')
    
    TOKEN=$(echo "$RESPONSE" | jq -r '.data.token')
    
    if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
        log_success "Login successful, got JWT token"
        log_info "Token: ${TOKEN:0:50}..."
    else
        log_error "Login failed: $RESPONSE"
        exit 1
    fi
}

# Test 2: GET /api/members (empty or with data)
test_get_members_list() {
    log_test "Test 2: GET /api/members - Fetch members list"
    
    RESPONSE=$(curl -s -X GET "${BASE_URL}/members?page=0&size=10" \
        -H "Authorization: Bearer $TOKEN")
    
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    
    if [ "$STATUS" == "success" ]; then
        TOTAL=$(echo "$RESPONSE" | jq -r '.data.totalElements')
        log_success "Members list fetched successfully (Total: $TOTAL)"
        
        # Check if empty (for empty state test)
        if [ "$TOTAL" == "0" ]; then
            log_info "✅ Empty state will be displayed (totalElements = 0)"
        fi
    else
        log_error "Failed to fetch members: $RESPONSE"
    fi
}

# Test 3: POST /api/members - Create new member
test_create_member() {
    log_test "Test 3: POST /api/members - Create new member"
    
    RANDOM_NUM=$RANDOM
    NEW_MEMBER='{
        "fullName": "Test Member '$RANDOM_NUM'",
        "civilId": "29910'$RANDOM_NUM'",
        "policyNumber": "POL-2024-'$RANDOM_NUM'",
        "email": "test'$RANDOM_NUM'@example.com",
        "phone": "+96550'$RANDOM_NUM'0",
        "dateOfBirth": "1999-01-01",
        "gender": "MALE",
        "employerId": 1,
        "companyId": 1,
        "active": true
    }'
    
    RESPONSE=$(curl -s -X POST "${BASE_URL}/members" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "$NEW_MEMBER")
    
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    
    if [ "$STATUS" == "success" ]; then
        TEST_MEMBER_ID=$(echo "$RESPONSE" | jq -r '.data.id')
        log_success "Member created successfully (ID: $TEST_MEMBER_ID)"
        log_info "Name: $(echo "$RESPONSE" | jq -r '.data.fullName')"
        log_info "Civil ID: $(echo "$RESPONSE" | jq -r '.data.civilId')"
    else
        log_error "Failed to create member: $RESPONSE"
    fi
}

# Test 4: GET /api/members/{id} - Get single member
test_get_member_by_id() {
    if [ -z "$TEST_MEMBER_ID" ]; then
        log_error "Test 4 skipped: No member ID available"
        return
    fi
    
    log_test "Test 4: GET /api/members/$TEST_MEMBER_ID - Fetch single member"
    
    RESPONSE=$(curl -s -X GET "${BASE_URL}/members/${TEST_MEMBER_ID}" \
        -H "Authorization: Bearer $TOKEN")
    
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    
    if [ "$STATUS" == "success" ]; then
        log_success "Member fetched successfully"
        log_info "Full Name: $(echo "$RESPONSE" | jq -r '.data.fullName')"
    else
        log_error "Failed to fetch member: $RESPONSE"
    fi
}

# Test 5: PUT /api/members/{id} - Update member
test_update_member() {
    if [ -z "$TEST_MEMBER_ID" ]; then
        log_error "Test 5 skipped: No member ID available"
        return
    fi
    
    log_test "Test 5: PUT /api/members/$TEST_MEMBER_ID - Update member"
    
    RANDOM_NUM2=$RANDOM
    UPDATED_MEMBER='{
        "fullName": "Updated Test Member",
        "civilId": "29910'$RANDOM_NUM2'",
        "policyNumber": "POL-2024-'$RANDOM_NUM2'",
        "email": "updated@example.com",
        "phone": "+96550000000",
        "dateOfBirth": "1999-01-01",
        "gender": "MALE",
        "employerId": 1,
        "companyId": 1,
        "active": true
    }'
    
    RESPONSE=$(curl -s -X PUT "${BASE_URL}/members/${TEST_MEMBER_ID}" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "$UPDATED_MEMBER")
    
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    
    if [ "$STATUS" == "success" ]; then
        log_success "Member updated successfully"
        log_info "New Name: $(echo "$RESPONSE" | jq -r '.data.fullName')"
    else
        log_error "Failed to update member: $RESPONSE"
    fi
}

# Test 6: GET /api/members?search=Updated - Search functionality
test_search_members() {
    log_test "Test 6: GET /api/members?search=Updated - Search functionality"
    
    RESPONSE=$(curl -s -X GET "${BASE_URL}/members?page=0&size=10&search=Updated" \
        -H "Authorization: Bearer $TOKEN")
    
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    
    if [ "$STATUS" == "success" ]; then
        FOUND=$(echo "$RESPONSE" | jq -r '.data.totalElements')
        log_success "Search completed (Found: $FOUND)"
    else
        log_error "Search failed: $RESPONSE"
    fi
}

# Test 7: DELETE /api/members/{id} - Delete member
test_delete_member() {
    if [ -z "$TEST_MEMBER_ID" ]; then
        log_error "Test 7 skipped: No member ID available"
        return
    fi
    
    log_test "Test 7: DELETE /api/members/$TEST_MEMBER_ID - Delete member"
    
    RESPONSE=$(curl -s -X DELETE "${BASE_URL}/members/${TEST_MEMBER_ID}" \
        -H "Authorization: Bearer $TOKEN")
    
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    
    if [ "$STATUS" == "success" ]; then
        log_success "Member deleted successfully"
    else
        log_error "Failed to delete member: $RESPONSE"
    fi
}

# Test 8: GET /api/members/{id} after deletion (should fail with 404)
test_get_deleted_member() {
    if [ -z "$TEST_MEMBER_ID" ]; then
        log_error "Test 8 skipped: No member ID available"
        return
    fi
    
    log_test "Test 8: GET /api/members/$TEST_MEMBER_ID after deletion (expect 404)"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
        -X GET "${BASE_URL}/members/${TEST_MEMBER_ID}" \
        -H "Authorization: Bearer $TOKEN")
    
    if [ "$HTTP_CODE" == "404" ]; then
        log_success "Correctly returns 404 for deleted member"
    else
        log_error "Expected 404, got $HTTP_CODE"
    fi
}

# Test 9: Test unauthorized access (no token)
test_unauthorized_access() {
    log_test "Test 9: GET /api/members without token (expect 401/403)"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
        -X GET "${BASE_URL}/members?page=0&size=10")
    
    if [ "$HTTP_CODE" == "401" ] || [ "$HTTP_CODE" == "403" ]; then
        log_success "Correctly rejects unauthorized access ($HTTP_CODE)"
    else
        log_error "Expected 401/403, got $HTTP_CODE"
    fi
}

# Test 10: Test pagination
test_pagination() {
    log_test "Test 10: GET /api/members?page=0&size=5 - Pagination"
    
    RESPONSE=$(curl -s -X GET "${BASE_URL}/members?page=0&size=5" \
        -H "Authorization: Bearer $TOKEN")
    
    STATUS=$(echo "$RESPONSE" | jq -r '.status')
    
    if [ "$STATUS" == "success" ]; then
        SIZE=$(echo "$RESPONSE" | jq -r '.data.size')
        PAGE=$(echo "$RESPONSE" | jq -r '.data.number')
        log_success "Pagination works (Page: $PAGE, Size: $SIZE)"
    else
        log_error "Pagination test failed: $RESPONSE"
    fi
}

# Main execution
echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  TBA Members Module - API Tests       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Run all tests
test_login
echo ""
test_unauthorized_access
echo ""
test_get_members_list
echo ""
test_create_member
echo ""
test_get_member_by_id
echo ""
test_update_member
echo ""
test_search_members
echo ""
test_pagination
echo ""
test_delete_member
echo ""
test_get_deleted_member
echo ""

# Summary
echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          Test Summary                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo -e "${GREEN}✓ Passed: $PASSED${NC}"
echo -e "${RED}✗ Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    exit 1
fi
