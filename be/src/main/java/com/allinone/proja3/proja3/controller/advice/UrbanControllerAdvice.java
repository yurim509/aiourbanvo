package com.allinone.proja3.proja3.controller.advice;

import com.allinone.proja3.proja3.util.UrbanJWTException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class UrbanControllerAdvice {

    @ExceptionHandler (NoSuchElementException.class)
    protected ResponseEntity<?> notExist(NoSuchElementException e) {
        String message = e.getMessage();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", message));
    }

    @ExceptionHandler (MethodArgumentNotValidException.class)
    protected ResponseEntity<?> handleIllegalArgumentException(MethodArgumentNotValidException e) {
        String message = e.getMessage();
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Map.of("message", message));
    }

    @ExceptionHandler (UrbanJWTException.class)
    protected ResponseEntity<?> handleJWTException(UrbanJWTException e) {
        String message = e.getMessage();
        return ResponseEntity.ok().body(Map.of("error", message));
    }

    @ExceptionHandler (RuntimeException.class)
    protected ResponseEntity<?> handleRuntimeException(RuntimeException e) {
        String message = e.getMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", message));
    }
}
