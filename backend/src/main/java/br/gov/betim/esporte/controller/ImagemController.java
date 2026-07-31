package br.gov.betim.esporte.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/imagens")
public class ImagemController {

    private static final Set<String> EXTENSOES_PERMITIDAS = Set.of("jpg", "jpeg", "png", "webp", "gif");
    private static final long TAMANHO_MAXIMO = 20L * 1024 * 1024;

    private final Path uploadDir;

    public ImagemController(@Value("${app.upload.imagens.dir}") String uploadDir) throws IOException {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(this.uploadDir);
    }

    @GetMapping
    public List<String> listar() throws IOException {
        try (var stream = Files.list(uploadDir)) {
            return stream
                    .filter(Files::isRegularFile)
                    .map(path -> path.getFileName().toString())
                    .filter(nome -> !nome.startsWith("."))
                    .sorted()
                    .toList();
        }
    }

    @GetMapping("/exibindo")
    public List<String> listarExibindo() throws IOException {
        Path exibindoDir = uploadDir.resolve("Exibindo");
        if (!Files.isDirectory(exibindoDir)) {
            return List.of();
        }
        try (var stream = Files.list(exibindoDir)) {
            return stream
                    .filter(Files::isRegularFile)
                    .map(path -> path.getFileName().toString())
                    .filter(nome -> !nome.startsWith("."))
                    .sorted()
                    .toList();
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> upload(@RequestParam("arquivo") MultipartFile arquivo) throws IOException {
        if (arquivo.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Arquivo vazio.");
        }
        if (arquivo.getSize() > TAMANHO_MAXIMO) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Arquivo maior que 20MB.");
        }

        String nomeOriginal = arquivo.getOriginalFilename() == null ? "" : arquivo.getOriginalFilename();
        String nomeArquivo = Paths.get(nomeOriginal).getFileName().toString();
        String extensao = nomeArquivo.contains(".")
                ? nomeArquivo.substring(nomeArquivo.lastIndexOf('.') + 1).toLowerCase()
                : "";

        if (!EXTENSOES_PERMITIDAS.contains(extensao)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Formato nao permitido. Use: " + EXTENSOES_PERMITIDAS);
        }

        String nomeSanitizado = nomeArquivo.replaceAll("[^a-zA-Z0-9._-]", "_");
        Path destino = uploadDir.resolve(nomeSanitizado).normalize();
        if (!destino.startsWith(uploadDir)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome de arquivo invalido.");
        }

        arquivo.transferTo(destino);
        return Map.of("arquivo", nomeSanitizado);
    }
}
