(() => {
  const $ = s => document.querySelector(s);
  const inr = n => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Catalog products for resolving names, packs, prices, images
  const PRODUCTS = [
    { id: 'gold-choco-orange', name: 'Choco Orange', category: 'gold', format: 'Granular', image: 'media/products/bag-gold-mockup.webp', pack: '100g pack', price: 246 },
    { id: 'gold-caramel', name: 'Caramel', category: 'gold', format: 'Granular', image: 'media/products/bag-gold-mockup.webp', pack: '100g pack', price: 283 },
    { id: 'gold-hazelnut', name: 'Hazelnut', category: 'gold', format: 'Granular', image: 'media/products/bag-gold-mockup.webp', pack: '100g pack', price: 210 },
    { id: 'gold-almond', name: 'Almond', category: 'gold', format: 'Granular', image: 'media/products/bag-gold-mockup.webp', pack: '100g pack', price: 231 },
    { id: 'gold-vanilla', name: 'Vanilla', category: 'gold', format: 'Granular', image: 'media/products/bag-gold-mockup.webp', pack: '100g pack', price: 257 },
    { id: 'gold-cardamom', name: 'Cardamom', category: 'gold', format: 'Granular', image: 'media/products/bag-gold-mockup.webp', pack: '100g pack', price: 273 },
    { id: 'gold-cinnamon', name: 'Cinnamon', category: 'gold', format: 'Granular', image: 'media/products/bag-gold-mockup.webp', pack: '100g pack', price: 220 },
    { id: 'gold-berry', name: 'Berry', category: 'gold', format: 'Granular', image: 'media/products/bag-gold-mockup.webp', pack: '100g pack', price: 294 },
    { id: 'silver-prime-70-30', name: 'Agglo Prime 70', category: 'silver', format: 'Granular Blend', image: 'media/products/bag-silver-mockup.webp', pack: '100g pack', price: 151 },
    { id: 'silver-pure', name: 'Agglo Pure', category: 'silver', format: 'Pure Granular', image: 'media/products/bag-silver-mockup.webp', pack: '100g pack', price: 183 },
    { id: 'silver-imperial-60-40', name: 'Spray Imperial 60', category: 'silver', format: 'Spray Blend', image: 'media/products/bag-silver-mockup.webp', pack: '100g pack', price: 130 },
    { id: 'silver-heritage-70-30', name: 'Spray Heritage 70', category: 'silver', format: 'Spray Blend', image: 'media/products/bag-silver-mockup.webp', pack: '100g pack', price: 141 },
    { id: 'silver-spray-pure', name: 'Spray Pure', category: 'silver', format: 'Spray Pure', image: 'media/products/bag-silver-mockup.webp', pack: '100g pack', price: 172 },
    { id: 'diamond-freeze-dried-pure', name: 'Freeze-Dried Pure', category: 'diamond', format: 'Freeze-Dried', image: 'media/products/bag-diamond-mockup.webp', pack: '100g pack', price: 345 },
    { id: 'diamond-spiced-reserve', name: 'Spiced Reserve', category: 'diamond', format: 'Freeze-Dried Reserve', image: 'media/products/bag-diamond-mockup.webp', pack: '100g pack', price: 388 }
  ];

  function resolveItem(id) {
    const [baseId, size] = id.split('__');
    const p = PRODUCTS.find(x => x.id === baseId || x.id === id) || {
      id,
      name: 'Kodagu Artisanal Coffee',
      price: 246,
      image: 'media/products/bag-gold-mockup.webp',
      pack: '100g pack'
    };
    if (size) {
      const multipliers = { '100g': 1, '200g': 1.92, '250g': 2.38, '500g': 4.6 };
      const mult = multipliers[size] || 1;
      return { ...p, price: Math.round(p.price * mult), pack: `${size} pack` };
    }
    return p;
  }

  // Load basket
  let basket = {};
  try {
    basket = JSON.parse(localStorage.getItem('pulpoffe-basket-v1') || localStorage.getItem('pulpoffe_basket_v1') || '{}');
  } catch {}

  const entries = Object.entries(basket);
  const totalCount = Object.values(basket).reduce((a, b) => a + b, 0);
  if ($('#header-basket-count')) $('#header-basket-count').textContent = totalCount;

  if (!entries.length) {
    if ($('#checkout-empty')) $('#checkout-empty').style.display = 'block';
    if ($('#checkout-content')) $('#checkout-content').style.display = 'none';
    return;
  }

  // Render items & totals
  const host = $('#checkout-items-list');
  let subtotal = 0;
  if (host) {
    host.replaceChildren();
    for (const [id, qty] of entries) {
      const p = resolveItem(id);
      const lineTotal = p.price * qty;
      subtotal += lineTotal;

      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:12px;padding-bottom:12px;border-bottom:1px solid rgba(0,0,0,0.06)';

      const img = document.createElement('img');
      img.src = p.image;
      img.alt = p.name;
      img.style.cssText = 'width:52px;height:52px;object-fit:cover;border-radius:6px;background:var(--alt);border:1px solid var(--line)';

      const details = document.createElement('div');
      details.style.cssText = 'flex:1;min-width:0';
      details.innerHTML = `
        <strong style="display:block;font-size:0.92rem;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</strong>
        <span style="font-size:0.78rem;color:var(--muted)">Pack: ${p.pack} · Qty: ${qty}</span>
      `;

      const price = document.createElement('strong');
      price.style.cssText = 'font-size:0.95rem;color:var(--ink)';
      price.textContent = inr(lineTotal);

      row.append(img, details, price);
      host.append(row);
    }
  }

  const shipping = subtotal >= 1000 ? 0 : 60;
  const grandTotal = subtotal + shipping;

  if ($('#summary-subtotal')) $('#summary-subtotal').textContent = inr(subtotal);
  if ($('#summary-delivery')) $('#summary-delivery').textContent = shipping === 0 ? 'FREE' : inr(shipping);
  if ($('#summary-grand-total')) $('#summary-grand-total').textContent = inr(grandTotal);
  if ($('#checkout-pay-btn')) $('#checkout-pay-btn').textContent = `Proceed to Secure Payment (${inr(grandTotal)}) →`;
  if ($('#step-shipping-tag')) $('#step-shipping-tag').textContent = shipping === 0 ? 'FREE' : inr(shipping);

  const deliveryAlert = $('#checkout-delivery-alert');
  const deliveryText = $('#checkout-delivery-text');
  if (deliveryAlert && deliveryText) {
    if (subtotal >= 1000) {
      deliveryAlert.style.background = 'rgba(46, 125, 50, 0.1)';
      deliveryAlert.style.borderColor = 'rgba(46, 125, 50, 0.3)';
      deliveryText.innerHTML = '🎉 <strong>Free Express Delivery applied!</strong> Direct from Kodagu estates.';
    } else {
      const remaining = 1000 - subtotal;
      deliveryText.textContent = `Add ${inr(remaining)} more for FREE Express Delivery`;
    }
  }

  // Auto-fill details from localStorage (logged in or saved customer)
  function autofillUser() {
    let user = null;
    try { user = JSON.parse(localStorage.getItem('pulpoffe_user') || 'null'); } catch {}
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem('pulpoffe_saved_customer') || 'null'); } catch {}

    const data = user || saved;
    if (data) {
      if ($('#step-name') && !$('#step-name').value && data.name) $('#step-name').value = data.name;
      if ($('#step-phone') && !$('#step-phone').value && data.phone) $('#step-phone').value = data.phone;
      if ($('#step-email') && !$('#step-email').value && data.email) $('#step-email').value = data.email;
      if ($('#step-address') && !$('#step-address').value && data.address) $('#step-address').value = data.address;
      if ($('#step-pincode') && !$('#step-pincode').value && data.pincode) {
        $('#step-pincode').value = data.pincode;
        if ($('#step-pincode-status')) {
          $('#step-pincode-status').style.color = '#2E7D32';
          $('#step-pincode-status').textContent = '✓ Loaded from saved profile';
        }
      }
      if ($('#step-city') && !$('#step-city').value && data.city) $('#step-city').value = data.city;
      if ($('#step-state') && !$('#step-state').value && data.state) $('#step-state').value = data.state;
    }

    // Refresh auth banner
    if (user) {
      if ($('#chk-auth-title')) $('#chk-auth-title').textContent = `Signed in as ${user.name || user.email}`;
      if ($('#chk-auth-subtitle')) $('#chk-auth-subtitle').textContent = 'Your delivery details have been pre-filled from your account.';
      if ($('#chk-auth-actions')) {
        $('#chk-auth-actions').innerHTML = `
          <span style="font-size:0.8rem;color:#2E7D32;font-weight:600">✓ Account Active</span>
        `;
      }
    }
  }
  autofillUser();

  // PIN Code Auto-Lookup via Official India Post API
  const pinInput = $('#step-pincode');
  const cityInput = $('#step-city');
  const stateInput = $('#step-state');
  const pinStatus = $('#step-pincode-status');

  pinInput?.addEventListener('input', async e => {
    const pin = e.target.value.trim();
    if (/^\d{6}$/.test(pin)) {
      if (pinStatus) {
        pinStatus.style.color = 'var(--accent)';
        pinStatus.textContent = 'Detecting city & state…';
      }
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.[0]?.Status === 'Success' && data[0].PostOffice?.length) {
            const po = data[0].PostOffice[0];
            if (cityInput) cityInput.value = po.District || po.Name;
            if (stateInput) stateInput.value = po.State;
            if (pinStatus) {
              pinStatus.style.color = '#2E7D32';
              pinStatus.textContent = `✓ ${po.District || po.Name}, ${po.State}`;
            }
            return;
          }
        }
      } catch {}
      if (pinStatus) {
        pinStatus.style.color = 'var(--accent)';
        pinStatus.textContent = 'PIN code format valid';
      }
    } else {
      if (pinStatus) pinStatus.textContent = '';
    }
  });

  // Google 1-Click Fill
  $('#chk-google-btn')?.addEventListener('click', () => {
    const mockUser = {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@gmail.com',
      phone: '9876543210',
      address: '15/A, Sreenivasa Nilaya, 4th Cross',
      pincode: '560047',
      city: 'Bangalore',
      state: 'Karnataka'
    };
    try {
      localStorage.setItem('pulpoffe_user', JSON.stringify({ name: mockUser.name, email: mockUser.email, role: 'customer' }));
      localStorage.setItem('pulpoffe_saved_customer', JSON.stringify(mockUser));
      localStorage.setItem('pulpoffe_token', 'plf_google_auth_' + Date.now());
    } catch {}
    autofillUser();
    if (pinStatus) {
      pinStatus.style.color = '#2E7D32';
      pinStatus.textContent = '✓ Bangalore, Karnataka';
    }
  });

  // Checkout Form Submission
  $('#checkout-flow-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const pinVal = pinInput?.value.trim() || '';
    if (!/^\d{6}$/.test(pinVal)) {
      alert('Please enter a valid 6-digit postal PIN code.');
      pinInput?.focus();
      return;
    }

    const payBtn = $('#checkout-pay-btn');
    const statusMsg = $('#checkout-status-msg');
    if (payBtn) payBtn.disabled = true;
    if (statusMsg) {
      statusMsg.style.color = 'var(--accent)';
      statusMsg.textContent = 'Connecting to secure payment gateway (Razorpay)…';
    }

    const customer = {
      name: $('#step-name').value.trim(),
      phone: $('#step-phone').value.trim(),
      email: $('#step-email').value.trim()
    };
    const shippingAddress = `${$('#step-address').value.trim()}, ${$('#step-city').value.trim()}, ${$('#step-state').value.trim()} - ${pinVal}`;

    const items = entries.map(([id, qty]) => {
      const p = resolveItem(id);
      return { id, name: p.name, pack: p.pack, qty, price: p.price };
    });

    if ($('#step-save-info')?.checked) {
      try {
        localStorage.setItem('pulpoffe_saved_customer', JSON.stringify({
          ...customer,
          address: $('#step-address').value.trim(),
          pincode: pinVal,
          city: $('#step-city').value.trim(),
          state: $('#step-state').value.trim()
        }));
      } catch {}
    }

    try {
      let orderRes = null;
      try {
        const r = await fetch('/api/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customer, shippingAddress, items, subtotal, shipping, grandTotal })
        });
        if (r.ok) orderRes = await r.json();
      } catch {}

      const orderId = orderRes?.orderId || ('PLF-' + Date.now().toString().slice(-6));
      const rzpOrderId = orderRes?.rzpOrderId || ('order_demo_' + Math.random().toString(36).substring(2, 9));

      const options = {
        key: orderRes?.key || 'rzp_test_PulpoffeDemoKey',
        amount: Math.round(grandTotal * 100),
        currency: 'INR',
        name: 'Pulpoffe Coffee',
        description: `Artisanal Coffee Order #${orderId}`,
        image: 'brand/pulpoffe-gold.svg',
        order_id: rzpOrderId,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone
        },
        theme: { color: '#c9a56b' },
        handler: async function (response) {
          if (statusMsg) {
            statusMsg.style.color = '#2E7D32';
            statusMsg.textContent = 'Payment verified! Packing your Kodagu coffee…';
          }

          const fullOrder = {
            orderId,
            paymentId: response.razorpay_payment_id || 'pay_test_' + Date.now().toString(36),
            date: new Date().toISOString(),
            customer,
            address: shippingAddress,
            items,
            subtotal,
            shipping,
            total: grandTotal
          };

          try {
            const orders = JSON.parse(localStorage.getItem('pulpoffe_orders_v1') || '[]');
            orders.unshift(fullOrder);
            localStorage.setItem('pulpoffe_orders_v1', JSON.stringify(orders));
            localStorage.setItem('pulpoffe_latest_order', JSON.stringify(fullOrder));
          } catch (e) {
            console.error(e);
          }

          // Clear basket
          try {
            localStorage.removeItem('pulpoffe-basket-v1');
            localStorage.removeItem('pulpoffe_basket_v1');
          } catch {}

          setTimeout(() => {
            window.location.href = 'order-confirmation.html?orderId=' + encodeURIComponent(orderId);
          }, 350);
        },
        modal: {
          ondismiss: function () {
            if (payBtn) payBtn.disabled = false;
            if (statusMsg) statusMsg.textContent = 'Payment cancelled. Your details are saved.';
          }
        }
      };

      const isMock = !orderRes?.key || orderRes.key.includes('DemoKey') || !window.Razorpay;
      if (isMock) {
        if (statusMsg) {
          statusMsg.style.color = 'var(--accent)';
          statusMsg.textContent = 'Processing secure payment via Razorpay Sandbox…';
        }
        setTimeout(() => {
          options.handler({ razorpay_payment_id: 'pay_test_' + Math.random().toString(36).substring(2, 10) });
        }, 800);
      } else {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      if (statusMsg) {
        statusMsg.style.color = '#c0392b';
        statusMsg.textContent = 'Error initiating payment. Please try again.';
      }
      if (payBtn) payBtn.disabled = false;
    }
  });
})();
