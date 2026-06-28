package com.nuvision.controller;

import com.nuvision.entity.Teacher;
import com.nuvision.repository.TeacherRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/teachers")
public class TeacherController {
    private final TeacherRepository repo;
    public TeacherController(TeacherRepository r) { repo = r; }

    @GetMapping  public List<Teacher> list() { return repo.findAll(); }
    @GetMapping("/{id}") public ResponseEntity<Teacher> get(@PathVariable String id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @PostMapping public ResponseEntity<Teacher> create(@RequestBody Teacher t) { return ResponseEntity.status(201).body(repo.save(t)); }
    @PutMapping("/{id}") public ResponseEntity<Teacher> update(@PathVariable String id, @RequestBody Teacher t) {
        t.setId(id); return ResponseEntity.ok(repo.save(t));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Map<String,String>> delete(@PathVariable String id) {
        repo.deleteById(id); return ResponseEntity.ok(Map.of("message","Teacher deleted"));
    }
}
