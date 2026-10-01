// /admin/login sayfası AdminShell'in dışında render olmalı.
// Bu dosya yalnızca /admin/login için ayrı bir layout sağlar
// ve AdminShell sidebar'ını bypass eder.
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
