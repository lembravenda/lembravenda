#!/bin/bash
# Resolve conflitos do rebase mantendo o design system v2 local
set -e
cd "$(dirname "$0")"

echo "🔧 Resolvendo conflitos — mantendo v2 Calor Profissional"
echo "─────────────────────────────────────────────────────────"

# Em rebase: --theirs = nosso commit sendo aplicado (v2 local)
CONFLICTED=(
  "src/app/app/clientes/error.tsx"
  "src/app/app/clientes/loading.tsx"
  "src/app/app/clientes/page.tsx"
  "src/app/app/hoje/page.tsx"
  "src/app/app/pedidos/[orderId]/page.tsx"
  "src/app/globals.css"
  "src/app/layout.tsx"
  "src/app/onboarding/page.tsx"
  "src/app/page.tsx"
  "src/components/app-shell.tsx"
  "src/components/customer-form.tsx"
  "src/components/ui.tsx"
  "tailwind.config.ts"
)

for f in "${CONFLICTED[@]}"; do
  git checkout --theirs "$f"
  git add "$f"
  echo "  ✓ $f"
done

echo ""
echo "Continuando rebase..."
GIT_EDITOR=true git rebase --continue

echo ""
echo "Fazendo push..."
git push origin main

echo ""
echo "✅ Deploy concluído! Vercel detectará e fará o build automaticamente."
echo "   Acompanhe em: https://vercel.com/dashboard"
