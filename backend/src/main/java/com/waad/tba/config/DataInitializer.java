package com.waad.tba.config;

import com.waad.tba.modules.admin.system.SystemAdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Data Initializer
 * Runs on application startup to ensure primary tenant company and default RBAC data exist.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final SystemAdminService systemAdminService;

    @Override
    public void run(String... args) {
        log.info("====================================================");
        log.info("Starting TBA-Waad System Data Initialization...");
        log.info("====================================================");
        
        try {
            // This will create:
            // 1. Primary tenant company (Waad)
            // 2. Default permissions
            // 3. Default roles
            // 4. Admin user
            systemAdminService.initDefaults();
            
            log.info("====================================================");
            log.info("✅ System Initialization Completed Successfully!");
            log.info("====================================================");
        } catch (Exception e) {
            log.error("❌ System Initialization Failed!", e);
            log.error("====================================================");
        }
    }
}
