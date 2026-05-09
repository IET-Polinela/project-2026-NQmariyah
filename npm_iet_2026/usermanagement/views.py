from django.contrib.auth.views import LoginView
from django.contrib.auth.forms import AuthenticationForm
from django.views.generic import CreateView
from django.urls import reverse_lazy
from django.contrib import messages
from .forms import RegisterForm

class CustomLoginView(LoginView):
    template_name = 'auth/login.html'
    authentication_form = AuthenticationForm

    def get_form(self, form_class=None):
        form = super().get_form(form_class)

        form.fields['username'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Username'
        })

        form.fields['password'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Password'
        })

        return form


class RegisterView(CreateView):
    form_class = RegisterForm
    template_name = 'auth/register.html'
    success_url = reverse_lazy('login')

    def form_valid(self, form):
        user = form.save(commit=False)
        user.is_admin = False
        user.is_member = True
        user.save()

        messages.success(self.request, "Registrasi berhasil! Silakan login.")
        return super().form_valid(form)