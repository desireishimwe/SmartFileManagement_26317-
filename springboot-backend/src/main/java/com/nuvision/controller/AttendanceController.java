package com.nuvision.controller;

import com.nuvision.entity.AttendanceRecord;
import com.nuvision.repository.AttendanceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/attendance")
public class AttendanceController {
    private final AttendanceRepository repo;
    public AttendanceController(AttendanceRepository r) { repo = r; }

    @GetMapping
    public List<AttendanceRecord> list(@RequestParam(required=false) String studentId,
                                       @RequestParam(required=false) String className,
                                       @RequestParam(required=false) String date) {
        if (studentId != null) return repo.findByStudentId(studentId);
        if (className != null) return repo.findByClassName(className);
        if (date != null)      return repo.findByDate(date);
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Object body) {
        if (body instanceof List<?> list) {
            var saved = list.stream().map(i -> repo.save((AttendanceRecord) i)).toList();
            return ResponseEntity.status(201).body(saved);
        }
        return ResponseEntity.status(201).body(repo.save((AttendanceRecord) body));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttendanceRecord> update(@PathVariable String id, @RequestBody AttendanceRecord a) {
        a.setId(id); return ResponseEntity.ok(repo.save(a));
    }
}
