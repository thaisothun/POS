from django.contrib.auth.decorators import user_passes_test
from django.core.exceptions import PermissionDenied

def in_groups(*group_names):
    """
    Checks if a user belongs to any of the specified group names.
    """
    def check_user(user):
        # Allow superusers to bypass the check entirely
        if user.is_superuser:
            return True
            
        # Ensure the user is authenticated and matches any of the group names
        if user.is_authenticated:
            if user.groups.filter(name__in=group_names).exists():
                return True
            else:
                raise PermissionDenied    

        raise PermissionDenied
        
    return user_passes_test(check_user)