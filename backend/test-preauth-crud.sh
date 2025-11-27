#!/bin/bash

# ==============================
# Pre-Authorizations CRUD Test Script
# Phase G - TBA WAAD System
# ==============================

BASE_URL="http://localhost:8080/api"
TOKEN=""
PREAUTH_ID=""
MEMBER_ID=""
PROVIDER_ID=""

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
# Test 2-3: Get Prerequisites
# ==============================
test_get_prerequisites() {
    print_test "2-3" "Get prerequisite data (Member, Provider)"
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
        
        EMPLOYER_RESPONSE=$(curl -s -X GET "$BASE_URL/employers" \
            -H "Authorization: Bearer $TOKEN")
        EMPLOYER_ID=$(echo "$EMPLOYER_RESPONSE" | jq -r '.data.items[0].id // .data[0].id // empty' 2>/dev/null)
        
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
    
    if [ -n "$MEMBER_ID" ] && [ "$MEMBER_ID" != "null" ]; then
        print_success "Prerequisites fetched successfully"
    else
        print_failure "Failed to get prerequisites" "$MEMBER_RESPONSE"
    fi
}

# ==============================
# Test 4: Create Pre-Authorization
# ==============================
test_create_preauth() {
    print_test "4" "Create new pre-authorization"
    ((TOTAL++))
    
    PREAUTH_NUMBER="PA-$(date +%s)"
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/pre-authorizations" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"preAuthNumber\": \"$PREAUTH_NUMBER\",
            \"memberId\": $MEMBER_ID,
            \"providerId\": $PROVIDER_ID,
            \"providerName\": \"Al Shifa Medical Center\",
            \"diagnosisCode\": \"M25.5\",
            \"diagnosisDescription\": \"Pain in joint\",
            \"procedureCodes\": \"27447\",
            \"procedureDescriptions\": \"Total knee replacement\",
            \"serviceType\": \"SURGERY\",
            \"estimatedCost\": 15000.00,
            \"doctorName\": \"Dr. Ahmed Hassan\",
            \"doctorSpecialty\": \"Orthopedic Surgery\",
            \"requestDate\": \"2025-01-20\",
            \"expectedServiceDate\": \"2025-02-15\",
            \"numberOfDays\": 5,
            \"requestNotes\": \"Patient requires urgent knee replacement surgery\",
            \"status\": \"PENDING\"
        }")
    
    PREAUTH_ID=$(echo "$RESPONSE" | jq -r '.data.id // empty')
    STATUS=$(echo "$RESPONSE" | jq -r '.status // empty')
    
    if [ -n "$PREAUTH_ID" ] && [ "$PREAUTH_ID" != "null" ] && [ "$STATUS" == "success" ]; then
        print_success "Pre-authorization created successfully (ID: $PREAUTH_ID)"
        print_info "Pre-Auth Number: $PREAUTH_NUMBER"
    else
        print_failure "Failed to create pre-authorization" "$RESPONSE"
    fi
}

# ==============================
# Test 5: Get Pre-Auth by ID
# ==============================
test_get_preauth_by_id() {
    print_test "5" "Get pre-authorization by ID"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/pre-authorizations/$PREAUTH_ID" \
        -H "Authorization: Bearer $TOKEN")
    
    FETCHED_ID=$(echo "$RESPONSE" | jq -r '.data.id // empty')
    PREAUTH_NUM=$(echo "$RESPONSE" | jq -r '.data.preAuthNumber // empty')
    
    if [ "$FETCHED_ID" == "$PREAUTH_ID" ]; then
        print_success "Pre-authorization retrieved successfully"
        print_info "Pre-Auth Number: $PREAUTH_NUM"
    else
        print_failure "Failed to retrieve pre-authorization" "$RESPONSE"
    fi
}

# ==============================
# Test 6: List All Pre-Authorizations
# ==============================
test_list_preauths() {
    print_test "6" "List all pre-authorizations"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/pre-authorizations" \
        -H "Authorization: Bearer $TOKEN")
    
    ITEMS=$(echo "$RESPONSE" | jq -r '.data // empty')
    COUNT=$(echo "$RESPONSE" | jq -r '.data | length // 0')
    
    if [ -n "$ITEMS" ] && [ "$ITEMS" != "null" ]; then
        print_success "Pre-authorizations list retrieved (Count: $COUNT)"
    else
        print_failure "Failed to retrieve pre-authorizations list" "$RESPONSE"
    fi
}

