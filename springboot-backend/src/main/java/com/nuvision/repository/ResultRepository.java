package com.nuvision.repository;
import com.nuvision.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ResultRepository extends JpaRepository<Result, String> {
    List<Result> findByStudentId(String studentId);
    List<Result> findByClassName(String className);
}
