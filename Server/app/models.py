from sqlalchemy import Column, Date, DateTime, Integer, String, Boolean, Float, ForeignKey, Table, Text
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone
from .db import Base


# Association table
user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('role_id', Integer, ForeignKey('roles.id'), primary_key=True)
)

class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    users = relationship('User', secondary=user_roles, back_populates='roles')

    def __repr__(self):
        return f'<Role {self.name}>'

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    roles = relationship('Role', secondary=user_roles, back_populates='users')
    confirmed = Column(Boolean, default=False)
    otp = Column(String(6), nullable=True)
    otp_generated_at = Column(String, nullable=True)
    file_name = Column(String(500), nullable=True)
    
    employee = relationship("Employee", back_populates="user")
    department_id = Column(Integer, ForeignKey('departments.id'))
    def __repr__(self):
        return f'<User {self.email}>'

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def has_role(self, role_name):
        return any(role.name == role_name for role in self.roles)

    def serialize(self, static_url: str = "/static"):
        image_url = None
        if self.file_name:
            image_url = f"{static_url}/images/{self.file_name.split('/')[-1]}"
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'roles': [role.name for role in self.roles],
            'confirmed': self.confirmed,
            'image_url': image_url
        }



class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    employees = relationship("Employee", back_populates="department")

    def __repr__(self):
        return f'<Department {self.name}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name
        }



class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    phone = Column(String, unique=True)
    address = Column(String)
    joining_date = Column(Date, default=datetime.now)
    user_id = Column(Integer, ForeignKey("users.id"))
    department_id = Column(Integer, ForeignKey("departments.id"))

    user = relationship("User", back_populates="employee")
    department = relationship("Department", back_populates="employees")
    attendances = relationship("Attendance", back_populates="employee")
    leave_requests = relationship("LeaveRequest", back_populates="employee")
    salaries = relationship("Salary", back_populates="employee")

    def __repr__(self):
        return f'<Employee {self.full_name}>'
    
    def serialize(self, static_url: str = "/static"):   
        image_url = None
        if self.user.file_name:
            image_url = f"{static_url}/images/{self.user.file_name.split('/')[-1]}"
        return {
            'id': self.id,
            'full_name': self.full_name,
            'phone': self.phone,
            'address': self.address,
            'joining_date': self.joining_date,
            'department_id': self.department_id,
            'user_id': self.user_id,
            'image_url': image_url
        }

class Attendance(Base):
    __tablename__ = "attendances"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=datetime.now)
    check_in = Column(DateTime)
    check_out = Column(DateTime)
    status = Column(String, default="Present")  # Present, Absent, Leave
    employee_id = Column(Integer, ForeignKey("employees.id"))

    employee = relationship("Employee", back_populates="attendances")
    def __repr__(self):
        return f'<Attendance {self.id} for Employee {self.employee_id}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'date': self.date,
            'check_in': self.check_in,
            'check_out': self.check_out,
            'status': self.status
        }

class LeaveRequest(Base):
    __tablename__ = "leave_requests"
    id = Column(Integer, primary_key=True, index=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    reason = Column(Text)
    status = Column(String, default="Pending")  # Pending, Approved, Rejected
    employee_id = Column(Integer, ForeignKey("employees.id"))

    employee = relationship("Employee", back_populates="leave_requests")

    def __repr__(self):
        return f'<LeaveRequest {self.id} for Employee {self.employee_id}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'reason': self.reason,
            'status': self.status
        }
    

class Salary(Base):
    __tablename__ = "salaries"
    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, nullable=False)  # e.g. 'May 2025'
    amount = Column(Float, nullable=False)
    paid = Column(Boolean, default=False)
    employee_id = Column(Integer, ForeignKey("employees.id"))

    employee = relationship("Employee", back_populates="salaries")

    def __repr__(self):
        return f'<Salary {self.month} for Employee {self.employee_id}>'
    def serialize(self):
        return {
            'id': self.id,
            'month': self.month,
            'amount': self.amount,
            'paid': self.paid
        }
    def serialize_with_employee(self):
        return {
            'id': self.id,
            'month': self.month,
            'amount': self.amount,
            'paid': self.paid,
            'employee': {
                'id': self.employee.id,
                'full_name': self.employee.full_name
            }
        }