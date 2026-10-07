from django.contrib import admin
from django.utils.html import format_html, mark_safe
from django.urls import reverse
from .models import Category, Product, Cart, CartItem, Wishlist, WishlistItem, Order, OrderItem, Contact, Newsletter


admin.site.site_header = 'LUMINA Administration'
admin.site.site_title = 'LUMINA Admin'
admin.site.index_title = 'Dashboard — LUMINA'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'product_count', 'image_preview']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']
    readonly_fields = ['image_preview_large']

    def product_count(self, obj):
        count = obj.products.count()
        return format_html('<span style="color:#c8a97e;font-weight:600;">{}</span>', count)
    product_count.short_description = 'Products'

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height:50px;max-width:50px;border-radius:4px;object-fit:cover;" />',
                obj.image.url
            )
        return mark_safe('<span style="color:rgba(255,255,255,0.3);">No image</span>')
    image_preview.short_description = 'Image'

    def image_preview_large(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height:200px;max-width:200px;border-radius:8px;object-fit:cover;" />',
                obj.image.url
            )
        return mark_safe('<span style="color:rgba(255,255,255,0.3);">No image uploaded</span>')
    image_preview_large.short_description = 'Image Preview'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price_display', 'stock_status', 'badge_display', 'featured', 'image_preview', 'created_at']
    list_filter = ['category', 'featured', 'brand', 'badge']
    search_fields = ['name', 'brand', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['featured']
    list_per_page = 25
    readonly_fields = ['image_preview_large', 'discount_display']
    fieldsets = [
        ('Basic Info', {'fields': ['name', 'slug', 'category', 'brand', 'description']}),
        ('Pricing', {'fields': ['price', 'old_price', 'discount_display']}),
        ('Media', {'fields': ['image', 'image_preview_large', 'image_url', 'colors']}),
        ('Inventory & Badging', {'fields': ['stock', 'badge', 'featured', 'rating', 'reviews_count']}),
    ]

    def price_display(self, obj):
        if obj.old_price:
            return format_html(
                '<span style="color:#c8a97e;font-weight:700;">₹{}</span> '
                '<span style="color:rgba(255,255,255,0.4);text-decoration:line-through;font-size:12px;">₹{}</span>',
                obj.price, obj.old_price
            )
        return format_html('<span style="color:#c8a97e;font-weight:700;">₹{}</span>', obj.price)
    price_display.short_description = 'Price'

    def stock_status(self, obj):
        if obj.stock <= 0:
            return format_html('<span style="color:#e74c3c;font-weight:600;">Out of Stock</span>')
        if obj.stock <= 5:
            return format_html('<span style="color:#f39c12;font-weight:600;">{} left</span>', obj.stock)
        return format_html('<span style="color:#2ecc71;font-weight:600;">{} in stock</span>', obj.stock)
    stock_status.short_description = 'Stock'

    def badge_display(self, obj):
        if obj.badge:
            colors = {
                'new': ('#c8a97e', '#0d0d0d'),
                'sale': ('#e74c3c', '#ffffff'),
                'best': ('#0d0d0d', '#c8a97e'),
            }
            bg, fg = colors.get(obj.badge.lower(), ('#c8a97e', '#0d0d0d'))
            return format_html(
                '<span style="background:{};color:{};padding:3px 10px;border-radius:4px;'
                'font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">'
                '{}</span>',
                bg, fg, obj.badge
            )
        return ''
    badge_display.short_description = 'Badge'

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height:50px;max-width:50px;border-radius:4px;object-fit:cover;" />',
                obj.image.url
            )
        return mark_safe('<span style="color:rgba(255,255,255,0.3);">No image</span>')
    image_preview.short_description = 'Image'

    def image_preview_large(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height:200px;max-width:200px;border-radius:8px;object-fit:cover;" />',
                obj.image.url
            )
        return mark_safe('<span style="color:rgba(255,255,255,0.3);">No image uploaded</span>')
    image_preview_large.short_description = 'Image Preview'

    def discount_display(self, obj):
        discount = obj.get_discount_percentage()
        if discount > 0:
            return format_html(
                '<span style="color:#2ecc71;font-weight:600;background:rgba(46,204,113,0.15);'
                'padding:3px 10px;border-radius:4px;">-{}%</span>',
                discount
            )
        return mark_safe('<span style="color:rgba(255,255,255,0.3);">No discount</span>')
    discount_display.short_description = 'Discount'


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'color']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'user_link', 'session_id', 'item_count', 'total_value', 'created_at']
    list_select_related = ['user']
    inlines = [CartItemInline]

    def user_link(self, obj):
        if obj.user:
            url = reverse('admin:auth_user_change', args=[obj.user.id])
            return format_html('<a href="{}">{}</a>', url, obj.user)
        return format_html('<span style="color:rgba(255,255,255,0.4);">Guest</span>')
    user_link.short_description = 'User'

    def item_count(self, obj):
        count = obj.items.count()
        return format_html('<span style="color:#c8a97e;font-weight:600;">{} item{}</span>', count, 's' if count != 1 else '')
    item_count.short_description = 'Items'

    def total_value(self, obj):
        total = sum(item.product.price * item.quantity for item in obj.items.all() if item.product)
        return format_html('<span style="color:#c8a97e;font-weight:700;">₹{}</span>', total)
    total_value.short_description = 'Total'


