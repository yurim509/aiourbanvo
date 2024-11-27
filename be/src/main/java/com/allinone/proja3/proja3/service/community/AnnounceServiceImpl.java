package com.allinone.proja3.proja3.service.community;

import com.allinone.proja3.proja3.dto.PageRequestDTO;
import com.allinone.proja3.proja3.dto.PageResponseDTO;
import com.allinone.proja3.proja3.dto.community.AnnounceDTO;
import com.allinone.proja3.proja3.dto.community.CommunityDTO;
import com.allinone.proja3.proja3.model.User;
import com.allinone.proja3.proja3.model.community.Announce;
import com.allinone.proja3.proja3.model.community.Community;
import com.allinone.proja3.proja3.repository.UserRepository;
import com.allinone.proja3.proja3.repository.community.CommunityAnnounceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnnounceServiceImpl implements AnnounceService {
    private final CommunityAnnounceRepository repository;
    private final UserRepository userRepository; // UserRepository 주입

    @Override
    public PageResponseDTO<AnnounceDTO> findAllAnnouncements(PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize()
        , Sort.by("pno").descending());
        Page<Announce> result = repository.findAll(pageable);

        List<AnnounceDTO> dtoList = result.getContent().stream()
                .map(this::entityDto)
                .collect(Collectors.toList());

        return PageResponseDTO.<AnnounceDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(result.getTotalElements())
                .build();
    }


    @Override
    public Announce createPost(User user, Announce announce) {
        announce.setUser(user);
        return repository.save(announce);
    }

    @Override
    public AnnounceDTO entityDto(Announce announce) {
        return AnnounceDTO.builder()
                .pno(announce.getPno())
                .title(announce.getTitle())
                .content(announce.getContent())
                .author(announce.getUser().getUserName())
                .createdAt(announce.getCreatedAt())
                .updatedAt(announce.getUpdatedAt())
                .userId(announce.getUser().getUno())
                .userName(announce.getUser().getUserName())
                .build();
    }

    public AnnounceDTO getPno(Long pno, User user){
        Announce announce = repository.findById(pno)
                .orElseThrow(()->new IllegalArgumentException("읽었다"+pno));
        return new AnnounceDTO(announce.getPno(),announce.getTitle(),announce.getContent());
    }



    @Override
    public void deletePost(Long pno, Long uno) {
        // 게시글 찾기
        Announce announce = repository.findById(pno)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다: " + pno));

        // 작성자 검증
        if (!announce.getUser().getUno().equals(uno)) {
            throw new SecurityException("본인만 게시글을 삭제할 수 있습니다.");
        }

        // 삭제 실행
        repository.deleteById(pno);
    }

    @Override
    public void deletePostByAdmin(Long pno) {
        // 관리자 권한으로 삭제
        repository.deleteById(pno);
    }
    @Override
    public boolean modify(AnnounceDTO announceDTO) {
        Optional<Announce> optionalPost = repository.findById(announceDTO.getPno());

        if (optionalPost.isPresent()) {
            Announce post = optionalPost.get();
            post.setTitle(announceDTO.getTitle());
            post.setContent(announceDTO.getContent());

            repository.save(post); // 수정된 게시글 저장
            return true; // 성공 시 true 반환
        } else {
            return false; // 게시글이 없을 경우 false 반환
        }
    }

    @Override
    public List<AnnounceDTO> findDataByUno(Long uno) {
        User user = userRepository.findById(uno)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<Announce> announcesList = repository.findByUser(user); // User 객체로 검색
        return announcesList.stream()
                .map(this::entityDto)
                .collect(Collectors.toList());
    }

}
