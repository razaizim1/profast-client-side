import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router';
import useAxiosSecure from '../../../hook/useAxiosSecure';
import useAuth from '../../../hook/useAuth';
import Swal from 'sweetalert2';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { parcelId } = useParams();
    const [error, setError] = useState('');
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: parcelInfo = {}, isLoading } = useQuery({
        queryKey: ['parcels', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`);
            return res.data;
        }
    });
    console.log(parcelInfo);
    if (isLoading) return <p>Loading...</p>;
    const amount = parcelInfo.cost * 100; // Convert to cents for Stripe

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        const { error } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            setError(error.message);
        } else {
            setError('');

            // step-2: create payment intent
            const res = await axiosSecure.post('/create-payment-intent', {
                amount,
                parcelId
            })
            const clientSecret = res.data.clientSecret;

            // step-3: confirm payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user.displayName,
                        email: user.email
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else {
                setError('');
                if (result.paymentIntent.status === 'succeeded') {
                    console.log('Payment succeeded!');
                    console.log(result);
                    const paymentData = {
                        parcelId,
                        userEmail: user.email,
                        amount,
                        paymentMethod: result.paymentIntent.payment_method_types,
                        transactionId: result.paymentIntent.id,
                    };
                    const res = await axiosSecure.post('/payments', paymentData);
                    console.log(res.data);
                    if (res.data.success) {
                        Swal.fire('Success', 'Payment successful!', 'success');
                    } else {
                        Swal.fire('Warning', 'Payment succeeded but failed to record history.', 'warning');
                    }
                }
            }


        }

    };

    const CARD_ELEMENT_OPTIONS = {
        style: {
            base: {
                fontSize: '16px',
                color: '#32325d',
                '::placeholder': {
                    color: '#aab7c4',
                },
                padding: '10px 12px',
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        },
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-lg p-6 bg-white rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">Make Payment</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="border border-gray-300 p-4 rounded-md">
                        <CardElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                    <button
                        type="submit"
                        disabled={!stripe}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
                    >
                        Pay ${parcelInfo.cost}
                    </button>
                </form>
                {error && (
                    <div className="mt-4 text-red-600">
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </div>

    );
};

export default PaymentForm;
