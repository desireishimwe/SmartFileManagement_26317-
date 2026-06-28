package com.nuvision.controller;

import com.nuvision.entity.Result;
import com.nuvision.repository.ResultRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/results")
public class ResultController {
    private final ResultRepository repo;
    public ResultController(ResultRepository r) { repo = r; }

    @GetMapping
    public List<Result> list(@RequestParam(required=false) String studentId,
                             @RequestParam(required=false) String className) {
        if (studentId != null) return repo.findByStudentId(studentId);
        if (className != null) return repo.findByClassName(className);
        return repo.findAll();
    }
    @PostMapping public ResponseEntity<Result> create(@RequestBody Result r) { return ResponseEntity.status(201).body(repo.save(r)); }
    @PutMapping("/{id}") public ResponseEntity<Result> update(@PathVariable String id, @RequestBody Result r) { r.setId(id); return ResponseEntity.ok(repo.save(r)); }
    @DeleteMapping("/{id}") public ResponseEntity<Map<String,String>> delete(@PathVariable String id) { repo.deleteById(id); return ResponseEntity.ok(Map.of("message","Result deleted")); }
}
