from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/logout/', views.logout_user, name='logout'),
    path('auth/me/', views.current_user, name='current_user'),
    path('auth/profile/', views.update_profile, name='update_profile'),

    # Categories
    path('categories/', views.category_list, name='category_list'),

    # Products
    path('products/', views.product_list, name='product_list'),
    path('products/<int:pk>/', views.product_detail, name='product_detail'),

    # Cart
    path('cart/', views.cart_detail, name='cart_detail'),
    path('cart/add/', views.cart_add, name='cart_add'),
    path('cart/update/<int:item_id>/', views.cart_update, name='cart_update'),
    path('cart/remove/<int:item_id>/', views.cart_remove, name='cart_remove'),
    path('cart/clear/', views.cart_clear, name='cart_clear'),

    # Wishlist
    path('wishlist/', views.wishlist_detail, name='wishlist_detail'),
    path('wishlist/add/', views.wishlist_add, name='wishlist_add'),
    path('wishlist/remove/<int:item_id>/', views.wishlist_remove, name='wishlist_remove'),

    # Orders
    path('orders/', views.order_list, name='order_list'),
    path('orders/create/', views.create_order, name='create_order'),
    path('orders/<int:pk>/', views.order_detail, name='order_detail'),

    # Contact
    path('contact/', views.contact_submit, name='contact_submit'),

    # Newsletter
    path('newsletter/', views.newsletter_subscribe, name='newsletter_subscribe'),
]
