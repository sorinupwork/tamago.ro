type ResetPasswordEmailProps = {
  resetUrl: string;
};

export function ResetPasswordEmail({ resetUrl }: ResetPasswordEmailProps) {
  return (
    <div>
      <h1>Resetează-ți Parola</h1>
      <p>Ai solicitat resetarea parolei pentru contul tău Tamago. Apasă link-ul de mai jos pentru a reseta parola:</p>
      <a href={resetUrl} style={{ color: '#007bff', textDecoration: 'none' }}>
        Resetează Parola
      </a>
      <p>Dacă nu ai solicitat asta, ignoră acest email.</p>
      <p>
        Cu respect,
        <br />
        Echipa Tamago
      </p>
    </div>
  );
}
