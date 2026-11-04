package br.gov.betim.esporte.config;

import br.gov.betim.esporte.model.QuadraHorto;
import br.gov.betim.esporte.repository.QuadraHortoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class HortoSeeder implements CommandLineRunner {
    private final QuadraHortoRepository quadras;

    public HortoSeeder(QuadraHortoRepository quadras) { this.quadras = quadras; }

    @Override
    public void run(String... args) {
        for (int numero = 1; numero <= 7; numero++) {
            QuadraHorto quadra = quadras.findById(numero).orElse(null);
            if (quadra == null) quadra = new QuadraHorto(numero);
            quadra.definirCaracteristicas(numero >= 6 ? "AREIA" : "QUADRA", numero == 1);
            quadras.save(quadra);
        }
    }
}
