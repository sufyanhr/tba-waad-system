#!/bin/bash

# ==============================
# TBA-WAAD System - Official Data Setup
# ==============================
# Purpose: Initialize system with official organizational entities
# ONLY creates the authorized entities - NO demo/test data
# ==============================

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
BASE_URL="http://localhost:8080/api"
AUTH_ENDPOINT="${BASE_URL}/auth/login"
ADMIN_USERNAME="admin@tba.sa"
ADMIN_PASSWORD="Admin@123"

# JWT Token
JWT_TOKEN=""

# Entity IDs (will be populated after creation)
ALWAHA_COMPANY_ID=""
WAAD_TPA_ID=""
LIBCEMENT_ID=""
JALYANA_ID=""
WAHDA_BANK_ID=""
CUSTOMS_ID=""

# ==============================
# Utility Functions
# ==============================

print_header() {
    echo -e "\n${CYAN}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_fail() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# ==============================
# Authentication
# ==============================

login() {
    print_header "STEP 1: Authentication"
    print_info "Logging in as ${ADMIN_USERNAME}..."
    
    RESPONSE=$(curl -s -X POST "${AUTH_ENDPOINT}" \
        -H "Content-Type: application/json" \
        -d "{
            \"identifier\": \"${ADMIN_USERNAME}\",
            \"password\": \"${ADMIN_PASSWORD}\"
        }")
    
    JWT_TOKEN=$(echo "$RESPONSE" | jq -r '.data.token')
    
    if [ "$JWT_TOKEN" != "null" ] && [ -n "$JWT_TOKEN" ]; then
        print_success "Authentication successful"
    else
        print_fail "Authentication failed"
        echo "$RESPONSE" | jq '.'
        exit 1
    fi
}

# ==============================
# Create Insurance Company
# ==============================

create_insurance_company() {
    print_header "STEP 2: Create Insurance Company"
    print_info "Creating: شركة الواحة للتأمين (Al Waha Insurance Company)"
    
    RESPONSE=$(curl -s -X POST "${BASE_URL}/insurance-companies" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${JWT_TOKEN}" \
        -d '{
            "name": "شركة الواحة للتأمين",
            "nameEn": "Al Waha Insurance Company",
            "code": "ALWAHA_INS",
            "licenseNumber": "LIC-ALWAHA-2024",
            "phone": "+218213334444",
            "email": "info@alwaha-ins.ly",
            "address": "طرابلس، ليبيا",
            "contactPerson": "إدارة شركة الواحة",
            "active": true
        }')
    
    ALWAHA_COMPANY_ID=$(echo "$RESPONSE" | jq -r '.data.id // .id')
    
    if [ "$ALWAHA_COMPANY_ID" != "null" ] && [ -n "$ALWAHA_COMPANY_ID" ]; then
        print_success "Al Waha Insurance created (ID: $ALWAHA_COMPANY_ID)"
    else
        # Try to fetch existing
        print_info "Company might exist, fetching..."
        RESPONSE=$(curl -s -X GET "${BASE_URL}/insurance-companies?search=ALWAHA_INS&page=0&size=1" \
            -H "Authorization: Bearer ${JWT_TOKEN}")
        
        ALWAHA_COMPANY_ID=$(echo "$RESPONSE" | jq -r '.data.items[0].id')
        
        if [ "$ALWAHA_COMPANY_ID" != "null" ] && [ -n "$ALWAHA_COMPANY_ID" ]; then
            print_success "Using existing Al Waha Insurance (ID: $ALWAHA_COMPANY_ID)"
        else
            print_fail "Failed to create or fetch Al Waha Insurance"
            exit 1
        fi
    fi
}

# ==============================
# Create Employers
# ==============================

create_employer_libcement() {
    print_header "STEP 3: Create Employer - Libyan Cement Company"
    print_info "Creating: شركة الإسمنت الليبية (LIBCEMENT)"
    
    RESPONSE=$(curl -s -X POST "${BASE_URL}/employers" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${JWT_TOKEN}" \
        -d "{
            \"name\": \"شركة الإسمنت الليبية\",
            \"nameEn\": \"Libyan Cement Company\",
            \"code\": \"LIBCEMENT\",
            \"companyId\": ${ALWAHA_COMPANY_ID},
            \"contactName\": \"أحمد محمود\",
            \"phone\": \"+218912345001\",
            \"email\": \"info@libcement.ly\",
            \"address\": \"طرابلس، ليبيا\",
            \"active\": true
        }")
    
    LIBCEMENT_ID=$(echo "$RESPONSE" | jq -r '.data.id // .id')
    
    if [ "$LIBCEMENT_ID" != "null" ] && [ -n "$LIBCEMENT_ID" ]; then
        print_success "Libyan Cement Company created (ID: $LIBCEMENT_ID)"
    else
        print_info "Employer might exist, fetching..."
        RESPONSE=$(curl -s -X GET "${BASE_URL}/employers?search=LIBCEMENT&page=0&size=1" \
            -H "Authorization: Bearer ${JWT_TOKEN}")
        
        LIBCEMENT_ID=$(echo "$RESPONSE" | jq -r '.data.items[0].id')
        
        if [ "$LIBCEMENT_ID" != "null" ] && [ -n "$LIBCEMENT_ID" ]; then
            print_success "Using existing Libyan Cement Company (ID: $LIBCEMENT_ID)"
        fi
    fi
}

create_employer_jalyana() {
    print_header "STEP 4: Create Employer - Jalyana Region"
    print_info "Creating: منطقة جليانة (JALYANA)"
    
    RESPONSE=$(curl -s -X POST "${BASE_URL}/employers" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${JWT_TOKEN}" \
        -d "{
            \"name\": \"منطقة جليانة\",
            \"nameEn\": \"Jalyana Region\",
            \"code\": \"JALYANA\",
            \"companyId\": ${ALWAHA_COMPANY_ID},
            \"contactName\": \"فاطمة عبدالله\",
            \"phone\": \"+218912345002\",
            \"email\": \"info@jalyana.ly\",
            \"address\": \"جليانة، ليبيا\",
            \"active\": true
        }")
    
    JALYANA_ID=$(echo "$RESPONSE" | jq -r '.data.id // .id')
    
    if [ "$JALYANA_ID" != "null" ] && [ -n "$JALYANA_ID" ]; then
        print_success "Jalyana Region created (ID: $JALYANA_ID)"
    else
        print_info "Employer might exist, fetching..."
        RESPONSE=$(curl -s -X GET "${BASE_URL}/employers?search=JALYANA&page=0&size=1" \
            -H "Authorization: Bearer ${JWT_TOKEN}")
        
        JALYANA_ID=$(echo "$RESPONSE" | jq -r '.data.items[0].id')
        
        if [ "$JALYANA_ID" != "null" ] && [ -n "$JALYANA_ID" ]; then
            print_success "Using existing Jalyana Region (ID: $JALYANA_ID)"
        fi
    fi
}

create_employer_wahda_bank() {
    print_header "STEP 5: Create Employer - Wahda Bank"
    print_info "Creating: مصرف الوحدة (WAHDA_BANK)"
    
    RESPONSE=$(curl -s -X POST "${BASE_URL}/employers" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${JWT_TOKEN}" \
        -d "{
            \"name\": \"مصرف الوحدة\",
            \"nameEn\": \"Wahda Bank\",
            \"code\": \"WAHDA_BANK\",
            \"companyId\": ${ALWAHA_COMPANY_ID},
            \"contactName\": \"محمد الطاهر\",
            \"phone\": \"+218912345003\",
            \"email\": \"info@wahdabank.ly\",
            \"address\": \"طرابلس، ليبيا\",
            \"active\": true
        }")
    
    WAHDA_BANK_ID=$(echo "$RESPONSE" | jq -r '.data.id // .id')
    
    if [ "$WAHDA_BANK_ID" != "null" ] && [ -n "$WAHDA_BANK_ID" ]; then
        print_success "Wahda Bank created (ID: $WAHDA_BANK_ID)"
    else
        print_info "Employer might exist, fetching..."
        RESPONSE=$(curl -s -X GET "${BASE_URL}/employers?search=WAHDA_BANK&page=0&size=1" \
            -H "Authorization: Bearer ${JWT_TOKEN}")
        
        WAHDA_BANK_ID=$(echo "$RESPONSE" | jq -r '.data.items[0].id')
        
        if [ "$WAHDA_BANK_ID" != "null" ] && [ -n "$WAHDA_BANK_ID" ]; then
            print_success "Using existing Wahda Bank (ID: $WAHDA_BANK_ID)"
        fi
    fi
}

create_employer_customs() {
    print_header "STEP 6: Create Employer - Customs Authority"
    print_info "Creating: مصلحة الجمارك (CUSTOMS)"
    
    RESPONSE=$(curl -s -X POST "${BASE_URL}/employers" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${JWT_TOKEN}" \
        -d "{
            \"name\": \"مصلحة الجمارك\",
            \"nameEn\": \"Customs Authority\",
            \"code\": \"CUSTOMS\",
            \"companyId\": ${ALWAHA_COMPANY_ID},
            \"contactName\": \"سعيد أحمد\",
            \"phone\": \"+218912345004\",
            \"email\": \"info@customs.ly\",
            \"address\": \"طرابلس، ليبيا\",
            \"active\": true
        }")
    
    CUSTOMS_ID=$(echo "$RESPONSE" | jq -r '.data.id // .id')
    
    if [ "$CUSTOMS_ID" != "null" ] && [ -n "$CUSTOMS_ID" ]; then
        print_success "Customs Authority created (ID: $CUSTOMS_ID)"
    else
        print_info "Employer might exist, fetching..."
        RESPONSE=$(curl -s -X GET "${BASE_URL}/employers?search=CUSTOMS&page=0&size=1" \
            -H "Authorization: Bearer ${JWT_TOKEN}")
        
        CUSTOMS_ID=$(echo "$RESPONSE" | jq -r '.data.items[0].id')
        
        if [ "$CUSTOMS_ID" != "null" ] && [ -n "$CUSTOMS_ID" ]; then
            print_success "Using existing Customs Authority (ID: $CUSTOMS_ID)"
        fi
    fi
}

# ==============================
# Summary
# ==============================

print_summary() {
    print_header "SETUP COMPLETE"
    
    echo -e "${GREEN}All official entities have been created successfully!${NC}\n"
    
    echo -e "${CYAN}📊 Entity IDs Summary:${NC}"
    echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${YELLOW}Insurance Company:${NC}"
    echo -e "  • Al Waha Insurance (الواحة للتأمين)     : ID ${ALWAHA_COMPANY_ID}"
    echo -e ""
    echo -e "${YELLOW}Employers:${NC}"
    echo -e "  • Libyan Cement (الإسمنت الليبية)        : ID ${LIBCEMENT_ID}"
    echo -e "  • Jalyana Region (جليانة)                : ID ${JALYANA_ID}"
    echo -e "  • Wahda Bank (مصرف الوحدة)               : ID ${WAHDA_BANK_ID}"
    echo -e "  • Customs Authority (مصلحة الجمارك)      : ID ${CUSTOMS_ID}"
    echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
    
    echo -e "${CYAN}📝 Next Steps:${NC}"
    echo -e "  1. Use these entity IDs in your service layer tests"
    echo -e "  2. Configure frontend constants with these IDs"
    echo -e "  3. Run integration tests with official data"
    echo -e "  4. DO NOT create any demo/test entities\n"
    
    echo -e "${GREEN}✓ Official organizational structure is ready!${NC}\n"
}

# ==============================
# Main Execution
# ==============================

main() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                                                                ║"
    echo "║         TBA-WAAD SYSTEM - OFFICIAL DATA SETUP                  ║"
    echo "║                                                                ║"
    echo "║  This script creates ONLY the authorized organizational        ║"
    echo "║  entities. No demo or test data will be created.               ║"
    echo "║                                                                ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    
    # Check if jq is installed
    if ! command -v jq &> /dev/null; then
        print_fail "jq is not installed. Please install jq to run this script."
        exit 1
    fi
    
    # Execute setup steps
    login
    create_insurance_company
    create_employer_libcement
    create_employer_jalyana
    create_employer_wahda_bank
    create_employer_customs
    print_summary
    
    exit 0
}

# Run main function
main "$@"
