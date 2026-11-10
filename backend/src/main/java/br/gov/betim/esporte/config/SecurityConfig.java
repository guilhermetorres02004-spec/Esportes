package br.gov.betim.esporte.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.http.HttpStatus;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF desabilitado: API é consumida via fetch/JS por páginas estáticas,
                // sem suporte a token CSRF nelas ainda. Mitigado por CORS restrito a
                // origens conhecidas + cookie de sessão SameSite=Lax (padrão do Spring).
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET,
                                "/api/eventos/**",
                                "/api/noticias/**",
                                "/api/modalidades/**",
                                "/api/locais-esportivos/**",
                                "/api/fotos/**",
                                "/api/conquistas/**",
                                "/api/imagens/exibindo").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/inscricoes", "/api/suporte/mensagens").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/suporte/status").permitAll()
                        .requestMatchers("/api/auth/me").permitAll()
                        .requestMatchers("/api/horto/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/fotos/atualizar").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/conquistas/atualizar").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .formLogin(form -> form
                        .loginProcessingUrl("/login")
                        .successHandler((request, response, authentication) -> response.setStatus(HttpStatus.OK.value()))
                        .failureHandler((request, response, exception) -> response.sendError(HttpStatus.UNAUTHORIZED.value()))
                        .permitAll())
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessHandler((request, response, authentication) -> response.setStatus(HttpStatus.OK.value())))
                .exceptionHandling(handling -> handling
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));

        return http.build();
    }
}
