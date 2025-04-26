# Create a file named csrf_exempt_middleware.py in one of your Django apps

from django.middleware.csrf import CsrfViewMiddleware

class CustomCsrfExemptMiddleware(CsrfViewMiddleware):
    def process_view(self, request, callback, callback_args, callback_kwargs):
        # Exempt admin login URL from CSRF checks
        if request.path == '/admin/login/':
            return None
        return super().process_view(request, callback, callback_args, callback_kwargs)