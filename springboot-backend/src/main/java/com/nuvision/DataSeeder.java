package com.nuvision;

import com.nuvision.entity.*;
import com.nuvision.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository users;
    private final StudentRepository students;
    private final TeacherRepository teachers;
    private final SchoolClassRepository classes;
    private final AttendanceRepository attendance;
    private final ResultRepository results;
    private final FeeRepository fees;
    private final PasswordEncoder encoder;

    public DataSeeder(UserRepository u, StudentRepository s, TeacherRepository t,
                      SchoolClassRepository c, AttendanceRepository a, ResultRepository r,
                      FeeRepository f, PasswordEncoder e) {
        users = u; students = s; teachers = t; classes = c;
        attendance = a; results = r; fees = f; encoder = e;
    }

    @Override
    public void run(String... args) {
        if (users.count() > 0) return; // already seeded

        // Classes
        classes.saveAll(List.of(
            SchoolClass.builder().id("CLS-10A").name("Grade 10A").classTeacher("Dr. Nora Ellis").room("B-201").students(34).subjects("[\"Mathematics\",\"Physics\",\"English\"]").build(),
            SchoolClass.builder().id("CLS-11B").name("Grade 11B").classTeacher("Marcus Lee").room("B-214").students(31).subjects("[\"Physics\",\"Chemistry\",\"History\"]").build(),
            SchoolClass.builder().id("CLS-9C").name("Grade 9C").classTeacher("Priya Shah").room("A-109").students(29).subjects("[\"English\",\"Biology\",\"Geography\"]").build(),
            SchoolClass.builder().id("CLS-12A").name("Grade 12A").classTeacher("Owen Brooks").room("C-301").students(27).subjects("[\"Calculus\",\"Economics\",\"Literature\"]").build()
        ));

        // Teachers
        teachers.saveAll(List.of(
            Teacher.builder().id("TCH-201").fullName("Dr. Nora Ellis").subject("Mathematics").qualification("PhD Mathematics").phone("+1 555 1101").email("nora.ellis@nuvision.edu").address("45 Faculty Row").build(),
            Teacher.builder().id("TCH-202").fullName("Marcus Lee").subject("Physics").qualification("MSc Physics").phone("+1 555 1102").email("marcus.lee@nuvision.edu").address("46 Faculty Row").build(),
            Teacher.builder().id("TCH-203").fullName("Priya Shah").subject("English").qualification("MA English").phone("+1 555 1103").email("priya.shah@nuvision.edu").address("47 Faculty Row").build(),
            Teacher.builder().id("TCH-204").fullName("Owen Brooks").subject("History").qualification("MA History").phone("+1 555 1104").email("owen.brooks@nuvision.edu").address("48 Faculty Row").build()
        ));

        // Students
        students.saveAll(List.of(
            Student.builder().id("STU-1001").firstName("Ava").lastName("Johnson").gender("Female").dateOfBirth("2009-03-14").enrollmentDate("2023-09-04").level("O Level").className("Grade 10A").parentName("Mia Johnson").parentPhone("+1 555 0142").address("219 Maple Street").email("ava.johnson@nuvision.edu").profilePhoto("https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=120&q=80").build(),
            Student.builder().id("STU-1002").firstName("Liam").lastName("Carter").gender("Male").dateOfBirth("2008-11-02").enrollmentDate("2022-09-05").level("A Level").combination("PCB").className("Grade 11B").parentName("Noah Carter").parentPhone("+1 555 0188").address("84 Cedar Avenue").email("liam.carter@nuvision.edu").profilePhoto("https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=120&q=80").build(),
            Student.builder().id("STU-1003").firstName("Sophia").lastName("Martinez").gender("Female").dateOfBirth("2010-06-22").enrollmentDate("2024-09-02").level("O Level").className("Grade 9C").parentName("Elena Martinez").parentPhone("+1 555 0190").address("542 Lake Road").email("sophia.martinez@nuvision.edu").profilePhoto("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80").build(),
            Student.builder().id("STU-1004").firstName("Ethan").lastName("Nguyen").gender("Male").dateOfBirth("2009-08-09").enrollmentDate("2023-09-04").level("O Level").className("Grade 10A").parentName("Linh Nguyen").parentPhone("+1 555 0155").address("17 Summit Lane").email("ethan.nguyen@nuvision.edu").profilePhoto("https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80").build(),
            Student.builder().id("STU-1005").firstName("Isabella").lastName("Brown").gender("Female").dateOfBirth("2008-01-30").enrollmentDate("2021-09-06").level("A Level").combination("MCB").className("Grade 12A").parentName("Henry Brown").parentPhone("+1 555 0120").address("301 Oak Circle").email("isabella.brown@nuvision.edu").profilePhoto("https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80").build()
        ));

        // Users
        String a123 = encoder.encode("admin123");
        String ac123 = encoder.encode("academic123");
        String f123 = encoder.encode("finance123");
        String t123 = encoder.encode("teacher123");
        String s123 = encoder.encode("student123");
        String p123 = encoder.encode("parent123");

        users.saveAll(List.of(
            User.builder().email("admin@nuvision.edu").name("Admin Office").role("admin").password(a123).build(),
            User.builder().email("grace.kimani@nuvision.edu").name("Dr. Grace Kimani").role("academic").password(ac123).build(),
            User.builder().email("samuel.osei@nuvision.edu").name("Mr. Samuel Osei").role("finance").password(f123).build(),
            User.builder().email("nora.ellis@nuvision.edu").name("Dr. Nora Ellis").role("teacher").password(t123).subject("Mathematics").className("Grade 10A").build(),
            User.builder().email("marcus.lee@nuvision.edu").name("Marcus Lee").role("teacher").password(t123).subject("Physics").className("Grade 11B").build(),
            User.builder().email("priya.shah@nuvision.edu").name("Priya Shah").role("teacher").password(t123).subject("English").className("Grade 9C").build(),
            User.builder().email("owen.brooks@nuvision.edu").name("Owen Brooks").role("teacher").password(t123).subject("History").className("Grade 12A").build(),
            User.builder().email("ava.johnson@nuvision.edu").name("Ava Johnson").role("student").password(s123).studentId("STU-1001").className("Grade 10A").build(),
            User.builder().email("liam.carter@nuvision.edu").name("Liam Carter").role("student").password(s123).studentId("STU-1002").className("Grade 11B").build(),
            User.builder().email("sophia.martinez@nuvision.edu").name("Sophia Martinez").role("student").password(s123).studentId("STU-1003").className("Grade 9C").build(),
            User.builder().email("ethan.nguyen@nuvision.edu").name("Ethan Nguyen").role("student").password(s123).studentId("STU-1004").className("Grade 10A").build(),
            User.builder().email("isabella.brown@nuvision.edu").name("Isabella Brown").role("student").password(s123).studentId("STU-1005").className("Grade 12A").build(),
            User.builder().email("mia.johnson@nuvision.edu").name("Mia Johnson").role("parent").password(p123).studentId("STU-1001").className("Grade 10A").build(),
            User.builder().email("noah.carter@nuvision.edu").name("Noah Carter").role("parent").password(p123).studentId("STU-1002").className("Grade 11B").build(),
            User.builder().email("elena.martinez@nuvision.edu").name("Elena Martinez").role("parent").password(p123).studentId("STU-1003").className("Grade 9C").build(),
            User.builder().email("linh.nguyen@nuvision.edu").name("Linh Nguyen").role("parent").password(p123).studentId("STU-1004").className("Grade 10A").build(),
            User.builder().email("henry.brown@nuvision.edu").name("Henry Brown").role("parent").password(p123).studentId("STU-1005").className("Grade 12A").build()
        ));

        // Attendance
        attendance.saveAll(List.of(
            AttendanceRecord.builder().id("ATT-1").date("2026-06-25").studentId("STU-1001").studentName("Ava Johnson").className("Grade 10A").status("Present").build(),
            AttendanceRecord.builder().id("ATT-2").date("2026-06-25").studentId("STU-1002").studentName("Liam Carter").className("Grade 11B").status("Absent").build(),
            AttendanceRecord.builder().id("ATT-3").date("2026-06-25").studentId("STU-1003").studentName("Sophia Martinez").className("Grade 9C").status("Present").build(),
            AttendanceRecord.builder().id("ATT-4").date("2026-06-25").studentId("STU-1004").studentName("Ethan Nguyen").className("Grade 10A").status("Present").build()
        ));

        // Results
        results.saveAll(List.of(
            Result.builder().studentId("STU-1001").studentName("Ava Johnson").className("Grade 10A").subject("Mathematics").marks(92).gpa(3.8).build(),
            Result.builder().studentId("STU-1001").studentName("Ava Johnson").className("Grade 10A").subject("Physics").marks(88).gpa(3.5).build(),
            Result.builder().studentId("STU-1001").studentName("Ava Johnson").className("Grade 10A").subject("English").marks(95).gpa(4.0).build(),
            Result.builder().studentId("STU-1002").studentName("Liam Carter").className("Grade 11B").subject("Physics").marks(84).gpa(3.3).build(),
            Result.builder().studentId("STU-1002").studentName("Liam Carter").className("Grade 11B").subject("Chemistry").marks(76).gpa(2.9).build(),
            Result.builder().studentId("STU-1003").studentName("Sophia Martinez").className("Grade 9C").subject("English").marks(96).gpa(4.0).build(),
            Result.builder().studentId("STU-1003").studentName("Sophia Martinez").className("Grade 9C").subject("Biology").marks(89).gpa(3.6).build(),
            Result.builder().studentId("STU-1004").studentName("Ethan Nguyen").className("Grade 10A").subject("Mathematics").marks(77).gpa(3.0).build(),
            Result.builder().studentId("STU-1005").studentName("Isabella Brown").className("Grade 12A").subject("Calculus").marks(94).gpa(3.9).build(),
            Result.builder().studentId("STU-1005").studentName("Isabella Brown").className("Grade 12A").subject("Economics").marks(88).gpa(3.5).build()
        ));

        // Fees
        fees.saveAll(List.of(
            Fee.builder().id("FEE-1").studentId("STU-1001").studentName("Ava Johnson").className("Grade 10A").parentName("Mia Johnson").parentPhone("+1 555 0142").amount(2400).paid(1800).dueDate("2026-07-15").build(),
            Fee.builder().id("FEE-2").studentId("STU-1002").studentName("Liam Carter").className("Grade 11B").parentName("Noah Carter").parentPhone("+1 555 0188").amount(2600).paid(2600).dueDate("2026-07-15").build(),
            Fee.builder().id("FEE-3").studentId("STU-1003").studentName("Sophia Martinez").className("Grade 9C").parentName("Elena Martinez").parentPhone("+1 555 0190").amount(2200).paid(1200).dueDate("2026-07-20").build(),
            Fee.builder().id("FEE-4").studentId("STU-1004").studentName("Ethan Nguyen").className("Grade 10A").parentName("Linh Nguyen").parentPhone("+1 555 0155").amount(2400).paid(800).dueDate("2026-07-15").build(),
            Fee.builder().id("FEE-5").studentId("STU-1005").studentName("Isabella Brown").className("Grade 12A").parentName("Henry Brown").parentPhone("+1 555 0120").amount(2800).paid(0).dueDate("2026-07-20").build()
        ));

        System.out.println("\n✅ Database seeded successfully!");
        System.out.println("   Admin:    admin@nuvision.edu / admin123");
        System.out.println("   Parent:   mia.johnson@nuvision.edu / parent123\n");
    }
}
