package com.waad.tba.service;

import com.waad.tba.exception.ResourceNotFoundException;
import com.waad.tba.model.Member;
import com.waad.tba.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {
    
    private final MemberRepository memberRepository;

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }
    
    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
    }
    
    public List<Member> getMembersByOrganization(Long organizationId) {
        return memberRepository.findByOrganizationId(organizationId);
    }
    
    @Transactional
    public Member createMember(Member member) {
        return memberRepository.save(member);
    }
    
    @Transactional
    public Member updateMember(Long id, Member memberDetails) {
        Member member = getMemberById(id);
        
        member.setFullName(memberDetails.getFullName());
        member.setEmail(memberDetails.getEmail());
        member.setPhone(memberDetails.getPhone());
        member.setDateOfBirth(memberDetails.getDateOfBirth());
        member.setGender(memberDetails.getGender());
        member.setAddress(memberDetails.getAddress());
        member.setNationalId(memberDetails.getNationalId());
        member.setPolicyNumber(memberDetails.getPolicyNumber());
        member.setCoverageStartDate(memberDetails.getCoverageStartDate());
        member.setCoverageEndDate(memberDetails.getCoverageEndDate());
        member.setCoverageStatus(memberDetails.getCoverageStatus());
        
        return memberRepository.save(member);
    }
    
    @Transactional
    public void deleteMember(Long id) {
        Member member = getMemberById(id);
        memberRepository.delete(member);
    }
}
