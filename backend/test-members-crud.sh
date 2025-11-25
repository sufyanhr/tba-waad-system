#!/bin/bash

# Members Module CRUD Testing Script
# Tests all endpoints with proper authentication

TOKEN="eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJJZCI6MSwiZnVsbE5hbWUiOiJTdXBlciBBZG1pbmlzdHJhdG9yIiwiZW1haWwiOiJhZG1pbkB0YmEuc2EiLCJyb2xlcyI6WyJTVVBFUl9BRE1JTiJdLCJwZXJtaXNzaW9ucyI6WyJNQU5BR0VfUkVQT1JUUyIsInZpc2l0Lm1hbmFnZSIsInBlcm1pc3Npb24ubWFuYWdlIiwicmJhYy5tYW5hZ2UiLCJNQU5BR0VfUk9MRVMiLCJlbXBsb3llci5tYW5hZ2UiLCJpbnN1cmFuY2UubWFuYWdlIiwicmV2aWV3ZXIubWFuYWdlIiwidmlzaXQudmlldyIsInBlcm1pc3Npb24udmlldyIsImVtcGxveWVyLnZpZXciLCJjbGFpbS52aWV3IiwiY2xhaW0ubWFuYWdlIiwicmJhYy52aWV3IiwiTUFOQUdFX01FTUJFUlMiLCJNQU5BR0VfU1lTVEVNX1NFVFRJTkdTIiwiTUFOQUdFX0NMQUlNUyIsInJvbGUubWFuYWdlIiwicmV2aWV3ZXIudmlldyIsIk1BTkFHRV9VU0VSUyIsInVzZXIudmlldyIsIm1lbWJlci52aWV3IiwibWVtYmVyLm1hbmFnZSIsImNsYWltLnJlamVjdCIsIk1BTkFHRV9WSVNJVFMiLCJ1c2VyLm1hbmFnZSIsIk1BTkFHRV9QUk9WSURFUlMiLCJpbnN1cmFuY2UudmlldyIsImNsYWltLmFwcHJvdmUiLCJNQU5BR0VfRU1QTE9ZRVJTIiwiZGFzaGJvYXJkLnZpZXciLCJyb2xlLnZpZXciXSwiaWF0IjoxNzY0MDIyMTc2LCJleHAiOjE3NjQxMDg1NzZ9.GLcy_HfjNjA3xRgNPpCL9MXHzLrJ_4ZTan23KGIFZAOqzYYbBcts8mbDOq2_AA5h"

BASE_URL="http://localhost:8080/api/members"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "============================================"
echo "  Members Module CRUD Testing"
echo "============================================"
echo ""

# Pre-requisite: Create Employers first
echo -e "${YELLOW}SETUP: Creating Test Employers${NC}"
echo "---------------------------------------------"
EMPLOYER1=$(curl -s -X POST "http://localhost:8080/api/employers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Company 1",
    "companyId": 1,
    "commercialRegistration": "CR-001",
    "taxNumber": "TAX-001",
    "address": "Test Address 1",
    "city": "Riyadh",
    "phone": "+966501111111",
    "email": "company1@test.com",
    "contactPerson": "John Doe",
    "contactPhone": "+966502222222",
    "active": true
  }')

if command -v jq &> /dev/null; then
    EMPLOYER_ID_1=$(echo "$EMPLOYER1" | jq -r '.data.id')
