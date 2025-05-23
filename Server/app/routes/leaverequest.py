from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db import get_db  # your session dependency
from app.services.LeaveRequestService import (
     LeaveRequestService)

from app.schemas import (
    LeaveRequestCreate,LeaveRequestUpdate, LeaveRequestOut,
)

leaverequest_router = APIRouter(prefix="/leaverequest", tags=["Leave Requests"])


@leaverequest_router.post("/leave-requests/", response_model=LeaveRequestOut, status_code=status.HTTP_201_CREATED)
def create_leave_request(leave: LeaveRequestCreate, db: Session = Depends(get_db)):
    db_leave = LeaveRequestService.create_leave_request(db, leave.employee_id, leave.start_date, leave.end_date, leave.reason, leave.status)
    if not db_leave:
        raise HTTPException(status_code=400, detail="Leave request creation failed")
    return db_leave

@leaverequest_router.get("/leave-requests/{leave_id}", response_model=LeaveRequestOut)
def get_leave_request(leave_id: int, db: Session = Depends(get_db)):
    leave = LeaveRequestService.get_leave_request_by_id(db, leave_id)
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
    return leave

@leaverequest_router.get("/leave-requests/", response_model=List[LeaveRequestOut])
def list_leave_requests(db: Session = Depends(get_db)):
    return db.query(LeaveRequestService.model).all()

@leaverequest_router.put("/leave-requests/{leave_id}", response_model=LeaveRequestOut)
def update_leave_request(leave_id: int, leave_update: LeaveRequestUpdate, db: Session = Depends(get_db)):
    updated = LeaveRequestService.update_leave_request(db, leave_id, **leave_update.dict(exclude_none=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Leave request not found or update failed")
    return updated

@leaverequest_router.delete("/leave-requests/{leave_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_leave_request(leave_id: int, db: Session = Depends(get_db)):
    deleted = LeaveRequestService.delete_leave_request(db, leave_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Leave request not found or delete failed")

