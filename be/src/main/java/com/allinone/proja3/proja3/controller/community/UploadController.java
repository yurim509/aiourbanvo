package com.allinone.proja3.proja3.controller.community;

import com.allinone.proja3.proja3.util.CustomFileUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController

public class UploadController {
    @Autowired
    private CustomFileUtil fileUtil;

    @GetMapping("/upload/**")
    public ResponseEntity<Resource> viewFileGet(HttpServletRequest request) {
        System.out.println("here is upload get :777)");
        try {
            // Extract the file name after "/upload/"
            String encodedFileName = request.getRequestURI().split("/upload/")[1];

            // URL 디코딩 처리 (UTF-8)
            String decodedFileName = java.net.URLDecoder.decode(encodedFileName, java.nio.charset.StandardCharsets.UTF_8.toString());
            System.out.println("Decoded fileName: " + decodedFileName);

            // 파일 처리
            return fileUtil.getFile(decodedFileName);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to process file name", e);
        }
    }

}
