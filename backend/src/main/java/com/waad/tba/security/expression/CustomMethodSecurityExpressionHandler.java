package com.waad.tba.security.expression;

import com.waad.tba.security.evaluator.CustomPermissionEvaluator;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.stereotype.Component;

/**
 * Custom MethodSecurityExpressionHandler that integrates our custom permission evaluator
 */
@Component
public class CustomMethodSecurityExpressionHandler extends DefaultMethodSecurityExpressionHandler {

    public CustomMethodSecurityExpressionHandler(CustomPermissionEvaluator permissionEvaluator) {
        setPermissionEvaluator(permissionEvaluator);
    }
}