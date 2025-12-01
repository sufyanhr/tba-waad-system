package com.waad.tba.modules.providercontract.entity;

/**
 * Status of a provider-company contract
 */
public enum ProviderContractStatus {
    /**
     * Contract is active and provider can serve members
     */
    ACTIVE,
    
    /**
     * Contract is temporarily suspended
     */
    SUSPENDED,
    
    /**
     * Contract has expired or been terminated
     */
    EXPIRED
}
