package com.nuvision.entity;
import jakarta.persistence.*;

@Entity @Table(name = "attendance")
public class AttendanceRecord {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private String id;
    private String date, studentId, studentName, className, status;

    public AttendanceRecord() {}
    public String getId() { return id; } public void setId(String v) { id = v; }
    public String getDate() { return date; } public void setDate(String v) { date = v; }
    public String getStudentId() { return studentId; } public void setStudentId(String v) { studentId = v; }
    public String getStudentName() { return studentName; } public void setStudentName(String v) { studentName = v; }
    public String getClassName() { return className; } public void setClassName(String v) { className = v; }
    public String getStatus() { return status; } public void setStatus(String v) { status = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final AttendanceRecord a = new AttendanceRecord();
        public Builder id(String v)          { a.id = v; return this; }
        public Builder date(String v)        { a.date = v; return this; }
        public Builder studentId(String v)   { a.studentId = v; return this; }
        public Builder studentName(String v) { a.studentName = v; return this; }
        public Builder className(String v)   { a.className = v; return this; }
        public Builder status(String v)      { a.status = v; return this; }
        public AttendanceRecord build() { return a; }
    }
}
