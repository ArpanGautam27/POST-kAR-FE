# Spring Boot Static Resource Configuration

## Issues Fixed in Frontend Build

1. ✅ Removed `X-Frame-Options` from HTML meta tag (must be set via HTTP header)
2. ✅ Fixed circular dependency in Vite chunk splitting
3. ✅ Updated video preload links to use supported `as="fetch"` instead of `as="video"`

## Required Spring Boot Configuration

### 1. Security Configuration for Static Resources

Add this to your Spring Security configuration class:

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                // Allow access to static resources
                .requestMatchers(
                    "/",
                    "/index.html",
                    "/assets/**",
                    "/favicon.ico",
                    "/favicon-*.png",
                    "/apple-touch-icon.png",
                    "/android-chrome-*.png",
                    "/site.webmanifest",
                    "/robots.txt",
                    "/sitemap.xml"
                ).permitAll()
                // Require authentication for API endpoints
                .requestMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
            )
            .headers(headers -> headers
                // Set security headers via HTTP (not meta tags)
                .frameOptions(frame -> frame.deny())
                .xssProtection(xss -> xss.headerValue("1; mode=block"))
                .contentTypeOptions(contentType -> contentType.disable())
            );
        
        return http.build();
    }
}
```

### 2. Static Resource Handler Configuration

Add this configuration to serve React SPA properly:

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static resources from /static folder
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        
                        // If resource exists, return it
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        
                        // For SPA routing: if resource doesn't exist and it's not an API call,
                        // return index.html to let React Router handle it
                        if (!resourcePath.startsWith("api/")) {
                            return new ClassPathResource("/static/index.html");
                        }
                        
                        return null;
                    }
                });
    }
}
```

### 3. CORS Configuration (if API is on different domain)

If your API needs CORS support:

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*"); // In production, specify exact origins
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
```

### 4. Application Properties

Add to `application.properties` or `application.yml`:

```properties
# Static resource configuration
spring.web.resources.static-locations=classpath:/static/
spring.web.resources.cache.period=31536000
spring.web.resources.chain.strategy.content.enabled=true
spring.web.resources.chain.strategy.content.paths=/**

# Compression
server.compression.enabled=true
server.compression.mime-types=text/html,text/xml,text/plain,text/css,text/javascript,application/javascript,application/json

# Error handling - don't show Whitelabel error page for SPA
server.error.whitelabel.enabled=false
```

## Deployment Steps

### 1. Build the React Frontend

```bash
npm run build
```

This creates the `dist` folder with optimized production files.

### 2. Copy to Spring Boot

Copy the contents of the `dist` folder to your Spring Boot project's `src/main/resources/static` directory:

```bash
# Windows PowerShell
Copy-Item -Path "dist\*" -Destination "path\to\springboot\src\main\resources\static\" -Recurse -Force

# Linux/Mac
cp -r dist/* path/to/springboot/src/main/resources/static/
```

### 3. Build Spring Boot

```bash
mvn clean package
# or
./mvnw clean package
```

### 4. Run the Application

```bash
java -jar target/your-app-name.jar
```

## Testing

1. **Access the app**: `http://localhost:8080`
2. **Check static resources**: `http://localhost:8080/assets/js/index-[hash].js`
3. **Test SPA routing**: Navigate to `/products`, `/scanner`, etc. - should work without 404
4. **Check API**: `http://localhost:8080/api/v1/products`

## Troubleshooting

### Issue: 401 on static resources
**Solution**: Ensure SecurityConfig permits all static resource paths

### Issue: 404 on React routes
**Solution**: Verify PathResourceResolver returns index.html for non-API routes

### Issue: MIME type errors
**Solution**: Ensure files are served with correct Content-Type headers

### Issue: Blank page
**Solution**: 
- Check browser console for errors
- Verify `base: '/'` in vite.config.ts
- Ensure all assets are in the static folder
- Check that API URLs in `.env.production` match your backend

## Environment Variables

The React app uses these environment variables (set in `.env.production`):

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_VERSION=v1
VITE_ENABLE_MOCK_DATA=false
```

Make sure your Spring Boot API matches these URLs, or update the `.env.production` file before building.
