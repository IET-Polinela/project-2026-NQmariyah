from django.contrib import messages
from django.views import View
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView, TemplateView
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse_lazy
from .forms import ReportForm
from .models import Report
from django.http import JsonResponse

def report_detail_api(request, report_id):
    # Ambil data laporan berdasarkan ID
    report = get_object_or_404(Report, id=report_id)
    
    # Bungkus data ke dalam dictionary (format JSON)
    data = {
        'id': report.id,
        'title': report.title,
        'location': report.location,
        'description': report.description,
        'status': report.status,
    }
    return JsonResponse(data)

def report_search(request):
    query = request.GET.get('q', '')
    reports = Report.objects.filter(title__icontains=query) # [cite: 404]
    results = []
    for r in reports:
        results.append({
            'id': r.id,
            'title': r.title,
            'location': r.location,
            'status': r.status,
        })
    return JsonResponse({'results': results})


class HomeView(TemplateView):
    template_name = 'main_app/home.html'

class ReportListView(ListView):
    model = Report
    template_name = 'main_app/report_list.html'
    context_object_name = 'reports'
    ordering = ['-created_at']


class ReportCreateView(CreateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/add_report.html'
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil ditambahkan!")
        return super().form_valid(form)

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.warning(request, "Silakan login terlebih dahulu.")
            return redirect('login')

        if not request.user.is_admin:
            messages.error(request, "Anda tidak memiliki hak akses.")
            return redirect('/')

        return super().dispatch(request, *args, **kwargs)


class ReportDetailView(DetailView):
    model = Report
    fields = ['title', 'category', 'description', 'location']
    template_name = 'main_app/add_report.html'
    success_url = reverse_lazy('report_list')


class ReportUpdateView(UpdateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/update_report.html'
    success_url = reverse_lazy('report_list')

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil diperbarui!")
        return super().form_valid(form)

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.warning(request, "Silakan login terlebih dahulu.")
            return redirect('login')

        if not request.user.is_admin:
            messages.error(request, "Anda tidak memiliki hak akses.")
            return redirect('/')

        return super().dispatch(request, *args, **kwargs)


class ReportDeleteView(DeleteView):
    model = Report
    template_name = 'main_app/delete_report.html'
    success_url = reverse_lazy('report_list')

    def delete(self, request, *args, **kwargs):
        messages.success(self.request, "Laporan berhasil dihapus!")
        return super().delete(request, *args, **kwargs)

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.warning(request, "Silakan login terlebih dahulu.")
            return redirect('login')

        if not request.user.is_admin:
            messages.error(request, "Anda tidak memiliki hak akses.")
            return redirect('/')

        return super().dispatch(request, *args, **kwargs)


class ReportUpdateStatusView(View):
    def post(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        new_status = request.POST.get('status')

        report.status = new_status
        report.save()

        messages.success(request, "Status berhasil diperbarui!")

        return redirect('report_list')

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.warning(request, "Silakan login terlebih dahulu.")
            return redirect('login')

        if not request.user.is_admin:
            messages.error(request, "Anda tidak memiliki hak akses.")
            return redirect('/')

        return super().dispatch(request, *args, **kwargs)