class WishlistItemInline(admin.TabularInline):
    model = WishlistItem
    extra = 0
    readonly_fields = ['product']


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['id', 'user_link', 'session_id', 'item_count', 'created_at']
    list_select_related = ['user']
    inlines = [WishlistItemInline]

    def user_link(self, obj):
        if obj.user:
            url = reverse('admin:auth_user_change', args=[obj.user.id])
            return format_html('<a href="{}">{}</a>', url, obj.user)
        return format_html('<span style="color:rgba(255,255,255,0.4);">Guest</span>')
    user_link.short_description = 'User'

    def item_count(self, obj):
        count = obj.items.count()
        return format_html('<span style="color:#c8a97e;font-weight:600;">{} item{}</span>', count, 's' if count != 1 else '')
    item_count.short_description = 'Items'


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name', 'price', 'quantity', 'color']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'email', 'total_display', 'status_badge', 'created_at']
    list_filter = ['status', 'created_at', 'state']
    search_fields = ['full_name', 'email', 'id']
    list_per_page = 25
    inlines = [OrderItemInline]
    readonly_fields = ['subtotal', 'shipping', 'tax', 'discount', 'total', 'coupon_code', 'created_at']
    fieldsets = [
        ('Customer Info', {'fields': ['full_name', 'email', 'phone']}),
        ('Shipping Address', {'fields': ['address', 'city', 'state', 'zip_code', 'notes']}),
        ('Order Summary', {'fields': ['subtotal', 'shipping', 'tax', 'discount', 'coupon_code', 'total']}),
        ('Status', {'fields': ['status', 'created_at']}),
    ]

    def total_display(self, obj):
        return format_html('<span style="color:#c8a97e;font-weight:700;">₹{}</span>', obj.total)
    total_display.short_description = 'Total'

    def status_badge(self, obj):
        status_colors = {
            'pending': ('rgba(243,156,18,0.15)', '#f39c12'),
            'confirmed': ('rgba(52,152,219,0.15)', '#3498db'),
            'shipped': ('rgba(200,169,126,0.15)', '#c8a97e'),
            'delivered': ('rgba(46,204,113,0.15)', '#2ecc71'),
            'cancelled': ('rgba(231,76,60,0.15)', '#e74c3c'),
        }
        bg, color = status_colors.get(obj.status, ('rgba(255,255,255,0.05)', 'rgba(255,255,255,0.5)'))
        label = dict(Order.STATUS_CHOICES).get(obj.status, obj.status)
        return format_html(
            '<span style="background:{};color:{};padding:4px 12px;border-radius:20px;'
            'font-size:12px;font-weight:600;">{}</span>',
            bg, color, label
        )
    status_badge.short_description = 'Status'


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'read_status', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['name', 'email', 'phone', 'subject', 'message', 'created_at']
    fieldsets = [
        ('Contact Info', {'fields': ['name', 'email', 'phone']}),
        ('Message', {'fields': ['subject', 'message']}),
        ('Status', {'fields': ['is_read', 'created_at']}),
    ]

    def read_status(self, obj):
        if obj.is_read:
            return format_html(
                '<span style="color:#2ecc71;font-weight:600;">'
                '<i class="fas fa-check-circle" style="margin-right:4px;"></i> Read</span>'
            )
        return format_html(
            '<span style="color:#f39c12;font-weight:600;">'
            '<i class="fas fa-envelope" style="margin-right:4px;"></i> Unread</span>'
        )
    read_status.short_description = 'Status'


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ['email', 'subscribed_status', 'created_at']
    list_filter = ['subscribed']
    search_fields = ['email']
    list_editable = []

    def subscribed_status(self, obj):
        if obj.subscribed:
            return format_html('<span style="color:#2ecc71;font-weight:600;">Active</span>')
        return format_html('<span style="color:rgba(255,255,255,0.4);">Unsubscribed</span>')
    subscribed_status.short_description = 'Status'