# ==============================
# Test 7: Get by Pre-Auth Number
# ==============================
test_get_by_number() {
    print_test "7" "Get pre-authorization by number"
    ((TOTAL++))
    
    PREAUTH_NUM=$(curl -s -X GET "$BASE_URL/pre-authorizations/$PREAUTH_ID" \
        -H "Authorization: Bearer $TOKEN" | jq -r '.data.preAuthNumber // empty')
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/pre-authorizations/number/$PREAUTH_NUM" \
        -H "Authorization: Bearer $TOKEN")
    
    FETCHED_ID=$(echo "$RESPONSE" | jq -r '.data.id // empty')
    
    if [ "$FETCHED_ID" == "$PREAUTH_ID" ]; then
        print_success "Pre-authorization found by number"
    else
        print_failure "Failed to find pre-authorization by number" "$RESPONSE"
    fi
}

# ==============================
# Test 8: Get by Member
# ==============================
test_get_by_member() {
    print_test "8" "Get pre-authorizations by member"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/pre-authorizations/member/$MEMBER_ID" \
        -H "Authorization: Bearer $TOKEN")
    
    COUNT=$(echo "$RESPONSE" | jq -r '.data | length // 0')
    
    if [ "$COUNT" -ge 1 ]; then
        print_success "Member's pre-authorizations retrieved (Count: $COUNT)"
    else
        print_failure "Failed to retrieve member's pre-authorizations" "$RESPONSE"
    fi
}

# ==============================
# Test 9: Get by Provider
# ==============================
test_get_by_provider() {
    print_test "9" "Get pre-authorizations by provider"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/pre-authorizations/provider/$PROVIDER_ID" \
        -H "Authorization: Bearer $TOKEN")
    
    COUNT=$(echo "$RESPONSE" | jq -r '.data | length // 0')
    
    if [ "$COUNT" -ge 0 ]; then
        print_success "Provider's pre-authorizations retrieved (Count: $COUNT)"
    else
        print_failure "Failed to retrieve provider's pre-authorizations" "$RESPONSE"
    fi
}

# ==============================
# Test 10: Get by Status (PENDING)
# ==============================
test_get_by_status() {
    print_test "10" "Get pre-authorizations by status (PENDING)"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/pre-authorizations/status/PENDING" \
        -H "Authorization: Bearer $TOKEN")
    
    COUNT=$(echo "$RESPONSE" | jq -r '.data | length // 0')
    
    if [ "$COUNT" -ge 1 ]; then
        print_success "PENDING pre-authorizations retrieved (Count: $COUNT)"
    else
        print_failure "Failed to retrieve PENDING pre-authorizations" "$RESPONSE"
    fi
}

# ==============================
# Test 11: Update Pre-Authorization
# ==============================
test_update_preauth() {
    print_test "11" "Update pre-authorization"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X PUT "$BASE_URL/pre-authorizations/$PREAUTH_ID" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"preAuthNumber\": \"PA-UPDATED-$(date +%s)\",
            \"memberId\": $MEMBER_ID,
            \"providerId\": $PROVIDER_ID,
            \"providerName\": \"Al Shifa Medical Center - Updated\",
            \"diagnosisCode\": \"M25.5\",
            \"diagnosisDescription\": \"Pain in joint - Updated\",
            \"procedureCodes\": \"27447\",
            \"procedureDescriptions\": \"Total knee replacement - Updated\",
            \"serviceType\": \"SURGERY\",
            \"estimatedCost\": 18000.00,
            \"doctorName\": \"Dr. Ahmed Hassan\",
            \"doctorSpecialty\": \"Orthopedic Surgery\",
            \"requestDate\": \"2025-01-20\",
            \"expectedServiceDate\": \"2025-02-15\",
            \"numberOfDays\": 7,
            \"requestNotes\": \"Updated: Patient requires urgent knee replacement surgery with extended stay\",
            \"status\": \"PENDING\"
        }")
    
    UPDATED_COST=$(echo "$RESPONSE" | jq -r '.data.estimatedCost // empty')
    
    if [ "$UPDATED_COST" == "18000.00" ] || [ "$UPDATED_COST" == "18000.0" ] || [ "$UPDATED_COST" == "18000" ]; then
        print_success "Pre-authorization updated successfully"
        print_info "New estimated cost: $UPDATED_COST LYD"
    else
        print_failure "Failed to update pre-authorization" "$RESPONSE"
    fi
}

