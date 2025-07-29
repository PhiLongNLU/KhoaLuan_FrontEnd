from fastapi import APIRouter, status, BackgroundTasks
from app.services.mail_service import send_email
from app.models.mail import EmailSchema
from app.core.response import Response

route = APIRouter(
    prefix="/mail",
    tags=["Mail"]
)

@route.post("/send-test-email", status_code=status.HTTP_200_OK, response_model=Response)
async def send_test_email(email: EmailSchema, background_tasks: BackgroundTasks):
    """
    An endpoint to send a test email.
    Using BackgroundTasks to send email without blocking the response.
    """
    background_tasks.add_task(
        send_email,
        subject=email.subject,
        recipients=email.recipients,
        body=email.body,
        html=email.html
    )
    return Response(message="Test email has been sent in the background.")