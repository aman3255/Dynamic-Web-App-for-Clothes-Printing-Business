import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PackageOpen, ChevronLeft, Clock, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  designUrl?: string;
  notes?: string;
}

interface ShippingInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
  phone: string;
}

interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  shippingInfo: ShippingInfo;
  paymentIntentId: string;
}

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await api.getOrderById(id!);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  // Demo order for when API doesn't return data
  const demoOrder: Order = {
    id: id || '123456789',
    userId: 'user123',
    status: 'processing',
    total: 74.97,
    items: [
      {
        id: 'item1',
        productId: 'prod1',
        name: 'Custom T-Shirt',
        price: 24.99,
        quantity: 2,
        designUrl: 'https://images.pexels.com/photos/5699102/pexels-photo-5699102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        notes: 'Please print the design centered on the front'
      },
      {
        id: 'item2',
        productId: 'prod2',
        name: 'Custom Tote Bag',
        price: 19.99,
        quantity: 1,
        designUrl: 'https://images.pexels.com/photos/5699102/pexels-photo-5699102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        notes: 'Print on both sides of the bag'
      },
      {
        id: 'item3',
        productId: 'prod3',
        name: 'Custom Water Bottle',
        price: 5.00,
        quantity: 1,
        designUrl: 'https://images.pexels.com/photos/5699102/pexels-photo-5699102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      }
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    shippingInfo: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'USA',
      email: 'john@example.com',
      phone: '(123) 456-7890'
    },
    paymentIntentId: 'pi_123456789'
  };

  const displayOrder = order || demoOrder;
  const statusStep = displayOrder ? getStatusStep(displayOrder.status) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft size={20} />
        <span>Back to orders</span>
      </button>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order #{displayOrder.id.slice(0, 8)}</h1>
                    <p className="text-gray-600">Placed on {formatDate(displayOrder.createdAt)}</p>
                  </div>
                  <div>
                    <span className={`px-4 py-2 inline-flex items-center text-sm rounded-full font-medium 
                      ${displayOrder.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                        displayOrder.status === 'shipped' ? 'bg-purple-100 text-purple-800' : 
                        displayOrder.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                        displayOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {displayOrder.status === 'processing' ? <PackageOpen size={16} className="mr-1" /> :
                        displayOrder.status === 'shipped' ? <Truck size={16} className="mr-1" /> :
                        displayOrder.status === 'delivered' ? <CheckCircle size={16} className="mr-1" /> :
                        displayOrder.status === 'cancelled' ? <AlertCircle size={16} className="mr-1" /> :
                        <Clock size={16} className="mr-1" />}
                      <span className="capitalize">{displayOrder.status}</span>
                    </span>
                  </div>
                </div>

                {/* Order progress */}
                {statusStep !== -1 && (
                  <div className="mb-8">
                    <div className="relative">
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                        <div 
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600`}
                          style={{ width: `${Math.max((statusStep / 3) * 100, 25)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between -mt-2">
                        <div className={`text-center ${statusStep >= 0 ? 'text-blue-600' : 'text-gray-500'}`}>
                          <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center mb-1 ${statusStep >= 0 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                            1
                          </div>
                          <span className="text-xs">Order Placed</span>
                        </div>
                        <div className={`text-center ${statusStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                          <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center mb-1 ${statusStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                            2
                          </div>
                          <span className="text-xs">Processing</span>
                        </div>
                        <div className={`text-center ${statusStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                          <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center mb-1 ${statusStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                            3
                          </div>
                          <span className="text-xs">Shipped</span>
                        </div>
                        <div className={`text-center ${statusStep >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>
                          <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center mb-1 ${statusStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                            4
                          </div>
                          <span className="text-xs">Delivered</span>
                        </div>
                      </div>
                    </div>
                    {displayOrder.trackingNumber && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                          <span className="font-semibold">Tracking Number:</span> {displayOrder.trackingNumber}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Order items */}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {displayOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {item.designUrl && (
                                <div className="flex-shrink-0 h-10 w-10 mr-4">
                                  <img 
                                    className="h-10 w-10 rounded-md object-cover" 
                                    src={item.designUrl} 
                                    alt={item.name} 
                                  />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                {item.notes && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    <span className="font-medium">Note:</span> {item.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <Link to="/orders">
                <Button variant="outline">Back to Orders List</Button>
              </Link>
              <Link to="/products">
                <Button variant="primary">Continue Shopping</Button>
              </Link>
            </div>
          </div>

          <div>
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${displayOrder.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">$0.00</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${displayOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
              
              <div className="space-y-3 text-sm">
                <p className="font-medium text-gray-900">{displayOrder.shippingInfo.name}</p>
                <p className="text-gray-600">{displayOrder.shippingInfo.address}</p>
                <p className="text-gray-600">
                  {displayOrder.shippingInfo.city}, {displayOrder.shippingInfo.state} {displayOrder.shippingInfo.zip}
                </p>
                <p className="text-gray-600">{displayOrder.shippingInfo.country}</p>
                <div className="pt-3 border-t mt-3">
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {displayOrder.shippingInfo.email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span> {displayOrder.shippingInfo.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;