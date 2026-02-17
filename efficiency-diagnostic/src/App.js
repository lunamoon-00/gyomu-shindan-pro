import { useState, useMemo } from 'react';
import './App.css';

// 事務時間のうちAIで削減可能と見込む割合（目安）
const AI_REDUCTION_RATE = 0.3;
// お問い合わせフォーム（Formspreeで受信。アドレスはサイトに表示されません）
// https://formspree.io で無料登録し、フォームIDを取得して下の xxxxx を差し替えてください
const FORMSPREE_FORM_ID = 'xnjbdlbn';
const CONTACT_SUBJECT = '業務効率化のご相談';

function App() {
  const [employees, setEmployees] = useState(10);
  const [hourlyWage, setHourlyWage] = useState(1500);
  const [adminHours, setAdminHours] = useState(20);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState(null); // null | 'sending' | 'sent' | 'error'

  const { monthlyReductionHours, annualReductionHours, monthlySavings, annualSavings } = useMemo(() => {
    const totalMonthlyHours = adminHours * employees;
    const monthly = Math.round(totalMonthlyHours * AI_REDUCTION_RATE * 10) / 10;
    const annual = Math.round(monthly * 12 * 10) / 10;
    const monthlySavingsYen = Math.round(monthly * hourlyWage);
    const annualSavingsYen = Math.round(annual * hourlyWage);
    return {
      monthlyReductionHours: monthly,
      annualReductionHours: annual,
      monthlySavings: monthlySavingsYen,
      annualSavings: annualSavingsYen,
    };
  }, [employees, hourlyWage, adminHours]);

  return (
    <div className="app">
      <header className="header">
        <h1>業務効率化診断 Pro</h1>
        <p className="subtitle">従業員数・時給・事務時間からAI削減可能時間と金額を試算</p>
      </header>

      <main className="main">
        <section className="card input-card">
          <h2>入力項目</h2>
          <div className="form-group">
            <label>従業員数（人）</label>
            <input
              type="number"
              min="1"
              max="9999"
              value={employees}
              onChange={e => setEmployees(Number(e.target.value) || 1)}
            />
          </div>
          <div className="form-group">
            <label>平均時給（円/時間）</label>
            <input
              type="number"
              min="0"
              step="100"
              value={hourlyWage}
              onChange={e => setHourlyWage(Number(e.target.value) || 0)}
            />
          </div>
          <div className="form-group">
            <label>事務時間（時間/人・月）</label>
            <input
              type="number"
              min="0"
              max="200"
              value={adminHours}
              onChange={e => setAdminHours(Number(e.target.value) || 0)}
            />
          </div>
        </section>

        <section className="card result-card">
          <h2>試算結果</h2>
          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">AI削減可能時間（月間）</span>
              <span className="result-value">{monthlyReductionHours.toLocaleString()} 時間</span>
            </div>
            <div className="result-item">
              <span className="result-label">AI削減可能時間（年間）</span>
              <span className="result-value">{annualReductionHours.toLocaleString()} 時間</span>
            </div>
            <div className="result-item">
              <span className="result-label">削減金額（月間）</span>
              <span className="result-value highlight">¥{monthlySavings.toLocaleString()}</span>
            </div>
            <div className="result-item">
              <span className="result-label">削減金額（年間）</span>
              <span className="result-value highlight">¥{annualSavings.toLocaleString()}</span>
            </div>
          </div>
        </section>

        <section className="card contact-card">
          <h2>業務効率化を希望される方</h2>
          <p className="contact-text">ご相談・お問い合わせは下のフォームから送信できます。お客様のメールアドレスは当方にのみ表示され、サイト上には一切表示されません。</p>
          {contactStatus === 'sent' ? (
            <div className="contact-success">
              <p>送信しました。ご連絡ありがとうございます。</p>
            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (contactStatus === 'sending') return;
                if (FORMSPREE_FORM_ID === 'xxxxx') {
                  setContactStatus('error');
                  return;
                }
                setContactStatus('sending');
                // 隠しiframeにPOSTするのでCORSの影響を受けず、確実に送信できる
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;
                form.target = 'formspree-hidden-frame';
                form.style.display = 'none';
                const fields = [
                  ['_subject', CONTACT_SUBJECT],
                  ['name', contactName],
                  ['_replyto', contactEmail],
                  ['message', contactMessage],
                ];
                fields.forEach(([name, value]) => {
                  const input = document.createElement('input');
                  input.type = 'hidden';
                  input.name = name;
                  input.value = value;
                  form.appendChild(input);
                });
                document.body.appendChild(form);
                form.submit();
                form.remove();
                setContactStatus('sent');
                setContactName('');
                setContactEmail('');
                setContactMessage('');
              }}
            >
              <div className="form-group">
                <label>お名前</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="山田 太郎"
                  required
                />
              </div>
              <div className="form-group">
                <label>メールアドレス</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>お問い合わせ内容</label>
                <textarea
                  value={contactMessage}
                  onChange={e => setContactMessage(e.target.value)}
                  placeholder="ご用件・ご質問をご記入ください"
                  rows={4}
                  required
                />
              </div>
              {contactStatus === 'error' && (
                <p className="contact-error">
                  {FORMSPREE_FORM_ID === 'xxxxx'
                    ? '送信先が未設定です。App.js の FORMSPREE_FORM_ID を、Formspreeで取得したフォームIDに変更してください。'
                    : '送信に失敗しました。しばらくしてから再度お試しください。'}
                </p>
              )}
              <button
                type="submit"
                className="mail-button mail-button-primary"
                disabled={contactStatus === 'sending'}
              >
                {contactStatus === 'sending' ? '送信中…' : '送信する'}
              </button>
            </form>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>業務効率化診断 Pro — 事務時間の約30%をAIで削減可能とした試算です</p>
        <p className="privacy-note">当サイトではサービス向上のためGoogle Analyticsを使用しています。データは匿名で収集され、個人を特定する情報は含まれません。</p>
      </footer>
      <iframe name="formspree-hidden-frame" title="formspree" style={{ display: 'none' }} />
    </div>
  );
}

export default App;
