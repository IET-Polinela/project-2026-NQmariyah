from rest_framework import permissions

class IsOwnerAndDraftOrReadOnly(permissions.BasePermission):
	def has_object_permission(self, request, view, obj):
		#print(f"{permissions.SAFE_METHODS}")

		#if request.method in permissions.SAFE_METHODS:
		#	return True

		return obj.reporter == request.user and obj.status == 'DRAFT'




		
