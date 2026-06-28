package com.nuvision.controller;

import com.nuvision.entity.Student;
import com.nuvision.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository repo;
    public StudentController(StudentRepository r) { repo = r; }

    @GetMapping
    public List<Student> list(@RequestParam(required = false) String search,
                              @RequestParam(required = false) String className,
                              @RequestParam(required = false) String level) {
        if (search != null && !search.isBlank()) return repo.search(search);
        if (className != null) return repo.findByClassName(className);
        if (level != null)     return repo.findByLevel(level);
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> get(@PathVariable String id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Student> create(@RequestBody Student student) {
        return ResponseEntity.status(201).body(repo.save(student));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> update(@PathVariable String id, @RequestBody Student body) {
        return repo.findById(id).map(s -> {
            body.setId(id);
            return ResponseEntity.ok(repo.save(body));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        repo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Student deleted"));
    }
}
