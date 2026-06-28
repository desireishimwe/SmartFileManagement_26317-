package com.nuvision.entity;
import jakarta.persistence.*;

@Entity @Table(name = "teachers")
public class Teacher {
    @Id private String id;
    private String fullName, subject, qualification, phone;
    @Column(unique = true) private String email;
    private String address;

    public Teacher() {}
    public String getId() { return id; } public void setId(String v) { id = v; }
    public String getFullName() { return fullName; } public void setFullName(String v) { fullName = v; }
    public String getSubject() { return subject; } public void setSubject(String v) { subject = v; }
    public String getQualification() { return qualification; } public void setQualification(String v) { qualification = v; }
    public String getPhone() { return phone; } public void setPhone(String v) { phone = v; }
    public String getEmail() { return email; } public void setEmail(String v) { email = v; }
    public String getAddress() { return address; } public void setAddress(String v) { address = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Teacher t = new Teacher();
        public Builder id(String v)            { t.id = v; return this; }
        public Builder fullName(String v)      { t.fullName = v; return this; }
        public Builder subject(String v)       { t.subject = v; return this; }
        public Builder qualification(String v) { t.qualification = v; return this; }
        public Builder phone(String v)         { t.phone = v; return this; }
        public Builder email(String v)         { t.email = v; return this; }
        public Builder address(String v)       { t.address = v; return this; }
        public Teacher build() { return t; }
    }
}
