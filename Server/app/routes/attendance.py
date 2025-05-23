from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db import get_db  # your session dependency
from app.services.Attendenceservice import (
     AttendanceService)

from app.schemas import (
    AttendanceCreate, AttendanceUpdate, AttendanceOut,
)

attendance_router = APIRouter(prefix="/attendance", tags=["Attendances"])


@attendance_router.post("/attendances/", response_model=AttendanceOut, status_code=status.HTTP_201_CREATED)
def create_attendance(att: AttendanceCreate, db: Session = Depends(get_db)):
    db_att = AttendanceService.create_attendance(db, att.employee_id, att.date, att.status)
    if not db_att:
        raise HTTPException(status_code=400, detail="Attendance creation failed")
    return db_att

@attendance_router.get("/attendances/{att_id}", response_model=AttendanceOut)
def get_attendance(att_id: int, db: Session = Depends(get_db)):
    att = AttendanceService.get_attendance_by_id(db, att_id)
    if not att:
        raise HTTPException(status_code=404, detail="Attendance not found")
    return att

@attendance_router.get("/attendances/", response_model=List[AttendanceOut])
def list_attendances(db: Session = Depends(get_db)):
    return db.query(AttendanceService.model).all()

@attendance_router.put("/attendances/{att_id}", response_model=AttendanceOut)
def update_attendance(att_id: int, att_update: AttendanceUpdate, db: Session = Depends(get_db)):
    updated = AttendanceService.update_attendance(db, att_id, **att_update.dict(exclude_none=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Attendance not found or update failed")
    return updated

@attendance_router.delete("/attendances/{att_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_attendance(att_id: int, db: Session = Depends(get_db)):
    deleted = AttendanceService.delete_attendance(db, att_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Attendance not found or delete failed")