else
    EMPLOYER_ID_1=$(echo "$EMPLOYER1" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
fi

EMPLOYER2=$(curl -s -X POST "http://localhost:8080/api/employers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Company 2",
    "companyId": 2,
    "commercialRegistration": "CR-002",
    "taxNumber": "TAX-002",
    "address": "Test Address 2",
    "city": "Jeddah",
    "phone": "+966503333333",
    "email": "company2@test.com",
    "contactPerson": "Jane Smith",
    "contactPhone": "+966504444444",
    "active": true
  }')

if command -v jq &> /dev/null; then
    EMPLOYER_ID_2=$(echo "$EMPLOYER2" | jq -r '.data.id')
else
    EMPLOYER_ID_2=$(echo "$EMPLOYER2" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
fi

if [ -n "$EMPLOYER_ID_1" ] && [ "$EMPLOYER_ID_1" != "null" ]; then
    echo -e "${GREEN}✓ Created Employer 1 ID: $EMPLOYER_ID_1${NC}"
else
    echo -e "${RED}✗ Failed to create employer 1${NC}"
fi

if [ -n "$EMPLOYER_ID_2" ] && [ "$EMPLOYER_ID_2" != "null" ]; then
    echo -e "${GREEN}✓ Created Employer 2 ID: $EMPLOYER_ID_2${NC}"
else
    echo -e "${RED}✗ Failed to create employer 2${NC}"
fi
echo ""

# Test 1: Create Member
echo -e "${YELLOW}TEST 1: Create Member (POST)${NC}"
echo "---------------------------------------------"
RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "employerId": '"$EMPLOYER_ID_1"',
    "companyId": 1,
    "fullName": "Ahmed Ali Mohammed",
    "civilId": "1234567890",
    "policyNumber": "POL-2025-001",
    "dateOfBirth": "1990-05-15",
    "gender": "MALE",
    "phone": "+966501234567",
    "email": "ahmed.ali@example.com",
    "active": true
  }')

if command -v jq &> /dev/null; then
    echo "$RESPONSE" | jq .
    MEMBER_ID=$(echo "$RESPONSE" | jq -r '.data.id')
else
    echo "$RESPONSE"
    MEMBER_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
fi

if [ -n "$MEMBER_ID" ] && [ "$MEMBER_ID" != "null" ]; then
    echo -e "${GREEN}✓ Created Member ID: $MEMBER_ID${NC}"
else
    echo -e "${RED}✗ Failed to create member${NC}"
fi
echo ""

# Test 2: Get by ID
echo -e "${YELLOW}TEST 2: Get Member by ID (GET)${NC}"
echo "---------------------------------------------"
if [ -n "$MEMBER_ID" ] && [ "$MEMBER_ID" != "null" ]; then
    RESPONSE=$(curl -s "$BASE_URL/$MEMBER_ID" -H "Authorization: Bearer $TOKEN")
    if command -v jq &> /dev/null; then
        echo "$RESPONSE" | jq .
    else
        echo "$RESPONSE"
    fi
    
    if echo "$RESPONSE" | grep -q '"status":"success"'; then
        echo -e "${GREEN}✓ Member retrieved successfully${NC}"
    else
        echo -e "${RED}✗ Failed to retrieve member${NC}"
    fi
else
    echo -e "${RED}✗ Skipping (no member ID)${NC}"
fi
echo ""

# Test 3: Get List (Paginated)
echo -e "${YELLOW}TEST 3: Get All Members (Paginated)${NC}"
echo "---------------------------------------------"
RESPONSE=$(curl -s "$BASE_URL?page=1&size=10" -H "Authorization: Bearer $TOKEN")
if command -v jq &> /dev/null; then
    echo "$RESPONSE" | jq '.data | {total, page, size, itemCount: (.items | length)}'
else
    echo "$RESPONSE"
fi

if echo "$RESPONSE" | grep -q '"status":"success"'; then
    echo -e "${GREEN}✓ Members list retrieved successfully${NC}"
else
    echo -e "${RED}✗ Failed to retrieve members list${NC}"
fi
echo ""

# Test 4: Update Member
echo -e "${YELLOW}TEST 4: Update Member (PUT)${NC}"
echo "---------------------------------------------"
if [ -n "$MEMBER_ID" ] && [ "$MEMBER_ID" != "null" ]; then
    RESPONSE=$(curl -s -X PUT "$BASE_URL/$MEMBER_ID" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "employerId": '"$EMPLOYER_ID_1"',
        "companyId": 1,
        "fullName": "Ahmed Ali Mohammed UPDATED",
        "civilId": "1234567890",
        "policyNumber": "POL-2025-001",
        "dateOfBirth": "1990-05-15",
        "gender": "MALE",
        "phone": "+966507777777",
        "email": "ahmed.updated@example.com",
        "active": false
      }')
    
    if command -v jq &> /dev/null; then
        echo "$RESPONSE" | jq .
    else
        echo "$RESPONSE"
    fi
    
    if echo "$RESPONSE" | grep -q '"status":"success"'; then
        echo -e "${GREEN}✓ Member updated successfully${NC}"
    else
        echo -e "${RED}✗ Failed to update member${NC}"
    fi
else
    echo -e "${RED}✗ Skipping (no member ID)${NC}"
fi
echo ""

# Test 5: Verify Update
echo -e "${YELLOW}TEST 5: Verify Update (GET)${NC}"
echo "---------------------------------------------"
if [ -n "$MEMBER_ID" ] && [ "$MEMBER_ID" != "null" ]; then
    RESPONSE=$(curl -s "$BASE_URL/$MEMBER_ID" -H "Authorization: Bearer $TOKEN")
    if command -v jq &> /dev/null; then
        echo "$RESPONSE" | jq '.data | {fullName, phone, email, active}'
    else
        echo "$RESPONSE"
    fi
    
    if echo "$RESPONSE" | grep -q "UPDATED"; then
        echo -e "${GREEN}✓ Update verified${NC}"
    else
        echo -e "${YELLOW}⚠ Update may not have been applied${NC}"
    fi
else
    echo -e "${RED}✗ Skipping (no member ID)${NC}"
fi
echo ""

# Test 6: Create member with different company
echo -e "${YELLOW}TEST 6: Create Member with CompanyId=2${NC}"
echo "---------------------------------------------"
RESPONSE2=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "employerId": '"$EMPLOYER_ID_2"',
    "companyId": 2,
    "fullName": "Sara Hassan Ali",
    "civilId": "9876543210",
    "policyNumber": "POL-2025-002",
    "dateOfBirth": "1995-08-20",
    "gender": "FEMALE",
    "phone": "+966501111111",
    "email": "sara.hassan@example.com",
    "active": true
  }')

