package com.allinone.proja3.proja3.util;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@Log4j2
@RequiredArgsConstructor
@Getter
public class CustomFileUtil {

    @Value("${spring.web.resources.static-locations}")
    private String uploadPath;

    @PostConstruct
    public void init() {
        File tempFolder = new File(uploadPath);
        if (!tempFolder.exists()) {
            boolean created = tempFolder.mkdir();  // Create folder if it doesn't exist
            if (created) {
                System.out.println(uploadPath + " folder has been created.");
            } else {
                System.out.println("Failed to create folder.");
            }
        }
        uploadPath = tempFolder.getAbsolutePath();  // Get absolute path
        log.info("============================");
        log.info("Upload Path: " + uploadPath);
    }

    public List<String> saveFiles(List<MultipartFile> files) throws IOException {
        System.out.println("Saving files: " + files);

        if (files == null || files.isEmpty()) return List.of();

        List<String> uploadNames = new ArrayList<>();

        for (MultipartFile file : files) {
            // 파일 이름에서 확장자 추출
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            // UUID로 파일명 생성하고 확장자 붙이기
            String savedName = UUID.randomUUID().toString() + extension;
            Path savePath = Paths.get(uploadPath, savedName);  // 업로드 경로에 저장

            try {
                // 파일을 지정된 경로에 저장
                Files.copy(file.getInputStream(), savePath);

                // 이미지 파일인 경우 썸네일 생성
                String contentType = file.getContentType();
                if (contentType != null && contentType.startsWith("image")) {
                    System.out.println("이미지 파일 저장 및 썸네일 생성");
                    Path thumbnailPath = Paths.get(uploadPath, "s_" + savedName);
                    Thumbnails.of(savePath.toFile())
                            .size(200, 200)
                            .toFile(thumbnailPath.toFile());
                }

                uploadNames.add(savedName);
            } catch (IOException e) {
                System.out.println("파일 저장 실패: " + file.getOriginalFilename());
                throw new IOException("파일 저장 실패: " + file.getOriginalFilename(), e);
            }
        }
        return uploadNames;
    }

    // Retrieve a file for download or display
    public ResponseEntity<Resource> getFile(String fileName) {
        Resource resource = new FileSystemResource(uploadPath + File.separator + fileName);

        // If the file is not readable, return a default image
        if (!resource.isReadable()) {
            resource = new FileSystemResource(uploadPath + File.separator + "default.jpeg");
        }

        HttpHeaders headers = new HttpHeaders();
        try {
            // Set the content type based on the file's MIME type
            headers.add("Content-Type", Files.probeContentType(resource.getFile().toPath()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }

        // Return the file with appropriate headers
        return ResponseEntity.ok().headers(headers).body(resource);
    }

    // Delete files and their corresponding thumbnails if they exist
    public void deleteFile(List<String> fileNames) {
        if (fileNames == null || fileNames.isEmpty()) return;

        fileNames.forEach(fileName -> {
            // Check and delete thumbnail file if it exists
            String thumbnailFileName = "s_" + fileName;
            Path thumbnailPath = Paths.get(uploadPath, thumbnailFileName);
            Path filePath = Paths.get(uploadPath, fileName);

            try {
                Files.deleteIfExists(filePath);
                Files.deleteIfExists(thumbnailPath);
            } catch (IOException e) {
                throw new RuntimeException(e.getMessage());
            }
        });
    }
}
