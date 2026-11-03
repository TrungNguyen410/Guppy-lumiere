package com.guppyshop.common.exception;

/** Sai thông tin đăng nhập hoặc tài khoản không được phép đăng nhập. */
public class XacThucThatBaiException extends RuntimeException {

    public XacThucThatBaiException(String message) {
        super(message);
    }
}
