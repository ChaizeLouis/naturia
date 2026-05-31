#!/bin/bash
echo "🌿 Tests Naturia — $(date)"
echo "================================"

URL="https://naturia.tony-bara1.workers.dev"

# Test 1: Site accessible
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L "$URL" --max-time 15)
if [ "$STATUS" = "200" ]; then
    echo "✅ Site accessible (HTTP $STATUS)"
else
    echo "❌ Site inaccessible (HTTP $STATUS)"
fi

# Test 2: Contenu correct
CONTENT=$(curl -s -L "$URL" --max-time 15)
if echo "$CONTENT" | grep -q "Naturia"; then
    echo "✅ Titre Naturia présent"
else
    echo "❌ Titre Naturia absent"
fi

if echo "$CONTENT" | grep -q "_next/static"; then
    echo "✅ Scripts React chargés"
else
    echo "❌ Scripts React absents"
fi

echo "================================"
echo "Tests terminés"
