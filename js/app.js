/**
 * Saf İncisi - Bir İnci Su
 * Rəsmi Veb-saytın Əsas JavaScript Modulu
 */

document.addEventListener('DOMContentLoaded', () => {
  // Sifariş üçün yalnız 1-ci nömrə (Tələb: sifaris metodu sadece 1 ci nomre ile olsun)
  const PRIMARY_ORDER_PHONE = '994773421414'; 
  
  // DOM elementləri
  const qtyInput = document.getElementById('waterQty');
  const btnQtyMinus = document.getElementById('btnQtyMinus');
  const btnQtyPlus = document.getElementById('btnQtyPlus');
  const presetPills = document.querySelectorAll('.preset-pill');
  const pumpCards = document.querySelectorAll('.pump-card');
  const customerName = document.getElementById('customerName');
  const customerAddress = document.getElementById('customerAddress');
  const customerNotes = document.getElementById('customerNotes');
  const waPreviewText = document.getElementById('waPreviewText');
  const waPreviewTime = document.getElementById('waPreviewTime');
  const btnSubmitOrder = document.getElementById('btnSubmitOrder');

  // Mobil menyu elementləri
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-nav a');

  // Sosial tablar
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.social-tab-content');

  // Toast bildiriş funksiyası
  const toastNotice = document.getElementById('toastNotice');
  let toastTimeout;

  function showToast(message) {
    if (!toastNotice) return;
    toastNotice.textContent = message;
    toastNotice.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 2800);
  }

  // Cari vaxtı təyin et (WhatsApp mesaj görünüşü üçün)
  function updatePreviewTime() {
    if (waPreviewTime) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      waPreviewTime.textContent = `${hours}:${mins}`;
    }
  }
  updatePreviewTime();

  // ============================================================
  // SİFARİŞ VƏ SAY İDARƏETMƏSİ
  // ============================================================
  function getSelectedPump() {
    const selectedRadio = document.querySelector('input[name="pumpGift"]:checked');
    if (!selectedRadio) return 'Elektronik Pompa (USB)';
    
    switch (selectedRadio.value) {
      case 'elektronik':
        return 'Elektronik Pompa (USB ilə şarjlı) 🎁';
      case 'manual':
        return 'Manual Pompa (Klassik mexaniki) 🎁';
      case 'none':
        return 'Tələb olunmur (Mövcud pompam var)';
      default:
        return 'Elektronik Pompa (USB ilə şarjlı) 🎁';
    }
  }

  function getOrderQuantity() {
    let val = parseInt(qtyInput.value, 10);
    if (isNaN(val) || val < 1) val = 1;
    return val;
  }

  function generateWhatsAppMessage() {
    const qty = getOrderQuantity();
    const pump = getSelectedPump();
    const name = customerName.value.trim();
    const address = customerAddress.value.trim();
    const notes = customerNotes.value.trim();

    let text = `Salam, "Saf İncisi" suyu sifariş etmək istəyirəm.\n\n`;
    text += `💧 Məhsul: 19 Litrlik Saf İncisi Su\n`;
    text += `🔢 Say: ${qty} ədəd\n`;
    text += `🎁 Hədiyyə Pompa: ${pump}\n`;

    if (name) {
      text += `👤 Müştəri: ${name}\n`;
    }
    if (address) {
      text += `📍 Çatdırılma Ünvanı: ${address}\n`;
    }
    if (notes) {
      text += `📝 Qeyd: ${notes}\n`;
    }

    text += `\nZəhmət olmasa sifarişi təsdiqləyin və çatdırılma vaxtını bildirin.`;
    text += `\n"Saf İncisi - Bir İnci Su"`;

    return text;
  }

  function refreshOrderPreview() {
    const rawMessage = generateWhatsAppMessage();
    if (waPreviewText) {
      waPreviewText.textContent = rawMessage;
    }
    
    // WhatsApp birbaşa keçid linki (YALNIZ 1-ci nömrə ilə)
    const encodedText = encodeURIComponent(rawMessage);
    const waUrl = `https://wa.me/${PRIMARY_ORDER_PHONE}?text=${encodedText}`;
    if (btnSubmitOrder) {
      btnSubmitOrder.href = waUrl;
    }

    // Preset pill aktivliyini yoxla
    const currentQty = getOrderQuantity();
    presetPills.forEach(pill => {
      const pillQty = parseInt(pill.getAttribute('data-qty'), 10);
      if (pillQty === currentQty) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  // Say artırma / azaltma
  if (btnQtyMinus) {
    btnQtyMinus.addEventListener('click', () => {
      let val = getOrderQuantity();
      if (val > 1) {
        qtyInput.value = val - 1;
        refreshOrderPreview();
      }
    });
  }

  if (btnQtyPlus) {
    btnQtyPlus.addEventListener('click', () => {
      let val = getOrderQuantity();
      qtyInput.value = val + 1;
      refreshOrderPreview();
    });
  }

  if (qtyInput) {
    qtyInput.addEventListener('input', () => {
      let val = parseInt(qtyInput.value, 10);
      if (val < 1 || isNaN(val)) {
        // İcazə verilir boşalsın, sonra düzəlsin
      }
      refreshOrderPreview();
    });

    qtyInput.addEventListener('change', () => {
      let val = parseInt(qtyInput.value, 10);
      if (isNaN(val) || val < 1) {
        qtyInput.value = 1;
      }
      refreshOrderPreview();
    });
  }

  // Hazır say seçimləri (1, 2, 3, 5, 10)
  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const qty = parseInt(pill.getAttribute('data-qty'), 10);
      qtyInput.value = qty;
      refreshOrderPreview();
    });
  });

  // Pompa seçimi kartları
  pumpCards.forEach(card => {
    card.addEventListener('click', () => {
      pumpCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
      }
      refreshOrderPreview();
    });
  });

  // Müştəri məlumatları sahələri dəyişdikdə mesajı dərhal yenilə
  [customerName, customerAddress, customerNotes].forEach(input => {
    if (input) {
      input.addEventListener('input', refreshOrderPreview);
    }
  });

  // Sifariş düyməsinə klik anında klik statistikası / hərəkəti
  if (btnSubmitOrder) {
    btnSubmitOrder.addEventListener('click', (e) => {
      // İstifadəçiyə rahat bildiriş göstər
      showToast('WhatsApp-a yönləndirilirsiniz...');
    });
  }

  // İlk render üçün yenilə
  refreshOrderPreview();

  // ============================================================
  // SOSİAL ŞƏBƏKƏ EMBED VƏ TABLAR (TIKTOK / INSTAGRAM)
  // ============================================================
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = document.getElementById(targetTab);
      if (activeContent) {
        activeContent.classList.add('active');
      }

      // TikTok embed skriptini ehtiyac olduqda yenidən yüklə/işə sal
      if (targetTab === 'tabTikTok' && window.tiktokEmbed) {
        try {
          window.tiktokEmbed.load();
        } catch (err) {
          console.log('TikTok embed load info:', err);
        }
      }
    });
  });

  // ============================================================
  // MOBİL MENYU DRAWER
  // ============================================================
  function toggleMobileMenu() {
    const isOpen = mobileDrawer.classList.contains('open');
    if (isOpen) {
      mobileDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('open');
      mobileMenuBtn.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      mobileDrawer.classList.add('open');
      drawerBackdrop.classList.add('open');
      mobileMenuBtn.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', toggleMobileMenu);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('open');
      mobileMenuBtn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ============================================================
  // NÖMRƏ KOPYALAMA DÜYMƏLƏRİ
  // ============================================================
  const copyButtons = document.querySelectorAll('.copy-phone-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const numberToCopy = btn.getAttribute('data-copy');
      if (numberToCopy && navigator.clipboard) {
        navigator.clipboard.writeText(numberToCopy).then(() => {
          showToast(`Kopyalandı: ${numberToCopy}`);
        }).catch(() => {
          showToast(`Nömrə: ${numberToCopy}`);
        });
      }
    });
  });

  // ============================================================
  // NAVİQASİYA SCROLL VƏ AKTİV LİNK
  // ============================================================
  const sections = document.querySelectorAll('section[id]');
  const bottomBarActions = document.querySelectorAll('.bottom-bar-action');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    bottomBarActions.forEach(action => {
      const href = action.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        if (targetId === current) {
          action.classList.add('active');
        } else {
          action.classList.remove('active');
        }
      }
    });
  });
});
