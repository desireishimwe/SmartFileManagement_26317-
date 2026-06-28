package com.nuvision.repository;
import com.nuvision.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TeacherRepository extends JpaRepository<Teacher, String> {}
