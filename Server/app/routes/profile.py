from fastapi import APIRouter, Request
from app.utils.helpers import UtilityHelper
from app.views.profileview import update_user_profile_image, update_user_profile, get_profile_data


profile_router = APIRouter(prefix="/profile", tags=["Auth"])


@profile_router.post('/update_profile_image')
def update_profile_image():
    """
    API endpoint to update user profile image.
    """
    return update_user_profile_image()


@profile_router.put('/update_profile')
def update_profile(request: Request):
    """
    API endpoint to update user profile.
    """
    data = UtilityHelper.clean_bleach(request.get_json())
    return update_user_profile(data)


@profile_router.get('/get_profile_details')
def get_profile():
    """
    API endpoint to retrieve user profile information.
    """
    return get_profile_data()
