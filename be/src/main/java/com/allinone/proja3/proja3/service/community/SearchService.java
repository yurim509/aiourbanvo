package com.allinone.proja3.proja3.service.community;


import java.util.Map;

public interface SearchService {
    Map<String, Object> search(String type, String keyword, int page, int size, String category);
}
