package com.waad.tba.modules.dashboard.controller;

import com.waad.tba.common.dto.ApiResponse;
import com.waad.tba.modules.dashboard.dto.ClaimsPerDayDto;
import com.waad.tba.modules.dashboard.dto.DashboardStatsDto;
import com.waad.tba.modules.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService service;

    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('dashboard.view')")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getStats() {
        DashboardStatsDto stats = service.getStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/claims-per-day")
    @PreAuthorize("hasAuthority('dashboard.view')")
    public ResponseEntity<ApiResponse<List<ClaimsPerDayDto>>> getClaimsPerDay(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<ClaimsPerDayDto> data = service.getClaimsPerDay(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(data));
    }
}
