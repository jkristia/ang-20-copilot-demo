#!/usr/bin/env python3
"""
Generate mock employee data for the ng-table demo.
Creates 1000 employee records with realistic data and detailed personal info.

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


class EmployeeDetailRecord(TypedDict):
    employee_id: int
    date_of_birth: str
    gender: str
    marital_status: str
    dependents: int
    nationality: str
    ssn: str
    street_address: str
    city: str
    state: str
    postal_code: str
    country: str
    home_phone: str
    mobile_phone: str
    work_phone: str
    work_extension: str
    emergency_contact_name: str
    emergency_contact_phone: str
    emergency_contact_relationship: str
    bank_name: str
    bank_account: str
    routing_number: str
    tax_id: str
    drivers_license: str
    drivers_license_state: str
    blood_type: str
    medical_conditions: str
    allergies: str
    dietary_restrictions: str
    shirt_size: str
    notes: str


# Configuration
OUTPUT_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'server', 'data')
OUTPUT_FILE: str = os.path.join(OUTPUT_DIR, 'employees.csv')
OUTPUT_DETAILS_FILE: str = os.path.join(OUTPUT_DIR, 'employee_details.csv')
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

# Data pools for employee details
GENDERS: list[str] = ['Male', 'Female', 'Non-binary', 'Prefer not to say']
MARITAL_STATUSES: list[str] = ['Single', 'Married', 'Divorced', 'Widowed', 'Domestic Partnership']
NATIONALITIES: list[str] = ['American', 'Canadian', 'British', 'Mexican', 'Indian', 'Chinese', 'German', 'French', 'Brazilian', 'Japanese']
BLOOD_TYPES: list[str] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
SHIRT_SIZES: list[str] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
RELATIONSHIPS: list[str] = ['Spouse', 'Parent', 'Sibling', 'Friend', 'Partner', 'Child']
BANKS: list[str] = ['Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'US Bank', 'PNC', 'Capital One', 'TD Bank']
MEDICAL_CONDITIONS: list[str] = ['None', 'None', 'None', 'None', 'Diabetes', 'Hypertension', 'Asthma', 'Heart Condition', 'None']
ALLERGIES: list[str] = ['None', 'None', 'None', 'Peanuts', 'Shellfish', 'Penicillin', 'Latex', 'Bee Stings', 'None', 'None']
DIETARY_RESTRICTIONS: list[str] = ['None', 'None', 'None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Kosher', 'Halal', 'None', 'None']

STREET_NAMES: list[str] = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm St', 'Park Ave', 'Lake Blvd', 'River Rd', 'Hill St',
    'Forest Way', 'Meadow Ln', 'Valley Dr', 'Sunset Blvd', 'Ocean Ave', 'Mountain Rd', 'Spring St', 'Garden Way', 'Church St', 'School Rd']

STATES: dict[str, list[str]] = {
    'New York': ['NY'],
    'San Francisco': ['CA'],
    'Chicago': ['IL'],
    'Austin': ['TX'],
    'Seattle': ['WA'],
    'Boston': ['MA'],
    'Denver': ['CO'],
    'Los Angeles': ['CA'],
    'Miami': ['FL'],
    'Atlanta': ['GA']
}

STATE_CODES: dict[str, str] = {
    'New York': 'NY', 'San Francisco': 'CA', 'Chicago': 'IL', 'Austin': 'TX',
    'Seattle': 'WA', 'Boston': 'MA', 'Denver': 'CO', 'Los Angeles': 'CA',
    'Miami': 'FL', 'Atlanta': 'GA'
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


def generate_phone() -> str:
    """Generate a random US phone number."""
    return f"({random.randint(200, 999)}) {random.randint(200, 999)}-{random.randint(1000, 9999)}"


def generate_masked_ssn() -> str:
    """Generate a masked SSN (XXX-XX-1234)."""
    return f"XXX-XX-{random.randint(1000, 9999)}"


def generate_masked_account() -> str:
    """Generate a masked bank account number."""
    return f"****{random.randint(1000, 9999)}"


def generate_masked_routing() -> str:
    """Generate a masked routing number."""
    return f"***{random.randint(100000, 999999)}"


def generate_dob(hire_date: str) -> str:
    """Generate a date of birth that makes the employee 22-65 years old at hire."""
    hire = datetime.strptime(hire_date, '%Y-%m-%d')
    age_at_hire = random.randint(22, 65)
    birth_year = hire.year - age_at_hire
    birth_month = random.randint(1, 12)
    birth_day = random.randint(1, 28)
    return f"{birth_year}-{birth_month:02d}-{birth_day:02d}"


def generate_employee_detail(employee_id: int, first_name: str, last_name: str, 
                             location: str, hire_date: str) -> EmployeeDetailRecord:
    """Generate detailed personal information for an employee."""
    state_code = STATE_CODES.get(location, 'NY')
    emergency_first = random.choice(FIRST_NAMES)
    emergency_last = random.choice(LAST_NAMES)
    
    return {
        'employee_id': employee_id,
        'date_of_birth': generate_dob(hire_date),
        'gender': random.choice(GENDERS),
        'marital_status': random.choice(MARITAL_STATUSES),
        'dependents': random.choices([0, 0, 0, 1, 1, 2, 2, 3, 4], k=1)[0],
        'nationality': random.choice(NATIONALITIES),
        'ssn': generate_masked_ssn(),
        'street_address': f"{random.randint(100, 9999)} {random.choice(STREET_NAMES)}",
        'city': location,
        'state': state_code,
        'postal_code': f"{random.randint(10000, 99999)}",
        'country': 'USA',
        'home_phone': generate_phone() if random.random() > 0.3 else '',
        'mobile_phone': generate_phone(),
        'work_phone': generate_phone(),
        'work_extension': str(random.randint(100, 9999)) if random.random() > 0.5 else '',
        'emergency_contact_name': f"{emergency_first} {emergency_last}",
        'emergency_contact_phone': generate_phone(),
        'emergency_contact_relationship': random.choice(RELATIONSHIPS),
        'bank_name': random.choice(BANKS),
        'bank_account': generate_masked_account(),
        'routing_number': generate_masked_routing(),
        'tax_id': generate_masked_ssn(),
        'drivers_license': f"{state_code}{random.randint(1000000, 9999999)}",
        'drivers_license_state': state_code,
        'blood_type': random.choice(BLOOD_TYPES),
        'medical_conditions': random.choice(MEDICAL_CONDITIONS),
        'allergies': random.choice(ALLERGIES),
        'dietary_restrictions': random.choice(DIETARY_RESTRICTIONS),
        'shirt_size': random.choice(SHIRT_SIZES),
        'notes': '' if random.random() > 0.1 else f"Employee note #{employee_id}"
    }


def generate_employees() -> tuple[list[EmployeeRecord], list[EmployeeDetailRecord]]:
    """Generate all employee records and their details."""
    rows: list[EmployeeRecord] = []
    details: list[EmployeeDetailRecord] = []
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

    # Second pass: assign managers and generate details
    for row in rows:
        dept: str = row['department']
        if dept in managers and managers[dept]:
            potential_managers: list[int] = [m for m in managers[dept] if m != row['id']]
            if potential_managers:
                row['manager_id'] = random.choice(potential_managers)
        
        # Generate detail record for this employee
        detail = generate_employee_detail(
            row['id'], row['first_name'], row['last_name'],
            row['location'], row['hire_date']
        )
        details.append(detail)

    return rows, details


def write_employees_csv(rows: list[EmployeeRecord]) -> None:
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


def write_details_csv(details: list[EmployeeDetailRecord]) -> None:
    """Write employee detail records to CSV file."""
    fieldnames = [
        'employee_id', 'date_of_birth', 'gender', 'marital_status', 'dependents',
        'nationality', 'ssn', 'street_address', 'city', 'state', 'postal_code', 'country',
        'home_phone', 'mobile_phone', 'work_phone', 'work_extension',
        'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship',
        'bank_name', 'bank_account', 'routing_number', 'tax_id',
        'drivers_license', 'drivers_license_state', 'blood_type',
        'medical_conditions', 'allergies', 'dietary_restrictions', 'shirt_size', 'notes'
    ]

    with open(OUTPUT_DETAILS_FILE, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(details)


def main() -> None:
    """Main entry point."""
    print(f"Generating {NUM_EMPLOYEES} employee records...")
    rows, details = generate_employees()
    write_employees_csv(rows)
    write_details_csv(details)
    print(f"Successfully wrote {len(rows)} records to {OUTPUT_FILE}")
    print(f"Successfully wrote {len(details)} detail records to {OUTPUT_DETAILS_FILE}")


if __name__ == '__main__':
    main()
