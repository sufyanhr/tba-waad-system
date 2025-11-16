package com.waad.tba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {
    "com.waad.tba.common",
    "com.waad.tba.security", 
    "com.waad.tba.modules"
})
@EnableJpaRepositories(basePackages = {
    "com.waad.tba.modules.*.repository"
})
@EntityScan(basePackages = {
    "com.waad.tba.modules.*.entity"
})
public class TbaWaadApplication {
    public static void main(String[] args) {
        SpringApplication.run(TbaWaadApplication.class, args);
    }
}
