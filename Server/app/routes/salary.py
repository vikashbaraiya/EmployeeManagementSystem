from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db import get_db  # your session dependency
from app.services.salaryservice import (
     SalaryService
)

from app.schemas import (
    SalaryCreate, SalaryUpdate, SalaryOut,
)

salary_router = APIRouter(prefix="/salary", tags=["Salaries"])


@salary_router.post("/salaries/", response_model=SalaryOut, status_code=status.HTTP_201_CREATED)
def create_salary(salary: SalaryCreate, db: Session = Depends(get_db)):
    db_salary = SalaryService.create_salary(db, salary.employee_id, salary.month, salary.amount)
    if not db_salary:
        raise HTTPException(status_code=400, detail="Salary creation failed")
    return db_salary

@salary_router.get("/salaries/{salary_id}", response_model=SalaryOut)
def get_salary(salary_id: int, db: Session = Depends(get_db)):
    salary = SalaryService.get_salary_by_id(db, salary_id)
    if not salary:
        raise HTTPException(status_code=404, detail="Salary not found")
    return salary

@salary_router.get("/salaries/", response_model=List[SalaryOut])
def list_salaries(db: Session = Depends(get_db)):
    return db.query(SalaryService.model).all()

@salary_router.put("/salaries/{salary_id}", response_model=SalaryOut)
def update_salary(salary_id: int, salary_update: SalaryUpdate, db: Session = Depends(get_db)):
    updated = SalaryService.update_salary(db, salary_id, **salary_update.dict(exclude_none=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Salary not found or update failed")
    return updated

@salary_router.delete("/salaries/{salary_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_salary(salary_id: int, db: Session = Depends(get_db)):
    deleted = SalaryService.delete_salary(db, salary_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Salary not found or delete failed")
