#!/bin/bash

# إصلاح providers
find src/main/java/com/waad/tba/modules/providers -name "*.java" -exec sed -i 's/package com\.waad\.tba\.modules\.MODULE\./package com.waad.tba.modules.providers./g' {} \;

# إصلاح members
find src/main/java/com/waad/tba/modules/members -name "*.java" -exec sed -i 's/package com\.waad\.tba\.modules\.MODULE\./package com.waad.tba.modules.members./g' {} \;

# إصلاح insurance
find src/main/java/com/waad/tba/modules/insurance -name "*.java" -exec sed -i 's/package com\.waad\.tba\.modules\.MODULE\./package com.waad.tba.modules.insurance./g' {} \;

# إصلاح claims
find src/main/java/com/waad/tba/modules/claims -name "*.java" -exec sed -i 's/package com\.waad\.tba\.modules\.MODULE\./package com.waad.tba.modules.claims./g' {} \;

# إصلاح finance
find src/main/java/com/waad/tba/modules/finance -name "*.java" -exec sed -i 's/package com\.waad\.tba\.modules\.MODULE\./package com.waad.tba.modules.finance./g' {} \;

# إصلاح reports
find src/main/java/com/waad/tba/modules/reports -name "*.java" -exec sed -i 's/package com\.waad\.tba\.modules\.MODULE\./package com.waad.tba.modules.reports./g' {} \;

# إصلاح settings
find src/main/java/com/waad/tba/modules/settings -name "*.java" -exec sed -i 's/package com\.waad\.tba\.modules\.MODULE\./package com.waad.tba.modules.settings./g' {} \;

echo "Fixed all package declarations!"