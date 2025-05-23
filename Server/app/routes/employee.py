from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List

from app.db import get_db  # your session dependency
from app.services.employeeservice import (
     EmployeeService
)
from app.utils.jwt_utils import get_tokens_for_user
from app.services.userservice import UserService

from app.schemas import (
    EmployeeCreate, EmployeeUpdate, EmployeeOut,UserCreate
)

employee_router = APIRouter(prefix="/employee", tags=["Employees"])


@employee_router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(
    data: UserCreate,
    db: Session = Depends(get_db),
):
    fixed_user_type_id = 4  # fixed role ID 'Employee'
    fixed_department_id = 1  # fixed department ID 'HR'
    # Check if user already exists
    existing_user = UserService.get_user_by_email(db, data['email'])
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user with fixed role id
    user = UserService.create_user(
        db,
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        password=data.password,
        role_id=fixed_user_type_id, # assuming create_user accepts this
        department_id=fixed_department_id
    )

    if not user:
        raise HTTPException(status_code=500, detail="Failed to create user")

    token = get_tokens_for_user(user)

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"token": token, "msg": "Registration Successful"}
    )

@employee_router.get("/employees/{emp_id}", response_model=EmployeeOut)
def get_employee(emp_id: int, db: Session = Depends(get_db)):
    emp = EmployeeService.get_employee_by_id(db, emp_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp

@employee_router.get("/employees/", response_model=List[EmployeeOut])
def list_employees(db: Session = Depends(get_db)):
    return db.query(EmployeeService.model).all()

@employee_router.put("/employees/{emp_id}", response_model=EmployeeOut)
def update_employee(emp_id: int, emp_update: EmployeeUpdate, db: Session = Depends(get_db)):
    updated = EmployeeService.update_employee(db, emp_id, **emp_update.dict(exclude_none=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Employee not found or update failed")
    return updated

@employee_router.delete("/employees/{emp_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(emp_id: int, db: Session = Depends(get_db)):
    deleted = EmployeeService.delete_employee(db, emp_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Employee not found or delete failed")
