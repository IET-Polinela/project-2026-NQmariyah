from rest_framework import viewsets, permissions
from .models import Report
from .serializers import ReportSerializer
from .permissions import *
from django.db.models import Q


class ReportViewSet(viewsets.ModelViewSet):
    #queryset = Report.objects.all()
    serializer_class = ReportSerializer

    def get_queryset(self):
        user = self.request.user 

        # if user.is_authenticated:
        #     return Report.objects.exclude(status='DRAFT')

        return Report.objects.filter(
            ~Q(status='DRAFT') | Q(status='DRAFT', reporter=user) 
        )

    def get_permissions(self):
        #if self.action in ['update', 'partial_update', 'destroy']:
        #    return [permissions.IsAuthenticated(), IsOwnerAndDraftOrReadOnly()]
        return [permissions.IsAuthenticated(), IsOwnerAndDraftOrReadOnly()]

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)




