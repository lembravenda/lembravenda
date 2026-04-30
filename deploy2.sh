#!/bin/bash
# LembraVenda — Restaura workflow + deploy limpo
# Execute: bash deploy2.sh
set -e
cd "$(dirname "$0")"

echo "🚀 LembraVenda — Restaurando workflow + deploy limpo"
echo "────────────────────────────────────────────────────"

# Remove lock se existir
if [ -f .git/index.lock ]; then
  rm -f .git/index.lock
  echo "  ✓ lock removido"
fi

git add -A

git commit -m "ci: restaurar workflow GH Actions + npm ci + Node 22

- Confirma que GH Actions é o mecanismo de deploy (integração nativa
  Vercel não pega pushes de wsmagalhaes@gmail.com automaticamente)
- Troca node-version 20 → 22 (LTS atual)
- Adiciona 'npm ci' antes do build (garante dependencies limpas)
- globals.css com timestamp 2026-04-30 (força novo hash CSS no CDN)"

git push origin main

echo ""
echo "✅ Push concluído! GitHub Actions vai rodar o build."
echo "   Acompanhe em: https://github.com/lembravenda/lembravenda/actions"
echo "   Produção:     https://lembravenda.vercel.app"
echo ""
echo "⚠️  IMPORTANTE: O workflow requer o secret VERCEL_TOKEN no GitHub."
echo "   Se o Actions falhar com 'Error: VERCEL_TOKEN is undefined':"
echo "   → https://github.com/lembravenda/lembravenda/settings/secrets/actions"
echo "   → New repository secret → Name: VERCEL_TOKEN"
echo "   → Value: rode 'vercel login' no terminal e copie o token de"
echo "     ~/.config/vercel/auth.json (campo 'token')"
