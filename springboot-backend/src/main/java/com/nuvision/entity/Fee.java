package com.nuvision.entity;
import jakarta.persistence.*;

@Entity @Table(name = "fees")
public class Fee {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private String id;
    private String studentId, studentName, className, parentName, parentPhone, dueDate;
    private double amount, paid;

    public Fee() {}
    public String getId() { return id; } public void setId(String v) { id = v; }
    public String getStudentId() { return studentId; } public void setStudentId(String v) { studentId = v; }
    public String getStudentName() { return studentName; } public void setStudentName(String v) { studentName = v; }
    public String getClassName() { return className; } public void setClassName(String v) { className = v; }
    public String getParentName() { return parentName; } public void setParentName(String v) { parentName = v; }
    public String getParentPhone() { return parentPhone; } public void setParentPhone(String v) { parentPhone = v; }
    public String getDueDate() { return dueDate; } public void setDueDate(String v) { dueDate = v; }
    public double getAmount() { return amount; } public void setAmount(double v) { amount = v; }
    public double getPaid() { return paid; } public void setPaid(double v) { paid = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Fee f = new Fee();
        public Builder id(String v)          { f.id = v; return this; }
        public Builder studentId(String v)   { f.studentId = v; return this; }
        public Builder studentName(String v) { f.studentName = v; return this; }
        public Builder className(String v)   { f.className = v; return this; }
        public Builder parentName(String v)  { f.parentName = v; return this; }
        public Builder parentPhone(String v) { f.parentPhone = v; return this; }
        public Builder dueDate(String v)     { f.dueDate = v; return this; }
        public Builder amount(double v)      { f.amount = v; return this; }
        public Builder paid(double v)        { f.paid = v; return this; }
        public Fee build() { return f; }
    }
}
