from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import Category, Product, Cart, CartItem, Wishlist, WishlistItem, Order, OrderItem, Contact, Newsletter
from .serializers import (
    UserSerializer, RegisterSerializer, ProfileSerializer, CategorySerializer, ProductSerializer,
    CartSerializer, WishlistSerializer, OrderSerializer, CreateOrderSerializer,
    ContactSerializer, NewsletterSerializer
)


# --- Auth ---

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    if email and not username:
        try:
            user_obj = User.objects.get(email=email)
            username = user_obj.username
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        return Response(UserSerializer(user).data)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def logout_user(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})


@api_view(['GET'])
def current_user(request):
    if request.user.is_authenticated:
        return Response(UserSerializer(request.user).data)
    return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_profile(request):
    if request.method == 'GET':
        return Response(UserSerializer(request.user).data)
    serializer = ProfileSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- Products ---

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def product_list(request):
    products = Product.objects.all()
    category = request.query_params.get('category')
    search = request.query_params.get('search')
    min_price = request.query_params.get('min_price')
    max_price = request.query_params.get('max_price')
    sort = request.query_params.get('sort')

    if category and category != 'all':
        products = products.filter(category__slug=category)
    if search:
        products = products.filter(name__icontains=search)
    if min_price:
        products = products.filter(price__gte=min_price)
    if max_price:
        products = products.filter(price__lte=max_price)
    if sort == 'price_low':
        products = products.order_by('price')
    elif sort == 'price_high':
        products = products.order_by('-price')
    elif sort == 'rating':
        products = products.order_by('-rating')
    elif sort == 'newest':
        products = products.order_by('-created_at')

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = ProductSerializer(product)
    return Response(serializer.data)


# --- Cart ---

def get_or_create_cart(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
    else:
        session_id = request.session.session_key
        if not session_id:
            request.session.save()
            session_id = request.session.session_key
        cart, _ = Cart.objects.get_or_create(session_id=session_id)
    return cart


@api_view(['GET'])
def cart_detail(request):
    cart = get_or_create_cart(request)
    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(['POST'])
def cart_add(request):
    cart = get_or_create_cart(request)
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)
    color = request.data.get('color', '')

    try:
        product = Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    existing = CartItem.objects.filter(cart=cart, product=product).first()
    if existing:
        existing.quantity += int(quantity)
        existing.save()
    else:
        CartItem.objects.create(cart=cart, product=product, quantity=quantity, color=color)

    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(['PATCH'])
def cart_update(request, item_id):
    cart = get_or_create_cart(request)
    try:
        item = CartItem.objects.get(id=item_id, cart=cart)
    except CartItem.DoesNotExist:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

    quantity = request.data.get('quantity')
    if quantity is not None:
        item.quantity = int(quantity)
        item.save()

    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(['DELETE'])
def cart_remove(request, item_id):
    cart = get_or_create_cart(request)
    CartItem.objects.filter(id=item_id, cart=cart).delete()
    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(['DELETE'])
def cart_clear(request):
    cart = get_or_create_cart(request)
    cart.items.all().delete()
    serializer = CartSerializer(cart)
    return Response(serializer.data)


# --- Wishlist ---

def get_or_create_wishlist(request):
    if request.user.is_authenticated:
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
    else:
        session_id = request.session.session_key
        if not session_id:
            request.session.save()
            session_id = request.session.session_key
        wishlist, _ = Wishlist.objects.get_or_create(session_id=session_id)
    return wishlist


@api_view(['GET'])
def wishlist_detail(request):
    wishlist = get_or_create_wishlist(request)
    serializer = WishlistSerializer(wishlist)
    return Response(serializer.data)


@api_view(['POST'])
def wishlist_add(request):
    wishlist = get_or_create_wishlist(request)
    product_id = request.data.get('product_id')

    try:
        product = Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    _, created = WishlistItem.objects.get_or_create(wishlist=wishlist, product=product)
    serializer = WishlistSerializer(wishlist)
    return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


@api_view(['DELETE'])
def wishlist_remove(request, item_id):
    wishlist = get_or_create_wishlist(request)
    WishlistItem.objects.filter(id=item_id, wishlist=wishlist).delete()
    serializer = WishlistSerializer(wishlist)
    return Response(serializer.data)


# --- Orders ---

@api_view(['POST'])
def create_order(request):
    serializer = CreateOrderSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    cart = get_or_create_cart(request)
    cart_items = cart.items.all()
    if not cart_items.exists():
        return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

    subtotal = sum(float(item.product.price) * item.quantity for item in cart_items)
    coupon = serializer.validated_data.get('coupon_code', '')
    discount = subtotal * 0.1 if coupon == 'LUMINA10' else 0
    discounted_subtotal = subtotal - discount
    shipping = 0 if discounted_subtotal >= 1499 else 99
    tax = discounted_subtotal * 0.18
    total = discounted_subtotal + shipping + tax

    order = Order.objects.create(
        user=request.user if request.user.is_authenticated else None,
        session_id=request.session.session_key,
        full_name=serializer.validated_data['full_name'],
        email=serializer.validated_data['email'],
        phone=serializer.validated_data['phone'],
        address=serializer.validated_data['address'],
        city=serializer.validated_data['city'],
        state=serializer.validated_data['state'],
        zip_code=serializer.validated_data['zip_code'],
        notes=serializer.validated_data.get('notes', ''),
        subtotal=subtotal,
        shipping=shipping,
        tax=tax,
        discount=discount,
        total=total,
        coupon_code=coupon if coupon else '',
    )

    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            product_name=item.product.name,
            price=item.product.price,
            quantity=item.quantity,
            color=item.color,
        )

    cart.items.all().delete()

    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def order_list(request):
    if request.user.is_authenticated:
        orders = Order.objects.filter(user=request.user)
    else:
        session_id = request.session.session_key
        orders = Order.objects.filter(session_id=session_id) if session_id else Order.objects.none()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def order_detail(request, pk):
    try:
        if request.user.is_authenticated:
            order = Order.objects.get(pk=pk, user=request.user)
        else:
            order = Order.objects.get(pk=pk, session_id=request.session.session_key)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = OrderSerializer(order)
    return Response(serializer.data)


# --- Contact ---

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def contact_submit(request):
    serializer = ContactSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Message sent successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- Newsletter ---

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def newsletter_subscribe(request):
    serializer = NewsletterSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        existing = Newsletter.objects.filter(email=email).first()
        if existing:
            if not existing.subscribed:
                existing.subscribed = True
                existing.save()
            return Response({'message': 'Already subscribed'})
        serializer.save()
        return Response({'message': 'Subscribed successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
