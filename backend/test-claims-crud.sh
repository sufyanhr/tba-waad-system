#!/bin/bash

# ==============================
# Claims CRUD Test Script
# Phase G - TBA WAAD System
# ==============================

BASE_URL="http://localhost:8080/api"
TOKEN=""
CLAIM_ID=""
MEMBER_ID=""
PROVIDER_ID=""
POLICY_ID=""

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
            "username": "admin",
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
# Test 2-4: Get Prerequisites
# ==============================
test_get_prerequisites() {
    print_test "2-4" "Get prerequisite data (Member, Provider, Policy)"
    ((TOTAL++))
    
    # Get Member
    print_info "Fetching member..."
    MEMBER_RESPONSE=$(curl -s -X GET "$BASE_URL/members" \
        -H "Authorization: Bearer $TOKEN")
    
    MEMBER_ID=$(echo "$MEMBER_RESPONSE" | jq -r '.data.items[0].id // .data[0].id // empty' 2>/dev/null)
    
    if [ -n "$MEMBER_ID" ] && [ "$MEMBER_ID" != "null" ]; then
        print_info "Member ID: $MEMBER_ID"
    else
        print_info "No members found, creating one..."
        
        # Get employer first
        EMPLOYER_RESPONSE=$(curl -s -X GET "$BASE_URL/employers" \
            -H "Authorization: Bearer $TOKEN")
        EMPLOYER_ID=$(echo "$EMPLOYER_RESPONSE" | jq -r '.data.items[0].id // .data[0].id // empty' 2>/dev/null)
        
        # Create member
        CREATE_MEMBER=$(curl -s -X POST "$BASE_URL/members" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "{
                \"firstName\": \"Test\",
                \"lastName\": \"Member\",
                \"memberNumber\": \"M$(date +%s)\",
                \"nationalId\": \"$(date +%s)\",
                \"dateOfBirth\": \"1990-01-01\",
                \"gender\": \"MALE\",
                \"email\": \"test.member@example.com\",
                \"phone\": \"0912345678\",
                \"employerId\": $EMPLOYER_ID,
                \"active\": true
            }")
        
        MEMBER_ID=$(echo "$CREATE_MEMBER" | jq -r '.data.id // empty')
    fi
    
    # Get Provider
    print_info "Fetching provider..."
    PROVIDER_RESPONSE=$(curl -s -X GET "$BASE_URL/providers" \
        -H "Authorization: Bearer $TOKEN")
    
    PROVIDER_ID=$(echo "$PROVIDER_RESPONSE" | jq -r '.data.items[0].id // .data[0].id // empty' 2>/dev/null)
    
    if [ -z "$PROVIDER_ID" ] || [ "$PROVIDER_ID" == "null" ]; then
        print_info "No providers found, using ID 1"
        PROVIDER_ID=1
    else
        print_info "Provider ID: $PROVIDER_ID"
    fi
    
    # Get Policy
    print_info "Fetching policy..."
    POLICY_RESPONSE=$(curl -s -X GET "$BASE_URL/policies" \
        -H "Authorization: Bearer $TOKEN")
    
    POLICY_ID=$(echo "$POLICY_RESPONSE" | jq -r '.data.items[0].id // .data[0].id // empty' 2>/dev/null)
    
    if [ -z "$POLICY_ID" ] || [ "$POLICY_ID" == "null" ]; then
        print_info "No policies found, using ID 1"
        POLICY_ID=1
    else
        print_info "Policy ID: $POLICY_ID"
    fi
    
    if [ -n "$MEMBER_ID" ] && [ "$MEMBER_ID" != "null" ]; then
        print_success "Prerequisites fetched successfully"
    else
        print_failure "Failed to get prerequisites" "$MEMBER_RESPONSE"
    fi
}

