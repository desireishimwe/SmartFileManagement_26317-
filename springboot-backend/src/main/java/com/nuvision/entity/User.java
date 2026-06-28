package com.nuvision.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(unique = true, nullable = false) private String email;
    @Column(nullable = false) private String password;
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String role;
    private String phone;
    private String studentId;
    private String className;
    private String subject;
    @Column(updatable = false) private LocalDateTime createdAt;

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }

    public User() {}
    public String getId() { return id; }
    public String getEmail() { return email; } public void setEmail(String v) { email = v; }
    public String getPassword() { return password; } public void setPassword(String v) { password = v; }
    public String getName() { return name; } public void setName(String v) { name = v; }
    public String getRole() { return role; } public void setRole(String v) { role = v; }
    public String getPhone() { return phone; } public void setPhone(String v) { phone = v; }
    public String getStudentId() { return studentId; } public void setStudentId(String v) { studentId = v; }
    public String getClassName() { return className; } public void setClassName(String v) { className = v; }
    public String getSubject() { return subject; } public void setSubject(String v) { subject = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final User u = new User();
        public Builder email(String v)     { u.email = v; return this; }
        public Builder password(String v)  { u.password = v; return this; }
        public Builder name(String v)      { u.name = v; return this; }
        public Builder role(String v)      { u.role = v; return this; }
        public Builder phone(String v)     { u.phone = v; return this; }
        public Builder studentId(String v) { u.studentId = v; return this; }
        public Builder className(String v) { u.className = v; return this; }
        public Builder subject(String v)   { u.subject = v; return this; }
        public User build() { return u; }
    }
}
