package com.nuvision.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity @Table(name = "payments")
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private String id;
    private String feeId, studentName, method, paidBy, date;
    private double amount;
    @Column(updatable = false) private LocalDateTime createdAt;
    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }

    public Payment() {}
    public String getId() { return id; }
    public String getFeeId() { return feeId; } public void setFeeId(String v) { feeId = v; }
    public String getStudentName() { return studentName; } public void setStudentName(String v) { studentName = v; }
    public String getMethod() { return method; } public void setMethod(String v) { method = v; }
    public String getPaidBy() { return paidBy; } public void setPaidBy(String v) { paidBy = v; }
    public String getDate() { return date; } public void setDate(String v) { date = v; }
    public double getAmount() { return amount; } public void setAmount(double v) { amount = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Payment p = new Payment();
        public Builder feeId(String v)       { p.feeId = v; return this; }
        public Builder studentName(String v) { p.studentName = v; return this; }
        public Builder amount(double v)      { p.amount = v; return this; }
        public Builder method(String v)      { p.method = v; return this; }
        public Builder paidBy(String v)      { p.paidBy = v; return this; }
        public Builder date(String v)        { p.date = v; return this; }
        public Payment build() { return p; }
    }
}
