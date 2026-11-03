package com.guppyshop.common.exception;

import com.guppyshop.common.response.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/** Chuyển mọi lỗi thành ApiResponse để frontend chỉ xử lý một định dạng. */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> xuLyNghiepVu(BusinessException ex) {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(ApiResponse.loi(ex.getMessage()));
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> xuLyKhongTimThay(NotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.loi(ex.getMessage()));
    }

    @ExceptionHandler(XacThucThatBaiException.class)
    public ResponseEntity<ApiResponse<Void>> xuLyXacThuc(XacThucThatBaiException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.loi(ex.getMessage()));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiResponse<Void>> xuLyDuongDanSai(NoResourceFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.loi("Đường dẫn không tồn tại"));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Void>> xuLySaiPhuongThuc(HttpRequestMethodNotSupportedException ex) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(ApiResponse.loi("Phương thức không được hỗ trợ"));
    }

    /** Lỗi @Valid của body và lỗi gắn tham số vào object lọc. */
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> xuLyDuLieuSai(BindException ex) {
        Map<String, String> loiTheoTruong = new LinkedHashMap<>();
        for (FieldError loi : ex.getBindingResult().getFieldErrors()) {
            String thongBao = loi.isBindingFailure() ? "Giá trị không hợp lệ" : loi.getDefaultMessage();
            loiTheoTruong.putIfAbsent(loi.getField(), thongBao);
        }
        return ResponseEntity.badRequest().body(ApiResponse.loi("Dữ liệu không hợp lệ", loiTheoTruong));
    }

    /** Lỗi ràng buộc đặt trực tiếp trên tham số của controller có @Validated. */
    @ExceptionHandler({ConstraintViolationException.class, HandlerMethodValidationException.class})
    public ResponseEntity<ApiResponse<Void>> xuLyThamSoSai(Exception ex) {
        return ResponseEntity.badRequest().body(ApiResponse.loi("Tham số không hợp lệ"));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> xuLySaiKieuThamSo(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.loi("Tham số " + ex.getName() + " không hợp lệ"));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse<Void>> xuLyThieuThamSo(MissingServletRequestParameterException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.loi("Thiếu tham số " + ex.getParameterName()));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> xuLyBodySai(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.loi("Nội dung yêu cầu không đọc được"));
    }

    /** Trùng khóa duy nhất do hai yêu cầu đồng thời, hoặc xóa dữ liệu đang được tham chiếu. */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> xuLyViPhamRangBuoc(DataIntegrityViolationException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.loi("Dữ liệu bị trùng hoặc đang được sử dụng"));
    }

    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ResponseEntity<ApiResponse<Void>> xuLyXungDot(OptimisticLockingFailureException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.loi("Dữ liệu vừa thay đổi, vui lòng thử lại"));
    }

    /** Lỗi bảo mật ném ra trong controller phải trả về Spring Security, không gộp thành lỗi 500. */
    @ExceptionHandler({AccessDeniedException.class, AuthenticationException.class})
    public void traLaiChoSpringSecurity(RuntimeException ex) {
        throw ex;
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> xuLyKhongLuongTruoc(Exception ex) {
        log.error("Lỗi không lường trước", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.loi("Lỗi hệ thống, vui lòng thử lại sau"));
    }
}
