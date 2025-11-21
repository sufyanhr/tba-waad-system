#!/bin/bash

echo "🔍 PHASE B VERIFICATION CHECKLIST"
echo "=================================="
echo ""

echo "✅ TBA Pages (6 required):"
ls -1 src/tba/pages/*.jsx 2>/dev/null | wc -l | xargs -I {} echo "   Found: {} pages"
ls -1 src/tba/pages/*.jsx 2>/dev/null

echo ""
echo "✅ TBA Components (3 required):"
ls -1 src/tba/components/*.jsx 2>/dev/null | wc -l | xargs -I {} echo "   Found: {} components"
ls -1 src/tba/components/*.jsx 2>/dev/null

echo ""
echo "✅ TBA Services (7 required):"
ls -1 src/tba/services/*.js 2>/dev/null | wc -l | xargs -I {} echo "   Found: {} services"
ls -1 src/tba/services/*.js 2>/dev/null

echo ""
echo "✅ Menu Items Updated:"
grep -q "tba/claims" src/menu-items/tba-system.js && echo "   ✓ Claims menu added" || echo "   ✗ Claims menu missing"
grep -q "tba/members" src/menu-items/tba-system.js && echo "   ✓ Members menu added" || echo "   ✗ Members menu missing"
grep -q "tba/visits" src/menu-items/tba-system.js && echo "   ✓ Visits menu added" || echo "   ✗ Visits menu missing"

echo ""
echo "✅ Routes Updated:"
grep -q "TBAClaims" src/routes/MainRoutes.jsx && echo "   ✓ Claims route added" || echo "   ✗ Claims route missing"
grep -q "TBAMembers" src/routes/MainRoutes.jsx && echo "   ✓ Members route added" || echo "   ✗ Members route missing"
grep -q "TBAVisits" src/routes/MainRoutes.jsx && echo "   ✓ Visits route added" || echo "   ✗ Visits route missing"

echo ""
echo "✅ Build Status:"
npm run build 2>&1 | grep -E "(✓.*transformed|✗.*failed)" | tail -2

echo ""
echo "=================================="
echo "✅ PHASE B VERIFICATION COMPLETE"
