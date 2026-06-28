package com.nuvision.entity;
import jakarta.persistence.*;

@Entity @Table(name = "school_classes")
public class SchoolClass {
    @Id private String id;
    @Column(unique = true) private String name;
    private String classTeacher, room;
    private int students;
    @Column(length = 1000) private String subjects;

    public SchoolClass() {}
    public String getId() { return id; } public void setId(String v) { id = v; }
    public String getName() { return name; } public void setName(String v) { name = v; }
    public String getClassTeacher() { return classTeacher; } public void setClassTeacher(String v) { classTeacher = v; }
    public String getRoom() { return room; } public void setRoom(String v) { room = v; }
    public int getStudents() { return students; } public void setStudents(int v) { students = v; }
    public String getSubjects() { return subjects; } public void setSubjects(String v) { subjects = v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final SchoolClass c = new SchoolClass();
        public Builder id(String v)           { c.id = v; return this; }
        public Builder name(String v)         { c.name = v; return this; }
        public Builder classTeacher(String v) { c.classTeacher = v; return this; }
        public Builder room(String v)         { c.room = v; return this; }
        public Builder students(int v)        { c.students = v; return this; }
        public Builder subjects(String v)     { c.subjects = v; return this; }
        public SchoolClass build() { return c; }
    }
}
