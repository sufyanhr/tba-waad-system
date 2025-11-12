package com.waad.tba.service;

import com.waad.tba.exception.ResourceNotFoundException;
import com.waad.tba.model.Claim;
import com.waad.tba.model.ClaimAttachment;
import com.waad.tba.repository.ClaimAttachmentRepository;
import com.waad.tba.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClaimAttachmentService {

    private final ClaimAttachmentRepository claimAttachmentRepository;
    private final ClaimRepository claimRepository;

    private static final String UPLOAD_DIR = "uploads/claims/";

    public ClaimAttachment uploadFile(Long claimId, MultipartFile file, String uploadedBy) throws IOException {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with ID: " + claimId));

        // إنشاء مجلد إن لم يكن موجودًا
        Files.createDirectories(Paths.get(UPLOAD_DIR));

        // توليد اسم فريد للملف
        String uniqueFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + uniqueFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        ClaimAttachment attachment = ClaimAttachment.builder()
                .fileName(file.getOriginalFilename())
                .fileUrl(filePath.toString())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .uploadedBy(uploadedBy)
                .claim(claim)
                .build();

        return claimAttachmentRepository.save(attachment);
    }

    public List<ClaimAttachment> getAttachmentsByClaim(Long claimId) {
        return claimAttachmentRepository.findByClaimId(claimId);
    }

    public void deleteAttachment(Long id) {
        claimAttachmentRepository.deleteById(id);
    }
}
