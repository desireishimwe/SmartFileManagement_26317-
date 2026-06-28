package com.nuvision.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity @Table(name = "students")
public class Student {
    @Id private String id;
    private String firstName, lastName, gender, dateOfBirth, enrollmentDate, level, combination;
    private String className, parentName, parentPhone, address;
    @Column(unique = true, nullable = false) private String email;
    private String profilePhoto;
    @Column(updatable = false) private LocalDateTime createdAt;
    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }

    public Student() {}
    public String getId() { return id; } public void setId(String v) { id = v; }
    public String getFirstName() { return firstName; } public void setFirstName(String v) { firstName = v; }
    public String getLastName() { return lastName; } public void setLastName(String v) { lastName = v; }
    public String getGender() { return gender; } public void setGender(String v) { gender = v; }
    public String getDateOfBirth() { return dateOfBirth; } public void setDateOfBirth(String v) { dateOfBirth = v; }
    public String getEnrollmentDate() { return enrollmentDate; } public void setEnrollmentDate(String v) { enrollmentDate = v; }
    public String getLevel() { return level; } public void setLevel(String v) { level = v; }
    public String getCombination() { return combination; } public void setCombination(String v) { combination = v; }
    public String getClassName() { return className; } public void setClassName(String v) { className = v; }
    public String getParentName() { return parentName; } public void setParentName(String v) { parentName = v; }
    public String getParentPhone() { return parentPhone; } public void setParentPhone(String v) { parentPhone = v; }
    public String getAddress() { return address; } public void setAddress(String v) { address = v; }
    public String getEmail() { return email; } public void setEmail(String v) { email = v; }
    public String getProfilePhoto() { return profilePhoto; } public void setProfilePhoto(String v) { profilePhoto = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Student s = new Student();
        public Builder id(String v)             { s.id = v; return this; }
        public Builder firstName(String v)      { s.firstName = v; return this; }
        public Builder lastName(String v)       { s.lastName = v; return this; }
        public Builder gender(String v)         { s.gender = v; return this; }
        public Builder dateOfBirth(String v)    { s.dateOfBirth = v; return this; }
        public Builder enrollmentDate(String v) { s.enrollmentDate = v; return this; }
        public Builder level(String v)          { s.level = v; return this; }
        public Builder combination(String v)    { s.combination = v; return this; }
        public Builder className(String v)      { s.className = v; return this; }
        public Builder parentName(String v)     { s.parentName = v; return this; }
        public Builder parentPhone(String v)    { s.parentPhone = v; return this; }
        public Builder address(String v)        { s.address = v; return this; }
        public Builder email(String v)          { s.email = v; return this; }
        public Builder profilePhoto(String v)   { s.profilePhoto = v; return this; }
        public Student build() { return s; }
    }
}
