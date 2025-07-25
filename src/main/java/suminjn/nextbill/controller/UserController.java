package suminjn.nextbill.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import suminjn.nextbill.dto.UpdateEmailSettingsRequestDto;
import suminjn.nextbill.dto.UserEmailSettingsDto;
import suminjn.nextbill.dto.UserResponseDto;
import suminjn.nextbill.service.UserService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 기존 회원가입 엔드포인트 제거 - Google OAuth2만 사용

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    // 사용자 정보 업데이트는 OAuth2 등록 완성으로 대체됨

    @PatchMapping("/{userId}/email-alert")
    public ResponseEntity<UserResponseDto> updateEmailAlertSetting(
            @PathVariable Long userId, 
            @RequestParam Boolean isEmailAlertEnabled) {
        UserResponseDto response = userService.updateEmailAlertSetting(userId, isEmailAlertEnabled);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    // 이메일 알림 설정 조회
    @GetMapping("/{userId}/email-settings")
    public ResponseEntity<UserEmailSettingsDto> getEmailSettings(@PathVariable Long userId) {
        UserEmailSettingsDto settings = userService.getEmailSettings(userId);
        return ResponseEntity.ok(settings);
    }

    // 이메일 알림 설정 업데이트
    @PutMapping("/{userId}/email-settings")
    public ResponseEntity<UserEmailSettingsDto> updateEmailSettings(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateEmailSettingsRequestDto request) {
        UserEmailSettingsDto settings = userService.updateEmailSettings(userId, request);
        return ResponseEntity.ok(settings);
    }
}