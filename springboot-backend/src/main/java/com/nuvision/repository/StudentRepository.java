package com.nuvision.repository;
import com.nuvision.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
public interface StudentRepository extends JpaRepository<Student, String> {
    List<Student> findByClassName(String className);
    List<Student> findByLevel(String level);
    @Query("SELECT s FROM Student s WHERE LOWER(s.firstName) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(s.lastName) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(s.email) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(s.id) LIKE LOWER(CONCAT('%',:q,'%'))")
    List<Student> search(String q);
}
