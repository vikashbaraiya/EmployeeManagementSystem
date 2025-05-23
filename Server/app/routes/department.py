from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db import get_db  # your session dependency
from app.services.departmentservice import (
     DepartmentService
)

from app.schemas import (
    DepartmentCreate, DepartmentUpdate, DepartmentOut,
)

department_router = APIRouter(prefix="/department", tags=["Departments"])


@department_router.post("/departments/", response_model=DepartmentOut, status_code=status.HTTP_201_CREATED)
def create_department(dept: DepartmentCreate, db: Session = Depends(get_db)):
    db_dept = DepartmentService.create_department(db, dept.name)
    if not db_dept:
        raise HTTPException(status_code=400, detail="Department creation failed")
    return db_dept

@department_router.get("/departments/{dept_id}", response_model=DepartmentOut)
def get_department(dept_id: int, db: Session = Depends(get_db)):
    dept = DepartmentService.get_department_by_id(db, dept_id)
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    return dept

@department_router.get("/departments/", response_model=List[DepartmentOut])
def list_departments(db: Session = Depends(get_db)):
    return db.query(DepartmentService.model).all()

@department_router.put("/departments/{dept_id}", response_model=DepartmentOut)
def update_department(dept_id: int, dept_update: DepartmentUpdate, db: Session = Depends(get_db)):
    updated = DepartmentService.update_department(db, dept_id, **dept_update.dict(exclude_none=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Department not found or update failed")
    return updated

@department_router.delete("/departments/{dept_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_department(dept_id: int, db: Session = Depends(get_db)):
    deleted = DepartmentService.delete_department(db, dept_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Department not found or delete failed")