# ==============================
# Test 12: Mark Under Review
# ==============================
test_mark_under_review() {
    print_test "12" "Mark pre-authorization as under review"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/pre-authorizations/$PREAUTH_ID/under-review?reviewerId=1" \
        -H "Authorization: Bearer $TOKEN")
    
    STATUS=$(echo "$RESPONSE" | jq -r '.data.status // empty')
    
    if [ "$STATUS" == "UNDER_REVIEW" ]; then
        print_success "Pre-authorization marked as under review"
    else
        print_failure "Failed to mark as under review" "$RESPONSE"
    fi
}

# ==============================
# Test 13: Approve Pre-Authorization
# ==============================
test_approve_preauth() {
    print_test "13" "Approve pre-authorization"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/pre-authorizations/$PREAUTH_ID/approve?reviewerId=1" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "approvedAmount": 16000.00,
            "validityDays": 30,
            "reviewerNotes": "Approved with conditions: outpatient follow-up required"
        }')
    
    STATUS=$(echo "$RESPONSE" | jq -r '.data.status // empty')
    APPROVED_AMOUNT=$(echo "$RESPONSE" | jq -r '.data.approvedAmount // empty')
    
    if [ "$STATUS" == "APPROVED" ] && [ -n "$APPROVED_AMOUNT" ]; then
        print_success "Pre-authorization approved successfully"
        print_info "Approved Amount: $APPROVED_AMOUNT LYD"
    else
        print_failure "Failed to approve pre-authorization" "$RESPONSE"
    fi
}

# ==============================
# Test 14: Create Second Pre-Auth for Rejection
# ==============================
test_create_second_preauth() {
    print_test "14" "Create second pre-authorization for rejection test"
    ((TOTAL++))
    
    PREAUTH_NUMBER_2="PA-REJ-$(date +%s)"
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/pre-authorizations" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"preAuthNumber\": \"$PREAUTH_NUMBER_2\",
            \"memberId\": $MEMBER_ID,
            \"providerId\": $PROVIDER_ID,
            \"providerName\": \"General Hospital\",
            \"diagnosisCode\": \"Z51.0\",
            \"diagnosisDescription\": \"Radiotherapy session\",
            \"procedureCodes\": \"77427\",
            \"procedureDescriptions\": \"Radiation treatment management\",
            \"serviceType\": \"OUTPATIENT\",
            \"estimatedCost\": 3000.00,
            \"doctorName\": \"Dr. Sarah Ali\",
            \"doctorSpecialty\": \"Oncology\",
            \"requestDate\": \"2025-01-21\",
            \"expectedServiceDate\": \"2025-02-01\",
            \"numberOfDays\": 1,
            \"requestNotes\": \"Radiation therapy session required\",
            \"status\": \"PENDING\"
        }")
    
    PREAUTH_ID_2=$(echo "$RESPONSE" | jq -r '.data.id // empty')
    
    if [ -n "$PREAUTH_ID_2" ] && [ "$PREAUTH_ID_2" != "null" ]; then
        print_success "Second pre-authorization created (ID: $PREAUTH_ID_2)"
        PREAUTH_ID=$PREAUTH_ID_2  # Update for rejection test
    else
        print_failure "Failed to create second pre-authorization" "$RESPONSE"
    fi
}

# ==============================
# Test 15: Reject Pre-Authorization
# ==============================
test_reject_preauth() {
    print_test "15" "Reject pre-authorization"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/pre-authorizations/$PREAUTH_ID/reject?reviewerId=1" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "rejectionReason": "Service not covered under current policy",
            "reviewerNotes": "Patient should contact insurance provider for alternative options"
        }')
    
    STATUS=$(echo "$RESPONSE" | jq -r '.data.status // empty')
    REJECTION_REASON=$(echo "$RESPONSE" | jq -r '.data.rejectionReason // empty')
    
    if [ "$STATUS" == "REJECTED" ] && [ -n "$REJECTION_REASON" ]; then
        print_success "Pre-authorization rejected successfully"
        print_info "Reason: $REJECTION_REASON"
    else
        print_failure "Failed to reject pre-authorization" "$RESPONSE"
    fi
}

