package com.nuvision.entity;
import jakarta.persistence.*;

@Entity @Table(name = "results")
public class Result {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private String id;
    private String studentId, studentName, className, subject;
    private double marks, gpa;

    public Result() {}
    public String getId() { return id; } public void setId(String v) { id = v; }
    public String getStudentId() { return studentId; } public void setStudentId(String v) { studentId = v; }
    public String getStudentName() { return studentName; } public void setStudentName(String v) { studentName = v; }
    public String getClassName() { return className; } public void setClassName(String v) { className = v; }
    public String getSubject() { return subject; } public void setSubject(String v) { subject = v; }
    public double getMarks() { return marks; } public void setMarks(double v) { marks = v; }
    public double getGpa() { return gpa; } public void setGpa(double v) { gpa = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Result r = new Result();
        public Builder studentId(String v)   { r.studentId = v; return this; }
        public Builder studentName(String v) { r.studentName = v; return this; }
        public Builder className(String v)   { r.className = v; return this; }
        public Builder subject(String v)     { r.subject = v; return this; }
        public Builder marks(double v)       { r.marks = v; return this; }
        public Builder gpa(double v)         { r.gpa = v; return this; }
        public Result build() { return r; }
    }
}
