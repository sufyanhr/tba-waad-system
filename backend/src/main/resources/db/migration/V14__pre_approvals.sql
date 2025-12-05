-- Migration V14: Pre-Approvals Module
-- Description: Creates pre_approvals table for managing medical pre-approval requests

-- Create pre_approvals table
CREATE TABLE pre_approvals (
    id BIGSERIAL PRIMARY KEY,
    
    -- Foreign Keys
    member_id BIGINT NOT NULL,
    insurance_company_id BIGINT NOT NULL,
    insurance_policy_id BIGINT,
    benefit_package_id BIGINT,
    
    -- Provider Information
    provider_name VARCHAR(255),
    doctor_name VARCHAR(255),
    
    -- Medical Information
    diagnosis TEXT,
    procedure TEXT,
    
    -- Financial Information
    requested_amount NUMERIC(15, 2) NOT NULL,
    approved_amount NUMERIC(15, 2),
    
    -- Approval Status
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reviewer_comment TEXT,
    reviewed_at TIMESTAMP,
    
    -- Attachments
    attachments_count INTEGER DEFAULT 0,
    
    -- Status
    active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Foreign Key Constraints
    CONSTRAINT fk_pre_approvals_member 
        FOREIGN KEY (member_id) 
        REFERENCES members(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_pre_approvals_insurance_company 
        FOREIGN KEY (insurance_company_id) 
        REFERENCES insurance_companies(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_pre_approvals_insurance_policy 
        FOREIGN KEY (insurance_policy_id) 
        REFERENCES insurance_policies(id) 
        ON DELETE RESTRICT,
    
    CONSTRAINT fk_pre_approvals_benefit_package 
        FOREIGN KEY (benefit_package_id) 
        REFERENCES policy_benefit_packages(id) 
        ON DELETE RESTRICT,
    
    -- Check Constraints
    CONSTRAINT chk_requested_amount_positive 
        CHECK (requested_amount > 0),
    
    CONSTRAINT chk_approved_amount_non_negative 
        CHECK (approved_amount IS NULL OR approved_amount >= 0),
    
    CONSTRAINT chk_status_valid 
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    
    CONSTRAINT chk_attachments_count_non_negative 
        CHECK (attachments_count >= 0)
);

-- Create indexes for better query performance
CREATE INDEX idx_pre_approvals_member_id ON pre_approvals(member_id);
CREATE INDEX idx_pre_approvals_insurance_company_id ON pre_approvals(insurance_company_id);
CREATE INDEX idx_pre_approvals_insurance_policy_id ON pre_approvals(insurance_policy_id);
CREATE INDEX idx_pre_approvals_benefit_package_id ON pre_approvals(benefit_package_id);
CREATE INDEX idx_pre_approvals_status ON pre_approvals(status);
CREATE INDEX idx_pre_approvals_active ON pre_approvals(active);
CREATE INDEX idx_pre_approvals_created_at ON pre_approvals(created_at DESC);
CREATE INDEX idx_pre_approvals_provider_name ON pre_approvals(provider_name);

-- Create trigger for updated_at auto-update
CREATE OR REPLACE FUNCTION update_pre_approvals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pre_approvals_updated_at
    BEFORE UPDATE ON pre_approvals
    FOR EACH ROW
    EXECUTE FUNCTION update_pre_approvals_updated_at();

-- Add table and column comments for documentation
COMMENT ON TABLE pre_approvals IS 'Stores medical pre-approval requests from members';

COMMENT ON COLUMN pre_approvals.id IS 'Primary key';
COMMENT ON COLUMN pre_approvals.member_id IS 'Reference to the member requesting pre-approval';
COMMENT ON COLUMN pre_approvals.insurance_company_id IS 'Reference to the insurance company';
COMMENT ON COLUMN pre_approvals.insurance_policy_id IS 'Optional reference to specific insurance policy';
COMMENT ON COLUMN pre_approvals.benefit_package_id IS 'Optional reference to specific benefit package';
COMMENT ON COLUMN pre_approvals.provider_name IS 'Name of hospital/clinic';
COMMENT ON COLUMN pre_approvals.doctor_name IS 'Name of treating doctor';
COMMENT ON COLUMN pre_approvals.diagnosis IS 'Medical diagnosis (ICD10 text)';
COMMENT ON COLUMN pre_approvals.procedure IS 'Medical procedure (CPT/Service text)';
COMMENT ON COLUMN pre_approvals.requested_amount IS 'Amount requested for pre-approval';
COMMENT ON COLUMN pre_approvals.approved_amount IS 'Amount approved (if approved)';
COMMENT ON COLUMN pre_approvals.status IS 'Approval status: PENDING, APPROVED, or REJECTED';
COMMENT ON COLUMN pre_approvals.reviewer_comment IS 'Comments from reviewer';
COMMENT ON COLUMN pre_approvals.reviewed_at IS 'Timestamp when reviewed';
COMMENT ON COLUMN pre_approvals.attachments_count IS 'Number of attached documents';
COMMENT ON COLUMN pre_approvals.active IS 'Soft delete flag';
COMMENT ON COLUMN pre_approvals.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN pre_approvals.updated_at IS 'Record last update timestamp';
COMMENT ON COLUMN pre_approvals.created_by IS 'User who created the record';
COMMENT ON COLUMN pre_approvals.updated_by IS 'User who last updated the record';
