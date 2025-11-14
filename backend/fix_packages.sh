#!/bin/bash

# تحديث ملفات modules/employers
find src/main/java/com/waad/tba/modules/employers -name "*.java" -exec sed -i 's/package com\.waad\.tba\.model;/package com.waad.tba.modules.employers.model;/g' {} \;
find src/main/java/com/waad/tba/modules/employers -name "*.java" -exec sed -i 's/package com\.waad\.tba\.repository;/package com.waad.tba.modules.employers.repository;/g' {} \;
find src/main/java/com/waad/tba/modules/employers -name "*.java" -exec sed -i 's/package com\.waad\.tba\.service;/package com.waad.tba.modules.employers.service;/g' {} \;
find src/main/java/com/waad/tba/modules/employers -name "*.java" -exec sed -i 's/package com\.waad\.tba\.controller;/package com.waad.tba.modules.employers.controller;/g' {} \;

# تحديث ملفات modules/members
find src/main/java/com/waad/tba/modules/members -name "*.java" -exec sed -i 's/package com\.waad\.tba\.model;/package com.waad.tba.modules.members.model;/g' {} \;
find src/main/java/com/waad/tba/modules/members -name "*.java" -exec sed -i 's/package com\.waad\.tba\.repository;/package com.waad.tba.modules.members.repository;/g' {} \;
find src/main/java/com/waad/tba/modules/members -name "*.java" -exec sed -i 's/package com\.waad\.tba\.service;/package com.waad.tba.modules.members.service;/g' {} \;
find src/main/java/com/waad/tba/modules/members -name "*.java" -exec sed -i 's/package com\.waad\.tba\.controller;/package com.waad.tba.modules.members.controller;/g' {} \;

# تحديث ملفات modules/insurance
find src/main/java/com/waad/tba/modules/insurance -name "*.java" -exec sed -i 's/package com\.waad\.tba\.model;/package com.waad.tba.modules.insurance.model;/g' {} \;
find src/main/java/com/waad/tba/modules/insurance -name "*.java" -exec sed -i 's/package com\.waad\.tba\.repository;/package com.waad.tba.modules.insurance.repository;/g' {} \;
find src/main/java/com/waad/tba/modules/insurance -name "*.java" -exec sed -i 's/package com\.waad\.tba\.service;/package com.waad.tba.modules.insurance.service;/g' {} \;
find src/main/java/com/waad/tba/modules/insurance -name "*.java" -exec sed -i 's/package com\.waad\.tba\.controller;/package com.waad.tba.modules.insurance.controller;/g' {} \;

# تحديث ملفات modules/providers
find src/main/java/com/waad/tba/modules/providers -name "*.java" -exec sed -i 's/package com\.waad\.tba\.model;/package com.waad.tba.modules.providers.model;/g' {} \;
find src/main/java/com/waad/tba/modules/providers -name "*.java" -exec sed -i 's/package com\.waad\.tba\.repository;/package com.waad.tba.modules.providers.repository;/g' {} \;
find src/main/java/com/waad/tba/modules/providers -name "*.java" -exec sed -i 's/package com\.waad\.tba\.service;/package com.waad.tba.modules.providers.service;/g' {} \;
find src/main/java/com/waad/tba/modules/providers -name "*.java" -exec sed -i 's/package com\.waad\.tba\.controller;/package com.waad.tba.modules.providers.controller;/g' {} \;

# تحديث ملفات modules/claims
find src/main/java/com/waad/tba/modules/claims -name "*.java" -exec sed -i 's/package com\.waad\.tba\.model;/package com.waad.tba.modules.claims.model;/g' {} \;
find src/main/java/com/waad/tba/modules/claims -name "*.java" -exec sed -i 's/package com\.waad\.tba\.repository;/package com.waad.tba.modules.claims.repository;/g' {} \;
find src/main/java/com/waad/tba/modules/claims -name "*.java" -exec sed -i 's/package com\.waad\.tba\.service;/package com.waad.tba.modules.claims.service;/g' {} \;
find src/main/java/com/waad/tba/modules/claims -name "*.java" -exec sed -i 's/package com\.waad\.tba\.controller;/package com.waad.tba.modules.claims.controller;/g' {} \;

# تحديث ملفات modules/finance
find src/main/java/com/waad/tba/modules/finance -name "*.java" -exec sed -i 's/package com\.waad\.tba\.model;/package com.waad.tba.modules.finance.model;/g' {} \;
find src/main/java/com/waad/tba/modules/finance -name "*.java" -exec sed -i 's/package com\.waad\.tba\.repository;/package com.waad.tba.modules.finance.repository;/g' {} \;
find src/main/java/com/waad/tba/modules/finance -name "*.java" -exec sed -i 's/package com\.waad\.tba\.service;/package com.waad.tba.modules.finance.service;/g' {} \;
find src/main/java/com/waad/tba/modules/finance -name "*.java" -exec sed -i 's/package com\.waad\.tba\.controller;/package com.waad.tba.modules.finance.controller;/g' {} \;

# تحديث ملفات modules/reports
find src/main/java/com/waad/tba/modules/reports -name "*.java" -exec sed -i 's/package com\.waad\.tba\.model;/package com.waad.tba.modules.reports.model;/g' {} \;
find src/main/java/com/waad/tba/modules/reports -name "*.java" -exec sed -i 's/package com\.waad\.tba\.repository;/package com.waad.tba.modules.reports.repository;/g' {} \;
find src/main/java/com/waad/tba/modules/reports -name "*.java" -exec sed -i 's/package com\.waad\.tba\.service;/package com.waad.tba.modules.reports.service;/g' {} \;
find src/main/java/com/waad/tba/modules/reports -name "*.java" -exec sed -i 's/package com\.waad\.tba\.controller;/package com.waad.tba.modules.reports.controller;/g' {} \;

# تحديث ملفات modules/settings
find src/main/java/com/waad/tba/modules/settings -name "*.java" -exec sed -i 's/package com\.waad\.tba\.model;/package com.waad.tba.modules.settings.model;/g' {} \;
find src/main/java/com/waad/tba/modules/settings -name "*.java" -exec sed -i 's/package com\.waad\.tba\.repository;/package com.waad.tba.modules.settings.repository;/g' {} \;
find src/main/java/com/waad/tba/modules/settings -name "*.java" -exec sed -i 's/package com\.waad\.tba\.service;/package com.waad.tba.modules.settings.service;/g' {} \;
find src/main/java/com/waad/tba/modules/settings -name "*.java" -exec sed -i 's/package com\.waad\.tba\.controller;/package com.waad.tba.modules.settings.controller;/g' {} \;

echo "Package declarations updated!"