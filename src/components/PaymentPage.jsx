import React, { useState } from "react";
import { Container, Form, Button, Alert, Card, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "./PaymentPage.css";
 
const PaymentPage = ({ orderId, orderAmount = 0, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [formData, setFormData] = useState({
    cardNumber: "",
    cvv: "",
    expiry: "",
    cardHolderName: "",
    upiId: "",
    walletId: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });
 
  const handleMethodChange = (e) => {
    const { value } = e.target;
    setPaymentMethod(value);
    setFormData({
      cardNumber: "",
      cvv: "",
      expiry: "",
      cardHolderName: "",
      upiId: "",
      walletId: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
    });
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 
  const validate = () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return false;
    }
 
    const isCard = paymentMethod === "creditCard" || paymentMethod === "debitCard";
 
    if (isCard) {
      if (!formData.cardNumber || !/^\d{16}$/.test(formData.cardNumber)) {
        toast.error("Card number must be 16 digits.");
        return false;
      }
      if (!formData.cvv || !/^\d{3}$/.test(formData.cvv)) {
        toast.error("CVV must be 3 digits.");
        return false;
      }
      if (!formData.expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
        toast.error("Expiry date must be in MM/YY format (e.g. 05/25).");
        return false;
      }
      // Check if expiry date is insw the past
      const [expMonth, expYear] = formData.expiry.split('/');
      const now = new Date();
      const currentYear = now.getFullYear() % 100; // last two digits
      const currentMonth = now.getMonth() + 1; // 1-based
      const enteredMonth = parseInt(expMonth, 10);
      const enteredYear = parseInt(expYear, 10);
      if (
        enteredYear < currentYear ||
        (enteredYear === currentYear && enteredMonth < currentMonth)
      ) {
        toast.error("Card expiry date cannot be in the past.");
        return false;
      }
      if (!formData.cardHolderName || formData.cardHolderName.trim() === "") {
        toast.error("Card holder name is required.");
        return false;
      }
    }
 
    if (paymentMethod === "upi") {
      if (!formData.upiId || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/.test(formData.upiId)) {
        toast.error("Please enter a valid UPI ID (e.g. name@upi).");
        return false;
      }
    }
 
    if (paymentMethod === "wallet") {
      if (!formData.walletId || formData.walletId.trim() === "") {
        toast.error("Wallet ID is required.");
        return false;
      }
    }
 
    if (paymentMethod === "netbanking") {
      if (!formData.bankName || formData.bankName.trim() === "") {
        toast.error("Bank name is required.");
        return false;
      }
      if (!formData.accountNumber || !/^\d{9,18}$/.test(formData.accountNumber)) {
        toast.error("Account number must be between 9 and 18 digits.");
        return false;
      }
      if (!formData.ifscCode || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
        toast.error("IFSC code must be in correct format (e.g. HDFC0123456).");
        return false;
      }
    }
 
    if (paymentMethod === "cod" && orderAmount > 2000) {
      toast.error("COD is not allowed for orders over ₹2000.");
      return false;
    }
 
    return true;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
 
    const methodMap = {
      creditCard: "CREDIT_CARD",
      debitCard: "DEBIT_CARD",
      upi: "UPI",
      wallet: "WALLET",
      netbanking: "NET_BANKING",
      cod: "COD",
    };
 
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
   
    const orderRequestData = {
      orderId: orderId || Date.now(),
      userId: parseInt(userId),
      paymentMethod: methodMap[paymentMethod],
      amount: orderAmount,
      paymentDetails: {
        ...formData,
        ...(["creditCard", "debitCard"].includes(paymentMethod) && {
          expiry: formData.expiry.replace(/\s/g, "")
        })
      }
    };
 
    try {
      const orderResponse = await axios.post(
        "http://localhost:8070/api/v1/order/customer/place",
        orderRequestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
 
      if (orderResponse.status === 200 || orderResponse.status === 201) {
        toast.success("Order placed successfully!");
        if (onPaymentSuccess) onPaymentSuccess();
        window.location.href = '/success';
      } else {
        toast.error("Order placement failed. Please contact support.");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong.";
      toast.error(`Order placement failed: ${errorMessage}`);
    }
  };
 
  const paymentMethods = [
    { id: "creditCard", label: "Credit Card" },
    { id: "debitCard", label: "Debit Card" },
    { id: "upi", label: "UPI" },
    { id: "wallet", label: "Wallet" },
    { id: "netbanking", label: "Netbanking" },
    //{ id: "cod", label: "Cash On Delivery (COD)" },
  ];
 
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0">
            <Card.Header style={{
              background: 'linear-gradient(135deg, #E94B3C 0%, #FF6347 100%)',
              color: '#fff',
              padding: '1.5rem'
            }}>
              <h3 className="mb-0 text-center">Payment Details</h3>
              {orderAmount > 0 && (
                <h4 className="mb-0 text-center mt-2">Amount: ₹{orderAmount.toFixed(2)}</h4>
              )}
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                {paymentMethods.map(({ id, label }) => (
                  <div
                    key={id}
                    className={`payment-method-group mb-3 ${paymentMethod === id ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(id)}
                  >
                    <div className="payment-method-label-row">
                      <Form.Check
                        type="radio"
                        id={id}
                        name="paymentMethod"
                        value={id}
                        checked={paymentMethod === id}
                        onChange={handleMethodChange}
                        className="payment-method-radio"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label htmlFor={id} className="payment-method-label">{label}</label>
                    </div>
 
                    {paymentMethod === id && (
                      <div className="expandable-form">
                        {(id === "creditCard" || id === "debitCard") && (
                          <>
                            <Form.Group className="mb-3">
                              <Form.Label>Card Number</Form.Label>
                              <Form.Control
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                placeholder="1234 5678 9012 3456"
                                maxLength={16}
                                className="form-control-lg"
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Card Holder Name</Form.Label>
                              <Form.Control
                                name="cardHolderName"
                                value={formData.cardHolderName}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="form-control-lg"
                              />
                            </Form.Group>
                            <Row>
                              <Col md={8}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Expiry Date</Form.Label>
                                  <Form.Control
                                    name="expiry"
                                    value={formData.expiry}
                                    onChange={(e) => {
                                      let value = e.target.value.replace(/\D/g, '');
                                      if (value.length >= 2) {
                                        value = value.slice(0, 2) + '/' + value.slice(2);
                                      }
                                      setFormData(prev => ({...prev, expiry: value.slice(0, 5)}));
                                    }}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    className="form-control-lg"
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={4}>
                                <Form.Group className="mb-3">
                                  <Form.Label>CVV</Form.Label>
                                  <Form.Control
                                    type="password"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    placeholder="123"
                                    maxLength={3}
                                    className="form-control-lg"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </>
                        )}
 
                        {id === "upi" && (
                          <Form.Group className="mb-3">
                            <Form.Label>UPI ID</Form.Label>
                            <Form.Control
                              name="upiId"
                              value={formData.upiId}
                              onChange={handleChange}
                              placeholder="yourname@upi"
                              className="form-control-lg"
                            />
                          </Form.Group>
                        )}
 
                        {id === "wallet" && (
                          <Form.Group className="mb-3">
                            <Form.Label>Wallet ID</Form.Label>
                            <Form.Control
                              name="walletId"
                              value={formData.walletId}
                              onChange={handleChange}
                              placeholder="Enter your wallet ID"
                              className="form-control-lg"
                            />
                          </Form.Group>
                        )}
 
                        {id === "netbanking" && (
                          <>
                            <Form.Group className="mb-3">
                              <Form.Label>Bank Name</Form.Label>
                              <Form.Control
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                placeholder="Enter bank name"
                                className="form-control-lg"
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Account Number</Form.Label>
                              <Form.Control
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                placeholder="Enter account number"
                                className="form-control-lg"
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>IFSC Code</Form.Label>
                              <Form.Control
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={handleChange}
                                placeholder="Enter IFSC code"
                                className="form-control-lg"
                              />
                            </Form.Group>
                          </>
                        )}
 
                        {id === "cod" && orderAmount > 2000 && (
                          <Alert variant="warning">
                            COD is not allowed for orders over ₹2000
                          </Alert>
                        )}
                      </div>
                    )}
                  </div>
                ))}
 
                <Button
                  type="submit"
                  size="lg"
                  className="w-100 mt-4 pay-btn"
                  style={{
                    backgroundColor: '#E94B3C',
                    borderColor: '#E94B3C'
                  }}
                  disabled={!paymentMethod || (paymentMethod === "cod" && orderAmount > 2000)}
                >
                  {`Pay `}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ToastContainer position="top-center" />
    </Container>
  );
};
 
export default PaymentPage;
 