if command -v jq &> /dev/null; then
    echo "$RESPONSE2" | jq .
    MEMBER_ID_2=$(echo "$RESPONSE2" | jq -r '.data.id')
else
    echo "$RESPONSE2"
    MEMBER_ID_2=$(echo "$RESPONSE2" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
fi

if [ -n "$MEMBER_ID_2" ] && [ "$MEMBER_ID_2" != "null" ]; then
    echo -e "${GREEN}✓ Created Member ID: $MEMBER_ID_2${NC}"
else
    echo -e "${RED}✗ Failed to create member${NC}"
fi
echo ""

# Test 7: Test Company Filter
echo -e "${YELLOW}TEST 7: Filter by CompanyId=1${NC}"
echo "---------------------------------------------"
RESPONSE=$(curl -s "$BASE_URL?companyId=1" -H "Authorization: Bearer $TOKEN")
if command -v jq &> /dev/null; then
    echo "$RESPONSE" | jq '.data.items[] | {id, fullName, civilId, companyId}'
else
    echo "$RESPONSE"
fi

if echo "$RESPONSE" | grep -q '"companyId":1'; then
    echo -e "${GREEN}✓ Company filter working${NC}"
else
    echo -e "${YELLOW}⚠ Company filter may not be working${NC}"
fi
echo ""

echo -e "${YELLOW}TEST 8: Filter by CompanyId=2${NC}"
echo "---------------------------------------------"
RESPONSE=$(curl -s "$BASE_URL?companyId=2" -H "Authorization: Bearer $TOKEN")
if command -v jq &> /dev/null; then
    echo "$RESPONSE" | jq '.data.items[] | {id, fullName, civilId, companyId}'
else
    echo "$RESPONSE"
fi

if echo "$RESPONSE" | grep -q '"companyId":2'; then
    echo -e "${GREEN}✓ Company filter working${NC}"
else
    echo -e "${YELLOW}⚠ Company filter may not be working${NC}"
fi
echo ""

# Test 9: Test Search
echo -e "${YELLOW}TEST 9: Search for 'Ahmed'${NC}"
echo "---------------------------------------------"
RESPONSE=$(curl -s "$BASE_URL?search=Ahmed" -H "Authorization: Bearer $TOKEN")
if command -v jq &> /dev/null; then
    echo "$RESPONSE" | jq '.data.items[] | {id, fullName, civilId}'
else
    echo "$RESPONSE"
fi

if echo "$RESPONSE" | grep -q "Ahmed"; then
    echo -e "${GREEN}✓ Search working${NC}"
else
    echo -e "${YELLOW}⚠ Search may not be working${NC}"
fi
echo ""

# Test 10: Test Unique Civil ID Validation
echo -e "${YELLOW}TEST 10: Test Unique Civil ID Validation${NC}"
echo "---------------------------------------------"
RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "employerId": '"$EMPLOYER_ID_1"',
    "companyId": 1,
    "fullName": "Duplicate Test",
    "civilId": "1234567890",
    "policyNumber": "POL-2025-999",
    "dateOfBirth": "2000-01-01",
    "gender": "MALE",
    "phone": "+966509999999",
    "email": "duplicate@test.com",
    "active": true
  }')

