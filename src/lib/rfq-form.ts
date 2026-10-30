import { ALLOWED_EXTENSIONS, EMAIL_RE, MAX_TOTAL_BYTES, DIVISIONS, extensionOf, makeReference } from './rfq/rules';

const MB = 1024 * 1024;

export function initRfqForm() {
  const form = document.querySelector<HTMLFormElement>('[data-rfq-form]');
  if (!form) return;
  form.noValidate = true;

  const $ = <T extends Element>(sel: string) => form.querySelector<T>(sel)!;
  const summary = $<HTMLElement>('[data-error-summary]');
  const summaryList = $<HTMLUListElement>('[data-error-list]');
  const status = $<HTMLElement>('[data-status]');
  const sendError = $<HTMLElement>('[data-send-error]');
  const submit = $<HTMLButtonElement>('[data-submit]');
  const filesError = $<HTMLElement>('[data-files-error]');
  const quantities = $<HTMLTextAreaElement>('#quantities');
  const quantitiesReq = $<HTMLElement>('[data-quantities-req]');

  // Division can be preselected with ?division=government|contractor|commercial
  const division = new URLSearchParams(location.search).get('division');
  if (division && division in DIVISIONS) {
    const radio = form.querySelector<HTMLInputElement>(`input[name="division"][value="${division}"]`);
    if (radio) radio.checked = true;
  }

  /* Line items repeater, serialised into one hidden field */
  const lines = $<HTMLElement>('[data-line-items]');
  const body = $<HTMLTableSectionElement>('[data-lines-body]');
  const template = $<HTMLTemplateElement>('[data-line-template]');
  const linesField = $<HTMLInputElement>('[data-line-items-field]');
  lines.hidden = false;

  const rows = () => Array.from(body.querySelectorAll('tr'));
  const lineValues = () =>
    rows()
      .map((tr) => ({
        item: tr.querySelector<HTMLInputElement>('[data-col="item"]')!.value.trim(),
        qty: tr.querySelector<HTMLInputElement>('[data-col="qty"]')!.value.trim(),
        unit: tr.querySelector<HTMLInputElement>('[data-col="unit"]')!.value.trim(),
      }))
      .filter((l) => l.item || l.qty);

  const renumber = () => {
    rows().forEach((tr, i) => {
      const n = String(i + 1).padStart(2, '0');
      tr.querySelector('.lines__num')!.textContent = n;
      tr.querySelector('[data-col="item"]')!.setAttribute('aria-label', `Line ${n} item`);
      tr.querySelector('[data-col="qty"]')!.setAttribute('aria-label', `Line ${n} quantity`);
      tr.querySelector('[data-col="unit"]')!.setAttribute('aria-label', `Line ${n} unit`);
      tr.querySelector('[data-remove-line]')!.setAttribute('aria-label', `Remove line ${n}`);
    });
  };
  const syncLines = () => {
    const complete = lineValues().filter((l) => l.item && l.qty);
    linesField.value = lineValues()
      .map((l, i) => `${i + 1}. ${l.item} | Qty: ${l.qty || '?'} ${l.unit || ''}`.trim())
      .join('\n');
    const needQuantities = complete.length === 0;
    quantities.required = needQuantities;
    quantitiesReq.hidden = !needQuantities;
  };
  const addLine = (focus = true) => {
    body.append(template.content.cloneNode(true));
    renumber();
    if (focus) rows().at(-1)?.querySelector<HTMLInputElement>('input')?.focus();
  };
  $<HTMLButtonElement>('[data-add-line]').addEventListener('click', () => addLine());
  body.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('[data-remove-line]');
    if (!btn) return;
    btn.closest('tr')!.remove();
    renumber();
    syncLines();
    $<HTMLButtonElement>('[data-add-line]').focus();
  });
  body.addEventListener('input', syncLines);
  addLine(false);

  /* Validation */
  const fileInputs = Array.from(form.querySelectorAll<HTMLInputElement>('[data-file]'));
  const checkFiles = (): string => {
    let total = 0;
    for (const input of fileInputs) {
      const file = input.files?.[0];
      if (!file) continue;
      if (!ALLOWED_EXTENSIONS.includes(extensionOf(file.name))) {
        return `"${file.name}" is not an accepted file type. Use PDF, Word, Excel or CSV.`;
      }
      total += file.size;
    }
    if (total > MAX_TOTAL_BYTES) {
      return `Your files add up to ${(total / MB).toFixed(1)} MB, over the 8 MB limit. For larger files, submit the form and we will send you a secure upload link.`;
    }
    return '';
  };
  fileInputs.forEach((input) =>
    input.addEventListener('change', () => {
      const msg = checkFiles();
      filesError.textContent = msg;
      filesError.hidden = !msg;
      fileInputs.forEach((i) => i.setAttribute('aria-invalid', String(!!msg && !!i.files?.length)));
    })
  );

  const labelFor = (el: HTMLInputElement | HTMLTextAreaElement) => {
    const label = form.querySelector(`label[for="${el.id}"]`) ?? el.closest('label');
    return (label?.firstChild?.textContent ?? el.name).trim();
  };

  const messageFor = (el: HTMLInputElement | HTMLTextAreaElement): string => {
    const value = el.value.trim();
    if (el.type === 'checkbox' && !(el as HTMLInputElement).checked) {
      return el.name === 'privacy_consent'
        ? 'Agree to the Privacy Policy so we can process your request.'
        : 'Confirm that the submission contains no classified, CUI or export-controlled information.';
    }
    if (el.type === 'checkbox') return '';
    if (el.required && !value) {
      if (el.name === 'quantities') return 'Enter the required quantities, or add line items above.';
      return `Enter the ${labelFor(el).toLowerCase()}.`;
    }
    if (el.name === 'email' && value && !EMAIL_RE.test(value)) return 'Enter an email address in the format name@organization.gov.';
    return '';
  };

  const clearError = (el: Element) => {
    el.removeAttribute('aria-invalid');
    const field = el.closest('.field');
    field?.querySelector('.field__error[data-generated]')?.remove();
    const describedBy = (el.getAttribute('aria-describedby') ?? '').split(' ').filter((id) => !id.endsWith('-error'));
    if (describedBy.length) el.setAttribute('aria-describedby', describedBy.join(' '));
    else el.removeAttribute('aria-describedby');
  };
  const showError = (el: HTMLInputElement | HTMLTextAreaElement, msg: string) => {
    const field = el.closest('.field')!;
    const id = `${el.name}-error`;
    const p = document.createElement('p');
    p.className = 'field__error';
    p.id = id;
    p.dataset.generated = '';
    p.textContent = msg;
    if (el.type === 'checkbox') field.append(p);
    else el.before(p);
    el.setAttribute('aria-invalid', 'true');
    el.setAttribute('aria-describedby', `${el.getAttribute('aria-describedby') ?? ''} ${id}`.trim());
  };

  const validate = () => {
    syncLines();
    const errors: { el: HTMLElement; msg: string }[] = [];
    const controls = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input[name]:not([type=hidden]):not([type=file]):not([type=radio]):not([name=bot-field]), textarea[name]'
    );
    controls.forEach((el) => {
      clearError(el);
      const msg = messageFor(el);
      if (msg) {
        showError(el, msg);
        errors.push({ el, msg });
      }
    });
    const fileMsg = checkFiles();
    filesError.textContent = fileMsg;
    filesError.hidden = !fileMsg;
    if (fileMsg) errors.push({ el: fileInputs[0], msg: fileMsg });

    summaryList.replaceChildren(
      ...errors.map(({ el, msg }) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${el.id || el.closest('.field')?.querySelector('input')?.id || ''}`;
        a.textContent = msg;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          el.focus();
        });
        li.append(a);
        return li;
      })
    );
    summary.hidden = errors.length === 0;
    return errors.length === 0;
  };

  form.addEventListener('input', (e) => {
    const el = e.target as HTMLInputElement;
    if (el.getAttribute('aria-invalid') === 'true' && el.type !== 'file' && !messageFor(el)) clearError(el);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    sendError.hidden = true;
    if (!validate()) {
      summary.focus();
      return;
    }

    const reference = makeReference();
    $<HTMLInputElement>('[data-reference]').value = reference;

    submit.disabled = true;
    status.textContent = 'Sending your RFQ and documents…';

    try {
      const data = new FormData(form);
      // Line item rows are captured in the hidden line_items field only.
      const res = await fetch('/', { method: 'POST', body: data });
      if (!res.ok) throw new Error(String(res.status));
      try { sessionStorage.setItem('exron-rfq-ref', reference); } catch { /* storage unavailable */ }
      location.assign(`/submit-rfq/received/?ref=${encodeURIComponent(reference)}`);
    } catch {
      submit.disabled = false;
      status.textContent = '';
      sendError.hidden = false;
      sendError.focus?.();
    }
  });
}
