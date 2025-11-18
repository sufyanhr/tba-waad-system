package com.waad.tba.modules.test;

import com.waad.tba.core.email.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestEmailController {

    private final EmailService emailService;

    @GetMapping("/email")
    public ResponseEntity<String> sendTestEmail(@RequestParam String to) {
        try {
            emailService.send(to, "Test Email from TBA-WAAD", 
                "This is a test email from TBA-WAAD system.\n\n" +
                "If you received this, SMTP configuration is working correctly!\n\n" +
                "Best regards,\nTBA-WAAD Team");
            return ResponseEntity.ok("✅ Email sent successfully to: " + to);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Failed to send email: " + e.getMessage());
        }
    }
}
