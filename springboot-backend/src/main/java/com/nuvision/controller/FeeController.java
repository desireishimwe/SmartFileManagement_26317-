package com.nuvision.controller;

import com.nuvision.entity.*;
import com.nuvision.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController @RequestMapping("/api")
public class FeeController {
    private final FeeRepository feeRepo;
    private final PaymentRepository paymentRepo;

    public FeeController(FeeRepository f, PaymentRepository p) { feeRepo = f; paymentRepo = p; }

    @GetMapping("/fees")
    public List<Fee> fees(@RequestParam(required=false) String studentId) {
        return studentId != null ? feeRepo.findByStudentId(studentId) : feeRepo.findAll();
    }

    @GetMapping("/fees/{id}")
    public ResponseEntity<Fee> fee(@PathVariable String id) {
        return feeRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/fees")
    public ResponseEntity<Fee> createFee(@RequestBody Fee f) { return ResponseEntity.status(201).body(feeRepo.save(f)); }

    @PutMapping("/fees/{id}")
    public ResponseEntity<Fee> updateFee(@PathVariable String id, @RequestBody Fee f) {
        f.setId(id); return ResponseEntity.ok(feeRepo.save(f));
    }

    @GetMapping("/payments")
    public List<Payment> payments(@RequestParam(required=false) String feeId) {
        return feeId != null ? paymentRepo.findByFeeId(feeId) : paymentRepo.findAll();
    }

    @PostMapping("/payments")
    public ResponseEntity<?> pay(@RequestBody Map<String, Object> body) {
        String feeId  = (String) body.get("feeId");
        double amount = Double.parseDouble(body.get("amount").toString());
        String method = (String) body.get("method");
        String paidBy = (String) body.getOrDefault("paidBy", "Parent");

        Fee fee = feeRepo.findById(feeId).orElse(null);
        if (fee == null) return ResponseEntity.status(404).body(Map.of("error","Fee not found"));
        double balance = fee.getAmount() - fee.getPaid();
        if (amount > balance) return ResponseEntity.badRequest().body(Map.of("error","Amount exceeds balance"));

        Payment payment = Payment.builder()
            .feeId(feeId).studentName(fee.getStudentName())
            .amount(amount).method(method).paidBy(paidBy)
            .date(LocalDate.now().toString()).build();
        paymentRepo.save(payment);

        fee.setPaid(fee.getPaid() + amount);
        feeRepo.save(fee);
        return ResponseEntity.status(201).body(payment);
    }
}