if command -v jq &> /dev/null; then
    echo "$RESPONSE" | jq .
else
    echo "$RESPONSE"
fi

if echo "$RESPONSE" | grep -q "already exists"; then
    echo -e "${GREEN}✓ Unique civil ID validation working${NC}"
else
    echo -e "${RED}✗ Unique validation may not be working${NC}"
fi
echo ""

# Test 11: Test Unique Policy Number Validation
echo -e "${YELLOW}TEST 11: Test Unique Policy Number Validation${NC}"
echo "---------------------------------------------"
RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "employerId": '"$EMPLOYER_ID_1"',
    "companyId": 1,
    "fullName": "Duplicate Policy Test",
    "civilId": "9999999999",
    "policyNumber": "POL-2025-001",
    "dateOfBirth": "2000-01-01",
    "gender": "MALE",
    "phone": "+966509999999",
    "email": "duplicate.policy@test.com",
    "active": true
  }')

if command -v jq &> /dev/null; then
    echo "$RESPONSE" | jq .
else
    echo "$RESPONSE"
fi

if echo "$RESPONSE" | grep -q "already exists"; then
    echo -e "${GREEN}✓ Unique policy number validation working${NC}"
else
    echo -e "${RED}✗ Unique validation may not be working${NC}"
fi
echo ""

# Test 12: Delete Member
echo -e "${YELLOW}TEST 12: Delete Member (DELETE)${NC}"
echo "---------------------------------------------"
if [ -n "$MEMBER_ID" ] && [ "$MEMBER_ID" != "null" ]; then
    RESPONSE=$(curl -s -X DELETE "$BASE_URL/$MEMBER_ID" -H "Authorization: Bearer $TOKEN")
    if command -v jq &> /dev/null; then
        echo "$RESPONSE" | jq .
    else
        echo "$RESPONSE"
    fi
    
    if echo "$RESPONSE" | grep -q '"status":"success"'; then
        echo -e "${GREEN}✓ Member deleted successfully${NC}"
    else
        echo -e "${RED}✗ Failed to delete member${NC}"
    fi
else
    echo -e "${RED}✗ Skipping (no member ID)${NC}"
fi
echo ""

# Test 13: Verify Deletion
echo -e "${YELLOW}TEST 13: Verify Deletion (should return 404)${NC}"
echo "---------------------------------------------"
if [ -n "$MEMBER_ID" ] && [ "$MEMBER_ID" != "null" ]; then
    RESPONSE=$(curl -s "$BASE_URL/$MEMBER_ID" -H "Authorization: Bearer $TOKEN")
    if command -v jq &> /dev/null; then
        echo "$RESPONSE" | jq .
    else
        echo "$RESPONSE"
    fi
    
    if echo "$RESPONSE" | grep -q "not found"; then
        echo -e "${GREEN}✓ Deletion verified${NC}"
    else
        echo -e "${YELLOW}⚠ Member may still exist${NC}"
    fi
else
    echo -e "${RED}✗ Skipping (no member ID)${NC}"
fi
echo ""

# Test 14: Test Count Endpoint
echo -e "${YELLOW}TEST 14: Count Total Members${NC}"
echo "---------------------------------------------"
RESPONSE=$(curl -s "$BASE_URL/count" -H "Authorization: Bearer $TOKEN")
if command -v jq &> /dev/null; then
    echo "$RESPONSE" | jq .
else
    echo "$RESPONSE"
fi

if echo "$RESPONSE" | grep -q '"status":"success"'; then
    echo -e "${GREEN}✓ Count endpoint working${NC}"
else
    echo -e "${RED}✗ Count endpoint failed${NC}"
fi
echo ""

echo "============================================"
echo "  Testing Complete!"
echo "============================================"
echo ""
echo -e "${YELLOW}Summary:${NC}"
echo "- Backend API: http://localhost:8080/api/members"
echo "- Frontend UI: http://localhost:3001/tba/members"
echo "- Swagger Docs: http://localhost:8080/swagger-ui.html"
echo ""
echo -e "${GREEN}All tests executed. Review output above for results.${NC}"
