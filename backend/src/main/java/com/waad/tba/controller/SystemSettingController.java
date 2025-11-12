package com.waad.tba.controller;

import com.waad.tba.model.SystemSetting;
import com.waad.tba.service.SystemSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/system-settings")
@RequiredArgsConstructor
public class SystemSettingController {

    private final SystemSettingService service;

    @GetMapping
    public ResponseEntity<List<SystemSetting>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{key}")
    public ResponseEntity<SystemSetting> getByKey(@PathVariable String key) {
        return service.getByKey(key)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SystemSetting> create(@RequestBody SystemSetting setting) {
        return ResponseEntity.ok(service.save(setting));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SystemSetting> update(@PathVariable Long id, @RequestBody SystemSetting setting) {
        setting.setId(id);
        return ResponseEntity.ok(service.save(setting));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
