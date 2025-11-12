package com.waad.tba.service;

import com.waad.tba.model.SystemSetting;
import com.waad.tba.repository.SystemSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SystemSettingService {

    private final SystemSettingRepository repository;

    public List<SystemSetting> getAll() {
        return repository.findAll();
    }

    public Optional<SystemSetting> getByKey(String keyName) {
        return repository.findByKeyName(keyName);
    }

    public SystemSetting save(SystemSetting setting) {
        return repository.save(setting);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
