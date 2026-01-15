from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Transaction
from .serializers import TransactionSerializer

# Create your views here.


class TransactionListCreateView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all().order_by('-created_at')
    serializer_class = TransactionSerializer
    permission_classes = [permissions.AllowAny]  # change if needed


class TransactionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    lookup_field = 'id'
    permission_classes = [permissions.AllowAny]
