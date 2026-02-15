#!/usr/bin/env python3
"""
Generate mock employee data for the ng-table demo.
Creates 1000 employee records with realistic data.

Usage:
    python3 scripts/generate_employees.py
"""

import csv
import random
import os
from datetime import datetime, timedelta
from typing import TypedDict, Union

# Type definitions
class EmployeeRecord(TypedDict):
    id: int
    first_name: str
    last_name: str
    email: str
    department: str
    job_title: str
    hire_date: str
    salary: int
    status: str
    location: str
    manager_id: Union[int, str]  # int when assigned, '' when empty
    performance_rating: int


# Configuration
OUTPUT_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'server', 'data')
OUTPUT_FILE: str = os.path.join(OUTPUT_DIR, 'employees.csv')
NUM_EMPLOYEES: int = 1000

# Data pools
FIRST_NAMES: list[str] = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
    'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
    'Christopher', 'Lisa', 'Daniel', 'Nancy', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra',
    'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
    'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa', 'Timothy', 'Deborah'
]

LAST_NAMES: list[str] = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
]

DEPARTMENTS: list[str] = [
    'Engineering', 'Sales', 'Marketing', 'Human Resources', 'Finance',
    'Operations', 'Customer Support', 'Legal', 'Research', 'IT'
]

JOB_TITLES: dict[str, list[str]] = {
    'Engineering': ['Software Engineer', 'Senior Software Engineer', 'Staff Engineer', 'Engineering Manager', 'Tech Lead', 'DevOps Engineer', 'QA Engineer'],
    'Sales': ['Sales Representative', 'Senior Sales Rep', 'Account Executive', 'Sales Manager', 'Regional Director', 'Sales Analyst'],
    'Marketing': ['Marketing Coordinator', 'Marketing Manager', 'Content Strategist', 'SEO Specialist', 'Brand Manager', 'Digital Marketing Lead'],
    'Human Resources': ['HR Coordinator', 'HR Manager', 'Recruiter', 'HR Business Partner', 'Benefits Specialist', 'Training Manager'],
    'Finance': ['Financial Analyst', 'Senior Accountant', 'Finance Manager', 'Controller', 'Accounts Payable Specialist', 'Budget Analyst'],
    'Operations': ['Operations Coordinator', 'Operations Manager', 'Process Analyst', 'Supply Chain Manager', 'Logistics Specialist'],
    'Customer Support': ['Support Specialist', 'Senior Support Rep', 'Support Manager', 'Customer Success Manager', 'Technical Support Lead'],
    'Legal': ['Legal Counsel', 'Paralegal', 'Contract Specialist', 'Compliance Officer', 'Legal Assistant'],
    'Research': ['Research Analyst', 'Senior Researcher', 'Research Manager', 'Data Scientist', 'Research Associate'],
    'IT': ['IT Specialist', 'System Administrator', 'Network Engineer', 'IT Manager', 'Security Analyst', 'Help Desk Technician']
}

LOCATIONS: list[str] = ['New York', 'San Francisco', 'Chicago', 'Austin', 'Seattle', 'Boston', 'Denver', 'Los Angeles', 'Miami', 'Atlanta']

# 80% Active, 10% Inactive, 10% On Leave
STATUSES: list[str] = ['Active', 'Active', 'Active', 'Active', 'Active', 'Active', 'Active', 'Active', 'Inactive', 'On Leave']

BASE_SALARIES: dict[str, int] = {
    'Engineering': 95000,
    'Sales': 75000,
    'Marketing': 70000,
    'Human Resources': 65000,
    'Finance': 80000,
    'Operations': 60000,
    'Customer Support': 55000,
    'Legal': 90000,
    'Research': 85000,
    'IT': 75000
}


def generate_email(first: str, last: str, employee_id: int) -> str:
    """Generate a unique email address."""
    return f"{first.lower()}.{last.lower()}{employee_id}@company.com"


def generate_hire_date() -> str:
    """Generate a random hire date between 1 month and 10 years ago."""
    days_ago = random.randint(30, 3650)
    return (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d')


def generate_salary(department: str, title: str) -> int:
    """Generate a salary based on department and seniority."""
    base: int = BASE_SALARIES[department]
    is_senior: bool = any(keyword in title for keyword in ['Senior', 'Manager', 'Lead', 'Director', 'Staff'])
    multiplier: float = 1.15 if is_senior else 1.0
    return int(base * multiplier * random.uniform(0.9, 1.2))


def generate_employees() -> list[EmployeeRecord]:
    """Generate all employee records."""
    rows: list[EmployeeRecord] = []
    managers: dict[str, list[int]] = {}

    # First pass: create all employees
    for i in range(1, NUM_EMPLOYEES + 1):
        first: str = random.choice(FIRST_NAMES)
        last: str = random.choice(LAST_NAMES)
        dept: str = random.choice(DEPARTMENTS)
        title: str = random.choice(JOB_TITLES[dept])

        row: EmployeeRecord = {
            'id': i,
            'first_name': first,
            'last_name': last,
            'email': generate_email(first, last, i),
            'department': dept,
            'job_title': title,
            'hire_date': generate_hire_date(),
            'salary': generate_salary(dept, title),
            'status': random.choice(STATUSES),
            'location': random.choice(LOCATIONS),
            'manager_id': '',
            'performance_rating': random.randint(1, 5)
        }
        rows.append(row)

        # Track managers by department
        if any(keyword in title for keyword in ['Manager', 'Director', 'Lead']):
            if dept not in managers:
                managers[dept] = []
            managers[dept].append(i)

    # Second pass: assign managers
    for row in rows:
        dept: str = row['department']
        if dept in managers and managers[dept]:
            potential_managers: list[int] = [m for m in managers[dept] if m != row['id']]
            if potential_managers:
                row['manager_id'] = random.choice(potential_managers)

    return rows


def write_csv(rows: list[EmployeeRecord]) -> None:
    """Write employee records to CSV file."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    fieldnames = [
        'id', 'first_name', 'last_name', 'email', 'department',
        'job_title', 'hire_date', 'salary', 'status', 'location',
        'manager_id', 'performance_rating'
    ]

    with open(OUTPUT_FILE, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    """Main entry point."""
    print(f"Generating {NUM_EMPLOYEES} employee records...")
    rows: list[EmployeeRecord] = generate_employees()
    write_csv(rows)
    print(f"Successfully wrote {len(rows)} records to {OUTPUT_FILE}")


if __name__ == '__main__':
    main()
