from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp, Receive, Scope, Send
from app.utils.base_logger import BaseLogger

app_logger = BaseLogger(logger_name="AppInitialization").get_logger()

EXEMPT_CSRF_ROUTES = {
    "login",
    "auth.add_role_endpoint",
    "static",
    "auth.resend",
    "auth.verify",
    "reset_password",
    "auth.verify_password_otp",
    "auth.add_user",
    "auth.forgot_password_otp_send",
    "auth.resend_reset_password_otp",
}

class SecurityHeaders(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        # Helper to get full endpoint name (module + function)
        def get_full_name(func):
            return f"{func.__module__}.{func.__name__}"

        endpoint = request.scope.get("endpoint")
        endpoint_full_name = None
        if endpoint:
            endpoint_full_name = get_full_name(endpoint)

        app_logger.debug(f"Request Endpoint full name: {endpoint_full_name}")

        # Check CSRF token except for exempt routes
        if endpoint_full_name not in EXEMPT_CSRF_ROUTES:
            if request.method in ["POST", "PUT", "DELETE"]:
                token = request.headers.get("X-CSRFToken")
                csrf_token_from_cookie = request.cookies.get("csrf_token")

                app_logger.debug(f"Request CSRF token: {token}")
                app_logger.debug(f"Cookies CSRF token: {csrf_token_from_cookie}")

                if not token or token != csrf_token_from_cookie:
                    app_logger.warning("CSRF token mismatch or missing")
                    return JSONResponse(status_code=403, content={"error": "Forbidden - invalid CSRF token"})

        # Proceed with request
        response = await call_next(request)

        # Add security headers to the response
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Permitted-Cross-Domain-Policies"] = "all"
        response.headers["X-Content-Type-Options"] = "nosniff"
        app_logger.info("Security headers added to response.")

        return response