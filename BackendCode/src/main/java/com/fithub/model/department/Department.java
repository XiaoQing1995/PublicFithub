package com.fithub.model.department;

import java.util.HashSet;
import java.util.Set;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fithub.model.employee.Employee;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity 
@Table(name="department")
public class Department {

	@Id @Column(name="DEPTID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer deptid;
	private String deptname;
	
	
	@OneToMany(mappedBy = "department")
	@JsonBackReference
	private Set<Employee> employee = new HashSet<Employee>();
	

}
