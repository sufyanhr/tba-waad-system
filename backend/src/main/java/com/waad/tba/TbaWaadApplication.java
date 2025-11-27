package com.waad.tba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class TbaWaadApplication {
    public static void main(String[] args) {
        SpringApplication.run(TbaWaadApplication.class, args);
    }
}

git commit -m "🔥 Fix: Hibernate floating scale issue + cleanup JPA config + backend stabilization"
