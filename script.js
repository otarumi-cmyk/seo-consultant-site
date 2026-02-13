/**
 * タカセ＠SEO LP - Animations & Form
 */

(function () {
  'use strict';

  // ===== Scroll Progress =====
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', function () {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / h) * 100;
      scrollProgress.style.transform = 'scaleX(' + scrolled / 100 + ')';
    });
  }

  // ===== Header Scroll =====
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ===== Count-up Animation =====
  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // ===== Intersection Observer for Animations =====
  const observerOptions = {
    rootMargin: '-5% 0px -5% 0px',
    threshold: 0
  };

  const animateObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');

        const counters = entry.target.querySelectorAll('.counter');
        counters.forEach(function (c) {
          animateCount(c);
        });
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-animate]').forEach(function (el) {
    animateObserver.observe(el);
  });

  // Hero counters (run once when hero is visible)
  var heroAnimated = false;
  var heroObserver = new IntersectionObserver(function (entries) {
    if (heroAnimated) return;
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        heroAnimated = true;
        entry.target.querySelectorAll('.counter').forEach(animateCount);
      }
    });
  }, { threshold: 0.3 });

  var heroInner = document.querySelector('.hero-inner');
  if (heroInner) {
    heroObserver.observe(heroInner);
  }

  // ===== Card Tilt Effect =====
  document.querySelectorAll('[data-tilt]').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      var tiltX = (y - 0.5) * 6;
      var tiltY = (x - 0.5) * -6;
      card.style.transform = 'perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(-8px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });
})();

// ===== Form =====
(function () {
  const form = document.getElementById('inquiry-form');
  const submitBtn = document.getElementById('submit-btn');

  if (!form || !submitBtn) return;

  const requiredFields = [
    { id: 'company', errorId: 'company-error' },
    { id: 'name', errorId: 'name-error' },
    { id: 'email', errorId: 'email-error' },
    { id: 'message', errorId: 'message-error' },
    { id: 'privacy', errorId: 'privacy-error' }
  ];

  function showError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    if (field && errorEl) {
      field.classList.add('error');
      errorEl.textContent = message;
    }
  }

  function clearError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    if (field && errorEl) {
      field.classList.remove('error');
      errorEl.textContent = '';
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateForm() {
    let isValid = true;

    requiredFields.forEach(function (item) {
      const field = document.getElementById(item.id);
      const errorEl = document.getElementById(item.errorId);
      if (!field || !errorEl) return;

      const value = field.type === 'checkbox' ? field.checked : field.value.trim();
      clearError(item.id, item.errorId);

      if (item.id === 'privacy') {
        if (!value) {
          showError(item.id, item.errorId, 'プライバシーポリシーへの同意が必要です');
          isValid = false;
        }
        return;
      }

      if (!value) {
        const labels = { company: '会社名', name: 'お名前', email: 'メールアドレス', message: 'お問い合わせ内容' };
        showError(item.id, item.errorId, labels[item.id] + 'を入力してください');
        isValid = false;
      } else if (item.id === 'email' && !validateEmail(value)) {
        showError(item.id, item.errorId, '有効なメールアドレスを入力してください');
        isValid = false;
      }
    });

    return isValid;
  }

  function setSubmitting(submitting) {
    submitBtn.disabled = submitting;
    var textEl = submitBtn.querySelector('.submit-text');
    if (textEl) textEl.textContent = submitting ? '送信中...' : '送信する';
  }

  form.addEventListener('submit', function (e) {
    if (!validateForm()) {
      e.preventDefault();
      var firstError = document.querySelector('.form-row .error, .form-row input.error, .form-row textarea.error');
      if (firstError) {
        firstError.closest('.form-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setSubmitting(true);
    // 通常のPOST送信（FormSubmitでメール送信後、_nextにリダイレクト）
  });

  requiredFields.forEach(function (item) {
    const field = document.getElementById(item.id);
    if (field) {
      field.addEventListener('blur', function () {
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();
        if (value && item.id === 'email' && !validateEmail(value)) {
          showError(item.id, item.errorId, '有効なメールアドレスを入力してください');
        } else if (value) {
          clearError(item.id, item.errorId);
        }
      });
      field.addEventListener('input', function () {
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();
        if (value) clearError(item.id, item.errorId);
      });
    }
  });
})();

// ===== Modal =====
function closeModal() {
  document.getElementById('success-modal').classList.add('hidden');
  if (typeof history !== 'undefined' && history.replaceState) {
    history.replaceState(null, '', window.location.pathname);
  }
}

// 送信後のリダイレクトで戻ってきたときに完了モーダルを表示
if (window.location.search.indexOf('sent=1') !== -1) {
  var modal = document.getElementById('success-modal');
  if (modal) modal.classList.remove('hidden');
}

document.getElementById('success-modal')?.addEventListener('click', function (e) {
  if (e.target === this || e.target.classList.contains('modal-backdrop')) {
    closeModal();
  }
});
