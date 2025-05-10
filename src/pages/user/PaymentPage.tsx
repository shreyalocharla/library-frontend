import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Calendar, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserPayments, processPayment } from '../../services/userService';
import { fetchMockBorrowedBooks } from '../../services/bookService';
import { Payment } from '../../types/User';
import { BorrowedBook } from '../../types/Book';

const PaymentPage: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [overdueBooks, setOverdueBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal' | 'cash'>('credit_card');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [totalFine, setTotalFine] = useState(0);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          const [userPayments, borrowedBooks] = await Promise.all([
            fetchUserPayments(user.id),
            fetchMockBorrowedBooks()
          ]);
          
          setPayments(userPayments);
          
          const overdue = borrowedBooks.filter(book => book.isOverdue);
          setOverdueBooks(overdue);
          
          // Calculate total fine
          const total = overdue.reduce((sum, book) => sum + (book.fine || 0), 0);
          setTotalFine(total);
        }
      } catch (error) {
        console.error('Error loading payment data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setProcessing(true);
    
    try {
      const result = await processPayment(
        user.id,
        totalFine,
        paymentMethod,
        `Payment for ${overdueBooks.length} overdue books`
      );
      
      if (result.success) {
        setPaymentSuccess(true);
        
        // Update state to reflect payment
        setOverdueBooks([]);
        setTotalFine(0);
        
        // Add the new payment to the list
        const newPayment: Payment = {
          id: `payment_${Date.now()}`,
          userId: user.id,
          amount: totalFine,
          date: new Date().toISOString().split('T')[0],
          method: paymentMethod,
          status: 'completed',
          description: `Payment for ${overdueBooks.length} overdue books`
        };
        
        setPayments(prev => [newPayment, ...prev]);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <DollarSign className="mr-2 h-6 w-6 text-indigo-600" />
          Pay Library Dues
        </h1>
        <p className="text-gray-600 mt-1">
          Manage and pay any outstanding fines for overdue books.
        </p>
      </div>

      {paymentSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-green-800">Payment Successful!</h2>
              <p className="text-green-700 mt-1">
                Your payment of ${totalFine.toFixed(2)} has been processed successfully.
                Thank you for clearing your dues.
              </p>
              <button
                onClick={() => setPaymentSuccess(false)}
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Payments
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-4 bg-indigo-50 border-b border-indigo-100">
                <h2 className="text-lg font-semibold text-gray-800">Outstanding Dues</h2>
              </div>

              {overdueBooks.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No Outstanding Dues</h3>
                  <p className="mt-1 text-gray-500">
                    You have no overdue books or unpaid fines at this time.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {overdueBooks.map((book) => (
                    <div key={book.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-14 w-10 bg-gray-200 rounded overflow-hidden">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium text-gray-800">{book.title}</p>
                          <p className="text-sm text-gray-600">Due: {book.dueDate}</p>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="text-red-600 font-medium">
                            ${book.fine?.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Due:</span>
                      <span className="text-lg font-bold text-red-600">${totalFine.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {overdueBooks.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-indigo-50 border-b border-indigo-100">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-indigo-600" />
                    Payment Information
                  </h2>
                </div>
                <div className="p-6">
                  <form onSubmit={handlePaymentSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="credit_card"
                            checked={paymentMethod === 'credit_card'}
                            onChange={() => setPaymentMethod('credit_card')}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-gray-700">Credit Card</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            checked={paymentMethod === 'paypal'}
                            onChange={() => setPaymentMethod('paypal')}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-gray-700">PayPal</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={paymentMethod === 'cash'}
                            onChange={() => setPaymentMethod('cash')}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-gray-700">Pay at Library</span>
                        </label>
                      </div>
                    </div>

                    {paymentMethod === 'credit_card' && (
                      <>
                        <div className="mb-4">
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                            Card Holder
                          </label>
                          <input
                            type="text"
                            id="cardHolder"
                            name="cardHolder"
                            value={cardDetails.cardHolder}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              id="expiry"
                              name="expiry"
                              value={cardDetails.expiry}
                              onChange={handleInputChange}
                              placeholder="MM/YY"
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                              CVV
                            </label>
                            <input
                              type="text"
                              id="cvv"
                              name="cvv"
                              value={cardDetails.cvv}
                              onChange={handleInputChange}
                              placeholder="123"
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {paymentMethod === 'paypal' && (
                      <div className="mb-4 p-4 bg-blue-50 text-blue-800 rounded-md text-sm">
                        You'll be redirected to PayPal to complete your payment of ${totalFine.toFixed(2)}.
                      </div>
                    )}

                    {paymentMethod === 'cash' && (
                      <div className="mb-4 p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                        Please visit the library counter to pay your fine of ${totalFine.toFixed(2)} in cash.
                        Your account will be updated once payment is received.
                      </div>
                    )}

                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={processing || (paymentMethod === 'cash')}
                        className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        ${paymentMethod === 'cash' 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                      >
                        {processing ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing Payment...
                          </span>
                        ) : paymentMethod === 'cash' ? (
                          'Visit Library to Pay'
                        ) : (
                          `Pay $${totalFine.toFixed(2)}`
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-indigo-50 border-b border-indigo-100">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                  Payment History
                </h2>
              </div>

              {payments.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No payment history available.
                </div>
              ) : (
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {payments.map((payment) => (
                    <div key={payment.id} className="p-4">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-800">${payment.amount.toFixed(2)}</span>
                        <span className="text-sm text-gray-600">{payment.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{payment.description}</p>
                      <div className="mt-1 flex items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          payment.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          {payment.method === 'credit_card' 
                            ? 'Credit Card' 
                            : payment.method === 'paypal'
                            ? 'PayPal'
                            : 'Cash'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;