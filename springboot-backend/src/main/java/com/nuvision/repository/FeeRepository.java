package com.nuvision.repository;
import com.nuvision.entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface FeeRepository extends JpaRepository<Fee, String> {
    List<Fee> findByStudentId(String studentId);
    Optional<Fee> findFirstByStudentId(String studentId);
}