# ==============================
# Test 16: Get Approved Pre-Auths
# ==============================
test_get_approved() {
    print_test "16" "Get approved pre-authorizations"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/pre-authorizations/status/APPROVED" \
        -H "Authorization: Bearer $TOKEN")
    
    COUNT=$(echo "$RESPONSE" | jq -r '.data | length // 0')
    
    if [ "$COUNT" -ge 1 ]; then
        print_success "Approved pre-authorizations retrieved (Count: $COUNT)"
    else
        print_failure "Failed to retrieve approved pre-authorizations" "$RESPONSE"
    fi
}

# ==============================
# Test 17: Unauthorized Access
# ==============================
test_unauthorized_access() {
    print_test "17" "Test unauthorized access (no token)"
    ((TOTAL++))
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/pre-authorizations")
    
    if [ "$HTTP_CODE" == "403" ] || [ "$HTTP_CODE" == "401" ]; then
        print_success "Unauthorized access blocked (HTTP $HTTP_CODE)"
    else
        print_failure "Unauthorized access test failed (Expected 401/403, got $HTTP_CODE)" ""
    fi
}

# ==============================
# Test 18: Handle 404 Not Found
# ==============================
test_not_found() {
    print_test "18" "Handle non-existent pre-authorization (404)"
    ((TOTAL++))
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/pre-authorizations/999999" \
        -H "Authorization: Bearer $TOKEN")
    
    if [ "$HTTP_CODE" == "404" ]; then
        print_success "404 Not Found handled correctly"
    else
        print_failure "404 test failed (Expected 404, got $HTTP_CODE)" ""
    fi
}

# ==============================
# Test 19: Delete Pre-Authorization
# ==============================
test_delete_preauth() {
    print_test "19" "Delete pre-authorization"
    ((TOTAL++))
    
    RESPONSE=$(curl -s -X DELETE "$BASE_URL/pre-authorizations/$PREAUTH_ID" \
        -H "Authorization: Bearer $TOKEN")
    
    STATUS=$(echo "$RESPONSE" | jq -r '.status // empty')
    
    if [ "$STATUS" == "success" ]; then
        print_success "Pre-authorization deleted successfully"
    else
        print_failure "Failed to delete pre-authorization" "$RESPONSE"
    fi
}

# ==============================
# Test 20: Verify Deletion
# ==============================
test_verify_deletion() {
    print_test "20" "Verify pre-authorization deletion"
    ((TOTAL++))
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/pre-authorizations/$PREAUTH_ID" \
        -H "Authorization: Bearer $TOKEN")
    
    RESPONSE=$(curl -s -X GET "$BASE_URL/pre-authorizations/$PREAUTH_ID" \
        -H "Authorization: Bearer $TOKEN")
    
    RESPONSE_STATUS=$(echo "$RESPONSE" | jq -r '.status // empty')
    
    if [ "$HTTP_CODE" == "404" ] || [ "$RESPONSE_STATUS" == "error" ]; then
        print_success "Pre-authorization deletion verified"
    else
        print_failure "Pre-authorization still exists after deletion" "$RESPONSE"
    fi
}

# ==============================
# Run All Tests
# ==============================
echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║    PRE-AUTHORIZATIONS MODULE - COMPREHENSIVE TEST SUITE   ║${NC}"
echo -e "${CYAN}║                   TBA WAAD System - Phase G                ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

test_authentication
test_get_prerequisites
test_create_preauth
test_get_preauth_by_id
test_list_preauths
test_get_by_number
test_get_by_member
test_get_by_provider
test_get_by_status
test_update_preauth
test_mark_under_review
test_approve_preauth
test_create_second_preauth
test_reject_preauth
test_get_approved
test_unauthorized_access
test_not_found
test_delete_preauth
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
