from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import date


class SignupSchema(BaseModel):
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    password: str = Field(..., min_length=8)

    @validator("password")
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return v


class SigninSchema(BaseModel):
    email: EmailStr
    password: str


class OTPSchema(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=4, max_length=6)


class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"

class RoleSchema(BaseModel):
    name: str

class EmailSchema(BaseModel):
    email: EmailStr


# --- Department Schemas ---

class DepartmentBase(BaseModel):
    name: str = Field(..., example="Finance")

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    name: Optional[str]

class DepartmentOut(DepartmentBase):
    id: int
    class Config:
        orm_mode = True



# --- User Schemas ---

class UserBase(BaseModel):
    first_name: str = Field(..., example="John")
    last_name: str = Field(..., example="Doe")
    email: EmailStr = Field(..., example="john.doe@example.com")
    role_id: int = Field(..., example=2)
    department_id: int = Field(..., example=1)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, example="strongpassword123")

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[EmailStr]
    password: Optional[str]
    role_id: Optional[int]
    department_id: Optional[int]

class UserOut(UserBase):
    id: int
    class Config:
        orm_mode = True


# --- Employee Schemas ---

class EmployeeBase(BaseModel):
    user_id: int
    employee_code: str

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    employee_code: Optional[str]

class EmployeeOut(EmployeeBase):
    id: int
    class Config:
        orm_mode = True


# --- Attendance Schemas ---

class AttendanceBase(BaseModel):
    employee_id: int
    date: date
    status: str

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceUpdate(BaseModel):
    status: Optional[str]

class AttendanceOut(AttendanceBase):
    id: int
    class Config:
        orm_mode = True


# --- LeaveRequest Schemas ---

class LeaveRequestBase(BaseModel):
    employee_id: int
    start_date: date
    end_date: date
    reason: str
    status: Optional[str] = "Pending"

class LeaveRequestCreate(LeaveRequestBase):
    pass

class LeaveRequestUpdate(BaseModel):
    start_date: Optional[date]
    end_date: Optional[date]
    reason: Optional[str]
    status: Optional[str]

class LeaveRequestOut(LeaveRequestBase):
    id: int
    class Config:
        orm_mode = True


# --- Salary Schemas ---

class SalaryBase(BaseModel):
    employee_id: int
    month: str
    amount: float

class SalaryCreate(SalaryBase):
    pass

class SalaryUpdate(BaseModel):
    month: Optional[str]
    amount: Optional[float]

class SalaryOut(SalaryBase):
    id: int
    class Config:
        orm_mode = True