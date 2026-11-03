package com.guppyshop.common.exception;

/** Vi phạm quy tắc nghiệp vụ, ví dụ chuyển sai trạng thái đơn hoặc không đủ tồn kho. */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}
