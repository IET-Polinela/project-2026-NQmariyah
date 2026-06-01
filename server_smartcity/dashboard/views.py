from django.views.generic import TemplateView
from django.views import View
from django.http import JsonResponse
from main_app.models import Report
from django.db.models import Count

# 1. View untuk menampilkan halaman dashboard
class DashboardView(TemplateView):
    template_name = 'dashboard/dashboard.html'

# 2. View untuk API data (untuk Chart.js)
class DashboardDataView(View):
    def get(self, request, *args, **kwargs):
        # Data Status
        status_stats = Report.objects.values('status').annotate(total=Count('status'))
        
        # Data Kategori
        category_stats = Report.objects.values('category').annotate(total=Count('category'))
        
        reported_list = Report.objects.filter(status='REPORTED').order_by('-id')[:5]
        resolved_list = Report.objects.filter(status='RESOLVED').order_by('-id')[:5]
        
        data = {
            'status': {
                'labels': [item['status'] for item in status_stats],
                'counts': [item['total'] for item in status_stats],
            },
            'category': {
                'labels': [item['category'] for item in category_stats],
                'counts': [item['total'] for item in category_stats],
            },
            'reported_latest': [{'title': r.title, 'loc': r.location} for r in reported_list],
            'resolved_latest': [{'title': r.title, 'loc': r.location} for r in resolved_list],
        }
        return JsonResponse(data)