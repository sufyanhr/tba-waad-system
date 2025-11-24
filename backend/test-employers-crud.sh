#!/bin/bash

# Employers Module CRUD Testing Script
# Tests all endpoints with proper authentication

TOKEN="eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJJZCI6MSwiZnVsbE5hbWUiOiJTdXBlciBBZG1pbmlzdHJhdG9yIiwiZW1haWwiOiJhZG1pbkB0YmEuc2EiLCJyb2xlcyI6WyJTVVBFUl9BRE1JTiJdLCJwZXJtaXNzaW9ucyI6WyJNQU5BR0VfUkVQT1JUUyIsInZpc2l0Lm1hbmFnZSIsInBlcm1pc3Npb24ubWFuYWdlIiwicmJhYy5tYW5hZ2UiLCJNQU5BR0VfUk9MRVMiLCJlbXBsb3llci5tYW5hZ2UiLCJpbnN1cmFuY2UubWFuYWdlIiwicmV2aWV3ZXIubWFuYWdlIiwidmlzaXQudmlldyIsInBlcm1pc3Npb24udmlldyIsImVtcGxveWVyLnZpZXciLCJjbGFpbS52aWV3IiwiY2xhaW0ubWFuYWdlIiwicmJhYy52aWV3IiwiTUFOQUdFX01FTUJFUlMiLCJNQU5BR0VfU1lTVEVNX1NFVFRJTkdTIiwiTUFOQUdFX0NMQUlNUyIsInJvbGUubWFuYWdlIiwicmV2aWV3ZXIudmlldyIsIk1BTkFHRV9VU0VSUyIsInVzZXIudmlldyIsIm1lbWJlci52aWV3IiwibWVtYmVyLm1hbmFnZSIsImNsYWltLnJlamVjdCIsIk1BTkFHRV9WSVNJVFMiLCJ1c2VyLm1hbmFnZSIsIk1BTkFHRV9QUk9WSURFUlMiLCJpbnN1cmFuY2UudmlldyIsImNsYWltLmFwcHJvdmUiLCJNQU5BR0VfRU1QTE9ZRVJTIiwiZGFzaGJvYXJkLnZpZXciLCJyb2xlLnZpZXciXSwiaWF0IjoxNzY0MDIyMTc2LCJleHAiOjE3NjQxMDg1NzZ9.GLcy_HfjNjA3xRgNPpCL9MXHzLrJ_4ZTan23KGIFZAOqzYYbBcts8mbDOq2_AA5h"

BASE_URL="http://localhost:8080/api/employers"

echo "============================================"
echo "  Employers Module CRUD Testing"
echo "============================================"
echo ""

# Test 1: Create Employer
echo "TEST 1: Create Employer (POST)"
echo "---------------------------------------------"
RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name":"Acme Corporation",
    "code":"ACME001",
    "companyId":1,
    "address":"123 Main St, Riyadh",
    "phone":"+966501234567",
    "email":"info@acme.com",
    "contactName":"John Doe",
    "contactPhone":"+966509876543",
    "contactEmail":"john@acme.com",
    "active":true
  }')
echo "$RESPONSE" | jq .
EMPLOYER_ID=$(echo "$RESPONSE" | jq -r '.data.id')
echo "Created Employer ID: $EMPLOYER_ID"
echo ""

# Test 2: Get by ID
echo "TEST 2: Get Employer by ID (GET)"
echo "---------------------------------------------"
curl -s "$BASE_URL/$EMPLOYER_ID" -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# Test 3: Get List (Paginated)
echo "TEST 3: Get All Employers (Paginated)"
echo "---------------------------------------------"
curl -s "$BASE_URL?page=1&size=10" -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# Test 4: Update Employer
echo "TEST 4: Update Employer (PUT)"
echo "---------------------------------------------"
curl -s -X PUT "$BASE_URL/$EMPLOYER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name":"Acme Corporation UPDATED",
    "code":"ACME001",
    "companyId":1,
    "address":"456 Updated Street, Riyadh",
    "phone":"+966507777777",
    "email":"updated@acme.com",
    "contactName":"John Doe Updated",
    "contactPhone":"+966508888888",
    "contactEmail":"john.updated@acme.com",
    "active":false
  }' | jq .
echo ""

# Test 5: Verify Update
echo "TEST 5: Verify Update (GET)"
echo "---------------------------------------------"
curl -s "$BASE_URL/$EMPLOYER_ID" -H "Authorization: Bearer $TOKEN" | jq '.data | {name, address, email, active}'
echo ""

# Test 6: Create employer with different companyId
echo "TEST 6: Create Employer with CompanyId=2"
echo "---------------------------------------------"
RESPONSE2=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name":"Beta Company",
    "code":"BETA001",
    "companyId":2,
    "address":"789 King Road",
    "phone":"+966501111111",
    "email":"info@beta.com",
    "contactName":"Jane Smith",
    "contactPhone":"+966502222222",
    "contactEmail":"jane@beta.com",
    "active":true
  }')
echo "$RESPONSE2" | jq .
EMPLOYER_ID_2=$(echo "$RESPONSE2" | jq -r '.data.id')
echo ""

# Test 7: Test Company Filter
echo "TEST 7: Filter by CompanyId=1"
echo "---------------------------------------------"
curl -s "$BASE_URL?companyId=1" -H "Authorization: Bearer $TOKEN" | jq '.data.items[] | {id, name, code, companyId}'
echo ""

echo "TEST 8: Filter by CompanyId=2"
echo "---------------------------------------------"
curl -s "$BASE_URL?companyId=2" -H "Authorization: Bearer $TOKEN" | jq '.data.items[] | {id, name, code, companyId}'
echo ""

# Test 9: Test Search
echo "TEST 9: Search for 'Acme'"
echo "---------------------------------------------"
curl -s "$BASE_URL?search=Acme" -H "Authorization: Bearer $TOKEN" | jq '.data.items[] | {id, name, code}'
echo ""

# Test 10: Delete Employer
echo "TEST 10: Delete Employer (DELETE)"
echo "---------------------------------------------"
curl -s -X DELETE "$BASE_URL/$EMPLOYER_ID" -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# Test 11: Verify Deletion
echo "TEST 11: Verify Deletion (should return 404)"
echo "---------------------------------------------"
curl -s "$BASE_URL/$EMPLOYER_ID" -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# Test 12: Test Count Endpoint
echo "TEST 12: Count Total Employers"
echo "---------------------------------------------"
curl -s "$BASE_URL/count" -H "Authorization: Bearer $TOKEN" | jq .
echo ""

echo "============================================"
echo "  Testing Complete!"
echo "============================================"
