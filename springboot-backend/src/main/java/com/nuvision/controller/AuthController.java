package com.nuvision.controller;

import com.nuvision.entity.*;
import com.nuvision.repository.*;
import com.nuvision.security.JwtUtil;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final StudentRepository studentRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository u, StudentRepository s, PasswordEncoder e, JwtUtil j) {
        userRepo = u; studentRepo = s; encoder = e; jwtUtil = j;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || password == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password required"));

        return userRepo.findByEmail(email.toLowerCase().trim())
            .map(user -> {
                if (!encoder.matches(password, user.getPassword()))
                    return ResponseEntity.status(401).body(Map.of("error", "Incorrect password."));
                String token = jwtUtil.generate(user.getId(), user.getEmail(), user.getRole(), user.getName());
                return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", Map.of("id", user.getId(), "name", user.getName(), "email", user.getEmail(),
                                   "role", user.getRole(), "studentId", user.getStudentId() == null ? "" : user.getStudentId(),
                                   "className", user.getClassName() == null ? "" : user.getClassName(),
                                   "subject", user.getSubject() == null ? "" : user.getSubject())
                ));
            })
            .orElse(ResponseEntity.status(401).body(Map.of("error", "No account found for that email.")));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "").toLowerCase().trim();
        String name  = body.getOrDefault("fullName", "");
        String pass  = body.getOrDefault("password", "");
        String role  = body.getOrDefault("role", "student");
        String phone = body.getOrDefault("phone", "");
        String studentId = body.getOrDefault("studentId", "");

        if (name.isEmpty() || email.isEmpty() || pass.isEmpty())
            return ResponseEntity.badRequest().body(Map.of("error", "Name, email and password required"));
        if (userRepo.existsByEmail(email))
            return ResponseEntity.status(409).body(Map.of("error", "An account with this email already exists."));

        String className = null;
        if (!studentId.isEmpty()) {
            var student = studentRepo.findById(studentId);
            if (student.isPresent()) className = student.get().getClassName();
        }

        User user = User.builder()
            .email(email).name(name).password(encoder.encode(pass))
            .role(role).phone(phone).studentId(studentId.isEmpty() ? null : studentId).className(className)
            .build();
        userRepo.save(user);

        String token = jwtUtil.generate(user.getId(), user.getEmail(), user.getRole(), user.getName());
        return ResponseEntity.status(201).body(Map.of("token", token,
            "user", Map.of("id", user.getId(), "name", user.getName(), "email", user.getEmail(), "role", user.getRole())));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String header) {
        String token = header.replace("Bearer ", "");
        String id = jwtUtil.getId(token);
        return userRepo.findById(id)
            .map(u -> ResponseEntity.ok(Map.of("id", u.getId(), "name", u.getName(), "email", u.getEmail(),
                "role", u.getRole(), "phone", u.getPhone() == null ? "" : u.getPhone())))
            .orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }
}
