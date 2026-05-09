from django.urls import path
from .views import *

urlpatterns = [
    path('', HomeView.as_view(), name='home'),

    path('reports/', ReportListView.as_view(), name='report_list'),
    path('reports/<int:pk>/', ReportDetailView.as_view(), name='report_detail'),
    path('add/', ReportCreateView.as_view(), name='add_report'),
    path('update/<int:pk>/', ReportUpdateView.as_view(), name='update_report'),
    path('delete/<int:pk>/', ReportDeleteView.as_view(), name='delete_report'),

    path('status/<int:pk>/', ReportUpdateStatusView.as_view(), name='update_status'),
    #path('api/report/<int:report_id>/', report_detail_api, name='report_detail_api'),
    path('search/', report_search, name='report_search'),

    #path('add/', views.add_report, name='add_report'),
    #path('reports/', views.report_list, name='report_list'),
    #path('update/<int:id>/', views.update_report, name='update_report'),
    #path('delete/<int:id>/', views.delete_report, name='delete_report'),
]
