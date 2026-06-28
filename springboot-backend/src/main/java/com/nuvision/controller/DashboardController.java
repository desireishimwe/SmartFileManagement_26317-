package com.nuvision.controller;

import com.nuvision.repository.*;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api/dashboard")
public class DashboardController {
    private final StudentRepository students;
    private final TeacherRepository teachers;
    private final SchoolClassRepository classes;
    private final AttendanceRepository attendance;
    private final FeeRepository fees;

    public DashboardController(StudentRepository s, TeacherRepository t, SchoolClassRepository c, AttendanceRepository a, FeeRepository f) {
        students = s; teachers = t; classes = c; attendance = a; fees = f;
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        var att = attendance.findAll();
        long present = att.stream().filter(a -> "Present".equals(a.getStatus())).count();
        int rate = att.isEmpty() ? 0 : (int) Math.round((present * 100.0) / att.size());
        var feeList = fees.findAll();
        double total   = feeList.stream().mapToDouble(f -> f.getAmount()).sum();
        double paid    = feeList.stream().mapToDouble(f -> f.getPaid()).sum();
        return Map.of(
            "students", students.count(),
            "teachers", teachers.count(),
            "classes",  classes.count(),
            "attendanceRate", rate,
            "totalFees", total,
            "totalCollected", paid,
            "outstanding", total - paid
        );
    }
}
