from uuid import uuid4
from django.db import models

# Create your models here.
class Transaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    text = models.CharField(max_length=200)
    category = models.CharField(max_length=50, default="Other")  # NEW field
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.text}: {self.amount}"