# ==============================
# Test 5: Create Claim
# ==============================
test_create_claim() {
    print_test "5" "Create new claim"
    ((TOTAL++))
    
    CLAIM_NUMBER="CLM-$(date +%s)"
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/claims" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"claimNumber\": \"$CLAIM_NUMBER\",
            \"memberId\": $MEMBER_ID,
            \"providerId\": $PROVIDER_ID,
            \"providerName\": \"Test Medical Center\",
            \"claimType\": \"OUTPATIENT\",
            \"serviceDate\": \"2025-01-15\",
            \"submissionDate\": \"2025-01-16\",
            \"totalClaimed\": 500.00,
            \"diagnosisCode\": \"J00\",
            \"diagnosisDescription\": \"Acute nasopharyngitis (common cold)\",
            \"status\": \"PENDING\",
            \"notes\": \"Initial claim submission for outpatient consultation\"
        }")
    
    CLAIM_ID=$(echo "$RESPONSE" | jq -r '.data.id // empty')
    STATUS=$(echo "$RESPONSE" | jq -r '.status // empty')
    
    if [ -n "$CLAIM_ID" ] && [ "$CLAIM_ID" != "null" ] && [ "$STATUS" == "success" ]; then
        print_success "Claim created successfully (ID: $CLAIM_ID)"
        print_info "Claim Number: $CLAIM_NUMBER"
    else
        print_failure "Failed to create claim" "$RESPONSE"
    fi
}

# ==============================
# Test 6: Get Claim by ID
# ==============================
test_get_claim_by_id() {
    print_test "6" "Get claim by ID"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/claims/$CLAIM_ID" \
        -H "Authorization: Bearer $TOKEN")
    
    FETCHED_ID=$(echo "$RESPONSE" | jq -r '.data.id // empty')
    CLAIM_NUM=$(echo "$RESPONSE" | jq -r '.data.claimNumber // empty')
    
    if [ "$FETCHED_ID" == "$CLAIM_ID" ]; then
        print_success "Claim retrieved successfully"
        print_info "Claim Number: $CLAIM_NUM"
    else
        print_failure "Failed to retrieve claim" "$RESPONSE"
    fi
}

# ==============================
# Test 7: List All Claims
# ==============================
test_list_claims() {
    print_test "7" "List all claims (paginated)"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/claims?page=1&size=10" \
        -H "Authorization: Bearer $TOKEN")
    
    ITEMS=$(echo "$RESPONSE" | jq -r '.data.items // empty' 2>/dev/null)
    TOTAL_ITEMS=$(echo "$RESPONSE" | jq -r '.data.total // 0')
    
    if [ -n "$ITEMS" ] && [ "$ITEMS" != "null" ]; then
        print_success "Claims list retrieved (Total: $TOTAL_ITEMS)"
    else
        print_failure "Failed to retrieve claims list" "$RESPONSE"
    fi
}

# ==============================
# Test 8: Get Claims by Status
# ==============================
test_get_by_status() {
    print_test "8" "Get claims by status (PENDING)"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/claims/status/PENDING" \
        -H "Authorization: Bearer $TOKEN")
    
    CLAIMS=$(echo "$RESPONSE" | jq -r '.data // empty')
    COUNT=$(echo "$RESPONSE" | jq -r '.data | length // 0')
    
    if [ -n "$CLAIMS" ] && [ "$CLAIMS" != "null" ]; then
        print_success "Pending claims retrieved (Count: $COUNT)"
    else
        print_failure "Failed to retrieve claims by status" "$RESPONSE"
    fi
}

# ==============================
# Test 9: Search Claims
# ==============================
test_search_claims() {
    print_test "9" "Search claims"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/claims/search?query=CLM" \
        -H "Authorization: Bearer $TOKEN")
    
    RESULTS=$(echo "$RESPONSE" | jq -r '.data // empty')
    
    if [ -n "$RESULTS" ] && [ "$RESULTS" != "null" ]; then
        print_success "Claims search successful"
    else
        print_failure "Failed to search claims" "$RESPONSE"
    fi
}

# ==============================
# Test 10: Count Claims
# ==============================
test_count_claims() {
    print_test "10" "Count total claims"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/claims/count" \
        -H "Authorization: Bearer $TOKEN")
    
    COUNT=$(echo "$RESPONSE" | jq -r '.data // 0')
    
    if [ "$COUNT" -ge 1 ]; then
        print_success "Claims count retrieved (Total: $COUNT)"
    else
        print_failure "Failed to count claims" "$RESPONSE"
    fi
}

