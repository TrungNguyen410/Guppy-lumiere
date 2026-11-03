package com.guppyshop.common.exception;

/** Không tìm thấy tài nguyên được yêu cầu. */
public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }
}
