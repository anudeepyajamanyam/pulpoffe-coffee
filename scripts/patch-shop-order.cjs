const fs = require('fs');
let code = fs.readFileSync('dist/shop.js', 'utf8');

// Replace alert in PIN code validation
const oldPinCheck = `  const pinVal = $('#chk-pincode')?.value.trim() || '';
  if (!/^\\d{6}$/.test(pinVal)) {
    alert('Please enter a valid 6-digit postal PIN Code (numbers only, e.g. 560001).');
    $('#chk-pincode')?.focus();
    return;
  }`;

const newPinCheck = `  const pinVal = $('#chk-pincode')?.value.trim() || '';
  if (!/^\\d{6}$/.test(pinVal)) {
    const fb = $('#checkout-feedback');
    if (fb) {
      fb.style.color = '#e57373';
      fb.textContent = 'Please enter a valid 6-digit postal PIN Code (e.g. 560001).';
    }
    $('#chk-pincode')?.focus();
    return;
  }`;

if (code.includes("alert('Please enter a valid 6-digit postal PIN Code")) {
  code = code.replace(oldPinCheck, newPinCheck);
}

// Replace alert on successful order with redirect
const oldSuccess = `        try {
          const orders = JSON.parse(localStorage.getItem('pulpoffe_orders_v1') || '[]');
          orders.unshift({
            orderId,
            ...orderPayload,
            paymentId: response.razorpay_payment_id || 'PAY_' + Date.now()
          });
          localStorage.setItem('pulpoffe_orders_v1', JSON.stringify(orders));
        } catch {}

        basket = {};
        persist();
        renderBasket();

        setTimeout(() => {
          closeChkModal();
          alert(\`Thank you for your order, \${orderPayload.customer.name}!\\n\\nOrder Ref: #\${orderId}\\nPayment ID: \${response.razorpay_payment_id || 'Verified'}\\n\\nWe will roast and dispatch your artisanal coffee from Kodagu directly to your doorstep.\`);
        }, 800);`;

const newSuccess = `        const fullOrder = {
          orderId,
          paymentId: response.razorpay_payment_id || 'pay_test_' + Date.now().toString(36),
          date: new Date().toISOString(),
          customer: orderPayload.customer,
          address: orderPayload.address,
          items: orderPayload.items,
          subtotal: orderPayload.subtotal,
          tax: orderPayload.tax,
          total: orderPayload.total
        };

        try {
          const orders = JSON.parse(localStorage.getItem('pulpoffe_orders_v1') || '[]');
          orders.unshift(fullOrder);
          localStorage.setItem('pulpoffe_orders_v1', JSON.stringify(orders));
          localStorage.setItem('pulpoffe_latest_order', JSON.stringify(fullOrder));
        } catch (e) {
          console.error(e);
        }

        basket = {};
        persist();
        renderBasket();

        setTimeout(() => {
          closeChkModal();
          window.location.href = 'order-confirmation.html?orderId=' + encodeURIComponent(orderId);
        }, 400);`;

if (code.includes(oldSuccess)) {
  code = code.replace(oldSuccess, newSuccess);
  console.log('Successfully replaced oldSuccess with order-confirmation redirect!');
} else {
  console.log('oldSuccess pattern not found directly, performing targeted regex replacement');
  // Fallback regex
  const regex = /try\s*\{\s*const orders = JSON\.parse\(localStorage\.getItem\('pulpoffe_orders_v1'\)[\s\S]*?alert\([\s\S]*?\);\s*\}, 800\);/;
  if (regex.test(code)) {
    code = code.replace(regex, newSuccess);
    console.log('Regex matched and replaced order completion handler!');
  } else {
    console.error('Could not locate order completion handler!');
  }
}

fs.writeFileSync('dist/shop.js', code, 'utf8');