# ==============================
# Test 11: Update Claim
# ==============================
test_update_claim() {
    print_test "11" "Update claim details"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X PUT "$BASE_URL/claims/$CLAIM_ID" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"claimNumber\": \"CLM-UPDATED-$(date +%s)\",
            \"memberId\": $MEMBER_ID,
            \"providerId\": $PROVIDER_ID,
            \"providerName\": \"Updated Medical Center\",
            \"claimType\": \"OUTPATIENT\",
            \"serviceDate\": \"2025-01-15\",
            \"submissionDate\": \"2025-01-16\",
            \"totalClaimed\": 750.00,
            \"diagnosisCode\": \"J00\",
            \"diagnosisDescription\": \"Acute nasopharyngitis - Updated\",
            \"status\": \"PENDING\",
            \"notes\": \"Updated claim with new amount\"
        }")
    
    UPDATED_AMOUNT=$(echo "$RESPONSE" | jq -r '.data.totalClaimed // empty')
    
    if [ "$UPDATED_AMOUNT" == "750.00" ] || [ "$UPDATED_AMOUNT" == "750.0" ] || [ "$UPDATED_AMOUNT" == "750" ]; then
        print_success "Claim updated successfully"
        print_info "New claimed amount: $UPDATED_AMOUNT LYD"
    else
        print_failure "Failed to update claim" "$RESPONSE"
    fi
}

# ==============================
# Test 12: Approve Claim
# ==============================
test_approve_claim() {
    print_test "12" "Approve claim"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/claims/$CLAIM_ID/approve" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "reviewerId": 1,
            "approvedAmount": 700.00
        }')
    
    STATUS=$(echo "$RESPONSE" | jq -r '.data.status // empty')
    APPROVED_AMOUNT=$(echo "$RESPONSE" | jq -r '.data.totalApproved // empty')
    
    if [ "$STATUS" == "APPROVED" ] && [ -n "$APPROVED_AMOUNT" ]; then
        print_success "Claim approved successfully"
        print_info "Approved Amount: $APPROVED_AMOUNT LYD"
    else
        print_failure "Failed to approve claim" "$RESPONSE"
    fi
}

# ==============================
# Test 13: Create Second Claim for Rejection Test
# ==============================
test_create_second_claim() {
    print_test "13" "Create second claim for rejection test"
    ((TOTAL++))
    
    CLAIM_NUMBER_2="CLM-REJ-$(date +%s)"
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/claims" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"claimNumber\": \"$CLAIM_NUMBER_2\",
            \"memberId\": $MEMBER_ID,
            \"providerId\": $PROVIDER_ID,
            \"providerName\": \"Test Medical Center\",
            \"claimType\": \"PHARMACY\",
            \"serviceDate\": \"2025-01-17\",
            \"submissionDate\": \"2025-01-18\",
            \"totalClaimed\": 300.00,
            \"diagnosisCode\": \"R50\",
            \"diagnosisDescription\": \"Fever of unknown origin\",
            \"status\": \"PENDING\"
        }")
    
    CLAIM_ID_2=$(echo "$RESPONSE" | jq -r '.data.id // empty')
    
    if [ -n "$CLAIM_ID_2" ] && [ "$CLAIM_ID_2" != "null" ]; then
        print_success "Second claim created (ID: $CLAIM_ID_2)"
        CLAIM_ID=$CLAIM_ID_2  # Update for rejection test
    else
        print_failure "Failed to create second claim" "$RESPONSE"
    fi
}

