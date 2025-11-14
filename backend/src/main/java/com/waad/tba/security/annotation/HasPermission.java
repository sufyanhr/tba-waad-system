package com.waad.tba.security.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Custom annotation to check for specific permissions on methods
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface HasPermission {
    /**
     * The permission name required to access the annotated method/class
     * @return permission name
     */
    String value();
    
    /**
     * Optional description of what this permission controls
     * @return description
     */
    String description() default "";
}