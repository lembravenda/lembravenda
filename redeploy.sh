#!/bin/bash
# LembraVenda — Force clean redeploy via Vercel native integration
# Execute: bash redeploy.sh
#
# O que faz:
#  1. Remove o workflow GitHub Actions (evita conflito com a integração nativa Vercel)
#  2. Commita globals.css com cache-bust (novo hash de CSS garante CDN limpa)
#  3. Push → Vercel native integration faz build limpo do source
set -e
cd "$(dirname "$0")"

echo "🚀 LembraVenda — Redeploy limpo (Vercel native)"
echo "─────────────────────────────────────────────────"

# Remove git lock se existir
if [ -f .git/index.lock ]; then
  echo "⚠️  Removendo git lock..."
  rm -f .git/index.lock
fi

# 1. Remove o workflow que concorria com a integração nativa do Vercel
if [ -f .github/workflows/deploy.yml ]; then
  rm -f .github/workflows/deploy.yml
  echo "  ✓ .github/workflows/deploy.yml removido"
else
  echo "  — workflow já não existe"
fi

# Limpa diretórios vazios
rmdir .github/workflows 2>/dev/null || true
rmdir .github 2>/dev/null || true

# 2. Stage tudo
git add -A

# 3. Commit
git commit -m "fix: remove GH Actions workflow + force CSS cache-bust for clean deploy

- Remove .github/workflows/deploy.yml para eliminar conflito entre
  GitHub Actions (vercel deploy --prebuilt) e integração nativa Vercel.
  Agora apenas a integração nativa do Vercel faz deploy (build limpo).
- Atualiza comentário em globals.css para forçar novo hash CSS no CDN.

Design system v2 Calor Profissional permanece intacto."

# 4. Push
git push origin main

echo ""
echo "✅ Push concluído!"
echo "   Vercel irá fazer um build limpo de src/ — aguarde ~2 min."
echo "   Acompanhe: https://vercel.com/lembravenda-7878s-projects/lembravenda"
echo ""
echo "   URL produção: https://lembravenda.vercel.app"
