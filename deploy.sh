#!/bin/bash
# LembraVenda — Deploy Calor Profissional v2 + Docs
# Execute: bash deploy.sh

set -e
cd "$(dirname "$0")"

echo "🚀 LembraVenda — Deploy v2 Calor Profissional"
echo "───────────────────────────────────────────────"

# Remove lock file se existir
if [ -f .git/index.lock ]; then
  echo "⚠️  Removendo git lock file..."
  rm -f .git/index.lock
fi

# Stage all changes
git add -A

# Commit
git commit -m "design+docs: Calor Profissional v2 — redesign completo + docs atualizados

Design System v2:
- Paleta: verde-floresta #2E7D57, âmbar #F5A623, pedra-quente #F5F0E8
- Instrument Serif como font-display (logo wordmark)
- Bottom nav: Liquid Glass, pill âmbar, ícones solid/outline
- Hero Hoje: gradiente #2E7D57 → #1A5C3E → #134830 + orb âmbar
- CSS tokens: --lv-amber, --lv-whatsapp, --lv-shadow-amber
- Botões: lv-button-amber, lv-button-whatsapp, lv-button-cta

Features:
- PWA: icon-192, icon-512, apple-touch-icon, manifest atualizado
- Analytics: Vercel Analytics + PostHog instrumentados
- Feedback link nas Configurações

Linguagem neutra PT-BR:
- Todos os arquivos .tsx e .ts revisados
- Todos os docs/ revisados (PRD, USER_STORIES, ARCHITECTURE, ICP, etc.)
- package.json: nome atualizado para 'lembravenda'

Docs:
- ROADMAP.md: V2 marcado com concluídos, V3 atualizado
- ANALYTICS_EVENTS.md: status atualizado para implementado
- TONE_OF_VOICE.md: exemplos com linguagem neutra
- VISUAL_IDENTITY_BRIEF.md: reflte o estado real do v2
- ARCHITECTURE.md: implementações de abril 2026 documentadas
- QA_REPORT_2026-04-30.md: relatório do redesign v2"

# Push
git push origin main

echo ""
echo "✅ Push concluído! Vercel detectará e fará o deploy automaticamente."
echo "   Acompanhe em: https://vercel.com/dashboard"
