from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponseRedirect
from django.views.generic import TemplateView
from django.views.static import serve as static_serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('admin', lambda r: HttpResponseRedirect('/admin/')),
    path('api/', include('store.urls')),
]

for page in ['about', 'cart', 'checkout', 'contact', 'login', 'register', 'shop', 'wishlist', 'product', '404']:
    urlpatterns.append(
        path(f'{page}.html', TemplateView.as_view(template_name=f'{page}.html'))
    )

urlpatterns += [
    path('', TemplateView.as_view(template_name='index.html')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.BASE_DIR.parent)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [re_path(r'^(?!admin/|api/)(?P<path>.*)$', static_serve, {'document_root': settings.BASE_DIR.parent})]
