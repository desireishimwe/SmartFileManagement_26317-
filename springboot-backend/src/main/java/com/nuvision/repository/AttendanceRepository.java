package com.nuvision.repository;
import com.nuvision.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface AttendanceRepository extends JpaRepository<AttendanceRecord, String> {
    List<AttendanceRecord> findByStudentId(String studentId);
    List<AttendanceRecord> findByClassName(String className);
    List<AttendanceRecord> findByDate(String date);
}