# ==============================
# Test 14: Reject Claim
# ==============================
test_reject_claim() {
    print_test "14" "Reject claim"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/claims/$CLAIM_ID/reject" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "reviewerId": 1,
            "rejectionReason": "Insufficient medical documentation provided"
        }')
    
    STATUS=$(echo "$RESPONSE" | jq -r '.data.status // empty')
    REJECTION_REASON=$(echo "$RESPONSE" | jq -r '.data.rejectionReason // empty')
    
    if [ "$STATUS" == "REJECTED" ] && [ -n "$REJECTION_REASON" ]; then
        print_success "Claim rejected successfully"
        print_info "Reason: $REJECTION_REASON"
    else
        print_failure "Failed to reject claim" "$RESPONSE"
    fi
}

# ==============================
# Test 15: Get Claims with Pagination
# ==============================
test_pagination() {
    print_test "15" "Test pagination (page 1, size 5)"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/claims?page=1&size=5&sortBy=serviceDate&sortDir=desc" \
        -H "Authorization: Bearer $TOKEN")
    
    PAGE=$(echo "$RESPONSE" | jq -r '.data.page // empty')
    SIZE=$(echo "$RESPONSE" | jq -r '.data.size // empty')
    ITEMS=$(echo "$RESPONSE" | jq -r '.data.items | length // 0')
    
    if [ "$PAGE" == "1" ] && [ "$ITEMS" -le 5 ]; then
        print_success "Pagination works correctly (Page: $PAGE, Items: $ITEMS)"
    else
        print_failure "Pagination test failed" "$RESPONSE"
    fi
}

# ==============================
# Test 16: Unauthorized Access
# ==============================
test_unauthorized_access() {
    print_test "16" "Test unauthorized access (no token)"
    ((TOTAL++))
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/claims")
    
    if [ "$HTTP_CODE" == "403" ] || [ "$HTTP_CODE" == "401" ]; then
        print_success "Unauthorized access blocked (HTTP $HTTP_CODE)"
    else
        print_failure "Unauthorized access test failed (Expected 401/403, got $HTTP_CODE)" ""
    fi
}

# ==============================
# Test 17: Handle 404 Not Found
# ==============================
test_not_found() {
    print_test "17" "Handle non-existent claim (404)"
    ((TOTAL++))
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/claims/999999" \
        -H "Authorization: Bearer $TOKEN")
    
    if [ "$HTTP_CODE" == "404" ]; then
        print_success "404 Not Found handled correctly"
    else
        print_failure "404 test failed (Expected 404, got $HTTP_CODE)" ""
    fi
}

# ==============================
# Test 18: Delete Claim
# ==============================
test_delete_claim() {
    print_test "18" "Delete claim"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X DELETE "$BASE_URL/claims/$CLAIM_ID" \
        -H "Authorization: Bearer $TOKEN")
    
    STATUS=$(echo "$RESPONSE" | jq -r '.status // empty')
    
    if [ "$STATUS" == "success" ]; then
        print_success "Claim deleted successfully"
    else
        print_failure "Failed to delete claim" "$RESPONSE"
    fi
}

# ==============================
# Test 19: Verify Deletion
# ==============================
test_verify_deletion() {
    print_test "19" "Verify claim deletion"
    ((TOTAL++))
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/claims/$CLAIM_ID" \
        -H "Authorization: Bearer $TOKEN")
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/claims/$CLAIM_ID" \
        -H "Authorization: Bearer $TOKEN")
    
    RESPONSE_STATUS=$(echo "$RESPONSE" | jq -r '.status // empty')
    
    if [ "$HTTP_CODE" == "404" ] || [ "$RESPONSE_STATUS" == "error" ]; then
        print_success "Claim deletion verified"
    else
        print_failure "Claim still exists after deletion" "$RESPONSE"
    fi
}

# ==============================
# Run All Tests
# ==============================
echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║         CLAIMS MODULE - COMPREHENSIVE TEST SUITE          ║${NC}"
echo -e "${CYAN}║                   TBA WAAD System - Phase G                ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

test_authentication
test_get_prerequisites
test_create_claim
test_get_claim_by_id
test_list_claims
test_get_by_status
test_search_claims
test_count_claims
test_update_claim
test_approve_claim
test_create_second_claim
test_reject_claim
test_pagination
test_unauthorized_access
test_not_found
test_delete_claim
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
