package com.waad.tba.util;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class ClaimNumberGenerator {

    private final JdbcTemplate jdbcTemplate;

    public String generateClaimNumber() {
        Long nextVal = jdbcTemplate.queryForObject("SELECT nextval('claim_number_seq')", Long.class);
        String year = String.valueOf(LocalDate.now().getYear());
        String formatted = String.format("CLM-%s-%05d", year, nextVal);
        return formatted;
    }
}
