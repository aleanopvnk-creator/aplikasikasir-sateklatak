/**
 * In-App Notification & Confirmation Dialog System
 * Sate Klatak Mbak Lala POS
 * Menggantikan alert() dan confirm() browser standar dengan UI interaktif & menarik
 */

class NotificationManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (!document.getElementById('posToastContainer')) {
      this.container = document.createElement('div');
      this.container.id = 'posToastContainer';
      this.container.className = 'pos-toast-container';
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('posToastContainer');
    }
  }

  show({ type = 'success', title = '', message = '', duration = 3500 }) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `pos-toast pos-toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
      if (window.sound) sound.playSuccess();
    } else if (type === 'warning') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
      if (window.sound) sound.playTap();
    } else if (type === 'error' || type === 'danger') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
      if (window.sound) sound.playRemove();
    } else {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
      if (window.sound) sound.playTap();
    }

    toast.innerHTML = `
      <div class="pos-toast-icon-box">${iconSvg}</div>
      <div class="pos-toast-body">
        ${title ? `<div class="pos-toast-title">${title}</div>` : ''}
        <div class="pos-toast-msg">${message}</div>
      </div>
      <button class="pos-toast-close-btn" title="Tutup">&times;</button>
      <div class="pos-toast-bar" style="animation-duration: ${duration}ms;"></div>
    `;

    const closeBtn = toast.querySelector('.pos-toast-close-btn');
    let isRemoved = false;
    const removeToast = () => {
      if (isRemoved) return;
      isRemoved = true;
      toast.classList.add('pos-toast-leaving');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 260);
    };

    closeBtn.addEventListener('click', removeToast);

    this.container.appendChild(toast);

    if (duration > 0) {
      setTimeout(removeToast, duration);
    }
  }

  success(message, title = 'Berhasil') {
    this.show({ type: 'success', title, message });
  }

  warning(message, title = 'Peringatan') {
    this.show({ type: 'warning', title, message });
  }

  error(message, title = 'Perhatian') {
    this.show({ type: 'error', title, message });
  }

  info(message, title = 'Informasi') {
    this.show({ type: 'info', title, message });
  }

  // Dialog Konfirmasi In-App (Pengganti confirm() browser)
  confirm({
    title = 'Konfirmasi Tindakan',
    message = 'Apakah Anda yakin ingin melanjutkan?',
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    type = 'danger'
  }) {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'pos-confirm-overlay active';

      let iconSvg = '';
      let btnClass = 'pos-confirm-btn-danger';
      if (type === 'danger') {
        iconSvg = `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
      } else {
        iconSvg = `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
        btnClass = 'pos-confirm-btn-primary';
      }

      modal.innerHTML = `
        <div class="pos-confirm-card">
          <div class="pos-confirm-icon-wrapper ${type === 'danger' ? 'danger-pulse' : ''}">${iconSvg}</div>
          <h3 class="pos-confirm-heading">${title}</h3>
          <p class="pos-confirm-text">${message}</p>
          <div class="pos-confirm-footer">
            <button class="pos-confirm-btn-cancel">${cancelText}</button>
            <button class="${btnClass}">${confirmText}</button>
          </div>
        </div>
      `;

      if (window.sound) sound.playTap();

      const cleanup = (answer) => {
        modal.classList.remove('active');
        setTimeout(() => {
          if (modal.parentNode) modal.parentNode.removeChild(modal);
        }, 220);
        resolve(answer);
      };

      modal.querySelector('.pos-confirm-btn-cancel').onclick = () => cleanup(false);
      modal.querySelector(`.${btnClass}`).onclick = () => cleanup(true);
      modal.onclick = (e) => {
        if (e.target === modal) cleanup(false);
      };

      document.body.appendChild(modal);
    });
  }
}

const notify = new NotificationManager();
window.notify = notify;
